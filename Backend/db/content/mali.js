// Contenus — Mali.
// Les coordonnées GPS sont approximatives et doivent être relevées sur place
// avant l'impression des QR codes.
// Contexte sécuritaire : la plupart des sites du centre et du nord sont
// déconseillés aux voyageurs ; les fiches le rappellent dans les infos pratiques.

const SECURITE = "Attention : le centre et le nord du Mali sont actuellement formellement déconseillés aux voyageurs par la plupart des pays. Consulter les consignes officielles avant tout projet ; en attendant, ce site se découvre grâce à la fiche, au quiz et au tampon « en ligne » du passeport.";

module.exports = [
  {
    id: 19,
    slug: "tombouctou",
    country: "Mali",
    cat: "historique",
    name: "Tombouctou, la cité des 333 saints",
    region: "Tombouctou",
    featured: true,
    latitude: 16.7707,
    longitude: -3.0104,
    radius: 2000,
    themes: ["spiritualites", "architecture", "langues"],
    description: "Aux portes du Sahara, près du fleuve Niger, Tombouctou fut pendant des siècles l'un des plus grands centres intellectuels et religieux du monde musulman. Ses mosquées en terre — Djingareyber, Sankoré et Sidi Yahia — et ses dizaines de milliers de manuscrits témoignent d'une civilisation du savoir.\n\nSurnommée « la cité des 333 saints », Tombouctou est inscrite au patrimoine mondial de l'UNESCO depuis 1988. Ses monuments, détruits en partie en 2012, ont été reconstruits par ses maçons.",
    histoire: "### Un campement devenu ville\nSelon la tradition, Tombouctou naît au XIIe siècle d'un campement touareg, confié à une femme nommée Bouctou, gardienne d'un puits : « Tin Bouctou », le puits de Bouctou. Au croisement des routes caravanières du Sahara et du fleuve Niger, le lieu devient une grande ville de commerce (or, sel, livres).\n\n### L'âge d'or\nAu XIVe siècle, l'empereur du Mali Kankou Moussa, de retour de son célèbre pèlerinage à La Mecque, fait construire la mosquée de Djingareyber, attribuée à l'architecte andalou Es-Saheli. Aux XVe et XVIe siècles, sous l'empire songhaï, Tombouctou devient un grand centre d'enseignement, avec ses savants, ses écoles et ses bibliothèques, autour de la mosquée de Sankoré.\n\n### Les manuscrits\nDes dizaines de milliers de manuscrits — droit, théologie, astronomie, médecine, poésie, histoire — ont été conservés par les familles de Tombouctou. L'Institut Ahmed Baba, du nom d'un grand savant du XVIe siècle, en préserve une partie.\n\n### 2012 : destruction et renaissance\nEn 2012, des groupes armés occupent la ville et détruisent plusieurs mausolées de saints. Des habitants sauvent des milliers de manuscrits en les cachant ou en les évacuant. Les mausolées sont reconstruits par les maçons de Tombouctou dès 2015. En 2016, la Cour pénale internationale condamne pour la première fois une personne pour la destruction de biens culturels, en l'occurrence ces mausolées.",
    culture: "Tombouctou est une ville de savoir et de piété. Les mausolées des saints, protecteurs de la ville, sont des lieux de dévotion ; les familles de lettrés transmettent depuis des générations le goût de l'étude.\n\nLa ville mêle plusieurs peuples : Songhaï, Touaregs, Arabes, Peuls, Bambara. Cette diversité se retrouve dans les langues, l'architecture et la cuisine.\n\nL'entretien annuel des mosquées, avec le recrépissage des murs en terre, est une fête qui mobilise toute la population.",
    savoirs: "### Les manuscrits\nLa copie, la reliure, la conservation et l'étude des manuscrits sont des savoirs anciens, transmis dans les familles de lettrés.\n\n### Les maçons de Tombouctou\nLa corporation des maçons entretient les mosquées et les mausolées selon des techniques traditionnelles de construction en terre. Ce sont eux qui ont reconstruit les mausolées détruits.\n\n### L'astronomie et les sciences\nParmi les manuscrits figurent des traités d'astronomie, de mathématiques et de médecine, qui témoignent de la vie scientifique de la ville.",
    communities: "Familles de lettrés et de gardiens de manuscrits, maçons de Tombouctou, Institut Ahmed Baba.",
    langues: "Songhaï, tamasheq, arabe, bambara, français",
    personnalites: "Kankou Moussa, empereur du Mali (XIVe siècle) ; Ahmed Baba (1556-1627), savant.",
    infos_pratiques: SECURITE,
    chronologie: [
      ["XIIe siècle", "Selon la tradition, fondation de Tombouctou autour du puits de Bouctou."],
      ["Vers 1325", "Construction de la mosquée de Djingareyber sous Kankou Moussa."],
      ["XVe - XVIe siècles", "Âge d'or intellectuel sous l'empire songhaï."],
      ["1988", "Inscription au patrimoine mondial de l'UNESCO."],
      ["2012", "Occupation de la ville ; destruction de mausolées ; sauvetage des manuscrits."],
      ["2015", "Reconstruction des mausolées."],
      ["2016", "Condamnation par la Cour pénale internationale pour la destruction des mausolées."]
    ],
    a_voir: [
      ["La mosquée de Djingareyber", "La plus ancienne des grandes mosquées de la ville."],
      ["La mosquée de Sankoré", "Centre historique de l'enseignement."],
      ["Les bibliothèques de manuscrits", "Institut Ahmed Baba et bibliothèques familiales."],
      ["Les mausolées des saints", "Reconstruits après 2012."]
    ],
    saviez_vous: [
      "Le nom de Tombouctou viendrait de « Tin Bouctou », le puits de Bouctou.",
      "En 2016, la destruction des mausolées de Tombouctou a donné lieu à la première condamnation internationale pour la destruction de biens culturels."
    ],
    sources: [
      "UNESCO — Tombouctou (1988)",
      "Institut des hautes études et de recherche islamique Ahmed Baba",
      "Cour pénale internationale — Affaire Al Mahdi (2016)"
    ],
    recits: [
      {
        title: "Le puits de Bouctou",
        nature: "tradition_orale",
        body: "On raconte que des nomades touaregs, qui menaient leurs troupeaux près du fleuve, laissaient leurs biens pendant la saison sèche à la garde d'une vieille femme appelée Bouctou, installée près d'un puits. Le lieu prit le nom de « Tin Bouctou », le puits de Bouctou, et devint peu à peu une ville où se croisèrent marchands, savants et pèlerins."
      }
    ],
    quiz: [
      { question: "Comment surnomme-t-on Tombouctou ?", choices: ["La cité des 333 saints", "La ville rouge", "La perle de l'Atlantique"], answer: 0, explanation: "Tombouctou est surnommée la cité des 333 saints, pour ses nombreux saints protecteurs." },
      { question: "Quel empereur fit construire la mosquée de Djingareyber ?", choices: ["Kankou Moussa", "Soundiata Keïta", "Askia Mohammed"], answer: 0, explanation: "Kankou Moussa la fit construire à son retour de La Mecque, vers 1325." },
      { question: "Que conservent les familles de Tombouctou depuis des siècles ?", choices: ["Des manuscrits", "Des armes", "Des bateaux"], answer: 0, explanation: "Des dizaines de milliers de manuscrits ont été conservés par les familles." },
      { question: "Qui a reconstruit les mausolées détruits en 2012 ?", choices: ["Les maçons de Tombouctou", "Une entreprise étrangère", "Personne"], answer: 0, explanation: "Les maçons traditionnels de la ville les ont reconstruits dès 2015." },
      { question: "D'où viendrait le nom de Tombouctou ?", choices: ["Du puits de Bouctou", "D'un roi appelé Tombou", "D'un mot arabe signifiant « désert »"], answer: 0, explanation: "« Tin Bouctou » signifierait le puits de Bouctou." }
    ]
  },
  {
    id: 20,
    slug: "falaise-bandiagara",
    country: "Mali",
    cat: "culturel",
    name: "Falaise de Bandiagara, pays dogon",
    region: "Mopti, Bandiagara (Sangha)",
    featured: false,
    latitude: 14.47,
    longitude: -3.3,
    radius: 10000,
    themes: ["architecture", "spiritualites", "musiques-danses"],
    description: "Au centre du Mali, une falaise de grès s'étire sur près de 150 kilomètres au-dessus de la plaine. À ses pieds et sur son plateau vivent les Dogon, dont les villages accrochés à la roche, les greniers au toit de paille et les masques sont célèbres dans le monde entier.\n\nInscrite au patrimoine mondial de l'UNESCO en 1989 pour sa valeur naturelle et culturelle, la falaise de Bandiagara est l'un des paysages les plus extraordinaires d'Afrique.",
    histoire: "### Les Tellem\nAvant les Dogon, un peuple appelé Tellem vivait dans la falaise. On voit encore, dans la paroi, leurs petites constructions et leurs greniers, accessibles seulement par des cordes. Les Tellem y déposaient aussi leurs morts.\n\n### L'arrivée des Dogon\nSelon leurs traditions, les Dogon sont venus du pays mandingue, vers le XIVe ou le XVe siècle, pour préserver leur indépendance et leur religion. Ils s'installent au pied de la falaise et sur le plateau, où le relief offre une protection.\n\n### Une reconnaissance et des épreuves\nLe site est inscrit au patrimoine mondial de l'UNESCO en 1989. Depuis les années 2010, la région est touchée par l'insécurité et par des violences entre communautés, qui ont provoqué des déplacements de population et menacent la transmission des traditions.",
    culture: "La société dogon est organisée autour du village, de la famille et du culte des ancêtres. Le togu na, abri bas couvert d'une épaisse couche de tiges de mil, est le lieu où les hommes se réunissent pour discuter et régler les conflits : son toit bas oblige à rester assis, ce qui calme les esprits.\n\nLes masques dogon — kanaga, sirige, et bien d'autres — dansent lors des funérailles (le dama) et de grandes cérémonies. La cérémonie du Sigui, célébrée tous les soixante ans environ, marque le renouvellement des générations.\n\nLes Dogon sont aussi connus pour leurs sculptures en bois, leurs portes de greniers sculptées et leurs savoirs sur les astres, qui ont fasciné les ethnologues.",
    savoirs: "### Architecture\nMaisons et greniers en banco et en pierre, toits de paille, togu na : une architecture adaptée à la falaise et au climat.\n\n### Agriculture\nLes Dogon cultivent le mil, le sorgho et l'oignon, parfois sur de petites parcelles gagnées sur la roche, avec un grand savoir-faire en matière d'eau et de sol.\n\n### Masques et sculpture\nLa fabrication des masques et leur danse sont transmises au sein de sociétés d'initiés.",
    communities: "Communautés dogon des villages de la falaise et du plateau (Sangha, Banani, Ireli…).",
    langues: "Langues dogon, bambara, français",
    personnalites: "—",
    infos_pratiques: SECURITE,
    chronologie: [
      ["Avant le XIVe siècle", "Les Tellem vivent dans la falaise."],
      ["XIVe - XVe siècles", "Selon la tradition, arrivée des Dogon."],
      ["1967 - 1973", "Dernière célébration du Sigui, cycle de cérémonies d'environ soixante ans."],
      ["1989", "Inscription au patrimoine mondial de l'UNESCO."],
      ["Depuis les années 2010", "Insécurité et violences dans la région."]
    ],
    a_voir: [
      ["Les villages au pied de la falaise", "Maisons et greniers en terre et en pierre."],
      ["Les habitations tellem", "Accrochées dans la paroi."],
      ["Le togu na", "L'abri des palabres, au toit de tiges de mil."],
      ["Les masques", "Lors des cérémonies."]
    ],
    saviez_vous: [
      "Le toit du togu na est si bas qu'on ne peut pas s'y tenir debout : cela oblige à discuter calmement.",
      "Le Sigui, grande cérémonie dogon, n'a lieu qu'environ tous les soixante ans."
    ],
    sources: [
      "UNESCO — Falaises de Bandiagara, pays dogon (1989)",
      "Mission culturelle de Bandiagara"
    ],
    recits: [],
    quiz: [
      { question: "Quel peuple vit sur la falaise de Bandiagara ?", choices: ["Les Dogon", "Les Touaregs", "Les Ashanti"], answer: 0, explanation: "La falaise est le pays des Dogon." },
      { question: "Qui vivait dans la falaise avant les Dogon ?", choices: ["Les Tellem", "Les Romains", "Les Vikings"], answer: 0, explanation: "Les Tellem ont laissé des constructions dans la paroi." },
      { question: "À quoi sert le togu na ?", choices: ["À la réunion et aux palabres des hommes", "À stocker l'eau", "À abriter les chevaux"], answer: 0, explanation: "C'est le lieu de discussion des hommes du village." },
      { question: "Environ tous les combien d'années la cérémonie du Sigui est-elle célébrée ?", choices: ["Tous les 60 ans", "Chaque année", "Tous les 5 ans"], answer: 0, explanation: "Le Sigui marque le renouvellement des générations, environ tous les 60 ans." },
      { question: "En quelle année la falaise a-t-elle été inscrite au patrimoine mondial ?", choices: ["1989", "2012", "1960"], answer: 0, explanation: "Elle a été inscrite en 1989." }
    ]
  },
  {
    id: 21,
    slug: "grande-mosquee-djenne",
    country: "Mali",
    cat: "historique",
    name: "Grande Mosquée de Djenné",
    region: "Mopti, Djenné",
    featured: true,
    latitude: 13.9053,
    longitude: -4.5553,
    radius: 800,
    themes: ["architecture", "spiritualites", "festivals"],
    description: "Dans le delta intérieur du Niger, la Grande Mosquée de Djenné est le plus grand édifice en terre crue du monde. Avec ses tours, ses contreforts et ses pieux de bois, elle est devenue l'emblème du Mali et de l'architecture soudano-sahélienne.\n\nChaque année, lors d'une grande fête, toute la ville participe au recrépissage de ses murs. Djenné et ses sites archéologiques sont inscrits au patrimoine mondial de l'UNESCO depuis 1988.",
    histoire: "### Djenné-Djeno, une ville très ancienne\nÀ quelques kilomètres de la ville actuelle, le site de Djenné-Djeno a été habité dès le IIIe siècle avant notre ère. C'est l'une des plus anciennes villes connues d'Afrique subsaharienne, ce qui a bouleversé l'idée selon laquelle les villes africaines seraient nées du commerce avec le monde arabe.\n\n### Une ville du commerce et du savoir\nLa Djenné actuelle se développe à partir du XIIIe siècle. Selon la tradition, son roi Koi Konboro se convertit à l'islam et transforme son palais en mosquée. La ville devient un grand centre de commerce entre le Sahel et la forêt, et un foyer d'enseignement, en lien avec Tombouctou.\n\n### La mosquée actuelle\nL'ancienne mosquée tombe en ruine au XIXe siècle. La mosquée actuelle est reconstruite en 1907, sur le modèle de l'ancienne, par la corporation des maçons de Djenné, dirigée par Ismaïla Traoré.\n\n### Une ville menacée\nDjenné est inscrite au patrimoine mondial en 1988, puis sur la liste du patrimoine en péril en 2016, en raison de l'insécurité, de la dégradation des maisons anciennes et du pillage des sites archéologiques.",
    culture: "Le crépissage annuel de la mosquée est l'un des grands moments de la vie de Djenné. Toute la population y participe : les femmes apportent l'eau, les jeunes préparent le banco, les maçons dirigent le travail, dans une ambiance de fête et de compétition entre quartiers.\n\nLa mosquée est un lieu de prière actif ; l'accès à l'intérieur est réservé aux musulmans depuis la fin des années 1990.\n\nLe lundi, le grand marché s'installe devant la mosquée et attire les habitants de toute la région.",
    savoirs: "### Les maçons de Djenné\nLa corporation des maçons (barey ton) transmet depuis des siècles les techniques de construction en terre : préparation du banco, fabrication des briques, pose et entretien.\n\n### Le banco\nMélange de terre, d'eau, de paille et parfois de beurre de karité ou de son de riz, le banco doit fermenter plusieurs jours avant d'être utilisé.",
    communities: "Maçons de Djenné, habitants de la ville, Mission culturelle de Djenné.",
    langues: "Bozo, peul, songhaï, bambara, français",
    personnalites: "Koi Konboro, roi de Djenné selon la tradition ; Ismaïla Traoré, maître maçon de la reconstruction de 1907.",
    infos_pratiques: SECURITE,
    chronologie: [
      ["IIIe siècle av. J.-C.", "Premières occupations de Djenné-Djeno."],
      ["XIIIe siècle", "Selon la tradition, conversion du roi Koi Konboro et première mosquée."],
      ["1907", "Reconstruction de la mosquée actuelle par les maçons de Djenné."],
      ["1988", "Inscription au patrimoine mondial de l'UNESCO."],
      ["2016", "Inscription sur la liste du patrimoine mondial en péril."]
    ],
    a_voir: [
      ["La façade de la mosquée", "Ses tours et ses pieux de bois."],
      ["La fête du crépissage", "Une fois par an, toute la ville au travail."],
      ["Le marché du lundi", "Devant la mosquée."],
      ["Djenné-Djeno", "Le site archéologique de l'ancienne ville."]
    ],
    saviez_vous: [
      "La Grande Mosquée de Djenné est le plus grand édifice en terre crue du monde.",
      "Djenné-Djeno, à côté de la ville actuelle, est l'une des plus anciennes villes connues d'Afrique subsaharienne."
    ],
    sources: [
      "UNESCO — Villes anciennes de Djenné (1988)",
      "Roderick et Susan McIntosh, travaux archéologiques à Djenné-Djeno"
    ],
    recits: [],
    quiz: [
      { question: "En quel matériau la Grande Mosquée de Djenné est-elle construite ?", choices: ["En terre crue (banco)", "En pierre de taille", "En bois"], answer: 0, explanation: "C'est le plus grand édifice en terre crue du monde." },
      { question: "Que se passe-t-il chaque année à la mosquée ?", choices: ["Toute la ville participe au recrépissage", "Elle est repeinte en bleu", "Elle est fermée pendant un an"], answer: 0, explanation: "Le crépissage annuel est une grande fête collective." },
      { question: "En quelle année la mosquée actuelle a-t-elle été reconstruite ?", choices: ["1907", "1325", "1988"], answer: 0, explanation: "Elle a été reconstruite en 1907 par les maçons de Djenné." },
      { question: "Qu'est-ce que Djenné-Djeno ?", choices: ["Le site d'une ville très ancienne", "Un quartier moderne", "Un fleuve"], answer: 0, explanation: "Djenné-Djeno a été habitée dès le IIIe siècle avant notre ère." },
      { question: "Quel jour se tient le grand marché de Djenné ?", choices: ["Le lundi", "Le vendredi", "Le dimanche"], answer: 0, explanation: "Le grand marché s'installe chaque lundi devant la mosquée." }
    ]
  },
  {
    id: 361,
    slug: "tombeau-askia-gao",
    country: "Mali",
    cat: "historique",
    name: "Tombeau des Askia, Gao",
    region: "Gao",
    featured: false,
    latitude: 16.2897,
    longitude: -0.0444,
    radius: 500,
    themes: ["royaumes", "architecture", "spiritualites"],
    description: "À Gao, au bord du fleuve Niger, une pyramide de terre hérissée de pieux de bois se dresse à 17 mètres de hauteur : c'est le tombeau de l'Askia Mohammed, souverain de l'empire songhaï, l'un des plus vastes empires de l'histoire africaine.\n\nConstruit à la fin du XVe siècle, le tombeau est inscrit au patrimoine mondial de l'UNESCO depuis 2004.",
    histoire: "### L'empire songhaï\nAu XVe siècle, l'empire songhaï, dont Gao est la capitale, s'étend le long du fleuve Niger et domine une grande partie du Sahel. Il succède à l'empire du Mali comme grande puissance de la région.\n\n### L'Askia Mohammed\nEn 1493, Mohammed Touré prend le pouvoir et fonde la dynastie des Askia. Il organise l'empire, développe l'administration et favorise l'islam et l'enseignement, notamment à Tombouctou. En 1495, il revient d'un pèlerinage à La Mecque et fait édifier son tombeau à Gao, avec des matériaux qu'il aurait, selon la tradition, rapportés d'Arabie.\n\n### La fin de l'empire\nEn 1591, l'armée marocaine, équipée d'armes à feu, bat l'armée songhaï à la bataille de Tondibi. L'empire s'effondre.\n\n### Le patrimoine mondial\nLe tombeau, avec la mosquée et le cimetière qui l'entourent, est inscrit au patrimoine mondial en 2004. Il a été placé sur la liste en péril en 2012, en raison de l'insécurité dans la région.",
    culture: "Le tombeau est un lieu de mémoire et de prière pour les habitants de Gao. La mosquée voisine est toujours utilisée, et la cour sert de lieu de rassemblement lors des grandes fêtes.\n\nL'entretien régulier du monument par la communauté, avec le recrépissage du banco, perpétue un savoir-faire ancien.\n\nPour les Songhaï, l'Askia Mohammed reste une grande figure de l'histoire, symbole de l'âge d'or de l'empire.",
    savoirs: "### L'architecture en terre\nLa pyramide, les pieux de bois qui servent d'échafaudage et les murs en banco sont caractéristiques de l'architecture soudano-sahélienne.\n\n### L'administration songhaï\nLes chroniques de Tombouctou décrivent l'organisation de l'empire : provinces, impôts, armée, justice.",
    communities: "Habitants de Gao, gardiens du tombeau, communauté musulmane.",
    langues: "Songhaï, tamasheq, français",
    personnalites: "Askia Mohammed (règne 1493-1528), empereur songhaï.",
    infos_pratiques: SECURITE,
    chronologie: [
      ["XVe siècle", "Essor de l'empire songhaï, capitale Gao."],
      ["1493", "Mohammed Touré prend le pouvoir : dynastie des Askia."],
      ["1495", "Retour du pèlerinage et construction du tombeau."],
      ["1591", "Bataille de Tondibi : chute de l'empire songhaï."],
      ["2004", "Inscription au patrimoine mondial de l'UNESCO."],
      ["2012", "Inscription sur la liste du patrimoine en péril."]
    ],
    a_voir: [
      ["La pyramide", "Haute de 17 mètres, hérissée de pieux de bois."],
      ["La mosquée", "Toujours utilisée par les fidèles."],
      ["Le fleuve Niger", "Qui a fait la puissance de Gao."]
    ],
    saviez_vous: [
      "Le tombeau des Askia est l'un des plus grands monuments en terre de l'architecture soudano-sahélienne.",
      "L'empire songhaï s'est effondré en 1591 face à une armée marocaine équipée d'armes à feu."
    ],
    sources: [
      "UNESCO — Tombeau des Askia (2004)",
      "Abderrahmane es-Saadi, Tarikh es-Soudan (XVIIe siècle)"
    ],
    recits: [],
    quiz: [
      { question: "De quel empire Gao était-elle la capitale ?", choices: ["L'empire songhaï", "L'empire ashanti", "L'empire du Ghana"], answer: 0, explanation: "Gao était la capitale de l'empire songhaï." },
      { question: "Quelle est la hauteur du tombeau des Askia ?", choices: ["17 mètres", "170 mètres", "7 mètres"], answer: 0, explanation: "La pyramide de terre mesure 17 mètres." },
      { question: "Quelle bataille marqua la chute de l'empire songhaï en 1591 ?", choices: ["Tondibi", "Kirina", "Adoua"], answer: 0, explanation: "L'armée marocaine l'emporta à Tondibi." },
      { question: "Quand l'Askia Mohammed prit-il le pouvoir ?", choices: ["En 1493", "En 1960", "En 1235"], answer: 0, explanation: "Il fonda la dynastie des Askia en 1493." },
      { question: "En quelle année le tombeau a-t-il été inscrit au patrimoine mondial ?", choices: ["2004", "1978", "2019"], answer: 0, explanation: "Il a été inscrit en 2004." }
    ]
  },
  {
    id: 362,
    slug: "kamablon-kangaba",
    country: "Mali",
    cat: "savoirs",
    name: "Le Kamablon de Kangaba",
    region: "Koulikoro, Kangaba",
    featured: false,
    latitude: 11.9333,
    longitude: -8.4167,
    radius: 1000,
    themes: ["royaumes", "langues", "spiritualites"],
    description: "À Kangaba, au sud-ouest de Bamako, se dresse le Kamablon, une case sacrée ronde au toit de chaume. Tous les sept ans, la réfection de son toit donne lieu à une grande cérémonie, pendant laquelle les griots de Kéla récitent l'histoire du Manding, depuis Soundiata Keïta.\n\nCette cérémonie est inscrite au patrimoine culturel immatériel de l'UNESCO depuis 2009. Elle fait écho au Sosso-Bala de Niagassola, en Guinée voisine.",
    histoire: "### Le berceau du Manding\nKangaba se trouve au cœur du Manding, le pays d'origine de l'empire du Mali, fondé par Soundiata Keïta au XIIIe siècle. La tradition fait de Kangaba l'un des lieux de résidence des descendants de Soundiata, la famille Keïta.\n\n### Le Kamablon, case de la parole\nLe Kamablon (« vestibule de Kaaba », du nom ancien de Kangaba) serait, selon la tradition, lié à l'histoire des Keïta. Case ronde en banco, couverte d'un toit de chaume, elle abrite des objets sacrés.\n\n### La cérémonie septennale\nTous les sept ans, le toit du Kamablon est refait lors d'une cérémonie qui dure plusieurs jours. Les griots Diabaté du village voisin de Kéla y récitent l'histoire et les généalogies du Manding, rappelant la fondation de l'empire et les liens entre les familles. En 2009, l'UNESCO inscrit cette cérémonie sur la liste représentative du patrimoine culturel immatériel.",
    culture: "La cérémonie du Kamablon est un moment de rassemblement pour tous les Mandingues. Elle rappelle les liens entre les familles, les alliances et les règles de la société.\n\nLes griots de Kéla sont réputés pour la précision de leur récit de l'épopée de Soundiata : de nombreux chercheurs ont enregistré leurs versions.\n\nLe rituel montre la force de la tradition orale, qui transmet l'histoire depuis plus de sept siècles.",
    savoirs: "### La couverture en chaume\nLa réfection du toit, avec des tiges tressées selon des techniques précises, est confiée à des hommes du village, sous la direction des anciens.\n\n### La récitation des griots\nLes griots Diabaté de Kéla apprennent pendant des années l'épopée et les généalogies, qu'ils récitent lors de la cérémonie.",
    communities: "Familles Keïta de Kangaba, griots Diabaté de Kéla, habitants de Kangaba.",
    langues: "Malinké (maninkakan), bambara, français",
    personnalites: "Soundiata Keïta, fondateur de l'empire du Mali ; les griots Diabaté de Kéla.",
    infos_pratiques: "Kangaba est à environ 2 heures de route au sud-ouest de Bamako. La cérémonie n'a lieu que tous les sept ans : se renseigner sur la prochaine date. En dehors de la cérémonie, la case se voit de l'extérieur, avec l'accord des autorités coutumières. Se renseigner sur les consignes de sécurité en vigueur avant tout déplacement au Mali.",
    chronologie: [
      ["XIIIe siècle", "Fondation de l'empire du Mali par Soundiata Keïta."],
      ["Tous les sept ans", "Réfection du toit du Kamablon et récitation de l'histoire du Manding."],
      ["2009", "Inscription au patrimoine culturel immatériel de l'UNESCO."]
    ],
    a_voir: [
      ["Le Kamablon", "La case sacrée au toit de chaume."],
      ["Kéla", "Le village des griots Diabaté."],
      ["Le fleuve Niger", "Qui borde la région de Kangaba."]
    ],
    saviez_vous: [
      "Le toit du Kamablon n'est refait que tous les sept ans.",
      "Les griots de Kéla sont considérés comme des gardiens particulièrement fidèles de l'épopée de Soundiata."
    ],
    sources: [
      "UNESCO — La réfection septennale de la toiture du Kamablon (2009)",
      "Jan Jansen, Épopée, histoire, société : le cas de Soundjata, Mali et Guinée, Karthala, 2001"
    ],
    recits: [],
    quiz: [
      { question: "Tous les combien d'années le toit du Kamablon est-il refait ?", choices: ["Tous les 7 ans", "Chaque année", "Tous les 100 ans"], answer: 0, explanation: "La réfection a lieu tous les sept ans." },
      { question: "Que récitent les griots de Kéla lors de la cérémonie ?", choices: ["L'histoire et les généalogies du Manding", "Des recettes de cuisine", "Des lois modernes"], answer: 0, explanation: "Ils récitent l'épopée de Soundiata et les généalogies." },
      { question: "Quelle famille de griots officie lors de la cérémonie ?", choices: ["Les Diabaté de Kéla", "Les Kouyaté de Niagassola", "Les Traoré de Djenné"], answer: 0, explanation: "Les griots Diabaté du village de Kéla récitent l'histoire." },
      { question: "Qui a fondé l'empire du Mali ?", choices: ["Soundiata Keïta", "Kankou Moussa", "Askia Mohammed"], answer: 0, explanation: "Soundiata Keïta a fondé l'empire au XIIIe siècle." },
      { question: "En quelle année l'UNESCO a-t-il inscrit cette cérémonie ?", choices: ["2009", "1960", "2020"], answer: 0, explanation: "Elle a été inscrite en 2009." }
    ]
  },
  {
    id: 363,
    slug: "musee-national-mali",
    country: "Mali",
    cat: "savoirs",
    name: "Musée national du Mali",
    region: "Bamako",
    featured: false,
    latitude: 12.6516,
    longitude: -7.9985,
    radius: 300,
    themes: ["artisanat", "royaumes", "musiques-danses"],
    description: "À Bamako, au pied de la colline de Koulouba, le Musée national du Mali est l'un des plus beaux musées d'Afrique de l'Ouest. Ses collections — textiles, masques, statues, objets archéologiques — présentent la richesse des cultures du Mali, des anciennes civilisations du Niger à l'art contemporain.\n\nEntouré d'un grand parc, le musée est une porte d'entrée idéale pour découvrir le pays, notamment les sites aujourd'hui difficiles d'accès.",
    histoire: "### Un musée ancien\nLe musée est créé à l'époque coloniale, au milieu du XXe siècle, avant de devenir le Musée national du Mali après l'indépendance de 1960.\n\n### Une rénovation\nDans les années 1980 et 1990, le musée est rénové et agrandi, avec de nouveaux bâtiments inspirés de l'architecture soudano-sahélienne. Il développe aussi une politique active de lutte contre le trafic illicite des biens culturels, dont le Mali a beaucoup souffert.\n\n### Le parc\nLe parc national de Bamako, aménagé à côté du musée, offre des jardins, des sentiers et des espaces de détente, très appréciés des habitants.",
    culture: "Le musée présente des collections permanentes sur les textiles (bogolan, tissus teints à l'indigo), les masques et statues des différentes régions, et l'archéologie, notamment les terres cuites de la région de Djenné.\n\nIl accueille aussi des expositions temporaires, des concerts et des événements culturels, en lien avec la grande scène musicale malienne.\n\nPour beaucoup de visiteurs, c'est l'occasion de découvrir des objets de sites comme Djenné, Tombouctou ou le pays dogon.",
    savoirs: "### Le bogolan\nLe bogolan est un tissu de coton décoré avec de la boue fermentée et des teintures végétales. Chaque motif a un sens.\n\n### L'archéologie\nLes terres cuites de Djenné-Djeno et du delta intérieur du Niger témoignent de civilisations anciennes et raffinées.\n\n### La lutte contre le pillage\nLe musée joue un rôle important dans la protection des biens culturels contre le trafic illicite.",
    communities: "Équipes du Musée national, artistes et artisans maliens.",
    langues: "Bambara, français",
    personnalites: "—",
    infos_pratiques: "Musée ouvert au public, droit d'entrée ; horaires à vérifier. Le parc national de Bamako est attenant. Se renseigner sur les consignes de sécurité en vigueur avant tout déplacement au Mali.",
    chronologie: [
      ["Milieu du XXe siècle", "Création du musée à Bamako."],
      ["1960", "Indépendance du Mali ; le musée devient national."],
      ["Années 1980 - 1990", "Rénovation et agrandissement."],
      ["Aujourd'hui", "Collections permanentes, expositions et événements culturels."]
    ],
    a_voir: [
      ["La salle des textiles", "Bogolans et tissus teints."],
      ["Les terres cuites", "Venues de la région de Djenné."],
      ["Les masques et statues", "Des différents peuples du Mali."],
      ["Le parc national de Bamako", "À côté du musée."]
    ],
    saviez_vous: [
      "Le bogolan est décoré avec de la boue fermentée, qui fixe la couleur sur le coton.",
      "Le Mali a été l'un des premiers pays à obtenir des mesures internationales contre l'importation de ses biens culturels pillés."
    ],
    sources: [
      "Musée national du Mali",
      "ICOM — Liste rouge des biens culturels en péril de l'Afrique de l'Ouest"
    ],
    recits: [],
    quiz: [
      { question: "Dans quelle ville se trouve le Musée national du Mali ?", choices: ["Bamako", "Tombouctou", "Gao"], answer: 0, explanation: "Le musée est à Bamako, au pied de la colline de Koulouba." },
      { question: "Avec quoi décore-t-on le bogolan ?", choices: ["De la boue fermentée et des teintures végétales", "De la peinture acrylique", "Des perles de verre"], answer: 0, explanation: "Le bogolan est décoré à la boue et aux teintures végétales." },
      { question: "D'où viennent de nombreuses terres cuites du musée ?", choices: ["De la région de Djenné", "D'Égypte", "Du Maroc"], answer: 0, explanation: "Les terres cuites du delta intérieur du Niger sont célèbres." },
      { question: "Contre quoi le musée lutte-t-il activement ?", choices: ["Le trafic illicite des biens culturels", "La pollution de l'air", "Les incendies de forêt"], answer: 0, explanation: "Le Mali a beaucoup souffert du pillage de ses sites archéologiques." },
      { question: "Qu'y a-t-il à côté du musée ?", choices: ["Le parc national de Bamako", "Un aéroport", "Une plage"], answer: 0, explanation: "Le parc national de Bamako est attenant au musée." }
    ]
  }
];
