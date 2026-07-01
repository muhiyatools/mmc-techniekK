"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// Core installations and their corresponding layered local project assets (three photos per service)
// Declared outside the component to prevent unnecessary re-creation on render loops.
const SERVICES_DATA = (language: "nl" | "en") => [
  {
    id: "solar" as const,
    label: language === "nl" ? "Zonnepanelen" : "Solar Panels",
    summary: language === "nl" 
      ? "Maatwerk solar installaties die maximaal rendement leveren voor uw daksituatie."
      : "Tailored solar installations designed to yield maximum efficiency for your roof.",
    images: [
      "/images/services/zonnepanelen.webp",
      "/images/projects/PHOTO-2024-12-03-12-54-01.jpg",
      "/images/projects/PHOTO-2024-12-03-12-54-02_1.jpg"
    ],
    projectTag: language === "nl" ? "Solar project in Oudewater" : "Solar installation in Oudewater"
  },
  {
    id: "pump" as const,
    label: language === "nl" ? "Warmtepompen" : "Heat Pumps",
    summary: language === "nl"
      ? "Milieuvriendelijke all-electric of hybride warmtepompen voor optimaal binnenklimaat."
      : "Eco-friendly hybrid or all-electric heat pumps for ideal year-round climate control.",
    images: [
      "/images/services/warmtepompen.webp",
      "/images/projects/PHOTO-2024-12-08-15-05-59.jpg",
      "/images/projects/PHOTO-2024-12-08-15-12-08.jpg"
    ],
    projectTag: language === "nl" ? "Warmtepomp in Woerden" : "Heat Pump in Woerden"
  },
  {
    id: "battery" as const,
    label: language === "nl" ? "Thuisbatterijen" : "Battery Storage",
    summary: language === "nl"
      ? "Slimme thuisbatterij installaties om zelfopgewekte stroom op te slaan voor de avond."
      : "Smart battery storage options to keep your solar power ready for evening use.",
    images: [
      "/images/battery_service.jpg",
      "/images/projects/PHOTO-2024-12-08-15-05-58.jpg",
      "/images/20240920_112524-scaled.jpg"
    ],
    projectTag: language === "nl" ? "Thuisbatterij in Utrecht" : "Home Battery in Utrecht"
  },
  {
    id: "airco" as const,
    label: language === "nl" ? "Airconditioning" : "Air Conditioning",
    summary: language === "nl"
      ? "Stille split-unit systemen voor koelen en verwarmen in elk seizoen."
      : "Ultra-quiet split systems for cooling and heating through all seasons.",
    images: [
      "/images/services/airco.jpg",
      "/images/projects/PHOTO-2024-12-08-15-06-00.jpg",
      "/images/projects/PHOTO-2024-12-03-12-54-08.jpg"
    ],
    projectTag: language === "nl" ? "Airco installatie in Oudewater" : "Airco project in Oudewater"
  },
  {
    id: "meter" as const,
    label: language === "nl" ? "Meterkast & Elektra" : "Fuse Boxes & Electrics",
    summary: language === "nl"
      ? "Meterkast uitbreidingen en vernieuwingen conform NEN 1010 veiligheidsnormen."
      : "Fuse box expansions and updates matching strict safety standards.",
    images: [
      "/images/services/meterkast.webp",
      "/images/projects/20240920_120951-scaled.jpg",
      "/images/projects/PHOTO-2024-12-08-15-05-58.jpg"
    ],
    projectTag: language === "nl" ? "Meterkast upgrade in Woerden" : "Fuse Box upgrade in Woerden"
  }
];

