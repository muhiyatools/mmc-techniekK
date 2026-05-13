"use client";

import Image from "next/image";
import Link from "next/link";
import { testimonials } from "@/lib/data";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const photos = [
  "/images/projects/PHOTO-2024-12-03-12-54-01.jpg",
  "/images/projects/PHOTO-2024-12-08-15-05-58.jpg",
  "/images/projects/20240920_112524-scaled.jpg",
  "/images/projects/PHOTO-2024-12-08-15-05-59.jpg",
  "/images/projects/PHOTO-2024-12-08-15-12-08.jpg",
  "/images/projects/PHOTO-2024-12-03-12-54-08.jpg",
];

export default function AboutPage() {
  const { t, language } = useLanguage();
  const m = t.pages.overOns;

  return (
    <div className="pt-[70px] lg:pt-[114px]">
      <section className="relative min-h-[70vh] flex items-end bg-ink overflow-hidden">
        <div className="absolute inset-0">
          <Image src={photos[0]} alt="" fill className="object-cover opacity-30" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-transparent" />
        </div>
        <div className="relative w-full max-w-[1280px] mx-auto px-6 lg:px-10 pb-16 lg:pb-24">
          <div className="max-w-2xl">
            <p className="text-label text-white/40 mb-4">{m.label}</p>
            <h1 className="font-display text-[clamp(2.5rem,5.5vw,5rem)] font-extrabold leading-[0.88] tracking-[-0.02em] text-white mb-5"
              dangerouslySetInnerHTML={{ __html: m.title.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
            />
            <p className="text-sm text-white/50 leading-relaxed max-w-lg mb-10">
              {m.description}
            </p>
            <div className="flex flex-wrap gap-x-10 gap-y-4">
              {[["16+", m.stats[0]?.label || "jaar ervaring"], ["2500+", m.stats[1]?.label || "projecten"], ["16+", m.stats[2]?.label || "vakmensen"], ["24u", m.stats[3]?.label || "offerte"]].map(([val, label]) => (
                <div key={`stat-${label}`}>
                  <div className="font-display text-2xl font-extrabold text-white tabular-nums leading-none">{val}</div>
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="max-w-[720px] mx-auto px-6 lg:px-10">
          <p className="text-micro text-muted/50 mb-4">{m.story.label}</p>
          <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[0.9] tracking-[-0.02em] text-ink mb-8"
            dangerouslySetInnerHTML={{ __html: m.story.title.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
          />
          <p className="text-sm text-muted leading-relaxed mb-16">
            {m.story.description}
          </p>

          <div className="space-y-12">
            {m.milestones.map((mil) => (
              <div key={mil.year} className="grid grid-cols-[64px_1fr] gap-5 items-baseline">
                <span className="font-display text-2xl font-extrabold text-brand/20 tabular-nums leading-none">{mil.year}</span>
                <p className="text-sm text-copy leading-relaxed">{mil.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden">
        <div className="flex">
          {photos.map((src, i) => (
            <div key={src} className="flex-1 min-w-0">
              <div className="relative aspect-[3/4]">
                <Image src={src} alt="" fill className="object-cover" sizes="16vw" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-concrete">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <p className="text-micro text-muted/50 mb-12">{m.values.title}</p>
          <div className="grid md:grid-cols-3 gap-12">
            {m.values.reasons.map((item, i) => (
              <div key={item.title}>
                <p className="font-display text-5xl font-extrabold text-brand/10 mb-4 leading-none">{String(i + 1).padStart(2, "0")}</p>
                <p className="text-base font-bold text-ink mb-2">{item.title}</p>
                <p className="text-sm text-muted leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-20 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <p className="text-micro text-white/30 mb-6">{m.testimonials.label}</p>
              <div className="space-y-8">
                {testimonials.slice(0, 2).map((t) => (
                  <div key={t.name}>
                    <p className="text-sm text-white/60 leading-relaxed mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                    <p className="text-xs font-bold text-white">{t.name}</p>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider mt-0.5">{t.role}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:pt-12">
              <p className="text-micro text-white/30 mb-6">{m.certifications.label}</p>
              <h2 className="font-display text-2xl font-extrabold leading-tight text-white mb-8"
                dangerouslySetInnerHTML={{ __html: m.certifications.title.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
              />
              <div className="flex flex-wrap gap-3 mb-10">
                {["NEN-3140", "VCA"].map((name) => (
                  <span key={name} className="text-[10px] font-bold text-white/40 uppercase tracking-wider border border-white/15 px-3 py-1.5 rounded-full">
                    {name}
                  </span>
                ))}
              </div>
              <Link
                href="/contact/"
                className="inline-flex items-center gap-2.5 px-6 py-3 bg-white text-xs font-bold uppercase tracking-wide rounded-full hover:opacity-85 transition-opacity"
                style={{ color: "#0f172a" }}
              >
                <span>{language === "nl" ? "Plan een gesprek" : "Book a call"}</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
