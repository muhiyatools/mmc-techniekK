"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { createClient } from "@/lib/supabase/browser";
import { SignOutButton } from "./SignOutButton";

export type NavGroup = { label?: string; items: { href: string; label: string; icon: IconName; badge?: "leads" }[] };

/** Admin chrome: ink sidebar (desktop), top bar + drawer (phone). */
export function Shell({ groups, user, newLeads, canSeeLeads, children }: { groups: NavGroup[]; user: { name: string; email: string; roleLabel: string; initials: string }; newLeads: number; canSeeLeads: boolean; children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [badge, setBadge] = useState(newLeads);
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Live count of new requests.
  useEffect(() => {
    if (!canSeeLeads) return;
    const supabase = createClient();
    const refresh = async () => {
      const { count } = await supabase.from("quote_requests").select("id", { count: "exact", head: true }).eq("status", "new");
      setBadge(count ?? 0);
    };
    const channel = supabase
      .channel("lead-badge")
      .on("postgres_changes", { event: "*", schema: "public", table: "quote_requests" }, refresh)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [canSeeLeads]);

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  const nav = (
    <nav aria-label="Beheer" className="flex flex-col gap-0.5 overflow-y-auto">
      {groups.map((g, i) => (
        <div key={i} className="flex flex-col gap-0.5">
          {g.label && <span className="t-mono px-2.5 pb-1.5 pt-4 text-[10px] text-admin-muted">{g.label}</span>}
          {g.items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              aria-current={isActive(it.href) ? "page" : undefined}
              className="flex min-h-10 items-center gap-2.5 rounded-lg px-2.5 text-[14px] font-medium text-admin-text transition-colors hover:bg-white/5 hover:text-white aria-[current=page]:bg-white/10 aria-[current=page]:text-white"
            >
              <Icon name={it.icon} size={17} />
              <span className="flex-1">{it.label}</span>
              {it.badge === "leads" && badge > 0 && <span className="rounded-full bg-signal px-1.5 py-px text-[11px] font-bold text-ink">{badge}</span>}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );

  const account = (
    <div className="mt-auto flex items-center gap-2.5 border-t border-admin-line px-2 pb-1 pt-3">
      <Link href="/admin/account" className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg p-1 hover:bg-white/5">
        <span className="grid size-8 flex-none place-items-center rounded-full bg-signal text-[12px] font-bold text-ink">{user.initials}</span>
        <span className="flex min-w-0 flex-col">
          <span className="truncate font-semibold text-white">{user.name || user.email}</span>
          <span className="text-[12px] text-admin-muted">{user.roleLabel}</span>
        </span>
      </Link>
      <SignOutButton className="grid size-9 place-items-center rounded-lg text-admin-muted hover:bg-white/5 hover:text-white">
        <Icon name="logout" size={17} />
        <span className="sr-only">Uitloggen</span>
      </SignOutButton>
    </div>
  );

  const brand = (
    <Link href="/admin" className="flex items-center gap-2.5 px-2 pb-3 pt-1">
      <Image src="/brand/mark.svg" alt="" width={30} height={30} />
      <span className="flex flex-col">
        <span className="text-[15px] font-bold text-white [font-stretch:118%]">MMC Beheer</span>
        <span className="t-mono text-[10px] text-admin-muted">mmctechniek.nl</span>
      </span>
    </Link>
  );

  return (
    <div className="flex min-h-dvh">
      <aside className="sticky top-0 hidden h-dvh w-[248px] flex-none flex-col bg-ink px-3 py-4 lg:flex">
        {brand}
        {nav}
        {account}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Phone top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between bg-ink px-4 lg:hidden">
          <Link href="/admin" className="flex items-center gap-2">
            <Image src="/brand/mark.svg" alt="" width={26} height={26} />
            <span className="font-bold text-white [font-stretch:118%]">MMC Beheer</span>
          </Link>
          <button type="button" onClick={() => setOpen(true)} aria-label="Menu openen" aria-expanded={open} className="relative grid size-10 place-items-center rounded-lg text-white hover:bg-white/10">
            <Icon name="menu" size={20} />
            {badge > 0 && <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-signal" />}
          </button>
        </header>
        {open && (
          <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Beheer">
            <button type="button" aria-label="Menu sluiten" className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} />
            <div className="menu-sheet absolute inset-y-0 left-0 flex w-[280px] flex-col bg-ink px-3 py-4">
              {brand}
              {nav}
              {account}
            </div>
          </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}

/** Page header inside the admin: breadcrumb trail, title, actions. */
export function AdminHeader({ crumbs, title, description, actions }: { crumbs?: { label: string; href?: string }[]; title: string; description?: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 border-b border-line px-4 pb-5 pt-5 sm:px-6">
      {crumbs && (
        <nav aria-label="Kruimelpad" className="flex flex-wrap items-center gap-1.5 text-[13px] text-graphite">
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden="true">/</span>}
              {c.href ? (
                <Link href={c.href} className="hover:text-ink">
                  {c.label}
                </Link>
              ) : (
                <span className="font-semibold text-ink">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-[24px] font-[750] tracking-[-0.02em] [font-stretch:118%]">{title}</h1>
          {description && <p className="text-graphite">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}
