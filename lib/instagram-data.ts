export interface InstagramComment {
  username: string;
  text: {
    nl: string;
    en: string;
  };
  time: {
    nl: string;
    en: string;
  };
  likes?: number;
}

export interface InstagramPost {
  id: string;
  src: string;
  type: "image" | "video" | "carousel";
  carouselImages?: string[];
  caption: {
    nl: string;
    en: string;
  };
  location: string;
  category: "zonnepanelen" | "airco" | "warmtepompen" | "meterkast" | "overig";
  likesCount: number;
  commentsCount: number;
  comments: InstagramComment[];
  date: {
    nl: string;
    en: string;
  };
  link: string;
}

export const instagramProfile = {
  username: "mmctechniek",
  fullName: "MMC Techniek B.V.",
  bio: {
    nl: "☀️ Uw duurzame installateur in Oudewater & regio Utrecht\n🔧 Zonnepanelen | Airco | Warmtepompen | Meterkasten\n💼 16+ jaar ervaring met eigen vakmensen\n📩 Vraag direct een gratis offerte aan via onze link 👇",
    en: "☀️ Your sustainable installer in Oudewater & Utrecht region\n🔧 Solar Panels | Air Conditioning | Heat Pumps | Fuse Boxes\n💼 16+ years experience with our own professionals\n📩 Request a free quote directly via our link 👇"
  },
  website: "www.mmctechniek.nl",
  websiteUrl: "https://mmctechniek.nl",
  postsCount: 12,
  followersCount: 1420,
  followingCount: 208,
  avatarSrc: "/images/logo.png",
  isVerified: true
};

