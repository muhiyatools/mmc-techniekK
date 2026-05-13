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
      className="product-card-v1 rounded-lg overflow-hidden group cursor-pointer block"
    >
      {/* Mobile: compact vertical card (2-col grid) */}
      <div className="flex md:hidden flex-col bg-white border border-hairline overflow-hidden group flex-1">
        <div className="relative aspect-[4/3] bg-concrete overflow-hidden">
          <Image src={resolveProductImage(product.image)} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="50vw" />
          <span className="absolute top-2.5 left-2.5 bg-white/95 border border-hairline/50 px-1.5 py-1 rounded shadow-xs">
            <BrandLogo brand={product.brand} imageSrc={brandImages[product.brand] ?? ""} height={14} />
          </span>
          {product.price && (
            <span className="absolute bottom-2.5 right-2.5 bg-brand text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-sm">
              {product.price}
            </span>
          )}
        </div>
        <div className="p-2.5 flex flex-col gap-1 flex-1">
          <h4 className="text-[11px] font-bold text-ink leading-snug line-clamp-2 min-h-[2.2em]">
            {product.name}
          </h4>
          <div className="mt-auto pt-1.5 border-t border-hairline/50 flex items-center justify-between">
            <span className="text-[9px] font-bold text-brand uppercase tracking-wider">
              {requestQuoteLabel}
            </span>
            <svg className="w-3 h-3 text-muted/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Desktop: vertical card */}
      <div className="hidden md:block">
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
              {product.price || "P.O.A."}
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
              <span>{requestQuoteLabel}</span>
              <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
            <span className="text-[9px] font-bold text-muted/60 uppercase tracking-wider">{todayQuoteLabel}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
