import Image from "next/image";
import Link from "next/link";
import FadeIn from "../components/FadeIn";
import { services } from "@/lib/data";

export default function Services() {
  return (
    <section className="bg-base pb-20 lg:pb-28" aria-labelledby="services-heading">

      {/* Section header */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pt-20 lg:pt-28 pb-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <FadeIn>
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.13em] text-muted font-sans mb-3">
              Onze diensten
            </p>
            <h2
              id="services-heading"
              className="font-display font-bold uppercase leading-[0.9] tracking-tight text-ink"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.8rem)" }}
            >
              Alles voor een
              <br />
              <span className="text-brand">energiezuinige woning</span>
            </h2>
          </FadeIn>
          <FadeIn delay={80}>
            <Link
              href="/onze-diensten"
              className="inline-flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-muted font-sans hover:text-ink transition-colors duration-200 shrink-0 focus:outline-none focus:ring-2 focus:ring-brand"
            >
              Bekijk alle diensten
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </FadeIn>
        </div>
      </div>

      {/* Editorial image grid */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          style={{ gridAutoRows: "260px" }}
          role="list"
          aria-label="Diensten overzicht"
        >
          {services.map((service, i) => {
            const isWide = i === 0 || i === 6;
            return (
              <FadeIn
                key={service.title}
                delay={i * 40}
                direction="scale"
                className={isWide ? "lg:col-span-2" : ""}
              >
                <Link
                  href="/onze-diensten"
                  className="group relative block overflow-hidden w-full h-full focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
                  aria-label={service.title}
                  role="listitem"
                >
                  {/* Full-bleed background image */}
                  <Image
                    src={service.image}
                    alt=""
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    aria-hidden="true"
                  />

                  {/* Persistent dark overlay */}
                  <div className="absolute inset-0 bg-ink/50 group-hover:bg-ink/65 transition-colors duration-400" />

                  {/* Content anchored to bottom */}
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    {/* Index number */}
                    <span
                      className="block text-[0.5625rem] font-bold uppercase tracking-[0.16em] text-base/50 font-sans mb-1.5 tabular-nums"
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, "0")}.
                    </span>
                    <h3
                      className="font-display font-bold uppercase leading-none tracking-tight text-base"
                      style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)" }}
                    >
                      {service.title}
                    </h3>
                    {/* Description — slides in on hover */}
                    <p className="text-[0.8125rem] leading-snug text-base/75 font-sans mt-2 max-h-0 overflow-hidden opacity-0 group-hover:max-h-20 group-hover:opacity-100 transition-all duration-300">
                      {service.description}
                    </p>
                  </div>

                  {/* Arrow in top-right corner */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg
                      className="w-4 h-4 text-base translate-x-0 group-hover:translate-x-0.5 transition-transform duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
