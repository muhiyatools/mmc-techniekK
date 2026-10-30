import { href, type Locale } from "@/lib/i18n/config";

/**
 * Where a service link goes.
 *
 * A service with a product range leads straight into the catalogue, filtered to
 * that category. A service without models (maintenance, whole-home renovation)
 * has nothing to filter, so it keeps its own page.
 */
export function serviceHref(lang: Locale, slug: string, hasProducts: boolean): string {
  return hasProducts ? `${href(lang, "/aanbod")}?categorie=${slug}` : href(lang, `/diensten/${slug}`);
}

/** Slugs of the services that have at least one product, derived from the product list. */
export function productServiceSlugs(products: readonly { service: { slug: string } }[]): Set<string> {
  return new Set(products.map((p) => p.service.slug));
}
