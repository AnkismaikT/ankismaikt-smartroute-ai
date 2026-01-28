function predictDelay(vehicle) {
  let risk = 0;

  if (vehicle.speed < 30) risk += 30;
  if (vehicle.weather === "rain") risk += 25;
  if (vehicle.traffic === "high") risk += 30;
  if (vehicle.time === "peak") risk += 15;

  if (risk > 100) risk = 100;

  return {
    riskPercentage: risk,
    likelyDelayMinutes: Math.round(risk * 0.6)
  };
}

module.exports = { predictDelay };

