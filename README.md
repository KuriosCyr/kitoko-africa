# Kitoko Afrika

Application web de découverte et de contribution autour des patrimoines africains.

## Prérequis

- Node.js 20 ou supérieur
- npm

## Installation

```powershell
npm install
Set-Location Backend
npm install
npm run db:seed
```

Copier `Backend/.env.example` vers `Backend/.env` et remplacer les secrets de production, notamment `ADMIN_PASSWORD`.

## Démarrage

Depuis la racine :

```powershell
npm start
```

L’application est disponible sur `http://localhost:3000`.

## Tests

```powershell
Set-Location Backend
npm test
```

La suite couvre la santé API, l’authentification, les protections, les sites, les médias et les notifications.

## Sauvegarde SQLite

```powershell
Set-Location Backend
npm run db:backup
```

Les copies sont créées dans `Backend/backups/`. Ce dossier doit être sauvegardé hors de la machine en production.

## Production

- utiliser un mot de passe admin fort dans `.env` ;
- servir l’application derrière HTTPS et un reverse proxy ;
- limiter l’exposition du dossier `uploads` ;
- planifier `npm run db:backup` ;
- ne pas utiliser les identifiants de démonstration en production.
