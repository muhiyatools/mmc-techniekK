import { SectionsEditor, type SectionDef } from "@/components/admin/SectionsEditor";
import { AdminHeader } from "@/components/admin/Shell";
import { requirePage } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Instellingen" };

const SECTIONS: SectionDef[] = [
  {
    key: "company",
    title: "Bedrijf",
    fields: [
      { key: "name", kind: "text", label: "Bedrijfsnaam", required: true },
      { key: "founded", kind: "number", label: "Opgericht in (jaar)", min: 1900 },
      { key: "kvk", kind: "text", label: "KvK-nummer" },
      { key: "btw", kind: "text", label: "BTW-nummer" },
    ],
  },
  {
    key: "contact",
    title: "Contactgegevens",
    description: "Staan in de kop, de voet, op de contactpagina en in de knoppen voor bellen en mailen.",
    fields: [
      { key: "street", kind: "text", label: "Straat en nummer" },
      { key: "postcode", kind: "text", label: "Postcode" },
      { key: "city", kind: "text", label: "Plaats" },
      { key: "phone", kind: "text", label: "Telefoon (internationaal)", hint: "Bijvoorbeeld +31634311225. Hiermee werkt de belknop.", placeholder: "+31634311225" },
      { key: "phone_display", kind: "text", label: "Telefoon (zoals getoond)", placeholder: "06 3431 1225" },
      { key: "whatsapp", kind: "text", label: "WhatsApp-nummer", hint: "Zonder plus of spaties, bijvoorbeeld 31634311225." },
      { key: "email", kind: "text", label: "E-mailadres", required: true },
      { key: "maps_url", kind: "text", label: "Link naar de kaart", hint: "Een https-link naar Google Maps." },
    ],
  },
  { key: "hours", title: "Openingstijden", self: true, fields: [{ key: "hours", kind: "i18n", label: "Openingstijden", required: true }] },
  { key: "area", title: "Werkgebied", self: true, fields: [{ key: "area", kind: "i18n", label: "Plaatsen waar u werkt", required: true }] },
  {
    key: "certifications",
    title: "Certificeringen",
    description: "Verschijnen op de homepage, Zakelijk, Over ons en in de voet. NEN 1010, NEN 3140 en VCA tonen hun logo; andere namen verschijnen als tekst.",
    self: true,
    fields: [{ key: "certifications", kind: "list", label: "Certificeringen", hint: "Eén per regel." }],
  },
  {
    key: "social",
    title: "Sociale media en reviews",
    fields: [
      { key: "google_reviews_url", kind: "text", label: "Link naar Google-reviews", hint: "Leeg laten verbergt de link." },
      { key: "instagram_url", kind: "text", label: "Instagram-profiel", hint: "Bijvoorbeeld https://www.instagram.com/mmctechniek/" },
    ],
  },
  {
    key: "whatsapp_messages",
    title: "WhatsApp-bericht",
    description: "De tekst die al in het bericht staat als iemand op WhatsApp klikt.",
    self: true,
    fields: [{ key: "whatsapp_messages", kind: "i18n", label: "Beginzin", required: true }],
  },
];

export default async function SettingsAdmin() {
  await requirePage("admin");
  const db = await createClient();
  const { data } = await db.from("site_settings").select("key, value");
  const initial = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
  return (
    <>
      <AdminHeader crumbs={[{ label: "Beheer" }, { label: "Instellingen" }]} title="Instellingen" description="Bedrijfs- en contactgegevens die op de hele website staan. Elke kaart bewaart u apart." />
      <SectionsEditor target="settings" sections={SECTIONS} initial={initial} media={{}} />
    </>
  );
}
