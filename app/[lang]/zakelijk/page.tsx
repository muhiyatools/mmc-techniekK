import Image from "next/image";
import Link from "next/link";
import { BrandGrid } from "@/components/site/BrandGrid";
import { InstagramProfile } from "@/components/site/InstagramProfile";
import { CtaPanel, Breadcrumbs } from "@/components/site/Page";
import { ButtonLink } from "@/components/ui/Button";
import { firstParagraph } from "@/components/ui/Markdown";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Photo } from "@/components/ui/Photo";
import { certificationsFor } from "@/lib/certifications";
import { getBrands, getMediaByPaths, getPage, getServices, getSettings } from "@/lib/content";
import { href, t, type Locale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/ui";
import { MediaClaims } from "@/lib/media";
import { siteNav } from "@/lib/nav";
import { pageMeta } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/zakelijk">) {
  const { lang } = (await params) as { lang: Locale };
  const page = await getPage("zakelijk");
  const d = getDict(lang);
  return pageMeta(lang, "/zakelijk", page ? t(page.title, lang) : d.business.title, page ? t(page.seo_description, lang) : "");
}

// Business photos from the media library. Each is used once on this page.
const HERO_PHOTO = "photos/hoofdverdeler-bedrijfspand.jpg";
const WORK_PHOTOS = ["photos/supermarkt-verlichting-gangpad.jpg", "photos/bedrijfshal-plafond-hoogwerker.jpg", "photos/datakast-kantoor.jpg"];

