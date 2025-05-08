import express from 'express';
import cors from 'cors';
import axios from 'axios';
import 'dotenv/config';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('build'));

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

let currLocations = [];

function getDistanceInKm(lat1, lng1, lat2, lng2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

app.post("/api/process-input", async (req, res) => {
  const { userInput, budget, userAddress, searchArea, data } = req.body;
  const budget2 = ["Free","$","$$","$$$","$$$$"][budget];
  if (!userInput || !budget || !userAddress || !searchArea) {
    return res.status(400).json({
      error: "Missing required fields: userInput, budget, userAddress, or searchArea.",
    });
  }
  console.log("regex time...")
  const addressRegex = /\b\d{1,6}\s(?:[A-Za-z0-9.,'-]+\s){0,6}[A-Za-z0-9.,'-]+(?:,\s*| in\s+)[A-Za-z\s]+,\s*[A-Z]{2}(?:\s*\d{5}(?:-\d{4})?)?\b/;
  let address = "";
  let isMatch = false;
  const match = data.response.match(addressRegex);
  if (match) {
    address = match[0];
    isMatch = true;
    console.log("Address found:", address);
  } else {
    console.log("No address found.");
  }
  try {
    const geoRes = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
      params: { address: userAddress, key: API_KEY },
    });
    if (geoRes.data.status !== "OK" || geoRes.data.results.length === 0) {
      return res.status(400).json({ error: "Invalid user address. Please check and try again." });
    }
    const userCoords = geoRes.data.results[0].geometry.location;
    const locations = [];
    if(isMatch){
      const geoResp = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
        params: { address: address, key: API_KEY },
      });
      const newLocation = {
        name: geoResp.data.results[0].formatted_address,
        description: `For your search of ${userInput}`,
        price: `${budget2}`
      };
      if(!(currLocations.some((obj) => obj.name === newLocation.name))){
        currLocations.push(newLocation);
      }
    }
    for (const loc of currLocations) {
      const geoResp = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
        params: { address: loc.name, key: API_KEY },
      });

      if (geoResp.data.status !== "OK" || geoResp.data.results.length === 0) {
        continue;
      }

      const geo = geoResp.data.results[0].geometry.location;
      const distance = getDistanceInKm(userCoords.lat, userCoords.lng, geo.lat, geo.lng);

      if (distance > parseFloat(searchArea)) {
        continue;
      }

      const roundedDst = Math.round(distance * 100) / 100;

      locations.push({
        name: geoResp.data.results[0].formatted_address,
        lat: geo.lat,
        lng: geo.lng,
        description: loc.description,
        distance: roundedDst,
        price: loc.price,
      });
    }

    res.json({
      response: `You're looking for: ${userInput}. Your budget: $${budget}. Here are some options within ${searchArea} km:`,
      locations,
    });
  } catch (error) {
    console.error("Unexpected error:", error.message || error);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
