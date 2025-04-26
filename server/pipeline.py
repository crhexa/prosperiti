from openai import AsyncOpenAI
from haystack import Pipeline, Document

from haystack.components.retrievers import InMemoryEmbeddingRetriever
from haystack.components.embedders import SentenceTransformersTextEmbedder

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
        self.pipeline.add_component(name="embed", instance=SentenceTransformersTextEmbedder(model=embed_name, progress_bar=False))
        self.pipeline.add_component(name="retrieve", instance=InMemoryEmbeddingRetriever(document_store=self.db.store, top_k=top_k))
        self.pipeline.connect("embed.embedding", "retrieve.query_embedding")
        self.client = AsyncOpenAI()

        self.pipeline.warm_up()


    async def generate(self, messages: list[Message], filters, threshold):
        location = {"lat": 40.745, "lng": -74.035}
        no_docs = no_apid = new_places = new_events = 0
        context = "Relevant events and activities:\n"
        query = messages[-1].content
        
        # Look for documents if they exist
        if self.db.store.count_documents() > 0:
            relevant = self.pipeline.run({"embed": {"text": query}})['retrieve']['documents']
            
            for doc in relevant:
                if doc.score > threshold:
                    no_docs += 1
                    context += stringify_doc(doc)
        
        # Find new documents if they don't
        if no_docs <= 0:
            new_places = self.db.indexPlaces(query, location)
            if new_places <= 0:
                new_events = self.db.indexEvents(query, location)
                if new_events <= 0:
                    return (self.config_text["other"]["no_match_response"], 0, 0)
            no_apid += new_places + new_events
            
            relevant = self.pipeline.run({"embed": {"text": query}})['retrieve']['documents']
            for doc in relevant:
                if doc.score > threshold:
                    no_docs += 1
                    context += stringify_doc(doc)
        
        system = [{"role": "system", "content": self.SYSTEM_PROMPT}]
        user = [{"role": "user", "content": f"{context}\n{self.USER_PROMPT}{query}"}]
        
        # Generate OpenAI chat completion
        completion = await self.client.chat.completions.create(
            model=self.model,
            messages=system+[{"role": msg.role, "content": msg.content} for msg in messages[:-1]]+user
        )
        if completion.choices[0].message.refusal != None:
            return (completion.choices[0].message.refusal, no_docs, no_apid)
        else:
            return (completion.choices[0].message.content, no_docs, no_apid)


def stringify_doc(doc: Document):
    meta = doc.meta
    if meta["type"] == 0:   # Place
        string = f"Place Name: {doc.content}\n"
        string += f"Address: {meta["address"]}\n"           if meta["address"]  != ""   else ""
        string += f"Price: {price_map(meta["price"])}\n"    if meta["price"]    != None else ""
        string += f"Rating: {str(meta["rating"])}\n"        if meta["rating"]   != None else ""
        string += f"Tags: {str(meta["tags"])}\n"            if meta["tags"]     != []   else ""
        string += f"Website: {meta["site"]}\n"              if meta["site"]     != ""   else ""
        return string

    else:                   # Event
        string = f"Event Name: {meta["name"]}\n"            if meta["name"]     != ""   else ""
        string += f"Event Description: {doc.content}\n"
        string += f"Group: {meta["group"]}\n"               if meta["group"]    != ""   else ""
        string += f"Date: {meta["date"]}\n"                 if meta["date"]     != ""   else ""
        string += f"Website: {meta["site"]}\n"              if meta["site"]     != ""   else ""


def price_map(price : int) -> str:
    if price <= 0:
        return "Free"
    if price == 1:
        return "($) Inexpensive"
    if price == 2:
        return "($$) Moderately Expensive"
    if price == 3:
        return "($$$) Expensive"
    else:
        return "($$$$) Very Expensive"
