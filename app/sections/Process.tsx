"use client";

import Reveal from "../components/Reveal";
import HairlineDivider from "../components/HairlineDivider";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Process() {
  const { t } = useLanguage();
  const steps = t.sections.process.steps;
  return (
    <section id="werkwijze" className="relative py-24 lg:py-36 bg-base overflow-hidden">
      {/* Blueprint Grid Background (Faint) */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" 
        style={{ 
          backgroundImage: `linear-gradient(var(--color-brand) 1px, transparent 1px), linear-gradient(90deg, var(--color-brand) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} 
      />

      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 relative">
        {/* Header */}
        <Reveal>
          <div className="mb-20 lg:mb-28 max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 bg-brand" />
              <span className="text-label text-brand">{t.sections.process.label}</span>
            </div>
            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] font-extrabold leading-[0.9] tracking-tight text-ink mb-6"
              dangerouslySetInnerHTML={{ __html: t.sections.process.title.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
            />
            <p className="text-lg text-muted leading-relaxed max-w-lg">
              {t.sections.process.description}
            </p>
          </div>
        </Reveal>

        {/* Steps — Technical Flow */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-0">
          {/* Connecting Line Desktop */}
          <div className="hidden lg:block absolute top-[60px] left-0 right-0 h-px bg-hairline" />

          {steps.map((step, i) => (
            <Reveal key={i} delay={i * 100} className="relative group">
              {/* Vertical Connector Desktop */}
              <div className="hidden lg:block absolute top-[60px] left-1/2 -translate-x-1/2 w-px h-12 bg-hairline group-hover:bg-brand transition-colors duration-500" />
              
              <div className="relative pt-0 lg:pt-24 lg:px-8">
                {/* Step Marker */}
                <div className="relative mb-8 lg:mb-0 lg:absolute lg:top-[44px] lg:left-1/2 lg:-translate-x-1/2 z-10">
                  <div className="w-8 h-8 rounded-full bg-base border border-hairline flex items-center justify-center text-[10px] font-bold tabular-nums text-muted group-hover:border-brand group-hover:text-brand transition-all duration-500">
                    0{i + 1}
                  </div>
                  {/* Pulse Effect on Hover */}
                  <div className="absolute inset-0 rounded-full bg-brand/10 scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-700" />
                </div>

                {/* Content Box */}
                <div className="bg-concrete/40 border border-hairline p-8 lg:p-10 hover:bg-white hover:shelf-shadow transition-all duration-500 group-hover:-translate-y-2">
                  <h3 className="text-xl font-bold text-ink mb-4 group-hover:text-brand transition-colors duration-300">
                    {step.title}
                  </h3>
                  
                  <p className="text-sm text-muted leading-relaxed">
                    {step.description}
                  </p>

                  {/* Blueprint Detail */}
                  <div className="mt-8 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="h-px flex-1 bg-brand/20" />
                    <div className="w-1 h-1 bg-brand" />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Technical Footer Detail */}
        <Reveal delay={600}>
          <div className="mt-24 pt-12 border-t border-hairline flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="w-10 h-10 rounded-full border-2 border-base bg-mist flex items-center justify-center">
                      <svg className="w-5 h-5 text-muted" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ))}
                </div>
                <p className="text-sm font-bold text-ink">
                  {t.sections.process.guidedBy}
                </p>
              </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
