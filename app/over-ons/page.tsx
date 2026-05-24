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
  return <div ref={ref} className={className} style={{ opacity: 0, transform: "translateY(32px)", transition: "opacity 800ms cubic-bezier(0.16,1,0.3,1), transform 800ms cubic-bezier(0.16,1,0.3,1)" }}>{children}</div>;
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
              className={`inline-block translate-y-[115%] animate-[wordLift_800ms_cubic-bezier(0.16,1,0.3,1)_forwards] ${isBrand ? "text-brand" : ""}`}
              style={{ animationDelay: `${delay + i * 60}ms` }}
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
      <div className="pt-[104px] lg:pt-[114px]">
        {/* ── Hero ── */}
        <section className="relative min-h-[85vh] lg:min-h-[80vh] flex items-center bg-ink overflow-hidden">
          <div ref={heroParallax.ref} className="absolute inset-0" style={{ transform: `translateY(${heroParallax.offset}px)` }}>
            <Image src="/images/solarbackground.webp" alt="" fill className="object-cover opacity-25 lg:opacity-30 scale-105" priority />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/80 to-ink/20" />
          </div>

          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-aurora-1 via-brand to-aurora-2 animate-[aurora-drift_18s_linear_infinite] bg-[length:200%_100%] opacity-60" />

          <div className="relative w-full max-w-[1280px] mx-auto px-6 lg:px-10 py-16 lg:py-24">
            <div className="max-w-4xl lg:max-w-[1000px]">
              <ScrollReveal threshold={0.3}>
                <span className="text-[0.75rem] lg:text-[0.875rem] font-black uppercase tracking-[0.35em] text-brand mb-6 block">{m.label}</span>
              </ScrollReveal>

              <ScrollReveal delay={100} threshold={0.3}>
                <h1 
                  className="font-display text-[clamp(2.75rem,8vw,7.5rem)] lg:text-[clamp(4.5rem,7vw,9rem)] font-black leading-[0.95] tracking-tight text-white mb-8 uppercase text-wrap-balance"
                  dangerouslySetInnerHTML={{ __html: heroTitle.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
                />
              </ScrollReveal>

              <ScrollReveal delay={200} threshold={0.3}>
                <p className="text-[clamp(1.15rem,1.8vw,1.5rem)] text-white/70 font-medium leading-relaxed max-w-3xl mb-12">
                  {heroDesc}
                </p>
              </ScrollReveal>

              <ScrollReveal threshold={0.3}>
                <div className="flex flex-wrap gap-x-20 lg:gap-x-32 gap-y-8">
                  {statsData.map(([val, label]) => (
                    <div key={`stat-${label}`}>
                      <div className="font-display text-[clamp(3rem,5vw,5.5rem)] font-black text-white tabular-nums leading-none tracking-tighter">{val}</div>
                      <p className="text-[0.6875rem] lg:text-[0.8125rem] font-black text-brand uppercase tracking-[0.25em] mt-4">{label}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-aurora-2/40 via-brand/20 to-aurora-1/40" />
        </section>

        {/* ── Story + Timeline ── */}
        <section className="py-32 lg:py-56 relative bg-concrete/50">
          <div className="absolute top-0 left-0 right-0 h-px bg-hairline/40" />
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
            <div className="grid lg:grid-cols-12 gap-16 lg:gap-32 items-start">
              <div className="lg:col-span-5 lg:sticky lg:top-40">
                <ScrollReveal>
                  <span className="text-[0.75rem] lg:text-[0.875rem] font-black uppercase tracking-[0.3em] text-muted/50 mb-8 block">{m.story.label}</span>
                </ScrollReveal>
                <ScrollReveal>
                  <h2 className="font-display text-[clamp(2.75rem,5.5vw,6rem)] font-black leading-[0.85] tracking-[-0.04em] text-ink mb-12 uppercase"
                    dangerouslySetInnerHTML={{ __html: m.story.title.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
                  />
                </ScrollReveal>
                <ScrollReveal>
                  <p className="text-[clamp(1.1875rem,1.5vw,1.5rem)] text-muted/90 font-medium leading-relaxed max-w-xl">
                    {m.story.description}
                  </p>
                </ScrollReveal>

                <div className="hidden lg:block mt-20 h-1.5 bg-gradient-to-r from-brand/50 via-aurora-1/30 to-transparent rounded-full" />
              </div>

              <div className="lg:col-span-6 lg:col-start-7" ref={timelineRef}>
                <div className="relative">
                  <div className="absolute left-[7px] top-0 w-px bg-hairline hidden lg:block" style={{ height: "100%" }} />
                  <div className="absolute left-[7px] top-0 w-px bg-brand hidden lg:block transition-none" style={{ height: `${timelineProgress * 100}%` }} />
                  <div className="space-y-24 lg:space-y-36">
                    {m.milestones.map((mil, i) => (
                      <ScrollReveal key={mil.year} threshold={0.2}>
                        <div className="relative pl-12 lg:pl-20 group">
                          <div className="absolute left-0 lg:left-[-3px] top-2 w-6 h-6 rounded-full border-2 border-bg transition-all duration-700 z-10 shadow-lg" style={{ background: timelineProgress > (i / m.milestones.length) * 0.8 ? "var(--color-brand)" : "var(--color-hairline)", boxShadow: timelineProgress > (i / m.milestones.length) * 0.8 ? "0 0 20px rgba(66,168,242,0.4)" : "none" }} />
                          <span className="font-display text-[clamp(1.75rem,2.5vw,2.75rem)] font-black text-brand tabular-nums mb-4 block group-hover:translate-x-3 transition-transform duration-500">{mil.year}</span>
                          <p className="text-[clamp(1.125rem,1.35vw,1.375rem)] text-copy/90 font-bold leading-relaxed group-hover:translate-x-3 transition-transform duration-500 delay-75">{mil.text}</p>
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
        <section className="py-32 lg:py-56 bg-bg relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/20 to-transparent" />
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
            <ScrollReveal>
              <span className="text-[0.75rem] lg:text-[0.875rem] font-black uppercase tracking-[0.3em] text-muted/50 mb-8 block">{m.work.label}</span>
            </ScrollReveal>
            <ScrollReveal>
              <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-black leading-[0.9] tracking-[-0.03em] text-ink mb-20 lg:mb-28 uppercase"
                dangerouslySetInnerHTML={{ __html: m.work.title.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
              />
            </ScrollReveal>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
              {m.work.photos.map((p, i) => (
                <ScrollReveal key={photos[i]} threshold={0.1}>
                  <div className="relative aspect-[4/3] overflow-hidden group cursor-pointer bg-ink/5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-700">
                    <Image src={photos[i]} alt={p.label} fill className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110" sizes="(max-width: 768px) 50vw, 33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <p className="text-[clamp(1.125rem,1.5vw,1.375rem)] font-black text-white uppercase tracking-tight">{p.label}</p>
                      <p className="text-[0.625rem] lg:text-[0.75rem] text-brand font-black uppercase tracking-[0.3em] mt-3">{p.location}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Values ── */}
        <section className="py-32 lg:py-56 bg-ink relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[120px] -mr-64 -mt-64" />
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
            <ScrollReveal>
              <span className="text-[0.75rem] lg:text-[0.875rem] font-black uppercase tracking-[0.3em] text-white/30 mb-8 block">{m.values.label}</span>
            </ScrollReveal>
            <ScrollReveal>
              <h2 className="font-display text-[clamp(2.5rem,4.5vw,4rem)] font-black leading-[0.9] tracking-[-0.03em] text-white mb-24 lg:mb-36 uppercase"
                dangerouslySetInnerHTML={{ __html: m.values.title.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
              />
            </ScrollReveal>
            <div className="grid md:grid-cols-3 gap-20 lg:gap-24">
              {m.values.reasons.map((item, i) => (
                <ScrollReveal key={item.title} threshold={0.15}>
                  <div className="group relative">
                    <div className="h-1 bg-gradient-to-r from-brand via-brand to-brand/30 mb-14 scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left rounded-full" />
                    <p className="font-display text-[clamp(4rem,6vw,7rem)] font-black text-brand mb-6 leading-none opacity-20 group-hover:opacity-100 transition-opacity duration-700">{String(i + 1).padStart(2, "0")}</p>
                    <p className="text-[clamp(1.25rem,1.6vw,1.75rem)] font-black text-white mb-6 group-hover:text-brand transition-colors duration-300 uppercase tracking-tight">{item.title}</p>
                    <p className="text-[clamp(1.0625rem,1.2vw,1.1875rem)] text-white/50 leading-relaxed font-medium">{item.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="py-32 lg:py-56 bg-bg relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-aurora-2/30 to-transparent" />
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
            <ScrollReveal>
              <span className="text-[0.75rem] lg:text-[0.875rem] font-black uppercase tracking-[0.3em] text-muted/50 mb-12 block">{m.testimonials.label}</span>
            </ScrollReveal>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-32 lg:mb-48">
              {testimonials.slice(0, 2).map((t, i) => (
                <ScrollReveal key={t.name} threshold={0.15}>
                  <div className="relative p-12 lg:p-16 border-2 border-hairline transition-all duration-700 hover:border-brand/40 hover:shadow-2xl hover:shadow-brand/5 bg-surface rounded-3xl">
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-aurora-1 via-brand/40 to-aurora-2 bg-[length:200%_100%] animate-[aurora-drift_18s_linear_infinite] rounded-t-3xl" />
                    <svg className="w-12 h-12 text-brand/10 mb-10" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z" /></svg>
                    <p className="text-[clamp(1.25rem,1.6vw,1.625rem)] text-copy/90 leading-relaxed font-bold mb-12 italic">&ldquo;{t.text}&rdquo;</p>
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center text-brand text-xl font-black shrink-0 shadow-inner">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xl font-black text-ink uppercase tracking-tight">{t.name}</p>
                        <p className="text-[0.6875rem] lg:text-[0.75rem] text-brand font-black uppercase tracking-[0.3em] mt-2">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center gap-16 lg:gap-24">
              <div className="lg:w-2/5">
                <ScrollReveal>
                  <span className="text-[0.75rem] lg:text-[0.875rem] font-black uppercase tracking-[0.3em] text-muted/50 mb-6 block">{m.certifications.label}</span>
                </ScrollReveal>
                <ScrollReveal>
                  <h2 className="font-display text-[clamp(2rem,3vw,2.75rem)] font-black leading-tight text-ink mb-8 uppercase"
                    dangerouslySetInnerHTML={{ __html: m.certifications.title.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
                  />
                </ScrollReveal>
                <p className="text-[clamp(1.0625rem,1.2vw,1.25rem)] text-muted/80 font-medium leading-relaxed max-w-sm">{m.work.description}</p>
              </div>

              <div className="lg:w-1/3">
                <div className="grid grid-cols-1 gap-6">
                  {certData.map((cert) => (
                    <ScrollReveal key={cert.name} threshold={0.1}>
                      <div className="flex items-center gap-6 px-8 py-6 border-2 border-hairline hover:border-brand/40 transition-all duration-500 bg-surface rounded-2xl shadow-lg shadow-brand/5">
                        <Image src={cert.src} alt={cert.name} width={48} height={48} className="object-contain shrink-0" />
                        <div>
                          <p className="text-lg font-black text-ink uppercase tracking-tight">{cert.name}</p>
                          <p className="text-[0.625rem] lg:text-[0.6875rem] text-muted font-black uppercase tracking-[0.15em] leading-tight mt-2">{cert.description}</p>
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
                    className="group inline-flex items-center gap-5 px-12 py-6 bg-brand text-white text-[0.875rem] font-black uppercase tracking-[0.3em] rounded-full hover:bg-ink transition-all duration-500 shadow-2xl shadow-brand/30 hover:-translate-y-2 active:translate-y-0"
                  >
                    <span>{m.cta}</span>
                    <svg className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M17 8l4 4m0 0l-4 4m4-4H3" />
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
