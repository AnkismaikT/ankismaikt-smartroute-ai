function recommendAction(vehicle, delayRisk) {
  if (delayRisk.riskPercentage > 60) {
    return "Reroute immediately via alternate highway";
  }

  if (delayRisk.riskPercentage > 40) {
    return "Notify customer about possible delay";
  }

  return "Continue on current route";
}

module.exports = { recommendAction };

