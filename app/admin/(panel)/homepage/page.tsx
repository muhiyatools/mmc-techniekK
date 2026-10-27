import type { MediaLite } from "@/components/admin/ContentEditor";
import { SectionsEditor, type SectionDef } from "@/components/admin/SectionsEditor";
import { AdminHeader } from "@/components/admin/Shell";
import { requirePage } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Homepage" };

const SECTIONS: SectionDef[] = [
  {
    key: "hero",
    title: "Bovenaan",
    description: "Kop (een regelovergang maakt een tweede regel), intro en drie foto's.",
    fields: [
      { key: "title", kind: "i18n", label: "Kop", required: true, multiline: true },
      { key: "lead", kind: "i18n", label: "Intro", multiline: true },
      { key: "media", kind: "gallery", label: "Foto's (drie)", table: "project_images", fk: "project_id" },
    ],
  },
  { key: "services", title: "Diensten", fields: [{ key: "title", kind: "i18n", label: "Kop" }, { key: "lead", kind: "i18n", label: "Intro", multiline: true }] },
  {
    key: "audience",
    title: "Voor woningen en bedrijven",
    fields: [
      { key: "title", kind: "i18n", label: "Kop" },
      { key: "home_title", kind: "i18n", label: "Kop woning" },
      { key: "home_points", kind: "i18nList", label: "Punten woning", hint: "Eén per regel." },
      { key: "home_media", kind: "media", label: "Foto woning" },
      { key: "business_title", kind: "i18n", label: "Kop bedrijf" },
      { key: "business_points", kind: "i18nList", label: "Punten bedrijf", hint: "Eén per regel." },
      { key: "business_media", kind: "media", label: "Foto bedrijf" },
    ],
  },
  { key: "process", title: "Werkwijze", fields: [{ key: "title", kind: "i18n", label: "Kop" }, { key: "steps", kind: "steps", label: "Stappen" }] },
  { key: "quote", title: "Offerteblok", fields: [{ key: "title", kind: "i18n", label: "Kop" }, { key: "lead", kind: "i18n", label: "Intro", multiline: true }] },
];

export default async function HomepageAdmin() {
  await requirePage("editor");
  const db = await createClient();
  const { data } = await db.from("home_sections").select("key, content");
  const initial = Object.fromEntries((data ?? []).map((r) => [r.key, r.content as Record<string, unknown>]));
  const ids = [...((initial.hero?.media as string[]) ?? []), initial.audience?.home_media, initial.audience?.business_media].filter(Boolean) as string[];
  const media: Record<string, MediaLite> = {};
  if (ids.length) {
    const { data: rows } = await db.from("media").select("id, bucket, path, alt, dominant_color").in("id", ids);
    for (const m of rows ?? []) media[m.id] = m as unknown as MediaLite;
  }
  return (
    <>
      <AdminHeader crumbs={[{ label: "Website" }, { label: "Homepage" }]} title="Homepage" description="Teksten en foto's van de homepage. Diensten, projecten en reviews beheert u in hun eigen onderdeel." />
      <SectionsEditor target="home" sections={SECTIONS} initial={initial} media={media} />
    </>
  );
}
