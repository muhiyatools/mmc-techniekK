"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { contactInfo, services, brandImages, certifications } from "@/lib/data";
import { getLocalStore, mergeServices, mergeBrandImages } from "@/lib/adminStore";
import type { Service } from "@/lib/data";
import BottomNav from "./BottomNav";
import MobileSheet from "./MobileSheet";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useScrollDirection } from "../_hooks/useScrollDirection";

const serviceIcons: Record<string, React.ReactNode> = {
  airconditioning: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 3v3m0 12v3M3 12h3m12 0h3m-4.22-6.78-2.12 2.12M10.34 13.66l-2.12 2.12M18.78 18.78l-2.12-2.12M7.46 7.46 5.34 5.34M12 9a3 3 0 100 6 3 3 0 000-6z" />
    </svg>
  ),
  zonnepanelen: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  ),
  batterijopslag: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M3.75 18h15A2.25 2.25 0 0021 15.75v-1.5a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 001.5 14.25v1.5A2.25 2.25 0 003.75 18zM3.75 6h15A2.25 2.25 0 0021 8.25v1.5a2.25 2.25 0 01-2.25 2.25h-15A2.25 2.25 0 011.5 9.75v-1.5A2.25 2.25 0 013.75 6z" />
    </svg>
  ),
  warmtepompen: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 18a3.75 3.75 0 00.495-7.468 5.99 5.99 0 00-1.925 3.547 5.975 5.975 0 01-2.133-1.001A3.75 3.75 0 0012 18z" />
    </svg>
  ),
  meterkast: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  ),
  onderhoud: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437" />
    </svg>
  ),
  renovaties: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
    </svg>
  ),
};

const FlagNL = () => (
  <span className="block w-[22px] h-[16px] rounded-full overflow-hidden shrink-0 border border-black/10">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6" className="w-full h-full object-cover">
      <rect fill="#21468B" width="9" height="6"/>
      <rect fill="#FFF" width="9" height="4"/>
      <rect fill="#AE1C28" width="9" height="2"/>
    </svg>
  </span>
);

