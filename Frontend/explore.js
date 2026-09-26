// Itinéraires, acteurs locaux (passeport économique), scanner de QR code,
// confidentialité et suppression de compte.

let ITINERARIES = [];
let PARTNER_TYPES = [];

async function fetchJson(path, options = {}){
  const response = await fetch(`${API_BASE}${path}`, options);
  const result = await response.json().catch(() => ({}));
  if(!response.ok || result.success === false) throw new Error(result.message || "Action impossible.");
  return result;
}

// ---------------------------------------------------------------------------
// Itinéraires
// ---------------------------------------------------------------------------

async function loadItineraries(){
  if(ITINERARIES.length) return ITINERARIES;
  try { ITINERARIES = (await fetchJson('/itineraries')).data; } catch(error) { console.warn("Itinéraires indisponibles.", error); }
  return ITINERARIES;
}

// « Mon itinéraire » : liste de sites propre à cet appareil.
function readMyTrip(){
  try { return JSON.parse(localStorage.getItem('kitoko_my_trip') || "[]").filter(id => SITES.some(site => site.id === id)); }
  catch(error) { return []; }
}
function writeMyTrip(ids){
  try { localStorage.setItem('kitoko_my_trip', JSON.stringify(ids)); } catch(error) { /* stockage indisponible */ }
}

function toggleMyTrip(siteId){
  const trip = readMyTrip();
  const index = trip.indexOf(siteId);
  if(index >= 0) trip.splice(index, 1); else trip.push(siteId);
  writeMyTrip(trip);
  updateTripButton();
  if(index < 0) celebrate(`Ajouté à votre itinéraire (${trip.length} étape${trip.length > 1 ? "s" : ""}).`);
}

function updateTripButton(){
  const button = document.getElementById('detail-trip-btn');
  if(!button) return;
  const inTrip = readMyTrip().includes(currentSiteId);
  button.textContent = inTrip ? "✓ Dans mon itinéraire" : "＋ Mon itinéraire";
  button.classList.toggle('is-active', inTrip);
}

function moveTripStop(index, delta){
  const trip = readMyTrip();
  const target = index + delta;
  if(target < 0 || target >= trip.length) return;
  [trip[index], trip[target]] = [trip[target], trip[index]];
  writeMyTrip(trip);
  renderMyTrip();
}

function removeTripStop(index){
  const trip = readMyTrip();
  trip.splice(index, 1);
  writeMyTrip(trip);
  renderMyTrip();
}

