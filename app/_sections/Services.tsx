"use client";

import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/data";
import Reveal from "../_ui/Reveal";
import SwipeCarousel from "../_ui/SwipeCarousel";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Services() {
  const { t } = useLanguage();
  const items = t.sections.services.items;

  const ServiceCard = ({ service, i, large }: { service: typeof services[0]; i: number; large?: boolean }) => (
    <Link
      href={`/diensten/${service.slug}`}
      className="group block relative overflow-hidden bg-ink hover:shadow-2xl hover:shadow-ink/20 transition-shadow duration-500 h-full"
    >
      <div className={`relative overflow-hidden ${large ? "aspect-[21/9]" : "aspect-[4/3]"}`}>
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes={large ? "(max-width: 640px) 100vw, 66vw" : "(max-width: 640px) 85vw, 33vw"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
        <div className="absolute top-0 right-0 w-24 h-24 bg-brand/10 blur-2xl rounded-full" />

        <div className="absolute inset-x-0 bottom-0 p-5">
          {service.popular && (
            <div className="flex items-center gap-1.5 mb-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
                {t.sections.services.popular}
              </span>
            </div>
          )}
          <h3 className={`font-bold text-white leading-tight mb-1.5 group-hover:text-brand transition-colors duration-300 ${large ? "text-xl" : "text-lg"}`}>
            {items[i]?.title || service.title}
          </h3>
          <p className="text-white/65 text-sm leading-relaxed line-clamp-2">
            {items[i]?.summary || service.summary}
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-label text-brand/80 group-hover:text-brand group-hover:gap-3 transition-all duration-300">
            <span>{t.sections.services.moreInfo}</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <section id="diensten" className="relative py-16 md:py-24 lg:py-32 bg-concrete">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-hairline to-transparent" />

      {/* Section header */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-6 lg:px-10">
        <Reveal>
          <div className="mb-10 md:mb-14 lg:mb-18 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                <span className="text-label text-muted">{t.sections.services.label}</span>
              </div>
              <h2
                className="font-display text-[clamp(1.75rem,5vw,3.5rem)] font-extrabold leading-[1.0] tracking-tight text-ink max-w-xl"
                dangerouslySetInnerHTML={{
                  __html: t.sections.services.title
                    .replace(/<brand>/g, '<span class="text-brand">')
                    .replace(/<\/brand>/g, "</span>"),
                }}
              />
            </div>
            <p className="text-base text-muted max-w-sm lg:text-right hidden md:block">
              {t.sections.services.subtitle}
            </p>
          </div>
        </Reveal>
      </div>

      {/* Mobile: swipe carousel */}
      <div className="md:hidden">
        <SwipeCarousel slideWidth="78vw" gap={12} showDots>
          {services.map((service, i) => (
            <ServiceCard key={service.slug} service={service} i={i} />
          ))}
        </SwipeCarousel>
      </div>

      {/* Desktop: magazine grid */}
      <div className="hidden md:block max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
          {services.map((service, i) => (
            <Reveal
              key={service.slug}
              delay={i * 50}
              className={i === 0 ? "sm:col-span-2 xl:col-span-2" : ""}
            >
              <ServiceCard service={service} i={i} large={i === 0} />
            </Reveal>
          ))}
        </div>
      </div>

      {/* CTA row */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-6 lg:px-10">
        <Reveal delay={300}>
          <div className="mt-10 md:mt-12 lg:mt-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pt-8 border-t border-hairline">
            <p className="text-sm md:text-base text-muted max-w-md">
              {t.sections.services.cta}
            </p>
            <Link
              href="/contact/"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 bg-brand text-white text-sm font-bold uppercase tracking-wide rounded-full hover:bg-brand-deep transition-colors duration-200 shrink-0"
            >
              {t.sections.services.ctaButton}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </Reveal>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-hairline to-transparent" />
    </section>
  );
}
