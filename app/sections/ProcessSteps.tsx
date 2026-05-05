import FadeIn from "../components/FadeIn";
import HairlineDivider from "../components/HairlineDivider";
import InstrumentDot from "../components/InstrumentDot";
import { processSteps } from "@/lib/data";

/*
 * Process — daylight surface (was bg-ink, converted per brief).
 * Steps render in a horizontal row separated by hairline rules; on mobile
 * they collapse to a vertical timeline.
 */
export default function ProcessSteps() {
  return (
    <section className="bg-base" aria-labelledby="process-heading">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-24 lg:py-32">

        <div className="grid lg:grid-cols-[1fr_auto] items-end gap-6 mb-14 lg:mb-20">
          <FadeIn>
            <p className="inline-flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-muted font-sans mb-4">
              <InstrumentDot size={4} />
              Werkwijze
            </p>
            <h2
              id="process-heading"
              className="font-display font-bold uppercase leading-[0.92] tracking-[-0.012em] text-ink"
              style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.75rem)" }}
            >
              Van advies tot<br />
              <span className="text-brand">oplevering</span>
            </h2>
          </FadeIn>
          <FadeIn delay={60}>
            <p className="text-[0.9375rem] leading-[1.7] text-copy/75 font-sans max-w-[40ch]">
              Een helder proces zonder verrassingen. Vier vaste stappen, een eerlijke offerte binnen 24 uur en eigen monteurs op de werkvloer.
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={100}>
          <HairlineDivider variant="aurora" draw />
        </FadeIn>

        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-hairline">
          {processSteps.map((step, i) => (
            <FadeIn key={step.step} delay={140 + i * 60}>
              <li className="relative p-6 lg:p-8 lg:py-10 h-full flex flex-col">
                {/* Step index — tabular figures, brand color */}
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="tabular text-[2.5rem] lg:text-[3rem] font-display font-extrabold leading-none text-brand">
                    {step.step}
                  </span>
                  <span
                    aria-hidden="true"
                    className="block w-8 h-px bg-hairline self-center"
                  />
                </div>

                <h3 className="font-display font-bold uppercase tracking-[-0.005em] text-ink text-[1.125rem] leading-tight mb-3">
                  {step.title}
                </h3>
                <p className="text-[0.875rem] leading-[1.7] text-copy/75 font-sans">
                  {step.description}
                </p>
              </li>
            </FadeIn>
          ))}
        </ol>

        <HairlineDivider variant="hairline" />
      </div>
    </section>
  );
}
