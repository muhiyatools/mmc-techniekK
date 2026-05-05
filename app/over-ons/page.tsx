import Image from "next/image";
import { whyChooseUs, companyStats, contactInfo } from "@/lib/data";
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
              <span className="inline-flex items-center gap-2.5 text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-muted mb-6">
                <span className="w-2 h-2 rounded-full bg-brand" />
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
                  <div className="text-sm font-medium text-muted uppercase tracking-wider">
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
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <div className="lg:sticky lg:top-32">
              <Reveal>
                <span className="inline-flex items-center gap-2.5 text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-muted mb-5">
                  <span className="w-2 h-2 rounded-full bg-brand" />
                  Waarom MMC Techniek
                </span>
              </Reveal>
              <Reveal delay={100}>
                <h2 className="text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem] font-bold leading-[1.05] tracking-tight text-ink mb-8">
                  Het verschil zit
                  <br />
                  <span className="text-brand">in de details</span>
                </h2>
              </Reveal>
              <Reveal delay={200}>
                <p className="text-lg text-muted leading-relaxed max-w-md">
                  We doen wat we zeggen en zeggen wat we doen. Geen mooie beloften, gewoon goed werk.
                </p>
              </Reveal>
            </div>

            <div className="space-y-0">
              {whyChooseUs.map((item, i) => (
                <Reveal key={item.title} delay={i * 120}>
                  <div className="flex gap-6 py-10 border-b border-border first:pt-0">
                    <div className="shrink-0 w-14 h-14 rounded-2xl bg-surface border border-border flex items-center justify-center">
                      <Image
                        src={item.image}
                        alt=""
                        width={28}
                        height={28}
                        className="w-7 h-7 object-contain opacity-70"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-ink mb-3">
                        {item.title}
                      </h3>
                      <p className="text-[0.9375rem] text-muted leading-relaxed">
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

      {/* CTA */}
      <section className="py-28 lg:py-36 bg-surface">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="text-[2.25rem] sm:text-[3rem] font-bold leading-[1.05] tracking-tight text-ink mb-6">
              Klaar om uw woning te
              <span className="text-brand"> verduurzamen</span>?
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-lg text-muted leading-relaxed max-w-xl mx-auto mb-10">
              Neem contact op voor een vrijblijvend gesprek. We komen graag bij u langs om de mogelijkheden te bespreken.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/contact"
                className="px-8 py-4 bg-brand text-white text-sm font-semibold rounded-full hover:bg-brand-hover transition-all duration-300 hover:shadow-lg hover:shadow-brand/25"
              >
                Offerte aanvragen
              </a>
              <a
                href={`tel:${contactInfo.phone}`}
                className="px-8 py-4 border border-border text-ink text-sm font-semibold rounded-full hover:border-brand hover:text-brand transition-colors duration-300 tabular"
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
