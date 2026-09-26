// Contenus du prototype — Guinée.
// Les coordonnées GPS sont approximatives et doivent être relevées sur place
// avant l'impression des QR codes.

module.exports = [
  {
    id: 4,
    slug: "mont-nimba",
    country: "Guinée",
    cat: "naturel",
    name: "Mont Nimba",
    region: "Guinée forestière, Lola",
    featured: true,
    latitude: 7.6000,
    longitude: -8.4200,
    radius: 20000,
    themes: ["faune-flore", "eaux"],
    description: "Point culminant de la Guinée et de la Côte d'Ivoire, le mont Nimba abrite une biodiversité exceptionnelle, dont des espèces qu'on ne trouve nulle part ailleurs au monde.",
    histoire: "La réserve naturelle intégrale du mont Nimba est inscrite au patrimoine mondial de l'UNESCO depuis 1981 pour la partie guinéenne, puis 1982 pour la partie ivoirienne. Elle figure sur la liste du patrimoine mondial en péril depuis 1992, notamment en raison des projets d'exploitation du minerai de fer. Le sommet atteint environ 1 750 mètres.",
    culture: "Pour les peuples de la région, la montagne est chargée de sens : forêts sacrées, lieux d'initiation et interdits protègent certains espaces. Près du Nimba, à Bossou, les chimpanzés sont respectés et protégés par les habitants.",
    savoirs: "Les chimpanzés de Bossou, étudiés depuis les années 1970, utilisent des pierres pour casser des noix : un exemple célèbre d'usage d'outils chez les animaux. Les communautés locales connaissent finement les plantes médicinales de la forêt.",
    communities: "Communautés manon et kpèlè des villages riverains, chercheurs de l'Institut de recherche environnementale de Bossou.",
    langues: "Manon, kpèlè, français",
    personnalites: "—",
    infos_pratiques: "Réserve intégrale : l'accès est strictement encadré. Se renseigner auprès des autorités de la réserve et passer par des guides agréés.",
    sources: [
      "UNESCO — Réserve naturelle intégrale du mont Nimba (1981)",
      "Institut de recherche environnementale de Bossou ; travaux de l'Université de Kyoto sur les chimpanzés de Bossou"
    ],
    recits: [],
    quiz: [
      { question: "Quel animal unique au monde vit sur le mont Nimba ?", choices: ["Un crapaud qui donne naissance à des petits vivants", "Un lion à crinière blanche", "Un perroquet géant"], answer: 0, explanation: "Le crapaud vivipare du Nimba (Nimbaphrynoides occidentalis) met au monde des petits déjà formés, sans têtards." },
      { question: "Que savent faire les chimpanzés de Bossou ?", choices: ["Casser des noix avec des pierres", "Pêcher au filet", "Construire des huttes"], answer: 0, explanation: "Ils utilisent une pierre comme marteau et une autre comme enclume : un usage d'outils étudié depuis des décennies." },
      { question: "Pourquoi le mont Nimba est-il sur la liste du patrimoine mondial en péril ?", choices: ["À cause du tourisme de masse", "Notamment à cause des projets miniers", "À cause d'un volcan"], answer: 1, explanation: "Les projets d'exploitation du minerai de fer menacent l'équilibre de la réserve." }
    ]
  },
  {
    id: 5,
    slug: "iles-de-los",
    country: "Guinée",
    cat: "naturel",
    name: "Îles de Los",
    region: "Conakry",
    featured: false,
    latitude: 9.5000,
    longitude: -13.8000,
    radius: 8000,
    themes: ["eaux", "memoire-traite"],
    description: "Au large de Conakry, l'archipel des îles de Los (Kassa, Room, Fotoba et d'autres îlots) offre plages, forêts et villages de pêcheurs, et garde la trace d'une histoire mouvementée.",
    histoire: "Le nom viendrait du portugais « Ilhas dos Ídolos », les îles des idoles, à cause d'objets de culte que les navigateurs y auraient observés. Les îles ont servi de comptoir pendant la traite atlantique. Possession britannique au XIXe siècle, elles ont été cédées à la France en 1904.",
    culture: "Les habitants vivent de la pêche, du fumage du poisson et du petit commerce avec Conakry. Les îles sont aussi un lieu de détente pour les habitants de la capitale.",
    savoirs: "Pêche artisanale, construction de pirogues, fumage du poisson.",
    communities: "Pêcheurs et habitants de Kassa, Room et Fotoba.",
    langues: "Soussou, français",
    personnalites: "—",
    infos_pratiques: "Accès en bateau depuis le port de Conakry (environ 30 minutes selon l'embarcation). Vérifier la météo et les conditions de sécurité avant de partir.",
    sources: ["Office national du tourisme de Guinée"],
    recits: [],
    quiz: [
      { question: "D'où viendrait le nom « îles de Los » ?", choices: ["Du portugais « îles des idoles »", "De l'arabe « îles du sable »", "De l'anglais « îles perdues »"], answer: 0, explanation: "Le nom viendrait du portugais « Ilhas dos Ídolos », les îles des idoles." },
      { question: "À quel pays les îles de Los appartenaient-elles avant 1904 ?", choices: ["Au Portugal", "Au Royaume-Uni", "À l'Espagne"], answer: 1, explanation: "Britanniques au XIXe siècle, elles ont été cédées à la France en 1904." }
    ]
  },
  {
    id: 6,
    slug: "fouta-djallon",
    country: "Guinée",
    cat: "savoirs",
    name: "Villages du Fouta-Djallon",
    region: "Moyenne-Guinée, Labé",
    featured: true,
    latitude: 11.3200,
    longitude: -12.2800,
    radius: 30000,
    themes: ["langues", "architecture", "eaux", "artisanat"],
    description: "Le massif du Fouta-Djallon, surnommé le « château d'eau de l'Afrique de l'Ouest », est le pays des Peuls (Fulɓe). Ses villages de cases rondes, ses plateaux et ses cascades forment un paysage unique.",
    histoire: "Le Sénégal (par le Bafing) et la Gambie prennent leur source dans le Fouta-Djallon, et le massif alimente de nombreux autres cours d'eau de la région. Au XVIIIe siècle s'y forme l'Imamat du Fouta-Djallon, un État musulman dont la capitale était Timbo. Labé est la principale ville de la région.",
    culture: "La culture peule du Fouta mêle élevage, agriculture, érudition islamique et poésie. Les manuscrits en pular écrit en caractères arabes (ajami) témoignent d'une vieille tradition savante.",
    savoirs: "Architecture des cases rondes en terre et toits de chaume, tissage, teinture, travail du cuir, élevage, poésie et enseignement coranique en pular.",
    communities: "Communautés peules et djallonké des villages du Fouta.",
    langues: "Pular, français",
    personnalites: "Thierno Aliou Bhoubha Ndiyan, lettré et poète du Fouta (XIXe siècle).",
    infos_pratiques: "Région de randonnée : passer par des guides locaux basés à Labé, Pita ou Dalaba. Climat plus frais que sur la côte, prévoir une veste.",
    sources: [
      "Thierno Diallo, Les institutions politiques du Fouta Djallon au XIXe siècle, IFAN, 1972",
      "Office national du tourisme de Guinée"
    ],
    recits: [],
    quiz: [
      { question: "Pourquoi appelle-t-on le Fouta-Djallon le « château d'eau de l'Afrique de l'Ouest » ?", choices: ["Pour ses nombreux puits", "Parce que de grands fleuves y prennent leur source", "Pour ses barrages"], answer: 1, explanation: "Le Sénégal et la Gambie y prennent leur source, et le massif alimente de nombreux cours d'eau." },
      { question: "Quelle langue parle-t-on principalement au Fouta-Djallon ?", choices: ["Le soussou", "Le pular", "Le malinké"], answer: 1, explanation: "Le pular est la langue des Peuls du Fouta-Djallon." },
      { question: "Qu'est-ce que l'écriture ajami ?", choices: ["Une langue sans écriture", "L'écriture de langues africaines en caractères arabes", "Un alphabet latin"], answer: 1, explanation: "L'ajami transcrit des langues africaines, comme le pular, avec l'alphabet arabe." }
    ]
  },
  {
    id: 201,
    slug: "timbo",
    country: "Guinée",
    cat: "historique",
    name: "Timbo, capitale de l'Imamat du Fouta-Djallon",
    region: "Moyenne-Guinée, Mamou",
    featured: false,
    latitude: 10.6300,
    longitude: -11.8300,
    radius: 2000,
    themes: ["royaumes", "spiritualites", "langues"],
    description: "Aujourd'hui simple bourgade, Timbo fut pendant près de deux siècles la capitale politique de l'Imamat du Fouta-Djallon, l'un des grands États de l'Afrique de l'Ouest précoloniale.",
    histoire: "Au début du XVIIIe siècle, un mouvement dirigé par Karamoko Alfa fonde l'Imamat du Fouta-Djallon. Timbo en devient la capitale politique, tandis que Fougoumba est le centre religieux où les almamys sont intronisés. Le pouvoir alterne entre deux grandes familles, les Alfaya et les Soriya, un système original de partage du pouvoir. L'Imamat perd son indépendance face à la conquête française à la fin du XIXe siècle.",
    culture: "Timbo garde des lieux de mémoire liés aux almamys et à l'enseignement islamique. Le Fouta a produit une importante littérature en pular et en arabe.",
    savoirs: "Organisation politique en provinces (diiwe), institutions de conseil, enseignement coranique, manuscrits ajami.",
    communities: "Descendants des familles d'almamys, érudits et habitants de Timbo.",
    langues: "Pular, arabe, français",
    personnalites: "Karamoko Alfa, fondateur de l'Imamat ; almamy Ibrahima Sory Mawdo ; almamy Bocar Biro.",
    infos_pratiques: "Visite avec un guide ou une personne-ressource locale, à organiser depuis Mamou.",
    sources: [
      "Thierno Diallo, Les institutions politiques du Fouta Djallon au XIXe siècle, IFAN, 1972",
      "Boubacar Barry, La Sénégambie du XVe au XIXe siècle, 1988"
    ],
    recits: [],
    quiz: [
      { question: "Quel titre portaient les chefs de l'Imamat du Fouta-Djallon ?", choices: ["Almamy", "Mansa", "Askia"], answer: 0, explanation: "Les chefs de l'Imamat portaient le titre d'almamy. « Mansa » désignait les souverains du Mali, « Askia » ceux de l'empire songhaï." },
      { question: "Entre quelles familles le pouvoir alternait-il à Timbo ?", choices: ["Alfaya et Soriya", "Keïta et Traoré", "Tall et Kane"], answer: 0, explanation: "Le pouvoir alternait entre les Alfaya et les Soriya, un système original de partage du pouvoir." }
    ]
  },
  {
    id: 202,
    slug: "voile-de-la-mariee-kindia",
    country: "Guinée",
    cat: "naturel",
    name: "Voile de la Mariée",
    region: "Basse-Guinée, Kindia",
    featured: true,
    latitude: 10.1000,
    longitude: -12.8000,
    radius: 3000,
    themes: ["eaux", "faune-flore"],
    description: "Près de Kindia, une chute d'eau tombe en voile blanc le long d'une paroi rocheuse : c'est le « Voile de la Mariée », l'un des sites naturels les plus connus de Guinée.",
    histoire: "Le site, situé au pied des reliefs qui annoncent le Fouta-Djallon, est depuis longtemps un lieu de promenade et de pique-nique pour les habitants de Kindia et de Conakry.",
    culture: "Le nom du site s'accompagne de légendes locales, transmises oralement, qui expliquent la forme de la chute.",
    savoirs: "Connaissance des plantes et des sources par les communautés voisines.",
    communities: "Villages voisins, guides de Kindia.",
    langues: "Soussou, pular, français",
    personnalites: "—",
    infos_pratiques: "Accessible depuis Kindia (environ 2 h 30 à 3 h de route de Conakry selon la circulation). Rochers glissants : prudence près de l'eau.",
    sources: ["Office national du tourisme de Guinée"],
    recits: [
      {
        title: "La mariée de la cascade",
        nature: "tradition_orale",
        body: "Il existe plusieurs versions de la légende. La plus répandue raconte qu'une jeune mariée disparut dans la cascade le jour de ses noces : depuis, l'eau qui tombe en fines gouttes blanches rappellerait son voile. Ces récits varient selon les narrateurs : chacun peut partager la version de sa famille."
      }
    ],
    quiz: [
      { question: "Près de quelle ville se trouve le Voile de la Mariée ?", choices: ["Kindia", "Kankan", "N'Zérékoré"], answer: 0, explanation: "Le Voile de la Mariée se trouve près de Kindia, en Basse-Guinée." },
      { question: "D'où vient le nom « Voile de la Mariée » ?", choices: ["D'un tissu accroché à la roche", "De l'eau qui tombe comme un voile blanc", "D'une cérémonie de mariage annuelle"], answer: 1, explanation: "L'eau tombe en fines gouttes blanches qui évoquent un voile ; des légendes locales y associent une mariée." }
    ]
  },
  {
    id: 203,
    slug: "chutes-de-kinkon",
    country: "Guinée",
    cat: "naturel",
    name: "Chutes de Kinkon",
    region: "Moyenne-Guinée, Pita",
    featured: false,
    latitude: 11.0300,
    longitude: -12.4300,
    radius: 3000,
    themes: ["eaux"],
    description: "Près de Pita, la rivière Kokoulo dévale en plusieurs cascades spectaculaires au cœur du Fouta-Djallon. Un barrage hydroélectrique a été construit en amont.",
    histoire: "Les chutes font partie des nombreux sites d'eau qui ont valu au Fouta-Djallon son surnom de « château d'eau ». Le barrage de Kinkon produit de l'électricité pour la région.",
    culture: "Le site est un lieu de promenade prisé des habitants de Pita et des voyageurs qui traversent le Fouta.",
    savoirs: "Usages de l'eau : irrigation, moulins, énergie.",
    communities: "Habitants de Pita et des villages voisins.",
    langues: "Pular, français",
    personnalites: "—",
    infos_pratiques: "Accès depuis Pita par piste. Débit maximal en saison des pluies (juin à octobre). Ne pas s'approcher du bord.",
    sources: ["Office national du tourisme de Guinée"],
    recits: [],
    quiz: [
      { question: "Quelle rivière forme les chutes de Kinkon ?", choices: ["Le Kokoulo", "Le Niger", "Le Konkouré"], answer: 0, explanation: "Les chutes de Kinkon sont formées par la rivière Kokoulo, près de Pita." }
    ]
  },
  {
    id: 204,
    slug: "chutes-de-ditinn",
    country: "Guinée",
    cat: "naturel",
    name: "Chutes de Ditinn",
    region: "Moyenne-Guinée, Dalaba",
    featured: false,
    latitude: 10.8700,
    longitude: -12.2000,
    radius: 3000,
    themes: ["eaux", "faune-flore"],
    description: "Avec une chute d'une centaine de mètres, la cascade de Ditinn, près de Dalaba, compte parmi les plus hautes d'Afrique de l'Ouest.",
    histoire: "Nichée dans les plateaux du Fouta-Djallon, la chute est entourée de forêts-galeries qui abritent une faune variée.",
    culture: "Le site attire randonneurs et familles, et fait partie des circuits de découverte du Fouta.",
    savoirs: "Connaissance des sentiers et de la flore par les guides locaux.",
    communities: "Villages voisins de Ditinn, guides de Dalaba.",
    langues: "Pular, français",
    personnalites: "—",
    infos_pratiques: "Accès par piste puis marche depuis Dalaba. Chaussures de marche conseillées ; baignade dangereuse au pied de la chute en saison des pluies.",
    sources: ["Office national du tourisme de Guinée"],
    recits: [],
    quiz: [
      { question: "Dans quelle région naturelle se trouvent les chutes de Ditinn ?", choices: ["Le Fouta-Djallon", "Le Sahel", "La Guinée forestière"], answer: 0, explanation: "Ditinn se trouve dans le Fouta-Djallon, près de Dalaba." }
    ]
  },
  {
    id: 205,
    slug: "musee-national-guinee",
    country: "Guinée",
    cat: "culturel",
    name: "Musée national de Guinée (Sandervalia)",
    region: "Conakry, Kaloum",
    featured: false,
    latitude: 9.5110,
    longitude: -13.7120,
    radius: 300,
    themes: ["artisanat", "spiritualites", "musiques-danses"],
    description: "Au cœur de Conakry, le Musée national présente des masques, statues, instruments de musique et objets du quotidien des différentes régions de Guinée.",
    histoire: "Créé après l'indépendance de 1958, le musée se trouve dans le quartier de Sandervalia, qui doit son nom à l'explorateur français Aimé Olivier de Sanderval. Il conserve des collections sur les cultures de Basse-Guinée, du Fouta-Djallon, de Haute-Guinée et de Guinée forestière.",
    culture: "Parmi les pièces emblématiques figurent les masques baga, dont le D'mba (souvent appelé Nimba), grande figure féminine symbole de fécondité et de prospérité, devenue un emblème de la culture guinéenne.",
    savoirs: "Sculpture sur bois, fabrication d'instruments (balafon, kora, djembé), tissage et teinture.",
    communities: "Musée national de Guinée, artistes et artisans.",
    langues: "Soussou, pular, malinké, français",
    personnalites: "—",
    infos_pratiques: "Horaires et tarifs à confirmer auprès du musée.",
    sources: ["Ministère de la Culture de Guinée — Musée national"],
    recits: [],
    quiz: [
      { question: "De quel peuple vient le masque D'mba (Nimba) ?", choices: ["Des Baga", "Des Peuls", "Des Kpèlè"], answer: 0, explanation: "Le D'mba est un masque des Baga de Basse-Guinée." },
      { question: "Que symbolise le masque D'mba ?", choices: ["La guerre", "La fécondité et la prospérité", "La mort"], answer: 1, explanation: "Grande figure féminine, le D'mba symbolise la fécondité, la maternité et la prospérité." }
    ]
  },
  {
    id: 206,
    slug: "grande-mosquee-mausolee-camayenne",
    country: "Guinée",
    cat: "memoire",
    name: "Grande Mosquée Fayçal et Mausolée de Camayenne",
    region: "Conakry, Camayenne",
    featured: true,
    latitude: 9.5330,
    longitude: -13.6840,
    radius: 400,
    themes: ["resistances", "spiritualites", "architecture"],
    description: "L'une des plus grandes mosquées d'Afrique de l'Ouest. Dans ses jardins, le mausolée de Camayenne abrite les tombes de figures majeures de l'histoire guinéenne, dont l'almamy Samory Touré.",
    histoire: "La Grande Mosquée de Conakry, dite mosquée Fayçal, a été inaugurée au début des années 1980, avec le soutien de l'Arabie saoudite. Le mausolée voisin réunit les tombes de l'almamy Samory Touré, résistant à la conquête coloniale mort en exil au Gabon en 1900, d'Alfa Yaya Diallo, roi du Labé, lui aussi mort en exil, et du premier président de la Guinée, Ahmed Sékou Touré. Les restes de Samory Touré et d'Alfa Yaya Diallo ont été rapatriés en Guinée après l'indépendance.",
    culture: "Le mausolée est un lieu de mémoire des résistances à la colonisation. L'héritage politique de Sékou Touré fait, lui, l'objet de mémoires contrastées : l'indépendance de 1958, mais aussi les victimes de la répression de son régime.",
    savoirs: "Mémoire des résistances, transmise par l'histoire officielle, les griots et les familles.",
    communities: "Fidèles de la mosquée, familles des personnalités inhumées.",
    langues: "Soussou, malinké, pular, arabe, français",
    personnalites: "Almamy Samory Touré (vers 1830-1900), Alfa Yaya Diallo, Ahmed Sékou Touré (1922-1984).",
    infos_pratiques: "Lieu de culte : tenue correcte exigée, visite en dehors des heures de prière et avec autorisation.",
    sources: [
      "Djibril Tamsir Niane et autres historiens guinéens sur l'histoire de la Guinée",
      "Office national du tourisme de Guinée"
    ],
    recits: [],
    quiz: [
      { question: "Où Samory Touré est-il mort en exil ?", choices: ["Au Gabon", "En Martinique", "En Algérie"], answer: 0, explanation: "Capturé en 1898, Samory Touré est mort en exil au Gabon en 1900. (Le roi Béhanzin, lui, fut exilé en Martinique puis en Algérie.)" },
      { question: "Qui était Alfa Yaya Diallo ?", choices: ["Un roi du Labé", "Un explorateur", "Un architecte"], answer: 0, explanation: "Alfa Yaya Diallo était roi du Labé, au Fouta-Djallon ; il s'opposa à l'administration coloniale et mourut en exil." }
    ]
  },
  {
    id: 207,
    slug: "mosquee-dinguiraye",
    country: "Guinée",
    cat: "historique",
    name: "Mosquée de Dinguiraye",
    region: "Haute-Guinée, Dinguiraye",
    featured: false,
    latitude: 11.2990,
    longitude: -10.7160,
    radius: 500,
    themes: ["spiritualites", "architecture", "royaumes"],
    description: "Coiffée d'un immense toit conique de chaume, la mosquée de Dinguiraye est liée à El Hadj Oumar Tall, qui fit de la ville la base de son mouvement au XIXe siècle.",
    histoire: "Vers le milieu du XIXe siècle, El Hadj Oumar Tall s'installe à Dinguiraye, qui devient le point de départ de son jihad et de la construction d'un vaste empire, jusqu'au Mali actuel. La mosquée a été reconstruite et restaurée à plusieurs reprises en respectant sa forme traditionnelle.",
    culture: "Dinguiraye reste un lieu de pèlerinage et de mémoire pour la confrérie tidjaniyya et les descendants d'El Hadj Oumar.",
    savoirs: "Architecture en terre et en chaume, techniques de couverture traditionnelles ; enseignement islamique.",
    communities: "Communauté de Dinguiraye, descendants d'El Hadj Oumar Tall.",
    langues: "Malinké, pular, arabe, français",
    personnalites: "El Hadj Oumar Tall (vers 1797-1864).",
    infos_pratiques: "Lieu de culte : visite avec autorisation des responsables de la mosquée.",
    sources: ["Direction nationale du patrimoine culturel de Guinée"],
    recits: [],
    quiz: [
      { question: "Quelle personnalité est liée à la mosquée de Dinguiraye ?", choices: ["El Hadj Oumar Tall", "Soundiata Keïta", "Kankou Moussa"], answer: 0, explanation: "El Hadj Oumar Tall fit de Dinguiraye la base de son mouvement au XIXe siècle." },
      { question: "En quel matériau est le grand toit conique de la mosquée ?", choices: ["En tôle", "En chaume", "En tuiles"], answer: 1, explanation: "Le toit conique est couvert de chaume, selon une technique traditionnelle." }
    ]
  },
  {
    id: 208,
    slug: "sosso-bala-niagassola",
    country: "Guinée",
    cat: "savoirs",
    name: "Le Sosso-Bala de Niagassola",
    region: "Haute-Guinée, Niagassola (Siguiri)",
    featured: true,
    latitude: 12.3300,
    longitude: -9.1000,
    radius: 1500,
    themes: ["musiques-danses", "langues", "royaumes"],
    description: "Dans le village de Niagassola, en Haute-Guinée, près de la frontière malienne, est conservé l'un des instruments de musique les plus célèbres d'Afrique : le Sosso-Bala, un balafon sacré que la tradition fait remonter au XIIIe siècle et au roi Soumaoro Kanté.\n\nGardé depuis des siècles par la famille Kouyaté, lignée de griots liée à la fondation de l'empire du Mali, il incarne toute une culture : celle de la parole, de la mémoire et de la musique mandingues. L'UNESCO l'a reconnu comme l'un des premiers chefs-d'œuvre du patrimoine oral et immatériel de l'humanité.",
    histoire: "### Le balafon d'un roi\nAu début du XIIIe siècle, Soumaoro Kanté règne sur le royaume du Sosso, puissant État de la région. Roi-forgeron réputé pour ses pouvoirs, il possède, selon l'épopée, un balafon magique qu'il garde jalousement et dont lui seul peut jouer.\n\n### Soundiata et Balla Fasséké\nFace à Soumaoro se dresse Soundiata Keïta, prince du Manding. Son griot, Balla Fasséké Kouyaté, est envoyé auprès de Soumaoro. Selon l'épopée, il pénètre dans la chambre secrète du roi et joue du balafon avec un tel talent que Soumaoro, séduit, le garde à son service. Vers 1235, à la bataille de Kirina, Soundiata remporte la victoire sur Soumaoro. L'empire du Mali est fondé, et le balafon revient à Balla Fasséké.\n\n### Huit siècles de garde\nDepuis, les descendants de Balla Fasséké, les Kouyaté, gardent le Sosso-Bala. La tradition veut que l'instrument ait été conservé à Niagassola, sous l'autorité d'un gardien, le Balatigui. Le balafon n'est pas un objet de musée : il est entretenu, protégé et joué selon des règles précises, lors d'occasions exceptionnelles.\n\n### Une reconnaissance mondiale\nEn 2001, l'UNESCO proclame « l'espace culturel du Sosso-Bala » chef-d'œuvre du patrimoine oral et immatériel de l'humanité, parmi les tout premiers éléments distingués dans le monde. Il est inscrit en 2008 sur la liste représentative du patrimoine culturel immatériel. Cette reconnaissance s'accompagne d'un plan de sauvegarde : transmission du savoir musical, formation de jeunes joueurs et protection de l'instrument.",
    culture: "Le Sosso-Bala est le symbole de la fonction des griots (djéli) dans la société mandingue. Les griots sont les gardiens de la parole : ils conservent les généalogies, racontent l'histoire des familles et des royaumes, conseillent, négocient, célèbrent. Sans eux, l'histoire de l'empire du Mali ne nous serait pas parvenue telle que nous la connaissons.\n\nL'épopée de Soundiata, transmise de génération en génération par les griots, est l'un des grands récits fondateurs de l'Afrique de l'Ouest. Elle est racontée dans toute la région mandingue, en Guinée, au Mali, au Sénégal, en Gambie et au-delà.\n\nPour les habitants de Niagassola, le balafon est à la fois un objet sacré, une fierté et une responsabilité : il relie la communauté à ses ancêtres et à l'histoire de tout un empire.",
    savoirs: "### Le balafon\nLe balafon est un xylophone africain : des lames de bois sont posées sur un cadre, et sous chaque lame est suspendue une calebasse qui amplifie le son. Sa fabrication demande de choisir les bois, d'accorder les lames une à une et d'ajuster les calebasses. Le Sosso-Bala, très ancien, fait l'objet de soins particuliers.\n\n### La parole des griots\nLa djéliya, l'art des griots, associe musique, chant, récitation et maîtrise de la langue. Elle s'apprend longuement, au sein des familles de griots, par l'écoute et la répétition. Les récits se transmettent de maître à élève, avec leurs variantes selon les lignées.\n\n### La transmission\nLe plan de sauvegarde lié à la reconnaissance de l'UNESCO a notamment porté sur la formation de jeunes musiciens au jeu du balafon et sur la transmission des récits associés.",
    communities: "Famille Kouyaté de Niagassola, Balatigui (gardien du balafon), griots du Manding, habitants de Niagassola.",
    langues: "Malinké (maninkakan), français",
    personnalites: "Soundiata Keïta, fondateur de l'empire du Mali ; Soumaoro Kanté, roi du Sosso ; Balla Fasséké Kouyaté, griot de Soundiata ; Djibril Tamsir Niane, historien guinéen qui a fait connaître l'épopée au monde entier.",
    infos_pratiques: "Le balafon n'est pas exposé en permanence et n'est joué qu'en de rares occasions. Toute visite se prépare à l'avance avec la famille gardienne et les autorités locales, en passant par une personne-ressource. Niagassola se trouve dans la préfecture de Siguiri, en Haute-Guinée : prévoir un long trajet par la route.",
    chronologie: [
      ["Début du XIIIe siècle", "Soumaoro Kanté règne sur le royaume du Sosso."],
      ["Vers 1235", "Bataille de Kirina : Soundiata Keïta l'emporte ; fondation de l'empire du Mali. Le balafon passe à Balla Fasséké Kouyaté."],
      ["Depuis", "Les Kouyaté gardent le Sosso-Bala, à Niagassola selon la tradition."],
      ["1960", "Djibril Tamsir Niane publie « Soundjata ou l'épopée mandingue »."],
      ["2001", "L'UNESCO proclame l'espace culturel du Sosso-Bala chef-d'œuvre du patrimoine oral et immatériel."],
      ["2008", "Inscription sur la liste représentative du patrimoine culturel immatériel de l'humanité."]
    ],
    a_voir: [
      ["Le village de Niagassola", "Le cadre de vie de la famille gardienne, au cœur du pays mandingue."],
      ["Le lieu de conservation du balafon", "Uniquement avec l'accord de la famille Kouyaté et selon les règles fixées par le Balatigui."],
      ["Les musiciens", "Écouter les balafonistes et les griots de la région, qui perpétuent la tradition."]
    ],
    saviez_vous: [
      "Le Sosso-Bala fait partie des tout premiers éléments distingués par l'UNESCO en 2001 comme chefs-d'œuvre du patrimoine oral et immatériel de l'humanité.",
      "Une explication populaire rattache le nom « Kouyaté » à une phrase de Soundiata à son griot, signifiant qu'il existe « un secret » entre eux : un lien de confiance que la famille a gardé au fil des siècles."
    ],
    sources: [
      "UNESCO — L'espace culturel du Sosso-Bala (proclamation 2001, liste représentative 2008)",
      "Djibril Tamsir Niane, Soundjata ou l'épopée mandingue, Présence africaine, 1960"
    ],
    recits: [
      {
        title: "Le balafon de Soumaoro",
        nature: "tradition_orale",
        body: "L'épopée raconte que Balla Fasséké, griot envoyé auprès de Soumaoro, entra en secret dans la chambre où le roi gardait son balafon magique et se mit à en jouer. Soumaoro, charmé par son talent, le garda à son service. Après la victoire de Soundiata à Kirina, le balafon revint au griot et à ses descendants, les Kouyaté, qui le gardent encore à Niagassola."
      },
      {
        title: "Les griots, mémoire du Manding",
        nature: "tradition_orale",
        body: "Dans la tradition mandingue, on dit que « le griot est le sac à paroles » de la société : il garde en mémoire les noms, les exploits et les alliances des familles. Chaque récit de l'épopée de Soundiata commence souvent par rappeler la chaîne des maîtres qui l'ont transmis, pour garantir la fidélité de la parole."
      }
    ],
    quiz: [
      { question: "Quelle famille garde le Sosso-Bala ?", choices: ["Les Kouyaté", "Les Keïta", "Les Diallo"], answer: 0, explanation: "Les Kouyaté, descendants du griot Balla Fasséké, gardent le balafon à Niagassola." },
      { question: "Quelle bataille, vers 1235, marque la victoire de Soundiata Keïta sur Soumaoro Kanté ?", choices: ["Kirina", "Tondibi", "Adoua"], answer: 0, explanation: "La bataille de Kirina ouvre la fondation de l'empire du Mali. Tondibi (1591) marque la chute de l'empire songhaï ; Adoua (1896), une victoire éthiopienne sur l'Italie." },
      { question: "Quel livre a fait connaître l'épopée de Soundiata au grand public ?", choices: ["Soundjata ou l'épopée mandingue, de Djibril Tamsir Niane", "L'Aventure ambiguë, de Cheikh Hamidou Kane", "Le Monde s'effondre, de Chinua Achebe"], answer: 0, explanation: "Publié en 1960, le livre de l'historien guinéen Djibril Tamsir Niane transcrit le récit du griot Mamadou Kouyaté." },
      { question: "Qu'est-ce qu'un balafon ?", choices: ["Un tambour en peau de chèvre", "Un xylophone à lames de bois et calebasses", "Une harpe à cordes"], answer: 1, explanation: "Le balafon est un xylophone : des lames de bois posées sur un cadre, avec des calebasses qui amplifient le son." },
      { question: "En quelle année l'UNESCO a-t-il proclamé l'espace culturel du Sosso-Bala chef-d'œuvre du patrimoine oral et immatériel ?", choices: ["1960", "2001", "2020"], answer: 1, explanation: "La proclamation date de 2001 ; l'élément a été inscrit sur la liste représentative en 2008." }
    ]
  },
  {
    id: 209,
    slug: "parc-national-haut-niger",
    country: "Guinée",
    cat: "naturel",
    name: "Parc national du Haut-Niger",
    region: "Haute-Guinée, Faranah",
    featured: false,
    latitude: 10.3000,
    longitude: -10.5000,
    radius: 40000,
    themes: ["faune-flore", "eaux"],
    description: "Le parc protège l'une des dernières grandes forêts sèches d'Afrique de l'Ouest (la forêt de Mafou) et le cours supérieur du fleuve Niger, qui prend sa source non loin de là.",
    histoire: "Créé à la fin des années 1990, le parc couvre une partie du bassin du haut Niger. Le fleuve Niger, long d'environ 4 200 km, naît en Guinée près de la frontière avec la Sierra Leone, puis traverse le Mali, le Niger et le Nigéria avant de rejoindre l'océan.",
    culture: "Le Niger, le « Djoliba » des Malinkés, est au cœur de la culture et de l'histoire mandingues. Les communautés riveraines vivent de la pêche, de l'agriculture et de la cueillette.",
    savoirs: "Pêche fluviale, connaissance des plantes de la forêt sèche, apiculture traditionnelle.",
    communities: "Villages riverains de la région de Faranah et de Kouroussa.",
    langues: "Malinké, kouranko, français",
    personnalites: "—",
    infos_pratiques: "Accès encadré : se renseigner auprès de l'administration du parc à Faranah avant toute visite.",
    sources: ["Office guinéen des parcs et réserves (OGUIPAR)"],
    recits: [],
    quiz: [
      { question: "Dans quel pays le fleuve Niger prend-il sa source ?", choices: ["Au Mali", "En Guinée", "Au Nigéria"], answer: 1, explanation: "Le Niger naît en Guinée, près de la frontière avec la Sierra Leone." },
      { question: "Comment les Malinkés appellent-ils le fleuve Niger ?", choices: ["Le Djoliba", "Le Bafing", "Le Konkouré"], answer: 0, explanation: "Djoliba est le nom malinké du Niger. Le Bafing est la branche principale du fleuve Sénégal." }
    ]
  },
  {
    id: 210,
    slug: "fort-de-boke",
    country: "Guinée",
    cat: "memoire",
    name: "Fort et musée de Boké",
    region: "Basse-Guinée, Boké",
    featured: false,
    latitude: 10.9380,
    longitude: -14.2900,
    radius: 400,
    themes: ["memoire-traite", "resistances", "architecture"],
    description: "Sur les rives du Rio Nunez, l'ancien fort de Boké, construit à la fin du XIXe siècle, abrite un musée consacré à l'histoire de la région, à la traite et à la période coloniale.",
    histoire: "La région du Rio Nunez fut un lieu d'échanges et de traite dès le XVIIIe siècle. À la fin du XIXe siècle, les Français y construisent un poste fortifié, qui servit aussi de prison. Le bâtiment est aujourd'hui transformé en musée.",
    culture: "Le musée rappelle l'histoire des peuples de la région (Baga, Nalou, Landouma) et leur rencontre violente avec le commerce atlantique puis la colonisation.",
    savoirs: "Mémoire locale de la traite et de la colonisation ; masques et objets des peuples côtiers.",
    communities: "Ville de Boké, peuples baga, nalou et landouma.",
    langues: "Soussou, baga, nalou, landouma, français",
    personnalites: "—",
    infos_pratiques: "Horaires à confirmer auprès de la préfecture ou du musée.",
    sources: ["Direction nationale du patrimoine culturel de Guinée"],
    recits: [],
    quiz: [
      { question: "Sur quel cours d'eau se trouve Boké ?", choices: ["Le Rio Nunez", "Le Niger", "Le Bafing"], answer: 0, explanation: "Boké est située sur le Rio Nunez, en Basse-Guinée." }
    ]
  },
  {
    id: 211,
    slug: "marche-madina-conakry",
    country: "Guinée",
    cat: "culturel",
    name: "Marché Madina",
    region: "Conakry, Madina",
    featured: false,
    latitude: 9.5520,
    longitude: -13.6560,
    radius: 800,
    themes: ["marches", "gastronomie", "artisanat"],
    description: "Plus grand marché de Conakry, Madina rassemble des produits de toutes les régions de Guinée : fonio du Fouta, huile de palme de Guinée forestière, tissus, épices, artisanat.",
    histoire: "Le marché s'est développé avec la croissance de Conakry après l'indépendance et est devenu un carrefour commercial pour tout le pays et la sous-région.",
    culture: "C'est l'endroit idéal pour découvrir la cuisine guinéenne : sauce feuille (feuilles de manioc), sauce arachide, fonio, riz, et les produits de chaque région.",
    savoirs: "Savoir-faire commerciaux, transformation des produits agricoles (fonio, huile de palme, beurre de karité).",
    communities: "Commerçantes et commerçants de Madina.",
    langues: "Soussou, pular, malinké, français",
    personnalites: "—",
    infos_pratiques: "Très grande affluence : venir accompagné, surveiller ses affaires et demander avant de photographier.",
    sources: ["Ville de Conakry"],
    recits: [],
    quiz: [
      { question: "Quelle céréale ancienne, très cultivée au Fouta-Djallon, trouve-t-on au marché Madina ?", choices: ["Le fonio", "Le quinoa", "L'avoine"], answer: 0, explanation: "Le fonio, petite céréale nutritive cultivée depuis des millénaires en Afrique de l'Ouest, est emblématique du Fouta." },
      { question: "Qu'est-ce que la « sauce feuille » guinéenne ?", choices: ["Une sauce aux feuilles de manioc", "Une salade de laitue", "Une sauce au thé"], answer: 0, explanation: "La sauce feuille est préparée avec des feuilles de manioc pilées, souvent avec de l'huile de palme." }
    ]
  }
];
