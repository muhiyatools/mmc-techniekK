"use client";

import Services from "./_sections/Services";
import TrustStrip from "./_sections/TrustStrip";
import HeroSection from "./_sections/HeroSection";
import Reveal from "./_ui/Reveal";
import HairlineDivider from "./_ui/HairlineDivider";
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

      <section className="relative bg-bg border-t border-hairline overflow-hidden py-16 md:py-24 lg:py-32">
        <div className="max-w-[1280px] mx-auto px-5 md:px-6 lg:px-10">
          <Reveal>
            <h2 className="flex items-center gap-3 mb-12 md:mb-16 justify-center text-[10px] font-black uppercase tracking-[0.3em] text-ink">
              <div className="w-1.5 h-1.5 rounded-full bg-brand" />
              {t.pages.home.process.label}
              <div className="w-1.5 h-1.5 rounded-full bg-brand" />
            </h2>
          </Reveal>

          {/* Mobile: vertical timeline */}
          <div className="md:hidden flex flex-col gap-0">
            {t.pages.home.process.steps.map((step, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="relative flex items-start gap-5 pb-10 last:pb-0">
                  {/* Timeline spine */}
                  {i < t.pages.home.process.steps.length - 1 && (
                    <div className="absolute left-[9px] top-6 bottom-0 w-px bg-hairline" aria-hidden="true" />
                  )}
                  {/* Dot */}
                  <div className="relative z-10 shrink-0 w-5 h-5 mt-0.5 bg-brand rounded-full shadow-[0_0_0_4px_var(--color-bg),0_0_0_5px_var(--color-hairline)]" />
                  {/* Content */}
                  <div>
                    <p className="text-micro text-brand mb-0.5">0{i + 1}</p>
                    <h3 className="font-display text-lg font-bold text-ink uppercase italic tracking-wide mb-1">
                      {step.title}
                    </h3>
                    <p className="text-xs text-muted font-bold uppercase tracking-widest opacity-70">
                      {step.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Desktop: horizontal steps */}
          <div className="hidden md:grid md:grid-cols-4 gap-12 lg:gap-0">
            {t.pages.home.process.steps.map((step, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="relative text-center group">
                  {i < 3 && (
                    <div className="hidden md:block absolute top-1.5 left-[calc(50%+12px)] w-[calc(100%-24px)] h-px bg-hairline z-0" aria-hidden="true" />
                  )}
                  <div className="relative z-10 w-3 h-3 bg-brand rounded-full mx-auto mb-6 shadow-[0_0_0_4px_var(--color-bg),0_0_0_5px_var(--color-hairline)] group-hover:scale-125 transition-transform duration-300" />
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
