import FadeIn from "../components/FadeIn";
import HairlineDivider from "../components/HairlineDivider";
import InstrumentDot from "../components/InstrumentDot";
import { whyChooseUs } from "@/lib/data";

/*
 * Why us — asymmetric editorial. Giant brand "16+" anchors the left column
 * as a structural sculpture; right column is a hairline-separated list of
 * differentiators.
 */
export default function WhyChooseUs() {
  return (
    <section
      className="bg-concrete overflow-hidden"
      aria-labelledby="why-heading"
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-24 lg:py-32">

        <div className="mb-12 lg:mb-16">
          <FadeIn>
            <p className="inline-flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-muted font-sans mb-4">
              <InstrumentDot size={4} />
              Waarom MMC Techniek
            </p>
            <h2
              id="why-heading"
              className="font-display font-bold uppercase leading-[0.92] tracking-[-0.012em] text-ink max-w-[14ch]"
              style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.75rem)" }}
            >
              Vakmanschap dat<br />
              <span className="text-brand">u kunt zien</span>
            </h2>
          </FadeIn>
        </div>

        <div className="grid lg:grid-cols-[auto_1fr] gap-10 lg:gap-20 items-start">
          {/* Sculptural number */}
          <FadeIn direction="left">
            <div className="relative">
              <div
                className="font-display font-extrabold uppercase leading-none tracking-[-0.02em] text-brand select-none pointer-events-none"
                style={{ fontSize: "clamp(8rem, 20vw, 16rem)" }}
                aria-hidden="true"
              >
                16+
              </div>
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-muted font-sans mt-2">
                jaar in dezelfde regio
              </p>
            </div>
          </FadeIn>

          {/* Reasons */}
          <div>
            <HairlineDivider variant="aurora" draw />
            <ul className="divide-y divide-hairline">
              {whyChooseUs.map((item, i) => (
                <FadeIn key={item.title} delay={i * 80} direction="right">
                  <li className="py-7 lg:py-9">
                    <div className="mb-3">
                      <h3
                        className="font-display font-bold uppercase leading-[0.95] tracking-[-0.01em] text-ink"
                        style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)" }}
                      >
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-[0.9375rem] leading-[1.7] text-copy/80 font-sans max-w-[58ch] pl-10">
                      {item.description}
                    </p>
                  </li>
                </FadeIn>
              ))}
            </ul>
            <HairlineDivider variant="hairline" />
          </div>
        </div>
      </div>
    </section>
  );
}
