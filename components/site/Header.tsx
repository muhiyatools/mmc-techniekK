"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { href, type Locale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/ui";
import { LanguageSwitch } from "./LanguageSwitch";
import { MobileMenu } from "./MobileMenu";
import type { NavModel } from "./nav";

/** Strip the locale (and the internal /nl rewrite) from a pathname. */
export function barePath(pathname: string) {
  return pathname.replace(/^\/(nl|en)(?=\/|$)/, "") || "/";
}

export function Header({ lang, nav }: { lang: Locale; nav: NavModel }) {
  const d = getDict(lang);
  const pathname = usePathname();
  const bare = barePath(pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      if (Math.abs(y - lastY.current) < 8) return;
      setHidden(y > lastY.current && y > 160);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu when the route changes (adjusting state during render, not in an effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  const isActive = (path: string) => bare === path || bare.startsWith(`${path}/`);

  const links = [
    { path: "/zakelijk", label: d.nav.business },
    { path: "/over-ons", label: d.nav.about },
    { path: "/veelgestelde-vragen", label: d.nav.faq },
    { path: "/contact", label: d.nav.contact },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-[transform,background-color,box-shadow] duration-[var(--dur)] ease-[var(--ease-out)] ${
          hidden && !menuOpen ? "-translate-y-full" : "translate-y-0"
        } ${scrolled ? "bg-white/90 shadow-[0_1px_0_var(--color-line)] backdrop-blur-[14px] backdrop-saturate-150" : "bg-white"}`}
      >
        <div className="wrap flex h-[var(--header-h)] items-center justify-between gap-6">
          <Link href={href(lang, "/")} className="flex items-center rounded-md" aria-label="MMC Techniek, home">
            <Image src="/brand/logo.svg" alt="MMC Techniek B.V." width={100} height={46} priority className="h-[38px] w-auto sm:h-[46px]" />
          </Link>

          <nav aria-label={d.nav.main} className="hidden items-center gap-0.5 lg:flex">
            <ServicesMenu lang={lang} nav={nav} active={isActive("/diensten") || bare === "/aanbod"} />
            {links.map((l) => (
              <Link
                key={l.path}
                href={href(lang, l.path)}
                aria-current={isActive(l.path) ? "page" : undefined}
                className="rounded-full px-3.5 py-2.5 text-[15px] font-medium text-ink transition-colors duration-[var(--dur-fast)] hover:bg-paper aria-[current=page]:text-blue-deep"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3.5">
            <LanguageSwitch lang={lang} bare={bare} className="hidden sm:inline-flex" />
            <a href={`tel:${nav.phone}`} className="hidden items-center gap-2 rounded-full px-1 py-2 text-[15px] font-semibold text-ink transition-colors hover:text-blue xl:flex">
              <Icon name="phone" />
              {nav.phoneDisplay}
            </a>
            <Link href={href(lang, "/offerte")} className="btn btn-primary btn-sm hidden sm:inline-flex">
              <span>{d.cta.quote}</span>
              <span className="knob">
                <Icon name="arrow" size={16} />
              </span>
            </Link>
            <button
              type="button"
              className="icon-btn bg-ink text-white shadow-none hover:bg-blue lg:hidden"
              aria-label={d.nav.openMenu}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(true)}
            >
              <Icon name="menu" size={20} />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu lang={lang} nav={nav} open={menuOpen} onClose={() => setMenuOpen(false)} bare={bare} />
    </>
  );
}

function ServicesMenu({ lang, nav, active }: { lang: Locale; nav: NavModel; active: boolean }) {
  const d = getDict(lang);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative" onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="services-menu"
        onClick={() => setOpen((o) => (window.matchMedia("(hover: hover)").matches ? true : !o))}
        onMouseEnter={() => setOpen(true)}
        className={`flex items-center gap-1.5 rounded-full px-3.5 py-2.5 text-[15px] font-medium transition-colors hover:bg-paper ${active ? "text-blue-deep" : "text-ink"}`}
      >
        {d.nav.services}
        <Icon name="chevronDown" size={16} className={`transition-transform duration-[var(--dur)] ${open ? "rotate-180" : ""}`} />
      </button>
      <div id="services-menu" hidden={!open} className="absolute left-0 top-full w-[420px] pt-2">
        <ul className="rounded-[var(--radius-md)] border border-line bg-white p-2 shadow-[var(--shadow-float)]">
          {nav.services.map((s) => (
            <li key={s.slug}>
              <Link href={s.href} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 transition-colors hover:bg-paper">
                <span className="grid size-9 flex-none place-items-center rounded-full bg-paper text-blue">
                  <Icon name={s.slug as never} size={18} />
                </span>
                <span className="text-[15px] font-semibold text-ink">{s.title}</span>
                {s.hasProducts && <Icon name="arrowUpRight" size={15} className="ml-auto text-graphite" />}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
