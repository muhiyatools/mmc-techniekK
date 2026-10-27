"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { contactInfo } from "@/lib/data";
import Reveal from "./Reveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const getCertImage = (name: string) => {
  if (name === "NEN-3140") return "/images/certifications/nen-3140.png";
  if (name === "NEN-1010") return "/images/nen1010.png";
  return "/images/certifications/vca.png";
};

export default function Footer() {
  const { t, language } = useLanguage();
  const nl = language === "nl";
  const pathname = usePathname();
  const isContactPage = pathname === "/contact" || pathname === "/contact/";

  const [currentYear, setCurrentYear] = useState(2026);
  useEffect(() => setCurrentYear(new Date().getFullYear()), []);

  // Single source for both desktop + mobile columns
  const serviceLinks = [
    { label: nl ? "Warmtepompen" : "Heat Pumps", href: "/aanbod/?dienst=warmtepompen" },
    { label: nl ? "Zonnepanelen" : "Solar Panels", href: "/aanbod/?dienst=zonnepanelen" },
    { label: nl ? "Airconditioning" : "Air Conditioning", href: "/aanbod/?dienst=airconditioning" },
    { label: "Meterkast", href: "/aanbod/?dienst=meterkast" },
    { label: nl ? "Alle Diensten" : "All Services", href: "/aanbod/" },
  ];
  const navLinks = [
    { label: t.nav.about, href: "/over-ons/" },
    { label: nl ? "Onze Werkwijze" : "How We Work", href: "/#werkwijze" },
    { label: t.nav.projects, href: "/our-work/" },
    { label: t.nav.faq, href: "/veelgestelde-vragen/" },
    { label: t.nav.contact, href: "/contact/" },
  ];
  const hoursLabel = nl ? "MA–VR · 08:00–17:00" : "MON–FRI · 08:00–17:00";
  const telHref = `tel:${contactInfo.phoneHref}`;

  return (
    <footer className="relative z-10 bg-ink">
      {/* ── Desktop footer ── */}
      <div className="hidden md:block">
        {!isContactPage && (
          <div className="bg-brand relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_-20%,white_0%,transparent_60%)]" />
            <div className="h-px bg-gradient-to-r from-aurora-1 via-white/60 to-aurora-2" />
            <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-14 lg:py-20 relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
                <Reveal>
                  <div className="max-w-2xl">
                    <p className="text-[0.8125rem] font-extrabold uppercase tracking-[0.4em] text-white/70 mb-5 flex items-center gap-3">
                      <span className="w-1.5 h-1.5 bg-white rounded-full" />
                      {nl ? "Offerte" : "Quote"}
                    </p>
                    <h2 className="font-display text-4xl lg:text-6xl font-extrabold text-white leading-[0.92] uppercase tracking-[-0.03em] mb-6">
                      {t.components.preFooter.title}
                    </h2>
                    <p className="text-white/80 text-lg max-w-xl font-medium leading-relaxed">
                      {t.components.preFooter.description}
                    </p>
                  </div>
                </Reveal>

                <Reveal delay={150}>
                  <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center shrink-0">
                    <Link
                      href="/contact/"
                      className="bg-white text-brand-ink px-10 py-5 text-[0.8125rem] font-extrabold uppercase tracking-[0.22em] hover:bg-ink hover:text-white transition-colors duration-300 text-center rounded-full shadow-lg"
                    >
                      {t.components.preFooter.requestQuote}
                    </Link>
                    <a
                      href={telHref}
                      className="text-white px-8 py-5 text-[0.8125rem] font-extrabold uppercase tracking-[0.22em] border border-white/40 hover:border-white hover:bg-white/10 transition-colors duration-300 text-center rounded-full"
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
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
            <div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 ${isContactPage ? "pt-20 lg:pt-28" : "pt-16 lg:pt-20"} pb-16`}>
              {/* Brand + certifications */}
              <div className="lg:col-span-5">
                <Reveal>
                  <Image
                    src="/images/logo.png"
                    alt="MMC Techniek B.V."
                    width={280}
                    height={92}
                    className="h-14 w-auto object-contain mb-8 brightness-0 invert"
                  />
                  <p className="text-white/60 text-lg leading-relaxed max-w-md mb-10 font-medium">
                    {t.components.footer.tagline}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
                    {t.components.footer.certifications.map((c) => (
                      <div key={c.name} className="flex items-center gap-3.5">
                        <div className="relative w-10 h-10 shrink-0">
                          <Image src={getCertImage(c.name)} alt={c.name} fill className="object-contain brightness-0 invert opacity-60" />
                        </div>
                        <div>
                          <span className="text-[0.8125rem] font-extrabold text-white/80 uppercase tracking-widest block leading-none">{c.name}</span>
                          <span className="hidden lg:block text-[0.6875rem] text-white/35 uppercase tracking-[0.18em] mt-1.5 max-w-[22ch] leading-tight">{c.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>

              {/* Link columns */}
              <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-10 lg:gap-8">
                <Reveal delay={100}>
                  <div>
                    <h4 className="text-label text-brand mb-6">{t.components.footer.services}</h4>
                    <ul className="space-y-3.5">
                      {serviceLinks.map((link) => (
                        <li key={link.href}>
                          <Link href={link.href} className="text-white/55 hover:text-brand hover:translate-x-1 transition-all duration-300 text-[0.9375rem] font-bold inline-block">
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>

                <Reveal delay={200}>
                  <div>
                    <h4 className="text-label text-brand mb-6">{t.components.footer.navigation}</h4>
                    <ul className="space-y-3.5">
                      {navLinks.map((link) => (
                        <li key={link.href}>
                          <Link href={link.href} className="text-white/55 hover:text-brand hover:translate-x-1 transition-all duration-300 text-[0.9375rem] font-bold inline-block">
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>

                <Reveal delay={300}>
                  <div className="col-span-2 md:col-span-1">
                    <h4 className="text-label text-brand mb-6">{t.components.footer.contact}</h4>
                    <div className="space-y-5">
                      <p className="text-white/60 text-[0.9375rem] leading-relaxed max-w-[22ch] font-medium">
                        {contactInfo.address}
                      </p>
                      <a href={telHref} className="text-white font-extrabold text-2xl tracking-tight hover:text-brand transition-colors inline-block">
                        {contactInfo.phoneDisplay}
                      </a>
                      <p className="text-brand/60 text-[0.6875rem] font-extrabold uppercase tracking-[0.28em] pt-4 border-t border-white/10">
                        {hoursLabel}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10">
            <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <p className="text-[0.6875rem] font-extrabold text-white/40 uppercase tracking-[0.28em]">
                &copy; {currentYear} MMC Techniek B.V. — {t.components.footer.allRightsReserved}
              </p>
              <div className="flex items-center gap-6 text-[0.6875rem] font-extrabold text-white/40 uppercase tracking-[0.28em]">
                <span>KvK <span className="text-white/70">{contactInfo.kvk}</span></span>
                <span>BTW <span className="text-white/70">{contactInfo.btw}</span></span>
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
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_-10%,white_0%,transparent_60%)]" />
            <div className="relative z-10">
              <p className="text-[0.6875rem] font-extrabold uppercase tracking-[0.3em] text-white/70 mb-3">{nl ? "Offerte" : "Quote"}</p>
              <h2 className="font-display text-3xl font-extrabold text-white leading-[0.95] uppercase tracking-tight mb-4">
                {t.components.preFooter.title}
              </h2>
              <p className="text-white/80 text-base leading-relaxed mb-7 font-medium">
                {t.components.preFooter.description}
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/contact/"
                  className="w-full py-4 bg-white text-brand-ink text-sm font-extrabold uppercase tracking-[0.18em] rounded-full text-center shadow-lg"
                >
                  {t.components.preFooter.requestQuote}
                </Link>
                <a
                  href={telHref}
                  className="w-full py-4 text-white text-sm font-extrabold uppercase tracking-[0.18em] border border-white/40 rounded-full text-center"
                >
                  {t.components.preFooter.callDirect}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Main footer */}
        <div className="bg-ink px-6 pt-12 pb-10">
          <Image
            src="/images/logo.png"
            alt="MMC Techniek B.V."
            width={180}
            height={60}
            className="h-9 w-auto object-contain mb-6 brightness-0 invert"
          />
          <p className="text-white/60 text-base leading-relaxed max-w-[32ch] font-medium mb-8">
            {t.components.footer.tagline}
          </p>

          {/* Certs inline */}
          <div className="flex items-center gap-5 mb-10">
            {t.components.footer.certifications.map((c) => (
              <div key={c.name} className="relative w-9 h-9">
                <Image src={getCertImage(c.name)} alt={c.name} fill className="object-contain brightness-0 invert opacity-60" />
              </div>
            ))}
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 mb-10">
            <div>
              <p className="text-label text-brand mb-5">{t.components.footer.services}</p>
              <ul className="space-y-3">
                {serviceLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-white/55 text-sm font-bold hover:text-brand transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-label text-brand mb-5">{t.components.footer.navigation}</p>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-white/55 text-sm font-bold hover:text-brand transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div className="border-t border-white/10 pt-8 mb-8">
            <p className="text-label text-brand mb-5">{t.components.footer.contact}</p>
            <p className="text-white/60 text-sm leading-relaxed mb-3 font-medium max-w-[28ch]">{contactInfo.address}</p>
            <a href={telHref} className="text-white font-extrabold text-xl inline-block hover:text-brand transition-colors">{contactInfo.phoneDisplay}</a>
            <p className="text-white/35 text-[0.625rem] font-extrabold uppercase tracking-[0.2em] mt-2">{hoursLabel}</p>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/10 pt-6 pb-nav flex flex-col gap-2">
            <p className="text-[0.625rem] font-extrabold text-white/30 uppercase tracking-[0.2em]">
              &copy; {currentYear} MMC Techniek B.V.
            </p>
            <div className="flex items-center gap-5 text-[0.625rem] font-extrabold text-white/25 uppercase tracking-[0.2em]">
              <span>KvK {contactInfo.kvk}</span>
              <span>BTW {contactInfo.btw}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
