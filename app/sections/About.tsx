import FadeIn from "../components/FadeIn";
import Image from "next/image";
import InstrumentDot from "../components/InstrumentDot";

/*
 * About preview block. Image on the left, prose on the right.
 * Replaces the previous "absolute stat block + decorative outline" treatment
 * with a Mist shelf that holds a single tabular metric row at the bottom.
 */
export default function About() {
  return (
    <section className="py-24 lg:py-32 bg-base" aria-labelledby="about-heading">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-[0.95fr_1fr] gap-12 lg:gap-20 items-center">
          <FadeIn>
            <div className="relative shelf overflow-hidden rounded-2xl" style={{ aspectRatio: "4 / 5" }}>
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px z-20 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, var(--color-aurora-1) 28%, var(--color-brand) 50%, var(--color-aurora-2) 72%, transparent 100%)",
                  backgroundSize: "200% 100%",
                  animation: "aurora-drift 18s linear infinite",
                }}
              />
              <Image
                src="/images/services/zonnepanelen.webp"
                alt="MMC Techniek monteurs aan het werk bij een zonnepanelen project in Oudewater"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </FadeIn>

          <div>
            <FadeIn delay={80}>
              <p className="inline-flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-muted font-sans mb-4">
                <InstrumentDot size={4} />
                Over ons
              </p>
              <h2
                id="about-heading"
                className="font-display font-bold uppercase leading-[0.95] tracking-[-0.012em] text-ink mb-6"
                style={{ fontSize: "clamp(1.875rem, 3vw, 2.75rem)" }}
              >
                Familiebedrijf uit Oudewater
              </h2>
            </FadeIn>

            <FadeIn delay={160}>
              <p className="text-[1rem] leading-[1.72] text-copy/80 font-sans mb-5 max-w-[62ch]">
                MMC Techniek B.V. is sinds 2008 actief vanuit Oudewater. We werken in heel Nederland, met een vast team van eigen monteurs. Geen onderaannemers, geen callcenters.
              </p>
              <p className="text-[1rem] leading-[1.72] text-copy/80 font-sans mb-10 max-w-[62ch]">
                Geen standaardpakketten. We meten op, rekenen door en stellen voor wat past bij uw woning, uw verbruik en uw budget.
              </p>
            </FadeIn>

            <FadeIn delay={240} direction="right">
              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-hairline border border-hairline rounded-xl overflow-hidden">
                {[
                  { value: "16+", label: "jaar" },
                  { value: "1000+", label: "klanten" },
                  { value: "7", label: "specialismen" },
                  { value: "A++", label: "energielabel" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-base p-5">
                    <dt className="tabular text-[1.5rem] font-extrabold text-ink leading-none font-display">
                      {stat.value}
                    </dt>
                    <dd className="text-[0.625rem] font-bold uppercase tracking-[0.22em] text-muted font-sans mt-2">
                      {stat.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
