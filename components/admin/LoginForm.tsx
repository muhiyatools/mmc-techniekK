"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Field, Input } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { createClient } from "@/lib/supabase/browser";

/** Sign in with password, or ask for a one-time link. Accounts are created by an owner (invite). */
export function LoginForm({ next, initialError }: { next: string; initialError?: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<"password" | "link">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [sent, setSent] = useState(false);
  const [pending, start] = useTransition();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    start(async () => {
      const supabase = createClient();
      if (mode === "password") {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) return setError("E-mailadres of wachtwoord klopt niet.");
        router.replace(next);
        router.refresh();
        return;
      }
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { shouldCreateUser: false, emailRedirectTo: `${window.location.origin}/admin/auth/callback?next=${encodeURIComponent(next)}` },
      });
      // Same message whether or not the address exists, so the form doesn't reveal accounts.
      if (error && error.status !== 400 && error.status !== 422) return setError("Versturen lukte niet. Probeer het later opnieuw.");
      setSent(true);
    });
  };

  if (sent) {
    return (
      <div role="status" className="flex flex-col gap-2 rounded-xl bg-sky p-5 text-blue-deep">
        <span className="font-semibold">Controleer uw inbox</span>
        <span>Als dit adres toegang heeft, staat er een inloglink in uw mail. De link werkt één keer.</span>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <Field id="email" label="E-mailadres">
        <Input id="email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </Field>
      {mode === "password" && (
        <Field id="password" label="Wachtwoord">
          <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Field>
      )}
      {error && (
        <p role="alert" className="field-error">
          <Icon name="alert" size={16} className="mt-px" />
          {error}
        </p>
      )}
      <button type="submit" className="btn btn-primary w-full" disabled={pending || !email}>
        <span>{pending ? "Bezig…" : mode === "password" ? "Inloggen" : "Stuur inloglink"}</span>
        <span className="knob">
          <Icon name="arrow" />
        </span>
      </button>
      <button type="button" className="link self-center text-[13px] font-medium" onClick={() => setMode(mode === "password" ? "link" : "password")}>
        {mode === "password" ? "Liever een inloglink per mail" : "Inloggen met wachtwoord"}
      </button>
    </form>
  );
}
