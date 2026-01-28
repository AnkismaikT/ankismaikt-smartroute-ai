// autoRerouteAgent.js
// SmartRoute AI – Autonomous Rerouting Decision Agent
// Node.js v18+ (Native fetch supported)

const GOOGLE_API_KEY = "PASTE_YOUR_GOOGLE_MAPS_API_KEY";
const RISK_THRESHOLD = 65;

// ===============================
// CORE AGENT
// ===============================
async function autoRerouteAgent(trip) {
  const {
    tripId,
    origin,
    destination,
    delayRiskPercent
  } = trip;

  console.log(`🚚 Trip ${tripId}`);
  console.log(`📊 Delay Risk: ${delayRiskPercent}%`);

  // 1️⃣ Decision Gate
  if (delayRiskPercent < RISK_THRESHOLD) {
    return {
      action: "CONTINUE",
      reason: "Risk below threshold",
      message: "Continuing current route"
    };
  }

  console.log("⚠️ High risk detected → Evaluating alternate routes");

  // 2️⃣ Fetch alternate routes
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
    origin
  )}&destination=${encodeURIComponent(
    destination
  )}&alternatives=true&key=${GOOGLE_API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  console.log("📡 Google Directions Status:", data.status);

  // 3️⃣ Fail-safe handling
  if (data.status !== "OK" || !data.routes || data.routes.length === 0) {
    return {
      action: "MONITOR",
      reason: "No alternate routes available",
      message: "Continuing current route with high-frequency monitoring"
    };
  }

  // 4️⃣ Select best route (shortest ETA)
  let bestRoute = data.routes[0];

  for (const route of data.routes) {
    if (
      route.legs[0].duration.value <
      bestRoute.legs[0].duration.value
    ) {
      bestRoute = route;
    }
  }

  return {
    action: "REROUTED",
    newRouteSummary: bestRoute.summary || "Unnamed route",
    newETA: bestRoute.legs[0].duration.text,
    distance: bestRoute.legs[0].distance.text,
    message: "Route automatically changed to prevent delay"
  };
}

// ===============================
// TEST RUN (SIMULATED TRIP)
// ===============================
(async () => {
  const demoTrip = {
    tripId: "SR-4832",
    origin: "Connaught Place, New Delhi",
    destination: "Cyber Hub, Gurugram",
    delayRiskPercent: 72
  };

  const result = await autoRerouteAgent(demoTrip);
  console.log("🧠 AGENT OUTPUT ↓");
  console.log(result);
})();

