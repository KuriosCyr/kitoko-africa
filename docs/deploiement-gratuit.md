# Mettre la démo en ligne gratuitement

Deux livrables, sans budget :

1. **Le site web** hébergé gratuitement sur [Render](https://render.com), accessible par un lien.
2. **L'application Android (APK)** compilée gratuitement par GitHub, à partager et installer directement.

---

## 1. Site web sur Render (gratuit)

Le dépôt contient déjà la configuration (`render.yaml`). Compter une dizaine de minutes.

1. Créer un compte sur <https://render.com> avec **« Sign up with GitHub »**, en utilisant le compte GitHub qui a accès au dépôt `KuriosCyr/kitoko-africa`.
2. Dans le tableau de bord : **New → Blueprint**.
3. Autoriser Render à accéder au dépôt `kitoko-africa`, puis le sélectionner.
4. **Branche** : choisir `claude/eloquent-heisenberg-shvzcw` (ou `main`, une fois le travail fusionné).
5. Render lit `render.yaml` et affiche le service **kitoko-afrika** (offre *Free*). Il demande une valeur pour **ADMIN_EMAIL** : saisir l'adresse e-mail du compte administrateur (ex. votre adresse).
6. Cliquer sur **Apply**. Le premier déploiement prend 3 à 5 minutes.
7. L'adresse du site s'affiche en haut de la page du service, par exemple `https://kitoko-afrika.onrender.com`. C'est le lien à partager.

**Mot de passe administrateur** : Render en génère un automatiquement. Pour le voir : service **kitoko-afrika → Environment → ADMIN_PASSWORD** (icône œil). Se connecter ensuite sur le site avec ADMIN_EMAIL et ce mot de passe, puis Profil → Espace modération.

### Ce qu'il faut savoir sur l'offre gratuite

| Limite | Conséquence |
|---|---|
| Le serveur **s'endort après 15 minutes** sans visite | La première visite suivante prend **jusqu'à une minute** (un message « le serveur se réveille » s'affiche). Ensuite tout est rapide. Astuce avant une présentation : ouvrir le site 2 minutes avant. |
| **Pas de disque permanent** | À chaque réveil ou redéploiement, la base repart des contenus d'origine : **les comptes, tampons et contributions créés pendant les tests sont effacés**. Parfait pour une démo, pas pour une vraie mise en service. |
| 750 heures gratuites par mois | Suffisant pour un seul service. |

Le site est lancé en **mode démonstration** (`DEMO_MODE=1`) : un bandeau l'indique, et chaque fiche affiche un **code de démonstration** pour tester le tampon « visité sur place » sans se rendre au Bénin ou en Guinée.

### Mettre à jour le site
Chaque nouveau commit poussé sur la branche choisie est déployé automatiquement.

---

## 2. Application Android (APK) à partager

L'APK est compilé automatiquement par **GitHub Actions** (gratuit) à chaque modification du site ou de l'application.

### Récupérer l'APK
1. Sur GitHub, ouvrir le dépôt → **Releases** (colonne de droite) → **« Kitoko Afrika — APK de démonstration »**.
2. Télécharger **`kitoko-afrika-demo.apk`**.
3. Le partager (WhatsApp, Google Drive, e-mail…).

### Installer sur un téléphone Android
1. Ouvrir le fichier `kitoko-afrika-demo.apk` sur le téléphone.
2. Android demande d'**autoriser l'installation depuis cette source** (navigateur, WhatsApp…) : accepter.
3. Si Google Play Protect affiche un avertissement (« application inconnue »), choisir **Installer quand même** : c'est normal pour une application qui ne vient pas du Play Store.

Les nouvelles versions s'installent par-dessus l'ancienne.

### Adresse du serveur dans l'APK
L'APK appelle par défaut `https://kitoko-afrika.onrender.com`. **Si Render a donné une autre adresse** (nom déjà pris) :
- GitHub → dépôt → **Settings → Secrets and variables → Actions → Variables → New repository variable** ;
- nom : `KITOKO_API_ORIGIN`, valeur : l'adresse Render exacte (ex. `https://kitoko-afrika-x7k2.onrender.com`) ;
- relancer la compilation : **Actions → « APK Android (démo) » → Run workflow** (ou pousser une modification).

> iPhone : Apple n'autorise pas l'installation d'une application hors App Store sans compte développeur payant. Sur iPhone, utiliser le site : dans Safari, **Partager → Sur l'écran d'accueil** l'installe comme une application (mode hors connexion compris).

---

## 3. Plus tard, avec un budget

- Hébergement avec disque permanent (Render payant, un VPS…) : retirer `AUTO_SEED` et `DEMO_MODE`, sauvegardes (`npm run db:backup`).
- Nom de domaine (ex. `kitokoafrika.org`) et `PUBLIC_URL`.
- Publication Play Store / App Store : voir [`publication-stores.md`](publication-stores.md).
