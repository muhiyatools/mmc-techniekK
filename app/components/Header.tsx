"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { contactInfo, services, brandImages } from "@/lib/data";
import { getLocalStore, mergeServices, mergeBrandImages } from "@/lib/adminStore";
import type { Service } from "@/lib/data";
import TrustBar from "./TrustBar";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { resolveProductImage } from "@/lib/images";

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
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M3.75 18h15A2.25 2.25 0 0021 15.75v-1.5a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 001.5 14.25v1.5A2.25 2.25 0 003.75 18zM3.75 6h15A2.25 2.25 0 0121 8.25v1.5a2.25 2.25 0 01-2.25 2.25h-15A2.25 2.25 0 011.5 9.75v-1.5A2.25 2.25 0 013.75 6z" />
    </svg>
  ),
  warmtepompen: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 18a3.75 3.75 0 00.495-7.468 5.99 5.99 0 00-1.925 3.547 5.975 5.975 0 01-2.133-1.001A3.75 3.75 0 0012 18z" />
    </svg>
  ),
  vloerverwarming: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
    </svg>
  ),
  "meterkast-liften": (
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
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6" className="w-[18px] h-[13px] rounded-[2px] object-cover border border-black/10">
    <rect fill="#21468B" width="9" height="6"/>
    <rect fill="#FFF" width="9" height="4"/>
    <rect fill="#AE1C28" width="9" height="2"/>
  </svg>
);

