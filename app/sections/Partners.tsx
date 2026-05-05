import Image from "next/image";
import { clientLogos } from "@/lib/data";
import Reveal from "../components/Reveal";

export default function Partners() {
  return (
    <section className="py-20 lg:py-24 bg-base">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-12">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-muted">
              Vertrouwd door opdrachtgevers
            </p>
            <p className="text-[0.6875rem] text-muted/60 tracking-wide">
              Woningcorporaties &middot; retailers &middot; particulieren
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden">
            {clientLogos.map((logo) => (
              <div
                key={logo.src}
                className="flex items-center justify-center h-24 lg:h-28 bg-elevated grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={120}
                  height={48}
                  className="h-8 lg:h-9 w-auto object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
