import { LogoRow, projectCard } from "@/components/site/Blocks";
import { buildNav } from "@/components/site/nav";
import { CtaPanel, PageIntro } from "@/components/site/Page";
import { ProjectsGrid, type GridProject } from "@/components/site/ProjectsGrid";
import { ButtonLink } from "@/components/ui/Button";
import { Markdown, firstParagraph } from "@/components/ui/Markdown";
import { getBrands, getPage, getProjects, getServices, getSettings } from "@/lib/content";
import { href, t, type Locale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/ui";
import { MediaClaims } from "@/lib/media";
import { pageMeta } from "@/lib/site";

const BUSINESS = ["utiliteit", "retail", "nieuwbouw"];

export async function generateMetadata({ params }: PageProps<"/[lang]/zakelijk">) {
  const { lang } = (await params) as { lang: Locale };
  const page = await getPage("zakelijk");
  const d = getDict(lang);
  return pageMeta(lang, "/zakelijk", page ? t(page.title, lang) : d.business.title, page ? t(page.seo_description, lang) : "");
}

export default async function BusinessPage({ params }: PageProps<"/[lang]/zakelijk">) {
  const { lang } = (await params) as { lang: Locale };
  const d = getDict(lang);
  const [page, projects, brands, services, settings] = await Promise.all([getPage("zakelijk"), getProjects(), getBrands(), getServices(), getSettings()]);
  const nav = buildNav(lang, services, settings);
  const body = page ? t(page.body, lang) : "";
  const [intro, ...rest] = body.split(/\n{2,}/);
  const claims = new MediaClaims();
  const cards = projects
    .filter((p) => BUSINESS.includes(p.sector))
    .map((p) => projectCard(p, lang, claims))
    .filter(Boolean) as GridProject[];
  const clients = brands.filter((b) => b.kind === "client");
  const quoteHref = `${href(lang, "/offerte")}?pand=bedrijfspand`;

  return (
    <>
      <PageIntro
        lang={lang}
        crumbs={[
          { name: d.nav.home, path: "/" },
          { name: d.nav.business, path: "/zakelijk" },
        ]}
        title={page ? t(page.title, lang) : d.business.title}
        lead={intro ? firstParagraph(intro) : undefined}
        aside={<ButtonLink href={quoteHref}>{d.cta.businessRequest}</ButtonLink>}
      />

      {clients.length > 0 && (
        <section className="pb-16">
          <div className="wrap border-y border-line py-8">
            <LogoRow brands={clients} label={d.business.clients} />
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section className="pb-[var(--section)]">
          <div className="wrap" data-reveal>
            <Markdown text={rest.join("\n\n")} className="prose-mmc text-[18px]" />
          </div>
        </section>
      )}

      {cards.length > 0 && (
        <section className="section-y bg-paper" aria-labelledby="projects-title">
          <div className="wrap flex flex-col gap-10">
            <h2 id="projects-title" className="t-h2" data-reveal>
              {d.business.projects}
            </h2>
            <ProjectsGrid lang={lang} projects={cards} filters={[]} layout="grid" />
          </div>
        </section>
      )}

      <div className={cards.length ? "pt-[var(--section)]" : ""}>
        <CtaPanel lang={lang} title={d.ctaGeneric.title} text={d.ctaGeneric.text} quoteHref={quoteHref} phone={nav.phone} phoneDisplay={nav.phoneDisplay} />
      </div>
    </>
  );
}
