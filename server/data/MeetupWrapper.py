from dotenv import load_dotenv
from datetime import datetime
import os
import requests
import json

class EventRetriever:
    def __init__(self):
        load_dotenv()
        self.meetupClient = os.environ.get('MEETUP_API_TOKEN')
        self.api_url = 'https://api.meetup.com/gql-ext'
        self.headers = {
            'Authorization': f'Bearer {self.meetupClient}',
            'Content-Type': 'application/json'
        }

    def getEvents(self, query, lat, lon, limit=10):
        graphql_query = """
        query($lat: Float!, $lon: Float!, $query: String!) {
            eventSearch(filter: { lat: $lat, lon: $lon, query: $query }, first: 10) {
                totalCount
                pageInfo {
                    endCursor
                }
                edges {
                    node {
                        id
                        title
                        description
                        dateTime
                        eventUrl
                        group {
                            name
                            urlname
                        }
                    }
                }
            }
        }
        """

        variables = {
            'lat': lat,
            'lon': lon,
            'query': query
        }

        try:
            response = requests.post(
                self.api_url,
                headers=self.headers,
                json={'query': graphql_query, 'variables': variables}
            )

            data = response.json()

            events = data['data']['eventSearch']['edges']

            print(f"API returned {len(events)} events")

            return [event['node'] for event in events[:limit]]
        
        except Exception as e:
            print(f"Error searching events: {e}")
            return []
        
def format_datetime(dt_string):
    dt = datetime.fromisoformat(dt_string.replace('Z', '+00:00'))
    return dt.strftime("%A, %B %d, %Y at %I:%M %p")

if __name__ == "__main__":
    retriever = EventRetriever()

    lat, lon = 40.7218, -74.0060 # NY coords; change to whatever
    searchTerm = "sports" # change to whatever
    max_events = 10

    print(f"Searching for {searchTerm} events near ({lat}, {lon})...")
    events = retriever.getEvents(searchTerm, lat, lon, limit=max_events)

    if events:
        print(f"\nFound {len(events)} events:")
        for event in events:
            print(f"\n--- {event['title']} ---")
            print(f"Date: {format_datetime(event['dateTime'])}")
            print(f"Group: {event['group']['name']}")
            print(f"Event URL: {event['eventUrl']}")
    else:
        print("No events found matching the criteria.")
