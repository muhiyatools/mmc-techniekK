"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  services,
  productCategories,
  priceTierLabels,
  type Product,
  type PriceTier,
} from "@/lib/data";
import Reveal from "../components/Reveal";

type FlatProduct = Product & { serviceSlug: string; serviceTitle: string };

const allProducts: FlatProduct[] = services.flatMap((s) =>
  s.products.map((p) => ({ ...p, serviceSlug: s.slug, serviceTitle: s.title }))
);

const allBrands = Array.from(new Set(allProducts.map((p) => p.brand))).sort();

const tierBadgeClasses: Record<PriceTier, string> = {
  economy: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border border-amber-200",
  premium: "bg-violet-50 text-violet-700 border border-violet-200",
};

export default function ProductenPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTiers, setActiveTiers] = useState<Set<PriceTier>>(new Set());
  const [activeBrand, setActiveBrand] = useState<string | null>(null);

  const toggleTier = (tier: PriceTier) => {
    setActiveTiers((prev) => {
      const next = new Set(prev);
      if (next.has(tier)) next.delete(tier);
      else next.add(tier);
      return next;
    });
  };

  const clearFilters = () => {
    setActiveCategory(null);
    setActiveTiers(new Set());
    setActiveBrand(null);
  };

  const hasFilters = activeCategory !== null || activeTiers.size > 0 || activeBrand !== null;

  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      if (activeCategory && p.categoryId !== activeCategory) return false;
      if (activeTiers.size > 0 && !activeTiers.has(p.tier)) return false;
      if (activeBrand && p.brand !== activeBrand) return false;
      return true;
    });
  }, [activeCategory, activeTiers, activeBrand]);

  return (
    <>
      {/* Hero */}
      <section className="pt-[70px] lg:pt-[114px] bg-base">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-12 lg:py-16">
          <Reveal>
            <div className="flex items-center gap-2.5 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
                Producten
              </span>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display font-extrabold text-[clamp(2.5rem,5vw,4rem)] leading-[0.92] tracking-tight text-ink mb-4">
              Ons productassortiment
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-lg text-muted leading-relaxed max-w-xl">
              Hoogwaardige merken voor airconditioning, zonnepanelen, warmtepompen en meer.
              Geleverd en geïnstalleerd op maat in de regio Utrecht.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Filter bar */}
      <div className="sticky top-[70px] lg:top-[114px] z-30 bg-white border-b border-hairline shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-2 py-3.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {/* Category chips */}
            <button
              onClick={() => setActiveCategory(null)}
              className={`shrink-0 px-4 py-1.5 text-xs font-bold rounded-full border transition-all duration-150 ${
                activeCategory === null
                  ? "bg-brand border-brand text-white"
                  : "border-hairline text-muted hover:border-brand/40 hover:text-ink"
              }`}
            >
              Alle
            </button>
            {productCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() =>
                  setActiveCategory(activeCategory === cat.id ? null : cat.id)
                }
                className={`shrink-0 px-4 py-1.5 text-xs font-bold rounded-full border transition-all duration-150 ${
                  activeCategory === cat.id
                    ? "bg-brand border-brand text-white"
                    : "border-hairline text-muted hover:border-brand/40 hover:text-ink"
                }`}
              >
                {cat.label}
              </button>
            ))}

            {/* Divider */}
            <div className="w-px h-4 bg-hairline shrink-0 mx-1" />

            {/* Tier toggles */}
            {(["economy", "medium", "premium"] as PriceTier[]).map((tier) => (
              <button
                key={tier}
                onClick={() => toggleTier(tier)}
                className={`shrink-0 px-3 py-1.5 text-xs font-bold rounded-full border transition-all duration-150 ${
                  activeTiers.has(tier)
                    ? tier === "economy"
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : tier === "medium"
                      ? "bg-amber-500 border-amber-500 text-white"
                      : "bg-violet-500 border-violet-500 text-white"
                    : "border-hairline text-muted hover:border-brand/40 hover:text-ink"
                }`}
              >
                {priceTierLabels[tier]}
              </button>
            ))}

            {/* Spacer */}
            <div className="flex-1 min-w-4" />

            {/* Brand select */}
            <div className="relative shrink-0">
              <select
                value={activeBrand || ""}
                onChange={(e) => setActiveBrand(e.target.value || null)}
                className="appearance-none pl-3 pr-7 py-1.5 text-xs font-semibold border border-hairline rounded-full bg-white text-ink focus:outline-none focus:border-brand cursor-pointer"
              >
                <option value="">Alle merken</option>
                {allBrands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <svg
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {/* Clear filters */}
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-muted hover:text-ink border border-dashed border-hairline hover:border-ink/30 rounded-full transition-all duration-150"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Wis filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product grid */}
      <section className="bg-base pb-24 lg:pb-32">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          {/* Count row */}
          <div className="py-5">
            <p className="text-sm text-muted">
              <span className="font-bold text-ink">{filteredProducts.length}</span>{" "}
              {filteredProducts.length === 1 ? "product" : "producten"} gevonden
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-16 h-16 rounded-full bg-concrete border border-hairline flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-7 h-7 text-muted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <p className="text-xl font-bold text-ink mb-2">Geen producten gevonden</p>
              <p className="text-muted mb-8">Pas de filters aan voor meer resultaten.</p>
              <button
                onClick={clearFilters}
                className="px-7 py-3 bg-brand text-white text-sm font-bold rounded-full hover:bg-brand-deep transition-colors"
              >
                Wis alle filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
              {filteredProducts.map((p) => {
                const categoryLabel =
                  productCategories.find((c) => c.id === p.categoryId)?.label ?? "";
                return (
                  <div
                    key={`${p.categoryId}-${p.name}`}
                    className="group bg-white border border-hairline hover:border-brand/25 hover:shadow-xl hover:shadow-brand/5 transition-all duration-300 overflow-hidden flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-concrete shrink-0">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                        sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider rounded-full ${tierBadgeClasses[p.tier]}`}
                        >
                          {priceTierLabels[p.tier]}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 lg:p-5 flex flex-col flex-1">
                      <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-brand mb-1">
                        {categoryLabel}
                      </p>
                      <h3 className="text-sm font-bold text-ink leading-snug mb-0.5">
                        {p.name}
                      </h3>
                      <p className="text-xs text-muted mb-3">{p.brand}</p>
                      <p className="text-xs text-copy leading-relaxed line-clamp-2 mb-4 flex-1">
                        {p.description}
                      </p>

                      {/* Price + CTA */}
                      <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-hairline/60">
                        {p.price ? (
                          <span className="text-sm font-extrabold text-ink tabular-nums">
                            {p.price}
                          </span>
                        ) : (
                          <span className="text-xs text-muted italic">Op aanvraag</span>
                        )}
                        <Link
                          href={`/contact?service=${p.categoryId}&product=${encodeURIComponent(p.name)}`}
                          className="shrink-0 px-3.5 py-2 bg-brand text-white text-[0.7rem] font-bold rounded-full hover:bg-brand-deep transition-colors shadow-sm shadow-brand/20"
                        >
                          Offerte
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
