import Image from "next/image";
import { services } from "@/lib/data";
import Reveal from "../components/Reveal";

export default function Services() {
  return (
    <section id="diensten" className="relative py-20 lg:py-28 bg-surface overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-aurora-1/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-[1200px] mx-auto px-6 lg:px-8">

        {/* Section header */}
        <Reveal>
          <div className="text-center mb-16 lg:mb-20">
            <span className="inline-flex items-center gap-2.5 text-sm font-bold uppercase tracking-[0.2em] text-brand mb-5">
              <span className="w-2 h-2 rounded-full bg-brand shrink-0" />
              Onze diensten
            </span>
            <h2 className="text-[2.5rem] sm:text-[3.25rem] lg:text-[4rem] font-bold leading-[1.0] tracking-tight text-ink mb-6">
              Alles voor een{" "}
              <span className="text-brand">energiezuinige woning</span>
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Complete duurzame oplossingen op maat, van advies tot oplevering
            </p>
          </div>
        </Reveal>

        {/* Modern service grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={i * 100}>
              <div className="group relative bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:shadow-brand/10 transition-all duration-500 transform hover:-translate-y-2">
                
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-aurora-1/10 to-aurora-2/10">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                </div>

                {/* Content */}
                <div className="p-6 lg:p-8">
                  {/* Badge */}
                  {service.popular && (
                    <div className="inline-flex items-center gap-2 mb-4">
                      <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
                        Populair
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-xl lg:text-2xl font-bold text-ink mb-3 group-hover:text-brand transition-colors duration-300">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-base text-muted leading-relaxed mb-6">
                    {service.summary}
                  </p>

                  {/* Learn more link */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-brand uppercase tracking-[0.18em]">
                      Meer informatie
                    </span>
                    <svg 
                      className="w-4 h-4 text-brand transition-transform duration-300 group-hover:translate-x-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <Reveal delay={400}>
          <div className="text-center mt-12 lg:mt-16">
            <p className="text-lg text-muted mb-6">
              Klaar voor een duurzame toekomst? Laat u adviseren door onze experts.
            </p>
            <a
              href="/contact/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand text-white text-lg font-semibold rounded-full hover:bg-brand-deep transition-all duration-300 hover:shadow-lg hover:shadow-brand/25"
            >
              Offerte aanvragen
              <svg 
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </Reveal>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand to-transparent opacity-30" />
    </section>
  );
}
