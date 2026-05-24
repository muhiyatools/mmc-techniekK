"use client";

import { useState } from "react";
import Link from "next/link";
import Reveal from "../../_ui/Reveal";

interface MaintenanceTab {
  id: string;
  name: string;
  title: string;
  price: string;
  frequency: string;
  desc: string;
  checklist: string[];
}

const maintenanceTabs: MaintenanceTab[] = [
  {
    id: "airco",
    name: "Airconditioning",
    title: "Airco Service & Reiniging",
    price: "",
    frequency: "Jaarlijks onderhoud aanbevolen",
    desc: "Voor een schone werking en optimaal rendement.",
    checklist: [
      "Reiniging en desinfectie van de binnenunit filters",
      "Controle en reiniging van de condensor (buitenunit)",
      "Meting van de koelmiddeldruk en controle op lekkages",
      "Inspectie van de condenswaterafvoer en pompwerking",
      "Meting van de uitblaastemperatuur en stroomopname",
      "Rapportage en aanbevelingen voor levensduur"
    ]
  },
  {
    id: "solar",
    name: "Zonnepanelen",
    title: "Zonnepanelen Inspectie & Reiniging",
    price: "",
    frequency: "Elke 2 jaar aanbevolen",
    desc: "Maximaliseer opbrengst en controleer de veiligheid.",
    checklist: [
      "Visuele inspectie op hotspots, glasbreuk en delaminatie",
      "Controle van de bekabeling onder de panelen en connectoren",
      "Reiniging met osmosewater (geen kalkvlekken) en zachte borstels",
      "Inspectie en firmware-update van de omvormer / micro-omvormers",
      "Meting van de stringspanningen en isolatieweerstand",
      "Controle van de montagestructuur en dakbevestiging"
    ]
  },
  {
    id: "battery",
    name: "Thuisbatterij",
    title: "Thuisbatterij & Batterij-diagnose",
    price: "",
    frequency: "Jaarlijkse keuring aanbevolen",
    desc: "Controleer de batterijgezondheid en het laadgedrag.",
    checklist: [
      "Uitlezen van de batterij-management-systeem (BMS) foutlogboeken",
      "Meting van de individuele celbalancering en capaciteitsafname",
      "Inspectie van de DC-schakelaars en zekeringen",
      "Controle van ventilatiekanalen en thermische controle",
      "Firmware-update naar de nieuwste AI-sturing voor tarieven",
      "Functionele test van de back-up stroomvoorziening"
    ]
  },
  {
    id: "meterkast",
    name: "Meterkast",
    title: "Meterkast NEN-3140 Veiligheidsinspectie",
    price: "",
    frequency: "Elke 5 jaar aanbevolen",
    desc: "Voorkom brandgevaar en controleer alle componenten.",
    checklist: [
      "Thermografische scan op oververhitting van componenten",
      "Controle van de aandraaimomenten van alle schroefverbindingen",
      "Test van de uitschakeltijd en uitschakelstroom van aardlekschakelaars",
      "Meting van de aardleidingweerstand",
      "Inspectie op stof, vocht en correcte kabelgeleiding",
      "NEN-3140 keuringsrapport met officieel certificaat"
    ]
  },
  {
    id: "electro",
    name: "Elektra onder de motorkap",
    title: "Smart Home & Infrastructuur Inspectie",
    price: "",
    frequency: "Jaarlijks onderhoud aanbevolen",
    desc: "Volledige inspectie van uw slimme systemen.",
    checklist: [
      "Controle van de communicatiebus (KNX / Modbus) kabels en voedingen",
      "Inspectie van laadpaal-connectoren en load balancing meting",
      "Controle van de warmtepomp-regelmodule en sensorkalibratie",
      "Test van relais en dimmers op correct functioneren",
      "Controle van back-up batterijvoedingen (UPS) van slimme systemen",
      "Software- en beveiligingsupdates van centrale controllers"
    ]
  }
];

export default function MaintenancePlanner() {
  const [activeTabId, setActiveTabId] = useState("airco");

  const activeTab = maintenanceTabs.find((t) => t.id === activeTabId) || maintenanceTabs[0];

  return (
    <div className="w-full text-ink">
      {/* Service Header */}
      <div className="compact-service-header mb-16 relative overflow-hidden bg-white/20 backdrop-blur-md border border-hairline rounded-3xl p-8 lg:p-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full -mr-32 -mt-32 blur-[100px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-12">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand/8 border border-brand/20 text-brand text-xs font-black uppercase tracking-[0.2em] mb-4">
              Service & Nazorg
            </span>
            <h2 className="font-display font-black text-3xl md:text-5xl lg:text-6xl text-ink leading-[0.9] tracking-[-0.03em] uppercase mb-4">
              Professioneel Onderhoud
            </h2>
            <p className="text-sm text-muted/80 leading-relaxed font-medium">
              Periodieke inspectie en service van uw technische installaties.
            </p>
          </div>
          <Link href={`/contact?service=onderhoud&type=${activeTab.name}`} className="px-10 py-5 md:px-14 md:py-6 bg-brand text-sm lg:text-base font-black uppercase tracking-[0.25em] text-white rounded-full hover:bg-ink transition-all duration-500 text-center shadow-2xl hover:shadow-brand/40 hover:-translate-y-1 shrink-0">
            Plan Direct Onderhoud
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-start">
        {/* Left Column: Vertical tabs - lg:col-span-4 */}
        <Reveal className="lg:col-span-4 w-full">
          <div className="bg-white/40 border border-hairline p-6 rounded-3xl space-y-2">
            <span className="text-micro font-black tracking-widest text-brand uppercase mb-4 block">Installatietype</span>
            {maintenanceTabs.map((tab) => {
              const isActive = tab.id === activeTabId;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`w-full text-left px-5 py-4 text-sm font-black uppercase tracking-wider rounded-2xl border transition-all duration-300 ${
                    isActive 
                      ? "bg-brand text-white border-brand shadow-lg shadow-brand/10" 
                      : "bg-transparent text-ink border-transparent hover:bg-concrete"
                  }`}
                >
                  {tab.name}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Right Column: Tab Content - lg:col-span-8 */}
        <Reveal delay={150} className="lg:col-span-8 w-full">
          <div className="bg-white/40 border border-hairline p-8 lg:p-10 rounded-3xl relative">
            <div className="border-b border-hairline pb-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                <h3 className="font-display font-black text-2xl lg:text-3xl uppercase tracking-tight text-ink">{activeTab.title}</h3>
              </div>
              <p className="text-sm text-muted/75 font-semibold leading-relaxed mb-4">{activeTab.desc}</p>
              <div className="flex items-center gap-2 text-xs font-black text-brand uppercase tracking-widest">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{activeTab.frequency}</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <span className="text-micro font-black tracking-widest text-ink uppercase mb-2 block">Inbegrepen Werkzaamheden:</span>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeTab.checklist.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 bg-white/60 border border-hairline/60 rounded-xl">
                    <svg className="w-5 h-5 text-brand shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs lg:text-sm font-medium text-ink leading-tight">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <p className="text-xs text-muted/60 font-medium">
                U ontvangt na afloop een servicerapport.
              </p>
              <Link
                href={`/contact?service=onderhoud&type=${activeTab.name}`}
                className="px-10 py-5 bg-ink text-sm font-black uppercase tracking-[0.25em] text-white rounded-full hover:bg-brand transition-all duration-500 text-center shadow-lg"
              >
                Inplannen & Afspraak Maken
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
