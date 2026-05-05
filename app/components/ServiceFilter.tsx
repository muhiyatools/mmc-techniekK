"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "./FadeIn";
import HairlineDivider from "./HairlineDivider";
import InstrumentDot from "./InstrumentDot";
import { services, contactInfo } from "@/lib/data";

export default function ServiceFilter() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const filters = ["Alle", ...services.map((s) => s.title)];

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      { rootMargin: "-76px 0px 0px 0px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const filteredServices = activeFilter && activeFilter !== "Alle"
    ? services.filter((s) => s.title === activeFilter)
    : services;

  return (
    <>
      {/* Sentinel for sticky detection */}
      <div ref={sentinelRef} aria-hidden="true" />

      {/* Sticky filter bar */}
      <div
        ref={filterRef}
        className={`sticky top-[64px] lg:top-[76px] z-30 transition-all duration-200 ${
          isSticky
            ? "bg-base/95 backdrop-blur-xl border-b border-hairline shadow-[0_1px_8px_rgba(0,0,0,0.04)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-3 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {filters.map((filter) => {
              const isActive = activeFilter === filter || (!activeFilter && filter === "Alle");
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter === "Alle" ? null : filter)}
                  className={`px-4 py-2 rounded-full text-[0.8125rem] font-sans font-medium transition-all duration-200 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                    isActive
                      ? "bg-ink text-base"
                      : "bg-mist text-copy hover:bg-hairline"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Service list */}
      <section className="bg-base" aria-labelledby="services-list-heading">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-12 lg:py-16">
          <h2 id="services-list-heading" className="sr-only">
            Alle diensten
          </h2>

          <FadeIn>
            <HairlineDivider variant="aurora" draw />
          </FadeIn>

          <div className="space-y-6 lg:space-y-10">
            {filteredServices.map((service, i) => {
              const isEven = i % 2 === 0;
              return (
                <FadeIn key={service.title} delay={i * 50}>
                  <article
                    id={service.title.toLowerCase().replace(/\s+/g, "-")}
                    className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-center py-8 lg:py-12 scroll-mt-[140px]"
                  >
                    <div
                      className={`relative shelf overflow-hidden rounded-2xl ${
                        isEven ? "" : "lg:order-2"
                      }`}
                      style={{ aspectRatio: "5 / 4" }}
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 top-0 h-px z-10 pointer-events-none"
                        style={{
                          background:
                            "linear-gradient(90deg, transparent 0%, var(--color-aurora-1) 28%, var(--color-brand) 50%, var(--color-aurora-2) 72%, transparent 100%)",
                        }}
                      />
                      <Image
                        src={service.image}
                        alt={`${service.title} project van MMC Techniek`}
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>

                    <div className={isEven ? "" : "lg:order-1"}>
                      <p className="inline-flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-muted font-sans mb-4 tabular">
                        <InstrumentDot size={4} />
                        Dienst
                      </p>
                      <h3
                        className="font-display font-bold uppercase leading-[0.92] tracking-[-0.012em] text-ink mb-5"
                        style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)" }}
                      >
                        {service.title}
                      </h3>
                      <p className="text-[1rem] leading-[1.72] text-copy/80 font-sans mb-6 max-w-[60ch]">
                        {service.summary}
                      </p>
                      <p className="text-[0.9375rem] leading-[1.7] text-copy/70 font-sans max-w-[60ch]">
                        {service.description}
                      </p>

                      <div className="mt-7 pt-5 border-t border-hairline flex flex-wrap items-center gap-x-7 gap-y-2">
                        <Link
                          href="/contact"
                          className="group inline-flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-ink font-sans hover:text-brand transition-colors duration-200"
                        >
                          Vraag offerte voor {service.title.toLowerCase()}
                          <span
                            aria-hidden="true"
                            className="block w-[5px] h-[5px] rounded-full bg-brand transition-transform duration-200 group-hover:translate-x-0.5"
                          />
                        </Link>
                        <a
                          href={`tel:${contactInfo.phone}`}
                          className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-muted font-sans hover:text-ink transition-colors duration-200 tabular"
                        >
                          Bel {contactInfo.phoneDisplay}
                        </a>
                      </div>
                    </div>
                  </article>
                </FadeIn>
              );
            })}
          </div>

          <HairlineDivider variant="hairline" />
        </div>
      </section>
    </>
  );
}
