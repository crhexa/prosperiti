from dotenv import load_dotenv

class EventRetriever:
    def __init__(self):
        load_dotenv()
        self.meetupClient = None

    def getEvents(self):
        return []
