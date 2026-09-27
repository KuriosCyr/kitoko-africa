// Fonctions « découverte » : écouter une fiche, calendrier des fêtes, carte
// souvenir à partager, sites autour de moi, question du jour et défis, frise
// panafricaine, espace enseignants.

// ---------------------------------------------------------------------------
// Outils communs
// ---------------------------------------------------------------------------

function nativePlugin(name){
  return window.Capacitor?.isNativePlatform?.() ? window.Capacitor.Plugins?.[name] : null;
}

function localDay(date = new Date()){
  const pad = value => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function readStore(key, fallback){
  try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; } catch(error) { return fallback; }
}
function writeStore(key, value){
  try { localStorage.setItem(key, JSON.stringify(value)); } catch(error) { /* stockage indisponible */ }
}

function siteBySlug(slug){ return SITES.find(site => site.slug === slug); }
function openSiteBySlug(slug){
  const site = siteBySlug(slug);
  if(site) openDetail(site.id);
}

// Texte brut d'un champ riche (intertitres « ### » compris).
function plainText(value){
  return String(value || "").replace(/^###\s*(.+)$/gm, "$1.").replace(/\n+/g, " ").replace(/\s+/g, " ").trim();
}

// Partage d'un fichier (image, PDF) : feuille de partage du téléphone dans
// l'application, partage natif ou téléchargement sur le web.
async function shareFile(blob, fileName, text){
  const share = nativePlugin("Share");
  const filesystem = nativePlugin("Filesystem");
  if(share && filesystem){
    const data = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    const written = await filesystem.writeFile({ path: fileName, data, directory: "CACHE" });
    await share.share({ title: "Kitoko Afrika", text, files: [written.uri], dialogTitle: "Partager" });
    return;
  }
  const file = new File([blob], fileName, { type: blob.type });
  if(navigator.canShare && navigator.canShare({ files: [file] })){
    try { await navigator.share({ files: [file], text, title: "Kitoko Afrika" }); return; }
    catch(error) { if(error?.name === "AbortError") return; }
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

async function shareText(text, url){
  const share = nativePlugin("Share");
  try {
    if(share){ await share.share({ title: "Kitoko Afrika", text, url }); return; }
    if(navigator.share){ await navigator.share({ title: "Kitoko Afrika", text, url }); return; }
    await navigator.clipboard.writeText(url ? `${text} ${url}` : text);
    alert("Texte copié : collez-le dans un message.");
  } catch(error) {
    if(error?.name !== "AbortError" && !/cancel/i.test(error?.message || "")) prompt("Copiez ce texte :", url ? `${text} ${url}` : text);
  }
}

// ---------------------------------------------------------------------------
// 1. Écouter la fiche
// ---------------------------------------------------------------------------

const tts = { active: false, paused: false, chunks: [], index: 0, siteId: null, run: 0 };

function ttsAvailable(){
  return Boolean(nativePlugin("TextToSpeech") || ("speechSynthesis" in window && window.SpeechSynthesisUtterance));
}

function speechChunks(site){
  const parts = [
    site.name + ".",
    plainText(site.description),
    site.histoire ? "Histoire. " + plainText(site.histoire) : "",
    site.culture ? "Importance culturelle. " + plainText(site.culture) : "",
    site.savoirs ? "Savoirs et pratiques. " + plainText(site.savoirs) : ""
  ].filter(Boolean).join(" ");
  // Morceaux courts, coupés aux fins de phrases : plus fiable sur tous les téléphones.
  const sentences = parts.match(/[^.!?]+[.!?»]*\s*/g) || [parts];
  const chunks = [];
  let current = "";
  sentences.forEach(sentence => {
    if((current + sentence).length > 220 && current){ chunks.push(current.trim()); current = ""; }
    current += sentence;
  });
  if(current.trim()) chunks.push(current.trim());
  return chunks;
}

function frenchVoice(){
  const voices = window.speechSynthesis?.getVoices?.() || [];
  return voices.find(voice => /^fr[-_]/i.test(voice.lang) && /google|natural|premium/i.test(voice.name)) || voices.find(voice => /^fr/i.test(voice.lang)) || null;
}

function speakOne(text){
  const native = nativePlugin("TextToSpeech");
  if(native) return native.speak({ text, lang: "fr-FR", rate: 1.0, pitch: 1.0, volume: 1.0, category: "playback" });
  return new Promise(resolve => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    const voice = frenchVoice();
    if(voice) utterance.voice = voice;
    utterance.onend = resolve;
    utterance.onerror = resolve;
    window.speechSynthesis.speak(utterance);
  });
}

async function ttsPlayFrom(index){
  const run = ++tts.run;
  tts.active = true;
  tts.paused = false;
  renderTtsBar();
  for(tts.index = index; tts.index < tts.chunks.length; tts.index++){
    if(run !== tts.run) return;
    try { await speakOne(tts.chunks[tts.index]); } catch(error) { console.warn("Lecture impossible.", error); break; }
    if(run !== tts.run) return;
  }
  if(run === tts.run) ttsStop();
}

function ttsToggle(){
  const site = SITES.find(item => item.id === currentSiteId);
  if(!site) return;
  if(!ttsAvailable()){ alert("La lecture à voix haute n'est pas disponible sur cet appareil."); return; }
  if(tts.active && tts.siteId === site.id){ tts.paused ? ttsResume() : ttsPause(); return; }
  ttsStop();
  tts.siteId = site.id;
  tts.chunks = speechChunks(site);
  ttsPlayFrom(0);
}

function ttsPause(){
  tts.paused = true;
  tts.run++;
  const native = nativePlugin("TextToSpeech");
  if(native) native.stop().catch(() => {});
  else window.speechSynthesis.cancel();
  renderTtsBar();
}

function ttsResume(){ ttsPlayFrom(tts.index); }

function ttsStop(){
  tts.run++;
  const native = nativePlugin("TextToSpeech");
  if(native) native.stop().catch(() => {});
  else if(window.speechSynthesis) window.speechSynthesis.cancel();
  tts.active = false;
  tts.paused = false;
  tts.siteId = null;
  renderTtsBar();
}

function renderTtsBar(){
  const button = document.getElementById('detail-listen');
  const playing = tts.active && tts.siteId === currentSiteId;
  if(button) button.innerHTML = `${ico(playing && !tts.paused ? "pause" : "volume-2")} ${playing ? (tts.paused ? "Reprendre" : "Pause") : "Écouter"}`;
  let bar = document.getElementById('tts-bar');
  if(!tts.active){ bar?.remove(); return; }
  if(!bar){
    bar = document.createElement('div');
    bar.id = 'tts-bar';
    bar.className = 'tts-bar';
    bar.setAttribute('role', 'status');
    document.body.appendChild(bar);
  }
  const site = SITES.find(item => item.id === tts.siteId);
  const progress = tts.chunks.length ? Math.round(tts.index / tts.chunks.length * 100) : 0;
  bar.innerHTML = `
    <span class="tts-icon">${ico("volume-2")}</span>
    <div class="tts-info"><strong>${esc(site?.name || "Lecture")}</strong><span class="tts-progress"><span style="width:${progress}%"></span></span></div>
    <button type="button" class="tts-btn" aria-label="${tts.paused ? "Reprendre" : "Pause"}" onclick="${tts.paused ? "ttsResume()" : "ttsPause()"}">${ico(tts.paused ? "play" : "pause")}</button>
    <button type="button" class="tts-btn" aria-label="Arrêter la lecture" onclick="ttsStop()">${ico("square")}</button>`;
}

// Les voix du navigateur se chargent parfois après la page.
if("speechSynthesis" in window) window.speechSynthesis.onvoiceschanged = () => {};

// ---------------------------------------------------------------------------
// 2. Calendrier des fêtes
// ---------------------------------------------------------------------------

// rule : fixed (date fixe), approx (période habituelle), month (mois),
// hijri (calendrier musulman, date estimée), weekday (ex. premier mardi de juillet).
const FESTIVALS = [
  { name: "Fête du Vodun", slug: "fete-du-vodun-ouidah", rule: { type: "fixed", month: 1, day: 10 }, text: "Journée nationale des religions endogènes : cérémonies sur la plage de Ouidah et dans tout le Bénin." },
  { name: "Phénomène solaire d'Abou Simbel", slug: "abou-simbel", rule: { type: "fixed", month: 2, day: 22 }, text: "Le soleil levant illumine le fond du sanctuaire de Ramsès II." },
  { name: "Festival de pêche d'Argungu", slug: "festival-peche-argungu", rule: { type: "approx", month: 3, day: 1 }, text: "Généralement entre février et mars ; le festival n'a pas lieu tous les ans." },
  { name: "Crépissage de la mosquée de Djenné", slug: "grande-mosquee-djenne", rule: { type: "approx", month: 4, day: 15 }, text: "Toute la ville recrépit la mosquée, avant la saison des pluies." },
  { name: "Festival de jazz de Saint-Louis", slug: "ile-saint-louis", rule: { type: "approx", month: 5, day: 25 }, text: "Musiciens du monde entier sur l'île, généralement fin mai ou début juin." },
  { name: "Journée de la jeunesse", slug: "soweto-hector-pieterson", rule: { type: "fixed", month: 6, day: 16 }, text: "En mémoire du soulèvement des élèves de Soweto, le 16 juin 1976." },
  { name: "Bakatue à Elmina", slug: "chateau-elmina", rule: { type: "weekday", month: 7, weekday: 2, nth: 1 }, text: "Ouverture de la saison de pêche dans la lagune de Benya : processions et régates (date indicative)." },
  { name: "Grande Migration au Maasai Mara", slug: "maasai-mara", rule: { type: "approx", month: 7, day: 15 }, text: "De juillet à octobre, les gnous traversent la rivière Mara." },
  { name: "Emancipation Day et PANAFEST", slug: "chateau-cape-coast", rule: { type: "fixed", month: 8, day: 1 }, text: "Autour du 1er août, cérémonies de mémoire à Cape Coast avec la diaspora." },
  { name: "Fête d'Osun-Osogbo", slug: "bois-sacre-osun-osogbo", rule: { type: "month", month: 8 }, text: "Une dizaine de jours de cérémonies en août ; dates fixées chaque année." },
  { name: "Epe-Ekpe, nouvel an guin", slug: "epe-ekpe-glidji", rule: { type: "month", month: 9 }, text: "Prise de la pierre sacrée à Glidji ; dates fixées chaque année." },
  { name: "Phénomène solaire d'Abou Simbel", slug: "abou-simbel", rule: { type: "fixed", month: 10, day: 22 }, text: "Deuxième rendez-vous de l'année avec le soleil levant." },
  { name: "Abissa à Grand-Bassam", slug: "grand-bassam", rule: { type: "approx", month: 10, day: 28 }, text: "La grande fête des N'zima, fin octobre ou début novembre." },
  { name: "Fanals de Saint-Louis", slug: "ile-saint-louis", rule: { type: "approx", month: 12, day: 24 }, text: "Défilé de grandes lanternes illuminées, à l'époque de Noël." },
  { name: "Grand Magal de Touba", slug: "touba-grand-magal", rule: { type: "hijri", month: 2, day: 18 }, text: "Le 18 Safar : des millions de pèlerins à Touba." },
  { name: "Gaani à Nikki", slug: "gaani-nikki", rule: { type: "hijri", month: 3, day: 12 }, text: "Pendant la période du Maouloud : cavaliers et salut au roi de Nikki." },
  { name: "Maulidi de Lamu", slug: "vieille-ville-lamu", rule: { type: "hijri", month: 3, day: 12 }, text: "Célébration de la naissance du Prophète : processions et courses de boutres." }
];

let hijriFormatter;
function hijriParts(date){
  if(hijriFormatter === undefined){
    hijriFormatter = null;
    for(const calendar of ["islamic-umalqura", "islamic-civil", "islamic"]){
      try {
        const formatter = new Intl.DateTimeFormat(`en-u-ca-${calendar}`, { month: "numeric", day: "numeric" });
        if(formatter.resolvedOptions().calendar.startsWith("islamic")){ hijriFormatter = formatter; break; }
      } catch(error) { /* calendrier indisponible */ }
    }
  }
  if(!hijriFormatter) return null;
  const parts = Object.fromEntries(hijriFormatter.formatToParts(date).map(part => [part.type, part.value]));
  return { month: Number(parts.month), day: Number(parts.day) };
}

function startOfDay(date){ return new Date(date.getFullYear(), date.getMonth(), date.getDate()); }

function nextOccurrence(rule, from = startOfDay(new Date())){
  const year = from.getFullYear();
  const pick = build => { const current = build(year); return current >= from ? current : build(year + 1); };
  if(rule.type === "fixed" || rule.type === "approx") return pick(y => new Date(y, rule.month - 1, rule.day));
  if(rule.type === "month"){
    const inMonth = from.getMonth() === rule.month - 1;
    return inMonth ? from : pick(y => new Date(y, rule.month - 1, 15));
  }
  if(rule.type === "weekday") return pick(y => {
    const first = new Date(y, rule.month - 1, 1);
    const offset = (rule.weekday - first.getDay() + 7) % 7;
    return new Date(y, rule.month - 1, 1 + offset + (rule.nth - 1) * 7);
  });
  if(rule.type === "hijri"){
    for(let offset = 0; offset < 400; offset++){
      const date = new Date(from.getFullYear(), from.getMonth(), from.getDate() + offset);
      const parts = hijriParts(date);
      if(!parts) return null;
      if(parts.month === rule.month && parts.day === rule.day) return date;
    }
  }
  return null;
}

function festivalDateLabel(festival, date){
  if(!date) return "Date selon le calendrier lunaire";
  const month = date.toLocaleDateString("fr-FR", { month: "long" });
  if(festival.rule.type === "month") return `En ${month}`;
  if(festival.rule.type === "approx") return `Vers le ${date.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}`;
  if(festival.rule.type === "hijri") return `Vers le ${date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} (estimé)`;
  return date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
}

function countdownLabel(festival, date){
  if(!date) return "";
  const days = Math.round((date - startOfDay(new Date())) / 86400000);
  if(festival.rule.type === "month" && days <= 0) return "Ce mois-ci";
  if(days <= 0) return "Aujourd'hui !";
  if(days === 1) return "Demain";
  const prefix = festival.rule.type === "fixed" || festival.rule.type === "weekday" ? "Dans" : "Dans environ";
  if(days < 60) return `${prefix} ${days} jours`;
  return `${prefix} ${Math.round(days / 30)} mois`;
}

function upcomingFestivals(){
  return FESTIVALS
    .map(festival => ({ ...festival, date: nextOccurrence(festival.rule) }))
    .filter(festival => siteBySlug(festival.slug))
    .sort((a, b) => (a.date ? a.date.getTime() : Infinity) - (b.date ? b.date.getTime() : Infinity));
}

function festivalCard(festival, compact = false){
  const site = siteBySlug(festival.slug);
  return `
    <article class="festival-card${compact ? " is-compact" : ""}" onclick="openSiteBySlug('${esc(festival.slug)}')" role="button" tabindex="0">
      <div class="festival-date"><span class="festival-countdown">${esc(countdownLabel(festival, festival.date))}</span><span>${esc(festivalDateLabel(festival, festival.date))}</span></div>
      <div class="festival-main">
        <h3>${esc(festival.name)}</h3>
        <p class="festival-place">${flagImage(site?.country_flag, "mini-flag", site?.country || "")} ${esc(site?.name || "")}</p>
        ${compact ? "" : `<p class="festival-text">${esc(festival.text)}</p>`}
      </div>
    </article>`;
}

function renderCalendar(){
  const body = document.getElementById('calendar-body');
  if(!body) return;
  body.innerHTML = upcomingFestivals().map(festival => festivalCard(festival)).join("") +
    `<p class="form-note">Les dates des fêtes traditionnelles sont fixées chaque année par les autorités coutumières ou religieuses : celles indiquées ici sont habituelles ou estimées (calendrier lunaire). Vérifiez-les avant de vous déplacer.</p>`;
}

function renderHomeFestival(){
  const box = document.getElementById('home-festival');
  if(!box) return;
  const next = upcomingFestivals().slice(0, 2);
  box.innerHTML = next.length ? next.map(festival => festivalCard(festival, true)).join("") : "";
}

// ---------------------------------------------------------------------------
// 3. Carte souvenir à partager
// ---------------------------------------------------------------------------

function loadImage(src){
  return new Promise(resolve => {
    if(!src){ resolve(null); return; }
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

function wrapLines(context, text, maxWidth){
  const words = String(text || "").split(/\s+/);
  const lines = [];
  let line = "";
  words.forEach(word => {
    const test = line ? `${line} ${word}` : word;
    if(context.measureText(test).width > maxWidth && line){ lines.push(line); line = word; }
    else line = test;
  });
  if(line) lines.push(line);
  return lines;
}

function drawStamp(context, x, y, radius, label, color){
  context.save();
  context.translate(x, y);
  context.rotate(-0.18);
  context.strokeStyle = color;
  context.fillStyle = color;
  context.lineWidth = 7;
  context.globalAlpha = 0.92;
  context.beginPath(); context.arc(0, 0, radius, 0, Math.PI * 2); context.stroke();
  context.lineWidth = 3;
  context.beginPath(); context.arc(0, 0, radius - 16, 0, Math.PI * 2); context.stroke();
  context.textAlign = "center";
  context.font = '700 30px "Source Sans 3", sans-serif';
  context.fillText("KITOKO AFRIKA", 0, -radius * 0.38);
  context.font = '700 44px "Cormorant Garamond", serif';
  wrapLines(context, label, radius * 1.5).slice(0, 2).forEach((line, index, all) => context.fillText(line, 0, 12 + (index - (all.length - 1) / 2) * 44));
  context.font = '600 26px "Source Sans 3", sans-serif';
  context.fillText(new Date().toLocaleDateString("fr-FR"), 0, radius * 0.62);
  context.restore();
}

async function buildShareCard({ site, kicker, title, stamp }){
  await Promise.all([
    document.fonts?.load?.('700 60px "Cormorant Garamond"'),
    document.fonts?.load?.('600 30px "Source Sans 3"'),
    document.fonts?.load?.('700 30px "Source Sans 3"')
  ].filter(Boolean)).catch(() => {});
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const context = canvas.getContext("2d");
  const styles = getComputedStyle(document.documentElement);
  const ink = styles.getPropertyValue("--ink").trim() || "#141D3D";
  const gold = styles.getPropertyValue("--gold").trim() || "#D9B25F";
  const clay = styles.getPropertyValue("--clay").trim() || "#D7263D";

  context.fillStyle = ink;
  context.fillRect(0, 0, 1080, 1350);
  const photo = await loadImage(site?.media_url ? mediaSrc(site.media_url) : "");
  if(photo){
    const ratio = Math.max(1080 / photo.width, 820 / photo.height);
    const width = photo.width * ratio;
    const height = photo.height * ratio;
    context.drawImage(photo, (1080 - width) / 2, (820 - height) / 2, width, height);
  } else {
    context.fillStyle = "#2B3F7A";
    context.fillRect(0, 0, 1080, 820);
    context.fillStyle = "rgba(255,255,255,.08)";
    for(let x = 0; x < 1080; x += 40) for(let y = 0; y < 820; y += 40){ context.beginPath(); context.arc(x, y, 4, 0, Math.PI * 2); context.fill(); }
  }
  const fade = context.createLinearGradient(0, 520, 0, 860);
  fade.addColorStop(0, "rgba(20,29,61,0)");
  fade.addColorStop(1, ink);
  context.fillStyle = fade;
  context.fillRect(0, 500, 1080, 360);

  context.fillStyle = gold;
  context.fillRect(80, 880, 90, 6);
  context.font = '700 30px "Source Sans 3", sans-serif';
  context.fillText(kicker.toUpperCase(), 80, 940);
  context.fillStyle = "#FFFFFF";
  context.font = '700 78px "Cormorant Garamond", serif';
  wrapLines(context, title, 700).slice(0, 3).forEach((line, index) => context.fillText(line, 80, 1030 + index * 80));
  if(site){
    context.fillStyle = "#C9C2B3";
    context.font = '400 34px "Source Sans 3", sans-serif';
    context.fillText([site.region, site.country].filter(Boolean).join(" · ").slice(0, 60), 80, 1250);
  }
  drawStamp(context, 870, 1040, 150, stamp, clay);

  context.fillStyle = gold;
  context.font = '600 26px "Source Sans 3", sans-serif';
  context.fillText("Notre Afrique, nos histoires, nos savoirs", 80, 1310);
  return canvas;
}

async function openShareCard(options){
  const modal = document.getElementById('card-modal');
  const preview = document.getElementById('card-preview');
  modal.hidden = false;
  preview.innerHTML = '<p class="pane-empty">Création de votre carte…</p>';
  let canvas;
  try { canvas = await buildShareCard(options); }
  catch(error) { preview.innerHTML = '<p class="pane-empty">Impossible de créer la carte.</p>'; return; }
  let blob;
  try { blob = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg", 0.9)); }
  catch(error) { blob = null; }
  if(!blob){
    // Photo protégée (hors connexion, serveur ancien) : on refait la carte sans photo.
    canvas = await buildShareCard({ ...options, site: options.site ? { ...options.site, media_url: "" } : null });
    blob = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg", 0.9));
  }
  preview.innerHTML = "";
  const image = document.createElement("img");
  image.src = canvas.toDataURL("image/jpeg", 0.85);
  image.alt = "Carte souvenir";
  preview.appendChild(image);
  document.getElementById('card-share').onclick = () => shareFile(blob, `kitoko-afrika-${Date.now()}.jpg`, options.text || "Kitoko Afrika").catch(error => alert("Partage impossible : " + (error.message || error)));
}

function closeShareCard(){ document.getElementById('card-modal').hidden = true; }

function shareStampCard(kind){
  const site = SITES.find(item => item.id === currentSiteId);
  if(!site) return;
  const onsite = kind === "onsite";
  openShareCard({
    site,
    kicker: onsite ? "J'y étais" : "Je l'ai découvert",
    title: site.name,
    stamp: onsite ? "Visité sur place" : "Découvert en ligne",
    text: `${onsite ? "J'ai visité" : "J'ai découvert"} « ${site.name} » avec Kitoko Afrika — ${publicOrigin()}/s/${site.slug}`
  });
}

function shareBadgeCard(slug){
  const badge = passportData?.badges.find(item => item.slug === slug);
  if(!badge) return;
  const stamped = SITES.filter(site => stampedSites.has(site.id));
  const site = stamped[stamped.length - 1] || SITES.find(item => item.featured) || null;
  openShareCard({
    site,
    kicker: "Nouveau badge",
    title: badge.name,
    stamp: "Badge obtenu",
    text: `J'ai obtenu le badge « ${badge.name} » sur Kitoko Afrika — ${publicOrigin()}`
  });
}

// ---------------------------------------------------------------------------
// 4. Autour de moi
// ---------------------------------------------------------------------------

function distanceKm(a, b){
  const toRad = value => value * Math.PI / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

function formatDistance(km){
  if(km < 1) return `${Math.round(km * 1000)} m`;
  if(km < 20) return `${km.toFixed(1).replace(".", ",")} km`;
  return `${Math.round(km).toLocaleString("fr-FR")} km`;
}

function renderNearby(position){
  const body = document.getElementById('nearby-list');
  if(!body) return;
  if(!position){
    body.innerHTML = `<div class="empty"><div class="glyph">${ico("locate-fixed")}</div><h3>Où êtes-vous ?</h3><p>Autorisez la localisation pour voir les sites les plus proches de vous, avec la distance et l'itinéraire.</p></div>`;
    return;
  }
  const here = { lat: position.coords.latitude, lon: position.coords.longitude };
  const sites = SITES.filter(site => site.latitude != null && site.longitude != null)
    .map(site => ({ site, km: distanceKm(here, { lat: site.latitude, lon: site.longitude }) }))
    .sort((a, b) => a.km - b.km)
    .slice(0, 15);
  const far = sites[0] && sites[0].km > 300;
  body.innerHTML = (far ? `<p class="form-note">Aucun site documenté à moins de 300 km : voici les plus proches de vous.</p>` : "") +
    sites.map(({ site, km }) => `
      <article class="nearby-card">
        <div class="nearby-distance"><strong>${esc(formatDistance(km))}</strong></div>
        <div class="nearby-main" onclick="openDetail(${site.id})" role="button" tabindex="0">
          <h3>${esc(site.name)}</h3>
          <p>${flagImage(site.country_flag, "mini-flag", site.country)} ${esc([site.region, site.country].filter(Boolean).join(" · "))}</p>
        </div>
        <a class="icon-btn nearby-go" href="https://www.google.com/maps/dir/?api=1&destination=${site.latitude},${site.longitude}" target="_blank" rel="noopener" aria-label="Itinéraire vers ${esc(site.name)}">${ico("navigation")}</a>
      </article>`).join("");
}

function locateMe(){
  const body = document.getElementById('nearby-list');
  if(!navigator.geolocation){ body.innerHTML = '<p class="pane-empty">La localisation n\'est pas disponible sur cet appareil.</p>'; return; }
  body.innerHTML = '<p class="pane-empty">Localisation en cours…</p>';
  navigator.geolocation.getCurrentPosition(
    position => renderNearby(position),
    error => {
      body.innerHTML = `<div class="empty"><div class="glyph">${ico("locate-fixed")}</div><h3>Localisation impossible</h3><p>${error.code === 1 ? "Vous avez refusé l'accès à la position. Autorisez-le dans les réglages de votre téléphone pour utiliser cette fonction." : "La position n'a pas pu être obtenue. Vérifiez que la localisation est activée, puis réessayez."}</p></div>`;
    },
    { enableHighAccuracy: false, timeout: 15000, maximumAge: 300000 }
  );
}

// ---------------------------------------------------------------------------
// 5. Question du jour, séries et défis
// ---------------------------------------------------------------------------

let QUIZ_POOL = [];
const DAILY_STORE = "kitoko_daily";

async function loadQuizPool(force = false){
  if(QUIZ_POOL.length && !force) return QUIZ_POOL;
  try { QUIZ_POOL = (await fetchJson('/quiz/pool')).data; } catch(error) { console.warn("Questions indisponibles.", error); }
  return QUIZ_POOL;
}

// Même calcul que le serveur (Backend/services/daily.js).
function dailyIndex(day, size){
  const [year, month, date] = day.split("-").map(Number);
  const number = Math.floor(Date.UTC(year, month - 1, date) / 86400000);
  let value = (number * 2654435761) >>> 0;
  value = (value ^ (value >>> 15)) >>> 0;
  return value % size;
}

function localDailyStats(){
  const store = readStore(DAILY_STORE, { answers: {} });
  const days = new Set(Object.keys(store.answers));
  const today = localDay();
  const shift = (day, offset) => { const [y, m, d] = day.split("-").map(Number); return localDay(new Date(y, m - 1, d + offset)); };
  let streak = 0;
  let cursor = days.has(today) ? today : shift(today, -1);
  while(days.has(cursor)){ streak++; cursor = shift(cursor, -1); }
  return { streak, played: days.size, correct: Object.values(store.answers).filter(answer => answer.correct).length, answered_today: days.has(today), today: store.answers[today] };
}

async function todaysQuestion(){
  const pool = await loadQuizPool();
  if(!pool.length) return null;
  return pool[dailyIndex(localDay(), pool.length)];
}

async function renderHomeDaily(){
  const box = document.getElementById('home-daily');
  if(!box) return;
  const question = await todaysQuestion();
  if(!question){ box.hidden = true; return; }
  const stats = localDailyStats();
  box.hidden = false;
  box.innerHTML = `
    <div class="daily-teaser" onclick="showScreen('screen-daily')" role="button" tabindex="0">
      <span class="daily-teaser-icon">${ico("help-circle")}</span>
      <div class="daily-teaser-main">
        <p class="daily-teaser-kicker">Question du jour ${stats.streak ? `· ${ico("flame")} ${stats.streak} jour${stats.streak > 1 ? "s" : ""}` : ""}</p>
        <p class="daily-teaser-q">${stats.answered_today ? "Vous avez répondu aujourd'hui. Revenez demain !" : esc(question.question)}</p>
      </div>
      <span class="daily-teaser-go">${ico("arrow-right")}</span>
    </div>`;
}

async function renderDaily(){
  const body = document.getElementById('daily-body');
  if(!body) return;
  body.innerHTML = '<p class="pane-empty">Chargement…</p>';
  const question = await todaysQuestion();
  if(!question){ body.innerHTML = '<p class="pane-empty">La question du jour est indisponible pour le moment.</p>'; return; }
  const stats = localDailyStats();
  const answered = stats.today && stats.today.question_id === question.id ? stats.today : null;
  body.innerHTML = `
    <section class="daily-card">
      <p class="daily-kicker">${esc(new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }))}</p>
      <h2 class="daily-question">${esc(question.question)}</h2>
      <p class="daily-site">À propos de : <button type="button" class="link-btn" onclick="openSiteBySlug('${esc(question.slug)}')">${esc(question.site_name)}</button> (${esc(question.country)})</p>
      <div class="daily-choices">
        ${question.choices.map((choice, index) => `<button type="button" class="daily-choice${answered ? (index === question.answer_index ? " is-right" : index === answered.choice ? " is-wrong" : "") : ""}" ${answered ? "disabled" : ""} onclick="answerDaily(${index})">${esc(choice)}</button>`).join("")}
      </div>
      <div id="daily-feedback">${answered ? dailyFeedback(question, answered.correct) : ""}</div>
    </section>
    <section class="daily-stats">
      <div><strong>${ico("flame")} ${stats.streak}</strong><span>jour${stats.streak > 1 ? "s" : ""} de suite</span></div>
      <div><strong>${stats.correct}</strong><span>bonne${stats.correct > 1 ? "s" : ""} réponse${stats.correct > 1 ? "s" : ""}</span></div>
      <div><strong>${stats.played}</strong><span>jour${stats.played > 1 ? "s" : ""} joué${stats.played > 1 ? "s" : ""}</span></div>
    </section>
    <button class="ghost-btn" type="button" onclick="challengeFriend()">${ico("share-2")} Défier un ami</button>
    <section id="daily-groups" class="daily-groups"></section>`;
  renderDailyGroups();
}

function dailyFeedback(question, correct){
  return `<div class="daily-feedback ${correct ? "is-right" : "is-wrong"}">
    <strong>${correct ? "Bravo, bonne réponse !" : `La bonne réponse était : ${esc(question.choices[question.answer_index])}`}</strong>
    ${question.explanation ? `<p>${esc(question.explanation)}</p>` : ""}
    <button type="button" class="link-btn" onclick="openSiteBySlug('${esc(question.slug)}')">Lire la fiche « ${esc(question.site_name)} »</button>
  </div>`;
}

async function answerDaily(choice){
  let question = await todaysQuestion();
  if(!question) return;
  const day = localDay();
  const correct = choice === question.answer_index;
  const store = readStore(DAILY_STORE, { answers: {} });
  if(store.answers[day]) return;
  store.answers[day] = { question_id: question.id, choice, correct };
  writeStore(DAILY_STORE, store);
  if(authToken && isLoggedIn){
    try {
      const response = await fetch(`${API_BASE}/quiz/daily`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` }, body: JSON.stringify({ day, question_id: question.id, choice }) });
      // Questions modifiées sur le serveur depuis le dernier chargement : on
      // recharge la réserve ; la série locale reste enregistrée.
      if(response.status === 409) await loadQuizPool(true);
    } catch(error) { /* hors connexion : la série locale reste enregistrée */ }
  }
  if(correct) celebrate("Bonne réponse ! Revenez demain pour continuer votre série.");
  renderDaily();
  renderHomeDaily();
}

async function challengeFriend(){
  const question = await todaysQuestion();
  const stats = localDailyStats();
  const text = question
    ? `Question du jour Kitoko Afrika : « ${question.question} » ${stats.streak > 1 ? `J'en suis à ${stats.streak} jours de suite. ` : ""}Et toi, tu sais ?`
    : "Je joue à la question du jour de Kitoko Afrika. Et toi ?";
  shareText(text, publicOrigin());
}

async function renderDailyGroups(){
  const box = document.getElementById('daily-groups');
  if(!box) return;
  if(!authToken || !isLoggedIn){
    box.innerHTML = `<h3>${ico("trophy")} Défis entre amis</h3><p class="form-note">Créez un compte pour rejoindre un groupe (amis, famille, équipe, classe) et comparer vos séries.</p><button class="cta-btn" type="button" onclick="openAuth('signup')">Créer un compte</button>`;
    return;
  }
  box.innerHTML = `<h3>${ico("trophy")} Défis entre amis</h3><p class="pane-empty">Chargement…</p>`;
  let groups = [];
  let board = [];
  try {
    [groups, board] = await Promise.all([
      fetchJson('/quiz/groups', { headers: { Authorization: `Bearer ${authToken}` } }).then(result => result.data),
      fetchJson('/quiz/leaderboard', { headers: { Authorization: `Bearer ${authToken}` } }).then(result => result.data)
    ]);
  } catch(error) {
    box.innerHTML = `<h3>${ico("trophy")} Défis entre amis</h3><p class="pane-empty">Les classements s'affichent avec une connexion internet.</p>`;
    return;
  }
  box.innerHTML = `
    <h3>${ico("trophy")} Défis entre amis</h3>
    <p class="form-note">Points : bonnes réponses à la question du jour sur les 30 derniers jours.</p>
    ${groups.map(group => `
      <div class="group-card">
        <div class="group-head"><strong>${esc(group.name)}</strong><span class="group-code">Code : <b class="mono">${esc(group.code)}</b></span></div>
        ${rankingTable(group.members)}
        <div class="group-actions">
          <button type="button" class="action-btn" onclick="inviteToGroup('${esc(group.code)}', '${esc(group.name).replace(/'/g, "&#39;")}')">${ico("share-2")} Inviter</button>
          <button type="button" class="action-btn" onclick="leaveGroup(${group.id})">Quitter</button>
        </div>
      </div>`).join("")}
    <div class="group-forms">
      <form onsubmit="event.preventDefault(); createGroup(this.name.value)"><input name="name" maxlength="60" placeholder="Nom du nouveau groupe (ex. Famille, Classe de 4e B)" required><button class="submit-btn" type="submit">Créer</button></form>
      <form onsubmit="event.preventDefault(); joinGroup(this.code.value)"><input name="code" maxlength="8" placeholder="Code d'un groupe" autocapitalize="characters" required><button class="submit-btn" type="submit">Rejoindre</button></form>
    </div>
    ${board.length ? `<h3 class="board-title">Meilleurs joueurs du moment</h3>${rankingTable(board)}` : ""}`;
}

function rankingTable(rows){
  if(!rows.length) return '<p class="pane-empty">Pas encore de réponses.</p>';
  return `<ol class="ranking">${rows.map(row => `<li class="${row.is_me ? "is-me" : ""}"><span class="rank">${row.rank}</span><span class="who">${esc(row.name)}${row.is_me ? " (vous)" : ""}</span><span class="pts">${row.points} pt${row.points > 1 ? "s" : ""}</span><span class="streak">${ico("flame")} ${row.streak}</span></li>`).join("")}</ol>`;
}

async function groupRequest(path, options){
  try { await fetchJson(path, { ...options, headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` } }); renderDailyGroups(); }
  catch(error) { alert(error.message || "Action impossible."); }
}
function createGroup(name){ groupRequest('/quiz/groups', { method: "POST", body: JSON.stringify({ name }) }); }
function joinGroup(code){ groupRequest('/quiz/groups/join', { method: "POST", body: JSON.stringify({ code }) }); }
async function leaveGroup(id){ if(await askConfirm("Quitter ce groupe ?", { confirmLabel: "Quitter" })) groupRequest(`/quiz/groups/${id}`, { method: "DELETE" }); }
function inviteToGroup(code, name){
  shareText(`Rejoins mon groupe « ${name} » sur Kitoko Afrika pour la question du jour ! Dans l'application : Question du jour → Rejoindre, avec le code ${code}.`, publicOrigin());
}

// ---------------------------------------------------------------------------
// 6. Frise panafricaine
// ---------------------------------------------------------------------------

let TIMELINE = [];
let timelineCountry = "";
const ERAS = [
  { label: "Aux origines", to: -3000 },
  { label: "Antiquité", to: 500 },
  { label: "Empires et royaumes (500 - 1500)", to: 1500 },
  { label: "1500 - 1800", to: 1800 },
  { label: "XIXe siècle", to: 1900 },
  { label: "1900 - 1960", to: 1960 },
  { label: "Depuis les indépendances", to: Infinity }
];

function eraOf(year){ return ERAS.findIndex(era => year < era.to); }

async function renderTimeline(){
  const body = document.getElementById('timeline-body');
  if(!body) return;
  if(!TIMELINE.length){
    body.innerHTML = '<p class="pane-empty">Chargement de la frise…</p>';
    try { TIMELINE = (await fetchJson('/timeline')).data; } catch(error) { body.innerHTML = '<p class="pane-empty">Frise indisponible hors connexion.</p>'; return; }
  }
  const countries = [...new Set(TIMELINE.map(event => event.country))].sort((a, b) => a.localeCompare(b, "fr"));
  document.getElementById('timeline-filters').innerHTML = [`<button type="button" class="chip${timelineCountry ? "" : " active"}" onclick="setTimelineCountry('')">Toute l'Afrique</button>`]
    .concat(countries.map(country => `<button type="button" class="chip${timelineCountry === country ? " active" : ""}" onclick="setTimelineCountry(this.dataset.country)" data-country="${esc(country)}">${esc(country)}</button>`)).join("");
  const events = TIMELINE.filter(event => !timelineCountry || event.country === timelineCountry);
  let currentEra = -1;
  body.innerHTML = `<ol class="frise">${events.map(event => {
    const era = eraOf(event.year);
    const header = era !== currentEra ? `<li class="frise-era"><span>${esc(ERAS[era].label)}</span></li>` : "";
    currentEra = era;
    return `${header}<li class="frise-item frise-cat-${esc(event.category)}">
      <span class="frise-date">${esc(event.date)}</span>
      <div class="frise-card" onclick="openDetail(${event.site_id})" role="button" tabindex="0">
        <p>${esc(event.event)}</p>
        <span class="frise-site">${flagImage(event.flag, "mini-flag", event.country)} ${esc(event.site_name)}</span>
      </div>
    </li>`;
  }).join("")}</ol>`;
}

function setTimelineCountry(country){
  timelineCountry = country;
  renderTimeline();
  document.getElementById('timeline-body')?.scrollIntoView({ block: "start" });
}

// ---------------------------------------------------------------------------
// 7. Espace enseignants
// ---------------------------------------------------------------------------

function renderTeachers(){
  const select = document.getElementById('teacher-country');
  if(!select || select.dataset.ready) { updateTeacherSites(); return; }
  select.innerHTML = COUNTRIES.map(country => `<option value="${esc(country.name)}">${esc(country.name)}</option>`).join("");
  select.value = currentCountry || COUNTRIES[0]?.name || "";
  select.dataset.ready = "1";
  updateTeacherSites();
}

function updateTeacherSites(){
  const country = document.getElementById('teacher-country')?.value;
  const select = document.getElementById('teacher-site');
  if(!select) return;
  const sites = SITES.filter(site => site.country === country).sort((a, b) => a.name.localeCompare(b.name, "fr"));
  select.innerHTML = `<option value="">Tout le pays (quiz uniquement)</option>` + sites.map(site => `<option value="${site.id}">${esc(site.name)}</option>`).join("");
  if(sites[0]) select.value = String(sites[0].id);
}

function teacherSelection(){
  const country = document.getElementById('teacher-country').value;
  const siteId = Number(document.getElementById('teacher-site').value) || null;
  return { country, site: siteId ? SITES.find(site => site.id === siteId) : null };
}

// Polices standard des PDF : on remplace les rares caractères non pris en charge.
function pdfText(value){
  return String(value || "")
    .replace(/[’‘ʼ]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, "-").replace(/…/g, "...")
    .replace(/œ/g, "oe").replace(/Œ/g, "OE").replace(/[  ]/g, " ");
}

function loadScript(src){
  return new Promise((resolve, reject) => {
    if(document.querySelector(`script[src="${src}"]`)){ resolve(); return; }
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error("Chargement impossible"));
    document.head.appendChild(script);
  });
}

async function teacherPdf(){
  const { site } = teacherSelection();
  if(!site){ alert("Choisissez un site pour créer sa fiche pédagogique."); return; }
  const button = document.getElementById('teacher-pdf-btn');
  button.disabled = true;
  button.textContent = "Création du PDF…";
  try {
    await loadScript("vendor/jspdf.umd.min.js");
    const pool = await loadQuizPool();
    const questions = pool.filter(question => question.site_id === site.id);
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const margin = 18;
    const width = 210 - margin * 2;
    let y = margin;
    const ensure = height => { if(y + height > 280){ doc.addPage(); y = margin; } };
    const heading = (text, size = 13) => { ensure(14); doc.setFont("helvetica", "bold"); doc.setFontSize(size); doc.setTextColor(20, 29, 61); doc.text(pdfText(text), margin, y); y += size * 0.5 + 2; };
    const paragraph = (text, size = 10.5) => {
      doc.setFont("helvetica", "normal"); doc.setFontSize(size); doc.setTextColor(40, 40, 40);
      String(text || "").split(/\n+/).forEach(block => {
        const isTitle = block.startsWith("### ");
        if(isTitle){ ensure(10); doc.setFont("helvetica", "bold"); doc.text(pdfText(block.slice(4)), margin, y); y += 6; doc.setFont("helvetica", "normal"); return; }
        doc.splitTextToSize(pdfText(block), width).forEach(line => { ensure(6); doc.text(line, margin, y); y += size * 0.45; });
        y += 2;
      });
      y += 1;
    };

    doc.setFillColor(20, 29, 61); doc.rect(0, 0, 210, 30, "F");
    doc.setTextColor(217, 178, 95); doc.setFont("helvetica", "bold"); doc.setFontSize(10);
    doc.text("KITOKO AFRIKA - FICHE PEDAGOGIQUE", margin, 12);
    doc.setTextColor(255, 255, 255); doc.setFontSize(18);
    doc.text(pdfText(site.name), margin, 22);
    y = 40;
    doc.setFont("helvetica", "italic"); doc.setFontSize(10); doc.setTextColor(90, 90, 90);
    doc.text(pdfText([site.region, site.country].filter(Boolean).join(" - ")), margin, y); y += 9;

    heading("Présentation"); paragraph(site.description);
    if(site.histoire){ heading("Histoire"); paragraph(site.histoire); }
    const chrono = Array.isArray(site.chronologie) ? site.chronologie : [];
    if(chrono.length){ heading("Repères chronologiques"); chrono.forEach(item => paragraph(`${item.date} : ${item.event}`)); }
    if(site.culture){ heading("Importance culturelle"); paragraph(site.culture); }
    const facts = Array.isArray(site.saviez_vous) ? site.saviez_vous : [];
    if(facts.length){ heading("Le saviez-vous ?"); facts.forEach(fact => paragraph(`- ${fact}`)); }

    if(questions.length){
      doc.addPage(); y = margin;
      heading(`Questions - ${site.name}`, 15);
      paragraph("Nom : ..............................................   Classe : ..................   Date : ..................");
      questions.forEach((question, index) => {
        ensure(30);
        heading(`${index + 1}. ${question.question}`, 11);
        question.choices.forEach((choice, choiceIndex) => paragraph(`[  ]  ${"ABCD"[choiceIndex]}. ${choice}`));
      });
      doc.addPage(); y = margin;
      heading("Corrigé (pour l'enseignant)", 15);
      questions.forEach((question, index) => {
        heading(`${index + 1}. ${"ABCD"[question.answer_index]}. ${question.choices[question.answer_index]}`, 11);
        if(question.explanation) paragraph(question.explanation);
      });
    }
    const sources = String(site.sources || "").split(/\s*;\s*|\n/).filter(Boolean);
    if(sources.length){ heading("Sources"); sources.forEach(source => paragraph(`- ${source}`, 9.5)); }
    const pages = doc.getNumberOfPages();
    for(let page = 1; page <= pages; page++){
      doc.setPage(page); doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(120, 120, 120);
      doc.text(pdfText(`Kitoko Afrika - ${publicOrigin()} - page ${page}/${pages}`), margin, 292);
    }
    const blob = doc.output("blob");
    await shareFile(blob, `kitoko-afrika-${site.slug}.pdf`, `Fiche pédagogique : ${site.name}`);
  } catch(error) {
    alert("Impossible de créer le PDF : " + (error.message || error));
  } finally {
    button.disabled = false;
    button.innerHTML = `${ico("file-text")} Fiche pédagogique (PDF)`;
  }
}

// Quiz projeté en classe : grande question, choix, réponse révélée à la demande.
const classroom = { questions: [], index: 0, revealed: false, title: "" };

async function startClassroom(){
  const { country, site } = teacherSelection();
  const pool = await loadQuizPool();
  let questions = site ? pool.filter(question => question.site_id === site.id) : pool.filter(question => question.country === country);
  if(!site) questions = questions.map(question => ({ question, sort: Math.random() })).sort((a, b) => a.sort - b.sort).slice(0, 10).map(item => item.question);
  if(!questions.length){ alert("Aucune question disponible pour cette sélection (vérifiez votre connexion)."); return; }
  Object.assign(classroom, { questions, index: 0, revealed: false, title: site ? site.name : country });
  document.getElementById('classroom').hidden = false;
  renderClassroom();
}

function renderClassroom(){
  const box = document.getElementById('classroom-body');
  const question = classroom.questions[classroom.index];
  if(!question){
    box.innerHTML = `<div class="classroom-end"><h2>Bravo à toute la classe !</h2><p>${classroom.questions.length} questions sur ${esc(classroom.title)}.</p><button class="cta-btn" type="button" onclick="closeClassroom()">Terminer</button></div>`;
    return;
  }
  box.innerHTML = `
    <p class="classroom-progress">${esc(classroom.title)} · Question ${classroom.index + 1} / ${classroom.questions.length}</p>
    <h2 class="classroom-question">${esc(question.question)}</h2>
    <ol class="classroom-choices">${question.choices.map((choice, index) => `<li class="${classroom.revealed ? (index === question.answer_index ? "is-right" : "is-dim") : ""}"><span>${"ABCD"[index]}</span>${esc(choice)}</li>`).join("")}</ol>
    ${classroom.revealed && question.explanation ? `<p class="classroom-explanation">${esc(question.explanation)}</p>` : ""}
    <div class="classroom-actions">
      ${classroom.revealed
        ? `<button class="cta-btn" type="button" onclick="classroom.index++; classroom.revealed = false; renderClassroom()">Question suivante</button>`
        : `<button class="cta-btn" type="button" onclick="classroom.revealed = true; renderClassroom()">Révéler la réponse</button>`}
    </div>`;
}

function closeClassroom(){ document.getElementById('classroom').hidden = true; }

// ---------------------------------------------------------------------------
// Accueil : diaporama de sites emblématiques de tout le continent
// ---------------------------------------------------------------------------

const HERO_SLIDES = [
  "grande-mosquee-djenne", "pyramides-de-gizeh", "koutammakou", "vieille-ville-lamu", "chateau-elmina",
  "montagne-de-la-table", "ganvie", "medina-de-fes", "chutes-de-ditinn", "bois-sacre-osun-osogbo",
  "palais-royaux-abomey", "ile-de-goree", "porte-du-non-retour"
];
const hero = { sites: [], index: 0, timer: null };

function startHeroSlideshow(){
  const box = document.getElementById('hero-slides');
  if(!box) return;
  hero.sites = HERO_SLIDES.map(siteBySlug).filter(site => site && site.media_type === "image" && site.media_url);
  if(!hero.sites.length) return;
  box.innerHTML = hero.sites.map((site, index) => `<div class="hero-slide${index === 0 ? " is-active" : ""}" data-index="${index}"></div>`).join("");
  hero.index = 0;
  showHeroSlide(0);
  clearInterval(hero.timer);
  if(hero.sites.length > 1) hero.timer = setInterval(nextHeroSlide, 6000);
}

function showHeroSlide(index){
  const slides = document.querySelectorAll('#hero-slides .hero-slide');
  if(!slides.length) return;
  // Chargement progressif : l'image n'est demandée qu'au moment d'être affichée (et la suivante préparée).
  [index, (index + 1) % hero.sites.length].forEach(position => {
    const slide = slides[position];
    if(slide && !slide.style.backgroundImage) slide.style.backgroundImage = `url("${mediaSrc(hero.sites[position].media_url)}")`;
  });
  slides.forEach((slide, position) => slide.classList.toggle('is-active', position === index));
  const site = hero.sites[index];
  const caption = document.getElementById('hero-caption');
  caption.hidden = false;
  caption.innerHTML = `${flagImage(site.country_flag, "mini-flag", site.country)} <span>${esc(site.name)}</span>`;
  caption.onclick = () => openDetail(site.id);
}

function nextHeroSlide(){
  // Pas d'animation inutile quand l'accueil n'est pas affiché ou l'appli en arrière-plan.
  if(document.hidden || !document.getElementById('screen-home')?.classList.contains('active')) return;
  hero.index = (hero.index + 1) % hero.sites.length;
  showHeroSlide(hero.index);
}

// ---------------------------------------------------------------------------
// Accueil : recherche instantanée (sites, pays, circuits, fêtes)
// ---------------------------------------------------------------------------

function homeSearchResults(query){
  const term = normalizeText(query.trim());
  if(term.length < 2) return [];
  const score = (text, extra = "") => {
    const value = normalizeText(text);
    if(value.startsWith(term)) return 3;
    if(value.split(/[\s'’-]+/).some(word => word.startsWith(term))) return 2;
    if(value.includes(term)) return 1.5;
    return normalizeText(extra).includes(term) ? 1 : 0;
  };
  const results = [];
  COUNTRIES.forEach(country => {
    const value = score(country.name);
    if(value) results.push({ type: "Pays", score: value + 0.5, label: country.name, sub: `${SITES.filter(site => site.country === country.name).length} sites`, flag: country.flag, action: () => { setCountry(country.name); showScreen('screen-discover'); } });
  });
  SITES.forEach(site => {
    const value = score(site.name, [site.region, site.country, CAT_LABELS[site.cat]].join(" "));
    if(value) results.push({ type: "Site", score: value, label: site.name, sub: [site.region, site.country].filter(Boolean).join(" · "), flag: site.country_flag, action: () => openDetail(site.id) });
  });
  (typeof ITINERARIES !== "undefined" ? ITINERARIES : []).forEach(itinerary => {
    const value = score(itinerary.title, itinerary.summary);
    if(value) results.push({ type: "Circuit", score: value - 0.2, label: itinerary.title, sub: itinerary.duration || "", action: () => openItinerary(itinerary.slug) });
  });
  FESTIVALS.forEach(festival => {
    const value = score(festival.name);
    if(value && siteBySlug(festival.slug)) results.push({ type: "Fête", score: value - 0.1, label: festival.name, sub: countdownLabel(festival, nextOccurrence(festival.rule)), action: () => openSiteBySlug(festival.slug) });
  });
  const seen = new Set();
  return results.sort((a, b) => b.score - a.score || a.label.localeCompare(b.label, "fr"))
    .filter(result => { const key = result.type + result.label; if(seen.has(key)) return false; seen.add(key); return true; })
    .slice(0, 8);
}

let homeSearchItems = [];
function renderHomeSearch(){
  const input = document.getElementById('home-search');
  const box = document.getElementById('home-search-results');
  if(!input || !box) return;
  const query = input.value;
  homeSearchItems = homeSearchResults(query);
  if(query.trim().length < 2){ box.hidden = true; box.innerHTML = ""; return; }
  box.hidden = false;
  box.innerHTML = (homeSearchItems.length
    ? homeSearchItems.map((item, index) => `
      <button type="button" class="home-result" data-index="${index}">
        <span class="home-result-type">${esc(item.type)}</span>
        <span class="home-result-main"><strong>${item.flag ? flagImage(item.flag, "mini-flag", "") + " " : ""}${esc(item.label)}</strong>${item.sub ? `<span>${esc(item.sub)}</span>` : ""}</span>
      </button>`).join("")
    : `<p class="home-result-empty">Aucun résultat pour « ${esc(query.trim())} ».</p>`) +
    `<button type="button" class="home-result-all" data-all="1">${ico("search")} Chercher dans tous les sites</button>`;
}

function openHomeSearchAll(){
  const query = document.getElementById('home-search').value;
  const discover = document.getElementById('site-search');
  if(discover) discover.value = query;
  searchTerm = query;
  renderList();
  showScreen('screen-discover');
}

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('home-search');
  const box = document.getElementById('home-search-results');
  if(!input || !box) return;
  input.addEventListener('input', () => {
    renderHomeSearch();
    if(typeof loadItineraries === "function" && (typeof ITINERARIES === "undefined" || !ITINERARIES.length)) loadItineraries().then(renderHomeSearch);
  });
  input.addEventListener('keydown', event => {
    if(event.key === "Enter"){
      event.preventDefault();
      if(homeSearchItems[0]) homeSearchItems[0].action(); else openHomeSearchAll();
      input.blur();
    }
  });
  box.addEventListener('click', event => {
    const button = event.target.closest('button');
    if(!button) return;
    if(button.dataset.all) openHomeSearchAll();
    else homeSearchItems[Number(button.dataset.index)]?.action();
    input.value = "";
    renderHomeSearch();
  });
});
