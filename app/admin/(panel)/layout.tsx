import { Shell, type NavGroup } from "@/components/admin/Shell";
import { Toaster } from "@/components/admin/Toast";
import { hasRole, requirePage, ROLE_LABEL } from "@/lib/admin/auth";
import { CONTENT_TYPES } from "@/lib/admin/content-types";
import { initials } from "@/lib/admin/leads";
import { createClient } from "@/lib/supabase/server";

/** Every admin page sits behind this: signed in, active profile, at least editor. */
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requirePage("editor");
  const canSeeLeads = hasRole(user, "admin");
  let newLeads = 0;
  if (canSeeLeads) {
    const db = await createClient();
    const { count } = await db.from("quote_requests").select("id", { count: "exact", head: true }).eq("status", "new");
    newLeads = count ?? 0;
  }

  const content = (k: keyof typeof CONTENT_TYPES) => ({ href: `/admin/inhoud/${k}`, label: CONTENT_TYPES[k].label, icon: CONTENT_TYPES[k].icon });
  const groups = ([
    { items: [{ href: "/admin", label: "Dashboard", icon: "grid" }] },
    {
      label: "Klanten",
      items: [...(canSeeLeads ? [{ href: "/admin/aanvragen", label: "Aanvragen", icon: "inbox" as const, badge: "leads" as const }] : []), content("reviews")],
    },
    {
      label: "Website",
      items: [
        { href: "/admin/homepage", label: "Homepage", icon: "home" },
        content("diensten"),
        content("aanbod"),
        content("projecten"),
        content("merken"),
        content("team"),
        content("vragen"),
        content("paginas"),
        { href: "/admin/media", label: "Media", icon: "image" },
      ],
    },
    {
      label: "Beheer",
      items: [
        ...(hasRole(user, "owner") ? [{ href: "/admin/gebruikers", label: "Gebruikers & rollen", icon: "users" as const }] : []),
        ...(hasRole(user, "admin") ? [{ href: "/admin/instellingen", label: "Instellingen", icon: "settings" as const }] : []),
      ],
    },
  ] as NavGroup[]).filter((g) => g.items.length);

  return (
    <Shell groups={groups} user={{ name: user.name, email: user.email, roleLabel: ROLE_LABEL[user.role], initials: initials(user.name || user.email) }} newLeads={newLeads} canSeeLeads={canSeeLeads}>
      {children}
      <Toaster />
    </Shell>
  );
}
