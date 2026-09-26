const CAT_LABELS = { historique:"Historique", culturel:"Culturel", naturel:"Naturel", savoirs:"Savoirs" };
const CAT_META = {
  historique: { icon:"🏛️", short:"Histoire", color:"clay" },
  culturel: { icon:"🎭", short:"Culture", color:"indigo" },
  naturel: { icon:"🌿", short:"Nature", color:"forest" },
  savoirs: { icon:"🧺", short:"Savoirs", color:"gold" }
};

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
let featuredAutoScrollFrame = null;
let featuredAutoScrollPaused = false;
let formMode = "add";
let editingSiteId = null;
let suggestTargetId = null;
let adminTab = "pending";

const NAV_ITEMS = [
  { id:"discover", label:"Découvrir", icon:"◎", screen:"screen-discover" },
  { id:"favorites", label:"Favoris", icon:"♥", screen:"screen-favorites" },
  { id:"contribute", label:"Contribuer", icon:"+", screen:"screen-contribute" },
  { id:"profile", label:"Profil", icon:"○", screen:"screen-profile" }
];

function catClass(cat){ return "cat-" + cat; }

function flagImage(flag, className, alt = "Drapeau"){ 
  if(!flag || !flag.trim()) return "";
  const code = Array.from(flag).map(char =>
    String.fromCharCode(char.codePointAt(0) - 0x1F1E6 + 97)
  ).join('');
  if(!/^[a-z]{2}$/.test(code)) return "";
  return `<img class="${esc(className || "flag-image")}" src="https://flagcdn.com/w40/${code}.png" alt="${esc(alt)}" loading="lazy" decoding="async">`;
}

function buildNav(containerId, activeId){
  const el = document.getElementById(containerId);
  el.innerHTML = "";
  NAV_ITEMS.forEach(item=>{
    const btn = document.createElement('button');
    btn.className = "navitem" + (item.id===activeId ? " active" : "");
    btn.innerHTML = `<span class="navicon">${item.icon}</span>${item.label}<span class="navdot"></span>`;
    btn.onclick = ()=>showScreen(item.screen);
    el.appendChild(btn);
  });
}

function showScreen(id, opts){
  opts = opts || {};
  const current = document.querySelector('.screen.active');
  if(!opts.skipHistory && current && current.id !== id){ navHistory.push(current.id); }
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
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
}

function goBack(){
  const prev = navHistory.pop();
  showScreen(prev || 'screen-home', {skipHistory:true});
}

function goBackFromDetail(){ goBack(); }

function openMenu(){ document.getElementById('menu-overlay').classList.add('open'); document.getElementById('menu-drawer').classList.add('open'); }
function closeMenu(){ document.getElementById('menu-overlay').classList.remove('open'); document.getElementById('menu-drawer').classList.remove('open'); }
function menuGo(id){ showScreen(id); }

function updateAdminVisibility(){
  const visible = Boolean(authToken && currentUser?.role === "admin");
  document.querySelectorAll('.admin-entry').forEach(item => { item.hidden = !visible; });
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
    c.innerHTML = `<div class="feat-visual ${catClass(s.cat)}">${esc(s.country)}</div><div class="feat-body"><p class="fn">${esc(s.name)}</p><p class="fc">${esc(s.region)}</p></div>`;
    feat.appendChild(c);
  });
  startFeaturedAutoScroll();
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

function updateReadingProgress(){
  const body = document.getElementById('detail-body');
  const bar = document.getElementById('reading-progress-bar');
  if(!body || !bar) return;
  const available = body.scrollHeight - body.clientHeight;
  const progress = available > 0 ? (body.scrollTop / available) * 100 : 100;
  bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
}

function renderFlagMarquee(){
  const track = document.getElementById('flag-marquee-track');
  if(!track) return;
  const items = COUNTRIES.map(country => `
    <span class="flag-marquee-item">${flagImage(country.flag, "marquee-flag")}<span>${esc(country.name)}</span></span>
  `).join('');
  track.innerHTML = items + items;
}

async function loadKitokoData(){
  document.getElementById('device')?.classList.add('is-loading');
  try {
    const [countriesResponse, sitesResponse] = await Promise.all([
      fetch(`${API_BASE}/countries`),
      fetch(`${API_BASE}/sites`)
    ]);

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
    document.getElementById('device')?.classList.remove('is-loading');
  }
}

