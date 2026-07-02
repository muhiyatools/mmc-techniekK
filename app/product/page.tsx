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
          // Map database structure to local Product interface
          setProduct({
            name: matched.name,
            brand: matched.brand,
            price: matched.price,
            description: matched.description,
            techSpecs: matched.techSpecs,
            image: matched.image,
            categoryId: serviceSlugParam,
          });
        } else {
          // Check fallback in baseServices if not in DB overrides
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

  // Translate category titles
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
          <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-black text-muted uppercase tracking-widest animate-pulse">
            {language === "nl" ? "Product laden..." : "Loading product..."}
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[80vh] bg-bg flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-black text-ink uppercase tracking-tight mb-4">
            {language === "nl" ? "Product niet gevonden" : "Product Not Found"}
          </h1>
          <p className="text-muted leading-relaxed mb-8">
            {language === "nl"
              ? "Het gezochte product kon niet worden gevonden of is momenteel niet leverbaar."
              : "The requested product could not be found or is currently unavailable."}
          </p>
          <Link
            href="/aanbod/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand text-white font-bold uppercase tracking-wider rounded-full hover:bg-brand-deep transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    <div className="bg-bg min-h-screen py-10 lg:py-20 px-5 lg:px-10">
      <div className="max-w-[1280px] mx-auto">
        
        {/* Breadcrumb / Back Navigation */}
        <Reveal>
          <div className="flex items-center gap-2.5 text-xs lg:text-sm text-muted/65 font-bold uppercase tracking-wider mb-8 lg:mb-12">
            <Link href="/aanbod/" className="hover:text-brand transition-colors">
              {language === "nl" ? "Aanbod" : "Catalog"}
            </Link>
            <span>/</span>
            <Link href={`/aanbod/?dienst=${product.categoryId}`} className="hover:text-brand transition-colors">
              {resolvedCategoryTitle}
            </Link>
            <span>/</span>
            <span className="text-ink truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
          </div>
        </Reveal>

        {/* E-Commerce Layout */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Panel: Large image frame */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <Reveal variant="scale" className="relative w-full aspect-[4/3] bg-white border border-hairline/60 rounded-[2rem] overflow-hidden flex items-center justify-center p-8 lg:p-12 shadow-md">
              <div className="relative w-full h-full max-w-[90%] max-h-[90%] group/img">
                <Image
                  src={resolveProductImage(product.image)}
                  alt={product.name}
                  fill
                  className="object-contain transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
              
              {/* Trust Badge overlay */}
              <div className="absolute bottom-5 left-5 bg-ink text-white px-4 py-2 rounded-xl text-[10px] lg:text-[11px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                <span>{language === "nl" ? "Vakkundige Montage Inbegrepen" : "Professional Installation Included"}</span>
              </div>
            </Reveal>
          </div>

          {/* Right Panel: E-Commerce store details */}
          <div className="lg:col-span-6 flex flex-col">
            <Reveal>
              <div className="flex items-center gap-4 mb-4">
                <div className="px-3.5 py-2 bg-white rounded-xl border border-hairline shadow-sm">
                  <BrandLogo brand={product.brand} imageSrc={brandImages[product.brand] ?? ""} height={18} />
                </div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-muted">
                  {product.brand}
                </span>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-ink uppercase tracking-tight leading-[1.05] mb-4">
                {product.name}
              </h1>
            </Reveal>

            <Reveal delay={140}>
              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-2xl sm:text-3xl font-black text-brand tracking-tight">
                  {product.price || (language === "nl" ? "Prijs op aanvraag" : "Price on request")}
                </span>
                {product.price && (
                  <span className="text-xs font-black uppercase tracking-widest text-muted/65">
                    {language === "nl" ? "Indicatieve prijs" : "Indicative price"}
                  </span>
                )}
              </div>
            </Reveal>

            <Reveal delay={200} className="mb-8">
              <Link
                href={quoteUrl}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 bg-brand text-white font-black uppercase tracking-[0.2em] rounded-full hover:bg-brand-deep hover:shadow-xl hover:shadow-brand/20 active:scale-[0.98] transition-all duration-300 shadow-lg text-center"
              >
                <span>{language === "nl" ? "Offerte Aanvragen" : "Request Quote"}</span>
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </Reveal>

            <Reveal delay={260} className="border-t border-hairline/60 pt-8 mb-8">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-muted/65 mb-3">
                {language === "nl" ? "Productbeschrijving" : "Product Description"}
              </h3>
              <p className="text-base text-copy/90 leading-relaxed font-medium">
                {product.description}
              </p>
            </Reveal>

            {/* Guarantees Box */}
            <Reveal delay={320} className="bg-mist border border-hairline rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-aurora-1 via-brand/40 to-aurora-2" />
              <h4 className="text-xs font-black uppercase tracking-widest text-brand mb-4">
                {language === "nl" ? "MMC Techniek Zekerheden" : "MMC Techniek Guarantees"}
              </h4>
              <ul className="grid sm:grid-cols-2 gap-4">
                {[
                  language === "nl" ? "100% Eigen vakteam" : "100% In-house specialists",
                  language === "nl" ? "Offerte binnen 24 uur" : "Quote within 24 hours",
                  language === "nl" ? "VCA & NEN-3140 gecertificeerd" : "VCA & NEN-3140 certified",
                  language === "nl" ? "Volledige installatiegarantie" : "Full installation warranty"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs font-black text-ink uppercase tracking-tight">
                    <svg className="w-4 h-4 text-brand shrink-0" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

          </div>
        </div>

        {/* Technical Specifications Section */}
        {product.techSpecs && product.techSpecs.length > 0 && (
          <div className="mt-16 lg:mt-24 border-t border-hairline/60 pt-16">
            <Reveal>
              <h2 className="font-display font-black text-2xl lg:text-3xl text-ink uppercase tracking-tight mb-8">
                {language === "nl" ? "Technische Specificaties" : "Technical Specifications"}
              </h2>
            </Reveal>

            <Reveal delay={80} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {product.techSpecs.map((spec, idx) => (
                <div key={idx} className="bg-white border border-hairline/50 rounded-2xl p-5 hover:border-brand/35 transition-all duration-300 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-xl bg-brand/5 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 01 1.043-3.296 3.746 3.746 0 01 3.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 01 3.296 1.043 3.746 3.746 0 01 1.043 3.296A3.745 3.745 0 0121 12Z" />
                    </svg>
                  </div>
                  <span className="text-xs lg:text-sm font-black text-ink uppercase tracking-tight leading-snug">
                    {spec}
                  </span>
                </div>
              ))}
            </Reveal>
          </div>
        )}

      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <div className="pt-[104px] lg:pt-[114px]">
      <Suspense fallback={
        <div className="min-h-screen bg-bg flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <ProductDetailContent />
      </Suspense>
    </div>
  );
}
