// Outils d'administration d'une fiche : QR code et affiche à imprimer,
// code de visite, galerie, quiz et récits.

let siteToolsQr = { svg: "", url: "" };

async function adminRequest(path, options = {}){
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${authToken}`, ...(options.json ? { "Content-Type": "application/json" } : {}), ...(options.headers || {}) },
    body: options.json ? JSON.stringify(options.json) : options.body
  });
  const result = await response.json().catch(() => ({}));
  if(!response.ok || result.success === false) throw new Error(result.message || "Action impossible.");
  return result;
}

function renderSiteTools(site){
  const tools = document.getElementById('sf-tools');
  tools.innerHTML = `
    <section class="tool-section">
      <h3>QR code et visite sur place</h3>
      <div class="qr-block">
        <div class="qr-image" id="qr-image">Chargement…</div>
        <div class="qr-info">
          <p class="form-note">Lien du QR code : <span id="qr-url" class="mono">—</span></p>
          <p>Code de secours (si le GPS ne fonctionne pas) : <strong class="mono checkin-code-value">${esc(site.checkin_code || "—")}</strong></p>
          <p class="form-note">Rayon de validation : ${esc(site.checkin_radius_m)} m ${site.latitude == null ? "— <strong>coordonnées manquantes : seul le code fonctionne</strong>" : ""}</p>
          <div class="admin-actions">
            <button class="admin-btn approve" type="button" onclick="printSitePoster(${site.id})">Imprimer l'affiche</button>
            <a class="admin-btn approve" id="qr-download" download="qr-${esc(site.slug)}.svg">Télécharger le QR</a>
            <button class="admin-btn reject" type="button" onclick="regenerateCheckinCode(${site.id})">Nouveau code</button>
          </div>
        </div>
      </div>
    </section>

    <section class="tool-section">
      <h3>Galerie (${site.media.length})</h3>
      <div class="tool-gallery">${site.media.map(item => `
        <div class="tool-media">
          ${mediaElement(item, item.title || site.name)}
          <p>${esc(item.title || "Sans titre")}${item.author ? ` · © ${esc(item.author)}` : ""}</p>
          <button class="admin-btn reject" type="button" onclick="deleteSiteMedia(${item.id}, ${site.id})">Retirer</button>
        </div>`).join("") || '<p class="pane-empty">Aucun média.</p>'}</div>
      <form class="tool-form" onsubmit="event.preventDefault(); uploadSiteMedia(${site.id}, this);">
        <input type="file" name="media" accept="image/*,video/*,audio/*" required>
        <input type="text" name="title" placeholder="Légende">
        <input type="text" name="author" placeholder="Auteur / crédit">
        <input type="text" name="rights" placeholder="Droits (ex. autorisation obtenue, CC BY)">
        <button class="admin-btn approve" type="submit">Ajouter à la galerie</button>
      </form>
    </section>

    <section class="tool-section">
      <h3>Quiz (${site.quiz.length})</h3>
      ${site.quiz.map((question, index) => `
        <div class="tool-question">
          <p><strong>${index + 1}. ${esc(question.question)}</strong></p>
          <ul>${question.choices.map((choice, choiceIndex) => `<li class="${choiceIndex === question.answer_index ? "is-answer" : ""}">${esc(choice)}${choiceIndex === question.answer_index ? " (bonne réponse)" : ""}</li>`).join("")}</ul>
          ${question.explanation ? `<p class="form-note">${esc(question.explanation)}</p>` : ""}
          <button class="admin-btn reject" type="button" onclick="deleteQuizQuestion(${question.id}, ${site.id})">Supprimer</button>
        </div>`).join("") || '<p class="pane-empty">Aucune question : le tampon « en ligne » n\'est pas disponible pour ce site.</p>'}
      <form class="tool-form" onsubmit="event.preventDefault(); addQuizQuestion(${site.id}, this);">
        <input type="text" name="question" placeholder="Question" required>
        ${[0, 1, 2, 3].map(index => `
          <label class="quiz-edit-choice"><input type="radio" name="answer" value="${index}" ${index === 0 ? "checked" : ""} aria-label="Bonne réponse"><input type="text" name="choice" placeholder="Choix ${index + 1}${index > 1 ? " (facultatif)" : ""}" ${index < 2 ? "required" : ""}></label>`).join("")}
        <p class="form-note">Cochez la bonne réponse.</p>
        <textarea name="explanation" placeholder="Explication affichée après la réponse"></textarea>
        <button class="admin-btn approve" type="submit">Ajouter la question</button>
      </form>
    </section>

    <section class="tool-section">
      <h3>Récits et traditions (${site.recits.length})</h3>
      ${site.recits.map(recit => `
        <div class="tool-question">
          <p><strong>${esc(recit.title)}</strong> <span class="recit-nature">${esc(RECIT_NATURES[recit.nature] || recit.nature)}</span></p>
          <p class="form-note">${esc(recit.body.slice(0, 160))}${recit.body.length > 160 ? "…" : ""}</p>
          <button class="admin-btn reject" type="button" onclick="deleteRecit(${recit.id}, ${site.id})">Supprimer</button>
        </div>`).join("") || '<p class="pane-empty">Aucun récit.</p>'}
      <form class="tool-form" onsubmit="event.preventDefault(); addRecit(${site.id}, this);">
        <input type="text" name="title" placeholder="Titre" required>
        <select name="nature">${Object.entries(RECIT_NATURES).map(([key, label]) => `<option value="${key}">${esc(label)}</option>`).join("")}</select>
        <input type="text" name="author_name" placeholder="Transmis par (facultatif)">
        <textarea name="body" placeholder="Texte du récit" required></textarea>
        <button class="admin-btn approve" type="submit">Ajouter le récit</button>
      </form>
    </section>
  `;
  loadSiteQr(site);
}

async function loadSiteQr(site){
  const container = document.getElementById('qr-image');
  try {
    const response = await fetch(`${API_BASE}/admin/sites/${site.id}/qr.svg`, { headers: { Authorization: `Bearer ${authToken}` } });
    if(!response.ok) throw new Error();
    siteToolsQr = { svg: await response.text(), url: response.headers.get('X-Site-Url') || "" };
    const blobUrl = URL.createObjectURL(new Blob([siteToolsQr.svg], { type: "image/svg+xml" }));
    container.innerHTML = `<img src="${blobUrl}" alt="QR code du site">`;
    document.getElementById('qr-download').href = blobUrl;
    document.getElementById('qr-url').textContent = siteToolsQr.url;
  } catch(error) {
    container.textContent = "QR code indisponible.";
  }
}

// Affiche A4 à poser sur le site : nom, QR code, code de secours, mode d'emploi.
function printSitePoster(siteId){
  const site = SITES.find(item => item.id === siteId) || adminSites.find(item => item.id === siteId);
  const code = document.querySelector('.checkin-code-value')?.textContent || "";
  const poster = window.open("", "_blank");
  if(!poster || !siteToolsQr.svg){ alert("Autorisez l'ouverture de fenêtres pour imprimer l'affiche."); return; }
  poster.document.write(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Affiche — ${esc(site?.name || "")}</title>
    <style>
      @page{size:A4;margin:16mm}
      body{font-family:Georgia,serif;color:#1E1A15;text-align:center;margin:0}
      .brand{letter-spacing:.3em;font-size:14px;color:#8C6A25;margin:0}
      h1{font-size:34px;margin:10px 0 4px}
      .loc{font-family:Arial,sans-serif;color:#555;margin:0 0 18px}
      .qr svg{width:95mm;height:95mm}
      .steps{font-family:Arial,sans-serif;font-size:15px;line-height:1.6;max-width:150mm;margin:14px auto;text-align:left}
      .code{font-family:Arial,sans-serif;margin-top:16px;font-size:15px}
      .code strong{font-family:monospace;font-size:26px;letter-spacing:.2em;display:block}
      .slogan{font-style:italic;color:#7C371F;margin-top:18px}
    </style></head><body>
      <p class="brand">KITOKO AFRIKA · PASSEPORT</p>
      <h1>${esc(site?.name || "")}</h1>
      <p class="loc">${esc([site?.region, site?.country].filter(Boolean).join(" · "))}</p>
      <div class="qr">${siteToolsQr.svg}</div>
      <ol class="steps">
        <li>Scannez ce QR code avec l'appareil photo de votre téléphone.</li>
        <li>Découvrez l'histoire du lieu, ses récits et ses savoirs.</li>
        <li>Validez votre visite et obtenez votre tampon dans le passeport Kitoko Afrika.</li>
      </ol>
      <p class="code">Pas de GPS ? Code du site :<strong>${esc(code)}</strong></p>
      <p class="slogan">« Notre Afrique, nos histoires, nos savoirs. »</p>
      <script>window.onload = () => window.print();<\/script>
    </body></html>`);
  poster.document.close();
}

