export const translations = {
  nl: {
    nav: {
      home: "Home",
      services: "Diensten",
      projects: "Projecten",
      about: "Over ons",
      faq: "Veelgestelde vragen",
      aanbod: "Aanbod",
      contact: "Contact",
      requestQuote: "Offerte aanvragen",
    },
    hero: {
      badge: "Oudewater · Sinds 2008",
      region: "Regio Utrecht & omgeving",
      title: "Precisie in Verduurzaming.",
      description: "De techniek van morgen, vandaag vakkundig geïnstalleerd door onze eigen specialisten.",
      ctaStart: "Start Project",
      ctaContact: "Contact",
      scroll: "Scroll",
      metrics: {
        experience: "jaar ervaring",
        projects: "projecten",
        quote: "offerte binnen 24u",
      }
    },
    sections: {
      services: {
        title: "Onze specialismen",
        description: "Wij maken woningen en bedrijfspanden toekomstbestendig met hoogwaardige technische installaties.",
      },
      process: {
        title: "Zo werken wij",
        steps: [
          { title: "Bezoek en advies", description: "We komen langs, meten op en stellen uw situatie vast." },
          { title: "Offerte binnen 24 uur", description: "Een heldere prijsopbouw zonder verborgen posten." },
          { title: "Installatie", description: "Onze monteurs werken volgens NEN 1010 en VCA." },
          { title: "Oplevering en nazorg", description: "Alle documentatie. Daarna blijven wij bereikbaar." },
        ]
      },
      projects: {
        title: "Gerealiseerde projecten",
        cta: "Bekijk alle projecten",
      },
      trust: {
        title: "Waarom MMC Techniek?",
        reasons: [
          { title: "16+ jaar ervaring", description: "Sinds 2008 actief vanuit Oudewater. Dezelfde betrokkenheid, jaar na jaar." },
          { title: "Eigen vakmensen", description: "Een vast team van gecertificeerde monteurs. Kwaliteit in eigen hand." },
          { title: "Service na oplevering", description: "Een installatie is een relatie van jaren. Wij staan paraat." },
        ]
      },
      faq: {
        title: "Veelgestelde vragen",
      }
    },
    contact: {
      title: "Vraag een offerte aan",
      description: "Vul het formulier in. Wij nemen binnen 24 uur contact op.",
      form: {
        name: "Naam",
        email: "E-mail",
        phone: "Telefoon",
        service: "Dienst",
        product: "Product",
        productOptional: "(optioneel)",
        message: "Uw bericht",
        placeholderMessage: "Vertel ons over uw situatie...",
        submit: "Versturen per e-mail",
        submitting: "Verzenden...",
        whatsapp: "Via WhatsApp",
        successTitle: "Aanvraag ontvangen",
        successDescription: "Bedankt. Wij nemen binnen 24 uur contact op.",
        whatsappSuccess: "Stuur ook via WhatsApp",
        privacyNote: "Door te versturen gaat u akkoord met onze verwerking van uw gegevens.",
      },
      sidebar: {
        phone: "Telefoon",
        email: "E-mail",
        address: "Adres",
        whatsappTitle: "Direct via WhatsApp",
        whatsappSubtitle: "Snelste reactie",
      }
    },
    footer: {
      tagline: "Vakkundige installatie van duurzame systemen sinds 2008.",
      navigation: "Navigatie",
      services: "Diensten",
      legal: "Juridisch",
      contact: "Contact",
      allRightsReserved: "Alle rechten voorbehouden.",
    }
  },
  en: {
    nav: {
      home: "Home",
      services: "Services",
      projects: "Projects",
      about: "About us",
      faq: "FAQ",
      aanbod: "Catalog",
      contact: "Contact",
      requestQuote: "Request a quote",
    },
    hero: {
      badge: "Oudewater · Since 2008",
      region: "Utrecht Region & surroundings",
      title: "Precision in Sustainability.",
      description: "Tomorrow's technology, professionally installed today by our own specialists.",
      ctaStart: "Start Project",
      ctaContact: "Contact",
      scroll: "Scroll",
      metrics: {
        experience: "years of experience",
        projects: "projects",
        quote: "quote within 24h",
      }
    },
    sections: {
      services: {
        title: "Our specialisms",
        description: "We make homes and commercial buildings future-proof with high-quality technical installations.",
      },
      process: {
        title: "How we work",
        steps: [
          { title: "Visit and advice", description: "We come by, measure and determine your situation." },
          { title: "Quote within 24 hours", description: "A clear price structure without hidden items." },
          { title: "Installation", description: "Our technicians work according to NEN 1010 and VCA." },
          { title: "Delivery and aftercare", description: "All documentation. After that, we remain available." },
        ]
      },
      projects: {
        title: "Completed projects",
        cta: "View all projects",
      },
      trust: {
        title: "Why MMC Techniek?",
        reasons: [
          { title: "16+ years of experience", description: "Active from Oudewater since 2008. The same commitment, year after year." },
          { title: "Our own craftsmen", description: "A fixed team of certified technicians. Quality in our own hands." },
          { title: "Service after delivery", description: "An installation is a multi-year relationship. We are ready." },
        ]
      },
      faq: {
        title: "Frequently Asked Questions",
      }
    },
    contact: {
      title: "Request a quote",
      description: "Fill out the form. We will contact you within 24 hours.",
      form: {
        name: "Name",
        email: "Email",
        phone: "Phone",
        service: "Service",
        product: "Product",
        productOptional: "(optional)",
        message: "Your message",
        placeholderMessage: "Tell us about your situation...",
        submit: "Send by email",
        submitting: "Sending...",
        whatsapp: "Via WhatsApp",
        successTitle: "Request received",
        successDescription: "Thank you. We will contact you within 24 hours.",
        whatsappSuccess: "Also send via WhatsApp",
        privacyNote: "By submitting, you agree to our processing of your data.",
      },
      sidebar: {
        phone: "Phone",
        email: "Email",
        address: "Address",
        whatsappTitle: "Direct via WhatsApp",
        whatsappSubtitle: "Fastest response",
      }
    },
    footer: {
      tagline: "Professional installation of sustainable systems since 2008.",
      navigation: "Navigation",
      services: "Services",
      legal: "Legal",
      contact: "Contact",
      allRightsReserved: "All rights reserved.",
    }
  }
};

export type Language = "nl" | "en";
export type TranslationKey = typeof translations.nl;
