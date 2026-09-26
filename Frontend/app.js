const CAT_LABELS = { historique:"Historique", culturel:"Culturel", naturel:"Naturel", savoirs:"Savoirs" };
const CAT_META = {
  historique: { icon:"🏛️", short:"Histoire", color:"clay" },
  culturel: { icon:"🎭", short:"Culture", color:"indigo" },
  naturel: { icon:"🌿", short:"Nature", color:"forest" },
  savoirs: { icon:"🧺", short:"Savoirs", color:"gold" }
};

const COUNTRIES = [
  {name:"Bénin", flag:"🇧🇯", mapId:"204", lon:2.3, lat:9.3},
  {name:"Guinée", flag:"🇬🇳", mapId:"324", lon:-10.9, lat:10.4},
  {name:"Sénégal", flag:"🇸🇳", mapId:"686", lon:-14.5, lat:14.5},
  {name:"Côte d'Ivoire", flag:"🇨🇮", mapId:"384", lon:-5.5, lat:7.5},
  {name:"Ghana", flag:"🇬🇭", mapId:"288", lon:-1.2, lat:7.9},
  {name:"Togo", flag:"🇹🇬", mapId:"768", lon:1.2, lat:8.6},
  {name:"Mali", flag:"🇲🇱", mapId:"466", lon:-3.9, lat:17.6},
  {name:"Nigéria", flag:"🇳🇬", mapId:"566", lon:8.7, lat:9.1},
  {name:"Maroc", flag:"🇲🇦", mapId:"504", lon:-6, lat:31.8},
  {name:"Égypte", flag:"🇪🇬", mapId:"818", lon:30.8, lat:26.8},
  {name:"Kenya", flag:"🇰🇪", mapId:"404", lon:37.9, lat:0.2},
  {name:"Afrique du Sud", flag:"🇿🇦", mapId:"710", lon:24.7, lat:-30.6}
];

const ALL_AFRICA_COUNTRIES = [
  ["Algérie","012"],["Angola","024"],["Bénin","204"],["Botswana","072"],["Burkina Faso","854"],
  ["Burundi","108"],["Cabo Verde","132"],["Cameroun","120"],["Comores","174"],["Congo","178"],
  ["Côte d'Ivoire","384"],["Djibouti","262"],["Égypte","818"],["Érythrée","232"],["Eswatini","748"],
  ["Éthiopie","231"],["Gabon","266"],["Gambie","270"],["Ghana","288"],["Guinée","324"],
  ["Guinée-Bissau","624"],["Guinée équatoriale","226"],["Kenya","404"],["Lesotho","426"],["Libéria","430"],
  ["Libye","434"],["Madagascar","450"],["Malawi","454"],["Mali","466"],["Maroc","504"],
  ["Maurice","480"],["Mauritanie","478"],["Mozambique","508"],["Namibie","516"],["Niger","562"],
  ["Nigéria","566"],["Ouganda","800"],["République centrafricaine","140"],["République démocratique du Congo","180"],
  ["Rwanda","646"],["São Tomé-et-Príncipe","678"],["Sénégal","686"],["Seychelles","690"],["Sierra Leone","694"],
  ["Somalie","706"],["Soudan","729"],["Soudan du Sud","728"],["Tanzanie","834"],["Tchad","148"],
  ["Togo","768"],["Tunisie","788"],["Zambie","894"],["Zimbabwe","716"],["Afrique du Sud","710"]
].map(([name, mapId])=>({name, mapId}));

const AVAILABLE_COUNTRIES = new Set(COUNTRIES.map(country=>country.mapId));

const API_BASE = "http://localhost:3000/api";

