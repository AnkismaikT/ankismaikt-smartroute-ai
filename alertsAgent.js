// alertsAgent.js
// SmartRoute AI – Alerts & Human Interface Agent

// MOCK alert sender (replace with Twilio / WhatsApp later)
async function sendWhatsAppAlert(to, message) {
  console.log(`📲 WhatsApp sent to ${to}`);
  console.log(`📝 Message: ${message}`);
}

// ===============================
// ALERT DECISION AGENT
// ===============================
async function alertsAgent(trip, rerouteResult) {
  const { tripId, driverName, driverPhone } = trip;

  if (rerouteResult.action === "REROUTED") {
    await sendWhatsAppAlert(
      driverPhone,
      `⚠️ SmartRoute AI Alert\nTrip ${tripId}\nHigh delay risk detected.\nRoute changed automatically.\nNew ETA: ${rerouteResult.newETA}`
    );

    return {
      status: "ALERT_SENT",
      message: "Driver notified of auto-reroute"
    };
  }

  if (rerouteResult.action === "MONITOR") {
    await sendWhatsAppAlert(
      driverPhone,
      `ℹ️ SmartRoute AI Update\nTrip ${tripId}\nHigh delay risk detected.\nNo alternate routes available.\nMonitoring closely.`
    );

    return {
      status: "MONITOR_ALERT_SENT",
      message: "Driver notified – monitoring mode"
    };
  }

  return {
    status: "NO_ALERT",
    message: "No alert required"
  };
}

// ===============================
// TEST RUN
// ===============================
(async () => {
  const trip = {
    tripId: "SR-4832",
    driverName: "Ramesh",
    driverPhone: "+91XXXXXXXXXX"
  };

  const rerouteResult = {
    action: "REROUTED",
    newETA: "38 mins"
  };

  const alertStatus = await alertsAgent(trip, rerouteResult);
  console.log("🔔 ALERT RESULT ↓");
  console.log(alertStatus);
})();

