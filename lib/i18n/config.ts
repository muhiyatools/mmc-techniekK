export const locales = ["nl", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "nl";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Localised text as stored in the database: `{ nl, en? }`. */
export type Localized<T = string> = { nl: T; en?: T };

/** Pick the text for a locale, falling back to Dutch. */
export function t<T = string>(value: unknown, lang: Locale): T {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const v = value as Partial<Record<Locale, T>>;
    const picked = v[lang];
    const empty = picked === undefined || picked === null || (typeof picked === "string" && picked.trim() === "") || (Array.isArray(picked) && picked.length === 0);
    return (empty ? v.nl : picked) as T;
  }
  return value as T;
}

/** Public path for a locale. Dutch lives at the root, English under /en. */
export function href(lang: Locale, path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (lang === defaultLocale) return clean;
  return clean === "/" ? "/en" : `/en${clean}`;
}

export const htmlLang: Record<Locale, string> = { nl: "nl-NL", en: "en" };
