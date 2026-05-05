"use client";

import Image from "next/image";
import { clientLogosExtended } from "@/lib/data";

/*
 * TrustBand — fast-moving logo marquee immediately below the hero.
 * Thin, fast, feels like a news ticker. Not a full section.
 * Uses CSS animation, duplicated content for seamless loop.
 */

export default function TrustBand() {
  const logos = clientLogosExtended.slice(0, 8);
  const doubled = [...logos, ...logos, ...logos, ...logos];

  return (
    <section
      className="relative bg-concrete border-y border-hairline overflow-hidden"
      aria-label="Vertrouwde opdrachtgevers"
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-4 flex items-center gap-6">
        <p className="hidden sm:block text-[0.625rem] font-bold uppercase tracking-[0.22em] text-muted font-sans shrink-0 whitespace-nowrap">
          Vertrouwd door
        </p>

        <div className="flex-1 overflow-hidden relative">
          {/* Fade edges */}
          <div
            aria-hidden="true"
            className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, var(--color-concrete) 0%, transparent 100%)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(270deg, var(--color-concrete) 0%, transparent 100%)",
            }}
          />

          <div className="flex animate-marquee">
            {doubled.map((logo, i) => (
              <div
                key={`${logo.src}-${i}`}
                className="flex items-center justify-center px-6 lg:px-8 shrink-0"
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={100}
                  height={40}
                  className="h-6 lg:h-7 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
