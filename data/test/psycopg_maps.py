import os
import psycopg2
import googlemaps

db_host = os.environ.get('DB_HOST', 'localhost')
db_port = os.environ.get('DB_PORT', '5432')
db_name = os.environ.get('DB_NAME', 'prosperiti_db')
db_user = os.environ.get('DB_USER', 'admin')
db_password = os.environ.get('DB_PASSWORD', 'password')
API_KEY = 'AIzaSyCwmmFkswgm9WJNhW-L_XO3LCmu5wJde-g'

gmaps = googlemaps.Client(key=API_KEY)

conn = psycopg2.connect(
    host=db_host,
    port=db_port,
    database=db_name,
    user=db_user,
    password=db_password
)
cursor = conn.cursor()


def get_current_location():
    try:
        location_data = gmaps.geolocate()
        return location_data['location']
    except Exception as e:
        print(f"Error obtaining location: {e}")
        return None


def find_nearby_places(location, place_type='point_of_interest', radius=1000):
    try:
        places_result = gmaps.places_nearby(
            location=location,
            radius=radius,
            type=place_type
        )
        return places_result['results']
    except Exception as e:
        print(f"Error finding nearby places: {e}")
        return []


location = get_current_location()
if location:
    print("Current Location:", location)
    nearby_places = find_nearby_places(location)
    print("\nNearby Places of Interest:")
    for place in nearby_places:
        name = place.get("name")
        address = place.get("vicinity", None)  # Address might be absent
        lat = place["geometry"]["location"]["lat"]
        lng = place["geometry"]["location"]["lng"]
        price_level = place.get("price_level", None)
        rating = place.get("rating", None)  # Some places may not have ratings
        tags = place.get("types", [])  # Google API returns types as a list
        try:
            cursor.execute("""
                INSERT INTO places (name, address, lat, lng, price_level, rating, tags)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (name, address, lat, lng, price_level, rating, tags))
            print(f"Inserted: {name}, {address}")
        except Exception as e:
            print(f"Error inserting {name}: {e}")
    conn.commit()
else:
    print("Could not determine location.")

# Close the cursor and connection
cursor.close()
conn.close()
