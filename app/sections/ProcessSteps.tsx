import FadeIn from "../components/FadeIn";
import { processSteps } from "@/lib/data";

export default function ProcessSteps() {
  return (
    <section
      className="bg-ink"
      aria-labelledby="process-heading"
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-20 lg:py-28">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16 lg:mb-20">
          <FadeIn>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-brand font-sans mb-4">
              Werkwijze
            </p>
            <h2
              id="process-heading"
              className="font-display font-bold uppercase leading-[0.9] tracking-tight text-base"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.8rem)" }}
            >
              Van advies tot
              <br />
              oplevering
            </h2>
          </FadeIn>
          <FadeIn delay={60}>
            <p className="text-[15px] leading-[1.75] text-base/50 font-sans max-w-[38ch] lg:text-right">
              Een helder, eerlijk proces zonder verrassingen. Zo werkt MMC Techniek.
            </p>
          </FadeIn>
        </div>

        {/* Horizontal steps grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0">
          {processSteps.map((step, i) => (
            <FadeIn key={step.step} delay={i * 70}>
              <div
                className={`relative p-7 lg:p-8 ${
                  i < processSteps.length - 1
                    ? "border-b sm:border-b-0 sm:border-r border-base/10"
                    : ""
                }`}
              >
                {/* Step number — structural */}
                <div
                  className="font-display font-extrabold uppercase leading-none text-base/[0.07] mb-6 select-none"
                  style={{ fontSize: "clamp(4.5rem, 8vw, 6.5rem)" }}
                  aria-hidden="true"
                >
                  {step.step}
                </div>

                {/* Thin brand line separator */}
                <div className="w-8 h-[1.5px] bg-brand mb-5" aria-hidden="true" />

                {/* Title */}
                <h3 className="text-[14px] font-bold uppercase tracking-[0.07em] text-base font-sans mb-3 leading-snug">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-[13px] leading-[1.72] text-base/50 font-sans">
                  {step.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
