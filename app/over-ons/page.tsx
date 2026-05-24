"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { testimonials, certifications as certData } from "@/lib/data";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { fetchAdminStore } from "@/lib/adminStore";

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

function WordLift({ text, brandTag, delay = 0 }: { text: string; brandTag?: boolean; delay?: number }) {
  const words = text.split(" ");
  return (
    <span className="inline" style={{ animationDelay: `${delay}ms` }}>
      {words.map((w, i) => {
        const isBrand = brandTag && w.startsWith("<brand>") && w.endsWith("</brand>");
        const clean = w.replace(/<\/?brand>/g, "");
        return (
          <span key={i} className="inline-block overflow-hidden align-bottom leading-[0.9]">
            <span
              className={`inline-block translate-y-[115%] animate-[wordLift_720ms_cubic-bezier(0.16,1,0.3,1)_forwards] ${isBrand ? "text-brand" : ""}`}
              style={{ animationDelay: `${delay + i * 55}ms` }}
            >
              {clean}{i < words.length - 1 ? "\u00A0" : ""}
            </span>
          </span>
        );
      })}
    </span>
  );
}

export default function AboutPage() {
  const { t, language } = useLanguage();
  const m = t.pages.overOns;
  const [adminSettings, setAdminSettings] = useState<Record<string, string> | null>(null);
  const heroParallax = useParallax(0.25);
  const [timelineProgress, setTimelineProgress] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAdminStore().then(store => {
      setAdminSettings(store.settings ?? {});
    }).catch(() => {});
  }, []);

  const heroTitleKey = language === "nl" ? "about_hero_title_nl" : "about_hero_title_en";
  const heroDescKey = language === "nl" ? "about_hero_desc_nl" : "about_hero_desc_en";
  const heroTitle = adminSettings?.[heroTitleKey] ?? m.title;
  const heroDesc = adminSettings?.[heroDescKey] ?? m.description;

  const titleParts = heroTitle.split(/(<brand>.*?<\/brand>)/g);

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

  const statsData: [string, string][] = [
    ["16+", m.stats[0]?.label || "jaar ervaring"],
    ["2500+", m.stats[1]?.label || "projecten"],
    ["16+", m.stats[2]?.label || "vakmensen"],
    ["24u", m.stats[3]?.label || "offerte"],
  ];

  return (
    <>
      <div className="pt-[70px] lg:pt-[114px]">
        {/* ── Hero ── */}
        <section className="relative min-h-[85vh] lg:min-h-[80vh] flex items-center bg-ink overflow-hidden">
          <div ref={heroParallax.ref} className="absolute inset-0" style={{ transform: `translateY(${heroParallax.offset}px)` }}>
            <Image src={photos[0]} alt="" fill className="object-cover opacity-20 lg:opacity-25 scale-105" priority />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/70 to-ink/20" />
          </div>

          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-aurora-1/60 via-brand/40 to-aurora-2/60 animate-[aurora-drift_18s_linear_infinite] bg-[length:200%_100%]" />

          <div className="relative w-full max-w-[1280px] mx-auto px-6 lg:px-10 py-24 lg:py-32">
            <div className="max-w-3xl lg:max-w-[720px]">
              <ScrollReveal threshold={0.3}>
                <span className="text-micro text-white/40 mb-5 block">{m.label}</span>
              </ScrollReveal>

              <h1 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] lg:text-[clamp(3.5rem,5.5vw,6rem)] font-extrabold leading-[0.85] tracking-[-0.025em] text-white mb-6 overflow-hidden">
                {titleParts.map((part, i) => {
                  if (part.startsWith("<brand>")) {
                    const clean = part.replace(/<\/?brand>/g, "");
                    return <WordLift key={i} text={clean} brandTag delay={i * 120} />;
                  }
                  return <WordLift key={i} text={part} delay={i * 120} />;
                })}
              </h1>

              <ScrollReveal threshold={0.3}>
                <p className="text-[clamp(0.875rem,1.4vw,1.125rem)] text-white/50 leading-relaxed max-w-xl mb-12 lg:mb-16">
                  {heroDesc}
                </p>
              </ScrollReveal>

              <ScrollReveal threshold={0.3}>
                <div className="flex flex-wrap gap-x-12 lg:gap-x-16 gap-y-5">
                  {statsData.map(([val, label]) => (
                    <div key={`stat-${label}`}>
                      <div className="font-display text-[clamp(1.5rem,3vw,2.5rem)] font-extrabold text-white tabular-nums leading-none">{val}</div>
                      <p className="text-[clamp(0.5rem,0.7vw,0.6875rem)] font-bold text-white/30 uppercase tracking-wider mt-1">{label}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-aurora-2/60 via-brand/20 to-aurora-1/60" />
        </section>

        {/* ── Story + Timeline ── */}
        <section className="py-20 lg:py-28 relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-hairline/40" />
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              <div className="lg:col-span-4 lg:sticky lg:top-32">
                <ScrollReveal>
                  <span className="text-micro text-muted/50 mb-4 block">{m.story.label}</span>
                </ScrollReveal>
                <ScrollReveal>
                  <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[0.9] tracking-[-0.02em] text-ink mb-5"
                    dangerouslySetInnerHTML={{ __html: m.story.title.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
                  />
                </ScrollReveal>
                <ScrollReveal>
                  <p className="text-[clamp(0.8125rem,1.1vw,0.9375rem)] text-muted leading-relaxed">
                    {m.story.description}
                  </p>
                </ScrollReveal>

                <div className="hidden lg:block mt-10 h-px bg-gradient-to-r from-brand/40 via-aurora-1/20 to-transparent" />
              </div>

              <div className="lg:col-span-7 lg:col-start-6" ref={timelineRef}>
                <div className="relative">
                  <div className="absolute left-[7px] top-0 w-px bg-hairline hidden lg:block" style={{ height: "100%" }} />
                  <div className="absolute left-[7px] top-0 w-px bg-brand hidden lg:block transition-none" style={{ height: `${timelineProgress * 100}%` }} />
                  <div className="space-y-14 lg:space-y-16">
                    {m.milestones.map((mil, i) => (
                      <ScrollReveal key={mil.year} threshold={0.2}>
                        <div className="relative pl-8 lg:pl-10 group">
                          <div className="absolute left-0 lg:-left-[9px] top-1 w-3.5 h-3.5 rounded-full border-2 border-bg transition-all duration-700" style={{ background: timelineProgress > (i / m.milestones.length) * 0.8 ? "var(--color-brand)" : "var(--color-hairline)", boxShadow: timelineProgress > (i / m.milestones.length) * 0.8 ? "0 0 0 4px rgba(66,168,242,0.15)" : "none" }} />
                          <span className="font-display text-[clamp(1.125rem,1.5vw,1.5rem)] font-extrabold text-brand tabular-nums mb-1.5 block group-hover:translate-x-1 transition-transform duration-300">{mil.year}</span>
                          <p className="text-[clamp(0.8125rem,1.1vw,0.9375rem)] text-copy leading-relaxed group-hover:translate-x-1 transition-transform duration-300 delay-75">{mil.text}</p>
                        </div>
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Our Work ── */}
        <section className="py-20 lg:py-28 bg-bg relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/15 to-transparent" />
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
            <ScrollReveal>
              <span className="text-micro text-muted/50 mb-4 block">{m.work.label}</span>
            </ScrollReveal>
            <ScrollReveal>
              <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-extrabold leading-[0.95] tracking-[-0.02em] text-ink mb-8 lg:mb-10"
                dangerouslySetInnerHTML={{ __html: m.work.title.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
              />
            </ScrollReveal>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3">
              {m.work.photos.map((p, i) => (
                <ScrollReveal key={photos[i]} threshold={0.1}>
                  <div className="relative aspect-[4/3] overflow-hidden group cursor-pointer bg-ink/5">
                    <Image src={photos[i]} alt={p.label} fill className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110" sizes="(max-width: 768px) 50vw, 33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <p className="text-[clamp(0.75rem,1vw,0.875rem)] font-bold text-white">{p.label}</p>
                      <p className="text-[clamp(0.5rem,0.6vw,0.625rem)] text-white/50 uppercase tracking-wider mt-0.5">{p.location}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Values ── */}
        <section className="py-20 lg:py-28 bg-concrete relative">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
            <ScrollReveal>
              <span className="text-micro text-muted/50 mb-4 block">{m.values.label}</span>
            </ScrollReveal>
            <ScrollReveal>
              <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold leading-[0.95] tracking-[-0.02em] text-ink mb-10 lg:mb-14"
                dangerouslySetInnerHTML={{ __html: m.values.title.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
              />
            </ScrollReveal>
            <div className="grid md:grid-cols-3 gap-10 lg:gap-12">
              {m.values.reasons.map((item, i) => (
                <ScrollReveal key={item.title} threshold={0.15}>
                  <div className="group relative">
                    <div className="h-px bg-gradient-to-r from-brand/50 via-brand to-brand/50 mb-8 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                    <p className="font-display text-[clamp(2.5rem,4vw,4rem)] font-extrabold text-brand mb-3 leading-none">{String(i + 1).padStart(2, "0")}</p>
                    <p className="text-[clamp(0.9375rem,1.1vw,1.0625rem)] font-bold text-ink mb-2 group-hover:text-brand transition-colors duration-300">{item.title}</p>
                    <p className="text-[clamp(0.8125rem,1vw,0.9375rem)] text-muted leading-relaxed">{item.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials + Certifications ── */}
        <section className="py-20 lg:py-28 bg-bg relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-aurora-2/20 to-transparent" />
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
            <ScrollReveal>
              <span className="text-micro text-muted/50 mb-6 block">{m.testimonials.label}</span>
            </ScrollReveal>

            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-12 lg:mb-16">
              {testimonials.slice(0, 2).map((t, i) => (
                <ScrollReveal key={t.name} threshold={0.15}>
                  <div className="relative p-6 lg:p-8 border border-hairline transition-all duration-500 hover:shadow-[0_8px_32px_-12px_rgba(15,23,42,0.1)]">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-aurora-1 via-brand/40 to-aurora-2 bg-[length:200%_100%] animate-[aurora-drift_18s_linear_infinite]" />
                    <svg className="w-6 h-6 text-brand/15 mb-4" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z" /></svg>
                    <p className="text-[clamp(0.8125rem,1.1vw,0.9375rem)] text-copy leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand text-xs font-bold shrink-0">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-ink">{t.name}</p>
                        <p className="text-[clamp(0.5rem,0.6vw,0.625rem)] text-muted uppercase tracking-wider mt-0.5">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-10">
              <div className="lg:w-2/5">
                <ScrollReveal>
                  <span className="text-micro text-muted/50 mb-3 block">{m.certifications.label}</span>
                </ScrollReveal>
                <ScrollReveal>
                  <h2 className="font-display text-[clamp(1.125rem,1.8vw,1.5rem)] font-extrabold leading-tight text-ink mb-3"
                    dangerouslySetInnerHTML={{ __html: m.certifications.title.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
                  />
                </ScrollReveal>
                <p className="text-[clamp(0.75rem,1vw,0.875rem)] text-muted leading-relaxed max-w-sm">{m.work.description}</p>
              </div>

              <div className="lg:w-1/3">
                <div className="flex flex-wrap gap-3">
                  {certData.map((cert) => (
                    <ScrollReveal key={cert.name} threshold={0.1}>
                      <div className="flex items-center gap-2.5 px-4 py-2.5 border border-hairline hover:border-brand/30 transition-all duration-300 hover:shadow-[0_2px_12px_-4px_rgba(66,168,242,0.1)]">
                        <Image src={cert.src} alt={cert.name} width={28} height={28} className="object-contain shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-ink">{cert.name}</p>
                          <p className="text-[clamp(0.4375rem,0.5vw,0.5625rem)] text-muted/60 leading-tight mt-0.5">{cert.description}</p>
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
                    className="group inline-flex items-center gap-2.5 px-6 py-3.5 bg-ink text-white text-label uppercase rounded-full hover:bg-brand transition-all duration-300 hover:shadow-[0_8px_24px_-6px_rgba(66,168,242,0.3)] hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span>{m.cta}</span>
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

      <style jsx global>{`
        @keyframes wordLift {
          to { transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