const SITES = [
  {id:1,country:"Bénin",cat:"historique",name:"Palais royaux d'Abomey",region:"Zou, Abomey",featured:true,ownerEmail:null,
   description:"Ancienne capitale du royaume du Dahomey, l'ensemble des palais royaux témoigne de siècles de pouvoir et d'architecture en terre.",
   histoire:"Fondée au XVIIe siècle, Abomey fut la capitale du royaume du Dahomey pendant près de trois cents ans. Selon la tradition, chacun des douze rois qui s'y sont succédé — d'Houégbadja à Agoli-Agbo — fit édifier son propre palais dans la même enceinte royale, si bien que le site est en réalité un ensemble de dix palais construits côte à côte au fil des règnes. Les murs et bas-reliefs en bas-relief moulé racontent, par des symboles, les hauts faits militaires et politiques de chaque souverain. Une grande partie du site fut incendiée en 1892 lors de la conquête coloniale française, avant d'être restaurée ; l'ensemble est inscrit depuis 1985 au patrimoine mondial de l'UNESCO.",
   culture:"Lieu central de la mémoire du royaume du Dahomey, encore associé aujourd'hui à des cérémonies commémoratives et à la légitimité des familles royales.",
   savoirs:"Construction en terre crue (banco), art du bas-relief narratif, techniques de teinture et de confection des tentures appliquées (appliqué du Dahomey).",
   communities:"Musée historique d'Abomey, descendants des familles royales.",langues:"Fon, français",personnalites:"Roi Houégbadja, Roi Ghézo (1818-1858), Roi Béhanzin (1889-1894)",sources:"UNESCO — Centre du patrimoine mondial ; Musée historique d'Abomey — à compléter."},
  {id:2,country:"Bénin",cat:"culturel",name:"Cité lacustre de Ganvié",region:"Atlantique, lac Nokoué",featured:true,ownerEmail:null,
   description:"Village construit sur pilotis au milieu du lac Nokoué, surnommée la « Venise de l'Afrique », habité par le peuple Toffin.",
   histoire:"Selon la tradition orale, Ganvié fut fondée au XVIIIe siècle par des populations tofin fuyant les razzias des guerriers du royaume du Dahomey, alors engagé dans la traite négrière. Les Fon, pour des raisons religieuses, s'interdisaient de s'aventurer sur l'eau : le lac Nokoué devint donc un refuge. Le nom « Ganvié » signifierait « nous avons survécu » ou « la communauté qui a survécu » en langue tofin — un souvenir direct de cette histoire de fuite et de résistance. Le village, aujourd'hui l'un des plus grands ensembles lacustres d'Afrique, compte plusieurs milliers d'habitants vivant entièrement sur pilotis.",
   culture:"Vie quotidienne organisée autour de la pirogue : marché flottant, écoles, église et mosquée sur pilotis.",
   savoirs:"Pêche traditionnelle, construction sur pilotis, pisciculture en enclos de branchages immergés (acadja), une technique ancienne toujours pratiquée.",
   communities:"Communauté Toffin de Ganvié, associations de pêcheurs locaux.",langues:"Toffin, fon, français",personnalites:"—",sources:"Office de tourisme du Bénin — à compléter."},
  {id:3,country:"Bénin",cat:"savoirs",name:"Forêt sacrée de Kpassè",region:"Atlantique, Ouidah",ownerEmail:null,
   description:"Forêt sacrée au cœur de Ouidah, associée au fondateur mythique de la ville et aux pratiques du culte vodun.",
   histoire:"Selon la tradition, le roi Kpassè, considéré comme le fondateur de Ouidah, se serait transformé en arbre iroko en ce lieu pour échapper à ses poursuivants ; la forêt qui porte son nom est depuis considérée comme sacrée par les pratiquants du vodun. Réduite au fil du temps par l'urbanisation, elle a été restaurée et replantée à partir des années 1990 avec des essences symboliques, chaque arbre représentant une divinité (vodun) du panthéon local. Elle se trouve à proximité de la Route des Esclaves, qui reliait autrefois Ouidah à la Porte du Non-Retour sur la côte atlantique.",
   culture:"Site vodun majeur, lieu de cérémonies et de pèlerinage encore fréquenté aujourd'hui, notamment lors de la fête annuelle du Vodun (10 janvier).",
   savoirs:"Connaissances botaniques et médicinales traditionnelles, transmission orale des récits fondateurs de la ville.",
   communities:"Communauté vodun de Ouidah, gardiens traditionnels du site.",langues:"Fon, français",personnalites:"Roi Kpassè",sources:"Direction du patrimoine culturel du Bénin — à compléter."},
  {id:37,country:"Bénin",cat:"historique",name:"Esplanade et Monument des Amazones",region:"Cotonou, 12e arrondissement",featured:true,ownerEmail:null,
   description:"Immense statue en bronze de 30 mètres de haut, dressée en hommage aux Amazones du Dahomey, sur une esplanade face à l'océan Atlantique à Cotonou. L'un des sites les plus visités et photographiés du Bénin aujourd'hui.",
   histoire:"Inaugurée le 30 juillet 2022 par le président béninois Patrice Talon, la statue représente une jeune guerrière armée d'un fusil et d'une épée, tête levée en signe de victoire. Réalisée en structure métallique recouverte de bronze par le sculpteur chinois Li Xiangqun, elle pèse environ 150 tonnes et serait la deuxième plus grande statue d'Afrique. Elle se dresse sur l'esplanade des Amazones, entre le boulevard de la Marina et l'océan, face à la place de l'Indépendance et au palais présidentiel. Le monument rend hommage aux Agojié (ou Minon), régiment militaire entièrement féminin du royaume du Dahomey, qui protégeaient notamment le roi Ghézo puis combattirent sous le règne du roi Béhanzin contre l'armée coloniale française à la fin du XIXe siècle. Ce corps d'élite reste l'un des épisodes les plus marquants de l'histoire militaire de l'Afrique précoloniale.",
   culture:"Devenue la nouvelle image touristique de Cotonou, l'esplanade s'inscrit dans une politique de valorisation du patrimoine et de réappropriation de l'histoire nationale, aux côtés des statues de Bio Guéra et de l'obélisque aux Dévoués, inaugurées le même jour.",
   savoirs:"Histoire de l'organisation militaire des Agojié, mémoire orale sur le rôle des femmes dans le royaume du Dahomey.",
   communities:"Ville de Cotonou, guides touristiques locaux.",langues:"Fon, français",personnalites:"Roi Ghézo, Roi Béhanzin, sculpteur Li Xiangqun",sources:"Wikipédia — Monument Amazone ; Jeune Afrique, 26/08/2022 ; Afrik.com — à compléter par le pôle Documentation."},

  {id:4,country:"Guinée",cat:"naturel",name:"Mont Nimba",region:"N'Zérékoré",featured:true,
   description:"Massif montagneux et réserve naturelle intégrale, l'un des plus riches foyers de biodiversité d'Afrique de l'Ouest.",
   histoire:"Classé réserve de biosphère puis patrimoine mondial de l'UNESCO pour sa biodiversité exceptionnelle.",
   culture:"Montagne considérée comme sacrée par certaines communautés locales.",
   savoirs:"Connaissances environnementales locales, conservation communautaire.",
   communities:"Communautés riveraines du massif.",langues:"Kpèlè, français",personnalites:"—",sources:"UNESCO — à compléter."},
  {id:5,country:"Guinée",cat:"naturel",name:"Îles de Los",region:"Conakry",
   description:"Archipel au large de Conakry, plages et forêt côtière, marqué aussi par son passé lié à la traite atlantique.",
   histoire:"Point de passage historique occupé successivement par plusieurs puissances européennes.",
   culture:"Mémoire liée à la traite négrière, aujourd'hui site de mémoire et de détente.",
   savoirs:"Pêche artisanale, savoirs de navigation côtière.",
   communities:"Pêcheurs et habitants de l'archipel.",langues:"Soussou, français",personnalites:"—",sources:"Office guinéen du tourisme — à compléter."},
  {id:6,country:"Guinée",cat:"savoirs",name:"Villages du Fouta Djallon",region:"Labé",
   description:"Massif montagneux peuplé majoritairement par les Peuls, connu pour ses paysages et son artisanat textile.",
   histoire:"Ancien centre de l'État théocratique peul du Fouta Djallon, fondé au XVIIIe siècle.",
   culture:"Forte identité peule, transmission orale de la généalogie des lignages.",
   savoirs:"Tissage traditionnel, élevage pastoral, pharmacopée peule.",
   communities:"Communautés peules, artisans tisserands.",langues:"Pular, français",personnalites:"Alpha Yaya Diallo",sources:"Institut national de recherche de Guinée — à compléter."},

  {id:7,country:"Sénégal",cat:"historique",name:"Île de Gorée",region:"Dakar",featured:true,
   description:"Petite île au large de Dakar, lieu de mémoire majeur de la traite négrière transatlantique.",
   histoire:"La Maison des Esclaves y symbolise le départ forcé de millions d'Africains vers les Amériques.",
   culture:"Lieu de recueillement et de pèlerinage mémoriel, classé patrimoine mondial de l'UNESCO.",
   savoirs:"Transmission de la mémoire de la traite auprès des jeunes générations.",
   communities:"Habitants de l'île, guides mémoriels.",langues:"Wolof, français",personnalites:"—",sources:"UNESCO — à compléter."},
  {id:8,country:"Sénégal",cat:"naturel",name:"Lac Rose (Lac Retba)",region:"Dakar",
   description:"Lac dont l'eau prend une teinte rosée due à une algue riche en bêta-carotène, ancien point d'arrivée du Rallye Dakar.",
   histoire:"Exploité depuis des décennies pour l'extraction artisanale du sel.",
   culture:"Symbole touristique du Sénégal, lieu de vie des extracteurs de sel.",
   savoirs:"Techniques traditionnelles d'extraction et de conservation du sel.",
   communities:"Coopératives d'extracteurs de sel.",langues:"Wolof, français",personnalites:"—",sources:"Office sénégalais du tourisme — à compléter."},
  {id:9,country:"Sénégal",cat:"culturel",name:"Île de Saint-Louis",region:"Saint-Louis",
   description:"Ancienne capitale coloniale à l'architecture particulière, entre fleuve Sénégal et océan Atlantique.",
   histoire:"Première ville fondée par les Français en Afrique de l'Ouest, classée patrimoine mondial.",
   culture:"Connue pour son festival de jazz et son métissage architectural.",
   savoirs:"Savoir-faire de la pêche traditionnelle sur pirogues colorées.",
   communities:"Pêcheurs Guet-Ndariens, association de sauvegarde du patrimoine.",langues:"Wolof, français",personnalites:"—",sources:"UNESCO — à compléter."},

  {id:10,country:"Côte d'Ivoire",cat:"historique",name:"Basilique de Yamoussoukro",region:"Yamoussoukro",
   description:"Plus grande basilique du monde par sa superficie, inspirée de Saint-Pierre de Rome.",
   histoire:"Construite dans les années 1980 à l'initiative du président Félix Houphouët-Boigny.",
   culture:"Symbole architectural majeur de la capitale politique ivoirienne.",
   savoirs:"Savoir-faire artisanal du vitrail et de la sculpture religieuse.",
   communities:"Diocèse de Yamoussoukro.",langues:"Baoulé, français",personnalites:"Félix Houphouët-Boigny",sources:"À compléter."},
  {id:11,country:"Côte d'Ivoire",cat:"naturel",name:"Parc national de Taï",region:"Sud-Ouest",featured:true,
   description:"Une des dernières grandes forêts primaires d'Afrique de l'Ouest, riche en biodiversité.",
   histoire:"Classé réserve de biosphère puis patrimoine mondial de l'UNESCO.",
   culture:"Terre de communautés forestières vivant de la forêt depuis des générations.",
   savoirs:"Connaissances sur les chimpanzés utilisateurs d'outils, pratiques de conservation.",
   communities:"Communautés riveraines, chercheurs en primatologie.",langues:"Français",personnalites:"—",sources:"UNESCO — à compléter."},
  {id:12,country:"Côte d'Ivoire",cat:"culturel",name:"Grand-Bassam",region:"Sud-Comoé",
   description:"Ancienne capitale coloniale, ville historique au bord de l'océan, architecture coloniale préservée.",
   histoire:"Première capitale de la Côte d'Ivoire française, abandonnée après une épidémie de fièvre jaune.",
   culture:"Ville d'art et d'artisanat, quartier France classé au patrimoine mondial.",
   savoirs:"Artisanat local, sculpture sur bois.",
   communities:"Association des artisans de Grand-Bassam.",langues:"Français, dioula",personnalites:"—",sources:"UNESCO — à compléter."},

  {id:13,country:"Ghana",cat:"historique",name:"Château de Cape Coast",region:"Cape Coast",featured:true,
   description:"Ancien comptoir et fort colonial, l'un des principaux points de départ de la traite négrière transatlantique.",
   histoire:"Construit par les Suédois puis repris par les Britanniques, il servit de centre de détention d'esclaves.",
   culture:"Lieu de mémoire majeur, visité chaque année par des descendants de la diaspora.",
   savoirs:"Transmission de la mémoire de la traite négrière.",
   communities:"Communauté locale de Cape Coast, guides mémoriels.",langues:"Fante, anglais",personnalites:"—",sources:"UNESCO — à compléter."},
  {id:14,country:"Ghana",cat:"historique",name:"Fort d'Elmina",region:"Elmina",
   description:"Plus ancien édifice colonial européen d'Afrique subsaharienne, construit par les Portugais en 1482.",
   histoire:"Utilisé successivement pour le commerce de l'or puis pour la traite négrière.",
   culture:"Site classé au patrimoine mondial de l'UNESCO, lieu de mémoire.",
   savoirs:"Histoire du commerce transatlantique et de la résistance.",
   communities:"Communauté de pêcheurs d'Elmina.",langues:"Fante, anglais",personnalites:"—",sources:"UNESCO — à compléter."},
  {id:15,country:"Ghana",cat:"naturel",name:"Lac Volta",region:"Est du Ghana",
   description:"L'un des plus grands lacs artificiels du monde, formé par le barrage d'Akosombo.",
   histoire:"Créé dans les années 1960 pour la production d'électricité et l'irrigation.",
   culture:"Vie économique locale organisée autour de la pêche et du transport lacustre.",
   savoirs:"Pêche traditionnelle, savoirs liés à la gestion de l'eau.",
   communities:"Communautés de pêcheurs riveraines.",langues:"Ewe, anglais",personnalites:"—",sources:"À compléter."},

  {id:16,country:"Togo",cat:"culturel",name:"Koutammakou (Pays Batammariba)",region:"Nord-Togo",featured:true,
   description:"Paysage culturel des Batammariba, connu pour ses cases-tours en terre (Takienta) uniques en Afrique.",
   histoire:"Habité par les Batammariba depuis plusieurs siècles, préservant un mode de vie traditionnel.",
   culture:"Classé au patrimoine mondial de l'UNESCO pour son architecture et son organisation sociale.",
   savoirs:"Architecture en terre, rites de passage, cosmogonie batammariba.",
   communities:"Communauté batammariba.",langues:"Ditammari, français",personnalites:"—",sources:"UNESCO — à compléter."},
  {id:17,country:"Togo",cat:"naturel",name:"Lac Togo",region:"Région Maritime",
   description:"Lagune côtière prisée pour les activités nautiques et son cadre naturel calme.",
   histoire:"Longtemps un lieu de pêche et d'échanges commerciaux locaux.",
   culture:"Village d'Agbodrafo et son passé lié à la traite négrière à proximité.",
   savoirs:"Pêche lagunaire, tressage de filets.",
   communities:"Pêcheurs riverains du lac.",langues:"Éwé, français",personnalites:"—",sources:"À compléter."},
  {id:18,country:"Togo",cat:"savoirs",name:"Marché des féticheurs d'Akodessewa",region:"Lomé",
   description:"Marché traditionnel consacré à la pharmacopée et aux pratiques du culte vodun.",
   histoire:"Fonctionne depuis des générations comme centre de savoirs traditionnels vodun.",
   culture:"Lieu central des pratiques spirituelles vodun au Togo.",
   savoirs:"Pharmacopée traditionnelle, connaissances botaniques et rituelles.",
   communities:"Guérisseurs traditionnels, prêtres vodun.",langues:"Éwé, français",personnalites:"—",sources:"À compléter."},

  {id:19,country:"Mali",cat:"historique",name:"Tombouctou",region:"Nord du Mali",featured:true,
   description:"Ancienne cité savante médiévale, carrefour caravanier et centre intellectuel de l'islam en Afrique de l'Ouest.",
   histoire:"Abrite des milliers de manuscrits anciens témoignant d'une riche tradition scientifique et religieuse.",
   culture:"Ville classée au patrimoine mondial de l'UNESCO, mausolées et mosquées de terre.",
   savoirs:"Manuscrits anciens, astronomie, droit islamique, médecine traditionnelle.",
   communities:"Familles de gardiens de manuscrits, érudits locaux.",langues:"Songhaï, tamasheq, français",personnalites:"—",sources:"UNESCO — à compléter."},
  {id:20,country:"Mali",cat:"culturel",name:"Falaise de Bandiagara (Pays Dogon)",region:"Mopti",
   description:"Falaise spectaculaire abritant les villages dogons, célèbres pour leur architecture et leur cosmogonie.",
   histoire:"Habité depuis des siècles, refuge historique face aux invasions successives.",
   culture:"Cosmogonie dogon complexe, masques et danses rituelles reconnues mondialement.",
   savoirs:"Architecture troglodyte, astronomie traditionnelle, agriculture en terrasses.",
   communities:"Communauté dogon.",langues:"Dogon, français",personnalites:"—",sources:"UNESCO — à compléter."},
  {id:21,country:"Mali",cat:"historique",name:"Grande Mosquée de Djenné",region:"Djenné",
   description:"Plus grand édifice en terre crue du monde, chef-d'œuvre de l'architecture soudano-sahélienne.",
   histoire:"Reconstruite au début du XXe siècle sur le site d'une mosquée du XIIIe siècle.",
   culture:"Cœur spirituel de la ville de Djenné, entretenue chaque année par la population.",
   savoirs:"Architecture en banco, techniques de crépissage collectif annuel.",
   communities:"Population de Djenné, corporation des maçons.",langues:"Bambara, français",personnalites:"—",sources:"UNESCO — à compléter."},

  {id:22,country:"Nigéria",cat:"historique",name:"Murs de Bénin City",region:"État d'Edo",
   description:"Vestiges des anciens remparts du puissant royaume du Bénin, l'une des plus grandes structures faites de main d'homme.",
   histoire:"Édifiés à partir du XIIIe siècle pour protéger la capitale du royaume du Bénin.",
   culture:"Témoin de l'un des royaumes les plus sophistiqués d'Afrique précoloniale, connu pour ses bronzes.",
   savoirs:"Art du bronze, organisation urbaine et politique du royaume.",
   communities:"Palais royal d'Edo, historiens locaux.",langues:"Edo, anglais",personnalites:"Oba d'Edo",sources:"À compléter."},
  {id:23,country:"Nigéria",cat:"naturel",name:"Rochers d'Idanre",region:"État d'Ondo",featured:true,
   description:"Collines rocheuses sacrées surplombant la ville historique d'Idanre, accessibles par des marches ancestrales.",
   histoire:"Ancien site de peuplement yoruba, refuge historique en cas de conflit.",
   culture:"Considérées comme sacrées, associées à des divinités et légendes locales.",
   savoirs:"Connaissances géologiques et légendes de peuplement transmises oralement.",
   communities:"Communauté yoruba d'Idanre.",langues:"Yoruba, anglais",personnalites:"—",sources:"À compléter."},
  {id:24,country:"Nigéria",cat:"savoirs",name:"Bois sacré d'Osun-Osogbo",region:"État d'Osun",
   description:"Forêt sacrée dédiée à la déesse yoruba Osun, ponctuée de sanctuaires et de sculptures.",
   histoire:"Lieu de culte continu depuis des siècles, encore vivant aujourd'hui.",
   culture:"Cœur du culte yoruba d'Osun, festival annuel rassemblant des milliers de fidèles.",
   savoirs:"Pharmacopée traditionnelle, art sacré yoruba, rites de fertilité.",
   communities:"Prêtresses et prêtres du culte d'Osun.",langues:"Yoruba, anglais",personnalites:"—",sources:"UNESCO — à compléter."},

  {id:25,country:"Maroc",cat:"culturel",name:"Médina de Fès",region:"Fès",featured:true,
   description:"L'une des plus grandes zones piétonnes urbaines du monde, dédale de ruelles, souks et médersas.",
   histoire:"Fondée au IXe siècle, ancienne capitale intellectuelle et spirituelle du Maroc.",
   culture:"Abrite l'université Al Quaraouiyine, l'une des plus anciennes au monde encore en activité.",
   savoirs:"Artisanat du cuir, de la céramique et du travail du métal transmis de génération en génération.",
   communities:"Corporations d'artisans de la médina.",langues:"Arabe, amazigh, français",personnalites:"—",sources:"UNESCO — à compléter."},
  {id:26,country:"Maroc",cat:"historique",name:"Kasbah d'Aït-Ben-Haddou",region:"Ouarzazate",
   description:"Ksar fortifié en pisé, ancienne étape caravanière entre le Sahara et Marrakech.",
   histoire:"Construit à partir du XVIIe siècle le long d'une route commerciale transsaharienne majeure.",
   culture:"Exemple emblématique de l'architecture en terre du sud marocain.",
   savoirs:"Techniques de construction en pisé et en adobe.",
   communities:"Familles habitant encore une partie du ksar.",langues:"Amazigh, arabe, français",personnalites:"—",sources:"UNESCO — à compléter."},
  {id:27,country:"Maroc",cat:"culturel",name:"Chefchaouen",region:"Rif",
   description:"Ville aux murs peints en bleu, nichée dans les montagnes du Rif.",
   histoire:"Fondée au XVe siècle, refuge historique pour les populations andalouses et juives.",
   culture:"Identité visuelle unique, mélange d'influences amazighes, arabes et andalouses.",
   savoirs:"Tissage traditionnel de la laine, artisanat local.",
   communities:"Population locale amazighe et andalouse.",langues:"Amazigh, arabe, français",personnalites:"—",sources:"À compléter."},

  {id:28,country:"Égypte",cat:"historique",name:"Pyramides de Gizeh",region:"Gizeh",featured:true,
   description:"Dernière des sept merveilles du monde antique encore debout, complexe funéraire monumental.",
   histoire:"Construites il y a environ 4500 ans pour les pharaons de la IVe dynastie.",
   culture:"Symbole mondial de la civilisation égyptienne antique.",
   savoirs:"Ingénierie et astronomie de l'Égypte ancienne.",
   communities:"Autorités du patrimoine égyptien.",langues:"Arabe",personnalites:"Khéops, Khéphren, Mykérinos",sources:"UNESCO — à compléter."},
  {id:29,country:"Égypte",cat:"historique",name:"Vallée des Rois",region:"Louxor",
   description:"Nécropole royale du Nouvel Empire abritant les tombeaux richement décorés des pharaons.",
   histoire:"Utilisée pendant environ 500 ans comme lieu de sépulture des pharaons et nobles.",
   culture:"Site archéologique majeur, dont la tombe de Toutankhamon découverte en 1922.",
   savoirs:"Peinture funéraire, hiéroglyphes, rites funéraires égyptiens.",
   communities:"Autorités archéologiques, guides locaux.",langues:"Arabe",personnalites:"Toutankhamon, Ramsès II",sources:"UNESCO — à compléter."},
  {id:30,country:"Égypte",cat:"historique",name:"Temple d'Abou Simbel",region:"Nubie",
   description:"Temples monumentaux taillés dans la roche par Ramsès II, déplacés pierre par pierre au XXe siècle.",
   histoire:"Construits au XIIIe siècle av. J.-C., sauvés des eaux du barrage d'Assouan par un déplacement spectaculaire.",
   culture:"Symbole du génie architectural égyptien et d'un sauvetage patrimonial international.",
   savoirs:"Astronomie appliquée à l'architecture, sculpture monumentale.",
   communities:"Communauté nubienne.",langues:"Arabe, nubien",personnalites:"Ramsès II",sources:"UNESCO — à compléter."},

  {id:31,country:"Kenya",cat:"naturel",name:"Réserve du Maasai Mara",region:"Vallée du Rift",featured:true,
   description:"Réserve emblématique de la grande migration annuelle des gnous et des zèbres.",
   histoire:"Terre ancestrale du peuple Maasaï, réserve protégée depuis le milieu du XXe siècle.",
   culture:"Forte présence culturelle maasaï autour de la réserve.",
   savoirs:"Savoirs pastoraux et connaissance approfondie de la faune sauvage.",
   communities:"Communauté maasaï, guides et rangers locaux.",langues:"Maa, swahili, anglais",personnalites:"—",sources:"À compléter."},
  {id:32,country:"Kenya",cat:"historique",name:"Fort Jesus",region:"Mombasa",
   description:"Forteresse construite par les Portugais au XVIe siècle pour contrôler la route commerciale de l'océan Indien.",
   histoire:"Successivement occupé par Portugais, Omanais et Britanniques au fil des siècles.",
   culture:"Témoin des échanges swahili-arabo-portugais sur la côte est-africaine.",
   savoirs:"Architecture militaire, histoire du commerce dans l'océan Indien.",
   communities:"Communauté swahili de Mombasa.",langues:"Swahili, anglais",personnalites:"—",sources:"UNESCO — à compléter."},
  {id:33,country:"Kenya",cat:"naturel",name:"Lac Nakuru",region:"Vallée du Rift",
   description:"Lac alcalin connu pour ses immenses colonies de flamants roses et sa riche faune.",
   histoire:"Classé parc national dès 1961 pour protéger l'écosystème du lac.",
   culture:"Site emblématique du tourisme de nature au Kenya.",
   savoirs:"Connaissances écologiques sur les lacs alcalins de la vallée du Rift.",
   communities:"Services des parcs nationaux du Kenya.",langues:"Swahili, anglais",personnalites:"—",sources:"À compléter."},

  {id:34,country:"Afrique du Sud",cat:"historique",name:"Robben Island",region:"Le Cap",featured:true,
   description:"Île-prison au large du Cap, tristement célèbre pour avoir enfermé des opposants à l'apartheid.",
   histoire:"Nelson Mandela y fut emprisonné pendant 18 des 27 années de sa détention.",
   culture:"Symbole mondial de la lutte contre l'apartheid et de la réconciliation.",
   savoirs:"Histoire de la résistance politique sud-africaine.",
   communities:"Fondation Robben Island, anciens prisonniers guides.",langues:"Xhosa, afrikaans, anglais",personnalites:"Nelson Mandela",sources:"UNESCO — à compléter."},
  {id:35,country:"Afrique du Sud",cat:"naturel",name:"Montagne de la Table",region:"Le Cap",
   description:"Massif emblématique surplombant Le Cap, souvent couvert d'une nappe de nuages caractéristique.",
   histoire:"Repère historique pour les navigateurs depuis plusieurs siècles.",
   culture:"Symbole visuel de la ville du Cap et de l'Afrique du Sud.",
   savoirs:"Biodiversité unique du fynbos, flore endémique protégée.",
   communities:"Parc national de la Montagne de la Table.",langues:"Afrikaans, xhosa, anglais",personnalites:"—",sources:"À compléter."},
  {id:36,country:"Afrique du Sud",cat:"savoirs",name:"Berceau de l'Humanité",region:"Gauteng",
   description:"Ensemble de sites archéologiques ayant livré certains des plus anciens fossiles d'hominidés connus.",
   histoire:"Fouilles menées depuis le début du XXe siècle, dont la découverte du fossile « Little Foot ».",
   culture:"Site clé pour comprendre les origines de l'humanité en Afrique.",
   savoirs:"Paléoanthropologie, datation des fossiles, évolution humaine.",
   communities:"Instituts de recherche paléoanthropologique.",langues:"Afrikaans, anglais",personnalites:"—",sources:"UNESCO — à compléter."}
];

