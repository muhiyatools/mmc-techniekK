import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { projectCard } from "@/components/site/Blocks";
import { buildNav } from "@/components/site/nav";
import { Breadcrumbs, CtaPanel } from "@/components/site/Page";
import { ProjectsGrid, type GridProject } from "@/components/site/ProjectsGrid";
import { Markdown } from "@/components/ui/Markdown";
import { Photo } from "@/components/ui/Photo";
import { getProject, getProjects, getServices, getSettings, publishedSlugs } from "@/lib/content";
import { href, locales, t, type Locale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/ui";
import { MediaClaims, mediaUrl } from "@/lib/media";
import { pageMeta } from "@/lib/site";

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await publishedSlugs("projects");
  return locales.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/projecten/[slug]">) {
  const { lang, slug } = (await params) as { lang: Locale; slug: string };
  const p = await getProject(slug);
  if (!p) return {};
  return pageMeta(lang, `/projecten/${slug}`, t(p.title, lang), t(p.summary, lang), p.cover ? mediaUrl(p.cover) : undefined);
}

export default async function ProjectPage({ params }: PageProps<"/[lang]/projecten/[slug]">) {
  const { lang, slug } = (await params) as { lang: Locale; slug: string };
  const d = getDict(lang);
  const [project, projects, services, settings] = await Promise.all([getProject(slug), getProjects(), getServices(), getSettings()]);
  if (!project) notFound();
  const nav = buildNav(lang, services, settings);
  const title = t(project.title, lang);
  const claims = new MediaClaims();
  const cover = claims.claim(project.cover);
  const gallery = project.images.map((m) => claims.claim(m)).filter(Boolean) as NonNullable<typeof cover>[];
  const body = t(project.body, lang);
  const related = projects
    .filter((p) => p.id !== project.id)
    .sort((a, b) => Number(b.sector === project.sector) - Number(a.sector === project.sector))
    .map((p) => projectCard(p, lang, claims))
    .filter(Boolean)
    .slice(0, 3) as GridProject[];
  const meta = [
    project.place && { label: d.projects.place, value: project.place },
    project.year && { label: d.projects.year, value: String(project.year) },
    { label: d.projects.sector, value: d.sectors[project.sector] },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <>
      <section className="pb-12 pt-8 sm:pt-12">
        <div className="wrap flex flex-col gap-7">
          <Breadcrumbs
            lang={lang}
            items={[
              { name: d.nav.home, path: "/" },
              { name: d.projects.title, path: "/projecten" },
              { name: title, path: `/projecten/${slug}` },
            ]}
          />
          <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <div className="fade-up flex flex-col gap-5">
              <h1 className="t-h1 text-[clamp(36px,5vw,72px)]">{title}</h1>
              <p className="t-lead max-w-[620px]">{t(project.summary, lang)}</p>
            </div>
            <dl className="fade-up grid grid-cols-3 border-t border-line pt-5" style={{ "--d": "100ms" } as React.CSSProperties}>
              {meta.map((m) => (
                <div key={m.label} className="flex flex-col gap-1">
                  <dt className="t-mono text-graphite">{m.label}</dt>
                  <dd className="font-medium">{m.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {cover && (
        <section className="pb-[var(--section)]">
          <div className="wrap">
            <ViewTransition name={`project-${slug}`} share="morph">
              <div className="tile relative aspect-[4/3] rounded-[var(--radius-tile)] sm:aspect-[16/8] sm:rounded-[var(--radius-card)]">
                <Photo media={cover} lang={lang} priority sizes="(min-width: 1440px) 1360px, 100vw" quality={80} />
              </div>
            </ViewTransition>
          </div>
        </section>
      )}

      {(body || project.services.length > 0) && (
        <section className="pb-[var(--section)]">
          <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)] lg:gap-16">
            <h2 className="t-h2 text-[clamp(28px,3vw,40px)]">{d.projects.what}</h2>
            <div className="flex flex-col gap-6">
              {body ? <Markdown text={body} /> : <p className="t-lead">{t(project.summary, lang)}</p>}
              {project.services.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                  {project.services.map((s) => (
                    <li key={s.slug}>
                      <Link href={href(lang, `/diensten/${s.slug}`)} className="chip">
                        {t(s.title, lang)}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      )}

      {gallery.length > 0 && (
        <section className="pb-[var(--section)]" aria-label={d.projects.gallery}>
          <div className="wrap">
            <ul className={`grid gap-4 ${gallery.length === 1 ? "" : "sm:grid-cols-2"}`}>
              {gallery.map((m, i) => (
                <li key={m.id} className={`tile relative rounded-[var(--radius-tile)] ${gallery.length === 3 && i === 0 ? "sm:col-span-2 aspect-[16/8]" : "aspect-[4/3]"}`} data-reveal>
                  <Photo media={m} lang={lang} sizes="(min-width: 640px) 50vw, 100vw" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="section-y bg-paper" aria-labelledby="related-title">
          <div className="wrap flex flex-col gap-10">
            <h2 id="related-title" className="t-h2" data-reveal>
              {d.projects.related}
            </h2>
            <ProjectsGrid lang={lang} projects={related} filters={[]} layout="grid" />
          </div>
        </section>
      )}

      <CtaPanel lang={lang} title={d.ctaGeneric.title} text={d.ctaGeneric.text} phone={nav.phone} phoneDisplay={nav.phoneDisplay} />
    </>
  );
}
