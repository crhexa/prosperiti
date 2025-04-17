from haystack import Document
from haystack.document_stores.in_memory import InMemoryDocumentStore
from data.GmapWrapper import PlaceRetriever

import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ------------------- Retrieval Class ------------------- #

class DataPipeline:
    '''
    Class encapsulating indexing/retrieval functionality.

    Members:
    --------
    store : DocumentStore
    k     : int (default 10)

    Methods:
    --------
    indexPlaces  : index queried places at a given location
    indexEvents  : index queried events at a given location
    getDocuments : return all documents in the document store
    '''
    def __init__(self, k=10):
        self.store = InMemoryDocumentStore()
        self.k = k

    def indexPlaces(self, query, location, radius=1000):
        '''Calls the Google Places API to index queried places at a given location as Haystack Documents.

        Params:
        -------
        query    : str
        location : dict[str, float]
        radius   : int (default 1000)

        Return:
        -------
        docs : list[Document]
        '''
        # Reset document store
        self.store = InMemoryDocumentStore()
        places = PlaceRetriever()
        docs = []
        n_docs = 0
        for place in places.getPlaces(query, location, radius):
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
            n_docs += 1
            if n_docs > self.k:
                break
        self.store.write_documents(docs)
        return docs

    def indexEvents(self):
        '''Calls the Meetup API to index queried events at a given location as Haystack Documents.

        Params:
        -------
        TODO

        Return:
        -------
        docs : list[Document]
        '''
        # Reset document store
        self.store = InMemoryDocumentStore()
        docs = []
        # TODO
        return docs

    def getDocuments(self):
        '''Returns all documents currently in the InMemoryDocumentStore

        Params:
        -------
        None

        Return:
        -------
        docs : list[Documents]
        '''
        return self.store.filter_documents(filters={})

if __name__ == "__main__":
    dataPipe = DataPipeline()
    loc = {
        "lat": -70.0,
        "lng": 400.0
    }
    dataPipe.indexPlaces("italian restaurants", loc)
    results = dataPipe.getDocuments()
    print(results)
