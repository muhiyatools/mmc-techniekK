"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { href, type Locale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/ui";
import { TOPICS } from "@/lib/leads/options";

/** Step 1 of the quote wizard, inline on the homepage. Continues on /offerte with the answers. */
export function QuoteStart({ lang }: { lang: Locale }) {
  const d = getDict(lang);
  const router = useRouter();
  const [picks, setPicks] = useState<string[]>([]);
  const [postcode, setPostcode] = useState("");
  const [house, setHouse] = useState("");
  const [tried, setTried] = useState(false);

  const toggle = (id: string) => setPicks((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const next = () => {
    if (!picks.length) {
      setTried(true);
      return;
    }
    const q = new URLSearchParams({ onderwerpen: picks.join(",") });
    if (postcode.trim()) q.set("postcode", postcode.trim());
    if (house.trim()) q.set("huisnummer", house.trim());
    router.push(`${href(lang, "/offerte")}?${q}`);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        next();
      }}
      className="relative flex flex-col gap-6 rounded-[24px] bg-white p-5 text-ink shadow-[var(--shadow-form)] sm:p-9"
      noValidate
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="t-mono text-blue">{d.wizard.step(1, 3)}</span>
          <h3 className="t-h3 text-[22px] sm:text-[24px]">{d.wizard.s1Title}</h3>
        </div>
        <svg viewBox="0 0 48 48" width="52" height="52" aria-hidden="true" className="flex-none">
          <circle cx="24" cy="24" r="19" fill="none" stroke="var(--color-line)" strokeWidth="4" />
          <circle
            cx="24"
            cy="24"
            r="19"
            fill="none"
            stroke="var(--color-blue)"
            strokeWidth="4"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={`${picks.length ? 33.3 : 4} 100`}
            transform="rotate(-90 24 24)"
            style={{ transition: "stroke-dasharray var(--dur-slow) var(--ease-out)" }}
          />
        </svg>
      </div>

      <fieldset>
        <legend className="sr-only">{d.wizard.s1Title}</legend>
        <div className="grid grid-cols-1 gap-2.5 xs:grid-cols-2">
          {TOPICS.map((id) => (
            <button key={id} type="button" className="option min-h-12 rounded-[var(--radius-sm)] text-[15px]" aria-pressed={picks.includes(id)} onClick={() => toggle(id)}>
              <span className="box">
                <Icon name="check" size={14} strokeWidth={3} />
              </span>
              {d.wizard.topics[id]}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-3">
        <div className="field">
          <label htmlFor="qs-postcode" className="field-label">
            {d.form.postcode}
          </label>
          <input id="qs-postcode" className="input" autoComplete="postal-code" placeholder="3421 VG" value={postcode} onChange={(e) => setPostcode(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="qs-house" className="field-label">
            {d.form.houseNumber}
          </label>
          <input id="qs-house" className="input" inputMode="text" placeholder="11" value={house} onChange={(e) => setHouse(e.target.value)} />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <span aria-live="polite" className={`text-sm ${tried && !picks.length ? "text-error" : "text-graphite"}`}>
          {d.wizard.chosen(picks.length)}
        </span>
        <button type="submit" className="btn btn-primary">
          <span>{d.wizard.next}</span>
          <span className="knob">
            <Icon name="arrow" />
          </span>
        </button>
      </div>
    </form>
  );
}
