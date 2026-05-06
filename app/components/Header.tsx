"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems, contactInfo, services } from "@/lib/data";

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
        className={`fixed top-0 inset-x-0 z-50 h-20 transition-all duration-300 border-b ${
          scrolled ? "bg-base/90 backdrop-blur-md border-hairline" : "bg-base/80 backdrop-blur-sm border-transparent"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 h-full flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
          >
            <Image
              src="/images/logo.png"
              alt="MMC Techniek B.V."
              width={300}
              height={90}
              className="h-11 lg:h-12 w-auto object-contain"
              priority
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
                        isActive(item.href) ? "text-brand" : "text-ink hover:text-brand"
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

                    {/* Dropdown */}
                    {dropdownOpen && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-60 bg-mist border border-hairline overflow-hidden">
                        <div className="py-2">
                          {services.map((service) => (
                            <Link
                              key={service.slug}
                              href={`/diensten/${service.slug}`}
                              onClick={() => setDropdownOpen(false)}
                              className="block px-4 py-2.5 text-sm font-medium text-ink hover:bg-brand/5 hover:text-brand transition-colors duration-150"
                            >
                              {service.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`relative text-[15px] font-semibold tracking-wide transition-colors duration-200 py-2 ${
                      isActive(item.href) ? "text-brand" : "text-ink hover:text-brand"
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
              className="px-5 py-2.5 border border-ink text-ink text-sm font-semibold rounded-full hover:border-brand hover:text-brand transition-all duration-200"
            >
              Bel Ons
            </a>
            <Link
              href="/contact/"
              className="px-5 py-2.5 bg-ink text-[var(--color-base)] text-sm font-semibold rounded-full hover:bg-brand transition-all duration-200"
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
                        className="block text-base text-muted hover:text-brand transition-colors"
                      >
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
        </nav>
        <div className="px-6 pt-8 space-y-4">
          <a
            href={`tel:${contactInfo.phone}`}
            className="flex items-center justify-center w-full py-4 border border-ink text-ink font-semibold rounded-full hover:bg-ink hover:text-[var(--color-base)] transition-all"
          >
            Bel Ons
          </a>
          <Link
            href="/contact/"
            className="flex items-center justify-center w-full py-4 bg-ink text-[var(--color-base)] font-semibold rounded-full hover:bg-brand transition-colors"
          >
            Offerte Aanvragen
          </Link>
        </div>
      </div>
    </>
  );
}
