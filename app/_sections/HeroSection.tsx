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
          className="object-cover object-center scale-105 grayscale-[0.2] opacity-40"
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
          <div className="md:hidden flex flex-col items-center text-center gap-6">
            {/* Region badge */}
            <span className="text-label text-muted/70 tracking-widest">
              {t.hero.region}
            </span>

            {/* Headline */}
            <h1
              className="font-display font-extrabold leading-[0.84] tracking-[-0.02em] text-brand m-0"
              style={{ fontSize: "clamp(3rem, 16vw, 5.5rem)" }}
            >
              {t.hero.titleParts[0]}{" "}
              {t.hero.titleParts[1]}{" "}
              {t.hero.titleParts[2]}
            </h1>

            {/* Subline */}
            <p className="text-copy/80 text-sm leading-relaxed max-w-[280px]">
              {t.hero.description}
            </p>

            {/* Full-width CTA */}
            <Link
              href="/contact/"
              className="w-full max-w-[320px] flex items-center justify-center gap-2 px-6 py-4 bg-brand text-white text-sm font-extrabold uppercase tracking-[0.16em] rounded-full hover:bg-brand-deep transition-colors"
            >
              <span>{t.hero.ctaStart}</span>
              <span aria-hidden="true">&#x2192;</span>
            </Link>

            {/* Trust badges — images on mobile */}
            <div className="flex items-center gap-2.5 flex-wrap justify-center mt-1">
              <span className="relative w-[44px] h-[30px]">
                <Image src="/images/certifications/nen-3140.png" alt="NEN-3140" fill className="object-contain" sizes="44px" />
              </span>
              <span className="relative w-[28px] h-[30px]">
                <Image src="/images/certifications/vca.png" alt="VCA" fill className="object-contain" sizes="28px" />
              </span>
              <span className="relative w-7 h-7 flex items-center justify-center" aria-label="16+ jaar ervaring">
                <svg viewBox="0 0 28 28" fill="none" className="w-full h-full">
                  <path d="M14 2L17.09 8.26L24 9.27L19 14.14L20.18 21.02L14 17.77L7.82 21.02L9 14.14L4 9.27L10.91 8.26L14 2Z" fill="currentColor" className="text-brand" opacity="0.7" />
                  <text x="14" y="18" textAnchor="middle" fill="white" fontSize="11" fontWeight="800" fontFamily="system-ui">16</text>
                </svg>
              </span>
            </div>
          </div>

          {/* Desktop layout (unchanged) */}
          <div className="hidden md:flex flex-col items-center text-center gap-8">
            <h1
              className="font-display font-extrabold leading-[0.82] tracking-[-0.02em] text-brand m-0"
              style={{ fontSize: "clamp(3.5rem, 14vw, 12rem)" }}
            >
              <span>
                {t.hero.titleParts[0]} {t.hero.titleParts[1]}{" "}
                {t.hero.titleParts[2]}
              </span>
            </h1>
            <Link
              href="/contact/"
              className="inline-flex items-center gap-3 px-11 py-4 bg-brand text-white text-xs font-bold uppercase tracking-[0.18em] rounded-full hover:bg-brand-deep hover:-translate-y-0.5 transition-all duration-300"
            >
              <span>{t.hero.ctaStart}</span>
              <span aria-hidden="true">&#x2192;</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-bg to-transparent z-10 pointer-events-none" />
    </section>
  );
}
