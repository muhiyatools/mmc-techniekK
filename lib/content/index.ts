import "server-only";
import { unstable_cache } from "next/cache";
import { draftMode } from "next/headers";
import { cache } from "react";
import { publicDb } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";
import type { Brand, Faq, HomeContent, Media, Page, Product, Review, Service, Settings, TeamMember } from "./types";

export type * from "./types";

/** Cache tags, one per table. Admin saves revalidate the matching tag. */
export const TAGS = {
  services: "services",
  products: "products",
  brands: "brands",
  reviews: "reviews",
  faqs: "faqs",
  team: "team",
  pages: "pages",
  home: "home",
  settings: "settings",
  media: "media",
} as const;

type Db = typeof publicDb;

/**
 * Run a read against the cached public client, or (in draft mode) live against the
 * signed-in editor's session so drafts show up in the preview.
 *
 * The one-minute window is a safety net, not the invalidation mechanism: admin
 * saves expire the matching tag immediately (see lib/admin/content-actions.ts), so
 * an edit is visible on the next request. The window only covers writes that never
 * went through the app, such as a bulk import straight into Supabase.
 */
export const REVALIDATE_SECONDS = 60;

function cached<A extends unknown[], R>(key: string, tags: string[], fn: (db: Db, ...args: A) => Promise<R>) {
  const live = unstable_cache((...args: A) => fn(publicDb, ...args), [key], { tags: [...tags, TAGS.media], revalidate: REVALIDATE_SECONDS });
  return cache(async (...args: A): Promise<R> => {
    const { isEnabled } = await draftMode();
    if (isEnabled) return fn((await createClient()) as unknown as Db, ...args);
    return live(...args);
  });
}

function must<T>(res: { data: T | null; error: { message: string } | null }, what: string): T {
  if (res.error) throw new Error(`${what}: ${res.error.message}`);
  return res.data as T;
}

const MEDIA = "id, bucket, path, width, height, dominant_color, alt, focal_x, focal_y";
const SERVICE = `id, slug, sort_order, title, kicker, summary, body, audience, steps, tags, seo_description, hero:media!services_hero_media_id_fkey(${MEDIA})`;
const BRAND = "id, slug, name, kind, logo_path, website, show_in_strip, sort_order";
const PRODUCT = `id, slug, name, sort_order, tier, summary, body, specs, variants, price_from, price_to, price_note, legacy_slugs,
  media:media!products_media_id_fkey(${MEDIA}),
  product_images(sort_order, media(${MEDIA})),
  product_brands(brands(${BRAND})),
  service:services!products_service_id_fkey(id, slug, title, kicker)`;
