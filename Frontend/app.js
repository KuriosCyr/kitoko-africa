const CAT_LABELS = { historique:"Historique", culturel:"Culturel", naturel:"Naturel", savoirs:"Savoirs", memoire:"Mémoire et récits" };
const CAT_META = {
  historique: { icon:"landmark", short:"Histoire", color:"clay" },
  culturel: { icon:"drama", short:"Culture", color:"indigo" },
  naturel: { icon:"trees", short:"Nature", color:"forest" },
  savoirs: { icon:"book-open", short:"Savoirs", color:"gold" },
  memoire: { icon:"flame", short:"Mémoire", color:"plum" }
};

// Icônes (sprite Lucide intégré dans index.html) : identiques sur tous les téléphones,
// contrairement aux émojis.
function ico(name, className = ""){
  return `<svg class="ico${className ? " " + className : ""}" aria-hidden="true"><use href="#${name}"></use></svg>`;
}
const THEME_ICONS = {
  "memoire-traite": "link", royaumes: "crown", resistances: "shield", spiritualites: "sparkles",
  architecture: "castle", artisanat: "palette", gastronomie: "utensils", "musiques-danses": "drum",
  festivals: "party-popper", langues: "languages", "faune-flore": "paw-print", eaux: "waves", marches: "shopping-basket"
};
const PARTNER_ICONS = { guide: "compass", artisan: "palette", restaurant: "utensils", hebergement: "bed-double", producteur: "wheat", activite: "users" };
const ITINERARY_ICONS = {
  "ouidah-route-de-la-memoire": "link", "royaumes-du-sud-benin": "crown", "lacs-et-marches-du-sud-benin": "waves",
  "atacora-nature-et-architecture": "paw-print", "conakry-memoire-et-vie": "landmark",
  "fouta-djallon-cascades-et-plateaux": "mountain", "sur-les-traces-du-manding": "drum"
};
function themeIcon(slug){ return ico(THEME_ICONS[slug] || "sparkle"); }
function catIcon(cat){ return ico(CAT_META[cat]?.icon || "sparkle"); }
function badgeIcon(badge){
  const slug = badge.slug || "";
  const byCategory = { "gardien-memoire": "flame", historien: "landmark", "curieux-cultures": "drama", "ami-nature": "trees", "passeur-savoirs": "book-open" };
  if(byCategory[slug]) return ico(byCategory[slug]);
  if(slug.startsWith("explorateur-")) return ico("compass");
  if(slug.startsWith("connaisseur-")) return ico("book-open");
  if(slug.startsWith("circuit-")) return ico(ITINERARY_ICONS[slug.slice(8)] || "route");
  return ico({ "premier-tampon": "sparkle", "decouvreur-ouest-africain": "earth", "ambassadeur-africain": "crown", "esprit-curieux": "lightbulb", "soutien-economie-locale": "handshake" }[slug] || "stamp");
}
const RECIT_NATURES = {
  tradition_orale: "Tradition orale",
  temoignage: "Témoignage",
  recit_communautaire: "Récit communautaire",
  interpretation: "Interprétation"
};
let THEMES = [];

// Toutes les données viennent de l'API (voir Backend/db/seed-data.js pour le contenu de démonstration).
const COUNTRIES = [];            // pays ayant au moins un site publié
const ALL_AFRICA_COUNTRIES = []; // les 54 pays (carte, formulaires)
const AVAILABLE_COUNTRIES = new Set();
const SITES = [];

// Adresse du serveur. Vide = même origine que la page (cas du site web).
// Pour l'application mobile, définir window.KITOKO_CONFIG = { apiOrigin: "https://api.exemple.org" }
// avant de charger app.js.
const API_ORIGIN = (window.KITOKO_CONFIG && window.KITOKO_CONFIG.apiOrigin || "").replace(/\/$/, "");
const API_BASE = `${API_ORIGIN}/api`;
// Adresse publique utilisée dans les liens partagés (différente dans l'application mobile).
function publicOrigin(){
  return (window.KITOKO_CONFIG && window.KITOKO_CONFIG.publicUrl || API_ORIGIN || window.location.origin).replace(/\/$/, "");
}

// Échappe le texte avant de l'insérer dans du HTML : indispensable pour tout
// contenu venant des utilisateurs (contributions, noms…), sinon du code
// malveillant pourrait s'exécuter chez les autres visiteurs.
function esc(value){
  return String(value ?? "").replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[char]));
}

function mediaSrc(url){ return url ? API_ORIGIN + url : ""; }


let currentCountry = "Bénin";
let currentCat = "toutes";
let searchTerm = "";
let currentSiteId = null;
let favorites = new Set();
let myContributions = [];
let notifications = [];
let isLoggedIn = false;
let currentUser = null;
function readStoredToken(){ try { return localStorage.getItem("kitoko_auth_token"); } catch(error) { return null; } }
function storeToken(token){
  try { token ? localStorage.setItem("kitoko_auth_token", token) : localStorage.removeItem("kitoko_auth_token"); } catch(error) { /* stockage indisponible */ }
}
let authToken = readStoredToken();
let authMode = "signup";
let mediaAttached = false;
let navHistory = [];

let pendingSubmissions = [];
let adminSites = [];
let dataLoadError = "";
let stampedSites = new Set();
let featuredAutoScrollFrame = null;
let featuredAutoScrollPaused = false;
let formMode = "add";
let editingSiteId = null;
let suggestTargetId = null;
let adminTab = "pending";

const NAV_ITEMS = [
  { id:"discover", label:"Découvrir", icon:"compass", screen:"screen-discover" },
  { id:"passport", label:"Passeport", icon:"stamp", screen:"screen-passport" },
  { id:"favorites", label:"Favoris", icon:"heart", screen:"screen-favorites" },
  { id:"contribute", label:"Contribuer", icon:"+", screen:"screen-contribute" },
  { id:"profile", label:"Profil", icon:"user", screen:"screen-profile" }
];

function catClass(cat){ return "cat-" + cat; }

// Drapeaux du prototype intégrés (affichés même hors connexion) ; les autres
// pays utilisent flagcdn.com.
const EMBEDDED_FLAGS = {
  bj: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#e8112d"/><rect width="3" height="1" fill="#fcd116"/><rect width="1.2" height="2" fill="#008751"/></svg>',
  gn: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="1" height="2" fill="#ce1126"/><rect x="1" width="1" height="2" fill="#fcd116"/><rect x="2" width="1" height="2" fill="#009460"/></svg>'
};

function flagImage(flag, className, alt = "Drapeau"){
  if(!flag || !flag.trim()) return "";
  const code = Array.from(flag).map(char =>
    String.fromCharCode(char.codePointAt(0) - 0x1F1E6 + 97)
  ).join('');
  if(!/^[a-z]{2}$/.test(code)) return "";
  const src = EMBEDDED_FLAGS[code]
    ? `data:image/svg+xml,${encodeURIComponent(EMBEDDED_FLAGS[code])}`
    : `https://flagcdn.com/w40/${code}.png`;
  // Hors connexion, un drapeau externe qui ne charge pas est simplement masqué.
  return `<img class="${esc(className || "flag-image")}" src="${src}" alt="${esc(alt)}" loading="lazy" decoding="async" onerror="this.style.display='none'">`;
}

function buildNav(containerId, activeId){
  const el = document.getElementById(containerId);
  el.innerHTML = "";
  NAV_ITEMS.forEach(item=>{
    const btn = document.createElement('button');
    btn.className = "navitem" + (item.id===activeId ? " active" : "");
    btn.innerHTML = `<span class="navicon">${ico(item.icon)}</span>${item.label}<span class="navdot"></span>`;
    btn.onclick = ()=>showScreen(item.screen);
    el.appendChild(btn);
  });
}

function showScreen(id, opts){
  opts = opts || {};
  const current = document.querySelector('.screen.active');
  if(!opts.skipHistory && current && current.id !== id){ navHistory.push(current.id); }
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  const screen = document.getElementById(id);
  screen.classList.add('active');
  // Chaque écran s'ouvre en haut (sinon la page garde la position de l'écran précédent).
  if(!current || current.id !== id) scrollScreenToTop(screen);
  document.getElementById('home-return').classList.toggle('hidden', id === 'screen-home');
  document.querySelectorAll('.persistent-nav-item').forEach(item=>{
    item.classList.toggle('active', item.dataset.screen === id);
  });
  updateAdminVisibility();
  closeMenu();
  if(id==="screen-home") renderHome();
  if(id==="screen-favorites") renderFavorites();
  if(id==="screen-profile") renderProfile();
  if(id==="screen-contribute") renderContribute();
  if(id==="screen-admin") renderAdmin();
  if(id==="screen-passport") renderPassport();
  if(id==="screen-itineraries") renderItineraries();
  if(id==="screen-partners") renderPartnerDirectory();
  if(id==="screen-partner-apply") preparePartnerForm();
  if(id==="screen-privacy") renderPrivacy();
  if(id!=="screen-scanner") stopScanner();
}

function scrollScreenToTop(screen){
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  screen?.querySelectorAll('.list,.detail-body,.form-wrap,.about-body,.contact-body,.admin-body').forEach(el => { el.scrollTop = 0; });
}

function goBack(){
  const prev = navHistory.pop();
  showScreen(prev || 'screen-home', {skipHistory:true});
}

function goBackFromDetail(){ setSiteUrl(null); goBack(); }

function openMenu(){ document.getElementById('menu-overlay').classList.add('open'); document.getElementById('menu-drawer').classList.add('open'); }
function closeMenu(){ document.getElementById('menu-overlay').classList.remove('open'); document.getElementById('menu-drawer').classList.remove('open'); }
function menuGo(id){ showScreen(id); }

