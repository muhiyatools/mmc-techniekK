"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import type { CatalogCategory } from "@/lib/catalog";
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";
import { href, type Locale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/ui";

export type CatalogItem = {
  slug: string;
  name: string;
  service: string;
  brands: string[];
  priceFrom: number | null;
  priceTo: number | null;
  card: ReactNode;
};
export type BrandOption = { id: string; label: string; logo: string | null; w: number; h: number };
export type PriceBounds = { min: number; max: number; step: number };

type Sort = "" | "prijs-op" | "prijs-af" | "naam";
const SORTS: Sort[] = ["", "prijs-op", "prijs-af", "naam"];

type Filters = { categorie: string; merk: string[]; min: number | null; max: number | null; onRequest: boolean; sort: Sort };

const num = (v: string | null) => {
  if (v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

function read(params: URLSearchParams): Filters {
  const sort = (params.get("sort") ?? "") as Sort;
  const min = num(params.get("min"));
  const max = num(params.get("max"));
  const ranged = min !== null || max !== null;
  return {
    categorie: params.get("categorie") ?? "",
    merk: (params.get("merk") ?? "").split(",").filter(Boolean),
    min,
    max,
    // Without a price range there is nothing to include or exclude: everything shows.
    onRequest: ranged ? params.get("opaanvraag") === "1" : true,
    sort: SORTS.includes(sort) ? sort : "",
  };
}

/** Catalog with filters in the URL: ?categorie=…&merk=a,b&min=…&max=…&opaanvraag=1&sort=… */
export function CatalogGrid({
  lang,
  items,
  categories,
  brands,
  priceBounds,
}: {
  lang: Locale;
  items: CatalogItem[];
  categories: CatalogCategory[];
  brands: BrandOption[];
  priceBounds: PriceBounds | null;
}) {
  const d = getDict(lang);
  const c = d.catalog;
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const f = useMemo(() => read(new URLSearchParams(params.toString())), [params]);
  const [sheet, setSheet] = useState(false);
  const sheetButton = useRef<HTMLButtonElement>(null);

  /** Change the URL without scrolling; empty values are removed. */
  const update = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (v === null || v === "") next.delete(k);
        else next.set(k, v);
      }
      if ("categorie" in patch) next.delete("merk");
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );

  const category = categories.find((x) => x.slug === f.categorie);
  const advice = category && category.count === 0;
  const visibleCategories = categories.filter((x) => x.count > 0);
  const brandOptions = brands.filter((b) => !f.categorie || items.some((i) => i.service === f.categorie && i.brands.includes(b.id)));

  const shown = useMemo(() => {
    const lo = f.min ?? priceBounds?.min ?? 0;
    const hi = f.max ?? priceBounds?.max ?? Infinity;
    const ranged = f.min !== null || f.max !== null;
    const list = items
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => {
        if (f.categorie && item.service !== f.categorie) return false;
        if (f.merk.length && !item.brands.some((b) => f.merk.includes(b))) return false;
        if (ranged) {
          if (item.priceFrom === null) return f.onRequest;
          const top = item.priceTo ?? item.priceFrom;
          return top >= lo && item.priceFrom <= hi;
        }
        return true;
      });
    const price = (i: CatalogItem, dir: 1 | -1) => (i.priceFrom === null ? Infinity : i.priceFrom * dir);
    if (f.sort === "prijs-op") list.sort((a, b) => price(a.item, 1) - price(b.item, 1) || a.index - b.index);
    else if (f.sort === "prijs-af") list.sort((a, b) => (a.item.priceFrom === null ? 1 : b.item.priceFrom === null ? -1 : b.item.priceFrom - a.item.priceFrom) || a.index - b.index);
    else if (f.sort === "naam") list.sort((a, b) => a.item.name.localeCompare(b.item.name, lang));
    return list.map((x) => x.item);
  }, [items, f, priceBounds, lang]);

  const ranged = f.min !== null || f.max !== null;
  const fmt = useMemo(() => new Intl.NumberFormat(lang === "nl" ? "nl-NL" : "en-GB", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }), [lang]);

  // Active filters, as removable chips.
  const chips: { key: string; label: string; remove: () => void }[] = [];
  if (category) chips.push({ key: "c", label: category.label, remove: () => update({ categorie: null }) });
  for (const id of f.merk) {
    const b = brands.find((x) => x.id === id);
    chips.push({ key: `m-${id}`, label: b?.label ?? id, remove: () => update({ merk: f.merk.filter((x) => x !== id).join(",") || null }) });
  }
  if (ranged && priceBounds) {
    const a = fmt.format(f.min ?? priceBounds.min);
    const z = fmt.format(f.max ?? priceBounds.max);
    chips.push({ key: "p", label: c.priceRange(a, z), remove: () => update({ min: null, max: null, opaanvraag: null }) });
  }
  const clearAll = () => router.replace(f.sort ? `${pathname}?sort=${f.sort}` : pathname, { scroll: false });

  const panel = (idPrefix: string) => (
    <FilterPanel
      lang={lang}
      idPrefix={idPrefix}
      f={f}
      categories={visibleCategories}
      brands={brandOptions}
      items={items}
      priceBounds={priceBounds}
      fmt={fmt}
      update={update}
    />
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10 3xl:grid-cols-[320px_minmax(0,1fr)] 3xl:gap-14">
      {/* Sidebar (desktop) */}
      <aside aria-label={c.filtersTitle} className="hidden lg:block">
        <div className="sticky top-[calc(var(--header-h)+24px)] max-h-[calc(100dvh-var(--header-h)-48px)] overflow-y-auto pr-1">{panel("side")}</div>
      </aside>

      <div className="flex min-w-0 flex-col gap-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-line pb-4">
          <p className="t-mono text-graphite" aria-live="polite">
            {c.count(advice ? 0 : shown.length)}
          </p>
          <div className="flex items-center gap-3">
            <button ref={sheetButton} type="button" className="chip lg:hidden" onClick={() => setSheet(true)} aria-haspopup="dialog">
              <Icon name="settings" size={16} />
              {c.filtersOpen(chips.length)}
            </button>
            <label className="flex items-center gap-2">
              <span className="t-mono hidden text-graphite sm:inline">{c.sort}</span>
              <select
                className="input !h-11 !w-auto !rounded-full !py-0 !pl-4 text-[15px]"
                aria-label={c.sort}
                value={f.sort}
                onChange={(e) => update({ sort: e.target.value || null })}
              >
                <option value="">{c.sortRelevance}</option>
                <option value="prijs-op">{c.sortPriceAsc}</option>
                <option value="prijs-af">{c.sortPriceDesc}</option>
                <option value="naam">{c.sortName}</option>
              </select>
            </label>
          </div>
        </div>

        {chips.length > 0 && (
          <ul className="flex flex-wrap items-center gap-2" aria-label={c.activeFilters}>
            {chips.map((chip) => (
              <li key={chip.key}>
                <button type="button" className="chip !min-h-9 !pl-4 !pr-3 text-[14px]" aria-label={c.removeFilter(chip.label)} onClick={chip.remove}>
                  {chip.label}
                  <Icon name="close" size={14} />
                </button>
              </li>
            ))}
            <li>
              <button type="button" className="link-arrow !min-h-9 px-2 text-[14px]" onClick={clearAll}>
                {c.clearAll}
              </button>
            </li>
          </ul>
        )}

        {advice && category ? (
          // A category without models yet is not a dead end: it hands over to advice.
          <div className="flex max-w-[720px] flex-col items-start gap-5 rounded-[var(--radius-tile)] bg-paper p-6 sm:p-9">
            <h2 className="t-h3 text-[22px] sm:text-[26px]">{c.adviseTitle(category.label)}</h2>
            <p className="text-[16px] leading-relaxed text-slate">{c.adviseText}</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
              <ButtonLink href={`${href(lang, "/offerte")}?dienst=${category.slug}`}>{c.advisePrimary}</ButtonLink>
              <Link href={href(lang, `/diensten/${category.slug}`)} className="link-arrow">
                {c.adviseSecondary(category.label)}
                <Icon name="arrow" />
              </Link>
            </div>
          </div>
        ) : shown.length === 0 ? (
          <div className="flex flex-col items-start gap-4 rounded-[var(--radius-tile)] bg-paper p-8">
            <p className="text-slate">{c.empty}</p>
            <button type="button" className="chip" onClick={clearAll}>
              {c.reset}
            </button>
          </div>
        ) : (
          <ul key={`${f.categorie}|${f.merk.join()}|${f.min}|${f.max}|${f.onRequest}|${f.sort}`} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4">
            {shown.map((i, n) => (
              <li key={i.slug} className="fade-up" style={{ "--d": `${Math.min(n, 8) * 40}ms` } as React.CSSProperties}>
                {i.card}
              </li>
            ))}
          </ul>
        )}
      </div>

      {sheet && (
        <Sheet
          title={c.filtersTitle}
          closeLabel={c.closeFilters}
          onClose={() => {
            setSheet(false);
            sheetButton.current?.focus();
          }}
          footer={
            <button
              type="button"
              className="btn btn-primary w-full justify-center"
              onClick={() => {
                setSheet(false);
                sheetButton.current?.focus();
              }}
            >
              {c.showResults(advice ? 0 : shown.length)}
            </button>
          }
        >
          {panel("sheet")}
        </Sheet>
      )}
    </div>
  );
}

