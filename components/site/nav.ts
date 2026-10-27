import type { Service, Settings } from "@/lib/content/types";
import { t, type Locale } from "@/lib/i18n/config";

/** Serializable navigation data passed from the server layout to client chrome. */
export type NavModel = {
  services: { slug: string; title: string; kicker: string }[];
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  whatsappText: string;
  email: string;
  certifications: string[];
  founded: number;
};

export function buildNav(lang: Locale, services: Service[], settings: Settings): NavModel {
  return {
    services: services.map((s) => ({ slug: s.slug, title: t(s.title, lang), kicker: t(s.kicker, lang) })),
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
