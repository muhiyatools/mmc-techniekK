"use server";

import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import sharp from "sharp";
import { revalidateTag } from "next/cache";
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
const EXTENSIONS = ["jpg", "png", "webp", "avif"];
/** Only paths this app handed out itself may be finalised (see `createUploadTarget`). */
const UPLOAD_PATH = /^photos\/[a-z0-9][a-z0-9-]{0,79}\.(jpg|png|webp|avif)$/;
const MEDIA_COLUMNS = "id, bucket, path, width, height, dominant_color, alt, focal_x, focal_y, created_at";

/**
 * Step 2 only accepts what step 1 issued. Without this, a stale or crafted call could
 * point at a photo that is already on the site and overwrite or remove it.
 */
function signPath(path: string) {
  return createHmac("sha256", process.env.SUPABASE_SECRET_KEY ?? process.env.RATE_LIMIT_SALT ?? "").update(path).digest("base64url");
}

function isIssuedPath(path: string, proof: string) {
  const expected = Buffer.from(signPath(path));
  const given = Buffer.from(String(proof ?? ""));
  return expected.length > 0 && expected.length === given.length && timingSafeEqual(expected, given);
}

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
 * Step 1 of an upload: hand the browser a one-shot signed URL so the photo goes
 * straight into Storage. It never travels through a Server Action, which refuses
 * request bodies over 1 MB — a normal phone photo is several times that.
 */
export async function createUploadTarget(name: string): Promise<ActionResult<{ path: string; token: string; proof: string }>> {
  const { db } = await requireAction("editor");
  const ext = (/\.([a-z0-9]+)$/i.exec(String(name ?? ""))?.[1] ?? "").toLowerCase().replace("jpeg", "jpg");
  if (!EXTENSIONS.includes(ext)) return { ok: false, error: "Alleen JPG, PNG, WebP of AVIF." };
  const stem = slugify(String(name ?? "").replace(/\.[^.]+$/, "")).slice(0, 60) || "foto";
  const path = `photos/${stem}-${randomBytes(3).toString("hex")}.${ext}`;
  const { data, error } = await db.storage.from("media").createSignedUploadUrl(path);
  if (error || !data?.token) return { ok: false, error: `Upload voorbereiden mislukt: ${error?.message ?? "onbekende fout"}.` };
  return { ok: true, data: { path, token: data.token, proof: signPath(path) } };
}

/**
 * Step 2: the file is in Storage. The image is decoded and re-encoded on the server
 * (which rejects anything that isn't a real image and strips EXIF, including GPS
 * positions), resized to at most 2400px, hashed, and refused when the same file
 * already exists.
 */
