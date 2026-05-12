import Image from "next/image";
import Link from "next/link";
import { projectImages } from "@/lib/data";
import Reveal from "../components/Reveal";

const featured = projectImages.slice(0, 4);

export default function ProjectsPreview() {
  return (
    <section id="projecten" className="relative py-24 lg:py-36 bg-base overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16 lg:mb-24">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-brand" />
                <span className="text-label text-brand">Project Portfolio</span>
              </div>
              <h2 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[0.85] tracking-tight text-ink mb-6">
                Vakmanschap in <span className="text-brand">Beeld</span>.
              </h2>
              <p className="text-lg text-muted leading-relaxed max-w-lg">
                Een selectie van recente installaties waar we trots op zijn. Van particuliere woningen tot commerciële projecten.
              </p>
            </div>
            <Link
              href="/our-work/"
              className="group relative px-8 py-4 bg-ink text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full overflow-hidden transition-all duration-300"
            >
              <span className="relative z-10">Bekijk Alles</span>
              <div className="absolute inset-0 bg-brand translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
          </div>
        </Reveal>

        {/* Asymmetric grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Large feature */}
          <Reveal className="lg:col-span-7">
            <div className="group relative aspect-[4/5] lg:aspect-[16/11] overflow-hidden border border-hairline shelf-shadow">
              <Image
                src={featured[0].src}
                alt={featured[0].label}
                fill
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                <div className="flex items-center gap-4 mb-4">
                  <div className="px-2 py-0.5 border border-white/20 text-[9px] font-bold text-white uppercase tracking-widest">
                    {featured[0].category}
                  </div>
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    {featured[0].location}
                  </span>
                </div>
                <h3 className="text-2xl lg:text-3xl font-extrabold text-white mb-2">
                  {featured[0].label}
                </h3>
                <div className="text-[9px] font-bold text-brand uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                    Bekijk installatie &rarr;
                  </div>
              </div>

              {/* Technical Dot decoration */}
              <div className="absolute top-6 right-6 w-3 h-3 border border-white/30 flex items-center justify-center">
                <div className="w-1 h-1 bg-white" />
              </div>
            </div>
          </Reveal>

          {/* Side column */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-6 lg:gap-8">
            {featured.slice(1, 3).map((project, i) => (
              <Reveal key={project.src} delay={(i + 1) * 150}>
                <div className="group relative aspect-[16/10] overflow-hidden border border-hairline hover:shelf-shadow transition-all duration-500">
                  <Image
                    src={project.src}
                    alt={project.label}
                    fill
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest">
                        {project.category}
                      </span>
                    </div>
                    <h3 className="text-lg lg:text-xl font-bold text-white group-hover:text-brand transition-colors duration-300">
                      {project.label}
                    </h3>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
