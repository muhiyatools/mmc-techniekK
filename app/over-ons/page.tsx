import type { Metadata } from "next";
import Image from "next/image";
import FadeIn from "../components/FadeIn";
import PageHero from "../components/PageHero";
import { whyChooseUs } from "@/lib/data";

export const metadata: Metadata = {
  title: "Over Ons",
  description:
    "Leer MMC Techniek B.V. kennen: een familiebedrijf uit Oudewater met 16+ jaar ervaring in warmtepompen, zonnepanelen en technische installaties.",
  openGraph: {
    title: "Over Ons | MMC Techniek B.V.",
    description:
      "Echt familiebedrijf uit Oudewater. Al sinds 2008 uw betrouwbare partner voor alle technische installaties.",
  },
  alternates: {
    canonical: "https://mmctechniek.nl/over-ons",
  },
};

const usps = [
  "16+ jaar ervaring in technische installaties",
  "Op maat gemaakte oplossingen voor elke woning",
  "Gecertificeerd en VCA-gecertificeerd personeel",
  "Persoonlijke aanpak zonder callcenters",
  "Onderhoud en service na oplevering",
];

export default function OverOnsPage() {
  return (
    <>
      <PageHero
        title="Over ons"
        description="Echt familiebedrijf uit Oudewater. Al sinds 2008 uw betrouwbare partner voor alle technische installaties."
        image="/images/services/meterkast.webp"
        imageAlt="MMC Techniek monteur aan het werk bij een installatieproject"
        breadcrumbItems={[{ label: "Home", href: "/" }, { label: "Over Ons" }]}
      />

      {/* Story section */}
      <section className="py-24 lg:py-32 bg-base" aria-labelledby="about-story-heading">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Image with stat overlay */}
            <FadeIn>
              <div className="relative">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src="/images/services/zonnepanelen.webp"
                    alt="MMC Techniek monteurs installeren zonnepanelen op een dak in Oudewater"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                {/* Year stat block */}
                <div className="absolute -bottom-6 -right-6 bg-brand p-8 hidden lg:block rounded-2xl">
                  <p className="text-[2.75rem] font-extrabold text-base leading-none">16+</p>
                  <p className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-base/80 mt-2 font-sans">
                    Jaar ervaring
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* Text */}
            <div>
              <FadeIn delay={80}>
                <p className="text-[0.75rem] font-bold uppercase tracking-[0.13em] text-brand font-sans mb-4">
                  Wie we zijn
                </p>
                <h2
                  id="about-story-heading"
                  className="font-display font-bold uppercase leading-[0.9] tracking-tight text-ink mb-6"
                  style={{ fontSize: "clamp(1.75rem, 3vw, 2.75rem)" }}
                >
                  Uw partner in verduurzaming
                </h2>
              </FadeIn>
              <FadeIn delay={160}>
                <div className="text-[1rem] leading-[1.72] text-copy/80 font-sans space-y-4">
                  <p>
                    <strong className="text-ink">MMC Techniek BV</strong> is ontstaan vanuit de passie voor techniek en het verduurzamen van woningen. Vanuit onze thuisbasis Oudewater bedienen we inmiddels klanten in heel Nederland.
                  </p>
                  <p>
                    Wat begon als een eenmanszaak is uitgegroeid naar een hecht team van vakmensen. Samen delen we een missie: elke klant een oplossing bieden die echt werkt.
                  </p>
                  <h3
                    className="font-display font-bold uppercase tracking-tight text-ink pt-4"
                    style={{ fontSize: "clamp(1.125rem, 1.5vw, 1.25rem)" }}
                  >
                    Van advies tot nazorg
                  </h3>
                  <p>
                    We begeleiden u door het hele traject: van het eerste gesprek en de offerte tot de installatie en het onderhoud daarna. Persoonlijk, transparant en zonder gedoe.
                  </p>
                  <ul className="space-y-3 text-[0.9375rem] pt-2">
                    {usps.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="w-5 h-5 bg-brand flex items-center justify-center shrink-0 mt-0.5 rounded-full" aria-hidden="true">
                          <svg className="w-3 h-3 text-base" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-concrete" aria-labelledby="cert-heading">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-[0.75rem] font-bold uppercase tracking-[0.13em] text-brand font-sans mb-2">
                Kwaliteit &amp; veiligheid
              </p>
              <h2
                id="cert-heading"
                className="font-display font-bold uppercase leading-[0.9] tracking-tight text-ink"
                style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}
              >
                Onze certificeringen
              </h2>
              <p className="text-[0.9375rem] text-muted font-sans mt-3 max-w-[500px] mx-auto">
                Wij werken volgens de hoogste kwaliteits- en veiligheidsnormen. Uw project is bij ons in goede handen.
              </p>
            </div>
          </FadeIn>
          <div className="flex flex-wrap justify-center gap-10 items-center">
            <FadeIn delay={80}>
              <div className="bg-base p-8 border border-concrete text-center rounded-2xl">
                  <Image
                    src="/images/certifications/nen-3140.png"
                  alt="NEN-3140 gecertificeerd keurmerk"
                  width={140}
                  height={140}
                  className="mx-auto"
                />
                <p className="text-[0.8125rem] font-bold text-ink font-sans mt-4">NEN-3140</p>
              </div>
            </FadeIn>
            <FadeIn delay={160}>
              <div className="bg-base p-8 border border-concrete text-center rounded-2xl">
                  <Image
                    src="/images/certifications/vca.png"
                  alt="VCA gecertificeerd keurmerk"
                  width={140}
                  height={140}
                  className="mx-auto"
                />
                <p className="text-[0.8125rem] font-bold text-ink font-sans mt-4">VCA</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Why us — asymmetric display heading + numbered list */}
      <section className="py-24 lg:py-32 bg-ink" aria-labelledby="why-us-heading">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-[40fr_60fr] gap-16 lg:gap-24 items-start">

            {/* Left — giant display heading */}
            <FadeIn>
              <h2
                id="why-us-heading"
                className="font-display font-extrabold uppercase leading-[0.84] tracking-tight text-base"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
              >
                WAAROM
                <br />
                KIEZEN
                <br />
                <span className="text-brand">VOOR ONS</span>
              </h2>
            </FadeIn>

            {/* Right — numbered stacked list */}
            <div className="space-y-0 divide-y divide-base/15">
              {whyChooseUs.map((item, i) => (
                <FadeIn key={item.title} delay={i * 100} direction="right">
                  <article className="py-8 first:pt-0">
                    <div className="flex items-start gap-6">
                      {/* Big ghost number */}
                      <span
                        className="text-[3.5rem] font-extrabold leading-none text-base/[0.1] select-none font-display shrink-0 w-14 tabular-nums"
                        aria-hidden="true"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="-mt-1">
                        <h3 className="text-[1.125rem] font-bold text-base uppercase tracking-tight font-display mb-3">
                          {item.title}
                        </h3>
                        <p className="text-[0.875rem] leading-[1.72] text-base/70 font-sans">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </article>
                </FadeIn>
              ))}
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
