"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { CatalogCategory } from "@/lib/catalog";
import { href, type Locale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/ui";

export type CatalogItem = { slug: string; service: string; brands: string[]; card: ReactNode };
type Option = { id: string; label: string; count: number };

/** Filters (category, brand) kept in the URL: ?categorie=…&merk=… */
export function CatalogGrid({ lang, items, categories, brands }: { lang: Locale; items: CatalogItem[]; categories: CatalogCategory[]; brands: Option[] }) {
  const d = getDict(lang);
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const service = params.get("categorie") ?? "";
  const brand = params.get("merk") ?? "";
  const activeChip = useRef<HTMLButtonElement>(null);

  // A category arriving from a service link may sit off-screen in the scrolling chip row.
  useEffect(() => {
    activeChip.current?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [service]);

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    if (key === "categorie") next.delete("merk");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const shown = useMemo(() => items.filter((i) => (!service || i.service === service) && (!brand || i.brands.includes(brand))), [items, service, brand]);
  const brandOptions = brands.filter((b) => !service || items.some((i) => i.service === service && i.brands.includes(b.id)));
  const category = categories.find((c) => c.slug === service);
  // A category without models yet is not a dead end: it hands over to advice.
  const advice = category && category.count === 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 border-y border-line py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <span className="t-mono w-24 flex-none text-graphite">{d.catalog.service}</span>
          <div role="group" aria-label={d.catalog.service} className="-mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
            <button type="button" className="chip" aria-pressed={!service} onClick={() => set("categorie", "")}>
              {d.filters.all}
            </button>
            {categories.map((c) => (
              <button
                key={c.slug}
                ref={service === c.slug ? activeChip : undefined}
                type="button"
                className="chip"
                aria-pressed={service === c.slug}
                onClick={() => set("categorie", c.slug)}
              >
                {c.label} <span className="count">{c.count}</span>
              </button>
            ))}
          </div>
        </div>
        {brandOptions.length > 1 && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <span className="t-mono w-24 flex-none text-graphite">{d.catalog.brand}</span>
            <div role="group" aria-label={d.catalog.brand} className="-mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
              <button type="button" className="chip" aria-pressed={!brand} onClick={() => set("merk", "")}>
                {d.filters.all}
              </button>
              {brandOptions.map((b) => (
                <button key={b.id} type="button" className="chip" aria-pressed={brand === b.id} onClick={() => set("merk", b.id)}>
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {advice && category ? (
        <div className="flex max-w-[720px] flex-col items-start gap-5 rounded-[var(--radius-tile)] bg-paper p-6 sm:p-9" aria-live="polite">
          <h2 className="t-h3 text-[22px] sm:text-[26px]">{d.catalog.adviseTitle(category.label)}</h2>
          <p className="text-[16px] leading-relaxed text-slate">{d.catalog.adviseText}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
            <ButtonLink href={`${href(lang, "/offerte")}?dienst=${category.slug}`}>{d.catalog.advisePrimary}</ButtonLink>
            <Link href={href(lang, `/diensten/${category.slug}`)} className="link-arrow">
              {d.catalog.adviseSecondary(category.label)}
              <Icon name="arrow" />
            </Link>
          </div>
        </div>
      ) : shown.length === 0 ? (
        <div className="flex flex-col items-start gap-4 rounded-[var(--radius-tile)] bg-paper p-8">
          <p className="text-slate">{d.catalog.empty}</p>
          <button type="button" className="chip" onClick={() => router.replace(pathname, { scroll: false })}>
            {d.catalog.reset}
          </button>
        </div>
      ) : (
        <>
          <p className="t-mono text-graphite" aria-live="polite">
            {d.catalog.count(shown.length)}
          </p>
          <ul key={`${service}-${brand}`} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((i, n) => (
              <li key={i.slug} className="fade-up" style={{ "--d": `${Math.min(n, 8) * 40}ms` } as React.CSSProperties}>
                {i.card}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
