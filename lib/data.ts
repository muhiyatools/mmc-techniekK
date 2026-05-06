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
];

export const heroMetrics = [
  { value: "16+", label: "jaar ervaring" },
  { value: "2500+", label: "projecten" },
  { value: "24u", label: "offerte" },
];

export const services = [
  {
    slug: "warmtepompen",
    title: "Warmtepompen",
    summary: "Hybride of all-electric, afgestemd op uw woning.",
    image: "/images/services/warmtepompen.webp",
    popular: true,
    caption: "Moderne warmtepomp installatie voor optimaal comfort en energiebesparing",
    description: "Een warmtepomp is de basis voor een duurzame en energiezuinige woning. Wij installeren zowel hybride als full-electric warmtepompen, afgestemd op uw specifieke situatie en wensen.",
    products: [
      { name: "Nefit Bosch Warmtepomp", price: "€4.500 - €7.500", description: "Hybride systeem" },
      { name: "Daikin Altherma", price: "€5.000 - €8.000", description: "Full-electric" },
      { name: "Viessmann Vitocal", price: "€5.500 - €8.500", description: "All-electric" },
      { name: "Atlantic Explorer", price: "€4.000 - €6.500", description: "Hybride" },
    ]
  },
  {
    slug: "zonnepanelen",
    title: "Zonnepanelen",
    summary: "Hoogrendementspanelen met monitoring.",
    image: "/images/services/zonnepanelen.webp",
    caption: "Hoogwaardige zonnepanelen voor maximale energieopbrengst",
    description: "Zonnepanelen zijn een slimme investering voor uw energierekening. Wij leveren en installeren hoogwaardige panelen met uitgebreide monitoring.",
    products: [
      { name: "Sunpower Maxeon", price: "€3.500 - €6.000", description: "Mono-crystalline" },
      { name: "LG Neon R", price: "€3.000 - €5.500", description: "Premium" },
      { name: "Solarwatt Vision", price: null, description: "Glas-glas" },
      { name: "Growatt Omvormer", price: null, description: "Monitoring" },
    ]
  },
  {
    slug: "airconditioning",
    title: "Airconditioning",
    summary: "Stille systemen voor koelen en verwarmen.",
    image: "/images/services/airco.jpg",
    caption: "Stille en energiezuinige airco voor elk seizoen",
    description: "Moderne airco systemen bieden niet alleen verkoeling in de zomer, maar ook efficiënte verwarming in de winter. Perfect voor een comfortabel binnenklimaat het hele jaar door.",
    products: [
      { name: "Daikin Perfera", price: "€2.500 - €4.500", description: "Wandmodel" },
      { name: "Mitsubishi Heavy", price: "€2.200 - €4.000", description: "Stil" },
      { name: "LG Artcool Gallery", price: "€2.800 - €5.000", description: "Design" },
      { name: "Gree G-Power", price: "€1.800 - €3.500", description: "Budget" },
    ]
  },
  {
    slug: "batterijopslag",
    title: "Batterijopslag",
    summary: "Bewaar uw eigen stroom voor de avond.",
    image: "/images/services/batterijopslag.webp",
    caption: "Slimme energieopslag voor dag en nacht",
    description: "Met een thuisbatterij slaat u de opgewekte zonne-energie op voor later gebruik. Dit maximaliseert uw eigenverbruik en reduceert energiekosten.",
    products: [
      { name: "Tesla Powerwall 3", price: "€8.000 - €10.000", description: "13.5 kWh" },
      { name: "BYD HVS", price: "€5.000 - €8.000", description: "Modulair" },
      { name: "Sonnen Batterie", price: "€6.000 - €9.000", description: "Smart" },
      { name: "FoxESS", price: "€4.500 - €7.000", description: "Hybride" },
    ]
  },
  {
    slug: "vloerverwarming",
    title: "Vloerverwarming",
    summary: "Ingregeld voor lage aanvoertemperatuur.",
    image: "/images/services/vloerverwarming.webp",
    caption: "Comfortabele vloerverwarming met lage temperatuur",
    description: "Vloerverwarming is de meest comfortabele en efficiënte manier van verwarmen. Perfect te combineren met een warmtepomp voor optimaal rendement.",
    products: [
      { name: "Uponor Slimfit", price: null, description: "Noppenplaat" },
      { name: "Raychem T2Blue", price: null, description: "Elektrisch" },
      { name: "Danfoss ECtemp", price: null, description: "Thermostaat" },
      { name: "Warmup", price: null, description: "Folieverwarming" },
    ]
  },
  {
    slug: "meterkast-liften",
    title: "Meterkast & Liften",
    summary: "Vervangen of uitbreiden, met ruimte voor laadpaal.",
    image: "/images/services/meterkast.webp",
    caption: "Professionele meterkast uitbreiding en liften",
    description: "Van een volledige meterkast vernieuwing tot het plaatsen van een traplift. Wij zorgen voor een veilige en moderne elektrische installatie.",
    products: [
      { name: "Groepenkast Vernieuwing", price: "€1.500 - €3.000", description: "Complete" },
      { name: "Laadpaal Aansluiting", price: "€800 - €1.500", description: "32A" },
      { name: "Traplift", price: null, description: "Personenlift" },
      { name: "Keuring NEN3140", price: "€200 - €400", description: "Inspectie" },
    ]
  },
  {
    slug: "onderhoud",
    title: "Onderhoud",
    summary: "Service en onderhoud voor alle installaties.",
    image: "/images/services/warmtepompen.webp",
    caption: "Service en onderhoud voor langdurige prestaties",
    description: "Regelmatig onderhoud verlengt de levensduur van uw installaties en houdt ze optimaal presteren. Wij bieden onderhoudscontracten op maat.",
    products: [
      { name: "Warmtepomp Onderhoud", price: "€150 - €250", description: "Jaarlijks" },
      { name: "CV Ketel Service", price: "€100 - €200", description: "Periodiek" },
      { name: "Airco Reiniging", price: "€120 - €180", description: "Jaarlijks" },
      { name: "Onderhoudscontract", price: null, description: "All-in" },
    ]
  },
  {
    slug: "renovaties",
    title: "Renovaties",
    summary: "Complete woningverduurzaming naar label A++.",
    image: "/images/services/vloerverwarming.webp",
    caption: "Complete woningverduurzaming",
    description: "Wij renoveren uw woning naar energielabel A++ met een combinatie van isolatie, verwarming en duurzame energiesystemen.",
    products: [
      { name: "isolatie", price: "€2.000 - €5.000", description: "Vloer/gevel/dak" },
      { name: "Zonnepanelen Systeem", price: "€4.000 - €8.000", description: "Complete" },
      { name: "Warmtepomp Installatie", price: "€5.000 - €8.000", description: "All-electric" },
      { name: "VENTILATIE", price: "€1.500 - €3.000", description: "Balansventilatie" },
    ]
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
