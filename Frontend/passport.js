// Passeport de découverte : écran « Passeport », onglet Passeport des fiches,
// validation des visites (GPS ou code) et quiz.

let arrivedFromQr = false;
let passportData = null;

function authHeaders(extra = {}){
  return { ...extra, Authorization: `Bearer ${authToken}` };
}

// Sites déjà tamponnés : affichés sur les cartes de la liste.
async function loadStampedSites(){
  if(!authToken || !isLoggedIn){ stampedSites = new Set(); return; }
  try {
    const response = await fetch(`${API_BASE}/passport`, { headers: authHeaders() });
    const result = await response.json();
    if(!response.ok || !result.success) throw new Error(result.message);
    passportData = result.data;
    stampedSites = new Set(result.data.stamps.map(stamp => stamp.site_id));
    const home = document.getElementById('qs-passport');
    if(home) home.textContent = `${result.data.totals.discovered} tampon${result.data.totals.discovered > 1 ? "s" : ""}`;
    renderList();
  } catch(error) {
    console.warn("Passeport indisponible.", error);
  }
}

function progressBar(value, total, secondary = 0){
  const percent = total ? Math.round(value / total * 100) : 0;
  const secondaryPercent = total ? Math.round(secondary / total * 100) : 0;
  return `<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${value}">
    <span class="progress-fill" style="width:${percent}%"></span>
    <span class="progress-fill progress-onsite" style="width:${secondaryPercent}%"></span>
  </div>`;
}

function countryFlag(name){
  return ALL_AFRICA_COUNTRIES.find(country => country.name === name)?.flag || "";
}

