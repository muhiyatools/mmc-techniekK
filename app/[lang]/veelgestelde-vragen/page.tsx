import { FaqSearch, type FaqGroup } from "@/components/site/FaqSearch";
import { JsonLd } from "@/components/site/JsonLd";
import { buildNav, whatsappHref } from "@/components/site/nav";
import { PageIntro } from "@/components/site/Page";
import { Icon } from "@/components/ui/Icon";
import { getFaqs, getServices, getSettings } from "@/lib/content";
import { t, type Locale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/ui";
import { pageMeta } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/veelgestelde-vragen">) {
  const { lang } = (await params) as { lang: Locale };
  const d = getDict(lang);
  return pageMeta(lang, "/veelgestelde-vragen", d.faq.title, d.faq.lead);
}

export default async function FaqPage({ params }: PageProps<"/[lang]/veelgestelde-vragen">) {
  const { lang } = (await params) as { lang: Locale };
  const d = getDict(lang);
  const [faqs, services, settings] = await Promise.all([getFaqs(), getServices(), getSettings()]);
  const nav = buildNav(lang, services, settings);

  const groups: FaqGroup[] = [
    { id: "algemeen", title: d.faq.general, items: faqs.filter((f) => !f.service_slug).map((f) => ({ id: f.id, q: t(f.question, lang), a: t(f.answer, lang) })) },
    ...services.map((s) => ({
      id: s.slug,
      title: t(s.title, lang),
      items: faqs.filter((f) => f.service_slug === s.slug).map((f) => ({ id: f.id, q: t(f.question, lang), a: t(f.answer, lang) })),
    })),
  ].filter((g) => g.items.length);

  return (
    <>
      <div className="scroll-progress" aria-hidden="true" />
      <PageIntro
        lang={lang}
        crumbs={[
          { name: d.nav.home, path: "/" },
          { name: d.faq.title, path: "/veelgestelde-vragen" },
        ]}
        title={d.faq.title}
        lead={d.faq.lead}
      />
      <section className="pb-[var(--section)]">
        <div className="wrap">
          <FaqSearch lang={lang} groups={groups} />
        </div>
      </section>
      <section className="pb-[var(--section)]">
        <div className="wrap">
          <div className="flex flex-wrap items-center justify-between gap-6 rounded-[var(--radius-card)] bg-paper p-8 sm:p-12" data-reveal>
            <div className="flex max-w-[520px] flex-col gap-2">
              <h2 className="t-h3 text-[clamp(24px,2.6vw,32px)] font-[750] [font-stretch:115%]">{d.faq.notListed}</h2>
              <p className="text-slate">{d.faq.notListedText}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={`tel:${nav.phone}`} className="btn btn-primary">
                <span>{d.cta.callNumber(nav.phoneDisplay)}</span>
                <span className="knob">
                  <Icon name="phone" />
                </span>
              </a>
              <a href={whatsappHref(nav, nav.whatsappText)} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                <span>WhatsApp</span>
                <span className="knob">
                  <Icon name="whatsapp" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({ "@type": "Question", name: t(f.question, lang), acceptedAnswer: { "@type": "Answer", text: t(f.answer, lang) } })),
        }}
      />
    </>
  );
}
