/** Answer options of the quote wizard. Labels live in lib/i18n/ui.ts (wizard.*). */
export const TOPICS = ["zonnepanelen", "thuisbatterij", "warmtepompen", "airconditioning", "meterkast", "laadpaal", "onderhoud", "advies"] as const;
export const PROPERTIES = ["rijwoning", "twee-onder-een-kap", "vrijstaand", "appartement", "bedrijfspand"] as const;
export const TIMINGS = ["asap", "3m", "orienting"] as const;

export type Topic = (typeof TOPICS)[number];
export type Property = (typeof PROPERTIES)[number];
export type Timing = (typeof TIMINGS)[number];

/** Map a service slug (from a service or product page) to a wizard topic. */
export function topicForService(slug: string | null | undefined): Topic | null {
  if (!slug) return null;
  if (slug === "verduurzaming") return "advies";
  return (TOPICS as readonly string[]).includes(slug) ? (slug as Topic) : null;
}
