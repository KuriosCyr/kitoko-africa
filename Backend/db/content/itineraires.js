// Circuits proposés dans l'application (onglet Itinéraires).
// Les étapes renvoient aux fiches par leur slug, dans l'ordre de visite.

module.exports = [
  {
    slug: "ouidah-route-de-la-memoire",
    title: "Ouidah, sur la Route de la mémoire",
    country: "Bénin",
    icon: "⛓️",
    duration: "1 journée",
    summary: "Du fort portugais à la plage, une journée pour comprendre la place de Ouidah dans l'histoire de la traite atlantique et dans la spiritualité vodun.",
    stops: [
      { slug: "fort-portugais-ouidah", note: "Commencer par le musée pour comprendre le contexte de la traite et l'histoire des Agudas." },
      { slug: "temple-des-pythons-ouidah", note: "À quelques minutes à pied : Dangbé et la basilique qui lui fait face." },
      { slug: "foret-sacree-kpasse", note: "La forêt du roi Kpassè, fondateur de la ville." },
      { slug: "route-des-esclaves-ouidah", note: "Parcourir les 4 km à pied ou à vélo, étape par étape, avec un guide." },
      { slug: "porte-du-non-retour", note: "Fin du parcours sur la plage : un temps de recueillement." }
    ]
  },
  {
    slug: "royaumes-du-sud-benin",
    title: "Royaumes et capitales du Sud-Bénin",
    country: "Bénin",
    icon: "👑",
    duration: "2 à 3 jours",
    summary: "D'Abomey à Porto-Novo, les royaumes qui ont façonné l'histoire du Bénin, jusqu'aux guerrières Agojie honorées à Cotonou.",
    stops: [
      { slug: "palais-royaux-abomey", note: "Prévoir une demi-journée pour le musée et les bas-reliefs." },
      { slug: "monument-amazones-cotonou", note: "Sur la route du retour vers la côte, l'hommage aux Agojie." },
      { slug: "musee-honme-porto-novo", note: "Le palais des rois de Porto-Novo." },
      { slug: "grande-mosquee-porto-novo", note: "L'architecture afro-brésilienne des Agudas, à quelques minutes du palais." }
    ]
  },
  {
    slug: "lacs-et-marches-du-sud-benin",
    title: "Lacs, pirogues et marchés du Sud",
    country: "Bénin",
    icon: "💧",
    duration: "1 à 2 jours",
    summary: "La vie sur l'eau et le commerce : le grand marché de Cotonou, la cité lacustre de Ganvié et les pêcheurs du lac Ahémé.",
    stops: [
      { slug: "marche-dantokpa", note: "Tôt le matin, pour découvrir les produits de la cuisine béninoise." },
      { slug: "ganvie", note: "Embarquer à Abomey-Calavi pour rejoindre la cité sur pilotis." },
      { slug: "lac-aheme-possotome", note: "Une balade en pirogue et la source de Possotomè." }
    ]
  },
  {
    slug: "atacora-nature-et-architecture",
    title: "Atacora : cascades, tata et savane",
    country: "Bénin",
    icon: "🦁",
    duration: "3 à 4 jours",
    summary: "Le nord-ouest du Bénin : les chutes de Kota, l'architecture des Otammari et la faune du parc de la Pendjari.",
    stops: [
      { slug: "chutes-de-kota", note: "Au départ de Natitingou, une baignade au pied des chutes." },
      { slug: "tata-somba-boukoumbe", note: "Visiter une takienta avec l'accord de la famille qui l'habite." },
      { slug: "parc-national-pendjari", note: "Safari encadré, de préférence en saison sèche." }
    ]
  },
  {
    slug: "conakry-memoire-et-vie",
    title: "Conakry, mémoire et vie quotidienne",
    country: "Guinée",
    icon: "🌊",
    duration: "1 à 2 jours",
    summary: "Des collections du Musée national aux tombes des grandes figures de la résistance, puis l'effervescence de Madina et l'escapade vers les îles de Los.",
    stops: [
      { slug: "musee-national-guinee", note: "Les masques baga, dont le D'mba, et les instruments de musique." },
      { slug: "grande-mosquee-mausolee-camayenne", note: "Le mausolée de Samory Touré et d'Alfa Yaya Diallo." },
      { slug: "marche-madina-conakry", note: "Fonio, sauce feuille et produits de toutes les régions." },
      { slug: "iles-de-los", note: "Une journée en bateau pour finir le séjour." }
    ]
  },
  {
    slug: "fouta-djallon-cascades-et-plateaux",
    title: "Fouta-Djallon : cascades et plateaux",
    country: "Guinée",
    icon: "⛰️",
    duration: "4 à 5 jours",
    summary: "Du Voile de la Mariée à Labé, la route des cascades et l'histoire de l'Imamat du Fouta-Djallon.",
    stops: [
      { slug: "voile-de-la-mariee-kindia", note: "Première étape en quittant Conakry." },
      { slug: "timbo", note: "L'ancienne capitale des almamys, au départ de Mamou." },
      { slug: "chutes-de-ditinn", note: "Randonnée depuis Dalaba." },
      { slug: "chutes-de-kinkon", note: "Près de Pita, sur le Kokoulo." },
      { slug: "fouta-djallon", note: "Les villages autour de Labé et la culture peule." }
    ]
  },
  {
    slug: "sur-les-traces-du-manding",
    title: "Sur les traces de l'épopée mandingue",
    country: "Guinée",
    icon: "🥁",
    duration: "3 à 4 jours",
    summary: "La Haute-Guinée, berceau du Niger et terre des griots : du parc du Haut-Niger au balafon sacré de Niagassola.",
    stops: [
      { slug: "parc-national-haut-niger", note: "Le Djoliba à ses débuts, et la forêt de Mafou." },
      { slug: "mosquee-dinguiraye", note: "La mosquée au grand toit de chaume d'El Hadj Oumar Tall." },
      { slug: "sosso-bala-niagassola", note: "Préparer la visite à l'avance avec la famille Kouyaté." }
    ]
  }
];
