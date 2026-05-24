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

import PriceRangeSlider, { SLIDER_MIN, SLIDER_MAX, SLIDER_STEP } from "./_components/PriceRangeSlider";
import ProductCard from "./_components/ProductCard";
import MobileSheet from "../_ui/MobileSheet";

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
                    ? "bg-brand/8 text-brand font-semibold border-brand/20"
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

  const [services, setServices] = useState<Service[]>(baseServices);
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

  const handleCategorySelect = (slug: string) => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    if (isMobile && activeSlug === slug) return;
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
      <section className="pt-[70px] lg:pt-[114px] bg-bg border-b border-hairline">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-10 py-10 lg:py-16">
          <Reveal>
            <div className="flex items-center gap-3 mb-4 md:mb-5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand shadow-sm shadow-brand/20" />
              <span className="text-label text-muted font-black tracking-[0.25em]">{t.pages.aanbod.label}</span>
            </div>
          </Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 md:gap-10">
            <Reveal delay={60}>
              <h1 className="font-display font-black text-[clamp(2.5rem,6vw,6rem)] leading-[0.85] tracking-[-0.04em] text-ink max-w-2xl"
                dangerouslySetInnerHTML={{ __html: t.pages.aanbod.title.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
              />
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
              {services.map((service, i) => (
                <button
                  key={`tab-${service.slug}`}
                  role="tab"
                  aria-selected={activeSlug === service.slug}
                  onClick={() => handleCategorySelect(service.slug)}
                  className={`relative flex items-center gap-3 px-5 py-3 text-[12px] font-black uppercase tracking-wider whitespace-nowrap touch-target transition-all shrink-0 rounded-xl border ${
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

        <div className="max-w-[1280px] mx-auto px-5 lg:px-10 instrument-layout">
          <aside className="hidden lg:block">
            <div className="sidebar-panel">
              <div className="mb-14">
                <h3 className="text-2xl font-display font-black text-ink uppercase tracking-tight mb-8">{t.pages.aanbod.sidebar.catalog}</h3>
                <div className="minimal-list space-y-3">
                  {services.map(s => (
                    <button 
                      key={s.slug} 
                      onClick={() => handleCategorySelect(s.slug)}
                      className={`minimal-btn text-lg py-2 ${activeSlug === s.slug ? 'active scale-105 origin-left' : 'hover:translate-x-1'} transition-all duration-300 font-black uppercase tracking-wide`}
                    >
                      <span className="icon scale-125">{serviceIcons[s.slug]}</span>
                      <span>{serviceTitleMap[s.slug]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {activeSlug !== 'zonnepanelen' && (
                <>
                  <div className="h-px bg-hairline mb-14" />
                  <div className="mb-14">
                    <p className="text-micro text-muted font-black mb-6">{t.pages.aanbod.sidebar.budgetRange}</p>
                    {showFilters && <PriceRangeSlider value={priceRange} onChange={setPriceRange} />}
                    {!showFilters && (
                      <div className="flex items-center gap-5 text-sm font-black text-ink mb-2">
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
                      <p className="text-micro text-muted font-black mb-6">{t.pages.aanbod.sidebar.manufacturer}</p>
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
              <div className="relative min-h-[70vh] rounded-3xl overflow-hidden flex flex-col items-center justify-center text-center px-6 py-24 mb-12 shadow-2xl shadow-brand/10 group">
                <Image src="/images/solarbackground.webp" alt="Zonnepanelen" fill className="object-cover group-hover:scale-105 transition-transform duration-[12s] ease-linear" priority />
                <div className="absolute inset-0 bg-ink/75 backdrop-blur-[2px]" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-aurora-1 via-brand/40 to-aurora-2" />
                
                <div className="relative z-10 max-w-3xl">
                  <Reveal>
                    <span className="inline-block px-5 py-2 rounded-full bg-brand/15 border border-brand/30 text-brand text-[12px] font-black uppercase tracking-[0.3em] mb-8">
                      {serviceTitleMap['zonnepanelen']}
                    </span >
                  </Reveal>
                  <Reveal delay={100}>
                    <h2 className="font-display font-black text-[clamp(2.5rem,8vw,6.5rem)] text-white leading-[0.85] tracking-[-0.04em] uppercase mb-10">
                      Maatwerk <br/><span className="text-brand">Solar Solutions</span>
                    </h2>
                  </Reveal>
                  <Reveal delay={200}>
                    <p className="text-lg md:text-2xl text-white/70 font-medium leading-relaxed mb-16 max-w-2xl mx-auto">
                      Wij leveren geen standaard pakketten, maar ontwerpen een systeem dat perfect past bij uw dak en energiebehoefte.
                    </p>
                  </Reveal>
                  <Reveal delay={300}>
                    <Link 
                      href="/contact?service=zonnepanelen" 
                      className="inline-flex items-center gap-5 px-14 py-7 bg-brand text-white text-lg md:text-xl font-black uppercase tracking-[0.2em] rounded-full hover:bg-white hover:text-brand transition-all duration-500 shadow-2xl shadow-brand/40 group/btn hover:-translate-y-2 active:translate-y-0"
                    >
                      <span>Vraag Maatwerk Offerte</span>
                      <svg className="w-6 h-6 transition-transform duration-500 group-hover/btn:translate-x-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </Reveal>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-aurora-2 via-brand/20 to-aurora-1" />
              </div>
            ) : activeSlug && activeService ? (
              <>
                <div className="compact-service-header mb-12">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 rounded-full -mr-32 -mt-32 blur-[100px] hidden md:block" />
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-12 p-8 lg:p-12">
                    <div>
                      <p className="text-[0.75rem] lg:text-[0.875rem] font-black uppercase tracking-[0.3em] text-muted/60 mb-3">{serviceTitleMap[activeService.slug]}</p>
                      <h2 className="font-display font-black text-2xl md:text-5xl lg:text-6xl text-ink leading-[0.9] tracking-[-0.03em] uppercase">
                        {serviceCaptionMap[activeService.slug]}
                      </h2>
                    </div>
                    <Link href={`/contact?service=${activeService.slug}`} className="px-10 py-5 md:px-14 md:py-6 bg-ink text-[0.75rem] lg:text-[0.875rem] font-black uppercase tracking-[0.25em] text-white rounded-full hover:bg-brand transition-all duration-500 text-center shadow-2xl hover:shadow-brand/40 hover:-translate-y-1 active:translate-y-0 shrink-0">
                      {t.pages.aanbod.requestQuote}
                    </Link>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-8 md:mb-12 border-b-2 border-hairline/50 pb-6 md:pb-8">
                  <div className="flex items-center gap-5">
                    <p className="shrink-0 whitespace-nowrap text-[13px] md:text-sm font-black text-ink uppercase tracking-widest ml-2">
                      {filteredProducts.length} {t.pages.aanbod.results}
                    </p>
                    <div className="h-5 md:h-6 w-px bg-hairline shrink-0" />
                    <button
                      onClick={() => setMobileFilterOpen(true)}
                      className="lg:hidden flex items-center gap-2 px-4 py-2 border-2 border-hairline rounded-full text-[11px] font-black text-ink uppercase tracking-wider hover:border-brand hover:text-brand transition-colors shrink-0"
                      aria-label={t.pages.aanbod.filterTitle}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                      {t.pages.aanbod.filterTitle}
                    </button>
                    <p className="hidden lg:block text-[11px] text-muted/60 font-black uppercase tracking-widest">
                      {t.pages.aanbod.certifiedInstallation} · <span className="text-brand">{t.pages.aanbod.todayQuote}</span>
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
                      <p className="text-micro text-brand font-black mb-3">{t.pages.aanbod.dienst}</p>
                      <h3 className="font-display font-black text-2xl md:text-3xl text-white uppercase tracking-tight group-hover:translate-x-2 transition-transform duration-500">{serviceTitleMap[service.slug]}</h3>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <MobileSheet
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        title={t.pages.aanbod.filterTitle}
      >
        <div className="overflow-y-auto max-h-[75vh] pb-10 px-6">
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
