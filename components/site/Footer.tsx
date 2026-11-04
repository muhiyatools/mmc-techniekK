import Image from "next/image";
import Link from "next/link";
import { CertLogos } from "@/components/site/CertLogos";
import type { Settings } from "@/lib/content/types";
import { href, t, type Locale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/ui";
import type { NavModel } from "./nav";

export function Footer({ lang, nav, settings, legal }: { lang: Locale; nav: NavModel; settings: Settings; legal: string[] }) {
  const d = getDict(lang);
  const c = settings.contact;
  const company = [
    { path: "/zakelijk", label: d.nav.business },
    { path: "/over-ons", label: d.nav.about },
    { path: "/aanbod", label: d.nav.catalog },
    { path: "/veelgestelde-vragen", label: d.faq.title },
    { path: "/contact", label: d.nav.contact },
  ];
  const legalLinks = [
    { slug: "privacy", label: d.footer.privacy },
    { slug: "cookies", label: d.footer.cookies },
    { slug: "algemene-voorwaarden", label: d.footer.terms },
  ].filter((l) => legal.includes(l.slug));

  const linkCls = "text-[15px] text-on-dark transition-colors hover:text-white";

  return (
    <footer className="on-dark bg-ink pb-[calc(32px+var(--bar-h)+var(--safe-bottom))] pt-16 text-white sm:pt-[88px] lg:pb-8">
      <div className="wrap flex flex-col gap-14 sm:gap-16">
        <div className="border-b border-on-dark-line pb-12 sm:pb-14">
          <Image src="/brand/logo-dark.svg" alt="MMC Techniek B.V." width={182} height={84} className="h-14 w-auto sm:h-[72px]" />
        </div>

        <div className="grid grid-cols-1 gap-10 xs:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1.3fr]">
          <nav aria-label={d.footer.services} className="flex flex-col gap-3">
            <h2 className="t-mono text-on-dark-muted">{d.footer.services}</h2>
            {nav.services.map((s) => (
              <Link key={s.slug} href={href(lang, `/diensten/${s.slug}`)} className={linkCls}>
                {s.title}
              </Link>
            ))}
          </nav>
          <nav aria-label={d.footer.company} className="flex flex-col gap-3">
            <h2 className="t-mono text-on-dark-muted">{d.footer.company}</h2>
            {company.map((l) => (
              <Link key={l.path} href={href(lang, l.path)} className={linkCls}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-3">
            <h2 className="t-mono text-on-dark-muted">{d.footer.contact}</h2>
            <a href={c.maps_url} target="_blank" rel="noopener noreferrer" className={linkCls}>
              {c.street}
              <br />
              {c.postcode} {c.city}
            </a>
            <a href={`tel:${c.phone}`} className={linkCls}>
              {c.phone_display}
            </a>
            <a href={`mailto:${c.email}`} className={linkCls}>
              {c.email}
            </a>
            <span className="text-[15px] text-on-dark">{t(settings.hours, lang)}</span>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="t-mono text-on-dark-muted">{d.footer.certified}</h2>
            <CertLogos names={settings.certifications} height={40} tile />
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-4 border-t border-on-dark-line pt-6">
          <span className="t-mono leading-relaxed text-on-dark-muted">
            © {new Date().getFullYear()} {settings.company.name} · KvK {settings.company.kvk} · {d.contact.btw} {settings.company.btw}
          </span>
          <span className="flex gap-6">
            {legalLinks.map((l) => (
              <Link key={l.slug} href={href(lang, `/${l.slug}`)} className="text-sm text-on-dark transition-colors hover:text-white">
                {l.label}
              </Link>
            ))}
          </span>
        </div>
      </div>
    </footer>
  );
}
