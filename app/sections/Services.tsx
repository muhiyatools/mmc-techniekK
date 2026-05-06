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
          <div className="mb-16 lg:mb-20">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
                Onze diensten
              </span>
            </div>
            <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.0] tracking-tight text-ink max-w-2xl">
              Alles voor een <span className="text-brand">energiezuinige woning</span>
            </h2>
          </div>
        </Reveal>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={i * 60}>
              <Link
                href={`/diensten/${service.slug}`}
                className="group block relative bg-mist border border-hairline overflow-hidden hover:border-brand/30 transition-colors duration-300"
              >
                {/* Aurora top stripe */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-aurora-1 via-brand/40 to-aurora-2 z-10" />

                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden relative">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {/* Caption overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
                    <div className="p-5 w-full">
                      <p className="text-white text-sm font-medium leading-relaxed">
                        {service.caption}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 lg:p-6">
                  {service.popular && (
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
                        Populair
                      </span>
                    </div>
                  )}

                  <h3 className="text-lg font-bold text-ink mb-2 group-hover:text-brand transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {service.summary}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <Reveal delay={300}>
          <div className="mt-14 lg:mt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-8 border-t border-hairline">
            <p className="text-base text-muted max-w-md">
              Klaar voor een duurzame toekomst? Laat u adviseren door onze experts.
            </p>
            <Link
              href="/contact/"
              className="px-8 py-3.5 bg-ink text-white text-sm font-bold uppercase tracking-wide rounded-full hover:bg-brand transition-colors duration-200 shrink-0"
            >
              Offerte aanvragen
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
