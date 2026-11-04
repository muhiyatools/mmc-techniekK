import { Suspense } from "react";
import { CatalogGrid, type BrandOption, type CatalogItem, type PriceBounds } from "@/components/site/CatalogGrid";
import { siteNav } from "@/lib/nav";
import { CtaPanel, PageIntro, ProductCard } from "@/components/site/Page";
import { catalogCategories } from "@/lib/catalog";
import { getProducts, getServices, getSettings } from "@/lib/content";
import { type Locale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/ui";
import { logoSize, opticalSize } from "@/lib/logo-size";
import { MediaClaims } from "@/lib/media";
import { pageMeta } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/aanbod">) {
  const { lang } = (await params) as { lang: Locale };
  const d = getDict(lang);
  return pageMeta(lang, "/aanbod", d.catalog.title, d.catalog.lead);
}

export default async function CatalogPage({ params }: PageProps<"/[lang]/aanbod">) {
  const { lang } = (await params) as { lang: Locale };
  const d = getDict(lang);
  const [products, services, settings] = await Promise.all([getProducts(), getServices(), getSettings()]);
  const nav = await siteNav(lang, services, settings);

  // One photo once per page: a product sharing another's photo falls back to its gallery, then to its icon.
  const claims = new MediaClaims();
  const items: CatalogItem[] = products.map((p, i) => ({
    slug: p.slug,
    name: p.name,
    priceFrom: p.price_from,
    priceTo: p.price_to,
    service: p.service.slug,
    brands: p.brands.map((b) => b.slug),
    card: <ProductCard lang={lang} product={p} priority={i < 3} image={claims.pick(p.media, ...p.images)} />,
  }));
  // Every category we sell models for is listed, even before its first model is in.
  const categories = catalogCategories(lang, services, products);
  const brandMap = new Map(products.flatMap((p) => p.brands).map((b) => [b.slug, b]));
  const brandOptions: BrandOption[] = [...brandMap.values()]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((b) => {
      const size = b.logo_path ? opticalSize(logoSize(b.logo_path), 1900, 64, 30) : { w: 0, h: 0 };
      return { id: b.slug, label: b.name, logo: b.logo_path, w: size.w, h: size.h };
    });

  // Price slider range from the products that have a price; no prices, no slider.
  const prices = products.flatMap((p) => [p.price_from, p.price_to]).filter((n): n is number => typeof n === "number");
  let priceBounds: PriceBounds | null = null;
  if (prices.length) {
    const lo = Math.min(...prices);
    const hi = Math.max(...prices);
    const step = hi - lo > 5000 ? 100 : hi - lo > 1000 ? 50 : 10;
    priceBounds = { min: Math.floor(lo / step) * step, max: Math.max(Math.ceil(hi / step) * step, Math.floor(lo / step) * step + step), step };
  }

  return (
    <>
      <PageIntro
        lang={lang}
        crumbs={[
          { name: d.nav.home, path: "/" },
          { name: d.catalog.title, path: "/aanbod" },
        ]}
        title={d.catalog.title}
        lead={d.catalog.lead}
      />
      <section className="pb-[var(--section)]">
        <div className="wrap">
          <Suspense>
            <CatalogGrid lang={lang} items={items} categories={categories} brands={brandOptions} priceBounds={priceBounds} />
          </Suspense>
        </div>
      </section>
      <CtaPanel lang={lang} title={d.catalog.notSure} text={d.catalog.notSureText} phone={nav.phone} phoneDisplay={nav.phoneDisplay} />
    </>
  );
}
