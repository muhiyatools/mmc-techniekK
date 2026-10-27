import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { JsonLd } from "@/components/site/JsonLd";
import { buildNav } from "@/components/site/nav";
import { Breadcrumbs, formatPrice, ProductCard } from "@/components/site/Page";
import { ProductGallery, VariantPicker } from "@/components/site/ProductView";
import { Icon } from "@/components/ui/Icon";
import { Markdown } from "@/components/ui/Markdown";
import { getProduct, getProducts, getProductSlugForLegacy, getServices, getSettings, publishedSlugs } from "@/lib/content";
import { href, locales, t, type Locale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/ui";
import { topicForService } from "@/lib/leads/options";
import { MediaClaims, mediaUrl } from "@/lib/media";
import { pageMeta, SITE_URL } from "@/lib/site";

// New items added in the admin (and old URLs) resolve on demand.
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await publishedSlugs("products");
  return locales.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/aanbod/[slug]">) {
  const { lang, slug } = (await params) as { lang: Locale; slug: string };
  const p = await getProduct(slug);
  if (!p) return {};
  return pageMeta(lang, `/aanbod/${slug}`, p.name, t(p.summary, lang), p.media ? mediaUrl(p.media) : undefined);
}

export default async function ProductPage({ params }: PageProps<"/[lang]/aanbod/[slug]">) {
  const { lang, slug } = (await params) as { lang: Locale; slug: string };
  const d = getDict(lang);
  const product = await getProduct(slug);
  if (!product) {
    const current = await getProductSlugForLegacy(slug);
    if (current) permanentRedirect(href(lang, `/aanbod/${current}`));
    notFound();
  }
  const [all, services, settings] = await Promise.all([getProducts(), getServices(), getSettings()]);
  const nav = buildNav(lang, services, settings);
  const price = formatPrice(product, lang);
  const images = [product.media, ...product.images].filter((m, i, arr) => m && arr.findIndex((x) => x?.id === m.id) === i) as NonNullable<typeof product.media>[];
  const specs = t<string[]>(product.specs, lang) ?? [];
  const variants = product.variants.map((v) => t(v, lang));
  const body = t(product.body, lang);
  const claims = new MediaClaims();
  images.forEach((m) => claims.claim(m));
  const related = all.filter((p) => p.service.slug === product.service.slug && p.id !== product.id).slice(0, 3);
  const topic = topicForService(product.service.slug);
  const quoteHref = `${href(lang, "/offerte")}?${topic ? `dienst=${topic}&` : ""}product=${product.slug}`;

  return (
    <>
      <section className="pb-[var(--section)] pt-8 sm:pt-12">
        <div className="wrap flex flex-col gap-8">
          <Breadcrumbs
            lang={lang}
            items={[
              { name: d.nav.home, path: "/" },
              { name: d.catalog.title, path: "/aanbod" },
              { name: product.name, path: `/aanbod/${product.slug}` },
            ]}
          />
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
            <div className="fade-up lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:self-start">
              <ProductGallery lang={lang} images={images} name={product.name} />
            </div>
            <div className="fade-up flex flex-col gap-8" style={{ "--d": "100ms" } as React.CSSProperties}>
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  {product.brands.map((b) =>
                    b.logo_path ? (
                      <Image key={b.id} src={b.logo_path} alt={b.name} width={120} height={28} className="h-6 w-auto opacity-70" />
                    ) : (
                      <span key={b.id} className="t-mono text-graphite">
                        {b.name}
                      </span>
                    ),
                  )}
                  <Link href={href(lang, `/diensten/${product.service.slug}`)} className="t-mono rounded-md bg-paper px-2.5 py-1.5 text-slate transition-colors hover:text-ink">
                    {t(product.service.title, lang)}
                  </Link>
                </div>
                <h1 className="t-h1 text-[clamp(34px,4.4vw,60px)]">{product.name}</h1>
                <p className="t-lead">{t(product.summary, lang)}</p>
              </div>

              <div className="flex flex-col gap-1 border-y border-line py-5">
                <span className="text-[22px] font-semibold">{price ?? d.catalog.priceOnRequest}</span>
                {price && t(product.price_note, lang) && <span className="text-sm text-graphite">{t(product.price_note, lang)}</span>}
              </div>

              <VariantPicker lang={lang} variants={variants} quoteHref={quoteHref} />

              <a href={`tel:${nav.phone}`} className="link self-start text-sm">
                {d.prefer} {d.cta.callNumber(nav.phoneDisplay)}
              </a>

              {specs.length > 0 && (
                <div className="flex flex-col gap-3 border-t border-line pt-6">
                  <h2 className="t-mono text-graphite">{d.catalog.specs}</h2>
                  <ul className="grid gap-x-6 sm:grid-cols-2">
                    {specs.map((s) => (
                      <li key={s} className="flex items-start gap-3 border-b border-line py-3 text-[15px] text-ink">
                        <Icon name="check" size={16} className="mt-1 text-blue" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {body && <Markdown text={body} />}
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-y bg-paper" aria-labelledby="related-title">
          <div className="wrap flex flex-col gap-10">
            <h2 id="related-title" className="t-h2" data-reveal>
              {d.catalog.related}
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <li key={p.id} data-reveal>
                  <ProductCard lang={lang} product={p} image={claims.pick(p.media, ...p.images)} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: t(product.summary, lang),
          brand: product.brands[0] ? { "@type": "Brand", name: product.brands[0].name } : undefined,
          image: images.map((m) => mediaUrl(m)),
          url: SITE_URL + href(lang, `/aanbod/${product.slug}`),
          ...(product.price_from
            ? { offers: { "@type": "AggregateOffer", priceCurrency: "EUR", lowPrice: product.price_from, highPrice: product.price_to ?? product.price_from, availability: "https://schema.org/InStock" } }
            : {}),
        }}
      />
    </>
  );
}
