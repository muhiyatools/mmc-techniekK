import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/ui";
import { href } from "@/lib/i18n/config";

/** Flag marks for the language switcher. Drawn, not icon-font, so they stay crisp at 20px. */
function Flag({ locale }: { locale: Locale }) {
  if (locale === "nl") {
    return (
      <svg viewBox="0 0 60 42" aria-hidden="true" className="flag">
        <rect width="60" height="42" fill="#ffffff" />
        <rect width="60" height="14" fill="#ae1c28" />
        <rect y="28" width="60" height="14" fill="#21468b" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 60 42" aria-hidden="true" className="flag">
      <rect width="60" height="42" fill="#012169" />
      <path d="M0 0 60 42M60 0 0 42" stroke="#ffffff" strokeWidth="9" />
      <path d="M0 0 60 42M60 0 0 42" stroke="#c8102e" strokeWidth="4.5" />
      <path d="M30 0V42M0 21H60" stroke="#ffffff" strokeWidth="14" />
      <path d="M30 0V42M0 21H60" stroke="#c8102e" strokeWidth="8" />
    </svg>
  );
}

const LOCALES: { code: Locale; name: string }[] = [
  { code: "nl", name: "Nederlands" },
  { code: "en", name: "English" },
];

/**
 * Two flags, one click. Shows both languages at once instead of the cryptic
 * "NL / EN" text, and marks the active one by full opacity instead of colour alone.
 */
export function LanguageSwitch({ lang, bare, tone = "light", className = "" }: { lang: Locale; bare: string; tone?: "light" | "dark"; className?: string }) {
  const d = getDict(lang);
  return (
    <div className={`lang-switch ${tone === "dark" ? "lang-switch-dark" : ""} ${className}`} role="group" aria-label={d.nav.language}>
      {LOCALES.map((l) => {
        const active = l.code === lang;
        return (
          <Link
            key={l.code}
            href={href(l.code, bare)}
            hrefLang={l.code}
            lang={l.code}
            aria-label={l.name}
            aria-current={active ? "true" : undefined}
            className="lang-switch-item"
          >
            <Flag locale={l.code} />
            <span className="sr-only">{l.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
