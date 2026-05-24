"use client";

import { useState } from "react";
import Link from "next/link";
import Reveal from "../../_ui/Reveal";

interface Option {
  id: string;
  name: string;
  price: number;
  desc: string;
  requiredFor?: string;
}

const baseOptions: Option[] = [
  { id: "threePhase", name: "3-Fase Aansluiting Upgrade", price: 350, desc: "Noodzakelijk voor warmtepompen, laadpalen en systemen met >16 panelen." },
  { id: "induction", name: "Kookgroep (Inductie)", price: 180, desc: "Veilige aansluiting speciaal voor elektrisch koken." },
  { id: "solarGroup", name: "Zonnepanelen Groep", price: 150, desc: "Aparte groep met geschikte aardlekschakelaar voor de omvormer." },
  { id: "surge", name: "Overspanningsbeveiliging", price: 150, desc: "Beschermt al uw huishoudelijke apparaten tegen blikseminslag." },
];

export default function MeterkastPlanner() {
  const [selected, setSelected] = useState<string[]>(["threePhase"]);
  const [extraGroups, setExtraGroups] = useState(2);

  const basePrice = 1150; // standard replacement cost (box + basic groups)
  const optionPrice = baseOptions
    .filter((o) => selected.includes(o.id))
    .reduce((sum, o) => sum + o.price, 0);
  const groupsPrice = extraGroups * 120;
  const totalPrice = basePrice + optionPrice + groupsPrice;

  const handleToggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Determine active switches for visual fuse box
  const totalSwitches = 8 + extraGroups + (selected.includes("induction") ? 2 : 0) + (selected.includes("solarGroup") ? 1 : 0);

  return (
    <div className="w-full text-ink">
      {/* Service Header */}
      <div className="compact-service-header mb-16 relative overflow-hidden bg-white/20 backdrop-blur-md border border-hairline rounded-3xl p-8 lg:p-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full -mr-32 -mt-32 blur-[100px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-12">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand/8 border border-brand/20 text-brand text-xs font-black uppercase tracking-[0.2em] mb-4">
              Elektrische Installaties
            </span>
            <h2 className="font-display font-black text-3xl md:text-5xl lg:text-6xl text-ink leading-[0.9] tracking-[-0.03em] uppercase mb-4">
              Meterkast & Groepenkasten
            </h2>
            <p className="text-base lg:text-lg text-muted/80 leading-relaxed font-medium">
              Uw meterkast is het hart van uw verduurzamingsproject. Wij vervangen en breiden groepenkasten uit met gecertificeerde Hager-componenten, klaar voor de belastingen van de toekomst.
            </p>
          </div>
          <Link href={`/contact?service=meterkast&details=${selected.join(",")}`} className="px-10 py-5 md:px-14 md:py-6 bg-brand text-sm lg:text-base font-black uppercase tracking-[0.25em] text-white rounded-full hover:bg-ink transition-all duration-500 text-center shadow-2xl hover:shadow-brand/40 hover:-translate-y-1 shrink-0">
            Vraag Vakkundige Offerte
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 mb-20 items-start">
        {/* Left Column: Visual Fuse Box - xl:col-span-5 */}
        <Reveal className="xl:col-span-5 w-full">
          <div className="bg-white/40 border border-hairline p-8 rounded-3xl flex flex-col items-center">
            <span className="text-micro font-black tracking-widest text-brand uppercase mb-6 block self-start">Visualisatie</span>
            
            {/* The Fuse Box Visual */}
            <div className="w-full max-w-[280px] bg-slate-900 border-4 border-slate-800 rounded-2xl p-6 shadow-2xl relative">
              {/* Brand Label */}
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 mb-6">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Hager · NEN 1010</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {/* Main breaker section */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 mb-6 flex justify-between items-center">
                <span className="text-xs text-slate-300 font-bold uppercase">Hoofdschakelaar</span>
                <div className="w-8 h-10 bg-slate-700 border border-slate-600 rounded flex flex-col justify-between p-1.5 relative shadow-inner">
                  <div className="w-full h-1 bg-red-600 rounded-sm" />
                  <div className="w-full h-3 bg-red-700 rounded-sm shadow-md cursor-pointer hover:bg-red-600 transition-colors" />
                </div>
              </div>

              {/* Fuse switch rows */}
              <div className="space-y-4">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Groepen ({totalSwitches})</span>
                <div className="grid grid-cols-6 gap-2 bg-slate-800/20 border border-slate-700/30 p-3 rounded-xl min-h-[140px]">
                  {Array.from({ length: 12 }).map((_, idx) => {
                    const isOccupied = idx < totalSwitches;
                    return (
                      <div 
                        key={idx} 
                        className={`h-16 rounded border flex flex-col justify-between items-center p-1 transition-all duration-500 ${
                          isOccupied 
                            ? "bg-slate-800 border-slate-600 shadow-md" 
                            : "bg-slate-950/20 border-slate-800/40"
                        }`}
                      >
                        {isOccupied ? (
                          <>
                            <div className="text-[9px] text-slate-500 font-bold">G{idx+1}</div>
                            {/* Toggle switch */}
                            <div className="w-3.5 h-7 bg-slate-900 border border-slate-700 rounded flex flex-col justify-between p-0.5 relative shadow-inner">
                              <div className="w-full h-2.5 bg-emerald-500 rounded-sm shadow" />
                              <div className="w-full h-2 bg-slate-800 rounded-sm" />
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full bg-slate-900/10 rounded-sm" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-8 text-center w-full">
              <span className="text-xs text-muted/60 font-semibold uppercase tracking-wider block">
                Visualisatie past zich aan uw selectie aan
              </span>
            </div>
          </div>
        </Reveal>

        {/* Right Column: Planner Options - xl:col-span-7 */}
        <Reveal delay={150} className="xl:col-span-7 w-full">
          <div className="bg-white/40 border border-hairline p-8 lg:p-10 rounded-3xl">
            <div className="mb-6">
              <span className="text-xs font-black tracking-widest text-brand uppercase block mb-2">Stap 2: Configureren</span>
              <h3 className="font-display font-black text-xl lg:text-2xl uppercase tracking-tight">Kies uw Upgrades</h3>
            </div>

            {/* Checklist options */}
            <div className="space-y-4 mb-8">
              {baseOptions.map((opt) => {
                const active = selected.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleToggle(opt.id)}
                    className={`w-full flex items-start gap-4 p-4 rounded-2xl border text-left transition-all duration-300 ${
                      active 
                        ? "bg-brand/5 border-brand/30 shadow-lg shadow-brand/5" 
                        : "bg-transparent border-hairline hover:bg-concrete hover:border-brand/10"
                    }`}
                  >
                    <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${active ? "bg-brand border-brand" : "border-muted/30"}`}>
                      {active && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-ink text-sm lg:text-base leading-none">{opt.name}</span>
                        <span className="text-xs font-black text-brand tabular-nums">+ €{opt.price}</span>
                      </div>
                      <p className="text-xs text-muted/70 leading-relaxed">{opt.desc}</p>
                    </div>
                  </button>
                );
              })}

              {/* Extra groups counter */}
              <div className="p-4 rounded-2xl border border-hairline bg-transparent flex items-center justify-between gap-6">
                <div>
                  <span className="font-bold text-ink text-sm lg:text-base block mb-1">Extra Groepen</span>
                  <p className="text-xs text-muted/70">Extra groepen voor zware huishoudelijke apparatuur.</p>
                </div>
                <div className="flex items-center gap-4 shrink-0 bg-concrete border border-hairline p-1.5 rounded-xl">
                  <button 
                    onClick={() => setExtraGroups(prev => Math.max(0, prev - 1))}
                    className="w-8 h-8 rounded-lg bg-white border border-hairline flex items-center justify-center font-bold text-ink hover:text-brand transition-colors text-lg"
                  >
                    -
                  </button>
                  <span className="text-lg font-display font-black text-ink w-6 text-center tabular-nums">{extraGroups}</span>
                  <button 
                    onClick={() => setExtraGroups(prev => Math.min(8, prev + 1))}
                    className="w-8 h-8 rounded-lg bg-white border border-hairline flex items-center justify-center font-bold text-ink hover:text-brand transition-colors text-lg"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Price block */}
            <div className="pt-8 border-t border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <span className="text-xs text-muted font-black uppercase tracking-wider block mb-1">Richtprijs (incl. montage & BTW)</span>
                <span className="text-3xl lg:text-4xl font-display font-black text-brand tabular-nums">€{totalPrice.toLocaleString("nl-NL")}</span>
              </div>
              <Link
                href={`/contact?service=meterkast&config=${selected.join(",")}&groups=${extraGroups}&price=${totalPrice}`}
                className="px-10 py-5 bg-ink text-sm font-black uppercase tracking-[0.2em] text-white rounded-full hover:bg-brand transition-all duration-500 text-center shadow-lg"
              >
                Vraag Offerte Aan
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
