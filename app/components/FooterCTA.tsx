import Link from "next/link";
import { contactInfo } from "@/lib/data";
import MicroLabel from "./MicroLabel";

/*
 * FooterCTA — full-width brand-deep closing band.
 * Final conversion push before the footer. Strong visual break.
 */
export default function FooterCTA() {
  return (
    <section className="bg-brand-deep" aria-labelledby="footer-cta-heading">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-20 lg:py-28">
        <div className="max-w-2xl mx-auto text-center">
          <MicroLabel variant="inverse" withDot className="mb-5 justify-center">
            Offerte aanvragen
          </MicroLabel>
          <h2
            id="footer-cta-heading"
            className="font-display font-extrabold uppercase leading-[0.88] tracking-[-0.012em] text-base mb-6"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
          >
            Klaar om te verduurzamen?
          </h2>
          <p className="text-[1.0625rem] leading-[1.7] text-base/80 font-sans mb-10 max-w-[50ch] mx-auto">
            Vraag een vrijblijvende offerte aan. We nemen binnen 24 uur contact op en komen graag bij u langs.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-base text-ink text-[0.6875rem] font-bold uppercase tracking-[0.12em] font-sans rounded-full hover:bg-concrete transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-base focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep"
            >
              Vraag uw offerte aan
              <span
                aria-hidden="true"
                className="block w-[5px] h-[5px] rounded-full bg-ink/80 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
            <a
              href={`tel:${contactInfo.phone}`}
              className="text-[0.9375rem] text-base/70 font-sans hover:text-base transition-colors duration-200 tabular"
            >
              {contactInfo.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
