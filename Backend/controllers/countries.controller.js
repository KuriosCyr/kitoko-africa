const db = require("../config/database");

function getCountries(req, res) {
  const countries = db.prepare(`
    SELECT
      c.id,
      c.name,
      c.code AS map_id,
      c.flag,
      COUNT(s.id) AS sites_count
    FROM countries c
    LEFT JOIN sites s
      ON s.country_id = c.id
      AND s.status = 'published'
    WHERE c.is_active = 1
    GROUP BY c.id
    ORDER BY c.name ASC
  `).all();

  res.json({ success: true, count: countries.length, data: countries });
}

module.exports = { getCountries };
