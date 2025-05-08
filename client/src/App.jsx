import { useState, useEffect, useRef } from "react";
import Chatbox from "./Chatbox.jsx"

const LOC_POST_ADDRESS = 'http://prosperiti.info:3000/api/process-input'
const AI_POST_ADDRESS = 'http://prosperiti.info:8000/generate/'

function App() {
  const [userInput, setUserInput] = useState("");
  const [budget, setBudget] = useState(0);
  const [userAddress, setUserAddress] = useState("");
  const [searchArea, setSearchArea] = useState(10);
  const [serverResponse, setServerResponse] = useState("");
  const [messages, setMessages] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const selectedMarkerRef = useRef(null);
  const searchCircleRef = useRef(null);
  const addressInputRef = useRef(null);

  const defaultIcon = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
  const selectedIcon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);  
    const budget2 = ["Free","Inexpensive","Moderately Expensive","Expensive","Very Expensive"][budget];
    const userMessage = `I'm looking for ${userInput.trim()} in a ${budget2} price range, within ${searchArea}km of ${userAddress.trim()}`;
    setMessages((prev) => [...prev, { origin: "user", message: userMessage }]);
    const formattedMessages = [...messages.map(msg => ({
      role: msg.origin === 'user' ? 'user' : 'system',
      content: msg.message
    })), { role: 'user', content: userMessage }];
    try {
      const response = await fetch(AI_POST_ADDRESS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({messages: formattedMessages}),
      });
      const data = await response.json();
      const loc_response = await fetch(LOC_POST_ADDRESS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput: userInput.trim(), budget, userAddress: userAddress.trim(), searchArea, data }),
      });
      const loc_data = await loc_response.json()

      if (!response.ok) {
        throw new Error(data.error || "Server returned an error.");
      }

      setMessages((prev) =>  [...prev, {origin: 'system', message: data.response || "No response message."}]);
      setLocations(loc_data.locations || []);
    } catch (error) {
      console.error("Fetch error:", error);
      setMessages((prev) =>  [...prev, {origin: 'system', message: `Error: ${error.message}`}]);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (locations.length > 0) {
      renderMap(locations);
    }
  }, [locations]);

  useEffect(() => {
    if (searchCircleRef.current) {
      searchCircleRef.current.setRadius(parseFloat(searchArea) * 1000);
    }
  }, [searchArea]);

  useEffect(() => {
    if (!window.google || !window.google.maps || !addressInputRef.current) return;

    const input = addressInputRef.current;  
    const autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current, {
      types: ['geocode'],
      componentRestrictions: { country: 'us' },
    });
  
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        setUserAddress(place.formatted_address);
      } else if (place.name) {
        setUserAddress(place.name);
      }
    });
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        const suggestionSelected = document.querySelector('.pac-item-selected');
        if (suggestionSelected) {
          e.preventDefault();
        }
      }
    };  
    input.addEventListener('keydown', handleKeyDown);  
    return () => {
      input.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  

  const renderMap = (locations) => {
    if (!window.google || !window.google.maps) {
      console.error("Google Maps API not loaded.");
      return;
    }

    const bounds = new window.google.maps.LatLngBounds();
    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: locations[0],
      zoom: 13,
    });

    mapRef.current = map;
    markersRef.current = [];

    const infoWindow = new window.google.maps.InfoWindow();

    locations.forEach((location, index) => {
      const marker = new window.google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map,
        title: location.name,
        icon: defaultIcon,
        animation: window.google.maps.Animation.DROP,
      });

      marker.addListener("click", () => {
        highlightMarker(index);
      });

      markersRef.current.push(marker);
      bounds.extend(marker.getPosition());
    });

    if (userAddress) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: userAddress }, (results, status) => {
        if (status === "OK" && results[0]) {
          const userLatLng = results[0].geometry.location;

          if (searchCircleRef.current) {
            searchCircleRef.current.setMap(null);
          }

          const circle = new window.google.maps.Circle({
            strokeColor: "#4285F4",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#4285F4",
            fillOpacity: 0.2,
            map: map,
            center: userLatLng,
            radius: parseFloat(searchArea) * 1000,
          });

          searchCircleRef.current = circle;

          bounds.extend(userLatLng);
          map.fitBounds(bounds);
        } else {
          console.error("Geocode error for user address:", status);
        }
      });
    } else {
      map.fitBounds(bounds);
    }
  };

  const highlightMarker = (index) => {
    const marker = markersRef.current[index];
    const map = mapRef.current;

    if (selectedMarkerRef.current) {
      selectedMarkerRef.current.setIcon(defaultIcon);
    }

    marker.setIcon(selectedIcon);
    selectedMarkerRef.current = marker;

    setSelectedIndex(index);

    if (marker && map) {
      map.panTo(marker.getPosition());
      map.setZoom(15);
      marker.setAnimation(window.google.maps.Animation.BOUNCE);
      setTimeout(() => {
        marker.setAnimation(null);
      }, 1400);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white transition-colors duration-300">
      {!messages[0] && 
      <div>
        <h1 className="text-4xl font-bold text-center mt-8">Prosperiti</h1>
        <h2 className="text-xl text-center mb-6">AI Personal Planner Assistant</h2>
      </div>}

      <div className="flex justify-center items-start gap-4 m-5 min-h-[500px] max-h-screen">
        <div className="bg-white dark:bg-gray-800 max-w-md w-full p-8 rounded-lg shadow-lg m-5 transition-colors duration-300">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label htmlFor="user-input-entry" className="font-medium text-gray-700 dark:text-gray-300">
              <i>I'm looking for:</i>
            </label>
            <input
              type="text"
              id="user-input-entry"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full p-3 rounded-lg border bg-gray-100 dark:bg-gray-700"
            />

            <label className="font-medium text-gray-700 dark:text-gray-300">
              <i>Choose your budget:</i>
            </label>
            <div className="flex justify-between gap-2">
              {["$", "$$", "$$$", "$$$$"].map((label, idx) => {
                const value = idx + 1;
                const isSelected = budget === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setBudget(value)}
                    className={`flex-1 p-2 rounded-lg font-semibold border transition-colors duration-200 ${
                      isSelected
                        ? "bg-blue-500 text-white border-blue-700"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <label htmlFor="address" className="font-medium text-gray-700 dark:text-gray-300">
              <i>Insert address or zip code:</i>
            </label>
            <input
              type="text"
              name="search_address"
              id="address"
              ref={addressInputRef}
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
              className="w-full p-3 rounded-lg border bg-gray-100 dark:bg-gray-700"
              autoComplete="on"           
            />

            <label htmlFor="area" className="font-medium text-gray-700 dark:text-gray-300">
              <i>Search radius: {searchArea} km</i>
            </label>
            <input
              type="range"
              id="area"
              min="0.5"
              max="100"
              step="0.5"
              value={searchArea}
              onChange={(e) => setSearchArea(parseFloat(e.target.value))}
              className="w-full"
            />

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition font-semibold"
            >
              Search
            </button>

            {loading && (
              <div className="flex justify-center mt-4">
                <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            )}
          </form>

          {serverResponse && (
            <div className={`mt-4 p-3 rounded-lg border-l-4 ${
              serverResponse.startsWith("Error:")
                ? "bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300 border-red-500"
                : "bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 border-green-500"
            }`}>
              {serverResponse}
            </div>
          )}
        </div>
        
        {messages[0] && <Chatbox messages={messages}/>}  
      </div>

      {locations.length > 0 && (
        <div className="flex justify-center items-center flex-col lg:flex-row w-full max-w-screen px-100 pb-10 gap-6 space-y-6">
          <div className="w-full lg:w-1/3 space-y-4">
            {locations.map((location, index) => (
              <div
                key={index}
                className={`cursor-pointer p-4 rounded-lg shadow transition ${
                  selectedIndex === index
                    ? "bg-blue-50 dark:bg-blue-900 border-2 border-blue-500"
                    : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => highlightMarker(index)}
              >
                <h3 className="text-lg font-semibold">{location.name}</h3>
                <h3 className="text-lg font-semibold">{location.price}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{location.description}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Distance: {location.distance} km</p>
              </div>
            ))}
          </div>

          <div className="w-full lg:w-2/3 h-[500px]">
            <div id="map" className="w-full h-full rounded-lg shadow-lg" />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
