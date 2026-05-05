"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "../components/FadeIn";
import HairlineDivider from "../components/HairlineDivider";
import InstrumentDot from "../components/InstrumentDot";

/*
 * Asymmetric editorial grid on Pearl. Hairline frames, no overlay-on-default;
 * the bottom-left label fades in on hover.
 *
 * Desktop layout (3 columns):
 *   ┌──────────────┬──────────┐
 *   │  img 1 (×2)  │  img 2   │  row 1
 *   ├──────┬───────┴──────────┤
 *   │ img3 │ img 4   │ img 5  │  row 2 (3 equal cols)
 *   └──────┴─────────┴────────┘
 */

const projects = [
  {
    src: "/images/projects/PHOTO-2024-12-03-12-54-01.jpg",
    label: "Warmtepomp installatie",
    location: "Oudewater",
    year: "2024",
  },
  {
    src: "/images/projects/PHOTO-2024-12-08-15-05-58.jpg",
    label: "Elektrische installatie",
    location: "Woerden",
    year: "2024",
  },
  {
    src: "/images/projects/20240920_112524-scaled.jpg",
    label: "Technisch onderhoud",
    location: "Oudewater",
    year: "2024",
  },
  {
    src: "/images/projects/PHOTO-2024-12-08-15-05-59.jpg",
    label: "Renovatieproject",
    location: "Utrecht",
    year: "2023",
  },
  {
    src: "/images/projects/PHOTO-2024-12-08-15-12-08.jpg",
    label: "Nieuwbouwproject",
    location: "Bodegraven",
    year: "2024",
  },
];

export default function Projects() {
  const [lightbox, setLightbox] = useState<{ src: string; label: string; location: string; year: string } | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    const currentIndex = projects.findIndex((p) => p.src === lightbox.src);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") {
        const next = (currentIndex + 1) % projects.length;
        setLightbox(projects[next]);
      }
      if (e.key === "ArrowLeft") {
        const prev = (currentIndex - 1 + projects.length) % projects.length;
        setLightbox(projects[prev]);
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  return (
    <section className="bg-concrete" aria-labelledby="projects-heading">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pt-24 lg:pt-32 pb-24 lg:pb-32">

        {/* Header */}
        <div className="grid lg:grid-cols-[1fr_auto] items-end gap-6 mb-12 lg:mb-16">
          <FadeIn>
            <p className="inline-flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-muted font-sans mb-4">
              <InstrumentDot size={4} />
              Onze projecten
            </p>
            <h2
              id="projects-heading"
              className="font-display font-bold uppercase leading-[0.92] tracking-[-0.012em] text-ink"
              style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.75rem)" }}
            >
              Werk dat<br />
              <span className="text-brand">voor zich spreekt</span>
            </h2>
          </FadeIn>
          <FadeIn delay={70}>
            <Link
              href="/projecten"
              className="group inline-flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-muted font-sans hover:text-ink transition-colors duration-200 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              Alle projecten
              <span
                aria-hidden="true"
                className="block w-[5px] h-px bg-brand transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          </FadeIn>
        </div>

        <FadeIn delay={120}>
          <HairlineDivider variant="aurora" draw />
        </FadeIn>

        <FadeIn delay={160}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-hairline mt-px">
            {/* Row 1 */}
            <button
              onClick={() => setLightbox({ src: projects[0].src, label: projects[0].label, location: projects[0].location, year: projects[0].year })}
              className="md:col-span-2 relative overflow-hidden h-64 md:h-[420px] group bg-base image-hover-tint cursor-zoom-in"
              aria-label={`Vergroot foto: ${projects[0].label}`}
            >
              <Image
                src={projects[0].src}
                alt={projects[0].label}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
              <PhotoLabel label={projects[0].label} location={projects[0].location} year={projects[0].year} />
            </button>

            <button
              onClick={() => setLightbox({ src: projects[1].src, label: projects[1].label, location: projects[1].location, year: projects[1].year })}
              className="md:col-span-1 relative overflow-hidden h-56 md:h-[420px] group bg-base image-hover-tint cursor-zoom-in"
              aria-label={`Vergroot foto: ${projects[1].label}`}
            >
              <Image
                src={projects[1].src}
                alt={projects[1].label}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <PhotoLabel label={projects[1].label} location={projects[1].location} year={projects[1].year} />
            </button>

            {/* Row 2 */}
            {projects.slice(2).map((p) => (
              <button
                key={p.src}
                onClick={() => setLightbox({ src: p.src, label: p.label, location: p.location, year: p.year })}
                className="md:col-span-1 relative overflow-hidden h-52 md:h-[300px] group bg-base image-hover-tint cursor-zoom-in"
                aria-label={`Vergroot foto: ${p.label}`}
              >
                <Image
                  src={p.src}
                  alt={p.label}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <PhotoLabel label={p.label} location={p.location} year={p.year} />
              </button>
            ))}
          </div>
        </FadeIn>
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
            className="absolute top-5 right-5 z-10 w-11 h-11 flex items-center justify-center text-base hover:text-brand transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
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
          <div className="absolute bottom-6 inset-x-0 text-center">
            <p className="text-[0.625rem] font-bold uppercase tracking-[0.22em] text-muted font-sans mb-1">
              {lightbox.location}{lightbox.year ? ` · ${lightbox.year}` : ""}
            </p>
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-base/70 font-sans">
              {lightbox.label}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

function PhotoLabel({ label, location, year }: { label: string; location: string; year?: string }) {
  return (
    <div
      className="absolute inset-x-0 bottom-0 p-5 lg:p-6 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0"
      style={{
        background:
          "linear-gradient(to top, color-mix(in oklch, var(--color-concrete) 92%, transparent) 0%, transparent 100%)",
      }}
    >
      <span
        aria-hidden="true"
        className="block w-8 h-px mb-3"
        style={{
          background:
            "linear-gradient(90deg, var(--color-brand) 0%, var(--color-aurora-2) 100%)",
        }}
      />
      <p className="text-[0.625rem] font-bold uppercase tracking-[0.22em] text-muted font-sans mb-1">
        {location}{year ? ` · ${year}` : ""}
      </p>
      <p className="font-display font-bold uppercase tracking-[-0.005em] text-ink text-[1.125rem] leading-tight">
        {label}
      </p>
    </div>
  );
}
