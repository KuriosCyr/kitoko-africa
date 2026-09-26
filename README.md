# Kitoko Afrika

Application web de découverte et de contribution autour des patrimoines africains.

- **Backend** : Node.js, Express 5, SQLite (`better-sqlite3`), `multer` + `sharp` pour les médias — dossier `Backend/`
- **Frontend** : HTML, CSS et JavaScript sans framework, servi par le backend — dossier `Frontend/`

## Prérequis

- Node.js 20 ou supérieur
- npm

## Installation

Depuis la racine du projet (PowerShell, invite de commandes ou terminal) :

```powershell
npm install
Copy-Item Backend/.env.example Backend/.env
```

`npm install` installe aussi les dépendances du backend. Les dépendances ne sont plus versionnées : chaque poste les installe pour son système (Windows, macOS, Linux).

Ouvrir ensuite `Backend/.env` et renseigner au minimum `ADMIN_EMAIL` et `ADMIN_PASSWORD` : le compte administrateur est créé au premier démarrage. Il n'y a plus d'identifiants par défaut.

Puis importer les contenus (54 pays, 88 fiches publiées dans 12 pays avec leurs quiz, un fichier par pays dans `Backend/db/content/`) :

```powershell
npm run db:seed
```

Relancer le seed est sans risque : il ajoute les éléments manquants sans écraser les fiches modifiées depuis l'administration. Pour réappliquer les contenus de `Backend/db/content/` (après une correction de texte, par exemple) :

```powershell
npm run db:update-content
```

Cette commande remet à jour les fiches du Bénin et de la Guinée (textes, thèmes, sources, quiz, récits d'origine) et repasse les autres pays en brouillon. Les comptes, favoris, tampons, contributions et médias ne sont jamais touchés.

## Mettre la démo en ligne gratuitement

Site sur Render (offre gratuite, `render.yaml`) et APK Android compilé par GitHub Actions : voir [`docs/deploiement-gratuit.md`](docs/deploiement-gratuit.md).

## Démarrage

```powershell
npm start        # ou « npm run dev » pour redémarrer automatiquement à chaque modification
```

L'application est disponible sur `http://localhost:3000`.

## Tests

```powershell
npm test
```

Les tests démarrent leur propre serveur sur une base temporaire : inutile de lancer l'application avant, et vos données ne sont pas touchées. Ils couvrent l'authentification, les droits d'accès, les favoris, les contributions (médias compris), la modération, les suggestions de modification et la gestion des sites.

## Configuration (`Backend/.env`)

| Variable | Rôle |
|---|---|
| `NODE_ENV` | `development` ou `production` |
| `PORT` | Port HTTP (3000 par défaut) |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Compte administrateur créé s'il n'existe pas (12 caractères minimum en production) |
| `SESSION_DAYS` | Durée de validité d'une connexion |
| `CORS_ORIGINS` | Origines autorisées à appeler l'API depuis un autre domaine (ex. l'application mobile), séparées par des virgules |
| `TRUST_PROXY` | `1` derrière un reverse proxy (Nginx, Caddy…) |
| `PUBLIC_URL` | Adresse publique du site, imprimée dans les QR codes |
| `DB_PATH`, `UPLOAD_DIR` | Emplacements de la base et des médias (par défaut `Backend/data` et `Backend/uploads`) |

## Contenus

Les fiches du prototype sont rédigées dans `Backend/db/content/benin.js` et `Backend/db/content/guinee.js`, les catégories et thèmes dans `Backend/db/content/themes.js`. Les circuits sont dans `Backend/db/content/itineraires.js`. Si une fiche doit être signalée comme « en cours de vérification » auprès des visiteurs, l'option se trouve dans l'administration (champ « Vérification »). **Les coordonnées GPS sont approximatives : elles doivent être relevées sur place avant d'imprimer les QR codes.**

## Style visuel

Le thème est choisi par une seule ligne dans `Frontend/index.html` :

- `themes/indigo.css` (par défaut) : indigo du Fouta et couleurs des appliqués d'Abomey, polices Cormorant Garamond et Source Sans 3 ;
- `themes/terre.css` : style « Terre et banco » d'origine, polices Fraunces et Work Sans.

