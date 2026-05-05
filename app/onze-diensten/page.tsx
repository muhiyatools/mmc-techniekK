import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "../components/FadeIn";
import PageHero from "../components/PageHero";
import HairlineDivider from "../components/HairlineDivider";
import InstrumentDot from "../components/InstrumentDot";
import ProcessSteps from "../sections/ProcessSteps";
import Partners from "../sections/Partners";
import JsonLd from "../components/JsonLd";
import { services, contactInfo } from "@/lib/data";

export const metadata: Metadata = {
  title: "Onze Diensten",
  description:
    "Het complete dienstenpakket van MMC Techniek: warmtepompen, zonnepanelen, airco, vloerverwarming, batterijopslag, meterkasten en liften. Vakkundig geinstalleerd in heel Nederland vanuit Oudewater.",
  openGraph: {
    title: "Onze Diensten | MMC Techniek B.V.",
    description:
      "Van warmtepompen tot complete verduurzaming. Geinstalleerd door eigen monteurs.",
  },
  alternates: {
    canonical: "https://mmctechniek.nl/onze-diensten",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Welke diensten biedt MMC Techniek aan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "MMC Techniek installeert warmtepompen, zonnepanelen, airconditioning, batterijopslag, vloerverwarming, meterkasten en liften. Wij begeleiden van advies tot oplevering en service.",
      },
    },
    {
      "@type": "Question",
      name: "Werken jullie ook in mijn regio?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Wij zijn gevestigd in Oudewater en werken in heel Nederland, met name in de provincies Utrecht, Zuid-Holland en Noord-Brabant.",
      },
    },
    {
      "@type": "Question",
      name: "Hoe snel kan er gestart worden met een installatie?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Na goedkeuring van de offerte starten we meestal binnen 2 tot 4 weken, afhankelijk van het seizoen en de beschikbaarheid van materialen.",
      },
    },
  ],
};

export default function OnzeDienstenPage() {
  return (
    <>
      <JsonLd data={faqSchema} />

      <PageHero
        title="Onze diensten"
        description="Warmtepompen, zonnepanelen, airco, batterijopslag, vloerverwarming, meterkasten en liften. Geinstalleerd door eigen monteurs uit Oudewater."
        image="/images/services/warmtepompen.webp"
        imageAlt="Warmtepomp installatie door MMC Techniek"
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Onze diensten" },
        ]}
        eyebrow="Diensten"
      />

      {/* Alternating service rows on Void */}
      <section className="bg-base" aria-labelledby="services-list-heading">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-24 lg:py-32">
          <h2 id="services-list-heading" className="sr-only">
            Alle diensten
          </h2>

          <FadeIn>
            <HairlineDivider variant="aurora" draw />
          </FadeIn>

          <div className="divide-y divide-hairline">
            {services.map((service, i) => {
              const isEven = i % 2 === 0;
              return (
                <FadeIn key={service.title} delay={i * 50}>
                  <article className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-center py-14 lg:py-20">
                    <div
                      className={`relative shelf overflow-hidden ${
                        isEven ? "" : "lg:order-2"
                      }`}
                      style={{ aspectRatio: "5 / 4" }}
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 top-0 h-px z-10 pointer-events-none"
                        style={{
                          background:
                            "linear-gradient(90deg, transparent 0%, var(--color-aurora-1) 28%, var(--color-brand) 50%, var(--color-aurora-2) 72%, transparent 100%)",
                        }}
                      />
                      <Image
                        src={service.image}
                        alt={`${service.title} project van MMC Techniek`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>

                    <div className={isEven ? "" : "lg:order-1"}>
                      <p className="inline-flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-muted font-sans mb-4 tabular">
                        <InstrumentDot size={4} />
                        Dienst {String(i + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
                      </p>
                      <h3
                        className="font-display font-bold uppercase leading-[0.92] tracking-[-0.012em] text-ink mb-5"
                        style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)" }}
                      >
                        {service.title}
                      </h3>
                      <p className="text-[1rem] leading-[1.72] text-copy/80 font-sans mb-6 max-w-[60ch]">
                        {service.summary}
                      </p>
                      <p className="text-[0.9375rem] leading-[1.7] text-copy/70 font-sans max-w-[60ch]">
                        {service.description}
                      </p>

                      <div className="mt-7 pt-5 border-t border-hairline flex flex-wrap items-center gap-x-7 gap-y-2">
                        <Link
                          href="/contact"
                          className="group inline-flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-ink font-sans hover:text-brand transition-colors duration-200"
                        >
                          Vraag offerte
                          <span
                            aria-hidden="true"
                            className="block w-[5px] h-[5px] rounded-full bg-brand transition-transform duration-200 group-hover:translate-x-0.5"
                          />
                        </Link>
                        <a
                          href={`tel:${contactInfo.phone}`}
                          className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-muted font-sans hover:text-ink transition-colors duration-200 tabular"
                        >
                          Bel {contactInfo.phoneDisplay}
                        </a>
                      </div>
                    </div>
                  </article>
                </FadeIn>
              );
            })}
          </div>

          <HairlineDivider variant="hairline" />
        </div>
      </section>

      <ProcessSteps />
      <Partners />
    </>
  );
}
