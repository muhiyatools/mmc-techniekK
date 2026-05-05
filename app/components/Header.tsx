"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks, contactInfo } from "@/lib/data";
import Image from "next/image";

// Desktop nav: logo = home, so Home is excluded.
// Contact is the inline CTA button, not a nav link.
const desktopLinks = navLinks.filter(
  (l) => l.href !== "/" && l.href !== "/contact"
);

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    document.body.style.overflow = "";
  }, [pathname]);

  const toggleMenu = () => {
    setMenuOpen((prev) => {
      const next = !prev;
      document.body.style.overflow = next ? "hidden" : "";
      return next;
    });
  };

  // Header only goes dark when the mobile overlay is open,
  // so the two surfaces join seamlessly as one ink panel.
  // Desktop scrolling stays light — no aggressive inversion.
  const isDark = menuOpen;

  return (
    <>
      {/* ─── Header bar ─────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isDark
            ? "bg-ink border-b border-white/[0.06]"
            : scrolled
              ? "bg-base/97 backdrop-blur-md border-b border-concrete/60 shadow-[0_1px_12px_oklch(14%_0.012_240/0.07)]"
              : "bg-base border-b border-concrete/30"
        }`}
      >
        {/*
          3-column grid: Logo | Nav (true center) | Controls
          This keeps the nav optically centered regardless of logo/button widths.
        */}
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 h-[68px] lg:h-[76px]
                        grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_auto_1fr] items-center gap-4 lg:gap-8">

          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex items-center shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            aria-label="MMC Techniek B.V. — terug naar home"
          >
            <Image
              src="/images/logo.png"
              alt="MMC Techniek B.V."
              width={220}
              height={66}
              className={`h-9 w-auto object-contain transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isDark ? "brightness-0 invert" : ""
              }`}
              priority
            />
          </Link>

          {/* ── Desktop nav — true center via grid col 2 ── */}
          <nav
            className="hidden lg:flex items-center justify-center gap-1"
            aria-label="Hoofdnavigatie"
          >
            {desktopLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`group relative flex flex-col items-center gap-[0.3125rem] px-[1.125rem] py-2 rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                    isActive
                      ? "text-ink bg-concrete"
                      : "text-muted hover:text-copy hover:bg-concrete/60"
                  }`}
                >
                  {/* Label — bigger, readable, not all-caps */}
                  <span className="text-[0.9375rem] font-medium font-sans tracking-[0.005em] leading-none whitespace-nowrap">
                    {link.label}
                  </span>

                  {/* Brand dot: the "special thing."
                      Scales in below the label on hover; stays solid on active.
                      Reads like a precision instrument indicator. */}
                  <span
                    className={`block w-[4px] h-[4px] rounded-full bg-brand transition-all duration-200 ease-out origin-center ${
                      isActive
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-0 group-hover:opacity-60 group-hover:scale-100"
                    }`}
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </nav>

          {/* ── Desktop controls: phone + CTA (right-aligned) ── */}
          <div className="hidden lg:flex items-center justify-end gap-5">
            <a
              href={`tel:${contactInfo.phone}`}
              className="text-[0.8125rem] font-medium font-sans text-muted hover:text-copy transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              {contactInfo.phoneDisplay}
            </a>

            {/* Rounded CTA button — inline, not edge-flush */}
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 px-5 py-[0.5625rem] bg-brand text-base text-[0.8125rem] font-semibold font-sans rounded-full whitespace-nowrap hover:bg-brand-deep transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              Offerte aanvragen
              <svg
                className="w-[0.875rem] h-[0.875rem] transition-transform duration-200 ease-out group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* ── Mobile: hamburger ── */}
          <div className="lg:hidden flex items-center justify-end">
            <button
              onClick={toggleMenu}
              className={`w-11 h-11 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-colors duration-500 ${
                isDark ? "text-base" : "text-ink"
              }`}
              aria-label={menuOpen ? "Sluit menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <span className="relative flex flex-col justify-between w-[22px] h-[14px]" aria-hidden="true">
                <span className={`block h-[1.5px] bg-current transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] origin-center ${menuOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
                <span className={`block h-[1.5px] bg-current transition-all duration-300 ease-out ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
                <span className={`block h-[1.5px] bg-current transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] origin-center ${menuOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* ─── Mobile overlay ─────────────────────────────────────────── */}
      {/*
        Full-screen ink overlay (z-40, header is z-50).
        Since header turns ink on menuOpen, the two surfaces are one continuous panel.
        Items stagger in with opacity + translate; close collapses them instantly.
      */}
      <div
        id="mobile-menu"
        aria-hidden={!menuOpen}
        className={`lg:hidden fixed inset-0 z-40 bg-ink transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Nav links — offset below the 68px header */}
        <nav
          className="flex flex-col px-6 pt-[calc(68px+2.5rem)]"
          aria-label="Mobiele navigatie"
        >
          {navLinks.map((link, i) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center py-[0.9375rem] border-b border-base/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                  isActive ? "text-brand" : "text-base/35 hover:text-base/80"
                }`}
                style={
                  menuOpen
                    ? {
                        opacity: 1,
                        transform: "translateY(0)",
                        transition: `color 200ms, opacity 520ms cubic-bezier(0.22,1,0.36,1) ${i * 55 + 80}ms, transform 520ms cubic-bezier(0.22,1,0.36,1) ${i * 55 + 80}ms`,
                      }
                    : {
                        opacity: 0,
                        transform: "translateY(14px)",
                        transition: "color 200ms, opacity 180ms ease-out, transform 180ms ease-out",
                      }
                }
              >
                {/* Barlow Condensed at 2rem — large, architectural, distinctive */}
                <span className="font-display font-bold uppercase leading-none text-[2rem] tracking-tight">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Phone + CTA — fade in after last link */}
        <div
          className="px-6 pt-7 space-y-3"
          style={
            menuOpen
              ? {
                  opacity: 1,
                  transform: "translateY(0)",
                  transition: `opacity 520ms cubic-bezier(0.22,1,0.36,1) ${navLinks.length * 55 + 110}ms, transform 520ms cubic-bezier(0.22,1,0.36,1) ${navLinks.length * 55 + 110}ms`,
                }
              : {
                  opacity: 0,
                  transform: "translateY(10px)",
                  transition: "opacity 150ms ease-out, transform 150ms ease-out",
                }
          }
        >
          <a
            href={`tel:${contactInfo.phone}`}
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 text-base/35 hover:text-base/65 text-[0.875rem] font-medium font-sans transition-colors duration-200"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {contactInfo.phoneDisplay}
          </a>

          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-[1.0625rem] bg-brand text-base text-[0.8125rem] font-semibold font-sans rounded-full hover:bg-brand-deep transition-colors duration-200"
          >
            Offerte aanvragen
          </Link>
        </div>
      </div>
    </>
  );
}
