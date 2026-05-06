import Link from "next/link";
import { whyChooseUs, companyStats, contactInfo, certifications } from "@/lib/data";
import Reveal from "../components/Reveal";

export const metadata = {
  title: "Over ons | MMC Techniek B.V.",
  description:
    "Leer MMC Techniek B.V. kennen. Sinds 2008 uw specialist in warmtepompen, zonnepanelen, airco en verduurzaming uit Oudewater.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-[90px] lg:pt-[120px]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <Reveal>
              <span className="inline-flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-muted mb-6">
                <span className="w-2.5 h-2.5 rounded-full bg-brand" />
                Over ons
              </span>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="text-[2.75rem] sm:text-[3.5rem] lg:text-[4.5rem] font-bold leading-[1.02] tracking-tight text-ink mb-8">
                Vakmanschap uit
                <br />
                <span className="text-brand">Oudewater</span>
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-xl text-muted leading-relaxed max-w-2xl">
                Sinds 2008 installeren wij warmtepompen, zonnepanelen, airco en complete energiesystemen. Met een vast team van eigen vakmensen, geen onderaannemers, en een commitment dat niet ophoudt na oplevering.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-surface">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-20 lg:py-24">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {companyStats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 100}>
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-brand tabular mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-muted uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-28 lg:py-36 bg-base">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-20">
            <Reveal>
              <span className="inline-flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-muted mb-5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand" />
                Waarom MMC Techniek
              </span>
              <h2 className="text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem] font-bold leading-[1.05] tracking-tight text-ink">
                Het verschil zit in <span className="text-brand">de details</span>
              </h2>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-3 gap-10 lg:gap-12">
            {whyChooseUs.map((item, i) => (
              <Reveal key={item.title} delay={i * 100}>
                <div className="flex flex-col items-center text-center">
                  {/* Modern icon */}
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
        </div>
      </section>

      {/* Certifications */}
      <section className="py-28 lg:py-36 bg-surface">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-20">
            <Reveal>
              <span className="inline-flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-muted mb-5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand" />
                Gecertificeerd
              </span>
              <h2 className="text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem] font-bold leading-[1.05] tracking-tight text-ink">
                Erkend <span className="text-brand">vakmanschap</span>
              </h2>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-3xl mx-auto">
            {certifications.map((cert, i) => (
              <Reveal key={cert.name} delay={i * 100}>
                <div className="group flex items-center gap-6 p-8 bg-elevated rounded-2xl border border-border hover:border-brand/30 transition-all duration-500 hover:shadow-xl hover:shadow-brand/5">
                  <div className="shrink-0 w-20 h-20 rounded-xl bg-surface border border-border flex items-center justify-center">
                    <img
                      src={cert.src}
                      alt={cert.name}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-ink mb-1 group-hover:text-brand transition-colors duration-300">
                      {cert.name}
                    </h3>
                    <p className="text-base text-muted">
                      {cert.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 lg:py-36 bg-base">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="text-[2.25rem] sm:text-[3rem] font-bold leading-[1.05] tracking-tight text-ink mb-6">
              Klaar om uw woning te <span className="text-brand">verduurzamen</span>?
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-lg text-muted leading-relaxed max-w-xl mx-auto mb-10">
              Neem contact op voor een vrijblijvend gesprek. We komen graag bij u langs.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact/"
                className="px-9 py-4 bg-brand text-white text-base font-semibold rounded-full hover:bg-brand-hover transition-all duration-300 hover:shadow-lg hover:shadow-brand/25"
              >
                Offerte aanvragen
              </Link>
              <a
                href={`tel:${contactInfo.phone}`}
                className="px-9 py-4 border-2 border-border text-ink text-base font-semibold rounded-full hover:border-brand hover:text-brand transition-colors duration-300 tabular"
              >
                Bel {contactInfo.phoneDisplay}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