let currentCountry = "Bénin";
let currentCat = "toutes";
let searchTerm = "";
let currentSiteId = null;
let favorites = new Set();
let myContributions = [];
let notifications = [];
let contributionCount = 0;
let isLoggedIn = false;
let currentUser = null;
let authToken = localStorage.getItem("kitoko_auth_token");
let authMode = "signup";
let mediaAttached = false;
let navHistory = [];

let pendingSubmissions = [
  {id:1,type:"new",targetSiteId:null,name:"Marché de Dantokpa",country:"Bénin",cat:"culturel",contributor:"Aïcha K.",contributorEmail:null,excerpt:"Un des plus grands marchés d'Afrique de l'Ouest, réputé pour son quartier des tissus et ses produits traditionnels.",media:true,status:"pending"},
  {id:2,type:"new",targetSiteId:null,name:"Chutes de la Lobé",country:"Cameroun",cat:"naturel",contributor:"Jean-Paul M.",contributorEmail:null,excerpt:"Chutes se jetant directement dans l'océan Atlantique, cas rare sur le continent.",media:true,status:"pending"}
];
let adminSites = [];
let featuredAutoScrollFrame = null;
let featuredAutoScrollPaused = false;
let nextSiteId = 38;
let formMode = "add";
let editingSiteId = null;
let suggestTargetId = null;
let adminTab = "pending";

