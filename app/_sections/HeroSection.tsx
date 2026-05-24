"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative flex flex-col overflow-hidden bg-bg h-85dvh md:h-screen md:min-h-[700px]">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/background.avif"
          alt="MMC Techniek"
          fill
          sizes="100vw"
          className="object-cover object-center scale-105 grayscale-[0.15] opacity-60"
          priority
        />
        {/* Aurora overlay — disabled on touch via CSS */}
        <div
          className="absolute inset-0 aurora-bg-anim"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in oklch, var(--color-aurora-1) 12%, transparent) 0%, color-mix(in oklch, var(--color-brand) 20%, transparent) 40%, color-mix(in oklch, var(--color-aurora-2) 10%, transparent) 70%, transparent 100%)",
            backgroundSize: "200% 200%",
            animation: "aurora-sweep 14s linear infinite",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center pt-[60px] md:pt-[76px] lg:pt-[80px] px-5 md:px-12">
        <div className="w-full max-w-[1440px] mx-auto">

          {/* Mobile layout */}
          <div className="md:hidden flex flex-col items-center text-center gap-8">
            {/* Region badge */}
            <span className="text-label text-muted/80 tracking-[0.25em] font-black">
              {t.hero.region}
            </span>

            {/* Headline */}
            <h1
              className="font-display font-black leading-[0.82] tracking-[-0.03em] text-brand m-0"
              style={{ fontSize: "clamp(3.5rem, 18vw, 6.5rem)" }}
            >
              {t.hero.titleParts[0]}{" "}
              {t.hero.titleParts[1]}{" "}
              {t.hero.titleParts[2]}
            </h1>

            {/* Subline */}
            <p className="text-copy/90 text-base font-black leading-relaxed max-w-[300px]">
              {t.hero.description}
            </p>

            {/* Full-width CTA */}
            <Link
              href="/contact/"
              className="w-full max-w-[360px] flex items-center justify-center gap-3 px-8 py-5 bg-brand text-white text-base font-black uppercase tracking-[0.18em] rounded-full hover:bg-brand-deep transition-colors shadow-xl shadow-brand/20"
            >
              <span>{t.hero.ctaStart}</span>
              <span aria-hidden="true">&#x2192;</span>
            </Link>

            {/* Trust badges — images on mobile */}
            <div className="flex items-center gap-3 flex-wrap justify-center mt-2">
              <span className="relative w-[48px] h-[34px]">
                <Image src="/images/certifications/nen-3140.png" alt="NEN-3140" fill className="object-contain" sizes="48px" />
              </span>
              <span className="relative w-[32px] h-[34px]">
                <Image src="/images/certifications/vca.png" alt="VCA" fill className="object-contain" sizes="32px" />
              </span>
              <span className="relative w-[42px] h-[34px]" aria-label="16+ jaar ervaring">
                <svg viewBox="0 0 38 30" fill="none" className="w-full h-full">
                  <rect x="1" y="3" width="36" height="24" rx="5" fill="currentColor" className="text-brand" opacity="0.1" />
                  <rect x="1" y="3" width="36" height="24" rx="5" stroke="currentColor" className="text-brand/40" strokeWidth="1" />
                  <circle cx="14" cy="15" r="8" fill="currentColor" className="text-brand" opacity="0.8" />
                  <text x="14" y="18.5" textAnchor="middle" fill="white" fontSize="11" fontWeight="800" fontFamily="system-ui, sans-serif">16</text>
                  <text x="25" y="14" textAnchor="middle" fill="currentColor" className="text-muted" fontSize="7" fontWeight="700" fontFamily="system-ui, sans-serif">+</text>
                  <text x="25" y="21" textAnchor="middle" fill="currentColor" className="text-muted" fontSize="5.5" fontWeight="600" fontFamily="system-ui, sans-serif">JAAR</text>
                </svg>
              </span>
            </div>
          </div>

          {/* Desktop layout */}
          <div className="hidden md:flex flex-col items-center text-center gap-12">
            <h1
              className="font-display font-black leading-[0.8] tracking-[-0.04em] text-brand m-0"
              style={{ fontSize: "clamp(5rem, 16vw, 14rem)" }}
            >
              <span>
                {t.hero.titleParts[0]} {t.hero.titleParts[1]}{" "}
                {t.hero.titleParts[2]}
              </span>
            </h1>
            <Link
              href="/contact/"
              className="inline-flex items-center gap-5 px-16 py-6 bg-brand text-white text-base lg:text-lg font-black uppercase tracking-[0.22em] rounded-full hover:bg-brand-deep hover:-translate-y-1.5 transition-all duration-300 shadow-2xl shadow-brand/30"
            >
              <span>{t.hero.ctaStart}</span>
              <span aria-hidden="true">&#x2192;</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg to-transparent z-10 pointer-events-none" />
    </section>
  );
}
