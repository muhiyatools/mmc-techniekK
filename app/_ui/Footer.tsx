"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { contactInfo } from "@/lib/data";
import Reveal from "./Reveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Footer() {
  const { t, language } = useLanguage();
  const pathname = usePathname();
  const isContactPage = pathname === "/contact" || pathname === "/contact/";

  return (
    <footer>
      {!isContactPage && (
        <div className="bg-brand">
          <div className="h-[2px] bg-gradient-to-r from-aurora-1 via-white/40 to-aurora-2" />
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-10 lg:py-14">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <Reveal>
                <div className="max-w-xl">
                  <p className="text-label text-white/50 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                    {language === "nl" ? "OFFERTE" : "QUOTE"}
                  </p>
                  <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-white leading-none uppercase tracking-tight mb-3">
                    {t.components.preFooter.title}
                  </h2>
                  <p className="text-white/60 text-sm max-w-md">
                    {t.components.preFooter.description}
                  </p>
                </div>
              </Reveal>

              <Reveal delay={150}>
                <div className="flex gap-4 items-center shrink-0">
                  <Link
                    href="/contact/"
                    className="bg-white text-brand px-8 py-3.5 text-xs font-bold uppercase tracking-[0.15em] hover:opacity-85 transition-all duration-300"
                  >
                    {t.components.preFooter.requestQuote}
                  </Link>
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="text-white/70 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.15em] border border-white/25 hover:border-white/60 hover:text-white transition-all duration-300"
                  >
                    {t.components.preFooter.callDirect}
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      )}

      <div className="bg-brand-deep">
        <div className={`max-w-[1280px] mx-auto px-6 lg:px-10 ${isContactPage ? "pt-20" : "pt-6"}`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pt-16 lg:pt-20">
            <div className="lg:col-span-5">
              <Reveal>
                <div className="mb-10">
                  <Image
                    src="/images/logo.png"
                    alt="MMC Techniek B.V."
                    width={240}
                    height={80}
                    className="h-12 w-auto object-contain mb-6 brightness-0 invert opacity-85"
                  />
                  <p className="text-white/50 text-sm leading-relaxed max-w-sm mb-6">
                    {t.components.footer.tagline}
                  </p>

                  <div className="flex items-center gap-6">
                    {t.components.footer.certifications.map((c) => (
                      <div key={c.name} className="flex items-center gap-3">
                        <div className="relative w-9 h-9 shrink-0">
                          <Image
                            src={c.name === "NEN-3140" ? "/images/certifications/nen-3140.png" : "/images/certifications/vca.png"}
                            alt={c.name}
                            fill
                            className="object-contain brightness-0 invert opacity-60"
                          />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white/60">{c.name}</span>
                          <span className="hidden lg:block text-[9px] text-white/30 uppercase tracking-wider mt-0.5">{c.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-10 lg:gap-8">
              <Reveal delay={100}>
                <div>
                  <h4 className="text-label text-white/50 mb-6">{t.components.footer.services}</h4>
                  <ul className="space-y-3.5">
                    {[
                      { label: language === "nl" ? "Warmtepompen" : "Heat Pumps", href: "/aanbod/?dienst=warmtepompen" },
                      { label: language === "nl" ? "Zonnepanelen" : "Solar Panels", href: "/aanbod/?dienst=zonnepanelen" },
                      { label: language === "nl" ? "Airconditioning" : "Air Conditioning", href: "/aanbod/?dienst=airconditioning" },
                      { label: language === "nl" ? "Vloerverwarming" : "Underfloor Heating", href: "/aanbod/?dienst=vloerverwarming" },
                      { label: language === "nl" ? "Alle Diensten" : "All Services", href: "/aanbod/" },
                    ].map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="text-white/50 hover:text-white transition-colors duration-300 text-sm">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={200}>
                <div>
                  <h4 className="text-label text-white/50 mb-6">{t.components.footer.navigation}</h4>
                  <ul className="space-y-3.5">
                    {[
                      { label: t.nav.about, href: "/over-ons/" },
                      { label: language === "nl" ? "Onze Werkwijze" : "How we work", href: "/#werkwijze" },
                      { label: t.nav.projects, href: "/our-work/" },
                      { label: t.nav.faq, href: "/veelgestelde-vragen/" },
                      { label: t.nav.contact, href: "/contact/" },
                    ].map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="text-white/50 hover:text-white transition-colors duration-300 text-sm">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={300}>
                <div className="col-span-2 md:col-span-1">
                  <h4 className="text-label text-white/50 mb-6">{t.components.footer.contact}</h4>
                  <div className="text-white/50 text-sm space-y-3.5">
                    <p className="leading-relaxed max-w-[20ch]">
                      {contactInfo.address}
                    </p>
                    <p className="text-white/80 font-semibold text-base">
                      {contactInfo.phoneDisplay}
                    </p>
                    <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] pt-2">
                      {language === "nl" ? "MA_VR // 08:00 - 17:00" : "MON_FRI // 08:00 - 17:00"}
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-16">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
              &copy; {new Date().getFullYear()} MMC Techniek B.V. {t.components.footer.allRightsReserved}
            </p>
            <div className="flex items-center gap-4 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
              <span>KvK: {contactInfo.kvk}</span>
              <span>BTW: {contactInfo.btw}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
