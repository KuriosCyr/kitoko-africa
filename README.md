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

Puis importer les données de démonstration (54 pays, 37 sites) :

```powershell
npm run db:seed
```

Relancer le seed est sans risque : il ajoute les éléments manquants sans écraser les fiches modifiées depuis l'administration.

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
| `DB_PATH`, `UPLOAD_DIR` | Emplacements de la base et des médias (par défaut `Backend/data` et `Backend/uploads`) |

## Médias

Les photos et vidéos envoyées par les contributeurs restent **privées** (`uploads/private`) tant qu'un administrateur ne les a pas publiées. Seules l'auteur et l'équipe de modération peuvent les voir. À la publication, elles passent dans `uploads/public`, servi sous `/uploads`. Les images sont converties en WebP ; le contenu réel des fichiers est vérifié.

## Application mobile

Le frontend appelle l'API sur la même adresse que la page. Pour l'emballer dans une application (Capacitor, WebView…), définir l'adresse du serveur avant de charger `app.js` :

```html
<script>window.KITOKO_CONFIG = { apiOrigin: "https://api.kitokoafrika.org" };</script>
```

et ajouter l'origine de l'application dans `CORS_ORIGINS` côté serveur.

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
