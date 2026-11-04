import Link from "next/link";
import { ViewTransition, type ReactNode } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Photo } from "@/components/ui/Photo";
import type { Product } from "@/lib/content/types";
import { href, t, type Locale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/ui";
import { breadcrumbs, JsonLd } from "./JsonLd";

export type Crumb = { name: string; path: string };

/** Breadcrumb trail (visible + BreadcrumbList JSON-LD). */
export function Breadcrumbs({ lang, items }: { lang: Locale; items: Crumb[] }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="t-mono text-graphite">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {items.map((c, i) => (
            <li key={c.path} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true">/</span>}
              {i < items.length - 1 ? (
                <Link href={href(lang, c.path)} className="transition-colors hover:text-ink">
                  {c.name}
                </Link>
              ) : (
                <span aria-current="page" className="text-ink">
                  {c.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbs(lang, items)} />
    </>
  );
}

/** Top of an inner page: breadcrumbs, H1, lead, optional aside. */
export function PageIntro({ lang, crumbs, title, lead, aside, children, transitionName }: { lang: Locale; crumbs: Crumb[]; title: ReactNode; lead?: ReactNode; aside?: ReactNode; children?: ReactNode; transitionName?: string }) {
  const h1 = <h1 className="t-h1">{title}</h1>;
  return (
    <section className="pb-12 pt-8 sm:pb-16 sm:pt-12">
      <div className="wrap flex flex-col gap-7">
        <Breadcrumbs lang={lang} items={crumbs} />
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <div className={`${transitionName ? "" : "fade-up "}flex max-w-[820px] flex-col gap-5 3xl:max-w-[1180px]`}>
            {/* A named heading morphs from the link that led here (see ServicesLoop). */}
            {transitionName ? (
              <ViewTransition name={transitionName} share="morph" default="none">
                {h1}
              </ViewTransition>
            ) : (
              h1
            )}
            {lead && (
              <p className={`t-lead max-w-[620px] 3xl:max-w-[780px] ${transitionName ? "fade-up" : ""}`} style={transitionName ? ({ "--d": "140ms" } as React.CSSProperties) : undefined}>
                {lead}
              </p>
            )}
          </div>
          {aside && (
            <div className="fade-up flex flex-col gap-3" style={{ "--d": "120ms" } as React.CSSProperties}>
              {aside}
            </div>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}

/** Closing call to action on inner pages (blue panel). */
export function CtaPanel({ lang, title, text, quoteHref, phone, phoneDisplay }: { lang: Locale; title: string; text: string; quoteHref?: string; phone: string; phoneDisplay: string }) {
  const d = getDict(lang);
  return (
    <section className="pb-[var(--section)]">
      <div className="wrap">
        <div className="on-blue relative overflow-hidden rounded-[24px] bg-blue px-6 py-10 text-white sm:rounded-[var(--radius-panel)] sm:px-14 sm:py-14" data-reveal>
          <svg aria-hidden="true" viewBox="0 0 400 400" className="pointer-events-none absolute -right-24 -top-32 w-[420px] text-white opacity-[0.16]">
            <circle cx="200" cy="200" r="190" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="200" cy="200" r="130" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 8" />
          </svg>
          <div className="relative flex flex-wrap items-end justify-between gap-8">
            <div className="flex max-w-[620px] flex-col gap-4">
              <h2 className="t-h2 text-[clamp(30px,3.6vw,72px)]">{title}</h2>
              <p className="text-[17px] leading-relaxed text-on-blue">{text}</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <ButtonLink href={quoteHref ?? href(lang, "/offerte")} variant="white">
                {d.cta.quote}
              </ButtonLink>
              <a href={`tel:${phone}`} className="inline-flex min-h-11 items-center gap-2 font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">
                <Icon name="phone" />
                {phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function formatPrice(p: Pick<Product, "price_from" | "price_to">, lang: Locale) {
  const fmt = (n: number) => new Intl.NumberFormat(lang === "nl" ? "nl-NL" : "en-GB", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
  if (p.price_from && p.price_to) return `${fmt(p.price_from)} – ${fmt(p.price_to)}`;
  if (p.price_from) return `${getDict(lang).catalog.from} ${fmt(p.price_from)}`;
  return null;
}

/** Catalog card: product shot on white, name, brand, summary, price or "on request". */
export function ProductCard({ lang, product, priority, image = product.media }: { lang: Locale; product: Product; priority?: boolean; image?: Product["media"] }) {
  const d = getDict(lang);
  const price = formatPrice(product, lang);
  const variants = product.variants.length;
  return (
    <Link
      href={href(lang, `/aanbod/${product.slug}`)}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-tile)] border border-line bg-white transition-[border-color,transform,box-shadow] duration-[var(--dur)] ease-[var(--ease-out)] hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[0_18px_36px_-24px_rgb(15_27_38/0.35)]"
    >
      <div className="relative aspect-[4/3] border-b border-line bg-white">
        {image ? (
          <div className="absolute inset-6 transition-transform duration-[800ms] ease-[var(--ease-out)] group-hover:scale-[1.035]">
            <Photo media={image} lang={lang} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw" priority={priority} decorative fit="contain" />
          </div>
        ) : (
          // No product shot yet: a spec plate rather than an empty box.
          <div className="absolute inset-0 grid place-items-center bg-paper [background-image:repeating-linear-gradient(135deg,rgb(15_27_38/0.035)_0_1px,transparent_1px_9px)]">
            <span className="flex flex-col items-center gap-2.5 px-6 text-center">
              <Icon name={product.service.slug as never} size={26} strokeWidth={1.25} className="text-blue/70" />
              <span className="text-[19px] font-[650] leading-tight text-ink/75 [font-stretch:112%]">{product.brands[0]?.name ?? product.name}</span>
            </span>
          </div>
        )}
        <span className="t-mono spec-tag absolute left-3 top-3 border border-line">{t(product.service.title, lang)}</span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5 sm:p-6">
        {product.brands[0] && <span className="t-mono text-graphite">{product.brands.map((b) => b.name).join(" · ")}</span>}
        <h3 className="t-h3 text-[19px]">{product.name}</h3>
        <p className="text-[15px] leading-relaxed text-slate">{t(product.summary, lang)}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <span className="flex flex-col gap-0.5">
            {price && <span className="text-[15px] font-semibold text-ink">{price}</span>}
            {variants > 1 && (
              <span className="t-mono text-graphite">
                {variants} {d.catalog.variants.toLowerCase()}
              </span>
            )}
          </span>
          <span className="go shadow-[inset_0_0_0_1.5px_var(--color-line-strong)]">
            <Icon name="arrow" />
          </span>
        </div>
      </div>
    </Link>
  );
}
