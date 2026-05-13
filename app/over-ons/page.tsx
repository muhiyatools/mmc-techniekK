"use client";

import Image from "next/image";
import Link from "next/link";
import { companyStats, clientLogos, testimonials } from "@/lib/data";
import Reveal from "../components/Reveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();
  const milestones = t.pages.overOns.milestones;

const workPhotos = [
  { src: "/images/projects/PHOTO-2024-12-03-12-54-01.jpg", label: "Warmtepomp installatie", location: "Oudewater" },
  { src: "/images/projects/PHOTO-2024-12-08-15-05-58.jpg", label: "Elektrische installatie", location: "Woerden" },
  { src: "/images/projects/20240920_112524-scaled.jpg", label: "Technisch onderhoud", location: "Oudewater" },
  { src: "/images/projects/PHOTO-2024-12-08-15-05-59.jpg", label: "Renovatieproject", location: "Utrecht" },
  { src: "/images/projects/PHOTO-2024-12-08-15-12-08.jpg", label: "Installatie", location: "Bodegraven" },
  { src: "/images/projects/PHOTO-2024-12-03-12-54-08.jpg", label: "Service oplevering", location: "Oudewater" },
];
  return (
    <>
      {/* Hero — full-bleed project photo, left-aligned copy */}
      <section className="relative pt-[70px] lg:pt-[114px] pb-24 lg:pb-32 overflow-hidden min-h-[60vh] flex items-end">
        <div className="absolute inset-0">
          <Image
            src="/images/projects/PHOTO-2024-12-03-12-54-01.jpg"
            alt="MMC Techniek vakman aan het werk"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/92 via-ink/65 to-ink/20" />
        </div>

        <div className="relative max-w-[1280px] mx-auto px-6 lg:px-10 w-full">
          <div className="max-w-2xl">
            <Reveal>
              <div className="flex items-center gap-2.5 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
                  {t.pages.overOns.label}
                </span>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="font-display text-[clamp(2.75rem,6vw,5rem)] font-extrabold leading-[0.9] tracking-tight text-white mb-7"
                dangerouslySetInnerHTML={{ __html: t.pages.overOns.title.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
              />
            </Reveal>
            <Reveal delay={200}>
              <p className="text-lg lg:text-xl text-white/65 leading-relaxed max-w-xl">
                {t.pages.overOns.description}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stats — inline row with hairline separators, no side stripes */}
      <section className="bg-concrete border-b border-hairline">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-12 lg:py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-hairline">
            {companyStats.map((stat, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="py-6 lg:py-0 lg:px-10 first:lg:pl-0 last:lg:pr-0 text-center lg:text-left">
                  <div className="text-4xl lg:text-5xl font-extrabold text-brand tabular mb-1.5">
                    {stat.value}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
                    {t.pages.overOns.stats[i]?.label || stat.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Story + Timeline — asymmetric editorial */}
      <section className="py-28 lg:py-36 bg-base">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Left copy */}
            <div className="lg:col-span-4 lg:pt-2">
              <Reveal>
                <div className="flex items-center gap-2.5 mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
                  {t.pages.overOns.story.label}
                </span>
                </div>
              </Reveal>
              <Reveal delay={100}>
                <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.0] tracking-tight text-ink mb-6"
                dangerouslySetInnerHTML={{ __html: t.pages.overOns.story.title.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
              />
              </Reveal>
              <Reveal delay={200}>
                <p className="text-base text-muted leading-relaxed max-w-sm">
                  {t.pages.overOns.story.description}
                </p>
              </Reveal>
            </div>

            {/* Right timeline */}
            <div className="lg:col-span-8">
              <div className="relative">
                {/* Vertical timeline line */}
                <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-brand/50 via-brand to-brand/20 ml-[7px]" />

                <div className="space-y-10 pl-10">
                  {milestones.map((m, i) => (
                    <Reveal key={m.year} delay={i * 70}>
                      <div className="relative">
                        {/* Timeline dot */}
                        <div className="absolute -left-10 top-1.5 w-3.5 h-3.5 rounded-full bg-brand border-2 border-base ring-2 ring-brand/20" />
                        <div className="flex items-baseline gap-4 mb-2">
                          <span className="font-display text-xl font-bold text-brand tabular shrink-0">{m.year}</span>
                          <div className="flex-1 h-px bg-hairline self-center" />
                        </div>
                        <p className="text-base text-copy leading-relaxed">{m.text}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Work gallery — real project photos replace the team placeholder */}
      <section className="py-28 lg:py-36 bg-surface border-y border-hairline">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-14 lg:mb-16">
            <Reveal>
              <div className="flex items-center gap-2.5 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
                  {t.pages.overOns.work.label}
                </span>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.0] tracking-tight text-ink mb-5"
                dangerouslySetInnerHTML={{ __html: t.pages.overOns.work.title.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
              />
            </Reveal>
            <Reveal delay={160}>
              <p className="text-base text-muted leading-relaxed">
                {t.pages.overOns.work.description}
              </p>
            </Reveal>
          </div>

          {/* 3×2 photo grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
            {workPhotos.map((photo, i) => (
              <Reveal key={photo.src} delay={i * 60} variant="scale">
                <div className="relative aspect-[4/3] overflow-hidden group">
                  <Image
                    src={photo.src}
                    alt={photo.label}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-white text-sm font-bold">{photo.label}</p>
                    <p className="text-white/60 text-xs mt-0.5">{photo.location}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={300}>
            <div className="mt-10 text-center">
              <Link
                href="/our-work/"
                className="inline-flex items-center gap-2 px-8 py-3.5 border border-ink text-ink text-sm font-bold uppercase tracking-wide rounded-full hover:border-brand hover:text-brand transition-colors duration-200"
              >
                {t.pages.overOns.work.cta}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Clients — all logos, full-width with larger display */}
      <section className="py-28 lg:py-36 bg-base">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="mb-16 lg:mb-20">
            <Reveal>
              <div className="flex items-center gap-2.5 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
                  {t.pages.overOns.clients.label}
                </span>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.0] tracking-tight text-ink"
                dangerouslySetInnerHTML={{ __html: t.pages.overOns.clients.title.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
              />
            </Reveal>
          </div>

          {/* Logo grid — all named clients, generous sizing */}
          <Reveal delay={150}>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 border border-hairline divide-x divide-y divide-hairline">
              {clientLogos.filter((c) => c.src && !c.src.includes("partner-")).map((logo) => (
                <div
                  key={logo.name}
                  className="flex items-center justify-center p-6 lg:p-8 h-[88px]"
                >
                  <Image
                    src={logo.src}
                    alt={logo.name}
                    width={120}
                    height={48}
                    className="max-h-9 w-auto object-contain opacity-55 hover:opacity-90 transition-opacity duration-300"
                  />
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={250}>
            <p className="text-sm text-muted mt-8 text-center">
              {t.pages.overOns.clients.description}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Values — editorial 3-column list, no identical cards */}
      <section className="py-28 lg:py-36 bg-surface border-y border-hairline">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="max-w-2xl mb-16 lg:mb-20">
            <Reveal>
              <div className="flex items-center gap-2.5 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
                  {t.pages.overOns.values.label}
                </span>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.0] tracking-tight text-ink"
                dangerouslySetInnerHTML={{ __html: t.pages.overOns.values.title.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
              />
            </Reveal>
          </div>

          {/* Editorial numbered rows */}
          <div>
            {t.pages.overOns.values.reasons.map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div className="grid lg:grid-cols-[72px_1fr_1fr] gap-6 lg:gap-12 py-8 lg:py-10 border-t border-hairline last:border-b last:border-hairline items-baseline">
                  <span className="font-display text-[2.5rem] lg:text-[3rem] font-extrabold text-brand/20 tabular leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-xl lg:text-2xl font-bold text-ink leading-snug self-start">
                    {item.title}
                  </h3>
                  <p className="text-base text-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial + Certifications — two column */}
      <section className="py-28 lg:py-36 bg-base">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            {/* Testimonials */}
            <div>
              <Reveal>
                <div className="flex items-center gap-2.5 mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
                  {t.pages.overOns.testimonials.label}
                </span>
                </div>
              </Reveal>
              <div className="space-y-6">
                {testimonials.slice(0, 2).map((t, i) => (
                  <Reveal key={t.name} delay={i * 100}>
                    <div className="relative p-6 lg:p-8 bg-surface border border-hairline">
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-aurora-1 via-brand/30 to-aurora-2" />
                      <div className="flex mb-3">
                        {Array.from({ length: t.stars }).map((_, s) => (
                          <svg key={s} className="w-4 h-4 text-brand" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-base text-copy leading-relaxed mb-4 italic">"{t.text}"</p>
                      <div>
                        <p className="text-sm font-bold text-ink">{t.name}</p>
                        <p className="text-xs text-muted mt-0.5">{t.role}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <Reveal>
                <div className="flex items-center gap-2.5 mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
                  {t.pages.overOns.certifications.label}
                </span>
                </div>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold leading-[1.0] tracking-tight text-ink mb-10"
                dangerouslySetInnerHTML={{ __html: t.pages.overOns.certifications.title.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
              />
              </Reveal>
              <div className="space-y-5">
                {t.components.footer.certifications.map((cert, i) => (
                  <Reveal key={cert.name} delay={i * 100}>
                    <div className="flex items-center gap-6 p-6 lg:p-8 bg-surface border border-hairline">
                      <div className="shrink-0 w-[72px] h-[72px] bg-base border border-hairline flex items-center justify-center p-2">
                        <Image
                          src={cert.name === "NEN-3140" ? "/images/certifications/nen-3140.png" : "/images/certifications/vca.png"}
                          alt={cert.name}
                          width={56}
                          height={56}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-ink mb-1">{cert.name}</h3>
                        <p className="text-sm text-muted">{cert.description}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
