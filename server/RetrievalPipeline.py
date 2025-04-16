from haystack import Document
from haystack.document_stores.in_memory import InMemoryDocumentStore
from data.GmapWrapper import PlaceRetriever

import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ------------------- Retrieval Class ------------------- #

class Retriever:
    '''
    Class encapsulating retrieval functionality.
    '''
    def __init__(self, k=5):
        self.store = InMemoryDocumentStore(embedding_similarity_function="cosine")

    def indexPlaces(self, query, location, config={}, batch_size=10):
        self.store = InMemoryDocumentStore(embedding_similarity_function="cosine")
        places = PlaceRetriever()
        docs = []
        for place in places.getPlaces(query, location):
            loc = place["geometry"]["location"]
            name = place.get("name", "")
            address = place.get("formatted_address", "")
            price_level = place.get("price_level", None)
            rating = place.get("rating", None)
            tags = place.get("types", [])
            site = place.get("website", "")
            doc = Document(content=name, meta={
                "location": loc,
                "name": name,
                "address": address,
                "price": price_level,
                "rating": rating,
                "tags": tags,
                "site": site,
            })
            docs.append(doc)
        self.store.write_documents(docs)
        return docs

    def indexEvents(self):
        # TODO
        self.store = InMemoryDocumentStore(embedding_similarity_function="cosine")
        pass

    def query(self):
        return self.store.filter_documents(filters={})

if __name__ == "__main__":
    stuff = Retriever()
    loc = {
        "lat": -70.0,
        "lng": 400.0
    }
    stuff.indexPlaces("italian restaurants", loc)
    results = stuff.query()
    print(results)
