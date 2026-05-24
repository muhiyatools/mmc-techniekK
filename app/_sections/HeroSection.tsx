"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative flex flex-col overflow-hidden bg-bg min-h-[85vh] lg:min-h-screen">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/background.avif"
          alt="MMC Techniek"
          fill
          sizes="100vw"
          className="object-cover object-center scale-105 grayscale-[0.1] opacity-75"
          priority
        />
        {/* Aurora overlay — disabled on touch via CSS */}
        <div
          className="absolute inset-0 aurora-bg-anim"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in oklch, var(--color-aurora-1) 15%, transparent) 0%, color-mix(in oklch, var(--color-brand) 25%, transparent) 40%, color-mix(in oklch, var(--color-aurora-2) 12%, transparent) 70%, transparent 100%)",
            backgroundSize: "200% 200%",
            animation: "aurora-sweep 14s linear infinite",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/20 via-transparent to-bg" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center pt-[80px] lg:pt-[100px] px-6 md:px-12">
        <div className="w-full max-w-[1440px] mx-auto">

          {/* Mobile layout */}
          <div className="md:hidden flex flex-col items-center text-center gap-10">
            {/* Region badge */}
            <span className="text-label text-brand font-black tracking-[0.3em]">
              {t.hero.region}
            </span>

            {/* Headline */}
            <h1
              className="font-display font-black leading-[0.8] tracking-[-0.04em] text-ink m-0 uppercase"
              style={{ fontSize: "clamp(4rem, 22vw, 8rem)" }}
            >
              {t.hero.titleParts[0]}<br/>
              <span className="text-brand">{t.hero.titleParts[1]}</span><br/>
              {t.hero.titleParts[2]}
            </h1>

            {/* Subline */}
            <p className="text-ink/90 text-lg font-bold leading-relaxed max-w-[340px]">
              {t.hero.description}
            </p>

            {/* Full-width CTA */}
            <Link
              href="/contact/"
              className="w-full max-w-[400px] flex items-center justify-center gap-4 px-10 py-6 bg-brand text-white text-lg font-black uppercase tracking-[0.2em] rounded-full hover:bg-ink transition-all shadow-2xl shadow-brand/40"
            >
              <span>{t.hero.ctaStart}</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            {/* Trust badges */}
            <div className="flex items-center gap-6 mt-4">
              <span className="relative w-14 h-14">
                <Image src="/images/certifications/nen-3140.png" alt="NEN-3140" fill className="object-contain brightness-0" sizes="56px" />
              </span>
              <span className="relative w-10 h-14">
                <Image src="/images/certifications/vca.png" alt="VCA" fill className="object-contain brightness-0" sizes="40px" />
              </span>
            </div>
          </div>

          {/* Desktop layout */}
          <div className="hidden md:flex flex-col items-center text-center gap-16">
            <span className="text-label text-brand font-black tracking-[0.4em] text-lg">
              {t.hero.region}
            </span>
            
            <h1
              className="font-display font-black leading-[0.75] tracking-[-0.05em] text-ink m-0 uppercase"
              style={{ fontSize: "clamp(6rem, 18vw, 16rem)" }}
            >
              <span>
                {t.hero.titleParts[0]} <span className="text-brand">{t.hero.titleParts[1]}</span><br/>
                {t.hero.titleParts[2]}
              </span>
            </h1>

            <p className="text-ink/80 text-xl lg:text-3xl font-bold leading-relaxed max-w-4xl">
              {t.hero.description}
            </p>

            <Link
              href="/contact/"
              className="inline-flex items-center gap-6 px-20 py-8 bg-brand text-white text-xl lg:text-2xl font-black uppercase tracking-[0.25em] rounded-full hover:bg-ink hover:-translate-y-2 transition-all duration-500 shadow-2xl shadow-brand/40"
            >
              <span>{t.hero.ctaStart}</span>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg via-bg/80 to-transparent z-10 pointer-events-none" />
    </section>
  );
}
