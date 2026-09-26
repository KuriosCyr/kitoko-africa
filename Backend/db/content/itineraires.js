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
  },
  {
    slug: "cote-des-forts-ghana",
    title: "La côte des forts et des châteaux",
    country: "Ghana",
    icon: "🏰",
    duration: "2 jours",
    summary: "D'Elmina à Cape Coast, les plus anciens forts européens d'Afrique subsaharienne et leurs cachots, avec une respiration dans la forêt de Kakum.",
    stops: [
      { slug: "chateau-elmina", note: "Commencer par le plus ancien : São Jorge da Mina, bâti en 1482. Monter ensuite au fort Saint-Jacques." },
      { slug: "chateau-cape-coast", note: "À 15 km : les cachots, la Porte du Non-Retour et le musée. Prévoir 2 heures." },
      { slug: "parc-national-kakum", note: "Le lendemain matin, tôt : la passerelle de la canopée." }
    ]
  },
  {
    slug: "royaumes-et-independance-ghana",
    title: "Du royaume ashanti à l'indépendance",
    country: "Ghana",
    icon: "👑",
    duration: "3 à 4 jours",
    summary: "D'Accra à Kumasi puis vers le nord : l'indépendance de 1957, l'empire ashanti et ses artisans, jusqu'à la plus ancienne mosquée du pays.",
    stops: [
      { slug: "memorial-kwame-nkrumah", note: "À Accra, là où l'indépendance fut proclamée le 6 mars 1957." },
      { slug: "lac-volta", note: "En option, un détour par Akosombo, grand projet de l'indépendance." },
      { slug: "kumasi-palais-manhyia", note: "Le palais Manhyia, puis les tisserands de kente de Bonwire." },
      { slug: "mosquee-larabanga", note: "Plus au nord, avec une nuit au parc national de Mole." }
    ]
  },
  {
    slug: "sud-togo-lac-et-traditions",
    title: "Sud-Togo : lac, vodun et traditions",
    country: "Togo",
    icon: "🌊",
    duration: "2 jours",
    summary: "De Lomé à Aného, le Togo côtier : son histoire coloniale, le lac qui a donné son nom au pays et les grandes traditions religieuses.",
    stops: [
      { slug: "palais-de-lome", note: "Commencer par l'histoire du pays et les jardins du palais." },
      { slug: "marche-akodessewa", note: "Le marché des féticheurs, avec un guide et beaucoup de respect." },
      { slug: "lac-togo-togoville", note: "La traversée en pirogue depuis Agbodrafo et la Wood Home." },
      { slug: "epe-ekpe-glidji", note: "Jusqu'à Aného et Glidji ; en septembre, la fête Epe-Ekpe." }
    ]
  },
  {
    slug: "togo-montagnes-et-nord",
    title: "Des monts du Togo au Koutammakou",
    country: "Togo",
    icon: "⛰️",
    duration: "4 à 5 jours",
    summary: "De la région verdoyante de Kpalimé jusqu'au pays des Batammariba, dans le nord, en remontant les monts du Togo.",
    stops: [
      { slug: "mont-agou-kpalime", note: "Randonnée au mont Agou et visite des artisans de Kpalimé." },
      { slug: "koutammakou", note: "Plus au nord, les takienta du Koutammakou avec un guide de Nadoba." }
    ]
  },
  {
    slug: "pays-yoruba-nigeria",
    title: "Au cœur du pays yoruba",
    country: "Nigéria",
    icon: "🥁",
    duration: "3 jours",
    summary: "Forêt sacrée, collines refuges et teintures à l'indigo : trois lieux pour comprendre l'histoire et la spiritualité yoruba.",
    stops: [
      { slug: "rocher-olumo-abeokuta", note: "Le rocher refuge des Egba, puis les tissus adire du marché d'Itoku." },
      { slug: "bois-sacre-osun-osogbo", note: "La forêt d'Osun et ses sculptures ; en août, la grande fête." },
      { slug: "collines-idanre", note: "La montée des 600 marches jusqu'à l'ancienne ville." }
    ]
  },
  {
    slug: "memoire-golfe-de-guinee",
    title: "La route de la mémoire du golfe de Guinée",
    country: null,
    icon: "⛓️",
    duration: "5 à 7 jours",
    summary: "De Ouidah à Cape Coast, en traversant le Togo : les grands lieux de mémoire de la traite atlantique sur la « Côte des esclaves » et la « Côte-de-l'Or ».",
    stops: [
      { slug: "porte-du-non-retour", note: "Au Bénin, la fin de la Route des Esclaves de Ouidah." },
      { slug: "lac-togo-togoville", note: "Au Togo, la Wood Home d'Agbodrafo et la traite clandestine du XIXe siècle." },
      { slug: "chateau-elmina", note: "Au Ghana, le plus ancien fort européen d'Afrique subsaharienne." },
      { slug: "chateau-cape-coast", note: "Terminer par les cachots de Cape Coast et un temps de recueillement." }
    ]
  },
  {
    slug: "dakar-goree-lac-rose",
    title: "Dakar, Gorée et le lac Rose",
    country: "Sénégal",
    icon: "⛓️",
    duration: "2 jours",
    summary: "Autour de Dakar : la mémoire de la traite à Gorée, les récolteurs de sel du lac Rose, puis la ville sainte de Touba.",
    stops: [
      { slug: "ile-de-goree", note: "Chaloupe du matin, Maison des Esclaves et promenade dans les ruelles." },
      { slug: "lac-rose", note: "L'après-midi ou le lendemain, quand la couleur rose est la plus visible." },
      { slug: "touba-grand-magal", note: "En option, une journée à Touba, en tenue très correcte." }
    ]
  },
  {
    slug: "nord-senegal-fleuve",
    title: "Le Sénégal du fleuve",
    country: "Sénégal",
    icon: "🌊",
    duration: "2 à 3 jours",
    summary: "Saint-Louis, ancienne capitale de l'AOF, puis les oiseaux du Djoudj ; et, sur la route du retour, les cercles de pierres de Sine Ngayène.",
    stops: [
      { slug: "ile-saint-louis", note: "Le pont Faidherbe, les rues de l'île et Guet Ndar." },
      { slug: "parc-djoudj", note: "De novembre à avril, en pirogue au plus près des pélicans." },
      { slug: "cercles-megalithiques-sine-ngayene", note: "Plus au sud, près de Kaolack : les pierres levées." }
    ]
  },
  {
    slug: "cote-divoire-du-sud",
    title: "De Grand-Bassam à Yamoussoukro",
    country: "Côte d'Ivoire",
    icon: "👑",
    duration: "2 à 3 jours",
    summary: "La première capitale coloniale, la capitale politique et, en pays gouro, la danse du Zaouli.",
    stops: [
      { slug: "grand-bassam", note: "Le quartier historique, le musée du costume et le monument de la marche des femmes." },
      { slug: "basilique-yamoussoukro", note: "La basilique et le lac aux crocodiles." },
      { slug: "danse-zaouli", note: "Plus à l'ouest, si une sortie du Zaouli est annoncée." }
    ]
  },
  {
    slug: "nord-ivoirien-savane",
    title: "Savanes et mosquées du nord ivoirien",
    country: "Côte d'Ivoire",
    icon: "🦁",
    duration: "4 à 5 jours",
    summary: "Les grandes savanes de la Comoé et les mosquées en terre de Kong, sur les anciennes routes du commerce dioula.",
    stops: [
      { slug: "parc-national-comoe", note: "Avec l'Office ivoirien des parcs et réserves, en saison sèche." },
      { slug: "mosquees-soudanaises-kong", note: "La vieille ville de Kong et ses mosquées inscrites à l'UNESCO." }
    ]
  },
  {
    slug: "empires-du-sahel",
    title: "Sur les traces des empires du Sahel",
    country: "Mali",
    icon: "🥁",
    duration: "À découvrir dans l'application",
    summary: "Du Manding de Soundiata aux empires du Mali et songhaï. Tant que la sécurité ne permet pas le voyage, ce circuit se parcourt dans l'application, avec les fiches, les quiz et les tampons en ligne.",
    stops: [
      { slug: "musee-national-mali", note: "À Bamako, une introduction aux civilisations du Mali." },
      { slug: "kamablon-kangaba", note: "Le berceau du Manding et la mémoire de Soundiata." },
      { slug: "grande-mosquee-djenne", note: "Le plus grand édifice en terre crue du monde." },
      { slug: "falaise-bandiagara", note: "Le pays dogon et ses villages accrochés à la falaise." },
      { slug: "tombouctou", note: "La cité des 333 saints et ses manuscrits." },
      { slug: "tombeau-askia-gao", note: "La capitale de l'empire songhaï." }
    ]
  }
];