/** Bottom sheet with a focus trap, Esc to close, and safe-area padding. */
function Sheet({ title, closeLabel, onClose, footer, children }: { title: string; closeLabel: string; onClose: () => void; footer: ReactNode; children: ReactNode }) {
  const ref = useFocusTrap<HTMLDivElement>(true, onClose);
  const titleId = useId();
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="sheet-backdrop absolute inset-0 bg-ink/50" onClick={onClose} aria-hidden="true" />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="sheet absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-[var(--radius-panel)] bg-white shadow-[var(--shadow-sheet)] outline-none"
      >
        <div className="flex flex-none items-center justify-between px-5 pb-2 pt-5 sm:px-8">
          <h2 id={titleId} className="t-h3 text-[22px]">
            {title}
          </h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label={closeLabel} data-autofocus>
            <Icon name="close" size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-8">{children}</div>
        <div className="flex-none border-t border-line bg-white px-5 pb-[calc(16px+var(--safe-bottom))] pt-4 sm:px-8">{footer}</div>
      </div>
    </div>
  );
}

function FilterPanel({
  lang,
  idPrefix,
  f,
  categories,
  brands,
  items,
  priceBounds,
  fmt,
  update,
}: {
  lang: Locale;
  idPrefix: string;
  f: Filters;
  categories: CatalogCategory[];
  brands: BrandOption[];
  items: CatalogItem[];
  priceBounds: PriceBounds | null;
  fmt: Intl.NumberFormat;
  update: (patch: Record<string, string | null>) => void;
}) {
  const c = getDict(lang).catalog;
  const total = items.length;
  const toggleBrand = (id: string) => {
    const next = f.merk.includes(id) ? f.merk.filter((x) => x !== id) : [...f.merk, id];
    update({ merk: next.join(",") || null });
  };
  const rowBase =
    "flex min-h-12 w-full items-center gap-3 rounded-[var(--radius-sm)] px-3 text-left text-[15px] font-medium text-ink transition-[background-color,box-shadow,color] duration-[var(--dur-fast)] ease-[var(--ease-out)] hover:bg-paper";
  const rowOn = "!bg-sky !text-blue-deep shadow-[inset_0_0_0_1.5px_var(--color-blue)]";

  return (
    <div className="flex flex-col gap-8">
      {/* Category */}
      <fieldset className="flex flex-col gap-2">
        <legend className="t-mono mb-2 text-graphite">{c.service}</legend>
        <button type="button" className={`${rowBase} ${!f.categorie ? rowOn : ""}`} aria-pressed={!f.categorie} onClick={() => update({ categorie: null })}>
          <Icon name="grid" size={20} />
          <span className="flex-1">{c.allCategories}</span>
          <span className="t-mono text-graphite">{total}</span>
        </button>
        {categories.map((cat) => {
          const on = f.categorie === cat.slug;
          return (
            <button key={cat.slug} type="button" className={`${rowBase} ${on ? rowOn : ""}`} aria-pressed={on} onClick={() => update({ categorie: on ? null : cat.slug })}>
              <Icon name={cat.slug as IconName} size={20} />
              <span className="flex-1">{cat.label}</span>
              <span className="t-mono text-graphite">{cat.count}</span>
            </button>
          );
        })}
      </fieldset>

      {/* Brand */}
      {brands.length > 1 && (
        <fieldset className="flex flex-col gap-3">
          <legend className="t-mono mb-3 text-graphite">{c.brand}</legend>
          <div className="grid grid-cols-3 gap-2">
            {brands.map((b) => {
              const on = f.merk.includes(b.id);
              return (
                <button
                  key={b.id}
                  type="button"
                  aria-pressed={on}
                  aria-label={b.label}
                  title={b.label}
                  onClick={() => toggleBrand(b.id)}
                  className={`group grid h-16 place-items-center rounded-[var(--radius-sm)] px-2 shadow-[inset_0_0_0_1.5px_var(--color-line-strong)] transition-[background-color,box-shadow] duration-[var(--dur-fast)] ease-[var(--ease-out)] hover:shadow-[inset_0_0_0_1.5px_var(--color-ink)] ${
                    on ? "!bg-sky !shadow-[inset_0_0_0_2px_var(--color-blue)]" : "bg-white"
                  }`}
                >
                  {b.logo ? (
                    <Image
                      src={b.logo}
                      alt=""
                      width={b.w * 2}
                      height={b.h * 2}
                      className={`transition-opacity duration-[var(--dur-fast)] ${on ? "opacity-100" : "opacity-60 group-hover:opacity-100"}`}
                      style={{ width: b.w, height: "auto", maxWidth: "100%" }}
                    />
                  ) : (
                    <span className="t-mono text-center text-[10px] leading-tight text-slate">{b.label}</span>
                  )}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {/* Price */}
      {priceBounds && (
        <PriceSlider
          key={`${priceBounds.min}-${priceBounds.max}-${f.min}-${f.max}-${f.onRequest}`}
          idPrefix={idPrefix}
          lang={lang}
          bounds={priceBounds}
          min={f.min ?? priceBounds.min}
          max={f.max ?? priceBounds.max}
          onRequest={f.onRequest}
          ranged={f.min !== null || f.max !== null}
          fmt={fmt}
          update={update}
        />
      )}
    </div>
  );
}

/** Two native range inputs on one track. The URL is updated once the thumbs rest. */
function PriceSlider({
  idPrefix,
  lang,
  bounds,
  min,
  max,
  onRequest,
  ranged,
  fmt,
  update,
}: {
  idPrefix: string;
  lang: Locale;
  bounds: PriceBounds;
  min: number;
  max: number;
  onRequest: boolean;
  ranged: boolean;
  fmt: Intl.NumberFormat;
  update: (patch: Record<string, string | null>) => void;
}) {
  const c = getDict(lang).catalog;
  const [lo, setLo] = useState(min);
  const [hi, setHi] = useState(max);
  const [checked, setChecked] = useState(onRequest);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const span = bounds.max - bounds.min || 1;
  const pct = (v: number) => ((v - bounds.min) / span) * 100;

  const commit = (a: number, b: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const full = a <= bounds.min && b >= bounds.max;
      update(full ? { min: null, max: null, opaanvraag: null } : { min: String(a), max: String(b), opaanvraag: onRequest || !ranged ? "1" : null });
    }, 250);
  };
  useEffect(() => () => clearTimeout(timer.current), []);

  const toggleId = `${idPrefix}-onrequest`;
  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="t-mono mb-3 text-graphite">{c.priceTitle}</legend>
      <p className="t-num text-[17px] tabular-nums" aria-live="polite">
        {fmt.format(lo)} <span className="text-graphite">–</span> {fmt.format(hi)}
      </p>
      <div className="range-dual">
        <div className="track">
          <div className="fill" style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }} />
        </div>
        <input
          type="range"
          aria-label={c.priceMin}
          aria-valuetext={fmt.format(lo)}
          min={bounds.min}
          max={bounds.max}
          step={bounds.step}
          value={lo}
          onChange={(e) => {
            const v = Math.min(Number(e.target.value), hi - bounds.step);
            setLo(v);
            commit(v, hi);
          }}
        />
        <input
          type="range"
          aria-label={c.priceMax}
          aria-valuetext={fmt.format(hi)}
          min={bounds.min}
          max={bounds.max}
          step={bounds.step}
          value={hi}
          onChange={(e) => {
            const v = Math.max(Number(e.target.value), lo + bounds.step);
            setHi(v);
            commit(lo, v);
          }}
        />
      </div>
      <label htmlFor={toggleId} className={`flex items-start gap-3 ${ranged ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}>
        <input
          id={toggleId}
          type="checkbox"
          className="mt-0.5 size-5 flex-none accent-blue"
          checked={checked}
          disabled={!ranged}
          onChange={(e) => {
            setChecked(e.target.checked);
            update({ opaanvraag: e.target.checked ? "1" : null });
          }}
        />
        <span className="flex flex-col gap-0.5">
          <span className="text-[15px] font-medium">{c.priceToggle}</span>
          <span className="text-[13px] leading-snug text-graphite">{c.priceToggleHint}</span>
        </span>
      </label>
    </fieldset>
  );
}
