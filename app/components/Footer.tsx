"use client";

import Link from "next/link";
import Image from "next/image";
import { contactInfo } from "@/lib/data";
import Reveal from "./Reveal";
import PreFooterCTA from "./PreFooterCTA";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-base">
      <PreFooterCTA />

      <div className="bg-[#0a0a0b] text-white overflow-hidden relative">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-24 pb-12 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12">

            {/* Brand Column */}
            <div className="lg:col-span-5">
              <Reveal>
                <div className="mb-10">
                  <Image
                    src="/images/logo.png"
                    alt="MMC Techniek B.V."
                    width={240}
                    height={80}
                    className="h-12 w-auto object-contain mb-8 opacity-90"
                    style={{ filter: "brightness(0) invert(1) sepia(0.5) saturate(5) hue-rotate(195deg)" }}
                  />
                  <p className="text-white/40 text-sm leading-relaxed max-w-sm mb-8">
                    {t.components.footer.tagline}
                  </p>

                  {/* Certification badges */}
                  <div className="flex items-center gap-4">
                    {t.components.footer.certifications.map((c) => (
                      <div key={c.name} className="flex items-center gap-2">
                        <div className="relative w-8 h-8">
                          <Image src={c.name === "NEN-3140" ? "/images/certifications/nen-3140.png" : "/images/certifications/vca.png"} alt={c.name} fill className="object-contain brightness-0 invert" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white/40">{c.name}</span>
                          <span className="hidden lg:block text-[9px] text-white/20">{c.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Navigation Grid */}
            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-8">

              <Reveal delay={100}>
                <div>
                  <h4 className="text-label text-brand mb-8 flex items-center gap-2">
                    <span className="w-1 h-1 bg-brand" />
                    {t.components.footer.services}
                  </h4>
                  <ul className="space-y-4">
                    {[
                      { label: language === "nl" ? "Warmtepompen" : "Heat Pumps", href: "/aanbod/?dienst=warmtepompen" },
                      { label: language === "nl" ? "Zonnepanelen" : "Solar Panels", href: "/aanbod/?dienst=zonnepanelen" },
                      { label: language === "nl" ? "Airconditioning" : "Air Conditioning", href: "/aanbod/?dienst=airconditioning" },
                      { label: language === "nl" ? "Vloerverwarming" : "Underfloor Heating", href: "/aanbod/?dienst=vloerverwarming" },
                      { label: language === "nl" ? "Alle Diensten" : "All Services", href: "/aanbod/" },
                    ].map((link) => (
                      <li key={link.label}>
                        <Link href={link.href} className="text-white/40 hover:text-white transition-colors duration-300 text-sm">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={200}>
                <div>
                  <h4 className="text-label text-brand mb-8 flex items-center gap-2">
                    <span className="w-1 h-1 bg-brand" />
                    {t.components.footer.navigation}
                  </h4>
                  <ul className="space-y-4">
                    {[
                      { label: t.nav.about, href: "/over-ons/" },
                      { label: language === "nl" ? "Onze Werkwijze" : "How we work", href: "/#werkwijze" },
                      { label: t.nav.projects, href: "/our-work/" },
                      { label: t.nav.faq, href: "/veelgestelde-vragen/" },
                      { label: t.nav.contact, href: "/contact/" },
                    ].map((link) => (
                      <li key={link.label}>
                        <Link href={link.href} className="text-white/40 hover:text-white transition-colors duration-300 text-sm">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={300}>
                <div className="col-span-2 md:col-span-1">
                  <h4 className="text-label text-brand mb-8 flex items-center gap-2">
                    <span className="w-1 h-1 bg-brand" />
                    {t.components.footer.contact}
                  </h4>
                  <div className="text-white/40 text-sm space-y-4">
                    <p className="leading-relaxed">
                      {contactInfo.address}
                    </p>
                    <p className="text-white/60 font-bold">
                      {contactInfo.phoneDisplay}
                    </p>
                    <p className="text-white/20 text-[10px] uppercase tracking-widest pt-4">
                      {language === "nl" ? "MA_VR // 08:00 - 17:00" : "MON_FRI // 08:00 - 17:00"}
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-8">
              <p className="text-[10px] font-bold text-white/10 uppercase tracking-[0.2em]">
                &copy; {new Date().getFullYear()} MMC Techniek B.V. {t.components.footer.allRightsReserved}
              </p>
              <div className="hidden sm:flex items-center gap-4 text-[10px] font-bold text-white/10 uppercase tracking-[0.2em]">
                <span>KvK: {contactInfo.kvk}</span>
                <span>BTW: {contactInfo.btw}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
