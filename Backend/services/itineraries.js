const db = require("../config/database");
const { distanceMeters } = require("./sites");

function stopsOf(itineraryId) {
  return db.prepare(`
    SELECT st.site_id AS id, st.position, st.note, s.slug, s.name, s.region, s.latitude, s.longitude,
           cat.slug AS category, c.name AS country
    FROM itinerary_stops st
    JOIN sites s ON s.id = st.site_id AND s.status = 'published'
    JOIN categories cat ON cat.id = s.category_id
    JOIN countries c ON c.id = s.country_id
    WHERE st.itinerary_id = ?
    ORDER BY st.position
  `).all(itineraryId);
}

// Distance à vol d'oiseau entre étapes successives (indicative).
function totalDistanceKm(stops) {
  let total = 0;
  for (let i = 1; i < stops.length; i++) {
    const [a, b] = [stops[i - 1], stops[i]];
    if (a.latitude == null || b.latitude == null) continue;
    total += distanceMeters(a.latitude, a.longitude, b.latitude, b.longitude);
  }
  return Math.round(total / 1000);
}

function listItineraries() {
  return db.prepare(`
    SELECT i.id, i.slug, i.title, i.summary, i.duration, i.icon, c.name AS country, c.flag AS country_flag
    FROM itineraries i LEFT JOIN countries c ON c.id = i.country_id
    WHERE i.status = 'published'
    ORDER BY c.name, i.id
  `).all().map(itinerary => {
    const stops = stopsOf(itinerary.id);
    return { ...itinerary, stops, distance_km: totalDistanceKm(stops) };
  }).filter(itinerary => itinerary.stops.length >= 2);
}

// Circuits dont toutes les étapes ont un tampon (sur place ou en ligne).
function circuitProgress(userId) {
  const stamped = new Set(db.prepare("SELECT DISTINCT site_id FROM stamps WHERE user_id = ?").all(userId).map(row => row.site_id));
  const visited = new Set(db.prepare("SELECT site_id FROM stamps WHERE user_id = ? AND kind = 'onsite'").all(userId).map(row => row.site_id));
  return listItineraries().map(itinerary => ({
    slug: itinerary.slug,
    title: itinerary.title,
    icon: itinerary.icon,
    total: itinerary.stops.length,
    discovered: itinerary.stops.filter(stop => stamped.has(stop.id)).length,
    visited: itinerary.stops.filter(stop => visited.has(stop.id)).length
  }));
}

module.exports = { listItineraries, circuitProgress };
