"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { fetchAdminStore, mergeBrandImages } from "@/lib/adminStore";
import { services as baseServices, brandImages as baseBrandImages, contactInfo, type Product } from "@/lib/data";
import { resolveProductImage } from "@/lib/images";
import Reveal from "@/app/_ui/Reveal";
import BrandLogo from "@/app/_ui/BrandLogo";

// Helper to resolve product sizes based on category/name
const getProductSizes = (product: Product): string[] => {
  if (product.sizes && product.sizes.length > 0) {
    return product.sizes;
  }
  
  const category = (product.categoryId || "").toLowerCase();
  const name = (product.name || "").toLowerCase();
  
  if (category.includes("airco") || name.includes("airco") || name.includes("airconditioning") || name.includes("split")) {
    return ["2.5 kW (9000 BTU)", "3.5 kW (12000 BTU)", "5.0 kW (18000 BTU)", "7.0 kW (24000 BTU)"];
  }
  if (category.includes("zonnepaneel") || name.includes("zonnepaneel") || name.includes("solar")) {
    return ["430 Wp Mono", "440 Wp N-Type", "450 Wp Full Black"];
  }
  if (category.includes("batterij") || name.includes("batterij") || name.includes("accu") || name.includes("opslag")) {
    return ["5.0 kWh", "10.0 kWh", "15.0 kWh", "20.0 kWh"];
  }
  if (category.includes("warmtepomp") || name.includes("warmtepomp") || name.includes("weheat") || name.includes("remeha")) {
    return ["4 kW (Hybride)", "6 kW", "8 kW (All-Electric)", "12 kW", "16 kW"];
  }
  if (category.includes("meterkast") || name.includes("meterkast") || name.includes("groepenkast")) {
    return ["1-Fase (12 Groepen)", "3-Fase (Krachtstroom)", "3-Fase + Laadpaal groep"];
  }
  
  return ["Standaardmaat", "Op maat gemaakt"];
};

