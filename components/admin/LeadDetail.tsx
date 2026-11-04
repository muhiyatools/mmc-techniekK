"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { addLeadEvent, assignLead, setLeadStatus } from "@/lib/admin/actions";
import { initials, PROPERTY_LABEL, relativeTime, STATUS_CLASS, STATUS_LABEL, TIMING_LABEL, TOPIC_LABEL, type LeadRow, type LeadStatus } from "@/lib/admin/leads";
import { createClient } from "@/lib/supabase/browser";
import { toast } from "./Toast";

type Event = { id: number; type: string; body: string | null; from_status: string | null; to_status: string | null; actor: string | null; created_at: string };
export type Staff = { id: string; name: string };

const PIPELINE: LeadStatus[] = ["new", "in_progress", "quote_sent", "won"];

export function StatusPill({ status }: { status: LeadStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-semibold ${STATUS_CLASS[status]}`}>
      <i className="size-1.5 rounded-full bg-current" />
      {STATUS_LABEL[status]}
    </span>
  );
}

/** Everything about one request: contact actions, pipeline, answers, timeline, notes. */
export function LeadDetail({ lead, staff, onChange }: { lead: LeadRow; staff: Staff[]; onChange?: (patch: Partial<LeadRow>) => void }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [note, setNote] = useState("");
  const [pending, start] = useTransition();
  const staffName = (id: string | null) => staff.find((s) => s.id === id)?.name ?? "Onbekend";

  const loadEvents = useCallback(async () => {
    const { data } = await createClient().from("lead_events").select("id, type, body, from_status, to_status, actor, created_at").eq("lead_id", lead.id).order("created_at", { ascending: false });
    setEvents((data as Event[]) ?? []);
  }, [lead.id]);

  useEffect(() => {
    let live = true;
    createClient()
      .from("lead_events")
      .select("id, type, body, from_status, to_status, actor, created_at")
      .eq("lead_id", lead.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => live && setEvents((data as Event[]) ?? []));
    return () => {
      live = false;
    };
  }, [lead.id]);

  const changeStatus = (status: LeadStatus) => {
    if (status === lead.status) return;
    const prev = lead.status;
    onChange?.({ status }); // optimistic
    start(async () => {
      const res = await setLeadStatus(lead.id, status);
      if (!res.ok) {
        onChange?.({ status: prev });
        toast(res.error, "error");
        return;
      }
      toast(`Status: ${STATUS_LABEL[status]}`);
      loadEvents();
    });
  };

  const assign = (id: string) => {
    const value = id || null;
    onChange?.({ assignee: value });
    start(async () => {
      const res = await assignLead(lead.id, value);
      if (!res.ok) toast(res.error, "error");
      loadEvents();
    });
  };

  const log = (type: "note" | "call" | "email" | "whatsapp", body = "") =>
    start(async () => {
      const res = await addLeadEvent(lead.id, type, body);
      if (!res.ok) return toast(res.error, "error");
      if (type === "note") {
        setNote("");
        toast("Notitie opgeslagen");
      }
      loadEvents();
    });

  const variant = lead.answers?.variant;
  const address = [lead.postcode, lead.house_number].filter(Boolean).join(" ");
  const services = (lead.services?.length ? lead.services : lead.service_slug ? [lead.service_slug] : []).map((s) => TOPIC_LABEL[s] ?? s).join(", ");
  const phoneDigits = (lead.phone ?? "").replace(/[^\d+]/g, "");
  const wa = phoneDigits.replace(/^\+/, "").replace(/^0/, "31");

  const asText = [
    `${lead.ref} · ${lead.name}`,
    services && `Diensten: ${services}`,
    lead.product_slug && `Product: ${lead.product_slug}${variant ? ` (${variant})` : ""}`,
    lead.property_type && `Type pand: ${PROPERTY_LABEL[lead.property_type] ?? lead.property_type}`,
    address && `Adres: ${address}`,
    lead.timing && `Start: ${TIMING_LABEL[lead.timing] ?? lead.timing}`,
    lead.phone && `Telefoon: ${lead.phone}`,
    `E-mail: ${lead.email}`,
    lead.message && `\n${lead.message}`,
  ]
    .filter(Boolean)
    .join("\n");

  const quick: { icon: IconName; label: string; href: string; type: "call" | "whatsapp" | "email"; disabled?: boolean }[] = [
    { icon: "phone", label: "Bellen", href: `tel:${phoneDigits}`, type: "call", disabled: !phoneDigits },
    { icon: "whatsapp", label: "WhatsApp", href: `https://wa.me/${wa}?text=${encodeURIComponent(`Goedendag ${lead.name}, u vroeg een offerte aan bij MMC Techniek (${lead.ref}). `)}`, type: "whatsapp", disabled: !phoneDigits },
    { icon: "mail", label: "Mail", href: `mailto:${lead.email}?subject=${encodeURIComponent(`Uw aanvraag ${lead.ref}`)}`, type: "email" },
  ];

  const step = lead.status === "lost" ? -1 : PIPELINE.indexOf(lead.status);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-4 border-b border-line p-5 sm:px-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="t-mono text-graphite">{lead.ref}</span>
            <h2 className="truncate text-[20px] font-bold [font-stretch:112%]">{lead.name}</h2>
            <span className="text-graphite">
              {lead.kind === "contact" ? "Contactbericht" : "Offerteaanvraag"} · {relativeTime(lead.created_at)}
            </span>
          </div>
          <StatusPill status={lead.status} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {quick.map((q) => (
            <a
              key={q.type}
              href={q.disabled ? undefined : q.href}
              aria-disabled={q.disabled}
              target={q.type === "whatsapp" ? "_blank" : undefined}
              rel="noopener noreferrer"
              onClick={() => !q.disabled && log(q.type, q.type === "call" ? "Gebeld" : q.type === "whatsapp" ? "WhatsApp geopend" : "Mail geopend")}
              className="flex h-11 items-center justify-center gap-2 rounded-[10px] font-semibold shadow-[inset_0_0_0_1.5px_var(--color-line-strong)] transition-colors hover:bg-paper aria-disabled:pointer-events-none aria-disabled:opacity-40"
            >
              <Icon name={q.icon} size={16} />
              {q.label}
            </a>
          ))}
        </div>
      </div>

      {/* Pipeline */}
      <div className="flex flex-col gap-3 border-b border-line p-5 sm:px-6">
        <div className="flex items-center justify-between">
          <span className="t-mono text-graphite">Voortgang</span>
          <button type="button" onClick={() => changeStatus(lead.status === "lost" ? "in_progress" : "lost")} className="text-[13px] font-semibold text-graphite hover:text-ink">
            {lead.status === "lost" ? "Heropenen" : "Markeer als verloren"}
          </button>
        </div>
        <ol className="relative grid grid-cols-4">
          <span aria-hidden="true" className="absolute left-[12.5%] right-[12.5%] top-[11px] h-0.5 bg-line" />
          <span aria-hidden="true" className="absolute left-[12.5%] top-[11px] h-0.5 bg-blue transition-[width] duration-[var(--dur-slow)]" style={{ width: `${Math.max(0, step) * 25}%` }} />
          {PIPELINE.map((s, i) => {
            const done = step > i;
            const cur = step === i;
            return (
              <li key={s} className="relative flex flex-col items-center">
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => changeStatus(s)}
                  aria-pressed={cur}
                  className="flex flex-col items-center gap-1.5 text-center text-[12px] font-semibold text-graphite aria-pressed:text-blue-deep"
                >
                  <span
                    className={`grid size-6 place-items-center rounded-full transition-colors ${
                      done ? "bg-blue text-white" : cur ? "bg-white shadow-[inset_0_0_0_2px_var(--color-blue),0_0_0_4px_var(--color-sky)]" : "bg-white shadow-[inset_0_0_0_2px_var(--color-line-strong)]"
                    }`}
                  >
                    {done && <Icon name="check" size={13} strokeWidth={3} />}
                  </span>
                  {STATUS_LABEL[s]}
                </button>
              </li>
            );
          })}
        </ol>
        <label className="flex items-center gap-3 pt-1">
          <span className="t-mono w-28 text-graphite">Toegewezen</span>
          <select className="input h-10 flex-1 text-[14px]" value={lead.assignee ?? ""} onChange={(e) => assign(e.target.value)}>
            <option value="">Niemand</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Answers */}
      <div className="flex flex-col gap-3 border-b border-line p-5 sm:px-6">
        <div className="flex items-center justify-between">
          <span className="t-mono text-graphite">Aanvraag</span>
          <button
            type="button"
            className="flex items-center gap-1.5 text-[13px] font-semibold text-blue hover:text-blue-deep"
            onClick={async () => {
              await navigator.clipboard.writeText(asText);
              toast("Gekopieerd");
            }}
          >
            <Icon name="copy" size={14} />
            Kopieer als tekst
          </button>
        </div>
        <dl className="grid grid-cols-[110px_minmax(0,1fr)] gap-x-3 gap-y-2">
          {[
            ["Diensten", services],
            ["Product", lead.product_slug ? `${lead.product_slug}${variant ? ` · ${variant}` : ""}` : lead.product_name],
            ["Type pand", lead.property_type && (PROPERTY_LABEL[lead.property_type] ?? lead.property_type)],
            ["Adres", address],
            ["Start", lead.timing && (TIMING_LABEL[lead.timing] ?? lead.timing)],
            ["Telefoon", lead.phone],
            ["E-mail", lead.email],
            ["Taal", lead.locale === "en" ? "Engels" : "Nederlands"],
            ["Bron", lead.source_page],
          ]
            .filter(([, v]) => v)
            .map(([k, v]) => (
              <div key={k as string} className="contents">
                <dt className="text-graphite">{k}</dt>
                <dd className="min-w-0 break-words">{v}</dd>
              </div>
            ))}
        </dl>
        {lead.message && <p className="whitespace-pre-line rounded-[10px] bg-paper px-3.5 py-3 leading-relaxed text-slate">{lead.message}</p>}
      </div>

      {/* Notes + timeline */}
      <div className="flex flex-col gap-3 p-5 sm:px-6">
        <label htmlFor={`note-${lead.id}`} className="t-mono text-graphite">
          Interne notitie
        </label>
        <textarea id={`note-${lead.id}`} value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Bijv. dak op het zuiden, meterkast 1-fase…" className="input min-h-0 text-[14px]" />
        <button type="button" disabled={pending || !note.trim()} onClick={() => log("note", note)} className="btn btn-primary btn-sm btn-plain self-start">
          Notitie opslaan
        </button>

        <span className="t-mono pt-3 text-graphite">Tijdlijn</span>
        <ol className="flex flex-col gap-3">
          {events.map((e) => (
            <li key={e.id} className="flex gap-2.5">
              <span className={`mt-1.5 size-2 flex-none rounded-full ${e.type === "created" ? "bg-blue" : e.type === "note" ? "bg-sun" : "bg-line-strong"}`} />
              <span className="flex min-w-0 flex-col">
                <span className="font-medium">{describe(e, staffName)}</span>
                {e.type === "note" && e.body && <span className="whitespace-pre-line text-slate">{e.body}</span>}
                <span className="text-[12px] text-graphite">
                  {relativeTime(e.created_at)}
                  {e.actor ? ` · ${staffName(e.actor)}` : ""}
                </span>
              </span>
            </li>
          ))}
          {events.length === 0 && <li className="text-graphite">Nog geen activiteit.</li>}
        </ol>
      </div>
    </div>
  );
}

function describe(e: Event, staffName: (id: string | null) => string) {
  switch (e.type) {
    case "created":
      return `Aanvraag ontvangen${e.body ? ` (${e.body.toLowerCase()})` : ""}`;
    case "status":
      return `Status: ${STATUS_LABEL[e.from_status as LeadStatus] ?? e.from_status} → ${STATUS_LABEL[e.to_status as LeadStatus] ?? e.to_status}`;
    case "assign":
      return e.body ? `Toegewezen aan ${staffName(e.body)}` : "Toewijzing verwijderd";
    case "note":
      return "Notitie";
    case "call":
      return "Gebeld";
    case "whatsapp":
      return "WhatsApp-bericht";
    case "email":
      return "Gemaild";
    case "notify":
      return e.body ?? "Melding verstuurd";
    default:
      return e.type;
  }
}

export { initials };
