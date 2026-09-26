const db = require("../config/database");

function getCountries(req, res) {
  try {
    const countries = db.prepare(`
      SELECT
        c.id,
        c.name,
        c.code AS iso2,
        c.flag,
        NULL AS map_x,
        NULL AS map_y,
        COUNT(s.id) AS sites_count
      FROM countries c
      LEFT JOIN sites s
        ON s.country_id = c.id
        AND s.status = 'published'
      WHERE c.is_active = 1
      GROUP BY c.id
      ORDER BY c.name ASC
    `).all();

    res.json({
      success: true,
      count: countries.length,
      data: countries
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Impossible de récupérer les pays."
    });
  }
}

module.exports = {
  getCountries
};