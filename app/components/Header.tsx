"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems, contactInfo, services } from "@/lib/data";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesInView, setServicesInView] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = document.getElementById("diensten");
    if (!el) {
      setServicesInView(false);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => setServicesInView(entry.isIntersecting),
      { rootMargin: "-25% 0px -55% 0px", threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [pathname]);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
    document.body.style.overflow = "";
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/" && !servicesInView;
    if (href === "/#diensten") return pathname === "/" && servicesInView;
    return pathname === href || pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled || menuOpen
            ? "bg-white/95 backdrop-blur-xl shadow-[0_2px_20px_rgba(0,0,0,0.08)]"
            : "bg-transparent"
        }`}
      >
        {/* Full-width background line */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-brand via-brand to-brand" />

        <div className="w-full px-6 lg:px-12 h-[88px] lg:h-[100px] flex items-center justify-between">
          {/* Logo - Left */}
          <Link
            href="/"
            className="flex items-center shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
          >
            <Image
              src="/images/logo.png"
              alt="MMC Techniek B.V."
              width={400}
              height={120}
              className="h-[52px] lg:h-[65px] w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav - Centered */}
          <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => (
              <div key={item.href} className="relative">
                {item.isHash ? (
                  <div className="relative">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className={`relative text-base font-semibold transition-colors duration-300 py-2 flex items-center gap-1 ${
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
                    
                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-xl shadow-xl border border-border overflow-hidden">
                        <div className="py-2">
                          {services.map((service) => (
                            <Link
                              key={service.title}
                              href="/#diensten"
                              onClick={() => setDropdownOpen(false)}
                              className="block px-5 py-3 text-sm text-ink hover:bg-brand/5 hover:text-brand transition-colors duration-200"
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
                    className={`relative text-base font-semibold transition-colors duration-300 py-2 ${
                      isActive(item.href) ? "text-brand" : "text-ink hover:text-brand"
                    }`}
                  >
                    {item.label}
                    {isActive(item.href) && (
                      <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-brand rounded-full" />
                    )}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* CTA - Right */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href={`tel:${contactInfo.phone}`}
              className="flex items-center gap-2 px-5 py-2.5 border-2 border-brand text-brand text-sm font-semibold rounded-full hover:bg-brand hover:text-white transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Bel Ons
            </a>
            <Link
              href="/contact/"
              className="px-6 py-2.5 bg-brand text-white text-sm font-semibold rounded-full hover:bg-brand-deep transition-all duration-300 hover:shadow-lg hover:shadow-brand/25"
            >
              Contact
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
            className="lg:hidden w-12 h-12 flex items-center justify-center text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            aria-label={menuOpen ? "Sluit menu" : "Open menu"}
          >
            <div className="relative flex flex-col justify-between w-7 h-5">
              <span className={`block h-[2px] bg-current transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-[9px]" : ""}`} />
              <span className={`block h-[2px] bg-current transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
              <span className={`block h-[2px] bg-current transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-[9px]" : ""}`} />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-white transition-all duration-500 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col px-6 pt-36 gap-2">
          {navItems.map((item, i) => (
            <div key={item.href}>
              {item.isHash ? (
                <div className="py-5 border-b border-border">
                  <div className="text-lg font-semibold text-ink mb-3">Diensten</div>
                  <div className="pl-4 space-y-2">
                    {services.map((service) => (
                      <Link
                        key={service.title}
                        href="/#diensten"
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
                  className="py-5 border-b border-border text-3xl font-semibold text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  style={{
                    opacity: menuOpen ? 1 : 0,
                    transform: menuOpen ? "translateY(0)" : "translateY(12px)",
                    transition: `all 0.4s cubic-bezier(0.22,1,0.36,1) ${i * 60 + 100}ms`,
                  }}
                >
                  <span className={isActive(item.href) ? "text-brand" : ""}>
                    {item.label}
                  </span>
                </Link>
              )}
            </div>
          ))}
        </nav>
        <div
          className="px-6 pt-10 space-y-5"
          style={{
            opacity: menuOpen ? 1 : 0,
            transform: menuOpen ? "translateY(0)" : "translateY(10px)",
            transition: `all 0.4s cubic-bezier(0.22,1,0.36,1) 400ms`,
          }}
        >
          <a
            href={`tel:${contactInfo.phone}`}
            className="flex items-center justify-center w-full py-5 border-2 border-brand text-brand text-lg font-semibold rounded-full hover:bg-brand hover:text-white transition-all"
          >
            Bel Ons
          </a>
          <Link
            href="/contact/"
            className="flex items-center justify-center w-full py-5 bg-brand text-white text-lg font-semibold rounded-full hover:bg-brand-hover transition-colors"
          >
            Contact Ons
          </Link>
        </div>
      </div>
    </>
  );
}