"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateOwnName } from "@/lib/admin/actions";
import { createClient } from "@/lib/supabase/browser";
import { SignOutButton } from "./SignOutButton";
import { toast } from "./Toast";

const input = "input h-10 text-[14px] max-w-[360px]";
const primary = "h-10 self-start rounded-lg bg-blue px-4 font-semibold text-white hover:bg-blue-deep disabled:bg-line disabled:text-graphite";

export function AccountForm({ name: initial, welcome }: { name: string; welcome: boolean }) {
  const router = useRouter();
  const [name, setName] = useState(initial);
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const saveName = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      const res = await updateOwnName(name);
      if (!res.ok) return toast(res.error, "error");
      toast("Naam opgeslagen");
      router.refresh();
    });
  };

  const savePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 10) return setError("Kies een wachtwoord van minstens 10 tekens.");
    if (password !== repeat) return setError("De twee wachtwoorden zijn niet gelijk.");
    start(async () => {
      const { error } = await createClient().auth.updateUser({ password });
      if (error) return setError(error.message.includes("same") ? "Kies een ander wachtwoord dan het huidige." : "Wachtwoord wijzigen lukte niet. Probeer het opnieuw of vraag een nieuwe link aan.");
      setPassword("");
      setRepeat("");
      toast("Wachtwoord gewijzigd");
      if (welcome) router.replace("/admin");
    });
  };

  return (
    <div className="flex max-w-[1000px] flex-col gap-5 p-4 sm:p-6">
      {welcome && (
        <div role="status" className="rounded-xl bg-sky p-5 text-blue-deep">
          <strong className="block text-[16px]">Kies een wachtwoord</strong>
          Welkom. Stel hieronder een wachtwoord in, dan kunt u de volgende keer gewoon inloggen.
        </div>
      )}

      <form onSubmit={saveName} className="flex flex-col gap-3 rounded-xl border border-line p-5">
        <h2 className="text-[17px] font-bold">Naam</h2>
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold">Uw naam</span>
          <input className={input} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </label>
        <button type="submit" disabled={pending || name.trim() === initial} className={primary}>
          Opslaan
        </button>
      </form>

      <form onSubmit={savePassword} className="flex flex-col gap-3 rounded-xl border border-line p-5">
        <h2 className="text-[17px] font-bold">{welcome ? "Wachtwoord kiezen" : "Wachtwoord wijzigen"}</h2>
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold">Nieuw wachtwoord</span>
          <input className={input} type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} aria-describedby="pw-hint" />
          <span id="pw-hint" className="text-[12px] text-graphite">
            Minstens 10 tekens.
          </span>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold">Herhaal wachtwoord</span>
          <input className={input} type="password" autoComplete="new-password" value={repeat} onChange={(e) => setRepeat(e.target.value)} />
        </label>
        {error && (
          <p role="alert" className="text-error">
            {error}
          </p>
        )}
        <button type="submit" disabled={pending || !password} className={primary}>
          {welcome ? "Wachtwoord instellen" : "Wachtwoord wijzigen"}
        </button>
      </form>

      <div className="flex rounded-xl border border-line p-5">
        <SignOutButton className="h-10 rounded-lg px-4 font-semibold text-ink shadow-[inset_0_0_0_1.5px_var(--color-line-strong)] hover:shadow-[inset_0_0_0_1.5px_var(--color-ink)]">Uitloggen</SignOutButton>
      </div>
    </div>
  );
}
