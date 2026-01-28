let map;
let marker;
let directionsService;
let directionsRenderer;

const start = { lat: 28.6139, lng: 77.2090 }; // Delhi
const end   = { lat: 28.7041, lng: 77.1025 }; // Destination

function initMap() {
  console.log("✅ Map + Traffic initialized");

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: start
  });

  // Traffic layer
  const trafficLayer = new google.maps.TrafficLayer();
  trafficLayer.setMap(map);

  // Live vehicle marker
  marker = new google.maps.Marker({
    position: start,
    map: map,
    title: "AnkismaikT Live Vehicle"
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    map: map,
    suppressMarkers: false
  });

  calculateRouteWithTraffic();

  // Live movement
  setInterval(updateVehicleLocation, 2000);
}

function calculateRouteWithTraffic() {
  directionsService.route(
    {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING,
      drivingOptions: {
        departureTime: new Date(), // 👈 THIS ENABLES TRAFFIC
        trafficModel: "bestguess"
      }
    },
    (result, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(result);

        const leg = result.routes[0].legs[0];

        const normalTime = leg.duration.text;
        const trafficTime = leg.duration_in_traffic
          ? leg.duration_in_traffic.text
          : "N/A";

        console.log("📏 Distance:", leg.distance.text);
        console.log("⏱ Normal ETA:", normalTime);
        console.log("🚦 Traffic ETA:", trafficTime);

        showDelayStatus(leg.duration, leg.duration_in_traffic);
      } else {
        console.error("Traffic route error:", status);
      }
    }
  );
}

function showDelayStatus(normal, traffic) {
  if (!traffic) return;

  const delaySeconds = traffic.value - normal.value;

  if (delaySeconds > 600) {
    console.warn("🔴 HIGH DELAY RISK");
  } else if (delaySeconds > 300) {
    console.warn("🟠 MODERATE DELAY");
  } else {
    console.log("🟢 TRAFFIC NORMAL");
  }
}

function updateVehicleLocation() {
  fetch("/api/location")
    .then(res => res.json())
    .then(data => {
      const newPos = { lat: data.lat, lng: data.lng };
      marker.setPosition(newPos);
      map.panTo(newPos);
    });
}

