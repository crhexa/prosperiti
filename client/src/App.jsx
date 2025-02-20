import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function App() {
  const [userInput, setUserInput] = useState("");
  const [budget, setBudget] = useState(0);
  const [serverResponse, setServerResponse] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [locations, setLocations] = useState([]);

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
      setLocations(data.locations || []);
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
    <div
  id="app-main"
  className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white transition-colors duration-300"
>
  <button
    className="absolute top-4 left-4 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition"
    onClick={toggleDarkMode}
  >
    {darkMode ? "☾" : "☼"}
  </button>

  <h1 className="text-4xl font-bold mt-8">Prosperiti</h1>
  <h2 className="text-xl mb-6">AI Personal Planner Assistant</h2>

  <div className="bg-white dark:bg-gray-800 max-w-md w-full p-8 rounded-lg shadow-lg m-5 transition-colors duration-300">
    <form
      id="user-search-form"
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <label htmlFor="user-input-entry" className="font-medium text-gray-700 dark:text-gray-300">
        <i>I'm looking for:</i>
      </label>
      <input
        type="text"
        id="user-input-entry"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      <label htmlFor="budget" className="font-medium text-gray-700 dark:text-gray-300">
        <i>On a budget of:</i>
      </label>
      <input
        type="number"
        id="budget"
        name="budget"
        min="0"
        max="100000"
        onChange={(e) => setBudget(e.target.value)}
        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition font-semibold"
      >
        Search
      </button>
    </form>

    {serverResponse && (
      <div className="mt-4 p-3 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 rounded-lg border-l-4 border-green-500">
        {serverResponse}
      </div>
    )}

    {locations.map((location, index) => (
      <div key={index} className="mt-6">
        <h3 className="text-lg font-semibold">{location.name}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">{location.description}</p>
        <div
          id={`map-${index}`}
          className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"
        ></div>
      </div>
    ))}
  </div>
</div>

  );
}

export default App;
