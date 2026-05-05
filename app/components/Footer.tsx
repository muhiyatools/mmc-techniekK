import Link from "next/link";
import { contactInfo } from "@/lib/data";
import Reveal from "./Reveal";

export default function Footer() {
  return (
    <footer className="bg-brand text-white">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-20 lg:py-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <Reveal>
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">MMC Techniek B.V.</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Specialist in warmtepompen, zonnepanelen, airco en complete verduurzaming. Sinds 2008 actief vanuit Oudewater.
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-white/50 mb-5">
                Contact
              </h4>
              <ul className="space-y-3 text-sm text-white/80">
                <li>
                  <a href={`tel:${contactInfo.phone}`} className="hover:text-white transition-colors">
                    {contactInfo.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${contactInfo.email}`} className="hover:text-white transition-colors">
                    {contactInfo.email}
                  </a>
                </li>
                <li className="text-white/60">{contactInfo.address}</li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-white/50 mb-5">
                Navigatie
              </h4>
              <ul className="space-y-3 text-sm text-white/80">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/over-ons/" className="hover:text-white transition-colors">Over ons</Link></li>
                <li><Link href="/contact/" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={240}>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-white/50 mb-5">
                Gegevens
              </h4>
              <ul className="space-y-3 text-sm text-white/80">
                <li>KvK: {contactInfo.kvk}</li>
                <li>BTW: {contactInfo.btw}</li>
                <li className="text-white/60">{contactInfo.hours}</li>
              </ul>
            </div>
          </Reveal>
        </div>

        <div className="mt-16 pt-8 border-t border-white/15 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/50">
            &copy; {new Date().getFullYear()} MMC Techniek B.V. Alle rechten voorbehouden.
          </p>
          <div className="flex items-center gap-6 text-xs text-white/50">
            <span>NEN-3140</span>
            <span>VCA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