// Les administrateurs gèrent directement (espace modération) ce que les
// visiteurs proposent (candidature partenaire…) : chacun voit ses propres accès.
function updateAdminVisibility(){
  const visible = Boolean(authToken && currentUser?.role === "admin");
  document.querySelectorAll('.admin-entry').forEach(item => { item.hidden = !visible; });
  document.querySelectorAll('.visitor-entry').forEach(item => { item.hidden = visible; });
}

function openAdminTab(tab){
  showScreen('screen-admin');
  switchAdminTab(tab);
}

function renderHome(){
  document.getElementById('hs-countries').textContent = COUNTRIES.length;
  document.getElementById('hs-sites').textContent = SITES.length;
  document.getElementById('qs-discover').textContent = COUNTRIES.length + " pays, " + SITES.length + " sites";
  const coveredCountries = document.getElementById('stat-countries');
  if(coveredCountries) coveredCountries.textContent = COUNTRIES.length;
  document.getElementById('qs-fav').textContent = favorites.size + " sauvegardé" + (favorites.size>1?"s":"");
  const feat = document.getElementById('featured-scroll');
  feat.innerHTML = "";
  SITES.filter(s=>s.featured).forEach(s=>{
    const c = document.createElement('div');
    c.className = "feat-card";
    c.onclick = ()=>openDetail(s.id);
    const cover = s.media_type === "image" && s.media_url ? ` style="background-image:linear-gradient(180deg,rgba(0,0,0,0) 40%,rgba(0,0,0,.55)),url('${esc(mediaSrc(s.media_url))}')"` : "";
    c.innerHTML = `<div class="feat-visual ${catClass(s.cat)}"${cover}>${esc(s.country)}</div><div class="feat-body"><p class="fn">${esc(s.name)}</p><p class="fc">${esc(s.region)}</p></div>`;
    feat.appendChild(c);
  });
  startFeaturedAutoScroll();
  setHeroImage();
}

// Image de l'accueil : photo d'un site emblématique (sinon, motif du thème).
function setHeroImage(){
  const preferred = ["porte-du-non-retour", "palais-royaux-abomey", "ganvie", "chutes-de-ditinn"];
  const site = preferred.map(slug => SITES.find(item => item.slug === slug)).find(item => item?.media_type === "image")
    || SITES.find(item => item.featured && item.media_type === "image");
  if(site) document.documentElement.style.setProperty('--hero-image', `url("${mediaSrc(site.media_url)}")`);
}

function stopFeaturedAutoScroll(){
  if(featuredAutoScrollFrame) cancelAnimationFrame(featuredAutoScrollFrame);
  featuredAutoScrollFrame = null;
}

function startFeaturedAutoScroll(){
  const strip = document.getElementById('featured-scroll');
  if(!strip || strip.children.length < 2 || strip.scrollWidth <= strip.clientWidth) return;
  stopFeaturedAutoScroll();

  let previousTime = 0;
  const move = timestamp => {
    if(!previousTime) previousTime = timestamp;
    const elapsed = timestamp - previousTime;
    previousTime = timestamp;
    if(!featuredAutoScrollPaused){
      strip.scrollLeft += elapsed * 0.028;
      if(strip.scrollLeft >= strip.scrollWidth - strip.clientWidth - 1) strip.scrollLeft = 0;
    }
    featuredAutoScrollFrame = requestAnimationFrame(move);
  };

  if(strip.dataset.autoScrollBound !== "true"){
    strip.dataset.autoScrollBound = "true";
    strip.addEventListener('pointerenter', ()=>{ featuredAutoScrollPaused = true; });
    strip.addEventListener('pointerleave', ()=>{ featuredAutoScrollPaused = false; });
    strip.addEventListener('touchstart', ()=>{
      featuredAutoScrollPaused = true;
      clearTimeout(startFeaturedAutoScroll.resumeTimer);
      startFeaturedAutoScroll.resumeTimer = setTimeout(()=>{ featuredAutoScrollPaused = false; }, 2200);
    }, { passive:true });
  }
  featuredAutoScrollFrame = requestAnimationFrame(move);
}

// Barre de lecture : suit le défilement de la fiche (bloc défilant sur mobile,
// page entière sur grand écran) et reste vide quand il n'y a rien à faire défiler.
function updateReadingProgress(){
  const body = document.getElementById('detail-body');
  const bar = document.getElementById('reading-progress-bar');
  if(!body || !bar || !document.getElementById('screen-detail').classList.contains('active')) return;
  let progress = 0;
  const inner = body.scrollHeight - body.clientHeight;
  if(inner > 4){
    progress = body.scrollTop / inner * 100;
  } else {
    const rect = body.getBoundingClientRect();
    const total = rect.height - window.innerHeight + rect.top + window.scrollY;
    if(total > 4) progress = window.scrollY / total * 100;
  }
  bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
}

// Codes ISO des 54 pays africains (drapeaux du bandeau défilant).
const AFRICA_FLAG_CODES = {
  "Algérie":"dz","Angola":"ao","Bénin":"bj","Botswana":"bw","Burkina Faso":"bf","Burundi":"bi","Cabo Verde":"cv",
  "Cameroun":"cm","Comores":"km","Congo":"cg","Côte d'Ivoire":"ci","Djibouti":"dj","Égypte":"eg","Érythrée":"er",
  "Eswatini":"sz","Éthiopie":"et","Gabon":"ga","Gambie":"gm","Ghana":"gh","Guinée":"gn","Guinée-Bissau":"gw",
  "Guinée équatoriale":"gq","Kenya":"ke","Lesotho":"ls","Libéria":"lr","Libye":"ly","Madagascar":"mg","Malawi":"mw",
  "Mali":"ml","Maroc":"ma","Maurice":"mu","Mauritanie":"mr","Mozambique":"mz","Namibie":"na","Niger":"ne",
  "Nigéria":"ng","Ouganda":"ug","République centrafricaine":"cf","République démocratique du Congo":"cd",
  "Rwanda":"rw","São Tomé-et-Príncipe":"st","Sénégal":"sn","Seychelles":"sc","Sierra Leone":"sl","Somalie":"so",
  "Soudan":"sd","Soudan du Sud":"ss","Tanzanie":"tz","Tchad":"td","Togo":"tg","Tunisie":"tn","Zambie":"zm",
  "Zimbabwe":"zw","Afrique du Sud":"za"
};

function flagFromCode(code){
  return code ? String.fromCodePoint(...[...code.toUpperCase()].map(char => 0x1F1E6 + char.charCodeAt(0) - 65)) : "";
}

// Bandeau des 54 pays : ceux du prototype en couleur et en tête, les autres
// en grisé (« bientôt »), à l'image de l'ambition du projet.
function renderFlagMarquee(){
  const track = document.getElementById('flag-marquee-track');
  if(!track) return;
  const open = new Set(COUNTRIES.map(country => country.name));
  const names = ALL_AFRICA_COUNTRIES.length ? ALL_AFRICA_COUNTRIES.map(country => country.name) : Object.keys(AFRICA_FLAG_CODES);
  const ordered = [...names.filter(name => open.has(name)), ...names.filter(name => !open.has(name)).sort((a, b) => a.localeCompare(b, 'fr'))];
  const items = ordered.map(name => {
    const available = open.has(name);
    const flag = flagFromCode(AFRICA_FLAG_CODES[name]);
    return `<span class="flag-marquee-item${available ? " is-open" : " is-soon"}" title="${esc(available ? `${name} : à découvrir` : `${name} : bientôt`)}">${flagImage(flag, "marquee-flag", `Drapeau — ${name}`)}<span>${esc(name)}</span></span>`;
  }).join('');
  track.innerHTML = items + items;
  track.style.animationDuration = `${Math.max(32, ordered.length * 2.4)}s`;
}

async function loadKitokoData(){
  document.getElementById('device')?.classList.add('is-loading');
  // Hébergement gratuit : le serveur s'endort après une période d'inactivité.
  const wakeUpTimer = setTimeout(() => {
    if(document.getElementById('wake-up-note')) return;
    const note = document.createElement('div');
    note.id = 'wake-up-note';
    note.className = 'wake-up-note';
    note.setAttribute('role', 'status');
    note.textContent = "Le serveur de démonstration se réveille… cela peut prendre jusqu'à une minute.";
    document.body.appendChild(note);
  }, 3500);
  try {
    const [countriesResponse, sitesResponse, themesResponse] = await Promise.all([
      fetch(`${API_BASE}/countries`),
      fetch(`${API_BASE}/sites`),
      fetch(`${API_BASE}/themes`)
    ]);
    if(themesResponse.ok) THEMES = (await themesResponse.json()).data || [];

    const countriesJson = await countriesResponse.json();
    const sitesJson = await sitesResponse.json();

    if(!countriesResponse.ok || !countriesJson.success){
      throw new Error(countriesJson.message || "Erreur lors du chargement des pays.");
    }

    if(!sitesResponse.ok || !sitesJson.success){
      throw new Error(sitesJson.message || "Erreur lors du chargement des sites.");
    }

    ALL_AFRICA_COUNTRIES.splice(0, ALL_AFRICA_COUNTRIES.length, ...countriesJson.data.map(country=>({
      name: country.name,
      flag: country.flag || "",
      mapId: String(country.map_id || "")
    })));
    COUNTRIES.splice(0, COUNTRIES.length, ...ALL_AFRICA_COUNTRIES.filter(country =>
      countriesJson.data.some(item => item.name === country.name && Number(item.sites_count) > 0)
    ));

    SITES.splice(0, SITES.length, ...sitesJson.data.map(site=>({
      ...site,
      cat: site.category
    })));

    AVAILABLE_COUNTRIES.clear();
    COUNTRIES.forEach(country=>AVAILABLE_COUNTRIES.add(country.mapId));
    if(COUNTRIES.length && !COUNTRIES.some(country => country.name === currentCountry)){
      currentCountry = COUNTRIES[0].name;
    }
    dataLoadError = "";
  } catch(error) {
    console.error("Impossible de charger les données Kitoko Afrika :", error);
    dataLoadError = "Impossible de charger les sites. Vérifiez votre connexion puis rechargez la page.";
  } finally {
    clearTimeout(wakeUpTimer);
    document.getElementById('wake-up-note')?.remove();
    document.getElementById('device')?.classList.remove('is-loading');
  }
}