export default function HeroSection() {
  const { t, language } = useLanguage();
  const [activeService, setActiveService] = useState<"solar" | "pump" | "battery" | "airco" | "meter">("solar");
  
  // Interactive mouse tracking states
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const servicesList = SERVICES_DATA(language);

  // 1. Autoplay loop (timer pauses when mouse is hovering the text or image deck)
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setActiveService((current) => {
        const currentIndex = servicesList.findIndex((s) => s.id === current);
        const nextIndex = (currentIndex + 1) % servicesList.length;
        return servicesList[nextIndex].id;
      });
    }, 6000); // Advance page every 6 seconds

    return () => clearInterval(interval);
  }, [isHovered, servicesList.length]);

  // 2. Parallax mouse tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Coordinates normalized relative to the card deck center (-0.5 to 0.5)
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <section className="relative flex flex-col justify-center overflow-hidden bg-bg min-h-[92vh] lg:min-h-screen pt-[114px] pb-16 lg:pb-24">
      
      {/* Background image & gradient overlay (re-enabled in high fidelity) */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <Image
          src="/images/background.avif"
          alt="MMC Techniek Background"
          fill
          sizes="100vw"
          className="object-cover object-center scale-105 opacity-[0.55] grayscale-[0.08]"
          priority
        />
        {/* Blending gradients to preserve text readability while showing the background image in high detail */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg/15 via-bg/50 to-bg" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/75 via-transparent to-bg/15 hidden lg:block" />
      </div>

      {/* Main split grid layout */}
      <div className="relative z-10 w-[90%] lg:w-[92%] xl:w-[90%] mx-auto flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 xl:gap-24 items-center w-full">
          
          {/* Left Column: Fluid Typographic Hierarchy & Interactive Menu */}
          <div className="lg:col-span-7 xl:col-span-6 flex flex-col items-start text-left">
            
            {/* Regional Badge */}
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-brand mb-4 block">
              {t.hero.region}
            </span>

            {/* Fluid Editorial Title (Contrast weight, solid colors, no banned gradients) */}
            <h1 
              className="font-display font-extrabold tracking-tight text-ink leading-[1.05] uppercase mb-8"
              style={{ fontSize: "clamp(2.8rem, 6.5vw + 0.5rem, 7.5rem)" }}
            >
              <span 
                className="font-light block tracking-wide lowercase italic text-muted"
                style={{ fontSize: "clamp(1.3rem, 2.8vw + 0.3rem, 3.2rem)" }}
              >
                Precisie in
              </span>
              <span className="text-brand block mt-1">{t.hero.titleParts[2]}</span>
            </h1>

            {/* Tagline */}
            <p 
              className="text-muted font-normal leading-relaxed max-w-[60ch] mb-10"
              style={{ fontSize: "clamp(1.05rem, 1.4vw + 0.4rem, 1.5rem)" }}
            >
              {t.hero.description}
            </p>

            {/* Interactive Vertical Showcase Selector */}
            <div 
              className="w-full max-w-2xl mb-10 border-t border-hairline/60"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {servicesList.map((service) => {
                const isActive = activeService === service.id;
                return (
                  <button
                    key={service.id}
                    onClick={() => setActiveService(service.id)}
                    className="w-full text-left py-5 border-b border-hairline/60 focus:outline-none group transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span 
                        className={`font-bold uppercase tracking-wider transition-colors duration-300 ${
                          isActive ? "text-ink font-extrabold" : "text-muted/50 group-hover:text-ink/80"
                        }`}
                        style={{ fontSize: "clamp(0.95rem, 1.2vw + 0.35rem, 1.35rem)" }}
                      >
                        {service.label}
                      </span>
                      <svg className={`w-4 h-4 transition-all duration-300 ${
                        isActive ? "text-brand translate-x-1" : "text-muted/30 group-hover:translate-x-1"
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    {/* Expanded details */}
                    <div className={`overflow-hidden transition-all duration-300 ${
                      isActive ? "max-h-24 opacity-100 mt-3" : "max-h-0 opacity-0"
                    }`}>
                      <p className="text-xs sm:text-sm lg:text-base text-muted leading-relaxed max-w-[95%]">
                        {service.summary}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <Link
                href="/contact/"
                className="group flex items-center justify-center gap-3 px-8 py-4.5 bg-brand text-white text-xs sm:text-sm font-extrabold uppercase tracking-widest rounded-full hover:bg-ink transition-all duration-300 shadow-md shadow-brand/10 active:scale-[0.98]"
              >
                <span>{t.hero.ctaStart}</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/our-work/"
                className="flex items-center justify-center px-8 py-4.5 bg-concrete text-ink border border-hairline/60 text-xs sm:text-sm font-extrabold uppercase tracking-widest rounded-full hover:bg-ink hover:text-white transition-all duration-300 active:scale-[0.98]"
              >
                <span>{language === "nl" ? "Onze Projecten" : "Our Projects"}</span>
              </Link>
            </div>

          </div>

          {/* Right Column: Architectural Layered Photo Stack */}
          <div className="lg:col-span-5 xl:col-span-6 w-full flex items-center justify-center lg:justify-end mt-10 lg:mt-0">
            <div 
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="relative w-full max-w-[clamp(320px,36vw,560px)] aspect-[4/5] mx-auto lg:mr-[10%] xl:mr-[15%] select-none"
            >
              
              {/* Stack Loop */}
              {servicesList.map((service, index) => {
                const isActive = activeService === service.id;
                
                // Track indexes to link back-left and bottom-right to their respective services
                const prevIndex = (index - 1 + servicesList.length) % servicesList.length;
                const nextIndex = (index + 1) % servicesList.length;
                const prevService = servicesList[prevIndex];
                const nextService = servicesList[nextIndex];
                
                return (
                  <div
                    key={service.id}
                    className={`absolute inset-0 transition-all duration-700 ease-out-quint ${
                      isActive ? "opacity-100 scale-100 pointer-events-auto z-20" : "opacity-0 scale-95 pointer-events-none z-10"
                    }`}
                  >
                    {/* Layer 3: Back Left Photo (Clickable: triggers previous service) */}
                    <div 
                      onClick={() => setActiveService(prevService.id)}
                      className={`absolute w-[70%] h-[70%] left-[-8%] top-[-6%] rounded-2xl overflow-hidden border-4 border-white shadow-md cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-700 ease-out-quint ${
                        isActive ? "rotate-[-6deg]" : "rotate-0"
                      }`}
                      style={{
                        transform: isActive 
                          ? `translate3d(${mousePos.x * -18}px, ${mousePos.y * -18}px, 0px) rotate(-6deg)` 
                          : undefined
                      }}
                      title={prevService.label}
                    >
                      <Image
                        src={prevService.images[0]} // Display previous service photo
                        alt={prevService.label}
                        fill
                        sizes="350px"
                        className="object-cover"
                      />
                    </div>

                    {/* Layer 2: Bottom Right Photo (Clickable: triggers next service) */}
                    <div 
                      onClick={() => setActiveService(nextService.id)}
                      className={`absolute w-[70%] h-[70%] right-[-8%] bottom-[-6%] rounded-2xl overflow-hidden border-4 border-white shadow-md cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-700 ease-out-quint delay-[50ms] ${
                        isActive ? "rotate-[5deg]" : "rotate-0"
                      }`}
                      style={{
                        transform: isActive 
                          ? `translate3d(${mousePos.x * 22}px, ${mousePos.y * 22}px, 0px) rotate(5deg)` 
                          : undefined
                      }}
                      title={nextService.label}
                    >
                      <Image
                        src={nextService.images[0]} // Display next service photo
                        alt={nextService.label}
                        fill
                        sizes="350px"
                        className="object-cover"
                      />
                    </div>

                    {/* Layer 1: Main Centered Photo (Clickable: cycles to next service) */}
                    <div 
                      onClick={() => setActiveService(nextService.id)}
                      className={`absolute w-full h-full inset-0 rounded-[28px] overflow-hidden border-[6px] border-white shadow-lg cursor-pointer hover:shadow-2xl transition-all duration-500 ease-out-quint ${
                        isActive ? "rotate-[-1.5deg] scale-100" : "rotate-0 scale-95"
                      }`}
                      style={{
                        transform: isActive 
                          ? `translate3d(${mousePos.x * 10}px, ${mousePos.y * 10}px, 0px) rotate(-1.5deg)` 
                          : undefined
                      }}
                    >
                      <Image
                        src={service.images[0]}
                        alt={service.label}
                        fill
                        sizes="550px"
                        className="object-cover"
                        priority={service.id === "solar"}
                      />
                      
                      {/* Project Tag info overlay */}
                      <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 shadow-md flex items-center justify-between">
                        <div className="min-w-0">
                          <span className="text-[9px] font-black uppercase tracking-widest text-brand block mb-0.5">MMC Projecten</span>
                          <p className="text-xs font-bold text-ink truncate">{service.projectTag}</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white shrink-0 shadow-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
