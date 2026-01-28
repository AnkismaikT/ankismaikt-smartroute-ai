// trackingServer.js
// SmartRoute AI – Customer Live Tracking Agent
// Production-ready for Render & local

import express from "express";

const app = express();

// ✅ FIX: Use Render / cloud assigned port
const PORT = process.env.PORT || 3000;

// ===============================
// MOCK TRIP STORE (replace with DB later)
// ===============================
const trips = {
  "SR-4832": {
    tripId: "SR-4832",
    status: "ON THE WAY",
    origin: "Connaught Place, New Delhi",
    destination: "Cyber Hub, Gurugram",
    currentETA: "38 mins",
    lastDecision: "Auto-rerouted due to high delay risk",
    lastUpdated: new Date().toLocaleString()
  }
};

// ===============================
// CUSTOMER TRACKING PAGE
// ===============================
app.get("/track/:tripId", (req, res) => {
  const { tripId } = req.params;
  const trip = trips[tripId];

  if (!trip) {
    return res.status(404).send("Trip not found");
  }

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Live Tracking – ${trip.tripId}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: #0f172a;
          color: #e5e7eb;
          padding: 20px;
        }
        .card {
          background: #020617;
          border-radius: 12px;
          padding: 20px;
          max-width: 420px;
          margin: auto;
          box-shadow: 0 0 30px rgba(56,189,248,0.2);
        }
        h2 { color: #38bdf8; }
        .label { color: #94a3b8; font-size: 14px; }
        .value { font-size: 16px; margin-bottom: 12px; }
        .eta {
          font-size: 22px;
          color: #22c55e;
          margin-top: 10px;
        }
        .ai {
          font-size: 13px;
          color: #facc15;
          margin-top: 15px;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>🚚 Live Delivery Tracking</h2>

        <div class="label">Trip ID</div>
        <div class="value">${trip.tripId}</div>

        <div class="label">Status</div>
        <div class="value">${trip.status}</div>

        <div class="label">From</div>
        <div class="value">${trip.origin}</div>

        <div class="label">To</div>
        <div class="value">${trip.destination}</div>

        <div class="eta">ETA: ${trip.currentETA}</div>

        <div class="ai">🤖 AI Update: ${trip.lastDecision}</div>
        <div class="label">Last Updated: ${trip.lastUpdated}</div>
      </div>
    </body>
    </html>
  `);
});

// ===============================
// SERVER START
// ===============================
app.listen(PORT, () => {
  console.log(`📡 SmartRoute AI tracking server running on port ${PORT}`);
});

