"use client";

import { useState, useEffect } from "react";
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

  const [currentYear, setCurrentYear] = useState(2026);
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="relative z-10 bg-ink">
      {/* ── Desktop footer ── */}
      <div className="hidden md:block">
        {!isContactPage && (
          <div className="bg-brand relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white_0%,transparent_70%)]" />
            <div className="h-[2px] bg-gradient-to-r from-aurora-1 via-white/60 to-aurora-2" />
            <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-16 lg:py-24 relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">
                <Reveal>
                  <div className="max-w-2xl">
                    <p className="text-[0.875rem] font-black uppercase tracking-[0.4em] text-white/60 mb-6 flex items-center gap-3">
                      <span className="w-2 h-2 bg-white/60 rounded-full animate-pulse" />
                      {language === "nl" ? "OFFERTE" : "QUOTE"}
                    </p>
                    <h2 className="font-display text-4xl lg:text-7xl font-black text-white leading-[0.9] uppercase tracking-[-0.03em] mb-8">
                      {t.components.preFooter.title}
                    </h2>
                    <p className="text-white/80 text-lg lg:text-xl max-w-xl font-medium leading-relaxed">
                      {t.components.preFooter.description}
                    </p>
                  </div>
                </Reveal>

                <Reveal delay={150}>
                  <div className="flex flex-col sm:flex-row gap-5 items-stretch sm:items-center shrink-0">
                    <Link
                      href="/contact/"
                      className="bg-white text-brand px-12 py-6 text-[0.875rem] font-black uppercase tracking-[0.25em] hover:bg-ink hover:text-white transition-all duration-500 text-center rounded-full shadow-2xl"
                    >
                      {t.components.preFooter.requestQuote}
                    </Link>
                    <a
                      href={`tel:${contactInfo.phone}`}
                      className="text-white px-10 py-6 text-[0.875rem] font-black uppercase tracking-[0.25em] border-2 border-white/30 hover:border-white hover:bg-white/10 transition-all duration-500 text-center rounded-full"
                    >
                      {t.components.preFooter.callDirect}
                    </a>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        )}

        <div className="bg-ink">
          <div className={`max-w-[1280px] mx-auto px-6 lg:px-10 ${isContactPage ? "pt-16 lg:pt-32" : "pt-8"}`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 pt-16 lg:pt-32">
              <div className="lg:col-span-5">
                <Reveal>
                  <div className="mb-16">
                    <Image
                      src="/images/logo.png"
                      alt="MMC Techniek B.V."
                      width={280}
                      height={92}
                      className="h-16 w-auto object-contain mb-10 brightness-0 invert opacity-100"
                    />
                    <p className="text-white/60 text-lg leading-relaxed max-w-md mb-10 font-medium">
                      {t.components.footer.tagline}
                    </p>

                    <div className="flex items-center gap-10">
                      {t.components.footer.certifications.map((c) => (
                        <div key={c.name} className="flex items-center gap-5">
                          <div className="relative w-12 h-12 shrink-0">
                            <Image
                              src={c.name === "NEN-3140" ? "/images/certifications/nen-3140.png" : "/images/certifications/vca.png"}
                              alt={c.name}
                              fill
                              className="object-contain brightness-0 invert opacity-60"
                            />
                          </div>
                          <div>
                            <span className="text-sm font-black text-white/80 uppercase tracking-widest block">{c.name}</span>
                            <span className="hidden lg:block text-xs text-white/30 uppercase tracking-[0.2em] mt-1.5">{c.description}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </div>

              <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-16 lg:gap-12">
                <Reveal delay={100}>
                  <div>
                    <h4 className="text-label text-brand mb-10 font-black">{t.components.footer.services}</h4>
                    <ul className="space-y-5">
                      {[
                        { label: language === "nl" ? "Warmtepompen" : "Heat Pumps", href: "/aanbod/?dienst=warmtepompen" },
                        { label: language === "nl" ? "Zonnepanelen" : "Solar Panels", href: "/aanbod/?dienst=zonnepanelen" },
                        { label: language === "nl" ? "Airconditioning" : "Air Conditioning", href: "/aanbod/?dienst=airconditioning" },
                        { label: language === "nl" ? "Meterkast" : "Meterkast", href: "/aanbod/?dienst=meterkast" },
                        { label: language === "nl" ? "Alle Diensten" : "All Services", href: "/aanbod/" },
                      ].map((link) => (
                        <li key={link.href}>
                          <Link href={link.href} className="text-white/50 hover:text-brand hover:translate-x-1 transition-all duration-300 text-base font-bold inline-block">
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>

                <Reveal delay={200}>
                  <div>
                    <h4 className="text-label text-brand mb-10 font-black">{t.components.footer.navigation}</h4>
                    <ul className="space-y-5">
                      {[
                        { label: t.nav.about, href: "/over-ons/" },
                        { label: language === "nl" ? "Onze Werkwijze" : "How we work", href: "/#werkwijze" },
                        { label: t.nav.projects, href: "/our-work/" },
                        { label: t.nav.faq, href: "/veelgestelde-vragen/" },
                        { label: t.nav.contact, href: "/contact/" },
                      ].map((link) => (
                        <li key={link.href}>
                          <Link href={link.href} className="text-white/50 hover:text-brand hover:translate-x-1 transition-all duration-300 text-base font-bold inline-block">
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>

                <Reveal delay={300}>
                  <div className="col-span-2 md:col-span-1">
                    <h4 className="text-label text-brand mb-10 font-black">{t.components.footer.contact}</h4>
                    <div className="text-white/60 text-base space-y-6">
                      <p className="leading-relaxed max-w-[20ch] font-medium">
                        {contactInfo.address}
                      </p>
                      <p className="text-white font-black text-2xl tracking-tighter">
                        {contactInfo.phoneDisplay}
                      </p>
                      <p className="text-brand/50 text-xs font-black uppercase tracking-[0.3em] pt-4 border-t border-white/5">
                        {language === "nl" ? "MA_VR // 08:00 - 17:00" : "MON_FRI // 08:00 - 17:00"}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-24">
            <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <p className="text-xs font-black text-brand uppercase tracking-[0.3em]">
                &copy; {currentYear} MMC Techniek B.V. {t.components.footer.allRightsReserved}
              </p>
              <div className="flex items-center gap-8 text-xs font-black text-brand uppercase tracking-[0.3em]">
                <span>KvK: <span className="text-white/80">{contactInfo.kvk}</span></span>
                <span>BTW: <span className="text-white/80">{contactInfo.btw}</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile footer ── */}
      <div className="md:hidden">
        {/* Pre-footer */}
        {!isContactPage && (
          <div className="bg-brand px-6 py-12 relative overflow-hidden">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-white/60 mb-4">{language === "nl" ? "OFFERTE" : "QUOTE"}</p>
            <h2 className="font-display text-3xl font-black text-white leading-none uppercase tracking-tight mb-4">
              {t.components.preFooter.title}
            </h2>
            <p className="text-white/80 text-base leading-relaxed mb-8 font-medium">
              {t.components.preFooter.description}
            </p>
            <div className="flex flex-col gap-4">
              <Link
                href="/contact/"
                className="w-full py-5 bg-white text-brand text-sm font-black uppercase tracking-[0.2em] rounded-full text-center shadow-xl"
              >
                {t.components.preFooter.requestQuote}
              </Link>
              <a
                href={`tel:${contactInfo.phone}`}
                className="w-full py-5 text-white text-sm font-black uppercase tracking-[0.2em] border-2 border-white/30 rounded-full text-center"
              >
                {t.components.preFooter.callDirect}
              </a>
            </div>
          </div>
        )}

        {/* Main footer */}
        <div className="bg-ink px-6 pt-12 pb-10">
          {/* Logo + tagline */}
          <div className="mb-10">
            <Image
              src="/images/logo.png"
              alt="MMC Techniek B.V."
              width={180}
              height={60}
              className="h-10 w-auto object-contain mb-6 brightness-0 invert opacity-100"
            />
            <p className="text-white/60 text-base leading-relaxed max-w-[30ch] font-medium">
              {t.components.footer.tagline}
            </p>
          </div>

          {/* Certs inline */}
          <div className="flex items-center gap-6 mb-10">
            {t.components.footer.certifications.map((c) => (
              <div key={c.name} className="relative w-10 h-10">
                <Image
                  src={c.name === "NEN-3140" ? "/images/certifications/nen-3140.png" : "/images/certifications/vca.png"}
                  alt={c.name}
                  fill
                  className="object-contain brightness-0 invert opacity-60"
                />
              </div>
            ))}
          </div>

          {/* Links grid */}
          <div className="grid grid-cols-1 gap-10 mb-10">
            <div>
              <p className="text-[11px] font-black text-brand uppercase tracking-[0.2em] mb-6">{t.components.footer.services}</p>
              <ul className="space-y-4">
                {[
                  { label: language === "nl" ? "Warmtepompen" : "Heat Pumps", href: "/aanbod/?dienst=warmtepompen" },
                  { label: language === "nl" ? "Zonnepanelen" : "Solar Panels", href: "/aanbod/?dienst=zonnepanelen" },
                  { label: language === "nl" ? "Airco" : "Air Conditioning", href: "/aanbod/?dienst=airconditioning" },
                  { label: language === "nl" ? "Meterkast" : "Meterkast", href: "/aanbod/?dienst=meterkast" },
                  { label: language === "nl" ? "Alle Diensten" : "All Services", href: "/aanbod/" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-white/50 text-base font-bold hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-black text-brand uppercase tracking-[0.2em] mb-6">{t.components.footer.navigation}</p>
              <ul className="space-y-4">
                {[
                  { label: t.nav.about, href: "/over-ons/" },
                  { label: language === "nl" ? "Werkwijze" : "How We Work", href: "/#werkwijze" },
                  { label: t.nav.projects, href: "/our-work/" },
                  { label: t.nav.faq, href: "/veelgestelde-vragen/" },
                  { label: t.nav.contact, href: "/contact/" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-white/50 text-base font-bold hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div className="border-t border-white/10 pt-8 mb-8">
            <p className="text-[11px] font-black text-brand uppercase tracking-[0.2em] mb-6">{t.components.footer.contact}</p>
            <p className="text-white/60 text-base leading-relaxed mb-4 font-medium">{contactInfo.address}</p>
            <p className="text-white font-black text-xl mb-2">{contactInfo.phoneDisplay}</p>
            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">
              {language === "nl" ? "MA_VR 08:00 - 17:00" : "MON_FRI 08:00 - 17:00"}
            </p>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/10 pt-6 pb-nav flex flex-col gap-2">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
              &copy; {currentYear} MMC Techniek B.V.
            </p>
            <div className="flex items-center gap-5 text-[10px] font-black text-white/15 uppercase tracking-[0.2em]">
              <span>KvK: {contactInfo.kvk}</span>
              <span>BTW: {contactInfo.btw}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
