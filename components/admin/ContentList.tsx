"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Icon } from "@/components/ui/Icon";
import { reorderContent, setContentStatus } from "@/lib/admin/content-actions";
import { toast } from "./Toast";

export type ListRow = { id: string; title: string; meta: string; status: "draft" | "published"; publicHref: string | null };

/** Sortable list of one content type. Drag the handle, or use the arrow buttons. */
export function ContentList({ typeKey, rows: initial, sortable, singular }: { typeKey: string; rows: ListRow[]; sortable: boolean; singular: string }) {
  const [rows, setRows] = useState(initial);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "draft" | "published">("all");
  const [dragId, setDragId] = useState<string | null>(null);
  const [, start] = useTransition();

  const filtering = !!query.trim() || status !== "all";
  const shown = rows.filter((r) => (status === "all" || r.status === status) && (!query.trim() || `${r.title} ${r.meta}`.toLowerCase().includes(query.trim().toLowerCase())));

  const persist = (next: ListRow[]) => {
    setRows(next);
    start(async () => {
      const res = await reorderContent(typeKey, next.map((r) => r.id));
      toast(res.ok ? "Volgorde opgeslagen" : "Volgorde opslaan mislukt", res.ok ? "ok" : "error");
    });
  };
  const move = (id: string, delta: number) => {
    const i = rows.findIndex((r) => r.id === id);
    const j = i + delta;
    if (i < 0 || j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[i], next[j]] = [next[j], next[i]];
    persist(next);
  };
  const dropOn = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    const next = rows.filter((r) => r.id !== dragId);
    const at = next.findIndex((r) => r.id === targetId);
    next.splice(at, 0, rows.find((r) => r.id === dragId)!);
    setDragId(null);
    persist(next);
  };
  const toggle = (row: ListRow) => {
    const to = row.status === "published" ? "draft" : "published";
    setRows((cur) => cur.map((r) => (r.id === row.id ? { ...r, status: to } : r)));
    start(async () => {
      const res = await setContentStatus(typeKey, row.id, to);
      if (!res.ok) {
        setRows((cur) => cur.map((r) => (r.id === row.id ? { ...r, status: row.status } : r)));
        toast("Wijzigen mislukt", "error");
      } else toast(to === "published" ? "Gepubliceerd" : "Op concept gezet");
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <label className="relative w-full sm:w-72">
          <span className="sr-only">Zoeken</span>
          <Icon name="search" size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-graphite" />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Zoeken…" className="input h-9 rounded-lg pl-9 text-[14px]" />
        </label>
        <div role="group" aria-label="Status" className="flex gap-1">
          {(["all", "published", "draft"] as const).map((s) => (
            <button key={s} type="button" aria-pressed={status === s} onClick={() => setStatus(s)} className="h-9 rounded-lg px-3 font-semibold text-slate hover:bg-paper aria-pressed:bg-ink aria-pressed:text-white">
              {s === "all" ? "Alle" : s === "published" ? "Gepubliceerd" : "Concept"}
            </button>
          ))}
        </div>
        {sortable && !filtering && <span className="text-[12px] text-graphite sm:ml-auto">Sleep om de volgorde op de site te wijzigen.</span>}
      </div>

      {shown.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line-strong p-10 text-center text-graphite">{rows.length ? "Niets gevonden." : `Nog geen ${singular}. Maak de eerste aan.`}</div>
      ) : (
        <ul className="overflow-hidden rounded-xl border border-line">
          {shown.map((r, i) => (
            <li
              key={r.id}
              draggable={sortable && !filtering}
              onDragStart={() => setDragId(r.id)}
              onDragOver={(e) => sortable && !filtering && e.preventDefault()}
              onDrop={() => dropOn(r.id)}
              onDragEnd={() => setDragId(null)}
              className={`fade-up flex items-center gap-2 border-b border-line bg-white px-2 py-2 last:border-b-0 sm:px-3 ${dragId === r.id ? "opacity-40" : ""}`}
              style={{ "--d": `${Math.min(i, 12) * 20}ms` } as React.CSSProperties}
            >
              {sortable && !filtering && (
                <span className="flex flex-none items-center">
                  <span className="hidden cursor-grab px-1 text-graphite active:cursor-grabbing sm:block" aria-hidden="true">
                    <Icon name="drag" size={18} strokeWidth={3} />
                  </span>
                  <span className="flex flex-col">
                    <button type="button" onClick={() => move(r.id, -1)} disabled={i === 0} aria-label={`${r.title} omhoog`} className="grid h-4 w-6 place-items-center text-graphite hover:text-ink disabled:opacity-30">
                      <Icon name="chevronDown" size={14} className="rotate-180" />
                    </button>
                    <button type="button" onClick={() => move(r.id, 1)} disabled={i === shown.length - 1} aria-label={`${r.title} omlaag`} className="grid h-4 w-6 place-items-center text-graphite hover:text-ink disabled:opacity-30">
                      <Icon name="chevronDown" size={14} />
                    </button>
                  </span>
                </span>
              )}
              <Link href={`/admin/inhoud/${typeKey}/${r.id}`} className="flex min-w-0 flex-1 flex-col rounded-md px-2 py-1 hover:bg-paper">
                <span className="truncate font-semibold">{r.title}</span>
                {r.meta && <span className="truncate text-[12px] text-graphite">{r.meta}</span>}
              </Link>
              <button
                type="button"
                onClick={() => toggle(r)}
                className={`flex-none rounded-full px-2.5 py-1 text-[12px] font-semibold transition-colors ${r.status === "published" ? "bg-st-won-bg text-st-won" : "bg-st-lost-bg text-st-lost"}`}
                title={r.status === "published" ? "Klik om op concept te zetten" : "Klik om te publiceren"}
              >
                {r.status === "published" ? "Gepubliceerd" : "Concept"}
              </button>
              {r.publicHref && r.status === "published" && (
                <a href={r.publicHref} target="_blank" rel="noopener noreferrer" aria-label={`${r.title} bekijken op de site`} className="hidden size-8 flex-none place-items-center rounded-lg text-graphite hover:bg-paper hover:text-ink sm:grid">
                  <Icon name="external" size={15} />
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
