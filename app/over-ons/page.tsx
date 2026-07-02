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

type SystemKey = "solar" | "wind" | "battery" | "pump" | "airco" | "electrics";

export default function AboutPage() {
  const { t, language } = useLanguage();
  const m = t.pages.overOns;
  const [adminSettings, setAdminSettings] = useState<Record<string, string> | null>(null);
  const heroParallax = useParallax(0.25);
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
    ["100%", m.stats[2]?.label || (language === "nl" ? "eigen monteurs" : "in-house team")],
    ["A-Merk", m.stats[3]?.label || (language === "nl" ? "kwaliteit" : "quality")],
  ];

  // Systems data for the blueprint
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
    wind: {
      title: language === "nl" ? "Windenergie (Generatie)" : "Wind Energy (Generation)",
      quote: language === "nl" ? "Lokale windstroom als perfecte, constante aanvulling." : "Local wind power as the perfect, constant supplement.",
      text: language === "nl"
        ? "Windenergie vult zonnestroom perfect aan, vooral tijdens de wintermaanden en in de nacht. Wij koppelen kleinschalige windturbines aan uw thuisbatterij en meterkast voor een constante, duurzame stroomvoorziening."
        : "Wind energy complements solar power perfectly, especially during winter months and nighttime. We connect small-scale wind turbines to your home battery and fuse box for a constant, sustainable energy supply.",
      color: "text-teal-400",
      rgb: "45, 212, 191"
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

  // 4 Core advantages for simplified display
  const keyAdvantages = [
    {
      title: language === "nl" ? "16+ Jaar Ervaring" : "16+ Years Experience",
      desc: language === "nl" ? "Sinds 2008 uw vertrouwde partner in duurzame installaties." : "Your trusted partner in sustainable installations since 2008.",
      icon: (
        <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
        </svg>
      )
    },
    {
      title: language === "nl" ? "2.500+ Projecten" : "2,500+ Projects",
      desc: language === "nl" ? "Succesvolle verduurzamingsprojecten door heel Nederland." : "Successful sustainability projects throughout the Netherlands.",
      icon: (
        <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21" />
        </svg>
      )
    },
    {
      title: language === "nl" ? "Vast Vakteam" : "In-House Specialists",
      desc: language === "nl" ? "Ervaren, gecertificeerde eigen monteurs zonder onderaannemers." : "Experienced, certified staff without using subcontractors.",
      icon: (
        <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      )
    },
    {
      title: language === "nl" ? "Betrouwbare Service" : "Reliable Support",
      desc: language === "nl" ? "Persoonlijk contact en nazorg waarop u kunt rekenen." : "Personal contact and aftercare you can always count on.",
      icon: (
        <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75h-4.5m4.5 4.5h-4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      )
    }
  ];

  return (
    <>
      <div className="pt-[104px] lg:pt-[114px]">
        {/* ── Hero ── */}
        <section className="relative min-h-[70vh] flex items-center bg-ink overflow-hidden">
          <div ref={heroParallax.ref} className="absolute inset-0" style={{ transform: `translateY(${heroParallax.offset}px)` }}>
            <Image src="/images/solarbackground.webp" alt="" fill className="object-cover opacity-15 lg:opacity-20 scale-105" priority />
            <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/90 to-ink" />
          </div>

          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-aurora-1 via-brand to-aurora-2 animate-[aurora-drift_18s_linear_infinite] bg-[length:200%_100%] opacity-60" />

          <div className="relative w-full max-w-[1280px] mx-auto px-6 lg:px-10 py-16 lg:py-20 z-10">
            <div className="max-w-4xl lg:max-w-[1000px]">
              <Reveal threshold={0.3}>
                <span className="text-[0.75rem] lg:text-[0.875rem] font-black uppercase tracking-[0.35em] text-brand mb-4 block">
                  {m.label}
                </span>
              </Reveal>

              <Reveal delay={100} threshold={0.3}>
                <h1 
                  className="font-display text-[clamp(2.5rem,7vw,6.5rem)] lg:text-[clamp(4rem,6vw,7.5rem)] font-black leading-[0.95] tracking-tight text-white mb-6 uppercase text-wrap-balance"
                  dangerouslySetInnerHTML={{ __html: heroTitle.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
                />
              </Reveal>

              <Reveal delay={180} threshold={0.3}>
                <p className="text-lg lg:text-xl text-white/70 leading-relaxed max-w-2xl mb-12">
                  {heroDesc}
                </p>
              </Reveal>

              <Reveal delay={260} threshold={0.3}>
                <div className="flex flex-wrap gap-x-12 gap-y-6">
                  {statsData.slice(0, 3).map(([val, label]) => (
                    <div key={`stat-${label}`} className="border-l-2 border-brand/40 pl-4">
                      <div className="font-display text-3xl font-black text-white tabular-nums leading-none">
                        {val}
                      </div>
                      <p className="text-[0.6875rem] font-bold text-muted uppercase tracking-wider mt-1">
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

        {/* ── Mission (Sustainable Energy Flow Blueprint & Spinning Wind Turbine) ── */}
        <section className="py-20 lg:py-32 bg-ink text-white relative overflow-hidden">
          {/* Blueprint Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none select-none">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="blueprintGridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#blueprintGridPattern)" />
            </svg>
          </div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/5 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-[1280px] mx-auto px-6 lg:px-10 relative z-10">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              
              {/* Left Column: Mission text & Active System Card */}
              <div className="lg:col-span-5">
                <Reveal>
                  <span className="text-[0.75rem] lg:text-[0.875rem] font-black uppercase tracking-[0.3em] text-brand mb-4 block">
                    {m.mission.label}
                  </span>
                </Reveal>

                <Reveal delay={100}>
                  <h2 
                    className="font-display text-[clamp(2.25rem,4vw,3.5rem)] font-black leading-[0.95] tracking-tight uppercase mb-6"
                    dangerouslySetInnerHTML={{ __html: m.mission.title.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
                  />
                </Reveal>

                <Reveal delay={160}>
                  <p className="text-base lg:text-lg text-white/60 leading-relaxed mb-8">
                    {m.mission.description}
                  </p>
                </Reveal>

                {/* System Detail Panel */}
                <Reveal delay={220}>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
                    {/* Active color strip */}
                    <div 
                      className="absolute top-0 left-0 bottom-0 w-1 transition-colors duration-500" 
                      style={{ backgroundColor: `rgba(${systemsData[hoveredSystem].rgb}, 1)` }}
                    />
                    
                    <div className="pl-3">
                      <span 
                        className="text-[0.625rem] font-black uppercase tracking-[0.25em] transition-colors duration-500"
                        style={{ color: `rgba(${systemsData[hoveredSystem].rgb}, 1)` }}
                      >
                        {language === "nl" ? "Systeemonderdeel" : "System Component"}
                      </span>
                      <h3 className="font-display text-xl lg:text-2xl font-black uppercase text-white mt-1 mb-2 tracking-tight">
                        {systemsData[hoveredSystem].title}
                      </h3>
                      <p 
                        className="text-sm font-bold italic mb-4 transition-colors duration-500 leading-snug"
                        style={{ color: `rgba(${systemsData[hoveredSystem].rgb}, 0.9)` }}
                      >
                        &ldquo;{systemsData[hoveredSystem].quote}&rdquo;
                      </p>
                      <p className="text-sm text-white/70 leading-relaxed font-medium">
                        {systemsData[hoveredSystem].text}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* Right Column: Architectural House Blueprint & Physics Wind Turbine */}
              <div className="lg:col-span-7 flex flex-col items-center">
                {/* Discoverability Badge */}
                <div className="mb-4 inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-brand animate-[pulse_3s_infinite]">
                  <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
                  <span>{language === "nl" ? "Interactieve Blauwdruk · Beweeg over de onderdelen" : "Interactive Blueprint · Hover components"}</span>
                </div>

                <Reveal variant="scale" className="w-full max-w-xl aspect-[4/3] bg-ink/50 border border-white/5 rounded-3xl p-4 lg:p-6 shadow-2xl relative">
                  
                  <svg viewBox="0 0 400 300" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="blueprintSubGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.02" />
                      </pattern>
                    </defs>
                    <rect width="400" height="300" fill="url(#blueprintSubGrid)" rx="16" />

                    {/* Conduit links with animated dash offset */}
                    {/* Solar -> Meterkast */}
                    <path 
                      d="M 120 70 L 120 110 L 140 110 L 140 215" 
                      stroke={hoveredSystem === "solar" || hoveredSystem === "electrics" ? `rgba(${systemsData.solar.rgb}, 0.8)` : "rgba(255,255,255,0.06)"}
                      strokeWidth={hoveredSystem === "solar" || hoveredSystem === "electrics" ? 2 : 1}
                      strokeDasharray={hoveredSystem === "solar" || hoveredSystem === "electrics" ? "5, 4" : "4, 4"}
                      className={hoveredSystem === "solar" || hoveredSystem === "electrics" ? "animate-[dash_1.5s_linear_infinite]" : ""}
                      fill="none"
                      style={{ transition: "stroke 0.4s, stroke-width 0.4s" }}
                    />

                    {/* Solar -> Battery */}
                    <path 
                      d="M 120 70 L 120 110 L 95 110 L 95 215" 
                      stroke={hoveredSystem === "solar" || hoveredSystem === "battery" ? `rgba(${systemsData.battery.rgb}, 0.8)` : "rgba(255,255,255,0.06)"}
                      strokeWidth={hoveredSystem === "solar" || hoveredSystem === "battery" ? 2 : 1}
                      strokeDasharray={hoveredSystem === "solar" || hoveredSystem === "battery" ? "5, 4" : "4, 4"}
                      className={hoveredSystem === "solar" || hoveredSystem === "battery" ? "animate-[dash_1.5s_linear_infinite]" : ""}
                      fill="none"
                      style={{ transition: "stroke 0.4s, stroke-width 0.4s" }}
                    />

                    {/* Windmill -> Meterkast */}
                    <path 
                      d="M 320 110 L 320 215 L 140 215" 
                      stroke={hoveredSystem === "wind" || hoveredSystem === "electrics" ? `rgba(${systemsData.wind.rgb}, 0.8)` : "rgba(255,255,255,0.06)"}
                      strokeWidth={hoveredSystem === "wind" || hoveredSystem === "electrics" ? 2 : 1}
                      strokeDasharray={hoveredSystem === "wind" || hoveredSystem === "electrics" ? "5, 4" : "4, 4"}
                      className={hoveredSystem === "wind" || hoveredSystem === "electrics" ? "animate-[dash_1.5s_linear_infinite]" : ""}
                      fill="none"
                      style={{ transition: "stroke 0.4s, stroke-width 0.4s" }}
                    />

                    {/* Battery -> Meterkast */}
                    <path 
                      d="M 95 215 L 140 215" 
                      stroke={hoveredSystem === "battery" || hoveredSystem === "electrics" ? `rgba(${systemsData.battery.rgb}, 0.8)` : "rgba(255,255,255,0.06)"}
                      strokeWidth={hoveredSystem === "battery" || hoveredSystem === "electrics" ? 2 : 1}
                      strokeDasharray={hoveredSystem === "battery" || hoveredSystem === "electrics" ? "5, 4" : "4, 4"}
                      className={hoveredSystem === "battery" || hoveredSystem === "electrics" ? "animate-[dash_1.5s_linear_infinite]" : ""}
                      fill="none"
                      style={{ transition: "stroke 0.4s, stroke-width 0.4s" }}
                    />

                    {/* Meterkast -> Airco */}
                    <path 
                      d="M 140 215 L 140 180 L 240 180 L 240 145" 
                      stroke={hoveredSystem === "airco" || hoveredSystem === "electrics" ? `rgba(${systemsData.airco.rgb}, 0.8)` : "rgba(255,255,255,0.06)"}
                      strokeWidth={hoveredSystem === "airco" || hoveredSystem === "electrics" ? 2 : 1}
                      strokeDasharray={hoveredSystem === "airco" || hoveredSystem === "electrics" ? "5, 4" : "4, 4"}
                      className={hoveredSystem === "airco" || hoveredSystem === "electrics" ? "animate-[dash_1.5s_linear_infinite]" : ""}
                      fill="none"
                      style={{ transition: "stroke 0.4s, stroke-width 0.4s" }}
                    />

                    {/* Meterkast -> Heat Pump */}
                    <path 
                      d="M 140 215 L 255 215" 
                      stroke={hoveredSystem === "pump" || hoveredSystem === "electrics" ? `rgba(${systemsData.pump.rgb}, 0.8)` : "rgba(255,255,255,0.06)"}
                      strokeWidth={hoveredSystem === "pump" || hoveredSystem === "electrics" ? 2 : 1}
                      strokeDasharray={hoveredSystem === "pump" || hoveredSystem === "electrics" ? "5, 4" : "4, 4"}
                      className={hoveredSystem === "pump" || hoveredSystem === "electrics" ? "animate-[dash_1.5s_linear_infinite]" : ""}
                      fill="none"
                      style={{ transition: "stroke 0.4s, stroke-width 0.4s" }}
                    />

                    {/* Architectural house drawing */}
                    <line x1="50" y1="110" x2="180" y2="30" stroke="white" strokeWidth="1" strokeOpacity="0.15" />
                    <line x1="180" y1="30" x2="310" y2="110" stroke="white" strokeWidth="1" strokeOpacity="0.15" />
                    <line x1="70" y1="110" x2="70" y2="250" stroke="white" strokeWidth="1" strokeOpacity="0.1" />
                    <line x1="290" y1="110" x2="290" y2="250" stroke="white" strokeWidth="1" strokeOpacity="0.1" />
                    <line x1="70" y1="110" x2="290" y2="110" stroke="white" strokeWidth="1" strokeOpacity="0.1" />
                    <line x1="70" y1="180" x2="290" y2="180" stroke="white" strokeWidth="1" strokeOpacity="0.1" />
                    <line x1="70" y1="250" x2="290" y2="250" stroke="white" strokeWidth="1.2" strokeOpacity="0.25" />
                    <line x1="180" y1="110" x2="180" y2="250" stroke="white" strokeWidth="1" strokeOpacity="0.08" />

                    {/* Windmill Tower drawing */}
                    <path d="M 305 250 L 315 110 L 325 110 L 335 250 Z" stroke="white" strokeWidth="1" strokeOpacity="0.15" fill="none" />
                    <line x1="305" y1="250" x2="335" y2="250" stroke="white" strokeWidth="1" strokeOpacity="0.2" />

                    {/* Spinning Windmill fan blades (Interactive Hub) */}
                    <g 
                      className="windmill-blades cursor-pointer" 
                      style={{ 
                        transformOrigin: "320px 110px", 
                        animation: `spin-clockwise ${hoveredSystem === "wind" ? "1.5s" : "6s"} linear infinite` 
                      }}
                      onMouseEnter={() => setHoveredSystem("wind")}
                      onClick={() => setHoveredSystem("wind")}
                    >
                      {/* Blades */}
                      <path d="M 318 110 Q 315 70 320 30 Q 325 70 322 110 Z" fill="currentColor" className="text-white/80" />
                      <path d="M 318 110 Q 315 70 320 30 Q 325 70 322 110 Z" fill="currentColor" className="text-white/80" transform="rotate(120 320 110)" />
                      <path d="M 318 110 Q 315 70 320 30 Q 325 70 322 110 Z" fill="currentColor" className="text-white/80" transform="rotate(240 320 110)" />
                      {/* Center Hub */}
                      <circle cx="320" cy="110" r="5" fill="#0f172a" stroke="currentColor" strokeWidth="1.5" />
                    </g>

                    {/* Solar Panel Framing */}
                    <line x1="75" y1="95" x2="155" y2="45" stroke="white" strokeWidth="1.5" strokeOpacity="0.2" />
                    <line x1="75" y1="98" x2="155" y2="48" stroke="white" strokeWidth="1.5" strokeOpacity="0.2" />
                    <line x1="95" y1="83" x2="95" y2="86" stroke="white" strokeWidth="1" strokeOpacity="0.2" />
                    <line x1="120" y1="70" x2="120" y2="73" stroke="white" strokeWidth="1" strokeOpacity="0.2" />

                    {/* Hotspots */}
                    {[
                      { key: "solar", x: 120, y: 70 },
                      { key: "wind", x: 320, y: 110 },
                      { key: "battery", x: 95, y: 215 },
                      { key: "electrics", x: 140, y: 215 },
                      { key: "pump", x: 255, y: 215 },
                      { key: "airco", x: 240, y: 145 },
                    ].map((spot) => {
                      const sysKey = spot.key as SystemKey;
                      const active = hoveredSystem === sysKey;

                      return (
                        <g 
                          key={sysKey} 
                          className="cursor-pointer" 
                          onMouseEnter={() => setHoveredSystem(sysKey)} 
                          onClick={() => setHoveredSystem(sysKey)}
                        >
                          {/* Pulsing ring */}
                          <circle 
                            cx={spot.x} 
                            cy={spot.y} 
                            r={active ? 14 : 0} 
                            fill={`rgba(${systemsData[sysKey].rgb}, 0.18)`}
                            className={active ? "animate-[ping_2s_infinite]" : ""}
                            style={{ transition: "r 0.3s" }}
                          />
                          {/* Hub Ring */}
                          <circle 
                            cx={spot.x} 
                            cy={spot.y} 
                            r={active ? 7 : 4.5} 
                            stroke={`rgba(${systemsData[sysKey].rgb}, 1)`} 
                            strokeWidth="1.5" 
                            fill="#0f172a" 
                            style={{ transition: "r 0.3s" }}
                          />
                          <circle cx={spot.x} cy={spot.y} r="2" fill={`rgba(${systemsData[sysKey].rgb}, 1)`} />
                          {/* Large trigger zone */}
                          <circle cx={spot.x} cy={spot.y} r="18" fill="transparent" />
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
            @keyframes spin-clockwise {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </section>

        {/* ── Vakmanschap & Story (Simplified split screen) ── */}
        <section className="py-20 lg:py-32 bg-bg relative">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
            <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">
              
              {/* Left Column: Short story narrative */}
              <div className="lg:col-span-5">
                <Reveal>
                  <span className="text-[0.75rem] lg:text-[0.875rem] font-black uppercase tracking-[0.3em] text-muted/50 mb-4 block">
                    {m.story.label}
                  </span>
                </Reveal>
                <Reveal delay={100}>
                  <h2 className="font-display text-[clamp(2.25rem,4vw,3.5rem)] font-black leading-[0.9] tracking-tight text-ink mb-8 uppercase">
                    {language === "nl" ? "Gegroeid door kwaliteit" : "Grown through quality"}
                  </h2>
                </Reveal>
                <Reveal delay={180}>
                  <div className="text-base text-copy/90 space-y-6 leading-relaxed">
                    <p>
                      {m.story.p1}
                    </p>
                    <p>
                      {m.story.p2}
                    </p>
                  </div>
                </Reveal>
              </div>

              {/* Right Column: Key highlights grid (4 clean cards) */}
              <div className="lg:col-span-7">
                <div className="grid sm:grid-cols-2 gap-6">
                  {keyAdvantages.map((adv, i) => (
                    <Reveal key={adv.title} delay={i * 80} threshold={0.1}>
                      <div className="p-6 bg-white border border-hairline/35 rounded-2xl hover:border-brand/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="w-10 h-10 rounded-xl bg-brand/5 text-brand flex items-center justify-center mb-5">
                          {adv.icon}
                        </div>
                        <h3 className="font-display text-lg font-bold uppercase text-ink tracking-tight mb-2">
                          {adv.title}
                        </h3>
                        <p className="text-sm text-copy/70 leading-relaxed font-medium">
                          {adv.desc}
                        </p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Testimonials & Certifications ── */}
        <section className="py-20 lg:py-32 bg-white relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-hairline/50 to-transparent" />
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
            <Reveal>
              <span className="text-[0.75rem] lg:text-[0.875rem] font-black uppercase tracking-[0.3em] text-muted/50 mb-10 block">
                {m.testimonials.label}
              </span>
            </Reveal>

            <div className="grid lg:grid-cols-2 gap-8 mb-20">
              {testimonials.slice(0, 2).map((t, i) => (
                <Reveal key={t.name} threshold={0.15} delay={i * 100}>
                  <div className="relative p-8 lg:p-12 border border-hairline/40 bg-bg rounded-2xl transition-all hover:border-brand/35">
                    <svg className="w-8 h-8 text-brand/10 mb-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z" />
                    </svg>
                    <p className="text-base text-copy leading-relaxed font-bold mb-8 italic">
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand text-base font-black shrink-0">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-base font-black text-ink uppercase tracking-tight">{t.name}</p>
                        <p className="text-[0.625rem] text-brand font-black uppercase tracking-wider mt-1">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 border-t border-hairline/50 pt-16">
              <div className="max-w-xl">
                <Reveal>
                  <span className="text-[0.75rem] lg:text-[0.875rem] font-black uppercase tracking-[0.3em] text-muted/50 mb-3 block">
                    {m.certifications.label}
                  </span>
                </Reveal>
                <Reveal delay={100}>
                  <h3 className="font-display text-2xl lg:text-3xl font-black uppercase leading-tight text-ink mb-4">
                    {m.certifications.title}
                  </h3>
                </Reveal>
                <p className="text-sm text-muted/95 leading-relaxed font-medium">
                  {language === "nl" 
                    ? "Wij zijn volledig gecertificeerd volgens de landelijke normen zodat u gegarandeerd bent van een veilige, gecertificeerde installatie."
                    : "We are fully certified according to national standards, guaranteeing you a safe, certified installation."
                  }
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                {certData.map((cert) => (
                  <Reveal key={cert.name} threshold={0.1}>
                    <div className="flex items-center gap-6 px-6 py-4 border border-hairline/40 bg-surface rounded-xl shadow-md shrink-0">
                      <Image src={cert.src} alt={cert.name} width={32} height={32} className="object-contain shrink-0" />
                      <div>
                        <p className="text-sm font-black text-ink uppercase tracking-tight">{cert.name}</p>
                        <p className="text-[0.625rem] text-muted font-bold uppercase tracking-[0.1em] mt-1">{cert.description}</p>
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
