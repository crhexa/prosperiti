# LLM Inference Component

## Technical Specifications
- Web Framework: [FastAPI](https://github.com/fastapi/fastapi)
- Inference Backend: [Ollama](https://github.com/ollama/ollama)
- Inference Model: [Phi-3.5-mini-instruct-GGUF](https://huggingface.co/bartowski/Phi-3.5-mini-instruct-GGUF) \(Q4_K_M 2390 MB or Q4_K_S 2190 MB\)
- Embedding Model: [all-MiniLM-L6-v2](https://www.sbert.net/docs/sentence_transformer/pretrained_models.html) \(80 MB\)
- Pipeline Framework: [Haystack](https://github.com/deepset-ai/haystack)
- Vector Document Store: [pgvector](https://github.com/pgvector/pgvector)
