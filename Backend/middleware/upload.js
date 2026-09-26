const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const { privateDir } = require("../services/media");

const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".tif", ".tiff", ".mp4", ".m4v", ".mov", ".webm", ".mkv"]);

// Tout fichier reçu est d'abord privé : il ne devient public qu'à la
// publication du site par un administrateur.
const storage = multer.diskStorage({
  destination: privateDir,
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${extension}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const isMedia = file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/");
    if (isMedia && ALLOWED_EXTENSIONS.has(extension)) {
      return callback(null, true);
    }
    const error = new Error("Seuls les fichiers image (JPG, PNG, WebP…) ou vidéo (MP4, MOV, WebM) sont acceptés.");
    error.status = 400;
    return callback(error);
  }
});

module.exports = upload;
