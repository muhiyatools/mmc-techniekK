import { AccountForm } from "@/components/admin/AccountForm";
import { AdminHeader } from "@/components/admin/Shell";
import { requirePage, ROLE_LABEL } from "@/lib/admin/auth";

export const metadata = { title: "Mijn account" };

export default async function AccountAdmin({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const user = await requirePage("editor");
  const sp = await searchParams;
  return (
    <>
      <AdminHeader crumbs={[{ label: "Beheer" }, { label: "Mijn account" }]} title="Mijn account" description={`${user.email} · ${ROLE_LABEL[user.role]}`} />
      <AccountForm name={user.name} welcome={sp.welkom === "1"} />
    </>
  );
}
