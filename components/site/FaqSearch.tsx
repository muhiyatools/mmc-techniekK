"use client";

import { useDeferredValue, useState } from "react";
import { Accordion } from "@/components/ui/Accordion";
import { Icon } from "@/components/ui/Icon";
import type { Locale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/ui";

export type FaqGroup = { id: string; title: string; items: { id: string; q: string; a: string }[] };

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function FaqSearch({ lang, groups }: { lang: Locale; groups: FaqGroup[] }) {
  const d = getDict(lang);
  const [query, setQuery] = useState("");
  const q = norm(useDeferredValue(query).trim());
  const filtered = groups
    .map((g) => ({ ...g, items: q ? g.items.filter((i) => norm(`${i.q} ${i.a}`).includes(q)) : g.items }))
    .filter((g) => g.items.length);
  const total = filtered.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16">
      <div className="flex flex-col gap-6 lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:self-start">
        <label className="relative block">
          <span className="sr-only">{d.faq.search}</span>
          <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-graphite" />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={d.faq.search} className="input pl-11" />
        </label>
        <nav aria-label={d.faq.title} className="hidden flex-col gap-1 lg:flex">
          {filtered.map((g) => (
            <a key={g.id} href={`#${g.id}`} className="flex items-center justify-between rounded-lg px-3 py-2 text-[15px] text-slate transition-colors hover:bg-paper hover:text-ink">
              {g.title}
              <span className="t-mono text-graphite">{g.items.length}</span>
            </a>
          ))}
        </nav>
      </div>
      <div className="flex flex-col gap-14">
        <p className="sr-only" aria-live="polite">
          {total}
        </p>
        {filtered.length === 0 && <p className="text-slate">{d.faq.none(query)}</p>}
        {filtered.map((g) => (
          <section key={g.id} id={g.id} aria-labelledby={`${g.id}-h`} className="scroll-mt-[calc(var(--header-h)+24px)]">
            <h2 id={`${g.id}-h`} className="t-mono mb-4 text-graphite">
              {g.title}
            </h2>
            <Accordion size="sm" defaultOpen={q && g.items.length < 4 ? g.items[0].id : null} items={g.items.map((i) => ({ id: i.id, title: i.q, content: <p>{i.a}</p> }))} />
          </section>
        ))}
      </div>
    </div>
  );
}
