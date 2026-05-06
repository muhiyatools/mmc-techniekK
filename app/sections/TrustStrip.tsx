import Image from "next/image";
import Link from "next/link";
import { whyChooseUs } from "@/lib/data";
import Reveal from "../components/Reveal";

export default function TrustStrip() {
  return (
    <section className="relative py-24 lg:py-32 bg-base overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left — Text + list */}
          <div className="lg:col-span-5">
            <Reveal>
              <div className="flex items-center gap-3 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
                  Waarom wij
                </span>
              </div>
              <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.0] tracking-tight text-ink mb-6">
                Het verschil zit in <span className="text-brand">de details</span>
              </h2>
              <p className="text-base text-muted leading-relaxed mb-10 max-w-sm">
                Sinds 2008 installeren wij duurzame systemen met vakmanschap dat u kunt zien — en voelen.
              </p>
            </Reveal>

            <div className="space-y-0">
              {whyChooseUs.map((item, i) => (
                <Reveal key={item.title} delay={i * 80}>
                  <div className={`py-6 ${i !== whyChooseUs.length - 1 ? "border-b border-hairline" : ""}`}>
                    <div className="flex items-baseline gap-4 mb-2">
                      <span className="font-display text-2xl font-bold text-brand/30">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-lg font-bold text-ink">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted leading-relaxed pl-12">
                      {item.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={300}>
              <div className="mt-10">
                <Link
                  href="/contact/"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-ink text-[var(--color-base)] text-sm font-bold uppercase tracking-wide rounded-full hover:bg-brand transition-colors duration-200"
                >
                  Vraag een offerte aan
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Right — Image */}
          <div className="lg:col-span-7 relative">
            <Reveal variant="scale" delay={150}>
              <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[560px] overflow-hidden border border-hairline">
                <Image
                  src="/images/projects/PHOTO-2024-12-03-12-54-01.jpg"
                  alt="MMC Techniek monteur aan het werk bij een warmtepomp installatie"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                {/* Subtle gradient to blend with page bg on mobile */}
                <div className="absolute inset-0 bg-gradient-to-t from-base/20 to-transparent lg:hidden" />
              </div>
            </Reveal>

            {/* Floating stat plaque */}
            <Reveal delay={400}>
              <div className="absolute -bottom-6 -left-6 lg:-left-10 bg-mist border border-hairline p-5 lg:p-6 max-w-[240px] hidden sm:block">
                <div className="h-px bg-gradient-to-r from-aurora-1 via-brand/40 to-aurora-2 mb-4" />
                <div className="font-display text-4xl font-extrabold text-brand tabular mb-1">16+</div>
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
                  Jaar ervaring in Oudewater
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