async function renderPassport(){
  const locked = document.getElementById('passport-locked');
  const content = document.getElementById('passport-content');
  if(!authToken || !isLoggedIn){
    locked.style.display = "flex";
    content.innerHTML = "";
    return;
  }
  locked.style.display = "none";
  content.innerHTML = '<p class="pane-empty">Chargement de votre passeport…</p>';
  await loadStampedSites();
  if(!passportData){
    content.innerHTML = '<p class="pane-empty">Passeport indisponible pour le moment. Vérifiez votre connexion.</p>';
    return;
  }

  const data = passportData;
  const visitedCountries = data.countries.filter(country => country.visited > 0);
  const discoveredCountries = data.countries.filter(country => country.discovered > 0);
  const badges = data.badges.slice().sort((a, b) => Number(b.earned) - Number(a.earned) || (b.progress / b.target) - (a.progress / a.target));
  const earnedCount = badges.filter(badge => badge.earned).length;

  content.innerHTML = `
    <div class="passport-cover">
      <p class="passport-kicker">Passeport de découverte</p>
      <h2>${esc(currentUser.name)}</h2>
      <div class="passport-flags">${discoveredCountries.length
        ? discoveredCountries.map(country => `<span class="passport-flag ${country.visited ? "is-visited" : ""}" title="${esc(country.label)}">${flagImage(countryFlag(country.label), "passport-flag-img", country.label)}</span>`).join("")
        : '<span class="passport-flags-empty">Vos pays apparaîtront ici.</span>'}</div>
      <div class="passport-totals">
        <div><strong>${data.totals.discovered}</strong><span>site${data.totals.discovered > 1 ? "s" : ""} découvert${data.totals.discovered > 1 ? "s" : ""}</span></div>
        <div><strong>${data.totals.visited}</strong><span>visité${data.totals.visited > 1 ? "s" : ""} sur place</span></div>
        <div><strong>${earnedCount}</strong><span>badge${earnedCount > 1 ? "s" : ""}</span></div>
      </div>
      <button type="button" class="scan-button" onclick="openScanner()">📷 Scanner le QR code d'un site</button>
      <p class="passport-legend"><span class="legend-onsite"></span> sur place <span class="legend-online"></span> découvert en ligne</p>
    </div>

    <section class="passport-section">
      <h3>Pays</h3>
      ${data.countries.map(country => `
        <div class="collection-row">
          <span class="collection-label">${flagImage(countryFlag(country.label), "collection-flag", country.label)} ${esc(country.label)}</span>
          <span class="collection-count">${country.discovered}/${country.total}</span>
          ${progressBar(country.discovered, country.total, country.visited)}
        </div>`).join("")}
    </section>

    <section class="passport-section">
      <h3>Collections</h3>
      ${data.categories.map(category => `
        <div class="collection-row">
          <span class="collection-label">${esc(CAT_META[category.key]?.icon || "")} ${esc(category.label)}</span>
          <span class="collection-count">${category.discovered}/${category.total}</span>
          ${progressBar(category.discovered, category.total, category.visited)}
        </div>`).join("")}
    </section>

    <section class="passport-section">
      <h3>Thèmes</h3>
      <div class="theme-progress-grid">
        ${data.themes.map(theme => `
          <div class="theme-progress ${theme.discovered ? "has-progress" : ""}">
            <span class="theme-progress-icon">${esc(theme.icon || "✦")}</span>
            <span class="theme-progress-name">${esc(theme.label)}</span>
            <span class="theme-progress-count">${theme.discovered}/${theme.total}</span>
          </div>`).join("")}
      </div>
    </section>

    <section class="passport-section">
      <h3>Badges</h3>
      <div class="badge-grid">
        ${badges.map(badge => `
          <div class="badge ${badge.earned ? "is-earned" : ""} badge-${esc(badge.family)}">
            <span class="badge-icon">${esc(badge.icon)}</span>
            <p class="badge-name">${esc(badge.name)}</p>
            <p class="badge-desc">${esc(badge.description)}</p>
            ${badge.earned
              ? `<button type="button" class="badge-share" data-slug="${esc(badge.slug)}" onclick="shareBadge(this.dataset.slug)">Partager</button>`
              : `${progressBar(badge.progress, badge.target)}<span class="badge-progress">${badge.progress}/${badge.target}</span>`}
          </div>`).join("")}
      </div>
      <p class="form-note">🧭 Les badges « Explorateur » demandent des visites sur place ; les badges « Connaisseur » s'obtiennent aussi en ligne, grâce aux quiz.</p>
    </section>

    <section class="passport-section">
      <h3>Mes tampons</h3>
      ${data.stamps.length ? `<div class="stamp-grid">${data.stamps.map(stamp => `
        <button type="button" class="stamp stamp-${esc(stamp.kind)}" onclick="openDetail(${Number(stamp.site_id)})">
          <span class="stamp-ring">${flagImage(stamp.country_flag, "stamp-flag", stamp.country)}<span class="stamp-cat">${esc(CAT_META[stamp.category]?.icon || "✦")}</span></span>
          <span class="stamp-name">${esc(stamp.site_name)}</span>
          <span class="stamp-meta">${stamp.kind === "onsite" ? "Visité sur place" : "Découvert en ligne"} · ${esc(formatDate(stamp.created_at))}</span>
        </button>`).join("")}</div>`
        : '<p class="pane-empty">Aucun tampon pour l\'instant. Ouvrez une fiche et rendez-vous dans son onglet « Passeport ».</p>'}
    </section>

    <section class="passport-section">
      <h3>Économie locale</h3>
      ${data.partner_stamps.length ? `<div class="partner-stamps">${data.partner_stamps.map(stamp => `
        <div class="partner-stamp"><span>🤝</span><div><strong>${esc(stamp.name)}</strong><small>${esc(stamp.country)} · ${esc(formatDate(stamp.created_at))}</small></div></div>`).join("")}</div>`
        : '<p class="pane-empty">Faites tamponner votre passeport chez les guides, artisans, tables et hébergements partenaires.</p>'}
      <button class="ghost-btn" type="button" onclick="showScreen('screen-partners')">Voir les acteurs locaux</button>
    </section>

    <section class="passport-section passport-howto">
      <h3>Comment ça marche ?</h3>
      <ol>
        <li><strong>Découvrez</strong> un site dans l'application ou sur place.</li>
        <li><strong>Scannez</strong> son QR code : la fiche s'ouvre avec son histoire, ses récits et ses savoirs.</li>
        <li><strong>Validez votre visite</strong> par géolocalisation, ou avec le code affiché sur place : tampon « visité sur place ».</li>
        <li><strong>Apprenez</strong> en répondant au quiz : tampon « découvert en ligne », même de loin.</li>
        <li><strong>Continuez</strong> : pays, thèmes et badges se remplissent au fil de vos découvertes.</li>
      </ol>
    </section>
  `;
}

async function shareBadge(slug){
  const badge = passportData?.badges.find(item => item.slug === slug);
  if(!badge) return;
  const text = `J'ai obtenu le badge « ${badge.name} » ${badge.icon} sur Kitoko Afrika — Notre Afrique, nos histoires, nos savoirs.`;
  try {
    if(navigator.share) { await navigator.share({ title: "Kitoko Afrika", text, url: publicOrigin() }); return; }
    await navigator.clipboard.writeText(`${text} ${publicOrigin()}`);
    alert("Texte copié : collez-le pour le partager.");
  } catch(error) {
    if(error?.name !== "AbortError") prompt("Copiez ce texte :", text);
  }
}

