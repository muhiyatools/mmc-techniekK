import Image from "next/image";
import { certifications } from "@/lib/data";
import Reveal from "../components/Reveal";

export default function Certifications() {
  return (
    <section className="py-20 lg:py-24 bg-surface">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-muted mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-brand" />
              Gecertificeerd
            </span>
            <h2 className="text-[2rem] sm:text-[2.5rem] font-bold leading-tight tracking-tight text-ink">
              Erkend vakmanschap
            </h2>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
            {certifications.map((cert) => (
              <div
                key={cert.name}
                className="flex flex-col items-center gap-3 px-8 py-6 bg-elevated rounded-2xl border border-border"
              >
                <Image
                  src={cert.src}
                  alt={cert.name}
                  width={80}
                  height={80}
                  className="w-16 h-16 object-contain"
                />
                <span className="text-sm font-semibold text-ink">{cert.name}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
