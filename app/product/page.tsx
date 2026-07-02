"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { fetchAdminStore, mergeBrandImages } from "@/lib/adminStore";
import { services as baseServices, brandImages as baseBrandImages, type Product } from "@/lib/data";
import { resolveProductImage } from "@/lib/images";
import Reveal from "@/app/_ui/Reveal";
import BrandLogo from "@/app/_ui/BrandLogo";

function ProductDetailContent() {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const productNameParam = searchParams.get("name");
  const serviceSlugParam = searchParams.get("service");

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [brandImages, setBrandImages] = useState<Record<string, string>>(baseBrandImages);
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
    }
  }, [product]);

  useEffect(() => {
    if (!productNameParam || !serviceSlugParam) {
      setLoading(false);
      return;
    }

    fetchAdminStore()
      .then((store) => {
        setBrandImages(mergeBrandImages(store));
        
        // Find matching product in the store
        const serviceProducts = store.products[serviceSlugParam] ?? [];
        const matched = serviceProducts.find(
          (p) => p.name.toLowerCase() === productNameParam.toLowerCase()
        );

        if (matched) {
          setProduct({
            name: matched.name,
            brand: matched.brand,
            price: matched.price,
            description: matched.description,
            techSpecs: matched.techSpecs,
            image: matched.image,
            categoryId: serviceSlugParam,
            images: matched.images || [],
          });
        } else {
          // Check fallback in baseServices
          const baseService = baseServices.find((s) => s.slug === serviceSlugParam);
          const baseMatched = baseService?.products?.find(
            (p) => p.name.toLowerCase() === productNameParam.toLowerCase()
          );
          if (baseMatched) {
            setProduct(baseMatched);
          }
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [productNameParam, serviceSlugParam]);

  const getCategoryTitle = (slug: string) => {
    const serviceIndex = baseServices.findIndex((s) => s.slug === slug);
    if (serviceIndex !== -1 && t.sections.services.items[serviceIndex]) {
      return t.sections.services.items[serviceIndex].title;
    }
    return slug.charAt(0).toUpperCase() + slug.slice(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-brand border-t-transparent rounded-full animate-spin" />
          <p className="text-[11px] font-black text-muted uppercase tracking-widest animate-pulse">
            {language === "nl" ? "Product laden..." : "Loading product..."}
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[80vh] bg-bg flex items-center justify-center px-6">
        <div className="text-center max-w-md bg-white border border-hairline p-8 rounded-[4px]">
          <div className="w-12 h-12 bg-brand/5 text-brand rounded-[4px] flex items-center justify-center mx-auto mb-6 border border-brand/10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="font-display text-xl font-extrabold text-ink uppercase tracking-tight mb-3">
            {language === "nl" ? "Product niet gevonden" : "Product Not Found"}
          </h1>
          <p className="text-xs text-muted leading-relaxed mb-8">
            {language === "nl"
              ? "Het gezochte product kon niet worden gevonden of is momenteel niet leverbaar."
              : "The requested product could not be found or is currently unavailable."}
          </p>
          <Link
            href="/aanbod/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-brand text-white font-bold uppercase tracking-wider rounded-full hover:bg-brand-deep transition-all duration-300 text-[10px]"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            {language === "nl" ? "Terug naar aanbod" : "Back to catalog"}
          </Link>
        </div>
      </div>
    );
  }

  const quoteUrl = `/contact/?product=${encodeURIComponent(product.name)}&service=${product.categoryId}`;
  const resolvedCategoryTitle = getCategoryTitle(product.categoryId);

  return (
    <div className="bg-bg min-h-screen py-6 lg:py-16 px-4 sm:px-6 lg:px-10 pb-28 md:pb-16">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Breadcrumb / Back Link */}
        <Reveal>
          <div className="flex items-center gap-2 text-[10px] text-muted/70 font-semibold uppercase tracking-wider mb-6 lg:mb-10">
            <Link href="/aanbod/" className="hover:text-brand transition-colors">
              {language === "nl" ? "Aanbod" : "Catalog"}
            </Link>
            <span className="text-muted/40">/</span>
            <Link href={`/aanbod/?dienst=${product.categoryId}`} className="hover:text-brand transition-colors">
              {resolvedCategoryTitle}
            </Link>
            <span className="text-muted/40">/</span>
            <span className="text-ink font-bold truncate max-w-[150px] sm:max-w-xs">{product.name}</span>
          </div>
        </Reveal>

        {/* E-Commerce Dual-Panel Section */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-12 lg:mb-20">
          
          {/* Left Panel: Clean Image Container */}
          <div className="lg:col-span-6">
            <Reveal variant="scale" className="relative w-full aspect-square bg-white border border-hairline rounded-[4px] overflow-hidden flex items-center justify-center p-6 sm:p-10">
              {/* Optional Top Edge Gradient Accent for Precision Brand Vibe */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-aurora-1 via-brand to-aurora-2" />
              <div className="relative w-full h-full max-w-[85%] max-h-[85%]">
                <Image
                  src={resolveProductImage(activeImage || product.image)}
                  alt={product.name}
                  fill
                  className="object-contain transition-transform duration-700 hover:scale-102"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </Reveal>

            {/* Gallery Thumbnails */}
            {product.images && product.images.length > 0 && (
              <Reveal delay={100} className="flex flex-wrap gap-2 mt-4 justify-center lg:justify-start">
                {[product.image, ...product.images].map((img, i) => {
                  const isSelected = activeImage === img;
                  return (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-14 h-14 bg-white border rounded-[4px] overflow-hidden p-1.5 transition-all duration-300 ${
                        isSelected ? "border-brand ring-1 ring-brand/35 scale-95" : "border-hairline hover:border-brand/40"
                      }`}
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={resolveProductImage(img)}
                          alt=""
                          fill
                          className="object-contain"
                          sizes="80px"
                        />
                      </div>
                    </button>
                  );
                })}
              </Reveal>
            )}
          </div>

          {/* Right Panel: Clean Typography & Detailed Info */}
          <div className="lg:col-span-6 flex flex-col pt-2 lg:pt-0">
            
            {/* Category / Brand Row */}
            <Reveal>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-hairline">
                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-brand">
                  {resolvedCategoryTitle}
                </span>
                {brandImages[product.brand] && (
                  <div className="opacity-90 max-h-[22px]">
                    <BrandLogo brand={product.brand} imageSrc={brandImages[product.brand]} height={16} />
                  </div>
                )}
              </div>
            </Reveal>

            {/* Title */}
            <Reveal delay={60}>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-ink uppercase tracking-tight leading-[1.05] mb-4">
                {product.name}
              </h1>
            </Reveal>

            {/* Price tag */}
            <Reveal delay={120}>
              <div className="flex items-baseline gap-3 mb-6 lg:mb-8">
                <span className="text-xl sm:text-2xl lg:text-3xl font-black text-ink tracking-tight tabular-nums">
                  {product.price || (language === "nl" ? "Prijs op aanvraag" : "Price on request")}
                </span>
                {product.price && (
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted/60">
                    {language === "nl" ? "Richtprijs incl. montage" : "Guide price incl. installation"}
                  </span>
                )}
              </div>
            </Reveal>

            {/* Desktop: Offerte Button */}
            <Reveal delay={180} className="hidden md:block mb-8">
              <Link
                href={quoteUrl}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-ink text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-brand transition-all duration-300 active:translate-y-px"
              >
                <span>{language === "nl" ? "Offerte Aanvragen" : "Request Quote"}</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </Reveal>

            {/* Description */}
            <Reveal delay={240} className="mb-8">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-muted/65 mb-3">
                {language === "nl" ? "Productomschrijving" : "Product Description"}
              </h2>
              <div className="text-xs sm:text-sm text-copy leading-relaxed font-medium space-y-4 whitespace-pre-line">
                {product.description}
              </div>
            </Reveal>

            {/* Trust Points (Compact Icons Grid) */}
            <Reveal delay={300} className="border-t border-hairline pt-6 lg:pt-8">
              <div className="grid sm:grid-cols-2 gap-y-4 gap-x-4">
                {[
                  { 
                    label: language === "nl" ? "100% Eigen vakteam" : "100% In-house specialists",
                    desc: language === "nl" ? "Gecertificeerde eigen monteurs." : "Certified in-house technicians."
                  },
                  { 
                    label: language === "nl" ? "Snelle offerte service" : "Fast quoting service",
                    desc: language === "nl" ? "Duidelijkheid binnen 24 uur." : "Clear quote within 24 hours."
                  },
                  { 
                    label: language === "nl" ? "Veilig & Gecertificeerd" : "Safe & Certified",
                    desc: language === "nl" ? "VCA & NEN-3140 normering." : "Strict NEN-3140 and VCA safety."
                  },
                  { 
                    label: language === "nl" ? "Volledige installatiegarantie" : "Full installation warranty",
                    desc: language === "nl" ? "Kwaliteit voor jarenlang comfort." : "Guaranteed comfort for years."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-brand/5 border border-brand/15 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-brand" fill="none" stroke="currentColor" strokeWidth={3.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-ink uppercase tracking-tight leading-tight">
                        {item.label}
                      </h4>
                      <p className="text-[9px] text-muted leading-tight mt-0.5 font-medium">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

          </div>
        </div>

        {/* Technical Specifications Sheet */}
        {product.techSpecs && product.techSpecs.length > 0 && (
          <div className="border-t border-hairline pt-12 lg:pt-16">
            <Reveal>
              <h2 className="font-display font-extrabold text-lg lg:text-xl text-ink uppercase tracking-tight mb-6 lg:mb-8">
                {language === "nl" ? "Technische Eigenschappen" : "Technical Specifications"}
              </h2>
            </Reveal>

            <Reveal delay={80} className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {product.techSpecs.map((spec, idx) => (
                <div key={idx} className="bg-white border border-hairline rounded-[4px] p-4 hover:border-brand/40 transition-colors duration-300 flex items-center gap-3">
                  <div className="w-6 h-6 rounded-[4px] bg-concrete border border-hairline/50 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-brand" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 01 1.043-3.296 3.746 3.746 0 01 3.296-1.043A3.746 3.746 0 0112 3z" />
                    </svg>
                  </div>
                  <span className="text-[10px] lg:text-[11px] font-bold text-ink uppercase tracking-tight leading-snug">
                    {spec}
                  </span>
                </div>
              ))}
            </Reveal>
          </div>
        )}

      </div>

      {/* Mobile Sticky Bottom CTA Bar */}
      <div className="fixed bottom-[var(--bottom-nav-height)] md:bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-hairline p-4 flex items-center justify-between shadow-[0_-8px_30px_rgba(0,0,0,0.03)] md:hidden safe-bottom">
        <div className="flex flex-col min-w-0 pr-3">
          <span className="text-[9px] font-black text-muted uppercase tracking-widest truncate max-w-[140px]">
            {product.name}
          </span>
          <span className="text-xs font-black text-brand tracking-tight leading-none mt-1">
            {product.price || (language === "nl" ? "Prijs op aanvraag" : "Price on request")}
          </span>
        </div>
        <Link
          href={quoteUrl}
          className="px-5 py-3 bg-brand text-white text-[10px] font-black uppercase tracking-wider rounded-full hover:bg-brand-deep active:scale-98 transition-all shrink-0"
        >
          {language === "nl" ? "Offerte Aanvragen" : "Request Quote"}
        </Link>
      </div>

    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <div className="pt-[60px] lg:pt-[114px]">
      <Suspense fallback={
        <div className="min-h-screen bg-bg flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <ProductDetailContent />
      </Suspense>
    </div>
  );
}