const FlagEN = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" className="w-[18px] h-[13px] rounded-[2px] object-cover border border-black/10">
    <clipPath id="t"><path d="M30 15h30v15zv15H0zH0V0zV0h30z"/></clipPath>
    <path d="M0 0v30h60V0z" fill="#012169"/>
    <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6"/>
    <path d="M0 0l60 30m0-30L0 30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
    <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10"/>
    <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6"/>
  </svg>
);

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [mergedServices, setMergedServices] = useState<Service[]>(services);
  const [mergedBrandImages, setMergedBrandImages] = useState(brandImages);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();

  // Load admin store on mount
  useEffect(() => {
    const store = getLocalStore();
    setMergedServices(mergeServices(store));
    setMergedBrandImages(mergeBrandImages(store));
  }, []);

  const allSearchProducts = useMemo(() => mergedServices.flatMap((s) => s.products), [mergedServices]);

  const navItems = [
    { label: t.nav.home, href: "/" },
    { label: t.nav.aanbod, href: "/aanbod/", isHash: true },
    { label: t.nav.projects, href: "/our-work/" },
    { label: t.nav.about, href: "/over-ons/" },
    { label: t.nav.faq, href: "/veelgestelde-vragen/" },
  ];

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close everything on navigation
  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
    setSearchQuery("");
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

  // Search results
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

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 pointer-events-none">
        {/* Floating Glass Island Header */}
        <div className="w-[95%] mx-auto mt-4 pointer-events-auto">
          <div className="relative flex items-center justify-between h-[60px] px-5 rounded-full bg-white/80 backdrop-blur-2xl saturate-[1.8] border border-white/30 shadow-[0_4px_20px_-5px_rgba(15,23,42,0.06)]">
            <Link href="/" className="shrink-0 w-[140px]">
              <Image src="/images/logo.png" alt="MMC Techniek B.V." width={160} height={45} className="h-6 lg:h-7 w-auto object-contain" priority />
            </Link>

            <nav className="hidden lg:flex items-center gap-0.5 bg-ink/5 p-1 rounded-full">
              {navItems.map((item) => (
                <div key={item.href} className="relative" ref={item.isHash ? dropdownRef : undefined}>
                  {item.isHash ? (
                    <button
                      onClick={() => setDropdownOpen((p) => !p)}
                      className={`px-3.5 py-1 text-[0.75rem] font-bold uppercase tracking-wide rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        isActive(item.href) || dropdownOpen ? "bg-white text-brand shadow-sm" : "text-ink hover:bg-ink/5"
                      }`}
                    >
                      {item.label}
                      <svg className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={`px-3.5 py-1 text-[0.75rem] font-bold uppercase tracking-wide rounded-full transition-all whitespace-nowrap ${isActive(item.href) ? "bg-white text-brand shadow-sm" : "text-ink hover:bg-ink/5"}`}
                    >
                      {item.label}
                    </Link>
                  )}

                  {/* Dropdown adapted for island header */}
                  {item.isHash && dropdownOpen && (
                    <div className="absolute top-full left-0 mt-4 w-[540px] max-w-[calc(100vw-8rem)] bg-white/95 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl overflow-hidden animate-dropdown-in z-50">
                      <div className="p-5 grid grid-cols-2 gap-2">
                        {mergedServices.map((service) => (
                          <Link
                            key={service.slug}
                            href={`/aanbod/?dienst=${service.slug}`}
                            onClick={() => setDropdownOpen(false)}
                            className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-brand/10 transition-all"
                          >
                            <div className="shrink-0 w-10 h-10 rounded-xl bg-brand/5 border border-brand/10 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-all">
                              {serviceIcons[service.slug] || <div className="w-5 h-5 bg-current rounded-full" />}
                            </div>
                            <div className="min-w-0 pt-0.5">
                              <p className="text-sm font-bold text-ink group-hover:text-brand transition-colors mb-0.5">{service.title}</p>
                              <p className="text-xs text-muted line-clamp-1 opacity-70">{service.summary}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="bg-ink/5 px-6 py-4 flex items-center justify-between">
                        <Link href="/aanbod/" onClick={() => setDropdownOpen(false)} className="text-xs font-black uppercase tracking-widest text-muted hover:text-brand transition-colors">
                          {t.nav.aanbod}
                        </Link>
                        <Link href="/contact/" onClick={() => setDropdownOpen(false)} className="text-xs font-black uppercase tracking-widest text-brand hover:text-brand-deep transition-colors">
                          {t.nav.requestQuote} →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="hidden lg:flex flex-1 justify-center px-6" ref={searchRef}>
              <div className="flex items-center bg-transparent border-b border-ink/10 px-2 h-9 w-full max-w-[480px] group focus-within:border-brand transition-all">
                <svg className="w-3.5 h-3.5 text-muted group-focus-within:text-brand transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === "nl" ? "Zoeken..." : "Search..."}
                  className="bg-transparent border-none text-[0.8125rem] px-3 focus:ring-0 w-full text-ink placeholder:text-muted/60"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="text-muted hover:text-brand">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Search Results */}
              {showResults && (
                <div className="absolute top-full right-0 mt-4 w-[400px] bg-white/95 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl overflow-hidden z-50">
                  <div className="p-4 max-h-[480px] overflow-y-auto">
                    {!hasResults ? (
                      <div className="p-8 text-center text-muted">Geen resultaten gevonden.</div>
                    ) : (
                      <div className="space-y-1">
                        {matchedServices.map(s => (
                          <Link key={s.slug} href={`/aanbod/?dienst=${s.slug}`} onClick={() => setSearchQuery("")} className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand/5 transition-all group">
                            <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand">{serviceIcons[s.slug]}</div>
                            <span className="text-sm font-bold text-ink group-hover:text-brand transition-colors">{s.title}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 ml-auto lg:ml-0">
              <button onClick={toggleLanguage} className="hidden lg:flex items-center justify-center w-8 h-8 rounded-full hover:bg-ink/5 transition-colors">
                {language === "nl" ? <FlagEN /> : <FlagNL />}
              </button>
              <Link href="/contact/" className="h-9 px-5 bg-ink text-white text-[0.6875rem] font-extrabold uppercase tracking-wide rounded-full hover:bg-brand transition-colors flex items-center whitespace-nowrap">
                {t.nav.requestQuote}
              </Link>
              <button
                onClick={() => {
                  setMenuOpen((p) => {
                    const next = !p;
                    document.body.style.overflow = next ? "hidden" : "";
                    return next;
                  });
                }}
                className="lg:hidden w-9 h-9 flex items-center justify-center text-ink bg-ink/5 rounded-full"
                aria-label="Menu"
              >
                <div className="relative flex flex-col justify-between w-4 h-2.5">
                  <span className={`block h-[1.5px] bg-current transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-[4px]" : ""}`} />
                  <span className={`block h-[1.5px] bg-current transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
                  <span className={`block h-[1.5px] bg-current transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-[4px]" : ""}`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-white transition-all duration-300 ${
          menuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        {/* Mobile search */}
        <div className="px-6 pt-[88px] pb-4 border-b border-hairline">
          <div className="flex items-center border border-hairline rounded-full overflow-hidden bg-concrete">
            <div className="w-10 h-10 flex items-center justify-center shrink-0 text-muted">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder={language === "nl" ? "Zoek diensten of producten..." : "Search services or products..."}
              className="flex-1 h-10 text-sm text-ink placeholder:text-muted/50 bg-transparent focus:outline-none pr-4"
            />
          </div>
        </div>

        <nav className="flex flex-col px-6 gap-0">
          {navItems.map((item) => (
            <div key={item.href}>
              {item.isHash ? (
                <div className="py-5 border-b border-hairline/60">
                  <Link
                    href="/aanbod/"
                    onClick={() => setMenuOpen(false)}
                    className="text-lg font-bold text-ink mb-4 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                      {item.label}
                    </span>
                    <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <div className="pl-4 grid grid-cols-2 gap-1.5">
                    {mergedServices.map((service) => (
                      <Link
                        key={service.title}
                        href={`/aanbod/?dienst=${service.slug}`}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 py-2 px-2 rounded-lg text-sm text-muted hover:text-brand hover:bg-brand/5 transition-colors"
                      >
                        <span className="text-brand shrink-0">{serviceIcons[service.slug]}</span>
                        {service.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`py-5 border-b border-hairline/60 text-xl font-bold block ${
                    isActive(item.href) ? "text-brand" : "text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="px-6 pt-6 space-y-3">
          <a
            href={`tel:${contactInfo.phone}`}
            className="flex items-center justify-center gap-2 w-full py-4 border-2 border-brand text-brand font-bold rounded-full hover:bg-brand hover:text-white transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {contactInfo.phoneDisplay}
          </a>
          <Link
            href="/contact/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center w-full py-4 bg-brand text-white font-bold rounded-full hover:bg-brand-deep transition-colors"
          >
            {t.nav.requestQuote}
          </Link>
        </div>
      </div>
    </>
  );
}
