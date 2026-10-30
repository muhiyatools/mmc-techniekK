import type { IconName } from "@/components/ui/Icon";

/** Field definitions drive both the admin form (UI) and the save action (whitelist + coercion). */
export type FieldDef =
  | { key: string; kind: "i18n"; label: string; required?: boolean; multiline?: boolean; markdown?: boolean; hint?: string }
  | { key: string; kind: "text"; label: string; required?: boolean; hint?: string; placeholder?: string }
  | { key: string; kind: "slug"; label: string; from: string }
  | { key: string; kind: "number"; label: string; hint?: string; min?: number; max?: number }
  | { key: string; kind: "boolean"; label: string; hint?: string }
  | { key: string; kind: "select"; label: string; options: { value: string; label: string }[]; nullable?: boolean }
  | { key: string; kind: "i18nList"; label: string; hint?: string }
  | { key: string; kind: "steps"; label: string }
  | { key: string; kind: "variants"; label: string; hint?: string }
  | { key: string; kind: "media"; label: string; hint?: string }
  // `gallery` syncs a product's join table; the homepage editor reuses it for an array of media ids.
  | { key: string; kind: "gallery"; label: string; table: "product_images" | "project_images"; fk: "product_id" | "project_id" }
  | { key: string; kind: "relation"; label: string; source: "services"; nullable?: boolean }
  | { key: string; kind: "relationMulti"; label: string; source: "brands"; table: "product_brands"; fk: "product_id"; other: "brand_id" };

export type ContentType = {
  table: "services" | "products" | "brands" | "reviews" | "team_members" | "faqs" | "pages";
  label: string;
  singular: string;
  icon: IconName;
  tag: string; // cache tag revalidated on save
  /** Field shown as the row title in lists. */
  titleKey: string;
  /** Public path for "Bekijk op site" (null = not a page of its own). */
  publicPath: ((row: Record<string, unknown>) => string | null) | null;
  sortable: boolean;
  fields: FieldDef[];
};

const STATUS: FieldDef = {
  key: "status",
  kind: "select",
  label: "Status",
  options: [
    { value: "draft", label: "Concept (niet zichtbaar)" },
    { value: "published", label: "Gepubliceerd" },
  ],
};

