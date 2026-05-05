import Image from "next/image";
import { services } from "@/lib/data";
import Reveal from "../components/Reveal";

export default function Services() {
  return (
    <section className="py-24 lg:py-28 bg-surface">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 lg:mb-20">
          <Reveal>
            <span className="inline-flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-muted mb-5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand" />
              Onze diensten
            </span>
            <h2 className="text-[2.5rem] sm:text-[3.5rem] lg:text-[4rem] font-bold leading-[1.05] tracking-tight text-ink">
              Alles voor een <span className="text-brand">energiezuinige woning</span>
            </h2>
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={i * 80}>
              <div className="group relative bg-elevated rounded-2xl overflow-hidden border border-border hover:border-brand/30 transition-all duration-500 hover:shadow-xl hover:shadow-brand/5 h-full flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden img-hover">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {service.popular && (
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3 py-1.5 bg-brand text-white text-sm font-bold uppercase tracking-wider rounded-full">
                        Populair
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6 lg:p-7 flex flex-col flex-1">
                  <h3 className="text-xl lg:text-2xl font-semibold text-ink mb-2.5 group-hover:text-brand transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-base text-muted leading-relaxed flex-1">
                    {service.summary}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
