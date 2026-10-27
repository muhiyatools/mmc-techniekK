import { Suspense } from "react";
import { CatalogGrid, type CatalogItem } from "@/components/site/CatalogGrid";
import { buildNav } from "@/components/site/nav";
import { CtaPanel, PageIntro, ProductCard } from "@/components/site/Page";
import { getProducts, getServices, getSettings } from "@/lib/content";
import { t, type Locale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/ui";
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
  const nav = buildNav(lang, services, settings);

  // One photo once per page: a product sharing another's photo falls back to its gallery, then to its icon.
  const claims = new MediaClaims();
  const items: CatalogItem[] = products.map((p, i) => ({
    slug: p.slug,
    service: p.service.slug,
    brands: p.brands.map((b) => b.slug),
    card: <ProductCard lang={lang} product={p} priority={i < 3} image={claims.pick(p.media, ...p.images)} />,
  }));
  const serviceOptions = services
    .map((s) => ({ id: s.slug, label: t(s.title, lang), count: products.filter((p) => p.service.slug === s.slug).length }))
    .filter((s) => s.count > 0);
  const brandMap = new Map(products.flatMap((p) => p.brands).map((b) => [b.slug, b.name]));
  const brandOptions = [...brandMap].map(([id, label]) => ({ id, label, count: products.filter((p) => p.brands.some((b) => b.slug === id)).length }));

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
            <CatalogGrid lang={lang} items={items} services={serviceOptions} brands={brandOptions} />
          </Suspense>
        </div>
      </section>
      <CtaPanel lang={lang} title={d.catalog.notSure} text={d.catalog.notSureText} phone={nav.phone} phoneDisplay={nav.phoneDisplay} />
    </>
  );
}
