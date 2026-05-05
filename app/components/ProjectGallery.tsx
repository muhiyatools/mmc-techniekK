"use client";

import { useState } from "react";
import Image from "next/image";
import FadeIn from "./FadeIn";
import { projectImages } from "@/lib/data";

export default function ProjectGallery() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <>
      {/* Fixed row height eliminates all gap artifacts from col-span collisions */}
      <div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
        style={{ gridAutoFlow: "dense", gridAutoRows: "220px" }}
      >
        {projectImages.map((project, i) => {
          // Wide tiles every 6th item; at lg they span 2 cols for visual rhythm
          const isWide = i % 6 === 0;
          return (
            <FadeIn
              key={project.src + i}
              delay={Math.min(i * 25, 400)}
              direction="scale"
              className={`h-full${isWide ? " lg:col-span-2" : ""}`}
            >
              <button
                onClick={() => setLightbox(project.src)}
                className="relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-brand w-full h-full"
                aria-label={`Bekijk foto: ${project.label}`}
              >
                <Image
                  src={project.src}
                  alt={project.label}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/40 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-ink/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-[0.8125rem] font-semibold text-base font-sans">{project.label}</p>
                </div>
              </button>
            </FadeIn>
          );
        })}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[70] bg-ink/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Afbeelding vergroting"
        >
          <button
            className="absolute top-4 right-4 text-base p-2 hover:text-brand transition-colors focus:outline-none focus:ring-2 focus:ring-brand"
            onClick={() => setLightbox(null)}
            aria-label="Sluit afbeelding"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <Image
            src={lightbox}
            alt="Project afbeelding"
            width={1200}
            height={800}
            className="max-w-full max-h-[85vh] object-contain"
          />
        </div>
      )}
    </>
  );
}
