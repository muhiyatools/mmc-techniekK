"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { inviteUser, setUserAccess } from "@/lib/admin/actions";
import type { Role } from "@/lib/admin/auth";
import { toast } from "./Toast";

export type UserRow = { id: string; email: string; name: string; role: Role; active: boolean; lastSignIn: string | null };

const ROLES: { value: Role; label: string; hint: string }[] = [
  { value: "owner", label: "Eigenaar", hint: "Alles, inclusief gebruikers." },
  { value: "admin", label: "Beheerder", hint: "Alles behalve gebruikers en rollen." },
  { value: "editor", label: "Redacteur", hint: "Alleen inhoud, geen aanvragen." },
];

const input = "input h-10 text-[14px]";
const date = (v: string | null) => (v ? new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(v)) : "Nog niet ingelogd");

export function UsersManager({ users, meId }: { users: UserRow[]; meId: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("editor");
  const [error, setError] = useState<string | null>(null);

  const invite = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    start(async () => {
      const res = await inviteUser(email, name, role);
      if (!res.ok) return setError(res.error);
      toast("Uitnodiging verstuurd");
      setEmail("");
      setName("");
      router.refresh();
    });
  };

  const change = (id: string, patch: { role?: Role; active?: boolean }) =>
    start(async () => {
      const res = await setUserAccess(id, patch);
      if (!res.ok) return toast(res.error, "error");
      toast("Opgeslagen");
      router.refresh();
    });

  return (
    <div className="flex max-w-[1000px] flex-col gap-8 p-4 sm:p-6">
      <section aria-labelledby="invite-title" className="flex flex-col gap-4 rounded-xl border border-line p-5">
        <h2 id="invite-title" className="text-[17px] font-bold">
          Gebruiker uitnodigen
        </h2>
        <form onSubmit={invite} className="grid gap-3 md:grid-cols-[1fr_1fr_200px_auto] md:items-end">
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold">Naam</span>
            <input className={input} value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold">E-mailadres</span>
            <input className={input} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="off" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold">Rol</span>
            <select className={input} value={role} onChange={(e) => setRole(e.target.value as Role)}>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" disabled={pending || !email} className="h-10 rounded-lg bg-blue px-4 font-semibold text-white hover:bg-blue-deep disabled:bg-line disabled:text-graphite">
            Uitnodigen
          </button>
        </form>
        {error && (
          <p role="alert" className="text-error">
            {error}
          </p>
        )}
        <p className="text-[13px] text-graphite">De gebruiker krijgt een mail met een link om een wachtwoord te kiezen.</p>
      </section>

      <section aria-labelledby="users-title" className="flex flex-col gap-3">
        <h2 id="users-title" className="text-[17px] font-bold">
          Gebruikers ({users.length})
        </h2>
        <ul className="flex flex-col divide-y divide-line rounded-xl border border-line">
          {users.map((u) => {
            const me = u.id === meId;
            return (
              <li key={u.id} className="grid gap-3 p-4 md:grid-cols-[minmax(0,1fr)_180px_auto] md:items-center">
                <div className="flex min-w-0 flex-col">
                  <span className="truncate font-semibold">
                    {u.name || u.email}
                    {me && <span className="t-mono ml-2 text-graphite">u</span>}
                  </span>
                  <span className="truncate text-graphite">{u.email}</span>
                  <span className="text-[12px] text-graphite">Laatst ingelogd: {date(u.lastSignIn)}</span>
                </div>
                <label className="flex flex-col gap-1">
                  <span className="sr-only">Rol van {u.name || u.email}</span>
                  <select className={input} value={u.role} disabled={pending || me} onChange={(e) => change(u.id, { role: e.target.value as Role })}>
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex cursor-pointer items-center gap-2.5">
                  <input type="checkbox" className="size-5 accent-[var(--color-blue)]" checked={u.active} disabled={pending || me} onChange={(e) => change(u.id, { active: e.target.checked })} />
                  <span className="text-[14px] font-medium">{u.active ? "Actief" : "Geblokkeerd"}</span>
                </label>
              </li>
            );
          })}
        </ul>
        <ul className="flex flex-col gap-1 text-[13px] text-graphite">
          {ROLES.map((r) => (
            <li key={r.value}>
              <strong className="text-ink">{r.label}:</strong> {r.hint}
            </li>
          ))}
          <li>U kunt uw eigen rol of toegang niet wijzigen. Er blijft altijd minstens één actieve eigenaar.</li>
        </ul>
      </section>
    </div>
  );
}
