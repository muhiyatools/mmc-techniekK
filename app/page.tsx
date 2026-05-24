"use client";

import Services from "./_sections/Services";
import TrustStrip from "./_sections/TrustStrip";
import HeroSection from "./_sections/HeroSection";
import Reveal from "./_ui/Reveal";
import HairlineDivider from "./_ui/HairlineDivider";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import ClientStrip from "./_ui/ClientStrip";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <>
      <HeroSection />

      <TrustStrip />

      <Services />

      <HairlineDivider aurora draw />

      <section id="werkwijze" className="py-24 lg:py-40 bg-concrete overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 lg:mb-24">
              <div>
                <span className="text-label text-brand font-black tracking-[0.3em] mb-6 block">
                  {t.sections.process.label}
                </span>
                <h2
                  className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-black leading-[0.85] tracking-[-0.04em] text-ink uppercase"
                  dangerouslySetInnerHTML={{ __html: t.sections.process.title.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
                />
              </div>
              <p className="text-lg md:text-xl text-muted/80 font-medium max-w-md leading-relaxed">
                {t.sections.process.description}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {t.sections.process.steps.map((step, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="bg-white p-10 lg:p-12 border border-hairline hover:border-brand/40 transition-all duration-500 hover:shadow-2xl hover:shadow-brand/5 rounded-2xl group min-h-[320px] flex flex-col">
                  <div className="font-display text-5xl lg:text-7xl font-black text-brand/10 group-hover:text-brand/20 transition-colors mb-10 leading-none">
                    0{i + 1}
                  </div>
                  <h3 className="font-display text-xl lg:text-2xl font-black text-ink mb-4 uppercase tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-base text-muted/80 leading-relaxed font-medium">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ClientStrip />
    </>
  );
}
