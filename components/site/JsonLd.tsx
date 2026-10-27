import type { Service, Settings } from "@/lib/content/types";
import { href, t, type Locale } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/site";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  // `<` is escaped so content can never close the script tag.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function localBusiness(settings: Settings, services: Service[], lang: Locale) {
  const c = settings.contact;
  return {
    "@context": "https://schema.org",
    "@type": "Electrician",
    "@id": `${SITE_URL}/#business`,
    name: settings.company.name,
    url: SITE_URL + href(lang, "/"),
    logo: `${SITE_URL}/brand/logo.svg`,
    image: `${SITE_URL}/opengraph-image`,
    telephone: c.phone,
    email: c.email,
    foundingDate: String(settings.company.founded),
    vatID: settings.company.btw,
    address: { "@type": "PostalAddress", streetAddress: c.street, postalCode: c.postcode, addressLocality: c.city, addressCountry: "NL" },
    areaServed: ["Oudewater", "Woerden", "Bodegraven", "Utrecht"].map((name) => ({ "@type": "City", name })),
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "17:00" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: lang === "nl" ? "Diensten" : "Services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: t(s.title, lang), url: SITE_URL + href(lang, `/diensten/${s.slug}`) },
      })),
    },
  };
}

export function breadcrumbs(lang: Locale, items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: SITE_URL + href(lang, it.path) })),
  };
}
