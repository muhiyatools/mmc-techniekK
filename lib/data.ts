export const contactInfo = {
  address: "Heemraadsingel 11, 3421 VG Oudewater",
  email: "info@mmctechniek.nl",
  phone: "+31 6 3431 1225",
  phoneDisplay: "06 3431 1225",
  hours: "Maandag t/m vrijdag, 09:00 – 18:00",
  kvk: "95551255",
  btw: "NL867177536B01",
};

export const navItems = [
  { label: "Home", href: "/" },
  { label: "Diensten", href: "/#diensten", isHash: true },
  { label: "Projecten", href: "/our-work/" },
  { label: "FAQ", href: "/veelgestelde-vragen/" },
];

export const heroMetrics = [
  { value: "16+", label: "jaar ervaring" },
  { value: "2500+", label: "projecten" },
  { value: "24u", label: "offerte" },
];

export type PriceTier = "economy" | "medium" | "premium";

export interface Product {
  name: string;
  brand: string;
  price: string | null;
  tier: PriceTier;
  description: string;
  techSpecs: string[];
  image: string;
}

export interface Service {
  slug: string;
  title: string;
  summary: string;
  image: string;
  popular: boolean;
  caption: string;
  description: string;
  products: Product[];
}

export const priceTierLabels: Record<PriceTier, string> = {
  economy: "Economy",
  medium: "Medium",
  premium: "Premium",
};

export const priceTierColors: Record<PriceTier, string> = {
  economy: "bg-green-500",
  medium: "bg-yellow-500",
  premium: "bg-red-500",
};

export const brandImages: Record<string, string> = {
  "LG": "/images/brands/lg.png",
  "Mitsubishi Electric": "/images/brands/mitsubishi_electric.png",
  "Daikin": "/images/brands/daikin.png",
  "Trina Solar": "/images/brands/trina_solar.png",
  "Jinko": "/images/brands/jinko.png",
  "Growatt": "/images/brands/growatt.png",
  "Enphase": "/images/brands/enphase.png",
  "AlphaESS": "/images/brands/alphaess.png",
  "Sigenergy": "/images/brands/sigenergy.png",
  "Nefit Bosch": "",
  "Uponor": "",
  "Hager": "",
};

