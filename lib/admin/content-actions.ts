"use server";

import { revalidateTag } from "next/cache";
import { slugify } from "@/lib/slugify";
import { requireAction } from "./auth";
import { CONTENT_TYPES, isContentKey, type FieldDef } from "./content-types";

type Payload = Record<string, unknown>;
export type SaveResult = { ok: true; id: string } | { ok: false; error: string; field?: string };

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const str = (v: unknown, max = 20000) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const loc = (v: unknown) => {
  const o = isObj(v) ? v : {};
  const out: Record<string, string> = {};
  if (str(o.nl)) out.nl = str(o.nl);
  if (str(o.en)) out.en = str(o.en);
  return out;
};
const locList = (v: unknown) => {
  const o = isObj(v) ? v : {};
  const lines = (x: unknown) => (Array.isArray(x) ? x.map((s) => str(s, 300)).filter(Boolean).slice(0, 50) : []);
  return { nl: lines(o.nl), en: lines(o.en) };
};

/** Turn the form payload into a row, keeping only known fields of the right type. */
function toRow(fields: FieldDef[], data: Payload) {
  const row: Record<string, unknown> = {};
  for (const f of fields) {
    const v = data[f.key];
    switch (f.kind) {
      case "i18n": {
        const value = loc(v);
        if (f.required && !value.nl) return { error: "Vul de Nederlandse tekst in.", field: f.key };
        row[f.key] = value;
        break;
      }
      case "text": {
        const value = str(v, 400);
        if (f.required && !value) return { error: `Vul ${f.label.toLowerCase()} in.`, field: f.key };
        row[f.key] = value || null;
        break;
      }
      case "slug": {
        const source = data[f.from];
        const fallback = isObj(source) ? str(source.nl) : str(source);
        const value = slugify(str(v) || fallback);
        if (!value) return { error: "De URL mag niet leeg zijn.", field: f.key };
        row[f.key] = value;
        break;
      }
      case "number": {
        const n = v === "" || v === null || v === undefined ? null : Number(v);
        if (n !== null && (!Number.isFinite(n) || (f.min !== undefined && n < f.min) || (f.max !== undefined && n > f.max))) {
          return { error: `${f.label}: ongeldig getal.`, field: f.key };
        }
        row[f.key] = n === null ? null : Math.round(n);
        break;
      }
      case "boolean":
        row[f.key] = v === true;
        break;
      case "select": {
        const value = str(v);
        if (!value && f.nullable) row[f.key] = null;
        else if (f.options.some((o) => o.value === value)) row[f.key] = value;
        else return { error: `Kies een waarde voor ${f.label.toLowerCase()}.`, field: f.key };
        break;
      }
      case "i18nList":
        row[f.key] = locList(v);
        break;
      case "variants":
        row[f.key] = (Array.isArray(v) ? v : []).map(loc).filter((x) => x.nl).slice(0, 40);
        break;
      case "steps":
        row[f.key] = (Array.isArray(v) ? v : [])
          .map((s) => (isObj(s) ? { title: loc(s.title), text: loc(s.text) } : null))
          .filter((s): s is { title: Record<string, string>; text: Record<string, string> } => !!s && !!s.title.nl)
          .slice(0, 8);
        break;
      case "media":
      case "relation": {
        const value = str(v, 64);
        if (!value && f.kind === "relation" && !f.nullable) return { error: `Kies ${f.label.toLowerCase()}.`, field: f.key };
        row[f.key] = value || null;
        break;
      }
      // gallery + relationMulti are join tables, synced after the row is saved
    }
  }
  return { row };
}

const ids = (v: unknown) => (Array.isArray(v) ? v.map((x) => str(x, 64)).filter(Boolean) : []);

/**
 * Expire a content tag so the public site rebuilds with the edit on its next request.
 *
 * The readers are wrapped in `unstable_cache`, whose tags are cleared by
 * `revalidateTag`, not by `updateTag` (that one only covers `fetch` / `use cache`
 * tags). `expire: 0` is the immediate, blocking form: the owner saves, opens the
 * site, and sees their change.
 */
function invalidate(tag: string) {
  revalidateTag(tag, { expire: 0 });
}

export async function saveContent(key: string, id: string | null, data: Payload): Promise<SaveResult> {
  if (!isContentKey(key)) return { ok: false, error: "Onbekend type." };
  const type = CONTENT_TYPES[key];
  const { db } = await requireAction("editor");
  const parsed = toRow(type.fields, data);
  if ("error" in parsed) return { ok: false, error: parsed.error!, field: parsed.field };

  // The table is chosen from a fixed list, so the dynamic name is safe; typing it per table adds nothing here.
  const table = db.from(type.table as "pages");
  const res = id
    ? await table.update(parsed.row as never).eq("id", id).select("id").single()
    : await table.insert(parsed.row as never).select("id").single();
  if (res.error) {
    if (res.error.code === "23505") return { ok: false, error: "Deze URL bestaat al. Kies een andere.", field: "slug" };
    return { ok: false, error: res.error.message };
  }
  const rowId = (res.data as { id: string }).id;

  for (const f of type.fields) {
    if (f.kind === "relationMulti") {
      const wanted = ids(data[f.key]);
      const jt = db.from(f.table as "product_brands");
      await jt.delete().eq(f.fk as "product_id", rowId);
      if (wanted.length) await jt.insert(wanted.map((other) => ({ [f.fk]: rowId, [f.other]: other })) as never);
    }
    if (f.kind === "gallery") {
      const wanted = ids(data[f.key]);
      const jt = db.from(f.table as "product_images");
      await jt.delete().eq(f.fk as "product_id", rowId);
      if (wanted.length) await jt.insert(wanted.map((media_id, i) => ({ [f.fk]: rowId, media_id, sort_order: i + 1 })) as never);
    }
  }

  invalidate(type.tag);
  return { ok: true, id: rowId };
}

export async function deleteContent(key: string, id: string): Promise<SaveResult> {
  if (!isContentKey(key)) return { ok: false, error: "Onbekend type." };
  const type = CONTENT_TYPES[key];
  const { db } = await requireAction("editor");
  const { error } = await db.from(type.table as "pages").delete().eq("id", id);
  if (error) {
    if (error.code === "23503") return { ok: false, error: "Kan niet verwijderen: er hangt nog iets aan (bijvoorbeeld producten bij deze dienst). Zet het op concept." };
    return { ok: false, error: error.message };
  }
  invalidate(type.tag);
  return { ok: true, id };
}

export async function reorderContent(key: string, orderedIds: string[]) {
  if (!isContentKey(key)) return { ok: false };
  const type = CONTENT_TYPES[key];
  const { db } = await requireAction("editor");
  await Promise.all(orderedIds.slice(0, 500).map((id, i) => db.from(type.table as "pages").update({ sort_order: (i + 1) * 10 }).eq("id", id)));
  invalidate(type.tag);
  return { ok: true };
}

export async function setContentStatus(key: string, id: string, status: "draft" | "published") {
  if (!isContentKey(key)) return { ok: false };
  const type = CONTENT_TYPES[key];
  const { db } = await requireAction("editor");
  const { error } = await db.from(type.table as "pages").update({ status }).eq("id", id);
  if (!error) invalidate(type.tag);
  return { ok: !error };
}
