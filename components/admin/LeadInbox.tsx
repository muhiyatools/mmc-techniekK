"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { initials, LEAD_COLUMNS, LEAD_STATUSES, relativeTime, STATUS_LABEL, TOPIC_LABEL, type LeadRow, type LeadStatus } from "@/lib/admin/leads";
import { createClient } from "@/lib/supabase/browser";
import { LeadDetail, StatusPill, type Staff } from "./LeadDetail";
import { toast } from "./Toast";

type Tab = "all" | LeadStatus;

/** Inbox: tabs per status, search, list, and the detail panel (desktop) or detail page (phone). */
export function LeadInbox({ initial, staff }: { initial: LeadRow[]; staff: Staff[] }) {
  const router = useRouter();
  const [leads, setLeads] = useState(initial);
  const [tab, setTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(initial[0]?.id ?? null);
  const q = useDeferredValue(query.trim().toLowerCase());

  // Realtime: new requests appear at the top, changes elsewhere show up here.
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("lead-inbox")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "quote_requests" }, async (payload) => {
        const { data } = await supabase.from("quote_requests").select(LEAD_COLUMNS).eq("id", (payload.new as { id: string }).id).single();
        if (!data) return;
        setLeads((cur) => (cur.some((l) => l.id === data.id) ? cur : [data as unknown as LeadRow, ...cur]));
        toast(`Nieuwe aanvraag van ${(data as { name: string }).name}`);
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "quote_requests" }, (payload) => {
        const row = payload.new as LeadRow;
        setLeads((cur) => cur.map((l) => (l.id === row.id ? { ...l, ...row } : l)));
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: leads.length };
    for (const l of leads) c[l.status] = (c[l.status] ?? 0) + 1;
    return c;
  }, [leads]);

  const shown = leads.filter(
    (l) =>
      (tab === "all" || l.status === tab) &&
      (!q || [l.name, l.email, l.phone, l.ref, l.postcode, l.message, ...(l.services ?? [])].some((v) => v?.toLowerCase().includes(q))),
  );
  const current = leads.find((l) => l.id === selected) ?? null;
  const patch = (id: string, p: Partial<LeadRow>) => setLeads((cur) => cur.map((l) => (l.id === id ? { ...l, ...p } : l)));
  const staffInitials = (id: string | null) => (id ? initials(staff.find((s) => s.id === id)?.name ?? "?") : null);

  const exportHref = `/admin/aanvragen/export?${new URLSearchParams({ status: tab, q: query.trim() })}`;

  return (
    <div className="flex min-h-0 flex-1">
      <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div role="tablist" aria-label="Status" className="-mx-4 flex gap-1 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
            {(["all", ...LEAD_STATUSES] as Tab[]).map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className="flex h-9 flex-none items-center gap-2 rounded-lg px-3 font-semibold text-slate transition-colors hover:bg-paper aria-selected:bg-ink aria-selected:text-white"
              >
                {t === "all" ? "Alle" : STATUS_LABEL[t]}
                <span className="t-mono text-[11px] opacity-70">{counts[t] ?? 0}</span>
              </button>
            ))}
          </div>
          <div className="flex w-full gap-2 sm:w-auto">
            <label className="relative flex-1 sm:w-64">
              <span className="sr-only">Zoeken</span>
              <Icon name="search" size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-graphite" />
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Zoek op naam, plaats, referentie…" className="input h-9 rounded-lg pl-9 text-[14px]" />
            </label>
            <a href={exportHref} className="flex h-9 items-center gap-1.5 rounded-lg px-3 font-semibold shadow-[inset_0_0_0_1.5px_var(--color-line-strong)] hover:bg-paper">
              <Icon name="download" size={15} />
              <span className="hidden sm:inline">CSV</span>
            </a>
          </div>
        </div>

        {shown.length === 0 ? (
          <div className="grid flex-1 place-items-center rounded-xl border border-dashed border-line-strong p-10 text-center text-graphite">
            {leads.length === 0 ? "Nog geen aanvragen. Nieuwe aanvragen van de website verschijnen hier direct." : "Geen aanvragen met dit filter."}
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-line">
            <div role="table" aria-label="Aanvragen" className="w-full">
              <div role="row" className="t-mono hidden grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)_110px_130px_36px] gap-3 border-b border-line bg-paper px-4 py-2.5 text-[11px] text-graphite md:grid">
                <span role="columnheader">Klant</span>
                <span role="columnheader">Dienst</span>
                <span role="columnheader">Ontvangen</span>
                <span role="columnheader">Status</span>
                <span role="columnheader">
                  <span className="sr-only">Toegewezen</span>
                </span>
              </div>
              {shown.map((l, i) => (
                <button
                  key={l.id}
                  role="row"
                  type="button"
                  aria-current={selected === l.id}
                  onClick={() => (window.matchMedia("(min-width: 1280px)").matches ? setSelected(l.id) : router.push(`/admin/aanvragen/${l.id}`))}
                  className="fade-up grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 border-b border-line px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-paper aria-[current=true]:bg-sky md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)_110px_130px_36px]"
                  style={{ "--d": `${Math.min(i, 10) * 25}ms` } as React.CSSProperties}
                >
                  <span role="cell" className="flex min-w-0 flex-col">
                    <span className="flex items-center gap-2 truncate font-semibold">
                      {l.status === "new" && <span className="size-2 flex-none rounded-full bg-blue" aria-label="Nieuw" />}
                      {l.name}
                    </span>
                    <span className="truncate text-[12px] text-graphite">
                      {[l.postcode, l.ref].filter(Boolean).join(" · ")}
                    </span>
                  </span>
                  <span role="cell" className="col-span-2 truncate text-slate md:col-span-1">
                    {l.kind === "contact" ? "Contactbericht" : (l.services?.length ? l.services : l.service_slug ? [l.service_slug] : []).map((s) => TOPIC_LABEL[s] ?? s).join(", ")}
                  </span>
                  <span role="cell" className="hidden text-slate md:block">
                    {relativeTime(l.created_at)}
                  </span>
                  <span role="cell" className="col-start-2 row-start-1 md:col-start-auto md:row-start-auto">
                    <StatusPill status={l.status} />
                  </span>
                  <span role="cell" className="hidden md:block">
                    {staffInitials(l.assignee) && <span className="grid size-7 place-items-center rounded-full bg-ink text-[11px] font-bold text-white">{staffInitials(l.assignee)}</span>}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <aside className="hidden w-[420px] flex-none overflow-y-auto border-l border-line xl:block">
        {current ? (
          <LeadDetail key={current.id} lead={current} staff={staff} onChange={(p) => patch(current.id, p)} />
        ) : (
          <div className="grid h-full place-items-center p-10 text-center text-graphite">Kies een aanvraag.</div>
        )}
        {current && (
          <Link href={`/admin/aanvragen/${current.id}`} className="sr-only focus:not-sr-only">
            Open als pagina
          </Link>
        )}
      </aside>
    </div>
  );
}
