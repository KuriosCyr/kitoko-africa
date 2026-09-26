// Contenus — Kenya.
// Les coordonnées GPS sont approximatives et doivent être relevées sur place
// avant l'impression des QR codes.

module.exports = [
  {
    id: 31,
    slug: "maasai-mara",
    country: "Kenya",
    cat: "naturel",
    name: "Réserve nationale du Maasai Mara",
    region: "Narok, sud-ouest du Kenya",
    featured: true,
    latitude: -1.5,
    longitude: 35.15,
    radius: 15000,
    themes: ["faune-flore"],
    description: "Dans le sud-ouest du Kenya, les vastes savanes du Maasai Mara, prolongement du Serengeti tanzanien, accueillent l'une des plus fortes concentrations de grands animaux au monde : lions, léopards, guépards, éléphants, buffles, girafes, hippopotames.\n\nChaque année, entre juillet et octobre, plus d'un million de gnous, accompagnés de zèbres et de gazelles, y arrivent lors de la Grande Migration, en traversant la rivière Mara infestée de crocodiles.",
    histoire: "### Un écosystème partagé\nLe Maasai Mara forme, avec le Serengeti en Tanzanie, un même grand écosystème de savanes. Les animaux s'y déplacent au rythme des pluies et de l'herbe fraîche, sans tenir compte des frontières.\n\n### Une réserve sur les terres maasaï\nLa réserve est créée en 1961 et gérée par les autorités locales. Elle porte le nom du peuple maasaï, qui vit sur ces terres, et de la rivière Mara.\n\n### Les conservancies\nAutour de la réserve, des communautés maasaï ont créé des « conservancies » : des zones de protection de la faune sur leurs propres terres, où le tourisme leur rapporte directement des revenus. Ce modèle cherche à concilier élevage, faune sauvage et développement.",
    culture: "Les Maasaï sont des éleveurs semi-nomades, célèbres pour leurs vêtements rouges (shuka), leurs parures de perles et leurs danses, dont le saut adumu des jeunes guerriers. Le bétail est au centre de leur vie sociale et économique.\n\nLeur mode de vie a été bouleversé par la création des parcs, la sédentarisation et la pression foncière. Beaucoup cherchent aujourd'hui à préserver leur culture tout en participant à l'économie du tourisme.\n\nLa visite d'un village maasaï doit se faire dans le respect, idéalement avec des structures qui rémunèrent équitablement la communauté.",
    savoirs: "### Vivre avec la faune\nLes Maasaï connaissent parfaitement le comportement des animaux sauvages, avec lesquels ils partagent leurs pâturages depuis des siècles.\n\n### Les perles\nLes femmes maasaï créent des parures de perles aux couleurs codées, qui indiquent l'âge, le statut ou les étapes de la vie.\n\n### Les guides\nLes guides et pisteurs, souvent maasaï, sont des experts de la faune et de la savane.",
    communities: "Communautés maasaï, conservancies communautaires, guides et rangers.",
    langues: "Maa, swahili, anglais",
    personnalites: "—",
    infos_pratiques: "Safaris avec des opérateurs agréés ; droits d'entrée journaliers. Grande Migration généralement de juillet à octobre (variable selon les pluies). Rester dans le véhicule, respecter les distances et ne jamais encercler les animaux. Privilégier les séjours dans les conservancies communautaires.",
    chronologie: [
      ["1961", "Création de la réserve nationale du Maasai Mara."],
      ["Années 2000 - 2010", "Développement des conservancies communautaires maasaï."],
      ["Chaque année, juillet à octobre", "Grande Migration des gnous et des zèbres."]
    ],
    a_voir: [
      ["La traversée de la rivière Mara", "Pendant la Grande Migration."],
      ["Les grands félins", "Lions, léopards et guépards."],
      ["Un village maasaï", "Avec une structure qui rémunère la communauté."]
    ],
    saviez_vous: [
      "Plus d'un million de gnous participent chaque année à la Grande Migration entre le Serengeti et le Maasai Mara.",
      "Les couleurs des perles maasaï ont chacune une signification."
    ],
    sources: [
      "Kenya Wildlife Service",
      "Maasai Mara Wildlife Conservancies Association"
    ],
    recits: [],
    quiz: [
      { question: "Avec quel parc tanzanien le Maasai Mara forme-t-il un même écosystème ?", choices: ["Le Serengeti", "Le Kruger", "La Pendjari"], answer: 0, explanation: "Mara et Serengeti forment un seul grand écosystème de savanes." },
      { question: "Quels animaux sont les plus nombreux lors de la Grande Migration ?", choices: ["Les gnous", "Les éléphants", "Les girafes"], answer: 0, explanation: "Plus d'un million de gnous migrent chaque année." },
      { question: "Quel peuple vit sur les terres du Maasai Mara ?", choices: ["Les Maasaï", "Les Zoulous", "Les Touaregs"], answer: 0, explanation: "La réserve porte le nom du peuple maasaï." },
      { question: "Qu'est-ce qu'une « conservancy » communautaire ?", choices: ["Une zone de protection de la faune sur des terres communautaires", "Une école de musique", "Un marché de bétail"], answer: 0, explanation: "Les communautés y protègent la faune et en tirent des revenus." },
      { question: "À quelle période a généralement lieu la Grande Migration au Mara ?", choices: ["De juillet à octobre", "En janvier", "En avril uniquement"], answer: 0, explanation: "Les troupeaux arrivent au Mara entre juillet et octobre, selon les pluies." }
    ]
  },
  {
    id: 32,
    slug: "fort-jesus-mombasa",
    country: "Kenya",
    cat: "historique",
    name: "Fort Jesus, Mombasa",
    region: "Mombasa, vieille ville",
    featured: false,
    latitude: -4.0628,
    longitude: 39.6794,
    radius: 400,
    themes: ["architecture", "resistances", "memoire-traite"],
    description: "À l'entrée du vieux port de Mombasa, Fort Jesus, construit par les Portugais à la fin du XVIe siècle, domine l'océan Indien. Pendant des siècles, Portugais, Omanais et Swahilis se sont disputé cette forteresse, clé du commerce de la côte est-africaine.\n\nInscrit au patrimoine mondial de l'UNESCO en 2011, le fort abrite aujourd'hui un musée, à deux pas de la vieille ville swahilie de Mombasa.",
    histoire: "### La côte swahilie\nBien avant l'arrivée des Européens, la côte est-africaine est le lieu d'une brillante civilisation swahilie, faite de cités marchandes (Kilwa, Lamu, Mombasa…) en lien avec l'Arabie, la Perse, l'Inde et la Chine.\n\n### La forteresse portugaise\nArrivés à la fin du XVe siècle, les Portugais cherchent à contrôler le commerce de l'océan Indien. En 1593, ils construisent Fort Jesus, selon les plans de l'architecte italien Giovanni Battista Cairati.\n\n### Le siège de 1696-1698\nLe fort change plusieurs fois de mains. En 1698, après un siège de près de trois ans, les Omanais s'en emparent, mettant fin à la domination portugaise sur la côte au nord du Mozambique.\n\n### Prison et musée\nSous la colonisation britannique, le fort sert de prison. Il devient un monument national en 1958 et un musée, puis il est inscrit au patrimoine mondial en 2011.",
    culture: "Mombasa est une ville swahilie, où se mêlent influences africaines, arabes, indiennes et européennes. La vieille ville, avec ses maisons à balcons sculptés et ses portes en bois ornées, se découvre à pied depuis le fort.\n\nLe swahili, langue bantoue enrichie de mots arabes, est aujourd'hui l'une des langues les plus parlées d'Afrique.\n\nLe fort rappelle aussi que l'océan Indien fut, lui aussi, le théâtre d'une traite des captifs africains, vers l'Arabie et les îles de l'océan Indien.",
    savoirs: "### L'architecture militaire\nLe plan du fort, en forme de corps humain vu du ciel selon une lecture courante, suit les principes de l'architecture militaire de la Renaissance.\n\n### Les portes swahilies\nLes menuisiers de la côte sculptent des portes massives ornées de motifs floraux et géométriques, emblèmes de la culture swahilie.",
    communities: "Musées nationaux du Kenya, habitants de la vieille ville de Mombasa.",
    langues: "Swahili, anglais",
    personnalites: "Giovanni Battista Cairati, architecte du fort.",
    infos_pratiques: "Ouvert tous les jours, droit d'entrée. Visite du musée et des remparts : environ 1 h 30. Compléter par une promenade dans la vieille ville, avec un guide. Tenue correcte recommandée dans la vieille ville.",
    chronologie: [
      ["Avant le XVe siècle", "Essor des cités swahilies de la côte."],
      ["1593", "Construction de Fort Jesus par les Portugais."],
      ["1696 - 1698", "Siège du fort et prise par les Omanais."],
      ["Époque britannique", "Le fort sert de prison."],
      ["1958", "Le fort devient monument national."],
      ["2011", "Inscription au patrimoine mondial de l'UNESCO."]
    ],
    a_voir: [
      ["Les remparts", "Avec la vue sur le vieux port."],
      ["Le musée", "Objets de la côte swahilie et d'une épave portugaise."],
      ["La vieille ville de Mombasa", "Ses portes sculptées et ses balcons."]
    ],
    saviez_vous: [
      "Le siège de Fort Jesus par les Omanais a duré près de trois ans.",
      "Le swahili, parlé par des dizaines de millions de personnes, est né sur cette côte."
    ],
    sources: [
      "UNESCO — Fort Jesus, Mombasa (2011)",
      "Musées nationaux du Kenya"
    ],
    recits: [],
    quiz: [
      { question: "Qui a construit Fort Jesus en 1593 ?", choices: ["Les Portugais", "Les Britanniques", "Les Omanais"], answer: 0, explanation: "Les Portugais construisirent le fort pour contrôler le commerce de l'océan Indien." },
      { question: "Qui s'empara du fort en 1698 après un long siège ?", choices: ["Les Omanais", "Les Français", "Les Zoulous"], answer: 0, explanation: "Les Omanais prirent le fort après près de trois ans de siège." },
      { question: "Quelle langue est née sur la côte est-africaine ?", choices: ["Le swahili", "Le haoussa", "Le wolof"], answer: 0, explanation: "Le swahili est une langue bantoue enrichie de mots arabes." },
      { question: "Sur quel océan se trouve Mombasa ?", choices: ["L'océan Indien", "L'océan Atlantique", "L'océan Pacifique"], answer: 0, explanation: "Mombasa est un port de l'océan Indien." },
      { question: "En quelle année le fort a-t-il été inscrit au patrimoine mondial ?", choices: ["2011", "1979", "1593"], answer: 0, explanation: "Fort Jesus a été inscrit en 2011." }
    ]
  },
  {
    id: 33,
    slug: "lac-nakuru",
    country: "Kenya",
    cat: "naturel",
    name: "Parc national du lac Nakuru",
    region: "Nakuru, vallée du Grand Rift",
    featured: false,
    latitude: -0.3667,
    longitude: 36.0833,
    radius: 6000,
    themes: ["faune-flore", "eaux"],
    description: "Dans la vallée du Grand Rift, le lac Nakuru est célèbre pour les nuées de flamants roses qui colorent parfois ses rives. Le parc national qui l'entoure est aussi un refuge pour les rhinocéros noirs et blancs, les girafes de Rothschild, les lions et les léopards.\n\nIl fait partie du « système de lacs du Kenya dans la vallée du Grand Rift », inscrit au patrimoine mondial de l'UNESCO en 2011.",
    histoire: "### Le Grand Rift\nLa vallée du Grand Rift est une immense fracture de l'écorce terrestre qui traverse l'Afrique de l'Est. Elle est jalonnée de volcans et de lacs, dont plusieurs, comme Nakuru, sont peu profonds et très alcalins.\n\n### Un parc pour les oiseaux et les rhinocéros\nLe parc national est créé en 1961, d'abord pour protéger les oiseaux. Il devient ensuite l'un des premiers sanctuaires pour les rhinocéros au Kenya, entouré d'une clôture pour les protéger du braconnage.\n\n### Un lac qui change\nLe niveau et la salinité du lac varient beaucoup. Ces dernières années, la montée des eaux a réduit la présence des flamants, qui se déplacent entre les lacs du Rift selon la nourriture disponible.",
    culture: "Nakuru est l'une des plus grandes villes du Kenya ; le parc, à ses portes, est un lieu de sortie apprécié des familles et des écoles kényanes.\n\nLa vallée du Grand Rift est aussi un haut lieu de l'histoire humaine : de nombreux fossiles d'ancêtres de l'homme y ont été découverts.",
    savoirs: "### Les flamants et le lac\nLes flamants se nourrissent de micro-algues qui prolifèrent dans les eaux alcalines ; leur couleur rose vient des pigments de cette nourriture.\n\n### La protection des rhinocéros\nLes rangers du Kenya Wildlife Service suivent chaque rhinocéros individuellement pour le protéger du braconnage.",
    communities: "Kenya Wildlife Service, habitants de Nakuru.",
    langues: "Swahili, kikuyu, anglais",
    personnalites: "—",
    infos_pratiques: "Accès en véhicule, droits d'entrée journaliers. Environ 3 heures de route depuis Nairobi. La présence des flamants varie selon les années. Rester dans le véhicule sauf aux points autorisés.",
    chronologie: [
      ["1961", "Création du parc national du lac Nakuru."],
      ["Années 1980", "Création d'un sanctuaire pour les rhinocéros."],
      ["2011", "Inscription des lacs du Rift kényan au patrimoine mondial."]
    ],
    a_voir: [
      ["Les flamants roses", "Quand ils sont présents, un spectacle inoubliable."],
      ["Les rhinocéros", "Noirs et blancs, protégés dans le parc."],
      ["Le point de vue de Baboon Cliff", "Sur le lac et la vallée."]
    ],
    saviez_vous: [
      "La couleur rose des flamants vient des pigments des algues qu'ils mangent.",
      "La vallée du Grand Rift est une fracture de l'écorce terrestre qui traverse l'Afrique de l'Est."
    ],
    sources: [
      "UNESCO — Système des lacs du Kenya dans la vallée du Grand Rift (2011)",
      "Kenya Wildlife Service"
    ],
    recits: [],
    quiz: [
      { question: "Quels oiseaux ont fait la célébrité du lac Nakuru ?", choices: ["Les flamants roses", "Les pingouins", "Les aigles royaux"], answer: 0, explanation: "Des nuées de flamants roses se rassemblent parfois sur ses rives." },
      { question: "D'où vient la couleur rose des flamants ?", choices: ["Des pigments des algues qu'ils mangent", "De la couleur de l'eau", "Du soleil"], answer: 0, explanation: "Leur nourriture contient des pigments roses." },
      { question: "Dans quelle grande vallée se trouve le lac ?", choices: ["La vallée du Grand Rift", "La vallée du Nil", "La vallée de l'Omo"], answer: 0, explanation: "Le lac est dans la vallée du Grand Rift." },
      { question: "Quel grand mammifère menacé le parc protège-t-il particulièrement ?", choices: ["Le rhinocéros", "Le gorille", "L'ours"], answer: 0, explanation: "Le parc est un sanctuaire pour les rhinocéros noirs et blancs." },
      { question: "En quelle année les lacs du Rift kényan ont-ils été inscrits au patrimoine mondial ?", choices: ["2011", "1961", "1990"], answer: 0, explanation: "Ils ont été inscrits en 2011." }
    ]
  },
  {
    id: 391,
    slug: "vieille-ville-lamu",
    country: "Kenya",
    cat: "culturel",
    name: "Vieille ville de Lamu",
    region: "Lamu, archipel de Lamu",
    featured: true,
    latitude: -2.2717,
    longitude: 40.902,
    radius: 800,
    themes: ["architecture", "spiritualites", "festivals", "langues"],
    description: "Sur une île de l'océan Indien, au nord de la côte kényane, Lamu est la plus ancienne et la mieux préservée des villes swahilies d'Afrique de l'Est. Ses ruelles étroites, ses maisons en pierre de corail aux portes sculptées et ses boutres à voile triangulaire n'ont guère changé depuis des siècles.\n\nIci, pas de voitures : on se déplace à pied ou à dos d'âne. Lamu est inscrite au patrimoine mondial de l'UNESCO depuis 2001.",
    histoire: "### Une cité swahilie\nFondée il y a plus de sept siècles, Lamu fait partie du réseau des cités marchandes swahilies de la côte est-africaine, en lien avec l'Arabie, la Perse et l'Inde. On y échangeait ivoire, bois, épices et tissus.\n\n### Portugais et Omanais\nComme Mombasa, Lamu passe sous l'influence portugaise au XVIe siècle, puis sous celle du sultanat d'Oman au XVIIe siècle. Au XIXe siècle, elle connaît une période de prospérité, avant de décliner avec la fin du commerce des captifs et le développement de Mombasa.\n\n### Une ville préservée\nCe relatif isolement a permis à Lamu de conserver son architecture et son mode de vie. Elle est inscrite au patrimoine mondial en 2001.",
    culture: "Lamu est un centre religieux important pour les musulmans d'Afrique de l'Est. Le festival du Maulidi, qui célèbre la naissance du Prophète, y attire des pèlerins de toute la région, avec processions, chants et courses de boutres et d'ânes.\n\nLe festival culturel de Lamu met en valeur la poésie swahilie, l'artisanat, les danses et la navigation traditionnelle.\n\nLa langue et la littérature swahilies y sont particulièrement vivantes, avec une longue tradition de poésie écrite.",
    savoirs: "### Les boutres\nLes charpentiers de marine construisent encore des boutres (dhows) en bois, selon des techniques anciennes.\n\n### L'architecture de corail\nLes maisons sont construites en pierre de corail et en mortier de chaux, avec des toits en bois de palétuvier et des décors de plâtre sculpté.\n\n### Les portes sculptées\nLes portes de Lamu, en bois massif richement sculpté, sont l'emblème de l'art swahili.",
    communities: "Habitants de Lamu, charpentiers de marine, artisans, Musées nationaux du Kenya.",
    langues: "Swahili (kiamu), anglais",
    personnalites: "—",
    infos_pratiques: "Accès en avion jusqu'à l'île de Manda, puis en bateau. Tenue correcte recommandée (ville à majorité musulmane). Respecter les habitants et demander avant de photographier. Se renseigner sur les consignes de sécurité pour la région de Lamu avant le départ.",
    chronologie: [
      ["Il y a plus de sept siècles", "Fondation de Lamu, cité marchande swahilie."],
      ["XVIe siècle", "Influence portugaise."],
      ["XVIIe - XIXe siècles", "Influence omanaise ; période de prospérité."],
      ["2001", "Inscription au patrimoine mondial de l'UNESCO."]
    ],
    a_voir: [
      ["Les ruelles de la vieille ville", "Sans voitures, à pied ou à dos d'âne."],
      ["Le musée de Lamu", "L'histoire et la culture swahilies."],
      ["Les chantiers de boutres", "Charpentiers au travail."],
      ["Une sortie en boutre", "Au coucher du soleil."]
    ],
    saviez_vous: [
      "Il n'y a presque pas de voitures à Lamu : l'âne reste le principal moyen de transport.",
      "Lamu est la plus ancienne ville swahilie encore habitée de manière continue en Afrique de l'Est."
    ],
    sources: [
      "UNESCO — Vieille ville de Lamu (2001)",
      "Musées nationaux du Kenya"
    ],
    recits: [],
    quiz: [
      { question: "Quel est le principal moyen de transport dans la vieille ville de Lamu ?", choices: ["L'âne", "Le tramway", "Le scooter"], answer: 0, explanation: "Il n'y a presque pas de voitures ; on circule à pied ou à dos d'âne." },
      { question: "En quel matériau sont construites les maisons anciennes de Lamu ?", choices: ["En pierre de corail", "En bambou", "En briques rouges"], answer: 0, explanation: "Elles sont en pierre de corail et mortier de chaux." },
      { question: "Comment s'appellent les bateaux traditionnels à voile triangulaire ?", choices: ["Les boutres (dhows)", "Les pirogues", "Les jonques"], answer: 0, explanation: "Les boutres naviguent sur l'océan Indien depuis des siècles." },
      { question: "Quelle fête religieuse attire des pèlerins à Lamu ?", choices: ["Le Maulidi", "Le Vodun", "Noël"], answer: 0, explanation: "Le Maulidi célèbre la naissance du Prophète." },
      { question: "En quelle année Lamu a-t-elle été inscrite au patrimoine mondial ?", choices: ["2001", "1978", "2020"], answer: 0, explanation: "Lamu a été inscrite en 2001." }
    ]
  },
  {
    id: 392,
    slug: "forets-sacrees-kaya",
    country: "Kenya",
    cat: "savoirs",
    name: "Forêts sacrées kaya des Mijikenda",
    region: "Kwale et Kilifi, côte kényane",
    featured: false,
    latitude: -4.39,
    longitude: 39.55,
    radius: 1500,
    themes: ["spiritualites", "faune-flore"],
    description: "Le long de la côte kényane, des îlots de forêt préservés abritent les kaya, anciens villages fortifiés et lieux sacrés des peuples mijikenda. Ces forêts, protégées par les anciens depuis des siècles, sont aujourd'hui des refuges de biodiversité.\n\nInscrites au patrimoine mondial de l'UNESCO en 2008, les forêts sacrées kaya montrent comment la spiritualité peut protéger la nature.",
    histoire: "### Les villages des Mijikenda\nLes Mijikenda (« neuf villages ») sont neuf peuples apparentés de la côte kényane : Giriama, Digo, Duruma, Rabai et d'autres. Selon leurs traditions, ils se sont installés dans la région vers le XVIe siècle et ont bâti des villages fortifiés au cœur de la forêt, les kaya.\n\n### Des villages aux lieux sacrés\nÀ partir du XXe siècle, les habitants quittent progressivement les kaya pour s'installer dans les plaines. Les forêts restent des lieux sacrés, où se déroulent prières, rites et cérémonies, sous l'autorité des conseils d'anciens (kambi).\n\n### La reconnaissance\nEn 2008, onze forêts kaya sont inscrites au patrimoine mondial de l'UNESCO. Menacées par l'urbanisation et l'exploitation du bois, elles font l'objet de programmes de protection associant les anciens et les autorités.",
    culture: "Les kaya sont des lieux où l'on honore les ancêtres et où l'on prie pour la pluie, la santé ou la paix. Des règles strictes interdisent d'y couper des arbres ou d'y chasser, ce qui a permis de conserver des forêts très riches.\n\nLes anciens, gardiens des kaya, transmettent les rites, les récits et les valeurs de la communauté.\n\nCertaines kaya, comme celle de Kinondo près de Diani, se visitent avec un guide de la communauté, dans le respect des règles.",
    savoirs: "### Protéger par le sacré\nLes interdits coutumiers ont préservé des espèces rares de plantes, d'oiseaux et de papillons.\n\n### La pharmacopée\nLes guérisseurs mijikenda connaissent les plantes médicinales de la forêt.",
    communities: "Peuples mijikenda (Giriama, Digo, Duruma, Rabai…), conseils d'anciens (kambi).",
    langues: "Langues mijikenda, swahili, anglais",
    personnalites: "—",
    infos_pratiques: "Certaines kaya se visitent uniquement avec un guide de la communauté (par exemple Kaya Kinondo, près de Diani). Respecter les règles : tenue indiquée par le guide, ne rien cueillir, ne pas photographier certains lieux. Contribution demandée pour la communauté.",
    chronologie: [
      ["Vers le XVIe siècle", "Selon les traditions, fondation des kaya par les Mijikenda."],
      ["XXe siècle", "Les habitants quittent les kaya, qui restent des lieux sacrés."],
      ["2008", "Inscription de onze forêts kaya au patrimoine mondial."]
    ],
    a_voir: [
      ["Kaya Kinondo", "Visite guidée par la communauté, près de Diani."],
      ["Les arbres centenaires", "Protégés par les interdits coutumiers."],
      ["Les plantes médicinales", "Avec les explications du guide."]
    ],
    saviez_vous: [
      "« Mijikenda » signifie « neuf villages ».",
      "Les interdits sacrés ont protégé ces forêts bien mieux que beaucoup de réserves officielles."
    ],
    sources: [
      "UNESCO — Forêts sacrées de kaya des Mijikenda (2008)",
      "Musées nationaux du Kenya — Coastal Forest Conservation Unit"
    ],
    recits: [],
    quiz: [
      { question: "Que signifie « Mijikenda » ?", choices: ["« Neuf villages »", "« Forêt sacrée »", "« Peuple de la mer »"], answer: 0, explanation: "Les Mijikenda sont neuf peuples apparentés de la côte kényane." },
      { question: "Qu'étaient à l'origine les kaya ?", choices: ["Des villages fortifiés en forêt", "Des ports", "Des mines"], answer: 0, explanation: "Les kaya étaient des villages fortifiés au cœur de la forêt." },
      { question: "Qui garde les forêts kaya ?", choices: ["Les conseils d'anciens", "Une armée étrangère", "Personne"], answer: 0, explanation: "Les anciens (kambi) veillent sur les kaya." },
      { question: "Pourquoi ces forêts sont-elles bien préservées ?", choices: ["Grâce aux interdits sacrés", "Parce qu'elles sont sous l'eau", "Parce qu'elles sont en altitude"], answer: 0, explanation: "Il est interdit d'y couper des arbres ou d'y chasser." },
      { question: "En quelle année les forêts kaya ont-elles été inscrites au patrimoine mondial ?", choices: ["2008", "1981", "2020"], answer: 0, explanation: "Onze forêts kaya ont été inscrites en 2008." }
    ]
  }
];
