from openai import AsyncOpenAI
from haystack import Pipeline, Document
from haystack.components.writers import DocumentWriter
from haystack.document_stores.in_memory import InMemoryDocumentStore
from haystack.components.retrievers import InMemoryEmbeddingRetriever
from haystack.components.embedders import SentenceTransformersTextEmbedder, SentenceTransformersDocumentEmbedder

from datastore import DataPipeline
from pydtypes import Message

class GenerationPipeline:

    def __init__(self, model: str, embed_name: str, top_k: int, config_text):
        self.db = DataPipeline(embed_name)
        self.config_text = config_text
        self.model = model
        
        # Retrieve prompt text from config_text.json
        self.USER_PROMPT = config_text["prompts"]["user"]
        self.SYSTEM_PROMPT = config_text["prompts"]["system"]
        self.NO_MATCH_RESPONSE = config_text["other"]["no_match_response"]

        self.pipeline = Pipeline()
        self.pipeline.add_component(name="embed", instance=SentenceTransformersTextEmbedder(model=embed_name))
        self.pipeline.add_component(name="retrieve", instance=InMemoryEmbeddingRetriever(document_store=self.db.store, top_k=top_k))
        self.pipeline.connect("embed.embedding", "retrieve.query_embedding")
        self.client = AsyncOpenAI()

        self.pipeline.warm_up()
        self.db.indexPlaces("pizza places", {"lat": 40.745, "lng": -74.035})


    async def generate(self, messages: list[Message], filters, threshold):
        no_docs = 0
        context = "Relevant events and activities:\n"

        query = messages[-1].content

        relevant = self.pipeline.run({"embed": {"text": query}})['retrieve']['documents']
        no_docs = 0
        for doc in relevant:
            if doc.score > threshold:
                no_docs += 1
                context += stringify_doc(doc)
        
        if no_docs <= 0:
            return self.config_text["other"]["no_match_response"]
        
        system = [{"role": "system", "content": self.SYSTEM_PROMPT}]
        user = [{"role": "user", "content": f"{context}\n{self.USER_PROMPT}{query}"}]

        completion = await self.client.chat.completions.create(
            model=self.model,
            messages=system+[{"role": msg.role, "content": msg.content} for msg in messages[:-1]]+user
        )
        if completion.choices[0].message.refusal != None:
            return completion.choices[0].message.refusal
        else:
            return completion.choices[0].message.content


def stringify_doc(doc: Document):
    meta = doc.meta
    string = f"{doc.content}\n"
    string += f"Address: {meta["address"]}\n"       if meta["address"]  != ""   else ""
    string += f"Price: {str(meta["price"])}\n"      if meta["price"]    != None else ""
    string += f"Rating: {str(meta["rating"])}\n"    if meta["rating"]   != None else ""
    string += f"Tags: {str(meta["tags"])}\n"        if meta["tags"]     != []   else ""
    string += f"Website: {meta["site"]}\n"          if meta["site"]     != ""   else ""
    return string
