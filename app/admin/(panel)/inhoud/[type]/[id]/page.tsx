import { notFound } from "next/navigation";
import { ContentEditor, type MediaLite, type Option } from "@/components/admin/ContentEditor";
import { AdminHeader } from "@/components/admin/Shell";
import { requirePage } from "@/lib/admin/auth";
import { CONTENT_TYPES, isContentKey } from "@/lib/admin/content-types";
import { t } from "@/lib/i18n/config";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Bewerken" };

/** Defaults for a new row: draft, Dutch empty. */
function blank(fields: (typeof CONTENT_TYPES)[string]["fields"]) {
  const row: Record<string, unknown> = { status: "draft" };
  for (const f of fields) {
    if (f.kind === "select" && f.key !== "status" && !f.nullable) row[f.key] = f.options[0]?.value;
    if (f.kind === "number" && f.key === "rating") row[f.key] = 5;
    if (f.kind === "relationMulti" || f.kind === "gallery" || f.kind === "steps" || f.kind === "variants") row[f.key] = [];
  }
  return row;
}

export default async function EditPage({ params }: PageProps<"/admin/inhoud/[type]/[id]">) {
  await requirePage("editor");
  const { type: key, id } = await params;
  if (!isContentKey(key)) notFound();
  const type = CONTENT_TYPES[key];
  const isNew = id === "nieuw";
  if (!isNew && !/^[0-9a-f-]{36}$/.test(id)) notFound();
  const db = await createClient();

  let row: Record<string, unknown> = blank(type.fields);
  if (!isNew) {
    const { data } = await db.from(type.table as "pages").select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    row = data as unknown as Record<string, unknown>;
    for (const f of type.fields) {
      if (f.kind === "relationMulti") {
        const { data: links } = await db.from(f.table as "product_brands").select("*").eq(f.fk as "product_id", id);
        row[f.key] = ((links ?? []) as Record<string, string>[]).map((l) => l[f.other]);
      }
      if (f.kind === "gallery") {
        const { data: links } = await db.from(f.table as "product_images").select("media_id, sort_order").eq(f.fk as "product_id", id).order("sort_order");
        row[f.key] = (links ?? []).map((l) => l.media_id);
      }
    }
  }

  // Options for relation fields
  const options: Record<string, Option[]> = {};
  if (type.fields.some((f) => (f.kind === "relation" || f.kind === "relationMulti") && f.source === "services")) {
    const { data } = await db.from("services").select("id, title").order("sort_order");
    options.services = (data ?? []).map((s) => ({ value: s.id, label: t(s.title, "nl") as string }));
  }
  if (type.fields.some((f) => f.kind === "relationMulti" && f.source === "brands")) {
    const { data } = await db.from("brands").select("id, name").eq("kind", "supplier").order("name");
    options.brands = (data ?? []).map((b) => ({ value: b.id, label: b.name }));
  }

  // Media referenced by this row
  const mediaIds = type.fields.flatMap((f) => (f.kind === "media" && row[f.key] ? [row[f.key] as string] : f.kind === "gallery" ? ((row[f.key] as string[]) ?? []) : []));
  const media: Record<string, MediaLite> = {};
  if (mediaIds.length) {
    const { data } = await db.from("media").select("id, bucket, path, alt, dominant_color").in("id", mediaIds);
    for (const m of data ?? []) media[m.id] = m as unknown as MediaLite;
  }

  const titleValue = row[type.titleKey];
  const title = isNew ? `Nieuw ${type.singular}` : (typeof titleValue === "object" ? (t(titleValue, "nl") as string) : String(titleValue ?? "")) || type.singular;

  return (
    <>
      <AdminHeader crumbs={[{ label: type.label, href: `/admin/inhoud/${key}` }, { label: isNew ? "Nieuw" : title }]} title={title} />
      <ContentEditor
        typeKey={key}
        typeLabel={type.label}
        singular={type.singular}
        id={isNew ? null : id}
        fields={type.fields}
        initial={row}
        options={options}
        media={media}
        publicPath={type.publicPath && !isNew ? type.publicPath(row) : null}
      />
    </>
  );
}
