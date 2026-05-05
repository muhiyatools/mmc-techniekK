import Image from "next/image";
import Link from "next/link";
import FadeIn from "../components/FadeIn";

/*
  Asymmetric editorial grid — 5 real project photos.
  Desktop layout (3-column grid):
  ┌────────────────────┬──────────┐
  │  img 1 (col ×2)   │  img 2   │  row 1: h-[360px]
  ├──────────┬─────────┴──────────┤
  │  img 3   │  img 4  │  img 5   │  row 2: h-[280px]
  └──────────┴─────────┴──────────┘
  Mobile: single column, each image at a comfortable height.
*/

const projects = [
  {
    src: "/images/projects/PHOTO-2024-12-03-12-54-01.jpg",
    label: "Warmtepomp installatie",
    location: "Oudewater",
  },
  {
    src: "/images/projects/PHOTO-2024-12-08-15-05-58.jpg",
    label: "Elektrische installatie",
    location: "Woerden",
  },
  {
    src: "/images/projects/20240920_112524-scaled.jpg",
    label: "Technisch onderhoud",
    location: "Oudewater",
  },
  {
    src: "/images/projects/PHOTO-2024-12-08-15-05-59.jpg",
    label: "Renovatieproject",
    location: "Utrecht",
  },
  {
    src: "/images/projects/PHOTO-2024-12-08-15-12-08.jpg",
    label: "Nieuwbouwproject",
    location: "Bodegraven",
  },
];

export default function Projects() {
  return (
    <section className="bg-concrete" aria-labelledby="projects-heading">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pt-20 lg:pt-28">

        {/* Section header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-10">
          <FadeIn>
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.13em] text-muted font-sans mb-3">
              Onze projecten
            </p>
            <h2
              id="projects-heading"
              className="font-display font-bold uppercase leading-[0.9] tracking-tight text-ink"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.8rem)" }}
            >
              Werk dat
              <br />
              <span className="text-brand">voor zich spreekt</span>
            </h2>
          </FadeIn>
          <FadeIn delay={70}>
            <Link
              href="/projecten"
              className="inline-flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-muted font-sans hover:text-ink transition-colors duration-200 shrink-0 focus:outline-none focus:ring-2 focus:ring-brand"
            >
              Alle projecten
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </FadeIn>
        </div>

        <div className="pb-20 lg:pb-28">
          {/* Photo grid */}
          <FadeIn delay={60}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">

            {/* Row 1: large (2-col) + portrait (1-col) */}
            <div className="md:col-span-2 relative overflow-hidden h-64 md:h-[360px] group">
              <Image
                src={projects[0].src}
                alt={projects[0].label}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
              <PhotoLabel label={projects[0].label} location={projects[0].location} />
            </div>

            <div className="md:col-span-1 relative overflow-hidden h-56 md:h-[360px] group">
              <Image
                src={projects[1].src}
                alt={projects[1].label}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <PhotoLabel label={projects[1].label} location={projects[1].location} />
            </div>

            {/* Row 2: three equal columns */}
            {projects.slice(2).map((p) => (
              <div
                key={p.src}
                className="md:col-span-1 relative overflow-hidden h-52 md:h-[280px] group"
              >
                <Image
                  src={p.src}
                  alt={p.label}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <PhotoLabel label={p.label} location={p.location} />
              </div>
            ))}
          </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* Minimal photo label — bottom-left overlay on hover */
function PhotoLabel({ label, location }: { label: string; location: string }) {
  return (
    <div
      className="absolute inset-x-0 bottom-0 px-4 py-3 bg-ink/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between"
      aria-hidden="true"
    >
      <span className="text-[0.6875rem] font-semibold text-base font-sans">{label}</span>
      <span className="text-[0.625rem] text-base/60 font-sans">{location}</span>
    </div>
  );
}
