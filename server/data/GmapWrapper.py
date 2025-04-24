import re
import os
import googlemaps
from dotenv import load_dotenv

class PlaceRetriever:
    def __init__(self):
        load_dotenv()
        self.gmapsClient = googlemaps.Client(key=os.environ['GMAP_API_TOKEN'])

    def getPlaces(self, query, location, radius=1000):
        try:
            call = self.gmapsClient.places(
                query=query,
                location=location,
                radius=radius
            )
            for place in call['results']:
                if place.get("permanently_closed", False):
                    continue
                yield place
        except Exception as e:
            print(f"Error finding nearby places: {e}")
            return []

if __name__ == "__main__":
    pattern = re.compile(r'_+', re.UNICODE)
    def get_current_location(gmaps):
        try:
            location_data = gmaps.geolocate()
            return location_data['location']
        except Exception as e:
            print(f"Error obtaining location: {e}")
            return None

    retriever = PlaceRetriever()
    location = get_current_location(retriever.gmapsClient)
    if location:
        print("Current Location:", location)
        nearby_places = retriever.getPlaces("Italian restaurants", location)

        print("\nNearby Places of Interest:")
        for place in nearby_places:
            id = place["place_id"]
            lat, lng = place["geometry"]["location"]["lat"], place["geometry"]["location"]["lng"]
            name = place.get("name", "")
            address = place.get("formatted_address", "")
            price_level = place.get("price_level", None)
            rating = place.get("rating", None)
            tags = place.get("types", [])
    else:
        print("Could not determine location.")
