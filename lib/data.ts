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
  { label: "Diensten", href: "/aanbod/", isHash: true },
  { label: "Projecten", href: "/our-work/" },
  { label: "Over ons", href: "/over-ons/" },
  { label: "FAQ", href: "/veelgestelde-vragen/" },
];

export const heroMetrics = [
  { value: "16+", label: "jaar ervaring" },
  { value: "2500+", label: "projecten" },
  { value: "24u", label: "offerte" },
];


export interface ProductCategory {
  id: string;
  label: string;
}

export interface Product {
  name: string;
  brand: string;
  price: string | null;
  categoryId: string;
  description: string;
  techSpecs: string[];
  image: string;
  images?: string[];
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



export const productCategories: ProductCategory[] = [
  { id: "airconditioning", label: "Airconditioning" },
  { id: "zonnepanelen", label: "Zonnepanelen" },
  { id: "batterijopslag", label: "Batterijopslag" },
  { id: "warmtepompen", label: "Warmtepompen" },
  { id: "meterkast", label: "Meterkast" },
];

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
  "Hager": "/images/brands/hager.png",
  "Deye": "/images/brands/deye.png",
  "Alberto Sassi": "/images/brands/alberto_sassi.png",
  "Busch-Jaeger": "/images/brands/busch_jaeger.png",
  "Jung": "/images/brands/jung.png",
  "Gira": "/images/brands/gira.png",
  "Schneider Electric": "/images/brands/schneider_electric.png",
  "Weheat": "/images/brands/weheat.png",
  "Remeha": "/images/brands/remeha.png",
  "ABB": "/images/brands/ABB.png",
  "EMAT": "/images/brands/emat.png",
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
    products: [],
  },
  {
    slug: "zonnepanelen",
    title: "Zonnepanelen",
    summary: "Maatwerk solar systemen voor uw dak.",
    image: "/images/services/zonnepanelen.webp",
    popular: true,
    caption: "Hoogwaardige zonnepanelen voor maximale energieopbrengst",
    description: "Zonnepanelen zijn een slimme investering voor uw energierekening. Wij leveren en installeren hoogwaardige panelen met uitgebreide monitoring.",
    products: [],
  },
  {
    slug: "batterijopslag",
    title: "Batterijopslag",
    summary: "Bewaar uw eigen stroom voor de avond.",
    image: "/images/battery_service.jpg",
    popular: false,
    caption: "Slimme energieopslag voor dag en nacht",
    description: "Met een thuisbatterij slaat u de opgewekte zonne-energie op voor later gebruik. Dit maximaliseert uw eigenverbruik en reduceert energiekosten.",
    products: [
      {
        name: "Deye Hybrid Inverter",
        brand: "Deye",
        price: "Prijs op aanvraag",
        categoryId: "batterijopslag",
        description: "Hybride omvormer voor thuisbatterijen.",
        techSpecs: ["Hybride", "IP65", "10 jaar garantie"],
        image: "https://images.unsplash.com/photo-1620770679803-964c922db3c5?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Alberto Sassi Drive",
        brand: "Alberto Sassi",
        price: "Prijs op aanvraag",
        categoryId: "batterijopslag",
        description: "Betrouwbare aandrijving en opslag componenten.",
        techSpecs: ["High performance", "Duurzaam"],
        image: "https://images.unsplash.com/photo-1620770679803-964c922db3c5?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Busch-Jaeger Control",
        brand: "Busch-Jaeger",
        price: "Prijs op aanvraag",
        categoryId: "batterijopslag",
        description: "Smart home integratie en controle.",
        techSpecs: ["Smart Home", "KNX", "Design"],
        image: "https://images.unsplash.com/photo-1620770679803-964c922db3c5?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  {
    slug: "warmtepompen",
    title: "Warmtepompen",
    summary: "Hybride of all-electric, afgestemd op uw woning.",
    image: "/images/bumpp_service.jpg",
    popular: true,
    caption: "Moderne warmtepomp installatie voor optimaal comfort en energiebesparing",
    description: "Een warmtepomp is de basis voor een duurzame en energiezuinige woning. Wij installeren zowel hybride als full-electric warmtepompen, afgestemd op uw specifieke situatie en wensen.",
    products: [],
  },
  {
    slug: "meterkast",
    title: "Meterkast",
    summary: "Vervangen of uitbreiden, met ruimte voor laadpaal.",
    image: "/images/meterkast_service.avif",
    popular: false,
    caption: "Professionele meterkast uitbreiding",
    description: "Wij zorgen voor een veilige en moderne elektrische installatie.",
    products: [
      {
        name: "Jung Schakelmateriaal",
        brand: "Jung",
        price: "Prijs op aanvraag",
        categoryId: "meterkast",
        description: "Hoogwaardig schakelmateriaal.",
        techSpecs: ["Design", "Duurzaam"],
        image: "/images/services/meterkast.webp",
      },
      {
        name: "Gira Systeem",
        brand: "Gira",
        price: "Prijs op aanvraag",
        categoryId: "meterkast",
        description: "Betrouwbare componenten voor de meterkast.",
        techSpecs: ["Smart Home", "Veiligheid"],
        image: "/images/services/meterkast.webp",
      },
      {
        name: "Schneider Electric Componenten",
        brand: "Schneider Electric",
        price: "Prijs op aanvraag",
        categoryId: "meterkast",
        description: "Industriële kwaliteit voor particulieren.",
        techSpecs: ["NEN 1010", "Innovatie"],
        image: "/images/services/meterkast.webp",
      },
      {
        name: "Weheat Integratie",
        brand: "Weheat",
        price: "Prijs op aanvraag",
        categoryId: "meterkast",
        description: "Slimme integratie voor warmtepompen.",
        techSpecs: ["Duurzaam", "Compact"],
        image: "/images/services/meterkast.webp",
      },
      {
        name: "Remeha Regeling",
        brand: "Remeha",
        price: "Prijs op aanvraag",
        categoryId: "meterkast",
        description: "Klimaatregeling componenten.",
        techSpecs: ["Efficiënt", "Betrouwbaar"],
        image: "/images/services/meterkast.webp",
      },
      {
        name: "EMAT Groepenkast",
        brand: "EMAT",
        price: "Vanaf € 550,-",
        categoryId: "meterkast",
        description: "Voordelige en betrouwbare groepenkast.",
        techSpecs: ["1-Fase", "NEN 1010", "KEMA-KEUR"],
        image: "/images/services/meterkast.webp",
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
    description: "Wij renoveren uw woning naar energielabel A++ met een combination van isolatie, verwarming en duurzame energiesystemen.",
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
  { src: "/images/projects/PHOTO-2024-12-03-12-54-01.jpg", label: "Zonnepanelen installatie", location: "Oudewater", category: "Zonne-energie" },
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
  { value: "16+", label: "Vakmensen in dienst" },
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
