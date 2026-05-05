import Image from "next/image";
import Link from "next/link";
import { whyChooseUs, contactInfo } from "@/lib/data";
import Reveal from "../components/Reveal";

export default function TrustStrip() {
  return (
    <section className="py-24 lg:py-28 bg-base">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 lg:mb-20">
          <Reveal>
            <span className="inline-flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-muted mb-5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand" />
              Waarom wij
            </span>
            <h2 className="text-[2.5rem] sm:text-[3.5rem] lg:text-[4rem] font-bold leading-[1.05] tracking-tight text-ink">
              Het verschil zit in <span className="text-brand">de details</span>
            </h2>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-10 mb-20">
          {whyChooseUs.map((item, i) => (
            <Reveal key={item.title} delay={i * 100}>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mb-6">
                  <Image
                    src={item.image}
                    alt=""
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain opacity-70"
                  />
                </div>
                <h3 className="text-xl lg:text-2xl font-semibold text-ink mb-3">
                  {item.title}
                </h3>
                <p className="text-base text-muted leading-relaxed max-w-xs">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="text-center">
            <Link
              href="/contact/"
              className="inline-flex px-9 py-4 bg-brand text-white text-base font-semibold rounded-full hover:bg-brand-hover transition-all duration-300 hover:shadow-lg hover:shadow-brand/25"
            >
              Vraag een offerte aan
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
