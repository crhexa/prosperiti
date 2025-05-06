from haystack import Document
from haystack.document_stores.in_memory import InMemoryDocumentStore
from haystack.components.embedders import SentenceTransformersDocumentEmbedder
from haystack.components.writers import DocumentWriter
from haystack.document_stores.types import DuplicatePolicy
from data.GmapWrapper import PlaceRetriever
from data.MeetupWrapper import EventRetriever


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
    def __init__(self, model, k=10):
        self.store = InMemoryDocumentStore()
        self.writer = DocumentWriter(document_store=self.store, policy=DuplicatePolicy.SKIP)
        self.embed = SentenceTransformersDocumentEmbedder(model=model, progress_bar=False)
        self.embed.warm_up()
        self.k = k

    def indexPlaces(self, query, location):
        '''Calls the Google Places API to index queried places at a given location as Haystack Documents.

        Params:
        -------
        query    : str
        location : dict[str, float]

        Return:
        -------
        docs : list[Document]
        '''
        # Reset document store
        # self.store = InMemoryDocumentStore()
        places = PlaceRetriever()
        docs = []
        n_docs = 0
        for place in places.getPlaces(query, location):
            loc = place["geometry"]["location"]
            name = place.get("name", "")
            address = place.get("formatted_address", "")
            price_level = place.get("price_level", 0)
            rating = place.get("rating", 0)
            tags = place.get("types", [])
            site = place.get("website", "")
            doc = Document(content=name, meta={
                "type": 0,
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

        if n_docs == 0:
            return 0

        # self.store.write_documents(self.embed.run(docs)["documents"])
        self.writer.run(self.embed.run(docs)["documents"])
        return n_docs

    def indexEvents(self, query, location):
        '''Calls the Meetup API to index queried events at a given location as Haystack Documents.

        Params:
        -------
        query    : str
        location : dict[str, float]

        Return:
        -------
        docs : list[Document]
        '''
        # Reset document store
        # self.store = InMemoryDocumentStore()
        events = EventRetriever()
        docs = []
        ndocs = 0

        for event in events.getEvents(query, location['lat'], location['lng']):
            name = event.get("title", "")
            desc = event.get("description", "")
            date = event.get("dateTime", "")
            try:
                group = event['group']['name']
            except KeyError:
                group = ""
            url = event.get("eventUrl", "")

            doc = Document(content=desc, meta={
                "type": 1,
                "name": name,
                "location": location,
                "group": group,
                "date": date,
                "desc": desc,
                "site": url,
            })

            docs.append(doc)
            ndocs += 1
            if ndocs > self.k:
                break

        if not ndocs:
            return

        # self.store.write_documents(self.embed.run(docs)["documents"])
        self.writer.run(self.embed.run(docs)["documents"])
        return ndocs

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
    dataPipe = DataPipeline("all-MiniLM-L6-v2")
    loc = {
        "lat": 40.7218,
        "lng": -74.0060
    }
    dataPipe.indexEvents("sports", loc)
    results = dataPipe.getDocuments()
    print(results)
