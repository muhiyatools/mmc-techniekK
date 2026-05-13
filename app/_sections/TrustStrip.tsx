"use client";

import Image from "next/image";
import Link from "next/link";
import { projectImages } from "@/lib/data";
import Reveal from "../_ui/Reveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function TrustStrip() {
  const { t } = useLanguage();
  const reasons = t.sections.trust.reasons;
  const localized = t.sections.projects.items;
  const featured = projectImages.slice(0, 3).map((img, i) => ({
    ...img,
    label: localized[i]?.label || img.label,
    location: localized[i]?.location || img.location,
    category: localized[i]?.category || img.category,
  }));

  return (
    <section className="relative py-16 md:py-24 lg:py-32 bg-bg overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-5 md:px-6 lg:px-10">
        {/* Label */}
        <div className="flex items-center gap-3 mb-5 md:mb-6">
          <Reveal>
            <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
          </Reveal>
          <Reveal delay={60}>
            <span className="text-label text-muted">{t.sections.trust.label}</span>
          </Reveal>
        </div>

        {/* Title */}
        <Reveal delay={100}>
          <h2 className="font-display text-[clamp(2rem,6vw,5.5rem)] font-extrabold leading-[0.85] tracking-[-0.03em] text-ink mb-10 md:mb-16 lg:mb-20 max-w-3xl">
            {t.sections.trust.title}
          </h2>
        </Reveal>

        <div className="grid lg:grid-cols-12 gap-10 md:gap-12 lg:gap-16">
          {/* Reasons list */}
          <div className="lg:col-span-6">
            <div className="border-t border-hairline">
              {reasons.map((reason, i) => (
                <Reveal key={i} delay={i * 90}>
                  <div className="flex gap-5 md:gap-8 py-6 md:py-8 border-b border-hairline group">
                    <span className="font-display text-sm md:text-base font-bold text-brand tracking-[0.1em] shrink-0 pt-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold mb-1.5 text-ink group-hover:text-brand transition-colors duration-300">
                        {reason.title}
                      </h3>
                      <p className="text-sm text-muted max-w-[40ch] leading-relaxed">
                        {reason.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Project photos */}
          <div className="lg:col-span-6">
            {/* Mobile: gallery grid */}
            <div className="md:hidden grid grid-cols-2 gap-2">
              {featured.map((project, i) => {
                const large = i === 0;
                return (
                  <div
                    key={project.src}
                    className={`group relative overflow-hidden border border-hairline bg-concrete ${large ? "col-span-2 aspect-[16/7]" : "aspect-square"}`}
                  >
                    <Image
                      src={project.src}
                      alt={project.label}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes={large ? "100vw" : "50vw"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent opacity-60" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest block mb-0.5">
                        {project.category}
                      </span>
                      <h3 className="text-xs font-bold text-white leading-tight">{project.label}</h3>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop: 2-col grid */}
            <div className="hidden md:grid grid-cols-2 gap-3">
              <Reveal className="col-span-2">
                <div className="group relative aspect-[16/9] overflow-hidden border border-hairline">
                  <Image
                    src={featured[0].src}
                    alt={featured[0].label}
                    fill
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2 py-0.5 border border-white/20 text-[9px] font-bold text-white uppercase tracking-widest">
                        {featured[0].category}
                      </span>
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                        {featured[0].location}
                      </span>
                    </div>
                    <h3 className="text-xl lg:text-2xl font-extrabold text-white">{featured[0].label}</h3>
                  </div>
                  <div className="absolute top-4 right-4 w-2.5 h-2.5 border border-white/30 flex items-center justify-center">
                    <div className="w-1 h-1 bg-white" />
                  </div>
                </div>
              </Reveal>

              {featured.slice(1, 3).map((project, i) => (
                <Reveal key={project.src} delay={(i + 1) * 120}>
                  <div className="group relative aspect-[4/3] overflow-hidden border border-hairline">
                    <Image
                      src={project.src}
                      alt={project.label}
                      fill
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest block mb-1">
                        {project.category}
                      </span>
                      <h3 className="text-sm font-bold text-white">{project.label}</h3>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={300}>
              <div className="mt-6 md:mt-8 text-right">
                <Link
                  href="/our-work/"
                  className="group inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-ink hover:text-brand transition-colors duration-300"
                >
                  <span className="border-b border-ink/20 group-hover:border-brand/40 transition-colors duration-300">
                    {t.sections.projects.cta}
                  </span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">&#x2192;</span>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