let AFRICA_FEATURES = new Map();

async function renderRealAfricaMap(){
  if(!window.d3 || !window.topojson) return;

  try {
    // Carte embarquée (Natural Earth 1:50m, pays africains) : fonctionne hors connexion.
    const response = await fetch("vendor/africa-50m.json");
    const topology = await response.json();
    const africa = topojson.feature(topology, topology.objects.countries).features;
    const collection = { type:"FeatureCollection", features:africa };
    const projection = d3.geoNaturalEarth1().fitSize([100, 110], collection);
    const path = d3.geoPath(projection);
    AFRICA_FEATURES = new Map(africa.map(feature=>[String(feature.id).padStart(3, "0"), feature]));
    const group = document.getElementById("real-africa-map");
    group.innerHTML = "";
    africa.forEach(feature=>{
      const countryPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const mapId = String(feature.id).padStart(3, "0");
      countryPath.setAttribute("class", "real-country" + (AVAILABLE_COUNTRIES.has(mapId) ? " has-sites" : ""));
      countryPath.setAttribute("d", path(feature));
      const country = ALL_AFRICA_COUNTRIES.find(item => item.mapId === mapId);
      if(country && AVAILABLE_COUNTRIES.has(mapId)) countryPath.onclick = () => setCountry(country.name);
      group.appendChild(countryPath);
    });
    positionCountryLabels(projection, AFRICA_FEATURES);
    document.querySelector(".map-stage").classList.add("ready");
    renderCountryMap();
  } catch(error) {
    console.warn("Carte détaillée indisponible.", error);
  }
}

// Carte du pays sélectionné avec ses sites (points cliquables).
function renderCountryMap(){
  const panel = document.getElementById('country-map-panel');
  const svg = document.getElementById('country-map');
  const country = COUNTRIES.find(item => item.name === currentCountry);
  if(!panel || !svg || !country) return;
  const sites = SITES.filter(site => site.country === country.name);
  panel.hidden = false;
  document.getElementById('country-map-title').textContent = country.name;
  document.getElementById('country-map-flag').innerHTML = flagImage(country.flag, "country-map-flag-img", `Drapeau — ${country.name}`);
  document.getElementById('country-map-count').textContent = `${sites.length} site${sites.length > 1 ? "s" : ""}`;

  const feature = AFRICA_FEATURES.get(country.mapId);
  svg.innerHTML = "";
  if(!feature || !window.d3){ svg.style.display = "none"; return; }
  svg.style.display = "";
  const projection = d3.geoMercator().fitExtent([[6, 6], [94, 74]], feature);
  const path = d3.geoPath(projection);
  const ns = "http://www.w3.org/2000/svg";
  const shape = document.createElementNS(ns, "path");
  shape.setAttribute("class", "country-shape");
  shape.setAttribute("d", path(feature));
  svg.appendChild(shape);

  sites.filter(site => site.latitude != null && site.longitude != null).forEach(site => {
    const point = projection([site.longitude, site.latitude]);
    if(!point) return;
    const group = document.createElementNS(ns, "g");
    group.setAttribute("class", `site-dot site-dot-${site.cat}`);
    group.setAttribute("tabindex", "0");
    group.setAttribute("role", "button");
    group.setAttribute("aria-label", site.name);
    const circle = document.createElementNS(ns, "circle");
    circle.setAttribute("cx", point[0]);
    circle.setAttribute("cy", point[1]);
    circle.setAttribute("r", 1.8);
    const title = document.createElementNS(ns, "title");
    title.textContent = site.name;
    group.append(circle, title);
    group.onclick = () => openDetail(site.id);
    group.onkeydown = event => { if(event.key === "Enter") openDetail(site.id); };
    svg.appendChild(group);
  });
}

function positionCountryLabels(projection, countryFeatures){
  ALL_AFRICA_COUNTRIES.forEach(country=>{
    const feature = countryFeatures.get(country.mapId);
    if(!feature) return;
    const markerLocation = d3.geoCentroid(feature);
    const point = projection(markerLocation);
    if(!point) return;
    const [x, y] = point;
    const label = document.getElementById("label-" + country.mapId);
    if(label){
      label.setAttribute("x", x);
      label.setAttribute("y", y);
    }
  });
}

function buildMapAndCountryChips(){
  const labelsG = document.getElementById('map-country-labels');
  labelsG.innerHTML = "";
  ALL_AFRICA_COUNTRIES.forEach(c=>{
    const isAvailable = AVAILABLE_COUNTRIES.has(c.mapId);
    const label = document.createElementNS("http://www.w3.org/2000/svg","text");
    label.setAttribute("class", "map-country-label" + (isAvailable ? " available" : " in-progress") + (c.name===currentCountry ? " active" : ""));
    label.setAttribute("x", 50); label.setAttribute("y", 50);
    label.setAttribute("id", "label-" + c.mapId);
    label.setAttribute("text-anchor", "middle");
    label.textContent = c.name;
    label.onclick = ()=>isAvailable ? setCountry(c.name) : showCountryStatus(c.name);
    labelsG.appendChild(label);
  });

  const scroll = document.getElementById('country-scroll');
  scroll.innerHTML = "";
  COUNTRIES.forEach(c=>{
    const chip = document.createElement('div');
    chip.className = "country-chip" + (c.name===currentCountry ? " active" : "");
    chip.id = "chip-"+c.name.replace(/[^a-zA-Z]/g,'');
    chip.setAttribute('role', 'button');
    chip.setAttribute('tabindex', '0');
    chip.setAttribute('aria-label', `Choisir le pays ${c.name}`);
    chip.innerHTML = `${flagImage(c.flag, "country-flag", `Drapeau de ${c.name}`)}<span>${esc(c.name)}</span>`;
    chip.onclick = ()=>setCountry(c.name);
    chip.onkeydown = event => { if(event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setCountry(c.name); } };
    scroll.appendChild(chip);
  });

  const select = document.getElementById('in-country');
  if(select){
    const selected = select.value;
    select.innerHTML = '<option value="">Choisir un pays</option>' + countryOptions(ALL_AFRICA_COUNTRIES);
    select.value = selected;
  }
  renderFlagMarquee();
}

function countryOptions(countries){
  return countries.map(c=>`<option value="${esc(c.name)}">${esc(c.name)}</option>`).join('');
}

function showCountryStatus(countryName){
  const status = document.getElementById("country-status");
  if(!status) return;
  status.textContent = `${countryName} : En cours`;
  status.classList.add("show");
  clearTimeout(showCountryStatus.timer);
  showCountryStatus.timer = setTimeout(()=>status.classList.remove("show"), 2800);
}

function updateMapSelection(){
  COUNTRIES.forEach(c=>{
    const label = document.getElementById("label-"+c.mapId);
    if(label) label.classList.toggle("active", c.name===currentCountry);
    const chip = document.getElementById("chip-"+c.name.replace(/[^a-zA-Z]/g,''));
    if(chip) chip.classList.toggle("active", c.name===currentCountry);
  });
}

function renderChips(){
  const cats = ["toutes", "historique", "memoire", "culturel", "naturel", "savoirs"];
  const wrap = document.getElementById('chips');
  wrap.innerHTML = "";
  cats.forEach(c=>{
    const el = document.createElement('div');
    el.className = "chip" + (c===currentCat ? " active" : "");
    if(c === "toutes"){
      el.innerHTML = `<span class="cat-icon">${ico("sparkle")}</span><span>Toutes</span>`;
    } else {
      const meta = CAT_META[c];
      el.innerHTML = `<span class="cat-icon">${ico(meta.icon)}</span><span>${CAT_LABELS[c]}</span>`;
    }
    el.onclick = ()=>{ currentCat = c; renderChips(); renderList(); };
    wrap.appendChild(el);
  });
}

function siteCard(s){
  const card = document.createElement('div');
  card.className = "card";
  const isFav = favorites.has(s.id);
  card.innerHTML = `
    <div class="card-visual ${catClass(s.cat)}"${s.media_type === "image" && s.media_url ? ` style="background-image:linear-gradient(160deg,rgba(0,0,0,.15),rgba(0,0,0,.55)),url('${esc(mediaSrc(s.media_url))}')"` : ""}>${esc(CAT_LABELS[s.cat] || s.cat)}${stampedSites.has(s.id) ? `<span class="card-stamp" title="Tampon obtenu">${ico("stamp")}</span>` : ""}</div>
    <div class="card-body"><p class="name">${esc(s.name)}</p><p class="place">${esc(s.region)}</p><p class="tag">${esc(s.country)}</p></div>
    <button class="card-fav${isFav ? " is-fav" : ""}" aria-label="${isFav ? "Retirer des favoris" : "Ajouter aux favoris"}">${ico("heart")}</button>`;
  card.querySelector('.card-body').onclick = ()=>openDetail(s.id);
  card.querySelector('.card-visual').onclick = ()=>openDetail(s.id);
  card.querySelector('.card-fav').onclick = async (e)=>{
    e.stopPropagation();
    await setFavorite(s.id, !favorites.has(s.id));
    renderList(); renderFavorites();
  };
  return card;
}

