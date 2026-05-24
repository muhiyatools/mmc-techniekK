"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import Reveal from "../../_ui/Reveal";

// Load LeafletMap dynamically with SSR disabled to prevent window is not defined error
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] rounded-2xl bg-concrete animate-pulse flex items-center justify-center">
      <span className="text-sm text-muted font-bold uppercase tracking-wider">Kaart laden...</span>
    </div>
  )
});

export default function SolarSection() {
  return (
    <div className="w-full text-ink">
      <Reveal>
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <span className="inline-block px-3.5 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-black uppercase tracking-[0.2em] mb-3">
              Zonne-Energie
            </span>
            <h2 className="font-display font-black text-2xl md:text-4xl lg:text-5xl text-ink leading-tight uppercase tracking-tight">
              Projecten in de Regio
            </h2>
            <p className="text-sm text-muted/75 mt-1.5 font-medium max-w-xl">
              Circa 2000 succesvolle installaties in Oudewater en omgeving.
            </p>
          </div>
          <Link href="/contact?service=zonnepanelen" className="px-8 py-4 bg-brand text-xs font-black uppercase tracking-[0.2em] text-white rounded-full hover:bg-ink transition-all duration-300 text-center shadow-md shrink-0 self-start sm:self-auto">
            Vraag Offerte Aan
          </Link>
        </div>
      </Reveal>

      <Reveal delay={100}>
        <div className="w-full mt-6">
          <LeafletMap />
        </div>
      </Reveal>
    </div>
  );
}