export const instagramPosts: InstagramPost[] = [
  {
    id: "post_1",
    src: "/images/projects/PHOTO-2024-12-03-12-54-01.jpg",
    type: "carousel",
    carouselImages: [
      "/images/projects/PHOTO-2024-12-03-12-54-01.jpg",
      "/images/projects/PHOTO-2024-12-03-12-54-02_1.jpg",
      "/images/projects/PHOTO-2024-12-03-12-54-08.jpg"
    ],
    category: "zonnepanelen",
    location: "Oudewater",
    likesCount: 148,
    commentsCount: 4,
    date: {
      nl: "3 dagen geleden",
      en: "3 days ago"
    },
    link: "https://www.instagram.com/mmctechniek/",
    caption: {
      nl: "Weer een prachtig solar-project opgeleverd in Oudewater! ☀️ Dit schuine dak is optimaal benut met hoogrendement zonnepanelen voor maximale stroomopbrengst. De klant is helemaal klaar voor de zomer! Wat vindt u van het resultaat? 👇\n\n#zonnepanelen #duurzaam #oudewater #mmctechniek #solar #groenestroom #energietransitie",
      en: "Another beautiful solar project completed in Oudewater! ☀️ This sloped roof is optimized with high-efficiency solar panels for maximum power output. The client is completely ready for summer! What do you think of the result? 👇\n\n#solarpanels #sustainability #oudewater #mmctechniek #solar #greenenergy #energytransition"
    },
    comments: [
      {
        username: "sandervandijk",
        text: {
          nl: "Ziet er super strak uit jongens! 👌 Hoeveel panelen liggen hier nu in totaal?",
          en: "Looks very neat guys! 👌 How many panels are installed here in total?"
        },
        time: { nl: "3d", en: "3d" },
        likes: 5
      },
      {
        username: "mmctechniek",
        text: {
          nl: "@sandervandijk Dankjewel Sander! Hier liggen 14 panelen met een totaalvermogen van 5800 Wp. Genoeg voor een gemiddeld huishouden! ⚡",
          en: "@sandervandijk Thank you Sander! There are 14 panels here with a total capacity of 5800 Wp. Enough for an average household! ⚡"
        },
        time: { nl: "3d", en: "3d" },
        likes: 3
      },
      {
        username: "j.de_jong",
        text: {
          nl: "Top werk geleverd bij ons buurman! Komen jullie binnenkort ook bij ons kijken?",
          en: "Top work delivered at our neighbor's! Are you coming to look at our place soon?"
        },
        time: { nl: "2d", en: "2d" },
        likes: 1
      },
      {
        username: "mmctechniek",
        text: {
          nl: "@j.de_jong Zeker weten! We sturen u direct een berichtje om een vrijblijvend adviesgesprek in te plannen. 🗓️",
          en: "@j.de_jong Absolutely! We will send you a message directly to schedule a free consultation. 🗓️"
        },
        time: { nl: "2d", en: "2d" },
        likes: 2
      }
    ]
  },
  {
    id: "post_2",
    src: "/images/projects/PHOTO-2024-12-03-12-54-06_1.jpg",
    type: "carousel",
    carouselImages: [
      "/images/projects/PHOTO-2024-12-03-12-54-06_1.jpg",
      "/images/projects/PHOTO-2024-12-03-12-54-06_2.jpg",
      "/images/projects/PHOTO-2024-12-08-15-06-00.jpg"
    ],
    category: "airco",
    location: "Woerden",
    likesCount: 92,
    commentsCount: 2,
    date: {
      nl: "1 week geleden",
      en: "1 week ago"
    },
    link: "https://www.instagram.com/mmctechniek/",
    caption: {
      nl: "Zowel koelen in de zomer als efficiënt verwarmen in de winter! ❄️🔥 Vandaag installeerden we deze fluisterstille split-unit airco in Woerden. Met de nieuwste A+++ technologie houdt de klant het klimaat binnen perfect onder controle met minimaal stroomverbruik.\n\n#airco #klimaatbeheersing #woerden #mmctechniek #verwarmen #koelen #comfort",
      en: "Both cooling in summer and efficient heating in winter! ❄️🔥 Today we installed this whisper-quiet split-unit air conditioner in Woerden. With the latest A+++ technology, the client keeps the indoor climate perfectly under control with minimal power consumption.\n\n#airconditioning #climatecontrol #woerden #mmctechniek #heating #cooling #comfort"
    },
    comments: [
      {
        username: "marjolein_h",
        text: {
          nl: "Is deze unit ook geschikt voor de slaapkamer qua geluid?",
          en: "Is this unit also suitable for the bedroom in terms of noise?"
        },
        time: { nl: "1w", en: "1w" },
        likes: 2
      },
      {
        username: "mmctechniek",
        text: {
          nl: "@marjolein_h Absoluut! In de 'silent mode' produceert deze binnenunit slechts 19 dB(A) geluid. Dat is stiller dan ritselende bladeren, ideaal voor een goede nachtrust! 😴",
          en: "@marjolein_h Absolutely! In 'silent mode' this indoor unit produces only 19 dB(A) of noise. That's quieter than rustling leaves, ideal for a good night's sleep! 😴"
        },
        time: { nl: "1w", en: "1w" },
        likes: 4
      }
    ]
  },
  {
    id: "post_3",
    src: "/images/projects/20240920_120951-scaled.jpg",
    type: "carousel",
    carouselImages: [
      "/images/projects/20240920_120951-scaled.jpg",
      "/images/projects/20240920_121002-scaled.jpg"
    ],
    category: "meterkast",
    location: "Utrecht",
    likesCount: 114,
    commentsCount: 3,
    date: {
      nl: "2 weken geleden",
      en: "2 weeks ago"
    },
    link: "https://www.instagram.com/mmctechniek/",
    caption: {
      nl: "Veiligheid boven alles! ⚡ Voor deze woning in Utrecht hebben we de meterkast volledig vernieuwd en uitgebreid met extra groepen voor een toekomstige warmtepomp en laadpaal. Alles netjes gecabeld en gelabeld volgens de NEN 1010 normen. Is uw meterkast al klaar voor de toekomst?\n\n#meterkast #elektra #veiligheid #utrecht #mmctechniek #nen1010 #groepenkast #elektricien",
      en: "Safety first! ⚡ For this house in Utrecht, we completely renewed and expanded the fuse box with additional groups for a future heat pump and charging station. Everything neatly cabled and labeled according to NEN 1010 standards. Is your fuse box ready for the future?\n\n#fusebox #electricity #safety #utrecht #mmctechniek #nen1010 #distributionboard #electrician"
    },
    comments: [
      {
        username: "peter_elektra",
        text: {
          nl: "Kabelmanagement van hoog niveau, complimenten! Clean work 🛠️",
          en: "High-level cable management, compliments! Clean work 🛠️"
        },
        time: { nl: "2w", en: "2w" },
        likes: 6
      },
      {
        username: "mmctechniek",
        text: {
          nl: "@peter_elektra Bedankt Peter! Kwaliteit zit in de details en we houden van een opgeruimd resultaat. 👍",
          en: "@peter_elektra Thanks Peter! Quality is in the details and we love a tidy result. 👍"
        },
        time: { nl: "2w", en: "2w" },
        likes: 3
      },
      {
        username: "lisavdmeer",
        text: {
          nl: "Wat kost zo'n meterkast upgrade ongeveer? Onze meterkast komt nog uit de jaren 80.",
          en: "How much does a fuse box upgrade like this cost? Ours is still from the 80s."
        },
        time: { nl: "2w", en: "2w" },
        likes: 1
      }
    ]
  },
  {
    id: "post_4",
    src: "/images/projects/PHOTO-2024-12-03-12-54-07_2.jpg",
    type: "image",
    category: "warmtepompen",
    location: "Bodegraven",
    likesCount: 125,
    commentsCount: 2,
    date: {
      nl: "3 weken geleden",
      en: "3 weeks ago"
    },
    link: "https://www.instagram.com/mmctechniek/",
    caption: {
      nl: "Van het gas af! 🏡🔥 In Bodegraven installeerden we deze prachtige hybride warmtepomp. Door de slimme samenwerking met de bestaande cv-ketel bespaart de klant direct tot wel 70% op het gasverbruik. Een rendabele en duurzame stap! \n\n#warmtepomp #hybride #verduurzamen #bodegraven #mmctechniek #gasloos #energiebesparing",
      en: "No more gas! 🏡🔥 In Bodegraven we installed this beautiful hybrid heat pump. Thanks to the smart integration with the existing boiler, the client saves up to 70% on gas consumption immediately. A profitable and sustainable step!\n\n#heatpump #hybrid #sustainability #bodegraven #mmctechniek #gasfree #energysaving"
    },
    comments: [
      {
        username: "k.de_bruijn",
        text: {
          nl: "Mooi weggewerkt bij de achtergevel! Maakt de buitenunit veel lawaai?",
          en: "Nicely concealed near the back wall! Does the outdoor unit make a lot of noise?"
        },
        time: { nl: "3w", en: "3w" },
        likes: 3
      },
      {
        username: "mmctechniek",
        text: {
          nl: "@k.de_bruijn Valt reuze mee! Deze moderne unit heeft een speciale nachtmodus waardoor hij fluisterstil draait. De buren zullen er niks van merken! 😉",
          en: "@k.de_bruijn Not at all! This modern unit has a special night mode which makes it run whisper-quiet. The neighbors won't notice a thing! 😉"
        },
        time: { nl: "3w", en: "3w" },
        likes: 5
      }
    ]
  },
  {
    id: "post_5",
    src: "/images/projects/DSC_0004-scaled.jpg",
    type: "image",
    category: "overig",
    location: "Oudewater",
    likesCount: 184,
    commentsCount: 2,
    date: {
      nl: "1 maand geleden",
      en: "1 month ago"
    },
    link: "https://www.instagram.com/mmctechniek/",
    caption: {
      nl: "Ontmoet het team achter MMC Techniek! 👥 Trots op onze vakmensen die elke dag met veel passie en precisie op pad gaan om woningen te verduurzamen. Samen bouwen we aan een groenere toekomst! 🌍\n\n#team #vakmanschap #oudewater #installateurs #mmctechniek #duurzaamheid #collega_s",
      en: "Meet the team behind MMC Techniek! 👥 Proud of our professionals who head out every day with passion and precision to make homes more sustainable. Together, we are building a greener future! 🌍\n\n#team #craftsmanship #oudewater #installers #mmctechniek #sustainability #colleagues"
    },
    comments: [
      {
        username: "ruud_v_r",
        text: {
          nl: "Kanjers zijn het! Stuk voor stuk vakmannen die hard werken en gezellig zijn.",
          en: "Legends! Every single one is a hard-working and friendly professional."
        },
        time: { nl: "4w", en: "4w" },
        likes: 8
      },
      {
        username: "lisa.m",
        text: {
          nl: "Leuke foto! Altijd fijn om bekende gezichten over de vloer te krijgen.",
          en: "Nice picture! Always good to have familiar faces over to do the work."
        },
        time: { nl: "4w", en: "4w" },
        likes: 4
      }
    ]
  },
  {
    id: "post_6",
    src: "/images/projects/IMG-20240930-WA0010.jpg",
    type: "image",
    category: "zonnepanelen",
    location: "Montfoort",
    likesCount: 76,
    commentsCount: 1,
    date: {
      nl: "1 maand geleden",
      en: "1 month ago"
    },
    link: "https://www.instagram.com/mmctechniek/",
    caption: {
      nl: "Weer een dak voorzien van een prachtig zonnestroomsysteem! ☀️ Geen schaduw te bekennen op dit mooie platte dak in Montfoort. Met de oost-west opstelling haalt deze klant gedurende de hele dag optimaal vermogen binnen.\n\n#zonnepanelen #groenestroom #platdak #montfoort #mmctechniek #duurzameenergie #solar",
      en: "Another roof equipped with a beautiful solar power system! ☀️ Not a shadow in sight on this nice flat roof in Montfoort. With the east-west orientation, this client harvests optimal energy throughout the day.\n\n#solarpanels #greenenergy #flatroof #montfoort #mmctechniek #sustainableenergy #solar"
    },
    comments: [
      {
        username: "gertjan_solar",
        text: {
          nl: "Netjes gelegd, perfect uitgelijnd! 👍",
          en: "Nicely laid out, perfectly aligned! 👍"
        },
        time: { nl: "4w", en: "4w" },
        likes: 2
      }
    ]
  },
  {
    id: "post_7",
    src: "/images/projects/20240920_112524-scaled.jpg",
    type: "carousel",
    carouselImages: [
      "/images/projects/20240920_112524-scaled.jpg",
      "/images/projects/20240923_175045-scaled.jpg"
    ],
    category: "warmtepompen",
    location: "Oudewater",
    likesCount: 89,
    commentsCount: 2,
    date: {
      nl: "1 maand geleden",
      en: "1 month ago"
    },
    link: "https://www.instagram.com/mmctechniek/",
    caption: {
      nl: "De binnenkant van een duurzame installatie! 🔧 Met passie voor detail leggen we al het leidingwerk strak en geïsoleerd aan. Dit vormt de ruggengraat van de warmtepompinstallatie voor maximaal rendement. Technische perfectie is onze standaard!\n\n#warmtepomp #installatietechniek #techniek #oudewater #mmctechniek #vakwerk #duurzaamwonen",
      en: "The inside of a sustainable installation! 🔧 With a passion for detail, we install all piping neatly and insulated. This forms the backbone of the heat pump system for maximum efficiency. Technical perfection is our standard!\n\n#heatpump #installations #technology #oudewater #mmctechniek #craftsmanship #greenliving"
    },
    comments: [
      {
        username: "installateur_nl",
        text: {
          nl: "Koperwerk om trots op te zijn. Erg netjes gedaan!",
          en: "Copper work to be proud of. Very nicely done!"
        },
        time: { nl: "5w", en: "5w" },
        likes: 5
      },
      {
        username: "mmctechniek",
        text: {
          nl: "@installateur_nl Bedankt! We besteden veel aandacht aan de afwerking, dat loont op de lange termijn.",
          en: "@installateur_nl Thank you! We pay a lot of attention to the finishing, which pays off in the long run."
        },
        time: { nl: "5w", en: "5w" },
        likes: 2
      }
    ]
  },
  {
    id: "post_8",
    src: "/images/projects/PHOTO-2024-12-03-12-54-04_2.jpg",
    type: "carousel",
    carouselImages: [
      "/images/projects/PHOTO-2024-12-03-12-54-04_2.jpg",
      "/images/projects/PHOTO-2024-12-03-12-54-04_3.jpg",
      "/images/projects/PHOTO-2024-12-03-12-54-08_2.jpg"
    ],
    category: "meterkast",
    location: "Gouda",
    likesCount: 102,
    commentsCount: 3,
    date: {
      nl: "2 maanden geleden",
      en: "2 months ago"
    },
    link: "https://www.instagram.com/mmctechniek/",
    caption: {
      nl: "Vandaag weer een 3-fase meterkast upgrade afgerond in Gouda. ⚡ Noodzakelijk voor de nieuwe inductiekookplaat en de laadpaal voor de deur. Met hoogwaardig componenten van Hager zorgen we voor een veilige en stabiele stroomvoorziening.\n\n#meterkast #hager #groepenkast #gouda #elektricien #mmctechniek #veiligwonen #3fase",
      en: "Completed another 3-phase fuse box upgrade in Gouda today. ⚡ Essential for the new induction hob and the charging station outside. With high-quality Hager components, we ensure a safe and stable power supply.\n\n#fusebox #hager #distributionboard #gouda #electrician #mmctechniek #safeliving #3phase"
    },
    comments: [
      {
        username: "hager_fans",
        text: {
          nl: "Hager is altijd een uitstekende keuze voor betrouwbaarheid. Top!",
          en: "Hager is always an excellent choice for reliability. Top!"
        },
        time: { nl: "8w", en: "8w" },
        likes: 4
      },
      {
        username: "thijs.vd.berg",
        text: {
          nl: "Wat is het voordeel van 3-fase ten opzichte van 1-fase?",
          en: "What is the advantage of 3-phase compared to 1-phase?"
        },
        time: { nl: "8w", en: "8w" },
        likes: 1
      },
      {
        username: "mmctechniek",
        text: {
          nl: "@thijs.vd.berg Met 3-fase verdeel je de stroom over 3 kabels in plaats van 1. Dit zorgt voor veel meer vermogen, wat nodig is om tegelijk de auto op te laden, elektrisch te koken en de warmtepomp te draaien zonder dat de zekering springt! 🔌",
          en: "@thijs.vd.berg With 3-phase, you distribute the power over 3 cables instead of 1. This provides much more capacity, which is needed to charge your car, cook electrically, and run the heat pump at the same time without blowing the fuse! 🔌"
        },
        time: { nl: "8w", en: "8w" },
        likes: 3
      }
    ]
  },
  {
    id: "post_9",
    src: "/images/projects/PHOTO-2024-12-08-15-05-59.jpg",
    type: "carousel",
    carouselImages: [
      "/images/projects/PHOTO-2024-12-08-15-05-59.jpg",
      "/images/projects/PHOTO-2024-12-08-15-05-59-2.jpg",
      "/images/projects/PHOTO-2024-12-08-15-05-59-3.jpg",
      "/images/projects/PHOTO-2024-12-08-15-12-09.jpg"
    ],
    category: "meterkast",
    location: "Woerden",
    likesCount: 88,
    commentsCount: 1,
    date: {
      nl: "2 maanden geleden",
      en: "2 months ago"
    },
    link: "https://www.instagram.com/mmctechniek/",
    caption: {
      nl: "Solar omvormer installatie en koppeling met de groepenkast! ☀️🔋 In Woerden hebben we deze Growatt hybride omvormer gemonteerd en veilig aangesloten. De bekabeling is keurig weggewerkt in kabelgoten. Klaar om stroom te oogsten en op te slaan!\n\n#omvormer #growatt #zonnepanelen #woerden #mmctechniek #groeneenergie #thuisbatterij #solartech",
      en: "Solar inverter installation and connection to the distribution board! ☀️🔋 In Woerden we mounted and safely connected this Growatt hybrid inverter. All cabling is neatly hidden in cable conduits. Ready to harvest and store solar power!\n\n#inverter #growatt #solarpanels #woerden #mmctechniek #greenenergy #homebattery #solartech"
    },
    comments: [
      {
        username: "green_lifestyle",
        text: {
          nl: "Is deze omvormer ook al klaar voor een thuisbatterij?",
          en: "Is this inverter already prepared for a home battery?"
        },
        time: { nl: "9w", en: "9w" },
        likes: 1
      }
    ]
  },
  {
    id: "post_10",
    src: "/images/projects/PHOTO-2024-12-08-15-06-01.jpg",
    type: "image",
    category: "airco",
    location: "Nieuwegein",
    likesCount: 64,
    commentsCount: 1,
    date: {
      nl: "2 maanden geleden",
      en: "2 months ago"
    },
    link: "https://www.instagram.com/mmctechniek/",
    caption: {
      nl: "Strakke montage van een airco buitenunit op het platte dak in Nieuwegein. ❄️ Door het gebruik van trillingsdempers staat de unit stabiel en geruisloos. Geen geluidsoverlast voor de bewoners of de buren!\n\n#airconditioning #buitenunit #nieuwegein #mmctechniek #installatietechniek #klimaatbeheersing #stilleairco",
      en: "Sleek installation of an AC outdoor unit on a flat roof in Nieuwegein. ❄️ By using vibration dampeners, the unit stands stable and runs silently. No noise nuisance for the residents or the neighbors!\n\n#aircon #outdoorunit #nieuwegein #mmctechniek #installations #climatecontrol #silentac"
    },
    comments: [
      {
        username: "buren_vriendelijk",
        text: {
          nl: "Fijn dat er trillingsdempers onder zitten, dat scheelt echt enorm veel geluid!",
          en: "Great that vibration dampeners are used under it, that really saves a lot of noise!"
        },
        time: { nl: "10w", en: "10w" },
        likes: 3
      }
    ]
  },
  {
    id: "post_11",
    src: "/images/projects/PHOTO-2024-12-08-15-12-08.jpg",
    type: "image",
    category: "zonnepanelen",
    location: "Linschoten",
    likesCount: 110,
    commentsCount: 2,
    date: {
      nl: "3 maanden geleden",
      en: "3 months ago"
    },
    link: "https://www.instagram.com/mmctechniek/",
    caption: {
      nl: "Solar power in Linschoten! ☀️ Twaalf all-black zonnepanelen gemonteerd op dit prachtige dak. De all-black uitstraling zorgt voor een zeer esthetisch en modern geheel. Duurzaamheid die gezien mag worden!\n\n#allblack #zonnepanelen #linschoten #mmctechniek #solar #esthetisch #duurzaamheid #groenedaken",
      en: "Solar power in Linschoten! ☀️ Twelve all-black solar panels installed on this beautiful roof. The all-black look ensures a very aesthetic and modern overall result. Sustainability that deserves to be seen!\n\n#allblack #solarpanels #linschoten #mmctechniek #solar #aesthetic #sustainability #greenroofs"
    },
    comments: [
      {
        username: "architect_guy",
        text: {
          nl: "All-black staat inderdaad veel mooier op zo'n donker pannendak. Vakwerk!",
          en: "All-black indeed looks much better on such a dark tiled roof. Great work!"
        },
        time: { nl: "12w", en: "12w" },
        likes: 4
      },
      {
        username: "mmctechniek",
        text: {
          nl: "@architect_guy Eens! Het oog wil ook wat, daarom adviseren we all-black panelen bij zichtbare daken. 😎",
          en: "@architect_guy Agreed! Aesthetics matter, which is why we recommend all-black panels for highly visible roofs. 😎"
        },
        time: { nl: "12w", en: "12w" },
        likes: 2
      }
    ]
  },
  {
    id: "post_12",
    src: "/images/projects/PHOTO-2024-12-08-15-05-58.jpg",
    type: "image",
    category: "overig",
    location: "Oudewater",
    likesCount: 95,
    commentsCount: 1,
    date: {
      nl: "3 maanden geleden",
      en: "3 months ago"
    },
    link: "https://www.instagram.com/mmctechniek/",
    caption: {
      nl: "Veiligheid staat bij ons altijd op één! 👷‍♂️ Onze monteurs werken volgens de strengste VCA- en NEN-veiligheidsrichtlijnen. Zo bent u verzekerd van een veilige installatie én een veilige wercommgeving. Wel zo'n geruststellend gevoel!\n\n#veiligheid #vca #nen3140 #installateur #oudewater #mmctechniek #vakmensen #veiligwerken",
      en: "Safety is always our number one priority! 👷‍♂️ Our technicians work according to the strictest VCA and NEN safety guidelines. This guarantees a safe installation and a safe working environment. Quite a comforting feeling!\n\n#safety #vca #nen3140 #installer #oudewater #mmctechniek #professionals #safework"
    },
    comments: [
      {
        username: "veiligheid_eerst",
        text: {
          nl: "Goed om te zien dat jullie hier zoveel aandacht aan besteden! 👍",
          en: "Good to see you paying so much attention to this! 👍"
        },
        time: { nl: "13w", en: "13w" },
        likes: 3
      }
    ]
  }
];