type Raw = Record<string, unknown>;
const bySort = (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order;

function toProduct(r: Raw): Product {
  const imgs = ((r.product_images as { sort_order: number; media: Media }[]) ?? []).sort(bySort).map((i) => i.media);
  const brands = ((r.product_brands as { brands: Brand | null }[]) ?? []).map((b) => b.brands).filter(Boolean) as Brand[];
  const rest = { ...r };
  delete rest.product_images;
  delete rest.product_brands;
  return { ...(rest as unknown as Product), images: imgs, brands };
}

/** Published slugs for generateStaticParams (runs at build time, so no draftMode). */
export async function publishedSlugs(table: "services" | "products" | "pages"): Promise<string[]> {
  const rows = must(await publicDb.from(table).select("slug").eq("status", "published"), `${table} slugs`) as { slug: string }[];
  return rows.map((r) => r.slug);
}

// ---------------------------------------------------------------- readers

export const getServices = cached("services", [TAGS.services], async (db) =>
  must(await db.from("services").select(SERVICE).eq("status", "published").order("sort_order"), "services") as unknown as Service[],
);

export const getService = cached("service", [TAGS.services], async (db, slug: string) =>
  must(await db.from("services").select(SERVICE).eq("slug", slug).maybeSingle(), "service") as unknown as Service | null,
);

export const getBrands = cached("brands", [TAGS.brands], async (db) =>
  must(await db.from("brands").select(BRAND).eq("status", "published").order("sort_order"), "brands") as Brand[],
);

export const getProducts = cached("products", [TAGS.products, TAGS.brands, TAGS.services], async (db) =>
  (must(await db.from("products").select(PRODUCT).eq("status", "published").order("sort_order"), "products") as Raw[]).map(toProduct),
);

export const getProduct = cached("product", [TAGS.products, TAGS.brands, TAGS.services], async (db, slug: string) => {
  const row = must(await db.from("products").select(PRODUCT).eq("slug", slug).maybeSingle(), "product") as Raw | null;
  return row ? toProduct(row) : null;
});

/** Slugs of the services that have at least one published product. */
export const getCatalogServiceSlugs = cached("catalog-service-slugs", [TAGS.products, TAGS.services], async (db) => {
  const rows = must(await db.from("products").select("service:services!products_service_id_fkey(slug)").eq("status", "published"), "catalog services") as {
    service: { slug: string } | null;
  }[];
  return [...new Set(rows.map((r) => r.service?.slug).filter(Boolean) as string[])];
});

/** Current slug for an old product URL (renamed or merged products keep their old slugs). */
export const getProductSlugForLegacy = cached("product-legacy", [TAGS.products], async (db, slug: string) => {
  const row = must(
    await db.from("products").select("slug").eq("status", "published").contains("legacy_slugs", [slug]).limit(1).maybeSingle(),
    "product legacy",
  ) as { slug: string } | null;
  return row?.slug ?? null;
});

export const getReviews = cached("reviews", [TAGS.reviews], async (db) =>
  must(await db.from("reviews").select("id, author, place, body, rating, source").eq("status", "published").order("sort_order"), "reviews") as Review[],
);

export const getFaqs = cached("faqs", [TAGS.faqs, TAGS.services], async (db) => {
  const rows = must(
    await db.from("faqs").select("id, question, answer, featured, services(slug)").eq("status", "published").order("sort_order"),
    "faqs",
  ) as unknown as (Omit<Faq, "service_slug"> & { services: { slug: string } | null })[];
  return rows.map(({ services, ...f }) => ({ ...f, service_slug: services?.slug ?? null })) as Faq[];
});

export const getTeam = cached("team", [TAGS.team], async (db) =>
  must(
    await db.from("team_members").select(`id, name, role, bio, media:media!team_members_media_id_fkey(${MEDIA})`).eq("status", "published").order("sort_order"),
    "team",
  ) as unknown as TeamMember[],
);

export const getPage = cached("page", [TAGS.pages], async (db, slug: string) =>
  must(await db.from("pages").select("slug, title, body, seo_description").eq("slug", slug).eq("status", "published").maybeSingle(), "page") as Page | null,
);

export const getPublishedPageSlugs = cached("page-slugs", [TAGS.pages], async (db) =>
  (must(await db.from("pages").select("slug").eq("status", "published"), "page slugs") as { slug: string }[]).map((p) => p.slug),
);

export const getHome = cached("home", [TAGS.home], async (db) => {
  const rows = must(await db.from("home_sections").select("key, content"), "home") as { key: string; content: unknown }[];
  return Object.fromEntries(rows.map((r) => [r.key, r.content])) as HomeContent;
});

export const getSettings = cached("settings", [TAGS.settings], async (db) => {
  const rows = must(await db.from("site_settings").select("key, value"), "settings") as { key: string; value: unknown }[];
  return Object.fromEntries(rows.map((r) => [r.key, r.value])) as Settings;
});

/** Media rows by storage path (for pages that pick a specific photo), in the order asked. */
export const getMediaByPaths = cached("media-by-paths", [TAGS.media], async (db, paths: string[]) => {
  if (!paths.length) return [] as Media[];
  const rows = must(await db.from("media").select(MEDIA).in("path", paths), "media by path") as unknown as Media[];
  return paths.map((p) => rows.find((m) => m.path === p)).filter(Boolean) as Media[];
});

export const getMediaByIds = cached("media-by-ids", [TAGS.media], async (db, ids: string[]) => {
  if (!ids.length) return [] as Media[];
  const rows = must(await db.from("media").select(MEDIA).in("id", ids), "media") as unknown as Media[];
  return ids.map((id) => rows.find((m) => m.id === id)).filter(Boolean) as Media[];
});
