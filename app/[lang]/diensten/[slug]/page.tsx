import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteNav } from "@/lib/nav";
import { CtaPanel, PageIntro, ProductCard } from "@/components/site/Page";
import { ServiceDiagram } from "@/components/site/ServiceDiagram";
import { SolarCoverage } from "@/components/site/SolarCoverage";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Markdown } from "@/components/ui/Markdown";
import { Photo } from "@/components/ui/Photo";
import { getFaqs, getProducts, getService, getServices, getSettings, publishedSlugs } from "@/lib/content";
import type { Brand } from "@/lib/content/types";
import { href, locales, t, type Locale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/ui";
import { MediaClaims } from "@/lib/media";
import { pageMeta } from "@/lib/site";

// New items added in the admin (and old URLs) resolve on demand.
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await publishedSlugs("services");
  return locales.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/diensten/[slug]">) {
  const { lang, slug } = (await params) as { lang: Locale; slug: string };
  const s = await getService(slug);
  if (!s) return {};
  return pageMeta(lang, `/diensten/${slug}`, t(s.title, lang), t(s.seo_description, lang) || t(s.summary, lang));
}

export default async function ServicePage({ params }: PageProps<"/[lang]/diensten/[slug]">) {
  const { lang, slug } = (await params) as { lang: Locale; slug: string };
  const d = getDict(lang);
  const [service, services, products, faqs, settings] = await Promise.all([getService(slug), getServices(), getProducts(), getFaqs(), getSettings()]);
  if (!service) notFound();
  const nav = await siteNav(lang, services, settings);
  const title = t(service.title, lang);
  const claims = new MediaClaims();
  const hero = claims.claim(service.hero);

  const own = products.filter((p) => p.service.slug === slug);
  const brands = [...new Map(own.flatMap((p) => p.brands).map((b) => [b.id, b])).values()] as Brand[];
  const serviceFaqs = faqs.filter((f) => f.service_slug === slug);
  const tags = t<string[]>(service.tags, lang) ?? [];
  const quoteHref = `${href(lang, "/offerte")}?dienst=${slug}`;

  return (
    <>
      <PageIntro
        lang={lang}
        crumbs={[
          { name: d.nav.home, path: "/" },
          { name: d.nav.services, path: "/#diensten" },
          { name: title, path: `/diensten/${slug}` },
        ]}
        title={title}
        lead={t(service.summary, lang)}
        aside={
          <>
            <ButtonLink href={quoteHref}>{d.cta.quote}</ButtonLink>
            <a href={`tel:${nav.phone}`} className="link self-start text-sm">
              {d.cta.callNumber(nav.phoneDisplay)}
            </a>
          </>
        }
      />

      {/* Photo, or the loop position when there's no real photo yet */}
      <section className="pb-[var(--section)]">
        <div className="wrap">
          {hero ? (
            <div className="tile fade-up relative aspect-[4/3] rounded-[var(--radius-tile)] sm:aspect-[21/9] sm:rounded-[var(--radius-card)]" style={{ "--d": "160ms" } as React.CSSProperties}>
              <Photo media={hero} lang={lang} priority sizes="(min-width: 1440px) 88vw, 100vw" quality={80} />
              <span className="t-mono spec-tag absolute bottom-4 left-4">{t(service.kicker, lang)}</span>
            </div>
          ) : (
            <div className="fade-up grid items-center gap-8 rounded-[var(--radius-card)] bg-paper p-8 sm:grid-cols-[minmax(0,1fr)_320px] sm:p-14" style={{ "--d": "160ms" } as React.CSSProperties}>
              <div className="flex max-w-[520px] flex-col gap-4">
                <span className="t-mono text-graphite">{t(service.kicker, lang)}</span>
                <p className="t-h3 text-[clamp(22px,2.4vw,30px)] leading-snug">{t(service.audience, lang)}</p>
              </div>
              <ServiceDiagram slugs={services.map((s) => s.slug)} active={slug} label={title} />
            </div>
          )}
        </div>
      </section>

      {/* What it is + who it's for */}
      <section className="pb-[var(--section)]">
        <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-20">
          <div data-reveal>
            <Markdown text={t(service.body, lang)} className="prose-mmc text-[18px]" />
          </div>
          <aside className="flex flex-col gap-8 lg:sticky lg:top-[calc(var(--header-h)+32px)] lg:self-start" data-reveal>
            {hero && (
              <div className="flex flex-col gap-2 border-t border-line pt-5">
                <h2 className="t-mono text-graphite">{d.service.forWho}</h2>
                <p className="text-[17px] leading-relaxed text-ink">{t(service.audience, lang)}</p>
              </div>
            )}
            {tags.length > 0 && (
              <ul className="flex flex-wrap gap-2 border-t border-line pt-5">
                {tags.map((tag) => (
                  <li key={tag} className="t-mono rounded-md bg-paper px-2.5 py-1.5 text-slate">
                    {tag}
                  </li>
                ))}
              </ul>
            )}
            {brands.length > 0 && (
              <div className="flex flex-col gap-4 border-t border-line pt-5">
                <h2 className="t-mono text-graphite">{d.service.brands}</h2>
                <ul className="flex flex-wrap items-center gap-x-8 gap-y-4">
                  {brands.map((b) => (
                    <li key={b.id}>
                      {b.logo_path ? <Image src={b.logo_path} alt={b.name} width={120} height={32} className="h-6 w-auto opacity-70" /> : <span className="font-semibold">{b.name}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>

      {/* How it works: single-line diagram */}
      {service.steps.length > 0 && (
        <section className="on-dark section-y bg-ink text-white" aria-labelledby="how-title">
          <div className="wrap flex flex-col gap-12">
            <h2 id="how-title" className="t-h2" data-reveal>
              {d.service.how}
            </h2>
            <ol className="relative grid gap-8 pl-16 sm:grid-cols-2 sm:pl-0 lg:grid-cols-4" data-reveal>
              <span aria-hidden="true" className="absolute bottom-8 left-[21px] top-2 w-[1.5px] bg-on-dark-line sm:hidden lg:bottom-auto lg:left-0 lg:right-0 lg:top-[27px] lg:block lg:h-[1.5px] lg:w-auto" />
              {service.steps.map((step, i) => {
                const last = i === service.steps.length - 1;
                return (
                  <li key={i} className="relative flex flex-col gap-3 sm:gap-4">
                    <span
                      aria-hidden="true"
                      className={`absolute -left-16 -top-1.5 grid size-11 place-items-center rounded-full sm:static sm:size-14 ${
                        last ? "bg-signal text-ink" : "bg-ink text-white shadow-[inset_0_0_0_1.5px_var(--color-on-dark-ring)]"
                      }`}
                    >
                      <span className="t-mono">{String(i + 1).padStart(2, "0")}</span>
                    </span>
                    <h3 className="t-h3 text-[19px] sm:text-[22px]">{t(step.title, lang)}</h3>
                    <p className="text-[15px] leading-relaxed text-on-dark sm:text-[16px]">{t(step.text, lang)}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      )}

      {/* Products */}
      {own.length > 0 && (
        <section className="section-y" aria-labelledby="products-title">
          <div className="wrap flex flex-col gap-10">
            <div className="flex flex-wrap items-end justify-between gap-6" data-reveal>
              <h2 id="products-title" className="t-h2">
                {d.service.products}
              </h2>
              <Link href={`${href(lang, "/aanbod")}?categorie=${slug}`} className="link-arrow">
                {d.catalog.count(own.length)}
                <Icon name="arrow" />
              </Link>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {own.slice(0, 6).map((p) => (
                <li key={p.id} data-reveal>
                  <ProductCard lang={lang} product={p} image={claims.pick(p.media, ...p.images)} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Where the work is, for the service that has a coverage map. */}
      {slug === "zonnepanelen" && <SolarCoverage lang={lang} />}

      {/* FAQ */}
      {serviceFaqs.length > 0 && (
        <section className="section-y" aria-labelledby="faq-title">
          <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
            <h2 id="faq-title" className="t-h2" data-reveal>
              {d.service.faq} {title.toLowerCase()}
            </h2>
            <div data-reveal>
              <Accordion items={serviceFaqs.map((f) => ({ id: f.id, title: t(f.question, lang), content: <p>{t(f.answer, lang)}</p> }))} />
            </div>
          </div>
        </section>
      )}

      <CtaPanel lang={lang} title={d.service.ctaTitle(title)} text={d.service.ctaText} quoteHref={quoteHref} phone={nav.phone} phoneDisplay={nav.phoneDisplay} />
    </>
  );
}
