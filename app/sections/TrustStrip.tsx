import Image from "next/image";
import Link from "next/link";
import { whyChooseUs } from "@/lib/data";
import Reveal from "../components/Reveal";

export default function TrustStrip() {
  return (
    <section className="relative py-24 lg:py-36 bg-concrete overflow-hidden">
      {/* Top aurora hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent" />

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* ── Left column ── */}
          <div className="lg:col-span-5">
            <Reveal>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
                  Waarom wij
                </span>
              </div>
              <h2 className="font-display text-[clamp(2.25rem,4.5vw,4rem)] font-extrabold leading-[0.95] tracking-tight text-ink mb-5">
                Het verschil zit<br />in{" "}
                <span className="text-brand">de details</span>
              </h2>
              <p className="text-base text-muted leading-relaxed max-w-sm mb-12">
                Sinds 2008 installeren wij duurzame systemen met vakmanschap dat u kunt zien en voelen.
              </p>
            </Reveal>

            {/* Why items — each row with large ghosted number */}
            <div className="space-y-0">
              {whyChooseUs.map((item, i) => (
                <Reveal key={item.title} delay={i * 90}>
                  <div
                    className={`relative flex items-start gap-5 py-7 ${
                      i !== whyChooseUs.length - 1 ? "border-b border-hairline" : ""
                    }`}
                  >
                    {/* Large ghost number */}
                    <div className="shrink-0 w-14 flex items-start justify-center pt-0.5">
                      <span
                        className="font-display font-extrabold leading-none select-none"
                        style={{
                          fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
                          color: "oklch(60% 0.18 250 / 0.12)",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="flex-1 pt-1">
                      <h3 className="text-[1.0625rem] font-bold text-ink mb-1.5 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Brand accent dot on active item */}
                    <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-brand/25 mt-2.5" />
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={320}>
              <div className="mt-10 flex items-center gap-4">
                <Link
                  href="/contact/"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-ink text-white text-sm font-bold uppercase tracking-wide rounded-full hover:bg-brand transition-colors duration-200"
                >
                  Vraag een offerte aan
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/aanbod/"
                  className="text-sm font-semibold text-muted hover:text-brand transition-colors duration-200"
                >
                  Bekijk ons aanbod
                </Link>
              </div>
            </Reveal>
          </div>

          {/* ── Right column ── */}
          <div className="lg:col-span-7 relative">
            <Reveal variant="scale" delay={120}>
              {/* Main image */}
              <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[580px] overflow-hidden border border-hairline">
                <Image
                  src="/images/projects/PHOTO-2024-12-03-12-54-01.jpg"
                  alt="MMC Techniek monteur aan het werk bij een warmtepomp installatie"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
                {/* Subtle gradient at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-concrete/30 via-transparent to-transparent" />
              </div>
            </Reveal>

            {/* Stat plaque — bottom left */}
            <Reveal delay={350}>
              <div className="absolute -bottom-4 -left-4 lg:-left-8 bg-white border border-hairline p-5 lg:p-6 max-w-[220px] hidden sm:block">
                <div className="h-px bg-gradient-to-r from-aurora-1 via-brand/40 to-aurora-2 mb-4" />
                <div className="font-display text-5xl font-extrabold text-brand tabular-nums leading-none mb-2">16+</div>
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-muted leading-snug">
                  Jaar vakmanschap vanuit Oudewater
                </div>
              </div>
            </Reveal>

            {/* Second stat plaque — top right */}
            <Reveal delay={450}>
              <div className="absolute -top-4 -right-4 lg:-right-6 bg-brand border border-brand-deep p-4 lg:p-5 max-w-[180px] hidden xl:block">
                <div className="font-display text-4xl font-extrabold text-white tabular-nums leading-none mb-1.5">
                  100%
                </div>
                <div className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-white/70 leading-snug">
                  Eigen personeel
                </div>
              </div>
            </Reveal>
          </div>

        </div>
      </div>

      {/* Bottom aurora hairline */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent" />
    </section>
  );
}