const NAV_ITEMS = [
  { id:"discover", label:"Découvrir", icon:"◎", screen:"screen-discover" },
  { id:"favorites", label:"Favoris", icon:"♥", screen:"screen-favorites" },
  { id:"contribute", label:"Contribuer", icon:"+", screen:"screen-contribute" },
  { id:"profile", label:"Profil", icon:"○", screen:"screen-profile" }
];

function catClass(cat){ return "cat-" + cat; }

function flagImage(flag, className, alt = "Drapeau"){ 
  if(!flag || !flag.trim()) return "";
  const code = Array.from(flag).map(char =>
    String.fromCharCode(char.codePointAt(0) - 0x1F1E6 + 97)
  ).join('');
  return `<img class="${className || "flag-image"}" src="https://flagcdn.com/w40/${code}.png" alt="${alt}" loading="lazy" decoding="async">`;
}

function buildNav(containerId, activeId){
  const el = document.getElementById(containerId);
  el.innerHTML = "";
  NAV_ITEMS.forEach(item=>{
    const btn = document.createElement('button');
    btn.className = "navitem" + (item.id===activeId ? " active" : "");
    btn.innerHTML = `<span class="navicon">${item.icon}</span>${item.label}<span class="navdot"></span>`;
    btn.onclick = ()=>showScreen(item.screen);
    el.appendChild(btn);
  });
}

function showScreen(id, opts){
  opts = opts || {};
  const current = document.querySelector('.screen.active');
  if(!opts.skipHistory && current && current.id !== id){ navHistory.push(current.id); }
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.getElementById('home-return').classList.toggle('hidden', id === 'screen-home');
  document.querySelectorAll('.persistent-nav-item').forEach(item=>{
    item.classList.toggle('active', item.dataset.screen === id);
  });
  updateAdminVisibility();
  closeMenu();
  if(id==="screen-home") renderHome();
  if(id==="screen-favorites") renderFavorites();
  if(id==="screen-profile") renderProfile();
  if(id==="screen-contribute") renderContribute();
  if(id==="screen-admin") renderAdmin();
}

function goBack(){
  const prev = navHistory.pop();
  showScreen(prev || 'screen-home', {skipHistory:true});
}

function goBackFromDetail(){ goBack(); }

function openMenu(){ document.getElementById('menu-overlay').classList.add('open'); document.getElementById('menu-drawer').classList.add('open'); }
function closeMenu(){ document.getElementById('menu-overlay').classList.remove('open'); document.getElementById('menu-drawer').classList.remove('open'); }
function menuGo(id){ showScreen(id); }

function updateAdminVisibility(){
  const visible = Boolean(authToken && currentUser?.role === "admin");
  document.querySelectorAll('.admin-entry').forEach(item => { item.hidden = !visible; });
}

function renderHome(){
  document.getElementById('hs-countries').textContent = COUNTRIES.length;
  document.getElementById('hs-sites').textContent = SITES.length;
  document.getElementById('qs-discover').textContent = COUNTRIES.length + " pays, " + SITES.length + " sites";
  document.getElementById('qs-fav').textContent = favorites.size + " sauvegardé" + (favorites.size>1?"s":"");
  const feat = document.getElementById('featured-scroll');
  feat.innerHTML = "";
  SITES.filter(s=>s.featured).forEach(s=>{
    const c = document.createElement('div');
    c.className = "feat-card";
    c.onclick = ()=>openDetail(s.id);
    c.innerHTML = `<div class="feat-visual ${catClass(s.cat)}">${s.country}</div><div class="feat-body"><p class="fn">${s.name}</p><p class="fc">${s.region}</p></div>`;
    feat.appendChild(c);
  });
  startFeaturedAutoScroll();
}

function stopFeaturedAutoScroll(){
  if(featuredAutoScrollFrame) cancelAnimationFrame(featuredAutoScrollFrame);
  featuredAutoScrollFrame = null;
}

function startFeaturedAutoScroll(){
  const strip = document.getElementById('featured-scroll');
  if(!strip || strip.children.length < 2 || strip.scrollWidth <= strip.clientWidth) return;
  stopFeaturedAutoScroll();

  let previousTime = 0;
  const move = timestamp => {
    if(!previousTime) previousTime = timestamp;
    const elapsed = timestamp - previousTime;
    previousTime = timestamp;
    if(!featuredAutoScrollPaused){
      strip.scrollLeft += elapsed * 0.028;
      if(strip.scrollLeft >= strip.scrollWidth - strip.clientWidth - 1) strip.scrollLeft = 0;
    }
    featuredAutoScrollFrame = requestAnimationFrame(move);
  };

  if(strip.dataset.autoScrollBound !== "true"){
    strip.dataset.autoScrollBound = "true";
    strip.addEventListener('pointerenter', ()=>{ featuredAutoScrollPaused = true; });
    strip.addEventListener('pointerleave', ()=>{ featuredAutoScrollPaused = false; });
    strip.addEventListener('touchstart', ()=>{
      featuredAutoScrollPaused = true;
      clearTimeout(startFeaturedAutoScroll.resumeTimer);
      startFeaturedAutoScroll.resumeTimer = setTimeout(()=>{ featuredAutoScrollPaused = false; }, 2200);
    }, { passive:true });
  }
  featuredAutoScrollFrame = requestAnimationFrame(move);
}

