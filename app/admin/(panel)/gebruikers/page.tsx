import { UsersManager, type UserRow } from "@/components/admin/UsersManager";
import { AdminHeader } from "@/components/admin/Shell";
import { requirePage } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Gebruikers" };

export default async function UsersAdmin() {
  const me = await requirePage("owner");
  const db = await createClient();
  const { data: profiles } = await db.from("profiles").select("id, email, full_name, role, active, created_at").order("created_at");

  // Last sign-in lives in the auth schema; only the service role can read it.
  const lastSeen = new Map<string, string | null>();
  try {
    const { data } = await createAdminClient().auth.admin.listUsers({ perPage: 200 });
    for (const u of data?.users ?? []) lastSeen.set(u.id, u.last_sign_in_at ?? null);
  } catch {
    // Not critical: the column stays empty.
  }

  const rows: UserRow[] = (profiles ?? []).map((p) => ({
    id: p.id,
    email: p.email ?? "",
    name: p.full_name ?? "",
    role: p.role,
    active: p.active,
    lastSignIn: lastSeen.get(p.id) ?? null,
  }));

  return (
    <>
      <AdminHeader crumbs={[{ label: "Beheer" }, { label: "Gebruikers & rollen" }]} title="Gebruikers & rollen" description="Nodig collega's uit en bepaal wat ze mogen. Alleen eigenaren zien deze pagina." />
      <UsersManager users={rows} meId={me.id} />
    </>
  );
}
