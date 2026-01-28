const express = require("express");
const app = express();

app.use(express.static("public"));

/* Simulated live vehicle (Delhi) */
let vehicleLocation = {
  lat: 28.6139,
  lng: 77.2090
};

/* Simulate movement */
setInterval(() => {
  vehicleLocation.lat += 0.00025;
  vehicleLocation.lng += 0.00025;
}, 2000);

/* API for live vehicle location */
app.get("/api/location", (req, res) => {
  res.json(vehicleLocation);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 AnkismaikT SmartRoute AI running at http://localhost:${PORT}`);
});

