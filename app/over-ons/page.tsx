import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "../components/FadeIn";
import PageHero from "../components/PageHero";
import HairlineDivider from "../components/HairlineDivider";
import InstrumentDot from "../components/InstrumentDot";
import WhyChooseUs from "../sections/WhyChooseUs";
import { contactInfo } from "@/lib/data";

export const metadata: Metadata = {
  title: "Over ons",
  description:
    "MMC Techniek B.V. is een familiebedrijf uit Oudewater. Sinds 2008 actief in warmtepompen, zonnepanelen en technische installaties met een vast team eigen monteurs.",
  openGraph: {
    title: "Over ons | MMC Techniek B.V.",
    description:
      "Familiebedrijf uit Oudewater. Sinds 2008 uw partner voor technische installaties.",
  },
  alternates: {
    canonical: "https://mmctechniek.nl/over-ons",
  },
};

const certifications = [
  { label: "VCA gecertificeerd", note: "Veiligheid op de werkvloer" },
  { label: "NEN 1010", note: "Norm voor laagspanningsinstallaties" },
  { label: "NEN 3140", note: "Periodiek inspecteren en testen" },
  { label: "Erkend leerbedrijf", note: "We leiden eigen vaktechnici op" },
];

export default function OverOnsPage() {
  return (
    <>
      <PageHero
        title="Familiebedrijf uit Oudewater"
        description="Sinds 2008 een vast team eigen monteurs. Geen onderaannemers, geen callcenters, wel persoonlijk contact en service na oplevering."
        image="/images/services/meterkast.webp"
        imageAlt="MMC Techniek monteur aan het werk bij een meterkast installatie"
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Over ons" },
        ]}
        eyebrow="Over ons"
      />

      {/* Story */}
      <section className="bg-base" aria-labelledby="about-story-heading">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-24 lg:py-32">
          <div className="grid lg:grid-cols-[0.95fr_1fr] gap-12 lg:gap-20 items-start">
            <FadeIn>
              <div
                className="relative shelf overflow-hidden"
                style={{ aspectRatio: "4 / 5" }}
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
                  src="/images/services/zonnepanelen.webp"
                  alt="MMC Techniek monteurs installeren zonnepanelen op een dak in Oudewater"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />

                {/* In-shelf metric panel */}
                <div className="absolute inset-x-0 bottom-0 p-6 lg:p-7 z-10">
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-px bg-hairline"
                  />
                  <p className="inline-flex items-center gap-2 text-[0.625rem] font-bold uppercase tracking-[0.22em] text-muted font-sans mb-2">
                    <InstrumentDot size={4} />
                    Sinds 2008
                  </p>
                  <p
                    className="font-display font-extrabold uppercase tracking-[-0.012em] text-brand leading-[0.85]"
                    style={{ fontSize: "clamp(2.5rem, 5vw, 3.75rem)" }}
                  >
                    16+ jaar
                  </p>
                  <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-muted font-sans mt-1">
                    Werkend in dezelfde regio
                  </p>
                </div>
              </div>
            </FadeIn>

            <div>
              <FadeIn delay={60}>
                <p className="inline-flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-muted font-sans mb-4">
                  <InstrumentDot size={4} />
                  Wie we zijn
                </p>
                <h2
                  id="about-story-heading"
                  className="font-display font-bold uppercase leading-[0.92] tracking-[-0.012em] text-ink mb-7 max-w-[16ch]"
                  style={{ fontSize: "clamp(1.875rem, 3.5vw, 3rem)" }}
                >
                  Geen pakketten,<br />
                  <span className="text-brand">een installatie die past</span>
                </h2>
              </FadeIn>

              <FadeIn delay={140}>
                <div className="text-[1rem] leading-[1.72] text-copy/85 font-sans space-y-5 max-w-[62ch]">
                  <p>
                    <strong className="text-ink font-semibold">MMC Techniek B.V.</strong> is sinds 2008 actief vanuit Oudewater. We werken in heel Nederland, met name in Utrecht, Zuid-Holland en Noord-Brabant, en zijn de afgelopen jaren stilletjes uitgegroeid tot een hecht team eigen monteurs.
                  </p>
                  <p>
                    Wij verkopen geen standaardpakketten. Een warmtepomp die voor uw buurman werkt, hoeft voor uw woning niet de juiste keuze te zijn. We meten op, rekenen door op uw stookgedrag en isolatie en stellen voor wat past.
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={220}>
                <h3 className="font-display font-bold uppercase tracking-[-0.005em] text-ink text-[1.25rem] leading-tight mt-10 mb-4 pt-8 border-t border-hairline">
                  Van advies tot service
                </h3>
                <p className="text-[1rem] leading-[1.72] text-copy/85 font-sans max-w-[62ch]">
                  Eerste gesprek, offerte, installatie en service na oplevering doen we binnenshuis. Persoonlijk, transparant, zonder callcenter ertussen.
                </p>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Why us */}
      <WhyChooseUs />

      {/* Certifications */}
      <section className="bg-base" aria-labelledby="cert-heading">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-24 lg:py-32">
          <div className="mb-12 lg:mb-14">
            <FadeIn>
              <p className="inline-flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-muted font-sans mb-4">
                <InstrumentDot size={4} />
                Certificeringen
              </p>
              <h2
                id="cert-heading"
                className="font-display font-bold uppercase leading-[0.92] tracking-[-0.012em] text-ink"
                style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}
              >
                Werken volgens<br />
                <span className="text-brand">de norm</span>
              </h2>
            </FadeIn>
          </div>

          <FadeIn delay={80}>
            <HairlineDivider variant="aurora" draw />
          </FadeIn>

          <dl className="grid sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-hairline">
            {certifications.map((cert, i) => (
              <FadeIn key={cert.label} delay={120 + i * 60}>
                <div className="p-6 lg:p-8 lg:py-10">
                  <dt
                    className="font-display font-bold uppercase tracking-[-0.005em] text-ink text-[1.25rem] leading-tight mb-2 tabular"
                  >
                    {cert.label}
                  </dt>
                  <dd className="text-[0.875rem] text-copy/70 font-sans leading-snug">
                    {cert.note}
                  </dd>
                </div>
              </FadeIn>
            ))}
          </dl>

          <HairlineDivider variant="hairline" />

          <FadeIn delay={300}>
            <div className="mt-12 flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-7 py-[0.9375rem] bg-ink text-base text-[0.6875rem] font-bold uppercase tracking-[0.12em] font-sans rounded-full hover:bg-brand transition-colors duration-200"
              >
                Plan een adviesgesprek
                <span
                  aria-hidden="true"
                  className="block w-[5px] h-[5px] rounded-full bg-base/85 transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
              <a
                href={`tel:${contactInfo.phone}`}
                className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-muted font-sans hover:text-ink transition-colors duration-200 tabular"
              >
                Of bel {contactInfo.phoneDisplay}
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
