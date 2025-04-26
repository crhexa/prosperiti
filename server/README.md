# LLM Inference Component

## Technical Specifications
- Web Framework: [FastAPI](https://github.com/fastapi/fastapi)
- Inference Backend: [OpenAI](https://github.com/ollama/ollama)
- Inference Model: [GPT-4o mini](https://openai.com/index/hello-gpt-4o/)
- Vector Embedding Model: [all-MiniLM-L6-v2](https://www.sbert.net/docs/sentence_transformer/pretrained_models.html) \(80 MB\)
- Pipeline Framework: [Haystack](https://github.com/deepset-ai/haystack)

## Setup

1. Create a `.env` file in the server directory: `/server/.env/`
2. In the `.env` file, set `GMAP_API_TOKEN` to a valid Google Maps API key.
3. In the `.env` file, set `MEETUP_API_TOKEN` to a valid Meetup API key.
4. In the `.env` file, set `OPENAI_API_KEY` to a valid OpenAI key.

## Start Server
Run `fastapi dev .\server\main.py`
