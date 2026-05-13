"use client";

import Services from "./sections/Services";
import TrustStrip from "./sections/TrustStrip";
import HeroSection from "./sections/HeroSection";
import Reveal from "./components/Reveal";
import HairlineDivider from "./components/HairlineDivider";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  return (
    <>
      <HeroSection />

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <HairlineDivider draw aurora delay={100} />
      </div>

      <Services />

      <section className="relative bg-base border-t border-hairline overflow-hidden py-24 lg:py-32">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="flex items-center gap-3 mb-16 justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-brand" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-ink">{t.pages.home.process.label}</span>
              <div className="w-1.5 h-1.5 rounded-full bg-brand" />
            </div>
          </Reveal>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-0">
              {t.pages.home.process.steps.map((step, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="relative text-center group">
                  {i < 3 && (
                    <div className="hidden md:block absolute top-1.5 left-[calc(50%+12px)] w-[calc(100%-24px)] h-px bg-hairline z-0" />
                  )}
                  
                  <div className="relative z-10 w-3 h-3 bg-brand rounded-full mx-auto mb-6 shadow-[0_0_0_4px_var(--color-base),0_0_0_5px_var(--color-hairline)] group-hover:scale-125 transition-transform duration-300" />
                  
                  <h3 className="font-display text-xl font-bold text-ink mb-2 uppercase italic tracking-wide group-hover:text-brand transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-[11px] text-muted font-bold uppercase tracking-widest opacity-60">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <TrustStrip />
    </>
  );
}
