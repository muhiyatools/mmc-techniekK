"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { navLinks, contactInfo } from "@/lib/data";
import InstrumentDot from "./InstrumentDot";

/*
 * Site header — daylight at all times.
 *
 *   ┌─ Logo ──────────── Nav (centered) ───────────── Phone / CTA ─┐
 *   │  hairline at top edge: aurora drift                          │
 *   │  hairline at bottom edge: solid hairline (after scroll)      │
 *   └──────────────────────────────────────────────────────────────┘
 *
 * No dark inversion. The mobile overlay slides in as a Mist surface,
 * not an ink panel. Active link is marked by an InstrumentDot, not a
 * filled background pill.
 */

const desktopLinks = navLinks.filter(
  (l) => l.href !== "/" && l.href !== "/contact",
);

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Close the mobile drawer on route change. This is a one-shot side
    // effect tied to navigation, not a render-derived value, so the
    // direct setState is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-[background-color,backdrop-filter] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          scrolled || menuOpen
            ? "bg-base/85 backdrop-blur-xl"
            : "bg-base/65 backdrop-blur-sm"
        }`}
      >
        {/* Aurora hairline at the very top edge — always present, drifts */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, var(--color-aurora-1) 24%, var(--color-brand) 50%, var(--color-aurora-2) 76%, transparent 100%)",
            backgroundSize: "200% 100%",
            animation: "aurora-drift 22s linear infinite",
          }}
        />

        {/* Solid hairline at the bottom edge — fades in on scroll */}
        <span
          aria-hidden="true"
          className={`absolute inset-x-0 bottom-0 h-px bg-hairline transition-opacity duration-300 ${
            scrolled || menuOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          className="max-w-[1280px] mx-auto px-6 lg:px-10 h-[64px] lg:h-[76px]
                     grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_auto_1fr] items-center gap-4 lg:gap-8"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
            aria-label="MMC Techniek B.V., terug naar home"
          >
            <Image
              src="/images/logo.png"
              alt="MMC Techniek B.V."
              width={220}
              height={66}
              className="h-8 lg:h-9 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav — centered */}
          <nav
            className="hidden lg:flex items-center gap-7"
            aria-label="Hoofdnavigatie"
          >
            {desktopLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className="group relative flex items-center gap-2 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
                >
                  <span
                    className={`text-[0.875rem] font-medium font-sans tracking-[0.005em] leading-none whitespace-nowrap transition-colors duration-200 ${
                      isActive ? "text-ink" : "text-copy/70 group-hover:text-ink"
                    }`}
                  >
                    {link.label}
                  </span>
                  {/* InstrumentDot — solid on active, fades in on hover */}
                  <span
                    aria-hidden="true"
                    className={`block w-[5px] h-[5px] rounded-full bg-brand transition-all duration-200 ease-out origin-center ${
                      isActive
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-50 group-hover:opacity-60 group-hover:scale-100"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Desktop right cluster */}
          <div className="hidden lg:flex items-center justify-end gap-5">
            <a
              href={`tel:${contactInfo.phone}`}
              className="text-[0.8125rem] font-medium font-sans text-muted hover:text-copy transition-colors duration-200 tabular focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
            >
              {contactInfo.phoneDisplay}
            </a>

            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 px-5 py-[0.5625rem] bg-ink text-base text-[0.8125rem] font-semibold font-sans rounded-full whitespace-nowrap hover:bg-brand transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              Offerte aanvragen
              <span
                aria-hidden="true"
                className="block w-[5px] h-[5px] rounded-full bg-base/80 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden flex items-center justify-end">
            <button
              onClick={toggleMenu}
              className="w-11 h-11 flex items-center justify-center text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
              aria-label={menuOpen ? "Sluit menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <span
                className="relative flex flex-col justify-between w-[22px] h-[14px]"
                aria-hidden="true"
              >
                <span
                  className={`block h-[1.5px] bg-current transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] origin-center ${
                    menuOpen ? "rotate-45 translate-y-[6px]" : ""
                  }`}
                />
                <span
                  className={`block h-[1.5px] bg-current transition-all duration-300 ease-out ${
                    menuOpen ? "opacity-0 scale-x-0" : ""
                  }`}
                />
                <span
                  className={`block h-[1.5px] bg-current transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] origin-center ${
                    menuOpen ? "-rotate-45 -translate-y-[6px]" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── Mobile overlay — daylight Mist surface ──────────────────── */}
      <div
        id="mobile-menu"
        aria-hidden={!menuOpen}
        className={`lg:hidden fixed inset-0 z-40 bg-base transition-opacity duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <nav
          className="flex flex-col px-6 pt-[calc(64px+2rem)]"
          aria-label="Mobiele navigatie"
        >
          {navLinks
            .filter((l) => l.href !== "/")
            .map((link, i) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className="flex items-center justify-between py-4 border-b border-hairline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
                  style={
                    menuOpen
                      ? {
                          opacity: 1,
                          transform: "translateY(0)",
                          transition: `opacity 480ms cubic-bezier(0.22,1,0.36,1) ${
                            i * 55 + 80
                          }ms, transform 480ms cubic-bezier(0.22,1,0.36,1) ${
                            i * 55 + 80
                          }ms`,
                        }
                      : {
                          opacity: 0,
                          transform: "translateY(12px)",
                          transition:
                            "opacity 160ms ease-out, transform 160ms ease-out",
                        }
                  }
                >
                  <span
                    className={`font-display font-bold uppercase leading-none text-[1.875rem] tracking-tight ${
                      isActive ? "text-ink" : "text-ink/85"
                    }`}
                  >
                    {link.label}
                  </span>
                  {isActive && <InstrumentDot size={6} />}
                </Link>
              );
            })}
        </nav>

        <div
          className="px-6 pt-7 space-y-3"
          style={
            menuOpen
              ? {
                  opacity: 1,
                  transform: "translateY(0)",
                  transition: `opacity 480ms cubic-bezier(0.22,1,0.36,1) ${
                    navLinks.length * 55 + 110
                  }ms, transform 480ms cubic-bezier(0.22,1,0.36,1) ${
                    navLinks.length * 55 + 110
                  }ms`,
                }
              : {
                  opacity: 0,
                  transform: "translateY(10px)",
                  transition: "opacity 140ms ease-out, transform 140ms ease-out",
                }
          }
        >
          <a
            href={`tel:${contactInfo.phone}`}
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 text-muted hover:text-ink text-[0.875rem] font-medium font-sans transition-colors duration-200 tabular"
          >
            Bel {contactInfo.phoneDisplay}
          </a>

          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center w-full py-4 bg-ink text-base text-[0.8125rem] font-semibold font-sans rounded-full hover:bg-brand transition-colors duration-200"
          >
            Offerte aanvragen
          </Link>
        </div>
      </div>
    </>
  );
}
