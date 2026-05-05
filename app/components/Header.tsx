"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems, contactInfo } from "@/lib/data";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    document.body.style.overflow = "";
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled || menuOpen
            ? "bg-white/90 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.05)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 h-[90px] lg:h-[120px] flex items-center justify-between">
          {/* Logo — 2x bigger */}
          <Link
            href="/"
            className="flex items-center shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
          >
            <Image
              src="/images/logo.png"
              alt="MMC Techniek B.V."
              width={400}
              height={120}
              className="h-14 lg:h-[72px] w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav — 2x bigger items */}
          <nav className="hidden lg:flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-lg font-medium transition-colors duration-300 py-2 ${
                  isActive(item.href)
                    ? "text-brand"
                    : "text-muted hover:text-ink"
                }`}
              >
                {item.label}
                {isActive(item.href) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-brand rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA — bigger */}
          <div className="hidden lg:flex items-center gap-6">
            <a
              href={`tel:${contactInfo.phone}`}
              className="text-lg font-medium text-muted hover:text-ink transition-colors duration-200 tabular"
            >
              {contactInfo.phoneDisplay}
            </a>
            <Link
              href="/contact/"
              className="px-7 py-3.5 bg-brand text-white text-lg font-semibold rounded-full hover:bg-brand-hover transition-colors duration-200"
            >
              Offerte aanvragen
            </Link>
          </div>

          {/* Mobile hamburger — bigger */}
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
            <Link
              key={item.href}
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
          <a href={`tel:${contactInfo.phone}`} className="block text-muted hover:text-ink text-lg font-medium tabular">
            Bel {contactInfo.phoneDisplay}
          </a>
          <Link
            href="/contact/"
            className="flex items-center justify-center w-full py-5 bg-brand text-white text-lg font-semibold rounded-full hover:bg-brand-hover transition-colors"
          >
            Offerte aanvragen
          </Link>
        </div>
      </div>
    </>
  );
}
