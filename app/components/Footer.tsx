import Link from "next/link";
import { contactInfo } from "@/lib/data";
import Reveal from "./Reveal";

const serviceLinks = [
  "Warmtepompen",
  "Zonnepanelen",
  "Airconditioning",
  "Batterijopslag",
  "Vloerverwarming",
  "Meterkast & Liften",
];

export default function Footer() {
  return (
    <footer className="bg-ink text-white">

      {/* Main content */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8">

          {/* Brand */}
          <Reveal className="lg:col-span-4">
            <div>
              <div className="mb-5">
                <div className="text-3xl lg:text-4xl font-black tracking-tight text-white leading-none">
                  MMC
                </div>
                <div className="text-sm font-semibold tracking-[0.18em] text-white/40 uppercase mt-0.5">
                  Techniek B.V.
                </div>
              </div>
              <p className="text-sm text-white/50 leading-relaxed max-w-xs">
                Specialist in warmtepompen, zonnepanelen, airco en complete verduurzaming. Sinds 2008 actief vanuit Oudewater.
              </p>
            </div>
          </Reveal>

          {/* Navigation */}
          <Reveal delay={70} className="lg:col-span-2">
            <div>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/" className="text-white/55 hover:text-white transition-colors duration-200">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/our-work/" className="text-white/55 hover:text-white transition-colors duration-200">
                    Projecten
                  </Link>
                </li>
                <li>
                  <Link href="/over-ons/" className="text-white/55 hover:text-white transition-colors duration-200">
                    Over ons
                  </Link>
                </li>
                <li>
                  <Link href="/contact/" className="text-white/55 hover:text-white transition-colors duration-200">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </Reveal>

          {/* Services */}
          <Reveal delay={140} className="lg:col-span-3">
            <div>
              <ul className="space-y-3 text-sm">
                {serviceLinks.map((name) => (
                  <li key={name}>
                    <a
                      href="/#diensten"
                      className="text-white/55 hover:text-white transition-colors duration-200"
                    >
                      {name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Contact */}
          <Reveal delay={210} className="lg:col-span-3">
            <div>
              <ul className="space-y-3.5">
                <li>
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="text-white font-semibold text-lg hover:text-white/80 transition-colors duration-200 tabular"
                  >
                    {contactInfo.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-white/55 text-sm hover:text-white transition-colors duration-200"
                  >
                    {contactInfo.email}
                  </a>
                </li>
                <li className="text-white/35 text-sm leading-relaxed">
                  {contactInfo.address}
                </li>
                <li className="text-white/35 text-sm">
                  {contactInfo.hours}
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/25 text-xs">
            &copy; {new Date().getFullYear()} MMC Techniek B.V. Alle rechten voorbehouden.
          </p>
          <div className="flex items-center gap-5 text-xs text-white/20">
            <span>KvK: {contactInfo.kvk}</span>
            <span>BTW: {contactInfo.btw}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
