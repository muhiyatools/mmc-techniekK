"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems, contactInfo, services } from "@/lib/data";
import TrustBar from "./TrustBar";

// Flat product list for search
const allSearchProducts = services.flatMap((s) => s.products);

// Per-service icons
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

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

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
    ? services.filter(
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

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50">
        {/* Main nav row — 3-zone layout */}
        <div className="bg-white h-[70px] shadow-[0_1px_0_0_rgba(15,23,42,0.06)]">
          <div className="w-full px-6 lg:px-10 h-full flex items-center">

            {/* ── LEFT: Logo + Nav ── */}
            <div className="flex items-center gap-5 lg:gap-7 shrink-0">
              <Link
                href="/"
                className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
              >
                <Image
                  src="/images/logo.png"
                  alt="MMC Techniek B.V."
                  width={300}
                  height={90}
                  className="h-[38px] lg:h-[44px] w-auto object-contain"
                  priority
                />
              </Link>

              {/* Desktop nav */}
              <nav className="hidden lg:flex items-center gap-0.5">
                {navItems.map((item) => (
                  <div
                    key={item.href}
                    className="relative"
                    ref={item.isHash ? dropdownRef : undefined}
                  >
                    {item.isHash ? (
                      <>
                        <button
                          onClick={() => setDropdownOpen((p) => !p)}
                          className={`relative flex items-center gap-1.5 px-3.5 py-2 text-[0.875rem] font-semibold transition-colors duration-200 rounded-md ${
                            isActive(item.href) || dropdownOpen
                              ? "text-brand bg-brand/5"
                              : "text-ink hover:text-brand hover:bg-brand/5"
                          }`}
                        >
                          {item.label}
                          <svg
                            className={`w-3 h-3 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {/* Aanbod dropdown */}
                        {dropdownOpen && (
                          <div className="absolute top-full left-0 mt-2 w-[540px] max-w-[calc(100vw-4rem)] bg-white border border-hairline shadow-xl shadow-ink/10 overflow-hidden">
                            <div className="h-px bg-gradient-to-r from-aurora-1 via-brand/40 to-aurora-2" />
                            <div className="p-4 grid grid-cols-2 gap-1">
                              {services.map((service) => (
                                <Link
                                  key={service.slug}
                                  href={`/aanbod/?dienst=${service.slug}`}
                                  onClick={() => setDropdownOpen(false)}
                                  className="group flex items-start gap-3 p-3 rounded-lg hover:bg-brand/5 transition-colors duration-150"
                                >
                                  <div className="shrink-0 w-9 h-9 rounded-lg bg-brand/8 border border-brand/15 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white group-hover:border-brand transition-all duration-150">
                                    {serviceIcons[service.slug] ?? (
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                    )}
                                  </div>
                                  <div className="min-w-0 pt-0.5">
                                    <p className="text-sm font-semibold text-ink group-hover:text-brand transition-colors leading-tight mb-0.5">
                                      {service.title}
                                    </p>
                                    <p className="text-xs text-muted leading-relaxed line-clamp-1">
                                      {service.summary}
                                    </p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                            <div className="border-t border-hairline px-4 py-3 bg-concrete flex items-center justify-between">
                              <Link
                                href="/aanbod/"
                                onClick={() => setDropdownOpen(false)}
                                className="text-xs font-bold text-muted hover:text-ink transition-colors"
                              >
                                Bekijk volledig aanbod
                              </Link>
                              <Link
                                href="/contact/"
                                onClick={() => setDropdownOpen(false)}
                                className="text-xs font-bold text-brand hover:text-brand-deep transition-colors uppercase tracking-wide"
                              >
                                Offerte aanvragen →
                              </Link>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className={`relative flex items-center px-3.5 py-2 text-[0.875rem] font-semibold transition-colors duration-200 rounded-md ${
                          isActive(item.href)
                            ? "text-brand bg-brand/5"
                            : "text-ink hover:text-brand hover:bg-brand/5"
                        }`}
                      >
                        {item.label}
                        {isActive(item.href) && (
                          <span className="absolute bottom-1 left-3.5 right-3.5 h-[2px] bg-brand rounded-full" />
                        )}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* ── CENTER: Search bar (takes all flex-1 space, centered) ── */}
            <div ref={searchRef} className="hidden lg:flex flex-1 justify-center px-6 relative">
              <div className="w-full max-w-[640px] relative">
                <div className="flex items-center w-full border border-hairline rounded-full overflow-hidden bg-white hover:border-brand/40 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/10 transition-all duration-200">
                  <div className="w-10 h-10 flex items-center justify-center shrink-0 text-muted">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Escape" && setSearchQuery("")}
                    placeholder="Zoek diensten of producten..."
                    className="flex-1 h-10 text-sm text-ink placeholder:text-muted/50 bg-transparent focus:outline-none pr-3"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="shrink-0 mr-3 text-muted hover:text-ink transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Search results dropdown */}
                {showResults && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[420px] max-w-[calc(100vw-4rem)] bg-white border border-hairline shadow-xl shadow-ink/10 overflow-hidden z-50">
                    <div className="h-px bg-gradient-to-r from-aurora-1 via-brand/40 to-aurora-2" />

                    {!hasResults && (
                      <div className="px-4 py-6 text-center">
                        <p className="text-sm text-muted">Geen resultaten voor</p>
                        <p className="text-sm font-bold text-ink mt-0.5">&ldquo;{searchQuery}&rdquo;</p>
                      </div>
                    )}

                    {matchedServices.length > 0 && (
                      <div>
                        <div className="px-4 py-2 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-muted">
                          Diensten
                        </div>
                        {matchedServices.slice(0, 4).map((service) => (
                          <Link
                            key={service.slug}
                            href={`/aanbod/?dienst=${service.slug}`}
                            onClick={() => setSearchQuery("")}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-brand/5 transition-colors duration-150"
                          >
                            <div className="shrink-0 w-7 h-7 rounded-lg bg-brand/8 border border-brand/15 flex items-center justify-center text-brand">
                              {serviceIcons[service.slug] ?? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-ink leading-tight">{service.title}</p>
                              <p className="text-xs text-muted line-clamp-1">{service.summary}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    {matchedProducts.length > 0 && (
                      <div className={matchedServices.length > 0 ? "border-t border-hairline" : ""}>
                        <div className="px-4 py-2 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-muted">
                          Producten
                        </div>
                        {matchedProducts.slice(0, 5).map((product) => (
                          <Link
                            key={product.name}
                            href={`/contact?service=${product.categoryId}&product=${encodeURIComponent(product.name)}`}
                            onClick={() => setSearchQuery("")}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-brand/5 transition-colors duration-150"
                          >
                            <div className="shrink-0 w-7 h-7 rounded bg-concrete border border-hairline flex items-center justify-center">
                              <svg className="w-3.5 h-3.5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-ink leading-tight">{product.name}</p>
                              <p className="text-xs text-muted">{product.brand}</p>
                            </div>
                            {product.price && (
                              <span className="text-xs font-bold text-ink tabular-nums shrink-0">
                                {product.price.split(" - ")[0]}+
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}

                    <div className="border-t border-hairline px-4 py-2.5 bg-concrete flex items-center justify-between">
                      <span className="text-xs text-muted">
                        {matchedServices.length + matchedProducts.length} resultaten
                      </span>
                      <Link
                        href="/aanbod/"
                        onClick={() => setSearchQuery("")}
                        className="text-xs font-bold text-brand hover:text-brand-deep transition-colors uppercase tracking-wide"
                      >
                        Volledig aanbod →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT: CTA buttons ── */}
            <div className="hidden lg:flex items-center gap-2.5 shrink-0">
              <a
                href={`tel:${contactInfo.phone}`}
                className="flex items-center gap-2 px-4 py-2.5 border border-hairline text-ink text-sm font-semibold rounded-full hover:border-brand hover:text-brand transition-all duration-200 whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Bel ons
              </a>
              <Link
                href="/contact/"
                className="px-5 py-2.5 bg-brand text-white text-sm font-bold rounded-full hover:bg-brand-deep transition-all duration-200 shadow-sm shadow-brand/20 uppercase tracking-wide whitespace-nowrap"
              >
                Offerte aanvragen
              </Link>
            </div>

            {/* Mobile hamburger */}
            <div className="lg:hidden ml-auto">
              <button
                onClick={() => {
                  setMenuOpen((p) => {
                    const next = !p;
                    document.body.style.overflow = next ? "hidden" : "";
                    return next;
                  });
                }}
                className="w-10 h-10 flex items-center justify-center text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                aria-label={menuOpen ? "Sluit menu" : "Open menu"}
              >
                <div className="relative flex flex-col justify-between w-6 h-4">
                  <span className={`block h-[2px] bg-current transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
                  <span className={`block h-[2px] bg-current transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
                  <span className={`block h-[2px] bg-current transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <TrustBar />
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
              placeholder="Zoek diensten of producten..."
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
                    {services.map((service) => (
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
            Offerte aanvragen
          </Link>
        </div>
      </div>
    </>
  );
}
