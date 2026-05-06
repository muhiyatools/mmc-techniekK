import Image from "next/image";
import Link from "next/link";
import { projectImages } from "@/lib/data";
import Reveal from "../components/Reveal";

const featured = projectImages.slice(0, 4);

export default function ProjectsPreview() {
  return (
    <section className="relative py-24 lg:py-32 bg-base overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 lg:mb-16">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
                  Projecten
                </span>
              </div>
              <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.0] tracking-tight text-ink">
                Recent <span className="text-brand">opgeleverd</span>
              </h2>
            </div>
            <Link
              href="/our-work/"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-ink hover:text-brand transition-colors duration-200 shrink-0"
            >
              Bekijk alle projecten
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </Reveal>

        {/* Asymmetric grid */}
        <div className="grid md:grid-cols-2 gap-4 lg:gap-5">
          {/* Large feature */}
          <Reveal className="md:row-span-2">
            <div className="group relative h-full min-h-[320px] md:min-h-full overflow-hidden border border-hairline">
              <Image
                src={featured[0].src}
                alt={featured[0].label}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/60">
                    {featured[0].category}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/40" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/60">
                    {featured[0].location}
                  </span>
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-white">
                  {featured[0].label}
                </h3>
              </div>
            </div>
          </Reveal>

          {/* Two stacked */}
          {featured.slice(1, 3).map((project, i) => (
            <Reveal key={project.src} delay={(i + 1) * 80}>
              <div className="group relative aspect-[16/10] overflow-hidden border border-hairline">
                <Image
                  src={project.src}
                  alt={project.label}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/60">
                      {project.category}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-white/40" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/60">
                      {project.location}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{project.label}</h3>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
