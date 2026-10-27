import Image from "next/image";
import Link from "next/link";
import type { Settings } from "@/lib/content/types";
import { href, t, type Locale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/ui";
import type { NavModel } from "./nav";

export function Footer({ lang, nav, settings, legal }: { lang: Locale; nav: NavModel; settings: Settings; legal: string[] }) {
  const d = getDict(lang);
  const c = settings.contact;
  const company = [
    { path: "/projecten", label: d.nav.projects },
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
        <div className="flex flex-wrap items-end justify-between gap-8 border-b border-on-dark-line pb-12 sm:pb-14">
          <Image src="/brand/logo-dark.svg" alt="MMC Techniek B.V." width={182} height={84} className="h-14 w-auto sm:h-[84px]" />
          <p className="t-h3 max-w-[560px] text-[clamp(22px,2.4vw,32px)] font-[750] [font-stretch:118%]">
            {d.footer.closing}{" "}
            <Link href={href(lang, "/offerte")} className="text-signal underline decoration-[1.5px] underline-offset-[6px] transition-colors hover:text-signal-soft">
              {d.cta.quote}
            </Link>
          </p>
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
            <div className="flex flex-wrap gap-2.5">
              <span className="grid h-16 place-items-center rounded-xl bg-white px-3.5">
                <Image src="/brand/certs/nen-1010.png" alt="NEN 1010" width={80} height={24} className="h-6 w-auto" />
              </span>
              <span className="grid size-16 place-items-center rounded-xl bg-white">
                <Image src="/brand/certs/nen-3140.png" alt="NEN 3140" width={48} height={48} className="h-12 w-auto" />
              </span>
              <span className="grid size-16 place-items-center rounded-xl bg-white">
                <Image src="/brand/certs/vca.png" alt="VCA" width={48} height={48} className="h-12 w-auto" />
              </span>
            </div>
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
