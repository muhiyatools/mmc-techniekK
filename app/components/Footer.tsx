import { contactInfo } from "@/lib/data";
import Reveal from "./Reveal";

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <Reveal>
            <div>
              <h3 className="text-lg font-semibold mb-4">MMC Techniek B.V.</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Specialist in warmtepompen, zonnepanelen, airco en complete verduurzaming. Sinds 2008 actief vanuit Oudewater.
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">
                Contact
              </h4>
              <ul className="space-y-3 text-sm text-white/70">
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
                <li>{contactInfo.address}</li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">
                Diensten
              </h4>
              <ul className="space-y-3 text-sm text-white/70">
                <li>Warmtepompen</li>
                <li>Zonnepanelen</li>
                <li>Airconditioning</li>
                <li>Vloerverwarming</li>
                <li>Meterkast & Liften</li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={240}>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">
                Gegevens
              </h4>
              <ul className="space-y-3 text-sm text-white/70">
                <li>KvK: {contactInfo.kvk}</li>
                <li>BTW: {contactInfo.btw}</li>
                <li>{contactInfo.hours}</li>
              </ul>
            </div>
          </Reveal>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} MMC Techniek B.V. Alle rechten voorbehouden.
          </p>
          <div className="flex items-center gap-6 text-xs text-white/40">
            <span>NEN-3140</span>
            <span>VCA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
