import type { Metadata } from "next";
import Image from "next/image";
import FadeIn from "../components/FadeIn";
import PageHero from "../components/PageHero";
import ProjectGallery from "../components/ProjectGallery";

export const metadata: Metadata = {
  title: "Projecten",
  description:
    "Bekijk ons portfolio van gerealiseerde projecten: warmtepompen, zonnepanelen, meterkasten en complete renovaties in Oudewater en heel Nederland.",
  openGraph: {
    title: "Projecten | MMC Techniek B.V.",
    description:
      "Van kleine installaties tot complete renovaties. Bekijk hier een selectie van ons werk.",
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
        description="Van kleine installaties tot complete renovaties. Bekijk hier een selectie van ons werk in Oudewater en de rest van Nederland."
        image="/images/services/zonnepanelen.webp"
        imageAlt="Zonnepanelen installatie door MMC Techniek"
        breadcrumbItems={[{ label: "Home", href: "/" }, { label: "Projecten" }]}
      />

      {/* Project gallery */}
      <section className="py-16 lg:py-24 bg-base" aria-labelledby="gallery-heading">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <FadeIn>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
              <div>
                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.13em] text-brand font-sans mb-2">
                  Portfolio
                </p>
                <h2
                  id="gallery-heading"
                  className="font-display font-bold uppercase leading-[0.9] tracking-tight text-ink"
                  style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}
                >
                  Gerealiseerde projecten in beeld
                </h2>
              </div>
              <p className="text-[0.875rem] text-muted font-sans max-w-[400px]">
                Klik op een foto om deze groter te bekijken.
              </p>
            </div>
          </FadeIn>

          <ProjectGallery />
        </div>
      </section>

      {/* Info section */}
      <section className="py-24 bg-concrete" aria-labelledby="approach-heading">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div className="relative aspect-[4/3] overflow-hidden">
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
                <h2
                  id="approach-heading"
                  className="font-display font-bold uppercase leading-[0.9] tracking-tight text-ink mb-6"
                  style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}
                >
                  Kleine klus of groot project: wij staan voor u klaar
                </h2>
                <p className="text-[1rem] leading-[1.72] text-copy/80 font-sans mb-8">
                  Of het nu gaat om het vervangen van een stopcontact, het upgraden van uw meterkast of een complete woningverduurzaming: onze aanpak is altijd hetzelfde. Grondig, netjes en met oog voor detail.
                </p>
              </FadeIn>
              <FadeIn delay={160}>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { title: "Eigen vakmensen", desc: "Geen onderaannemers, maar ons eigen team." },
                    { title: "Scherpe prijs", desc: "Eerlijke offerte, geen verborgen kosten." },
                    { title: "Snelle planning", desc: "Meestal binnen 2 weken aan de slag." },
                    { title: "Garantie", desc: "5 jaar garantie op onze installaties." },
                  ].map((item) => (
                    <div key={item.title} className="bg-base p-5 border border-concrete rounded-xl">
                      <h3 className="font-sans font-bold text-[0.875rem] text-ink mb-1">{item.title}</h3>
                      <p className="text-[0.8125rem] text-muted font-sans">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
