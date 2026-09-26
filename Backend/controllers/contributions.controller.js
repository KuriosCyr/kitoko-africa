const db = require("../config/database");
const { fileName, locateMediaFile } = require("../services/media");
const { prepareUploadedMedia, removeUploadedFile } = require("../services/media-processing");

const MAX_TEXT_LENGTH = 20000;
const RECIT_NATURES = ["temoignage", "tradition_orale", "recit_communautaire"];

function text(value, maxLength = MAX_TEXT_LENGTH) {
	return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function fail(req, res, status, message) {
	removeUploadedFile(req.file);
	return res.status(status).json({ success: false, message });
}

// Types de contribution (document de référence, § 14) :
// new    : proposer un nouveau site (média obligatoire)
// recit  : partager un récit ou un témoignage sur un site (audio, photo ou vidéo facultatif)
// media  : proposer une photo, une vidéo ou un son pour un site
// edit   : signaler ou corriger une information
async function createContribution(req, res) {
	const type = ["new", "recit", "media", "edit"].includes(req.body?.type) ? req.body.type : "new";
	const description = text(req.body?.description);
	const creditName = text(req.body?.credit_name, 120);

	let site = null;
	if (type !== "new") {
		site = db.prepare("SELECT id, name, country_id, category_id FROM sites WHERE id = ? AND status = 'published'").get(Number(req.body?.site_id));
		if (!site) return fail(req, res, 404, "Site introuvable.");
	}

	if (type === "edit") {
		removeUploadedFile(req.file);
		if (!description) return res.status(400).json({ success: false, message: "Merci de décrire votre proposition." });
		const result = db.prepare(`
			INSERT INTO contributions (user_id, type, site_id, name, country_id, category_id, description, status)
			VALUES (?, 'edit', ?, ?, ?, ?, ?, 'pending')
		`).run(req.user.id, site.id, site.name, site.country_id, site.category_id, description);
		return res.status(201).json({ success: true, data: { id: result.lastInsertRowid, type, status: "pending" } });
	}

	let values;
	if (type === "new") {
		const name = text(req.body?.name, 200);
		const country = text(req.body?.country, 200);
		const category = text(req.body?.category, 50);
		if (!name || !country || !category || !description) return fail(req, res, 400, "Nom, pays, catégorie et description sont requis.");
		if (!req.file) return fail(req, res, 400, "Une photo ou une vidéo du site est requise.");

		const countryRow = db.prepare("SELECT id FROM countries WHERE name = ? AND is_active = 1").get(country);
		const categoryRow = db.prepare("SELECT id FROM categories WHERE slug = ?").get(category);
		if (!countryRow || !categoryRow) return fail(req, res, 400, "Pays ou catégorie invalide.");
		values = { name, countryId: countryRow.id, categoryId: categoryRow.id, region: text(req.body?.region, 200), nature: null };
	} else if (type === "recit") {
		const title = text(req.body?.name, 200);
		if (!title || !description) return fail(req, res, 400, "Un titre et le texte du récit sont requis.");
		const nature = RECIT_NATURES.includes(req.body?.nature) ? req.body.nature : "temoignage";
		values = { name: title, countryId: site.country_id, categoryId: site.category_id, region: "", nature };
	} else {
		if (!req.file) return fail(req, res, 400, "Ajoutez une photo, une vidéo ou un son.");
		values = { name: text(req.body?.name, 200) || `Média pour ${site.name}`, countryId: site.country_id, categoryId: site.category_id, region: "", nature: null };
	}

	let media = null;
	if (req.file) {
		try {
			media = await prepareUploadedMedia(req.file);
		} catch (error) {
			return fail(req, res, 422, "Impossible de traiter le média envoyé : utilisez une image, une vidéo ou un son valide.");
		}
		if (type === "new" && media.type === "audio") return fail(req, res, 400, "Pour un nouveau site, joignez une photo ou une vidéo.");
	}

	// La contribution et son média sont enregistrés ensemble ou pas du tout.
	const insert = db.transaction(() => {
		const result = db.prepare(`
			INSERT INTO contributions (user_id, type, site_id, name, country_id, category_id, region, credit_name, nature, description, status)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
		`).run(req.user.id, type, site?.id ?? null, values.name, values.countryId, values.categoryId, values.region, creditName, values.nature, description);

		if (media) {
			db.prepare(`
				INSERT INTO media (contribution_id, type, file_path, title, author)
				VALUES (?, ?, ?, ?, ?)
			`).run(result.lastInsertRowid, media.type, media.fileName, text(req.file.originalname, 200), creditName || req.user.name);
		}
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
		data: { id: contributionId, type, status: "pending", media: Boolean(media) }
	});
}

function listMyContributions(req, res) {
	const contributions = db.prepare(`
		SELECT c.id, c.type, c.name, c.description, c.status, c.created_at, c.region, c.nature,
		       c.site_id, sites.name AS target_name, countries.name AS country, categories.slug AS category,
		       (SELECT m.id FROM media m WHERE m.contribution_id = c.id ORDER BY m.id DESC LIMIT 1) AS media_id,
		       (SELECT m.type FROM media m WHERE m.contribution_id = c.id ORDER BY m.id DESC LIMIT 1) AS media_type
		FROM contributions c
		LEFT JOIN sites ON sites.id = c.site_id
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
