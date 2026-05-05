import type { Metadata } from "next";
import FadeIn from "../components/FadeIn";
import PageHero from "../components/PageHero";
import ContactForm from "../components/ContactForm";
import HairlineDivider from "../components/HairlineDivider";
import InstrumentDot from "../components/InstrumentDot";
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

const contactRows = [
  {
    label: "Adres",
    value: contactInfo.address,
    href: "https://maps.google.com/?q=Heemraadsingel+11+3421+VG+Oudewater",
    external: true,
  },
  {
    label: "Telefoon",
    value: contactInfo.phoneDisplay,
    href: `tel:${contactInfo.phone}`,
  },
  {
    label: "E-mail",
    value: contactInfo.email,
    href: `mailto:${contactInfo.email}`,
  },
  {
    label: "Openingstijden",
    value: contactInfo.hours,
    href: null,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Neem contact op"
        description="Vragen, een installatie laten doorrekenen of een vrijblijvend adviesgesprek? Stuur een bericht of bel direct."
        image="/images/services/vloerverwarming.webp"
        imageAlt="Vloerverwarming installatie door MMC Techniek"
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Contact" },
        ]}
        eyebrow="Contact"
      />

      <section
        className="bg-base"
        aria-labelledby="contact-form-heading"
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-24 lg:py-32">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-12 lg:gap-20">

            {/* Left — contact details */}
            <FadeIn>
              <div>
                <p className="inline-flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-muted font-sans mb-4">
                  <InstrumentDot size={4} />
                  Bereikbaarheid
                </p>
                <h2
                  className="font-display font-bold uppercase leading-[0.92] tracking-[-0.012em] text-ink mb-6 max-w-[14ch]"
                  style={{ fontSize: "clamp(1.875rem, 3vw, 2.75rem)" }}
                >
                  Bezoek ons in<br />
                  <span className="text-brand">Oudewater</span>
                </h2>
                <p className="text-[1rem] leading-[1.72] text-copy/80 mb-10 font-sans max-w-[44ch]">
                  Persoonlijk contact, geen callcenters. Loop op afspraak binnen of bel direct.
                </p>

                <HairlineDivider variant="hairline" />
                <dl className="divide-y divide-hairline">
                  {contactRows.map((row) => (
                    <div
                      key={row.label}
                      className="grid grid-cols-[120px_1fr] sm:grid-cols-[160px_1fr] gap-4 items-baseline py-5"
                    >
                      <dt className="text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-muted font-sans">
                        {row.label}
                      </dt>
                      <dd className="text-[0.9375rem] text-ink font-sans leading-snug">
                        {row.href ? (
                          <a
                            href={row.href}
                            target={row.external ? "_blank" : undefined}
                            rel={row.external ? "noopener noreferrer" : undefined}
                            className={`hover:text-brand transition-colors duration-200 ${
                              row.label === "Telefoon" || row.label === "E-mail"
                                ? "tabular"
                                : ""
                            }`}
                          >
                            {row.value}
                          </a>
                        ) : (
                          <span className="tabular">{row.value}</span>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
                <HairlineDivider variant="hairline" />

                <div className="mt-10">
                  <p className="inline-flex items-center gap-2 text-[0.625rem] font-bold uppercase tracking-[0.22em] text-muted font-sans mb-4">
                    <InstrumentDot size={4} />
                    Werkgebied
                  </p>
                  <p className="text-[0.9375rem] leading-[1.7] text-copy/80 font-sans max-w-[44ch]">
                    We werken in heel Nederland, met de meeste projecten in Utrecht, Zuid-Holland en Noord-Brabant.
                  </p>
                </div>

                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-muted font-sans mt-10 tabular">
                  KvK {contactInfo.kvk} · BTW {contactInfo.btw}
                </p>
              </div>
            </FadeIn>

            {/* Right — form on a Mist Shelf */}
            <FadeIn delay={120} direction="right">
              <div className="relative shelf p-7 lg:p-10">
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
                  Direct contact
                </p>
                <h2
                  id="contact-form-heading"
                  className="font-display font-bold uppercase leading-[0.95] tracking-[-0.012em] text-ink mb-4"
                  style={{ fontSize: "clamp(1.625rem, 2.5vw, 2.25rem)" }}
                >
                  Stuur een bericht
                </h2>
                <p className="text-[0.9375rem] leading-[1.72] text-copy/80 mb-8 font-sans max-w-[48ch]">
                  Beschrijf kort uw situatie. We nemen binnen 24 uur contact op met een eerste reactie of een afspraak.
                </p>
                <ContactForm />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
