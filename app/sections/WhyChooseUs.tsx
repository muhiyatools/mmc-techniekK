import FadeIn from "../components/FadeIn";
import { whyChooseUs } from "@/lib/data";

export default function WhyChooseUs() {
  return (
    <section
      className="bg-concrete overflow-hidden"
      aria-labelledby="why-heading"
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-20 lg:py-28">

        {/* Header row */}
        <div className="mb-16 lg:mb-20">
          <FadeIn>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted font-sans mb-4">
              Waarom MMC Techniek
            </p>
            <h2
              id="why-heading"
              className="font-display font-bold uppercase leading-[0.9] tracking-tight text-ink"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.8rem)" }}
            >
              Vakmanschap dat
              <br />
              <span className="text-brand">u kunt zien</span>
            </h2>
          </FadeIn>
        </div>

        {/* Giant structural "16" + reasons */}
        <div className="grid lg:grid-cols-[auto_1fr] gap-10 lg:gap-20 items-start">

          {/* Enormous number — pure structural sculpture */}
          <FadeIn direction="left">
            <div
              className="font-display font-extrabold uppercase leading-none tracking-tight text-brand select-none pointer-events-none"
              style={{ fontSize: "clamp(9rem, 22vw, 18rem)" }}
              aria-hidden="true"
            >
              16+
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted font-sans mt-2 pl-1">
              Jaar ervaring
            </p>
          </FadeIn>

          {/* Three reasons — text-first, no icons, no cards */}
          <div className="divide-y divide-concrete/0 space-y-0 border-t border-ink/10 lg:pt-4 lg:mt-10">
            {whyChooseUs.map((item, i) => (
              <FadeIn key={item.title} delay={i * 80} direction="right">
                <div className="py-8 lg:py-10 border-b border-ink/10">
                  <div className="flex gap-5 items-baseline mb-3">
                    <span
                      className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted/60 font-sans tabular-nums shrink-0"
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, "0")}.
                    </span>
                    <h3
                      className="font-display font-bold uppercase leading-[0.95] tracking-tight text-ink"
                      style={{ fontSize: "clamp(1.6rem, 3vw, 2.6rem)" }}
                    >
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-[15px] leading-[1.75] text-muted font-sans max-w-[58ch] pl-10">
                    {item.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
