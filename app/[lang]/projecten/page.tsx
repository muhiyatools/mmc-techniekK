import { projectCard, sectorFilters } from "@/components/site/Blocks";
import { buildNav } from "@/components/site/nav";
import { CtaPanel, PageIntro } from "@/components/site/Page";
import { ProjectsGrid, type GridProject } from "@/components/site/ProjectsGrid";
import { getProjects, getServices, getSettings } from "@/lib/content";
import type { Locale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/ui";
import { MediaClaims } from "@/lib/media";
import { pageMeta } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/projecten">) {
  const { lang } = (await params) as { lang: Locale };
  const d = getDict(lang);
  return pageMeta(lang, "/projecten", d.projects.title, d.projects.lead);
}

export default async function ProjectsPage({ params }: PageProps<"/[lang]/projecten">) {
  const { lang } = (await params) as { lang: Locale };
  const d = getDict(lang);
  const [projects, services, settings] = await Promise.all([getProjects(), getServices(), getSettings()]);
  const nav = buildNav(lang, services, settings);
  const claims = new MediaClaims();
  const cards = projects.map((p) => projectCard(p, lang, claims)).filter(Boolean) as GridProject[];
  const filters = sectorFilters(lang).filter((f) => f.id === "all" || cards.some((c) => f.sectors.includes(c.sector)));

  return (
    <>
      <PageIntro
        lang={lang}
        crumbs={[
          { name: d.nav.home, path: "/" },
          { name: d.projects.title, path: "/projecten" },
        ]}
        title={d.projects.title}
        lead={d.projects.lead}
      />
      <section className="pb-[var(--section)]">
        <div className="wrap">
          <ProjectsGrid lang={lang} projects={cards} filters={filters} layout="grid" />
        </div>
      </section>
      <CtaPanel lang={lang} title={d.ctaGeneric.title} text={d.ctaGeneric.text} phone={nav.phone} phoneDisplay={nav.phoneDisplay} />
    </>
  );
}
