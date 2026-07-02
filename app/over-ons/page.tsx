"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { testimonials, certifications as certData } from "@/lib/data";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { fetchAdminStore } from "@/lib/adminStore";
import Reveal from "@/app/_ui/Reveal";
import HairlineDivider from "@/app/_ui/HairlineDivider";

function useParallax(speed = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const handleScroll = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const winH = window.innerHeight;
    if (rect.top < winH && rect.bottom > 0) {
      const pct = (winH - rect.top) / (winH + rect.height);
      setOffset((pct - 0.5) * speed * 60);
    }
  }, [speed]);
  useEffect(() => {
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onScroll = () => requestAnimationFrame(handleScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [handleScroll]);
  return { ref, offset };
}

type SystemKey = "solar" | "battery" | "pump" | "airco" | "electrics";

export default function AboutPage() {
  const { t, language } = useLanguage();
  const m = t.pages.overOns;
  const [adminSettings, setAdminSettings] = useState<Record<string, string> | null>(null);
  const heroParallax = useParallax(0.25);
  const [activePillar, setActivePillar] = useState<number>(0);
  const [activeMilestone, setActiveMilestone] = useState<number>(0);
  const [hoveredSystem, setHoveredSystem] = useState<SystemKey>("solar");

  useEffect(() => {
    fetchAdminStore().then(store => {
      setAdminSettings(store.settings ?? {});
    }).catch(() => {});
  }, []);

  const heroTitleKey = language === "nl" ? "about_hero_title_nl" : "about_hero_title_en";
  const heroDescKey = language === "nl" ? "about_hero_desc_nl" : "about_hero_desc_en";
  const heroTitle = adminSettings?.[heroTitleKey] ?? m.title;
  const heroDesc = adminSettings?.[heroDescKey] ?? m.description;

  const statsData: [string, string][] = [
    ["16+", m.stats[0]?.label || (language === "nl" ? "jaar ervaring" : "years experience")],
    ["2.500+", m.stats[1]?.label || (language === "nl" ? "projecten" : "projects")],
    ["100%", m.stats[2]?.label || (language === "nl" ? "eigen personeel" : "in-house team")],
    ["A-Merk", m.stats[3]?.label || (language === "nl" ? "kwaliteit" : "quality")],
  ];

  // System details data for the blueprint section
  const systemsData: Record<SystemKey, { title: string; quote: string; text: string; color: string; rgb: string }> = {
    solar: {
      title: language === "nl" ? "Zonnepanelen (Generatie)" : "Solar Panels (Generation)",
      quote: language === "nl" ? "Maximale opbrengst via geoptimiseerde dakinstallaties." : "Maximum yield through optimized rooftop installations.",
      text: language === "nl" 
        ? "MMC Techniek levert en installeert hoogwaardige zonnepanelen van betrouwbare A-merken. Geen standaardpakketten, maar een installatie die nauwkeurig is berekend op uw daksituatie en stroomverbruik voor een optimaal rendement."
        : "MMC Techniek supplies and installs premium solar panels from trusted A-brands. No standard packages, but an installation precisely engineered for your specific roof layout and power consumption for maximum efficiency.",
      color: "text-amber-400",
      rgb: "250, 204, 21"
    },
    battery: {
      title: language === "nl" ? "Thuisbatterijen (Opslag)" : "Home Batteries (Storage)",
      quote: language === "nl" ? "Uw eigen opgewekte zonne-energie dag en nacht beschikbaar." : "Your self-generated solar energy available day and night.",
      text: language === "nl" 
        ? "Sla uw overtollige zonnestroom op voor gebruik tijdens de avond- en nachturen. Met een slimme thuisbatterij verhoogt u uw zelfconsumptie, verlaagt u uw afhankelijkheid van het net en bent u voorbereid op dynamische energietarieven."
        : "Store your excess solar power for use during evening and night hours. With a smart home battery, you increase your self-consumption, reduce grid dependency, and prepare for dynamic energy tariffs.",
      color: "text-emerald-400",
      rgb: "52, 211, 153"
    },
    pump: {
      title: language === "nl" ? "Warmtepompen (Verwarming)" : "Heat Pumps (Heating)",
      quote: language === "nl" ? "Duurzaam en gasloos verwarmen met maximaal rendement." : "Sustainable and gas-free heating with maximum efficiency.",
      text: language === "nl" 
        ? "De basis voor een toekomstbestendige woning. Wij adviseren, ontwerpen en installeren zowel hybride systemen als all-electric warmtepompen. Volledig afgestemd op de isolatiewaarde van uw woning en uw comfortwensen."
        : "The foundation of a future-proof home. We advise, design, and install both hybrid systems and all-electric heat pumps, fully customized to your home's insulation and comfort needs.",
      color: "text-orange-400",
      rgb: "251, 146, 60"
    },
    airco: {
      title: language === "nl" ? "Airconditioning (Klimaatbeheersing)" : "Air Conditioning (Climate Control)",
      quote: language === "nl" ? "Stille, energiezuinige koeling én verwarming in elk seizoen." : "Quiet, energy-efficient cooling and heating in any season.",
      text: language === "nl" 
        ? "Moderne airconditioningsystemen bieden het hele jaar door comfort: ze koelen op warme zomerdagen en verwarmen uiterst efficiënt in de winter. Onze fluisterstille units worden vakkundig en met oog voor detail gemonteerd."
        : "Modern air conditioning systems offer year-round comfort: cooling on hot summer days and highly efficient heating in winter. Our whisper-quiet units are professionally installed with an eye for detail.",
      color: "text-cyan-400",
      rgb: "34, 211, 238"
    },
    electrics: {
      title: language === "nl" ? "Elektrotechniek & Meterkast (Distributie)" : "Electrical Systems & Fuse Boxes (Distribution)",
      quote: language === "nl" ? "De veilige, moderne basis voor al uw duurzame systemen." : "The safe, modern foundation for all your sustainable systems.",
      text: language === "nl" 
        ? "Een goed functionerende en veilige meterkast is essentieel voor uw warmtepomp, zonnepanelen, laadpaal of thuisbatterij. Wij vernieuwen, breiden uit en certificeren uw elektrische installatie volgens de strengste NEN 1010 normen."
        : "A well-functioning and safe electrical panel is essential for your heat pump, solar panels, EV charger, or home battery. We upgrade, expand, and certify your electrical installation according to strict NEN 1010 standards.",
      color: "text-indigo-400",
      rgb: "129, 140, 248"
    }
  };

  // SVG Icons for the 8 reasons
  const getIconForReason = (index: number) => {
    const icons = [
      // 0: Experience (Star badge)
      <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
      </svg>,
      // 1: Projects (Building check)
      <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5v3m-3-12h.008v.008H12 9v-.008Zm0 3h.008v.008H12 9v-.008Z" />
      </svg>,
      // 2: Team (Wrench & Hammer)
      <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766l.002-.001a3.005 3.005 0 0 0 1.9-1.9l.001-.003c.14-.468.382-.89.766-1.208l3.03-2.496m-12.42 9.4-4.887 4.887a3.075 3.075 0 1 1-4.35-4.35L7.05 11.42m4.37 4.37a3.075 3.075 0 0 0-4.37-4.37m4.37 4.37-2.185-2.185M7.05 11.42 2.874 7.245a3.075 3.075 0 0 1 4.183-4.183L11.23 7.24m-4.18 4.18 2.185 2.185" />
      </svg>,
      // 3: Advice (Chat support)
      <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025 8.286 8.286 0 0 1-1.402-1.402C3.168 16.142 2.5 14.15 2.5 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
      </svg>,
      // 4: Materials (Shield check)
      <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>,
      // 5: Detail (Target scope)
      <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M12 9.75A2.25 2.25 0 1 0 12 14.25 2.25 2.25 0 0 0 12 9.75Z" />
      </svg>,
      // 6: Transparency (Document check)
      <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>,
      // 7: Service (Support Headset)
      <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v-2.15a8.25 8.25 0 0 0-16.5 0v2.15a3.25 3.25 0 0 0 3 3h.5a1.25 1.25 0 0 0 1.25-1.25v-3.5A1.25 1.25 0 0 0 7.25 9h-2.125A6.75 6.75 0 0 1 18.875 9H16.75a1.25 1.25 0 0 0-1.25 1.25v3.5a1.25 1.25 0 0 0 1.25 1.25h.5a3.25 3.25 0 0 0 3-3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v.75a2 2 0 0 1-2 2H5" />
      </svg>,
    ];
    return icons[index] || icons[0];
  };

  return (
    <>
      <div className="pt-[104px] lg:pt-[114px]">
        {/* ── Hero ── */}
        <section className="relative min-h-[75vh] flex items-center bg-ink overflow-hidden">
          <div ref={heroParallax.ref} className="absolute inset-0" style={{ transform: `translateY(${heroParallax.offset}px)` }}>
            <Image src="/images/solarbackground.webp" alt="" fill className="object-cover opacity-20 lg:opacity-25 scale-105" priority />
            <div className="absolute inset-0 bg-gradient-to-b from-ink/65 via-ink/90 to-ink" />
          </div>

          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-aurora-1 via-brand to-aurora-2 animate-[aurora-drift_18s_linear_infinite] bg-[length:200%_100%] opacity-60" />

          <div className="relative w-full max-w-[1280px] mx-auto px-6 lg:px-10 py-16 lg:py-24 z-10">
            <div className="max-w-4xl lg:max-w-[1000px]">
              <Reveal threshold={0.3}>
                <span className="text-[0.75rem] lg:text-[0.875rem] font-black uppercase tracking-[0.35em] text-brand mb-6 block">
                  {m.label}
                </span>
              </Reveal>

              <Reveal delay={100} threshold={0.3}>
                <h1 
                  className="font-display text-[clamp(2.75rem,8vw,7.5rem)] lg:text-[clamp(4.5rem,7vw,8.5rem)] font-black leading-[0.95] tracking-tight text-white mb-8 uppercase text-wrap-balance"
                  dangerouslySetInnerHTML={{ __html: heroTitle.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
                />
              </Reveal>

              <Reveal delay={200} threshold={0.3}>
                <p className="text-[clamp(1.15rem,1.8vw,1.5rem)] text-white/75 font-medium leading-relaxed max-w-3xl mb-16">
                  {heroDesc}
                </p>
              </Reveal>

              <Reveal delay={300} threshold={0.3}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 lg:p-12 shadow-2xl">
                  {statsData.map(([val, label]) => (
                    <div key={`stat-${label}`} className="text-center md:text-left">
                      <div className="font-display text-[clamp(2.5rem,4vw,4.5rem)] font-black text-white tabular-nums leading-none tracking-tighter">
                        {val}
                      </div>
                      <p className="text-[0.6875rem] lg:text-[0.75rem] font-bold text-brand uppercase tracking-[0.2em] mt-3">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-aurora-2/40 via-brand/20 to-aurora-1/40" />
        </section>

        {/* ── Who We Are (Three Pillars of Quality) ── */}
        <section className="py-24 lg:py-40 bg-bg relative">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
            <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
              <div className="lg:col-span-5 lg:sticky lg:top-40">
                <Reveal>
                  <span className="text-[0.75rem] lg:text-[0.875rem] font-black uppercase tracking-[0.3em] text-muted/50 mb-6 block">
                    {language === "nl" ? "Wie we zijn" : "Who we are"}
                  </span>
                </Reveal>
                <Reveal delay={100}>
                  <h2 className="font-display text-[clamp(2.5rem,4.5vw,4.5rem)] font-black leading-[0.9] tracking-tight text-ink mb-8 uppercase">
                    {m.intro.title}
                  </h2>
                </Reveal>
                <Reveal delay={200}>
                  <div className="flex flex-col gap-4 mt-8">
                    {[
                      { title: language === "nl" ? "Persoonlijk & Betrouwbaar" : "Personal & Reliable", desc: m.intro.p1 },
                      { title: language === "nl" ? "Echt Vakmanschap" : "True Craftsmanship", desc: m.intro.p2 },
                      { title: language === "nl" ? "Alles In Eigen Beheer" : "Fully In-House", desc: m.intro.p3 }
                    ].map((pill, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActivePillar(idx)}
                        className={`text-left p-6 rounded-2xl transition-all duration-300 border ${
                          activePillar === idx
                            ? "bg-white border-brand shadow-lg shadow-brand/5 translate-x-2"
                            : "bg-transparent border-transparent hover:bg-white/50 hover:border-hairline"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className={`font-display text-lg font-black transition-colors ${activePillar === idx ? "text-brand" : "text-muted"}`}>
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <span className={`font-display text-lg font-black uppercase tracking-wider transition-colors ${activePillar === idx ? "text-ink" : "text-copy/70"}`}>
                            {pill.title}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </Reveal>
              </div>

              <div className="lg:col-span-7 bg-white border border-hairline/40 rounded-3xl p-8 lg:p-12 shadow-xl min-h-[350px] flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-2xl" />
                <div className="transition-all duration-500 ease-out transform opacity-100 translate-y-0">
                  <p className="text-xl lg:text-2xl text-copy leading-relaxed font-medium">
                    {[m.intro.p1, m.intro.p2, m.intro.p3][activePillar]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Mission (Sustainable Energy Flow Blueprint) ── */}
        <section className="py-24 lg:py-40 bg-ink text-white relative overflow-hidden">
          {/* Ambient Blueprint Grids */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#gridPattern)" />
            </svg>
          </div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/5 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/35 to-transparent" />

          <div className="max-w-[1280px] mx-auto px-6 lg:px-10 relative z-10">
            <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">
              
              {/* Left Column: Mission text & Dynamic System Detail */}
              <div className="lg:col-span-6">
                <Reveal>
                  <span className="text-[0.75rem] lg:text-[0.875rem] font-black uppercase tracking-[0.3em] text-brand mb-6 block">
                    {m.mission.label}
                  </span>
                </Reveal>

                <Reveal delay={100}>
                  <h2 
                    className="font-display text-[clamp(2.5rem,4.5vw,4rem)] font-black leading-[0.9] tracking-tight uppercase mb-8"
                    dangerouslySetInnerHTML={{ __html: m.mission.title.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
                  />
                </Reveal>

                <Reveal delay={180}>
                  <p className="text-lg lg:text-xl text-white/70 leading-relaxed mb-12 font-medium">
                    {m.mission.description}
                  </p>
                </Reveal>

                {/* System Detail Dashboard (Swaps based on blueprint hotspot hover) */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
                  {/* Glowing active bar */}
                  <div 
                    className="absolute top-0 left-0 bottom-0 w-1.5 transition-colors duration-500" 
                    style={{ backgroundColor: `rgba(${systemsData[hoveredSystem].rgb}, 1)` }}
                  />
                  
                  <div className="pl-4">
                    <span 
                      className={`text-[0.6875rem] font-black uppercase tracking-[0.3em] transition-colors duration-500`}
                      style={{ color: `rgba(${systemsData[hoveredSystem].rgb}, 1)` }}
                    >
                      {language === "nl" ? "Systeemonderdeel" : "System Component"}
                    </span>
                    <h3 className="font-display text-2xl lg:text-3xl font-black uppercase text-white mt-2 mb-3 tracking-tight">
                      {systemsData[hoveredSystem].title}
                    </h3>
                    <p 
                      className="text-base font-bold italic mb-6 leading-snug transition-colors duration-500"
                      style={{ color: `rgba(${systemsData[hoveredSystem].rgb}, 0.85)` }}
                    >
                      &ldquo;{systemsData[hoveredSystem].quote}&rdquo;
                    </p>
                    <p className="text-white/70 leading-relaxed font-medium">
                      {systemsData[hoveredSystem].text}
                    </p>
                  </div>
                </div>

                {/* Micro selector buttons for mobile / screen readers */}
                <div className="flex flex-wrap gap-3 mt-6 lg:hidden">
                  {(Object.keys(systemsData) as SystemKey[]).map((key) => (
                    <button 
                      key={key}
                      onClick={() => setHoveredSystem(key)}
                      className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-full transition-all border ${
                        hoveredSystem === key 
                          ? "bg-white text-ink border-white" 
                          : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {systemsData[key].title.split(" (")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Architectural House Blueprint SVG */}
              <div className="lg:col-span-6 flex justify-center items-center">
                <Reveal variant="scale" className="w-full max-w-lg aspect-[4/3] bg-ink/40 border border-white/5 rounded-3xl p-6 lg:p-8 shadow-2xl relative">
                  
                  <svg viewBox="0 0 400 300" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Blueprint grid lines */}
                    <defs>
                      <pattern id="blueprintGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.03" />
                      </pattern>
                    </defs>
                    <rect width="400" height="300" fill="url(#blueprintGrid)" rx="16" />

                    {/* Conduit links (Conduit Lines) */}
                    {/* Solar -> Meterkast */}
                    <path 
                      d="M 130 70 L 130 110 L 140 110 L 140 215" 
                      stroke={hoveredSystem === "solar" || hoveredSystem === "electrics" ? `rgba(${systemsData.solar.rgb}, 0.8)` : "rgba(255,255,255,0.06)"}
                      strokeWidth={hoveredSystem === "solar" || hoveredSystem === "electrics" ? 2.5 : 1}
                      strokeDasharray={hoveredSystem === "solar" || hoveredSystem === "electrics" ? "6, 4" : "4, 4"}
                      className={hoveredSystem === "solar" || hoveredSystem === "electrics" ? "animate-[dash_1.5s_linear_infinite]" : ""}
                      fill="none"
                      style={{ transition: "stroke 0.4s, stroke-width 0.4s" }}
                    />

                    {/* Solar -> Battery */}
                    <path 
                      d="M 130 70 L 130 110 L 95 110 L 95 215" 
                      stroke={hoveredSystem === "solar" || hoveredSystem === "battery" ? `rgba(${systemsData.battery.rgb}, 0.8)` : "rgba(255,255,255,0.06)"}
                      strokeWidth={hoveredSystem === "solar" || hoveredSystem === "battery" ? 2.5 : 1}
                      strokeDasharray={hoveredSystem === "solar" || hoveredSystem === "battery" ? "6, 4" : "4, 4"}
                      className={hoveredSystem === "solar" || hoveredSystem === "battery" ? "animate-[dash_1.5s_linear_infinite]" : ""}
                      fill="none"
                      style={{ transition: "stroke 0.4s, stroke-width 0.4s" }}
                    />

                    {/* Battery -> Meterkast */}
                    <path 
                      d="M 95 215 L 140 215" 
                      stroke={hoveredSystem === "battery" || hoveredSystem === "electrics" ? `rgba(${systemsData.battery.rgb}, 0.8)` : "rgba(255,255,255,0.06)"}
                      strokeWidth={hoveredSystem === "battery" || hoveredSystem === "electrics" ? 2.5 : 1}
                      strokeDasharray={hoveredSystem === "battery" || hoveredSystem === "electrics" ? "6, 4" : "4, 4"}
                      className={hoveredSystem === "battery" || hoveredSystem === "electrics" ? "animate-[dash_1.5s_linear_infinite]" : ""}
                      fill="none"
                      style={{ transition: "stroke 0.4s, stroke-width 0.4s" }}
                    />

                    {/* Meterkast -> Airco */}
                    <path 
                      d="M 140 215 L 140 180 L 260 180 L 260 145" 
                      stroke={hoveredSystem === "airco" || hoveredSystem === "electrics" ? `rgba(${systemsData.airco.rgb}, 0.8)` : "rgba(255,255,255,0.06)"}
                      strokeWidth={hoveredSystem === "airco" || hoveredSystem === "electrics" ? 2.5 : 1}
                      strokeDasharray={hoveredSystem === "airco" || hoveredSystem === "electrics" ? "6, 4" : "4, 4"}
                      className={hoveredSystem === "airco" || hoveredSystem === "electrics" ? "animate-[dash_1.5s_linear_infinite]" : ""}
                      fill="none"
                      style={{ transition: "stroke 0.4s, stroke-width 0.4s" }}
                    />

                    {/* Meterkast -> Heat Pump */}
                    <path 
                      d="M 140 215 L 275 215" 
                      stroke={hoveredSystem === "pump" || hoveredSystem === "electrics" ? `rgba(${systemsData.pump.rgb}, 0.8)` : "rgba(255,255,255,0.06)"}
                      strokeWidth={hoveredSystem === "pump" || hoveredSystem === "electrics" ? 2.5 : 1}
                      strokeDasharray={hoveredSystem === "pump" || hoveredSystem === "electrics" ? "6, 4" : "4, 4"}
                      className={hoveredSystem === "pump" || hoveredSystem === "electrics" ? "animate-[dash_1.5s_linear_infinite]" : ""}
                      fill="none"
                      style={{ transition: "stroke 0.4s, stroke-width 0.4s" }}
                    />

                    {/* House Wireframe Drawing */}
                    {/* Roof left & right */}
                    <line x1="60" y1="110" x2="200" y2="30" stroke="white" strokeWidth="1" strokeOpacity="0.15" />
                    <line x1="200" y1="30" x2="340" y2="110" stroke="white" strokeWidth="1" strokeOpacity="0.15" />
                    {/* Outer walls */}
                    <line x1="80" y1="110" x2="80" y2="250" stroke="white" strokeWidth="1" strokeOpacity="0.1" />
                    <line x1="320" y1="110" x2="320" y2="250" stroke="white" strokeWidth="1" strokeOpacity="0.1" />
                    {/* Ceiling, floors */}
                    <line x1="80" y1="110" x2="320" y2="110" stroke="white" strokeWidth="1" strokeOpacity="0.1" />
                    <line x1="80" y1="180" x2="320" y2="180" stroke="white" strokeWidth="1" strokeOpacity="0.1" />
                    <line x1="80" y1="250" x2="320" y2="250" stroke="white" strokeWidth="1.2" strokeOpacity="0.25" />
                    {/* Internal Room Dividers */}
                    <line x1="200" y1="110" x2="200" y2="250" stroke="white" strokeWidth="1" strokeOpacity="0.08" />

                    {/* Solar Panel Framing Outline */}
                    <line x1="85" y1="95" x2="175" y2="45" stroke="white" strokeWidth="1.5" strokeOpacity="0.2" />
                    <line x1="85" y1="98" x2="175" y2="48" stroke="white" strokeWidth="1.5" strokeOpacity="0.2" />
                    {/* Panel divisions */}
                    <line x1="107" y1="83" x2="107" y2="86" stroke="white" strokeWidth="1" strokeOpacity="0.2" />
                    <line x1="130" y1="70" x2="130" y2="73" stroke="white" strokeWidth="1" strokeOpacity="0.2" />
                    <line x1="152" y1="57" x2="152" y2="60" stroke="white" strokeWidth="1" strokeOpacity="0.2" />

                    {/* Architectural Labels */}
                    <text x="85" y="105" fill="white" fillOpacity="0.25" fontSize="6" fontFamily="var(--font-barlow)">LVL. 01</text>
                    <text x="85" y="175" fill="white" fillOpacity="0.25" fontSize="6" fontFamily="var(--font-barlow)">LVL. 00</text>
                    <text x="210" y="120" fill="white" fillOpacity="0.15" fontSize="6" fontFamily="var(--font-barlow)">CLIMATE</text>
                    <text x="210" y="190" fill="white" fillOpacity="0.15" fontSize="6" fontFamily="var(--font-barlow)">COMBUSTION ROOM</text>
                    <text x="90" y="245" fill="white" fillOpacity="0.15" fontSize="6" fontFamily="var(--font-barlow)">STORAGE</text>

                    {/* Pulsing circles behind hotspots */}
                    {Object.keys(systemsData).map((key) => {
                      const sysKey = key as SystemKey;
                      const active = hoveredSystem === sysKey;
                      let coords = { x: 0, y: 0 };
                      if (sysKey === "solar") coords = { x: 130, y: 70 };
                      if (sysKey === "airco") coords = { x: 260, y: 145 };
                      if (sysKey === "battery") coords = { x: 95, y: 215 };
                      if (sysKey === "electrics") coords = { x: 140, y: 215 };
                      if (sysKey === "pump") coords = { x: 275, y: 215 };

                      return (
                        <g key={sysKey} className="cursor-pointer" onMouseEnter={() => setHoveredSystem(sysKey)} onClick={() => setHoveredSystem(sysKey)}>
                          {/* Outer pulse */}
                          <circle 
                            cx={coords.x} 
                            cy={coords.y} 
                            r={active ? 15 : 0} 
                            fill={`rgba(${systemsData[sysKey].rgb}, 0.15)`}
                            className={active ? "animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" : ""}
                            style={{ transition: "r 0.3s" }}
                          />
                          {/* Middle ring */}
                          <circle 
                            cx={coords.x} 
                            cy={coords.y} 
                            r={active ? 8 : 4} 
                            stroke={`rgba(${systemsData[sysKey].rgb}, 1)`} 
                            strokeWidth="1.5" 
                            fill="#0f172a" 
                            style={{ transition: "r 0.3s" }}
                          />
                          {/* Inner dot */}
                          <circle 
                            cx={coords.x} 
                            cy={coords.y} 
                            r="2" 
                            fill={`rgba(${systemsData[sysKey].rgb}, 1)`} 
                          />
                          
                          {/* Transparent hover catcher */}
                          <circle cx={coords.x} cy={coords.y} r="18" fill="transparent" />
                        </g>
                      );
                    })}
                  </svg>
                </Reveal>
              </div>

            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/35 to-transparent" />
          
          <style jsx global>{`
            @keyframes dash {
              to {
                stroke-dashoffset: -20;
              }
            }
          `}</style>
        </section>

        {/* ── Our Story (Ons Verhaal Timeline) ── */}
        <section className="py-24 lg:py-40 bg-bg relative">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
            <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">
              <div className="lg:col-span-5 order-2 lg:order-1">
                <Reveal>
                  <span className="text-[0.75rem] lg:text-[0.875rem] font-black uppercase tracking-[0.3em] text-muted/50 mb-6 block">
                    {m.story.label}
                  </span>
                </Reveal>
                <Reveal delay={100}>
                  <h2 
                    className="font-display text-[clamp(2.5rem,5.5vw,4.5rem)] font-black leading-[0.9] tracking-tight text-ink mb-12 uppercase"
                    dangerouslySetInnerHTML={{ __html: m.story.title.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
                  />
                </Reveal>

                {/* Staggered Timeline milestones */}
                <div className="relative pl-8 border-l-2 border-hairline/60 space-y-12">
                  {[
                    { year: "2008", title: language === "nl" ? "De Oprichting" : "The Founding", text: m.story.p1 },
                    { year: "2016", title: language === "nl" ? "Groei & Innovatie" : "Growth & Innovation", text: m.story.p2 },
                    { year: "2026", title: language === "nl" ? "MMC Vandaag" : "MMC Today", text: m.story.p3 },
                  ].map((mil, idx) => (
                    <div 
                      key={idx}
                      className="relative cursor-pointer group"
                      onMouseEnter={() => setActiveMilestone(idx)}
                      onClick={() => setActiveMilestone(idx)}
                    >
                      {/* Timeline Node dot */}
                      <span className={`absolute -left-[41px] top-1.5 w-6 h-6 rounded-full border-4 border-bg transition-all duration-300 ${
                        activeMilestone === idx ? "bg-brand scale-110 shadow-lg shadow-brand/40" : "bg-hairline"
                      }`} />

                      <div className="group-hover:translate-x-2 transition-transform duration-300">
                        <span className={`font-display text-xl font-black transition-colors ${activeMilestone === idx ? "text-brand" : "text-muted"}`}>
                          {mil.year}
                        </span>
                        <h4 className="font-display text-lg font-bold uppercase text-ink tracking-tight mt-1 mb-2">
                          {mil.title}
                        </h4>
                        <p className={`text-base leading-relaxed transition-colors duration-300 ${
                          activeMilestone === idx ? "text-copy font-medium" : "text-muted"
                        }`}>
                          {mil.text.substring(0, 110)}...
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stacked interactive gallery */}
              <div className="lg:col-span-6 lg:col-start-7 order-1 lg:order-2 flex justify-center items-center h-[380px] lg:h-[450px] relative">
                <Reveal variant="scale" className="w-full h-full flex justify-center items-center">
                  <div className="relative w-full aspect-[4/3] max-w-md h-[300px] lg:h-[380px]">
                    {[
                      "/images/projects/PHOTO-2024-12-03-12-54-01.jpg", 
                      "/images/projects/PHOTO-2024-12-08-15-05-58.jpg", 
                      "/images/projects/PHOTO-2024-12-08-15-05-59.jpg"  
                    ].map((src, i) => {
                      let style: React.CSSProperties = {};
                      if (i === activeMilestone) {
                        style = { transform: "scale(1.05) rotate(-2deg)", zIndex: 30, opacity: 1 };
                      } else if (i === (activeMilestone + 1) % 3) {
                        style = { transform: "scale(0.95) translate(25px, 20px) rotate(4deg)", zIndex: 20, opacity: 0.6 };
                      } else {
                        style = { transform: "scale(0.9) translate(-25px, 15px) rotate(-6deg)", zIndex: 10, opacity: 0.4 };
                      }
                      return (
                        <div 
                          key={src}
                          className="absolute inset-0 transition-all duration-700 ease-out rounded-2xl overflow-hidden shadow-2xl bg-ink border border-hairline/20"
                          style={style}
                        >
                          <Image src={src} alt="MMC Project" fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" />
                          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                          <div className="absolute bottom-6 left-6 right-6 text-white z-10">
                            <span className="text-[0.625rem] font-bold text-brand uppercase tracking-[0.25em]">
                              MMC Techniek
                            </span>
                            <p className="font-display font-bold uppercase text-sm tracking-wider mt-1">
                              {language === "nl" ? "Gerealiseerd project" : "Completed installation"}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ── Why MMC (Advantage Grid) ── */}
        <section className="py-24 lg:py-40 bg-white relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-hairline/50 to-transparent" />
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <Reveal>
                <span className="text-[0.75rem] lg:text-[0.875rem] font-black uppercase tracking-[0.3em] text-brand mb-6 block">
                  {m.whyChoose.label}
                </span>
              </Reveal>
              <Reveal delay={100}>
                <h2 
                  className="font-display text-[clamp(2.5rem,4.5vw,4.5rem)] font-black leading-[0.9] tracking-tight text-ink uppercase"
                  dangerouslySetInnerHTML={{ __html: m.whyChoose.title.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
                />
              </Reveal>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {m.whyChoose.reasons.map((item: any, i: number) => (
                <Reveal key={item.title} delay={i * 60} threshold={0.1}>
                  <div className="group h-full flex flex-col justify-between p-8 bg-bg border border-hairline/35 rounded-3xl hover:border-brand/40 hover:bg-white hover:shadow-2xl hover:shadow-brand/5 hover:-translate-y-1.5 transition-all duration-500">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-brand/5 text-brand flex items-center justify-center group-hover:bg-brand group-hover:text-white group-hover:shadow-lg group-hover:shadow-brand/20 transition-all duration-500 mb-8">
                        {getIconForReason(i)}
                      </div>
                      <h3 className="font-display text-xl font-bold uppercase text-ink tracking-tight mb-4 group-hover:text-brand transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-base text-copy/75 leading-relaxed font-medium">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="py-24 lg:py-40 bg-bg relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-hairline/50 to-transparent" />
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
            <Reveal>
              <span className="text-[0.75rem] lg:text-[0.875rem] font-black uppercase tracking-[0.3em] text-muted/50 mb-12 block">
                {m.testimonials.label}
              </span>
            </Reveal>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {testimonials.slice(0, 2).map((t, i) => (
                <Reveal key={t.name} threshold={0.15} delay={i * 100}>
                  <div className="relative p-10 lg:p-14 border border-hairline/40 transition-all duration-500 hover:border-brand/30 hover:shadow-2xl hover:shadow-brand/5 bg-white rounded-3xl">
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-aurora-1 via-brand/40 to-aurora-2 bg-[length:200%_100%] animate-[aurora-drift_18s_linear_infinite] rounded-t-3xl" />
                    <svg className="w-12 h-12 text-brand/10 mb-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z" />
                    </svg>
                    <p className="text-lg lg:text-xl text-copy/90 leading-relaxed font-bold mb-10 italic">
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center text-brand text-lg font-black shrink-0">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-lg font-black text-ink uppercase tracking-tight">
                          {t.name}
                        </p>
                        <p className="text-[0.6875rem] lg:text-[0.75rem] text-brand font-black uppercase tracking-[0.2em] mt-1">
                          {t.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <HairlineDivider draw aurora className="my-24 lg:my-36" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-16">
              <div className="max-w-xl">
                <Reveal>
                  <span className="text-[0.75rem] lg:text-[0.875rem] font-black uppercase tracking-[0.3em] text-muted/50 mb-4 block">
                    {m.certifications.label}
                  </span>
                </Reveal>
                <Reveal delay={100}>
                  <h3 className="font-display text-3xl lg:text-4xl font-black uppercase leading-tight text-ink mb-6">
                    {m.certifications.title}
                  </h3>
                </Reveal>
                <Reveal delay={200}>
                  <p className="text-base text-muted/95 leading-relaxed font-medium">
                    {language === "nl" 
                      ? "Bij MMC Techniek staat veiligheid en professionaliteit voorop. Wij zijn volledig gecertificeerd volgens de landelijke normen zodat u gegarandeerd bent van een veilige installatie."
                      : "Safety and professionalism are top priorities at MMC Techniek. We are fully certified according to national standards, guaranteeing you a safe and reliable installation."
                    }
                  </p>
                </Reveal>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                {certData.map((cert) => (
                  <Reveal key={cert.name} threshold={0.1}>
                    <div className="flex items-center gap-6 px-8 py-5 border border-hairline/40 hover:border-brand/40 transition-all duration-500 bg-white rounded-2xl shadow-lg shadow-brand/5 shrink-0">
                      <Image src={cert.src} alt={cert.name} width={40} height={40} className="object-contain shrink-0" />
                      <div>
                        <p className="text-base font-black text-ink uppercase tracking-tight">{cert.name}</p>
                        <p className="text-[0.625rem] lg:text-[0.6875rem] text-muted font-bold uppercase tracking-[0.1em] mt-1">{cert.description}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
