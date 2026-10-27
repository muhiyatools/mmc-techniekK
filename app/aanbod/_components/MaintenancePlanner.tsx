"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Reveal from "../../_ui/Reveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface MaintenanceTab {
  id: string;
  keywords: string[]; // language-independent, for deep-link matching
  name: string;
  title: string;
  frequency: string;
  desc: string;
  checklist: string[];
}

const getTabs = (nl: boolean): MaintenanceTab[] => [
  {
    id: "airco",
    keywords: ["airco", "airconditioning"],
    name: nl ? "Airconditioning" : "Air Conditioning",
    title: nl ? "Airco Service & Reiniging" : "Air Conditioning Service & Cleaning",
    frequency: nl ? "Jaarlijks onderhoud aanbevolen" : "Annual maintenance recommended",
    desc: nl ? "Voor een schone werking en optimaal rendement." : "For clean operation and optimal efficiency.",
    checklist: nl
      ? [
          "Reiniging en desinfectie van de binnenunit filters",
          "Controle en reiniging van de condensor (buitenunit)",
          "Meting van de koelmiddeldruk en controle op lekkages",
          "Inspectie van de condenswaterafvoer en pompwerking",
          "Meting van de uitblaastemperatuur en stroomopname",
          "Rapportage en aanbevelingen voor levensduur",
        ]
      : [
          "Cleaning and disinfection of the indoor unit filters",
          "Inspection and cleaning of the condenser (outdoor unit)",
          "Measuring refrigerant pressure and checking for leaks",
          "Inspection of the condensate drain and pump operation",
          "Measuring the outlet temperature and current draw",
          "Report and recommendations for service life",
        ],
  },
  {
    id: "solar",
    keywords: ["solar", "zonne", "zonnepanelen"],
    name: nl ? "Zonnepanelen" : "Solar Panels",
    title: nl ? "Zonnepanelen Inspectie & Reiniging" : "Solar Panel Inspection & Cleaning",
    frequency: nl ? "Elke 2 jaar aanbevolen" : "Recommended every 2 years",
    desc: nl ? "Maximaliseer opbrengst en controleer de veiligheid." : "Maximise yield and verify safety.",
    checklist: nl
      ? [
          "Visuele inspectie op hotspots, glasbreuk en delaminatie",
          "Controle van de bekabeling onder de panelen en connectoren",
          "Reiniging met osmosewater (geen kalkvlekken) en zachte borstels",
          "Inspectie en firmware-update van de omvormer / micro-omvormers",
          "Meting van de stringspanningen en isolatieweerstand",
          "Controle van de montagestructuur en dakbevestiging",
        ]
      : [
          "Visual inspection for hotspots, glass breakage and delamination",
          "Checking the wiring beneath the panels and the connectors",
          "Cleaning with osmosis water (no lime stains) and soft brushes",
          "Inspection and firmware update of the inverter / micro-inverters",
          "Measuring string voltages and insulation resistance",
          "Checking the mounting structure and roof fastening",
        ],
  },
  {
    id: "battery",
    keywords: ["batterij", "battery", "thuisbatterij"],
    name: nl ? "Thuisbatterij" : "Home Battery",
    title: nl ? "Thuisbatterij & Batterij-diagnose" : "Home Battery & Battery Diagnostics",
    frequency: nl ? "Jaarlijkse keuring aanbevolen" : "Annual inspection recommended",
    desc: nl ? "Controleer de batterijgezondheid en het laadgedrag." : "Check battery health and charging behaviour.",
    checklist: nl
      ? [
          "Uitlezen van de batterij-management-systeem (BMS) foutlogboeken",
          "Meting van de individuele celbalancering en capaciteitsafname",
          "Inspectie van de DC-schakelaars en zekeringen",
          "Controle van ventilatiekanalen en thermische controle",
          "Firmware-update naar de nieuwste AI-sturing voor tarieven",
          "Functionele test van de back-up stroomvoorziening",
        ]
      : [
          "Reading the battery management system (BMS) error logs",
          "Measuring individual cell balancing and capacity loss",
          "Inspection of the DC switches and fuses",
          "Checking ventilation channels and thermal control",
          "Firmware update to the latest AI tariff control",
          "Functional test of the back-up power supply",
        ],
  },
  {
    id: "meterkast",
    keywords: ["meterkast", "fuse box"],
    name: nl ? "Meterkast" : "Fuse Box",
    title: nl ? "Meterkast NEN-3140 Veiligheidsinspectie" : "Fuse Box NEN-3140 Safety Inspection",
    frequency: nl ? "Elke 5 jaar aanbevolen" : "Recommended every 5 years",
    desc: nl ? "Voorkom brandgevaar en controleer alle componenten." : "Prevent fire hazards and check all components.",
    checklist: nl
      ? [
          "Thermografische scan op oververhitting van componenten",
          "Controle van de aandraaimomenten van alle schroefverbindingen",
          "Test van de uitschakeltijd en uitschakelstroom van aardlekschakelaars",
          "Meting van de aardleidingweerstand",
          "Inspectie op stof, vocht en correcte kabelgeleiding",
          "NEN-3140 keuringsrapport met officieel certificaat",
        ]
      : [
          "Thermographic scan for overheating of components",
          "Checking the torque of all screw connections",
          "Testing the trip time and trip current of residual-current devices",
          "Measuring the earth conductor resistance",
          "Inspection for dust, moisture and correct cable routing",
          "NEN-3140 inspection report with an official certificate",
        ],
  },
  {
    id: "electro",
    keywords: ["elektra", "electro", "elektro", "electrical"],
    name: nl ? "Elektra onderhoud" : "Electrical Maintenance",
    title: nl ? "Elektra Onderhoud & Inspectie" : "Electrical Maintenance & Inspection",
    frequency: nl ? "Jaarlijks onderhoud aanbevolen" : "Annual maintenance recommended",
    desc: nl
      ? "Volledige inspectie van uw elektrische installatie en slimme systemen."
      : "Complete inspection of your electrical installation and smart systems.",
    checklist: nl
      ? [
          "Controle van de groepenkast en aardlekschakelaars",
          "Inspectie van laadpaal-connectoren en load balancing meting",
          "Testen van rookmelders en noodverlichting (indien aanwezig)",
          "Test van relais en dimmers op correct functioneren",
          "Controle van back-up batterijvoedingen (UPS) van slimme systemen",
          "NEN-3140 veiligheidsmetingen aan kritieke circuits",
        ]
      : [
          "Checking the distribution panel and residual-current devices",
          "Inspection of EV-charger connectors and load-balancing measurement",
          "Testing smoke detectors and emergency lighting (if present)",
          "Testing relays and dimmers for correct operation",
          "Checking back-up battery supplies (UPS) of smart systems",
          "NEN-3140 safety measurements on critical circuits",
        ],
  },
];

