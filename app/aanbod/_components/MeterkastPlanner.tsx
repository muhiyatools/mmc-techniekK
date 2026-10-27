"use client";

import { useState } from "react";
import Link from "next/link";
import Reveal from "../../_ui/Reveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface Option {
  id: string;
  name: string;
  price: number;
  desc: string;
  requiredFor?: string;
}

const getOptions = (nl: boolean): Option[] => [
  {
    id: "threePhase",
    name: nl ? "3-Fase Aansluiting Upgrade" : "3-Phase Connection Upgrade",
    price: 350,
    desc: nl
      ? "Noodzakelijk voor warmtepompen, laadpalen en systemen met >16 panelen."
      : "Required for heat pumps, EV chargers and systems with more than 16 panels.",
  },
  {
    id: "induction",
    name: nl ? "Kookgroep (Inductie)" : "Cooking Circuit (Induction)",
    price: 180,
    desc: nl
      ? "Veilige aansluiting speciaal voor elektrisch koken."
      : "A dedicated, safe circuit for electric cooking.",
  },
  {
    id: "solarGroup",
    name: nl ? "Zonnepanelen Groep" : "Solar Panel Circuit",
    price: 150,
    desc: nl
      ? "Aparte groep met geschikte aardlekschakelaar voor de omvormer."
      : "A separate circuit with a suitable residual-current device for the inverter.",
  },
  {
    id: "surge",
    name: nl ? "Overspanningsbeveiliging" : "Surge Protection",
    price: 150,
    desc: nl
      ? "Beschermt al uw huishoudelijke apparaten tegen blikseminslag."
      : "Protects all your household appliances against lightning strikes.",
  },
];