function updateReadingProgress(){
  const body = document.getElementById('detail-body');
  const bar = document.getElementById('reading-progress-bar');
  if(!body || !bar) return;
  const available = body.scrollHeight - body.clientHeight;
  const progress = available > 0 ? (body.scrollTop / available) * 100 : 100;
  bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
}

function renderFlagMarquee(){
  const track = document.getElementById('flag-marquee-track');
  if(!track) return;
  const items = COUNTRIES.map(country => `
    <span class="flag-marquee-item">${flagImage(country.flag, "marquee-flag")}<span>${country.name}</span></span>
  `).join('');
  track.innerHTML = items + items;
}

async function loadKitokoData(){
  document.getElementById('device')?.classList.add('is-loading');
  try {
    const [countriesResponse, sitesResponse] = await Promise.all([
      fetch(`${API_BASE}/countries`),
      fetch(`${API_BASE}/sites`)
    ]);

    const countriesJson = await countriesResponse.json();
    const sitesJson = await sitesResponse.json();

    if(!countriesResponse.ok || !countriesJson.success){
      throw new Error(countriesJson.message || "Erreur lors du chargement des pays.");
    }

    if(!sitesResponse.ok || !sitesJson.success){
      throw new Error(sitesJson.message || "Erreur lors du chargement des sites.");
    }

    const localFeatured = new Map(SITES.map(site=>[site.id, site.featured]));

    const exploreCountries = countriesJson.data.filter(country =>
      Number(country.sites_count) > 0 || country.name === "Cameroun"
    );

    COUNTRIES.splice(0, COUNTRIES.length, ...exploreCountries.map(country=>({
      name: country.name,
      flag: country.flag || "",
      mapId: String(country.iso2 || "")
    })));

    SITES.splice(0, SITES.length, ...sitesJson.data.map(site=>({
      ...site,
      country: site.country,
      cat: site.category,
      featured: localFeatured.get(site.id) || Boolean(site.featured),
      ownerEmail: null
    })));

    AVAILABLE_COUNTRIES.clear();
    COUNTRIES.forEach(country=>AVAILABLE_COUNTRIES.add(country.mapId));
  } catch(error) {
    console.error("Impossible de charger les données Kitoko Afrika :", error);
  } finally {
    document.getElementById('device')?.classList.remove('is-loading');
  }
}

async function renderRealAfricaMap(){
  if(!window.d3 || !window.topojson) return;

  try {
    const response = await fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json");
    const topology = await response.json();
    const features = topojson.feature(topology, topology.objects.countries).features;
    const africa = features.filter(feature=>{
      const bounds = d3.geoBounds(feature);
      return bounds[1][0] >= -20 && bounds[0][0] <= 55 && bounds[1][1] >= -36 && bounds[0][1] <= 38;
    });
    const collection = { type:"FeatureCollection", features:africa };
    const projection = d3.geoNaturalEarth1().fitSize([100, 110], collection);
    const path = d3.geoPath(projection);
    const countryFeatures = new Map(africa.map(feature=>[String(feature.id).padStart(3, "0"), feature]));
    const group = document.getElementById("real-africa-map");
    group.innerHTML = "";
    africa.forEach(feature=>{
      const countryPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      countryPath.setAttribute("class", "real-country");
      countryPath.setAttribute("d", path(feature));
      group.appendChild(countryPath);
    });
    positionCountryLabels(projection, countryFeatures);
    document.querySelector(".map-stage").classList.add("ready");
  } catch(error) {
    console.warn("Carte détaillée indisponible, affichage de la carte de secours.");
  }
}

function positionCountryLabels(projection, countryFeatures){
  ALL_AFRICA_COUNTRIES.forEach(country=>{
    const feature = countryFeatures.get(country.mapId);
    if(!feature) return;
    const markerLocation = d3.geoCentroid(feature);
    const point = projection(markerLocation);
    if(!point) return;
    const [x, y] = point;
    const label = document.getElementById("label-" + country.mapId);
    if(label){
      label.setAttribute("x", x);
      label.setAttribute("y", y);
    }
  });
}

function buildMapAndCountryChips(){
  const labelsG = document.getElementById('map-country-labels');
  labelsG.innerHTML = "";
  ALL_AFRICA_COUNTRIES.forEach(c=>{
    const isAvailable = AVAILABLE_COUNTRIES.has(c.mapId);
    const label = document.createElementNS("http://www.w3.org/2000/svg","text");
    label.setAttribute("class", "map-country-label" + (isAvailable ? " available" : " in-progress") + (c.name===currentCountry ? " active" : ""));
    label.setAttribute("x", 50); label.setAttribute("y", 50);
    label.setAttribute("id", "label-" + c.mapId);
    label.setAttribute("text-anchor", "middle");
    label.textContent = c.name;
    label.onclick = ()=>isAvailable ? setCountry(c.name) : showCountryStatus(c.name);
    labelsG.appendChild(label);
  });

  const scroll = document.getElementById('country-scroll');
  scroll.innerHTML = "";
  COUNTRIES.forEach(c=>{
    const chip = document.createElement('div');
    chip.className = "country-chip" + (c.name===currentCountry ? " active" : "");
    chip.id = "chip-"+c.name.replace(/[^a-zA-Z]/g,'');
    chip.setAttribute('role', 'button');
    chip.setAttribute('tabindex', '0');
    chip.setAttribute('aria-label', `Choisir le pays ${c.name}`);
    chip.innerHTML = `${flagImage(c.flag, "country-flag", `Drapeau de ${c.name}`)}<span>${c.name}</span>`;
    chip.onclick = ()=>setCountry(c.name);
    chip.onkeydown = event => { if(event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setCountry(c.name); } };
    scroll.appendChild(chip);
  });

  const select = document.getElementById('in-country');
  if(select){
    select.innerHTML = '<option value="">Choisir un pays</option>' + ALL_AFRICA_COUNTRIES.map(c=>`<option value="${c.name}">${c.name}</option>`).join('');
  }
  renderFlagMarquee();
}

function showCountryStatus(countryName){
  const status = document.getElementById("country-status");
  if(!status) return;
  status.textContent = `${countryName} : En cours`;
  status.classList.add("show");
  clearTimeout(showCountryStatus.timer);
  showCountryStatus.timer = setTimeout(()=>status.classList.remove("show"), 2800);
}

function updateMapSelection(){
  COUNTRIES.forEach(c=>{
    const label = document.getElementById("label-"+c.mapId);
    if(label) label.classList.toggle("active", c.name===currentCountry);
    const chip = document.getElementById("chip-"+c.name.replace(/[^a-zA-Z]/g,''));
    if(chip) chip.classList.toggle("active", c.name===currentCountry);
  });
}

function renderChips(){
  const cats = ["toutes", "historique", "culturel", "naturel", "savoirs"];
  const wrap = document.getElementById('chips');
  wrap.innerHTML = "";
  cats.forEach(c=>{
    const el = document.createElement('div');
    el.className = "chip" + (c===currentCat ? " active" : "");
    if(c === "toutes"){
      el.innerHTML = `<span class="cat-icon">✦</span><span>Toutes</span>`;
    } else {
      const meta = CAT_META[c];
      el.innerHTML = `<span class="cat-icon">${meta.icon}</span><span>${CAT_LABELS[c]}</span>`;
    }
    el.onclick = ()=>{ currentCat = c; renderChips(); renderList(); };
    wrap.appendChild(el);
  });
}

function siteCard(s){
  const card = document.createElement('div');
  card.className = "card";
  const isFav = favorites.has(s.id);
  card.innerHTML = `
    <div class="card-visual ${catClass(s.cat)}">${CAT_LABELS[s.cat]}</div>
    <div class="card-body"><p class="name">${s.name}</p><p class="place">${s.region}</p><p class="tag">${s.country}</p></div>
    <button class="card-fav">${isFav ? "♥" : "♡"}</button>`;
  card.querySelector('.card-body').onclick = ()=>openDetail(s.id);
  card.querySelector('.card-visual').onclick = ()=>openDetail(s.id);
  card.querySelector('.card-fav').onclick = async (e)=>{
    e.stopPropagation();
    await setFavorite(s.id, !favorites.has(s.id));
    renderList(); renderFavorites();
  };
  return card;
}

function renderList(){
  const list = document.getElementById('site-list');
  list.innerHTML = "";
  const term = searchTerm.trim().toLowerCase();
  const globalSearch = term.length > 0;
  SITES.filter(s => {
    const searchable = [s.name, s.country, s.region, s.cat, CAT_LABELS[s.cat]].filter(Boolean).join(" ").toLowerCase();
    const matchesCountry = globalSearch || s.country === currentCountry;
    const matchesCategory = globalSearch || currentCat === "toutes" || s.cat === currentCat;
    return matchesCountry && matchesCategory && (!term || searchable.includes(term));
  }).forEach(s=> list.appendChild(siteCard(s)));
}

