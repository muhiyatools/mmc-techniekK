"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative h-screen min-h-[700px] flex flex-col overflow-hidden bg-bg">
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/background.avif" 
          alt="MMC Techniek" 
          fill 
          className="object-cover scale-105 grayscale-[0.2] opacity-40" 
          priority 
        />
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, color-mix(in oklch, var(--color-aurora-1) 12%, transparent) 0%, color-mix(in oklch, var(--color-brand) 20%, transparent) 40%, color-mix(in oklch, var(--color-aurora-2) 10%, transparent) 70%, transparent 100%)",
            backgroundSize: "200% 200%",
            animation: "aurora-sweep 14s linear infinite",
          }}
        />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center pt-[76px] lg:pt-[80px]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
          <div className="flex flex-col items-center text-center gap-8">
            <h1 
              className="font-display font-extrabold leading-[0.82] tracking-[-0.02em] text-brand m-0"
              style={{ fontSize: "clamp(3.5rem, 14vw, 12rem)" }}
            >
              <span>{t.hero.titleParts[0]} {t.hero.titleParts[1]} {t.hero.titleParts[2]}</span>
            </h1>
            <Link 
              href="/contact/" 
              className="inline-flex items-center gap-3 px-11 py-4 bg-brand text-base text-xs font-bold uppercase tracking-[0.18em] rounded-full no-underline hover:bg-brand-deep hover:-translate-y-0.5 transition-all duration-300"
            >
              <span>{t.hero.ctaStart}</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
