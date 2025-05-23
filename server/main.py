from fastapi import FastAPI, Request, Response, status
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

import os, json, time
import http, logging
import pipeline
from pydtypes import GenerationRequest

script_path = os.path.dirname(os.path.abspath(__file__))
favicon_path = os.path.join(script_path, "favicon.ico")

with open(os.path.join(script_path, "config_text.json")) as json_config_text:
    config_text = json.load(json_config_text)

with open(os.path.join(script_path, "config.json")) as json_config:
    config = json.load(json_config)
    VERSION = config["version"]
    MODEL_NAME = config["checkpoint"]
    EMBED_NAME = config["embedding_model"]
    EMBED_DIMS = config["embedding_dimension"]
    THRESHOLD = config["threshold"]
    TOP_K = config["top_k"]

uvicorn_access = logging.getLogger("uvicorn.access")
uvicorn_access.disabled = True
logger = logging.getLogger("uvicorn")
logger.setLevel(logging.getLevelName(logging.DEBUG))

load_dotenv()
app = FastAPI()
llm = pipeline.GenerationPipeline(MODEL_NAME, EMBED_NAME, TOP_K, config_text)

#
@app.get("/")
async def root():
    return {"version": VERSION}


# /generate/{user_id}
@app.post("/generate/")
async def generate(gen_req: GenerationRequest, response: Response):
    if len(gen_req.messages) == 0: # or gen_req.messages[-1].role != "user"
        response.status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
    else:
        try:
            (reply, retrieved, created) = await llm.generate(messages=gen_req.messages, filters=gen_req.filters, threshold=THRESHOLD)
        except Exception as e:
            logger.error(f"Error in /generate/: {e}")
            response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            return {"error": "Internal server error"}
        logger.info(f"generate(): {retrieved} docs retrieved, {created} docs created.")
        return {"response": reply}

app.add_middleware( #allows CORS
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Adapted from https://github.com/roy-pstr/fastapi-custom-exception-handlers-and-logs
@app.middleware("http")
async def log_request_middleware(request: Request, call_next):
    """
    This middleware will log all requests and their processing time.
    E.g. log:
    0.0.0.0:1234 - GET /ping 200 OK 1.00ms
    """
    url = f"{request.url.path}?{request.query_params}" if request.query_params else request.url.path
    start_time = time.time()
    response = await call_next(request)
    process_time = (time.time() - start_time) * 1000
    formatted_process_time = "{0:.2f}".format(process_time)
    host = getattr(getattr(request, "client", None), "host", None)
    port = getattr(getattr(request, "client", None), "port", None)
    try:
        status_phrase = http.HTTPStatus(response.status_code).phrase
    except ValueError:
        status_phrase=""
    logger.info(f'{host}:{port} - "{request.method} {url}" {response.status_code} {status_phrase} {formatted_process_time}ms')
    return response


#
@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return FileResponse(favicon_path)