import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import type { Enums } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";

export type Role = Enums<"app_role">;
const RANK: Record<Role, number> = { editor: 1, admin: 2, owner: 3 };

export type AdminUser = { id: string; email: string; name: string; role: Role; active: boolean };

/** The signed-in admin user, verified on the server (JWT claims checked against Supabase). */
export const getAdminUser = cache(async (): Promise<AdminUser | null> => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const uid = data?.claims?.sub;
  if (!uid) return null;
  const { data: profile } = await supabase.from("profiles").select("id, email, full_name, role, active").eq("id", uid).maybeSingle();
  if (!profile) return { id: uid, email: String(data.claims.email ?? ""), name: "", role: "editor", active: false };
  return { id: profile.id, email: profile.email ?? String(data.claims.email ?? ""), name: profile.full_name, role: profile.role, active: profile.active };
});

export function hasRole(user: AdminUser | null, min: Role) {
  return !!user && user.active && RANK[user.role] >= RANK[min];
}

/** For pages: redirect to login, or show the no-access page, unless the user has `min`. */
export async function requirePage(min: Role) {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  if (!hasRole(user, min)) redirect("/admin/geen-toegang");
  return user;
}

/** For server actions: throw unless the user has `min`. RLS enforces the same rules again in the database. */
export async function requireAction(min: Role) {
  const user = await getAdminUser();
  if (!hasRole(user, min)) throw new Error("Geen toegang");
  return { user: user!, db: await createClient() };
}

export const ROLE_LABEL: Record<Role, string> = { owner: "Eigenaar", admin: "Beheerder", editor: "Redacteur" };