// ---------------------------------------------------------------------------
// Onglet « Passeport » d'une fiche
// ---------------------------------------------------------------------------

async function renderDetailPassport(){
  const pane = document.getElementById('detail-passport');
  const siteId = currentSiteId;
  const site = SITES.find(item => item.id === siteId);
  if(!pane || !site) return;

  const scanBanner = arrivedFromQr ? `<div class="scan-banner">📍 Bienvenue sur le site ! Validez votre visite pour obtenir votre tampon.</div>` : "";

  if(!authToken || !isLoggedIn){
    pane.innerHTML = `${scanBanner}
      <div class="passport-pane-intro">
        <div class="stamp-preview">✦</div>
        <p>Connectez-vous pour tamponner votre passeport : visite validée sur place, ou quiz depuis n'importe où.</p>
        <button class="cta-btn" onclick="openAuth('signup')">Créer un compte</button>
        <button class="ghost-btn" onclick="openAuth('login')">Se connecter</button>
      </div>`;
    return;
  }

  pane.innerHTML = '<p class="pane-empty">Chargement…</p>';
  let status;
  try {
    const response = await fetch(`${API_BASE}/passport/sites/${siteId}`, { headers: authHeaders() });
    const result = await response.json();
    if(!response.ok || !result.success) throw new Error(result.message);
    status = result.data;
  } catch(error) {
    pane.innerHTML = '<p class="pane-empty">Passeport indisponible hors connexion. Les tampons se valident avec une connexion internet.</p>';
    return;
  }
  if(currentSiteId !== siteId) return;

  const onsite = status.onsite
    ? `<div class="stamp-status is-done"><span class="stamp-status-icon">✦</span><div><strong>Visité sur place</strong><span>Tamponné le ${esc(formatDate(status.onsite.created_at))}</span></div></div>`
    : `<div class="stamp-status"><span class="stamp-status-icon">○</span><div><strong>Visité sur place</strong><span>Vous êtes sur le site ? Validez votre visite.</span></div></div>
       <div class="checkin-actions">
         <button class="submit-btn" type="button" id="checkin-gps" onclick="checkInWithGps()">📍 Valider ma visite (géolocalisation)</button>
         <details class="checkin-code">
           <summary>Pas de GPS ? Utiliser le code affiché sur place</summary>
           <div class="code-row"><input type="text" id="checkin-code" maxlength="12" autocomplete="off" autocapitalize="characters" placeholder="Code du site"><button class="admin-btn approve" type="button" onclick="checkInWithCode()">Valider</button></div>
         </details>
         <p class="form-note">Votre position sert uniquement à vérifier que vous êtes sur le site : elle n'est pas enregistrée.</p>
       </div>`;

  const online = status.online
    ? `<div class="stamp-status is-done is-online"><span class="stamp-status-icon">✦</span><div><strong>Découvert en ligne</strong><span>Quiz complété le ${esc(formatDate(status.online.created_at))}</span></div></div>`
    : `<div class="stamp-status"><span class="stamp-status-icon">○</span><div><strong>Découvert en ligne</strong><span>Répondez au quiz pour obtenir ce tampon, où que vous soyez.</span></div></div>`;

  const quiz = status.questions.length ? `
    <form class="quiz" id="site-quiz" onsubmit="event.preventDefault(); submitQuiz();">
      <h3>Quiz — ${status.questions.length} question${status.questions.length > 1 ? "s" : ""}</h3>
      <p class="form-note">Les réponses se trouvent dans la fiche. Une erreur n'est pas grave : l'explication s'affiche après votre réponse.</p>
      ${status.questions.map((question, index) => `
        <fieldset class="quiz-question" data-question="${question.id}">
          <legend>${index + 1}. ${esc(question.question)}</legend>
          ${question.choices.map((choice, choiceIndex) => `
            <label class="quiz-choice"><input type="radio" name="q-${question.id}" value="${choiceIndex}"> <span>${esc(choice)}</span></label>`).join("")}
          <div class="quiz-feedback" hidden></div>
        </fieldset>`).join("")}
      <button class="submit-btn" type="submit">Valider mes réponses</button>
    </form>` : '<p class="pane-empty">Le quiz de ce site sera bientôt disponible.</p>';

  pane.innerHTML = `${scanBanner}<div class="stamp-statuses">${onsite}${online}</div>${quiz}`;
}