export default function MaintenancePlanner() {
  const { language } = useLanguage();
  const nl = language === "nl";
  const maintenanceTabs = getTabs(nl);

  const [activeTabId, setActiveTabId] = useState("airco");
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const typeParam = searchParams?.get("type")?.toLowerCase() ?? null;

  useEffect(() => {
    if (typeParam) {
      const match = maintenanceTabs.find((t) =>
        t.keywords.some((k) => typeParam.includes(k) || k.includes(typeParam))
      );
      if (match) setActiveTabId(match.id);
    }
    // maintenanceTabs is recreated each render; match only depends on typeParam.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeParam]);

  const activeTab = maintenanceTabs.find((t) => t.id === activeTabId) || maintenanceTabs[0];

  return (
    <div className="w-full text-ink">
      {/* Service Header */}
      <div className="compact-service-header mb-16 relative overflow-hidden border border-hairline rounded-3xl p-8 lg:p-12">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-12">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand/8 border border-brand/20 text-brand-ink text-xs font-extrabold uppercase tracking-[0.2em] mb-4">
              {nl ? "Service & Nazorg" : "Service & Aftercare"}
            </span>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl lg:text-6xl text-ink leading-[0.9] tracking-[-0.03em] uppercase mb-4">
              {nl ? "Professioneel Onderhoud" : "Professional Maintenance"}
            </h2>
            <p className="text-sm text-muted/80 leading-relaxed font-medium">
              {nl
                ? "Periodieke inspectie en service van uw technische installaties."
                : "Periodic inspection and service of your technical installations."}
            </p>
          </div>
          <Link href={`/contact?service=onderhoud&type=${activeTab.id}`} className="px-10 py-5 md:px-14 md:py-6 bg-brand text-sm lg:text-base font-extrabold uppercase tracking-[0.25em] text-white rounded-full hover:bg-ink transition-all duration-500 text-center shadow-2xl hover:shadow-brand/40 hover:-translate-y-1 shrink-0">
            {nl ? "Plan Direct Onderhoud" : "Schedule Maintenance Now"}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-start">
        {/* Left Column: Vertical tabs - lg:col-span-4 */}
        <Reveal className="lg:col-span-4 w-full">
          <div className="bg-white/40 border border-hairline p-6 rounded-3xl space-y-2" role="tablist" aria-label={nl ? "Installatietype" : "Installation type"}>
            <span className="text-micro font-extrabold tracking-widest text-brand-ink uppercase mb-4 block">{nl ? "Installatietype" : "Installation Type"}</span>
            {maintenanceTabs.map((tab) => {
              const isActive = tab.id === activeTabId;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`maint-panel-${tab.id}`}
                  id={`maint-tab-${tab.id}`}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`w-full text-left px-5 py-4 text-sm font-extrabold uppercase tracking-wider rounded-2xl border transition-all duration-300 ${
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
          <div
            className="bg-white/40 border border-hairline p-8 lg:p-10 rounded-3xl relative"
            role="tabpanel"
            id={`maint-panel-${activeTab.id}`}
            aria-labelledby={`maint-tab-${activeTab.id}`}
          >
            <div className="border-b border-hairline pb-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                <h3 className="font-display font-extrabold text-2xl lg:text-3xl uppercase tracking-tight text-ink">{activeTab.title}</h3>
              </div>
              <p className="text-sm text-muted/75 font-semibold leading-relaxed mb-4">{activeTab.desc}</p>
              <div className="flex items-center gap-2 text-xs font-extrabold text-brand-ink uppercase tracking-widest">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{activeTab.frequency}</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <span className="text-micro font-extrabold tracking-widest text-ink uppercase mb-2 block">{nl ? "Inbegrepen Werkzaamheden:" : "Included Work:"}</span>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeTab.checklist.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 bg-white/60 border border-hairline/60 rounded-xl">
                    <svg className="w-5 h-5 text-brand-ink shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs lg:text-sm font-medium text-ink leading-tight">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <p className="text-xs text-muted/60 font-medium">
                {nl ? "U ontvangt na afloop een servicerapport." : "You receive a service report afterwards."}
              </p>
              <Link
                href={`/contact?service=onderhoud&type=${activeTab.id}`}
                className="px-10 py-5 bg-ink text-sm font-extrabold uppercase tracking-[0.25em] text-white rounded-full hover:bg-brand transition-all duration-500 text-center shadow-lg"
              >
                {nl ? "Inplannen & Afspraak Maken" : "Schedule & Book Appointment"}
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
