"use client";

import { useState, useMemo, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { services as baseServices, brandImages as baseBrandImages, type Service, type Product } from "@/lib/data";
import { fetchAdminStore, mergeServices, mergeBrandImages } from "@/lib/adminStore";
import Reveal from "../_ui/Reveal";
import BrandLogo from "../_ui/BrandLogo";
import { resolveProductImage } from "@/lib/images";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import dynamic from "next/dynamic";
import { serviceIcons } from "../_ui/serviceIcons";
import { renderRich } from "../_ui/richText";


import PriceRangeSlider, { SLIDER_MIN, SLIDER_MAX, SLIDER_STEP } from "./_components/PriceRangeSlider";
import ProductCard from "./_components/ProductCard";
import MobileSheet from "../_ui/MobileSheet";

const SolarSection = dynamic(() => import("./_components/SolarSection"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] rounded-[2.5rem] bg-concrete animate-pulse flex items-center justify-center border-2 border-hairline/50">
      <span className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin motion-reduce:animate-none" aria-label="Laden" />
    </div>
  )
});

const MaintenancePlanner = dynamic(() => import("./_components/MaintenancePlanner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] rounded-[2.5rem] bg-concrete animate-pulse flex items-center justify-center border-2 border-hairline/50">
      <span className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin motion-reduce:animate-none" aria-label="Laden" />
    </div>
  )
});

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
        <p className="text-label text-muted mb-3">{t.pages.aanbod.sidebar.categories}</p>
        <ul className="space-y-0.5">
          {baseServices.map((service) => (
            <li key={service.slug}>
              <button
                onClick={() => onCategorySelect(service.slug)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm rounded-xl border transition-all duration-200 ${
                  activeSlug === service.slug
                    ? "bg-brand/8 text-brand-ink font-semibold border-brand/20"
                    : "text-ink font-medium border-transparent hover:bg-concrete"
                }`}
              >
                <span className={`shrink-0 ${activeSlug === service.slug ? "text-brand" : "text-muted"}`}>
                  {serviceIcons[service.slug]}
                </span>
                <span className="flex-1 leading-tight">{sidebarTitleMap[service.slug]}</span>
                {service.products && service.products.length > 0 && service.slug !== 'zonnepanelen' && (
                  <span className={`text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full tabular-nums shrink-0 ${activeSlug === service.slug ? "bg-brand/15 text-brand" : "bg-concrete text-muted"}`}>
                    {service.products.length}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {showFilters && activeSlug !== 'zonnepanelen' && (
        <>
          <div className="h-px bg-hairline mb-6" />

          <div className="mb-6">
            <p className="text-label text-muted mb-3">{t.pages.aanbod.priceRange}</p>
            <PriceRangeSlider value={priceRange} onChange={onPriceChange} />
          </div>

          {brands.length > 0 && (
            <div className="mb-4">
              <p className="text-label text-muted mb-3">{t.pages.aanbod.sidebar.manufacturer}</p>
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
  }, [t]);
  const serviceCaptionMap = useMemo(() => {
    const map: Record<string, string> = {};
    baseServices.forEach((s, i) => { map[s.slug] = t.sections.services.items[i]?.caption || s.caption; });
    return map;
  }, [t]);
  const searchParams = useSearchParams();
  const initialDienst = searchParams.get("dienst");

  const [services, setServices] = useState<Service[]>(() => baseServices.map(s => ({ ...s, products: [] })));
  const [brandImages, setBrandImages] = useState<Record<string, string>>(baseBrandImages);
  const [activeSlug, setActiveSlug] = useState<string | null>(initialDienst || null);
  const [priceRange, setPriceRange] = useState<[number, number]>([SLIDER_MIN, SLIDER_MAX]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    fetchAdminStore()
      .then((store) => {
        setServices(mergeServices(store));
        setBrandImages(mergeBrandImages(store));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (activeSlug !== null || services.length === 0) return;
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    if (isMobile) {
      setActiveSlug(services[0].slug);
    }
  }, [activeSlug, services]);

  const activeService = services.find((s) => s.slug === activeSlug) ?? null;
  const showFilters = !!(activeService && activeService.products.length > 0 && activeService.slug !== 'zonnepanelen');

  const availableBrands = useMemo(() => {
    if (!activeService || activeService.slug === 'zonnepanelen') return [];
    const set = new Set<string>();
    activeService.products.forEach((p) => set.add(p.brand));
    return Array.from(set).sort();
  }, [activeService]);

  const filteredProducts = useMemo(() => {
    if (!activeService || activeService.slug === 'zonnepanelen') return [];
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

  const handleCategorySelect = (slug: string, type?: string) => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    if (isMobile && activeSlug === slug && !type) return;
    const next = activeSlug === slug && !type ? null : slug;
    setActiveSlug(next);
    setSelectedBrands([]);
    setPriceRange([SLIDER_MIN, SLIDER_MAX]);
    
    // Update URL if type is provided for maintenance
    if (type && typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('dienst', slug);
      url.searchParams.set('type', type);
      window.history.replaceState({}, '', url);
    }
  };

  const handleResetFilters = () => {
    setSelectedBrands([]);
    setPriceRange([SLIDER_MIN, SLIDER_MAX]);
  };

  return (
    <>
      <section className="pt-[70px] lg:pt-[114px] bg-bg border-b border-hairline">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-10 py-10 lg:py-16">
          <Reveal>
            <div className="flex items-center gap-3 mb-4 md:mb-5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand shadow-sm shadow-brand/20" />
              <span className="text-label text-muted font-extrabold tracking-[0.25em]">{t.pages.aanbod.label}</span>
            </div>
          </Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 md:gap-10">
            <Reveal delay={60}>
              <h1 className="font-display font-extrabold text-[clamp(2.5rem,6vw,6rem)] leading-[0.85] tracking-[-0.04em] text-ink max-w-2xl">
                {renderRich(t.pages.aanbod.title)}
              </h1>
            </Reveal>
            <Reveal delay={120}>
              <p className="text-base lg:text-xl text-muted/80 font-medium leading-relaxed max-w-sm sm:text-right">
                {t.pages.aanbod.description}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="bg-bg">
        <div className="lg:hidden border-b border-hairline bg-surface sticky top-[60px] z-30">
          <div className="flex gap-1 px-4 py-3 overflow-x-auto scrollbar-none" role="tablist">
            <div className="flex gap-2 mx-auto">
              {services.map((service) => (
                <button
                  key={`tab-${service.slug}`}
                  role="tab"
                  aria-selected={activeSlug === service.slug}
                  onClick={() => handleCategorySelect(service.slug)}
                  className={`relative flex items-center gap-3 px-5 py-3 text-[12px] font-extrabold uppercase tracking-wider whitespace-nowrap touch-target transition-all shrink-0 rounded-xl border ${
                    activeSlug === service.slug
                      ? "bg-brand text-white border-brand shadow-lg shadow-brand/20"
                      : "text-muted border-hairline hover:text-ink hover:bg-concrete"
                  }`}
                >
                  <span className={`w-4 h-4 shrink-0 ${activeSlug === service.slug ? "" : "opacity-60"}`}>
                    {serviceIcons[service.slug]}
                  </span>
                  <span>{serviceTitleMap[service.slug]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-5 lg:px-10 instrument-layout">
        <aside className="hidden lg:block">
          <div className="sidebar-panel">
            <div className="mb-14">
              <h3 className="text-2xl font-display font-extrabold text-ink uppercase tracking-tight mb-8">{t.pages.aanbod.sidebar.catalog}</h3>
              <div className="minimal-list space-y-3">
                {services.map(s => (
                  <div key={s.slug}>
                    <button 
                      onClick={() => handleCategorySelect(s.slug)}
                      className={`minimal-btn text-lg py-2 ${activeSlug === s.slug ? 'active scale-105 origin-left' : 'hover:translate-x-1'} transition-all duration-300 font-extrabold uppercase tracking-wide`}
                    >
                      <span className="icon scale-125">{serviceIcons[s.slug]}</span>
                      <span>{serviceTitleMap[s.slug]}</span>
                    </button>

                    {/* Maintenance Dropdown / Sub-items */}
                    {s.slug === 'onderhoud' && activeSlug === 'onderhoud' && (
                      <div className="pl-8 py-2 space-y-2 border-l border-brand/30 ml-3 mt-1 animate-fade-in">
                        {['Airco', 'Solar', 'Batterij', 'Meterkast', 'Elektra'].map(type => (
                          <button 
                            key={type}
                            onClick={() => handleCategorySelect('onderhoud', type.toLowerCase())}
                            className="block text-sm font-bold text-muted hover:text-brand transition-colors py-1"
                          >
                            {type} Onderhoud
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>            </div>

            {activeSlug !== 'zonnepanelen' && (
              <>
                <div className="h-px bg-hairline mb-14" />
                <div className="mb-14">
                  <p className="text-micro text-muted font-extrabold mb-6">{t.pages.aanbod.sidebar.budgetRange}</p>
                  {showFilters && <PriceRangeSlider value={priceRange} onChange={setPriceRange} />}
                  {!showFilters && (
                    <div className="flex items-center gap-5 text-sm font-extrabold text-ink mb-2">
                      <span>€0</span>
                      <div className="flex-1 h-1 bg-hairline relative rounded-full">
                        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-brand" />
                      </div>
                      <span>€20k+</span>
                    </div>
                  )}
                </div>

                {availableBrands.length > 0 && (
                  <div>
                    <p className="text-micro text-muted font-extrabold mb-6">{t.pages.aanbod.sidebar.manufacturer}</p>
                    <div className="flex flex-wrap gap-3">
                      {availableBrands.map(brand => (
                        <button 
                          key={brand}
                          onClick={() => setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand])}
                          className={`px-4 py-2 text-micro tracking-widest rounded-xl border-2 transition-all duration-300 flex items-center gap-2.5 ${selectedBrands.includes(brand) ? 'bg-brand text-white border-brand shadow-lg shadow-brand/10' : 'bg-concrete text-muted border-transparent hover:border-brand/20 hover:text-brand'}`}
                        >
                          <BrandLogo brand={brand} imageSrc={brandImages[brand] ?? ""} height={18} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {activeSlug === 'zonnepanelen' ? (
            <SolarSection />
          ) : activeSlug === 'onderhoud' ? (
            <MaintenancePlanner />
          ) : activeSlug && activeService ? (
            <>
              <div className="flex items-center justify-between mb-8 md:mb-12 border-b-2 border-hairline/50 pb-6 md:pb-8">
                <div className="flex items-center gap-5">
                  <p className="shrink-0 whitespace-nowrap text-[13px] md:text-sm font-extrabold text-ink uppercase tracking-widest ml-2">
                    {filteredProducts.length} {t.pages.aanbod.results}
                  </p>
                  <div className="h-5 md:h-6 w-px bg-hairline shrink-0" />
                  <button
                    onClick={() => setMobileFilterOpen(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 border-2 border-hairline rounded-full text-[11px] font-extrabold text-ink uppercase tracking-wider hover:border-brand hover:text-brand transition-colors shrink-0"
                    aria-label={t.pages.aanbod.filterTitle}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                    </svg>
                    {t.pages.aanbod.filterTitle}
                  </button>
                  <p className="hidden lg:block text-[11px] text-muted/60 font-extrabold uppercase tracking-widest">
                    {t.pages.aanbod.certifiedInstallation} · <span className="text-brand-ink">{t.pages.aanbod.todayQuote}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10 lg:gap-12 mb-20">
                {filteredProducts.map((product, i) => (
                  <ProductCard
                    key={i}
                    product={product}
                    serviceSlug={activeService.slug}
                    brandImages={brandImages}
                    requestQuoteLabel={t.pages.aanbod.requestQuote}
                    todayQuoteLabel={t.pages.aanbod.todayQuote}
                    priceOnRequestLabel={t.pages.diensten.priceOnRequest}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mb-20">
              {services.map((service, i) => (
                <button key={service.slug} onClick={() => handleCategorySelect(service.slug)} className="group relative aspect-[16/10] rounded-3xl overflow-hidden bg-ink shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-2">
                  <Image src={service.image} alt={serviceTitleMap[service.slug]} fill className="object-cover opacity-50 group-hover:scale-110 group-hover:opacity-70 transition-all duration-[1.5s] ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-8 md:p-10">
                    <p className="text-micro text-brand font-extrabold mb-3">{t.pages.aanbod.dienst}</p>
                    <h3 className="font-display font-extrabold text-2xl md:text-3xl text-white uppercase tracking-tight group-hover:translate-x-2 transition-transform duration-500">{serviceTitleMap[service.slug]}</h3>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <MobileSheet
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        title={t.pages.aanbod.filterTitle}
      >
        <div className="overflow-y-auto max-h-[75dvh] pb-10 px-6">
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
      </MobileSheet>
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
