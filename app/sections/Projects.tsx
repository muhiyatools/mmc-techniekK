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
              className="group inline-flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-muted font-sans hover:text-ink transition-colors duration-200 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
            >
              Alle projecten
              <span
                aria-hidden="true"
                className="block w-[5px] h-[5px] rounded-full bg-brand transition-transform duration-200 group-hover:translate-x-0.5"
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
            <div className="md:col-span-2 relative overflow-hidden h-64 md:h-[420px] group bg-base">
              <Image
                src={projects[0].src}
                alt={projects[0].label}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
              <PhotoLabel label={projects[0].label} location={projects[0].location} />
            </div>

            <div className="md:col-span-1 relative overflow-hidden h-56 md:h-[420px] group bg-base">
              <Image
                src={projects[1].src}
                alt={projects[1].label}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <PhotoLabel label={projects[1].label} location={projects[1].location} />
            </div>

            {/* Row 2 */}
            {projects.slice(2).map((p) => (
              <div
                key={p.src}
                className="md:col-span-1 relative overflow-hidden h-52 md:h-[300px] group bg-base"
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
    </section>
  );
}

function PhotoLabel({ label, location }: { label: string; location: string }) {
  return (
    <div
      className="absolute inset-x-0 bottom-0 p-5 lg:p-6 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0"
      style={{
        background:
          "linear-gradient(to top, color-mix(in oklch, var(--color-base) 96%, transparent) 0%, transparent 100%)",
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
        {location}
      </p>
      <p className="font-display font-bold uppercase tracking-[-0.005em] text-ink text-[1.125rem] leading-tight">
        {label}
      </p>
    </div>
  );
}
