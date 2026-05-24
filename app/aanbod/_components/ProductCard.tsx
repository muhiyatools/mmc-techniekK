import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/data";
import BrandLogo from "@/app/_ui/BrandLogo";
import { resolveProductImage } from "@/lib/images";

interface ProductCardProps {
  product: Product;
  serviceSlug: string;
  brandImages: Record<string, string>;
  requestQuoteLabel: string;
  todayQuoteLabel: string;
}

export default function ProductCard({
  product,
  serviceSlug,
  brandImages,
  requestQuoteLabel,
  todayQuoteLabel,
}: ProductCardProps) {
  return (
    <Link
      href={`/contact?product=${encodeURIComponent(product.name)}&service=${serviceSlug}`}
      className="group flex flex-col bg-surface border border-hairline rounded-2xl overflow-hidden hover:border-brand/40 hover:shadow-2xl hover:shadow-brand/5 transition-all duration-500 cursor-pointer h-full"
    >
      {/* Mobile: horizontal-ish card layout */}
      <div className="md:hidden flex flex-row p-3 gap-4 items-center">
        <div className="relative w-24 h-24 bg-concrete rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
          <Image src={resolveProductImage(product.image)} alt={product.name} fill className="object-contain p-2 group-hover:scale-110 transition-transform duration-500" sizes="96px" />
        </div>
        <div className="flex flex-col justify-center flex-1 min-w-0">
          <BrandLogo brand={product.brand} imageSrc={brandImages[product.brand] ?? ""} height={14} className="mb-1 opacity-70" />
          <h4 className="text-sm font-black text-ink leading-tight truncate mb-1">
            {product.name}
          </h4>
          <span className="text-xs font-black text-brand mb-2">
            {product.price || "Prijs op aanvraag"}
          </span>
          <div className="flex items-center gap-1.5 text-[10px] font-black text-muted/80 uppercase tracking-widest">
            <span>{requestQuoteLabel}</span>
            <svg className="w-3 h-3 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Desktop: clean vertical card */}
      <div className="hidden md:flex flex-col flex-1">
        <div className="relative w-full aspect-[4/3] bg-concrete/50 flex items-center justify-center overflow-hidden border-b border-hairline/50 p-6">
          <div className="relative w-full h-full max-w-[80%] max-h-[80%]">
            <Image src={resolveProductImage(product.image)} alt={product.name} fill className="object-contain transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 1024px) 50vw, 33vw" />
          </div>
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-hairline/50 shadow-sm">
            <BrandLogo brand={product.brand} imageSrc={brandImages[product.brand] ?? ""} height={16} />
          </div>
        </div>
        
        <div className="p-6 flex flex-col flex-1">
          <div className="flex flex-col gap-2 mb-4">
            <h4 className="font-display font-black text-xl text-ink uppercase tracking-tight group-hover:text-brand transition-colors line-clamp-2 leading-tight">
              {product.name}
            </h4>
            <span className="text-lg font-black text-brand tabular-nums">
              {product.price || "Prijs op aanvraag"}
            </span>
          </div>
          
          <p className="text-sm text-muted/80 leading-relaxed mb-6 line-clamp-2 font-medium flex-1">
            {product.description}
          </p>

          <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-6 pb-6 border-b border-hairline/50">
            {product.techSpecs.slice(0, 4).map((spec, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-[11px] font-black text-ink leading-tight uppercase tracking-tight truncate" title={spec}>{spec}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2.5 text-xs font-black text-brand uppercase tracking-widest group-hover:gap-3 transition-all">
              <span>{requestQuoteLabel}</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
