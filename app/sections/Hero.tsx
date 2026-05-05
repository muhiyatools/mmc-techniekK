"use client";

import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { heroMetrics, contactInfo } from "@/lib/data";
import Reveal from "../components/Reveal";

export default function Hero() {
  const imageRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const handleScroll = useCallback(() => {
    if (!imageRef.current) return;
    const scrollY = window.scrollY;
    const rate = scrollY * 0.35;
    imageRef.current.style.transform = `translateY(${rate}px) scale(1.05)`;
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
    <section className="relative min-h-screen flex items-center overflow-hidden pt-[68px] lg:pt-[80px]">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-base via-base to-surface pointer-events-none" />

      <div className="relative max-w-[1200px] mx-auto px-6 lg:px-8 w-full py-20 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — copy */}
          <div className="order-2 lg:order-1">
            <Reveal>
              <div className="flex items-center gap-3 mb-8">
                <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-muted">
                  Oudewater &middot; Sinds 2008
                </span>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="text-[2.75rem] sm:text-[3.5rem] lg:text-[4.5rem] font-bold leading-[1.05] tracking-tight text-ink mb-6">
                Uw woning,
                <br />
                <span className="text-brand">energiezuinig</span>
                <br />
                en vakkundig.
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="text-lg text-muted leading-relaxed mb-10 max-w-md">
                Warmtepompen, zonnepanelen, airco, batterijopslag. Eigen monteurs uit Oudewater. Advies, installatie en service.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="flex flex-wrap gap-3 mb-14">
                <button
                  onClick={() => {
                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-7 py-3.5 bg-ink text-white text-sm font-semibold rounded-full hover:bg-brand transition-colors duration-200"
                >
                  Vraag een offerte aan
                </button>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="px-7 py-3.5 border border-border text-ink text-sm font-semibold rounded-full hover:border-brand hover:text-brand transition-colors duration-200 tabular"
                >
                  Bel {contactInfo.phoneDisplay}
                </a>
              </div>
            </Reveal>

            {/* Metrics */}
            <Reveal delay={400}>
              <div className="flex flex-wrap items-center gap-6 lg:gap-8 pt-8 border-t border-border">
                {heroMetrics.map((m) => (
                  <div key={m.label}>
                    <div className="text-2xl lg:text-3xl font-bold text-ink tabular">
                      {m.value}
                    </div>
                    <div className="text-[0.6875rem] font-semibold uppercase tracking-[0.15em] text-muted mt-1">
                      {m.label}
                    </div>
                  </div>
                ))}
                <div className="hidden sm:block w-px h-10 bg-border" />
                <div className="text-[0.6875rem] font-semibold uppercase tracking-[0.15em] text-muted">
                  NEN-3140 &middot; VCA
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right — image with parallax */}
          <div className="order-1 lg:order-2 relative">
            <Reveal variant="scale" delay={150}>
              <div className="relative aspect-[4/5] lg:aspect-[3/4] rounded-2xl overflow-hidden">
                <div
                  ref={imageRef}
                  className="absolute inset-0 will-change-transform"
                  style={{ transform: "scale(1.05)" }}
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
                {/* Bottom scrim */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                {/* Label */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-white/70 mb-1">
                        In uitvoering
                      </p>
                      <p className="text-white font-semibold text-lg leading-tight">
                        Warmtepomp &middot; Oudewater
                      </p>
                    </div>
                    <p className="text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-white/70 tabular">
                      Nr 247
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2">
        <span className="text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-muted">
          Scroll
        </span>
        <div className="w-5 h-8 rounded-full border-2 border-border flex items-start justify-center p-1.5">
          <div className="w-1 h-1.5 rounded-full bg-brand animate-bounce" />
        </div>
      </div>
    </section>
  );
}
