"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { services, brandImages, type PriceTier } from "@/lib/data";
import Reveal from "../components/Reveal";
import BrandLogo from "../components/BrandLogo";

// Per-service icons
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

const PRICE_TIERS: { value: PriceTier; label: string; desc: string }[] = [
  { value: "economy", label: "Economy", desc: "Beste prijs-kwaliteitsverhouding" },
  { value: "medium", label: "Medium", desc: "Uitgebalanceerde kwaliteit" },
  { value: "premium", label: "Premium", desc: "Topkwaliteit, maximaal comfort" },
];

interface SidebarProps {
  activeSlug: string | null;
  selectedTiers: PriceTier[];
  onCategorySelect: (slug: string) => void;
  onTierToggle: (tier: PriceTier) => void;
  onResetTiers: () => void;
  showPriceFilter: boolean;
}

function Sidebar({
  activeSlug,
  selectedTiers,
  onCategorySelect,
  onTierToggle,
  onResetTiers,
  showPriceFilter,
}: SidebarProps) {
  return (
    <div>
      {/* Category list */}
      <div className="mb-6">
        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-muted mb-3">
          Categorieën
        </p>
        <ul className="space-y-0.5">
          {services.map((service) => (
            <li key={service.slug}>
              <button
                onClick={() => onCategorySelect(service.slug)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm rounded-lg border transition-all duration-200 ${
                  activeSlug === service.slug
                    ? "bg-brand/8 text-brand font-semibold border-brand/20"
                    : "text-ink font-medium border-transparent hover:bg-concrete"
                }`}
              >
                <span
                  className={`shrink-0 ${
                    activeSlug === service.slug ? "text-brand" : "text-muted"
                  }`}
                >
                  {serviceIcons[service.slug]}
                </span>
                <span className="flex-1 leading-tight">{service.title}</span>
                {service.products.length > 0 && (
                  <span
                    className={`text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full tabular-nums shrink-0 ${
                      activeSlug === service.slug
                        ? "bg-brand/15 text-brand"
                        : "bg-concrete text-muted"
                    }`}
                  >
                    {service.products.length}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price tier filter */}
      {showPriceFilter && (
        <>
          <div className="h-px bg-hairline mb-6" />
          <div>
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-muted mb-3">
              Prijsklasse
            </p>
            <div className="space-y-2">
              {PRICE_TIERS.map((tier) => {
                const active = selectedTiers.includes(tier.value);
                return (
                  <button
                    key={tier.value}
                    onClick={() => onTierToggle(tier.value)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-all duration-200 ${
                      active
                        ? "bg-brand/8 border-brand/20"
                        : "border-hairline hover:border-brand/20 hover:bg-concrete"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                        active ? "bg-brand border-brand" : "border-muted/40"
                      }`}
                    >
                      {active && (
                        <svg
                          className="w-2.5 h-2.5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink leading-tight">
                        {tier.label}
                      </p>
                      <p className="text-xs text-muted leading-snug">{tier.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            {selectedTiers.length > 0 && (
              <button
                onClick={onResetTiers}
                className="mt-3 text-xs font-semibold text-brand hover:text-brand-deep transition-colors"
              >
                Prijsfilter wissen
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function TierBadge({ tier }: { tier: PriceTier }) {
  const styles: Record<PriceTier, string> = {
    economy: "bg-concrete/90 text-muted border-hairline",
    medium: "bg-brand/10 text-brand border-brand/20",
    premium: "bg-ink/90 text-base border-ink/15",
  };
  const labels: Record<PriceTier, string> = {
    economy: "Economy",
    medium: "Medium",
    premium: "Premium",
  };
  return (
    <span
      className={`text-[0.6rem] font-bold uppercase tracking-[0.12em] px-2 py-1 border backdrop-blur-sm ${styles[tier]}`}
    >
      {labels[tier]}
    </span>
  );
}

function AanbodContent() {
  const searchParams = useSearchParams();
  const initialDienst = searchParams.get("dienst");

  const [activeSlug, setActiveSlug] = useState<string | null>(
    services.find((s) => s.slug === initialDienst) ? initialDienst : null
  );
  const [selectedTiers, setSelectedTiers] = useState<PriceTier[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const activeService = services.find((s) => s.slug === activeSlug) ?? null;
  const showPriceFilter = !!(activeService && activeService.products.length > 0);

  const filteredProducts = useMemo(() => {
    if (!activeService) return [];
    if (selectedTiers.length === 0) return activeService.products;
    return activeService.products.filter((p) => selectedTiers.includes(p.tier));
  }, [activeService, selectedTiers]);

  const handleCategorySelect = (slug: string) => {
    const next = activeSlug === slug ? null : slug;
    setActiveSlug(next);
    setSelectedTiers([]);
  };

  const toggleTier = (tier: PriceTier) => {
    setSelectedTiers((prev) =>
      prev.includes(tier) ? prev.filter((t) => t !== tier) : [...prev, tier]
    );
  };

  return (
    <>
      {/* Hero */}
      <section className="pt-[70px] lg:pt-[114px] bg-base border-b border-hairline">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8 lg:py-10">
          <Reveal>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-brand" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
                Ons aanbod
              </span>
            </div>
          </Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <Reveal delay={60}>
              <h1 className="font-display font-extrabold text-[clamp(1.75rem,3.5vw,3rem)] leading-[0.95] tracking-tight text-ink">
                Diensten en producten voor een{" "}
                <span className="text-brand">duurzaam thuis</span>
              </h1>
            </Reveal>
            <Reveal delay={120}>
              <p className="text-sm text-muted leading-relaxed max-w-xs sm:text-right">
                Kies een dienst om producten en installaties te ontdekken.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Store layout */}
      <div className="bg-base">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pt-8 pb-24 lg:pb-32">

          {/* Mobile: active filter chips + filter button */}
          <div className="lg:hidden mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              {activeService && (
                <span className="flex items-center gap-1.5 text-xs font-bold text-brand bg-brand/8 border border-brand/20 px-3 py-1 rounded-full">
                  {activeService.title}
                  <button
                    onClick={() => {
                      setActiveSlug(null);
                      setSelectedTiers([]);
                    }}
                    className="ml-0.5 text-brand/60 hover:text-brand transition-colors"
                    aria-label="Verwijder categorie filter"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {selectedTiers.map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-1.5 text-xs font-bold text-ink bg-concrete border border-hairline px-3 py-1 rounded-full"
                >
                  {PRICE_TIERS.find((pt) => pt.value === t)?.label}
                  <button
                    onClick={() =>
                      setSelectedTiers((prev) => prev.filter((x) => x !== t))
                    }
                    className="ml-0.5 text-muted hover:text-ink transition-colors"
                    aria-label={`Verwijder ${t} filter`}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
              {!activeService && selectedTiers.length === 0 && (
                <span className="text-xs text-muted">Kies een categorie</span>
              )}
            </div>
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="shrink-0 flex items-center gap-2 px-4 py-2 border border-hairline text-sm font-semibold text-ink rounded-full hover:border-brand hover:text-brand transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter
              {(activeSlug || selectedTiers.length > 0) && (
                <span className="w-2 h-2 rounded-full bg-brand shrink-0" />
              )}
            </button>
          </div>

          <div className="flex gap-10 lg:gap-12">

            {/* Sidebar - desktop only */}
            <aside className="hidden lg:block w-56 shrink-0">
              <div className="sticky top-[130px]">
                <Sidebar
                  activeSlug={activeSlug}
                  selectedTiers={selectedTiers}
                  onCategorySelect={handleCategorySelect}
                  onTierToggle={toggleTier}
                  onResetTiers={() => setSelectedTiers([])}
                  showPriceFilter={showPriceFilter}
                />
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0" id="aanbod-content">

              {/* No category selected: service category grid */}
              {!activeSlug && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {services.map((service, i) => (
                    <Reveal key={service.slug} delay={i * 40}>
                      <button
                        onClick={() => handleCategorySelect(service.slug)}
                        className="group w-full text-left relative overflow-hidden bg-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand hover:shadow-xl hover:shadow-ink/20 transition-shadow duration-500"
                      >
                        <div className="relative aspect-video overflow-hidden">
                          <Image
                            src={service.image}
                            alt={service.title}
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 640px"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
                          {service.popular && (
                            <div className="absolute top-3 left-3 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
                                Populair
                              </span>
                            </div>
                          )}
                          <div className="absolute inset-x-0 bottom-0 p-5">
                            <div className="flex items-center gap-2.5 mb-2">
                              <div className="shrink-0 w-7 h-7 rounded-lg bg-brand/20 border border-brand/30 flex items-center justify-center text-white/80 group-hover:bg-brand group-hover:border-brand group-hover:text-white transition-all duration-200">
                                {serviceIcons[service.slug] ?? (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                  </svg>
                                )}
                              </div>
                              {service.products.length > 0 && (
                                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/50">
                                  {service.products.length} product{service.products.length !== 1 ? "en" : ""}
                                </span>
                              )}
                            </div>
                            <h3 className="text-lg font-bold text-white leading-tight mb-1 group-hover:text-brand transition-colors duration-300">
                              {service.title}
                            </h3>
                            <p className="text-xs text-white/60 leading-relaxed line-clamp-2">
                              {service.summary}
                            </p>
                            <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-brand/70 group-hover:text-brand group-hover:gap-2.5 transition-all duration-300">
                              <span>Bekijk dienst</span>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </button>
                    </Reveal>
                  ))}
                </div>
              )}

              {/* Category selected */}
              {activeSlug && activeService && (
                <>
                  {/* Service brief */}
                  <Reveal>
                    <div className="bg-concrete border border-hairline p-5 lg:p-6 mb-7">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        <div className="shrink-0 w-11 h-11 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                          {serviceIcons[activeService.slug] ?? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-muted mb-1">
                            {activeService.title}
                          </p>
                          <h2 className="font-display font-extrabold text-xl lg:text-2xl text-ink mb-2 leading-tight tracking-tight">
                            {activeService.caption}
                          </h2>
                          <p className="text-sm text-muted leading-relaxed max-w-2xl">
                            {activeService.description}
                          </p>
                        </div>
                        <div className="shrink-0">
                          <Link
                            href={`/contact?service=${activeService.slug}`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand text-white text-xs font-bold rounded-full hover:bg-brand-deep transition-colors duration-200 shadow-sm shadow-brand/20 uppercase tracking-wide whitespace-nowrap"
                          >
                            Offerte aanvragen
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Reveal>

                  {/* Aurora hairline */}
                  <div className="h-px bg-gradient-to-r from-aurora-1 via-brand/40 to-aurora-2 mb-7" />

                  {/* Products or no-products CTA */}
                  {activeService.products.length > 0 ? (
                    <>
                      {/* Result count */}
                      <div className="flex items-center justify-between mb-5">
                        <p className="text-sm text-muted">
                          <span className="font-bold text-ink">{filteredProducts.length}</span>
                          {" "}van{" "}
                          <span className="font-bold text-ink">{activeService.products.length}</span>
                          {" "}producten
                          {selectedTiers.length > 0 && (
                            <button
                              onClick={() => setSelectedTiers([])}
                              className="ml-2 text-brand font-semibold hover:text-brand-deep transition-colors"
                            >
                              (filter wissen)
                            </button>
                          )}
                        </p>
                        <p className="text-xs text-muted hidden sm:block">
                          Incl. installatie · Offerte binnen 24u
                        </p>
                      </div>

                      {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                          {filteredProducts.map((product, i) => (
                            <Reveal key={product.name} delay={i * 50}>
                              <div className="group bg-white border border-hairline hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5 transition-all duration-300 overflow-hidden flex flex-col h-full">
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
                                  <div className="absolute top-3 right-3">
                                    <TierBadge tier={product.tier} />
                                  </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col flex-1">
                                  {/* Brand */}
                                  <div className="mb-2.5 h-5 flex items-center">
                                    <BrandLogo
                                      brand={product.brand}
                                      imageSrc={brandImages[product.brand] ?? ""}
                                      height={18}
                                    />
                                  </div>

                                  {/* Name */}
                                  <h4 className="text-sm font-bold text-ink leading-snug mb-2 group-hover:text-brand transition-colors duration-200">
                                    {product.name}
                                  </h4>

                                  {/* Description */}
                                  <p className="text-xs text-muted leading-relaxed mb-3 line-clamp-2">
                                    {product.description}
                                  </p>

                                  {/* Specs */}
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
                                  <div className="mt-auto pt-4 border-t border-hairline">
                                    <div className="flex items-end justify-between gap-3">
                                      {product.price ? (
                                        <div>
                                          <p className="text-[0.6rem] font-bold uppercase tracking-[0.15em] text-muted mb-0.5">
                                            Incl. installatie
                                          </p>
                                          <span className="text-base font-extrabold text-ink tabular-nums">
                                            {product.price}
                                          </span>
                                        </div>
                                      ) : (
                                        <span className="text-xs text-muted italic">
                                          Prijs op aanvraag
                                        </span>
                                      )}
                                      <Link
                                        href={`/contact?service=${activeService.slug}&product=${encodeURIComponent(product.name)}`}
                                        className="shrink-0 px-4 py-2.5 bg-brand text-white text-xs font-bold rounded-full hover:bg-brand-deep transition-colors duration-200 shadow-sm shadow-brand/20"
                                      >
                                        Offerte aanvragen
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Reveal>
                          ))}
                        </div>
                      ) : (
                        /* No products match the price filter */
                        <div className="py-16 text-center border border-hairline bg-concrete">
                          <svg className="w-8 h-8 text-muted mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                          </svg>
                          <p className="text-sm text-muted mb-3">
                            Geen producten gevonden voor de geselecteerde prijsklasse.
                          </p>
                          <button
                            onClick={() => setSelectedTiers([])}
                            className="text-sm font-bold text-brand hover:text-brand-deep transition-colors"
                          >
                            Filter wissen
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    /* Service without products */
                    <Reveal>
                      <div className="bg-concrete border border-hairline p-8 lg:p-12 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div className="shrink-0 w-14 h-14 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                          {serviceIcons[activeService.slug]}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted mb-2">
                            Op maat
                          </p>
                          <h3 className="text-xl font-bold text-ink mb-2">
                            Deze dienst wordt volledig op maat samengesteld
                          </h3>
                          <p className="text-sm text-muted leading-relaxed">
                            Neem contact op voor een vrijblijvend adviesgesprek. Wij brengen uw situatie in kaart en stellen een offerte op maat op.
                          </p>
                        </div>
                        <Link
                          href={`/contact?service=${activeService.slug}`}
                          className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-brand text-white text-sm font-bold rounded-full hover:bg-brand-deep transition-colors duration-200 shadow-sm shadow-brand/20 uppercase tracking-wide"
                        >
                          Offerte aanvragen
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </Link>
                      </div>
                    </Reveal>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <button
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
            aria-label="Sluit filter"
          />
          <div className="relative ml-auto w-72 bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="sticky top-0 bg-white border-b border-hairline px-5 py-4 flex items-center justify-between shrink-0">
              <p className="font-bold text-ink text-sm">Filteren</p>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="text-muted hover:text-ink transition-colors"
                aria-label="Sluit"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-5 flex-1 overflow-y-auto">
              <Sidebar
                activeSlug={activeSlug}
                selectedTiers={selectedTiers}
                onCategorySelect={(slug) => {
                  handleCategorySelect(slug);
                  setMobileFilterOpen(false);
                }}
                onTierToggle={toggleTier}
                onResetTiers={() => setSelectedTiers([])}
                showPriceFilter={showPriceFilter}
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
