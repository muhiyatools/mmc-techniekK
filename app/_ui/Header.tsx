"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { contactInfo, services, brandImages, certifications } from "@/lib/data";
import { getLocalStore, mergeServices, mergeBrandImages } from "@/lib/adminStore";
import type { Service } from "@/lib/data";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useScrollDirection } from "../_hooks/useScrollDirection";
import BottomNav from "./BottomNav";
import MobileSheet from "./MobileSheet";
import { serviceIcons } from "./serviceIcons";


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
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [mergedServices, setMergedServices] = useState<Service[]>(
    services.map((s) => ({ ...s, products: [] }))
  );
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
  }, [language, t]);

  useEffect(() => {
    const store = getLocalStore();
    setMergedServices(mergeServices(store));
    setMergedBrandImages(mergeBrandImages(store));
  }, []);

  const allSearchProducts = useMemo(
    () => mergedServices.flatMap((s) => s.products.map((p) => ({ ...p, serviceSlug: s.slug }))),
    [mergedServices]
  );

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
    setMobileSheetOpen(false);
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
      <header className="hidden lg:block fixed top-0 inset-x-0 z-50 pointer-events-none">
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
                        isActive(item.href) || dropdownOpen ? "bg-white text-brand-ink shadow-sm" : "text-ink hover:bg-ink/5"
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
                      className={`px-4 xl:px-5 py-1.5 xl:py-2 text-[0.8125rem] xl:text-[0.875rem] font-bold uppercase tracking-wide rounded-full transition-all whitespace-nowrap ${isActive(item.href) ? "bg-white text-brand-ink shadow-sm" : "text-ink hover:bg-ink/5"}`}
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
                            <div className="shrink-0 w-11 h-11 xl:w-12 xl:h-12 rounded-xl bg-brand/5 border border-brand/10 flex items-center justify-center text-brand-ink group-hover:bg-brand group-hover:text-white transition-all">
                              {serviceIcons[service.slug] || <div className="w-5 h-5 bg-current rounded-full" />}
                            </div>
                            <div className="min-w-0 pt-0.5">
                              <p className="text-sm xl:text-base font-bold text-ink group-hover:text-brand-ink transition-colors mb-0.5">{serviceTitleMap[service.slug]}</p>
                              <p className="text-xs xl:text-sm text-muted">{service.summary}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="bg-ink/5 px-6 xl:px-8 py-4 xl:py-5 flex items-center justify-between">
                        <Link href="/aanbod/" onClick={() => setDropdownOpen(false)} className="text-xs xl:text-sm font-extrabold uppercase tracking-widest text-ink hover:text-brand-ink transition-colors">
                          {t.nav.aanbod}
                        </Link>
                        <Link href="/contact/" onClick={() => setDropdownOpen(false)} className="text-xs xl:text-sm font-extrabold uppercase tracking-widest text-brand-ink hover:text-brand-deep transition-colors">
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
                <svg className="w-[16px] h-[16px] text-muted/50 group-focus-within:text-brand-ink transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <button onClick={() => setSearchQuery("")} className="text-muted hover:text-brand-ink shrink-0">
                    <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-4">
                {certifications.map((c) => (
                  <div key={c.name} className="flex items-center gap-1.5 group cursor-default">
                    <div className="relative w-7 h-7">
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
                <div role="listbox" aria-label={language === "nl" ? "Zoekresultaten" : "Search results"} className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[500px] xl:w-[560px] bg-surface border border-hairline rounded-3xl shadow-xl overflow-hidden z-50">
                  <div className="p-5 max-h-[520px] overflow-y-auto">
                    {!hasResults ? (
                      <div className="p-8 text-center text-muted">{language === "nl" ? "Geen resultaten gevonden." : "No results found."}</div>
                    ) : (
                      <div className="space-y-4">
                        {matchedServices.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-micro text-muted px-1 mb-1">{language === "nl" ? "Diensten" : "Services"}</p>
                            {matchedServices.map(s => (
                              <Link key={s.slug} href={`/aanbod/?dienst=${s.slug}`} onClick={() => setSearchQuery("")} className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-brand/5 transition-all group">
                                <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center text-brand-ink">{serviceIcons[s.slug]}</div>
                                <span className="text-sm xl:text-base font-bold text-ink group-hover:text-brand-ink transition-colors">{s.title}</span>
                              </Link>
                            ))}
                          </div>
                        )}
                        {matchedProducts.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-micro text-muted px-1 mb-1">{language === "nl" ? "Producten" : "Products"}</p>
                            {matchedProducts.slice(0, 8).map((p, i) => (
                              <Link key={`${p.name}-${i}`} href={`/aanbod/?dienst=${p.serviceSlug}`} onClick={() => setSearchQuery("")} className="flex items-center justify-between gap-3 p-3.5 rounded-xl hover:bg-brand/5 transition-all group">
                                <span className="text-sm font-bold text-ink group-hover:text-brand-ink transition-colors truncate">{p.name}</span>
                                <span className="text-xs font-semibold text-muted shrink-0">{p.brand}</span>
                              </Link>
                            ))}
                          </div>
                        )}
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
        className={`lg:hidden fixed top-0 inset-x-0 z-50 bg-surface border-b border-hairline transition-transform duration-300 ${mobileHidden ? "header-hidden" : "header-visible"}`}
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        {/* Top Row: centered logo, flag left, Offerte CTA right */}
        <div className="grid grid-cols-3 items-center w-full px-4 h-[54px]">
          <button onClick={toggleLanguage} className="justify-self-start flex items-center justify-center w-9 h-9 rounded-full hover:bg-ink/5 transition-colors">
            {language === "nl" ? <FlagEN /> : <FlagNL />}
          </button>
          
          <Link href="/" className="justify-self-center shrink-0 flex justify-center">
            <Image src="/images/logo.png" alt="MMC Techniek B.V." width={140} height={42} className="h-7 w-auto object-contain" priority />
          </Link>
          
          <Link
            href="/contact/"
            className="justify-self-end h-8 px-4 bg-ink text-white text-[10px] font-extrabold uppercase tracking-wider rounded-full hover:bg-brand transition-colors flex items-center whitespace-nowrap"
          >
            Offerte
          </Link>
        </div>
      </header>

      {/* Mobile Bottom Navigation & Sheet (visible only on mobile/tablet viewports) */}
      <div className="lg:hidden">
        <BottomNav onMoreClick={() => setMobileSheetOpen(true)} />
        
        <MobileSheet
          open={mobileSheetOpen}
          onClose={() => setMobileSheetOpen(false)}
          title="Menu"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/over-ons/"
                onClick={() => setMobileSheetOpen(false)}
                className="flex items-center gap-3 p-3.5 bg-ink/5 hover:bg-ink/10 rounded-2xl transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand-ink">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-ink">{t.nav.about}</span>
              </Link>

              <Link
                href="/veelgestelde-vragen/"
                onClick={() => setMobileSheetOpen(false)}
                className="flex items-center gap-3 p-3.5 bg-ink/5 hover:bg-ink/10 rounded-2xl transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand-ink">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-ink">{t.nav.faq}</span>
              </Link>
            </div>

            <div>
              <span className="text-[10px] font-extrabold text-muted uppercase tracking-[0.2em] block mb-3 pl-1">
                {t.nav.services}
              </span>
              <div className="grid grid-cols-2 gap-2">
                {mergedServices.map((service) => (
                  <Link
                    key={service.slug}
                    href={`/aanbod/?dienst=${service.slug}`}
                    onClick={() => setMobileSheetOpen(false)}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-brand/5 border border-hairline/30 transition-all group"
                  >
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-brand/5 flex items-center justify-center text-brand-ink group-hover:bg-brand group-hover:text-white transition-all">
                      {serviceIcons[service.slug] || <div className="w-3.5 h-3.5 bg-current rounded-full" />}
                    </div>
                    <span className="text-xs font-bold text-ink truncate group-hover:text-brand-ink transition-colors">
                      {serviceTitleMap[service.slug]}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-hairline/60 pt-4 flex flex-col gap-3">
              <div className="flex items-center justify-between text-[10px] text-muted">
                <span>KvK: {contactInfo.kvk}</span>
                <span>BTW: {contactInfo.btw}</span>
              </div>
              <a
                href={`tel:${contactInfo.phone}`}
                className="w-full h-11 flex items-center justify-center bg-brand text-white font-extrabold text-xs uppercase tracking-wider rounded-full hover:bg-brand/90 transition-all shadow-sm"
              >
                Bel: {contactInfo.phoneDisplay}
              </a>
            </div>
          </div>
        </MobileSheet>
      </div>
    </>
  );
};
