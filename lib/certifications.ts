import type { Locale } from "@/lib/i18n/config";

/**
 * Certifications the company holds, in one place. Over ons, Zakelijk, the trust
 * strip and the footer all read this module, so the logo, the wording and the order
 * cannot drift apart.
 *
 * Which ones are shown is decided by `site_settings.certifications` (names, edited in
 * the admin). A name that is not in this list is still shown, as text.
 *
 * Only certifications the company has claimed on its own site are listed here.
 * TODO(owner): airco and heat pump installers usually also hold F-gassen (STEK / BRL 100)
 * certificates. None is mentioned anywhere in the repository history, so none is shown.
 */
export type Certification = {
  /** Name as stored in site_settings.certifications. */
  name: string;
  logo: string;
  /** Natural logo size, for the aspect ratio. */
  width: number;
  height: number;
  /** What the standard covers, in one sentence. */
  means: Record<Locale, string>;
  /** Why it matters to a business. */
  business: Record<Locale, string>;
};

export const CERTIFICATIONS: readonly Certification[] = [
  {
    name: "NEN 1010",
    logo: "/brand/certs/nen-1010.png",
    width: 879,
    height: 284,
    means: {
      nl: "Veiligheidseisen voor elektrische installaties in gebouwen.",
      en: "Safety requirements for electrical installations in buildings.",
    },
    business: {
      nl: "Een nieuwe of aangepaste installatie voldoet aan de geldende eisen en is veilig in gebruik.",
      en: "A new or altered installation meets the current requirements and is safe to use.",
    },
  },
  {
    name: "NEN 3140",
    logo: "/brand/certs/nen-3140.png",
    width: 500,
    height: 500,
    means: {
      nl: "Veilig werken aan en inspecteren van elektrische installaties.",
      en: "Safe operation and inspection of electrical installations.",
    },
    business: {
      nl: "Werkgevers moeten hun installaties en arbeidsmiddelen periodiek laten inspecteren. NEN 3140 is daarvoor de norm.",
      en: "Employers must have their installations and equipment inspected periodically. NEN 3140 is the standard for it.",
    },
  },
  {
    name: "VCA",
    logo: "/brand/certs/vca.png",
    width: 500,
    height: 500,
    means: {
      nl: "Veiligheid, gezondheid en milieu op de werkplek.",
      en: "Health, safety and environment at work.",
    },
    business: {
      nl: "Op bedrijfsterreinen en bouwplaatsen vragen opdrachtgevers vaak om VCA.",
      en: "On industrial sites and building sites, clients often ask for VCA.",
    },
  },
];

const norm = (s: string) => s.replace(/[\s-]+/g, "").toLowerCase();

/** The certifications to show: those listed in settings, known ones first with their logo. */
export function certificationsFor(names: readonly string[]): { known: Certification[]; unknown: string[] } {
  const known: Certification[] = [];
  const unknown: string[] = [];
  for (const n of names) {
    const hit = CERTIFICATIONS.find((c) => norm(c.name) === norm(n));
    if (hit) known.push(hit);
    else unknown.push(n);
  }
  return { known, unknown };
}
