"use client";

import { useEffect, useRef, useCallback, Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { contactInfo, heroMetrics } from "@/lib/data";
import InstrumentDot from "../components/InstrumentDot";

/*
 * Hero — daylight visionOS treatment.
 *
 *   ┌───────────────────────┬─────────────────────────────┐
 *   │ overline              │  Mist shelf — instrument     │
 *   │ headline (word-lift)  │  panel with image + label    │
 *   │ lead                  │  hairline frame, aurora top  │
 *   │ CTAs · metric row     │  depth parallax (0.4× scroll)│
 *   └───────────────────────┴─────────────────────────────┘
 *
 * Word-lift: 55ms stagger, 720ms duration, ease.outQuint.
 * No glassmorphism on the shelf — opaque Mist with hairline border.
 */

function HeroLine({
  words,
  startDelay,
  color,
  fontSize,
}: {
  words: string[];
  startDelay: number;
  color?: "brand" | "ink";
  fontSize?: string;
}) {
  const DURATION = 720;
  const STAGGER = 55;

  return (
    <span className="block leading-[inherit]" style={fontSize ? { fontSize } : undefined}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          {i > 0 && <span aria-hidden="true"> </span>}
          <span
            className="inline-block overflow-hidden align-bottom leading-[inherit]"
            aria-hidden={i > 0}
          >
            <span
              className={`inline-block leading-[inherit]${
                color === "brand" ? " text-brand" : ""
              }`}
              style={{
                animation: `word-lift ${DURATION}ms cubic-bezier(0.16,1,0.3,1) ${
                  startDelay + i * STAGGER
                }ms both`,
              }}
            >
              {word}
            </span>
          </span>
        </Fragment>
      ))}
    </span>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const shelfRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  /*
   * Depth parallax: shelf translates Y at 0.4× scroll rate, clamped to a
   * sensible range so it never escapes its container.
   */
  const updateParallax = useCallback(() => {
    const section = sectionRef.current;
    const shelf = shelfRef.current;
    if (!section || !shelf) return;
    const rect = section.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;

    const scrolledPast = Math.max(0, -rect.top);
    const offset = Math.min(scrolledPast * 0.4, section.offsetHeight * 0.45);
    shelf.style.transform = `translateY(${-offset}px)`;
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        updateParallax();
        rafRef.current = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    updateParallax();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updateParallax]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-base pt-[80px] lg:pt-[96px] overflow-hidden"
      aria-label="Welkom bij MMC Techniek"
    >
      {/* Far-background atmospheric wash — soft pearl gradient toward the upper right */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(120% 80% at 85% 0%, color-mix(in oklch, var(--color-brand) 8%, transparent) 0%, transparent 55%)",
        }}
      />

      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-10 w-full">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 min-h-[calc(100vh-96px)] items-center pb-24 lg:pb-32">

          {/* Left — typographic column */}
          <div className="flex flex-col justify-center pt-12 lg:pt-0">

            {/* Overline */}
            <p
              className="inline-flex items-center gap-3 font-sans text-[0.625rem] font-bold uppercase tracking-[0.24em] text-muted mb-9"
              style={{ animation: "hero-fade 0.5s ease-out 60ms both" }}
            >
              <InstrumentDot size={6} pulse />
              <span>Oudewater · Nederland · Est. 2008</span>
            </p>

            {/* Headline — word-lift, three lines */}
            <h1
              className="font-display font-extrabold uppercase leading-[0.86] tracking-[-0.012em] text-ink mb-8 overflow-clip"
              aria-label="Uw woning, energiezuinig en vakkundig geinstalleerd."
            >
              <HeroLine
                words={["Uw", "woning,"]}
                startDelay={0}
                fontSize="clamp(1.75rem, 3.5vw, 3rem)"
              />
              <HeroLine
                words={["energiezuinig"]}
                startDelay={180}
                fontSize="clamp(2.25rem, 5vw, 4.5rem)"
              />
              <HeroLine
                words={["en vakkundig."]}
                startDelay={300}
                color="brand"
                fontSize="clamp(3rem, 6.5vw, 5.5rem)"
              />
            </h1>

            {/* Lead */}
            <p
              className="font-sans text-[1.0625rem] leading-[1.7] text-copy/85 mb-10 max-w-[44ch]"
              style={{ animation: "hero-fade 0.6s cubic-bezier(0.22,1,0.36,1) 600ms both" }}
            >
              Warmtepompen, zonnepanelen, airco, batterijopslag. Geinstalleerd door eigen monteurs uit Oudewater. Inclusief advies, monitoring en service na oplevering.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-wrap gap-3 mb-12"
              style={{ animation: "hero-fade 0.6s cubic-bezier(0.22,1,0.36,1) 720ms both" }}
            >
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-7 py-[0.9375rem] bg-ink text-base font-sans text-[0.6875rem] font-bold uppercase tracking-[0.12em] rounded-full hover:bg-brand transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-base"
              >
                Vraag een offerte aan
                <span
                  aria-hidden="true"
                  className="block w-[5px] h-[5px] rounded-full bg-base/85 transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
              <a
                href={`tel:${contactInfo.phone}`}
                className="inline-flex items-center px-7 py-[0.9375rem] rounded-full border border-hairline text-ink font-sans text-[0.6875rem] font-bold uppercase tracking-[0.12em] tabular hover:border-brand hover:text-brand transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                Bel {contactInfo.phoneDisplay}
              </a>
            </div>

            {/* Metric row — replaces the hero-metric template */}
            <div
              className="pt-8 border-t border-hairline"
              style={{ animation: "hero-fade 0.6s cubic-bezier(0.22,1,0.36,1) 880ms both" }}
            >
              <dl className="flex flex-wrap items-baseline gap-x-7 gap-y-3">
                {heroMetrics.map((m, i) => (
                  <Fragment key={m.label}>
                    {i > 0 && (
                      <span
                        aria-hidden="true"
                        className="block w-px h-3 bg-hairline self-center shrink-0"
                      />
                    )}
                    <div className="flex items-baseline gap-2 shrink-0">
                      <dt className="tabular text-[1rem] font-bold text-ink font-sans">
                        {m.value}
                      </dt>
                      <dd className="text-[0.625rem] font-bold uppercase tracking-[0.22em] text-muted font-sans">
                        {m.label}
                      </dd>
                    </div>
                  </Fragment>
                ))}
                <span
                  aria-hidden="true"
                  className="block w-px h-3 bg-hairline self-center shrink-0"
                />
                <div className="text-[0.625rem] font-bold uppercase tracking-[0.22em] text-muted font-sans shrink-0">
                  NEN-3140 · VCA
                </div>
              </dl>
            </div>
          </div>

          {/* Right — instrument shelf */}
          <div className="hidden lg:block relative">
            <div
              ref={shelfRef}
              className="relative shelf overflow-hidden will-change-transform"
              style={{
                animation: "shelf-rise 0.9s cubic-bezier(0.22,1,0.36,1) 200ms both",
                aspectRatio: "4 / 5",
              }}
            >
              {/* Aurora hairline along the top edge */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px z-20 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, var(--color-aurora-1) 28%, var(--color-brand) 50%, var(--color-aurora-2) 72%, transparent 100%)",
                  backgroundSize: "200% 100%",
                  animation: "aurora-drift 18s linear infinite",
                }}
              />

              <Image
                src="/images/services/warmtepompen.webp"
                alt="MMC Techniek monteur installeert een warmtepomp in een Nederlandse woning"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 0px, 50vw"
              />

              {/* Subtle bottom-edge scrim so the label panel reads against any image */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, color-mix(in oklch, var(--color-mist) 92%, transparent) 0%, transparent 100%)",
                }}
              />

              {/* Instrument label panel — pinned to the bottom of the shelf */}
              <div className="absolute inset-x-0 bottom-0 p-6 lg:p-7 z-10">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="inline-flex items-center gap-2 text-[0.625rem] font-bold uppercase tracking-[0.22em] text-muted font-sans mb-2">
                      <InstrumentDot size={4} />
                      In uitvoering
                    </p>
                    <p className="font-display font-bold uppercase tracking-[-0.005em] text-ink leading-[1.05] text-[1.5rem]">
                      Warmtepomp · Oudewater
                    </p>
                  </div>
                  <p className="tabular text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-muted font-sans shrink-0">
                    Nr 247
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-hairline">
                  <div>
                    <p className="text-[0.5625rem] font-bold uppercase tracking-[0.22em] text-muted font-sans mb-1">
                      Type
                    </p>
                    <p className="text-[0.8125rem] font-semibold text-ink font-sans">Hybride</p>
                  </div>
                  <div>
                    <p className="text-[0.5625rem] font-bold uppercase tracking-[0.22em] text-muted font-sans mb-1">
                      Label
                    </p>
                    <p className="tabular text-[0.8125rem] font-semibold text-ink font-sans">A++</p>
                  </div>
                  <div>
                    <p className="text-[0.5625rem] font-bold uppercase tracking-[0.22em] text-muted font-sans mb-1">
                      Doorlooptijd
                    </p>
                    <p className="tabular text-[0.8125rem] font-semibold text-ink font-sans">2 dagen</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile image strip — no parallax on mobile */}
      <div
        className="lg:hidden relative h-72 overflow-hidden border-y border-hairline"
        style={{ animation: "hero-fade 0.7s ease-out 600ms both" }}
      >
        <Image
          src="/images/services/warmtepompen.webp"
          alt="Warmtepomp installatie door MMC Techniek"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, var(--color-aurora-1) 28%, var(--color-brand) 50%, var(--color-aurora-2) 72%, transparent 100%)",
          }}
        />
      </div>
    </section>
  );
}
