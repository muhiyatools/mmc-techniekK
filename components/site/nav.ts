import type { Service, Settings } from "@/lib/content/types";
import { t, type Locale } from "@/lib/i18n/config";
import { serviceHref } from "@/lib/service-links";

/** Serializable navigation data passed from the server layout to client chrome. */
export type NavModel = {
  services: { slug: string; title: string; href: string; hasProducts: boolean }[];
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  whatsappText: string;
  email: string;
  certifications: string[];
  founded: number;
};

/** Pure builder; `servicesWithProducts` comes from lib/nav (server) so this module stays client-safe. */
export function buildNav(lang: Locale, services: Service[], settings: Settings, servicesWithProducts: ReadonlySet<string>): NavModel {
  return {
    services: services.map((s) => {
      const hasProducts = servicesWithProducts.has(s.slug);
      return { slug: s.slug, title: t(s.title, lang), hasProducts, href: serviceHref(lang, s.slug, hasProducts) };
    }),
    phone: settings.contact.phone,
    phoneDisplay: settings.contact.phone_display,
    whatsapp: settings.contact.whatsapp,
    whatsappText: t(settings.whatsapp_messages, lang),
    email: settings.contact.email,
    certifications: settings.certifications,
    founded: settings.company.founded,
  };
}

export const whatsappHref = (nav: Pick<NavModel, "whatsapp">, text?: string) =>
  `https://wa.me/${nav.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
