import type { Metadata } from "next";
import FadeIn from "../components/FadeIn";
import Breadcrumb from "../components/Breadcrumb";
import ContactForm from "../components/ContactForm";
import HairlineDivider from "../components/HairlineDivider";
import InstrumentDot from "../components/InstrumentDot";
import FaqAccordion from "../components/FaqAccordion";
import { contactInfo } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Neem contact op met MMC Techniek B.V. uit Oudewater. Bel 06 3431 1225, mail of vul het formulier in voor een vrijblijvend adviesgesprek.",
  openGraph: {
    title: "Contact | MMC Techniek B.V.",
    description: "Vragen of een vrijblijvend adviesgesprek? We staan klaar.",
  },
  alternates: {
    canonical: "https://mmctechniek.nl/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      {/* Header */}
      <section
        className="relative bg-concrete pt-[88px] lg:pt-[112px]"
        aria-label="Contact header"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(120% 80% at 90% 0%, color-mix(in oklch, var(--color-brand) 5%, transparent) 0%, transparent 55%)",
          }}
        />

        <div className="relative max-w-[1280px] mx-auto px-6 lg:px-10 pt-10 pb-14 lg:pb-16">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Contact" },
            ]}
          />

          <div className="mt-10 max-w-[52ch]">
            <p className="inline-flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-muted font-sans mb-5">
              <InstrumentDot size={4} />
              Contact
            </p>
            <h1
              className="font-display font-extrabold uppercase leading-[0.88] tracking-[-0.012em] text-ink mb-5"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
            >
              Neem contact op
            </h1>
            <p className="text-[1.0625rem] leading-[1.7] text-copy/80 font-sans">
              Vragen, een installatie doorrekenen of een vrijblijvend adviesgesprek? We reageren binnen 24 uur.
            </p>
          </div>
        </div>

        <HairlineDivider variant="aurora" draw />
      </section>

      {/* Quick contact tiles */}
      <section aria-label="Directe contactopties">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-hairline border-b border-hairline">

            <a
              href={`tel:${contactInfo.phone}`}
              className="group py-8 px-0 sm:px-6 lg:px-8 hover:bg-concrete transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
            >
              <p className="text-[0.625rem] font-bold uppercase tracking-[0.22em] text-muted font-sans mb-2">
                Bel direct
              </p>
              <p
                className="font-display font-bold uppercase leading-tight text-ink group-hover:text-brand transition-colors duration-200 tabular"
                style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)" }}
              >
                {contactInfo.phoneDisplay}
              </p>
              <p className="mt-1.5 text-[0.8125rem] text-muted font-sans">
                Ma–vr 09:00–18:00
              </p>
            </a>

            <a
              href={`mailto:${contactInfo.email}`}
              className="group py-8 px-0 sm:px-6 lg:px-8 hover:bg-concrete transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
            >
              <p className="text-[0.625rem] font-bold uppercase tracking-[0.22em] text-muted font-sans mb-2">
                E-mail
              </p>
              <p
                className="font-sans font-semibold text-ink group-hover:text-brand transition-colors duration-200 break-all leading-tight"
                style={{ fontSize: "clamp(0.9375rem, 1.5vw, 1.125rem)" }}
              >
                {contactInfo.email}
              </p>
              <p className="mt-1.5 text-[0.8125rem] text-muted font-sans">
                Reactie binnen 24 uur
              </p>
            </a>

            <a
              href="https://maps.google.com/?q=Heemraadsingel+11+3421+VG+Oudewater"
              target="_blank"
              rel="noopener noreferrer"
              className="group py-8 px-0 sm:px-6 lg:px-8 hover:bg-concrete transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
            >
              <p className="text-[0.625rem] font-bold uppercase tracking-[0.22em] text-muted font-sans mb-2">
                Bezoek
              </p>
              <p
                className="font-sans font-semibold text-ink group-hover:text-brand transition-colors duration-200 leading-tight"
                style={{ fontSize: "clamp(0.9375rem, 1.5vw, 1.125rem)" }}
              >
                Oudewater, Utrecht
              </p>
              <p className="mt-1.5 text-[0.8125rem] text-muted font-sans">
                Op afspraak
              </p>
            </a>

          </div>
        </div>
      </section>

      {/* Form section */}
      <section
        className="bg-base"
        aria-labelledby="contact-form-heading"
      >
        <div className="max-w-[720px] mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <FadeIn>
            <div className="relative shelf p-8 lg:p-10">
              {/* Aurora stripe */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, var(--color-aurora-1) 28%, var(--color-brand) 50%, var(--color-aurora-2) 72%, transparent 100%)",
                  backgroundSize: "200% 100%",
                  animation: "aurora-drift 18s linear infinite",
                }}
              />

              <p className="inline-flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-brand font-sans mb-4">
                <InstrumentDot size={4} />
                Stuur een bericht
              </p>
              <h2
                id="contact-form-heading"
                className="font-display font-bold uppercase leading-[0.95] tracking-[-0.012em] text-ink mb-2"
                style={{ fontSize: "clamp(1.625rem, 2.5vw, 2.25rem)" }}
              >
                Offerte of vraag?
              </h2>
              <p className="text-[0.9375rem] leading-[1.72] text-copy/80 mb-8 font-sans">
                Beschrijf kort uw situatie. We nemen binnen 24 uur contact op.
              </p>
              <ContactForm />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ section */}
      <section className="bg-concrete" aria-labelledby="faq-heading">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <FadeIn>
            <div className="max-w-[720px] mx-auto">
              <p className="inline-flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-muted font-sans mb-4">
                <InstrumentDot size={4} />
                Veelgestelde vragen
              </p>
              <h2
                id="faq-heading"
                className="font-display font-bold uppercase leading-[0.95] tracking-[-0.012em] text-ink mb-10"
                style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}
              >
                Antwoord op uw vraag
              </h2>
            </div>
          </FadeIn>
          <FadeIn delay={80}>
            <FaqAccordion
              items={[
                {
                  question: "Hoe snel kan er gestart worden met een installatie?",
                  answer:
                    "Na goedkeuring van de offerte starten we meestal binnen 2 tot 4 weken, afhankelijk van het seizoen en de beschikbaarheid van materialen. Voor spoedklussen kijken we altijd naar de mogelijkheden.",
                },
                {
                  question: "Werken jullie ook in mijn regio?",
                  answer:
                    "Wij zijn gevestigd in Oudewater en werken in heel Nederland, met name in de provincies Utrecht, Zuid-Holland en Noord-Brabant. Voor grotere projecten reizen we landelijk.",
                },
                {
                  question: "Wat kost een warmtepomp installatie?",
                  answer:
                    "De kosten hangen af van uw woning, isolatie en gekozen systeem. We maken graag een vrijblijvende offerte op maat. De meeste installaties vallen tussen € 8.000 en € 18.000, inclusief subsidie-advies.",
                },
                {
                  question: "Kan ik subsidie krijgen?",
                  answer:
                    "Ja, voor de meeste duurzame installaties geldt de ISDE-subsidie. We adviseren u hierover en helpen met de aanvraag. Zo weet u precies waar u aan toe bent.",
                },
                {
                  question: "Bieden jullie ook service na oplevering?",
                  answer:
                    "Absoluut. We blijven bereikbaar voor onderhoud, garantie en uitbreidingen. Onze monteurs kennen uw installatie en staan paraat wanneer u ons nodig heeft.",
                },
              ]}
            />
          </FadeIn>
        </div>
      </section>
    </>
  );
}
