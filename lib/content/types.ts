import type { Localized } from "@/lib/i18n/config";
import type { Enums } from "@/lib/supabase/database.types";

export type Media = {
  id: string;
  bucket: string;
  path: string;
  width: number;
  height: number;
  dominant_color: string;
  alt: Localized;
  focal_x: number;
  focal_y: number;
};

export type Step = { title: Localized; text: Localized };

export type Service = {
  id: string;
  slug: string;
  sort_order: number;
  title: Localized;
  kicker: Localized;
  summary: Localized;
  body: Localized;
  audience: Localized;
  steps: Step[];
  tags: Localized<string[]>;
  seo_description: Localized;
  hero: Media | null;
};

export type Brand = {
  id: string;
  slug: string;
  name: string;
  kind: Enums<"brand_kind">;
  logo_path: string | null;
  website: string | null;
  show_in_strip: boolean;
  sort_order: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  sort_order: number;
  tier: string | null;
  summary: Localized;
  body: Localized;
  specs: Localized<string[]>;
  variants: Localized[];
  price_from: number | null;
  price_to: number | null;
  price_note: Localized;
  legacy_slugs: string[];
  media: Media | null;
  images: Media[];
  brands: Brand[];
  service: Pick<Service, "id" | "slug" | "title" | "kicker">;
};

export type Project = {
  id: string;
  slug: string;
  sort_order: number;
  title: Localized;
  summary: Localized;
  body: Localized;
  place: string | null;
  year: number | null;
  sector: Enums<"project_sector">;
  featured: boolean;
  cover: Media | null;
  images: Media[];
  services: Pick<Service, "slug" | "title">[];
};

export type Review = {
  id: string;
  author: string;
  place: string | null;
  body: Localized;
  rating: number;
  source: string | null;
};

export type Faq = {
  id: string;
  question: Localized;
  answer: Localized;
  featured: boolean;
  service_slug: string | null;
};

export type TeamMember = { id: string; name: string; role: Localized; bio: Localized; media: Media | null };

export type Page = { slug: string; title: Localized; body: Localized; seo_description: Localized };

export type Settings = {
  company: { name: string; founded: number; kvk: string; btw: string };
  contact: {
    street: string;
    postcode: string;
    city: string;
    phone: string;
    phone_display: string;
    whatsapp: string;
    email: string;
    maps_url: string;
  };
  hours: Localized;
  area: Localized;
  certifications: string[];
  social: { google_reviews_url: string | null; instagram_url: string | null };
  whatsapp_messages: Localized;
};

export type HomeContent = {
  hero: { title: Localized; lead: Localized; media?: string[] };
  services: { title: Localized; lead: Localized };
  audience: {
    title: Localized;
    home_title: Localized;
    home_points: Localized<string[]>;
    business_title: Localized;
    business_points: Localized<string[]>;
    home_media?: string;
    business_media?: string;
  };
  process: { title: Localized; steps: Step[] };
  quote: { title: Localized; lead: Localized };
};
