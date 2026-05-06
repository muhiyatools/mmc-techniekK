"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems, contactInfo } from "@/lib/data";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesInView, setServicesInView] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track whether #diensten section is actually in the viewport
  useEffect(() => {
    const el = document.getElementById("diensten");
    if (!el) {
      setServicesInView(false);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => setServicesInView(entry.isIntersecting),
      // Fires when section occupies the middle band of the viewport
      { rootMargin: "-25% 0px -55% 0px", threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [pathname]);

  useEffect(() => {
    setMenuOpen(false);
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
            ? "bg-white/90 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.05)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 h-[88px] lg:h-[118px] flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
          >
            <Image
              src="/images/logo.png"
              alt="MMC Techniek B.V."
              width={400}
              height={120}
              className="h-[52px] lg:h-[70px] w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
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

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-5">
            <a
              href={`tel:${contactInfo.phone}`}
              className="px-7 py-3.5 border-2 border-brand text-brand text-lg font-semibold rounded-full hover:bg-brand hover:text-white transition-all duration-300"
            >
              Bel Ons
            </a>
            <Link
              href="/contact/"
              className="px-7 py-3.5 bg-brand text-white text-lg font-semibold rounded-full hover:bg-brand-hover transition-all duration-300 hover:shadow-lg hover:shadow-brand/25"
            >
              Contact Ons
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
