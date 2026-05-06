"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems, contactInfo, services } from "@/lib/data";

const trustItems = [
  "NEN-3140 Gecertificeerd",
  "VCA Gecertificeerd",
  "16+ Jaar Ervaring",
  "Offerte Binnen 24 Uur",
  "Gratis Adviesgesprek",
];

function ServiceIcon({ slug }: { slug: string }) {
  return (
    <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {slug === "warmtepompen" && (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.5c0 1-1 1.5-1 2.5" />
        </>
      )}
      {slug === "zonnepanelen" && (
        <>
          <circle cx="12" cy="12" r="3.5" strokeWidth={1.5} />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
        </>
      )}
      {slug === "airconditioning" && (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8a2 2 0 012-2h12a2 2 0 012 2v5a2 2 0 01-2 2H6a2 2 0 01-2-2V8zM8 15v3M12 15v3M16 15v3M8 11h8" />
      )}
      {slug === "batterijopslag" && (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8zM21 10.5v3h-2v-3h2M11 10l-2 3.5h5L12 18" />
      )}
      {slug === "vloerverwarming" && (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 20h18M7.5 16c0-1.5 1.5-2.5 1.5-5M12 16c0-1.5 1.5-2.5 1.5-5M16.5 16c0-1.5 1.5-2.5 1.5-5" />
      )}
      {slug === "meterkast-liften" && (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3a1 1 0 00-1 1v16a1 1 0 001 1h14a1 1 0 001-1V4a1 1 0 00-1-1H5zM9 7.5v3M9 13.5v3M13 7v6M16.5 7v4" />
      )}
      {slug === "onderhoud" && (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      )}
      {slug === "renovaties" && (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21h18M5 21V7a2 2 0 012-2h10a2 2 0 012 2v14M9 21v-8h6v8M9 9h2M13 9h2M9 13h2M13 13h2" />
      )}
    </svg>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
    document.body.style.overflow = "";
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/98 backdrop-blur-md shadow-sm"
            : "bg-white/90 backdrop-blur-sm"
        }`}
      >
        {/* Main nav */}
        <div className={`h-16 border-b transition-all duration-300 ${scrolled ? "border-hairline" : "border-transparent"}`}>
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10 h-full flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
            >
              <img
                src="/images/logo.png"
                alt="MMC Techniek B.V."
                className="h-9 lg:h-10 w-auto object-contain"
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
              {navItems.map((item) => (
                <div key={item.href} className="relative">
                  {item.isHash ? (
                    <div className="relative">
                      <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        onBlur={() => setTimeout(() => setDropdownOpen(false), 180)}
                        className={`relative text-[15px] font-semibold tracking-wide transition-colors duration-200 flex items-center gap-1.5 py-2 ${
                          isActive(item.href) ? "text-brand" : "text-copy hover:text-brand"
                        }`}
                      >
                        {item.label}
                        <svg
                          className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Wide dropdown — always light */}
                      {dropdownOpen && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[440px] bg-mist border border-hairline shadow-2xl shadow-ink/20 overflow-hidden">
                          {/* Dropdown header */}
                          <div className="px-4 py-3 bg-concrete border-b border-hairline flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
                              Onze diensten
                            </span>
                            <span className="text-xs text-muted">{services.length} diensten</span>
                          </div>

                          {/* Service list */}
                          <div className="grid grid-cols-2 gap-px bg-hairline">
                            {services.map((service) => (
                              <Link
                                key={service.slug}
                                href={`/diensten/${service.slug}`}
                                onClick={() => setDropdownOpen(false)}
                                className="flex items-center gap-3 px-4 py-3.5 bg-mist hover:bg-base transition-colors duration-150 group"
                              >
                                <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center shrink-0 group-hover:bg-brand/15 transition-colors">
                                  <ServiceIcon slug={service.slug} />
                                </div>
                                <div className="min-w-0">
                                  <span className="block text-sm font-semibold text-ink group-hover:text-brand transition-colors truncate">
                                    {service.title}
                                  </span>
                                  <span className="block text-xs text-muted truncate">
                                    {service.summary}
                                  </span>
                                </div>
                              </Link>
                            ))}
                          </div>

                          {/* Footer */}
                          <div className="px-4 py-2.5 bg-concrete border-t border-hairline flex items-center justify-between">
                            <Link
                              href="/#diensten"
                              onClick={() => setDropdownOpen(false)}
                              className="text-xs font-bold uppercase tracking-[0.12em] text-brand hover:text-brand-deep"
                            >
                              Bekijk alle diensten &rarr;
                            </Link>
                            <Link
                              href="/contact/"
                              onClick={() => setDropdownOpen(false)}
                              className="text-xs font-semibold text-muted hover:text-brand transition-colors"
                            >
                              Gratis advies
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`relative text-[15px] font-semibold tracking-wide transition-colors duration-200 py-2 ${
                        isActive(item.href) ? "text-brand" : "text-copy hover:text-brand"
                      }`}
                    >
                      {item.label}
                      {isActive(item.href) && (
                        <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand" />
                      )}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* CTAs */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href={`tel:${contactInfo.phone}`}
                className="group flex items-center gap-2 px-4 py-2.5 border border-brand/40 text-brand text-sm font-bold uppercase tracking-wide rounded-full hover:border-brand hover:bg-brand/5 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Bel ons
              </a>
              <Link
                href="/contact/"
                className="px-5 py-2.5 bg-brand text-white text-sm font-bold uppercase tracking-wide rounded-full hover:bg-brand-deep transition-all duration-200"
              >
                Offerte
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => {
                setMenuOpen((p) => {
                  const next = !p;
                  document.body.style.overflow = next ? "hidden" : "";
                  return next;
                });
              }}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
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

        {/* Trust bar — desktop only, AFTER main nav, collapses on scroll */}
        <div
          className={`hidden lg:block overflow-hidden transition-all duration-300 border-t ${
            scrolled ? "max-h-0 border-transparent" : "max-h-9 border-hairline"
          }`}
        >
          <div className="bg-brand h-9 flex items-center">
            <div className="max-w-[1280px] mx-auto px-6 lg:px-10 w-full flex items-center justify-center gap-5">
              {trustItems.map((item, i, arr) => (
                <span key={item} className="flex items-center gap-5">
                  <span className="flex items-center gap-1.5">
                    {/* Unique icons per trust item */}
                    <span className="w-3 h-3 shrink-0 text-white">
                      {i === 0 && (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-3 h-3">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043C19.37 9.61 21 10.732 21 12z" />
                        </svg>
                      )}
                      {i === 1 && (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-3 h-3">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {i === 2 && (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-3 h-3">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {i === 3 && (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-3 h-3">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {i === 4 && (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-3 h-3">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                        </svg>
                      )}
                    </span>
                    <span className="text-[11px] font-semibold text-white/90 tracking-wide whitespace-nowrap">
                      {item}
                    </span>
                  </span>
                  {i < arr.length - 1 && (
                    <span className="w-px h-3 bg-white/30 shrink-0" />
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-base transition-all duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col px-6 pt-28 gap-0">
          {navItems.map((item) => (
            <div key={item.href}>
              {item.isHash ? (
                <div className="py-4 border-b border-hairline">
                  <div className="text-lg font-bold text-ink mb-3">Diensten</div>
                  <div className="pl-4 space-y-2">
                    {services.map((service) => (
                      <Link
                        key={service.slug}
                        href={`/diensten/${service.slug}`}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 py-1 text-base text-muted hover:text-brand transition-colors"
                      >
                        <div className="w-6 h-6 rounded-md bg-brand/10 flex items-center justify-center shrink-0">
                          <ServiceIcon slug={service.slug} />
                        </div>
                        {service.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="py-4 border-b border-hairline text-xl font-bold text-ink flex items-center justify-between"
                >
                  <span className={isActive(item.href) ? "text-brand" : ""}>{item.label}</span>
                  {isActive(item.href) && <span className="w-2 h-2 rounded-full bg-brand" />}
                </Link>
              )}
            </div>
          ))}
          <Link
            href="/veelgestelde-vragen/"
            onClick={() => setMenuOpen(false)}
            className="py-4 border-b border-hairline text-xl font-bold text-ink flex items-center justify-between"
          >
            <span className={pathname === "/veelgestelde-vragen/" ? "text-brand" : ""}>FAQ</span>
            {pathname === "/veelgestelde-vragen/" && <span className="w-2 h-2 rounded-full bg-brand" />}
          </Link>
        </nav>
        <div className="px-6 pt-8 space-y-4">
          <a
            href={`tel:${contactInfo.phone}`}
            className="flex items-center justify-center w-full py-4 border border-brand text-brand font-semibold rounded-full hover:bg-brand hover:text-white transition-all"
          >
            Bel ons
          </a>
          <Link
            href="/contact/"
            className="flex items-center justify-center w-full py-4 bg-brand text-white font-semibold rounded-full hover:bg-brand-deep transition-colors"
          >
            Offerte aanvragen
          </Link>
        </div>
      </div>
    </>
  );
}