async function sendCheckIn(body){
  const response = await fetch(`${API_BASE}/passport/sites/${currentSiteId}/checkin`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(body)
  });
  const result = await response.json();
  if(!response.ok || !result.success) throw new Error(result.message || "Validation impossible.");
  arrivedFromQr = false;
  celebrate("Visite validée ! Tampon « visité sur place » ajouté à votre passeport.", result.data.badges);
  await loadStampedSites();
  renderDetailPassport();
}

function checkInWithGps(){
  const button = document.getElementById('checkin-gps');
  if(!navigator.geolocation){
    alert("La géolocalisation n'est pas disponible sur cet appareil : utilisez le code affiché sur place.");
    return;
  }
  button.disabled = true;
  button.textContent = "Localisation en cours…";
  navigator.geolocation.getCurrentPosition(async position => {
    try {
      await sendCheckIn({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      });
    } catch(error) {
      alert(error.message);
      button.disabled = false;
      button.textContent = "📍 Réessayer";
    }
  }, error => {
    const messages = {
      1: "Vous avez refusé l'accès à votre position. Autorisez-le dans les réglages du navigateur, ou utilisez le code affiché sur place.",
      2: "Position introuvable pour le moment. Réessayez à l'extérieur, ou utilisez le code affiché sur place.",
      3: "La localisation a pris trop de temps. Réessayez, ou utilisez le code affiché sur place."
    };
    alert(messages[error.code] || "Localisation impossible.");
    button.disabled = false;
    button.textContent = "📍 Réessayer";
    document.querySelector('.checkin-code')?.setAttribute('open', '');
  }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 30000 });
}

async function checkInWithCode(){
  const code = document.getElementById('checkin-code')?.value.trim();
  if(!code){ alert("Saisissez le code affiché sur place."); return; }
  try {
    await sendCheckIn({ code });
  } catch(error) {
    alert(error.message);
  }
}

async function submitQuiz(){
  const form = document.getElementById('site-quiz');
  const answers = {};
  form.querySelectorAll('.quiz-question').forEach(fieldset => {
    const checked = fieldset.querySelector('input:checked');
    if(checked) answers[fieldset.dataset.question] = Number(checked.value);
  });
  if(!Object.keys(answers).length){ alert("Choisissez au moins une réponse."); return; }

  let result;
  try {
    const response = await fetch(`${API_BASE}/passport/sites/${currentSiteId}/quiz`, {
      method: "POST",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ answers })
    });
    result = await response.json();
    if(!response.ok || !result.success) throw new Error(result.message);
  } catch(error) {
    alert(error.message || "Impossible d'envoyer vos réponses.");
    return;
  }

  // Correction affichée sous chaque question.
  for(const item of result.data.results){
    const fieldset = form.querySelector(`[data-question="${item.question_id}"]`);
    if(!fieldset) continue;
    fieldset.classList.toggle('is-correct', item.correct);
    fieldset.classList.toggle('is-wrong', !item.correct);
    fieldset.querySelectorAll('input').forEach(input => {
      input.disabled = true;
      input.closest('.quiz-choice').classList.toggle('is-answer', Number(input.value) === item.answer_index);
    });
    const feedback = fieldset.querySelector('.quiz-feedback');
    feedback.hidden = false;
    feedback.innerHTML = `<strong>${item.correct ? "Bonne réponse !" : `La bonne réponse : ${esc(item.answer)}`}</strong> ${esc(item.explanation)}`;
  }

  const submit = form.querySelector('button[type="submit"]');
  if(result.data.completed){
    submit.remove();
    const summary = document.createElement('p');
    summary.className = "quiz-summary";
    summary.textContent = `${result.data.score}/${result.data.total} bonne${result.data.score > 1 ? "s" : ""} réponse${result.data.score > 1 ? "s" : ""}.`;
    form.appendChild(summary);
    if(result.data.stamp_created) celebrate("Quiz complété ! Tampon « découvert en ligne » ajouté à votre passeport.", result.data.badges);
    else if(result.data.badges.length) celebrate("Bravo !", result.data.badges);
    await loadStampedSites();
  } else {
    submit.textContent = "Valider les questions restantes";
  }
}

// Petite notification animée pour les tampons et les badges.
function celebrate(message, badges = []){
  const toast = document.createElement('div');
  toast.className = "celebration";
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<span class="celebration-stamp">✦</span><div><p>${esc(message)}</p>${badges.map(badge => `<p class="celebration-badge">${esc(badge.icon)} Nouveau badge : <strong>${esc(badge.name)}</strong></p>`).join("")}</div>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 20);
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, badges.length ? 6000 : 4000);
}
