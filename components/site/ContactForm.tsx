"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { Field, Input, Textarea, describedBy } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { href, type Locale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/ui";
import { submitLead } from "@/lib/leads/actions";
import type { FieldErrors } from "@/lib/leads/schema";

export function ContactForm({ lang }: { lang: Locale }) {
  const d = getDict(lang);
  const [values, setValues] = useState({ name: "", email: "", phone: "", message: "", website: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, start] = useTransition();
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValues((v) => ({ ...v, [k]: e.target.value }));
  const err = (code?: string) => (code ? (d.form.errors as Record<string, string>)[code] ?? d.form.errors.required : undefined);

  if (sent) {
    return (
      <div role="status" className="flex flex-col items-start gap-3 rounded-[var(--radius-tile)] bg-sky p-8">
        <span className="grid size-12 place-items-center rounded-full bg-blue text-white">
          <Icon name="check" size={22} strokeWidth={2.5} />
        </span>
        <h2 className="t-h3 text-[24px]">{d.form.sent}</h2>
        <p className="text-slate">{d.form.sentText}</p>
      </div>
    );
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const local: FieldErrors = {};
    if (!values.name.trim()) local.name = "required";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email.trim())) local.email = values.email.trim() ? "email" : "required";
    if (!values.message.trim()) local.message = "required";
    setErrors(local);
    if (Object.keys(local).length) {
      document.getElementById(`cf-${Object.keys(local)[0]}`)?.focus();
      return;
    }
    start(async () => {
      const res = await submitLead({ kind: "contact", ...values, locale: lang, source_page: window.location.pathname, startedAt: startedAt.current });
      if (res.ok) return setSent(true);
      if (res.error === "invalid" && res.fields) return setErrors(res.fields);
      setFormError(res.error === "rate" ? d.form.errors.rate : d.form.errors.generic);
    });
  };

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-5">
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={values.website} onChange={set("website")} />
        </label>
      </div>
      <Field id="cf-name" label={d.form.name} error={err(errors.name)}>
        <Input id="cf-name" autoComplete="name" value={values.name} onChange={set("name")} invalid={!!errors.name} aria-describedby={describedBy("cf-name", errors.name)} required />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="cf-email" label={d.form.email} error={err(errors.email)}>
          <Input id="cf-email" type="email" autoComplete="email" value={values.email} onChange={set("email")} invalid={!!errors.email} aria-describedby={describedBy("cf-email", errors.email)} required />
        </Field>
        <Field id="cf-phone" label={d.form.phone} optional={d.form.optional} error={err(errors.phone)}>
          <Input id="cf-phone" type="tel" autoComplete="tel" value={values.phone} onChange={set("phone")} invalid={!!errors.phone} aria-describedby={describedBy("cf-phone", errors.phone)} />
        </Field>
      </div>
      <Field id="cf-message" label={d.form.message} error={err(errors.message)}>
        <Textarea id="cf-message" rows={5} value={values.message} onChange={set("message")} invalid={!!errors.message} aria-describedby={describedBy("cf-message", errors.message)} required />
      </Field>
      <p className="text-[13px] leading-relaxed text-graphite">
        {d.form.privacy}{" "}
        <Link href={href(lang, "/privacy")} className="link font-normal">
          {d.form.privacyLink}
        </Link>
      </p>
      {formError && (
        <p role="alert" className="field-error">
          <Icon name="alert" size={16} className="mt-px" />
          {formError}
        </p>
      )}
      <button type="submit" className="btn btn-primary self-start" disabled={pending}>
        <span>{pending ? d.form.sending : d.form.send}</span>
        <span className="knob">
          <Icon name="arrow" />
        </span>
      </button>
    </form>
  );
}
