import Link from "next/link";
import { ContactForm } from "@/components/site/ContactForm";
import { buildNav, whatsappHref } from "@/components/site/nav";
import { PageIntro } from "@/components/site/Page";
import { Icon, type IconName } from "@/components/ui/Icon";
import { getServices, getSettings } from "@/lib/content";
import { href, t, type Locale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/ui";
import { pageMeta } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = (await params) as { lang: Locale };
  const d = getDict(lang);
  return pageMeta(lang, "/contact", d.contact.title, d.contact.lead);
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = (await params) as { lang: Locale };
  const d = getDict(lang);
  const [services, settings] = await Promise.all([getServices(), getSettings()]);
  const nav = buildNav(lang, services, settings);
  const c = settings.contact;

  const rows: { icon: IconName; label: string; value: React.ReactNode; href?: string; external?: boolean }[] = [
    { icon: "phone", label: d.contact.phone, value: c.phone_display, href: `tel:${c.phone}` },
    { icon: "whatsapp", label: "WhatsApp", value: d.cta.whatsappLong, href: whatsappHref(nav, nav.whatsappText), external: true },
    { icon: "mail", label: d.contact.email, value: c.email, href: `mailto:${c.email}` },
    {
      icon: "pin",
      label: d.contact.address,
      value: (
        <>
          {c.street}, {c.postcode} {c.city}
          <span className="mt-1 block text-[14px] font-normal text-blue">{d.cta.route} ↗</span>
        </>
      ),
      href: c.maps_url,
      external: true,
    },
    { icon: "clock", label: d.contact.hours, value: t(settings.hours, lang) },
  ];

  return (
    <>
      <PageIntro
        lang={lang}
        crumbs={[
          { name: d.nav.home, path: "/" },
          { name: d.contact.title, path: "/contact" },
        ]}
        title={d.contact.title}
        lead={d.contact.lead}
      />
      <section className="pb-[var(--section)]">
        <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <div className="flex flex-col gap-8">
            <ul className="border-b border-line">
              {rows.map((r) => {
                const inner = (
                  <>
                    <span className="grid size-11 flex-none place-items-center rounded-full bg-paper text-blue transition-colors group-hover:bg-sky">
                      <Icon name={r.icon} />
                    </span>
                    <span className="flex flex-col">
                      <span className="t-mono text-graphite">{r.label}</span>
                      <span className="text-[17px] font-semibold">{r.value}</span>
                    </span>
                  </>
                );
                return (
                  <li key={r.label} className="border-t border-line">
                    {r.href ? (
                      <a href={r.href} {...(r.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="group flex items-center gap-4 py-4">
                        {inner}
                      </a>
                    ) : (
                      <div className="flex items-center gap-4 py-4">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
            <dl className="grid grid-cols-2 gap-4 rounded-[var(--radius-tile)] bg-paper p-6">
              <div className="col-span-2">
                <dt className="t-mono text-graphite">{d.contact.company}</dt>
                <dd className="font-semibold">{settings.company.name}</dd>
              </div>
              <div>
                <dt className="t-mono text-graphite">{d.contact.kvk}</dt>
                <dd>{settings.company.kvk}</dd>
              </div>
              <div>
                <dt className="t-mono text-graphite">{d.contact.btw}</dt>
                <dd>{settings.company.btw}</dd>
              </div>
            </dl>
          </div>
          <div className="flex flex-col gap-6 rounded-[24px] border border-line p-6 sm:p-9">
            <div className="flex flex-col gap-2">
              <h2 className="t-h3 text-[26px] font-[750] [font-stretch:115%]">{d.contact.formTitle}</h2>
              <p className="text-[15px] text-slate">
                {d.contact.quoteHint}{" "}
                <Link href={href(lang, "/offerte")} className="link">
                  {d.cta.quote}
                </Link>
              </p>
            </div>
            <ContactForm lang={lang} />
          </div>
        </div>
      </section>
    </>
  );
}
