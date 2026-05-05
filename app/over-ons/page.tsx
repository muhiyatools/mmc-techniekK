import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "../components/FadeIn";
import PageHero from "../components/PageHero";
import MicroLabel from "../components/MicroLabel";
import HairlineDivider from "../components/HairlineDivider";
import MetricRow from "../components/MetricRow";
import Shelf from "../components/Shelf";
import { contactInfo } from "@/lib/data";

export const metadata: Metadata = {
  title: "Over ons",
  description:
    "MMC Techniek B.V. is een familiebedrijf uit Oudewater. Sinds 2008 actief in technische installaties.",
  openGraph: {
    title: "Over ons | MMC Techniek B.V.",
    description: "Familiebedrijf uit Oudewater. Sinds 2008 uw partner voor technische installaties.",
  },
  alternates: {
    canonical: "https://mmctechniek.nl/over-ons",
  },
};

const certifications = [
  {
    name: "NEN 3140",
    description: "Veilig werken aan elektrische installaties",
    image: "/images/certifications/nen-3140.png",
  },
  {
    name: "VCA",
    description: "Veiligheid, Gezondheid en Milieu Checklist Aannemers",
    image: "/images/certifications/vca.png",
  },
];

const values = [
  {
    title: "Vakmanschap",
    description: "16 jaar ervaring in technische installaties. Elk project krijgt de aandacht die het verdient.",
  },
  {
    title: "Persoonlijk contact",
    description: "Direct contact met ons team. Geen callcenters, geen wachttijden. U weet altijd waar u aan toe bent.",
  },
  {
    title: "Duurzaamheid",
    description: "We helpen u verder met oplossingen die nu én in de toekomst werken. Van energielabel C naar A++.",
  },
];

