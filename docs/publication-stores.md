# Publication sur Google Play et l'App Store

Guide pas à pas pour publier Kitoko Afrika. La partie technique est prête (`mobile/`) ; il reste les comptes, la signature, les visuels et les fiches.

## 1. Avant de commencer

| À préparer | Détail |
|---|---|
| Serveur en ligne en HTTPS | Ex. `https://kitokoafrika.org`, avec `NODE_ENV=production`, `PUBLIC_URL`, `CORS_ORIGINS` (voir `mobile/README.md`) |
| Politique de confidentialité | Déjà en ligne avec le site : `https://kitokoafrika.org/confidentialite.html` |
| Adresse e-mail de contact | `contact@kitokoafrika.org` (doit exister et être relevée) |
| Compte de démonstration | Un compte utilisateur simple pour les équipes de validation d'Apple et Google |
| Coordonnées GPS relevées | Pour que la validation sur place fonctionne dès le lancement |

## 2. Comptes développeur

| Store | Coût | Remarques |
|---|---|---|
| **Google Play Console** | 25 $ (une fois) | Compte « Organisation » recommandé (numéro D-U-N-S requis, gratuit). Les nouveaux comptes personnels doivent faire tester l'app par 12 personnes pendant 14 jours avant la publication. |
| **Apple Developer Program** | 99 $ / an | Compte « Organisation » recommandé (D-U-N-S requis). Un Mac avec Xcode est indispensable. |

Au nom d'une association ou d'une structure : le nom affiché comme « développeur » est celui du compte.

## 3. Compiler et signer

### Android
1. `cd mobile && npm install && KITOKO_API_ORIGIN=https://kitokoafrika.org npm run android`
2. Dans Android Studio : **Build → Generate Signed App Bundle** → créer une clé de signature (fichier `.jks`).
   **Conserver la clé et son mot de passe en lieu sûr, hors du dépôt git** : sans elle, plus aucune mise à jour possible (sauf avec la signature gérée par Google Play, recommandée).
3. Envoyer le fichier `.aab` dans la Play Console (d'abord en « Test interne »).
4. Copier l'empreinte SHA-256 de la Play Console (Intégrité de l'application) dans `ANDROID_SHA256_FINGERPRINTS` du serveur.
5. À chaque mise à jour : augmenter `versionCode` (et `versionName`) dans `android/app/build.gradle`.

### iOS
1. Sur Mac : `cd mobile && npm install && KITOKO_API_ORIGIN=https://kitokoafrika.org npm run ios`
2. Dans Xcode : **Signing & Capabilities** → choisir l'équipe ; vérifier la capacité « Associated Domains » (`applinks:kitokoafrika.org`).
3. **Product → Archive**, puis **Distribute App → App Store Connect**.
4. Renseigner `APPLE_APP_ID` (`TEAMID.org.kitokoafrika.app`) sur le serveur.
5. À chaque mise à jour : augmenter la version et le numéro de build.

## 4. Textes des fiches (prêts à copier)

**Nom** : Kitoko Afrika

**Sous-titre (App Store, 30 caractères max)** : Patrimoines africains

**Description courte (Google Play, 80 caractères max)** :
Découvrez les patrimoines du Bénin et de la Guinée et remplissez votre passeport.

**Description complète** :

> Kitoko Afrika — « Notre Afrique, nos histoires, nos savoirs. »
>
> Partez à la découverte des patrimoines, des histoires, des mémoires, des cultures et des savoirs africains, racontés en donnant une place centrale aux voix, aux sources et aux communautés africaines. Premier parcours : le Bénin et la Guinée.
>
> DÉCOUVRIR
> • Une carte interactive de l'Afrique et des sites de chaque pays
> • Des fiches détaillées : histoire, importance culturelle, savoirs et pratiques, personnalités, langues, sources
> • Des récits et traditions orales, clairement distingués des faits documentés
> • Photos, vidéos et enregistrements sonores
>
> VOTRE PASSEPORT DE DÉCOUVERTE
> • Sur place, scannez le QR code d'un site et validez votre visite : tampon « visité sur place »
> • Depuis chez vous, répondez aux quiz : tampon « découvert en ligne »
> • Collectionnez pays, thèmes (mémoire, gastronomie, fêtes, nature…) et badges : Explorateur du patrimoine béninois, Découvreur du patrimoine ouest-africain, Ambassadeur du patrimoine africain…
>
> ITINÉRAIRES
> • Des circuits prêts à suivre : Ouidah et la Route de la mémoire, royaumes du Sud-Bénin, Fouta-Djallon, épopée mandingue…
> • Composez votre propre itinéraire et ouvrez-le dans votre application de cartes
>
> ACTEURS LOCAUX
> • Guides, artisans, tables, hébergements et producteurs partenaires
> • Faites tamponner votre passeport chez eux et soutenez l'économie locale
>
> PARTICIPER
> • Proposez un site, partagez un récit ou un témoignage, envoyez une photo ou un enregistrement, signalez une erreur. Chaque contribution est vérifiée avant publication.
>
> Hors connexion, les fiches déjà consultées restent disponibles. Aucune publicité, aucune revente de données.