async function renderRealAfricaMap(){
  if(!window.d3 || !window.topojson) return;

  try {
    const response = await fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json");
    const topology = await response.json();
    const features = topojson.feature(topology, topology.objects.countries).features;
    const africa = features.filter(feature=>{
      const bounds = d3.geoBounds(feature);
      return bounds[1][0] >= -20 && bounds[0][0] <= 55 && bounds[1][1] >= -36 && bounds[0][1] <= 38;
    });
    const collection = { type:"FeatureCollection", features:africa };
    const projection = d3.geoNaturalEarth1().fitSize([100, 110], collection);
    const path = d3.geoPath(projection);
    const countryFeatures = new Map(africa.map(feature=>[String(feature.id).padStart(3, "0"), feature]));
    const group = document.getElementById("real-africa-map");
    group.innerHTML = "";
    africa.forEach(feature=>{
      const countryPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      countryPath.setAttribute("class", "real-country");
      countryPath.setAttribute("d", path(feature));
      group.appendChild(countryPath);
    });
    positionCountryLabels(projection, countryFeatures);
    document.querySelector(".map-stage").classList.add("ready");
  } catch(error) {
    console.warn("Carte détaillée indisponible, affichage de la carte de secours.");
  }
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
  const cats = ["toutes", "historique", "culturel", "naturel", "savoirs"];
  const wrap = document.getElementById('chips');
  wrap.innerHTML = "";
  cats.forEach(c=>{
    const el = document.createElement('div');
    el.className = "chip" + (c===currentCat ? " active" : "");
    if(c === "toutes"){
      el.innerHTML = `<span class="cat-icon">✦</span><span>Toutes</span>`;
    } else {
      const meta = CAT_META[c];
      el.innerHTML = `<span class="cat-icon">${meta.icon}</span><span>${CAT_LABELS[c]}</span>`;
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
    <div class="card-visual ${catClass(s.cat)}">${esc(CAT_LABELS[s.cat] || s.cat)}</div>
    <div class="card-body"><p class="name">${esc(s.name)}</p><p class="place">${esc(s.region)}</p><p class="tag">${esc(s.country)}</p></div>
    <button class="card-fav">${isFav ? "♥" : "♡"}</button>`;
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
    const searchable = [s.name, s.country, s.region, s.cat, CAT_LABELS[s.cat]].filter(Boolean).join(" ").toLowerCase();
    const matchesCountry = globalSearch || s.country === currentCountry;
    const matchesCategory = globalSearch || currentCat === "toutes" || s.cat === currentCat;
    return matchesCountry && matchesCategory && (!term || searchable.includes(term));
  }).forEach(s=> list.appendChild(siteCard(s)));
  if(dataLoadError){
    list.innerHTML = `<div class="empty"><div class="glyph">⚠</div><h3>Données indisponibles</h3><p>${esc(dataLoadError)}</p></div>`;
  } else if(!list.children.length){
    list.innerHTML = `<div class="empty"><div class="glyph">◎</div><h3>Aucun site trouvé</h3><p>Essayez un autre pays, une autre catégorie ou une autre recherche.</p></div>`;
  }
}

function renderFavorites(){
  const list = document.getElementById('fav-list');
  list.innerHTML = "";
  if(!authToken || !isLoggedIn){
    list.innerHTML = `<div class="empty"><div class="glyph">♡</div><h3>Connexion requise</h3><p>Connectez-vous pour enregistrer et retrouver vos favoris.</p></div>`;
    return;
  }
  const items = SITES.filter(s => favorites.has(s.id));
  if(items.length===0){
    list.innerHTML = `<div class="empty"><div class="glyph">♡</div><h3>Aucun favori pour l'instant</h3><p>Touchez le cœur sur un site pour le retrouver ici.</p></div>`;
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
    const kind = item.type === 'edit' ? 'Suggestion de modification' : 'Nouveau site';
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

function renderContribute(){
  document.getElementById('contribute-locked').style.display = isLoggedIn ? "none" : "flex";
  document.getElementById('contribute-form').style.display = isLoggedIn ? "flex" : "none";
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
  document.getElementById('admin-tab-pending').classList.toggle('active', tab==='pending');
  document.getElementById('admin-tab-sites').classList.toggle('active', tab==='sites');
  document.getElementById('admin-pending-pane').style.display = tab==='pending' ? 'flex' : 'none';
  document.getElementById('admin-sites-pane').style.display = tab==='sites' ? 'flex' : 'none';
  if(tab==='sites') loadAdminSites();
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
    const element = document.createElement(mediaType === "video" ? "video" : "img");
    element.src = url;
    if(mediaType === "video"){ element.controls = true; element.preload = "metadata"; element.setAttribute("aria-label", label); }
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
      <div class="empty"><div class="glyph">🔒</div><h3>Accès administrateur requis</h3><p>Connectez-vous avec un compte de modération pour consulter cet espace.</p><button class="cta-btn" onclick="openAuth('login')">Se connecter</button></div>
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
    wrap.innerHTML = `<div class="empty"><div class="glyph">✓</div><h3>Aucune contribution</h3><p>Rien ne correspond à ces filtres pour le moment.</p></div>`;
  }
  pendingSubmissions.forEach(item=>{
    const el = document.createElement('div');
    el.className = "admin-item";
    const badgeClass = item.status==="pending" ? "badge-pending" : (item.status==="approved" ? "badge-approved" : "badge-rejected");
    const badgeText = item.status==="pending" ? "En attente" : (item.status==="approved" ? "Publié" : "Rejeté");
    const targetName = item.target_name || item.name || "site supprimé";
    const typeText = item.type==="edit" ? `Modification proposée sur « ${targetName} »` : "Nouveau site";
    const meta = [typeText, item.country, item.cat ? (CAT_LABELS[item.cat]||item.cat) : "", item.region, item.contributor ? `par ${item.contributor}` : "", formatDate(item.created_at)].filter(Boolean).join(" · ");
    el.innerHTML = `
      <div class="admin-head">
        <div><p class="an">${esc(item.type==="edit" ? targetName : item.name)}</p><p class="ac">${esc(meta)}</p></div>
        <span class="admin-badge ${badgeClass}">${badgeText}</span>
      </div>
      <p class="admin-excerpt">${esc(item.description || "Description indisponible")}</p>
      ${item.type==="new" ? `<p class="admin-media">${item.media_id ? "Chargement du média…" : "Aucun média joint"}</p>` : ""}
      <div class="admin-actions"></div>
    `;
    if(item.type==="new" && item.media_id){
      loadProtectedMedia(el.querySelector('.admin-media'), item.media_id, item.media_type, `Média de ${item.name}`);
    }
    if(item.status==="pending"){
      const actions = el.querySelector('.admin-actions');
      const approveBtn = document.createElement('button');
      approveBtn.className = "admin-btn approve";
      approveBtn.textContent = item.type==="edit" ? "Marquer comme intégrée" : "Approuver et publier";
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
        <div><p class="an">${esc(s.name)}</p><p class="ac">${esc(s.country)} · ${esc(CAT_LABELS[s.cat]||s.cat)}${s.featured ? " · mis en avant" : ""} · ${s.owner_id ? "issu d'une contribution" : "contenu éditorial"}</p></div>
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

function openSiteForm(mode, siteId){
  formMode = mode;
  editingSiteId = siteId || null;
  document.getElementById('sf-title').textContent = mode==='add' ? "Ajouter un site" : "Modifier le site";
  const countrySel = document.getElementById('sf-country');
  countrySel.innerHTML = countryOptions(ALL_AFRICA_COUNTRIES);
  if(mode==='edit'){
    const s = adminSites.find(x=>x.id===siteId) || SITES.find(x=>x.id===siteId);
    if(!s) return;
    document.getElementById('sf-name').value = s.name;
    countrySel.value = s.country;
    document.getElementById('sf-region').value = s.region;
    document.getElementById('sf-cat').value = s.cat;
    document.getElementById('sf-description').value = s.description;
    document.getElementById('sf-histoire').value = s.histoire;
    document.getElementById('sf-culture').value = s.culture;
    document.getElementById('sf-savoirs').value = s.savoirs;
    document.getElementById('sf-communities').value = s.communities;
    document.getElementById('sf-langues').value = s.langues;
    document.getElementById('sf-personnalites').value = s.personnalites;
    document.getElementById('sf-sources').value = (s.sources || "").split(" ; ").join("\n");
    document.getElementById('sf-featured').checked = Boolean(s.featured);
  } else {
    ['sf-name','sf-region','sf-description','sf-histoire','sf-culture','sf-savoirs','sf-communities','sf-langues','sf-personnalites','sf-sources'].forEach(id=>document.getElementById(id).value = "");
    document.getElementById('sf-cat').value = "historique";
    document.getElementById('sf-featured').checked = false;
  }
  showScreen('screen-site-form');
}

async function saveSiteForm(){
  const data = {
    name: document.getElementById('sf-name').value.trim(),
    country: document.getElementById('sf-country').value,
    region: document.getElementById('sf-region').value.trim(),
    cat: document.getElementById('sf-cat').value,
    description: document.getElementById('sf-description').value.trim(),
    histoire: document.getElementById('sf-histoire').value.trim(),
    culture: document.getElementById('sf-culture').value.trim(),
    savoirs: document.getElementById('sf-savoirs').value.trim(),
    communities: document.getElementById('sf-communities').value.trim(),
    langues: document.getElementById('sf-langues').value.trim(),
    personnalites: document.getElementById('sf-personnalites').value.trim(),
    sources: document.getElementById('sf-sources').value.trim(),
    featured: document.getElementById('sf-featured').checked
  };
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
  await loadAdminSites();
  goBack();
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
}

function openDetail(id){
  const s = SITES.find(x=>x.id===id);
  if(!s) return;
  currentSiteId = id;
  document.getElementById('detail-name').textContent = s.name;
  document.getElementById('detail-loc').textContent = [s.region, s.country].filter(Boolean).join(" · ");
  document.getElementById('detail-hero').className = "detail-hero " + catClass(s.cat);
  ['description','communities','histoire','culture','savoirs','langues','personnalites','sources'].forEach(field=>{
    document.getElementById('detail-' + field).textContent = s[field] || "—";
  });
  const media = document.getElementById('detail-media');
  media.innerHTML = "";
  if(s.media_url){
    media.innerHTML = s.media_type === "video"
      ? `<video controls preload="metadata" src="${esc(mediaSrc(s.media_url))}" aria-label="Média du site ${esc(s.name)}"></video>`
      : `<img src="${esc(mediaSrc(s.media_url))}" alt="Image du site ${esc(s.name)}" loading="lazy">`;
  }
  document.getElementById('fav-btn').classList.toggle('active', favorites.has(id));
  setTab('apercu', document.querySelector('.dtab[data-pane="apercu"]'));
  requestAnimationFrame(updateReadingProgress);
  showScreen('screen-detail');
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
  el.classList.add('active');
  document.getElementById('pane-'+pane).classList.add('active');
}

function onMediaSelected(){
  const input = document.getElementById('in-media');
  const drop = document.getElementById('file-drop');
  const text = document.getElementById('file-drop-text');
  if(input.files && input.files.length>0){
    const file = input.files[0];
    const maxSize = 20 * 1024 * 1024;
    if(file.size > maxSize || (!file.type.startsWith('image/') && !file.type.startsWith('video/'))){
      input.value = "";
      mediaAttached = false;
      alert("Choisissez une image ou une vidéo de 20 Mo maximum.");
      return;
    }
    mediaAttached = true;
    drop.classList.add('filled');
    text.textContent = input.files[0].name;
    const oldPreview = document.getElementById('media-preview');
    if(oldPreview) oldPreview.remove();
    const preview = document.createElement(file.type.startsWith('video/') ? 'video' : 'img');
    preview.id = 'media-preview';
    preview.className = 'media-preview';
    preview.src = URL.createObjectURL(file);
    preview.alt = `Aperçu de ${file.name}`;
    if(preview.tagName === 'VIDEO') { preview.controls = true; preview.muted = true; }
    drop.after(preview);
    document.getElementById('f-media').classList.remove('invalid');
    document.getElementById('f-media').querySelector('.error-text').classList.remove('show');
  }
}

async function submitContribution(){
  const fields = ["f-name","f-country","f-cat","f-desc"];
  let valid = true;
  fields.forEach(id=>{
    const wrap = document.getElementById(id);
    const input = wrap.querySelector('input,select,textarea');
    const err = wrap.querySelector('.error-text');
    if(!input.value.trim()){ wrap.classList.add('invalid'); err.classList.add('show'); valid = false; }
    else { wrap.classList.remove('invalid'); err.classList.remove('show'); }
  });
  const mediaWrap = document.getElementById('f-media');
  if(!mediaAttached){ mediaWrap.classList.add('invalid'); mediaWrap.querySelector('.error-text').classList.add('show'); valid = false; }
  else { mediaWrap.classList.remove('invalid'); mediaWrap.querySelector('.error-text').classList.remove('show'); }
  if(!valid) return;

  if(!authToken){
    alert("Connectez-vous pour envoyer une contribution.");
    return;
  }

  const formData = new FormData();
  formData.append("name", document.getElementById('in-name').value.trim());
  formData.append("country", document.getElementById('in-country').value);
  formData.append("category", document.getElementById('in-cat').value);
  formData.append("description", document.getElementById('in-desc').value.trim());
  formData.append("region", document.getElementById('in-region').value.trim());
  formData.append("credit_name", document.getElementById('in-contrib').value.trim());
  formData.append("media", document.getElementById('in-media').files[0]);

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
  document.getElementById('confirm-banner').classList.add('show');
  document.getElementById('media-preview')?.remove();
  ['in-name','in-region','in-desc','in-contrib'].forEach(id=>document.getElementById(id).value = "");
  document.getElementById('in-country').value = "";
  document.getElementById('in-cat').value = "";
  document.getElementById('in-media').value = "";
  mediaAttached = false;
  document.getElementById('file-drop').classList.remove('filled');
  document.getElementById('file-drop-text').textContent = "Ajouter une photo ou une vidéo";
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
    await Promise.all([loadFavorites(), loadUserContributions(), loadNotifications()]);
    showScreen('screen-profile');
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
}

bootstrap();