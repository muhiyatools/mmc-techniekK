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
      // Image moves up at 0.35× scroll speed — smooth, not too aggressive
      imageRef.current.style.transform = `translateY(${scrollY * 0.35}px) scale(1.12)`;
      // Subtle fade out as we scroll away
      const opacity = Math.max(0, 1 - scrollY * 0.0008);
      imageRef.current.style.opacity = String(opacity);
    }
    if (textRef.current) {
      // Text panel drifts slightly upward at 0.1× for depth
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
    <section className="relative min-h-screen flex items-center overflow-hidden pt-[88px] lg:pt-[118px]">
      <div className="absolute inset-0 bg-gradient-to-br from-base via-base to-surface pointer-events-none" />
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand/5 rounded-full blur-[120px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-[1200px] mx-auto px-6 lg:px-8 w-full py-16 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left */}
          <div ref={textRef} className="order-2 lg:order-1 will-change-transform">
            <Reveal>
              <div className="flex items-center gap-3 mb-8">
                <span className="w-2.5 h-2.5 rounded-full bg-brand" />
                <span className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                  Oudewater &middot; Sinds 2008
                </span>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="text-[3.5rem] sm:text-[4.5rem] lg:text-[5.5rem] font-bold leading-[1.02] tracking-tight text-ink mb-8">
                Uw woning,
                <br />
                <span className="text-brand">energiezuinig</span>
                <br />
                en vakkundig.
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="text-xl lg:text-2xl text-muted leading-relaxed mb-10 max-w-lg">
                Warmtepompen, zonnepanelen, airco en meer. Eigen monteurs uit Oudewater.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="flex flex-wrap gap-4 mb-14">
                <Link
                  href="/contact/"
                  className="px-9 py-4 bg-brand text-white text-base font-semibold rounded-full hover:bg-brand-hover transition-all duration-300 hover:shadow-lg hover:shadow-brand/25"
                >
                  Vraag een offerte aan
                </Link>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="px-9 py-4 border-2 border-border text-ink text-base font-semibold rounded-full hover:border-brand hover:text-brand transition-colors duration-300 tabular"
                >
                  Bel Ons
                </a>
              </div>
            </Reveal>

            <Reveal delay={400}>
              <div className="flex flex-wrap items-center gap-8 lg:gap-12 pt-8 border-t border-border">
                {heroMetrics.map((m) => (
                  <div key={m.label}>
                    <div className="text-3xl lg:text-4xl font-bold text-ink tabular">
                      {m.value}
                    </div>
                    <div className="text-sm font-semibold uppercase tracking-[0.12em] text-muted mt-1">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right — image */}
          <div className="order-1 lg:order-2 relative">
            <Reveal variant="scale" delay={150}>
              <div className="relative aspect-[4/5] lg:aspect-[4/5] rounded-3xl overflow-hidden">
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
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">
          Scroll
        </span>
        <div className="w-6 h-10 rounded-full border-2 border-border flex items-start justify-center p-1.5">
          <div className="w-1 h-2 rounded-full bg-brand animate-bounce" />
        </div>
      </div>
    </section>
  );
}
