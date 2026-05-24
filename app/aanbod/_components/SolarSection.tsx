"use client";

import { useState } from "react";
import Link from "next/link";
import Reveal from "../../_ui/Reveal";

interface CityNode {
  name: string;
  projects: number;
  x: number; // percentage cx
  y: number; // percentage cy
  desc: string;
}

const cityNodes: CityNode[] = [
  { name: "Oudewater (HQ)", projects: 877, x: 215, y: 310, desc: "Onze thuisbasis met de hoogste dichtheid aan systemen." },
  { name: "Woerden", projects: 609, x: 235, y: 300, desc: "Talloze woningen verduurzaamd in samenwerking met lokale initiatieven." },
  { name: "Utrecht", projects: 1255, x: 270, y: 295, desc: "Grootschalige warmtepomp- en zonnepaneelcombinaties." },
  { name: "Amsterdam", projects: 1342, x: 220, y: 220, desc: "Zowel monumentale panden als nieuwbouw voorzien van maatwerk solar." },
  { name: "Rotterdam", projects: 551, x: 175, y: 340, desc: "Moderne daken met geavanceerde oost-west opstellingen." },
  { name: "Den Haag", projects: 1383, x: 145, y: 300, desc: "Maximale opbrengsten aan de kustlijn." },
  { name: "Breda", projects: 384, x: 190, y: 395, desc: "Particuliere verduurzaming en thuisbatterijen." },
  { name: "Eindhoven", projects: 215, x: 275, y: 430, desc: "High-tech installaties met slimme energiebeheersystemen." },
  { name: "Maastricht", projects: 494, x: 300, y: 520, desc: "Duurzame renovaties in het heuvelland." },
  { name: "Zwolle", projects: 1236, x: 375, y: 200, desc: "Veelzijdige zonnepaneelsystemen op boerderijen en woningen." },
  { name: "Enschede", projects: 1051, x: 440, y: 240, desc: "Efficiënte systemen met micro-omvormers." },
  { name: "Groningen", projects: 295, x: 430, y: 60, desc: "Noordelijke zonne-energieprojecten." },
  { name: "Leeuwarden", projects: 352, x: 350, y: 70, desc: "Gerealiseerde projecten in Friesland." }
];

// Connection lines to draw the "netwerk" mesh
const connections = [
  [0, 1], [0, 2], [1, 2], [3, 0], [3, 1], [4, 0], [4, 1], [5, 4], [5, 3],
  [6, 4], [6, 0], [7, 6], [7, 2], [8, 7], [9, 2], [9, 3], [10, 9], [11, 9],
  [12, 11], [12, 9]
];

