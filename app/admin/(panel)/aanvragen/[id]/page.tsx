import { notFound } from "next/navigation";
import { LeadDetailPage } from "@/components/admin/LeadDetailPage";
import { AdminHeader } from "@/components/admin/Shell";
import { requirePage } from "@/lib/admin/auth";
import { LEAD_COLUMNS, type LeadRow } from "@/lib/admin/leads";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Aanvraag" };

export default async function LeadPage({ params }: PageProps<"/admin/aanvragen/[id]">) {
  await requirePage("admin");
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const db = await createClient();
  const [{ data: lead }, { data: staff }] = await Promise.all([
    db.from("quote_requests").select(LEAD_COLUMNS).eq("id", id).maybeSingle(),
    db.from("profiles").select("id, full_name, email").eq("active", true).order("full_name"),
  ]);
  if (!lead) notFound();
  const row = lead as unknown as LeadRow;
  return (
    <>
      <AdminHeader crumbs={[{ label: "Aanvragen", href: "/admin/aanvragen" }, { label: row.ref }]} title={row.name} />
      <div className="mx-auto w-full max-w-[640px]">
        <LeadDetailPage lead={row} staff={(staff ?? []).map((s) => ({ id: s.id, name: s.full_name || s.email || "?" }))} />
      </div>
    </>
  );
}