export async function finalizeMediaUpload(input: { path: string; proof: string; altNl: string; altEn?: string }): Promise<ActionResult<{ id: string; duplicate: boolean; media: MediaRow }>> {
  const { db } = await requireAction("editor");
  const path = String(input?.path ?? "");
  const proof = String(input?.proof ?? "");
  const altNl = String(input?.altNl ?? "").trim().slice(0, 300);
  const altEn = String(input?.altEn ?? "").trim().slice(0, 300);
  if (!UPLOAD_PATH.test(path) || !isIssuedPath(path, proof)) return { ok: false, error: "Onbekende upload. Probeer het opnieuw." };
  if (!altNl) return { ok: false, error: "Beschrijf wat er op de foto staat (alt-tekst). Dat is verplicht." };

  const bucket = db.storage.from("media");
  const { data: blob, error: downloadError } = await bucket.download(path);
  if (downloadError || !blob) return { ok: false, error: `De upload is niet ontvangen (${downloadError?.message ?? "onbekend"}).` };
  if (blob.size > MAX_BYTES) {
    await bucket.remove([path]);
    return { ok: false, error: "Het bestand is groter dan 10 MB." };
  }

  let body: Buffer;
  let meta: sharp.Metadata;
  try {
    const bytes = Buffer.from(await blob.arrayBuffer());
    const info = await sharp(bytes).metadata();
    const format = info.format === "jpg" ? "jpeg" : info.format;
    if (!format || !FORMATS[format]) throw new Error("unsupported format");
    body = await sharp(bytes)
      .rotate()
      .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
      .toFormat(format as "jpeg" | "png" | "webp" | "avif", format === "jpeg" ? { quality: 82, mozjpeg: true } : { quality: 82 })
      .toBuffer();
    meta = await sharp(body).metadata();
  } catch {
    await bucket.remove([path]);
    return { ok: false, error: "Dit bestand is geen geldige afbeelding." };
  }

  const sha256 = createHash("sha256").update(body).digest("hex");
  const { data: existing } = await db.from("media").select(MEDIA_COLUMNS).eq("sha256", sha256).maybeSingle();
  if (existing) {
    await bucket.remove([path]);
    const { data: usage } = await db.from("media_usage").select("uses").eq("media_id", existing.id).maybeSingle();
    return { ok: true, data: { id: existing.id, duplicate: true, media: { ...(existing as unknown as MediaRow), uses: Number(usage?.uses ?? 0) } } };
  }

  const contentType = FORMATS[meta.format!];
  const clean = await bucket.upload(path, body, { contentType, cacheControl: "31536000", upsert: true });
  if (clean.error) return { ok: false, error: `Opslaan mislukt: ${clean.error.message}` };

  const { dominant } = await sharp(body).stats();
  const hex = "#" + [dominant.r, dominant.g, dominant.b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
  const { data, error } = await db
    .from("media")
    .insert({ bucket: "media", path, mime: contentType, bytes: body.length, width: meta.width!, height: meta.height!, sha256, dominant_color: hex, alt: altEn ? { nl: altNl, en: altEn } : { nl: altNl } })
    .select(MEDIA_COLUMNS)
    .single();
  if (error) {
    await bucket.remove([path]);
    return { ok: false, error: error.message };
  }
  revalidateTag("media", { expire: 0 });
  return { ok: true, data: { id: data.id, duplicate: false, media: { ...(data as unknown as MediaRow), uses: 0 } } };
}

/** Page through a table: the API returns at most 1000 rows per request. */
async function selectPages<T>(page: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>): Promise<T[]> {
  const size = 1000;
  const rows: T[] = [];
  for (let from = 0; ; from += size) {
    const { data, error } = await page(from, from + size - 1);
    if (error) break;
    rows.push(...(data ?? []));
    if (!data || data.length < size) break;
  }
  return rows;
}

export async function listMedia(): Promise<MediaRow[]> {
  const { db } = await requireAction("editor");
  const [media, usage] = await Promise.all([
    selectPages<MediaRow>((from, to) => db.from("media").select(MEDIA_COLUMNS).order("created_at", { ascending: false }).range(from, to) as unknown as PromiseLike<{ data: MediaRow[] | null; error: { message: string } | null }>),
    selectPages<{ media_id: string; uses: number | null }>((from, to) => db.from("media_usage").select("media_id, uses").range(from, to) as unknown as PromiseLike<{ data: { media_id: string; uses: number | null }[] | null; error: { message: string } | null }>),
  ]);
  const uses = new Map(usage.map((u) => [u.media_id, Number(u.uses ?? 0)]));
  return media.map((m) => ({ ...m, uses: Number(uses.get(m.id) ?? 0) }));
}

export async function updateMedia(id: string, alt: { nl: string; en?: string }, focal: { x: number; y: number }): Promise<ActionResult> {
  const { db } = await requireAction("editor");
  const nl = alt.nl.trim().slice(0, 300);
  if (!nl) return { ok: false, error: "De Nederlandse alt-tekst is verplicht." };
  const en = alt.en?.trim().slice(0, 300);
  const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
  const { error } = await db.from("media").update({ alt: en ? { nl, en } : { nl }, focal_x: clamp(focal.x), focal_y: clamp(focal.y) }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateTag("media", { expire: 0 });
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
  revalidateTag("media", { expire: 0 });
  return { ok: true };
}

// ---------------------------------------------------------------- settings + home

export async function saveSetting(key: string, value: unknown): Promise<ActionResult> {
  const { db } = await requireAction("admin");
  if (!/^[a-z_]+$/.test(key)) return { ok: false, error: "Ongeldige sleutel" };
  const { error } = await db.from("site_settings").upsert({ key, value: value as never });
  if (error) return { ok: false, error: error.message };
  revalidateTag("settings", { expire: 0 });
  return { ok: true };
}

export async function saveHomeSection(key: string, content: unknown): Promise<ActionResult> {
  const { db } = await requireAction("editor");
  if (!/^[a-z_]+$/.test(key)) return { ok: false, error: "Ongeldige sleutel" };
  const { error } = await db.from("home_sections").upsert({ key, content: content as never });
  if (error) return { ok: false, error: error.message };
  revalidateTag("home", { expire: 0 });
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
