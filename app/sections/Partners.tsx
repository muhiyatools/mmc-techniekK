import Image from "next/image";
import FadeIn from "../components/FadeIn";
import { clientLogosExtended } from "@/lib/data";

export default function Partners() {
  return (
    <section className="bg-concrete" aria-labelledby="partners-heading">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-16 lg:py-20">

        {/* Label row */}
        <FadeIn>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-12 lg:mb-14">
            <p
              id="partners-heading"
              className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-muted font-sans"
            >
              Vertrouwd door opdrachtgevers
            </p>
            <span className="text-[0.6875rem] font-sans text-muted/60 tracking-wide">
              Woningcorporaties &middot; Retailers &middot; Particulieren
            </span>
          </div>
        </FadeIn>

        {/* Static horizontal logo grid */}
        <FadeIn delay={60}>
          <div
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6 lg:gap-x-12 lg:gap-y-8"
            aria-label="Onze opdrachtgevers en partners"
          >
            {clientLogosExtended.map((logo, i) => {
              const isLarge =
                logo.src.includes("partner-4") || logo.src.includes("partner-6");
              return (
                <div
                  key={`${logo.name}-${i}`}
                  className="shrink-0 grayscale opacity-40 hover:grayscale-0 hover:opacity-90 transition-all duration-300"
                  aria-label={logo.name}
                >
                  <Image
                    src={logo.src}
                    alt={logo.name}
                    width={130}
                    height={52}
                    className={`${isLarge ? "h-14 lg:h-16" : "h-10 lg:h-12"} w-auto object-contain`}
                    loading="lazy"
                  />
                </div>
              );
            })}
          </div>
        </FadeIn>

      </div>
    </section>
  );
}
