import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/data";
import Reveal from "../components/Reveal";

export default function Services() {
  return (
    <section id="diensten" className="relative py-24 lg:py-32 bg-concrete">
      {/* Top hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-hairline to-transparent" />

      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <Reveal>
          <div className="mb-14 lg:mb-18 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
                  Onze diensten
                </span>
              </div>
              <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.0] tracking-tight text-ink max-w-xl">
                Alles voor een <span className="text-brand">energiezuinige woning</span>
              </h2>
            </div>
            <p className="text-base text-muted max-w-sm lg:text-right">
              Eigen monteurs, 16+ jaar ervaring. Van ontwerp tot oplevering.
            </p>
          </div>
        </Reveal>

        {/* Magazine grid — first card spans 2 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
          {services.map((service, i) => (
            <Reveal
              key={service.slug}
              delay={i * 50}
              className={i === 0 ? "sm:col-span-2 xl:col-span-2" : ""}
            >
              <Link
                href={`/diensten/${service.slug}`}
                className="group block relative overflow-hidden bg-ink hover:shadow-2xl hover:shadow-ink/20 transition-shadow duration-500"
              >
                {/* Image */}
                <div
                  className={`relative overflow-hidden ${
                    i === 0 ? "aspect-[16/7] sm:aspect-[21/9]" : "aspect-[4/3]"
                  }`}
                >
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes={
                      i === 0
                        ? "(max-width: 640px) 100vw, (max-width: 1280px) 66vw, 854px"
                        : "(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 427px"
                    }
                  />

                  {/* Gradient overlay — stronger at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />

                  {/* Top-right aurora accent */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand/10 blur-2xl rounded-full" />

                  {/* Content overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-5 lg:p-6">
                    {service.popular && (
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
                          Populair
                        </span>
                      </div>
                    )}

                    <h3
                      className={`font-bold text-white leading-tight mb-1.5 group-hover:text-brand transition-colors duration-300 ${
                        i === 0 ? "text-2xl lg:text-3xl" : "text-lg"
                      }`}
                    >
                      {service.title}
                    </h3>
                    <p className={`text-white/65 leading-relaxed ${i === 0 ? "text-sm lg:text-base max-w-md" : "text-sm"}`}>
                      {service.summary}
                    </p>

                    {/* CTA arrow */}
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand/80 group-hover:text-brand group-hover:gap-3 transition-all duration-300">
                      <span>Meer info</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <Reveal delay={300}>
          <div className="mt-12 lg:mt-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-8 border-t border-hairline">
            <p className="text-base text-muted max-w-md">
              Klaar voor een duurzame toekomst? Laat u adviseren door onze experts.
            </p>
            <Link
              href="/contact/"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-brand text-white text-sm font-bold uppercase tracking-wide rounded-full hover:bg-brand-deep transition-colors duration-200 shrink-0"
            >
              Offerte aanvragen
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </Reveal>
      </div>

      {/* Bottom hairline */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-hairline to-transparent" />
    </section>
  );
}
