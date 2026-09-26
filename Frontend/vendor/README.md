# Bibliothèques et données embarquées

Copiées ici pour que l'application fonctionne hors connexion (sans CDN).

| Fichier | Origine | Licence |
|---|---|---|
| `d3-array.min.js`, `d3-geo.min.js` | [d3](https://d3js.org) (d3-array 3, d3-geo 3) | ISC |
| `topojson-client.min.js` | [topojson-client](https://github.com/topojson/topojson-client) 3 | ISC |
| `jsQR.min.js` | [jsQR](https://github.com/cozmo/jsQR) 1.4 (minifié), chargé seulement à l'ouverture du scanner | Apache-2.0 |
| `jspdf.umd.min.js` | [jsPDF](https://github.com/parallax/jsPDF) 4.2.1, chargé seulement pour les fiches pédagogiques PDF | MIT |
| `africa-50m.json` | Pays africains extraits de [world-atlas](https://github.com/topojson/world-atlas) `countries-50m.json`, données [Natural Earth](https://www.naturalearthdata.com) | ISC / domaine public |

`africa-50m.json` contient les 54 pays africains (et le Sahara occidental), identifiés par leur code ISO 3166 numérique, comme la colonne `countries.code` de la base.
