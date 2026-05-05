import type { Metadata } from "next";
import Image from "next/image";
import FadeIn from "../components/FadeIn";
import PageHero from "../components/PageHero";
import ProjectGallery from "../components/ProjectGallery";
import HairlineDivider from "../components/HairlineDivider";
import InstrumentDot from "../components/InstrumentDot";

export const metadata: Metadata = {
  title: "Projecten",
  description:
    "Portfolio van gerealiseerde projecten: warmtepompen, zonnepanelen, meterkasten en complete renovaties in Oudewater en heel Nederland.",
  openGraph: {
    title: "Projecten | MMC Techniek B.V.",
    description:
      "Van kleine installaties tot complete renovaties. Een selectie van ons werk.",
  },
  alternates: {
    canonical: "https://mmctechniek.nl/projecten",
  },
};

export default function ProjectenPage() {
  return (
    <>
      <PageHero
        title="Onze projecten"
        description="Een selectie uit ons archief. Van een enkele warmtepomp tot een complete verduurzaming, in heel Nederland."
        image="/images/services/zonnepanelen.webp"
        imageAlt="Zonnepanelen installatie door MMC Techniek"
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Projecten" },
        ]}
        eyebrow="Portfolio"
      />

      <section className="bg-base" aria-labelledby="gallery-heading">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <FadeIn>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12 lg:mb-14">
              <div>
                <p className="inline-flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-muted font-sans mb-3">
                  <InstrumentDot size={4} />
                  Archief
                </p>
                <h2
                  id="gallery-heading"
                  className="font-display font-bold uppercase leading-[0.92] tracking-[-0.012em] text-ink"
                  style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}
                >
                  Gerealiseerd werk in beeld
                </h2>
              </div>
              <p className="text-[0.8125rem] text-muted font-sans max-w-[40ch]">
                Klik op een foto om deze groter te bekijken.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={80}>
            <HairlineDivider variant="aurora" draw />
          </FadeIn>

          <div className="mt-10">
            <ProjectGallery />
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="bg-concrete" aria-labelledby="approach-heading">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-24 lg:py-32">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-center">
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
                  src="/images/services/warmtepompen.webp"
                  alt="MMC Techniek monteur aan het werk bij een warmtepomp installatie"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </FadeIn>

            <div>
              <FadeIn delay={80}>
                <p className="inline-flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-muted font-sans mb-4">
                  <InstrumentDot size={4} />
                  Aanpak
                </p>
                <h2
                  id="approach-heading"
                  className="font-display font-bold uppercase leading-[0.92] tracking-[-0.012em] text-ink mb-6"
                  style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}
                >
                  Klein of groot,<br />
                  <span className="text-brand">dezelfde standaard</span>
                </h2>
                <p className="text-[1rem] leading-[1.72] text-copy/80 font-sans mb-10 max-w-[60ch]">
                  Of het nu om een enkel stopcontact gaat of een complete woningverduurzaming: dezelfde monteurs, dezelfde werkwijze, dezelfde controle bij oplevering.
                </p>
              </FadeIn>

              <FadeIn delay={160}>
                <dl className="grid sm:grid-cols-2 gap-px bg-hairline border border-hairline">
                  {[
                    { title: "Eigen monteurs", desc: "Geen onderaannemers." },
                    { title: "Vaste prijs", desc: "Offerte zonder verborgen posten." },
                    { title: "Korte planning", desc: "Doorgaans binnen 2 weken aan de slag." },
                    { title: "5 jaar garantie", desc: "Op installatie en montage." },
                  ].map((item) => (
                    <div key={item.title} className="bg-base p-5 lg:p-6">
                      <dt className="font-display font-bold uppercase tracking-[-0.005em] text-ink text-[1rem] mb-1.5">
                        {item.title}
                      </dt>
                      <dd className="text-[0.8125rem] text-copy/75 font-sans leading-snug">
                        {item.desc}
                      </dd>
                    </div>
                  ))}
                </dl>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
