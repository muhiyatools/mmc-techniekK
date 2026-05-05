"use client";

import { useEffect, useRef, useCallback, Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { contactInfo } from "@/lib/data";

// ─────────────────────────────────────────────────────────────────────────────
// Word-lift line — each word slides up from behind a clipping mask, staggered.
// Used for the hero headline only.
// ─────────────────────────────────────────────────────────────────────────────
function HeroLine({
  words,
  startDelay,
  color,
  fontSize,
}: {
  words: string[];
  startDelay: number;
  color?: "brand";
  fontSize?: string;
}) {
  const DURATION = 720;   // ms per word
  const STAGGER  = 90;    // ms between words

  return (
    <span className="block leading-[inherit]" style={fontSize ? { fontSize } : undefined}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          {/* Inter-word spacing — a plain space span between inline-blocks */}
          {i > 0 && <span aria-hidden="true"> </span>}

          {/* Clipping mask: overflow:hidden hides the word below the baseline */}
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

// ─────────────────────────────────────────────────────────────────────────────
// Hero — full-viewport section with scroll-driven image parallax exit
// ─────────────────────────────────────────────────────────────────────────────
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef   = useRef<HTMLDivElement>(null);
  const rafRef     = useRef<number | null>(null);

  // Image exits upward as the hero section scrolls past.
  // The image container (overflow:hidden) clips it as translateY goes negative.
  // threshold controls how early the image fully disappears (at 65% of scroll).
  const updateParallax = useCallback(() => {
    const section = sectionRef.current;
    const imageEl = imageRef.current;
    if (!section || !imageEl) return;

    const scrolledPast = Math.max(0, -section.getBoundingClientRect().top);
    const threshold    = section.offsetHeight * 0.65;
    const progress     = Math.min(scrolledPast / threshold, 1);

    imageEl.style.transform = `translateY(${-(progress * 100)}%)`;
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
      className="relative bg-base pt-[72px] lg:pt-[80px]"
      aria-label="Welkom bij MMC Techniek"
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 w-full">
        <div className="grid lg:grid-cols-2 min-h-[calc(100vh-80px)] items-stretch">

          {/* ── Left: typographic column ─────────────────────────────────── */}
          <div className="flex flex-col justify-center py-20 lg:py-0 lg:pr-16 xl:pr-20">

            {/* Overline — plain spaced label, no pill, no background */}
            <p
              className="font-sans text-[0.625rem] font-bold uppercase tracking-[0.24em] text-muted mb-8"
              style={{ animation: "hero-fade 0.5s ease-out 60ms both" }}
            >
              Oudewater&nbsp;&nbsp;&middot;&nbsp;&nbsp;Nederland&nbsp;&nbsp;&middot;&nbsp;&nbsp;Est.&nbsp;2008
            </p>

            {/* Headline — word-by-word lift reveal, 3 lines building small→large */}
            {/* overflow:clip prevents the largest line bleeding into the right column */}
            <h1
              className="font-display font-extrabold uppercase leading-[0.86] tracking-[-0.01em] mb-8 overflow-clip"
              aria-label="Uw woning energiezuinig. Vakkundig."
            >
              <HeroLine words={["UW", "WONING"]}     startDelay={0}   fontSize="clamp(1.75rem, 3.5vw, 3rem)" />
              <HeroLine words={["ENERGIEZUINIG,"]}    startDelay={200} fontSize="clamp(2.25rem, 5vw, 4.5rem)" />
              <HeroLine words={["VAKKUNDIG."]}        startDelay={340} color="brand" fontSize="clamp(3rem, 6.5vw, 5.5rem)" />
            </h1>

            {/* Sub-copy */}
            <p
              className="font-sans text-[1.0625rem] leading-[1.72] text-muted mb-10 max-w-[42ch]"
              style={{ animation: "hero-fade 0.7s cubic-bezier(0.22,1,0.36,1) 680ms both" }}
            >
              Duurzame installaties door eigen vakmensen. Van warmtepomp tot zonnepanelen.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-wrap gap-3 mb-12"
              style={{ animation: "hero-fade 0.7s cubic-bezier(0.22,1,0.36,1) 820ms both" }}
            >
              <Link
                href="/contact"
                className="px-7 py-[0.9375rem] bg-ink text-base font-sans text-[0.6875rem] font-bold uppercase tracking-[0.1em] rounded-full hover:bg-brand-deep transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-base"
              >
                Gratis adviesgesprek
              </Link>
              <a
                href={`tel:${contactInfo.phone}`}
                className="px-7 py-[0.9375rem] rounded-full border border-muted/40 text-ink font-sans text-[0.6875rem] font-bold uppercase tracking-[0.1em] hover:border-brand hover:text-brand transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand"
              >
                Bel {contactInfo.phoneDisplay}
              </a>
            </div>

            {/* Trust strip — pure type, no icons, no cert logo images */}
            <div style={{ animation: "hero-fade 0.6s ease-out 980ms both" }}>
              {/* Rule line grows from left */}
              <div
                className="h-px bg-concrete mb-5"
                style={{
                  animation: "line-grow 0.9s cubic-bezier(0.16,1,0.3,1) 880ms both",
                  transformOrigin: "left center",
                }}
              />
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {["16+ jaar ervaring", "NEN-3140", "VCA gecertificeerd"].map((item, i) => (
                  <Fragment key={item}>
                    {i > 0 && (
                      <span
                        className="block w-px h-3 bg-muted/30 shrink-0"
                        aria-hidden="true"
                      />
                    )}
                    <span className="font-sans text-[0.625rem] font-bold uppercase tracking-[0.16em] text-muted">
                      {item}
                    </span>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: image with scroll-driven parallax exit ─────────────── */}
          {/* Outer div clips; inner div carries the image and receives JS transform */}
          <div className="hidden lg:block relative overflow-hidden">

            {/* Entrance fade — separate from the parallax transform */}
            <div
              className="absolute inset-0"
              style={{ animation: "hero-fade 1s ease-out 120ms both" }}
            >
              {/* Parallax target — JS moves this upward on scroll */}
              <div
                ref={imageRef}
                className="absolute inset-0 will-change-transform"
              >
                <Image
                  src="/images/services/warmtepompen.webp"
                  alt="MMC Techniek vakmannen installeren een warmtepomp in een Nederlandse woning"
                  fill
                  className="object-cover"
                  priority
                  sizes="50vw"
                />

                {/* Left-edge blend: image dissolves into the page background */}
                <div
                  className="absolute inset-y-0 left-0 w-28 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to right, var(--color-base) 0%, transparent 100%)",
                  }}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Mobile image strip (no parallax on mobile — performance) ────── */}
      <div
        className="lg:hidden relative h-60 overflow-hidden mt-6"
        style={{ animation: "hero-fade 0.8s ease-out 600ms both" }}
      >
        <Image
          src="/images/services/warmtepompen.webp"
          alt="Warmtepomp installatie door MMC Techniek"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Brand accent bar */}
        <div
          className="absolute inset-x-0 bottom-0 h-[3px] bg-brand"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
