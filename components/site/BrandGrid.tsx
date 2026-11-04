import Image from "next/image";
import Link from "next/link";
import type { Brand } from "@/lib/content/types";
import { href, type Locale } from "@/lib/i18n/config";
import { logoSize, opticalSize } from "@/lib/logo-size";

const WIDE = { 4: "lg:[--cols:4]", 5: "lg:[--cols:5]", 6: "lg:[--cols:6]", 7: "lg:[--cols:7]", 8: "lg:[--cols:8]" } as const;
const WIDER = { 4: "xl:[--cols:4]", 5: "xl:[--cols:5]", 6: "xl:[--cols:6]", 7: "xl:[--cols:7]", 8: "xl:[--cols:8]", 10: "xl:[--cols:10]" } as const;

/** A column count (4 to 8) that fills the last row; the largest one that divides the number of brands. */
function columnsFor(n: number, max: 6 | 8): keyof typeof WIDE {
  for (let c = max; c >= 4; c--) if (n % c === 0) return c as keyof typeof WIDE;
  return max === 8 ? 6 : 5;
}

/**
 * Brands as a hairline grid of logo cells.
 *
 * Logos are normalised by aspect ratio (equal optical weight), rest at 55% and
 * come to full strength on hover. A supplier with products links to the catalogue
 * filtered on that brand; clients are not links.
 */
export function BrandGrid({
  lang,
  brands,
  linkable,
  label,
  action,
}: {
  lang: Locale;
  brands: Brand[];
  /** Slugs of brands that have products in the catalogue. */
  linkable?: ReadonlySet<string>;
  label?: string;
  action?: React.ReactNode;
}) {
  if (!brands.length) return null;
  const lg = columnsFor(brands.length, 6);
  const xl = columnsFor(brands.length, 8);
  return (
    <div className="flex flex-col gap-5">
      {(label || action) && (
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          {label && <h2 className="t-mono text-graphite">{label}</h2>}
          {action}
        </div>
      )}
      <ul
        className={`grid grid-cols-[repeat(var(--cols),minmax(0,1fr))] border-l border-t border-line [--cols:3] [--s:0.72] min-[480px]:[--s:0.85] md:[--cols:4] md:[--s:0.95] ${WIDE[lg]} lg:[--s:1] ${WIDER[xl as keyof typeof WIDER]} 3xl:[--s:1.15]`}
      >
        {brands.map((b, i) => {
          const to = b.kind === "supplier" && linkable?.has(b.slug) ? `${href(lang, "/aanbod")}?merk=${b.slug}` : null;
          const size = b.logo_path ? opticalSize(logoSize(b.logo_path)) : null;
          const inner = (
            <>
              <span className="flex h-[calc(54px*var(--s))] items-center sm:h-[calc(58px*var(--s))]">
              {b.logo_path && size ? (
                <Image
                  src={b.logo_path}
                  alt=""
                  width={size.w * 2}
                  height={size.h * 2}
                  className="opacity-55 transition-opacity duration-[var(--dur)] ease-[var(--ease-out)] group-hover:opacity-100 group-focus-visible:opacity-100"
                  style={{ width: `calc(${size.w}px * var(--s))`, height: "auto" }}
                />
              ) : (
                <span className="text-[15px] font-semibold text-slate">{b.name}</span>
              )}
              </span>
              <span className="t-mono max-w-full truncate text-[10px] text-graphite max-sm:sr-only">{b.name}</span>
            </>
          );
          const cell =
            "group flex h-[96px] flex-col items-center justify-center gap-1.5 px-3 text-center transition-colors duration-[var(--dur)] ease-[var(--ease-out)] sm:h-[116px] 3xl:h-[136px]";
          return (
            <li key={b.id} data-reveal style={{ "--i": Math.min(i, 12) } as React.CSSProperties} className="border-b border-r border-line">
              {to ? (
                <Link href={to} className={`${cell} hover:bg-paper focus-visible:bg-paper`} aria-label={b.name}>
                  {inner}
                </Link>
              ) : (
                <div className={`${cell} ${b.kind === "supplier" ? "hover:bg-paper" : ""}`}>{inner}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
