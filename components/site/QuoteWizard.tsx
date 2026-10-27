"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { Field, Input, Textarea, describedBy } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { href, type Locale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/ui";
import { submitLead } from "@/lib/leads/actions";
import { PROPERTIES, TIMINGS, TOPICS, type Property, type Timing, type Topic } from "@/lib/leads/options";
import type { FieldErrors } from "@/lib/leads/schema";
import { whatsappHref, type NavModel } from "./nav";

export type WizardPrefill = {
  topics: Topic[];
  product?: { slug: string; name: string } | null;
  variant?: string | null;
  postcode?: string;
  houseNumber?: string;
  property?: Property | null;
};

const STEPS = 3;
const POSTCODE = /^[1-9][0-9]{3}\s?[a-zA-Z]{2}$/;

export function QuoteWizard({ lang, nav, prefill }: { lang: Locale; nav: Pick<NavModel, "phone" | "phoneDisplay" | "whatsapp">; prefill: WizardPrefill }) {
  const d = getDict(lang);
  const w = d.wizard;
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState<"forward" | "back">("forward");
  const [topics, setTopics] = useState<Topic[]>(prefill.topics);
  const [property, setProperty] = useState<Property | null>(prefill.property ?? null);
  const [timing, setTiming] = useState<Timing | null>(null);
  const [postcode, setPostcode] = useState(prefill.postcode ?? "");
  const [house, setHouse] = useState(prefill.houseNumber ?? "");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);

  // Move focus to the new step's heading (not on first render).
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step, done]);

  const err = (code?: string) => (code ? (d.form.errors as Record<string, string>)[code] ?? d.form.errors.required : undefined);

  const validate = (s: number): FieldErrors => {
    const e: FieldErrors = {};
    if (s === 1 && !topics.length) e.services = "services";
    if (s === 2 && postcode.trim() && !POSTCODE.test(postcode.trim())) e.postcode = "postcode";
    if (s === 3) {
      if (!name.trim()) e.name = "required";
      if (phone.replace(/[^\d]/g, "").length < 9) e.phone = phone.trim() ? "phone" : "required";
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) e.email = email.trim() ? "email" : "required";
    }
    return e;
  };

  const focusFirstError = (e: FieldErrors) => {
    const key = Object.keys(e)[0];
    if (!key) return;
    requestAnimationFrame(() => document.getElementById(key === "services" ? "wz-topics" : `wz-${key}`)?.focus());
  };

  const go = (to: number) => {
    setDir(to > step ? "forward" : "back");
    setErrors({});
    setFormError(null);
    setStep(to);
  };

  const next = () => {
    const e = validate(step);
    setErrors(e);
    if (Object.keys(e).length) return focusFirstError(e);
    if (step < STEPS) return go(step + 1);
    submit();
  };

  const submit = () => {
    startTransition(async () => {
      const res = await submitLead({
        kind: "offerte",
        services: topics,
        property_type: property,
        timing,
        postcode,
        house_number: house,
        product_slug: prefill.product?.slug,
        variant: prefill.variant ?? undefined,
        name,
        phone,
        email,
        message,
        locale: lang,
        source_page: typeof window !== "undefined" ? window.location.pathname + window.location.search : undefined,
        utm: utmFromUrl(),
        website,
        startedAt: startedAt.current,
      });
      if (res.ok) {
        setDone(res.ref);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (res.error === "invalid" && res.fields) {
        setErrors(res.fields);
        const s1 = res.fields.services ? 1 : res.fields.postcode ? 2 : 3;
        if (s1 !== step) go(s1);
        setErrors(res.fields);
        focusFirstError(res.fields);
        return;
      }
      setFormError(res.error === "rate" ? d.form.errors.rate : d.form.errors.generic);
    });
  };

  const toggle = (t: Topic) => setTopics((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
  const fraction = done ? 1 : step / STEPS;

  if (done) {
    const summary = [topics.map((t) => w.topics[t]).join(", "), property && w.properties[property]].filter(Boolean).join(" · ");
    return (
      <div className="flex flex-col items-center gap-5 py-6 text-center sm:py-10" role="status">
        <SuccessLoop />
        <h1 ref={headingRef} tabIndex={-1} className="t-h2 text-[clamp(30px,4vw,48px)] outline-none">
          {w.doneTitle}
        </h1>
        <p className="max-w-[420px] text-[17px] leading-relaxed text-slate">{w.doneText}</p>
        <div className="mt-2 flex w-full max-w-[460px] flex-col gap-2 rounded-[18px] bg-paper p-5 text-left">
          <span className="t-mono text-graphite">{w.yourRequest}</span>
          <span className="font-semibold">{summary}</span>
          <span className="t-mono text-graphite">
            {w.reference} {done}
          </span>
        </div>
        <a href={whatsappHref(nav, `${done}: `)} target="_blank" rel="noopener noreferrer" className="link-arrow">
          <Icon name="whatsapp" />
          {w.photos}
        </a>
        <Link href={href(lang, "/")} className="btn btn-secondary btn-plain mt-2">
          {d.cta.backToHome}
        </Link>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        next();
      }}
      className="flex flex-col"
      aria-describedby={formError ? "wz-form-error" : undefined}
    >
      {/* Progress */}
      <div className="flex items-center gap-4 border-b border-line pb-5">
        <button type="button" onClick={() => go(step - 1)} disabled={step === 1} aria-label={w.back} className="icon-btn disabled:opacity-40 disabled:hover:shadow-[inset_0_0_0_1.5px_var(--color-line-strong)]">
          <Icon name="arrowLeft" />
        </button>
        <ProgressRing fraction={fraction} />
        <div className="flex flex-col">
          <span className="t-mono text-blue" aria-live="polite">
            {w.step(step, STEPS)}
          </span>
          <span className="text-[15px] font-semibold">{w.title}</span>
        </div>
      </div>

      {/* Honeypot: hidden from people and assistive tech */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} name="website" />
        </label>
      </div>

      <div key={step} className={`flex flex-col gap-6 pt-7 ${dir === "forward" ? "step-enter-forward" : "step-enter-back"}`}>
        {step === 1 && (
          <>
            <div className="flex flex-col gap-2">
              <h1 ref={headingRef} tabIndex={-1} className="t-h2 text-[clamp(28px,3.4vw,40px)] outline-none">
                {w.s1Title}
              </h1>
              <p className="text-slate">{w.s1Lead}</p>
            </div>
            {prefill.product && (
              <p className="flex flex-wrap items-center gap-2 rounded-[var(--radius-sm)] bg-sky px-4 py-3 text-[15px] text-blue-deep">
                <span className="t-mono">{w.product}</span>
                <span className="font-semibold">{prefill.product.name}</span>
                {prefill.variant && <span>· {prefill.variant}</span>}
              </p>
            )}
            <fieldset id="wz-topics" tabIndex={-1} aria-describedby={errors.services ? "wz-topics-error" : undefined} className="outline-none">
              <legend className="sr-only">{w.s1Title}</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {TOPICS.map((t) => (
                  <button key={t} type="button" className="option" aria-pressed={topics.includes(t)} onClick={() => toggle(t)}>
                    <span className="box">
                      <Icon name="check" size={14} strokeWidth={3} />
                    </span>
                    {w.topics[t]}
                  </button>
                ))}
              </div>
              {errors.services && (
                <p id="wz-topics-error" className="field-error mt-3">
                  <Icon name="alert" size={16} className="mt-px" />
                  {err(errors.services)}
                </p>
              )}
            </fieldset>
          </>
        )}

        {step === 2 && (
          <>
            <h1 ref={headingRef} tabIndex={-1} className="t-h2 text-[clamp(28px,3.4vw,40px)] outline-none">
              {w.s2Title}
            </h1>
            <fieldset className="flex flex-col gap-3">
              <legend className="field-label mb-3">{w.property}</legend>
              <div className="flex flex-wrap gap-2">
                {PROPERTIES.map((p) => (
                  <button key={p} type="button" className="chip" aria-pressed={property === p} onClick={() => setProperty(property === p ? null : p)}>
                    {w.properties[p]}
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-3">
              <Field id="wz-postcode" label={d.form.postcode} error={err(errors.postcode)}>
                <Input
                  id="wz-postcode"
                  autoComplete="postal-code"
                  placeholder="3421 VG"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  invalid={!!errors.postcode}
                  aria-describedby={describedBy("wz-postcode", errors.postcode)}
                />
              </Field>
              <Field id="wz-house_number" label={d.form.houseNumber}>
                <Input id="wz-house_number" placeholder="11" value={house} onChange={(e) => setHouse(e.target.value)} />
              </Field>
            </div>
            <fieldset className="flex flex-col gap-3">
              <legend className="field-label mb-3">{w.when}</legend>
              <div className="flex flex-wrap gap-2">
                {TIMINGS.map((t) => (
                  <button key={t} type="button" className="chip" aria-pressed={timing === t} onClick={() => setTiming(timing === t ? null : t)}>
                    {w.timings[t]}
                  </button>
                ))}
              </div>
            </fieldset>
          </>
        )}

        {step === 3 && (
          <>
            <h1 ref={headingRef} tabIndex={-1} className="t-h2 text-[clamp(28px,3.4vw,40px)] outline-none">
              {w.s3Title}
            </h1>
            <Field id="wz-name" label={d.form.name} error={err(errors.name)}>
              <Input id="wz-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} invalid={!!errors.name} aria-describedby={describedBy("wz-name", errors.name)} required />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="wz-phone" label={d.form.phone} error={err(errors.phone)}>
                <Input id="wz-phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="06 …" value={phone} onChange={(e) => setPhone(e.target.value)} invalid={!!errors.phone} aria-describedby={describedBy("wz-phone", errors.phone)} required />
              </Field>
              <Field id="wz-email" label={d.form.email} error={err(errors.email)}>
                <Input id="wz-email" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} invalid={!!errors.email} aria-describedby={describedBy("wz-email", errors.email)} required />
              </Field>
            </div>
            <Field id="wz-message" label={d.form.messageOptional} optional={d.form.optional}>
              <Textarea id="wz-message" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} />
            </Field>
            <p className="text-[13px] leading-relaxed text-graphite">
              {d.form.privacy}{" "}
              <Link href={href(lang, "/privacy")} className="link font-normal">
                {d.form.privacyLink}
              </Link>
            </p>
          </>
        )}
      </div>

      {formError && (
        <p id="wz-form-error" role="alert" className="field-error mt-6 rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--color-error-line)_8%,white)] p-4">
          <Icon name="alert" size={16} className="mt-px" />
          {formError}
        </p>
      )}

      {/* Actions: sticky at the bottom on phones */}
      <div className="sticky bottom-0 z-10 -mx-5 mt-8 flex flex-col gap-2.5 border-t border-line bg-white px-5 pb-[calc(16px+var(--safe-bottom))] pt-4 sm:static sm:mx-0 sm:border-0 sm:p-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {step === 1 && (
            <span className={`text-sm ${errors.services ? "text-error" : "text-graphite"}`} aria-hidden="true">
              {w.chosen(topics.length)}
            </span>
          )}
          <button type="submit" className="btn btn-primary w-full sm:ml-auto sm:w-auto" aria-disabled={pending} disabled={pending}>
            <span>{pending ? d.form.sending : step === STEPS ? w.submit : w.next}</span>
            <span className="knob">{pending ? <Spinner /> : <Icon name="arrow" />}</span>
          </button>
        </div>
        <span className="text-center text-[13px] text-graphite sm:text-left">
          {w.preferCall}{" "}
          <a href={`tel:${nav.phone}`} className="link">
            {nav.phoneDisplay}
          </a>
        </span>
      </div>
    </form>
  );
}