function renderList(){
  const list = document.getElementById('site-list');
  list.innerHTML = "";
  const term = searchTerm.trim().toLowerCase();
  const globalSearch = term.length > 0;
  SITES.filter(s => {
    const themeNames = (s.themes || []).map(slug => THEMES.find(theme => theme.slug === slug)?.name);
    const searchable = [s.name, s.country, s.region, s.cat, CAT_LABELS[s.cat], ...themeNames].filter(Boolean).join(" ").toLowerCase();
    const matchesCountry = globalSearch || s.country === currentCountry;
    const matchesCategory = globalSearch || currentCat === "toutes" || s.cat === currentCat;
    return matchesCountry && matchesCategory && (!term || searchable.includes(term));
  }).forEach(s=> list.appendChild(siteCard(s)));
  if(dataLoadError){
    list.innerHTML = `<div class="empty"><div class="glyph">${ico("triangle-alert")}</div><h3>Données indisponibles</h3><p>${esc(dataLoadError)}</p></div>`;
  } else if(!list.children.length){
    list.innerHTML = `<div class="empty"><div class="glyph">${ico("search")}</div><h3>Aucun site trouvé</h3><p>Essayez un autre pays, une autre catégorie ou une autre recherche.</p></div>`;
  }
}

function renderFavorites(){
  const list = document.getElementById('fav-list');
  list.innerHTML = "";
  if(!authToken || !isLoggedIn){
    list.innerHTML = `<div class="empty"><div class="glyph">${ico("heart")}</div><h3>Connexion requise</h3><p>Connectez-vous pour enregistrer et retrouver vos favoris.</p></div>`;
    return;
  }
  const items = SITES.filter(s => favorites.has(s.id));
  if(items.length===0){
    list.innerHTML = `<div class="empty"><div class="glyph">${ico("heart")}</div><h3>Aucun favori pour l'instant</h3><p>Touchez le cœur sur un site pour le retrouver ici.</p></div>`;
    return;
  }
  items.forEach(s=> list.appendChild(siteCard(s)));
}

function renderProfile(){
  document.getElementById('profile-locked').style.display = isLoggedIn ? "none" : "flex";
  document.getElementById('profile-unlocked').style.display = isLoggedIn ? "flex" : "none";
  if(isLoggedIn){
    document.getElementById('pf-name').textContent = currentUser.name;
    document.getElementById('pf-email').textContent = currentUser.email;
    document.getElementById('pf-avatar').textContent = currentUser.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
    document.getElementById('stat-fav').textContent = favorites.size;
    document.getElementById('stat-contrib').textContent = myContributions.length;
    renderNotifications();
    renderMyPartners();
    renderMySites();
    renderMyContributions();
  }
}

function renderNotifications(){
  const banner = document.getElementById('notification-banner');
  if(!banner) return;
  const unread = notifications.filter(item => !item.read_at);
  banner.hidden = unread.length === 0;
  banner.textContent = unread[0]?.message || "";
  const count = document.getElementById('notification-count');
  const list = document.getElementById('notification-list');
  const readButton = document.getElementById('mark-notifications-read');
  if(count){ count.hidden = unread.length === 0; count.textContent = unread.length; }
  if(list){
    list.innerHTML = notifications.length
      ? notifications.map(item => `<div class="notification-item ${item.read_at ? '' : 'unread'}"><span>${esc(item.message)}</span><small>${esc(formatDate(item.created_at))}</small></div>`).join('')
      : '<p class="notification-empty">Aucune notification.</p>';
  }
  if(readButton) readButton.hidden = unread.length === 0;
}

// Les dates SQLite (« AAAA-MM-JJ HH:MM:SS ») sont en UTC.
function formatDate(value){
  if(!value) return "";
  const date = new Date(/Z|[+-]\d\d:?\d\d$/.test(value) ? value : String(value).replace(' ', 'T') + 'Z');
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString('fr-FR');
}

async function loadNotifications(){
  if(!authToken) return;
  try {
    const response = await fetch(`${API_BASE}/auth/notifications`, { headers: { Authorization: `Bearer ${authToken}` } });
    const result = await response.json();
    if(!response.ok || !result.success) throw new Error(result.message || "Notifications indisponibles.");
    notifications = result.data || [];
    renderNotifications();
  } catch(error) {
    console.warn("Impossible de charger les notifications.", error);
  }
}

async function markNotificationsRead(){
  if(!authToken) return;
  const response = await fetch(`${API_BASE}/auth/notifications/read`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${authToken}` }
  });
  if(!response.ok) return;
  notifications = notifications.map(item => ({ ...item, read_at: item.read_at || new Date().toISOString() }));
  renderNotifications();
}

function renderMyContributions(){
  const wrap = document.getElementById('my-contributions-list');
  if(!wrap) return;
  wrap.innerHTML = "";
  if(!isLoggedIn){ return; }

  if(myContributions.length === 0){
    wrap.innerHTML = `<p style="font-size:12.5px;color:var(--muted);">Aucune contribution envoyée. Vos propositions en attente ou publiées apparaîtront ici.</p>`;
    return;
  }

  myContributions.forEach(item => {
    const row = document.createElement('div');
    row.className = 'admin-item';
    const statusLabel = item.status === 'pending' ? 'En attente' : (item.status === 'approved' ? 'Publiée' : 'Rejetée');
    const statusClass = item.status === 'pending' ? 'badge-pending' : (item.status === 'approved' ? 'badge-approved' : 'badge-rejected');
    const category = item.category || item.cat;
    const kind = CONTRIBUTION_LABELS[item.type] || 'Contribution';
    row.innerHTML = `
      <div class="admin-head">
        <div><p class="an">${esc(item.name || 'Contribution')}</p><p class="ac">${esc([kind, item.country, category ? (CAT_LABELS[category] || category) : ''].filter(Boolean).join(' · '))}</p></div>
        <span class="admin-badge ${statusClass}">${statusLabel}</span>
      </div>
      <p class="admin-excerpt">${esc(item.description || '—')}</p>
    `;
    wrap.appendChild(row);
  });
}

let contributionType = "new";
const CONTRIBUTION_LABELS = { new: "Nouveau site", recit: "Récit ou témoignage", media: "Photo, vidéo ou son", edit: "Correction signalée" };

const CONTRIBUTION_FORMS = {
  new: {
    fields: ["f-name", "f-country", "f-region", "f-cat", "f-desc", "f-media", "f-contrib"],
    required: ["f-name", "f-country", "f-cat", "f-desc", "f-media"],
    name: "Nom du site *", desc: "Description ou récit *",
    media: "Photo ou vidéo du site *", mediaHint: "Obligatoire : elle aide l'équipe à vérifier le site.", accept: "image/*,video/*", formats: "JPG, PNG, MP4"
  },
  recit: {
    fields: ["f-site", "f-nature", "f-name", "f-desc", "f-media", "f-contrib"],
    required: ["f-site", "f-name", "f-desc"],
    name: "Titre du récit *", desc: "Votre récit ou témoignage *",
    media: "Enregistrement audio, photo ou vidéo (facultatif)", mediaHint: "Un enregistrement dans la langue d'origine est précieux.", accept: "audio/*,image/*,video/*", formats: "MP3, M4A, JPG, MP4"
  },
  media: {
    fields: ["f-site", "f-name", "f-media", "f-contrib"],
    required: ["f-site", "f-media"],
    name: "Légende (facultatif)", desc: "",
    media: "Photo, vidéo ou son *", mediaHint: "Le média rejoindra la galerie du site après vérification.", accept: "image/*,video/*,audio/*", formats: "JPG, PNG, MP4, MP3"
  },
  edit: {
    fields: ["f-site", "f-desc"],
    required: ["f-site", "f-desc"],
    name: "", desc: "Ce qui doit être corrigé ou complété *"
  }
};
const CONTRIBUTION_FIELDS = ["f-site", "f-nature", "f-name", "f-country", "f-region", "f-cat", "f-desc", "f-media", "f-contrib"];

function renderContribute(){
  document.getElementById('contribute-locked').style.display = isLoggedIn ? "none" : "flex";
  document.getElementById('contribute-form').style.display = isLoggedIn ? "flex" : "none";
  const select = document.getElementById('in-site');
  if(select){
    const selected = select.value;
    select.innerHTML = '<option value="">Choisir un site</option>' + COUNTRIES.map(country => `
      <optgroup label="${esc(country.name)}">${SITES.filter(site => site.country === country.name)
        .map(site => `<option value="${site.id}">${esc(site.name)}</option>`).join("")}</optgroup>`).join("");
    select.value = selected;
  }
  setContributionType(contributionType);
}

function setContributionType(type){
  contributionType = CONTRIBUTION_FORMS[type] ? type : "new";
  const config = CONTRIBUTION_FORMS[contributionType];
  document.querySelectorAll('.ctype').forEach(button => {
    button.classList.toggle('active', button.dataset.type === contributionType);
    button.setAttribute('aria-checked', button.dataset.type === contributionType);
  });
  CONTRIBUTION_FIELDS.forEach(id => {
    const field = document.getElementById(id);
    if(!field) return;
    field.hidden = !config.fields.includes(id);
    field.classList.remove('invalid');
    field.querySelector('.error-text')?.classList.remove('show');
  });
  if(config.name) document.getElementById('f-name-label').textContent = config.name;
  if(config.desc) document.querySelector('#f-desc label').textContent = config.desc;
  if(config.media){
    document.getElementById('f-media-label').textContent = config.media;
    document.getElementById('f-media-hint').textContent = config.mediaHint;
    document.getElementById('file-drop-sub').textContent = config.formats;
    document.getElementById('in-media').accept = config.accept;
  }
  document.getElementById('confirm-banner').classList.remove('show');
}

// Depuis une fiche : ouvre le formulaire pré-rempli pour ce site.
function openContributionFor(type){
  if(!requireLogin("Connectez-vous pour contribuer.")) return;
  const siteId = currentSiteId;
  contributionType = type;
  showScreen('screen-contribute');
  document.getElementById('in-site').value = String(siteId);
}

async function restoreAuthSession(){
  if(!authToken) return;

  try {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if(response.status === 401){
      storeToken(null);
      authToken = null;
      return;
    }
    const result = await response.json();
    if(!response.ok || !result.success) throw new Error(result.message || "Session invalide.");
    currentUser = result.user;
    isLoggedIn = true;
    updateAdminVisibility();
    await Promise.all([loadFavorites(), loadUserContributions(), loadNotifications()]);
  } catch(error) {
    // Serveur injoignable : on garde le jeton pour réessayer au prochain chargement.
    console.warn("Impossible de restaurer la session.", error);
    updateAdminVisibility();
  }
}

async function loadFavorites(){
  if(!authToken) return;
  const response = await fetch(`${API_BASE}/favorites`, {
    headers: { Authorization: `Bearer ${authToken}` }
  });
  const result = await response.json();
  if(!response.ok || !result.success) throw new Error(result.message || "Favoris indisponibles.");
  favorites = new Set(result.data);
}

async function loadUserContributions(){
  if(!authToken || !isLoggedIn) {
    myContributions = [];
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/contributions/mine`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const result = await response.json();
    if(!response.ok || !result.success) throw new Error(result.message || "Contributions indisponibles.");
    myContributions = result.data || [];
    if(isLoggedIn) renderProfile();
  } catch (error) {
    console.warn("Impossible de charger les contributions utilisateur.", error);
    myContributions = [];
  }
}

