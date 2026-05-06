import Link from "next/link";
import { whyChooseUs } from "@/lib/data";
import Reveal from "../components/Reveal";

export default function TrustStrip() {
  return (
    <section className="relative py-20 lg:py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-base to-aurora-1/5" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand/5 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-aurora-1/5 blur-[80px]" />
      </div>

      <div className="relative max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="text-center mb-14 lg:mb-16">
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

        <div className="grid md:grid-cols-3 gap-10 lg:gap-12 mb-12">
          {whyChooseUs.map((item, i) => (
            <Reveal key={item.title} delay={i * 100}>
              <div className="flex flex-col items-center text-center">
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-brand/10 flex items-center justify-center mb-6">
                  {i === 0 && (
                    <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                    </svg>
                  )}
                  {i === 1 && (
                    <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                  )}
                  {i === 2 && (
                    <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  )}
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