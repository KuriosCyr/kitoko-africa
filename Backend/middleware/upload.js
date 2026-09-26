const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const { privateDir } = require("../services/media");

const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".tif", ".tiff", ".mp4", ".m4v", ".mov", ".webm", ".mkv", ".mp3", ".m4a", ".aac", ".ogg", ".oga", ".opus", ".wav"]);

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
    const isMedia = ["image/", "video/", "audio/"].some(prefix => file.mimetype.startsWith(prefix));
    if (isMedia && ALLOWED_EXTENSIONS.has(extension)) {
      return callback(null, true);
    }
    const error = new Error("Seuls les fichiers image (JPG, PNG, WebP…), vidéo (MP4, MOV, WebM) ou audio (MP3, M4A, OGG, WAV) sont acceptés.");
    error.status = 400;
    return callback(error);
  }
});

module.exports = upload;