function requireLogin(message = "Connectez-vous pour continuer."){
  if(!authToken || !isLoggedIn || !currentUser){
    alert(message);
    openAuth('login');
    return false;
  }
  return true;
}

async function setFavorite(siteId, shouldAdd){
  if(!requireLogin("Connectez-vous pour enregistrer vos favoris.")) return false;
  const response = await fetch(`${API_BASE}/favorites/${siteId}`, {
    method: shouldAdd ? "POST" : "DELETE",
    headers: { Authorization: `Bearer ${authToken}` }
  });
  const result = await response.json();
  if(!response.ok || !result.success){
    alert(result.message || "Impossible de modifier les favoris.");
    return false;
  }
  if(shouldAdd) favorites.add(siteId); else favorites.delete(siteId);
  return true;
}

function switchAdminTab(tab){
  adminTab = tab;
  ['pending', 'sites', 'partners', 'users'].forEach(name => {
    document.getElementById(`admin-tab-${name}`).classList.toggle('active', tab === name);
    document.getElementById(`admin-${name}-pane`).style.display = tab === name ? 'flex' : 'none';
  });
  document.querySelector('.admin-filters').hidden = tab !== 'pending';
  if(tab==='sites') loadAdminSites();
  if(tab==='partners') loadAdminPartners();
  if(tab==='users') loadAdminUsers();
}

// Les médias des contributions non publiées sont privés : on les récupère
// avec le jeton de connexion puis on les affiche depuis la mémoire du navigateur.
async function loadProtectedMedia(container, mediaId, mediaType, label){
  try {
    const response = await fetch(`${API_BASE}/contributions/media/${encodeURIComponent(mediaId)}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if(!response.ok) throw new Error("Média indisponible.");
    const url = URL.createObjectURL(await response.blob());
    const element = document.createElement(mediaType === "video" ? "video" : (mediaType === "audio" ? "audio" : "img"));
    element.src = url;
    if(mediaType === "video" || mediaType === "audio"){ element.controls = true; element.preload = "metadata"; element.setAttribute("aria-label", label); }
    else { element.alt = label; element.loading = "lazy"; }
    container.replaceChildren(element);
  } catch(error) {
    container.textContent = "Média indisponible";
  }
}

async function renderAdmin(){
  if(!authToken || currentUser?.role !== "admin"){
    pendingSubmissions = [];
    adminSites = [];
    switchAdminTab('pending');
    document.getElementById('admin-list').innerHTML = `
      <div class="empty"><div class="glyph">${ico("lock")}</div><h3>Accès administrateur requis</h3><p>Connectez-vous avec un compte de modération pour consulter cet espace.</p><button class="cta-btn" onclick="openAuth('login')">Se connecter</button></div>
    `;
    return;
  }

  if(authToken && currentUser?.role === "admin"){
    try {
      const params = new URLSearchParams();
      [['status','admin-status-filter'],['country','admin-country-filter'],['from','admin-from-filter'],['to','admin-to-filter']].forEach(([key,id])=>{
        const value = document.getElementById(id)?.value;
        if(value) params.set(key, value);
      });
      const response = await fetch(`${API_BASE}/admin/contributions?${params}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const result = await response.json();
      if(!response.ok || !result.success) throw new Error(result.message || "Modération indisponible.");
      pendingSubmissions = result.data;
    } catch(error) {
      alert(error.message);
    }
  }
  switchAdminTab(adminTab);
  const wrap = document.getElementById('admin-list');
  wrap.innerHTML = "";
  if(!pendingSubmissions.length){
    wrap.innerHTML = `<div class="empty"><div class="glyph">${ico("check")}</div><h3>Aucune contribution</h3><p>Rien ne correspond à ces filtres pour le moment.</p></div>`;
  }
  pendingSubmissions.forEach(item=>{
    const el = document.createElement('div');
    el.className = "admin-item";
    const badgeClass = item.status==="pending" ? "badge-pending" : (item.status==="approved" ? "badge-approved" : "badge-rejected");
    const badgeText = item.status==="pending" ? "En attente" : (item.status==="approved" ? "Publié" : "Rejeté");
    const targetName = item.target_name || item.name || "site supprimé";
    const typeText = item.type === "new" ? "Nouveau site" : `${CONTRIBUTION_LABELS[item.type] || "Contribution"} — « ${targetName} »`;
    const meta = [typeText, item.country, item.cat ? (CAT_LABELS[item.cat]||item.cat) : "", item.region, item.contributor ? `par ${item.contributor}` : "", formatDate(item.created_at)].filter(Boolean).join(" · ");
    el.innerHTML = `
      <div class="admin-head">
        <div><p class="an">${esc(item.name || targetName)}</p><p class="ac">${esc(meta)}${item.nature ? ` · ${esc(RECIT_NATURES[item.nature] || item.nature)}` : ""}</p></div>
        <span class="admin-badge ${badgeClass}">${badgeText}</span>
      </div>
      <p class="admin-excerpt">${esc(item.description || "Description indisponible")}</p>
      ${item.type!=="edit" ? `<p class="admin-media">${item.media_id ? "Chargement du média…" : "Aucun média joint"}</p>` : ""}
      <div class="admin-actions"></div>
    `;
    if(item.type!=="edit" && item.media_id){
      loadProtectedMedia(el.querySelector('.admin-media'), item.media_id, item.media_type, `Média de ${item.name}`);
    }
    if(item.status==="pending"){
      const actions = el.querySelector('.admin-actions');
      const approveBtn = document.createElement('button');
      approveBtn.className = "admin-btn approve";
      approveBtn.textContent = item.type==="edit" ? "Marquer comme intégrée" : (item.type === "new" ? "Approuver et publier" : "Publier sur la fiche");
      approveBtn.onclick = ()=>{ moderateContribution(item, "approved"); };
      const rejectBtn = document.createElement('button');
      rejectBtn.className = "admin-btn reject"; rejectBtn.textContent = "Rejeter";
      rejectBtn.onclick = ()=>{ moderateContribution(item, "rejected"); };
      actions.appendChild(approveBtn); actions.appendChild(rejectBtn);
    }
    wrap.appendChild(el);
  });
}

function buildAdminCountryFilter(){
  const select = document.getElementById('admin-country-filter');
  if(!select) return;
  select.innerHTML = '<option value="">Tous les pays</option>' + countryOptions(ALL_AFRICA_COUNTRIES);
}

async function loadFilteredAdminContributions(){
  if(!authToken || currentUser?.role !== 'admin') return;
  const params = new URLSearchParams();
  [['status','admin-status-filter'],['country','admin-country-filter'],['from','admin-from-filter'],['to','admin-to-filter']].forEach(([key,id])=>{
    const value = document.getElementById(id)?.value;
    if(value) params.set(key, value);
  });
  const response = await fetch(`${API_BASE}/admin/contributions?${params}`, { headers: { Authorization: `Bearer ${authToken}` } });
  const result = await response.json();
  if(!response.ok || !result.success) return;
  pendingSubmissions = result.data || [];
  renderAdmin();
}

async function loadAdminSites(){
  if(!authToken || currentUser?.role !== "admin") return;
  try {
    const response = await fetch(`${API_BASE}/admin/sites`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const result = await response.json();
    if(!response.ok || !result.success) throw new Error(result.message || "Sites indisponibles.");
    adminSites = (result.data || []).map(site => ({ ...site, cat: site.category }));
    renderAdminSites();
  } catch(error) {
    alert(error.message);
  }
}

async function moderateContribution(item, decision){
  if(!authToken || currentUser?.role !== "admin") return;
  const response = await fetch(`${API_BASE}/admin/contributions/${item.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`
    },
    body: JSON.stringify({ decision })
  });
  const result = await response.json();
  if(!response.ok || !result.success){
    alert(result.message || "Impossible de modérer cette contribution.");
  }
  if(decision === "approved" && item.type === "new"){
    await loadKitokoData();
    buildMapAndCountryChips();
    renderList();
  }
  await renderAdmin();
}

