"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { navItems, contactInfo } from "@/lib/data";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = navItems.map((n) => n.href.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    document.body.style.overflow = "";
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled || menuOpen
            ? "bg-base/90 backdrop-blur-xl shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 h-[68px] lg:h-[80px] flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
          >
            <Image
              src="/images/logo.png"
              alt="MMC Techniek B.V."
              width={200}
              height={60}
              className="h-7 lg:h-8 w-auto object-contain"
              priority
            />
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNav(item.href)}
                className={`relative text-[0.8125rem] font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm ${
                  activeSection === item.href
                    ? "text-ink"
                    : "text-muted hover:text-ink"
                }`}
              >
                {item.label}
                {activeSection === item.href && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-5">
            <a
              href={`tel:${contactInfo.phone}`}
              className="text-[0.8125rem] font-medium text-muted hover:text-ink transition-colors duration-200 tabular"
            >
              {contactInfo.phoneDisplay}
            </a>
            <button
              onClick={() => handleNav("#contact")}
              className="px-5 py-2.5 bg-ink text-white text-[0.8125rem] font-semibold rounded-full hover:bg-brand transition-colors duration-200"
            >
              Offerte aanvragen
            </button>
          </div>

          {/* Mobile menu button */}
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
            <div className="relative flex flex-col justify-between w-5 h-3.5">
              <span
                className={`block h-[1.5px] bg-current transition-all duration-300 origin-center ${
                  menuOpen ? "rotate-45 translate-y-[6px]" : ""
                }`}
              />
              <span
                className={`block h-[1.5px] bg-current transition-all duration-300 ${
                  menuOpen ? "opacity-0 scale-x-0" : ""
                }`}
              />
              <span
                className={`block h-[1.5px] bg-current transition-all duration-300 origin-center ${
                  menuOpen ? "-rotate-45 -translate-y-[6px]" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-base transition-all duration-500 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col px-6 pt-28 gap-1">
          {navItems.map((item, i) => (
            <button
              key={item.href}
              onClick={() => handleNav(item.href)}
              className="text-left py-4 border-b border-border text-2xl font-semibold text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              style={{
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(12px)",
                transition: `all 0.4s cubic-bezier(0.22,1,0.36,1) ${i * 60 + 100}ms`,
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div
          className="px-6 pt-8 space-y-4"
          style={{
            opacity: menuOpen ? 1 : 0,
            transform: menuOpen ? "translateY(0)" : "translateY(10px)",
            transition: `all 0.4s cubic-bezier(0.22,1,0.36,1) 350ms`,
          }}
        >
          <a
            href={`tel:${contactInfo.phone}`}
            className="block text-muted hover:text-ink text-sm font-medium tabular"
          >
            Bel {contactInfo.phoneDisplay}
          </a>
          <button
            onClick={() => handleNav("#contact")}
            className="w-full py-3.5 bg-ink text-white text-sm font-semibold rounded-full hover:bg-brand transition-colors duration-200"
          >
            Offerte aanvragen
          </button>
        </div>
      </div>
    </>
  );
}