async function refreshSiteTools(siteId){
  await openSiteForm('edit', siteId);
  document.getElementById('sf-tools').scrollIntoView({ block: "start" });
}

async function regenerateCheckinCode(siteId){
  if(!confirm("Générer un nouveau code ? L'ancien ne fonctionnera plus : pensez à réimprimer l'affiche.")) return;
  try {
    await adminRequest(`/admin/sites/${siteId}/checkin-code`, { method: "POST" });
    await refreshSiteTools(siteId);
  } catch(error) { alert(error.message); }
}

async function uploadSiteMedia(siteId, form){
  const button = form.querySelector('button');
  button.disabled = true;
  try {
    await adminRequest(`/admin/sites/${siteId}/media`, { method: "POST", body: new FormData(form) });
    await loadKitokoData();
    await refreshSiteTools(siteId);
  } catch(error) {
    alert(error.message);
  } finally {
    button.disabled = false;
  }
}

async function deleteSiteMedia(mediaId, siteId){
  if(!confirm("Retirer ce média de la galerie ?")) return;
  try {
    await adminRequest(`/admin/media/${mediaId}`, { method: "DELETE" });
    await loadKitokoData();
    await refreshSiteTools(siteId);
  } catch(error) { alert(error.message); }
}

async function addQuizQuestion(siteId, form){
  const inputs = [...form.querySelectorAll('.quiz-edit-choice')];
  const filled = inputs
    .map((label, index) => ({ index, text: label.querySelector('input[type="text"]').value.trim(), correct: label.querySelector('input[type="radio"]').checked }))
    .filter(choice => choice.text);
  const answerIndex = filled.findIndex(choice => choice.correct);
  if(answerIndex < 0){ alert("La bonne réponse cochée doit avoir un texte."); return; }
  try {
    await adminRequest(`/admin/sites/${siteId}/quiz`, {
      method: "POST",
      json: {
        question: form.elements.question.value.trim(),
        choices: filled.map(choice => choice.text),
        answer_index: answerIndex,
        explanation: form.elements.explanation.value.trim(),
        position: 99
      }
    });
    await refreshSiteTools(siteId);
  } catch(error) { alert(error.message); }
}

