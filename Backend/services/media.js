const fs = require("fs");
const path = require("path");
const { uploadDir } = require("../config/env");

// public/  : médias des sites publiés, servis librement sous /uploads
// private/ : médias des contributions en attente ou rejetées, accessibles
//            uniquement à leur auteur et aux administrateurs
const publicDir = path.join(uploadDir, "public");
const privateDir = path.join(uploadDir, "private");
fs.mkdirSync(publicDir, { recursive: true });
fs.mkdirSync(privateDir, { recursive: true });

function fileName(filePath) {
  // Les anciennes bases stockaient un chemin absolu (parfois Windows).
  return path.basename(String(filePath || "").replace(/\\/g, "/"));
}

function locateMediaFile(filePath) {
  const name = fileName(filePath);
  if (!name) return null;
  const candidates = [path.join(publicDir, name), path.join(privateDir, name), path.join(uploadDir, name)];
  return candidates.find(candidate => fs.existsSync(candidate)) || null;
}

function publicMediaUrl(filePath) {
  return filePath ? `/uploads/${encodeURIComponent(fileName(filePath))}` : null;
}

function publishMediaFile(filePath) {
  const current = locateMediaFile(filePath);
  if (!current) return;
  const destination = path.join(publicDir, fileName(filePath));
  if (current !== destination) fs.renameSync(current, destination);
}

function unpublishMediaFile(filePath) {
  const current = locateMediaFile(filePath);
  if (!current) return;
  const destination = path.join(privateDir, fileName(filePath));
  if (current !== destination) fs.renameSync(current, destination);
}

function deleteMediaFile(filePath) {
  const current = locateMediaFile(filePath);
  if (current) fs.rmSync(current, { force: true });
}

function readHeader(filePath, length = 12) {
  const header = Buffer.alloc(length);
  const fd = fs.openSync(filePath, "r");
  try {
    fs.readSync(fd, header, 0, length, 0);
  } finally {
    fs.closeSync(fd);
  }
  return header;
}

// Le type MIME annoncé par le navigateur n'est pas fiable : on vérifie la
// signature réelle des vidéos et des sons (les images sont validées par sharp).
function isSupportedVideo(filePath) {
  const header = readHeader(filePath);
  const isMp4OrMov = header.toString("latin1", 4, 8) === "ftyp";
  const isWebmOrMkv = header.readUInt32BE(0) === 0x1a45dfa3;
  return isMp4OrMov || isWebmOrMkv;
}

function isSupportedAudio(filePath) {
  const header = readHeader(filePath);
  const isMp3 = header.toString("latin1", 0, 3) === "ID3" || (header[0] === 0xff && (header[1] & 0xe0) === 0xe0);
  const isM4a = header.toString("latin1", 4, 8) === "ftyp";
  const isOgg = header.toString("latin1", 0, 4) === "OggS";
  const isWav = header.toString("latin1", 0, 4) === "RIFF" && header.toString("latin1", 8, 12) === "WAVE";
  const isWebm = header.readUInt32BE(0) === 0x1a45dfa3;
  const isAac = header[0] === 0xff && (header[1] & 0xf6) === 0xf0;
  return isMp3 || isM4a || isOgg || isWav || isWebm || isAac;
}

module.exports = {
  publicDir,
  privateDir,
  fileName,
  locateMediaFile,
  publicMediaUrl,
  publishMediaFile,
  unpublishMediaFile,
  deleteMediaFile,
  isSupportedVideo,
  isSupportedAudio
};
