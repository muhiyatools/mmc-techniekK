import { processSteps } from "@/lib/data";
import Reveal from "../components/Reveal";

export default function Process() {
  return (
    <section className="py-24 lg:py-32 bg-base">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-16 lg:mb-24">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-muted mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-brand" />
              Werkwijze
            </span>
            <h2 className="text-[2.25rem] sm:text-[3rem] lg:text-[3.5rem] font-bold leading-[1.05] tracking-tight text-ink">
              Van advies tot
              <br />
              <span className="text-brand">oplevering</span>
            </h2>
          </Reveal>
          <Reveal delay={100} className="flex items-end">
            <p className="text-muted leading-relaxed max-w-md lg:ml-auto">
              Een helder proces zonder verrassingen. Vier vaste stappen, een eerlijke offerte binnen 24 uur en eigen monteurs op de werkvloer.
            </p>
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {processSteps.map((step, i) => (
            <Reveal key={step.step} delay={i * 100}>
              <div className="relative">
                <span className="text-[3.5rem] font-bold text-brand/10 leading-none tabular block mb-4">
                  {step.step}
                </span>
                <h3 className="text-lg font-semibold text-ink mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
