import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('build')); 

const API_KEY = '';

app.post("/api/process-input", async (req, res) => {
    console.log("Received request with:", req.body);
  
    let userInput = req.body.userInput;
    const budget = req.body.budget;
  
    const defaultLocations = [
      "Planet Fitness, Hoboken, NJ",
      "Crunch Gym, Hoboken, NJ",
      "Fitness Factory, Hoboken, NJ",
    ];
  
    try {
      let locations = [];
  
      for (const location of defaultLocations) {
        const geocodeResponse = await axios.get(
          "https://maps.googleapis.com/maps/api/geocode/json",
          {
            params: { address: location, key: API_KEY },
          }
        );
  
        if (geocodeResponse.data.status === "OK" && geocodeResponse.data.results.length > 0) {
          const locationData = geocodeResponse.data.results[0];
          locations.push({
            name: locationData.formatted_address,
            lat: locationData.geometry.location.lat,
            lng: locationData.geometry.location.lng,
          });
        }
      }
  
      res.json({
        response: `You're looking for: ${userInput}. Your budget: $${budget}. Here are some options:`,
        locations: locations,
      });
    } catch (error) {
      console.error("Error fetching geocoding data:", error.message);
      res.status(500).json({ error: "Failed to fetch location data" });
    }
  });
  
  


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});