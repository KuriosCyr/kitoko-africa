const db = require("../config/database");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const { fileName, locateMediaFile, isSupportedVideo } = require("../services/media");

const MAX_TEXT_LENGTH = 20000;

function text(value, maxLength = MAX_TEXT_LENGTH) {
	return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function removeUploadedFile(file) {
	if (file?.path) fs.rmSync(file.path, { force: true });
}

// Convertit les images en WebP (ce qui garantit aussi que c'est une vraie
// image) et vérifie la signature des vidéos. Lève une erreur sinon.
async function prepareUploadedMedia(file) {
	if (file.mimetype.startsWith("video/")) {
		if (!isSupportedVideo(file.path)) throw new Error("Vidéo non reconnue.");
		return { type: "video", fileName: path.basename(file.path) };
	}

	const optimizedPath = path.join(path.dirname(file.path), `${path.basename(file.path, path.extname(file.path))}.webp`);
	const temporaryPath = `${optimizedPath}.tmp`;
	await sharp(file.path)
		.rotate()
		.resize({ width: 2400, height: 1600, fit: "inside", withoutEnlargement: true })
		.webp({ quality: 82 })
		.toFile(temporaryPath);
	fs.rmSync(file.path, { force: true });
	fs.renameSync(temporaryPath, optimizedPath);
	file.path = optimizedPath;
	return { type: "image", fileName: path.basename(optimizedPath) };
}

async function createContribution(req, res) {
	const type = req.body?.type === "edit" ? "edit" : "new";
	const description = text(req.body?.description);

	if (type === "edit") {
		removeUploadedFile(req.file);
		const site = db.prepare("SELECT id, name, country_id, category_id FROM sites WHERE id = ? AND status = 'published'").get(Number(req.body?.site_id));
		if (!site) {
			return res.status(404).json({ success: false, message: "Site introuvable." });
		}
		if (!description) {
			return res.status(400).json({ success: false, message: "Merci de décrire votre proposition." });
		}
		const result = db.prepare(`
			INSERT INTO contributions (user_id, type, site_id, name, country_id, category_id, description, status)
			VALUES (?, 'edit', ?, ?, ?, ?, ?, 'pending')
		`).run(req.user.id, site.id, site.name, site.country_id, site.category_id, description);
		return res.status(201).json({ success: true, data: { id: result.lastInsertRowid, type: "edit", status: "pending" } });
	}

	const name = text(req.body?.name, 200);
	const country = text(req.body?.country, 200);
	const category = text(req.body?.category, 50);

	if (!name || !country || !category || !description) {
		removeUploadedFile(req.file);
		return res.status(400).json({ success: false, message: "Nom, pays, catégorie et description sont requis." });
	}

	if (!req.file) {
		return res.status(400).json({ success: false, message: "Une photo ou une vidéo du site est requise." });
	}

	const countryRow = db.prepare("SELECT id FROM countries WHERE name = ? AND is_active = 1").get(country);
	const categoryRow = db.prepare("SELECT id FROM categories WHERE slug = ?").get(category);

	if (!countryRow || !categoryRow) {
		removeUploadedFile(req.file);
		return res.status(400).json({ success: false, message: "Pays ou catégorie invalide." });
	}

	let media;
	try {
		media = await prepareUploadedMedia(req.file);
	} catch (error) {
		removeUploadedFile(req.file);
		return res.status(422).json({ success: false, message: "Impossible de traiter le média envoyé : utilisez une image ou une vidéo valide." });
	}

	// La contribution et son média sont enregistrés ensemble ou pas du tout.
	const insert = db.transaction(() => {
		const result = db.prepare(`
			INSERT INTO contributions (user_id, type, name, country_id, category_id, region, credit_name, description, status)
			VALUES (?, 'new', ?, ?, ?, ?, ?, ?, 'pending')
		`).run(req.user.id, name, countryRow.id, categoryRow.id, text(req.body?.region, 200), text(req.body?.credit_name, 120), description);

		db.prepare(`
			INSERT INTO media (contribution_id, type, file_path, title)
			VALUES (?, ?, ?, ?)
		`).run(result.lastInsertRowid, media.type, media.fileName, text(req.file.originalname, 200));
		return result.lastInsertRowid;
	});

	let contributionId;
	try {
		contributionId = insert();
	} catch (error) {
		removeUploadedFile(req.file);
		throw error;
	}

	return res.status(201).json({
		success: true,
		data: { id: contributionId, type: "new", status: "pending", media: true }
	});
}

function listMyContributions(req, res) {
	const contributions = db.prepare(`
		SELECT c.id, c.type, c.name, c.description, c.status, c.created_at, c.region,
		       c.site_id, countries.name AS country, categories.slug AS category,
		       (SELECT m.id FROM media m WHERE m.contribution_id = c.id ORDER BY m.id DESC LIMIT 1) AS media_id,
		       (SELECT m.type FROM media m WHERE m.contribution_id = c.id ORDER BY m.id DESC LIMIT 1) AS media_type
		FROM contributions c
		LEFT JOIN countries ON countries.id = c.country_id
		LEFT JOIN categories ON categories.id = c.category_id
		WHERE c.user_id = ?
		ORDER BY c.created_at DESC, c.id DESC
	`).all(req.user.id);

	return res.json({ success: true, data: contributions });
}

// Sert le média d'une contribution à son auteur ou à un administrateur,
// même s'il n'est pas (encore) public.
function getContributionMedia(req, res) {
	const media = db.prepare(`
		SELECT m.file_path, m.type, c.user_id
		FROM media m
		JOIN contributions c ON c.id = m.contribution_id
		WHERE m.id = ?
	`).get(Number(req.params.mediaId));

	if (!media || (media.user_id !== req.user.id && req.user.role !== "admin")) {
		return res.status(404).json({ success: false, message: "Média introuvable." });
	}

	const filePath = locateMediaFile(media.file_path);
	if (!filePath) {
		return res.status(404).json({ success: false, message: "Fichier du média introuvable." });
	}

	res.set("Cache-Control", "private, no-store");
	return res.sendFile(filePath, { headers: { "Content-Disposition": `inline; filename="${fileName(media.file_path)}"` } });
}

module.exports = { createContribution, listMyContributions, getContributionMedia };
