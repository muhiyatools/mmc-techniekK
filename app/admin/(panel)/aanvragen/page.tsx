import { AdminHeader } from "@/components/admin/Shell";
import { LeadInbox } from "@/components/admin/LeadInbox";
import { requirePage } from "@/lib/admin/auth";
import { LEAD_COLUMNS, type LeadRow } from "@/lib/admin/leads";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Aanvragen" };

export default async function LeadsPage() {
  await requirePage("admin");
  const db = await createClient();
  const [{ data: leads }, { data: staff }] = await Promise.all([
    db.from("quote_requests").select(LEAD_COLUMNS).order("created_at", { ascending: false }).limit(1000),
    db.from("profiles").select("id, full_name, email").eq("active", true).order("full_name"),
  ]);
  return (
    <>
      <AdminHeader crumbs={[{ label: "Klanten" }, { label: "Aanvragen" }]} title="Aanvragen" description="Offerte- en contactaanvragen van de website. Nieuwe aanvragen verschijnen direct." />
      <LeadInbox initial={(leads ?? []) as unknown as LeadRow[]} staff={(staff ?? []).map((s) => ({ id: s.id, name: s.full_name || s.email || "?" }))} />
    </>
  );
}
