"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { projectImages } from "@/lib/data";
import Reveal from "../_ui/Reveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function OurProjectsPage() {
  const { t } = useLanguage();
  const localized = t.sections.projects.items;
  const [lightbox, setLightbox] = useState<(typeof projectImages)[0] | null>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    lightboxRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-[70px] lg:pt-[114px]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <Reveal>
              <span className="inline-flex items-center gap-2.5 text-label text-muted mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                {t.pages.ourWork.label}
              </span>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="font-display text-[2.75rem] sm:text-[3.5rem] lg:text-[4.5rem] font-extrabold leading-[1.02] tracking-tight text-ink mb-8">
                {t.pages.ourWork.title}
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-xl text-muted leading-relaxed max-w-2xl">
                {t.pages.ourWork.description}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="pb-28 lg:pb-36 bg-bg">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-5">
            {projectImages.map((project, i) => {
              const proj = localized[i] || project;
              return (
              <Reveal key={project.src} delay={i * 60}>
                <button
                  onClick={() => setLightbox(project)}
                  className="group relative w-full overflow-hidden rounded-2xl cursor-zoom-in img-hover break-inside-avoid mb-5"
                >
                  <div className={`relative w-full ${
                    i % 5 === 0 ? "aspect-[4/5]" : i % 5 === 1 ? "aspect-[3/4]" : i % 5 === 2 ? "aspect-[4/3]" : i % 5 === 3 ? "aspect-[1/1]" : "aspect-[3/4]"
                  }`}>
                      <Image
                      src={project.src}
                      alt={proj.label}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <span className="inline-block px-3 py-1 bg-ink/60 text-white text-xs font-semibold uppercase tracking-wider rounded-full mb-3">
                      {proj.category}
                    </span>
                    <p className="text-white font-semibold text-xl">{proj.label}</p>
                    <p className="text-white/70 text-sm mt-1">{proj.location}</p>
                  </div>
                </button>
              </Reveal>
            )})}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          ref={lightboxRef}
          tabIndex={-1}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-ink/95 cursor-zoom-out animate-[fadeIn_200ms_ease-out]"
          onClick={() => setLightbox(null)}
          onTouchStart={(e) => { touchStartY.current = e.touches[0].clientY; }}
          onTouchEnd={(e) => {
            const delta = e.changedTouches[0].clientY - touchStartY.current;
            if (delta > 80) setLightbox(null);
          }}
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.label}
        >
          {/* Close button — larger on mobile */}
          <button
            className="absolute top-5 right-5 z-10 w-12 h-12 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white/70 hover:text-white hover:bg-white/20 transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(null);
            }}
            aria-label={t.pages.ourWork.close}
          >
            <svg className="w-6 h-6 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {/* Swipe hint on mobile */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 md:hidden flex flex-col items-center gap-1 pointer-events-none">
            <div className="w-8 h-1 rounded-full bg-white/30" />
            <span className="text-white/40 text-[10px] uppercase tracking-widest">Veeg omlaag om te sluiten</span>
          </div>
          <div className="animate-[scaleIn_200ms_ease-out]">
            <Image
              src={lightbox.src}
              alt={lightbox.label}
              width={1400}
              height={1000}
              className="max-w-full max-h-[82vh] w-auto h-auto object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="absolute bottom-6 inset-x-0 text-center">
            <span className="inline-block px-3 py-1 bg-ink/60 text-white text-xs font-semibold uppercase tracking-wider rounded-full mb-2">
              {lightbox.category}
            </span>
            <p className="text-white font-semibold text-base mt-1">
              {lightbox.label}
            </p>
            <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mt-1">
              {lightbox.location}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
