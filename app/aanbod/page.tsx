"use client";

import { useState, useMemo, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { services as baseServices, brandImages as baseBrandImages, type Service, type Product } from "@/lib/data";
import { fetchAdminStore, mergeServices, mergeBrandImages } from "@/lib/adminStore";
import Reveal from "../components/Reveal";
import BrandLogo from "../components/BrandLogo";
import { resolveProductImage } from "@/lib/images";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// ── Service icons ──
const serviceIcons: Record<string, React.ReactNode> = {
  airconditioning: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 3v3m0 12v3M3 12h3m12 0h3m-4.22-6.78-2.12 2.12M10.34 13.66l-2.12 2.12M18.78 18.78l-2.12-2.12M7.46 7.46 5.34 5.34M12 9a3 3 0 100 6 3 3 0 000-6z" />
    </svg>
  ),
  zonnepanelen: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  ),
  batterijopslag: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M3.75 18h15A2.25 2.25 0 0021 15.75v-1.5a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 001.5 14.25v1.5A2.25 2.25 0 003.75 18zM3.75 6h15A2.25 2.25 0 0121 8.25v1.5a2.25 2.25 0 01-2.25 2.25h-15A2.25 2.25 0 011.5 9.75v-1.5A2.25 2.25 0 013.75 6z" />
    </svg>
  ),
  warmtepompen: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 18a3.75 3.75 0 00.495-7.468 5.99 5.99 0 00-1.925 3.547 5.975 5.975 0 01-2.133-1.001A3.75 3.75 0 0012 18z" />
    </svg>
  ),
  vloerverwarming: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
    </svg>
  ),
  "meterkast-liften": (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  ),
  onderhoud: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437" />
    </svg>
  ),
  renovaties: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
    </svg>
  ),
};

// ── Price slider ──
const SLIDER_MIN = 0;
const SLIDER_MAX = 20000;
const SLIDER_STEP = 500;

