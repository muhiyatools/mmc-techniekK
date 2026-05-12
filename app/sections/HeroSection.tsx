"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Reveal from "../components/Reveal";
import HeroWordLift from "./HeroWordLift";

export default function HeroSection() {
  const { t, language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    setMousePos({
      x: (clientX / innerWidth - 0.5) * 20,
      y: (clientY / innerHeight - 0.5) * 20,
    });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

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
        <div className="absolute inset-0 bg-gradient-to-b from-base/20 via-base/60 to-base" />
        <div className="grid-overlay absolute inset-0 pointer-events-none" />
      </div>

      <div className="relative z-10 w-full min-h-[85vh] flex items-center">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
          <div className="flex flex-col lg:flex-row items-end gap-20">
            <div className="flex-1">
              <div className="flex items-center gap-8 mb-16">
                <div className="tech-tag">{t.hero.badge}</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted">{t.hero.region}</div>
              </div>
              <h1 className="text-[clamp(4.5rem,12vw,9.5rem)] font-display font-extrabold leading-[0.75] tracking-tighter text-ink mb-0">
                <span className="block">Precisie</span>
                <span className="inline">in </span>
                <span className="inline text-brand">Verduurzaming.</span>
              </h1>
            </div>
            <div className="max-w-md pb-10">
              <div className="shelf-description mb-12">
                <p className="text-xl text-copy leading-relaxed font-medium">
                  {t.hero.description}
                </p>
              </div>
              <Link href="/contact/" className="group flex items-center gap-6 text-sm font-bold uppercase tracking-[0.3em] text-ink">
                <span className="w-16 h-16 rounded-full bg-brand flex items-center justify-center text-white transition-transform group-hover:scale-110">→</span>
                {t.hero.ctaStart}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Aurora element */}
      <div 
        className="absolute top-1/4 right-0 w-96 h-96 bg-brand/10 rounded-full blur-[120px] pointer-events-none"
        style={{
          transform: `translate3d(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px, 0)`,
        }}
      />

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 hidden lg:flex">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40">{t.hero.scroll}</span>
        <div className="w-px h-12 bg-ink/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-brand animate-[scroll-hint_2s_infinite_ease-in-out]" />
        </div>
      </div>

      <style jsx>{`
        .bg-image { 
          opacity: 0.4; 
          transition: opacity 0.3s ease; 
        }
        .grid-overlay { 
          background-image: 
            linear-gradient(var(--color-hairline) 1px, transparent 1px), 
            linear-gradient(90deg, var(--color-hairline) 1px, transparent 1px);
          background-size: 80px 80px;
          opacity: 0.3;
        }
        .shelf-description {
          background: var(--color-mist);
          border: 1px solid var(--color-hairline);
          padding: 2.5rem;
          backdrop-filter: blur(8px);
        }
        .tech-tag {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: var(--color-muted);
        }
        .tech-tag::before {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: var(--color-brand);
        }
        @keyframes scroll-hint {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
      `}</style>
    </section>
  );
}