function renderFavorites(){
  const list = document.getElementById('fav-list');
  list.innerHTML = "";
  if(!authToken || !isLoggedIn){
    list.innerHTML = `<div class="empty"><div class="glyph">♡</div><h3>Connexion requise</h3><p>Connectez-vous pour enregistrer et retrouver vos favoris.</p></div>`;
    return;
  }
  const items = SITES.filter(s => favorites.has(s.id));
  if(items.length===0){
    list.innerHTML = `<div class="empty"><div class="glyph">♡</div><h3>Aucun favori pour l'instant</h3><p>Touchez le cœur sur un site pour le retrouver ici.</p></div>`;
    return;
  }
  items.forEach(s=> list.appendChild(siteCard(s)));
}

function renderProfile(){
  document.getElementById('profile-locked').style.display = isLoggedIn ? "none" : "flex";
  document.getElementById('profile-unlocked').style.display = isLoggedIn ? "flex" : "none";
  if(isLoggedIn){
    document.getElementById('pf-name').textContent = currentUser.name;
    document.getElementById('pf-email').textContent = currentUser.email;
    document.getElementById('pf-avatar').textContent = currentUser.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
    document.getElementById('stat-fav').textContent = favorites.size;
    document.getElementById('stat-contrib').textContent = myContributions.length;
    renderNotifications();
    renderMySites();
    renderMyContributions();
  }
}

function renderNotifications(){
  const banner = document.getElementById('notification-banner');
  if(!banner) return;
  const unread = notifications.filter(item => !item.read_at);
  banner.hidden = unread.length === 0;
  banner.textContent = unread[0]?.message || "";
  const count = document.getElementById('notification-count');
  const list = document.getElementById('notification-list');
  const readButton = document.getElementById('mark-notifications-read');
  if(count){ count.hidden = unread.length === 0; count.textContent = unread.length; }
  if(list){
    list.innerHTML = notifications.length
      ? notifications.map(item => `<div class="notification-item ${item.read_at ? '' : 'unread'}"><span>${item.message}</span><small>${new Date(item.created_at).toLocaleDateString('fr-FR')}</small></div>`).join('')
      : '<p class="notification-empty">Aucune notification.</p>';
  }
  if(readButton) readButton.hidden = unread.length === 0;
}

async function loadNotifications(){
  if(!authToken) return;
  try {
    const response = await fetch(`${API_BASE}/auth/notifications`, { headers: { Authorization: `Bearer ${authToken}` } });
    const result = await response.json();
    if(!response.ok || !result.success) throw new Error(result.message || "Notifications indisponibles.");
    notifications = result.data || [];
    renderNotifications();
  } catch(error) {
    console.warn("Impossible de charger les notifications.", error);
  }
}

async function markNotificationsRead(){
  if(!authToken) return;
  const response = await fetch(`${API_BASE}/auth/notifications/read`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${authToken}` }
  });
  if(!response.ok) return;
  notifications = notifications.map(item => ({ ...item, read_at: item.read_at || new Date().toISOString() }));
  renderNotifications();
}

function renderMyContributions(){
  const wrap = document.getElementById('my-contributions-list');
  if(!wrap) return;
  wrap.innerHTML = "";
  if(!isLoggedIn){ return; }

  if(myContributions.length === 0){
    wrap.innerHTML = `<p style="font-size:12.5px;color:var(--muted);">Aucune contribution envoyée. Vos propositions en attente ou publiées apparaîtront ici.</p>`;
    return;
  }

  myContributions.slice().reverse().forEach(item => {
    const row = document.createElement('div');
    row.className = 'admin-item';
    const statusLabel = item.status === 'pending' ? 'En attente' : (item.status === 'approved' ? 'Publiée' : 'Rejetée');
    const statusClass = item.status === 'pending' ? 'badge-pending' : (item.status === 'approved' ? 'badge-approved' : 'badge-rejected');
    row.innerHTML = `
      <div class="admin-head">
        <div><p class="an">${item.name || item.targetName || 'Contribution'}</p><p class="ac">${item.country || ''}${item.country && item.category ? ' · ' : ''}${(item.category || item.cat) ? (CAT_LABELS[item.category || item.cat] || item.category || item.cat) : ''}</p></div>
        <span class="admin-badge ${statusClass}">${statusLabel}</span>
      </div>
      <p class="admin-excerpt">${item.description || item.excerpt || '—'}</p>
    `;
    wrap.appendChild(row);
  });
}

function renderContribute(){
  document.getElementById('contribute-locked').style.display = isLoggedIn ? "none" : "flex";
  document.getElementById('contribute-form').style.display = isLoggedIn ? "flex" : "none";
}

async function restoreAuthSession(){
  if(!authToken) return;

  try {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const result = await response.json();
    if(!response.ok || !result.success) throw new Error(result.message || "Session invalide.");
    currentUser = result.user;
    isLoggedIn = true;
    updateAdminVisibility();
    await Promise.all([loadFavorites(), loadUserContributions(), loadNotifications()]);
  } catch(error) {
    localStorage.removeItem("kitoko_auth_token");
    authToken = null;
    updateAdminVisibility();
  }
}

async function loadFavorites(){
  if(!authToken) return;
  const response = await fetch(`${API_BASE}/favorites`, {
    headers: { Authorization: `Bearer ${authToken}` }
  });
  const result = await response.json();
  if(!response.ok || !result.success) throw new Error(result.message || "Favoris indisponibles.");
  favorites = new Set(result.data);
}

async function loadUserContributions(){
  if(!authToken || !isLoggedIn) {
    myContributions = [];
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/contributions/mine`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const result = await response.json();
    if(!response.ok || !result.success) throw new Error(result.message || "Contributions indisponibles.");
    myContributions = result.data || [];
    if(isLoggedIn) renderProfile();
  } catch (error) {
    console.warn("Impossible de charger les contributions utilisateur.", error);
    myContributions = [];
  }
}

function requireLogin(message = "Connectez-vous pour continuer."){
  if(!authToken || !isLoggedIn || !currentUser){
    alert(message);
    openAuth('login');
    return false;
  }
  return true;
}

async function setFavorite(siteId, shouldAdd){
  if(!requireLogin("Connectez-vous pour enregistrer vos favoris.")) return false;
  const response = await fetch(`${API_BASE}/favorites/${siteId}`, {
    method: shouldAdd ? "POST" : "DELETE",
    headers: { Authorization: `Bearer ${authToken}` }
  });
  const result = await response.json();
  if(!response.ok || !result.success){
    alert(result.message || "Impossible de modifier les favoris.");
    return false;
  }
  if(shouldAdd) favorites.add(siteId); else favorites.delete(siteId);
  return true;
}

function switchAdminTab(tab){
  adminTab = tab;
  document.getElementById('admin-tab-pending').classList.toggle('active', tab==='pending');
  document.getElementById('admin-tab-sites').classList.toggle('active', tab==='sites');
  document.getElementById('admin-pending-pane').style.display = tab==='pending' ? 'flex' : 'none';
  document.getElementById('admin-sites-pane').style.display = tab==='sites' ? 'flex' : 'none';
  if(tab==='sites') loadAdminSites();
}

