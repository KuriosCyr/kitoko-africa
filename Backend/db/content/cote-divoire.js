// Contenus — Côte d'Ivoire.
// Les coordonnées GPS sont approximatives et doivent être relevées sur place
// avant l'impression des QR codes.

module.exports = [
  {
    id: 10,
    slug: "basilique-yamoussoukro",
    country: "Côte d'Ivoire",
    cat: "culturel",
    name: "Basilique Notre-Dame de la Paix de Yamoussoukro",
    region: "Yamoussoukro",
    featured: true,
    latitude: 6.8113,
    longitude: -5.2966,
    radius: 500,
    themes: ["architecture", "spiritualites"],
    description: "Au milieu de la savane, la coupole géante de la basilique Notre-Dame de la Paix domine Yamoussoukro, capitale politique de la Côte d'Ivoire. Inspirée de la basilique Saint-Pierre de Rome, elle compte parmi les plus grandes églises du monde.\n\nMonument spectaculaire et controversé, elle raconte l'ambition du premier président ivoirien, Félix Houphouët-Boigny, qui voulut faire de son village natal une capitale.",
    histoire: "### Le village du président\nYamoussoukro est le village natal de Félix Houphouët-Boigny, premier président de la Côte d'Ivoire de 1960 à sa mort en 1993. Il y fait construire de grandes infrastructures et, en 1983, la ville devient la capitale politique du pays, même si Abidjan reste le centre économique.\n\n### Une construction record\nLa basilique est construite en quelques années seulement, de 1985 à 1989. Sa coupole culmine à environ 150 mètres et l'édifice peut accueillir des milliers de fidèles. Elle est consacrée en 1990 par le pape Jean-Paul II.\n\n### Une œuvre discutée\nLe coût de la construction, dans un pays confronté à la crise économique, a suscité de vives critiques. Le président a présenté la basilique comme un don personnel à l'Église. Aujourd'hui, elle est un lieu de culte et un site touristique majeur du pays.",
    culture: "La basilique est un lieu de pèlerinage pour les catholiques d'Afrique de l'Ouest. Ses immenses vitraux, fabriqués en France, représentent des scènes bibliques ; l'un d'eux montre Félix Houphouët-Boigny aux côtés du Christ.\n\nYamoussoukro abrite aussi d'autres monuments liés au premier président : son palais, entouré d'un lac où vivent des crocodiles sacrés, la fondation Houphouët-Boigny pour la recherche de la paix, et de grandes écoles.\n\nLa ville reflète la politique du premier président : grands projets, recherche de la paix et culte de la figure présidentielle.",
    savoirs: "### Les vitraux\nLes vitraux de la basilique couvrent plusieurs milliers de mètres carrés : c'est l'un des plus grands ensembles de vitraux au monde.\n\n### L'architecture\nL'édifice reprend les formes de la basilique Saint-Pierre de Rome — coupole, colonnade — dans une version adaptée au climat tropical.",
    communities: "Diocèse de Yamoussoukro, habitants de Yamoussoukro, pèlerins.",
    langues: "Baoulé, français",
    personnalites: "Félix Houphouët-Boigny (1905-1993), premier président de la Côte d'Ivoire ; Pierre Fakhoury, architecte de la basilique.",
    infos_pratiques: "Visite guidée proposée à l'entrée (droit de visite). Tenue correcte exigée : épaules et genoux couverts. Yamoussoukro est à environ 3 heures de route d'Abidjan. À combiner avec le lac aux crocodiles, visible depuis l'extérieur du palais présidentiel.",
    chronologie: [
      ["1905", "Naissance de Félix Houphouët-Boigny, près de Yamoussoukro."],
      ["1960", "Indépendance de la Côte d'Ivoire."],
      ["1983", "Yamoussoukro devient la capitale politique."],
      ["1985 - 1989", "Construction de la basilique."],
      ["1990", "Consécration par le pape Jean-Paul II."],
      ["1993", "Mort de Félix Houphouët-Boigny."]
    ],
    a_voir: [
      ["La coupole", "Visible de très loin, elle culmine à environ 150 mètres."],
      ["Les vitraux", "Un ensemble immense, dont un vitrail représentant le premier président."],
      ["La colonnade", "Inspirée de la place Saint-Pierre de Rome."],
      ["Le lac aux crocodiles", "Près du palais présidentiel."]
    ],
    saviez_vous: [
      "La basilique a été construite en quatre ans seulement, de 1985 à 1989.",
      "Un vitrail de la basilique représente Félix Houphouët-Boigny."
    ],
    sources: [
      "Diocèse de Yamoussoukro",
      "Côte d'Ivoire Tourisme"
    ],
    recits: [],
    quiz: [
      { question: "De quel monument la basilique de Yamoussoukro s'inspire-t-elle ?", choices: ["La basilique Saint-Pierre de Rome", "Notre-Dame de Paris", "La Sagrada Família"], answer: 0, explanation: "Elle reprend la coupole et la colonnade de Saint-Pierre de Rome." },
      { question: "Quel président a voulu la construction de la basilique ?", choices: ["Félix Houphouët-Boigny", "Laurent Gbagbo", "Kwame Nkrumah"], answer: 0, explanation: "Le premier président ivoirien voulut ce monument dans son village natal." },
      { question: "Quel pape a consacré la basilique en 1990 ?", choices: ["Jean-Paul II", "Benoît XVI", "Paul VI"], answer: 0, explanation: "Jean-Paul II l'a consacrée en 1990." },
      { question: "Depuis quelle année Yamoussoukro est-elle la capitale politique ?", choices: ["1983", "1960", "2002"], answer: 0, explanation: "Yamoussoukro est devenue capitale en 1983 ; Abidjan reste le centre économique." },
      { question: "Quels animaux vivent dans le lac du palais présidentiel ?", choices: ["Des crocodiles", "Des hippopotames", "Des dauphins"], answer: 0, explanation: "Le lac abrite des crocodiles, considérés comme sacrés." }
    ]
  },
  {
    id: 11,
    slug: "parc-national-tai",
    country: "Côte d'Ivoire",
    cat: "naturel",
    name: "Parc national de Taï",
    region: "Cavally et San-Pédro, Taï",
    featured: false,
    latitude: 5.85,
    longitude: -7.35,
    radius: 5000,
    themes: ["faune-flore"],
    description: "Dans le sud-ouest de la Côte d'Ivoire, le parc national de Taï protège l'un des derniers grands massifs de forêt tropicale primaire d'Afrique de l'Ouest. Arbres géants, rivières et collines abritent une faune exceptionnelle : chimpanzés, hippopotames pygmées, éléphants de forêt, céphalophes et une dizaine d'espèces de singes.\n\nInscrit au patrimoine mondial de l'UNESCO en 1982, Taï est aussi célèbre pour ses chimpanzés qui cassent des noix avec des outils de pierre et de bois.",
    histoire: "### Une forêt ancienne\nLa forêt de Taï est un vestige de l'immense forêt guinéenne qui couvrait autrefois une grande partie de la côte ouest-africaine. Elle est protégée dès l'époque coloniale, puis érigée en parc national en 1972.\n\n### Une reconnaissance mondiale\nEn 1978, Taï est reconnu réserve de biosphère ; en 1982, il est inscrit au patrimoine mondial de l'UNESCO. Il couvre plus de 3 000 km² de forêt.\n\n### Des chimpanzés étudiés depuis des décennies\nDepuis la fin des années 1970, des chercheurs suivent les chimpanzés de Taï. Ils ont documenté leur usage d'outils — pierres et bâtons pour casser les noix — et leurs chasses coopératives, qui ont beaucoup appris sur les origines de la culture.\n\n### Les menaces\nL'orpaillage clandestin, le braconnage et l'extension des plantations de cacao aux abords du parc constituent les principales menaces pour la forêt.",
    culture: "Les peuples de la région — notamment Oubi, Guéré et Bakwé — ont des liens anciens avec la forêt, qui leur fournit nourriture, remèdes et lieux sacrés.\n\nLa région est aussi l'un des cœurs de la production de cacao en Côte d'Ivoire, premier producteur mondial. Concilier agriculture et protection de la forêt est un enjeu majeur.\n\nDes programmes d'écotourisme, comme celui du village de Djouroutou, permettent de découvrir la forêt tout en faisant bénéficier les communautés de la conservation.",
    savoirs: "### Les chimpanzés et leurs outils\nLes chimpanzés de Taï utilisent des marteaux de pierre ou de bois et des enclumes pour casser des noix très dures. Ces techniques se transmettent entre générations : on parle de « cultures » chez les chimpanzés.\n\n### La forêt\nLes communautés locales connaissent les plantes médicinales et les usages des arbres de la forêt.",
    communities: "Villages riverains (Oubi, Guéré, Bakwé), agents de l'Office ivoirien des parcs et réserves, chercheurs.",
    langues: "Guéré, bakwé, français",
    personnalites: "—",
    infos_pratiques: "Accès encadré : visites organisées avec l'Office ivoirien des parcs et réserves (OIPR) et les projets d'écotourisme locaux. Prévoir plusieurs jours, de bonnes chaussures, une protection contre la pluie et les insectes. Respecter les distances avec les animaux et les consignes sanitaires.",
    chronologie: [
      ["1972", "Création du parc national de Taï."],
      ["1978", "Reconnaissance comme réserve de biosphère."],
      ["Fin des années 1970", "Début du suivi scientifique des chimpanzés de Taï."],
      ["1982", "Inscription au patrimoine mondial de l'UNESCO."]
    ],
    a_voir: [
      ["La forêt primaire", "Des arbres géants de plusieurs dizaines de mètres."],
      ["Les singes", "Une dizaine d'espèces, souvent plus faciles à voir que les autres animaux."],
      ["Le mont Niénokoué", "Un inselberg d'où l'on domine la forêt."]
    ],
    saviez_vous: [
      "L'hippopotame pygmée, beaucoup plus petit que l'hippopotame commun, vit dans les forêts de Taï.",
      "Les chimpanzés de Taï cassent des noix avec des marteaux de pierre ou de bois."
    ],
    sources: [
      "UNESCO — Parc national de Taï (1982)",
      "Office ivoirien des parcs et réserves (OIPR)",
      "Christophe Boesch et Hedwige Boesch-Achermann, The Chimpanzees of the Taï Forest, 2000"
    ],
    recits: [],
    quiz: [
      { question: "Quel petit hippopotame vit dans la forêt de Taï ?", choices: ["L'hippopotame pygmée", "L'hippopotame nain des neiges", "Le lamantin"], answer: 0, explanation: "L'hippopotame pygmée est une espèce rare des forêts d'Afrique de l'Ouest." },
      { question: "Que savent faire les chimpanzés de Taï ?", choices: ["Casser des noix avec des outils", "Pêcher au filet", "Construire des huttes"], answer: 0, explanation: "Ils utilisent des marteaux et des enclumes pour casser les noix." },
      { question: "En quelle année Taï a-t-il été inscrit au patrimoine mondial ?", choices: ["1982", "2012", "1960"], answer: 0, explanation: "Le parc a été inscrit en 1982." },
      { question: "Quelle culture agricole menace les abords du parc ?", choices: ["Le cacao", "Le blé", "Le riz irrigué du désert"], answer: 0, explanation: "L'extension des plantations de cacao grignote la forêt." },
      { question: "Quel type de forêt protège le parc ?", choices: ["Une forêt tropicale primaire", "Une forêt de pins", "Une savane sèche"], answer: 0, explanation: "Taï est l'un des derniers grands massifs de forêt primaire d'Afrique de l'Ouest." }
    ]
  },
  {
    id: 12,
    slug: "grand-bassam",
    country: "Côte d'Ivoire",
    cat: "historique",
    name: "Ville historique de Grand-Bassam",
    region: "Sud-Comoé, Grand-Bassam",
    featured: true,
    latitude: 5.1956,
    longitude: -3.7389,
    radius: 1500,
    themes: ["architecture", "festivals", "resistances"],
    description: "À 40 kilomètres d'Abidjan, entre la lagune et l'océan, Grand-Bassam fut la première capitale de la colonie de Côte d'Ivoire. Son quartier historique, avec ses maisons coloniales à galeries, ses anciens bâtiments administratifs et le village n'zima, est inscrit au patrimoine mondial de l'UNESCO depuis 2012.\n\nVille de mémoire, de plage et de festivals, Grand-Bassam accueille chaque année la grande fête de l'Abissa du peuple n'zima.",
    histoire: "### Un comptoir sur la côte\nAu XIXe siècle, Grand-Bassam est un comptoir commercial actif, où s'échangent huile de palme, bois et marchandises européennes. Les Français y installent un poste dès 1843.\n\n### La première capitale\nEn 1893, la Côte d'Ivoire devient une colonie française, avec Grand-Bassam pour capitale. La ville se dote de bâtiments administratifs, de maisons de commerce et d'un wharf. Mais en 1899, une épidémie de fièvre jaune frappe durement la ville ; la capitale est transférée à Bingerville en 1900, puis à Abidjan en 1934.\n\n### La marche des femmes\nEn décembre 1949, des milliers de femmes marchent jusqu'à la prison de Grand-Bassam pour exiger la libération de militants du Rassemblement démocratique africain (RDA) emprisonnés par l'administration coloniale. Cette marche est devenue un symbole de la lutte pour l'indépendance et du rôle des femmes dans ce combat.\n\n### Le patrimoine mondial\nEn 2012, la ville historique de Grand-Bassam est inscrite au patrimoine mondial de l'UNESCO.",
    culture: "Grand-Bassam est la ville des N'zima, dont la grande fête, l'Abissa, se tient chaque année vers la fin octobre ou le début novembre. Pendant une à deux semaines, danses, tambours et défilés marquent un temps de réconciliation : chacun peut, dans les chants, dire publiquement ce qu'il reproche aux autres, y compris aux chefs, sans être sanctionné.\n\nLa ville est aussi un lieu de détente très apprécié des Abidjanais, pour ses plages et ses maquis (restaurants).\n\nLe Musée national du costume, installé dans l'ancien palais du gouverneur, présente les tenues et les parures des peuples ivoiriens.",
    savoirs: "### L'architecture coloniale\nMaisons à étage, galeries, vérandas, toits de tuiles : l'architecture de Grand-Bassam était adaptée au climat. Beaucoup de bâtiments sont en mauvais état, et leur restauration est un défi.\n\n### L'artisanat\nLes artisans de Grand-Bassam proposent sculptures, tissages, perles et objets en bronze.",
    communities: "Peuple n'zima, habitants de Grand-Bassam, Maison du patrimoine culturel de Grand-Bassam.",
    langues: "N'zima, français",
    personnalites: "Les femmes de la marche de 1949, dont Anne-Marie Raggi et Marie Koré.",
    infos_pratiques: "Grand-Bassam est à environ 45 minutes d'Abidjan. Le quartier historique se visite à pied. Baignade dangereuse (fortes vagues et courants) : se renseigner. Abissa : dates à vérifier chaque année, forte affluence.",
    chronologie: [
      ["1843", "Installation d'un poste français à Grand-Bassam."],
      ["1893", "Grand-Bassam devient la capitale de la colonie de Côte d'Ivoire."],
      ["1899", "Épidémie de fièvre jaune."],
      ["1900", "Transfert de la capitale à Bingerville."],
      ["Décembre 1949", "Marche des femmes sur la prison de Grand-Bassam."],
      ["2012", "Inscription au patrimoine mondial de l'UNESCO."]
    ],
    a_voir: [
      ["Le Musée national du costume", "Dans l'ancien palais du gouverneur."],
      ["Le quartier France", "Maisons coloniales et anciens bâtiments administratifs."],
      ["Le monument de la marche des femmes", "En hommage aux femmes de 1949."],
      ["Le village n'zima", "Au cœur de la vie traditionnelle de la ville."]
    ],
    saviez_vous: [
      "Pendant l'Abissa, les N'zima peuvent critiquer publiquement, en chansons, leurs voisins et même leurs chefs, dans un esprit de réconciliation.",
      "Grand-Bassam n'est restée capitale que sept ans, à cause d'une épidémie de fièvre jaune."
    ],
    sources: [
      "UNESCO — Ville historique de Grand-Bassam (2012)",
      "Maison du patrimoine culturel de Grand-Bassam"
    ],
    recits: [],
    quiz: [
      { question: "Grand-Bassam fut la première capitale de quelle colonie ?", choices: ["La Côte d'Ivoire", "Le Sénégal", "Le Ghana"], answer: 0, explanation: "Grand-Bassam fut capitale de 1893 à 1900." },
      { question: "Pourquoi la capitale fut-elle déplacée en 1900 ?", choices: ["À cause d'une épidémie de fièvre jaune", "À cause d'un tremblement de terre", "À cause d'une guerre"], answer: 0, explanation: "L'épidémie de 1899 conduisit au transfert à Bingerville." },
      { question: "Comment s'appelle la grande fête des N'zima ?", choices: ["L'Abissa", "Le Magal", "La Gaani"], answer: 0, explanation: "L'Abissa se tient chaque année à Grand-Bassam." },
      { question: "Que réclamaient les femmes qui marchèrent sur Grand-Bassam en 1949 ?", choices: ["La libération de militants emprisonnés", "La construction d'un marché", "La baisse des impôts sur le sel"], answer: 0, explanation: "Elles exigeaient la libération de militants du RDA." },
      { question: "Où se trouve le Musée national du costume ?", choices: ["Dans l'ancien palais du gouverneur", "Dans une pirogue", "Dans la basilique de Yamoussoukro"], answer: 0, explanation: "Il occupe l'ancien palais du gouverneur de Grand-Bassam." }
    ]
  },
  {
    id: 351,
    slug: "parc-national-comoe",
    country: "Côte d'Ivoire",
    cat: "naturel",
    name: "Parc national de la Comoé",
    region: "Zanzan et Savanes, Kong - Bouna",
    featured: false,
    latitude: 8.75,
    longitude: -3.8,
    radius: 8000,
    themes: ["faune-flore", "eaux"],
    description: "Dans le nord-est de la Côte d'Ivoire, le parc national de la Comoé est l'une des plus grandes aires protégées d'Afrique de l'Ouest. Traversé par le fleuve Comoé, il réunit savanes, forêts-galeries et îlots de forêt dense, qui abritent éléphants, hippopotames, chimpanzés, lions et une grande diversité d'antilopes et d'oiseaux.\n\nInscrit au patrimoine mondial de l'UNESCO en 1983, il a traversé une période difficile avant de retrouver, grâce aux efforts de conservation, une place de premier plan.",
    histoire: "### Un parc immense\nLe parc national de la Comoé est créé en 1968. Il couvre plus de 11 000 km², ce qui en fait l'un des plus vastes parcs d'Afrique de l'Ouest. Sa grande diversité de milieux s'explique par sa position entre la zone de forêt et la savane.\n\n### Patrimoine mondial et patrimoine en péril\nInscrit au patrimoine mondial en 1983, il est placé en 2003 sur la liste du patrimoine en péril : pendant la crise politique et militaire que traverse le pays, le braconnage et l'absence de gestion ont fortement réduit la faune.\n\n### Un retour réussi\nAprès la fin de la crise, les autorités ivoiriennes et leurs partenaires renforcent la surveillance et le suivi scientifique. La faune se reconstitue, et le parc est retiré de la liste en péril en 2017 : un exemple de restauration encourageant.",
    culture: "Les communautés riveraines — notamment lobi, koulango et malinké — vivent de l'agriculture, de l'élevage et de la pêche. Elles sont associées à la gestion du parc par des comités et des projets de développement.\n\nLa région est riche en traditions : architecture lobi en terre, marchés, cérémonies d'initiation. Non loin, la ville de Kong garde le souvenir d'un grand royaume commerçant et abrite des mosquées de style soudanais inscrites au patrimoine mondial.",
    savoirs: "### Le suivi de la faune\nComptages aériens, pièges photographiques et patrouilles permettent de suivre l'évolution des populations d'animaux.\n\n### La connaissance du milieu\nLes pisteurs et les habitants connaissent les traces, les points d'eau et les saisons de la faune.",
    communities: "Villages riverains (Lobi, Koulango, Malinké), agents de l'Office ivoirien des parcs et réserves.",
    langues: "Koulango, lobiri, dioula, français",
    personnalites: "—",
    infos_pratiques: "Visites organisées avec l'Office ivoirien des parcs et réserves (OIPR). Saison sèche (décembre à avril) plus favorable à l'observation. Se renseigner sur les accès, les hébergements et les consignes de sécurité avant le départ.",
    chronologie: [
      ["1968", "Création du parc national de la Comoé."],
      ["1983", "Inscription au patrimoine mondial de l'UNESCO."],
      ["2003", "Inscription sur la liste du patrimoine mondial en péril."],
      ["2017", "Retrait de la liste en péril après la restauration de la faune."]
    ],
    a_voir: [
      ["Le fleuve Comoé", "Et ses hippopotames."],
      ["Les savanes", "Pour observer antilopes, buffles et éléphants."],
      ["Les forêts-galeries", "Riches en oiseaux et en singes."]
    ],
    saviez_vous: [
      "La Comoé est l'un des plus grands parcs d'Afrique de l'Ouest, avec plus de 11 000 km².",
      "Le parc a été retiré de la liste du patrimoine en péril en 2017, après le retour de la faune."
    ],
    sources: [
      "UNESCO — Parc national de la Comoé (1983)",
      "Office ivoirien des parcs et réserves (OIPR)"
    ],
    recits: [],
    quiz: [
      { question: "Quel fleuve traverse le parc ?", choices: ["La Comoé", "Le Niger", "Le Congo"], answer: 0, explanation: "Le parc porte le nom du fleuve Comoé." },
      { question: "Pourquoi le parc a-t-il été placé sur la liste en péril en 2003 ?", choices: ["Le braconnage pendant la crise politique", "Une éruption volcanique", "La montée de la mer"], answer: 0, explanation: "La crise a entraîné braconnage et absence de gestion." },
      { question: "En quelle année a-t-il été retiré de la liste en péril ?", choices: ["2017", "1983", "2003"], answer: 0, explanation: "Grâce aux efforts de conservation, il a été retiré en 2017." },
      { question: "Quelle est la superficie approximative du parc ?", choices: ["Plus de 11 000 km²", "Environ 10 km²", "Environ 100 km²"], answer: 0, explanation: "C'est l'un des plus grands parcs d'Afrique de l'Ouest." },
      { question: "Quelle saison est la plus favorable à l'observation des animaux ?", choices: ["La saison sèche", "La saison des pluies", "Aucune"], answer: 0, explanation: "De décembre à avril, les animaux se concentrent autour des points d'eau." }
    ]
  },
  {
    id: 352,
    slug: "mosquees-soudanaises-kong",
    country: "Côte d'Ivoire",
    cat: "historique",
    name: "Mosquées de style soudanais de Kong",
    region: "Tchologo, Kong",
    featured: false,
    latitude: 9.1506,
    longitude: -4.6097,
    radius: 1500,
    themes: ["architecture", "spiritualites", "royaumes"],
    description: "Dans le nord de la Côte d'Ivoire, la ville de Kong a été un grand centre commercial et religieux. Ses mosquées en terre, hérissées de pieux de bois, font partie des huit mosquées de style soudanais du nord ivoirien inscrites au patrimoine mondial de l'UNESCO en 2021.\n\nElles témoignent des routes du commerce qui reliaient la forêt au Sahel, et de la diffusion de l'islam par les marchands et les lettrés dioula.",
    histoire: "### Le royaume de Kong\nAu début du XVIIIe siècle, Sékou Ouattara fonde à Kong un royaume dioula qui prospère grâce au commerce de l'or, de la kola, des tissus et du sel. La ville devient un carrefour entre la forêt, au sud, et le fleuve Niger, au nord, ainsi qu'un grand centre d'enseignement islamique.\n\n### La destruction de 1897\nEn 1897, l'armée de Samory Touré, en lutte contre la conquête coloniale, prend et détruit Kong, accusée de s'être alliée aux Français. La ville ne retrouvera jamais sa splendeur passée, mais elle reconstruit ses mosquées.\n\n### Une reconnaissance récente\nEn 2021, l'UNESCO inscrit au patrimoine mondial huit mosquées de style soudanais du nord de la Côte d'Ivoire, dont celles de Kong, de Kaouara, de Tengréla ou de Kouto. Elles comptent parmi les exemples les plus méridionaux de ce style architectural.",
    culture: "Les mosquées sont des lieux de prière actifs, au cœur de la vie des communautés. Leur entretien régulier, notamment le recrépissage des murs en terre, mobilise tout le village.\n\nLe style soudanais est né au Sahel, à Djenné et à Tombouctou, et s'est diffusé vers le sud avec les marchands dioula. Chaque région l'a adapté à ses matériaux et à son climat.",
    savoirs: "### Bâtir en terre\nMurs en banco, contreforts, pieux de bois qui servent d'échafaudage lors des réparations, toits plats : un savoir-faire de maçons transmis de génération en génération.\n\n### L'entretien collectif\nAprès la saison des pluies, les habitants recrépissent la mosquée, dans une ambiance de fête et de solidarité.",
    communities: "Communautés musulmanes de Kong et des villages du nord, maçons traditionnels.",
    langues: "Dioula, sénoufo, français",
    personnalites: "Sékou Ouattara, fondateur du royaume de Kong (XVIIIe siècle).",
    infos_pratiques: "Lieux de culte : visite de l'extérieur, et de l'intérieur uniquement avec autorisation des responsables. Tenue correcte exigée. Kong est à plusieurs heures de route de Korhogo ou de Ferkessédougou. À combiner avec le parc national de la Comoé.",
    chronologie: [
      ["Début du XVIIIe siècle", "Sékou Ouattara fonde le royaume de Kong."],
      ["XVIIIe - XIXe siècles", "Kong, carrefour commercial et centre d'enseignement islamique."],
      ["1897", "Prise et destruction de Kong par l'armée de Samory Touré."],
      ["2021", "Inscription des mosquées soudanaises du nord ivoirien au patrimoine mondial."]
    ],
    a_voir: [
      ["La grande mosquée de Kong", "Ses murs en terre et ses pieux de bois."],
      ["La vieille ville", "Témoin de l'ancien carrefour commercial."],
      ["Les autres mosquées inscrites", "Comme celle de Kaouara, dans la même région."]
    ],
    saviez_vous: [
      "Huit mosquées du nord ivoirien ont été inscrites ensemble au patrimoine mondial en 2021.",
      "Les pieux de bois qui dépassent des murs servent d'échafaudage lors de l'entretien."
    ],
    sources: [
      "UNESCO — Mosquées de style soudanais du nord ivoirien (2021)",
      "Office ivoirien du patrimoine culturel"
    ],
    recits: [],
    quiz: [
      { question: "Qui fonda le royaume de Kong au XVIIIe siècle ?", choices: ["Sékou Ouattara", "Samory Touré", "Osei Tutu"], answer: 0, explanation: "Sékou Ouattara fonda un royaume dioula prospère à Kong." },
      { question: "En quelle année les mosquées du nord ivoirien ont-elles été inscrites au patrimoine mondial ?", choices: ["2021", "1982", "2004"], answer: 0, explanation: "Huit mosquées ont été inscrites en 2021." },
      { question: "Qui détruisit Kong en 1897 ?", choices: ["L'armée de Samory Touré", "Les Portugais", "Un incendie de forêt"], answer: 0, explanation: "Samory accusait Kong de s'être alliée aux Français." },
      { question: "Quels marchands ont diffusé le style soudanais vers le sud ?", choices: ["Les Dioula", "Les Vikings", "Les Arabes d'Oman"], answer: 0, explanation: "Les marchands dioula circulaient entre le Sahel et la forêt." },
      { question: "En quel matériau sont construites ces mosquées ?", choices: ["En terre (banco)", "En marbre", "En béton armé"], answer: 0, explanation: "Elles sont en terre crue, avec des pieux de bois." }
    ]
  },
  {
    id: 353,
    slug: "danse-zaouli",
    country: "Côte d'Ivoire",
    cat: "culturel",
    name: "Le Zaouli, masque et danse des Gouro",
    region: "Marahoué, Bouaflé - Zuénoula",
    featured: false,
    latitude: 7.43,
    longitude: -6.05,
    radius: 5000,
    themes: ["musiques-danses", "festivals"],
    description: "Dans le centre-ouest de la Côte d'Ivoire, chez les Gouro, un masque aux couleurs vives danse à une vitesse stupéfiante : c'est le Zaouli. Ses pieds frappent le sol si vite qu'on a du mal à suivre leurs mouvements, au rythme des tambours et des flûtes.\n\nInscrit en 2017 au patrimoine culturel immatériel de l'UNESCO, le Zaouli est devenu l'une des danses les plus célèbres d'Afrique, grâce notamment aux vidéos partagées dans le monde entier.",
    histoire: "### Une danse née au XXe siècle\nSelon la tradition la plus répandue, le Zaouli est apparu au milieu du XXe siècle, dans la région de Bouaflé. Il serait inspiré par une jeune femme d'une grande beauté, nommée Djela Lou Zaouli, dont le masque reprendrait les traits.\n\n### Une célébration de la beauté\nLe masque représente à la fois la beauté féminine et un hommage à cette jeune femme. Il existe plusieurs versions du masque, avec différents ornements sur la tête : animaux, personnages, motifs.\n\n### Une reconnaissance mondiale\nEn 2017, l'UNESCO inscrit « le Zaouli, musique et danse populaires des communautés gouro » sur la liste représentative du patrimoine culturel immatériel de l'humanité.",
    culture: "Le Zaouli danse lors des funérailles, des fêtes, des cérémonies et des grands événements. Il apporte la joie, rassemble la communauté et exprime les valeurs de la société gouro.\n\nLe danseur, entièrement caché sous le costume, reste anonyme : on dit que c'est le masque qui danse. Il est accompagné d'un orchestre de tambours et de flûtes, et de chanteurs.\n\nLa popularité du Zaouli dépasse aujourd'hui largement le pays gouro : il apparaît dans les festivals, à la télévision et dans les cérémonies officielles.",
    savoirs: "### La danse\nLe danseur apprend pendant de longues années à maîtriser les pas rapides et complexes, en suivant les maîtres.\n\n### La sculpture du masque\nLes sculpteurs gouro taillent et peignent les masques selon des modèles transmis, tout en y apportant leur créativité.\n\n### La musique\nTambours, flûtes et chants suivent et guident le danseur, dans un dialogue permanent.",
    communities: "Communautés gouro de la région de Bouaflé et Zuénoula, danseurs, sculpteurs et musiciens.",
    langues: "Gouro, français",
    personnalites: "Djela Lou Zaouli, jeune femme dont la beauté aurait inspiré le masque, selon la tradition.",
    infos_pratiques: "Le Zaouli ne se produit pas sur rendez-vous : il danse lors d'événements (fêtes, funérailles, festivals). Se renseigner auprès des communautés ou des offices culturels de Bouaflé et Zuénoula. Demander l'autorisation avant de filmer ou photographier.",
    chronologie: [
      ["Milieu du XXe siècle", "Selon la tradition, apparition du Zaouli dans la région de Bouaflé."],
      ["2017", "Inscription au patrimoine culturel immatériel de l'UNESCO."],
      ["Aujourd'hui", "Danse populaire, présente dans les fêtes et les festivals."]
    ],
    a_voir: [
      ["Une sortie du Zaouli", "Lors d'une fête ou d'une cérémonie."],
      ["Les ateliers de sculpteurs", "Où sont taillés les masques."],
      ["Les musiciens", "Tambours et flûtes qui accompagnent le masque."]
    ],
    saviez_vous: [
      "Le danseur du Zaouli reste anonyme : on dit que c'est le masque qui danse.",
      "Le Zaouli a été inscrit au patrimoine culturel immatériel de l'UNESCO en 2017."
    ],
    sources: [
      "UNESCO — Le Zaouli, musique et danse populaires des communautés gouro de Côte d'Ivoire (2017)",
      "Ministère de la Culture de Côte d'Ivoire"
    ],
    recits: [
      {
        title: "Djela Lou Zaouli",
        nature: "tradition_orale",
        body: "On raconte chez les Gouro qu'une jeune femme, Djela Lou Zaouli, était d'une si grande beauté que son père, ou selon d'autres versions un sculpteur amoureux, créa un masque à son image pour que sa beauté ne soit jamais oubliée. Depuis, le Zaouli danse pour célébrer la beauté et la joie de vivre. Les versions de ce récit varient selon les villages."
      }
    ],
    quiz: [
      { question: "Quel peuple de Côte d'Ivoire danse le Zaouli ?", choices: ["Les Gouro", "Les N'zima", "Les Sénoufo"], answer: 0, explanation: "Le Zaouli est la danse masquée des Gouro, dans le centre-ouest du pays." },
      { question: "Qu'est-ce qui rend la danse du Zaouli si célèbre ?", choices: ["La rapidité incroyable des pas", "Les acrobaties sur des échasses", "Le fait qu'elle se danse dans l'eau"], answer: 0, explanation: "Les pieds du danseur frappent le sol à une vitesse stupéfiante." },
      { question: "En quelle année le Zaouli a-t-il été inscrit au patrimoine immatériel de l'UNESCO ?", choices: ["2017", "1990", "2023"], answer: 0, explanation: "Il a été inscrit en 2017." },
      { question: "Selon la tradition, qui aurait inspiré le masque ?", choices: ["Une jeune femme nommée Djela Lou Zaouli", "Un roi guerrier", "Un animal de la forêt"], answer: 0, explanation: "Le masque rendrait hommage à la beauté de Djela Lou Zaouli." },
      { question: "Quels instruments accompagnent le Zaouli ?", choices: ["Tambours et flûtes", "Piano et violon", "Guitare électrique"], answer: 0, explanation: "Un orchestre de tambours et de flûtes accompagne le masque." }
    ]
  }
];