function renderAdminSites(){
  const wrap = document.getElementById('admin-sites-list');
  wrap.innerHTML = "";
  adminSites.forEach(s=>{
    const el = document.createElement('div');
    el.className = "admin-item";
    el.innerHTML = `
      <div class="admin-head">
        <div><p class="an">${esc(s.name)}</p><p class="ac">${esc(s.country)} · ${esc(CAT_LABELS[s.cat]||s.cat)}${s.featured ? " · mis en avant" : ""} · ${s.owner_id ? "issu d'une contribution" : "contenu éditorial"} · ${s.quiz_count} question${s.quiz_count > 1 ? "s" : ""}</p></div>
        <div class="admin-badges">${s.status === "draft" ? '<span class="admin-badge badge-rejected">Brouillon</span>' : '<span class="admin-badge badge-approved">Publié</span>'}${s.verification_status === "verifie" ? "" : '<span class="admin-badge badge-pending">À vérifier</span>'}</div>
      </div>
      <div class="admin-actions"></div>
    `;
    const actions = el.querySelector('.admin-actions');
    const editBtn = document.createElement('button');
    editBtn.className = "admin-btn approve"; editBtn.textContent = "Modifier";
    editBtn.onclick = ()=>openSiteForm('edit', s.id);
    const delBtn = document.createElement('button');
    delBtn.className = "admin-btn reject"; delBtn.textContent = "Supprimer";
    delBtn.onclick = ()=>deleteSite(s.id);
    actions.appendChild(editBtn); actions.appendChild(delBtn);
    wrap.appendChild(el);
  });
}

async function deleteSite(id){
  if(!confirm("Supprimer définitivement ce site ?")) return;
  const response = await fetch(`${API_BASE}/admin/sites/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${authToken}` }
  });
  const result = await response.json();
  if(!response.ok || !result.success){
    alert(result.message || "Impossible de supprimer le site.");
    return;
  }
  await loadKitokoData();
  buildMapAndCountryChips();
  renderList();
  renderHome();
  renderMySites();
  await loadAdminSites();
}

const SITE_FORM_FIELDS = {
  'sf-name': 'name', 'sf-region': 'region', 'sf-description': 'description', 'sf-histoire': 'histoire',
  'sf-culture': 'culture', 'sf-savoirs': 'savoirs', 'sf-communities': 'communities', 'sf-langues': 'langues',
  'sf-personnalites': 'personnalites', 'sf-infos': 'infos_pratiques', 'sf-documented': 'documented_by',
  'sf-latitude': 'latitude', 'sf-longitude': 'longitude', 'sf-radius': 'checkin_radius_m'
};

async function openSiteForm(mode, siteId){
  formMode = mode;
  editingSiteId = siteId || null;
  document.getElementById('sf-title').textContent = mode==='add' ? "Ajouter un site" : "Modifier le site";
  document.getElementById('sf-country').innerHTML = countryOptions(ALL_AFRICA_COUNTRIES);
  document.getElementById('sf-themes').innerHTML = THEMES.map(theme => `
    <label class="checkbox-label"><input type="checkbox" value="${esc(theme.slug)}"> ${themeIcon(theme.slug)} ${esc(theme.name)}</label>`).join("");
  document.getElementById('sf-tools').innerHTML = "";

  let site = null;
  if(mode==='edit'){
    try {
      const response = await fetch(`${API_BASE}/admin/sites/${siteId}`, { headers: { Authorization: `Bearer ${authToken}` } });
      const result = await response.json();
      if(!response.ok || !result.success) throw new Error(result.message);
      site = { ...result.data, cat: result.data.category };
    } catch(error) {
      alert(error.message || "Impossible de charger la fiche.");
      return;
    }
  }

  Object.entries(SITE_FORM_FIELDS).forEach(([id, field]) => {
    document.getElementById(id).value = site?.[field] ?? "";
  });
  document.getElementById('sf-country').value = site?.country || COUNTRIES[0]?.name || "";
  document.getElementById('sf-cat').value = site?.cat || "historique";
  document.getElementById('sf-status').value = site?.status || "published";
  document.getElementById('sf-verification').value = site?.verification_status || "verifie";
  document.getElementById('sf-sources').value = (site?.sources || "").split(" ; ").join("\n");
  document.getElementById('sf-featured').checked = Boolean(site?.featured);
  document.getElementById('sf-chronologie').value = (site?.chronologie || []).map(item => `${item.date} | ${item.event}`).join("\n");
  document.getElementById('sf-a-voir').value = (site?.a_voir || []).map(item => item.title ? `${item.title} | ${item.text}` : item.text).join("\n");
  document.getElementById('sf-saviez').value = (site?.saviez_vous || []).join("\n");
  document.querySelectorAll('#sf-themes input').forEach(input => { input.checked = Boolean(site?.themes?.some(theme => (theme.slug || theme) === input.value)); });

  if(document.querySelector('.screen.active')?.id !== 'screen-site-form') showScreen('screen-site-form');
  if(site) renderSiteTools(site);
}

async function saveSiteForm(){
  const data = Object.fromEntries(Object.entries(SITE_FORM_FIELDS).map(([id, field]) => [field, document.getElementById(id).value.trim()]));
  Object.assign(data, {
    country: document.getElementById('sf-country').value,
    cat: document.getElementById('sf-cat').value,
    status: document.getElementById('sf-status').value,
    verification_status: document.getElementById('sf-verification').value,
    sources: document.getElementById('sf-sources').value.trim(),
    featured: document.getElementById('sf-featured').checked,
    chronologie_text: document.getElementById('sf-chronologie').value,
    a_voir_text: document.getElementById('sf-a-voir').value,
    saviez_vous_text: document.getElementById('sf-saviez').value,
    themes: [...document.querySelectorAll('#sf-themes input:checked')].map(input => input.value)
  });
  if(!data.name || !data.country){ alert("Le nom et le pays sont obligatoires."); return; }
  if(!authToken || currentUser?.role !== "admin"){
    alert("Accès administrateur requis.");
    return;
  }

  const response = await fetch(`${API_BASE}/admin/sites${formMode==='edit' ? `/${editingSiteId}` : ""}`, {
    method: formMode==='edit' ? "PATCH" : "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`
    },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  if(!response.ok || !result.success){
    alert(result.message || "Impossible d'enregistrer le site.");
    return;
  }

  await loadKitokoData();
  buildMapAndCountryChips();
  renderList();
  renderHome();
  loadAdminSites();
  // On reste sur la fiche : QR code, galerie, quiz et récits sont gérés juste en dessous.
  const created = formMode === 'add';
  await openSiteForm('edit', result.data.id);
  alert(created ? "Site créé. Vous pouvez maintenant ajouter photos, quiz et récits, et imprimer son QR code." : "Fiche enregistrée.");
}

function renderMySites(){
  const wrap = document.getElementById('my-sites-list');
  if(!wrap) return;
  wrap.innerHTML = "";
  if(!isLoggedIn){ return; }
  const mine = SITES.filter(s=>s.owner_id===currentUser.id);
  if(mine.length===0){
    wrap.innerHTML = `<p style="font-size:12.5px;color:var(--muted);">Aucun site publié à votre nom pour l'instant — vos contributions approuvées apparaîtront ici.</p>`;
    return;
  }
  mine.forEach(s=>{
    const row = document.createElement('div');
    row.className = "admin-item";
    row.innerHTML = `<div class="admin-head"><div><p class="an">${esc(s.name)}</p><p class="ac">${esc(s.country)} · ${esc(CAT_LABELS[s.cat]||s.cat)}</p></div></div><div class="admin-actions"></div>`;
    const actions = row.querySelector('.admin-actions');
    const viewBtn = document.createElement('button');
    viewBtn.className = "admin-btn approve"; viewBtn.textContent = "Voir la fiche";
    viewBtn.onclick = ()=>openDetail(s.id);
    actions.appendChild(viewBtn);
    // Un contributeur passe par « Suggérer une modification » ; seul un
    // administrateur modifie ou supprime directement une fiche.
    if(currentUser.role === "admin"){
      const editBtn = document.createElement('button');
      editBtn.className = "admin-btn approve"; editBtn.textContent = "Modifier";
      editBtn.onclick = ()=>openSiteForm('edit', s.id);
      const delBtn = document.createElement('button');
      delBtn.className = "admin-btn reject"; delBtn.textContent = "Supprimer";
      delBtn.onclick = ()=>deleteSite(s.id);
      actions.appendChild(editBtn); actions.appendChild(delBtn);
    }
    wrap.appendChild(row);
  });
}

function openSuggestEdit(){
  if(!requireLogin("Connectez-vous pour suggérer une modification.")) return;
  const s = SITES.find(x=>x.id===currentSiteId);
  if(!s) return;
  suggestTargetId = currentSiteId;
  document.getElementById('se-target').textContent = "Concernant : " + s.name;
  document.getElementById('se-text').value = "";
  document.getElementById('se-error').classList.remove('show');
  showScreen('screen-suggest-edit');
}

async function submitSuggestEdit(){
  const text = document.getElementById('se-text').value.trim();
  if(!text){ document.getElementById('se-error').classList.add('show'); return; }
  if(!requireLogin("Connectez-vous pour suggérer une modification.")) return;
  try {
    const response = await fetch(`${API_BASE}/contributions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({ type: "edit", site_id: suggestTargetId, description: text })
    });
    const result = await response.json();
    if(!response.ok || !result.success) throw new Error(result.message || "Impossible d'envoyer la suggestion.");
  } catch(error) {
    alert(error.message);
    return;
  }
  await loadUserContributions();
  alert("Merci ! Votre suggestion a été envoyée à l'équipe de modération.");
  goBack();
}

function setCountry(country){
  currentCountry = country;
  currentCat = "toutes";
  updateMapSelection();
  renderChips();
  renderList();
  renderCountryMap();
}

let currentSiteDetail = null;

// Ouvre une fiche : affichage immédiat avec les données de la liste, puis
// chargement des éléments complets (galerie, récits, thèmes, lieux associés).
async function openDetail(id, options = {}){
  const s = SITES.find(x=>x.id===id);
  if(!s) return;
  currentSiteId = id;
  currentSiteDetail = null;
  renderDetailBasics(s);
  setTab(options.tab || 'apercu', document.querySelector(`.dtab[data-pane="${options.tab || 'apercu'}"]`));
  requestAnimationFrame(updateReadingProgress);
  if(document.querySelector('.screen.active')?.id !== 'screen-detail') showScreen('screen-detail');
  // Une fiche s'ouvre toujours en haut : photo, titre puis contenu.
  scrollScreenToTop(document.getElementById('screen-detail'));
  requestAnimationFrame(() => scrollScreenToTop(document.getElementById('screen-detail')));
  if(options.updateUrl !== false) setSiteUrl(s.slug);

  try {
    const response = await fetch(`${API_BASE}/sites/${encodeURIComponent(id)}`);
    const result = await response.json();
    if(!response.ok || !result.success) throw new Error(result.message);
    if(currentSiteId !== id) return;
    currentSiteDetail = { ...result.data, cat: result.data.category };
    renderDetailExtras(currentSiteDetail);
    if(document.getElementById('pane-passeport').classList.contains('active')) renderDetailPassport();
  } catch(error) {
    console.warn("Détails du site indisponibles.", error);
  }
}

// Reflète la fiche ouverte dans l'adresse (partage, retour arrière).
function setSiteUrl(slug){
  try {
    const url = new URL(window.location.href);
    if(slug) url.searchParams.set('site', slug); else url.searchParams.delete('site');
    url.searchParams.delete('scan');
    window.history.replaceState(null, "", url.pathname + url.search);
  } catch(error) { /* navigation sans historique */ }
}

function renderDetailBasics(s){
  document.getElementById('detail-name').textContent = s.name;
  document.getElementById('detail-loc').textContent = [s.region, s.country].filter(Boolean).join(" · ");
  document.getElementById('detail-kicker').innerHTML = `${flagImage(s.country_flag, "detail-flag", `Drapeau — ${s.country}`)} ${catIcon(s.cat)} ${esc(CAT_LABELS[s.cat] || s.cat)}`;
  const hero = document.getElementById('detail-hero');
  hero.className = "detail-hero " + catClass(s.cat);
  hero.style.backgroundImage = s.media_type === "image" && s.media_url
    ? `linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.65)),url("${mediaSrc(s.media_url)}")`
    : "";
  ['communities','langues','personnalites','infos_pratiques'].forEach(field=>{
    document.getElementById('detail-' + field).textContent = s[field] || "—";
  });
  ['description','histoire','culture','savoirs'].forEach(field=>{
    document.getElementById('detail-' + field).innerHTML = richText(s[field]);
  });
  renderSiteExtras(s);
  const sources = document.getElementById('detail-sources');
  sources.innerHTML = (s.sources || "").split(" ; ").filter(Boolean).map(source => `<li>${esc(source)}</li>`).join("") || "<li>—</li>";
  document.getElementById('detail-documented').textContent = s.documented_by || "Équipe Kitoko Afrika";
  document.getElementById('detail-dates').textContent = [
    s.created_at ? `Créée le ${formatDate(s.created_at)}` : "",
    s.updated_at ? `mise à jour le ${formatDate(s.updated_at)}` : ""
  ].filter(Boolean).join(", ") || "—";

  const status = document.getElementById('detail-status');
  status.hidden = s.verification_status === "verifie";
  status.innerHTML = s.verification_status === "verifie" ? "" : `<strong>Contenu en cours de vérification.</strong> Cette fiche n'a pas encore été validée par l'équipe de vérification. Une erreur ? <button type="button" class="link-btn" onclick="openSuggestEdit()">Signalez-la</button>.`;

  const directions = document.getElementById('detail-directions');
  if(s.latitude != null && s.longitude != null){
    directions.href = `https://www.google.com/maps/dir/?api=1&destination=${s.latitude},${s.longitude}`;
    directions.hidden = false;
  } else {
    directions.hidden = true;
  }

  document.getElementById('detail-themes').innerHTML = (s.themes || []).map(slug => {
    const theme = THEMES.find(item => item.slug === slug);
    return theme ? `<span class="theme-chip">${themeIcon(slug)} ${esc(theme.name)}</span>` : "";
  }).join("");
  document.getElementById('detail-media').innerHTML = "";
  document.getElementById('detail-recits').innerHTML = '<p class="pane-empty">Chargement…</p>';
  document.getElementById('recits-count').textContent = "";
  document.getElementById('detail-related-block').hidden = true;
  document.getElementById('detail-passport').innerHTML = "";
  document.getElementById('fav-btn').classList.toggle('active', favorites.has(s.id));
}

