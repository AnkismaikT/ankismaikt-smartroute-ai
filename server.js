const express = require("express");
const app = express();

app.use(express.static("public"));

/**
 * Simulated live vehicle location (Delhi)
 */
let vehicleLocation = {
  lat: 28.6139,
  lng: 77.2090
};

/**
 * Simulate vehicle movement every 2 seconds
 */
setInterval(() => {
  vehicleLocation.lat += 0.0003;
  vehicleLocation.lng += 0.0003;
}, 2000);

/**
 * API to get live vehicle location
 */
app.get("/api/location", (req, res) => {
  res.json(vehicleLocation);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 AnkismaikT SmartRoute AI running at http://localhost:${PORT}`);
});

