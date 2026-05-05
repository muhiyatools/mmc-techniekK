import Image from "next/image";
import { services } from "@/lib/data";
import Reveal from "../components/Reveal";

export default function Services() {
  return (
    <section id="diensten" className="py-24 lg:py-32 bg-surface">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-16 lg:mb-24">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-muted mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-brand" />
              Onze diensten
            </span>
            <h2 className="text-[2.25rem] sm:text-[3rem] lg:text-[3.5rem] font-bold leading-[1.05] tracking-tight text-ink">
              Alles voor een
              <br />
              <span className="text-brand">energiezuinige woning</span>
            </h2>
          </Reveal>
          <Reveal delay={100} className="flex items-end">
            <p className="text-muted leading-relaxed max-w-md lg:ml-auto">
              Van advies en installatie tot onderhoud. Wij regelen het complete traject, zonder onderaannemers.
            </p>
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={i * 80}>
              <div className="group relative bg-elevated rounded-2xl overflow-hidden border border-border hover:border-brand/30 transition-colors duration-300 h-full flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden img-hover">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {service.popular && (
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center px-2.5 py-1 bg-brand text-white text-[0.625rem] font-semibold uppercase tracking-wider rounded-full">
                        Populair
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold text-ink mb-2 group-hover:text-brand transition-colors duration-200">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed flex-1">
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
