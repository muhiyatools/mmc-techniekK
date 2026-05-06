"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { services, brandImages } from "@/lib/data";
import Reveal from "../components/Reveal";
import BrandLogo from "../components/BrandLogo";

type FlatProduct = {
  name: string;
  brand: string;
  price: string | null;
  priceMin: number | null;
  priceMax: number | null;
  description: string;
  techSpecs: string[];
  image: string;
  serviceSlug: string;
  serviceTitle: string;
};

const allProducts: FlatProduct[] = services.flatMap((s) =>
  s.products.map((p) => ({
    ...p,
    serviceSlug: s.slug,
    serviceTitle: s.title,
  }))
);

const allBrands = Array.from(new Set(allProducts.map((p) => p.brand))).sort();
const servicesWithProducts = services.filter((s) => s.products.length > 0);

const minPrice = Math.min(...allProducts.filter((p) => p.priceMin !== null).map((p) => p.priceMin!));
const maxPrice = Math.max(...allProducts.filter((p) => p.priceMax !== null).map((p) => p.priceMax!));

export default function ProductenPage() {
  const [activeService, setActiveService] = useState<string | null>(null);
  const [activeBrands, setActiveBrands] = useState<Set<string>>(new Set());
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);

  const toggleBrand = (brand: string) => {
    setActiveBrands((prev) => {
      const next = new Set(prev);
      if (next.has(brand)) next.delete(brand);
      else next.add(brand);
      return next;
    });
  };

  const clearFilters = () => {
    setActiveService(null);
    setActiveBrands(new Set());
    setPriceRange([minPrice, maxPrice]);
  };

  const hasFilters = activeService !== null || activeBrands.size > 0 || priceRange[0] > minPrice || priceRange[1] < maxPrice;

  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      if (activeService && p.serviceSlug !== activeService) return false;
      if (activeBrands.size > 0 && !activeBrands.has(p.brand)) return false;
      if (p.priceMin !== null && p.priceMin > priceRange[1]) return false;
      if (p.priceMax !== null && p.priceMax < priceRange[0]) return false;
      return true;
    });
  }, [activeService, activeBrands, priceRange]);

  const activeServiceTitle = activeService
    ? services.find((s) => s.slug === activeService)?.title ?? ""
    : "Alle producten";

  return (
    <>
      {/* Hero */}
      <section className="pt-[70px] lg:pt-[114px] bg-base">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-10 lg:py-14">
          <Reveal>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Producten</span>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display font-extrabold text-[clamp(2rem,4vw,3.5rem)] leading-[0.95] tracking-tight text-ink mb-3">
              Ons assortiment
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-base text-muted leading-relaxed max-w-lg">
              Kwalitatieve producten van A-merken, professioneel geïnstalleerd door onze eigen monteurs.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Main content with sidebar */}
      <section className="pb-24 lg:pb-32 bg-base">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
            
            {/* Sidebar Filters */}
            <aside className="lg:w-[260px] shrink-0">
              <div className="lg:sticky lg:top-[130px] space-y-6">
                
                {/* Filters header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-ink uppercase tracking-wide">Filters</h2>
                  {hasFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-xs font-bold text-brand hover:text-brand-deep transition-colors"
                    >
                      Wis alles
                    </button>
                  )}
                </div>

                {/* Service Categories */}
                <div className="bg-white border border-hairline p-5">
                  <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-ink mb-4">Categorieën</h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => setActiveService(null)}
                      className={`w-full text-left px-3 py-2 text-sm font-semibold rounded transition-colors ${
                        activeService === null
                          ? "bg-brand text-white"
                          : "text-muted hover:bg-concrete hover:text-ink"
                      }`}
                    >
                      Alle categorieën
                    </button>
                    {servicesWithProducts.map((s) => (
                      <button
                        key={s.slug}
                        onClick={() => setActiveService(activeService === s.slug ? null : s.slug)}
                        className={`w-full text-left px-3 py-2 text-sm font-semibold rounded transition-colors ${
                          activeService === s.slug
                            ? "bg-brand text-white"
                            : "text-muted hover:bg-concrete hover:text-ink"
                        }`}
                      >
                        {s.title}
                        <span className="ml-1.5 text-[0.7rem] opacity-60">({s.products.length})</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div className="bg-white border border-hairline p-5">
                  <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-ink mb-4">Alle merken</h3>
                  <div className="space-y-2">
                    {allBrands.map((brand) => (
                      <label
                        key={brand}
                        className="flex items-center gap-2.5 cursor-pointer group"
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={activeBrands.has(brand)}
                            onChange={() => toggleBrand(brand)}
                            className="peer sr-only"
                          />
                          <div className="w-4 h-4 border border-hairline bg-white peer-checked:bg-brand peer-checked:border-brand transition-colors rounded-sm flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                        <span className="text-sm text-muted group-hover:text-ink transition-colors">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="bg-white border border-hairline p-5">
                  <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-ink mb-4">Prijs</h3>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min={minPrice}
                      max={maxPrice}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full accent-brand"
                    />
                    <div className="flex items-center justify-between text-xs text-muted">
                      <span>€{priceRange[0].toLocaleString("nl-NL")}</span>
                      <span>€{priceRange[1].toLocaleString("nl-NL")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="mb-6">
                <h2 className="font-display text-xl font-extrabold text-ink mb-1">{activeServiceTitle}</h2>
                <p className="text-sm text-muted">
                  <span className="font-semibold text-ink">{filteredProducts.length}</span>{" "}
                  {filteredProducts.length === 1 ? "product" : "producten"} gevonden
                </p>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-white border border-hairline">
                  <div className="w-14 h-14 rounded-full bg-concrete border border-hairline flex items-center justify-center mx-auto mb-5">
                    <svg className="w-6 h-6 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <p className="text-lg font-bold text-ink mb-2">Geen producten gevonden</p>
                  <p className="text-muted mb-6 text-sm">Pas de filters aan voor meer resultaten.</p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2.5 bg-brand text-white text-sm font-bold rounded-full hover:bg-brand-deep transition-colors"
                  >
                    Wis alle filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredProducts.map((product) => (
                    <div
                      key={`${product.serviceSlug}-${product.name}`}
                      className="group bg-white border border-hairline hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5 transition-all duration-300 overflow-hidden flex flex-col"
                    >
                      {/* Image */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-concrete shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          unoptimized
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-1">
                        {/* Brand */}
                        <div className="mb-2 h-5 flex items-center">
                          <BrandLogo
                            brand={product.brand}
                            imageSrc={brandImages[product.brand] ?? ""}
                            height={18}
                          />
                        </div>

                        {/* Name */}
                        <h3 className="text-sm font-bold text-ink leading-snug mb-2 group-hover:text-brand transition-colors">
                          {product.name}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-muted leading-relaxed mb-3 line-clamp-2">
                          {product.description}
                        </p>

                        {/* Tech Specs */}
                        <ul className="space-y-1 mb-4">
                          {product.techSpecs.slice(0, 3).map((spec, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-copy">
                              <svg className="w-3 h-3 text-brand shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                              {spec}
                            </li>
                          ))}
                        </ul>

                        {/* Price + CTA */}
                        <div className="mt-auto flex items-center justify-between gap-3 pt-4 border-t border-hairline">
                          {product.price ? (
                            <span className="text-sm font-extrabold text-ink tabular-nums">
                              {product.price}
                            </span>
                          ) : (
                            <span className="text-xs text-muted italic">Prijs op aanvraag</span>
                          )}
                          <Link
                            href={`/contact?service=${product.serviceSlug}&product=${encodeURIComponent(product.name)}`}
                            className="shrink-0 px-4 py-2.5 bg-brand text-white text-xs font-bold rounded-full hover:bg-brand-deep transition-colors shadow-sm shadow-brand/20"
                          >
                            Offerte aanvragen
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