**Mots-clés (App Store, 100 caractères max)** :
patrimoine,Afrique,Bénin,Guinée,histoire,culture,voyage,passeport,Ouidah,tourisme,mémoire

**Catégorie** : Voyages (secondaire : Éducation)

**Classification du contenu** : tout public. Mentionner que des contenus traitent de l'histoire de la traite négrière (contexte historique et éducatif).

**URL de confidentialité** : `https://kitokoafrika.org/confidentialite.html`
**URL d'assistance** : `https://kitokoafrika.org` (ou une page contact)

## 5. Questionnaires de confidentialité

Réponses correspondant au fonctionnement réel de l'application :

| Donnée | Collectée ? | Usage | Liée à l'utilisateur | Partagée |
|---|---|---|---|---|
| Nom, e-mail | Oui (compte) | Fonctionnement de l'app | Oui | Non |
| Contenus envoyés (photos, vidéos, sons, textes) | Oui (si l'utilisateur contribue) | Fonctionnement de l'app | Oui | Non (publiés dans l'app après validation) |
| Position | **Non enregistrée** : utilisée sur l'appareil puis envoyée une fois pour vérifier la visite, jamais stockée | Fonctionnement de l'app | Non | Non |
| Activité (favoris, tampons, quiz) | Oui | Fonctionnement de l'app | Oui | Non |
| Identifiants publicitaires, analyses, suivi | **Non** | — | — | — |

- Google Play « Sécurité des données » : chiffrement en transit **oui** (HTTPS) ; suppression du compte **oui**, dans l'app (Profil → Supprimer mon compte) ; lien web de suppression : la politique de confidentialité explique la démarche.
- Apple « Données de confidentialité » : « Données liées à l'utilisateur » = Coordonnées (nom, e-mail), Contenu utilisateur, Historique d'utilisation (tampons). **Pas de suivi** (« tracking »). La position n'est pas à déclarer comme collectée si elle n'est pas conservée ; par prudence, on peut déclarer « Localisation précise — fonctionnalités de l'app, non liée à l'utilisateur ».

## 6. Visuels à fournir

| Visuel | Google Play | App Store |
|---|---|---|
| Icône | 512 × 512 (`Frontend/icons/icon-512.png`) | Incluse dans l'app (générée) |
| Captures d'écran | 2 à 8, téléphone, format 9:16 | Au moins 3 en 6,9″ (1320 × 2868) ou 6,7″ (1290 × 2796) |
| Bannière | 1024 × 500 (« graphique de présentation ») | — |

Captures conseillées : accueil, carte du Bénin, fiche de la Porte du Non-Retour, tampon obtenu, passeport, itinéraire de Ouidah. (Elles seront produites une fois le style visuel définitivement choisi.)

## 7. Points de vigilance de la validation

- **Apple 4.2 (fonctionnalités minimales)** : Apple refuse les applications qui ne sont « qu'un site web ». Kitoko Afrika s'appuie sur des fonctions propres au téléphone (localisation, caméra et scanner, passeport, mode hors connexion) : les mettre en avant dans la note aux validateurs.
- **Apple 5.1.1(v) / Google** : suppression du compte dans l'application — ✅ en place.
- **Compte de démonstration** : fournir identifiant et mot de passe d'un compte test, et le code de secours d'un site (visible dans l'administration) pour que les validateurs puissent tester la validation d'une visite sans se rendre au Bénin.
- **Contenus générés par les utilisateurs** : modération avant publication ✅, moyen de signaler un contenu ✅ (« Signaler ou corriger une information »), contact ✅.

Note suggérée pour les validateurs :

> Kitoko Afrika fait découvrir les patrimoines du Bénin et de la Guinée. Le passeport s'utilise sur place : le visiteur scanne le QR code d'un site, puis valide sa visite par géolocalisation. Pour tester sans être sur place : connectez-vous avec le compte de démonstration, ouvrez la fiche « Porte du Non-Retour », onglet Passeport, « Utiliser le code affiché sur place », et saisissez le code : XXXXXX. Le quiz de la même fiche donne un tampon « découvert en ligne ».

## 8. Liste de vérification finale

- [ ] Serveur en HTTPS, `NODE_ENV=production`, mot de passe admin fort, sauvegardes planifiées
- [ ] `CORS_ORIGINS`, `PUBLIC_URL`, variables des liens profonds renseignées
- [ ] Coordonnées GPS relevées et QR codes imprimés
- [ ] Compte de démonstration créé
- [ ] Application testée sur un vrai téléphone Android et un vrai iPhone (localisation, caméra, hors connexion)
- [ ] Fiches, captures et questionnaires remplis
- [ ] Publication d'abord en test interne (Play) / TestFlight (Apple), puis en production