export default function SolarSection() {
  const [panelCount, setPanelCount] = useState(12);
  const [activeCity, setActiveCity] = useState<CityNode | null>(null);

  // Math for 2D roof simulator
  const wpPerPanel = 435; // modern A-brand panel wattage
  const systemWp = panelCount * wpPerPanel;
  const annualYieldKwh = Math.round(systemWp * 0.9); // 90% efficiency factor in NL
  const co2SavingsKg = Math.round(annualYieldKwh * 0.35); // 0.35 kg CO2 per kWh
  const annualFinancialSavings = Math.round(annualYieldKwh * 0.30); // €0.30/kWh average savings
  const estInvestment = panelCount * 410 + 1350; // realistic installation price

  // Generate 2D panel layout grid
  const cols = Math.ceil(Math.sqrt(panelCount * 1.5));
  const rows = Math.ceil(panelCount / cols);
  
  // Create an array representing the panels, filled with blank or active states
  const panelsArray = Array.from({ length: rows * cols }, (_, i) => i < panelCount);

  return (
    <div className="w-full text-ink">
      {/* Editorial Header */}
      <div className="compact-service-header mb-16 relative overflow-hidden bg-white/20 backdrop-blur-md border border-hairline rounded-3xl p-8 lg:p-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full -mr-32 -mt-32 blur-[100px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-12">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand/8 border border-brand/20 text-brand text-xs font-black uppercase tracking-[0.25em] mb-4">
              Zonne-Energie
            </span>
            <h2 className="font-display font-black text-3xl md:text-5xl lg:text-6xl text-ink leading-[0.9] tracking-[-0.03em] uppercase mb-4">
              Maatwerk Zonnepanelen
            </h2>
            <p className="text-base lg:text-lg text-muted/80 leading-relaxed font-medium">
              Geen standaard pakketten, maar een op maat ontworpen legplan. Optimaliseer uw dak met 2D design, A-kwaliteit panelen (Trina & Jinko) en premium micro-omvormers (Enphase).
            </p>
          </div>
          <Link href="/contact?service=zonnepanelen" className="px-10 py-5 md:px-14 md:py-6 bg-brand text-sm lg:text-base font-black uppercase tracking-[0.25em] text-white rounded-full hover:bg-ink transition-all duration-500 text-center shadow-2xl hover:shadow-brand/40 hover:-translate-y-1 shrink-0">
            Ontvang Legplan & Offerte
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 mb-20 items-start">
        {/* Left Column: 2D Configurator */}
        <Reveal>
          <div className="bg-white/40 border border-hairline p-8 lg:p-10 rounded-3xl relative">
            <div className="mb-8">
              <span className="text-micro font-black tracking-widest text-brand uppercase block mb-2">Stap 1: Dakconfigurator</span>
              <h3 className="font-display font-black text-xl lg:text-2xl uppercase tracking-tight">Interactief Legplan</h3>
              <p className="text-sm text-muted/70 mt-1">Versleep de schuifregelaar om panelen op het dak te configureren.</p>
            </div>

            {/* Visual 2D Roof representation */}
            <div className="relative aspect-[16/10] bg-concrete/60 border border-hairline/80 rounded-2xl overflow-hidden mb-8 flex flex-col items-center justify-center p-6 shadow-inner">
              {/* Grid background for technical blueprint feeling */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />
              
              {/* The House Roof Structure */}
              <div className="relative w-4/5 h-4/5 bg-slate-700/10 border-2 border-slate-700/20 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-800/10 to-slate-800/5" />
                <div className="absolute top-0 inset-x-0 h-4 bg-slate-800/20 border-b border-slate-800/10" /> {/* Roof ridge */}
                <div className="absolute bottom-0 inset-x-0 h-2 bg-slate-800/30" /> {/* Gutter */}

                {/* 2D centered solar panel layout grid */}
                <div 
                  className="relative z-10 grid gap-1.5 p-4 transition-all duration-500"
                  style={{
                    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                    maxHeight: "85%",
                    maxWidth: "85%",
                  }}
                >
                  {panelsArray.map((isActive, idx) => (
                    <div
                      key={idx}
                      className={`aspect-[1/1.6] rounded-sm transition-all duration-500 border ${
                        isActive
                          ? "bg-gradient-to-br from-slate-900 via-brand-deep/80 to-slate-900 border-slate-400/50 shadow-md scale-100 opacity-100 relative group/panel"
                          : "border-transparent scale-90 opacity-0 pointer-events-none"
                      }`}
                    >
                      {isActive && (
                        <>
                          {/* Solar grid lines overlay */}
                          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:8px_8px]" />
                          {/* Shiny specular light effect */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-60 pointer-events-none" />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Panel Slider */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-ink uppercase tracking-wider">Aantal Panelen:</span>
                <span className="text-2xl font-display font-black text-brand tabular-nums">{panelCount} stuks</span>
              </div>
              <input
                type="range"
                min="4"
                max="24"
                step="2"
                value={panelCount}
                onChange={(e) => setPanelCount(parseInt(e.target.value))}
                className="w-full h-1.5 bg-hairline rounded-lg appearance-none cursor-pointer accent-brand transition-all focus:outline-none"
              />
              <div className="flex items-center justify-between text-xs text-muted font-black uppercase mt-2">
                <span>Min: 4 panelen</span>
                <span>Max: 24 panelen</span>
              </div>
            </div>

            {/* Calculations Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 pt-8 border-t border-hairline">
              <div>
                <span className="text-xs text-muted font-black uppercase tracking-wider block mb-1">Systeemvermogen</span>
                <span className="text-xl font-display font-black text-ink tabular-nums">{(systemWp / 1000).toFixed(2)} kWp</span>
              </div>
              <div>
                <span className="text-xs text-muted font-black uppercase tracking-wider block mb-1">Jaaropbrengst</span>
                <span className="text-xl font-display font-black text-ink tabular-nums">{annualYieldKwh.toLocaleString("nl-NL")} kWh</span>
              </div>
              <div>
                <span className="text-xs text-muted font-black uppercase tracking-wider block mb-1">Besparing / jr</span>
                <span className="text-xl font-display font-black text-brand tabular-nums">€{annualFinancialSavings.toLocaleString("nl-NL")}</span>
              </div>
              <div>
                <span className="text-xs text-muted font-black uppercase tracking-wider block mb-1">CO₂-Reductie</span>
                <span className="text-xl font-display font-black text-ink tabular-nums">{co2SavingsKg.toLocaleString("nl-NL")} kg</span>
              </div>
              <div>
                <span className="text-xs text-muted font-black uppercase tracking-wider block mb-1">Terugverdientijd</span>
                <span className="text-xl font-display font-black text-ink tabular-nums">± 5.2 jaar</span>
              </div>
              <div>
                <span className="text-xs text-muted font-black uppercase tracking-wider block mb-1">Investering (est.)</span>
                <span className="text-xl font-display font-black text-ink tabular-nums">€{estInvestment.toLocaleString("nl-NL")}</span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Right Column: Stylized Constellation Map */}
        <Reveal delay={150}>
          <div className="bg-white/40 border border-hairline p-8 lg:p-10 rounded-3xl relative">
            <div className="mb-8">
              <span className="text-micro font-black tracking-widest text-brand uppercase block mb-2">Stap 2: Gerealiseerde Projecten</span>
              <h3 className="font-display font-black text-xl lg:text-2xl uppercase tracking-tight">Zonnepanelen in de Regio</h3>
              <p className="text-sm text-muted/70 mt-1">Beweeg over de actieve netwerkknooppunten om onze projecten per stad te zien.</p>
            </div>

            {/* Stylized network SVG map of Netherlands */}
            <div className="relative w-full aspect-[1/1.15] bg-concrete/50 border border-hairline/80 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center p-4">
              {/* blueprint tech pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1.5px,transparent_1.5px)] bg-[size:20px_20px] opacity-35" />
              
              <svg viewBox="0 0 500 560" className="w-full h-full relative z-10 overflow-visible">
                {/* SVG Connections between nearby project cities */}
                {connections.map(([a, b], idx) => {
                  const nodeA = cityNodes[a];
                  const nodeB = cityNodes[b];
                  return (
                    <line
                      key={idx}
                      x1={nodeA.x}
                      y1={nodeA.y}
                      x2={nodeB.x}
                      y2={nodeB.y}
                      stroke="color-mix(in oklch, var(--color-brand) 18%, transparent)"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                    />
                  );
                })}

                {/* SVG nodes */}
                {cityNodes.map((city, idx) => {
                  const active = activeCity?.name === city.name;
                  return (
                    <g 
                      key={idx} 
                      className="cursor-pointer group/node"
                      onMouseEnter={() => setActiveCity(city)}
                      onMouseLeave={() => setActiveCity(null)}
                    >
                      {/* Active pulsing focus halo */}
                      <circle
                        cx={city.x}
                        cy={city.y}
                        r={active ? 20 : 12}
                        className="fill-brand/10 stroke-brand/20 transition-all duration-300 animate-pulse"
                        strokeWidth={1}
                      />
                      {/* Main Node Point */}
                      <circle
                        cx={city.x}
                        cy={city.y}
                        r={active ? 8 : 5}
                        className="fill-brand stroke-white transition-all duration-300"
                        strokeWidth={1.5}
                      />
                      {/* Brand blue glowing outline */}
                      <circle
                        cx={city.x}
                        cy={city.y}
                        r={active ? 14 : 0}
                        className="fill-transparent stroke-brand/40 animate-ping duration-1000"
                        strokeWidth={1}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Dynamic city details overlay card */}
              <div className="absolute bottom-6 inset-x-6 bg-white/95 border border-hairline/80 p-5 rounded-xl shadow-xl backdrop-blur-md transition-all duration-300 z-20 min-h-[100px]">
                {activeCity ? (
                  <div className="animate-fade-in">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-ink text-base">{activeCity.name}</span>
                      <span className="px-2.5 py-0.5 bg-brand/10 border border-brand/25 text-brand text-xs font-black rounded-full uppercase tracking-wider tabular-nums">
                        {activeCity.projects} Projecten
                      </span>
                    </div>
                    <p className="text-xs text-muted/90 leading-relaxed font-medium">{activeCity.desc}</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-2">
                    <svg className="w-5 h-5 text-brand/40 mb-2 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                    <span className="text-xs text-muted/60 font-semibold uppercase tracking-wider">
                      Beweeg uw muis over een knooppunt voor projectgegevens
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