// Texte long : paragraphes séparés par une ligne vide, « ### » pour un intertitre.
function richText(text){
  if(!text) return "<p>—</p>";
  return String(text).split(/\n\s*\n/).map(block => {
    const trimmed = block.trim();
    if(trimmed.startsWith("### ")) {
      const [title, ...rest] = trimmed.split("\n");
      return `<h4>${esc(title.slice(4))}</h4>${rest.length ? `<p>${esc(rest.join(" "))}</p>` : ""}`;
    }
    return `<p>${esc(trimmed).replace(/\n/g, "<br>")}</p>`;
  }).join("");
}

function renderSiteExtras(site){
  const chrono = site.chronologie || [];
  document.getElementById('detail-chrono-block').hidden = !chrono.length;
  document.getElementById('detail-chrono').innerHTML = chrono.map(item => `<li><span class="timeline-date">${esc(item.date)}</span><span class="timeline-event">${esc(item.event)}</span></li>`).join("");
  const places = site.a_voir || [];
  document.getElementById('detail-a-voir-block').hidden = !places.length;
  document.getElementById('detail-a-voir').innerHTML = places.map(item => `<li>${item.title ? `<strong>${esc(item.title)}</strong>` : ""}<span>${esc(item.text)}</span></li>`).join("");
  const facts = site.saviez_vous || [];
  document.getElementById('detail-saviez-block').hidden = !facts.length;
  document.getElementById('detail-saviez').innerHTML = facts.map(fact => `<p>${esc(fact)}</p>`).join("");
}

function mediaElement(item, label){
  const src = esc(mediaSrc(item.url || item.media_url));
  const type = item.type || item.media_type;
  if(type === "video") return `<video controls preload="metadata" src="${src}" aria-label="${esc(label)}"></video>`;
  if(type === "audio") return `<audio controls preload="none" src="${src}" aria-label="${esc(label)}"></audio>`;
  return `<img src="${src}" alt="${esc(label)}" loading="lazy">`;
}

function renderDetailExtras(site){
  const visuals = site.media.filter(item => item.type !== "audio");
  const sounds = site.media.filter(item => item.type === "audio");
  document.getElementById('detail-media').innerHTML = visuals.length || sounds.length ? `
    ${visuals.length ? `<div class="gallery">${visuals.map(item => `
      <figure class="gallery-item">${mediaElement(item, item.title || `Média — ${site.name}`)}
        ${item.author || item.rights ? `<figcaption>${item.title ? `${esc(item.title)}<br>` : ""}Photo : ${esc(item.author || "—")}${item.rights ? ` · ${esc(item.rights)}` : ""}${item.source_url ? ` · <a href="${esc(item.source_url)}" target="_blank" rel="noopener">source</a>` : ""}</figcaption>` : ""}
      </figure>`).join("")}</div>` : ""}
    ${sounds.map(item => `<div class="audio-item"><span>${ico("headphones")} ${esc(item.title || "Écouter")}${item.author ? ` · ${esc(item.author)}` : ""}</span>${mediaElement(item, item.title || "Audio")}</div>`).join("")}
  ` : "";

  document.getElementById('recits-count').textContent = site.recits.length ? site.recits.length : "";
  document.getElementById('detail-recits').innerHTML = site.recits.length
    ? site.recits.map(recit => `
      <article class="recit recit-${esc(recit.nature)}">
        <span class="recit-nature">${esc(RECIT_NATURES[recit.nature] || recit.nature)}</span>
        <h4>${esc(recit.title)}</h4>
        <p>${esc(recit.body)}</p>
        ${recit.media_url ? mediaElement(recit, recit.title) : ""}
        ${recit.author_name ? `<p class="recit-author">— ${esc(recit.author_name)}</p>` : ""}
      </article>`).join("")
    : '<p class="pane-empty">Aucun récit pour l\'instant. Vous connaissez une histoire, une légende ou un souvenir lié à ce lieu ? Partagez-le.</p>';

  renderSitePartners(site.partners || []);
  updateTripButton();

  const related = document.getElementById('detail-related');
  document.getElementById('detail-related-block').hidden = !site.related.length;
  related.innerHTML = "";
  site.related.forEach(item => {
    const button = document.createElement('button');
    button.type = "button";
    button.className = "related-item";
    button.innerHTML = `<span class="related-dot ${catClass(item.category)}"></span><span>${esc(item.name)}</span><small>${esc(String(item.distance_km).replace('.', ','))} km</small>`;
    button.onclick = () => openDetail(item.id);
    related.appendChild(button);
  });
}

async function shareCurrentSite(){
  const site = SITES.find(item => item.id === currentSiteId);
  if(!site) return;
  const url = `${publicOrigin()}/s/${encodeURIComponent(site.slug)}`;
  const data = { title: `${site.name} — Kitoko Afrika`, text: site.description || site.name, url };
  try {
    if(navigator.share) { await navigator.share(data); return; }
    await navigator.clipboard.writeText(url);
    alert("Lien copié : vous pouvez le coller dans un message.");
  } catch(error) {
    if(error?.name !== "AbortError") prompt("Copiez ce lien :", url);
  }
}

function openPassportTab(){
  setTab('passeport', document.querySelector('.dtab[data-pane="passeport"]'));
}