async function deleteQuizQuestion(questionId, siteId){
  if(!confirm("Supprimer cette question ?")) return;
  try {
    await adminRequest(`/admin/quiz/${questionId}`, { method: "DELETE" });
    await refreshSiteTools(siteId);
  } catch(error) { alert(error.message); }
}

async function addRecit(siteId, form){
  try {
    await adminRequest(`/admin/sites/${siteId}/recits`, {
      method: "POST",
      json: { title: form.elements.title.value.trim(), nature: form.elements.nature.value, author_name: form.elements.author_name.value.trim(), body: form.elements.body.value.trim() }
    });
    await refreshSiteTools(siteId);
  } catch(error) { alert(error.message); }
}

async function deleteRecit(recitId, siteId){
  if(!confirm("Supprimer ce récit ?")) return;
  try {
    await adminRequest(`/admin/recits/${recitId}`, { method: "DELETE" });
    await refreshSiteTools(siteId);
  } catch(error) { alert(error.message); }
}

// ---------------------------------------------------------------------------
// Membres : donner ou retirer les droits d'administration
// ---------------------------------------------------------------------------

let adminUsers = [];

async function loadAdminUsers(){
  const list = document.getElementById('admin-users-list');
  list.innerHTML = '<p class="pane-empty">Chargement…</p>';
  try {
    adminUsers = (await adminRequest('/admin/users')).data;
    renderAdminUsers();
  } catch(error) {
    list.innerHTML = `<p class="pane-empty">${esc(error.message)}</p>`;
  }
}

function renderAdminUsers(){
  const list = document.getElementById('admin-users-list');
  const term = document.getElementById('admin-users-search').value.trim().toLowerCase();
  const users = adminUsers.filter(user => !term || `${user.name} ${user.email}`.toLowerCase().includes(term));
  const admins = adminUsers.filter(user => user.role === 'admin').length;
  list.innerHTML = users.length ? "" : '<p class="pane-empty">Aucun membre ne correspond.</p>';
  users.forEach(user => {
    const isSelf = user.id === currentUser?.id;
    const item = document.createElement('div');
    item.className = "admin-item";
    item.innerHTML = `
      <div class="admin-head">
        <div><p class="an">${esc(user.name)}${isSelf ? " (vous)" : ""}</p><p class="ac">${esc(user.email)} · inscrit le ${esc(formatDate(user.created_at))} · ${user.contributions} contribution${user.contributions > 1 ? "s" : ""} · ${user.stamps} tampon${user.stamps > 1 ? "s" : ""}</p></div>
        ${user.role === 'admin' ? '<span class="admin-badge badge-approved">Administrateur</span>' : '<span class="admin-badge badge-pending">Membre</span>'}
      </div>
      <div class="admin-actions"></div>`;
    const actions = item.querySelector('.admin-actions');
    const button = document.createElement('button');
    if(user.role === 'admin'){
      button.className = "admin-btn reject";
      button.textContent = "Retirer les droits d'administration";
      button.disabled = isSelf || admins <= 1;
      if(isSelf) button.title = "Un autre administrateur doit le faire.";
      button.onclick = () => setUserRole(user, 'user');
    } else {
      button.className = "admin-btn approve";
      button.textContent = "Nommer administrateur";
      button.onclick = () => setUserRole(user, 'admin');
    }
    actions.appendChild(button);
    list.appendChild(item);
  });
}

async function setUserRole(user, role){
  const message = role === 'admin'
    ? `Donner les droits d'administration à ${user.name} ? Cette personne pourra modérer, modifier et supprimer des contenus.`
    : `Retirer les droits d'administration de ${user.name} ?`;
  if(!confirm(message)) return;
  try {
    await adminRequest(`/admin/users/${user.id}/role`, { method: "PATCH", json: { role } });
    await loadAdminUsers();
  } catch(error) { alert(error.message); }
}
