import Image from "next/image";
import { TrustStrip } from "@/components/site/Blocks";
import { siteNav } from "@/lib/nav";
import { CtaPanel, PageIntro } from "@/components/site/Page";
import { Markdown, firstParagraph } from "@/components/ui/Markdown";
import { Photo } from "@/components/ui/Photo";
import { getPage, getServices, getSettings, getTeam } from "@/lib/content";
import { t, type Locale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/ui";
import { pageMeta } from "@/lib/site";

const CERTS = [
  { src: "/brand/certs/nen-1010.png", name: "NEN 1010", w: 120, h: 36, nl: "Veiligheidseisen voor elektrische installaties in gebouwen.", en: "Safety requirements for electrical installations in buildings." },
  { src: "/brand/certs/nen-3140.png", name: "NEN 3140", w: 56, h: 56, nl: "Veilig werken aan en inspecteren van elektrische installaties.", en: "Safe operation and inspection of electrical installations." },
  { src: "/brand/certs/vca.png", name: "VCA", w: 56, h: 56, nl: "Veiligheid, gezondheid en milieu op de werkplek.", en: "Health, safety and environment at work." },
];

export async function generateMetadata({ params }: PageProps<"/[lang]/over-ons">) {
  const { lang } = (await params) as { lang: Locale };
  const page = await getPage("over-ons");
  return pageMeta(lang, "/over-ons", page ? t(page.title, lang) : getDict(lang).about.title, page ? t(page.seo_description, lang) : "");
}

export default async function AboutPage({ params }: PageProps<"/[lang]/over-ons">) {
  const { lang } = (await params) as { lang: Locale };
  const d = getDict(lang);
  const [page, team, services, settings] = await Promise.all([getPage("over-ons"), getTeam(), getServices(), getSettings()]);
  const nav = await siteNav(lang, services, settings);
  const body = page ? t(page.body, lang) : "";
  const [intro, ...rest] = body.split(/\n{2,}/);

  return (
    <>
      <PageIntro
        lang={lang}
        crumbs={[
          { name: d.nav.home, path: "/" },
          { name: d.nav.about, path: "/over-ons" },
        ]}
        title={page ? t(page.title, lang) : d.about.title}
        lead={intro ? firstParagraph(intro) : undefined}
      />

      <section className="pb-[var(--section)]">
        <div className="wrap flex flex-col gap-16">
          <TrustStrip lang={lang} settings={settings} showCerts={false} />
          {rest.length > 0 && (
            <div data-reveal>
              <Markdown text={rest.join("\n\n")} className="prose-mmc text-[18px]" />
            </div>
          )}
        </div>
      </section>

      {team.length > 0 && (
        <section className="section-y bg-paper" aria-labelledby="team-title">
          <div className="wrap flex flex-col gap-10">
            <h2 id="team-title" className="t-h2" data-reveal>
              {d.about.team}
            </h2>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((m) => (
                <li key={m.id} className="flex flex-col gap-3" data-reveal>
                  <div className="tile relative aspect-[4/5] rounded-[var(--radius-tile)]">{m.media && <Photo media={m.media} lang={lang} sizes="(min-width: 1024px) 25vw, 50vw" />}</div>
                  <div className="flex flex-col gap-1">
                    <span className="t-h3 text-[19px]">{m.name}</span>
                    <span className="t-mono text-graphite">{t(m.role, lang)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className={`section-y ${team.length ? "" : "pt-0"}`} aria-labelledby="certs-title">
        <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div className="flex flex-col gap-4" data-reveal>
            <h2 id="certs-title" className="t-h2">
              {d.about.certs}
            </h2>
          </div>
          <ul className="border-b border-line" data-reveal>
            {CERTS.map((c) => (
              <li key={c.name} className="grid grid-cols-[88px_minmax(0,1fr)] items-center gap-6 border-t border-line py-6">
                <span className="grid h-16 place-items-center rounded-xl border border-line bg-white px-2">
                  <Image src={c.src} alt="" width={c.w} height={c.h} style={{ width: "auto", height: c.h > 40 ? 48 : 24 }} />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="t-h3 text-[19px]">{c.name}</span>
                  <span className="text-slate">{lang === "nl" ? c.nl : c.en}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaPanel lang={lang} title={d.ctaGeneric.title} text={d.ctaGeneric.text} phone={nav.phone} phoneDisplay={nav.phoneDisplay} />
    </>
  );
}