async function toggleFav(){
  if(!requireLogin("Connectez-vous pour enregistrer ce site en favori.")){
    return;
  }
  await setFavorite(currentSiteId, !favorites.has(currentSiteId));
  document.getElementById('fav-btn').classList.toggle('active', favorites.has(currentSiteId));
  renderList();
  renderFavorites();
}

function setTab(pane, el){
  document.querySelectorAll('.dtab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.dpane').forEach(p=>p.classList.remove('active'));
  el?.classList.add('active');
  // Centre l'onglet dans sa barre sans faire défiler la page.
  const tabs = el?.parentElement;
  if(tabs) tabs.scrollLeft = el.offsetLeft - (tabs.clientWidth - el.offsetWidth) / 2;
  document.getElementById('pane-'+pane).classList.add('active');
  // La galerie accompagne l'aperçu ; les autres onglets vont droit au contenu.
  document.getElementById('detail-media').hidden = pane !== 'apercu';
  requestAnimationFrame(updateReadingProgress);
  if(pane === 'passeport') renderDetailPassport();
}

function onMediaSelected(){
  const input = document.getElementById('in-media');
  const drop = document.getElementById('file-drop');
  const text = document.getElementById('file-drop-text');
  if(input.files && input.files.length>0){
    const file = input.files[0];
    const maxSize = 20 * 1024 * 1024;
    const allowed = (CONTRIBUTION_FORMS[contributionType].accept || "").split(",").some(prefix => file.type.startsWith(prefix.replace("*", "")));
    if(file.size > maxSize || !allowed){
      input.value = "";
      mediaAttached = false;
      alert("Choisissez un fichier du type demandé, de 20 Mo maximum.");
      return;
    }
    mediaAttached = true;
    drop.classList.add('filled');
    text.textContent = file.name;
    document.getElementById('media-preview')?.remove();
    const tag = file.type.startsWith('video/') ? 'video' : (file.type.startsWith('audio/') ? 'audio' : 'img');
    const preview = document.createElement(tag);
    preview.id = 'media-preview';
    preview.className = 'media-preview';
    preview.src = URL.createObjectURL(file);
    if(tag === 'img') preview.alt = `Aperçu de ${file.name}`;
    else preview.controls = true;
    drop.after(preview);
    document.getElementById('f-media').classList.remove('invalid');
    document.getElementById('f-media').querySelector('.error-text').classList.remove('show');
  }
}

async function submitContribution(){
  const config = CONTRIBUTION_FORMS[contributionType];
  let valid = true;
  config.required.forEach(id=>{
    const wrap = document.getElementById(id);
    const err = wrap.querySelector('.error-text');
    const filled = id === "f-media" ? mediaAttached : Boolean(wrap.querySelector('input,select,textarea').value.trim());
    wrap.classList.toggle('invalid', !filled);
    err?.classList.toggle('show', !filled);
    if(!filled) valid = false;
  });
  if(!valid) return;
  if(!requireLogin("Connectez-vous pour envoyer une contribution.")) return;

  const value = id => document.getElementById(id).value.trim();
  const formData = new FormData();
  formData.append("type", contributionType);
  if(contributionType === "new"){
    formData.append("name", value('in-name'));
    formData.append("country", value('in-country'));
    formData.append("category", value('in-cat'));
    formData.append("region", value('in-region'));
  } else {
    formData.append("site_id", value('in-site'));
    formData.append("name", value('in-name'));
  }
  if(contributionType === "recit") formData.append("nature", value('in-nature'));
  if(config.fields.includes("f-desc")) formData.append("description", value('in-desc'));
  if(config.fields.includes("f-contrib")) formData.append("credit_name", value('in-contrib'));
  const file = document.getElementById('in-media').files[0];
  if(file && config.fields.includes("f-media")) formData.append("media", file);

  const submitButton = document.getElementById('contribute-submit');
  submitButton.disabled = true;
  try {
    const response = await fetch(`${API_BASE}/contributions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${authToken}` },
      body: formData
    });
    const result = await response.json();
    if(!response.ok || !result.success) throw new Error(result.message || "Impossible d'envoyer la contribution.");
  } catch(error) {
    alert(error.message || "Impossible d'envoyer la contribution.");
    return;
  } finally {
    submitButton.disabled = false;
  }

  await loadUserContributions();
  ['in-name','in-region','in-desc','in-contrib'].forEach(id=>document.getElementById(id).value = "");
  ['in-country','in-cat','in-site'].forEach(id=>document.getElementById(id).value = "");
  document.getElementById('in-media').value = "";
  document.getElementById('media-preview')?.remove();
  mediaAttached = false;
  document.getElementById('file-drop').classList.remove('filled');
  document.getElementById('file-drop-text').textContent = "Ajouter un fichier";
  document.getElementById('confirm-banner').classList.add('show');
  document.getElementById('confirm-banner').scrollIntoView({ block: "center", behavior: "smooth" });
}

function openAuth(mode){ switchAuthTab(mode); showScreen('screen-auth'); }

function switchAuthTab(mode){
  authMode = mode;
  document.getElementById('tab-signup').classList.toggle('active', mode==='signup');
  document.getElementById('tab-login').classList.toggle('active', mode==='login');
  document.getElementById('auth-title').textContent = mode==='signup' ? "Créer un compte" : "Se connecter";
  document.getElementById('auth-submit').textContent = mode==='signup' ? "Créer mon compte" : "Me connecter";
  document.getElementById('af-name').style.display = mode==='signup' ? "block" : "none";
}

async function submitAuth(){
  const fields = authMode==='signup' ? ["af-name","af-email","af-pass"] : ["af-email","af-pass"];
  let valid = true;
  fields.forEach(id=>{
    const wrap = document.getElementById(id);
    const input = wrap.querySelector('input');
    const err = wrap.querySelector('.error-text');
    if(!input.value.trim()){ wrap.classList.add('invalid'); err.classList.add('show'); valid=false; }
    else { wrap.classList.remove('invalid'); err.classList.remove('show'); }
  });
  if(!valid) return;
  const payload = {
    email: document.getElementById('auth-email').value.trim(),
    password: document.getElementById('auth-pass').value
  };
  if(authMode === 'signup') payload.name = document.getElementById('auth-name').value.trim();

  try {
    const response = await fetch(`${API_BASE}/auth/${authMode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if(!response.ok || !result.success) throw new Error(result.message || "Authentification impossible.");
    authToken = result.token;
    currentUser = result.user;
    isLoggedIn = true;
    updateAdminVisibility();
    storeToken(authToken);
    await Promise.all([loadFavorites(), loadUserContributions(), loadNotifications(), loadStampedSites()]);
    // Retour à la fiche si la connexion a été demandée depuis celle-ci (ex. scan d'un QR code).
    if(currentSiteId && navHistory[navHistory.length - 1] === 'screen-detail'){
      showScreen('screen-detail');
      renderDetailPassport();
    } else {
      showScreen('screen-profile');
    }
  } catch(error) {
    alert(error.message);
  }
}

async function logout(){
  if(authToken){
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` }
      });
    } catch (error) {
      console.warn("Déconnexion API impossible, suppression locale uniquement.", error);
    }
  }
  storeToken(null);
  authToken = null;
  isLoggedIn = false;
  currentUser = null;
  updateAdminVisibility();
  favorites = new Set();
  myContributions = [];
  notifications = [];
  stampedSites = new Set();
  passportData = null;
  renderList();
  renderHome();
  renderFavorites();
  renderProfile();
  showScreen('screen-home');
}

function sendContactMessage(){
  const message = document.getElementById('contact-message').value.trim();
  if(!message){ alert("Écrivez votre message avant de l'envoyer."); return; }
  window.location.href = `mailto:contact@kitokoafrika.org?subject=${encodeURIComponent("Message depuis Kitoko Afrika")}&body=${encodeURIComponent(message)}`;
}

async function bootstrap(){
  const search = document.getElementById('site-search');
  if(search) search.addEventListener('input', event => { searchTerm = event.target.value; renderList(); });
  ['admin-status-filter','admin-country-filter','admin-from-filter','admin-to-filter'].forEach(id => document.getElementById(id)?.addEventListener('change', loadFilteredAdminContributions));
  document.getElementById('detail-body')?.addEventListener('scroll', updateReadingProgress, { passive: true });
  window.addEventListener('scroll', updateReadingProgress, { passive: true });
  await loadKitokoData();
  buildAdminCountryFilter();
  await restoreAuthSession();
  buildNav('nav-discover','discover');
  buildNav('nav-favorites','favorites');
  buildNav('nav-contribute','contribute');
  buildNav('nav-profile','profile');
  buildMapAndCountryChips();
  renderChips();
  renderList();
  renderHome();
  renderRealAfricaMap();
  updateAdminVisibility();
  await loadStampedSites();
  openSiteFromUrl();
  registerServiceWorker();
}

// Ouvre la fiche demandée dans l'adresse : lien partagé (?site=slug) ou
// scan d'un QR code sur place (?site=slug&scan=1, qui ouvre l'onglet Passeport).
function openSiteFromUrl(){
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('site');
  if(!slug) return;
  const site = SITES.find(item => item.slug === slug || String(item.id) === slug);
  if(!site){
    alert("Ce site n'est pas (ou plus) disponible.");
    setSiteUrl(null);
    return;
  }
  const scanned = params.get('scan') === '1';
  openDetail(site.id, { tab: scanned ? 'passeport' : 'apercu', updateUrl: false });
  if(scanned) arrivedFromQr = true;
}

// Mode hors connexion : les pages et fiches déjà consultées restent disponibles.
function registerServiceWorker(){
  if(!('serviceWorker' in navigator)) return;
  if(location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') return;
  navigator.serviceWorker.register('sw.js').catch(error => console.warn("Mode hors connexion indisponible.", error));
}

document.addEventListener('DOMContentLoaded', bootstrap);