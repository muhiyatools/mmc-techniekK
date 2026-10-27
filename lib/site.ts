import type { Metadata } from "next";
import { href, locales, type Locale } from "@/lib/i18n/config";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mmctechniek.nl").replace(/\/$/, "");

/** Canonical + hreflang alternates for a path that exists in every locale. */
export function alternates(lang: Locale, path: string): Metadata["alternates"] {
  return {
    canonical: href(lang, path),
    languages: { ...Object.fromEntries(locales.map((l) => [l === "nl" ? "nl-NL" : "en", href(l, path)])), "x-default": href("nl", path) },
  };
}

/** Standard page metadata: title, description, canonical, hreflang, OG. */
export function pageMeta(lang: Locale, path: string, title: string, description: string, image?: string): Metadata {
  return {
    title,
    description,
    alternates: alternates(lang, path),
    openGraph: { title, description, url: href(lang, path), ...(image ? { images: [{ url: image, width: 1200, height: 630 }] } : {}) },
  };
}
