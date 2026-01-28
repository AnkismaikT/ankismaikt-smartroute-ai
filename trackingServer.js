// trackingServer.js
// SmartRoute AI – FULL MONOLITH (STABLE VERSION)
// Landing + Dashboard + Tracking + Auto Refresh + AI Text
// One file. One port. No confusion.

import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

/* ======================================================
   DATA STORE (SINGLE SOURCE OF TRUTH)
====================================================== */
const trips = {
  "SR-4832": {
    tripId: "SR-4832",
    status: "ON THE WAY",
    origin: "Connaught Place, New Delhi",
    destination: "Cyber Hub, Gurugram",
    currentETA: "38 mins",
    lastDecision: "Auto-rerouted due to high delay risk",
    lastUpdated: new Date().toLocaleString()
  },
  "SR-9271": {
    tripId: "SR-9271",
    status: "DELAY RISK",
    origin: "Noida Sector 62",
    destination: "IGI Airport, Delhi",
    currentETA: "52 mins",
    lastDecision: "Monitoring congestion",
    lastUpdated: new Date().toLocaleString()
  }
};

/* ======================================================
   SHARED DARK THEME (USED EVERYWHERE)
====================================================== */
const baseStyle = `
body {
  margin: 0;
  font-family: Inter, Arial, sans-serif;
  background: radial-gradient(circle at top, #020617, #000);
  color: #e5e7eb;
}
.center {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card {
  background: #020617;
  padding: 32px;
  border-radius: 18px;
  box-shadow: 0 0 60px rgba(56,189,248,0.25);
}
h1, h2 {
  color: #38bdf8;
  margin-top: 0;
}
.label {
  color: #94a3b8;
  font-size: 13px;
  margin-top: 12px;
}
.value {
  font-size: 15px;
}
.eta {
  font-size: 22px;
  color: #22c55e;
  margin-top: 16px;
}
.ai {
  font-size: 13px;
  color: #facc15;
  margin-top: 14px;
}
.updated {
  font-size: 12px;
  color: #64748b;
}
a {
  display: block;
  margin-top: 12px;
  padding: 12px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  text-align: center;
}
.btn {
  background: linear-gradient(135deg, #38bdf8, #22c55e);
  color: #020617;
}
.btn.secondary {
  background: transparent;
  border: 1px solid #38bdf8;
  color: #38bdf8;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
th, td {
  padding: 12px;
  border-bottom: 1px solid #1e293b;
  font-size: 14px;
  text-align: left;
}
th {
  color: #94a3b8;
}
tr:hover {
  background: #0f172a;
}
`;

/* ======================================================
   ROOT / LANDING PAGE
====================================================== */
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>SmartRoute AI</title>
  <style>${baseStyle}</style>
</head>
<body>
  <div class="center">
    <div class="card" style="width:380px;text-align:center">
      <h1>🚚 SmartRoute AI</h1>
      <div class="value" style="color:#22c55e;margin:16px 0">
        🟢 System Online
      </div>
      <a class="btn" href="/track/SR-4832">View Live Tracking</a>
      <a class="btn secondary" href="/dashboard">Open Dashboard</a>
    </div>
  </div>
</body>
</html>
  `);
});

/* ======================================================
   DASHBOARD (THIS IS WHAT YOU LOST EARLIER)
====================================================== */
app.get("/dashboard", (req, res) => {
  const rows = Object.values(trips).map(t => `
    <tr>
      <td>${t.tripId}</td>
      <td>${t.status}</td>
      <td>${t.origin}</td>
      <td>${t.destination}</td>
      <td style="color:#22c55e">${t.currentETA}</td>
      <td>
        <a href="/track/${t.tripId}" style="color:#38bdf8">
          View →
        </a>
      </td>
    </tr>
  `).join("");

  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Dashboard – SmartRoute AI</title>
  <style>${baseStyle}</style>
</head>
<body>
  <div class="center">
    <div class="card" style="width:900px">
      <h2>🚚 Live Trips Dashboard</h2>
      <table>
        <tr>
          <th>Trip ID</th>
          <th>Status</th>
          <th>From</th>
          <th>To</th>
          <th>ETA</th>
          <th></th>
        </tr>
        ${rows}
      </table>
      <a class="btn secondary" href="/">← Back</a>
    </div>
  </div>
</body>
</html>
  `);
});

/* ======================================================
   API (USED FOR AUTO REFRESH)
====================================================== */
app.get("/api/trip/:tripId", (req, res) => {
  const trip = trips[req.params.tripId];
  if (!trip) {
    return res.status(404).json({ error: "Trip not found" });
  }
  res.json(trip);
});

/* ======================================================
   TRACKING PAGE (LONG, DETAILED, ORIGINAL STYLE)
====================================================== */
app.get("/track/:tripId", (req, res) => {
  const trip = trips[req.params.tripId];
  if (!trip) {
    return res.status(404).send("Trip not found");
  }

  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Live Delivery Tracking</title>
  <style>${baseStyle}</style>
</head>
<body>
  <div class="center">
    <div class="card" style="width:420px">
      <h2>🚚 Live Delivery Tracking</h2>

      <div class="label">Trip ID</div>
      <div class="value">${trip.tripId}</div>

      <div class="label">Status</div>
      <div class="value" id="status">${trip.status}</div>

      <div class="label">From</div>
      <div class="value">${trip.origin}</div>

      <div class="label">To</div>
      <div class="value">${trip.destination}</div>

      <div class="eta" id="eta">
        ETA: ${trip.currentETA}
      </div>

      <div class="ai" id="ai">
        🤖 AI Update: ${trip.lastDecision}
      </div>

      <div class="updated" id="updated">
        Last Updated: ${trip.lastUpdated}
      </div>

      <a class="btn secondary" href="/dashboard">Open Dashboard</a>
    </div>
  </div>

<script>
async function refresh() {
  const res = await fetch("/api/trip/${trip.tripId}");
  const data = await res.json();
  document.getElementById("status").innerText = data.status;
  document.getElementById("eta").innerText = "ETA: " + data.currentETA;
  document.getElementById("ai").innerText =
    "🤖 AI Update: " + data.lastDecision;
  document.getElementById("updated").innerText =
    "Last Updated: " + data.lastUpdated;
}
setInterval(refresh, 5000);
</script>

</body>
</html>
  `);
});

/* ======================================================
   HEALTH
====================================================== */
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    trips: Object.keys(trips).length,
    uptime: Math.floor(process.uptime())
  });
});

/* ======================================================
   START SERVER
====================================================== */
app.listen(PORT, () => {
  console.log(`✅ SmartRoute AI running at http://localhost:${PORT}`);
});

