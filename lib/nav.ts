import "server-only";
import { buildNav, type NavModel } from "@/components/site/nav";
import { getCatalogServiceSlugs } from "@/lib/content";
import type { Service, Settings } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n/config";

/**
 * Navigation for a page: the shared model, with each service pointing at either
 * its product category or its own page. Server-only because it reads which
 * services have products; the model itself stays serializable for the client.
 */
export async function siteNav(lang: Locale, services: Service[], settings: Settings): Promise<NavModel> {
  return buildNav(lang, services, settings, new Set(await getCatalogServiceSlugs()));
}
