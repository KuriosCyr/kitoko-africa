# Applications mobiles Kitoko Afrika

Les applications Android et iOS emballent le site (`Frontend/`) avec [Capacitor](https://capacitorjs.com). Il n'y a qu'un seul code : toute amélioration du site profite aussi aux applications.

| Dossier | Contenu |
|---|---|
| `android/` | Projet Android Studio (généré par Capacitor, configuré) |
| `ios/` | Projet Xcode (généré par Capacitor, configuré) |
| `assets/` | Icône et écran de démarrage sources |
| `scripts/build-www.js` | Copie `Frontend/` dans `www/` avec l'adresse du serveur |

Identifiant de l'application : `org.kitokoafrika.app` (dans `capacitor.config.json`, à changer **avant** la première publication si besoin : il ne peut plus être modifié ensuite).

## Prérequis

- Le serveur Kitoko Afrika en ligne, en **HTTPS**, par exemple `https://kitokoafrika.org`.
- Node.js 20+.
- **Android** : [Android Studio](https://developer.android.com/studio) (Windows, macOS ou Linux).
- **iOS** : un Mac avec [Xcode](https://developer.apple.com/xcode/) (obligatoire pour compiler et publier sur l'App Store).

## Construire

```bash
cd mobile
npm install
KITOKO_API_ORIGIN=https://kitokoafrika.org npm run sync     # PowerShell : $env:KITOKO_API_ORIGIN="https://kitokoafrika.org"; npm run sync
npm run android    # ouvre Android Studio
npm run ios        # ouvre Xcode (sur Mac)
```

`npm run sync` est à relancer après chaque modification de `Frontend/`.

Côté serveur (`Backend/.env`), autoriser les applications à appeler l'API :

```
CORS_ORIGINS=https://kitokoafrika.org,https://localhost,capacitor://localhost
PUBLIC_URL=https://kitokoafrika.org
```

Pour tester sur l'émulateur Android avec un serveur local : `ALLOW_HTTP=1 KITOKO_API_ORIGIN=http://10.0.2.2:3000 npm run sync` (jamais pour une publication).

## Ce qui est déjà configuré

- **Permissions** : localisation (validation des visites), caméra (scanner de QR code), photos et micro (contributions), avec les textes d'explication exigés par Apple.
- **Liens profonds** : un QR code `https://kitokoafrika.org/s/…` ouvre directement l'application si elle est installée, sur la fiche du site.
  - Android : filtre d'intention dans `AndroidManifest.xml` + variables `ANDROID_PACKAGE` et `ANDROID_SHA256_FINGERPRINTS` du serveur (empreinte fournie par la Play Console, rubrique « Intégrité de l'application »).
  - iOS : `App.entitlements` (Associated Domains) + variable `APPLE_APP_ID` du serveur (`TEAMID.org.kitokoafrika.app`).
  - Si le domaine final n'est pas `kitokoafrika.org`, le remplacer dans `android/app/src/main/AndroidManifest.xml` et `ios/App/App/App.entitlements`.
- **Bouton retour Android** : revient à l'écran précédent.
- **Icônes et écran de démarrage** : générés depuis `assets/` (`npm run assets` après modification du logo).

## Publier

Voir [`docs/publication-stores.md`](../docs/publication-stores.md) : comptes, signature, fiches des stores (textes prêts), questionnaires de confidentialité et liste de vérification.