export const services: Service[] = [
  {
    slug: "airconditioning",
    title: "Airconditioning",
    summary: "Stille systemen voor koelen en verwarmen.",
    image: "/images/services/airco.jpg",
    popular: true,
    caption: "Stille en energiezuinige airco voor elk seizoen",
    description: "Moderne airco systemen bieden niet alleen verkoeling in de zomer, maar ook efficiënte verwarming in de winter. Perfect voor een comfortabel binnenklimaat het hele jaar door.",
    products: [
      {
        name: "LG Artcool Gallery",
        brand: "LG",
        price: "€2.800 - €5.000",
        tier: "premium",
        description: "Design wandmodel met ionisator en WiFi. Ultra-stil met maar 19 dB."
        , techSpecs: [
          "A+++ energielabel",
          "19 dB geluidsniveau",
          "Ionisator luchtzuivering",
          "WiFi bediening",
          "Dual Inverter Compressor",
          "Tot 60% energiebesparing"
        ],
        image: "https://images.unsplash.com/photo-1631545308772-81a0e0a3a6ff?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "LG Prestige",
        brand: "LG",
        price: "€2.200 - €3.800",
        tier: "medium",
        description: "Slim wandmodel met Dual Inverter. Snel koelen en verwarmen.",
        techSpecs: [
          "A++ energielabel",
          "22 dB geluidsniveau",
          "Dual Inverter Compressor",
          "WiFi bediening",
          "Snelkoelfunctie",
          "Slaapmodus"
        ],
        image: "https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Mitsubishi Electric MSZ-AP",
        brand: "Mitsubishi Electric",
        price: "€2.500 - €4.200",
        tier: "medium",
        description: "Betrouwbaar en stil. Geschikt voor alle ruimtes.",
        techSpecs: [
          "A++ energielabel",
          "20 dB geluidsniveau",
          "3D i-See Sensor",
          "Jet Airflow",
          "Snelle installatie",
          "5 jaar garantie"
        ],
        image: "https://images.unsplash.com/photo-1631545308772-81a0e0a3a6ff?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Mitsubishi Electric MSZ-LN",
        brand: "Mitsubishi Electric",
        price: "€3.200 - €5.500",
        tier: "premium",
        description: "Premium design met plasma quad filter en 3D i-See Sensor.",
        techSpecs: [
          "A+++ energielabel",
          "19 dB geluidsniveau",
          "Plasma Quad Filter",
          "3D i-See Sensor",
          "Natural Colour finish",
          "7 jaar garantie"
        ],
        image: "https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Daikin Perfera",
        brand: "Daikin",
        price: "€2.800 - €4.500",
        tier: "medium",
        description: "Stil en energiezuinig met Flash Streamer luchtzuivering.",
        techSpecs: [
          "A++ energielabel",
          "21 dB geluidsniveau",
          "Flash Streamer technologie",
          "3D luchtstroom",
          "Vochtigheidsregeling",
          "Online controller"
        ],
        image: "https://images.unsplash.com/photo-1631545308772-81a0e0a3a6ff?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Daikin Stylish",
        brand: "Daikin",
        price: "€3.500 - €6.000",
        tier: "premium",
        description: "Design wandmodel met Coanda airflow en zilver-ion filter.",
        techSpecs: [
          "A+++ energielabel",
          "19 dB geluidsniveau",
          "Coanda Airflow",
          "Zilver-ion filter",
          "3D luchtstroom",
          "Online controller"
        ],
        image: "https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  {
    slug: "zonnepanelen",
    title: "Zonnepanelen",
    summary: "Hoogrendementspanelen met monitoring.",
    image: "/images/services/zonnepanelen.webp",
    popular: true,
    caption: "Hoogwaardige zonnepanelen voor maximale energieopbrengst",
    description: "Zonnepanelen zijn een slimme investering voor uw energierekening. Wij leveren en installeren hoogwaardige panelen met uitgebreide monitoring.",
    products: [
      {
        name: "Trina Solar Vertex",
        brand: "Trina Solar",
        price: "€4.500 - €7.500",
        tier: "economy",
        description: "Betaalbare mono-crystalline panelen met 21% rendement.",
        techSpecs: [
          "21% rendement",
          "600W vermogen",
          "25 jaar productgarantie",
          "Half-cut cell technologie",
          "PID-bestendig",
          "Tot -0.35%/C temperatuurscoefficient"
        ],
        image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Trina Solar Duomax",
        brand: "Trina Solar",
        price: "€5.500 - €9.000",
        tier: "medium",
        description: "Dubbelglas panelen met 30 jaar garantie en 22% rendement.",
        techSpecs: [
          "22% rendement",
          "650W vermogen",
          "30 jaar productgarantie",
          "Dubbelglas technologie",
          "PID-bestendig",
          "Hagelbestendig tot 35mm"
        ],
        image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Jinko Solar Tiger Neo",
        brand: "Jinko",
        price: "€5.000 - €8.000",
        tier: "economy",
        description: "Betaalbare TOPCon panelen met 22.5% rendement.",
        techSpecs: [
          "22.5% rendement",
          "620W vermogen",
          "25 jaar productgarantie",
          "TOPCon technologie",
          "Half-cut cell",
          "Excellent low-light prestatie"
        ],
        image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Jinko Solar N-Type",
        brand: "Jinko",
        price: "€6.500 - €10.000",
        tier: "medium",
        description: "Premium N-type panelen met 23% rendement en 30 jaar garantie.",
        techSpecs: [
          "23% rendement",
          "670W vermogen",
          "30 jaar productgarantie",
          "N-type TOPCon",
          "Dubbelglas",
          "0.3%/C temperatuurscoefficient"
        ],
        image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Growatt MIC",
        brand: "Growatt",
        price: null,
        tier: "economy",
        description: "Betrouwbare string omvormer met WiFi monitoring.",
        techSpecs: [
          "98.4% max efficiëntie",
          "WiFi monitoring",
          "IP65 bescherming",
          "Dubbele MPPT",
          "5 jaar garantie",
          "Natuurlijke koeling"
        ],
        image: "https://images.unsplash.com/photo-1611365892117-00ac5ef43c90?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Enphase IQ8",
        brand: "Enphase",
        price: null,
        tier: "premium",
        description: "Premium micro-omvormer met per-paneel monitoring en back-up.",
        techSpecs: [
          "97.6% CEC efficiëntie",
          "Per-paneel monitoring",
          "Sunlight back-up",
          "25 jaar garantie",
          "Stroomuitval bescherming",
          "Module-level optimalisatie"
        ],
        image: "https://images.unsplash.com/photo-1611365892117-00ac5ef43c90?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  {
    slug: "batterijopslag",
    title: "Batterijopslag",
    summary: "Bewaar uw eigen stroom voor de avond.",
    image: "/images/services/batterijopslag.webp",
    popular: false,
    caption: "Slimme energieopslag voor dag en nacht",
    description: "Met een thuisbatterij slaat u de opgewekte zonne-energie op voor later gebruik. Dit maximaliseert uw eigenverbruik en reduceert energiekosten.",
    products: [
      {
        name: "AlphaESS Smile",
        brand: "AlphaESS",
        price: "€5.500 - €8.000",
        tier: "economy",
        description: "Betaalbare thuisbatterij met 5.7 kWh capaciteit en modulair uitbreidbaar.",
        techSpecs: [
          "5.7 kWh basiscapaciteit",
          "Modulair tot 34.2 kWh",
          "LFP batterijtechnologie",
          "6000+ cycli",
          "10 jaar garantie",
          "IP65 bescherming"
        ],
        image: "https://images.unsplash.com/photo-1620770679803-964c922db3c5?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "AlphaESS Storion",
        brand: "AlphaESS",
        price: "€8.000 - €12.000",
        tier: "medium",
        description: "High-end thuisbatterij met 13.3 kWh en zonnepaneel integratie.",
        techSpecs: [
          "13.3 kWh capaciteit",
          "LFP batterijtechnologie",
          "8000+ cycli",
          "Hybride omvormer",
          "10 jaar garantie",
          "Slimme energiemanagement"
        ],
        image: "https://images.unsplash.com/photo-1620770679803-964c922db3c5?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Sigenergy SigenStor",
        brand: "Sigenergy",
        price: "€7.000 - €10.000",
        tier: "premium",
        description: "Premium batterij met AI-optimalisatie en EV-laden integratie.",
        techSpecs: [
          "5-48 kWh configuratie",
          "LFP batterijtechnologie",
          "AI energieoptimalisatie",
          "EV-laden integratie",
          "15 jaar garantie",
          "97% round-trip efficiëntie"
        ],
        image: "https://images.unsplash.com/photo-1620770679803-964c922db3c5?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  {
    slug: "warmtepompen",
    title: "Warmtepompen",
    summary: "Hybride of all-electric, afgestemd op uw woning.",
    image: "/images/services/warmtepompen.webp",
    popular: true,
    caption: "Moderne warmtepomp installatie voor optimaal comfort en energiebesparing",
    description: "Een warmtepomp is de basis voor een duurzame en energiezuinige woning. Wij installeren zowel hybride als full-electric warmtepompen, afgestemd op uw specifieke situatie en wensen.",
    products: [
      {
        name: "Nefit Bosch Compress 7000i",
        brand: "Nefit Bosch",
        price: "€4.500 - €7.500",
        tier: "economy",
        description: "Hybride warmtepomp met hoog rendement voor woningen met bestaande cv.",
        techSpecs: [
          "A+ energielabel",
          "COP tot 4.5",
          "Lucht/water technologie",
          "Ingebouwde boiler",
          "Modulerend vermogen",
          "Stil: 48 dB"
        ],
        image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Daikin Altherma 3",
        brand: "Daikin",
        price: "€8.000 - €12.000",
        tier: "premium",
        description: "Full-electric warmtepomp met geïntegreerde boiler en vloerverwarming.",
        techSpecs: [
          "A+++ energielabel",
          "COP tot 5.0",
          "Lucht/water",
          "230L geïntegreerde boiler",
          "Smart grid ready",
          "Stil: 42 dB"
        ],
        image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  {
    slug: "vloerverwarming",
    title: "Vloerverwarming",
    summary: "Ingregeld voor lage aanvoertemperatuur.",
    image: "/images/services/vloerverwarming.webp",
    popular: false,
    caption: "Comfortabele vloerverwarming met lage temperatuur",
    description: "Vloerverwarming is de meest comfortabele en efficiënte manier van verwarmen. Perfect te combineren met een warmtepomp voor optimaal rendement.",
    products: [
      {
        name: "Uponor Tacker",
        brand: "Uponor",
        price: null,
        tier: "medium",
        description: "Professioneel vloerverwarmingssysteem met noppenplaat en PE-RT leiding.",
        techSpecs: [
          "PE-RT leidingen",
          "Noppenplaat isolatie",
          "Lage aanvoertemperatuur",
          "50 jaar levensduur",
          "Verdeelunit inbegrepen",
          "Geschikt voor alle vloeren"
        ],
        image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  {
    slug: "meterkast-liften",
    title: "Meterkast & Liften",
    summary: "Vervangen of uitbreiden, met ruimte voor laadpaal.",
    image: "/images/services/meterkast.webp",
    popular: false,
    caption: "Professionele meterkast uitbreiding en liften",
    description: "Van een volledige meterkast vernieuwing tot het plaatsen van een traplift. Wij zorgen voor een veilige en moderne elektrische installatie.",
    products: [
      {
        name: "Hager groepenkast",
        brand: "Hager",
        price: "€1.500 - €3.000",
        tier: "medium",
        description: "Complete groepenkast vervanging met ruimte voor laadpaal en zonnepanelen.",
        techSpecs: [
          "3-fase aansluiting",
          "Ruimte voor 12 groepen",
          "Aardlekautomaten",
          "Overspanningsbeveiliging",
          "Keuringscertificaat",
          "5 jaar garantie"
        ],
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  {
    slug: "onderhoud",
    title: "Onderhoud",
    summary: "Service en onderhoud voor alle installaties.",
    image: "/images/services/warmtepompen.webp",
    popular: false,
    caption: "Service en onderhoud voor langdurige prestaties",
    description: "Regelmatig onderhoud verlengt de levensduur van uw installaties en houdt ze optimaal presteren. Wij bieden onderhoudscontracten op maat.",
    products: [],
  },
  {
    slug: "renovaties",
    title: "Renovaties",
    summary: "Complete woningverduurzaming naar label A++.",
    image: "/images/services/vloerverwarming.webp",
    popular: false,
    caption: "Complete woningverduurzaming",
    description: "Wij renoveren uw woning naar energielabel A++ met een combinatie van isolatie, verwarming en duurzame energiesystemen.",
    products: [],
  },
];

export const processSteps = [
  {
    step: "01",
    title: "Bezoek en advies",
    description: "We komen langs, meten op en stellen uw situatie vast.",
  },
  {
    step: "02",
    title: "Offerte binnen 24 uur",
    description: "Een heldere prijsopbouw zonder verborgen posten.",
  },
  {
    step: "03",
    title: "Installatie",
    description: "Onze monteurs werken volgens NEN 1010 en VCA.",
  },
  {
    step: "04",
    title: "Oplevering en nazorg",
    description: "Alle documentatie. Daarna blijven wij bereikbaar.",
  },
];

export const whyChooseUs = [
  {
    title: "16+ jaar ervaring",
    description: "Sinds 2008 actief vanuit Oudewater. Dezelfde betrokkenheid, jaar na jaar.",
  },
  {
    title: "Eigen vakmensen",
    description: "Een vast team van gecertificeerde monteurs. Kwaliteit in eigen hand.",
  },
  {
    title: "Service na oplevering",
    description: "Een installatie is een relatie van jaren. Wij staan paraat.",
  },
];

export const testimonials = [
  {
    name: "Sabina Zondag",
    role: "Particulier, Oudewater",
    text: "Heel goed geholpen, enorm blij met het oplossen van een lastige klus. Professioneel en netjes opgeleverd.",
    stars: 5,
  },
  {
    name: "Ben Ryan",
    role: "Particulier, Woerden",
    text: "MMC zijn de enige elektriciens die we vertrouwen. Vriendelijk, vakkundig en altijd een eerlijke prijs.",
    stars: 5,
  },
  {
    name: "D. Jansen",
    role: "Particulier, Utrecht",
    text: "Betrouwbaar en goed. Afspraken nagekomen, werk netjes opgeleverd. Dankjewel.",
    stars: 5,
  },
  {
    name: "Sophie de Jager",
    role: "Particulier, Bodegraven",
    text: "Snel ingepland, snel opgelost. Blij met het resultaat en met het gemak waarmee het ging.",
    stars: 5,
  },
];

export const clientLogos = [
  { name: "Aldi", src: "/images/partners/aldi.png" },
  { name: "AFAS Software", src: "/images/partners/afas.png" },
  { name: "Pets Place", src: "/images/partners/pets-place.png" },
  { name: "Homij", src: "/images/partners/homij.png" },
  { name: "SSH", src: "/images/partners/ssh.png" },
  { name: "Partner", src: "/images/partners/partner-1.png" },
  { name: "Partner", src: "/images/partners/partner-2.png" },
  { name: "Partner", src: "/images/partners/partner-3.png" },
];

export const projectImages = [
  { src: "/images/projects/PHOTO-2024-12-03-12-54-01.jpg", label: "Warmtepomp installatie", location: "Oudewater", category: "Verwarming" },
  { src: "/images/projects/PHOTO-2024-12-08-15-05-58.jpg", label: "Elektrische installatie", location: "Woerden", category: "Elektra" },
  { src: "/images/projects/20240920_112524-scaled.jpg", label: "Technisch onderhoud", location: "Oudewater", category: "Onderhoud" },
  { src: "/images/projects/PHOTO-2024-12-08-15-05-59.jpg", label: "Renovatieproject", location: "Utrecht", category: "Renovatie" },
  { src: "/images/projects/PHOTO-2024-12-08-15-12-08.jpg", label: "Nieuwbouwproject", location: "Bodegraven", category: "Nieuwbouw" },
  { src: "/images/projects/PHOTO-2024-12-03-12-54-08.jpg", label: "Service en onderhoud", location: "Oudewater", category: "Service" },
  { src: "/images/projects/PHOTO-2024-12-03-12-54-02_1.jpg", label: "Zonnepanelen", location: "Woerden", category: "Zonne-energie" },
  { src: "/images/projects/20240920_120951-scaled.jpg", label: "Meterkast upgrade", location: "Oudewater", category: "Elektra" },
  { src: "/images/projects/PHOTO-2024-12-08-15-06-00.jpg", label: "Airconditioning", location: "Bodegraven", category: "Airco" },
];

export const certifications = [
  { name: "NEN-3140", src: "/images/certifications/nen-3140.png", description: "Veilig werken aan elektrische installaties" },
  { name: "VCA", src: "/images/certifications/vca.png", description: "Veiligheid, gezondheid en milieu" },
];

export const companyStats = [
  { value: "16+", label: "Jaar ervaring" },
  { value: "2500+", label: "Projecten opgeleverd" },
  { value: "8", label: "Vakmensen in dienst" },
  { value: "100%", label: "Eigen personeel" },
];

export const faqItems = [
  {
    question: "Wat kost een warmtepomp?",
    answer: "De kosten van een warmtepomp variëren tussen €4.500 en €8.500, afhankelijk van het type (hybride of all-electric) en uw specifieke situatie. Wij maken graag een vrijblijvende offerte op maat.",
  },
  {
    question: "Hoe snel kan ik een offerte verwachten?",
    answer: "Na een eerste gesprek en eventueel een bezoek ter plaatse ontvangt u binnen 24 uur een heldere, gedetailleerde offerte zonder verborgen kosten.",
  },
  {
    question: "Werken jullie ook buiten Oudewater?",
    answer: "Ja, wij zijn actief in de hele regio Utrecht, Woerden, Bodegraven en omgeving. Neem contact op om te bespreken of uw locatie binnen ons werkgebied valt.",
  },
  {
    question: "Kan ik subsidie krijgen voor een warmtepomp of zonnepanelen?",
    answer: "In veel gevallen komt u in aanmerking voor ISDE-subsidie of lokale duurzaamheidsregelingen. Wij adviseren u hier graag over tijdens het intakegesprek.",
  },
  {
    question: "Bieden jullie ook onderhoud aan na installatie?",
    answer: "Absoluut. Wij bieden verschillende onderhoudscontracten aan zodat uw installaties jarenlang optimaal blijven presteren. Service na oplevering is voor ons vanzelfsprekend.",
  },
  {
    question: "Wat is het verschil tussen hybride en all-electric?",
    answer: "Een hybride warmtepomp werkt samen met uw bestaande cv-ketel en is ideaal voor woningen die nog niet volledig geïsoleerd zijn. Een all-electric systeem vervangt de ketel volledig en is geschikt voor goed geïsoleerde woningen.",
  },
  {
    question: "Hoe lang duurt een installatie?",
    answer: "De installatietijd varieert per dienst. Een airconditioning is doorgaans binnen één dag geplaatst. Een warmtepomp of complete zonnepaneleninstallatie neemt één tot twee dagen in beslag. Wij bespreken de planning vooraf zodat u precies weet waar u aan toe bent.",
  },
  {
    question: "Welke garantie bieden jullie op installaties?",
    answer: "Wij bieden fabrieksgarantie op alle producten, aangevuld met onze eigen installatiegarantie. Afhankelijk van het product geldt twee tot vijftien jaar garantie. Bij storingen staan wij klaar voor snel herstel.",
  },
  {
    question: "Zijn er bouwvergunningen nodig voor zonnepanelen of een warmtepomp?",
    answer: "In de meeste gevallen is geen bouwvergunning nodig. Zonnepanelen op een schuin dak zijn vergunningsvrij. Voor zonnepanelen op een plat dak of bij monumenten kan een melding of vergunning vereist zijn. Wij informeren u hierover tijdens het intakegesprek.",
  },
  {
    question: "Werken jullie ook tijdens de weekenden?",
    answer: "In overleg is werken op zaterdag mogelijk. Voor spoedgevallen zijn wij zeven dagen per week bereikbaar via 06 3431 1225. Reguliere installaties worden bij voorkeur op werkdagen ingepland.",
  },
  {
    question: "Is mijn dak geschikt voor zonnepanelen?",
    answer: "De meeste daken zijn geschikt voor zonnepanelen. Wij beoordelen de draagkracht, oriëntatie en schaduwval van uw dak tijdens een gratis adviesbezoek. Zowel schuin als plat dak komen in aanmerking.",
  },
  {
    question: "Hoe werkt een thuisbatterij precies?",
    answer: "Een thuisbatterij slaat de door uw zonnepanelen opgewekte energie op voor gebruik in de avond of nacht. Zo benut u meer van uw eigen zonne-energie en bent u minder afhankelijk van het net. Moderne batterijen zijn koppelbaar aan uw slimme meter voor automatische sturing.",
  },
  {
    question: "Welke subsidies zijn beschikbaar in 2025?",
    answer: "De ISDE-subsidie is beschikbaar voor warmtepompen. Daarnaast zijn er gemeentelijke regelingen en gunstige btw-tarieven voor zonnepanelen. Wij adviseren u over de actuele mogelijkheden tijdens het eerste gesprek.",
  },
  {
    question: "Hoe onderhoud ik mijn airconditioning?",
    answer: "Wij adviseren een jaarlijkse onderhoudsbeurt: schoonmaken van filters, controleren van het koelmiddel en doorlichten van alle onderdelen. Dit verlengt de levensduur aanzienlijk en houdt de efficiëntie op peil. U kunt hiervoor een onderhoudscontract afsluiten.",
  },
  {
    question: "Zijn jullie ook voor noodgevallen beschikbaar?",
    answer: "Ja. Bij storingen aan door ons geïnstalleerde systemen reageren wij zo snel mogelijk, ook buiten kantooruren. Bel 06 3431 1225 voor directe hulp.",
  },
  {
    question: "Kunnen jullie ook voor bedrijven werken?",
    answer: "Absoluut. Naast particuliere woningen voeren wij ook installaties uit voor bedrijfspanden, kantoren en utiliteitsgebouwen. Neem contact op voor een commercieel adviesgesprek op maat.",
  },
  {
    question: "Wat kost een zonnepanelen installatie gemiddeld?",
    answer: "Een complete installatie van zes tot tien panelen kost gemiddeld tussen de €4.500 en €9.000 inclusief montage en omvormer. De terugverdientijd ligt doorgaans tussen vijf en acht jaar. Wij maken altijd een offerte op maat op basis van uw situatie en energieverbruik.",
  },
  {
    question: "Kunnen jullie vloerverwarming combineren met een warmtepomp?",
    answer: "Ja, dit is zelfs de ideale combinatie. Vloerverwarming werkt het best op lage aanvoertemperaturen, precies waar een warmtepomp optimaal op presteert. Wij ontwerpen de installatie als geheel voor maximale efficiëntie en comfort.",
  },
];
