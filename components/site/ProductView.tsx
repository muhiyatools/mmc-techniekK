"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Photo } from "@/components/ui/Photo";
import type { Media } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/ui";

/** Product gallery: one large image, thumbnails to switch. */
export function ProductGallery({ lang, images, name }: { lang: Locale; images: Media[]; name: string }) {
  const [active, setActive] = useState(0);
  const current = images[active];
  if (!current) {
    return <div className="aspect-square rounded-[var(--radius-card)] bg-paper" aria-hidden="true" />;
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-[var(--radius-card)] border border-line bg-white">
        <div key={current.id} className="fade-up absolute inset-8 sm:inset-12">
          <Photo media={current} lang={lang} sizes="(min-width: 1024px) 50vw, 100vw" priority={active === 0} fit="contain" quality={80} />
        </div>
      </div>
      {images.length > 1 && (
        <ul className="flex gap-2" aria-label={name}>
          {images.map((m, i) => (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-current={i === active}
                aria-label={`${i + 1} / ${images.length}`}
                className={`relative block size-20 overflow-hidden rounded-[var(--radius-sm)] border bg-white transition-[border-color,box-shadow] duration-[var(--dur-fast)] ${
                  i === active ? "border-blue shadow-[0_0_0_3px_var(--color-sky)]" : "border-line hover:border-line-strong"
                }`}
              >
                <span className="absolute inset-2">
                  <Photo media={m} lang={lang} sizes="80px" decorative fit="contain" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Variant picker that carries the choice into the quote link. */
export function VariantPicker({ lang, variants, quoteHref }: { lang: Locale; variants: string[]; quoteHref: string }) {
  const d = getDict(lang);
  const [variant, setVariant] = useState<string | null>(variants.length === 1 ? variants[0] : null);
  const url = variant ? `${quoteHref}&variant=${encodeURIComponent(variant)}` : quoteHref;
  return (
    <div className="flex flex-col gap-6">
      {variants.length > 0 && (
        <fieldset className="flex flex-col gap-3">
          <legend className="t-mono mb-3 text-graphite">{d.catalog.variants}</legend>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <button key={v} type="button" className="chip" aria-pressed={variant === v} onClick={() => setVariant(variant === v ? null : v)}>
                {v}
              </button>
            ))}
          </div>
        </fieldset>
      )}
      <a href={url} className="btn btn-primary self-start">
        <span>{d.cta.quoteForProduct}</span>
        <span className="knob">
          <Icon name="arrow" />
        </span>
      </a>
    </div>
  );
}
