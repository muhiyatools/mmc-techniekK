import Image from "next/image";
import Link from "next/link";
import FadeIn from "../components/FadeIn";
import HairlineDivider from "../components/HairlineDivider";
import InstrumentDot from "../components/InstrumentDot";
import { services } from "@/lib/data";

/*
 * Services on the home page — a typographic ledger.
 *
 * Each row is a hairline-bordered surface containing:
 *   ▸ a small index / image preview on the left
 *   ▸ title + summary in the middle
 *   ▸ tags + arrow on the right
 *
 * Rows alternate slightly in height. No identical card grid — this is
 * a read like an index, not a tile wall.
 */
export default function Services() {
  return (
    <section
      className="relative bg-base py-24 lg:py-32"
      aria-labelledby="services-heading"
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="grid lg:grid-cols-[1fr_auto] items-end gap-6 mb-14 lg:mb-20">
          <FadeIn>
            <p className="inline-flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-muted font-sans mb-4">
              <InstrumentDot size={4} />
              Onze diensten
            </p>
            <h2
              id="services-heading"
              className="font-display font-bold uppercase leading-[0.92] tracking-[-0.012em] text-ink"
              style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.75rem)" }}
            >
              Alles voor een<br />
              <span className="text-brand">energiezuinige woning</span>
            </h2>
          </FadeIn>
          <FadeIn delay={80}>
            <Link
              href="/onze-diensten"
              className="group inline-flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-muted font-sans hover:text-ink transition-colors duration-200 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
            >
              Bekijk alle diensten
              <span
                aria-hidden="true"
                className="block w-[5px] h-[5px] rounded-full bg-brand transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          </FadeIn>
        </div>

        {/* Service ledger */}
        <FadeIn delay={120}>
          <HairlineDivider variant="aurora" draw />
        </FadeIn>

        <ul role="list" className="space-y-2">
          {services.map((service, i) => (
            <FadeIn key={service.title} delay={120 + i * 60}>
              <li>
                <Link
                  href="/onze-diensten"
                  className="group grid grid-cols-[80px_1fr_auto] sm:grid-cols-[120px_1fr_auto] items-center gap-5 lg:gap-8 py-5 lg:py-6 px-4 -mx-4 rounded-xl hover:bg-mist/50 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-xl"
                  aria-label={`Lees meer over ${service.title}`}
                >
                  {/* Left: index + image preview */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="relative w-14 h-14 sm:w-18 sm:h-18 overflow-hidden border border-hairline rounded-full image-hover-tint">
                      <Image
                        src={service.image}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        sizes="72px"
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  {/* Middle: title + summary */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-display font-bold uppercase leading-tight tracking-[-0.005em] text-ink text-[1.5rem] sm:text-[1.875rem] transition-colors duration-200 group-hover:text-brand">
                        {service.title}
                      </h3>
                      {service.title === "Warmtepompen" && (
                        <span className="inline-flex items-center px-2 py-0.5 bg-brand/10 text-brand text-[0.5625rem] font-bold uppercase tracking-[0.16em] font-sans rounded-full">
                          Populair
                        </span>
                      )}
                    </div>
                    <p className="text-[0.875rem] sm:text-[0.9375rem] text-copy/75 font-sans leading-snug max-w-[60ch] line-clamp-1 sm:line-clamp-none">
                      {service.summary}
                    </p>
                  </div>

                  {/* Right: arrow indicator */}
                  <div
                    aria-hidden="true"
                    className="flex items-center gap-1 text-muted group-hover:text-brand transition-colors duration-200"
                  >
                    <span className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] hidden sm:inline">
                      Lees meer
                    </span>
                    <svg
                      className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.75}
                        d="M5 12h14m0 0l-5-5m5 5l-5 5"
                      />
                    </svg>
                  </div>
                </Link>
              </li>
            </FadeIn>
          ))}
        </ul>

        <HairlineDivider variant="hairline" />
      </div>
    </section>
  );
}
