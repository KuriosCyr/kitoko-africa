const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { isSupportedVideo, isSupportedAudio } = require("./media");

function removeUploadedFile(file) {
  if (file?.path) fs.rmSync(file.path, { force: true });
}

// Vérifie un fichier reçu et le prépare : les images sont converties en WebP
// (ce qui garantit aussi que c'est une vraie image), la signature des vidéos
// et des sons est contrôlée. Lève une erreur si le fichier n'est pas valide.
async function prepareUploadedMedia(file) {
  if (file.mimetype.startsWith("video/")) {
    if (!isSupportedVideo(file.path)) throw new Error("Vidéo non reconnue.");
    return { type: "video", fileName: path.basename(file.path) };
  }
  if (file.mimetype.startsWith("audio/")) {
    if (!isSupportedAudio(file.path)) throw new Error("Son non reconnu.");
    return { type: "audio", fileName: path.basename(file.path) };
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

module.exports = { prepareUploadedMedia, removeUploadedFile };
