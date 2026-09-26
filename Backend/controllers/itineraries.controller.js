const { listItineraries } = require("../services/itineraries");

function getItineraries(req, res) {
  res.json({ success: true, data: listItineraries() });
}

module.exports = { getItineraries };
