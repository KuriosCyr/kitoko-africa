const db = require("../config/database");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

async function optimizeUploadedMedia(file) {
	if (!file || !file.mimetype.startsWith("image/")) return file;

	const optimizedPath = path.join(path.dirname(file.path), `${path.basename(file.path, path.extname(file.path))}.webp`);
	await sharp(file.path)
		.rotate()
		.resize({ width: 2400, height: 1600, fit: "inside", withoutEnlargement: true })
		.webp({ quality: 82 })
		.toFile(optimizedPath);

	if (optimizedPath !== file.path) fs.unlinkSync(file.path);
	file.path = optimizedPath;
	file.mimetype = "image/webp";
	file.originalname = `${path.basename(optimizedPath)}`;
	return file;
}

async function createContribution(req, res) {
	const { name, country, category, description } = req.body || {};

	if (!name?.trim() || !country?.trim() || !category?.trim() || !description?.trim()) {
		return res.status(400).json({
			success: false,
			message: "Nom, pays, catégorie et description sont requis."
		});
	}

	const countryRow = db.prepare("SELECT id FROM countries WHERE name = ? AND is_active = 1").get(country.trim());
	const categoryRow = db.prepare("SELECT id FROM categories WHERE slug = ?").get(category.trim());

	if (!countryRow || !categoryRow) {
		return res.status(400).json({ success: false, message: "Pays ou catégorie invalide." });
	}

	const result = db.prepare(`
		INSERT INTO contributions (
			user_id, type, name, country_id, category_id, description, status
		)
		VALUES (?, 'new', ?, ?, ?, ?, 'pending')
		`).run(
		req.user.id,
		name.trim(),
		countryRow.id,
		categoryRow.id,
		description.trim()
	);

	if (req.file) {
		try {
			await optimizeUploadedMedia(req.file);
		} catch (error) {
			if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
			return res.status(422).json({ success: false, message: "Impossible de traiter le média envoyé." });
		}
		db.prepare(`
			INSERT INTO media (contribution_id, type, file_path, title)
			VALUES (?, ?, ?, ?)
		`).run(
			result.lastInsertRowid,
			req.file.mimetype.startsWith("video/") ? "video" : "image",
			req.file.path,
			req.file.originalname
		);
	}

	return res.status(201).json({
		success: true,
		data: { id: result.lastInsertRowid, status: "pending", media: Boolean(req.file) }
	});
}

function listMyContributions(req, res) {
	const contributions = db.prepare(`
		SELECT c.id, c.type, c.name, c.description, c.status, c.created_at,
		       m.type AS media_type, m.file_path AS media_path
		FROM contributions c
		LEFT JOIN media m ON m.contribution_id = c.id
		WHERE c.user_id = ?
		ORDER BY created_at DESC
	`).all(req.user.id);
	contributions.forEach(item => {
		item.media_url = item.media_path ? `/uploads/${path.basename(item.media_path)}` : null;
		delete item.media_path;
	});

	return res.json({ success: true, data: contributions });
}

module.exports = { createContribution, listMyContributions };
