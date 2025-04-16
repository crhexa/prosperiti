from openai import OpenAI
from haystack import Pipeline
from haystack.components.writers import DocumentWriter
from haystack.document_stores.in_memory import InMemoryDocumentStore
from haystack.components.retrievers import InMemoryEmbeddingRetriever
from haystack.components.embedders import SentenceTransformersTextEmbedder, SentenceTransformersDocumentEmbedder

class GenerationPipeline:

    def __init__(self, model: str, embed_name: str, top_k: int, config_text):
        self.db = InMemoryDocumentStore()
        self.config_text = config_text
        self.model = model
        
        # Retrieve prompt text from config_text.json
        self.USER_PROMPT = config_text["prompts"]["user"]
        self.SYSTEM_PROMPT = config_text["prompts"]["system"]
        self.NO_MATCH_RESPONSE = config_text["other"]["no_match_response"]

        self.indexing = Pipeline()
        self.indexing.add_component(
            name="doc_embed",
            instance=SentenceTransformersDocumentEmbedder(model=embed_name)
        )
        self.indexing.add_component(
            name="doc_write",
            instance=DocumentWriter(document_store=self.db)
        )
        self.indexing.connect("doc_embed", "doc_write")

        self.pipeline = Pipeline()
        self.pipeline.add_component(
            name="embed", 
            instance=SentenceTransformersTextEmbedder(model=embed_name)
        )
        self.pipeline.add_component(
            name="retrieve", 
            instance=InMemoryEmbeddingRetriever(document_store=self.db, top_k=top_k, scale_score=True)
        )
        self.pipeline.connect("embed.embedding", "retrieve.query_embedding")
        self.llm = OpenAI()


    def generate(self, query, filters, threshold):
        no_docs = 0
        context = "Relevant events and activities:\n"

        relevant = self.pipeline.run({"embed": {"text": query, "filters": filters}})['retriever']['documents']
        no_docs = 0
        for doc in relevant:
            if doc.score > threshold:
                no_docs += 1
                context += doc + "\n"
        
        if no_docs <= 0:
            return self.config_text["other"]["no_match_response"]
        
        ## openapi call



    def import_documents(self):
        pass