Les polices sont hébergées avec l'application (`Frontend/fonts/`) et les icônes (Lucide) sont intégrées à `index.html`.

## Photos

Les photos des sites proviennent de Wikimedia Commons, sous licences libres (CC BY, CC BY-SA, CC0, domaine public). Chaque photo affiche son auteur, sa licence et un lien vers sa source. Elles sont dans `Backend/db/content/images/` (crédits dans `images.json`) et importées par le seed. L'outil `tools/fetch-images.js` (workflow GitHub « Photos Wikimedia ») peut en chercher de nouvelles : vérifier le résultat, et exclure les photos hors sujet dans `images-manifest.json`.

## Passeport

- Chaque site a un lien court `/s/<slug>`, imprimé dans son QR code. L'affiche à poser sur place s'imprime depuis l'administration (fiche du site → « Imprimer l'affiche »).
- **Tampon « visité sur place »** : géolocalisation dans le rayon du site, ou code de secours affiché sur l'affiche. La position n'est jamais enregistrée.
- **Tampon « découvert en ligne »** : toutes les questions du quiz du site ont reçu une réponse (juste ou non, l'explication s'affiche).
- Badges par pays (« Explorateur » sur place, « Connaisseur » en ligne), Afrique de l'Ouest, Afrique, catégories et quiz.
- `PUBLIC_URL` (dans `.env`) définit l'adresse imprimée dans les QR codes.

## Acteurs locaux (passeport économique)

Guides, artisans, restaurants, hébergements, producteurs et activités communautaires déposent leur candidature depuis l'application (Profil → Devenir partenaire), avec acceptation d'une charte. L'équipe la valide dans l'administration (onglet Partenaires). Chaque partenaire publié reçoit un code passeport à donner aux visiteurs après une visite ou un achat : le visiteur obtient un tampon « économie locale ».

## Médias

Les photos, vidéos et sons envoyés par les contributeurs restent **privés** (`uploads/private`) tant qu'un administrateur ne les a pas publiés. Seuls l'auteur et l'équipe de modération peuvent les voir. À la publication, ils passent dans `uploads/public`, servi sous `/uploads`. Les images sont converties en WebP ; le contenu réel des fichiers est vérifié.

## Application mobile

L'application est une PWA : sur téléphone, « Ajouter à l'écran d'accueil » l'installe comme une application, et les fiches déjà consultées restent disponibles hors connexion (HTTPS requis en production). La carte, d3 et les drapeaux du Bénin et de la Guinée sont embarqués (`Frontend/vendor/`), sans dépendre d'un CDN.

Le frontend appelle l'API sur la même adresse que la page. Pour l'emballer dans une application (Capacitor, WebView…), définir l'adresse du serveur avant de charger `app.js` :

```html
<script>window.KITOKO_CONFIG = { apiOrigin: "https://api.kitokoafrika.org" };</script>
```

et ajouter l'origine de l'application dans `CORS_ORIGINS` côté serveur.

## Publication sur les stores

Les projets Android et iOS sont dans `mobile/` (Capacitor) : voir [`mobile/README.md`](mobile/README.md) pour compiler, et [`docs/publication-stores.md`](docs/publication-stores.md) pour les comptes, les fiches (textes prêts), les questionnaires de confidentialité et la liste de vérification. La politique de confidentialité est publiée avec le site : `/confidentialite.html`.

## Sauvegarde

```powershell
npm run db:backup
```

Les copies de la base sont créées dans `Backend/backups/`. Sauvegardez aussi le dossier `Backend/uploads/` (photos et vidéos), et conservez ces sauvegardes hors de la machine en production.

## Production

- `NODE_ENV=production` et un mot de passe administrateur fort dans `.env` ;
- servir l'application derrière HTTPS et un reverse proxy (`TRUST_PROXY=1`) ;
- renseigner `CORS_ORIGINS` si l'API est appelée depuis un autre domaine ;
- planifier `npm run db:backup`.