export default function OverOnsPage() {
  return (
    <>
      <PageHero
        title="Familiebedrijf uit Oudewater"
        description="Sinds 2008. Een vast team eigen monteurs, geen onderaannemers. Wij installeren warmtepompen, zonnepanelen, airco en meer."
        image="/images/services/meterkast.webp"
        imageAlt="MMC Techniek monteur aan het werk"
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Over ons" },
        ]}
        eyebrow="Over ons"
      />

      {/* Stats / Metrics Band */}
      <section className="bg-concrete" aria-labelledby="stats-heading">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-10">
          <FadeIn>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <h2 id="stats-heading" className="sr-only">Cijfers en feiten</h2>
              <MetricRow
                items={[
                  { value: "16", label: "jaar ervaring" },
                  { value: "8", label: "vaste monteurs" },
                  { value: "2000+", label: "installaties" },
                  { value: "24u", label: "offerte" },
                ]}
              />
              <p className="text-sm text-muted max-w-xs">
                Van warmtepompen tot complete renovaties. Voor particulieren en bedrijven in Oudewater en omgeving.
              </p>
            </div>
          </FadeIn>
        </div>
        <HairlineDivider draw />
      </section>

      {/* Story Section */}
      <section className="bg-base" aria-labelledby="story-heading">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-20 lg:py-32">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Image Column */}
            <div className="lg:col-span-5">
              <FadeIn>
                <div
                  className="relative overflow-hidden"
                  style={{ aspectRatio: "4 / 5" }}
                >
                  <Image
                    src="/images/services/zonnepanelen.webp"
                    alt="MMC Techniek monteurs installeren zonnepanelen"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  {/* Subtle gradient overlay */}
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(to top, color-mix(in oklch, var(--color-ink) 25%, transparent) 0%, transparent 40%)"
                    }}
                  />
                  {/* Caption on image */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-base/85">
                      Oudewater · sinds 2008
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 lg:pt-8">
              <FadeIn delay={60}>
                <MicroLabel withDot className="mb-5">
                  Wie we zijn
                </MicroLabel>
                <h2
                  id="story-heading"
                  className="font-display font-bold uppercase leading-[0.95] tracking-[-0.01em] text-ink mb-8"
                  style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}
                >
                  Installaties die passen bij uw situatie
                </h2>
              </FadeIn>

              <FadeIn delay={120}>
                <div className="space-y-5 max-w-[55ch]">
                  <p className="text-[1.0625rem] leading-[1.75] text-copy/85 font-sans">
                    MMC Techniek B.V. is een familiebedrijf dat al sinds 2008 actief is in technische installaties. 
                    We zijn begonnen als elektriciens en hebben ons door de jaren heen uitgebreid naar complete 
                    woningverduurzaming.
                  </p>
                  <p className="text-[1rem] leading-[1.75] text-copy/80 font-sans">
                    We meten op, rekenen door op uw situatie en stellen voor wat past. Geen standaardpakketten, 
                    geen verrassingen achteraf. Advies, installatie en service: persoonlijk en zonder callcenter.
                  </p>
                  <p className="text-[1rem] leading-[1.75] text-copy/80 font-sans">
                    Ons team bestaat uit 8 vaste monteurs. Geen onderaannemers, geen uitzendkrachten. 
                    Zo houden we de kwaliteit hoog en de lijnen kort.
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={180}>
                <div className="mt-10 pt-8 border-t border-hairline">
                  <div className="flex flex-wrap gap-8">
                    <div>
                      <p className="text-[2rem] font-bold font-display text-brand leading-none mb-1">16+</p>
                      <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-muted">Jaar ervaring</p>
                    </div>
                    <div>
                      <p className="text-[2rem] font-bold font-display text-brand leading-none mb-1">2000+</p>
                      <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-muted">Projecten</p>
                    </div>
                    <div>
                      <p className="text-[2rem] font-bold font-display text-brand leading-none mb-1">8</p>
                      <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-muted">Vaste monteurs</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-concrete" aria-labelledby="values-heading">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <FadeIn>
            <MicroLabel withDot className="mb-5 justify-center">
              Onze werkwijze
            </MicroLabel>
            <h2
              id="values-heading"
              className="font-display font-bold uppercase leading-[0.95] tracking-[-0.01em] text-ink text-center mb-16"
              style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}
            >
              Waarom kiezen voor MMC Techniek
            </h2>
          </FadeIn>

          <FadeIn delay={80}>
            <HairlineDivider variant="aurora" draw />
          </FadeIn>

          <div className="divide-y divide-hairline">
            {values.map((value, index) => (
              <FadeIn key={value.title} delay={120 + index * 60}>
                <div className="grid md:grid-cols-[1fr_2fr] gap-6 lg:gap-16 py-10 lg:py-12 items-start">
                  <div className="flex items-baseline gap-4">
                    <span className="tabular text-[2.5rem] lg:text-[3rem] font-display font-extrabold leading-none text-brand">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      aria-hidden="true"
                      className="block w-8 h-px bg-hairline self-center"
                    />
                  </div>
                  <div>
                    <h3 className="font-display font-bold uppercase tracking-[-0.005em] text-ink text-[1.25rem] lg:text-[1.5rem] leading-tight mb-3">
                      {value.title}
                    </h3>
                    <p className="text-[0.9375rem] leading-[1.7] text-copy/80 font-sans max-w-[50ch]">
                      {value.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <HairlineDivider variant="hairline" />
        </div>
      </section>

      {/* Certifications Section with Images */}
      <section className="bg-base" aria-labelledby="cert-heading">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <FadeIn>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              {/* Left: Header */}
              <div>
                <MicroLabel withDot className="mb-5">
                  Kwaliteit en veiligheid
                </MicroLabel>
                <h2
                  id="cert-heading"
                  className="font-display font-bold uppercase leading-[0.95] tracking-[-0.01em] text-ink mb-6"
                  style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}
                >
                  Gecertificeerd en erkend
                </h2>
                <p className="text-[1rem] leading-[1.75] text-copy/80 font-sans max-w-[50ch]">
                  Wij werken volgens de hoogste veiligheidsnormen en zijn in het bezit van alle benodigde 
                  certificeringen. Uw installatie is bij ons in goede handen.
                </p>
              </div>

              {/* Right: Certificate Cards */}
              <div className="grid sm:grid-cols-2 gap-6">
                {certifications.map((cert, index) => (
                  <FadeIn key={cert.name} delay={80 + index * 60}>
                    <Shelf aurora className="p-6 lg:p-8 h-full flex flex-col">
                      <div 
                        className="relative mb-6 mx-auto"
                        style={{ width: "140px", height: "140px" }}
                      >
                        <Image
                          src={cert.image}
                          alt={`${cert.name} certificering`}
                          fill
                          className="object-contain"
                          sizes="140px"
                        />
                      </div>
                      <div className="mt-auto text-center">
                        <h3 className="text-[1rem] font-bold font-sans text-ink mb-2">
                          {cert.name}
                        </h3>
                        <p className="text-[0.8125rem] leading-[1.6] text-muted font-sans">
                          {cert.description}
                        </p>
                      </div>
                    </Shelf>
                  </FadeIn>
                ))}
              </div>
            </div>
          </FadeIn>

        </div>
      </section>

      {/* Service Area */}
      <section className="bg-concrete" aria-labelledby="area-heading">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <FadeIn>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                <MicroLabel withDot className="mb-5">
                  Werkgebied
                </MicroLabel>
                <h2
                  id="area-heading"
                  className="font-display font-bold uppercase leading-[0.95] tracking-[-0.01em] text-ink mb-6"
                  style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}
                >
                  Actief in Oudewater en omgeving
                </h2>
                <p className="text-[1rem] leading-[1.75] text-copy/80 font-sans mb-6 max-w-[50ch]">
                  Vanuit onze vestiging in Oudewater bedienen wij het hele midden van Nederland. 
                  Utrecht, Zuid-Holland en Gelderland: wij komen graag bij u langs.
                </p>
              </div>
              <FadeIn delay={80} direction="right">
                <div 
                  className="relative overflow-hidden"
                  style={{ aspectRatio: "16 / 10" }}
                >
                  <Image
                    src="/images/services/warmtepompen.webp"
                    alt="MMC Techniek installatie in regio Oudewater"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </FadeIn>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-brand-deep" aria-labelledby="cta-heading">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <MicroLabel variant="inverse" withDot className="mb-5 justify-center">
                Contact
              </MicroLabel>
              <h2
                id="cta-heading"
                className="font-display font-bold uppercase leading-[0.95] tracking-[-0.01em] text-base mb-6"
                style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}
              >
                Kennis maken?
              </h2>
              <p className="text-[1.0625rem] leading-[1.7] text-base/80 font-sans mb-10">
                Bel of mail voor een vrijblijvend adviesgesprek. We komen graag bij u langs 
                om de mogelijkheden te bespreken.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center px-8 py-4 bg-base text-ink text-[0.6875rem] font-bold uppercase tracking-[0.12em] font-sans rounded-full hover:bg-concrete transition-colors duration-200"
                >
                  Contact opnemen
                </Link>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="text-[0.9375rem] text-base/70 font-sans hover:text-base transition-colors duration-200"
                >
                  {contactInfo.phoneDisplay}
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