async function renderAdmin(){
  if(!authToken || currentUser?.role !== "admin"){
    pendingSubmissions = [];
    adminSites = [];
    switchAdminTab('pending');
    document.getElementById('admin-list').innerHTML = `
      <div class="empty"><div class="glyph">🔒</div><h3>Accès administrateur requis</h3><p>Connectez-vous avec un compte de modération pour consulter cet espace.</p><button class="cta-btn" onclick="openAuth('login')">Se connecter</button></div>
    `;
    return;
  }

  if(authToken && currentUser?.role === "admin"){
    try {
      const params = new URLSearchParams();
      [['status','admin-status-filter'],['country','admin-country-filter'],['from','admin-from-filter'],['to','admin-to-filter']].forEach(([key,id])=>{
        const value = document.getElementById(id)?.value;
        if(value) params.set(key, value);
      });
      const response = await fetch(`${API_BASE}/admin/contributions?${params}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const result = await response.json();
      if(!response.ok || !result.success) throw new Error(result.message || "Modération indisponible.");
      pendingSubmissions = result.data;
    } catch(error) {
      alert(error.message);
    }
  }
  switchAdminTab(adminTab);
  const wrap = document.getElementById('admin-list');
  wrap.innerHTML = "";
  pendingSubmissions.slice().reverse().forEach(item=>{
    const el = document.createElement('div');
    el.className = "admin-item";
    const badgeClass = item.status==="pending" ? "badge-pending" : (item.status==="approved" ? "badge-approved" : "badge-rejected");
    const badgeText = item.status==="pending" ? "En attente" : (item.status==="approved" ? "Publié" : "Rejeté");
    const typeText = item.type==="edit" ? "Modification proposée sur « "+item.targetName+" »" : "Nouveau site";
    el.innerHTML = `
      <div class="admin-head">
        <div><p class="an">${item.type==="edit" ? item.targetName : item.name}</p><p class="ac">${typeText} · ${item.country || ""} ${item.cat ? "· "+(CAT_LABELS[item.cat]||item.cat) : ""} · par ${item.contributor}</p></div>
        <span class="admin-badge ${badgeClass}">${badgeText}</span>
      </div>
      <p class="admin-excerpt">${item.excerpt || item.description || "Description indisponible"}</p>
      ${item.type==="new" ? `<p class="admin-media">${item.media_url ? (item.media_type === "video" ? `<video controls preload="metadata" src="${item.media_url}" aria-label="Média de ${item.name}"></video>` : `<img src="${item.media_url}" alt="Média de ${item.name}" loading="lazy">`) : "Aucun média joint"}</p>` : ""}
      <div class="admin-actions" id="admin-actions-${item.id}"></div>
    `;
    if(item.status==="pending"){
      const actions = el.querySelector('.admin-actions');
      const approveBtn = document.createElement('button');
      approveBtn.className = "admin-btn approve";
      approveBtn.textContent = item.type==="edit" ? "Marquer comme intégrée" : "Approuver et publier";
      approveBtn.onclick = ()=>{ moderateContribution(item, "approved"); };
      const rejectBtn = document.createElement('button');
      rejectBtn.className = "admin-btn reject"; rejectBtn.textContent = "Rejeter";
      rejectBtn.onclick = ()=>{ moderateContribution(item, "rejected"); };
      actions.appendChild(approveBtn); actions.appendChild(rejectBtn);
    }
    wrap.appendChild(el);
  });
}

function buildAdminCountryFilter(){
  const select = document.getElementById('admin-country-filter');
  if(!select) return;
  select.innerHTML = '<option value="">Tous les pays</option>' + COUNTRIES.map(country => `<option value="${country.name}">${country.name}</option>`).join('');
}

async function loadFilteredAdminContributions(){
  if(!authToken || currentUser?.role !== 'admin') return;
  const params = new URLSearchParams();
  [['status','admin-status-filter'],['country','admin-country-filter'],['from','admin-from-filter'],['to','admin-to-filter']].forEach(([key,id])=>{
    const value = document.getElementById(id)?.value;
    if(value) params.set(key, value);
  });
  const response = await fetch(`${API_BASE}/admin/contributions?${params}`, { headers: { Authorization: `Bearer ${authToken}` } });
  const result = await response.json();
  if(!response.ok || !result.success) return;
  pendingSubmissions = result.data || [];
  renderAdmin();
}

async function loadAdminSites(){
  if(!authToken || currentUser?.role !== "admin") return;
  try {
    const response = await fetch(`${API_BASE}/admin/sites`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const result = await response.json();
    if(!response.ok || !result.success) throw new Error(result.message || "Sites indisponibles.");
    adminSites = result.data || [];
    renderAdminSites();
  } catch(error) {
    alert(error.message);
  }
}

async function moderateContribution(item, decision){
  if(authToken && currentUser?.role === "admin"){
    const response = await fetch(`${API_BASE}/admin/contributions/${item.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({ decision })
    });
    const result = await response.json();
    if(!response.ok || !result.success){
      alert(result.message || "Impossible de modérer cette contribution.");
      return;
    }
    await renderAdmin();
    return;
  }

  item.status = decision;
  if(item.type==="new"){
    SITES.push({
      id: nextSiteId++, country: item.country, cat: item.cat || "culturel", name: item.name,
      region: "À préciser", featured:false, ownerEmail: item.contributorEmail,
      description: item.excerpt, histoire:"À compléter.", culture:"À compléter.", savoirs:"À compléter.",
      communities:"À compléter.", langues:"À compléter.", personnalites:"—",
      sources:"Proposé par "+item.contributor+" — vérifié par l'équipe de modération."
    });
    contributionCount++;
    buildMapAndCountryChips();
    renderList();
  }
  renderAdmin();
}

function renderAdminSites(){
  const wrap = document.getElementById('admin-sites-list');
  wrap.innerHTML = "";
  adminSites.forEach(s=>{
    const el = document.createElement('div');
    el.className = "admin-item";
    el.innerHTML = `
      <div class="admin-head">
        <div><p class="an">${s.name}</p><p class="ac">${s.country} · ${CAT_LABELS[s.cat]||s.cat}${s.ownerEmail ? " · contribution de "+s.ownerEmail : " · contenu éditorial"}</p></div>
      </div>
      <div class="admin-actions"></div>
    `;
    const actions = el.querySelector('.admin-actions');
    const editBtn = document.createElement('button');
    editBtn.className = "admin-btn approve"; editBtn.textContent = "Modifier";
    editBtn.onclick = ()=>openSiteForm('edit', s.id);
    const delBtn = document.createElement('button');
    delBtn.className = "admin-btn reject"; delBtn.textContent = "Supprimer";
    delBtn.onclick = ()=>deleteSite(s.id);
    actions.appendChild(editBtn); actions.appendChild(delBtn);
    wrap.appendChild(el);
  });
}

async function deleteSite(id){
  if(!confirm("Supprimer définitivement ce site ?")) return;
  const response = await fetch(`${API_BASE}/admin/sites/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${authToken}` }
  });
  const result = await response.json();
  if(!response.ok || !result.success){
    alert(result.message || "Impossible de supprimer le site.");
    return;
  }
  await loadKitokoData();
  buildMapAndCountryChips();
  renderList();
  renderHome();
  renderMySites();
  await loadAdminSites();
}

function openSiteForm(mode, siteId){
  formMode = mode;
  editingSiteId = siteId || null;
  document.getElementById('sf-title').textContent = mode==='add' ? "Ajouter un site" : "Modifier le site";
  const countrySel = document.getElementById('sf-country');
  countrySel.innerHTML = COUNTRIES.map(c=>`<option value="${c.name}">${c.name}</option>`).join('');
  if(mode==='edit'){
    const s = SITES.find(x=>x.id===siteId);
    document.getElementById('sf-name').value = s.name;
    countrySel.value = s.country;
    document.getElementById('sf-region').value = s.region;
    document.getElementById('sf-cat').value = s.cat;
    document.getElementById('sf-description').value = s.description;
    document.getElementById('sf-histoire').value = s.histoire;
    document.getElementById('sf-culture').value = s.culture;
    document.getElementById('sf-savoirs').value = s.savoirs;
    document.getElementById('sf-communities').value = s.communities;
    document.getElementById('sf-langues').value = s.langues;
    document.getElementById('sf-personnalites').value = s.personnalites;
    document.getElementById('sf-sources').value = s.sources;
  } else {
    ['sf-name','sf-region','sf-description','sf-histoire','sf-culture','sf-savoirs','sf-communities','sf-langues','sf-personnalites','sf-sources'].forEach(id=>document.getElementById(id).value = "");
    document.getElementById('sf-cat').value = "historique";
  }
  showScreen('screen-site-form');
}

