from haystack import Document, Pipeline
from haystack.components.retrievers import FilterRetriever
from haystack.components.writers import DocumentWriter
from haystack.document_stores.types import DuplicatePolicy
from haystack.document_stores.in_memory import InMemoryDocumentStore
from haystack.components.retrievers import InMemoryEmbeddingRetriever
from haystack.components.embedders import SentenceTransformersTextEmbedder, SentenceTransformersDocumentEmbedder
from GmapWrapper import PlaceRetriever

import logging
import re

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ------------------ Pipeline Builders ------------------ #

def indexingPipeline(store):
    indexer = Pipeline()
    indexer.add_component("embedder", SentenceTransformersDocumentEmbedder())
    indexer.add_component("writer", DocumentWriter(store, policy=DuplicatePolicy.SKIP))
    indexer.connect("embedder", "writer")
    return indexer

def queryingPipeline(store, k):
    querier = Pipeline()
    querier.add_component("embedder", SentenceTransformersTextEmbedder())
    querier.add_component("retriever", InMemoryEmbeddingRetriever(document_store=store, top_k=k))
    querier.connect("embedder", "retriever")
    return querier

# ------------------- Retrieval Class ------------------- #

class Retriever:
    '''
    Class encapsulating retrieval functionality.
    '''
    def __init__(self, k=5):
        self.store = InMemoryDocumentStore(embedding_similarity_function="cosine")
        self.indexer = indexingPipeline(self.store)
        self.querier = queryingPipeline(self.store, k)

    def indexPlaces(self, query, location, config={}, batch_size=10):
        self.store = InMemoryDocumentStore(embedding_similarity_function="cosine")

        places = PlaceRetriever()
        batch = []
        for place in places.getPlaces(query, location):
            loc = place["geometry"]["location"]
            name = place.get("name", "")
            address = place.get("formatted_address", "")
            price_level = place.get("price_level", None)
            rating = place.get("rating", None)
            tags = place.get("types", [])

            doc = Document(content=name, meta={
                "location": loc,
                "name": name,
                "address": address,
                "price": price_level,
                "rating": rating,
                "tags": tags
            })

            batch.append(doc)
            if len(batch) >= batch_size:
                logger.info(f"Indexing batch of size {batch_size}")
                self.indexer.run({"embedder": {"documents": batch}})
                batch.clear()
            if batch:
                self.indexer.run({"embedder": {"documents": batch}})

    def query(self, question):
        retriever = FilterRetriever(self.store)
        result = retriever.run({})
        return result["documents"]
