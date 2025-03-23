from haystack import Pipeline
# from haystack import pgvector
from haystack.components.embedders import SentenceTransformersTextEmbedder, SentenceTransformersDocumentEmbedder



class GenerationPipeline:


    def __init__(self):
        self.pipeline = new_pipeline()


    def generate():
        pass


def new_database() -> None:
    pass


def new_pipeline(embed_name: str) -> Pipeline:
    pipeline = Pipeline()
    pipeline.add_component(
        name="EMBD", 
        instance=SentenceTransformersTextEmbedder(model=embed_name)
        )
    pipeline.add_component(
        name="EMBD_RET",
        instance=SentenceTransformersTextEmbedder() # pgvector retriever
    )
    pipeline.connect("EMBD.embedding", "EMBD_RET.query_embedding")