const FlagEN = () => (
  <span className="block w-[22px] h-[16px] rounded-full overflow-hidden shrink-0 border border-black/10">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" className="w-full h-full object-cover">
      <clipPath id="t"><path d="M30 15h30v15zv15H0zH0V0zV0h30z"/></clipPath>
      <path d="M0 0v30h60V0z" fill="#012169"/>
      <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6"/>
      <path d="M0 0l60 30m0-30L0 30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
      <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10"/>
      <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6"/>
    </svg>
  </span>
);

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [moreSheetOpen, setMoreSheetOpen] = useState(false);
  const [mergedServices, setMergedServices] = useState<Service[]>(services);
  const [mergedBrandImages, setMergedBrandImages] = useState(brandImages);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const scrollDir = useScrollDirection();

  const serviceTitleMap = useMemo(() => {
    const map: Record<string, string> = {};
    services.forEach((s, i) => { map[s.slug] = t.sections.services.items[i]?.title || s.title; });
    return map;
  }, [language]);

  useEffect(() => {
    const store = getLocalStore();
    setMergedServices(mergeServices(store));
    setMergedBrandImages(mergeBrandImages(store));
  }, []);

  const allSearchProducts = useMemo(() => mergedServices.flatMap((s) => s.products), [mergedServices]);

  const navItems = [
    { label: t.nav.home,    href: "/" },
    { label: t.nav.aanbod,  href: "/aanbod/", isHash: true },
    { label: t.nav.projects, href: "/our-work/" },
    { label: t.nav.about,   href: "/over-ons/" },
    { label: t.nav.faq,     href: "/veelgestelde-vragen/" },
  ];

  // Close everything on navigation
  useEffect(() => {
    setDropdownOpen(false);
    setSearchQuery("");
    setMoreSheetOpen(false);
    document.body.style.overflow = "";
  }, [pathname]);

  // Click-outside to close dropdown + clear search
  useEffect(() => {
    const onMousedown = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", onMousedown);
    return () => document.removeEventListener("mousedown", onMousedown);
  }, []);

  const normalize = (p: string) => p.replace(/\/$/, "") || "/";
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/aanbod/")
      return normalize(pathname).startsWith("/aanbod") || pathname.startsWith("/diensten");
    return normalize(pathname) === normalize(href);
  };

  const searchTerm = searchQuery.toLowerCase().trim();
  const showResults = searchTerm.length >= 2;
  const matchedServices = showResults
    ? mergedServices.filter(
        (s) =>
          s.title.toLowerCase().includes(searchTerm) ||
          s.summary.toLowerCase().includes(searchTerm)
      )
    : [];
  const matchedProducts = showResults
    ? allSearchProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.brand.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm)
      )
    : [];
  const hasResults = matchedServices.length > 0 || matchedProducts.length > 0;

  const toggleLanguage = () => {
    setLanguage(language === "nl" ? "en" : "nl");
  };

  // Mobile header hide on scroll-down
  const mobileHidden = scrollDir === "down";

  return (
    <>
      {/* ── Desktop header ── */}
      <header className="hidden md:block fixed top-0 inset-x-0 z-50 pointer-events-none">
        <div className="w-[95%] lg:w-[92%] xl:w-[90%] mx-auto mt-4 lg:mt-5 pointer-events-auto">
          <div className="relative flex items-center justify-between h-[60px] lg:h-[76px] px-4 lg:px-6 xl:px-8 rounded-full bg-surface border border-hairline shadow-[0_4px_24px_-6px_rgba(15,23,42,0.08)]">
            <Link href="/" className="shrink-0 w-[160px] lg:w-[200px] xl:w-[220px]">
              <Image src="/images/logo.png" alt="MMC Techniek B.V." width={240} height={72} className="h-8 lg:h-[46px] xl:h-[52px] w-auto object-contain" priority />
            </Link>

            <nav className="hidden lg:flex items-center gap-1 bg-ink/5 p-1.5 rounded-full">
              {navItems.map((item) => (
                <div key={item.href} className="relative" ref={item.isHash ? dropdownRef : undefined}>
                  {item.isHash ? (
                    <button
                      onClick={() => setDropdownOpen((p) => !p)}
                      aria-expanded={dropdownOpen}
                      aria-haspopup="true"
                      className={`px-4 xl:px-5 py-1.5 xl:py-2 text-[0.8125rem] xl:text-[0.875rem] font-bold uppercase tracking-wide rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        isActive(item.href) || dropdownOpen ? "bg-white text-brand shadow-sm" : "text-ink hover:bg-ink/5"
                      }`}
                    >
                      {item.label}
                      <svg className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={`px-4 xl:px-5 py-1.5 xl:py-2 text-[0.8125rem] xl:text-[0.875rem] font-bold uppercase tracking-wide rounded-full transition-all whitespace-nowrap ${isActive(item.href) ? "bg-white text-brand shadow-sm" : "text-ink hover:bg-ink/5"}`}
                    >
                      {item.label}
                    </Link>
                  )}

                  {item.isHash && dropdownOpen && (
                    <div role="menu" className="absolute top-full left-0 mt-4 w-[580px] xl:w-[620px] max-w-[calc(100vw-8rem)] bg-surface border border-hairline rounded-3xl shadow-xl overflow-hidden animate-dropdown-in z-50">
                      <div className="p-6 grid grid-cols-2 gap-2">
                        {mergedServices.map((service) => (
                          <Link
                            key={service.slug}
                            href={`/aanbod/?dienst=${service.slug}`}
                            onClick={() => setDropdownOpen(false)}
                            className="group flex items-start gap-4 p-4 xl:p-5 rounded-2xl hover:bg-brand/10 transition-all"
                          >
                            <div className="shrink-0 w-11 h-11 xl:w-12 xl:h-12 rounded-xl bg-brand/5 border border-brand/10 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-all">
                              {serviceIcons[service.slug] || <div className="w-5 h-5 bg-current rounded-full" />}
                            </div>
                            <div className="min-w-0 pt-0.5">
                              <p className="text-sm xl:text-base font-bold text-ink group-hover:text-brand transition-colors mb-0.5">{serviceTitleMap[service.slug]}</p>
                              <p className="text-xs xl:text-sm text-muted">{service.summary}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="bg-ink/5 px-6 xl:px-8 py-4 xl:py-5 flex items-center justify-between">
                        <Link href="/aanbod/" onClick={() => setDropdownOpen(false)} className="text-xs xl:text-sm font-black uppercase tracking-widest text-ink hover:text-brand transition-colors">
                          {t.nav.aanbod}
                        </Link>
                        <Link href="/contact/" onClick={() => setDropdownOpen(false)} className="text-xs xl:text-sm font-black uppercase tracking-widest text-brand hover:text-brand-deep transition-colors">
                          {t.nav.requestQuote} &rarr;
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3 xl:gap-5 flex-1 justify-center px-4 xl:px-6" ref={searchRef}>
              <div className="flex items-center bg-surface border border-hairline px-4 h-11 max-w-[380px] xl:max-w-[420px] w-full rounded-full group focus-within:border-brand focus-within:shadow-[0_0_0_3px_rgba(66,168,242,0.12)] transition-all duration-200">
                <svg className="w-[16px] h-[16px] text-muted/50 group-focus-within:text-brand transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === "nl" ? "Zoeken..." : "Search..."}
                  aria-label={language === "nl" ? "Zoeken" : "Search"}
                  className="bg-transparent border-none text-[0.8125rem] px-2.5 focus:ring-0 w-full text-ink placeholder:text-muted/40"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="text-muted hover:text-brand shrink-0">
                    <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-4">
                {certifications.map((c) => (
                  <div key={c.name} className="flex items-center gap-1.5 group cursor-default">
                    <div className="relative w-5 h-5">
                      <Image src={c.src} alt={c.name} fill className="object-contain brightness-0 opacity-50 group-hover:opacity-80 transition-opacity" />
                    </div>
                    <span className="text-[9px] font-bold text-muted/50 group-hover:text-muted/80 transition-colors tracking-wide">{c.name}</span>
                  </div>
                ))}
                <div className="w-px h-5 bg-hairline" />
                <div className="flex items-center gap-1.5 group cursor-default">
                  <svg className="w-[18px] h-[18px] text-muted/50 group-hover:text-brand/70 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  <span className="text-[9px] font-bold text-muted/50 group-hover:text-muted/80 transition-colors tracking-wide whitespace-nowrap">
                    {language === "nl" ? "Gratis Advies" : "Free Advice"}
                  </span>
                </div>
              </div>

              {showResults && (
                <div role="listbox" className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[500px] xl:w-[560px] bg-surface border border-hairline rounded-3xl shadow-xl overflow-hidden z-50">
                  <div className="p-5 max-h-[520px] overflow-y-auto">
                    {!hasResults ? (
                      <div className="p-8 text-center text-muted">Geen resultaten gevonden.</div>
                    ) : (
                      <div className="space-y-1">
                        {matchedServices.map(s => (
                          <Link key={s.slug} href={`/aanbod/?dienst=${s.slug}`} onClick={() => setSearchQuery("")} className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-brand/5 transition-all group">
                            <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center text-brand">{serviceIcons[s.slug]}</div>
                            <span className="text-sm xl:text-base font-bold text-ink group-hover:text-brand transition-colors">{s.title}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2.5 lg:gap-3 ml-auto lg:ml-0">
              <button onClick={toggleLanguage} className="hidden lg:flex items-center justify-center w-11 h-11 rounded-full hover:bg-ink/5 transition-colors">
                {language === "nl" ? <FlagEN /> : <FlagNL />}
              </button>
              <Link href="/contact/" className="h-11 xl:h-11 px-5 xl:px-6 bg-ink text-white text-[0.8125rem] xl:text-[0.875rem] font-extrabold uppercase tracking-wide rounded-full hover:bg-brand transition-colors flex items-center whitespace-nowrap">
                {t.nav.requestQuote}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile header bar ── */}
      <header
        className={`md:hidden fixed top-0 inset-x-0 z-50 bg-surface border-b border-hairline transition-transform duration-300 ${mobileHidden ? "header-hidden" : "header-visible"}`}
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="flex items-center justify-between px-4 h-[60px]">
          <Link href="/" className="shrink-0">
            <Image src="/images/logo.png" alt="MMC Techniek B.V." width={160} height={48} className="h-8 w-auto object-contain" priority />
          </Link>
          <Link
            href="/contact/"
            className="h-9 px-4 bg-ink text-white text-xs font-extrabold uppercase tracking-wide rounded-full hover:bg-brand transition-colors flex items-center whitespace-nowrap"
          >
            Offerte
          </Link>
        </div>
      </header>

      {/* ── Mobile bottom nav ── */}
      <BottomNav onMoreClick={() => setMoreSheetOpen(true)} />

      {/* ── "Meer" bottom sheet ── */}
      <MobileSheet open={moreSheetOpen} onClose={() => setMoreSheetOpen(false)} title="Meer">
        <nav className="flex flex-col gap-1">
          {[
            { label: t.nav.about,   href: "/over-ons/" },
            { label: t.nav.faq,     href: "/veelgestelde-vragen/" },
            { label: t.nav.contact, href: "/contact/" },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMoreSheetOpen(false)}
              className="flex items-center justify-between py-4 border-b border-hairline/60 text-base font-bold text-ink"
            >
              {label}
              <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </nav>

        <div className="mt-6 space-y-3">
          <a
            href={`tel:${contactInfo.phone}`}
            className="flex items-center justify-center gap-2 w-full py-4 border-2 border-brand text-brand font-bold rounded-full hover:bg-brand hover:text-white transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.423 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {contactInfo.phoneDisplay}
          </a>
          <button
            onClick={() => { toggleLanguage(); setMoreSheetOpen(false); }}
            className="flex items-center justify-center gap-3 w-full py-4 border border-hairline text-ink font-bold rounded-full hover:bg-concrete transition-all text-sm"
          >
            {language === "nl" ? <FlagEN /> : <FlagNL />}
            <span>{language === "nl" ? "Switch to English" : "Schakel naar Nederlands"}</span>
          </button>
        </div>
      </MobileSheet>
    </>
  );
}
