"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import Reveal from "../../_ui/Reveal";

// Load LeafletMap dynamically with SSR disabled to prevent window is not defined error
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] rounded-3xl bg-concrete animate-pulse flex items-center justify-center border-2 border-hairline/50">
      <span className="text-sm text-muted font-bold uppercase tracking-wider">Kaart laden...</span>
    </div>
  )
});

export default function SolarSection() {
  return (
    <div className="w-full text-ink">
      <div className="relative rounded-[2.5rem] overflow-hidden border-2 border-brand/20 shadow-2xl shadow-brand/5 bg-white mb-16 group">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-aurora-1 via-brand to-aurora-2 z-20" />
        
        <div className="relative z-10 flex flex-col items-center text-center px-8 py-16 lg:py-24 border-b border-hairline/50 bg-concrete/30">
          <Reveal>
            <span className="inline-block px-5 py-2 rounded-full bg-brand/10 border border-brand/20 text-brand text-[12px] font-black uppercase tracking-[0.35em] mb-8">
              Zonne-Energie Specialist
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="font-display font-black text-[clamp(2.5rem,6vw,5.5rem)] text-ink leading-[0.85] tracking-[-0.04em] uppercase mb-10">
              Maatwerk <span className="text-brand">Solar Solutions</span>
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-lg md:text-2xl text-muted font-medium leading-relaxed mb-16 max-w-2xl mx-auto">
              Wij ontwerpen en installeren hoogrendements systemen die perfect passen bij uw dak. Bekijk onze projecten in heel Nederland.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <Link 
              href="/contact?service=zonnepanelen" 
              className="inline-flex items-center gap-6 px-16 py-8 bg-brand text-white text-lg md:text-xl font-black uppercase tracking-[0.25em] rounded-full hover:bg-ink transition-all duration-500 shadow-2xl shadow-brand/40 group/btn hover:-translate-y-2 active:translate-y-0"
            >
              <span>Vraag Maatwerk Offerte</span>
              <svg className="w-8 h-8 transition-transform duration-500 group-hover/btn:translate-x-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M17 8l4 4m0 0l-4 4m4-4H3" />
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
            <div className="bg-ink/90 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-2xl">
              <p className="text-[10px] md:text-xs font-black text-white uppercase tracking-[0.3em] whitespace-nowrap">
                Geïnstalleerd in heel Nederland · <span className="text-brand">Lokaal Vakmanschap</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
