import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [userInput, setUserInput] = useState("");
  const [budget, setBudget] = useState(0);
  const [serverResponse, setServerResponse] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [locations, setLocations] = useState([]); // Stores multiple locations

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/process-input", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput, budget }),
      });

      const data = await response.json();
      setServerResponse(data.response);
      setLocations(data.locations || []); // Expecting multiple locations
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode", darkMode);
  };

  useEffect(() => {
    if (locations.length > 0) {
      locations.forEach((location, index) => {
        renderMap(location.lat, location.lng, `map-${index}`);
      });
    }
  }, [locations]);

  const renderMap = (lat, lng, mapId) => {
    if (!window.google || !window.google.maps) {
      console.error("Google Maps API not loaded.");
      return;
    }

    const mapOptions = {
      center: { lat, lng },
      zoom: 20,
    };

    const newMap = new window.google.maps.Map(document.getElementById(mapId), mapOptions);

    new window.google.maps.Marker({
      position: { lat, lng },
      map: newMap,
    });
  };

  return (
    <div id="app-main">
      <h1>Prosperiti</h1>
      <h2>AI Personal Planner Assistant</h2>
      <div className="card">
        <form id="user-search-form" onSubmit={handleSubmit}>
          <label htmlFor="user-input-entry">
            <i>I'm looking for:</i>
          </label>
          <input
            type="text"
            id="user-input-entry"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <label htmlFor="budget">
            <i>On a budget of:</i>
          </label>
          <input
            type="number"
            id="budget"
            name="budget"
            min="0"
            max="100000"
            onChange={(e) => setBudget(e.target.value)}
          />
          <br />
          <button type="submit">Search</button>
        </form>
        <span id="response">
          {serverResponse && <div className="response">{serverResponse}</div>}
        </span>

        {locations.map((location, index) => (
          <div key={index} className="map-container">
            <h3>{location.name}</h3>
            <div id={`map-${index}`} style={{ width: "100%", height: "400px" }}></div>
          </div>
        ))}
      </div>
      <button className="toggle-themes-button" onClick={toggleDarkMode}>
        {darkMode ? "☾" : "☼"}
      </button>
    </div>
  );
}

export default App;