function utmFromUrl(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
    const v = p.get(k);
    if (v) out[k] = v.slice(0, 120);
  }
  return out;
}

function ProgressRing({ fraction }: { fraction: number }) {
  return (
    <svg viewBox="0 0 44 44" width="44" height="44" aria-hidden="true" className="flex-none">
      <circle cx="22" cy="22" r="18" fill="none" stroke="var(--color-line)" strokeWidth="4" />
      <circle
        cx="22"
        cy="22"
        r="18"
        fill="none"
        stroke="var(--color-blue)"
        strokeWidth="4"
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray={`${fraction * 100} 100`}
        transform="rotate(-90 22 22)"
        style={{ transition: "stroke-dasharray var(--dur-slow) var(--ease-out)" }}
      />
    </svg>
  );
}

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="animate-spin">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/** The C closes: arc draws on, the arrowhead lands, then the check. */
function SuccessLoop() {
  return (
    <svg viewBox="0 0 120 120" width="120" height="120" aria-hidden="true" className="draw-now overflow-visible">
      <circle cx="60" cy="60" r="52" fill="var(--color-sky)" />
      <path className="draw" d="M96.8 23.2 A52 52 0 1 0 96.8 96.8" fill="none" stroke="var(--color-signal)" strokeWidth="5" strokeLinecap="round" style={{ "--len": 300, "--d": "100ms" } as React.CSSProperties} />
      {/* Arrowhead tangent to the arc end (up-right, like the logo). */}
      <path className="pop" d="M91.5 91.5 L102.1 102.1 L104.6 89.0 Z" fill="var(--color-signal)" stroke="var(--color-signal)" strokeWidth="2" strokeLinejoin="round" style={{ "--d": "900ms" } as React.CSSProperties} />
      <path className="draw" d="M42 61l12 12 24-26" fill="none" stroke="var(--color-blue)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" style={{ "--len": 60, "--d": "1050ms" } as React.CSSProperties} />
    </svg>
  );
}
