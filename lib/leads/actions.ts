"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { getSettings } from "@/lib/content";
import { createAdminClient } from "@/lib/supabase/admin";
import { SITE_URL } from "@/lib/site";
import { companyMail, customerMail, sendMail } from "./mail";
import { leadSchema, type FieldErrors, type LeadInput, type LeadResult } from "./schema";

const MIN_FILL_MS = 2500; // faster than this is a bot
const LIMIT = 5; // requests …
const WINDOW_S = 15 * 60; // … per 15 minutes per visitor

/**
 * Accepts a quote or contact request from the site. Validates with zod, drops bots
 * (honeypot + fill time), rate-limits per hashed IP, stores the lead with the service
 * role (visitors have no insert rights), writes the first timeline entry and sends email.
 */
export async function submitLead(input: LeadInput & { website?: string; startedAt?: number }): Promise<LeadResult> {
  // Honeypot or impossibly fast: pretend it worked, store nothing.
  if (input.website || (input.startedAt && Date.now() - input.startedAt < MIN_FILL_MS)) {
    return { ok: true, ref: "MMC-0000" };
  }

  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    const fields: FieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fields[key] ??= issue.message.length < 20 ? issue.message : "required";
    }
    return { ok: false, error: "invalid", fields };
  }
  const lead = parsed.data;

  const db = createAdminClient();
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const key = createHash("sha256").update(`${ip}|${process.env.RATE_LIMIT_SALT ?? ""}`).digest("hex");
  const { data: allowed, error: rateError } = await db.rpc("check_rate_limit", { p_key: key, p_max: LIMIT, p_window_seconds: WINDOW_S });
  if (rateError) console.error("rate limit", rateError.message);
  if (allowed === false) return { ok: false, error: "rate" };

  const row =
    lead.kind === "offerte"
      ? {
          kind: "offerte",
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          postcode: lead.postcode,
          house_number: lead.house_number,
          property_type: lead.property_type ?? null,
          timing: lead.timing ?? null,
          services: lead.services,
          service_slug: lead.services[0],
          product_slug: lead.product_slug,
          message: lead.message,
          answers: { variant: lead.variant },
          locale: lead.locale,
          source_page: lead.source_page,
          utm: lead.utm,
        }
      : { kind: "contact", name: lead.name, email: lead.email, phone: lead.phone, message: lead.message, locale: lead.locale, source_page: lead.source_page };

  const { data: saved, error } = await db
    .from("quote_requests")
    .insert({ ...row, status: "new", consent_at: new Date().toISOString() })
    .select("id, ref")
    .single();
  if (error || !saved) {
    console.error("lead insert", error?.message);
    return { ok: false, error: "server" };
  }

  await db.from("lead_events").insert({ lead_id: saved.id, type: "created", body: lead.kind === "offerte" ? "Via de offertewizard" : "Via het contactformulier", actor: null });

  // Email never blocks the lead: failures are written to the timeline instead.
  const settings = await getSettings();
  const results = await Promise.allSettled([
    sendMail(companyMail(lead, saved.ref, `${SITE_URL}/admin/aanvragen/${saved.id}`)),
    sendMail(customerMail(lead, saved.ref, settings.contact.phone_display)),
  ]);
  const failed = results.filter((r) => r.status === "rejected").map((r) => String((r as PromiseRejectedResult).reason).slice(0, 300));
  await db.from("lead_events").insert({
    lead_id: saved.id,
    type: "notify",
    body: failed.length ? `E-mail mislukt: ${failed.join(" | ")}` : `Melding verstuurd naar ${process.env.MAIL_TO ?? "info@mmctechniek.nl"} (${process.env.MAIL_PROVIDER ?? "log"})`,
    actor: null,
  });

  return { ok: true, ref: saved.ref };
}
