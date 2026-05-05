"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import FadeIn from "./FadeIn";
import { projectImages } from "@/lib/data";

/*
 * Project gallery — hairline-grid layout. Every 6th tile is a wide one
 * for visual rhythm. Hover reveals a typographic label inside a soft
 * scrim that reads as ink-on-mist, never as dark veil.
 */
export default function ProjectGallery() {
  const [lightbox, setLightbox] = useState<{ src: string; label: string } | null>(null);

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
    <>
      <div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-hairline border border-hairline"
        style={{ gridAutoFlow: "dense", gridAutoRows: "200px" }}
      >
        {projectImages.map((project, i) => {
          const isWide = i % 6 === 0;
          return (
            <FadeIn
              key={project.src + i}
              delay={Math.min(i * 25, 400)}
              direction="scale"
              className={`h-full bg-base${isWide ? " lg:col-span-2" : ""}`}
            >
              <button
                onClick={() => setLightbox({ src: project.src, label: project.label })}
                className="relative overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset w-full h-full block"
                aria-label={`Vergroot foto: ${project.label}`}
              >
                <Image
                  src={project.src}
                  alt={project.label}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {/* Bottom-left typographic label, fades in on hover */}
                <div
                  className="absolute inset-x-0 bottom-0 p-4 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0"
                  style={{
                    background:
                      "linear-gradient(to top, color-mix(in oklch, var(--color-base) 96%, transparent) 0%, transparent 100%)",
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="block w-6 h-px mb-2"
                    style={{
                      background:
                        "linear-gradient(90deg, var(--color-brand) 0%, var(--color-aurora-2) 100%)",
                    }}
                  />
                  <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-ink font-sans line-clamp-1">
                    {project.label}
                  </p>
                </div>
              </button>
            </FadeIn>
          );
        })}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Vergrote foto: ${lightbox.label}`}
          style={{ background: "color-mix(in oklch, var(--color-ink) 92%, transparent)" }}
        >
          <button
            type="button"
            className="absolute top-5 right-5 z-10 w-11 h-11 flex items-center justify-center text-base hover:text-brand transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(null);
            }}
            aria-label="Sluit vergroting"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <Image
            src={lightbox.src}
            alt={lightbox.label}
            width={1600}
            height={1067}
            className="max-w-full max-h-[88vh] w-auto h-auto object-contain cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="absolute bottom-6 inset-x-0 text-center text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-base/70 font-sans">
            {lightbox.label}
          </p>
        </div>
      )}
    </>
  );
}
