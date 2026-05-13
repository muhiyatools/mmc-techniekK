"use client";

import Image from "next/image";
import Link from "next/link";
import { testimonials } from "@/lib/data";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function AboutPage() {
  const { t, language } = useLanguage();
  const m = t.pages.overOns;

  return (
    <>
      <section className="relative h-[70vh] min-h-[500px] flex items-center pt-[70px] lg:pt-[114px] bg-ink">
        <div className="absolute inset-0">
          <Image src="/images/projects/PHOTO-2024-12-03-12-54-01.jpg" alt="" fill className="object-cover opacity-40" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
        </div>
        <div className="relative w-full max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mb-5">
              {m.label}
            </p>
            <h1 className="font-display text-[clamp(2.5rem,5.5vw,5rem)] font-extrabold leading-[0.88] tracking-[-0.02em] text-white mb-5"
              dangerouslySetInnerHTML={{ __html: m.title.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
            />
            <p className="text-sm text-white/50 leading-relaxed max-w-md">
              {m.description}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-concrete border-b border-hairline">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-hairline">
            {([["16+", m.stats[0]?.label || "jaar ervaring"], ["2500+", m.stats[1]?.label || "projecten"], ["16+", m.stats[2]?.label || "vakmensen"], ["24u", m.stats[3]?.label || "offerte"]] as const).map(([val, label]) => (
              <div key={label} className="py-10 lg:py-14 text-center">
                <div className="font-display text-3xl lg:text-4xl font-extrabold text-brand tabular-nums leading-none mb-1.5">{val}</div>
                <p className="text-[10px] font-bold text-muted/50 uppercase tracking-[0.15em]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-base py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <p className="text-[10px] font-bold text-muted/40 uppercase tracking-[0.25em] mb-4">
                {m.story.label}
              </p>
              <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-extrabold leading-[0.95] tracking-[-0.02em] text-ink mb-5"
                dangerouslySetInnerHTML={{ __html: m.story.title.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
              />
              <p className="text-sm text-muted leading-relaxed">
                {m.story.description}
              </p>
            </div>
            <div>
              <div className="space-y-10">
                {m.milestones.map((mil) => (
                  <div key={mil.year} className="flex gap-5 items-baseline">
                    <span className="font-display text-[2.5rem] lg:text-[3rem] font-extrabold text-brand/15 tabular-nums leading-none shrink-0 w-16 lg:w-20">
                      {mil.year}
                    </span>
                    <p className="text-sm text-copy leading-relaxed">{mil.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface border-t border-hairline py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="text-[10px] font-bold text-muted/40 uppercase tracking-[0.25em] mb-5">
                {m.testimonials.label}
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {testimonials.slice(0, 2).map((t) => (
                  <div key={t.name} className="p-5 lg:p-6 border border-hairline">
                    <p className="text-xs text-copy leading-relaxed mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                    <p className="text-xs font-bold text-ink">{t.name}</p>
                    <p className="text-[9px] text-muted mt-0.5 uppercase tracking-wider">{t.role}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="bg-ink p-8 lg:p-10 text-white">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.25em] mb-3">
                  {m.certifications.label}
                </p>
                <h3 className="font-display text-xl lg:text-2xl font-extrabold leading-tight text-white mb-6"
                  dangerouslySetInnerHTML={{ __html: m.certifications.title.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
                />
                <div className="flex flex-wrap gap-3 mb-8">
                  {["NEN-3140", "VCA"].map((name) => (
                    <span key={name} className="text-[9px] font-bold text-white/50 uppercase tracking-wider border border-white/15 px-3 py-1.5">
                      {name}
                    </span>
                  ))}
                </div>
                <Link
                  href="/contact/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-ink text-[10px] font-bold uppercase tracking-wide rounded-full hover:opacity-90 transition-opacity"
                >
                  <span>{language === "nl" ? "Plan een gesprek" : "Book a call"}</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
