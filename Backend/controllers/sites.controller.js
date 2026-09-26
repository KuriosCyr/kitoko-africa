const db = require("../config/database");
const path = require("path");

function mediaUrl(filePath) {
  return filePath ? `/uploads/${path.basename(filePath)}` : null;
}

function getSites(req, res) {
  try {
    const sites = db.prepare(`
      SELECT
        s.id,
        s.name,
        s.region,
        s.description,
        s.histoire,
        s.culture,
        s.savoirs,
        s.communities,
        s.langues,
        s.personnalites,
        0 AS featured,
        s.status,
        c.name AS country,
        c.flag AS country_flag,
        cat.slug AS category,
        cat.name AS category_label,
        m.type AS media_type,
        m.file_path AS media_path
      FROM sites s
      JOIN countries c ON c.id = s.country_id
      JOIN categories cat ON cat.id = s.category_id
      LEFT JOIN media m ON m.site_id = s.id
      WHERE s.status = 'published'
      ORDER BY s.id ASC
    `).all();

    sites.forEach(site => { site.media_url = mediaUrl(site.media_path); delete site.media_path; });

    res.json({
      success: true,
      count: sites.length,
      data: sites
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Impossible de récupérer les sites."
    });
  }
}

function getSiteById(req, res) {
  try {
    const site = db.prepare(`
      SELECT
        s.id,
        s.name,
        s.region,
        s.description,
        s.histoire,
        s.culture,
        s.savoirs,
        s.communities,
        s.langues,
        s.personnalites,
        0 AS featured,
        s.status,
        c.name AS country,
        c.flag AS country_flag,
        cat.slug AS category,
        cat.name AS category_label,
        m.type AS media_type,
        m.file_path AS media_path
      FROM sites s
      JOIN countries c ON c.id = s.country_id
      JOIN categories cat ON cat.id = s.category_id
      LEFT JOIN media m ON m.site_id = s.id
      WHERE s.id = ?
        AND s.status = 'published'
    `).get(req.params.id);

    if (!site) {
      return res.status(404).json({
        success: false,
        message: "Site introuvable."
      });
    }

    site.media_url = mediaUrl(site.media_path);
    delete site.media_path;
    res.json({ success: true, data: site });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Impossible de récupérer ce site."
    });
  }
}

module.exports = {
  getSites,
  getSiteById
};