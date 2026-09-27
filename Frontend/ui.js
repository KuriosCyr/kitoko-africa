// Éléments d'interface communs : messages aux couleurs de Kitoko (à la place
// des fenêtres d'alerte du téléphone), fenêtre de confirmation, bouton
// « afficher / masquer » des mots de passe.
(function(){
  const ERROR_WORDS = /impossible|erreur|incorrect|invalide|refus|échou|indisponible|manquant|requis|trop de|déjà utilisée|introuvable|aucun/i;

  function noticeHost(){
    let host = document.getElementById('notice-host');
    if(!host){
      host = document.createElement('div');
      host.id = 'notice-host';
      host.className = 'notice-host';
      host.setAttribute('aria-live', 'polite');
      document.body.appendChild(host);
    }
    return host;
  }

  // Message discret en bas de l'écran ; disparaît seul, ou d'un appui.
  function notify(message, type){
    const text = String(message ?? "");
    const kind = type || (ERROR_WORDS.test(text) ? "error" : "info");
    const notice = document.createElement('div');
    notice.className = `notice notice-${kind}`;
    notice.setAttribute('role', kind === "error" ? "alert" : "status");
    notice.innerHTML = `<span class="notice-icon">${kind === "error" ? "!" : kind === "success" ? "✓" : "i"}</span><p></p><button type="button" class="notice-close" aria-label="Fermer">×</button>`;
    notice.querySelector('p').textContent = text;
    const close = () => { notice.classList.remove('show'); setTimeout(() => notice.remove(), 250); };
    notice.addEventListener('click', close);
    noticeHost().appendChild(notice);
    requestAnimationFrame(() => notice.classList.add('show'));
    setTimeout(close, Math.min(9000, 3500 + text.length * 40));
  }

  // Fenêtre de confirmation (remplace confirm()) : renvoie une promesse.
  function askConfirm(message, { confirmLabel = "Confirmer", cancelLabel = "Annuler", danger = true } = {}){
    return new Promise(resolve => {
      const overlay = document.createElement('div');
      overlay.className = 'confirm-overlay';
      overlay.innerHTML = `
        <div class="confirm-box" role="alertdialog" aria-modal="true">
          <p class="confirm-text"></p>
          <div class="confirm-actions">
            <button type="button" class="ghost-btn confirm-cancel"></button>
            <button type="button" class="submit-btn confirm-ok${danger ? " is-danger" : ""}"></button>
          </div>
        </div>`;
      overlay.querySelector('.confirm-text').textContent = message;
      overlay.querySelector('.confirm-cancel').textContent = cancelLabel;
      overlay.querySelector('.confirm-ok').textContent = confirmLabel;
      const done = value => { overlay.remove(); document.removeEventListener('keydown', onKey); resolve(value); };
      const onKey = event => { if(event.key === "Escape") done(false); };
      overlay.querySelector('.confirm-cancel').onclick = () => done(false);
      overlay.querySelector('.confirm-ok').onclick = () => done(true);
      overlay.addEventListener('click', event => { if(event.target === overlay) done(false); });
      document.addEventListener('keydown', onKey);
      document.body.appendChild(overlay);
      overlay.querySelector('.confirm-ok').focus();
    });
  }

  // Œil sur chaque champ mot de passe.
  function addPasswordToggles(root = document){
    root.querySelectorAll('input[type="password"]:not([data-eye])').forEach(input => {
      input.dataset.eye = "1";
      const wrap = document.createElement('div');
      wrap.className = 'password-wrap';
      input.parentNode.insertBefore(wrap, input);
      wrap.appendChild(input);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'pw-toggle';
      const render = () => {
        const visible = input.type === "text";
        button.setAttribute('aria-label', visible ? "Masquer le mot de passe" : "Afficher le mot de passe");
        button.innerHTML = `<svg class="ico" aria-hidden="true"><use href="#${visible ? "eye-off" : "eye"}"></use></svg>`;
      };
      button.addEventListener('click', () => {
        input.type = input.type === "password" ? "text" : "password";
        render();
        input.focus();
      });
      render();
      wrap.appendChild(button);
    });
  }

  window.notify = notify;
  window.askConfirm = askConfirm;
  window.addPasswordToggles = addPasswordToggles;
  // Toutes les alertes de l'application passent par les messages Kitoko.
  window.alert = message => notify(message);
  document.addEventListener('DOMContentLoaded', () => {
    addPasswordToggles();
    // L'application ne défile jamais horizontalement : on annule les petits
    // décalages provoqués par le navigateur quand un champ prend le focus.
    const device = document.querySelector('.device');
    if(device) device.addEventListener('scroll', () => { if(device.scrollLeft) device.scrollLeft = 0; }, { passive: true });
  });
})();
