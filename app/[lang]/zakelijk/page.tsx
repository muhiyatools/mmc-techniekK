import { BrandGrid } from "@/components/site/BrandGrid";
import { InstagramProfile } from "@/components/site/InstagramProfile";
import { siteNav } from "@/lib/nav";
import { CtaPanel, PageIntro } from "@/components/site/Page";
import { ButtonLink } from "@/components/ui/Button";
import { Markdown, firstParagraph } from "@/components/ui/Markdown";
import { getBrands, getPage, getServices, getSettings } from "@/lib/content";
import { href, t, type Locale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/ui";
import { pageMeta } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/zakelijk">) {
  const { lang } = (await params) as { lang: Locale };
  const page = await getPage("zakelijk");
  const d = getDict(lang);
  return pageMeta(lang, "/zakelijk", page ? t(page.title, lang) : d.business.title, page ? t(page.seo_description, lang) : "");
}

export default async function BusinessPage({ params }: PageProps<"/[lang]/zakelijk">) {
  const { lang } = (await params) as { lang: Locale };
  const d = getDict(lang);
  const [page, brands, services, settings] = await Promise.all([getPage("zakelijk"), getBrands(), getServices(), getSettings()]);
  const nav = await siteNav(lang, services, settings);
  const body = page ? t(page.body, lang) : "";
  const [intro, ...rest] = body.split(/\n{2,}/);
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
          <div className="wrap border-y border-line py-7">
            <BrandGrid lang={lang} brands={clients} label={d.business.clients} />
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section className="pb-16 sm:pb-20">
          <div className="wrap" data-reveal>
            <Markdown text={rest.join("\n\n")} className="prose-mmc text-[18px]" />
          </div>
        </section>
      )}

      <InstagramProfile lang={lang} settings={settings} title={d.instagram.businessTitle} lead={d.instagram.businessLead} id="werk" tone={clients.length ? "paper" : "white"} />

      <CtaPanel lang={lang} title={d.ctaGeneric.title} text={d.ctaGeneric.text} quoteHref={quoteHref} phone={nav.phone} phoneDisplay={nav.phoneDisplay} />
    </>
  );
}
