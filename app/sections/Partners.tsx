import Image from "next/image";
import FadeIn from "../components/FadeIn";
import HairlineDivider from "../components/HairlineDivider";
import { clientLogosExtended } from "@/lib/data";

/*
 * Trusted-by row on Pearl. Logos sit in their own subtle hairline cells
 * so the row reads as a quiet ledger, not a cluttered logo soup.
 */
export default function Partners() {
  return (
    <section className="bg-concrete" aria-labelledby="partners-heading">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-16 lg:py-20">

        <FadeIn>
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-10 lg:mb-12">
            <p
              id="partners-heading"
              className="text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-muted font-sans"
            >
              Vertrouwd door opdrachtgevers
            </p>
            <span className="text-[0.6875rem] font-sans text-muted/70 tracking-wide">
              Woningcorporaties · retailers · particulieren
            </span>
          </div>
        </FadeIn>

        <FadeIn delay={60}>
          <HairlineDivider variant="hairline" />
        </FadeIn>

        <FadeIn delay={120}>
          <ul
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-hairline"
            aria-label="Onze opdrachtgevers en partners"
          >
            {clientLogosExtended.slice(0, 6).map((logo) => (
              <li
                key={logo.src}
                className="flex items-center justify-center h-20 lg:h-24 grayscale opacity-55 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                aria-label={logo.name}
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={130}
                  height={52}
                  className="h-9 lg:h-10 w-auto object-contain"
                  loading="lazy"
                />
              </li>
            ))}
          </ul>
        </FadeIn>

        <HairlineDivider variant="hairline" />

        <FadeIn delay={160}>
          <ul
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-x divide-hairline"
            aria-hidden="true"
          >
            {clientLogosExtended.slice(6).map((logo) => (
              <li
                key={logo.src}
                className="flex items-center justify-center h-20 lg:h-24 grayscale opacity-55 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              >
                <Image
                  src={logo.src}
                  alt=""
                  width={130}
                  height={52}
                  className="h-9 lg:h-10 w-auto object-contain"
                  loading="lazy"
                />
              </li>
            ))}
          </ul>
        </FadeIn>

        <HairlineDivider variant="hairline" />
      </div>
    </section>
  );
}
