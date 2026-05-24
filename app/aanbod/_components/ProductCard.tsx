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
      className="product-card-v1 rounded-lg overflow-hidden group cursor-pointer block border border-hairline hover:border-brand/40 transition-all duration-500"
    >
      {/* Mobile: compact vertical card (2-col grid) */}
      <div className="flex md:hidden flex-col bg-white overflow-hidden group flex-1">
        <div className="relative w-full aspect-square bg-concrete overflow-hidden">
          <Image src={resolveProductImage(product.image)} alt={product.name} fill className="object-contain p-2 group-hover:scale-105 transition-transform duration-500" sizes="50vw" />
          <span className="absolute top-2.5 left-2.5 bg-white/95 border border-hairline/50 px-2 py-1 rounded shadow-xs">
            <BrandLogo brand={product.brand} imageSrc={brandImages[product.brand] ?? ""} height={16} />
          </span>
          {product.price && (
            <span className="absolute bottom-2.5 right-2.5 bg-brand text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow-sm">
              {product.price}
            </span>
          )}
        </div>
        <div className="p-4 flex flex-col gap-1.5 flex-1">
          <h4 className="text-[14px] font-black text-ink leading-snug line-clamp-2 min-h-[2.8em]">
            {product.name}
          </h4>
          <div className="mt-auto pt-3 border-t border-hairline/50 flex items-center justify-between">
            <span className="text-[11px] font-black text-brand uppercase tracking-wider">
              {requestQuoteLabel}
            </span>
            <svg className="w-4 h-4 text-muted/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Desktop: vertical card */}
      <div className="hidden md:block">
        <div className="relative w-full aspect-square bg-concrete p-8">
          <Image src={resolveProductImage(product.image)} alt={product.name} fill className="object-contain p-8 transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-6 left-6 pointer-events-none">
            <div className="bg-surface/95 px-4 py-2.5 rounded-xl border border-hairline shadow-sm">
              <BrandLogo brand={product.brand} imageSrc={brandImages[product.brand] ?? ""} height={22} />
            </div>
          </div>
        </div>
        <div className="p-10">
          <div className="flex items-start justify-between gap-6 mb-5">
            <h4 className="font-display font-black text-2xl text-ink uppercase tracking-tight group-hover:text-brand transition-colors">
              {product.name}
            </h4>
            <span className="shrink-0 text-xl font-black text-ink tabular-nums leading-none pt-1">
              {product.price || "Prijs op aanvraag"}
            </span>
          </div>
          <p className="text-base text-muted/80 leading-relaxed mb-8 line-clamp-3 font-medium">{product.description}</p>

          <div className="grid grid-cols-2 gap-x-8 gap-y-5 mb-10 pb-10 border-b border-hairline">
            {product.techSpecs.slice(0, 4).map((spec, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center shrink-0 shadow-sm shadow-brand/5">
                  <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-[14px] font-black text-ink leading-tight uppercase tracking-tight">{spec}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[13px] font-black text-brand uppercase tracking-widest group-hover:gap-4 transition-all">
              <span>{requestQuoteLabel}</span>
              <svg className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
            <span className="text-[11px] font-black text-muted/40 uppercase tracking-[0.2em]">{todayQuoteLabel}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
