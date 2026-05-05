"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { projectImages } from "@/lib/data";
import Reveal from "../components/Reveal";

export default function Projects() {
  const [lightbox, setLightbox] = useState<(typeof projectImages)[0] | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  return (
    <section id="projecten" className="py-24 lg:py-32 bg-base">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-16 lg:mb-24">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-muted mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-brand" />
              Onze projecten
            </span>
            <h2 className="text-[2.25rem] sm:text-[3rem] lg:text-[3.5rem] font-bold leading-[1.05] tracking-tight text-ink">
              Werk dat
              <br />
              <span className="text-brand">voor zich spreekt</span>
            </h2>
          </Reveal>
          <Reveal delay={100} className="flex items-end">
            <p className="text-muted leading-relaxed max-w-md lg:ml-auto">
              Elk project krijgt dezelfde aandacht, of het nu gaat om een warmtepomp in een rijtjeshuis of een complete installatie in een nieuwbouwwoning.
            </p>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Large featured image */}
            <button
              onClick={() => setLightbox(projectImages[0])}
              className="md:col-span-2 md:row-span-2 relative aspect-[4/3] md:aspect-auto overflow-hidden rounded-2xl group cursor-zoom-in img-hover"
            >
              <Image
                src={projectImages[0].src}
                alt={projectImages[0].label}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-5 left-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <p className="text-white font-semibold">{projectImages[0].label}</p>
                <p className="text-white/70 text-sm">{projectImages[0].location}</p>
              </div>
            </button>

            {/* Smaller images */}
            {projectImages.slice(1, 5).map((project) => (
              <button
                key={project.src}
                onClick={() => setLightbox(project)}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl group cursor-zoom-in img-hover"
              >
                <Image
                  src={project.src}
                  alt={project.label}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <p className="text-white font-semibold text-sm">{project.label}</p>
                  <p className="text-white/70 text-xs">{project.location}</p>
                </div>
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-ink/95 cursor-zoom-out"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            className="absolute top-5 right-5 z-10 w-11 h-11 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(null);
            }}
            aria-label="Sluiten"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <Image
            src={lightbox.src}
            alt={lightbox.label}
            width={1400}
            height={1000}
            className="max-w-full max-h-[88vh] w-auto h-auto object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-6 inset-x-0 text-center">
            <p className="text-white/40 text-xs font-medium uppercase tracking-wider">
              {lightbox.location}
            </p>
            <p className="text-white/80 text-sm font-medium mt-1">
              {lightbox.label}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
