import type { Metadata } from "next";
import Image from "next/image";
import FadeIn from "../components/FadeIn";
import PageHero from "../components/PageHero";
import ContactForm from "../components/ContactForm";
import Partners from "../sections/Partners";
import JsonLd from "../components/JsonLd";
import { services } from "@/lib/data";

export const metadata: Metadata = {
  title: "Onze Diensten",
  description:
    "Ontdek het complete dienstenpakket van MMC Techniek: warmtepompen, zonnepanelen, airco, vloerverwarming, batterijopslag, meterkast en liften. Vakkundig geinstalleerd in Oudewater en omgeving.",
  openGraph: {
    title: "Onze Diensten | MMC Techniek B.V.",
    description:
      "Van warmtepompen tot complete verduurzaming. Ontdek wat wij voor uw woning kunnen betekenen.",
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
        text: "MMC Techniek installeert warmtepompen, zonnepanelen, airconditioning, batterijopslag, vloerverwarming, meterkasten en liften. Wij begeleiden u van advies tot installatie.",
      },
    },
    {
      "@type": "Question",
      name: "Werk jullie ook in mijn regio?",
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
        text: "Na goedkeuring van de offerte kunnen we meestal binnen 2 tot 4 weken starten met de installatie, afhankelijk van het seizoen en de beschikbaarheid van materialen.",
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
        description="Van warmtepompen tot complete verduurzaming. Ontdek wat wij voor uw woning in Oudewater en omgeving kunnen betekenen."
        image="/images/services/warmtepompen.webp"
        imageAlt="Warmtepomp installatie door MMC Techniek"
        breadcrumbItems={[{ label: "Home", href: "/" }, { label: "Onze Diensten" }]}
      />

      {/* Alternating service rows */}
      <section className="py-24 lg:py-32 bg-base" aria-labelledby="services-list-heading">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <FadeIn>
            <h2 id="services-list-heading" className="sr-only">Alle diensten</h2>
          </FadeIn>

          <div className="space-y-1">
            {services.map((service, i) => {
              const isEven = i % 2 === 0;
              return (
                <FadeIn key={service.title} delay={i * 40}>
                  <article className="group grid md:grid-cols-2 overflow-hidden bg-concrete hover:bg-concrete/80 transition-colors">
                    {/* Image */}
                    <div className={`relative h-64 md:h-80 overflow-hidden${isEven ? "" : " md:order-2"}`}>
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent" />
                    </div>

                    {/* Text */}
                    <div className={`flex flex-col justify-center p-8 lg:p-12${isEven ? "" : " md:order-1"}`}>
                      <span className="text-[0.6875rem] font-bold uppercase tracking-[0.13em] text-brand font-sans mb-3">
                        Dienst {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3
                        className="font-display font-bold uppercase leading-[0.9] tracking-tight text-ink mb-4"
                        style={{ fontSize: "clamp(1.625rem, 2.5vw, 2rem)" }}
                      >
                        {service.title}
                      </h3>
                      <p className="text-[0.9375rem] leading-[1.72] text-copy/80 font-sans max-w-[440px]">
                        {service.description}
                      </p>
                    </div>
                  </article>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partners */}
      <Partners />

      {/* Quote CTA */}
      <section className="py-24 lg:py-32 bg-base" aria-labelledby="quote-heading">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src="/images/services/meterkast.webp"
                  alt="MMC Techniek monteur bij een meterkast installatie"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </FadeIn>
            <div>
              <FadeIn delay={80}>
                <p className="text-[0.75rem] font-bold uppercase tracking-[0.13em] text-brand font-sans mb-4">
                  Vrijblijvend
                </p>
                <h2
                  id="quote-heading"
                  className="font-display font-bold uppercase leading-[0.9] tracking-tight text-ink mb-4"
                  style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}
                >
                  Vraag een offerte aan
                </h2>
                <p className="text-[1rem] leading-[1.72] text-copy/70 font-sans mb-10">
                  Vertel ons over uw project en we nemen binnen 24 uur contact met u op.
                </p>
              </FadeIn>
              <FadeIn delay={160}>
                <ContactForm />
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
