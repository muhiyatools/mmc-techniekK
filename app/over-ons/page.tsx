"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { testimonials, certifications as certData } from "@/lib/data";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const photos = [
  "/images/projects/PHOTO-2024-12-03-12-54-01.jpg",
  "/images/projects/PHOTO-2024-12-08-15-05-58.jpg",
  "/images/projects/20240920_112524-scaled.jpg",
  "/images/projects/PHOTO-2024-12-08-15-05-59.jpg",
  "/images/projects/PHOTO-2024-12-08-15-12-08.jpg",
  "/images/projects/PHOTO-2024-12-03-12-54-08.jpg",
];

function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.style.opacity = "1"; el.style.transform = "translateY(0)"; obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

function useParallax(speed = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const handleScroll = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const winH = window.innerHeight;
    if (rect.top < winH && rect.bottom > 0) {
      const pct = (winH - rect.top) / (winH + rect.height);
      setOffset((pct - 0.5) * speed * 60);
    }
  }, [speed]);
  useEffect(() => {
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onScroll = () => requestAnimationFrame(handleScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [handleScroll]);
  return { ref, offset };
}

function ScrollReveal({ children, threshold = 0.15, className = "" }: { children: React.ReactNode; threshold?: number; className?: string }) {
  const ref = useScrollReveal(threshold);
  return <div ref={ref} className={className} style={{ opacity: 0, transform: "translateY(24px)", transition: "opacity 700ms cubic-bezier(0.22,1,0.36,1), transform 700ms cubic-bezier(0.22,1,0.36,1)" }}>{children}</div>;
}

export default function AboutPage() {
  const { t, language } = useLanguage();
  const m = t.pages.overOns;
  const heroParallax = useParallax(0.25);
  const [timelineProgress, setTimelineProgress] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = timelineRef.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const winH = window.innerHeight;
      if (rect.top < winH && rect.bottom > 0) {
        const visible = Math.min(1, Math.max(0, (winH - rect.top) / (rect.height + winH * 0.5)));
        setTimelineProgress(visible);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="pt-[70px] lg:pt-[114px]">
        <section className="relative min-h-[90vh] lg:min-h-[85vh] flex items-center bg-ink overflow-hidden">
          <div ref={heroParallax.ref} className="absolute inset-0" style={{ transform: `translateY(${heroParallax.offset}px)` }}>
            <Image src={photos[0]} alt="" fill className="object-cover opacity-20 lg:opacity-25 scale-105" priority />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/70 to-ink/20" />
          </div>
          <div className="relative w-full max-w-[1280px] mx-auto px-6 lg:px-10 py-24 lg:py-32">
            <div className="max-w-3xl lg:max-w-[720px]">
              <ScrollReveal threshold={0.3}>
                <p className="text-label text-white/40 mb-5">{m.label}</p>
              </ScrollReveal>
              <ScrollReveal threshold={0.3} className="mt-0">
                <h1 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] lg:text-[clamp(3.5rem,5.5vw,6rem)] font-extrabold leading-[0.85] tracking-[-0.025em] text-white mb-6"
                  dangerouslySetInnerHTML={{ __html: m.title.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
                />
              </ScrollReveal>
              <ScrollReveal threshold={0.3} className="mt-0">
                <p className="text-sm lg:text-lg text-white/50 leading-relaxed max-w-xl mb-12 lg:mb-16">
                  {m.description}
                </p>
              </ScrollReveal>
              <ScrollReveal threshold={0.3} className="mt-0">
                <div className="flex flex-wrap gap-x-12 lg:gap-x-16 gap-y-5">
                  {[["16+", m.stats[0]?.label || "jaar ervaring"], ["2500+", m.stats[1]?.label || "projecten"], ["16+", m.stats[2]?.label || "vakmensen"], ["24u", m.stats[3]?.label || "offerte"]].map(([val, label]) => (
                    <div key={`stat-${label}`}>
                      <div className="font-display text-2xl lg:text-3xl font-extrabold text-white tabular-nums leading-none">{val}</div>
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider mt-1">{label}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              <div className="lg:col-span-4 lg:sticky lg:top-32">
                <ScrollReveal>
                  <p className="text-micro text-muted/50 mb-4">{m.story.label}</p>
                </ScrollReveal>
                <ScrollReveal className="mt-0">
                  <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[0.9] tracking-[-0.02em] text-ink mb-5"
                    dangerouslySetInnerHTML={{ __html: m.story.title.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
                  />
                </ScrollReveal>
                <ScrollReveal className="mt-0">
                  <p className="text-sm text-muted leading-relaxed">
                    {m.story.description}
                  </p>
                </ScrollReveal>
              </div>
              <div className="lg:col-span-7 lg:col-start-6" ref={timelineRef}>
                <div className="relative">
                  <div className="absolute left-[7px] top-0 w-px bg-hairline hidden lg:block" style={{ height: "100%" }} />
                  <div className="absolute left-[7px] top-0 w-px bg-brand hidden lg:block transition-none" style={{ height: `${timelineProgress * 100}%` }} />
                  <div className="space-y-14 lg:space-y-16">
                    {m.milestones.map((mil, i) => (
                      <ScrollReveal key={mil.year} threshold={0.2}>
                        <div className="relative pl-8 lg:pl-10 group">
                          <div className="absolute left-0 lg:-left-[9px] top-1 w-3.5 h-3.5 rounded-full border-2 border-bg transition-all duration-500" style={{ background: timelineProgress > (i / m.milestones.length) * 0.8 ? "var(--color-brand)" : "var(--color-hairline)", boxShadow: timelineProgress > (i / m.milestones.length) * 0.8 ? "0 0 0 3px rgba(66,168,242,0.2)" : "none" }} />
                          <span className="font-display text-lg lg:text-xl font-extrabold text-brand tabular-nums mb-1.5 block group-hover:translate-x-1 transition-transform duration-300">{mil.year}</span>
                          <p className="text-sm text-copy leading-relaxed group-hover:translate-x-1 transition-transform duration-300 delay-75">{mil.text}</p>
                        </div>
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20 bg-bg">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
            <ScrollReveal>
              <p className="text-micro text-muted/50 mb-4">{m.work.label}</p>
            </ScrollReveal>
            <ScrollReveal className="mt-0">
              <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-extrabold leading-[0.95] tracking-[-0.02em] text-ink mb-8"
                dangerouslySetInnerHTML={{ __html: m.work.title.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
              />
            </ScrollReveal>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
              {m.work.photos.map((p, i) => (
                <ScrollReveal key={photos[i]} threshold={0.1}>
                  <div className="relative aspect-[4/3] overflow-hidden group cursor-pointer">
                    <Image src={photos[i]} alt={p.label} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 768px) 50vw, 33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <p className="text-sm font-bold text-white">{p.label}</p>
                      <p className="text-[10px] text-white/50 uppercase tracking-wider mt-0.5">{p.location}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20 bg-concrete">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
            <ScrollReveal>
              <p className="text-micro text-muted/50 mb-4">{m.values.label}</p>
            </ScrollReveal>
            <ScrollReveal className="mt-0">
              <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold leading-[0.95] tracking-[-0.02em] text-ink mb-10"
                dangerouslySetInnerHTML={{ __html: m.values.title.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
              />
            </ScrollReveal>
            <div className="grid md:grid-cols-3 gap-10 lg:gap-12">
              {m.values.reasons.map((item, i) => (
                <ScrollReveal key={item.title} threshold={0.15}>
                  <div className="group">
                    <p className="font-display text-4xl lg:text-5xl font-extrabold text-brand mb-3 leading-none group-hover:scale-110 transition-transform duration-300 origin-left">{String(i + 1).padStart(2, "0")}</p>
                    <p className="text-base font-bold text-ink mb-2 group-hover:text-brand transition-colors duration-300">{item.title}</p>
                    <p className="text-sm text-muted leading-relaxed">{item.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20 bg-bg border-t border-hairline">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
            <ScrollReveal>
              <p className="text-micro text-muted/50 mb-6">{m.testimonials.label}</p>
            </ScrollReveal>
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-12 lg:mb-16">
              {testimonials.slice(0, 2).map((t, i) => (
                <ScrollReveal key={t.name} threshold={0.15}>
                  <div className="relative p-6 lg:p-8 bg-surface border border-hairline hover:shadow-[0_4px_24px_-8px_rgba(15,23,42,0.08)] transition-shadow duration-500">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-aurora-1 via-brand/40 to-aurora-2" />
                    <p className="text-sm text-copy leading-relaxed mb-5 italic">&ldquo;{t.text}&rdquo;</p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand text-xs font-bold shrink-0">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-ink">{t.name}</p>
                        <p className="text-[10px] text-muted uppercase tracking-wider mt-0.5">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-10">
              <div className="lg:w-2/5">
                <ScrollReveal>
                  <p className="text-micro text-muted/50 mb-3">{m.certifications.label}</p>
                </ScrollReveal>
                <ScrollReveal className="mt-0">
                  <h2 className="font-display text-xl lg:text-2xl font-extrabold leading-tight text-ink"
                    dangerouslySetInnerHTML={{ __html: m.certifications.title.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
                  />
                </ScrollReveal>
              </div>
              <div className="lg:w-1/3">
                <div className="flex flex-wrap gap-3">
                  {certData.map((cert) => (
                    <ScrollReveal key={cert.name} threshold={0.1}>
                      <div className="flex items-center gap-2.5 px-4 py-2.5 bg-surface border border-hairline hover:border-brand/30 transition-colors duration-300">
                        <Image src={cert.src} alt={cert.name} width={28} height={28} className="object-contain shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-ink">{cert.name}</p>
                          <p className="text-[9px] text-muted/60 leading-tight mt-0.5">{cert.description}</p>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
              <div className="lg:flex-1 lg:text-right">
                <ScrollReveal threshold={0.1}>
                  <Link
                    href="/contact/"
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-ink text-white text-xs font-bold uppercase tracking-wide rounded-full hover:bg-brand transition-all duration-300 hover:shadow-[0_4px_16px_-4px_rgba(66,168,242,0.3)] hover:-translate-y-0.5"
                  >
                    <span>{language === "nl" ? "Plan een gesprek" : "Book a call"}</span>
                    <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
