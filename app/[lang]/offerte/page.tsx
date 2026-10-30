import { siteNav } from "@/lib/nav";
import { Breadcrumbs } from "@/components/site/Page";
import { QuoteWizard, type WizardPrefill } from "@/components/site/QuoteWizard";
import { getHome, getProduct, getServices, getSettings } from "@/lib/content";
import { t, type Locale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/ui";
import { PROPERTIES, TOPICS, topicForService, type Property, type Topic } from "@/lib/leads/options";
import { pageMeta } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/offerte">) {
  const { lang } = (await params) as { lang: Locale };
  const d = getDict(lang);
  return { ...pageMeta(lang, "/offerte", d.wizard.title, d.wizard.doneText.split(".")[0]), robots: { index: true, follow: true } };
}

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function QuotePage({ params, searchParams }: PageProps<"/[lang]/offerte">) {
  const { lang } = (await params) as { lang: Locale };
  const sp = await searchParams;
  const d = getDict(lang);
  const [services, settings, home] = await Promise.all([getServices(), getSettings(), getHome()]);
  const nav = await siteNav(lang, services, settings);

  // Prefill: ?onderwerpen=a,b  ?dienst=slug  ?product=slug&variant=…  ?postcode=&huisnummer=  ?pand=
  const topics = new Set<Topic>();
  for (const s of one(sp.onderwerpen).split(",")) if ((TOPICS as readonly string[]).includes(s)) topics.add(s as Topic);
  const fromService = topicForService(one(sp.dienst));
  if (fromService) topics.add(fromService);
  const productSlug = one(sp.product).slice(0, 160);
  const product = productSlug ? await getProduct(productSlug) : null;
  if (product) {
    const topic = topicForService(product.service.slug);
    if (topic) topics.add(topic);
  }
  const pand = one(sp.pand);
  const prefill: WizardPrefill = {
    topics: [...topics],
    product: product ? { slug: product.slug, name: product.name } : null,
    variant: product ? one(sp.variant).slice(0, 80) || null : null,
    postcode: one(sp.postcode).slice(0, 10),
    houseNumber: one(sp.huisnummer).slice(0, 12),
    property: (PROPERTIES as readonly string[]).includes(pand) ? (pand as Property) : null,
  };

  return (
    <section className="pb-[var(--section)] pt-8 sm:pt-12" data-wizard>
      <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <aside className="hidden flex-col gap-8 lg:flex">
          <Breadcrumbs
            lang={lang}
            items={[
              { name: d.nav.home, path: "/" },
              { name: d.wizard.title, path: "/offerte" },
            ]}
          />
          <div className="flex flex-col gap-4">
            <p className="t-h2 text-[clamp(36px,4vw,56px)]">{t(home.quote.title, lang)}</p>
            <p className="t-lead">{t(home.quote.lead, lang)}</p>
          </div>
          <ol className="relative flex flex-col gap-6 border-l border-line pl-8">
            {home.process.steps.slice(0, 3).map((s, i) => (
              <li key={i} className="relative">
                <span className="t-mono absolute -left-[49px] top-0 grid size-8 place-items-center rounded-full bg-white text-graphite shadow-[inset_0_0_0_1.5px_var(--color-line-strong)]">
                  {i + 1}
                </span>
                <span className="block font-semibold">{t(s.title, lang)}</span>
                <span className="text-[15px] text-slate">{t(s.text, lang)}</span>
              </li>
            ))}
          </ol>
        </aside>
        <div className="relative rounded-[24px] border border-line bg-white p-5 sm:p-9 lg:shadow-[var(--shadow-form)]">
          <QuoteWizard lang={lang} nav={{ phone: nav.phone, phoneDisplay: nav.phoneDisplay, whatsapp: nav.whatsapp }} prefill={prefill} />
        </div>
      </div>
    </section>
  );
}
