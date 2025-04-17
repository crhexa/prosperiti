# LLM Inference Component

## Technical Specifications
- Web Framework: [FastAPI](https://github.com/fastapi/fastapi)
- Inference Backend: [OpenAI](https://github.com/ollama/ollama)
- Inference Model: [GPT-4o mini](https://openai.com/index/hello-gpt-4o/)
- Vector Embedding Model: [all-MiniLM-L6-v2](https://www.sbert.net/docs/sentence_transformer/pretrained_models.html) \(80 MB\)
- Pipeline Framework: [Haystack](https://github.com/deepset-ai/haystack)

## Setup

Create a `.env` file and set `GMAP_KEY` to a valid Google Maps API key.

## Start Server
Set `OPENAI_API_KEY` in environment variables.
Run `fastapi dev .\server\main.py`