export default function MeterkastPlanner() {
  const { language } = useLanguage();
  const nl = language === "nl";
  const baseOptions = getOptions(nl);

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
      <div className="compact-service-header mb-16 relative overflow-hidden border border-hairline rounded-3xl p-8 lg:p-12">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-12">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand/8 border border-brand/20 text-brand-ink text-xs font-extrabold uppercase tracking-[0.2em] mb-4">
              {nl ? "Elektrische Installaties" : "Electrical Systems"}
            </span>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl lg:text-6xl text-ink leading-[0.9] tracking-[-0.03em] uppercase mb-4">
              {nl ? "Meterkast & Groepenkasten" : "Fuse Boxes & Distribution Panels"}
            </h2>
            <p className="text-base lg:text-lg text-muted/80 leading-relaxed font-medium">
              {nl
                ? "Uw meterkast is het hart van uw verduurzamingsproject. Wij vervangen en breiden groepenkasten uit met gecertificeerde Hager-componenten, klaar voor de belastingen van de toekomst."
                : "Your fuse box is the heart of every sustainability project. We replace and expand distribution panels with certified Hager components, ready for the loads of the future."}
            </p>
          </div>
          <Link href={`/contact?service=meterkast&details=${selected.join(",")}`} className="px-10 py-5 md:px-14 md:py-6 bg-brand text-sm lg:text-base font-extrabold uppercase tracking-[0.25em] text-white rounded-full hover:bg-ink transition-all duration-500 text-center shadow-2xl hover:shadow-brand/40 hover:-translate-y-1 shrink-0">
            {nl ? "Vraag Vakkundige Offerte" : "Request Expert Quote"}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 mb-20 items-start">
        {/* Left Column: Visual Fuse Box - xl:col-span-5 */}
        <Reveal className="xl:col-span-5 w-full">
          <div className="bg-white/40 border border-hairline p-8 rounded-3xl flex flex-col items-center">
            <span className="text-micro font-extrabold tracking-widest text-brand-ink uppercase mb-6 block self-start">{nl ? "Visualisatie" : "Visualisation"}</span>

            {/* The Fuse Box Visual */}
            <div className="w-full max-w-[280px] bg-slate-900 border-4 border-slate-800 rounded-2xl p-6 shadow-2xl relative">
              {/* Brand Label */}
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 mb-6">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Hager · NEN 1010</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse motion-reduce:animate-none" />
              </div>

              {/* Main breaker section */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 mb-6 flex justify-between items-center">
                <span className="text-xs text-slate-300 font-bold uppercase">{nl ? "Hoofdschakelaar" : "Main Switch"}</span>
                <div className="w-8 h-10 bg-slate-700 border border-slate-600 rounded flex flex-col justify-between p-1.5 relative shadow-inner">
                  <div className="w-full h-1 bg-red-600 rounded-sm" />
                  <div className="w-full h-3 bg-red-700 rounded-sm shadow-md cursor-pointer hover:bg-red-600 transition-colors" />
                </div>
              </div>

              {/* Fuse switch rows */}
              <div className="space-y-4">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">{nl ? "Groepen" : "Circuits"} ({totalSwitches})</span>
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
                {nl ? "Visualisatie past zich aan uw selectie aan" : "The visualisation adapts to your selection"}
              </span>
            </div>
          </div>
        </Reveal>

        {/* Right Column: Planner Options - xl:col-span-7 */}
        <Reveal delay={150} className="xl:col-span-7 w-full">
          <div className="bg-white/40 border border-hairline p-8 lg:p-10 rounded-3xl">
            <div className="mb-6">
              <span className="text-xs font-extrabold tracking-widest text-brand-ink uppercase block mb-2">{nl ? "Stap 2: Configureren" : "Step 2: Configure"}</span>
              <h3 className="font-display font-extrabold text-xl lg:text-2xl uppercase tracking-tight">{nl ? "Kies uw Upgrades" : "Choose Your Upgrades"}</h3>
            </div>

            {/* Checklist options */}
            <div className="space-y-4 mb-8">
              {baseOptions.map((opt) => {
                const active = selected.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleToggle(opt.id)}
                    aria-pressed={active}
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
                        <span className="text-xs font-extrabold text-brand-ink tabular-nums">+ €{opt.price}</span>
                      </div>
                      <p className="text-xs text-muted/70 leading-relaxed">{opt.desc}</p>
                    </div>
                  </button>
                );
              })}

              {/* Extra groups counter */}
              <div className="p-4 rounded-2xl border border-hairline bg-transparent flex items-center justify-between gap-6">
                <div>
                  <span className="font-bold text-ink text-sm lg:text-base block mb-1">{nl ? "Extra Groepen" : "Extra Circuits"}</span>
                  <p className="text-xs text-muted/70">{nl ? "Extra groepen voor zware huishoudelijke apparatuur." : "Extra circuits for heavy household appliances."}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0 bg-concrete border border-hairline p-1.5 rounded-xl">
                  <button
                    onClick={() => setExtraGroups(prev => Math.max(0, prev - 1))}
                    aria-label={nl ? "Eén groep minder" : "One circuit fewer"}
                    className="w-8 h-8 rounded-lg bg-white border border-hairline flex items-center justify-center font-bold text-ink hover:text-brand-ink transition-colors text-lg"
                  >
                    <span aria-hidden="true">-</span>
                  </button>
                  <span className="text-lg font-display font-extrabold text-ink w-6 text-center tabular-nums" aria-live="polite">{extraGroups}</span>
                  <button
                    onClick={() => setExtraGroups(prev => Math.min(8, prev + 1))}
                    aria-label={nl ? "Eén groep meer" : "One circuit more"}
                    className="w-8 h-8 rounded-lg bg-white border border-hairline flex items-center justify-center font-bold text-ink hover:text-brand-ink transition-colors text-lg"
                  >
                    <span aria-hidden="true">+</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Price block */}
            <div className="pt-8 border-t border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <span className="text-xs text-muted font-extrabold uppercase tracking-wider block mb-1">{nl ? "Richtprijs (incl. montage & BTW)" : "Indicative price (incl. installation & VAT)"}</span>
                <span className="text-3xl lg:text-4xl font-display font-extrabold text-brand-ink tabular-nums">€{totalPrice.toLocaleString("nl-NL")}</span>
              </div>
              <Link
                href={`/contact?service=meterkast&config=${selected.join(",")}&groups=${extraGroups}&price=${totalPrice}`}
                className="px-10 py-5 bg-ink text-sm font-extrabold uppercase tracking-[0.2em] text-white rounded-full hover:bg-brand transition-all duration-500 text-center shadow-lg"
              >
                {nl ? "Vraag Offerte Aan" : "Request a Quote"}
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