function PriceRangeSlider({ value, onChange }: { value: [number, number]; onChange: (v: [number, number]) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<"min" | "max" | null>(null);

  const getPct = (v: number) => ((v - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100;
  const getVal = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return SLIDER_MIN;
    const rect = el.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round((SLIDER_MIN + pct * (SLIDER_MAX - SLIDER_MIN)) / SLIDER_STEP) * SLIDER_STEP;
  };

  useEffect(() => {
    if (!dragging) return;
    const move = (e: MouseEvent) => {
      const raw = getVal(e.clientX);
      if (dragging === "min") onChange([Math.min(raw, value[1] - SLIDER_STEP), value[1]]);
      else onChange([value[0], Math.max(raw, value[0] + SLIDER_STEP)]);
    };
    const up = () => setDragging(null);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
  }, [dragging, value, onChange]);

  const fmt = (n: number) => n >= 1000 ? `€${(n / 1000).toFixed(0)}k` : `€${n}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-ink tabular-nums">{fmt(value[0])}</span>
        <span className="text-xs font-bold text-ink tabular-nums">{fmt(value[1])}</span>
      </div>
      <div ref={trackRef} className="relative h-2 bg-hairline rounded-full cursor-pointer">
        <div className="absolute top-0 h-full bg-brand rounded-full" style={{ left: `${getPct(value[0])}%`, right: `${100 - getPct(value[1])}%` }} />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-brand border-2 border-white rounded-full shadow cursor-pointer hover:scale-110 transition-transform"
          style={{ left: `${getPct(value[0])}%` }}
          onMouseDown={(e) => { e.preventDefault(); setDragging("min"); }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-brand border-2 border-white rounded-full shadow cursor-pointer hover:scale-110 transition-transform"
          style={{ left: `${getPct(value[1])}%` }}
          onMouseDown={(e) => { e.preventDefault(); setDragging("max"); }}
        />
      </div>
    </div>
  );
}

// ── Sidebar ──
function Sidebar({
  activeSlug,
  priceRange,
  selectedBrands,
  brands,
  brandImages,
  onCategorySelect,
  onPriceChange,
  onBrandToggle,
  onResetFilters,
  showFilters,
}: {
  activeSlug: string | null;
  priceRange: [number, number];
  selectedBrands: string[];
  brands: string[];
  brandImages: Record<string, string>;
  onCategorySelect: (slug: string) => void;
  onPriceChange: (v: [number, number]) => void;
  onBrandToggle: (brand: string) => void;
  onResetFilters: () => void;
  showFilters: boolean;
}) {
  const { t } = useLanguage();
  const sidebarTitleMap: Record<string, string> = {};
  baseServices.forEach((s, i) => { sidebarTitleMap[s.slug] = t.sections.services.items[i]?.title || s.title; });
  const hasFilters = selectedBrands.length > 0 || priceRange[0] > SLIDER_MIN || priceRange[1] < SLIDER_MAX;
  return (
    <div>
      <div className="mb-6">
        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-muted mb-3">{t.pages.aanbod.sidebar.categories}</p>
        <ul className="space-y-0.5">
          {baseServices.map((service) => (
            <li key={service.slug}>
              <button
                onClick={() => onCategorySelect(service.slug)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm rounded-xl border transition-all duration-200 ${
                  activeSlug === service.slug
                    ? "bg-brand/8 text-brand font-semibold border-brand/20"
                    : "text-ink font-medium border-transparent hover:bg-concrete"
                }`}
              >
                <span className={`shrink-0 ${activeSlug === service.slug ? "text-brand" : "text-muted"}`}>
                  {serviceIcons[service.slug]}
                </span>
                <span className="flex-1 leading-tight">{sidebarTitleMap[service.slug]}</span>
                {service.products && service.products.length > 0 && (
                  <span className={`text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full tabular-nums shrink-0 ${activeSlug === service.slug ? "bg-brand/15 text-brand" : "bg-concrete text-muted"}`}>
                    {service.products.length}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {showFilters && (
        <>
          <div className="h-px bg-hairline mb-6" />

          <div className="mb-6">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-muted mb-3">{t.pages.aanbod.priceRange}</p>
            <PriceRangeSlider value={priceRange} onChange={onPriceChange} />
          </div>

          {brands.length > 0 && (
            <div className="mb-4">
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-muted mb-3">{t.pages.aanbod.sidebar.manufacturer}</p>
              <div className="space-y-2">
                {brands.map((brand) => {
                  const active = selectedBrands.includes(brand);
                  const logo = brandImages[brand];
                  return (
                    <button
                      key={`sidebar-brand-${brand}`}
                      onClick={() => onBrandToggle(brand)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all duration-200 ${
                        active ? "bg-brand/8 border-brand/20" : "border-hairline hover:border-brand/20 hover:bg-concrete"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${active ? "bg-brand border-brand" : "border-muted/40"}`}>
                        {active && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="min-w-0 flex items-center gap-2">
                        <BrandLogo brand={brand} imageSrc={logo || ""} height={18} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {hasFilters && (
            <button onClick={onResetFilters} className="mt-3 text-xs font-semibold text-brand hover:text-brand-deep transition-colors">
              {t.pages.aanbod.clearFilters}
            </button>
          )}
        </>
      )}
    </div>
  );
}

// ── Main content ──
function AanbodContent() {
  const { t } = useLanguage();
  const serviceTitleMap = useMemo(() => {
    const map: Record<string, string> = {};
    baseServices.forEach((s, i) => { map[s.slug] = t.sections.services.items[i]?.title || s.title; });
    return map;
  }, []);
  const serviceCaptionMap = useMemo(() => {
    const map: Record<string, string> = {};
    baseServices.forEach((s, i) => { map[s.slug] = t.sections.services.items[i]?.caption || s.caption; });
    return map;
  }, []);
  const searchParams = useSearchParams();
  const initialDienst = searchParams.get("dienst");

  const [services, setServices] = useState<Service[]>(baseServices);
  const [brandImages, setBrandImages] = useState<Record<string, string>>(baseBrandImages);
  const [activeSlug, setActiveSlug] = useState<string | null>(
    baseServices.find((s) => s.slug === initialDienst) ? initialDienst : null
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([SLIDER_MIN, SLIDER_MAX]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    fetchAdminStore()
      .then((store) => {
        setServices(mergeServices(store));
        setBrandImages(mergeBrandImages(store));
      })
      .catch(() => {
        // Supabase not configured, use base data
      });
  }, []);

  const activeService = services.find((s) => s.slug === activeSlug) ?? null;
  const showFilters = !!(activeService && activeService.products.length > 0);

  const availableBrands = useMemo(() => {
    if (!activeService) return [];
    const set = new Set<string>();
    activeService.products.forEach((p) => set.add(p.brand));
    return Array.from(set).sort();
  }, [activeService]);

  const filteredProducts = useMemo(() => {
    if (!activeService) return [];
    if (!activeService.products || activeService.products.length === 0) return [];
    return activeService.products.filter((p) => {
      if (selectedBrands.length > 0 && p.brand && !selectedBrands.includes(p.brand)) return false;
      if (p.price) {
        const matches = String(p.price).match(/[\d.,]+/g);
        if (matches) {
          const nums = matches.map(m => parseInt(m.replace(/[.,]/g, ""), 10)).filter(n => !isNaN(n) && n !== 0);
          const minPrice = nums[0];
          const maxPrice = nums.length > 1 ? nums[nums.length - 1] : minPrice;
          if (minPrice < priceRange[0] || maxPrice > priceRange[1]) return false;
        }
      }
      return true;
    });
  }, [activeService, selectedBrands, priceRange]);

  const handleCategorySelect = (slug: string) => {
    const next = activeSlug === slug ? null : slug;
    setActiveSlug(next);
    setSelectedBrands([]);
    setPriceRange([SLIDER_MIN, SLIDER_MAX]);
  };

  const handleResetFilters = () => {
    setSelectedBrands([]);
    setPriceRange([SLIDER_MIN, SLIDER_MAX]);
  };

  return (
    <>
      {/* Hero */}
      <section className="pt-[70px] lg:pt-[114px] bg-base border-b border-hairline">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8 lg:py-10">
          <Reveal>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-brand" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted">{t.pages.aanbod.label}</span>
            </div>
          </Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <Reveal delay={60}>
              <h1 className="font-display font-extrabold text-[clamp(1.75rem,3.5vw,3rem)] leading-[0.95] tracking-tight text-ink"
                dangerouslySetInnerHTML={{ __html: t.pages.aanbod.title.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
              />
            </Reveal>
            <Reveal delay={120}>
              <p className="text-sm text-muted leading-relaxed max-w-xs sm:text-right">
                {t.pages.aanbod.description}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="bg-base">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 instrument-layout">
          {/* Refined Sidebar */}
          <aside className="hidden lg:block">
            <div className="sidebar-panel">
              <div className="mb-10">
                <h3 className="text-xl font-display font-bold text-ink uppercase tracking-tight mb-6">{t.pages.aanbod.sidebar.catalog}</h3>
                <div className="minimal-list space-y-2">
                  {services.map(s => (
                    <button 
                      key={s.slug} 
                      onClick={() => handleCategorySelect(s.slug)}
                      className={`minimal-btn ${activeSlug === s.slug ? 'active' : ''}`}
                    >
                      <span className="icon">{serviceIcons[s.slug]}</span>
                      <span>{serviceTitleMap[s.slug]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-hairline mb-10" />

              <div className="mb-10">
                <p className="text-[0.625rem] font-bold uppercase tracking-[0.24em] text-muted mb-4">{t.pages.aanbod.sidebar.budgetRange}</p>
                {showFilters && <PriceRangeSlider value={priceRange} onChange={setPriceRange} />}
                {!showFilters && (
                  <div className="flex items-center gap-4 text-xs font-bold text-ink mb-2">
                    <span>€0</span>
                    <div className="flex-1 h-px bg-hairline relative">
                      <div className="absolute top-1/2 left-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brand" />
                    </div>
                    <span>€20k</span>
                  </div>
                )}
              </div>

              {availableBrands.length > 0 && (
                <div>
                  <p className="text-[0.625rem] font-bold uppercase tracking-[0.24em] text-muted mb-4">{t.pages.aanbod.sidebar.manufacturer}</p>
                  <div className="flex flex-wrap gap-2">
                    {availableBrands.map(brand => (
                      <button 
                        key={brand}
                        onClick={() => setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand])}
                        className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all duration-200 flex items-center gap-1.5 ${selectedBrands.includes(brand) ? 'bg-brand text-white border-brand' : 'bg-concrete text-muted border-transparent hover:bg-brand/10 hover:text-brand'}`}
                      >
                        <BrandLogo brand={brand} imageSrc={brandImages[brand] ?? ""} height={14} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {activeSlug && activeService ? (
              <>
                <div className="compact-service-header">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <p className="text-[0.625rem] font-bold uppercase tracking-[0.24em] text-muted mb-1">{serviceTitleMap[activeService.slug]}</p>
                      <h2 className="font-display font-bold text-3xl lg:text-4xl text-ink leading-tight tracking-tight uppercase">
                        {serviceCaptionMap[activeService.slug]}
                      </h2>
                    </div>
                    <Link href={`/contact?service=${activeService.slug}`} className="px-6 py-3 bg-ink text-base text-[0.6875rem] font-bold uppercase tracking-[0.18em] rounded-full hover:bg-brand transition-colors text-center">
                      {t.pages.aanbod.requestQuote}
                    </Link>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-8 border-b border-hairline pb-4">
                  <div className="flex items-center gap-4">
                    <p className="text-xs font-bold text-ink uppercase tracking-widest">
                      {filteredProducts.length} {t.pages.aanbod.results}
                    </p>
                    <div className="h-4 w-px bg-hairline" />
                    <p className="text-[10px] text-muted uppercase tracking-wider">
                      {t.pages.aanbod.selectedCriteria}
                    </p>
                  </div>
                  <p className="text-[10px] text-muted font-medium hidden sm:block">
                    {t.pages.aanbod.certifiedInstallation} · <span className="text-brand">{t.pages.aanbod.todayQuote}</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProducts.map((product, i) => (
                    <Link
                      key={i}
                      href={`/contact?product=${encodeURIComponent(product.name)}&service=${activeService.slug}`}
                      className="product-card-v1 rounded-lg overflow-hidden group cursor-pointer block"
                    >
                      <div className="relative aspect-[16/10] bg-concrete">
                        <Image src={resolveProductImage(product.image)} alt={product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute top-4 left-4 pointer-events-none">
                          <div className="bg-surface/90 px-2.5 py-1.5 rounded-lg border border-hairline shadow-sm">
                            <BrandLogo brand={product.brand} imageSrc={brandImages[product.brand] ?? ""} height={16} />
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <h4 className="font-display font-bold text-lg text-ink uppercase tracking-tight group-hover:text-brand transition-colors">
                            {product.name}
                          </h4>
                          <span className="shrink-0 text-base font-bold text-ink tabular-nums leading-none pt-0.5">
                            {product.price || 'P.O.A.'}
                          </span>
                        </div>
                        <p className="text-xs text-muted leading-relaxed mb-5 line-clamp-2">{product.description}</p>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-6 pb-6 border-b border-hairline">
                          {product.techSpecs.slice(0, 4).map((spec, idx) => (
                            <div key={idx} className="flex items-center gap-2.5">
                              <div className="w-5 h-5 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                                <svg className="w-2.5 h-2.5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <span className="text-[11px] font-semibold text-ink leading-tight">{spec}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-brand uppercase tracking-wider">
                            <span>{t.pages.aanbod.requestQuote}</span>
                            <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </div>
                          <span className="text-[9px] font-bold text-muted/60 uppercase tracking-wider">{t.pages.aanbod.todayQuote}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map((service, i) => (
                  <button key={service.slug} onClick={() => handleCategorySelect(service.slug)} className="group relative aspect-video rounded-xl overflow-hidden bg-ink">
                    <Image src={service.image} alt={serviceTitleMap[service.slug]} fill className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/90 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <p className="text-[0.625rem] font-bold uppercase tracking-[0.24em] text-brand mb-1">{t.pages.aanbod.dienst}</p>
                      <h3 className="font-display font-bold text-xl text-white uppercase tracking-tight">{serviceTitleMap[service.slug]}</h3>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <button className="absolute inset-0 bg-ink/60" onClick={() => setMobileFilterOpen(false)} aria-label={t.pages.aanbod.close} />
          <div className="relative ml-auto w-72 bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="sticky top-0 bg-white border-b border-hairline px-5 py-4 flex items-center justify-between shrink-0">
              <p className="font-bold text-ink text-sm">{t.pages.aanbod.filterTitle}</p>
              <button onClick={() => setMobileFilterOpen(false)} className="text-muted hover:text-ink transition-colors" aria-label={t.pages.aanbod.close}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-5 flex-1 overflow-y-auto">
              <Sidebar
                activeSlug={activeSlug}
                priceRange={priceRange}
                selectedBrands={selectedBrands}
                brands={availableBrands}
                brandImages={brandImages}
                onCategorySelect={(slug) => { handleCategorySelect(slug); setMobileFilterOpen(false); }}
                onPriceChange={setPriceRange}
                onBrandToggle={(b) => setSelectedBrands((prev) => prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b])}
                onResetFilters={handleResetFilters}
                showFilters={showFilters}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function AanbodPage() {
  return (
    <Suspense>
      <AanbodContent />
    </Suspense>
  );
}