export const CONTENT_TYPES: Record<string, ContentType> = {
  diensten: {
    table: "services",
    label: "Diensten",
    singular: "dienst",
    icon: "zonnepanelen",
    tag: "services",
    titleKey: "title",
    publicPath: (r) => `/diensten/${r.slug}`,
    sortable: true,
    fields: [
      { key: "title", kind: "i18n", label: "Naam", required: true },
      { key: "slug", kind: "slug", label: "URL", from: "title" },
      { key: "kicker", kind: "i18n", label: "Label in de kringloop", hint: "Eén woord, bijvoorbeeld Opwekken." },
      { key: "summary", kind: "i18n", label: "Korte omschrijving", multiline: true, hint: "Eén zin. Komt op de homepage en bovenaan de pagina." },
      { key: "body", kind: "i18n", label: "Tekst", multiline: true, markdown: true },
      { key: "audience", kind: "i18n", label: "Voor wie", multiline: true },
      { key: "steps", kind: "steps", label: "Zo werkt het (stappen)" },
      { key: "tags", kind: "i18nList", label: "Kenmerken", hint: "Eén per regel, kort." },
      { key: "hero_media_id", kind: "media", label: "Foto", hint: "Alleen eigen projectfoto's. Zonder foto toont de pagina de kringloop." },
      { key: "seo_description", kind: "i18n", label: "Omschrijving voor Google", multiline: true },
      STATUS,
    ],
  },
  aanbod: {
    table: "products",
    label: "Aanbod",
    singular: "product",
    icon: "box",
    tag: "products",
    titleKey: "name",
    publicPath: (r) => `/aanbod/${r.slug}`,
    sortable: true,
    fields: [
      { key: "name", kind: "text", label: "Naam", required: true },
      { key: "slug", kind: "slug", label: "URL", from: "name" },
      { key: "service_id", kind: "relation", label: "Dienst", source: "services" },
      { key: "brands", kind: "relationMulti", label: "Merk", source: "brands", table: "product_brands", fk: "product_id", other: "brand_id" },
      { key: "summary", kind: "i18n", label: "Korte omschrijving", multiline: true },
      { key: "body", kind: "i18n", label: "Tekst", multiline: true, markdown: true },
      { key: "specs", kind: "i18nList", label: "Specificaties", hint: "Eén per regel." },
      { key: "variants", kind: "variants", label: "Uitvoeringen", hint: "Bijvoorbeeld vermogens of capaciteiten." },
      { key: "price_from", kind: "number", label: "Prijs vanaf (€, incl. installatie)", min: 0 },
      { key: "price_to", kind: "number", label: "Prijs tot (€)", min: 0 },
      { key: "price_note", kind: "i18n", label: "Toelichting bij de prijs" },
      { key: "media_id", kind: "media", label: "Hoofdfoto" },
      { key: "gallery", kind: "gallery", label: "Meer foto's", table: "product_images", fk: "product_id" },
      STATUS,
    ],
  },
  merken: {
    table: "brands",
    label: "Merken",
    singular: "merk",
    icon: "tag",
    tag: "brands",
    titleKey: "name",
    publicPath: null,
    sortable: true,
    fields: [
      { key: "name", kind: "text", label: "Naam", required: true },
      { key: "slug", kind: "slug", label: "Code", from: "name" },
      {
        key: "kind",
        kind: "select",
        label: "Soort",
        options: [
          { value: "supplier", label: "Merk dat we installeren" },
          { value: "client", label: "Klant (logo op Zakelijk)" },
        ],
      },
      { key: "logo_path", kind: "text", label: "Logo", hint: "Pad naar een logo in één kleur, bijvoorbeeld /brand/logos/daikin.png." },
      { key: "website", kind: "text", label: "Website" },
      { key: "show_in_strip", kind: "boolean", label: "Tonen in de merkenrij op de homepage" },
      STATUS,
    ],
  },
  reviews: {
    table: "reviews",
    label: "Reviews",
    singular: "review",
    icon: "star",
    tag: "reviews",
    titleKey: "author",
    publicPath: null,
    sortable: true,
    fields: [
      { key: "author", kind: "text", label: "Naam klant", required: true },
      { key: "place", kind: "text", label: "Plaats" },
      { key: "body", kind: "i18n", label: "Review", required: true, multiline: true },
      { key: "rating", kind: "number", label: "Sterren (1–5)", min: 1, max: 5 },
      { key: "source", kind: "text", label: "Bron", placeholder: "Google" },
      { key: "consent", kind: "boolean", label: "Klant heeft toestemming gegeven voor publicatie" },
      STATUS,
    ],
  },
  team: {
    table: "team_members",
    label: "Team",
    singular: "teamlid",
    icon: "users",
    tag: "team",
    titleKey: "name",
    publicPath: null,
    sortable: true,
    fields: [
      { key: "name", kind: "text", label: "Naam", required: true },
      { key: "role", kind: "i18n", label: "Functie" },
      { key: "bio", kind: "i18n", label: "Over", multiline: true },
      { key: "media_id", kind: "media", label: "Foto" },
      STATUS,
    ],
  },
  vragen: {
    table: "faqs",
    label: "Vragen (FAQ)",
    singular: "vraag",
    icon: "help",
    tag: "faqs",
    titleKey: "question",
    publicPath: null,
    sortable: true,
    fields: [
      { key: "question", kind: "i18n", label: "Vraag", required: true },
      { key: "answer", kind: "i18n", label: "Antwoord", required: true, multiline: true },
      { key: "service_id", kind: "relation", label: "Hoort bij dienst", source: "services", nullable: true },
      { key: "featured", kind: "boolean", label: "Tonen op de homepage", hint: "Maximaal vijf." },
      STATUS,
    ],
  },
  paginas: {
    table: "pages",
    label: "Pagina's",
    singular: "pagina",
    icon: "doc",
    tag: "pages",
    titleKey: "title",
    publicPath: (r) => `/${r.slug}`,
    sortable: false,
    fields: [
      { key: "title", kind: "i18n", label: "Titel", required: true },
      { key: "slug", kind: "slug", label: "URL", from: "title" },
      { key: "body", kind: "i18n", label: "Tekst", multiline: true, markdown: true, hint: "De eerste alinea wordt de intro onder de titel (Over ons, Zakelijk)." },
      { key: "seo_description", kind: "i18n", label: "Omschrijving voor Google", multiline: true },
      STATUS,
    ],
  },
};

export type ContentKey = keyof typeof CONTENT_TYPES;
export const isContentKey = (k: string): k is ContentKey => k in CONTENT_TYPES;
