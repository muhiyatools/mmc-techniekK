import { z } from "zod";
import { PROPERTIES, TIMINGS, TOPICS } from "./options";

const trimmed = (max: number) => z.string().trim().max(max);
const optional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : null));

/** Dutch postcode (1234 AB), tolerant of spacing/case; empty allowed. */
const postcode = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v.toUpperCase().replace(/\s+/g, "") : ""))
  .refine((v) => v === "" || /^[1-9][0-9]{3}[A-Z]{2}$/.test(v), { message: "postcode" })
  .transform((v) => (v ? `${v.slice(0, 4)} ${v.slice(4)}` : null));

const phone = z
  .string()
  .trim()
  .max(40)
  .refine((v) => v.replace(/[^\d]/g, "").length >= 9, { message: "phone" });

export const quoteSchema = z.object({
  kind: z.literal("offerte"),
  services: z.array(z.enum(TOPICS)).min(1, { message: "services" }),
  property_type: z.enum(PROPERTIES).optional().nullable(),
  timing: z.enum(TIMINGS).optional().nullable(),
  postcode,
  house_number: optional(12),
  product_slug: optional(160),
  variant: optional(80),
  name: trimmed(120).min(1, { message: "required" }),
  phone,
  email: z.string().trim().max(200).email({ message: "email" }),
  message: optional(4000),
  locale: z.enum(["nl", "en"]),
  source_page: optional(300),
  utm: z.record(z.string(), z.string().max(120)).optional().default({}),
});

export const contactSchema = z.object({
  kind: z.literal("contact"),
  name: trimmed(120).min(1, { message: "required" }),
  phone: z
    .string()
    .trim()
    .max(40)
    .optional()
    .transform((v) => (v ? v : null))
    .refine((v) => v === null || v.replace(/[^\d]/g, "").length >= 9, { message: "phone" }),
  email: z.string().trim().max(200).email({ message: "email" }),
  message: trimmed(4000).min(1, { message: "required" }),
  locale: z.enum(["nl", "en"]),
  source_page: optional(300),
});

export const leadSchema = z.discriminatedUnion("kind", [quoteSchema, contactSchema]);
export type LeadInput = z.input<typeof leadSchema>;
export type Lead = z.output<typeof leadSchema>;

/** Field → error code ("required" | "email" | "phone" | "postcode" | "services"). */
export type FieldErrors = Partial<Record<string, string>>;

export type LeadResult = { ok: true; ref: string } | { ok: false; error: "invalid" | "rate" | "server"; fields?: FieldErrors };
