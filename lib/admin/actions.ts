"use server";

import { createHash, randomBytes } from "node:crypto";
import sharp from "sharp";
import { updateTag } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/slugify";
import { SITE_URL } from "@/lib/site";
import { requireAction, type Role } from "./auth";
import { LEAD_STATUSES, type LeadStatus } from "./leads";

export type ActionResult<T = undefined> = { ok: true; data?: T } | { ok: false; error: string };

// ---------------------------------------------------------------- leads


export async function setLeadStatus(id: string, status: LeadStatus): Promise<ActionResult> {
  if (!LEAD_STATUSES.includes(status)) return { ok: false, error: "Ongeldige status" };
  const { db } = await requireAction("admin");
  const { error } = await db.from("quote_requests").update({ status }).eq("id", id);
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function assignLead(id: string, assignee: string | null): Promise<ActionResult> {
  const { db } = await requireAction("admin");
  const { error } = await db.from("quote_requests").update({ assignee }).eq("id", id);
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function addLeadEvent(id: string, type: "note" | "call" | "email" | "whatsapp", body: string): Promise<ActionResult> {
  const { db, user } = await requireAction("admin");
  const text = body.trim().slice(0, 4000);
  if (type === "note" && !text) return { ok: false, error: "Schrijf eerst een notitie." };
  const { error } = await db.from("lead_events").insert({ lead_id: id, type, body: text || null, actor: user.id });
  return error ? { ok: false, error: error.message } : { ok: true };
}

// ---------------------------------------------------------------- media

const MAX_BYTES = 10 * 1024 * 1024;
const FORMATS: Record<string, string> = { jpeg: "image/jpeg", png: "image/png", webp: "image/webp", avif: "image/avif" };

export type MediaRow = {
  id: string;
  bucket: string;
  path: string;
  width: number;
  height: number;
  dominant_color: string;
  alt: { nl: string; en?: string };
  focal_x: number;
  focal_y: number;
  created_at: string;
  uses: number;
};

/**
 * Upload a photo. The image is decoded and re-encoded on the server (which rejects
 * anything that isn't a real image and strips EXIF, including GPS positions), resized
 * to at most 2400px, hashed, and refused when the same file already exists.
 */
export async function uploadMedia(form: FormData): Promise<ActionResult<{ id: string; duplicate?: boolean }>> {
  const { db } = await requireAction("editor");
  const file = form.get("file");
  const altNl = String(form.get("alt_nl") ?? "").trim().slice(0, 300);
  const altEn = String(form.get("alt_en") ?? "").trim().slice(0, 300);
  if (!(file instanceof File)) return { ok: false, error: "Kies een bestand." };
  if (!altNl) return { ok: false, error: "Beschrijf wat er op de foto staat (alt-tekst). Dat is verplicht." };
  if (file.size > MAX_BYTES) return { ok: false, error: "Het bestand is groter dan 10 MB." };

  let body: Buffer;
  let meta: sharp.Metadata;
  try {
    const input = Buffer.from(await file.arrayBuffer());
    const info = await sharp(input).metadata();
    if (!info.format || !FORMATS[info.format === "jpg" ? "jpeg" : info.format]) return { ok: false, error: "Alleen JPG, PNG, WebP of AVIF." };
    const format = info.format === "png" ? "png" : info.format === "webp" ? "webp" : info.format === "avif" ? "avif" : "jpeg";
    body = await sharp(input)
      .rotate()
      .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
      .toFormat(format, format === "jpeg" ? { quality: 82, mozjpeg: true } : { quality: 82 })
      .toBuffer();
    meta = await sharp(body).metadata();
  } catch {
    return { ok: false, error: "Dit bestand is geen geldige afbeelding." };
  }

  const sha256 = createHash("sha256").update(body).digest("hex");
  const { data: existing } = await db.from("media").select("id").eq("sha256", sha256).maybeSingle();
  if (existing) return { ok: true, data: { id: existing.id, duplicate: true } };

  const ext = meta.format === "jpeg" ? "jpg" : meta.format!;
  const path = `photos/${slugify(altNl).slice(0, 60) || "foto"}-${randomBytes(3).toString("hex")}.${ext}`;
  const up = await db.storage.from("media").upload(path, body, { contentType: FORMATS[meta.format!], cacheControl: "31536000" });
  if (up.error) return { ok: false, error: `Uploaden mislukt: ${up.error.message}` };

  const { dominant } = await sharp(body).stats();
  const hex = "#" + [dominant.r, dominant.g, dominant.b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
  const { data, error } = await db
    .from("media")
    .insert({ bucket: "media", path, mime: FORMATS[meta.format!], bytes: body.length, width: meta.width!, height: meta.height!, sha256, dominant_color: hex, alt: altEn ? { nl: altNl, en: altEn } : { nl: altNl } })
    .select("id")
    .single();
  if (error) {
    await db.storage.from("media").remove([path]);
    return { ok: false, error: error.message };
  }
  updateTag("media");
  return { ok: true, data: { id: data.id } };
}

export async function listMedia(): Promise<MediaRow[]> {
  const { db } = await requireAction("editor");
  const [{ data: media }, { data: usage }] = await Promise.all([
    db.from("media").select("id, bucket, path, width, height, dominant_color, alt, focal_x, focal_y, created_at").order("created_at", { ascending: false }),
    db.from("media_usage").select("media_id, uses"),
  ]);
  const uses = new Map((usage ?? []).map((u) => [u.media_id, u.uses ?? 0]));
  return (media ?? []).map((m) => ({ ...(m as unknown as MediaRow), uses: Number(uses.get(m.id) ?? 0) }));
}

export async function updateMedia(id: string, alt: { nl: string; en?: string }, focal: { x: number; y: number }): Promise<ActionResult> {
  const { db } = await requireAction("editor");
  const nl = alt.nl.trim().slice(0, 300);
  if (!nl) return { ok: false, error: "De Nederlandse alt-tekst is verplicht." };
  const en = alt.en?.trim().slice(0, 300);
  const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
  const { error } = await db.from("media").update({ alt: en ? { nl, en } : { nl }, focal_x: clamp(focal.x), focal_y: clamp(focal.y) }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  updateTag("media");
  return { ok: true };
}

/** Only unused media can be deleted, so nothing on the site breaks. */
export async function deleteMedia(id: string): Promise<ActionResult> {
  const { db } = await requireAction("editor");
  const { data: usage } = await db.from("media_usage").select("uses").eq("media_id", id).maybeSingle();
  if (Number(usage?.uses ?? 0) > 0) return { ok: false, error: "Deze foto wordt nog gebruikt. Haal hem eerst weg waar hij staat." };
  const { data: row } = await db.from("media").select("bucket, path").eq("id", id).single();
  if (!row) return { ok: false, error: "Niet gevonden." };
  if (row.bucket !== "media") return { ok: false, error: "Productfoto's uit het oude beheer worden bewaard." };
  const { error } = await db.from("media").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  await db.storage.from("media").remove([row.path]);
  updateTag("media");
  return { ok: true };
}

// ---------------------------------------------------------------- settings + home

export async function saveSetting(key: string, value: unknown): Promise<ActionResult> {
  const { db } = await requireAction("admin");
  if (!/^[a-z_]+$/.test(key)) return { ok: false, error: "Ongeldige sleutel" };
  const { error } = await db.from("site_settings").upsert({ key, value: value as never });
  if (error) return { ok: false, error: error.message };
  updateTag("settings");
  return { ok: true };
}

export async function saveHomeSection(key: string, content: unknown): Promise<ActionResult> {
  const { db } = await requireAction("editor");
  if (!/^[a-z_]+$/.test(key)) return { ok: false, error: "Ongeldige sleutel" };
  const { error } = await db.from("home_sections").upsert({ key, content: content as never });
  if (error) return { ok: false, error: error.message };
  updateTag("home");
  return { ok: true };
}

// ---------------------------------------------------------------- users (owner)

export async function inviteUser(email: string, name: string, role: Role): Promise<ActionResult> {
  await requireAction("owner");
  const clean = email.trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clean)) return { ok: false, error: "Ongeldig e-mailadres." };
  if (!["editor", "admin", "owner"].includes(role)) return { ok: false, error: "Ongeldige rol." };
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.inviteUserByEmail(clean, {
    redirectTo: `${SITE_URL}/admin/auth/callback`,
    data: { full_name: name.trim().slice(0, 120) },
  });
  if (error) return { ok: false, error: error.message.includes("already") ? "Dit e-mailadres heeft al een account." : error.message };
  // Service role: the profile guard allows it (no auth.uid()).
  await admin.from("profiles").update({ role, active: true, full_name: name.trim().slice(0, 120) }).eq("id", data.user.id);
  return { ok: true };
}

export async function setUserAccess(id: string, patch: { role?: Role; active?: boolean }): Promise<ActionResult> {
  const { db, user } = await requireAction("owner");
  if (id === user.id && (patch.active === false || (patch.role && patch.role !== "owner"))) {
    return { ok: false, error: "U kunt uw eigen toegang niet beperken. Laat een andere eigenaar dat doen." };
  }
  const { error } = await db.from("profiles").update(patch).eq("id", id);
  return error ? { ok: false, error: error.message.includes("owner") ? "Er moet minstens één actieve eigenaar zijn." : error.message } : { ok: true };
}

export async function updateOwnName(name: string): Promise<ActionResult> {
  const { db, user } = await requireAction("editor");
  const { error } = await db.from("profiles").update({ full_name: name.trim().slice(0, 120) }).eq("id", user.id);
  return error ? { ok: false, error: error.message } : { ok: true };
}