function ProductDetailContent() {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const productNameParam = searchParams.get("name");
  const serviceSlugParam = searchParams.get("service");

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [brandImages, setBrandImages] = useState<Record<string, string>>(baseBrandImages);
  const [activeImage, setActiveImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      const sizes = getProductSizes(product);
      if (sizes.length > 0) {
        setSelectedSize(sizes[0]);
      }
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
            sizes: matched.sizes || [],
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
        <div className="text-center max-w-md bg-white border border-hairline p-8 rounded-3xl shadow-sm">
          <div className="w-12 h-12 bg-brand/5 text-brand rounded-full flex items-center justify-center mx-auto mb-6 border border-brand/10">
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
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            {language === "nl" ? "Terug naar aanbod" : "Back to catalog"}
          </Link>
        </div>
      </div>
    );
  }

  // Parse descriptions: Support "short --- long" or first paragraph split
  const descParts = product.description.split("---");
  let shortDesc = "";
  let longDesc = "";

  if (descParts.length > 1) {
    shortDesc = descParts[0].trim();
    longDesc = descParts[1].trim();
  } else {
    const paragraphIndex = product.description.indexOf("\n\n");
    if (paragraphIndex !== -1) {
      shortDesc = product.description.substring(0, paragraphIndex).trim();
      longDesc = product.description.substring(paragraphIndex).trim();
    } else {
      shortDesc = product.description;
      longDesc = "";
    }
  }

  const productSizes = getProductSizes(product);
  const quoteUrl = `/contact/?product=${encodeURIComponent(product.name)}&service=${product.categoryId}${selectedSize ? `&size=${encodeURIComponent(selectedSize)}` : ""}`;
  const resolvedCategoryTitle = getCategoryTitle(product.categoryId);

  return (
    <div className="bg-bg min-h-screen py-6 lg:py-16 px-4 sm:px-6 lg:px-12 xl:px-16 pb-28 md:pb-16">
      <div className="max-w-7xl mx-auto">
        
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start mb-12 lg:mb-20">
          
          {/* Left Panel: Gallery, Short Description, and Sizes */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Active Image Frame */}
            <Reveal variant="scale" className="relative w-full aspect-square bg-white border border-hairline rounded-3xl overflow-hidden flex items-center justify-center p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.015)] group">
              {/* Optional Top Edge Gradient Accent for Precision Brand Vibe */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--color-aurora-1)] via-[var(--color-brand)] to-[var(--color-aurora-2)] z-10" />
              <div className="relative w-full h-full max-w-[85%] max-h-[85%]">
                <Image
                  src={resolveProductImage(activeImage || product.image)}
                  alt={product.name}
                  fill
                  className="object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </Reveal>

            {/* Gallery Thumbnails */}
            {product.images && product.images.length > 0 && (
              <Reveal delay={100} className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
                {[product.image, ...product.images].map((img, i) => {
                  const isSelected = activeImage === img;
                  return (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-16 h-16 bg-white border rounded-xl overflow-hidden p-1.5 transition-all duration-300 cursor-pointer ${
                        isSelected ? "border-brand ring-2 ring-brand/35 scale-95 shadow-md" : "border-hairline hover:border-brand/40"
                      }`}
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={resolveProductImage(img)}
                          alt=""
                          fill
                          className="object-contain rounded-lg"
                          sizes="80px"
                        />
                      </div>
                    </button>
                  );
                })}
              </Reveal>
            )}

            {/* Under-Gallery Smart card (Highlight Description + Sizes) */}
            <Reveal delay={150} className="bg-white border border-hairline rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.01)] flex flex-col gap-6">
              
              {/* Product Highlights Section */}
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted/65 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                  {language === "nl" ? "Product highlights" : "Product Highlights"}
                </h3>
                <div className="text-[15px] text-copy leading-relaxed font-bold space-y-4">
                  {shortDesc}
                </div>
              </div>

              {/* Separator line */}
              <div className="h-[1px] bg-hairline" />

              {/* Sizes Available Selector */}
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted/65 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                  {language === "nl" ? "Beschikbare maten / capaciteiten" : "Available Sizes & Capacities"}
                </h3>
                <p className="text-[11px] text-muted/70 font-semibold mb-3">
                  {language === "nl" 
                    ? "Selecteer de gewenste specificatie voor uw offerteaanvraag:"
                    : "Select the desired specification for your quote request:"}
                </p>
                
                <div className="flex flex-wrap gap-2.5 mt-2">
                  {productSizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-3 px-5 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer border ${
                          isSelected
                            ? "bg-brand border-brand text-white shadow-md shadow-brand/20 scale-[0.98]"
                            : "bg-concrete/40 hover:bg-concrete border-hairline text-ink"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

            </Reveal>

          </div>

          {/* Right Panel: Clean Typography & Detailed Info */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-[140px] pt-2 lg:pt-0">
            
            {/* Header Block: Category & Brand Logo */}
            <Reveal className="bg-white border border-hairline rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-hairline">
                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-brand">
                  {resolvedCategoryTitle}
                </span>
                {brandImages[product.brand] && (
                  <div className="opacity-90 max-h-[22px]">
                    <BrandLogo brand={product.brand} imageSrc={brandImages[product.brand]} height={18} />
                  </div>
                )}
              </div>
              
              {/* Product Title */}
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-[40px] text-ink uppercase tracking-tight leading-[1.05]">
                {product.name}
              </h1>
            </Reveal>

            {/* Price tag card */}
            <Reveal delay={60} className="bg-white border border-hairline rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.01)] flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted/60">
                  {product.price ? (language === "nl" ? "Richtprijs incl. montage" : "Guide price incl. installation") : (language === "nl" ? "Kostenindicatie" : "Estimated Cost")}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-ink tracking-tight tabular-nums">
                  {product.price || (language === "nl" ? "Prijs op aanvraag" : "Price on request")}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-brand/5 border border-brand/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h.007m-.007 3h.007m-.007 3h.007m-1.5-6h15.75c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125H3.75a1.125 1.125 0 01-1.125-1.125V5.625c0-.621.504-1.125 1.125-1.125z" />
                </svg>
              </div>
            </Reveal>

            {/* Call To Actions Block */}
            <Reveal delay={120} className="flex flex-col gap-3">
              <Link
                href={quoteUrl}
                className="w-full py-4.5 bg-brand text-white text-xs font-black uppercase tracking-[0.2em] rounded-full hover:bg-brand-deep hover:shadow-lg hover:shadow-brand/20 transition-all duration-300 text-center flex items-center justify-center gap-3 active:scale-[0.99] cursor-pointer"
              >
                <span>{language === "nl" ? "Offerte Aanvragen" : "Request Quote"}</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>

              <a
                href={`tel:${contactInfo.phone}`}
                className="w-full py-4 border border-ink/20 hover:border-brand hover:text-brand bg-white text-ink text-xs font-black uppercase tracking-[0.2em] rounded-full transition-all duration-300 text-center flex items-center justify-center gap-3 active:scale-[0.99]"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{language === "nl" ? "Bel voor advies" : "Call for advice"}</span>
              </a>
            </Reveal>

            {/* Detailed Description Block */}
            {longDesc && (
              <Reveal delay={180} className="bg-white border border-hairline rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-muted/65 mb-4">
                  {language === "nl" ? "Uitgebreide omschrijving" : "Detailed Description"}
                </h2>
                <div className="text-sm sm:text-[15px] text-copy leading-relaxed font-bold space-y-4 whitespace-pre-line font-bold">
                  {longDesc}
                </div>
              </Reveal>
            )}

            {/* Trust Points (Compact Dutch trust signals) */}
            <Reveal delay={240} className="bg-white border border-hairline rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
              <div className="grid sm:grid-cols-2 gap-y-4 gap-x-6">
                {[
                  { 
                    label: language === "nl" ? "100% Eigen vakteam" : "100% In-house specialists",
                    desc: language === "nl" ? "Gecertificeerde monteurs." : "Certified technicians."
                  },
                  { 
                    label: language === "nl" ? "Offerte binnen 24 uur" : "Quote within 24 hours",
                    desc: language === "nl" ? "Snel duidelijkheid." : "Fast and clear pricing."
                  },
                  { 
                    label: language === "nl" ? "Veilig & Gecertificeerd" : "Safe & Certified",
                    desc: language === "nl" ? "NEN-3140 & VCA normen." : "Strict NEN-3140 and VCA."
                  },
                  { 
                    label: language === "nl" ? "Volledige garantie" : "Full warranty",
                    desc: language === "nl" ? "Jarenlang zorgeloos comfort." : "Guaranteed comfort."
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
              <h2 className="font-display font-extrabold text-xl lg:text-2xl text-ink uppercase tracking-tight mb-6 lg:mb-8 flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand" />
                {language === "nl" ? "Technische Specificaties" : "Technical Specifications"}
              </h2>
            </Reveal>

            <Reveal delay={80} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {product.techSpecs.map((spec, idx) => (
                <div key={idx} className="bg-white border border-hairline rounded-2xl p-4.5 hover:border-brand/40 transition-colors duration-300 flex items-center gap-3.5 shadow-[0_4px_20px_rgb(0,0,0,0.005)]">
                  <div className="w-6 h-6 rounded-lg bg-concrete border border-hairline/50 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-brand" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <span className="text-[11px] lg:text-xs font-black text-ink uppercase tracking-tight leading-snug font-bold">
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
          className="px-5 py-3 bg-brand text-white text-[10px] font-black uppercase tracking-wider rounded-full hover:bg-brand-deep active:scale-98 transition-all shrink-0 cursor-pointer"
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
