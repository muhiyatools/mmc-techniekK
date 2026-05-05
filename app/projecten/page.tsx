import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "../components/Breadcrumb";
import FadeIn from "../components/FadeIn";
import ProjectGallery from "../components/ProjectGallery";
import HairlineDivider from "../components/HairlineDivider";
import InstrumentDot from "../components/InstrumentDot";
import { projectImages, contactInfo } from "@/lib/data";

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
      {/* Editorial header — no PageHero, gallery IS the visual */}
      <section
        className="relative bg-concrete pt-[88px] lg:pt-[112px]"
        aria-label="Pagina introductie"
      >
        {/* Atmospheric brand wash */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(120% 80% at 90% 0%, color-mix(in oklch, var(--color-brand) 5%, transparent) 0%, transparent 55%)",
          }}
        />

        <div className="relative max-w-[1280px] mx-auto px-6 lg:px-10 pt-10 pb-16 lg:pb-20">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Projecten" },
            ]}
          />

          <div className="mt-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <p className="inline-flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-muted font-sans mb-5">
                <InstrumentDot size={4} />
                Portfolio
              </p>
              <h1
                className="font-display font-extrabold uppercase leading-[0.88] tracking-[-0.012em] text-ink max-w-[16ch]"
                style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
              >
                Gerealiseerd werk
              </h1>
            </div>

            {/* Project count — large, ghosted numeral */}
            <div className="shrink-0 lg:text-right">
              <span
                className="block font-display font-extrabold tabular leading-none text-brand/25 select-none"
                style={{ fontSize: "clamp(3.5rem, 9vw, 7rem)" }}
                aria-hidden="true"
              >
                {projectImages.length}
              </span>
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-muted font-sans -mt-1">
                projecten
              </p>
            </div>
          </div>

          <p className="mt-6 text-[1.0625rem] leading-[1.7] text-copy/80 max-w-[56ch] font-sans">
            Van een enkele installatie tot complete woningverduurzaming. Elk project, dezelfde standaard.
          </p>
        </div>

        <HairlineDivider variant="aurora" draw />
      </section>

      {/* Gallery */}
      <section className="bg-base" aria-labelledby="gallery-heading">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-16 lg:py-20">
          <h2 id="gallery-heading" className="sr-only">
            Project portfolio
          </h2>
          <FadeIn>
            <ProjectGallery />
          </FadeIn>
        </div>
      </section>

      {/* Closing strip — minimal, no section bloat */}
      <section className="bg-concrete border-t border-hairline">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-12 lg:py-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <p className="inline-flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-muted font-sans mb-2">
                <InstrumentDot size={4} />
                Uw project
              </p>
              <p className="text-[1rem] text-ink font-sans font-medium">
                Interesse? We denken graag mee over uw situatie.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 shrink-0">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-[0.875rem] bg-ink text-base text-[0.6875rem] font-bold uppercase tracking-[0.12em] font-sans rounded-full hover:bg-brand transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand whitespace-nowrap"
              >
                Contact opnemen
                <span
                  aria-hidden="true"
                  className="block w-[4px] h-[4px] rounded-full bg-base/85"
                />
              </Link>
              <a
                href={`tel:${contactInfo.phone}`}
                className="inline-flex items-center justify-center px-6 py-[0.875rem] rounded-full border border-ink text-ink font-sans text-[0.6875rem] font-bold uppercase tracking-[0.12em] hover:border-brand hover:text-brand transition-colors duration-200 tabular whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                {contactInfo.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
