"use client";

import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { heroMetrics, contactInfo } from "@/lib/data";
import Reveal from "../components/Reveal";

export default function Hero() {
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    if (imageRef.current) {
      imageRef.current.style.transform = `translateY(${scrollY * 0.35}px) scale(1.12)`;
      const opacity = Math.max(0, 1 - scrollY * 0.0008);
      imageRef.current.style.opacity = String(opacity);
    }
    if (textRef.current) {
      textRef.current.style.transform = `translateY(${scrollY * 0.1}px)`;
    }
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        handleScroll();
        rafRef.current = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-[70px] lg:pt-[70px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Warmtepomp installatie"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/70 to-ink/50" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-brand/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ink/20 to-transparent pointer-events-none" />

      <div className="relative max-w-[1200px] mx-auto px-6 lg:px-12 w-full py-16 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Content */}
          <div ref={textRef} className="order-2 lg:order-1 will-change-transform">
            <Reveal>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse" />
                <span className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
                  Oudewater &middot; Sinds 2008
                </span>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="text-[3rem] sm:text-[4rem] lg:text-[4.5rem] font-bold leading-[1.02] tracking-tight text-white mb-6">
                Uw woning,
                <br />
                <span className="text-brand">energiezuinig</span>
                <br />
                en vakkundig.
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="text-lg lg:text-xl text-white/70 leading-relaxed mb-8 max-w-lg">
                Warmtepompen, zonnepanelen, airco en meer. Eigen monteurs uit Oudewater met 16+ jaar ervaring.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="flex flex-wrap gap-4 mb-12">
                <Link
                  href="/contact/"
                  className="px-8 py-4 bg-brand text-white text-base font-semibold rounded-full hover:bg-brand-hover transition-all duration-300 hover:shadow-lg hover:shadow-brand/25"
                >
                  Vraag een offerte aan
                </Link>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="px-8 py-4 border-2 border-white/30 text-white text-base font-semibold rounded-full hover:bg-white/10 transition-colors duration-300 backdrop-blur-sm"
                >
                  Bel Ons
                </a>
              </div>
            </Reveal>

            <Reveal delay={400}>
              <div className="flex flex-wrap items-center gap-8 lg:gap-10 pt-6 border-t border-white/20">
                {heroMetrics.map((m) => (
                  <div key={m.label}>
                    <div className="text-3xl lg:text-4xl font-bold text-white tabular">
                      {m.value}
                    </div>
                    <div className="text-sm font-semibold uppercase tracking-[0.12em] text-white/50 mt-1">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right - Image/Visual */}
          <div className="order-1 lg:order-2 relative">
            <Reveal variant="scale" delay={150}>
              <div className="relative aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden">
                <div
                  ref={imageRef}
                  className="absolute inset-0 will-change-transform"
                  style={{ transform: "scale(1.12)" }}
                >
                  <Image
                    src="/images/services/warmtepompen.webp"
                    alt="MMC Techniek monteur installeert een warmtepomp"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-3">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/40">
          Ontdek
        </span>
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
          <div className="w-1 h-2 rounded-full bg-brand animate-bounce" />
        </div>
      </div>
    </section>
  );
}