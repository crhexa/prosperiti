from typing import Annotated
from fastapi import FastAPI, Query, Request
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

import os, json, time
import http, logging
import pipeline

script_path = os.path.dirname(os.path.abspath(__file__))
favicon_path = os.path.join(script_path, "favicon.ico")

with open(os.path.join(script_path, "config.json")) as json_config:
    config = json.load(json_config)
    VERSION = config["version"]
    MODEL_NAME = config["checkpoint"]
    EMBED_NAME = config["embedding_model"]
    EMBED_DIMS = config["embedding_dimension"]

uvicorn_access = logging.getLogger("uvicorn.access")
uvicorn_access.disabled = True
logger = logging.getLogger("uvicorn")
logger.setLevel(logging.getLevelName(logging.DEBUG))

app = FastAPI()


class GenerationRequest(BaseModel):
    user_prompt : str           = Field(default="What is your name?")
    tags        : list[str]     = []
    # user_auth


#
@app.get("/")
async def root():
    return {"Version": VERSION}


# /generate/{user_id}
@app.post("/generate/")
async def generate(gen_req: Annotated[GenerationRequest, Query()]):
    return {"response": "hi"}


#
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