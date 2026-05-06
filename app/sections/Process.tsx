import { processSteps } from "@/lib/data";
import Reveal from "../components/Reveal";

export default function Process() {
  return (
    <section className="relative py-24 lg:py-32 bg-concrete">
      {/* Top hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-hairline to-transparent" />

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <Reveal>
          <div className="mb-16 lg:mb-20">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
                Onze werkwijze
              </span>
            </div>
            <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.0] tracking-tight text-ink max-w-xl">
              Van advies tot <span className="text-brand">oplevering</span> in vier stappen
            </h2>
          </div>
        </Reveal>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0">
          {processSteps.map((step, i) => (
            <Reveal key={step.step} delay={i * 80}>
              <div className={`relative p-6 lg:p-8 ${
                i !== processSteps.length - 1 ? "lg:border-r border-hairline" : ""
              } ${i < 2 ? "sm:border-b lg:border-b-0 border-hairline" : ""} ${
                i % 2 === 0 && i < processSteps.length - 1 ? "sm:border-r lg:border-r border-hairline" : ""
              }`}>
                {/* Step number */}
                <div className="font-display text-5xl lg:text-6xl font-extrabold text-brand/15 tabular mb-4">
                  {step.step}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-ink mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted leading-relaxed">
                  {step.description}
                </p>

                {/* Connector dot on desktop */}
                {i !== processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-[3px] w-1.5 h-1.5 rounded-full bg-brand z-10" />
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Bottom hairline */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-hairline to-transparent" />
    </section>
  );
}
