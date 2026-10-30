"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { Icon } from "@/components/ui/Icon";
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";
import { href, type Locale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/ui";
import { LanguageSwitch } from "./LanguageSwitch";
import { whatsappHref, type NavModel } from "./nav";

/** Full-screen menu for phones and tablets (design/boards/Mobile-Menu.html). */
export function MobileMenu({ lang, nav, open, onClose, bare }: { lang: Locale; nav: NavModel; open: boolean; onClose: () => void; bare: string }) {
  const d = getDict(lang);
  const ref = useFocusTrap<HTMLDivElement>(open, onClose);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const links = [
    { path: "/zakelijk", label: d.nav.business },
    { path: "/over-ons", label: d.nav.about },
    { path: "/veelgestelde-vragen", label: d.nav.faq },
    { path: "/contact", label: d.nav.contact },
  ];

  return (
    <div
      id="mobile-menu"
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={d.nav.main}
      tabIndex={-1}
      className="on-dark menu-sheet fixed inset-0 z-50 flex flex-col overflow-y-auto bg-ink text-white outline-none lg:hidden"
    >
      <svg aria-hidden="true" viewBox="0 0 400 400" className="pointer-events-none absolute -right-40 -top-24 w-[420px] opacity-[0.06]">
        <circle cx="200" cy="200" r="190" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="200" cy="200" r="130" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 8" />
      </svg>

      <div className="wrap relative flex h-[var(--header-h)] flex-none items-center justify-between">
        <Link href={href(lang, "/")} onClick={onClose} aria-label="MMC Techniek, home">
          <Image src="/brand/logo-dark.svg" alt="MMC Techniek B.V." width={100} height={46} className="h-[38px] w-auto" />
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSwitch lang={lang} bare={bare} tone="dark" />
          <button type="button" onClick={onClose} aria-label={d.nav.closeMenu} data-autofocus className="icon-btn bg-white text-ink shadow-none hover:bg-sky">
            <Icon name="close" size={20} />
          </button>
        </div>
      </div>

      <nav aria-label={d.nav.main} className="wrap relative flex flex-col pt-3">
        <div className="border-b border-on-dark-line pb-4">
          <p className="menu-item flex min-h-14 items-center justify-between text-[28px] font-bold tracking-[-0.02em] text-signal [font-stretch:118%]" style={{ "--i": 0 } as React.CSSProperties}>
            {d.nav.services}
          </p>
          <ul className="grid grid-cols-2 gap-2">
            {nav.services.map((s, i) => (
              <li key={s.slug} className="menu-item" style={{ "--i": i + 1 } as React.CSSProperties}>
                <Link
                  href={s.href}
                  onClick={onClose}
                  className="flex min-h-12 items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2.5 text-[15px] font-medium shadow-[inset_0_0_0_1.5px_var(--color-on-dark-ring)] transition-colors hover:bg-white/5"
                >
                  <Icon name={s.slug as never} size={18} className="text-signal" />
                  {s.title}
                  {s.hasProducts && <Icon name="arrowUpRight" size={14} className="ml-auto text-on-dark-muted" />}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {links.map((l, i) => (
          <Link
            key={l.path}
            href={href(lang, l.path)}
            onClick={onClose}
            aria-current={bare === l.path ? "page" : undefined}
            className="menu-item flex min-h-[60px] items-center justify-between border-b border-on-dark-line text-[26px] font-bold tracking-[-0.02em] [font-stretch:118%] aria-[current=page]:text-signal"
            style={{ "--i": i + 8 } as React.CSSProperties}
          >
            {l.label}
            <Icon name="arrow" size={20} className="text-on-dark-muted" />
          </Link>
        ))}
      </nav>

      <div className="wrap relative mt-auto flex flex-col gap-2.5 pb-[calc(24px+var(--safe-bottom))] pt-8">
        <div className="grid grid-cols-2 gap-2.5">
          <a href={`tel:${nav.phone}`} className="flex h-[52px] items-center justify-center gap-2 rounded-full text-[15px] font-semibold shadow-[inset_0_0_0_1.5px_var(--color-on-dark-ring)] transition-colors hover:bg-white/5">
            <Icon name="phone" />
            {d.cta.call}
          </a>
          <a
            href={whatsappHref(nav, nav.whatsappText)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-[52px] items-center justify-center gap-2 rounded-full text-[15px] font-semibold shadow-[inset_0_0_0_1.5px_var(--color-on-dark-ring)] transition-colors hover:bg-white/5"
          >
            <Icon name="whatsapp" />
            {d.cta.whatsapp}
          </a>
        </div>
        <Link href={href(lang, "/offerte")} onClick={onClose} className="btn btn-on-dark w-full">
          <span>{d.cta.quote}</span>
          <span className="knob">
            <Icon name="arrow" />
          </span>
        </Link>
        <p className="t-mono pt-1.5 text-center text-on-dark-muted">
          {nav.certifications.join(" · ")} · {d.trust.since(nav.founded).toLowerCase()}
        </p>
      </div>
    </div>
  );
}
