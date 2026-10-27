export const LEAD_STATUSES = ["new", "in_progress", "quote_sent", "won", "lost"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "Nieuw",
  in_progress: "In behandeling",
  quote_sent: "Offerte verstuurd",
  won: "Gewonnen",
  lost: "Verloren",
};

/** Tailwind classes per status (tokens st-* in globals.css). */
export const STATUS_CLASS: Record<LeadStatus, string> = {
  new: "bg-st-new-bg text-st-new",
  in_progress: "bg-st-busy-bg text-st-busy",
  quote_sent: "bg-st-sent-bg text-st-sent",
  won: "bg-st-won-bg text-st-won",
  lost: "bg-st-lost-bg text-st-lost",
};

export const TOPIC_LABEL: Record<string, string> = {
  zonnepanelen: "Zonnepanelen",
  thuisbatterij: "Thuisbatterij",
  batterijopslag: "Thuisbatterij",
  warmtepompen: "Warmtepomp",
  airconditioning: "Airconditioning",
  meterkast: "Meterkast & elektra",
  laadpaal: "Laadpaal",
  onderhoud: "Onderhoud & service",
  advies: "Advies / anders",
  renovaties: "Verduurzaming",
};

export const PROPERTY_LABEL: Record<string, string> = {
  rijwoning: "Rijwoning",
  "twee-onder-een-kap": "2-onder-1-kap",
  vrijstaand: "Vrijstaand",
  appartement: "Appartement",
  bedrijfspand: "Bedrijfspand",
};

export const TIMING_LABEL: Record<string, string> = { asap: "Zo snel mogelijk", "3m": "Binnen 3 maanden", orienting: "Oriënteert zich" };

export type LeadRow = {
  id: string;
  ref: string;
  kind: string;
  status: LeadStatus;
  name: string;
  email: string;
  phone: string | null;
  postcode: string | null;
  house_number: string | null;
  property_type: string | null;
  timing: string | null;
  services: string[];
  service_slug: string | null;
  product_slug: string | null;
  product_name: string | null;
  message: string | null;
  answers: { variant?: string | null } | null;
  source_page: string | null;
  utm: Record<string, string> | null;
  locale: string;
  assignee: string | null;
  created_at: string;
  last_activity_at: string;
};

export const LEAD_COLUMNS =
  "id, ref, kind, status, name, email, phone, postcode, house_number, property_type, timing, services, service_slug, product_slug, product_name, message, answers, source_page, utm, locale, assignee, created_at, last_activity_at";

/** "12 min geleden", "Gisteren 16:40", "3 okt" */
export function relativeTime(iso: string, now = Date.now()) {
  const d = new Date(iso);
  const s = Math.round((now - d.getTime()) / 1000);
  if (s < 60) return "Zojuist";
  if (s < 3600) return `${Math.round(s / 60)} min geleden`;
  if (s < 6 * 3600) return `${Math.round(s / 3600)} uur geleden`;
  const time = d.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Amsterdam" });
  const today = new Date(now).toLocaleDateString("nl-NL", { timeZone: "Europe/Amsterdam" });
  const yesterday = new Date(now - 86400000).toLocaleDateString("nl-NL", { timeZone: "Europe/Amsterdam" });
  const day = d.toLocaleDateString("nl-NL", { timeZone: "Europe/Amsterdam" });
  if (day === today) return `Vandaag ${time}`;
  if (day === yesterday) return `Gisteren ${time}`;
  return d.toLocaleDateString("nl-NL", { day: "numeric", month: "short", timeZone: "Europe/Amsterdam" });
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0]!.toUpperCase())
    .slice(0, 2)
    .join("") || "?";
}
