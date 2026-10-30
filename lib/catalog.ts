import type { Product, Service } from "@/lib/content/types";
import { t, type Locale } from "@/lib/i18n/config";

/**
 * Services that carry a product range.
 *
 * Listed by slug so a category is on the catalogue page before its first model
 * is entered in the admin. Services nobody buys a model for (maintenance,
 * whole-home renovation) stay out of the catalogue by design.
 */
export const PRODUCT_SERVICE_SLUGS: readonly string[] = ["zonnepanelen", "warmtepompen", "thuisbatterij", "airconditioning", "meterkast"];

export type CatalogCategory = {
  slug: string;
  label: string;
  /** Number of models listed under this category. */
  count: number;
};

/**
 * Every catalogue category, in the order the services are sorted.
 * A service that has products but is not on the list above is still shown, so a
 * new product never disappears from the filters.
 */
export function catalogCategories(lang: Locale, services: readonly Pick<Service, "slug" | "title">[], products: readonly Product[]): CatalogCategory[] {
  const counts = new Map<string, number>();
  for (const p of products) counts.set(p.service.slug, (counts.get(p.service.slug) ?? 0) + 1);
  return services
    .filter((s) => PRODUCT_SERVICE_SLUGS.includes(s.slug) || counts.has(s.slug))
    .map((s) => ({ slug: s.slug, label: t(s.title, lang), count: counts.get(s.slug) ?? 0 }));
}