export default async function BusinessPage({ params }: PageProps<"/[lang]/zakelijk">) {
  const { lang } = (await params) as { lang: Locale };
  const d = getDict(lang);
  const b = d.business;
  const [page, brands, services, settings, media] = await Promise.all([
    getPage("zakelijk"),
    getBrands(),
    getServices(),
    getSettings(),
    getMediaByPaths([HERO_PHOTO, ...WORK_PHOTOS]),
  ]);
  const nav = await siteNav(lang, services, settings);
  const claims = new MediaClaims();
  const hero = claims.claim(media.find((m) => m.path === HERO_PHOTO));
  const work = WORK_PHOTOS.map((p) => claims.claim(media.find((m) => m.path === p))).filter(Boolean) as NonNullable<typeof hero>[];

  const intro = (page ? t(page.body, lang) : "").split(/\n{2,}/)[0];
  const clients = brands.filter((x) => x.kind === "client");
  const certs = certificationsFor(settings.certifications);
  const quoteHref = `${href(lang, "/offerte")}?pand=bedrijfspand`;

  return (
    <>
      {/* 1. HERO: text left, photo right */}
      <section className="pb-12 pt-8 sm:pb-16 sm:pt-12">
        <div className="wrap grid items-stretch gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <div className="flex flex-col justify-between gap-12">
            <Breadcrumbs
              lang={lang}
              items={[
                { name: d.nav.home, path: "/" },
                { name: d.nav.business, path: "/zakelijk" },
              ]}
            />
            <div className="flex flex-col gap-6">
              <h1 className="t-h1 fade-up">{page ? t(page.title, lang) : b.title}</h1>
              {intro && (
                <p className="t-lead fade-up max-w-[560px] 3xl:max-w-[680px]" style={{ "--d": "120ms" } as React.CSSProperties}>
                  {firstParagraph(intro)}
                </p>
              )}
              <div className="fade-up flex flex-wrap items-center gap-x-7 gap-y-4 pt-2" style={{ "--d": "220ms" } as React.CSSProperties}>
                <ButtonLink href={quoteHref}>{d.cta.businessRequest}</ButtonLink>
                <a href={`tel:${nav.phone}`} className="link-arrow">
                  <Icon name="phone" />
                  {nav.phoneDisplay}
                </a>
              </div>
            </div>
          </div>
          {hero && (
            <div className="tile fade-up relative min-h-[360px] rounded-[var(--radius-tile)] sm:min-h-[480px] sm:rounded-[var(--radius-card)] lg:min-h-[560px]" style={{ "--d": "160ms" } as React.CSSProperties}>
              <Photo media={hero} lang={lang} priority sizes="(min-width: 1024px) 45vw, 100vw" quality={80} />
              <span className="t-mono spec-tag absolute bottom-4 left-4">{b.heroLabel}</span>
            </div>
          )}
        </div>
      </section>

      {/* 2. WHAT WE DO FOR BUSINESSES */}
      <section className="section-y pt-8 sm:pt-12" aria-labelledby="offer-title">
        <div className="wrap flex flex-col gap-10 sm:gap-12">
          <h2 id="offer-title" className="t-h2 max-w-[820px] 3xl:max-w-[1100px]" data-reveal>
            {b.offerTitle}
          </h2>
          <ul className="grid gap-4 md:grid-cols-2 md:gap-5">
            {b.offers.map((o, i) => {
              const svc = o.service ? services.find((x) => x.slug === o.service) : undefined;
              const link = svc ? href(lang, `/diensten/${svc.slug}`) : null;
              const body = (
                <>
                  <span className="grid size-14 flex-none place-items-center rounded-full bg-sky text-blue transition-colors duration-[var(--dur)] ease-[var(--ease-out)] group-hover:bg-blue group-hover:text-white">
                    <Icon name={o.icon as IconName} size={26} strokeWidth={1.5} />
                  </span>
                  <span className="flex flex-col items-start gap-3">
                    <span className="t-h3 text-[22px] sm:text-[26px]">{o.title}</span>
                    <span className="max-w-[46ch] text-[16px] leading-relaxed text-slate">{o.text}</span>
                    {svc && (
                      <span className="link-arrow text-[15px]">
                        {b.offerCta} {t(svc.title, lang).toLowerCase()}
                        <Icon name="arrow" />
                      </span>
                    )}
                  </span>
                </>
              );
              const cls =
                "group flex h-full flex-col items-start gap-5 rounded-[var(--radius-tile)] border border-line bg-white p-6 transition-[border-color,transform,box-shadow] duration-[var(--dur)] ease-[var(--ease-out)] sm:flex-row sm:gap-7 sm:p-8";
              return (
                <li key={o.title} data-reveal style={{ "--i": i } as React.CSSProperties}>
                  {link ? (
                    <Link href={link} className={`${cls} hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[0_18px_36px_-24px_rgb(15_27_38/0.35)]`}>
                      {body}
                    </Link>
                  ) : (
                    <div className={cls}>{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
          {work.length > 0 && (
            <ul className="grid gap-3 sm:grid-cols-3 sm:gap-4">
              {work.map((m, i) => (
                <li key={m.id} className="tile relative aspect-[4/3] rounded-[var(--radius-tile)]" data-reveal style={{ "--i": i } as React.CSSProperties}>
                  <Photo media={m} lang={lang} sizes="(min-width: 640px) 33vw, 100vw" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* 3. CLIENTS */}
      {clients.length > 0 && (
        <section className="section-y bg-paper" aria-label={b.clients}>
          <div className="wrap">
            <BrandGrid lang={lang} brands={clients} label={b.clients} />
          </div>
        </section>
      )}

      {/* 4. CERTIFICATIONS: every one in the settings */}
      <section className="section-y" id="certificeringen" aria-labelledby="certs-title">
        <div className="wrap flex flex-col gap-10 sm:gap-12">
          <div className="flex flex-col gap-4" data-reveal>
            <h2 id="certs-title" className="t-h2">
              {b.certsTitle}
            </h2>
            <p className="t-lead max-w-[560px]">{b.certsLead}</p>
          </div>
          <ul className="grid gap-4 md:grid-cols-3 md:gap-5">
            {certs.known.map((c, i) => (
              <li key={c.name} className="flex flex-col gap-6 rounded-[var(--radius-tile)] border border-line p-6 sm:p-8" data-reveal style={{ "--i": i } as React.CSSProperties}>
                <span className="grid h-24 place-items-center rounded-[var(--radius-sm)] bg-paper px-4">
                  <Image
                    src={c.logo}
                    alt=""
                    width={c.width}
                    height={c.height}
                    style={{ width: "auto", height: c.width / c.height > 2 ? 52 : 72 }}
                  />
                </span>
                <h3 className="t-h3 text-[24px]">{c.name}</h3>
                <dl className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <dt className="t-mono text-graphite">{b.certsMeans}</dt>
                    <dd className="text-[16px] leading-relaxed text-ink">{c.means[lang]}</dd>
                  </div>
                  <div className="flex flex-col gap-1.5 border-t border-line pt-5">
                    <dt className="t-mono text-graphite">{b.certsFor}</dt>
                    <dd className="text-[16px] leading-relaxed text-slate">{c.business[lang]}</dd>
                  </div>
                </dl>
              </li>
            ))}
            {certs.unknown.map((n) => (
              <li key={n} className="flex flex-col gap-3 rounded-[var(--radius-tile)] border border-line p-6 sm:p-8" data-reveal>
                <h3 className="t-h3 text-[24px]">{n}</h3>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. HOW A BUSINESS JOB RUNS (dark, single-line diagram) */}
      <section className="on-dark section-y bg-ink text-white" aria-labelledby="biz-process-title">
        <div className="wrap flex flex-col gap-12 sm:gap-16">
          <h2 id="biz-process-title" className="t-h2 max-w-[820px] 3xl:max-w-[1100px]" data-reveal>
            {b.processTitle}
          </h2>
          <ol className="relative grid gap-8 pl-16 sm:grid-cols-2 sm:pl-0 lg:grid-cols-4" data-reveal>
            <span aria-hidden="true" className="absolute bottom-8 left-[21px] top-2 w-[1.5px] bg-on-dark-line sm:hidden lg:bottom-auto lg:left-0 lg:right-0 lg:top-[27px] lg:block lg:h-[1.5px] lg:w-auto" />
            {b.steps.map((step, i) => {
              const last = i === b.steps.length - 1;
              return (
                <li key={step.title} className="relative flex flex-col gap-3 sm:gap-4">
                  <span
                    aria-hidden="true"
                    className={`absolute -left-16 -top-1.5 grid size-11 place-items-center rounded-full sm:static sm:size-14 ${
                      last ? "bg-signal text-ink" : "bg-ink text-white shadow-[inset_0_0_0_1.5px_var(--color-on-dark-ring)]"
                    }`}
                  >
                    {last ? <Icon name="loop" size={22} /> : <span className="t-mono">{String(i + 1).padStart(2, "0")}</span>}
                  </span>
                  <h3 className="t-h3 text-[19px] sm:text-[22px]">{step.title}</h3>
                  <p className="text-[15px] leading-relaxed text-on-dark sm:text-[16px]">{step.text}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* 6. WORK */}
      <InstagramProfile lang={lang} settings={settings} title={d.instagram.businessTitle} lead={d.instagram.businessLead} id="werk" tone="paper" />

      {/* 7. CTA */}
      <div className="pt-[var(--section)]">
        <CtaPanel lang={lang} title={d.ctaGeneric.title} text={d.ctaGeneric.text} quoteHref={quoteHref} phone={nav.phone} phoneDisplay={nav.phoneDisplay} />
      </div>
    </>
  );
}