async function saveSiteForm(){
  const data = {
    name: document.getElementById('sf-name').value.trim(),
    country: document.getElementById('sf-country').value,
    region: document.getElementById('sf-region').value.trim(),
    cat: document.getElementById('sf-cat').value,
    description: document.getElementById('sf-description').value.trim(),
    histoire: document.getElementById('sf-histoire').value.trim(),
    culture: document.getElementById('sf-culture').value.trim(),
    savoirs: document.getElementById('sf-savoirs').value.trim(),
    communities: document.getElementById('sf-communities').value.trim(),
    langues: document.getElementById('sf-langues').value.trim(),
    personnalites: document.getElementById('sf-personnalites').value.trim(),
    sources: document.getElementById('sf-sources').value.trim()
  };
  if(!data.name || !data.country){ alert("Le nom et le pays sont obligatoires."); return; }
  if(!authToken || currentUser?.role !== "admin"){
    alert("Accès administrateur requis.");
    return;
  }

  const response = await fetch(`${API_BASE}/admin/sites${formMode==='edit' ? `/${editingSiteId}` : ""}`, {
    method: formMode==='edit' ? "PATCH" : "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`
    },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  if(!response.ok || !result.success){
    alert(result.message || "Impossible d'enregistrer le site.");
    return;
  }

  await loadKitokoData();
  buildMapAndCountryChips();
  renderList();
  renderHome();
  await loadAdminSites();
  buildMapAndCountryChips();
  goBack();
}

function renderMySites(){
  const wrap = document.getElementById('my-sites-list');
  if(!wrap) return;
  wrap.innerHTML = "";
  if(!isLoggedIn){ return; }
  const mine = SITES.filter(s=>s.ownerEmail===currentUser.email);
  if(mine.length===0){
    wrap.innerHTML = `<p style="font-size:12.5px;color:var(--muted);">Aucun site publié à votre nom pour l'instant — vos contributions approuvées apparaîtront ici.</p>`;
    return;
  }
  mine.forEach(s=>{
    const row = document.createElement('div');
    row.className = "admin-item";
    row.innerHTML = `<div class="admin-head"><div><p class="an">${s.name}</p><p class="ac">${s.country} · ${CAT_LABELS[s.cat]||s.cat}</p></div></div><div class="admin-actions"></div>`;
    const actions = row.querySelector('.admin-actions');
    const editBtn = document.createElement('button');
    editBtn.className = "admin-btn approve"; editBtn.textContent = "Modifier";
    editBtn.onclick = ()=>openSiteForm('edit', s.id);
    const delBtn = document.createElement('button');
    delBtn.className = "admin-btn reject"; delBtn.textContent = "Supprimer";
    delBtn.onclick = ()=>deleteSite(s.id);
    actions.appendChild(editBtn); actions.appendChild(delBtn);
    wrap.appendChild(row);
  });
}

function openSuggestEdit(){
  const s = SITES.find(x=>x.id===currentSiteId);
  suggestTargetId = currentSiteId;
  document.getElementById('se-target').textContent = "Concernant : " + s.name;
  document.getElementById('se-text').value = "";
  document.getElementById('se-error').classList.remove('show');
  showScreen('screen-suggest-edit');
}

function submitSuggestEdit(){
  const text = document.getElementById('se-text').value.trim();
  if(!text){ document.getElementById('se-error').classList.add('show'); return; }
  const s = SITES.find(x=>x.id===suggestTargetId);
  pendingSubmissions.push({
    id: pendingSubmissions.length+1, type:"edit", targetSiteId: suggestTargetId, targetName: s.name,
    country: s.country, cat: s.cat, contributor: currentUser ? currentUser.name : "Anonyme",
    contributorEmail: currentUser ? currentUser.email : null, excerpt: text, media:false, status:"pending"
  });
  goBack();
}

function setCountry(country){
  currentCountry = country;
  currentCat = "toutes";
  updateMapSelection();
  renderChips();
  renderList();
}

function openDetail(id){
  const s = SITES.find(x=>x.id===id);
  currentSiteId = id;
  document.getElementById('detail-name').textContent = s.name;
  document.getElementById('detail-loc').textContent = s.region + " · " + s.country;
  document.getElementById('detail-hero').className = "detail-hero " + catClass(s.cat);
  document.getElementById('detail-description').textContent = s.description;
  document.getElementById('detail-communities').textContent = s.communities;
  document.getElementById('detail-histoire').textContent = s.histoire;
  document.getElementById('detail-culture').textContent = s.culture;
  document.getElementById('detail-savoirs').textContent = s.savoirs;
  document.getElementById('detail-langues').textContent = s.langues;
  document.getElementById('detail-personnalites').textContent = s.personnalites;
  document.getElementById('detail-sources').textContent = s.sources;
  const media = document.getElementById('detail-media');
  media.innerHTML = "";
  if(s.media_url){
    media.innerHTML = s.media_type === "video"
      ? `<video controls preload="metadata" src="${s.media_url}" aria-label="Média du site ${s.name}"></video>`
      : `<img src="${s.media_url}" alt="Image du site ${s.name}" loading="lazy">`;
  }
  document.getElementById('fav-btn').classList.toggle('active', favorites.has(id));
  setTab('apercu', document.querySelector('.dtab[data-pane="apercu"]'));
  requestAnimationFrame(updateReadingProgress);
  showScreen('screen-detail');
}

async function toggleFav(){
  if(!requireLogin("Connectez-vous pour enregistrer ce site en favori.")){
    return;
  }
  await setFavorite(currentSiteId, !favorites.has(currentSiteId));
  document.getElementById('fav-btn').classList.toggle('active', favorites.has(currentSiteId));
  renderList();
  renderFavorites();
}

function setTab(pane, el){
  document.querySelectorAll('.dtab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.dpane').forEach(p=>p.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('pane-'+pane).classList.add('active');
}

function onMediaSelected(){
  const input = document.getElementById('in-media');
  const drop = document.getElementById('file-drop');
  const text = document.getElementById('file-drop-text');
  if(input.files && input.files.length>0){
    const file = input.files[0];
    const maxSize = 20 * 1024 * 1024;
    if(file.size > maxSize || (!file.type.startsWith('image/') && !file.type.startsWith('video/'))){
      input.value = "";
      mediaAttached = false;
      alert("Choisissez une image ou une vidéo de 20 Mo maximum.");
      return;
    }
    mediaAttached = true;
    drop.classList.add('filled');
    text.textContent = input.files[0].name;
    const oldPreview = document.getElementById('media-preview');
    if(oldPreview) oldPreview.remove();
    const preview = document.createElement(file.type.startsWith('video/') ? 'video' : 'img');
    preview.id = 'media-preview';
    preview.className = 'media-preview';
    preview.src = URL.createObjectURL(file);
    preview.alt = `Aperçu de ${file.name}`;
    if(preview.tagName === 'VIDEO') { preview.controls = true; preview.muted = true; }
    drop.after(preview);
    document.getElementById('f-media').classList.remove('invalid');
    document.getElementById('f-media').querySelector('.error-text').classList.remove('show');
  }
}

async function submitContribution(){
  const fields = ["f-name","f-country","f-cat","f-desc"];
  let valid = true;
  fields.forEach(id=>{
    const wrap = document.getElementById(id);
    const input = wrap.querySelector('input,select,textarea');
    const err = wrap.querySelector('.error-text');
    if(!input.value.trim()){ wrap.classList.add('invalid'); err.classList.add('show'); valid = false; }
    else { wrap.classList.remove('invalid'); err.classList.remove('show'); }
  });
  const mediaWrap = document.getElementById('f-media');
  if(!mediaAttached){ mediaWrap.classList.add('invalid'); mediaWrap.querySelector('.error-text').classList.add('show'); valid = false; }
  else { mediaWrap.classList.remove('invalid'); mediaWrap.querySelector('.error-text').classList.remove('show'); }
  if(!valid) return;

  if(!authToken){
    alert("Connectez-vous pour envoyer une contribution.");
    return;
  }

  const formData = new FormData();
  formData.append("name", document.getElementById('in-name').value.trim());
  formData.append("country", document.getElementById('in-country').value);
  formData.append("category", document.getElementById('in-cat').value);
  formData.append("description", document.getElementById('in-desc').value.trim());
  formData.append("media", document.getElementById('in-media').files[0]);

  const response = await fetch(`${API_BASE}/contributions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${authToken}` },
    body: formData
  });
  const result = await response.json();
  if(!response.ok || !result.success){
    alert(result.message || "Impossible d'envoyer la contribution.");
    return;
  }

  const newContribution = {
    id: result.data.id, type:"new", targetSiteId:null,
    name: document.getElementById('in-name').value.trim(),
    country: document.getElementById('in-country').value,
    cat: document.getElementById('in-cat').value,
    contributor: document.getElementById('in-contrib').value.trim() || currentUser.name,
    contributorEmail: currentUser.email,
    excerpt: document.getElementById('in-desc').value.trim(),
    description: document.getElementById('in-desc').value.trim(),
    category: document.getElementById('in-cat').value,
    status: "pending",
    media: true
  };

  pendingSubmissions.push(newContribution);
  myContributions.unshift(newContribution);

  document.getElementById('confirm-banner').classList.add('show');
  renderProfile();
  ['in-name','in-region','in-desc','in-contrib'].forEach(id=>document.getElementById(id).value = "");
  document.getElementById('in-country').value = "";
  document.getElementById('in-cat').value = "";
  document.getElementById('in-media').value = "";
  mediaAttached = false;
  document.getElementById('file-drop').classList.remove('filled');
  document.getElementById('file-drop-text').textContent = "Ajouter une photo ou une vidéo";
}

function openAuth(mode){ switchAuthTab(mode); showScreen('screen-auth'); }

function switchAuthTab(mode){
  authMode = mode;
  document.getElementById('tab-signup').classList.toggle('active', mode==='signup');
  document.getElementById('tab-login').classList.toggle('active', mode==='login');
  document.getElementById('auth-title').textContent = mode==='signup' ? "Créer un compte" : "Se connecter";
  document.getElementById('auth-submit').textContent = mode==='signup' ? "Créer mon compte" : "Me connecter";
  document.getElementById('af-name').style.display = mode==='signup' ? "block" : "none";
}

async function submitAuth(){
  const fields = authMode==='signup' ? ["af-name","af-email","af-pass"] : ["af-email","af-pass"];
  let valid = true;
  fields.forEach(id=>{
    const wrap = document.getElementById(id);
    const input = wrap.querySelector('input');
    const err = wrap.querySelector('.error-text');
    if(!input.value.trim()){ wrap.classList.add('invalid'); err.classList.add('show'); valid=false; }
    else { wrap.classList.remove('invalid'); err.classList.remove('show'); }
  });
  if(!valid) return;
  const payload = {
    email: document.getElementById('auth-email').value.trim(),
    password: document.getElementById('auth-pass').value
  };
  if(authMode === 'signup') payload.name = document.getElementById('auth-name').value.trim();

  try {
    const response = await fetch(`${API_BASE}/auth/${authMode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if(!response.ok || !result.success) throw new Error(result.message || "Authentification impossible.");
    authToken = result.token;
    currentUser = result.user;
    isLoggedIn = true;
    updateAdminVisibility();
    localStorage.setItem("kitoko_auth_token", authToken);
    await Promise.all([loadFavorites(), loadUserContributions(), loadNotifications()]);
    showScreen('screen-profile');
  } catch(error) {
    alert(error.message);
  }
}

async function logout(){
  if(authToken){
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` }
      });
    } catch (error) {
      console.warn("Déconnexion API impossible, suppression locale uniquement.", error);
    }
  }
  localStorage.removeItem("kitoko_auth_token");
  authToken = null;
  isLoggedIn = false;
  currentUser = null;
  updateAdminVisibility();
  favorites = new Set();
  myContributions = [];
  notifications = [];
  renderHome();
  renderFavorites();
  renderProfile();
  showScreen('screen-home');
}

function toggleNotif(){ document.getElementById('notif-switch').classList.toggle('on'); }
function toggleOffline(){ document.getElementById('offline-switch').classList.toggle('on'); }

async function bootstrap(){
  const search = document.getElementById('site-search');
  if(search) search.addEventListener('input', event => { searchTerm = event.target.value; renderList(); });
  buildAdminCountryFilter();
  ['admin-status-filter','admin-country-filter','admin-from-filter','admin-to-filter'].forEach(id => document.getElementById(id)?.addEventListener('change', loadFilteredAdminContributions));
  document.getElementById('detail-body')?.addEventListener('scroll', updateReadingProgress, { passive: true });
  await loadKitokoData();
  await restoreAuthSession();
  buildNav('nav-discover','discover');
  buildNav('nav-favorites','favorites');
  buildNav('nav-contribute','contribute');
  buildNav('nav-profile','profile');
  buildMapAndCountryChips();
  renderChips();
  renderList();
  renderHome();
  renderRealAfricaMap();
  updateAdminVisibility();
}

bootstrap();