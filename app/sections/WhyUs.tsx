import Image from "next/image";
import { whyChooseUs } from "@/lib/data";
import Reveal from "../components/Reveal";

export default function WhyUs() {
  return (
    <section id="over-ons" className="py-24 lg:py-32 bg-surface">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left — big number + intro */}
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <span className="inline-flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-muted mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                Waarom MMC Techniek
              </span>
            </Reveal>

            <Reveal delay={100}>
              <h2 className="text-[2.25rem] sm:text-[3rem] lg:text-[3.5rem] font-bold leading-[1.05] tracking-tight text-ink mb-8">
                Vakmanschap dat
                <br />
                <span className="text-brand">u kunt zien</span>
              </h2>
            </Reveal>

            <Reveal delay={200}>
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-[6rem] sm:text-[8rem] font-bold leading-none text-brand tabular">
                  16+
                </span>
                <span className="text-lg font-semibold text-ink">jaar</span>
              </div>
              <p className="text-muted leading-relaxed max-w-sm">
                Sinds 2008 actief vanuit Oudewater. Dezelfde monteurs, hetzelfde commitment aan kwaliteit.
              </p>
            </Reveal>
          </div>

          {/* Right — reasons */}
          <div className="space-y-0">
            {whyChooseUs.map((item, i) => (
              <Reveal key={item.title} delay={i * 120}>
                <div className="flex gap-5 py-8 border-b border-border first:pt-0">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-elevated border border-border flex items-center justify-center">
                    <Image
                      src={item.image}
                      alt=""
                      width={24}
                      height={24}
                      className="w-6 h-6 object-contain opacity-70"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-ink mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">
                      {item.description}
                    </p>
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
