"use client";

import Image from "next/image";
import Link from "next/link";
import Reveal from "../components/Reveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function TrustStrip() {
  const { t } = useLanguage();
  const reasons = t.sections.trust.reasons;
  return (
    <section className="relative py-32 bg-base overflow-hidden">
      <div className="grid gap-20 items-start max-w-[1280px] mx-auto px-6 lg:grid-cols-12 lg:px-10">
        <div className="lg:col-span-6">
          <Reveal>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted">{t.sections.trust.label}</span>
            </div>
            <h2 className="font-display text-[clamp(3rem,7vw,6rem)] font-extrabold leading-[0.82] tracking-[-0.03em] text-ink mb-12">
              {t.sections.trust.title}
            </h2>
          </Reveal>

          <div className="border-t border-hairline">
            {reasons.map((reason, i) => (
              <Reveal key={i} delay={i * 90}>
                <div className="flex gap-8 py-8 border-b border-hairline">
                  <span className="font-display text-base font-bold text-brand tracking-[0.1em]">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-ink">{reason.title}</h3>
                    <p className="text-[15px] text-muted max-w-[40ch] leading-relaxed">{reason.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-6">
          <Reveal variant="scale" delay={120}>
            <div className="aspect-[4/5] overflow-hidden border border-hairline relative">
              <Image 
                src="/images/projects/PHOTO-2024-12-03-12-54-01.jpg" 
                alt="Vakmanschap" 
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