function distanceKm(a, b){
  if(a.latitude == null || b.latitude == null) return 0;
  const rad = value => value * Math.PI / 180;
  const h = Math.sin(rad(b.latitude - a.latitude) / 2) ** 2 + Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(rad(b.longitude - a.longitude) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

function routeDistance(stops){
  let total = 0;
  for(let i = 1; i < stops.length; i++) total += distanceKm(stops[i - 1], stops[i]);
  return Math.round(total);
}

// Lien Google Maps avec toutes les étapes (utilisable dans l'application Maps).
function mapsRouteUrl(stops){
  const located = stops.filter(stop => stop.latitude != null && stop.longitude != null);
  if(!located.length) return "";
  const point = stop => `${stop.latitude},${stop.longitude}`;
  const destination = located[located.length - 1];
  const waypoints = located.slice(0, -1).map(point).join("|");
  return `https://www.google.com/maps/dir/?api=1&destination=${point(destination)}${waypoints ? `&waypoints=${encodeURIComponent(waypoints)}` : ""}`;
}

function renderMyTrip(){
  const container = document.getElementById('my-trip');
  if(!container) return;
  const stops = readMyTrip().map(id => SITES.find(site => site.id === id)).filter(Boolean);
  if(!stops.length){
    container.innerHTML = `<div class="my-trip-empty"><strong>Mon itinéraire</strong><p>Composez votre parcours : sur chaque fiche, touchez « ＋ Mon itinéraire ». Les étapes s'afficheront ici, dans l'ordre de votre choix.</p></div>`;
    return;
  }
  container.innerHTML = `
    <div class="my-trip-head"><strong>Mon itinéraire</strong><span>${stops.length} étape${stops.length > 1 ? "s" : ""} · ≈ ${routeDistance(stops)} km à vol d'oiseau</span></div>
    <ol class="stop-list">${stops.map((stop, index) => `
      <li class="stop">
        <span class="stop-number">${index + 1}</span>
        <button type="button" class="stop-name" onclick="openDetail(${stop.id})">${esc(stop.name)}<small>${esc([stop.region, stop.country].filter(Boolean).join(" · "))}</small></button>
        <span class="stop-tools">
          <button type="button" aria-label="Monter" onclick="moveTripStop(${index}, -1)" ${index === 0 ? "disabled" : ""}>↑</button>
          <button type="button" aria-label="Descendre" onclick="moveTripStop(${index}, 1)" ${index === stops.length - 1 ? "disabled" : ""}>↓</button>
          <button type="button" aria-label="Retirer" onclick="removeTripStop(${index})">✕</button>
        </span>
      </li>`).join("")}</ol>
    ${stops.length > 1 ? `<a class="cta-btn cta-link" href="${esc(mapsRouteUrl(stops))}" target="_blank" rel="noopener">Ouvrir le trajet dans Maps</a>` : ""}`;
}

function circuitProgressFor(itinerary){
  const done = itinerary.stops.filter(stop => stampedSites.has(stop.id)).length;
  return { done, total: itinerary.stops.length };
}

async function renderItineraries(){
  renderMyTrip();
  const list = document.getElementById('itinerary-list');
  list.innerHTML = '<p class="pane-empty">Chargement…</p>';
  const itineraries = await loadItineraries();
  if(!itineraries.length){
    list.innerHTML = '<p class="pane-empty">Aucun circuit disponible pour le moment.</p>';
    return;
  }
  list.innerHTML = itineraries.map(itinerary => {
    const progress = circuitProgressFor(itinerary);
    return `
      <button type="button" class="itinerary-card" onclick="openItinerary('${esc(itinerary.slug)}')">
        <span class="itinerary-icon">${esc(itinerary.icon || "🗺️")}</span>
        <span class="itinerary-text">
          <span class="itinerary-country">${flagImage(itinerary.country_flag, "itinerary-flag", itinerary.country)} ${esc(itinerary.country || "")}</span>
          <strong>${esc(itinerary.title)}</strong>
          <span class="itinerary-meta">${itinerary.stops.length} étapes · ${esc(itinerary.duration || "")}${itinerary.distance_km ? ` · ≈ ${itinerary.distance_km} km` : ""}</span>
          ${isLoggedIn && progress.done ? `<span class="itinerary-progress">✦ ${progress.done}/${progress.total} tamponnés</span>` : ""}
        </span>
      </button>`;
  }).join("");
}

async function openItinerary(slug){
  const itineraries = await loadItineraries();
  const itinerary = itineraries.find(item => item.slug === slug);
  if(!itinerary) return;
  document.getElementById('itinerary-title').textContent = itinerary.title;
  document.getElementById('itinerary-meta').textContent = `${itinerary.country || ""} · ${itinerary.duration || ""}`;
  const progress = circuitProgressFor(itinerary);
  const container = document.getElementById('itinerary-detail');
  container.innerHTML = `
    <p class="itinerary-summary">${esc(itinerary.summary || "")}</p>
    <svg class="route-map" id="route-map" viewBox="0 0 100 80" role="img" aria-label="Carte du circuit"></svg>
    <div class="route-facts">
      <span><strong>${itinerary.stops.length}</strong> étapes</span>
      <span><strong>${esc(itinerary.duration || "—")}</strong></span>
      <span><strong>≈ ${itinerary.distance_km} km</strong> à vol d'oiseau</span>
    </div>
    ${isLoggedIn ? `<div class="route-progress">${progressBar(progress.done, progress.total)}<span>${progress.done}/${progress.total} étapes tamponnées — complétez le circuit pour obtenir son badge.</span></div>` : ""}
    <ol class="stop-list stop-list-circuit">${itinerary.stops.map((stop, index) => `
      <li class="stop ${stampedSites.has(stop.id) ? "is-stamped" : ""}">
        <span class="stop-number">${stampedSites.has(stop.id) ? "✦" : index + 1}</span>
        <button type="button" class="stop-name" onclick="openDetail(${stop.id})">${esc(stop.name)}<small>${esc(stop.region || "")}</small>${stop.note ? `<span class="stop-note">${esc(stop.note)}</span>` : ""}</button>
      </li>`).join("")}</ol>
    <a class="cta-btn cta-link" href="${esc(mapsRouteUrl(itinerary.stops))}" target="_blank" rel="noopener">Ouvrir le trajet dans Maps</a>
    <button class="ghost-btn" type="button" onclick="copyCircuitToMyTrip('${esc(itinerary.slug)}')">Copier dans mon itinéraire</button>
    <p class="form-note">Durées et distances indicatives : vérifiez l'état des routes et les horaires des sites avant de partir.</p>`;
  showScreen('screen-itinerary');
  drawRouteMap(itinerary.stops);
}

function copyCircuitToMyTrip(slug){
  const itinerary = ITINERARIES.find(item => item.slug === slug);
  if(!itinerary) return;
  const trip = readMyTrip();
  itinerary.stops.forEach(stop => { if(!trip.includes(stop.id)) trip.push(stop.id); });
  writeMyTrip(trip);
  celebrate("Circuit ajouté à votre itinéraire : vous pouvez le modifier dans « Itinéraires ».");
}

// Trace le circuit sur la carte du pays : étapes numérotées reliées dans l'ordre.
function drawRouteMap(stops){
  const svg = document.getElementById('route-map');
  const located = stops.filter(stop => stop.latitude != null && stop.longitude != null);
  const country = ALL_AFRICA_COUNTRIES.find(item => item.name === located[0]?.country);
  const feature = country && AFRICA_FEATURES.get(country.mapId);
  if(!svg || !window.d3 || !located.length || !feature){ if(svg) svg.remove(); return; }
  const ns = "http://www.w3.org/2000/svg";
  // Cadrage sur les étapes (avec une marge), pour que les circuits urbains
  // restent lisibles ; le contour du pays sert de repère.
  const lons = located.map(stop => stop.longitude), lats = located.map(stop => stop.latitude);
  const pad = lonLat => Math.max((Math.max(...lonLat) - Math.min(...lonLat)) * 0.25, 0.012);
  const [west, east] = [Math.min(...lons) - pad(lons), Math.max(...lons) + pad(lons)];
  const [south, north] = [Math.min(...lats) - pad(lats), Math.max(...lats) + pad(lats)];
  const frame = { type: "Polygon", coordinates: [[[west, south], [west, north], [east, north], [east, south], [west, south]]] };
  const projection = d3.geoMercator().fitExtent([[8, 8], [92, 72]], frame);
  const shape = document.createElementNS(ns, "path");
  shape.setAttribute("class", "country-shape");
  shape.setAttribute("d", d3.geoPath(projection)(feature));
  svg.appendChild(shape);
  const points = located.map(stop => projection([stop.longitude, stop.latitude]));
  const line = document.createElementNS(ns, "polyline");
  line.setAttribute("class", "route-line");
  line.setAttribute("points", points.map(point => point.join(",")).join(" "));
  svg.appendChild(line);
  points.forEach((point, index) => {
    const group = document.createElementNS(ns, "g");
    group.setAttribute("class", "route-stop");
    const circle = document.createElementNS(ns, "circle");
    circle.setAttribute("cx", point[0]); circle.setAttribute("cy", point[1]); circle.setAttribute("r", 2.6);
    const label = document.createElementNS(ns, "text");
    label.setAttribute("x", point[0]); label.setAttribute("y", point[1] + 1.1);
    label.setAttribute("text-anchor", "middle");
    label.textContent = index + 1;
    group.append(circle, label);
    group.onclick = () => openDetail(located[index].id);
    svg.appendChild(group);
  });
}

// ---------------------------------------------------------------------------
// Acteurs locaux (passeport économique)
// ---------------------------------------------------------------------------

async function loadPartnerTypes(){
  if(PARTNER_TYPES.length) return PARTNER_TYPES;
  try { PARTNER_TYPES = (await fetchJson('/partners/types')).data; } catch(error) { /* hors connexion */ }
  return PARTNER_TYPES;
}

function partnerTypeLabel(type){
  const found = PARTNER_TYPES.find(item => item.key === type);
  return found ? `${found.icon} ${found.label}` : type;
}

function phoneLink(value){ return String(value || "").replace(/[^\d+]/g, ""); }

function partnerCard(partner){
  const whatsapp = phoneLink(partner.whatsapp).replace(/^\+/, "");
  return `
    <article class="partner-card">
      <div class="partner-head">
        <span class="partner-type">${esc(partnerTypeLabel(partner.type))}</span>
        <h4>${esc(partner.name)}</h4>
        <p class="partner-place">${esc([partner.locality, partner.country].filter(Boolean).join(" · "))}${partner.site_name ? ` · près de <button type="button" class="link-btn" onclick="openDetail(${Number(partner.site_id)})">${esc(partner.site_name)}</button>` : ""}</p>
      </div>
      ${partner.description ? `<p class="partner-desc">${esc(partner.description)}</p>` : ""}
      ${partner.offer ? `<p class="partner-offer">✦ Passeport : ${esc(partner.offer)}</p>` : ""}
      ${partner.languages ? `<p class="partner-langs">🗣️ ${esc(partner.languages)}</p>` : ""}
      <div class="partner-contacts">
        ${partner.phone ? `<a class="action-btn" href="tel:${esc(phoneLink(partner.phone))}">📞 Appeler</a>` : ""}
        ${whatsapp ? `<a class="action-btn" href="https://wa.me/${esc(whatsapp)}" target="_blank" rel="noopener">WhatsApp</a>` : ""}
        ${partner.email ? `<a class="action-btn" href="mailto:${esc(partner.email)}">✉ E-mail</a>` : ""}
        ${partner.website ? `<a class="action-btn" href="${esc(partner.website)}" target="_blank" rel="noopener">Site web</a>` : ""}
      </div>
      <details class="checkin-code">
        <summary>Faire tamponner mon passeport</summary>
        <p class="form-note">Après votre visite ou votre achat, demandez son code au partenaire.</p>
        <div class="code-row"><input type="text" maxlength="12" autocomplete="off" autocapitalize="characters" placeholder="Code du partenaire" aria-label="Code du partenaire"><button class="admin-btn approve" type="button" onclick="partnerCheckIn(${partner.id}, this)">Valider</button></div>
      </details>
    </article>`;
}

async function renderSitePartners(partners){
  await loadPartnerTypes();
  document.getElementById('detail-partners-block').hidden = !partners.length;
  document.getElementById('detail-partners').innerHTML = partners.map(partnerCard).join("");
}

async function renderPartnerDirectory(){
  const types = await loadPartnerTypes();
  const countrySelect = document.getElementById('partner-country-filter');
  const typeSelect = document.getElementById('partner-type-filter');
  if(!countrySelect.dataset.ready){
    countrySelect.innerHTML = '<option value="">Tous les pays</option>' + countryOptions(COUNTRIES);
    typeSelect.innerHTML = '<option value="">Toutes les activités</option>' + types.map(type => `<option value="${esc(type.key)}">${esc(type.icon)} ${esc(type.label)}</option>`).join("");
    countrySelect.onchange = typeSelect.onchange = renderPartnerDirectory;
    countrySelect.dataset.ready = "1";
  }
  const params = new URLSearchParams();
  if(countrySelect.value) params.set('country', countrySelect.value);
  if(typeSelect.value) params.set('type', typeSelect.value);
  const directory = document.getElementById('partner-directory');
  try {
    const partners = (await fetchJson(`/partners?${params}`)).data;
    directory.innerHTML = partners.length ? partners.map(partnerCard).join("") : `
      <div class="empty"><div class="glyph">🤝</div><h3>Le réseau se construit</h3><p>Les premiers guides, artisans, tables et hébergements partenaires apparaîtront ici après validation par l'équipe.</p></div>`;
  } catch(error) {
    directory.innerHTML = '<p class="pane-empty">Annuaire indisponible hors connexion.</p>';
  }
}

async function partnerCheckIn(partnerId, button){
  if(!requireLogin("Connectez-vous pour tamponner votre passeport.")) return;
  const code = button.previousElementSibling?.value.trim();
  if(!code){ alert("Saisissez le code donné par le partenaire."); return; }
  try {
    const result = await fetchJson(`/passport/partners/${partnerId}/checkin`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({ code })
    });
    celebrate(result.data.created ? "Merci de soutenir l'économie locale ! Tampon ajouté à votre passeport." : "Ce partenaire est déjà dans votre passeport.", result.data.badges);
  } catch(error) {
    alert(error.message);
  }
}

let partnerFormAdminId = null; // null : candidature ; "new" ou id : saisie par l'équipe

async function preparePartnerForm(){
  const adminMode = partnerFormAdminId !== null;
  const locked = !adminMode && (!authToken || !isLoggedIn);
  document.getElementById('partner-apply-locked').style.display = locked ? "flex" : "none";
  document.getElementById('partner-form').style.display = locked ? "none" : "flex";
  document.getElementById('partner-form-title').textContent = adminMode ? (partnerFormAdminId === "new" ? "Ajouter un partenaire" : "Modifier le partenaire") : "Devenir partenaire";
  document.getElementById('pa-status-field').hidden = !adminMode;
  document.getElementById('partner-submit').textContent = adminMode ? "Enregistrer" : "Envoyer ma candidature";
  const types = await loadPartnerTypes();
  document.getElementById('pa-type').innerHTML = types.map(type => `<option value="${esc(type.key)}">${esc(type.icon)} ${esc(type.label)}</option>`).join("");
  document.getElementById('pa-country').innerHTML = countryOptions(COUNTRIES.length ? COUNTRIES : ALL_AFRICA_COUNTRIES);
  document.getElementById('pa-site').innerHTML = '<option value="">Aucun en particulier</option>' + SITES.map(site => `<option value="${site.id}">${esc(site.name)} (${esc(site.country)})</option>`).join("");
}

async function submitPartnerForm(){
  const adminMode = partnerFormAdminId !== null;
  const value = id => document.getElementById(id).value.trim();
  const body = {
    name: value('pa-name'), type: value('pa-type'), country: value('pa-country'), locality: value('pa-locality'),
    site_id: value('pa-site') || null, description: value('pa-description'), offer: value('pa-offer'),
    phone: value('pa-phone'), whatsapp: value('pa-whatsapp'), email: value('pa-email'), website: value('pa-website'),
    languages: value('pa-languages'), charter: document.getElementById('pa-charter').checked
  };
  if(adminMode) body.status = value('pa-status');
  if(!adminMode && !body.charter){ alert("Merci d'accepter la charte des partenaires."); return; }
  try {
    const path = adminMode ? (partnerFormAdminId === "new" ? "/admin/partners" : `/admin/partners/${partnerFormAdminId}`) : "/partners";
    await fetchJson(path, {
      method: adminMode && partnerFormAdminId !== "new" ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
      body: JSON.stringify(body)
    });
  } catch(error) {
    alert(error.message);
    return;
  }
  document.getElementById('partner-form').reset();
  if(adminMode){
    partnerFormAdminId = null;
    goBack();
    loadAdminPartners();
  } else {
    alert("Merci ! Votre candidature a été envoyée. Vous serez prévenu dans vos notifications après son examen.");
    renderMyPartners();
    showScreen('screen-profile');
  }
}

async function renderMyPartners(){
  const section = document.getElementById('my-partners-section');
  const list = document.getElementById('my-partners-list');
  if(!section || !authToken) return;
  try {
    const partners = (await fetchJson('/partners/mine', { headers: { Authorization: `Bearer ${authToken}` } })).data;
    section.hidden = !partners.length;
    const labels = { pending: "En attente de validation", published: "Publié", rejected: "Non retenu" };
    list.innerHTML = partners.map(partner => `
      <div class="admin-item">
        <div class="admin-head"><div><p class="an">${esc(partner.name)}</p><p class="ac">${esc(labels[partner.status] || partner.status)}</p></div></div>
        ${partner.checkin_code ? `<p class="partner-code-box">Votre code passeport, à donner aux visiteurs après leur visite ou leur achat : <strong class="mono">${esc(partner.checkin_code)}</strong></p>` : ""}
      </div>`).join("");
  } catch(error) { /* hors connexion */ }
}

// Administration des partenaires
async function loadAdminPartners(){
  const wrap = document.getElementById('admin-partners-list');
  await loadPartnerTypes();
  try {
    const partners = (await fetchJson('/admin/partners', { headers: { Authorization: `Bearer ${authToken}` } })).data;
    const badges = { pending: '<span class="admin-badge badge-pending">En attente</span>', published: '<span class="admin-badge badge-approved">Publié</span>', rejected: '<span class="admin-badge badge-rejected">Refusé</span>' };
    wrap.innerHTML = partners.length ? "" : '<p class="pane-empty">Aucun partenaire pour le moment.</p>';
    partners.forEach(partner => {
      const item = document.createElement('div');
      item.className = "admin-item";
      item.innerHTML = `
        <div class="admin-head">
          <div><p class="an">${esc(partner.name)}</p><p class="ac">${esc(partnerTypeLabel(partner.type))} · ${esc([partner.locality, partner.country].filter(Boolean).join(", "))}${partner.applicant ? ` · candidature de ${esc(partner.applicant)}` : ""}</p></div>
          ${badges[partner.status] || ""}
        </div>
        ${partner.description ? `<p class="admin-excerpt">${esc(partner.description)}</p>` : ""}
        <p class="form-note">Contact : ${esc([partner.phone, partner.whatsapp && `WhatsApp ${partner.whatsapp}`, partner.email, partner.website].filter(Boolean).join(" · ") || "—")} · Code passeport : <strong class="mono">${esc(partner.checkin_code || "")}</strong></p>
        <div class="admin-actions"></div>`;
      const actions = item.querySelector('.admin-actions');
      const button = (label, className, handler) => {
        const element = document.createElement('button');
        element.className = `admin-btn ${className}`;
        element.textContent = label;
        element.onclick = handler;
        actions.appendChild(element);
      };
      if(partner.status !== "published") button("Publier", "approve", () => setPartnerStatus(partner, "published"));
      if(partner.status === "pending") button("Refuser", "reject", () => setPartnerStatus(partner, "rejected"));
      button("Modifier", "approve", () => openPartnerForm(partner));
      button("Supprimer", "reject", () => deletePartner(partner.id));
      wrap.appendChild(item);
    });
  } catch(error) {
    wrap.innerHTML = `<p class="pane-empty">${esc(error.message)}</p>`;
  }
}

async function setPartnerStatus(partner, status){
  try {
    await fetchJson(`/admin/partners/${partner.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({ ...partner, status })
    });
    loadAdminPartners();
  } catch(error) { alert(error.message); }
}

async function deletePartner(id){
  if(!confirm("Supprimer définitivement ce partenaire ?")) return;
  try {
    await fetchJson(`/admin/partners/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${authToken}` } });
    loadAdminPartners();
  } catch(error) { alert(error.message); }
}

async function openPartnerForm(partner){
  partnerFormAdminId = partner ? partner.id : "new";
  showScreen('screen-partner-apply');
  await preparePartnerForm();
  const set = (id, value) => { document.getElementById(id).value = value ?? ""; };
  if(partner){
    set('pa-name', partner.name); set('pa-type', partner.type); set('pa-country', partner.country);
    set('pa-locality', partner.locality); set('pa-site', partner.site_id); set('pa-description', partner.description);
    set('pa-offer', partner.offer); set('pa-phone', partner.phone); set('pa-whatsapp', partner.whatsapp);
    set('pa-email', partner.email); set('pa-website', partner.website); set('pa-languages', partner.languages);
    set('pa-status', partner.status);
  } else {
    document.getElementById('partner-form').reset();
    set('pa-status', 'published');
  }
}

// Quitter le formulaire en mode admin remet le mode « candidature ».
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#screen-partner-apply .icon-btn')?.addEventListener('click', () => { partnerFormAdminId = null; });
});

// ---------------------------------------------------------------------------
// Scanner de QR code (utile dans l'application installée)
// ---------------------------------------------------------------------------

let scannerStream = null;
let scannerFrame = null;

function loadScript(src){
  return new Promise((resolve, reject) => {
    if(document.querySelector(`script[src="${src}"]`)) return resolve();
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Reconnaît les liens Kitoko Afrika : /s/<slug> ou ?site=<slug>.
function siteSlugFromQr(text){
  try {
    const url = new URL(text, window.location.origin);
    const short = url.pathname.match(/\/s\/([a-z0-9-]+)/i);
    return short ? short[1] : url.searchParams.get('site');
  } catch(error) {
    return null;
  }
}

async function openScanner(){
  showScreen('screen-scanner');
  const status = document.getElementById('scanner-status');
  const video = document.getElementById('scanner-video');
  if(!navigator.mediaDevices?.getUserMedia){
    status.textContent = "La caméra n'est pas accessible ici : utilisez l'appareil photo de votre téléphone.";
    return;
  }
  try {
    await loadScript('vendor/jsQR.min.js');
    scannerStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
    video.srcObject = scannerStream;
    await video.play();
    status.textContent = "Recherche d'un QR code…";
  } catch(error) {
    status.textContent = "Accès à la caméra refusé ou impossible. Autorisez-le dans les réglages, ou utilisez l'appareil photo de votre téléphone.";
    return;
  }

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d', { willReadFrequently: true });
  const tick = () => {
    if(!scannerStream) return;
    if(video.readyState === video.HAVE_ENOUGH_DATA){
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const image = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = window.jsQR && jsQR(image.data, image.width, image.height, { inversionAttempts: "dontInvert" });
      if(code?.data){
        const slug = siteSlugFromQr(code.data);
        const site = slug && SITES.find(item => item.slug === slug);
        if(site){
          stopScanner();
          arrivedFromQr = true;
          openDetail(site.id, { tab: 'passeport' });
          return;
        }
        status.textContent = "Ce QR code ne correspond pas à un site Kitoko Afrika.";
      }
    }
    scannerFrame = requestAnimationFrame(tick);
  };
  scannerFrame = requestAnimationFrame(tick);
}

function stopScanner(){
  if(scannerFrame) cancelAnimationFrame(scannerFrame);
  scannerFrame = null;
  scannerStream?.getTracks().forEach(track => track.stop());
  scannerStream = null;
}

function closeScanner(){
  stopScanner();
  goBack();
}

// ---------------------------------------------------------------------------
// Confidentialité et compte
// ---------------------------------------------------------------------------

async function renderPrivacy(){
  const container = document.getElementById('privacy-content');
  if(container.dataset.ready) return;
  try {
    const html = await (await fetch('confidentialite.html')).text();
    const page = new DOMParser().parseFromString(html, 'text/html');
    container.innerHTML = page.getElementById('policy').innerHTML;
    container.dataset.ready = "1";
  } catch(error) {
    container.innerHTML = '<p>Page indisponible hors connexion.</p>';
  }
}

async function deleteMyAccount(){
  if(!confirm("Supprimer définitivement votre compte ? Vos favoris, votre passeport, vos tampons et vos badges seront effacés. Les contributions déjà publiées restent sur les fiches, sans votre nom.")) return;
  const password = prompt("Pour confirmer, saisissez votre mot de passe :");
  if(!password) return;
  try {
    await fetchJson('/auth/me', {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({ password })
    });
  } catch(error) {
    alert(error.message);
    return;
  }
  writeMyTrip([]);
  alert("Votre compte a été supprimé.");
  storeToken(null);
  authToken = null;
  await logout();
}

// ---------------------------------------------------------------------------
// Application mobile (Capacitor) : un QR code ou un lien kitokoafrika.org/s/…
// ouvert sur le téléphone lance l'application et affiche la fiche du site.
// ---------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  const appPlugin = window.Capacitor?.Plugins?.App;
  if(!appPlugin) return;
  appPlugin.addListener('appUrlOpen', async ({ url }) => {
    const slug = siteSlugFromQr(url);
    if(!slug) return;
    if(!SITES.length) await loadKitokoData();
    const site = SITES.find(item => item.slug === slug);
    if(!site) return;
    arrivedFromQr = /\/s\//.test(url) || /[?&]scan=1/.test(url);
    openDetail(site.id, { tab: arrivedFromQr ? 'passeport' : 'apercu' });
  });
  // Bouton « retour » d'Android : revenir à l'écran précédent plutôt que quitter.
  appPlugin.addListener('backButton', () => {
    if(document.querySelector('.screen.active')?.id === 'screen-home') appPlugin.exitApp();
    else goBack();
  });
});
