import Link from "next/link";
import Image from "next/image";
import { contactInfo } from "@/lib/data";
import Reveal from "./Reveal";

export default function Footer() {
  return (
    <footer className="bg-brand text-white overflow-hidden relative">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      
      {/* Main content */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Brand & Contact */}
          <Reveal className="lg:col-span-5">
            <div className="mb-8">
              <Image
                src="/images/logo.png"
                alt="MMC Techniek B.V."
                width={200}
                height={60}
                className="h-16 w-auto object-contain mb-6 brightness-0 invert"
              />
              <p className="text-sm text-white/80 leading-relaxed max-w-sm mb-8">
                Specialist in warmtepompen, zonnepanelen, airco en complete verduurzaming. 
                Sinds 2008 actief vanuit Oudewater.
              </p>
              
              {/* Contact CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-brand text-sm font-semibold rounded-full hover:bg-white/90 transition-all duration-300"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {contactInfo.phoneDisplay}
                </a>
                <Link
                  href="/contact/"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white text-sm font-semibold rounded-full hover:bg-white hover:text-brand transition-all duration-300"
                >
                  Contact
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Navigatie */}
          <Reveal delay={100} className="lg:col-span-2">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-white/50 mb-6">
                Navigatie
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/" className="text-white/70 hover:text-white transition-colors duration-200">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/our-work/" className="text-white/70 hover:text-white transition-colors duration-200">
                    Projecten
                  </Link>
                </li>
                <li>
                  <Link href="/over-ons/" className="text-white/70 hover:text-white transition-colors duration-200">
                    Over ons
                  </Link>
                </li>
                <li>
                  <Link href="/contact/" className="text-white/70 hover:text-white transition-colors duration-200">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </Reveal>

          {/* Contact Info */}
          <Reveal delay={200} className="lg:col-span-3">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-white/50 mb-6">
                Contactgegevens
              </h4>
              <ul className="space-y-4 text-sm">
                <li>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-white/70 hover:text-white transition-colors duration-200"
                  >
                    {contactInfo.email}
                  </a>
                </li>
                <li className="text-white/70 leading-relaxed">
                  {contactInfo.address}
                </li>
                <li className="text-white/70">
                  {contactInfo.hours}
                </li>
              </ul>
            </div>
          </Reveal>

          {/* KvK & BTW */}
          <Reveal delay={300} className="lg:col-span-2">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-white/50 mb-6">
                Bedrijfsinfo
              </h4>
              <ul className="space-y-3 text-sm">
                <li className="text-white/60">
                  <span className="text-white/40">KvK:</span> {contactInfo.kvk}
                </li>
                <li className="text-white/60">
                  <span className="text-white/40">BTW:</span> {contactInfo.btw}
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-6 text-center">
          <p className="text-white/40 text-xs">
            &copy; {new Date().getFullYear()} MMC Techniek B.V. Alle rechten voorbehouden.
          </p>
        </div>
      </div>
    </footer>
  );
}