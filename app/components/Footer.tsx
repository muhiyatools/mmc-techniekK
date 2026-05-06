import Link from "next/link";
import { contactInfo } from "@/lib/data";
import Reveal from "./Reveal";

export default function Footer() {
  return (
    <footer className="bg-ink text-white overflow-hidden relative">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent" />
      
      {/* Main content */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-16 lg:py-20 relative">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Brand */}
          <Reveal className="lg:col-span-5">
            <div>
              <div className="mb-6">
                <div className="text-4xl lg:text-5xl font-black tracking-tight text-white leading-none">
                  MMC
                </div>
                <div className="text-sm font-semibold tracking-[0.18em] text-white/40 uppercase mt-1">
                  Techniek B.V.
                </div>
              </div>
              <p className="text-sm text-white/50 leading-relaxed max-w-sm mb-8">
                Specialist in warmtepompen, zonnepanelen, airco en complete verduurzaming. Sinds 2008 actief vanuit Oudewater.
              </p>
              
              {/* Contact CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="inline-flex items-center justify-center px-6 py-3 bg-brand text-white text-sm font-semibold rounded-full hover:bg-brand-hover transition-all duration-300"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {contactInfo.phoneDisplay}
                </a>
                <Link
                  href="/contact/"
                  className="inline-flex items-center justify-center px-6 py-3 border border-white/20 text-white text-sm font-semibold rounded-full hover:bg-white/10 transition-all duration-300"
                >
                  Contact
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Navigation */}
          <Reveal delay={100} className="lg:col-span-3">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-white/30 mb-6">
                Navigatie
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/" className="text-white/55 hover:text-brand transition-colors duration-200">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/our-work/" className="text-white/55 hover:text-brand transition-colors duration-200">
                    Projecten
                  </Link>
                </li>
                <li>
                  <Link href="/over-ons/" className="text-white/55 hover:text-brand transition-colors duration-200">
                    Over ons
                  </Link>
                </li>
                <li>
                  <Link href="/contact/" className="text-white/55 hover:text-brand transition-colors duration-200">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </Reveal>

          {/* Contact info */}
          <Reveal delay={200} className="lg:col-span-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-white/30 mb-6">
                Contact
              </h4>
              <ul className="space-y-4">
                <li>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-white/55 text-sm hover:text-brand transition-colors duration-200"
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
                <li className="flex items-center gap-4 text-xs text-white/20 pt-2">
                  <span>KvK: {contactInfo.kvk}</span>
                  <span>BTW: {contactInfo.btw}</span>
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
          <div className="flex items-center gap-2 text-xs text-white/20">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            <span>Online en bereikbaar</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
