import type { MetadataRoute } from "next";
import { publishedSlugs } from "@/lib/content";
import { href, locales } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, products, pages] = await Promise.all([publishedSlugs("services"), publishedSlugs("products"), publishedSlugs("pages")]);
  const legal = pages.filter((p) => ["privacy", "cookies", "algemene-voorwaarden"].includes(p));
  const paths = [
    "/",
    "/aanbod",
    "/zakelijk",
    "/over-ons",
    "/veelgestelde-vragen",
    "/offerte",
    "/contact",
    ...services.map((s) => `/diensten/${s}`),
    ...products.map((s) => `/aanbod/${s}`),
    ...legal.map((s) => `/${s}`),
  ];
  return paths.map((path) => ({
    url: SITE_URL + href("nl", path),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/diensten") || path === "/offerte" ? 0.8 : 0.6,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l === "nl" ? "nl-NL" : "en", SITE_URL + href(l, path)])) },
  }));
}
