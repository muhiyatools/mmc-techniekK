import Link from "next/link";
import { LogoRow, projectCard, ReviewQuote, sectorFilters, Stars, TrustStrip } from "@/components/site/Blocks";
import { whatsappHref, buildNav } from "@/components/site/nav";
import { ProjectsGrid, type GridProject } from "@/components/site/ProjectsGrid";
import { QuoteStart } from "@/components/site/QuoteStart";
import { ServicesLoop, type LoopService } from "@/components/site/ServicesLoop";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Photo } from "@/components/ui/Photo";
import { GroupLabel } from "@/components/ui/Section";
import { getBrands, getFaqs, getHome, getMediaByIds, getProducts, getProjects, getReviews, getServices, getSettings } from "@/lib/content";
import type { Media, Project } from "@/lib/content/types";
import { href, t, type Locale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/ui";
import { MediaClaims } from "@/lib/media";
import { alternates } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]">) {
  const { lang } = (await params) as { lang: Locale };
  return { alternates: alternates(lang, "/") };
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = (await params) as { lang: Locale };
  const d = getDict(lang);
  const [home, services, projects, reviews, faqs, brands, products, settings] = await Promise.all([
    getHome(),
    getServices(),
    getProjects(),
    getReviews(),
    getFaqs(),
    getBrands(),
    getProducts(),
    getSettings(),
  ]);
  const nav = buildNav(lang, services, settings);
  const claims = new MediaClaims();

  // Photos are claimed in page order so none appears twice.
  const heroMedia = await getMediaByIds(home.hero.media ?? []);
  const heroTiles = heroMedia.map((m) => claims.claim(m)).filter(Boolean) as Media[];
  const projectOf = (m: Media) => projects.find((p) => p.cover?.id === m.id || p.images.some((i) => i.id === m.id));
  const tagFor = (m: Media) => {
    const p = projectOf(m);
    if (!p) return null;
    const svc = p.services[0] ? t(p.services[0].title, lang) : null;
    return [svc, d.sectors[p.sector]].filter(Boolean).join(" · ");
  };

  const coreIndex = services.findIndex((s) => s.slug === "verduurzaming");
  const loop: LoopService[] = services.map((s) => ({
    slug: s.slug,
    title: t(s.title, lang),
    kicker: t(s.kicker, lang),
    summary: t(s.summary, lang),
    tags: t<string[]>(s.tags, lang) ?? [],
    hasProducts: products.some((p) => p.service.slug === s.slug),
    image: claims.claim(s.hero),
  }));

  const [audienceHome, audienceBusiness] = await getMediaByIds([home.audience.home_media, home.audience.business_media].filter(Boolean) as string[]);
  const homeImg = claims.claim(audienceHome);
  const businessImg = claims.claim(audienceBusiness);

  const featured = [...projects].sort((a, b) => Number(b.featured) - Number(a.featured) || a.sort_order - b.sort_order);
  const cards = featured.map((p: Project) => projectCard(p, lang, claims)).filter(Boolean).slice(0, 6) as GridProject[];

  const [heroReview, ...otherReviews] = reviews;
  const homeFaqs = faqs.filter((f) => f.featured).slice(0, 5);
  const suppliers = brands.filter((b) => b.kind === "supplier" && b.show_in_strip);
  const clients = brands.filter((b) => b.kind === "client");
  const [line1, line2] = t(home.hero.title, lang).split("\n");

  return (
    <>
      {/* HERO */}
      <section className="relative pt-8 sm:pt-14" aria-labelledby="hero-title">
        <div className="wrap relative">
          <HeroRing />
          <div className="relative flex flex-col gap-7 sm:gap-8">
            <h1 id="hero-title" className="t-display text-[clamp(46px,9.3vw,136px)]">
              <span className="mask-line" style={{ "--i": 0 } as React.CSSProperties}>
                <span>{line1}</span>
              </span>
              {line2 && (
                <span className="mask-line text-blue" style={{ "--i": 1 } as React.CSSProperties}>
                  <span>{line2}</span>
                </span>
              )}
            </h1>
            <div className="fade-up flex max-w-[900px] flex-wrap items-end gap-x-14 gap-y-7" style={{ "--d": "260ms" } as React.CSSProperties}>
              <p className="t-lead max-w-[500px] flex-[1_1_340px]">{t(home.hero.lead, lang)}</p>
              <div className="flex flex-col gap-3.5">
                <ButtonLink href={href(lang, "/offerte")}>{d.cta.quote}</ButtonLink>
                <span className="text-sm text-graphite">
                  {d.prefer}{" "}
                  <a href={`tel:${nav.phone}`} className="link">
                    {d.cta.callNumber(nav.phoneDisplay)}
                  </a>{" "}
                  {d.or}{" "}
                  <a href={whatsappHref(nav, nav.whatsappText)} target="_blank" rel="noopener noreferrer" className="link">
                    WhatsApp
                  </a>
                </span>
              </div>
            </div>
          </div>

          {heroTiles.length > 0 && (
            <div className="-mx-[var(--gutter)] mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-[var(--gutter)] px-[var(--gutter)] pb-2 [scrollbar-width:none] sm:mx-0 sm:mt-14 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 lg:h-[540px] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.55fr)_minmax(0,0.8fr)]">
              {heroTiles.map((m, i) => {
                const tag = tagFor(m);
                const middle = i === 1;
                return (
                  <div
                    key={m.id}
                    className={`tile fade-up relative h-[340px] w-[78vw] max-w-[300px] flex-none snap-start rounded-[var(--radius-tile)] sm:h-[320px] sm:w-auto sm:max-w-none lg:h-full lg:rounded-[24px] ${middle ? "sm:order-first sm:col-span-2 lg:order-none lg:col-span-1" : ""}`}
                    style={{ "--d": `${360 + i * 90}ms` } as React.CSSProperties}
                  >
                    <div className="parallax absolute -inset-y-6 inset-x-0" style={{ "--parallax": `${-18 - i * 10}px` } as React.CSSProperties}>
                      <Photo media={m} lang={lang} priority={middle} sizes="(min-width: 1024px) 45vw, (min-width: 640px) 100vw, 80vw" quality={middle ? 80 : 70} />
                    </div>
                    {tag && <span className={`t-mono spec-tag absolute left-3.5 ${middle ? "top-3.5" : "bottom-3.5"}`}>{tag}</span>}
                    {middle && heroReview && (
                      <figure className="absolute bottom-4 right-4 hidden w-[300px] flex-col gap-2.5 rounded-[18px] bg-white p-5 shadow-[var(--shadow-float)] md:flex">
                        <Stars n={heroReview.rating} lang={lang} />
                        <blockquote className="text-[16px] font-medium leading-[1.45]">“{t(heroReview.body, lang)}”</blockquote>
                        <figcaption className="t-mono text-graphite">
                          {heroReview.author}
                          {heroReview.place ? ` · ${heroReview.place}` : ""}
                        </figcaption>
                      </figure>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* TRUST + BRANDS */}
      <section className="pt-10 sm:pt-12" aria-label={d.trust.certified}>
        <div className="wrap flex flex-col gap-8">
          <TrustStrip lang={lang} settings={settings} />
          <LogoRow brands={suppliers} label={d.home.brands} />
        </div>
      </section>

      {/* SERVICES */}
      <section id="diensten" className="section-y" aria-labelledby="services-title">
        <div className="wrap flex flex-col gap-12 sm:gap-16">
          <div className="flex flex-wrap items-end justify-between gap-8" data-reveal>
            <div className="flex max-w-[760px] flex-col gap-5">
              <GroupLabel n={1} label={d.home.groups.services} groupWord={d.home.group} />
              <h2 id="services-title" className="t-h2">
                {t(home.services.title, lang)}
              </h2>
            </div>
            <div className="flex max-w-[400px] flex-col gap-3">
              <p className="text-[16px] leading-relaxed text-slate">{t(home.services.lead, lang)}</p>
              <Link href={href(lang, "/aanbod")} className="link-arrow">
                {d.cta.catalog}
                <Icon name="arrow" />
              </Link>
            </div>
          </div>
          <ServicesLoop lang={lang} services={loop} coreIndex={coreIndex < 0 ? loop.length - 1 : coreIndex} />
        </div>
      </section>

      {/* AUDIENCE */}
      <section id="zakelijk" className="pb-[var(--section)]" aria-labelledby="audience-title">
        <div className="wrap flex flex-col gap-10 sm:gap-14">
          <div className="flex flex-col gap-5" data-reveal>
            <GroupLabel n={2} label={d.home.groups.audience} groupWord={d.home.group} />
            <h2 id="audience-title" className="t-h2">
              {t(home.audience.title, lang)}
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            <AudienceCard
              tone="light"
              lang={lang}
              image={homeImg}
              tag={d.sectors.particulier}
              title={t(home.audience.home_title, lang)}
              points={t<string[]>(home.audience.home_points, lang)}
              cta={<ButtonLink href={href(lang, "/offerte")}>{d.home.homeCta}</ButtonLink>}
            />
            <AudienceCard
              tone="dark"
              lang={lang}
              image={businessImg}
              tag={d.nav.business}
              title={t(home.audience.business_title, lang)}
              points={t<string[]>(home.audience.business_points, lang)}
              extra={clients.length > 0 && <LogoRow brands={clients} label={d.business.clients} tone="dark" />}
              cta={
                <ButtonLink href={href(lang, "/zakelijk")} variant="on-dark">
                  {d.cta.businessRequest}
                </ButtonLink>
              }
            />
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      {cards.length > 0 && (
        <section id="projecten" className="section-y bg-paper" aria-labelledby="projects-title">
          <div className="wrap flex flex-col gap-10 sm:gap-12">
            <div className="flex flex-col gap-5" data-reveal>
              <GroupLabel n={3} label={d.home.groups.projects} groupWord={d.home.group} />
              <h2 id="projects-title" className="t-h2">
                {d.home.projectsTitle}
              </h2>
            </div>
            <ProjectsGrid lang={lang} projects={cards} filters={sectorFilters(lang).filter((f) => f.id === "all" || cards.some((c) => f.sectors.includes(c.sector)))} />
            <div className="flex justify-center">
              <ButtonLink href={href(lang, "/projecten")} variant="secondary" icon={false}>
                {d.cta.allProjects}
              </ButtonLink>
            </div>
          </div>
        </section>
      )}

      {/* PROCESS */}
      <section className="on-dark section-y relative overflow-hidden bg-ink text-white" aria-labelledby="process-title">
        <svg aria-hidden="true" viewBox="0 0 400 400" className="pointer-events-none absolute -right-32 -top-28 w-[520px] text-white opacity-[0.05]">
          <circle cx="200" cy="200" r="190" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="200" cy="200" r="120" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 8" />
        </svg>
        <div className="wrap relative flex flex-col gap-14 sm:gap-[72px]">
          <div className="flex max-w-[820px] flex-col gap-5" data-reveal>
            <GroupLabel n={4} label={d.home.groups.process} groupWord={d.home.group} />
            <h2 id="process-title" className="t-h2">
              {t(home.process.title, lang)}
            </h2>
          </div>
          <ol className="process relative grid gap-8 pl-16 sm:grid-cols-2 sm:pl-0 lg:grid-cols-4" data-reveal>
            <span aria-hidden="true" className="process-line absolute bottom-8 left-[21px] top-2 w-[1.5px] bg-on-dark-line sm:hidden lg:bottom-auto lg:left-0 lg:right-0 lg:top-[27px] lg:block lg:h-[1.5px] lg:w-auto" />
            {home.process.steps.map((step, i) => {
              const last = i === home.process.steps.length - 1;
              return (
                <li key={i} className="relative flex flex-col gap-3 sm:gap-4">
                  <span
                    aria-hidden="true"
                    className={`absolute -left-16 -top-1.5 grid size-11 place-items-center rounded-full sm:static sm:size-14 ${
                      last ? "bg-signal text-ink shadow-[0_0_0_8px_rgb(65_167_242/0.15)]" : "bg-ink text-white shadow-[inset_0_0_0_1.5px_var(--color-on-dark-ring)]"
                    }`}
                  >
                    {last ? <Icon name="loop" size={22} /> : <span className="t-mono">{String(i + 1).padStart(2, "0")}</span>}
                  </span>
                  <h3 className="t-h3 text-[19px] sm:text-[22px]">{t(step.title, lang)}</h3>
                  <p className="text-[15px] leading-relaxed text-on-dark sm:text-[16px]">{t(step.text, lang)}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* REVIEWS */}
      {otherReviews.length > 0 && (
        <section className="section-y" aria-labelledby="reviews-title">
          <div className="wrap flex flex-col gap-10 sm:gap-14">
            <div className="flex flex-wrap items-end justify-between gap-6" data-reveal>
              <div className="flex flex-col gap-5">
                <GroupLabel n={5} label={d.home.groups.reviews} groupWord={d.home.group} />
                <h2 id="reviews-title" className="t-h2">
                  {d.home.reviewsTitle}
                </h2>
              </div>
              {settings.social.google_reviews_url && (
                <a href={settings.social.google_reviews_url} target="_blank" rel="noopener noreferrer" className="link-arrow">
                  {d.home.googleReviews}
                  <Icon name="arrowUpRight" />
                </a>
              )}
            </div>
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-5">
              <ReviewQuote review={otherReviews[0]} lang={lang} size="lg" />
              <div className="flex flex-col gap-4 lg:gap-5">
                {otherReviews.slice(1, 3).map((r) => (
                  <ReviewQuote key={r.id} review={r} lang={lang} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* QUOTE */}
      <section id="offerte" className="pb-[var(--section)]" aria-labelledby="quote-title">
        <div className="wrap">
          <div className="on-blue relative grid gap-10 overflow-hidden rounded-[24px] bg-blue px-5 py-8 sm:rounded-[var(--radius-panel)] sm:p-12 xl:grid-cols-[minmax(0,1fr)_560px] xl:gap-14 xl:p-[72px]">
            <svg viewBox="0 0 600 600" aria-hidden="true" className="pointer-events-none absolute -bottom-64 -left-52 w-[600px] text-white opacity-[0.18]">
              <circle cx="300" cy="300" r="290" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="300" cy="300" r="210" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 8" />
            </svg>
            <div className="relative flex flex-col gap-6 text-white sm:gap-7" data-reveal>
              <GroupLabel n={6} label={d.home.groups.quote} groupWord={d.home.group} />
              <h2 id="quote-title" className="t-h2 text-[clamp(36px,5vw,68px)]">
                {t(home.quote.title, lang)}
              </h2>
              <p className="max-w-[460px] text-[17px] leading-relaxed text-on-blue sm:text-[18px]">{t(home.quote.lead, lang)}</p>
              <ul className="mt-2 flex max-w-[460px] flex-col border-b border-white/20">
                {[
                  { icon: "phone" as const, label: d.cta.call, value: nav.phoneDisplay, href: `tel:${nav.phone}` },
                  { icon: "whatsapp" as const, label: "WhatsApp", value: d.cta.whatsappLong, href: whatsappHref(nav, nav.whatsappText), external: true },
                  { icon: "mail" as const, label: d.cta.mail, value: nav.email, href: `mailto:${nav.email}` },
                ].map((c) => (
                  <li key={c.icon}>
                    <a
                      href={c.href}
                      {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group flex items-center gap-3.5 border-t border-white/20 py-4 text-white"
                    >
                      <span className="grid size-11 flex-none place-items-center rounded-full bg-white/15 transition-colors group-hover:bg-white/25">
                        <Icon name={c.icon} />
                      </span>
                      <span className="flex flex-col">
                        <span className="t-mono text-on-blue-muted">{c.label}</span>
                        <span className="text-[17px] font-semibold sm:text-[18px]">{c.value}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <QuoteStart lang={lang} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      {homeFaqs.length > 0 && (
        <section id="faq" className="pb-[var(--section)]" aria-labelledby="faq-title">
          <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
            <div className="flex flex-col gap-5" data-reveal>
              <GroupLabel n={7} label={d.home.groups.faq} groupWord={d.home.group} />
              <h2 id="faq-title" className="t-h2">
                {d.home.faqTitle}
              </h2>
              <p className="max-w-[380px] text-[17px] leading-relaxed text-slate">{d.home.faqLead}</p>
              <Link href={href(lang, "/veelgestelde-vragen")} className="link-arrow">
                {d.cta.allQuestions(faqs.length)}
                <Icon name="arrow" />
              </Link>
            </div>
            <div data-reveal>
              <Accordion
                defaultOpen={homeFaqs[0].id}
                items={homeFaqs.map((f) => ({ id: f.id, title: t(f.question, lang), content: <p>{t(f.answer, lang)}</p> }))}
              />
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function AudienceCard({
  tone,
  lang,
  image,
  tag,
  title,
  points,
  cta,
  extra,
}: {
  tone: "light" | "dark";
  lang: Locale;
  image: Media | null;
  tag: string;
  title: string;
  points: string[];
  cta: React.ReactNode;
  extra?: React.ReactNode;
}) {
  const dark = tone === "dark";
  return (
    <article className={`group flex flex-col overflow-hidden rounded-[22px] sm:rounded-[var(--radius-card)] ${dark ? "on-dark bg-ink text-white" : "bg-paper"}`} data-reveal>
      {image && (
        <div className="tile relative h-[220px] sm:h-[340px]">
          <Photo media={image} lang={lang} sizes="(min-width: 768px) 50vw, 100vw" />
          <span className="t-mono spec-tag absolute left-4 top-4">{tag}</span>
        </div>
      )}
      <div className="flex flex-1 flex-col gap-6 p-6 sm:p-10">
        <h3 className="t-h3 text-[24px] font-[750] [font-stretch:115%] sm:text-[32px]">{title}</h3>
        <ul className={`flex flex-col gap-3 ${dark ? "text-on-dark" : "text-slate"}`}>
          {points.map((p) => (
            <li key={p} className="flex items-start gap-3 text-[16px] leading-normal">
              <Icon name="check" className={`mt-0.5 ${dark ? "text-signal" : "text-blue"}`} />
              {p}
            </li>
          ))}
        </ul>
        {extra && <div className="border-y border-on-dark-line py-5">{extra}</div>}
        <div className="mt-auto pt-2">{cta}</div>
      </div>
    </article>
  );
}

/** Decorative loop next to the hero headline, drawn on at first paint (wide screens only). */
function HeroRing() {
  return (
    <div aria-hidden="true" className="draw-now pointer-events-none absolute right-[var(--gutter)] top-6 hidden size-[340px] xl:block">
      <svg viewBox="0 0 400 400" className="size-full overflow-visible">
        <circle cx="200" cy="200" r="190" fill="none" stroke="var(--color-line)" strokeWidth="1.25" />
        <circle cx="200" cy="200" r="140" fill="none" stroke="var(--color-line)" strokeWidth="1.25" strokeDasharray="3 7" />
        <path
          className="draw"
          d="M334.4 65.6 A190 190 0 1 0 334.4 334.4"
          fill="none"
          stroke="var(--color-signal)"
          strokeWidth="3"
          strokeLinecap="round"
          style={{ "--len": 900, "--d": "300ms" } as React.CSSProperties}
        />
        {/* Arrowhead at the end of the arc, tangent to it (pointing up-right, like the C). */}
        <path className="pop" d="M328 328 L340.8 340.8 L343.6 325.2 Z" fill="var(--color-signal)" stroke="var(--color-signal)" strokeWidth="2" strokeLinejoin="round" style={{ "--d": "1100ms" } as React.CSSProperties} />
        <circle className="pop" cx="200" cy="10" r="6" fill="var(--color-ink)" style={{ "--d": "500ms" } as React.CSSProperties} />
        <circle className="pop" cx="10" cy="200" r="6" fill="var(--color-ink)" style={{ "--d": "650ms" } as React.CSSProperties} />
        <circle className="pop" cx="200" cy="390" r="6" fill="var(--color-ink)" style={{ "--d": "800ms" } as React.CSSProperties} />
      </svg>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/mark.svg" alt="" width={120} height={120} className="pop absolute left-1/2 top-1/2 size-[120px] -translate-x-1/2 -translate-y-1/2" style={{ "--d": "200ms" } as React.CSSProperties} />
    </div>
  );
}
