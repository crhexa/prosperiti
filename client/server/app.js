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
        {
          name: "Planet Fitness, Hoboken, NJ",
          description: "24/7 access gym that, with memberships starting at $15/mo, easily fitting your budget",
        },
        {
          name: "Crunch Fitness, Hoboken, NJ",
          description: "More premium option, with memberships starting at $93.75/mo, stretching your budget a bit more",
        },
        {
          name: "Fitness Factory, Hoboken, NJ",
          description: "A mid-range option, with memberships starting at $59.99/mo",
        },
      ];
  
    try {
      let locations = [];
  
      for (const loc of defaultLocations) {
        const geocodeResponse = await axios.get(
          "https://maps.googleapis.com/maps/api/geocode/json",
          {
            params: { address: loc.name, key: process.env.GOOGLE_MAPS_API_KEY },
          }
        );
  
        if (geocodeResponse.data.status === "OK" && geocodeResponse.data.results.length > 0) {
          const locationData = geocodeResponse.data.results[0];
          locations.push({
            name: locationData.formatted_address,
            lat: locationData.geometry.location.lat,
            lng: locationData.geometry.location.lng,
            description: loc.description,
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