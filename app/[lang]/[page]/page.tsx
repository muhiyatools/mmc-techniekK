import { notFound } from "next/navigation";
import { PageIntro } from "@/components/site/Page";
import { Markdown } from "@/components/ui/Markdown";
import { getPage, publishedSlugs } from "@/lib/content";
import { locales, t, type Locale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/ui";
import { pageMeta } from "@/lib/site";

/** Simple text pages from the admin: privacy, cookies, terms. */
const LEGAL = ["privacy", "cookies", "algemene-voorwaarden"];

export async function generateStaticParams() {
  const slugs = (await publishedSlugs("pages")).filter((s) => LEGAL.includes(s));
  return locales.flatMap((lang) => slugs.map((page) => ({ lang, page })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[page]">) {
  const { lang, page: slug } = (await params) as { lang: Locale; page: string };
  if (!LEGAL.includes(slug)) return {};
  const page = await getPage(slug);
  if (!page) return {};
  return pageMeta(lang, `/${slug}`, t(page.title, lang), t(page.seo_description, lang));
}

export default async function TextPage({ params }: PageProps<"/[lang]/[page]">) {
  const { lang, page: slug } = (await params) as { lang: Locale; page: string };
  if (!LEGAL.includes(slug)) notFound();
  const page = await getPage(slug);
  if (!page) notFound();
  const d = getDict(lang);
  return (
    <>
      <PageIntro
        lang={lang}
        crumbs={[
          { name: d.nav.home, path: "/" },
          { name: t(page.title, lang), path: `/${slug}` },
        ]}
        title={t(page.title, lang)}
      />
      <section className="pb-[var(--section)]">
        <div className="wrap">
          <Markdown text={t(page.body, lang)} />
        </div>
      </section>
    </>
  );
}
