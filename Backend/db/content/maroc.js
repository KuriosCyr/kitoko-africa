// Contenus — Maroc.
// Les coordonnées GPS sont approximatives et doivent être relevées sur place
// avant l'impression des QR codes.

module.exports = [
  {
    id: 25,
    slug: "medina-de-fes",
    country: "Maroc",
    cat: "culturel",
    name: "Médina de Fès",
    region: "Fès-Meknès, Fès el-Bali",
    featured: true,
    latitude: 34.0617,
    longitude: -4.9775,
    radius: 1500,
    themes: ["artisanat", "spiritualites", "architecture", "marches"],
    description: "Fès el-Bali, la vieille ville de Fès, est l'une des plus grandes médinas du monde et l'une des plus grandes zones piétonnes urbaines. Dans son labyrinthe de milliers de ruelles vivent artisans, commerçants et familles, autour de mosquées, de medersas et de souks.\n\nFondée au IXe siècle, capitale intellectuelle et spirituelle du Maroc, elle abrite la Qaraouiyine, souvent citée comme la plus ancienne université encore en activité au monde. Elle est inscrite au patrimoine mondial de l'UNESCO depuis 1981.",
    histoire: "### Une ville fondée au IXe siècle\nFès est fondée à la fin du VIIIe et au début du IXe siècle par la dynastie des Idrissides. Elle accueille des familles venues de Kairouan (Tunisie) et d'Andalousie, qui donnent leur nom à ses deux grands quartiers historiques.\n\n### La Qaraouiyine\nEn 859, Fatima al-Fihriya, une femme originaire de Kairouan, fonde la mosquée de la Qaraouiyine. Elle devient un grand centre d'enseignement, qui attire des savants de tout le monde musulman et au-delà. Sa bibliothèque conserve des manuscrits très anciens.\n\n### L'âge d'or mérinide\nAux XIIIe et XIVe siècles, sous la dynastie des Mérinides, Fès devient la capitale du Maroc. Les sultans y font construire de magnifiques medersas (écoles), ornées de zelliges, de bois sculpté et de stuc.\n\n### Une ville vivante\nInscrite au patrimoine mondial en 1981, la médina fait l'objet de grands programmes de restauration, tout en restant une ville habitée et active.",
    culture: "Fès est la ville de l'artisanat marocain : tanneurs, dinandiers, potiers, tisserands, menuisiers, brodeuses travaillent dans des quartiers spécialisés, selon des techniques transmises depuis des siècles.\n\nC'est aussi un haut lieu de la musique arabo-andalouse et du soufisme ; le Festival de Fès des musiques sacrées du monde y rassemble chaque année des artistes du monde entier.\n\nLa cuisine fassie, raffinée, est considérée comme l'une des plus élaborées du Maroc.",
    savoirs: "### Les tanneries\nÀ la tannerie Chouara, les peaux sont traitées dans des cuves de pierre remplies de teintures naturelles, selon des méthodes anciennes.\n\n### Le zellige\nLes artisans taillent à la main de petits carreaux de céramique émaillée pour composer des motifs géométriques complexes.\n\n### La transmission\nLes métiers de la médina s'apprennent dans l'atelier du maître, par l'observation et la pratique.",
    communities: "Artisans, commerçants et habitants de Fès el-Bali, université Al Quaraouiyine.",
    langues: "Arabe (darija), amazigh, français",
    personnalites: "Fatima al-Fihriya, fondatrice de la Qaraouiyine (IXe siècle) ; Ibn Khaldoun, qui y séjourna au XIVe siècle.",
    infos_pratiques: "La médina se visite à pied ; un guide officiel est conseillé pour ne pas se perdre. L'intérieur des mosquées est généralement réservé aux musulmans ; les medersas se visitent. Tenue correcte recommandée. Demander avant de photographier les artisans.",
    chronologie: [
      ["Fin VIIIe - début IXe siècle", "Fondation de Fès par les Idrissides."],
      ["859", "Fondation de la Qaraouiyine par Fatima al-Fihriya."],
      ["XIIIe - XIVe siècles", "Âge d'or mérinide ; construction des medersas."],
      ["1981", "Inscription au patrimoine mondial de l'UNESCO."]
    ],
    a_voir: [
      ["La tannerie Chouara", "Ses cuves colorées, vues depuis les terrasses."],
      ["La medersa Bou Inania", "Un chef-d'œuvre de l'architecture mérinide."],
      ["La Qaraouiyine", "Depuis ses portes, et sa bibliothèque restaurée."],
      ["Les souks spécialisés", "Dinandiers, tisserands, potiers."]
    ],
    saviez_vous: [
      "La Qaraouiyine a été fondée en 859 par une femme, Fatima al-Fihriya.",
      "Fès el-Bali est l'une des plus grandes zones urbaines sans voitures au monde : on y transporte les marchandises à dos d'âne."
    ],
    sources: [
      "UNESCO — Médina de Fès (1981)",
      "Roger Le Tourneau, Fès avant le Protectorat, 1949"
    ],
    recits: [],
    quiz: [
      { question: "Qui a fondé la Qaraouiyine en 859 ?", choices: ["Fatima al-Fihriya", "Ibn Battuta", "Moulay Ismaïl"], answer: 0, explanation: "Fatima al-Fihriya, originaire de Kairouan, fonda la mosquée-université." },
      { question: "Que trouve-t-on à la tannerie Chouara ?", choices: ["Des cuves de teinture pour le cuir", "Un marché aux poissons", "Une gare"], answer: 0, explanation: "Les peaux y sont teintes dans des cuves de pierre." },
      { question: "Qu'est-ce que le zellige ?", choices: ["Une mosaïque de carreaux de céramique", "Un plat de semoule", "Un instrument de musique"], answer: 0, explanation: "Les artisans taillent de petits carreaux pour former des motifs géométriques." },
      { question: "Sous quelle dynastie furent construites les grandes medersas de Fès ?", choices: ["Les Mérinides", "Les Pharaons", "Les Ottomans"], answer: 0, explanation: "Les Mérinides firent de Fès leur capitale aux XIIIe et XIVe siècles." },
      { question: "En quelle année la médina a-t-elle été inscrite au patrimoine mondial ?", choices: ["1981", "2001", "1960"], answer: 0, explanation: "Elle a été inscrite en 1981." }
    ]
  },
  {
    id: 26,
    slug: "ait-ben-haddou",
    country: "Maroc",
    cat: "historique",
    name: "Ksar d'Aït-Ben-Haddou",
    region: "Drâa-Tafilalet, Ouarzazate",
    featured: false,
    latitude: 31.047,
    longitude: -7.1319,
    radius: 500,
    themes: ["architecture"],
    description: "Au pied du Haut Atlas, sur une colline dominant l'oued Ounila, le ksar d'Aït-Ben-Haddou est un village fortifié en terre crue, avec ses maisons, ses tours et ses greniers serrés les uns contre les autres. C'est l'un des plus beaux exemples de l'architecture en terre du sud marocain.\n\nInscrit au patrimoine mondial de l'UNESCO en 1987, il a aussi servi de décor à de nombreux films célèbres.",
    histoire: "### Une étape caravanière\nLe ksar se trouve sur l'ancienne route des caravanes qui reliait le Sahara à Marrakech, à travers les montagnes du Haut Atlas. Ses habitants tiraient profit du passage des marchands.\n\n### Un village fortifié\nUn ksar (pluriel ksour) est un village fortifié, entouré de murailles, qui regroupe les maisons, un grenier collectif (agadir), une mosquée et des places. Les bâtiments actuels datent pour la plupart des derniers siècles, car la terre doit être régulièrement entretenue et reconstruite.\n\n### Un décor de cinéma\nDepuis les années 1960, le ksar et la région de Ouarzazate, surnommée « le Hollywood de l'Afrique », ont servi de décor à de nombreux films et séries.",
    culture: "La plupart des familles ont quitté le ksar pour s'installer sur l'autre rive, dans un village moderne ; quelques familles y vivent encore. Le tourisme et le cinéma sont devenus des ressources importantes.\n\nLes populations de la région sont en majorité amazighes (berbères), avec leurs langues, leurs traditions et leur artisanat (tapis, bijoux).",
    savoirs: "### Le pisé\nLes murs sont construits en pisé : de la terre tassée dans des coffrages de bois. Ils sont décorés de motifs géométriques en relief.\n\n### L'entretien\nLa terre crue doit être régulièrement réparée après les pluies ; des programmes de sauvegarde forment des artisans à ces techniques.",
    communities: "Habitants du ksar et du village voisin, artisans, guides.",
    langues: "Amazigh (tachelhit), arabe, français",
    personnalites: "—",
    infos_pratiques: "Accès à pied depuis le village moderne, en traversant l'oued (passerelle). Monter jusqu'à l'agadir au sommet pour la vue. Certaines maisons demandent une petite contribution pour la visite. Ouarzazate est à environ 30 km.",
    chronologie: [
      ["Siècles passés", "Le ksar, étape sur la route caravanière du Sahara à Marrakech."],
      ["Années 1960", "Premiers tournages de films dans la région."],
      ["1987", "Inscription au patrimoine mondial de l'UNESCO."]
    ],
    a_voir: [
      ["L'agadir au sommet", "Le grenier fortifié, avec vue sur la vallée."],
      ["Les ruelles du ksar", "Maisons et tours en terre décorées."],
      ["Le coucher du soleil", "Quand la terre prend une couleur dorée."]
    ],
    saviez_vous: [
      "Un ksar est un village fortifié en terre ; au pluriel, on dit des ksour.",
      "La région de Ouarzazate est surnommée « le Hollywood de l'Afrique »."
    ],
    sources: [
      "UNESCO — Ksar d'Aït-Ben-Haddou (1987)",
      "Centre de conservation et de réhabilitation du patrimoine architectural des zones atlasiques et subatlasiques (CERKAS)"
    ],
    recits: [],
    quiz: [
      { question: "Qu'est-ce qu'un ksar ?", choices: ["Un village fortifié en terre", "Un bateau", "Un instrument de musique"], answer: 0, explanation: "Le ksar regroupe maisons, grenier et mosquée derrière des murailles." },
      { question: "Au pied de quelle chaîne de montagnes se trouve le ksar ?", choices: ["Le Haut Atlas", "Les Alpes", "Le Rif"], answer: 0, explanation: "Aït-Ben-Haddou est au pied du Haut Atlas." },
      { question: "Comment appelle-t-on le grenier collectif fortifié ?", choices: ["L'agadir", "Le souk", "Le riad"], answer: 0, explanation: "L'agadir est le grenier fortifié du village." },
      { question: "Quel surnom donne-t-on à la région de Ouarzazate ?", choices: ["Le Hollywood de l'Afrique", "La Venise du désert", "La ville bleue"], answer: 0, explanation: "De nombreux films y ont été tournés." },
      { question: "En quelle année le ksar a-t-il été inscrit au patrimoine mondial ?", choices: ["1987", "2012", "1950"], answer: 0, explanation: "Il a été inscrit en 1987." }
    ]
  },
  {
    id: 27,
    slug: "chefchaouen",
    country: "Maroc",
    cat: "culturel",
    name: "Chefchaouen, la ville bleue",
    region: "Tanger-Tétouan-Al Hoceïma, Chefchaouen",
    featured: false,
    latitude: 35.1688,
    longitude: -5.2636,
    radius: 1000,
    themes: ["architecture", "artisanat"],
    description: "Nichée dans les montagnes du Rif, Chefchaouen est célèbre pour ses ruelles et ses maisons peintes dans toutes les nuances de bleu. Cette petite ville, longtemps fermée aux étrangers, attire aujourd'hui des visiteurs du monde entier.\n\nDerrière la carte postale, elle raconte l'histoire des réfugiés andalous, musulmans et juifs, qui s'y installèrent à la fin du XVe siècle.",
    histoire: "### Une forteresse de montagne\nChefchaouen est fondée en 1471 par Moulay Ali Ben Rachid, comme forteresse contre les incursions portugaises sur la côte.\n\n### Les réfugiés d'Andalousie\nAprès la chute de Grenade en 1492, de nombreux musulmans et juifs chassés d'Espagne s'y installent. Ils donnent à la ville son architecture andalouse : maisons blanchies à la chaux, toits de tuiles, patios et fontaines.\n\n### Pourquoi le bleu ?\nPlusieurs explications circulent : une tradition apportée par des familles juives, qui associaient le bleu au ciel et au divin ; le désir d'éloigner les moustiques ; ou, plus récemment, l'attrait touristique. La couleur est aujourd'hui entretenue par les habitants.\n\n### Une ville longtemps isolée\nJusqu'au début du XXe siècle, Chefchaouen était une ville sainte et très peu accessible aux étrangers.",
    culture: "Chefchaouen est une ville paisible, où la vie s'organise autour de la place Outa el-Hammam, de la kasbah et de la grande mosquée.\n\nLa région est connue pour son artisanat (tissage de couvertures en laine, poterie) et pour ses produits de montagne, dont le fromage de chèvre.\n\nLes habitants sont en majorité jbala, peuple montagnard arabophone du Rif occidental.",
    savoirs: "### La chaux et le bleu\nLes façades sont régulièrement blanchies à la chaux, mêlée de pigments bleus.\n\n### Le tissage\nLes tisserands de Chefchaouen fabriquent des couvertures et des tapis en laine sur des métiers traditionnels.",
    communities: "Habitants de Chefchaouen, artisans tisserands.",
    langues: "Arabe (darija, parler jbala), espagnol, français",
    personnalites: "Moulay Ali Ben Rachid, fondateur de la ville (1471).",
    infos_pratiques: "La médina se visite à pied, avec des ruelles en pente. Demander avant de photographier les habitants et l'intérieur des maisons. Monter à la mosquée espagnole, sur la colline voisine, pour la vue au coucher du soleil. Randonnées possibles dans le parc national de Talassemtane.",
    chronologie: [
      ["1471", "Fondation de Chefchaouen par Moulay Ali Ben Rachid."],
      ["1492", "Chute de Grenade ; arrivée de réfugiés andalous."],
      ["Début du XXe siècle", "La ville s'ouvre aux étrangers."],
      ["Aujourd'hui", "Destination réputée pour ses ruelles bleues."]
    ],
    a_voir: [
      ["Les ruelles bleues", "Dans toutes les nuances de bleu."],
      ["La kasbah", "Ancienne forteresse avec jardin et musée."],
      ["La place Outa el-Hammam", "Cœur animé de la ville."],
      ["La mosquée espagnole", "Pour la vue sur la ville."]
    ],
    saviez_vous: [
      "Chefchaouen a été fondée en 1471 comme forteresse contre les Portugais.",
      "Plusieurs explications existent sur l'origine de sa couleur bleue ; aucune ne fait l'unanimité."
    ],
    sources: [
      "Office national marocain du tourisme",
      "Ministère de la Culture du Maroc"
    ],
    recits: [],
    quiz: [
      { question: "Pour quelle couleur Chefchaouen est-elle célèbre ?", choices: ["Le bleu", "Le rouge", "Le vert"], answer: 0, explanation: "Ses ruelles et maisons sont peintes en bleu." },
      { question: "Dans quelles montagnes se trouve Chefchaouen ?", choices: ["Le Rif", "Le Haut Atlas", "Le Hoggar"], answer: 0, explanation: "La ville est nichée dans les montagnes du Rif." },
      { question: "Qui s'installa à Chefchaouen après la chute de Grenade en 1492 ?", choices: ["Des réfugiés andalous, musulmans et juifs", "Des marins vikings", "Des colons anglais"], answer: 0, explanation: "Ils donnèrent à la ville son architecture andalouse." },
      { question: "Contre qui la ville fut-elle fondée comme forteresse en 1471 ?", choices: ["Les Portugais", "Les Romains", "Les Ottomans"], answer: 0, explanation: "Elle protégeait la région des incursions portugaises." },
      { question: "Avec quoi blanchit-on les façades ?", choices: ["De la chaux", "Du ciment", "Du lait"], answer: 0, explanation: "La chaux, mêlée de pigments bleus, est appliquée régulièrement." }
    ]
  },
  {
    id: 371,
    slug: "place-jemaa-el-fna",
    country: "Maroc",
    cat: "culturel",
    name: "Place Jemaa el-Fna, Marrakech",
    region: "Marrakech-Safi, Marrakech",
    featured: true,
    latitude: 31.6258,
    longitude: -7.9892,
    radius: 300,
    themes: ["musiques-danses", "gastronomie", "langues", "marches"],
    description: "Au cœur de la médina de Marrakech, la place Jemaa el-Fna est un théâtre à ciel ouvert. Conteurs, musiciens gnaoua, charmeurs de serpents, acrobates, herboristes et vendeurs de jus d'orange l'animent le jour ; le soir, des dizaines d'étals de cuisine s'installent dans les fumées des grillades.\n\nEn 2001, l'UNESCO a proclamé « l'espace culturel de la place Jemaa el-Fna » chef-d'œuvre du patrimoine oral et immatériel de l'humanité : l'une des toutes premières reconnaissances de ce type au monde.",
    histoire: "### Une place au pied de la Koutoubia\nMarrakech est fondée au XIe siècle par les Almoravides. La place Jemaa el-Fna se trouve au pied de la mosquée de la Koutoubia, dont le minaret, construit au XIIe siècle, domine la ville.\n\n### Un nom mystérieux\nL'origine du nom est discutée : on le traduit parfois par « l'assemblée des trépassés » ou « la mosquée de l'anéantissement », en référence à d'anciennes exécutions publiques ou à une mosquée inachevée.\n\n### Un patrimoine immatériel\nC'est notamment grâce à l'écrivain Juan Goytisolo, installé à Marrakech, que la place a été défendue contre des projets d'aménagement. Sa proclamation par l'UNESCO en 2001 a contribué à la création même de la notion de patrimoine immatériel.",
    culture: "La place est avant tout un lieu de parole : les conteurs (hlaiqia) y racontent des histoires, des épopées et des contes, entourés d'un cercle d'auditeurs. Leur art, transmis oralement, est aujourd'hui fragile.\n\nLes musiciens gnaoua, héritiers de traditions venues d'Afrique subsaharienne, jouent du guembri (luth) et des qraqeb (castagnettes de métal). La musique gnaoua est inscrite au patrimoine immatériel de l'UNESCO depuis 2019.\n\nLe soir, la place devient le plus grand restaurant en plein air du Maroc : tajines, harira, brochettes, escargots.",
    savoirs: "### L'art du conte\nLes conteurs maîtrisent un vaste répertoire, qu'ils adaptent à leur public.\n\n### La musique gnaoua\nLes maâlem (maîtres) gnaoua transmettent un répertoire musical et rituel lié à des cérémonies de guérison.\n\n### Les herboristes\nLes herboristes de la place proposent plantes, épices et remèdes traditionnels.",
    communities: "Conteurs, musiciens, artisans et commerçants de la place, habitants de Marrakech.",
    langues: "Arabe (darija), amazigh, français",
    personnalites: "Juan Goytisolo (1931-2017), écrivain qui défendit la place.",
    infos_pratiques: "Accès libre, animation du matin jusque tard le soir. Les artistes et les photographies se rémunèrent : se mettre d'accord avant. Éviter les spectacles impliquant des animaux maltraités. Surveiller ses affaires dans la foule.",
    chronologie: [
      ["XIe siècle", "Fondation de Marrakech par les Almoravides."],
      ["XIIe siècle", "Construction du minaret de la Koutoubia."],
      ["2001", "Proclamation par l'UNESCO comme chef-d'œuvre du patrimoine oral et immatériel."],
      ["2019", "La musique gnaoua est inscrite au patrimoine immatériel de l'UNESCO."]
    ],
    a_voir: [
      ["Les cercles des conteurs", "Même sans comprendre, l'ambiance est unique."],
      ["Les musiciens gnaoua", "Guembri et qraqeb."],
      ["Les étals du soir", "La place devient un grand restaurant."],
      ["La Koutoubia", "Son minaret domine la place."]
    ],
    saviez_vous: [
      "La proclamation de la place Jemaa el-Fna en 2001 a contribué à créer la notion de patrimoine culturel immatériel à l'UNESCO.",
      "La musique gnaoua a des racines en Afrique subsaharienne."
    ],
    sources: [
      "UNESCO — Espace culturel de la place Jemaa el-Fna (2001, 2008)",
      "UNESCO — Gnaoua (2019)"
    ],
    recits: [],
    quiz: [
      { question: "Dans quelle ville se trouve la place Jemaa el-Fna ?", choices: ["Marrakech", "Fès", "Rabat"], answer: 0, explanation: "La place est au cœur de la médina de Marrakech." },
      { question: "Quel minaret domine la place ?", choices: ["Celui de la Koutoubia", "Celui de la Qaraouiyine", "Celui de la Tour Hassan"], answer: 0, explanation: "Le minaret de la Koutoubia date du XIIe siècle." },
      { question: "En quelle année l'UNESCO a-t-il proclamé la place chef-d'œuvre du patrimoine oral ?", choices: ["2001", "1981", "2019"], answer: 0, explanation: "La proclamation date de 2001." },
      { question: "Quel instrument jouent les musiciens gnaoua ?", choices: ["Le guembri", "La kora", "Le balafon"], answer: 0, explanation: "Le guembri est un luth à trois cordes." },
      { question: "Quel écrivain a défendu la place contre des projets d'aménagement ?", choices: ["Juan Goytisolo", "Victor Hugo", "Naguib Mahfouz"], answer: 0, explanation: "Juan Goytisolo, installé à Marrakech, a milité pour sa protection." }
    ]
  },
  {
    id: 372,
    slug: "volubilis",
    country: "Maroc",
    cat: "historique",
    name: "Site archéologique de Volubilis",
    region: "Fès-Meknès, Moulay Idriss Zerhoun",
    featured: false,
    latitude: 34.0739,
    longitude: -5.5547,
    radius: 600,
    themes: ["royaumes", "architecture"],
    description: "Au milieu des oliveraies, près de Meknès, les ruines de Volubilis gardent les colonnes, les arcs et les mosaïques d'une grande ville de l'Antiquité. Capitale du royaume de Maurétanie, puis ville romaine, elle fut aussi le lieu où débuta, au VIIIe siècle, la dynastie des Idrissides.\n\nInscrit au patrimoine mondial de l'UNESCO en 1997, le site témoigne de la profondeur de l'histoire de l'Afrique du Nord.",
    histoire: "### Une ville maurétanienne\nVolubilis est occupée dès le IIIe siècle avant notre ère. Elle devient l'une des principales villes du royaume de Maurétanie, un royaume amazigh (berbère) allié de Rome, dont le roi Juba II fut un souverain lettré.\n\n### Une cité romaine\nAu Ier siècle, le royaume est intégré à l'Empire romain. Volubilis devient une ville prospère, grâce notamment à la production d'huile d'olive. On y construit un forum, une basilique, un arc de triomphe et de riches maisons décorées de mosaïques.\n\n### Moulay Idriss\nAprès le départ des Romains, la ville reste habitée. En 788, Idriss Ier, descendant du Prophète réfugié au Maroc, y est accueilli par la tribu amazighe des Awraba et fonde la dynastie des Idrissides. Son tombeau se trouve dans la ville sainte voisine de Moulay Idriss Zerhoun.\n\n### Redécouverte\nLa ville est ensuite abandonnée, puis endommagée par un tremblement de terre au XVIIIe siècle. Les fouilles commencent au début du XXe siècle.",
    culture: "Le site rappelle que l'histoire du Maroc croise celles des peuples amazighs, de Rome, de l'islam et de l'Andalousie. La ville voisine de Moulay Idriss Zerhoun, blottie sur deux collines, est un grand lieu de pèlerinage.\n\nLes mosaïques de Volubilis — Orphée, les travaux d'Hercule, Dionysos — sont parmi les plus belles d'Afrique du Nord et sont restées en place.",
    savoirs: "### L'huile d'olive\nLes pressoirs retrouvés dans la ville montrent l'importance de la production d'huile, toujours au cœur de l'économie de la région.\n\n### L'archéologie\nLes fouilles et les restaurations permettent de comprendre l'urbanisme antique et la vie quotidienne de la ville.",
    communities: "Conservation du site de Volubilis, habitants de Moulay Idriss Zerhoun.",
    langues: "Arabe (darija), amazigh, français",
    personnalites: "Juba II, roi de Maurétanie ; Idriss Ier, fondateur de la dynastie idrisside.",
    infos_pratiques: "Site ouvert tous les jours, droit d'entrée ; centre d'interprétation à l'entrée. Peu d'ombre : venir tôt le matin ou en fin d'après-midi, avec chapeau et eau. Environ 30 km de Meknès.",
    chronologie: [
      ["IIIe siècle av. J.-C.", "Premières occupations de Volubilis."],
      ["Ier siècle", "Intégration de la Maurétanie à l'Empire romain."],
      ["788", "Idriss Ier est accueilli à Volubilis et fonde la dynastie idrisside."],
      ["XVIIIe siècle", "La ville est endommagée par un tremblement de terre."],
      ["1997", "Inscription au patrimoine mondial de l'UNESCO."]
    ],
    a_voir: [
      ["L'arc de triomphe", "Dressé en l'honneur de l'empereur Caracalla."],
      ["Les mosaïques", "Restées en place dans les maisons."],
      ["La basilique et le forum", "Le cœur de la ville antique."],
      ["Moulay Idriss Zerhoun", "La ville sainte voisine."]
    ],
    saviez_vous: [
      "Les mosaïques de Volubilis sont restées à leur place d'origine, dans les maisons.",
      "C'est à Volubilis qu'Idriss Ier a fondé en 788 la première dynastie musulmane du Maroc."
    ],
    sources: [
      "UNESCO — Site archéologique de Volubilis (1997)",
      "Institut national des sciences de l'archéologie et du patrimoine (INSAP)"
    ],
    recits: [],
    quiz: [
      { question: "De quel royaume Volubilis fut-elle une ville importante avant les Romains ?", choices: ["La Maurétanie", "L'Égypte", "Carthage"], answer: 0, explanation: "Volubilis était l'une des grandes villes du royaume de Maurétanie." },
      { question: "Quelle production faisait la richesse de Volubilis ?", choices: ["L'huile d'olive", "Le coton", "Le cacao"], answer: 0, explanation: "De nombreux pressoirs à huile y ont été retrouvés." },
      { question: "Qui fonda la dynastie idrisside à Volubilis en 788 ?", choices: ["Idriss Ier", "Juba II", "Moulay Ismaïl"], answer: 0, explanation: "Idriss Ier y fut accueilli par la tribu des Awraba." },
      { question: "Que peut-on encore voir en place dans les maisons ?", choices: ["Des mosaïques", "Des vitraux", "Des peintures à l'huile"], answer: 0, explanation: "Les mosaïques sont restées à leur emplacement d'origine." },
      { question: "En quelle année Volubilis a-t-il été inscrit au patrimoine mondial ?", choices: ["1997", "1981", "2012"], answer: 0, explanation: "Le site a été inscrit en 1997." }
    ]
  }
];
