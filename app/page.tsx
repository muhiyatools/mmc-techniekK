"use client";

import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { heroMetrics, contactInfo, clientLogos } from "@/lib/data";
import Reveal from "./components/Reveal";
import Services from "./sections/Services";
import TrustStrip from "./sections/TrustStrip";
import FAQSection from "./sections/FAQSection";

const namedClients = clientLogos.filter((c) => c.name !== "Partner");

export default function Home() {
  const imageRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    if (imageRef.current) {
      const opacity = Math.max(0.3, 1 - scrollY * 0.0005);
      imageRef.current.style.opacity = String(opacity);
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
    <>
      {/* Hero — Full-bleed image with floating light shelf */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-[70px] lg:pt-[114px]">
        {/* Background */}
        <div ref={imageRef} className="absolute inset-0">
          <Image
            src="/images/background.avif"
            alt="Moderne duurzame woning met warmtepomp en zonnepanelen"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          {/* Subtle left-side scrim for shelf contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-ink/25 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative max-w-[1280px] mx-auto px-6 lg:px-10 w-full py-16 lg:py-0">
          <div className="max-w-xl">
            {/* Shelf panel */}
            <div className="relative bg-mist/92 backdrop-blur-md border border-hairline p-8 lg:p-10">
              {/* Aurora top stripe */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-aurora-1 via-brand/50 to-aurora-2" />

              <Reveal>
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
                    Oudewater &middot; Sinds 2008
                  </span>
                </div>
              </Reveal>

              <Reveal delay={80}>
                <h1 className="font-display text-[clamp(2.5rem,5.5vw,4.5rem)] font-extrabold leading-[0.9] tracking-tight text-ink mb-6">
                  Duurzaam wonen,{" "}
                  <span className="text-brand">vakkundig</span>{" "}
                  geïnstalleerd.
                </h1>
              </Reveal>

              <Reveal delay={160}>
                <p className="text-base lg:text-lg text-copy leading-relaxed mb-8 max-w-md">
                  Warmtepompen, zonnepanelen en airco. Eigen monteurs met 16+ jaar ervaring in Oudewater en omgeving.
                </p>
              </Reveal>

              <Reveal delay={240}>
                <div className="flex flex-wrap gap-3 mb-10">
                  <Link
                    href="/contact/"
                    className="px-8 py-3.5 bg-ink text-white text-sm font-bold uppercase tracking-wide rounded-full hover:bg-brand transition-colors duration-200"
                  >
                    Offerte aanvragen
                  </Link>
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="px-8 py-3.5 border border-ink text-ink text-sm font-bold uppercase tracking-wide rounded-full hover:border-brand hover:text-brand transition-colors duration-200"
                  >
                    Bel ons
                  </a>
                </div>
              </Reveal>

              <Reveal delay={320}>
                <div className="flex flex-wrap items-center gap-6 lg:gap-8 pt-6 border-t border-hairline">
                  {heroMetrics.map((m) => (
                    <div key={m.label}>
                      <div className="text-2xl lg:text-3xl font-extrabold text-ink tabular">
                        {m.value}
                      </div>
                      <div className="text-xs font-bold uppercase tracking-[0.18em] text-muted mt-1">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/50">
            Ontdek
          </span>
          <div className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-brand animate-bounce" />
          </div>
        </div>
      </section>

      {/* Services */}
      <Services />

      {/* Trust / Why us */}
      <TrustStrip />

      {/* Clients — static grid */}
      <section className="py-16 lg:py-20 bg-concrete border-y border-hairline">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="flex items-end justify-between gap-4 flex-wrap mb-10">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
                    Onze opdrachtgevers
                  </span>
                </div>
                <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-extrabold leading-[1.05] tracking-tight text-ink">
                  Zij vertrouwen op ons vakmanschap
                </h2>
              </div>
              <p className="text-sm text-muted max-w-xs leading-relaxed">
                Van particulier tot multinational: kwaliteit staat voorop.
              </p>
            </div>
          </Reveal>

          {/* Static logo grid — all named clients */}
          <Reveal delay={100}>
            <div className="grid grid-cols-3 lg:grid-cols-5 border border-hairline divide-x divide-y lg:divide-y-0 divide-hairline">
              {namedClients.map((logo) => (
                <div
                  key={logo.name}
                  className="flex items-center justify-center h-[88px] px-8 bg-base hover:bg-brand/4 transition-colors duration-300"
                >
                  <Image
                    src={logo.src}
                    alt={logo.name}
                    width={130}
                    height={52}
                    className="max-h-10 w-auto object-contain opacity-50 hover:opacity-90 transition-opacity duration-300"
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ preview */}
      <FAQSection />
    </>
  );
}
