"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import Reveal from "../../_ui/Reveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// Load LeafletMap dynamically with SSR disabled to prevent window is not defined error
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] rounded-3xl bg-concrete animate-pulse flex items-center justify-center border-2 border-hairline/50">
      <span className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin motion-reduce:animate-none" />
    </div>
  )
});

export default function SolarSection() {
  const { language } = useLanguage();
  const nl = language === "nl";
  return (
    <div className="w-full text-ink">
      <div className="relative rounded-[2.5rem] overflow-hidden border border-hairline bg-surface mb-16 group">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-aurora-1 via-brand to-aurora-2 z-20" />

        <div className="relative z-10 flex flex-col items-center text-center px-8 py-16 lg:py-24 border-b border-hairline/50 bg-concrete/30">
          <Reveal>
            <span className="inline-block px-5 py-2 rounded-full bg-brand/10 border border-brand/20 text-brand-ink text-[12px] font-extrabold uppercase tracking-[0.35em] mb-8">
              {nl ? "Zonne-Energie Specialist" : "Solar Energy Specialist"}
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="font-display font-extrabold text-[clamp(2.5rem,6vw,5.5rem)] text-ink leading-[0.85] tracking-[-0.04em] uppercase mb-10">
              {nl ? "Maatwerk " : "Custom "}<span className="text-brand-ink">Solar Solutions</span>
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-lg md:text-2xl text-muted font-medium leading-relaxed mb-16 max-w-2xl mx-auto">
              {nl
                ? "Wij ontwerpen en installeren hoogrendements systemen die perfect passen bij uw dak. Bekijk onze projecten in heel Nederland."
                : "We design and install high-efficiency systems tailored to your roof. Explore our projects across the Netherlands."}
            </p>
          </Reveal>
          <Reveal delay={300}>
            <Link
              href="/contact?service=zonnepanelen"
              className="inline-flex items-center gap-3 px-8 py-4 bg-brand text-white text-sm font-extrabold uppercase tracking-[0.2em] rounded-full hover:bg-brand-deep transition-colors duration-300 shadow-md shadow-brand/20 group/btn"
            >
              <span>{nl ? "Vraag Maatwerk Offerte" : "Request Custom Quote"}</span>
              <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </Reveal>
        </div>

        <div className="relative w-full">
          <Reveal delay={400}>
            <LeafletMap />
          </Reveal>

          {/* Overlay text for the map bottom */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none w-full px-8 flex justify-center">
            <div className="bg-ink/90 px-6 py-3 rounded-full border border-white/10 shadow-2xl">
              <p className="text-[10px] md:text-xs font-extrabold text-white uppercase tracking-[0.3em] whitespace-nowrap">
                {nl ? "Geïnstalleerd in heel Nederland" : "Installed across the Netherlands"} · <span className="text-brand">{nl ? "Lokaal Vakmanschap" : "Local Craftsmanship"}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
