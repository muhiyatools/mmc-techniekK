"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function HeroSection() {
  const { t, language } = useLanguage();

  return (
    <section className="relative h-screen min-h-[700px] flex flex-col justify-center overflow-hidden bg-base">
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/background.avif" 
          alt="MMC Techniek" 
          fill 
          className="bg-image object-cover scale-105 grayscale-[0.2]" 
          priority 
        />
        <div className="hero-overlay" />
      </div>

      <div className="relative z-10 w-full min-h-[85vh] flex items-center">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="block">{t.hero.titleParts[0]}</span>
              <span className="inline">{t.hero.titleParts[1]}</span>
              <span className="hero-brand">{t.hero.titleParts[2]}</span>
            </h1>
            <div className="hero-body">
              <p className="hero-desc">{t.hero.description}</p>
            </div>
            <Link href="/contact/" className="hero-cta">
              <span>{t.hero.ctaStart}</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>



      <style jsx>{`
        .bg-image { 
          opacity: 0.4; 
          transition: opacity 0.3s ease; 
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, color-mix(in oklch, var(--color-aurora-1) 12%, transparent) 0%, color-mix(in oklch, var(--color-brand) 20%, transparent) 40%, color-mix(in oklch, var(--color-aurora-2) 10%, transparent) 70%, transparent 100%);
          background-size: 200% 200%;
          animation: aurora-sweep 14s linear infinite;
        }
        @keyframes aurora-sweep {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .hero-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 2.5rem;
        }
        .hero-title {
          font-size: clamp(4rem, 16vw, 15rem);
          font-family: var(--font-barlow-condensed);
          font-weight: 800;
          line-height: 0.78;
          letter-spacing: -0.03em;
          color: var(--color-ink);
          margin: 0;
          text-wrap: balance;
        }
        .hero-brand { color: var(--color-brand); }
        .hero-body { max-width: 55ch; }
        .hero-desc {
          font-size: 1.25rem;
          line-height: 1.7;
          color: var(--color-muted);
          margin: 0;
        }
        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 1rem;
          padding: 1.125rem 3rem;
          background: var(--color-ink);
          color: var(--color-base);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          border-radius: 999px;
          transition: all 0.3s ease;
        }
        .hero-cta:hover {
          background: var(--color-brand);
          transform: scale(1.05);
        }
      `}</style>
    </section>
  );
}
