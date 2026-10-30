import Link from "next/link";
import { StatusPill } from "@/components/admin/LeadDetail";
import { AdminHeader } from "@/components/admin/Shell";
import { Icon } from "@/components/ui/Icon";
import { hasRole, requirePage } from "@/lib/admin/auth";
import { CONTENT_TYPES } from "@/lib/admin/content-types";
import { relativeTime, TOPIC_LABEL, type LeadStatus } from "@/lib/admin/leads";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Dashboard" };

const WEEKS = 8;

export default async function Dashboard() {
  const user = await requirePage("editor");
  const db = await createClient();
  const canLeads = hasRole(user, "admin");
  const greeting = user.name ? `Hallo ${user.name.split(" ")[0]}` : "Dashboard";

  // Content status (everyone)
  const contentKeys = ["diensten", "aanbod", "vragen", "reviews"] as const;
  const content = await Promise.all(
    contentKeys.map(async (k) => {
      const t = CONTENT_TYPES[k];
      const { data } = await db.from(t.table as "pages").select("status");
      const rows = (data ?? []) as { status: string }[];
      return { slug: k, label: t.label, icon: t.icon, published: rows.filter((r) => r.status === "published").length, draft: rows.filter((r) => r.status === "draft").length };
    }),
  );

  if (!canLeads) {
    return (
      <>
        <AdminHeader title={greeting} description="Beheer de inhoud van mmctechniek.nl." />
        <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6 xl:grid-cols-3">
          {content.map((c) => (
            <ContentTile key={c.slug} {...c} />
          ))}
        </div>
      </>
    );
  }

  const since = new Date(Date.now() - WEEKS * 7 * 86400000).toISOString();
  const { data: recent } = await db.from("quote_requests").select("id, ref, name, status, services, service_slug, created_at").gte("created_at", since).order("created_at", { ascending: false });
  const { data: openRows } = await db.from("quote_requests").select("id, ref, name, status, services, service_slug, created_at").in("status", ["new", "in_progress", "quote_sent"]).order("created_at", { ascending: true });
  const leads = recent ?? [];
  const open = openRows ?? [];

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const weekStart = Date.now() - 7 * 86400000;
  const thisWeek = leads.filter((l) => new Date(l.created_at).getTime() >= weekStart).length;
  const thisMonth = leads.filter((l) => new Date(l.created_at).getTime() >= monthStart);
  const count = (s: LeadStatus) => open.filter((l) => l.status === s).length;
  const oldestNew = open.find((l) => l.status === "new");
  const wonMonth = thisMonth.filter((l) => l.status === "won").length;
  const lostMonth = thisMonth.filter((l) => l.status === "lost").length;

  // Leads per week, oldest first
  const buckets = Array.from({ length: WEEKS }, (_, i) => {
    const end = Date.now() - (WEEKS - 1 - i) * 7 * 86400000;
    const start = end - 7 * 86400000;
    return { label: new Date(start).toLocaleDateString("nl-NL", { day: "numeric", month: "short" }), n: leads.filter((l) => { const t = new Date(l.created_at).getTime(); return t >= start && t < end; }).length };
  });
  const max = Math.max(1, ...buckets.map((b) => b.n));

  // By service (last 8 weeks)
  const bySvc = new Map<string, number>();
  for (const l of leads) for (const s of l.services?.length ? l.services : l.service_slug ? [l.service_slug] : []) bySvc.set(s, (bySvc.get(s) ?? 0) + 1);
  const svcRows = [...bySvc].sort((a, b) => b[1] - a[1]);
  const svcMax = Math.max(1, ...svcRows.map(([, n]) => n));

  return (
    <>
      <AdminHeader title={greeting} description={`${thisWeek} ${thisWeek === 1 ? "aanvraag" : "aanvragen"} deze week, ${thisMonth.length} deze maand.`} />
      <div className="flex flex-col gap-6 p-4 sm:p-6">
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <Kpi label="Nieuw" value={count("new")} note={oldestNew ? `Oudste: ${relativeTime(oldestNew.created_at).toLowerCase()}` : "Niets open"} tone={count("new") ? "new" : undefined} href="/admin/aanvragen" />
          <Kpi label="In behandeling" value={count("in_progress")} href="/admin/aanvragen" />
          <Kpi label="Offerte verstuurd" value={count("quote_sent")} href="/admin/aanvragen" />
          <Kpi label="Gewonnen deze maand" value={wonMonth} note={wonMonth + lostMonth ? `${Math.round((wonMonth / (wonMonth + lostMonth)) * 100)}% van afgerond` : undefined} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <section className="rounded-xl border border-line p-5" aria-labelledby="weeks">
            <h2 id="weeks" className="t-mono mb-5 text-graphite">
              Aanvragen per week
            </h2>
            <ol className="flex h-[160px] items-end gap-2">
              {buckets.map((b, i) => (
                <li key={i} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-[12px] font-semibold tabular-nums">{b.n || ""}</span>
                  <span className={`w-full rounded-t-md ${i === buckets.length - 1 ? "bg-blue" : "bg-sky"}`} style={{ height: `${Math.max(3, (b.n / max) * 110)}px` }} title={`${b.n} in week van ${b.label}`} />
                  <span className="text-[11px] text-graphite">{b.label}</span>
                </li>
              ))}
            </ol>
          </section>
          <section className="rounded-xl border border-line p-5" aria-labelledby="bysvc">
            <h2 id="bysvc" className="t-mono mb-5 text-graphite">
              Per dienst · {WEEKS} weken
            </h2>
            {svcRows.length === 0 ? (
              <p className="text-graphite">Nog geen aanvragen in deze periode.</p>
            ) : (
              <ul className="flex flex-col gap-2.5">
                {svcRows.map(([s, n]) => (
                  <li key={s} className="grid grid-cols-[130px_minmax(0,1fr)_28px] items-center gap-3">
                    <span className="truncate">{TOPIC_LABEL[s] ?? s}</span>
                    <span className="h-2 rounded-full bg-paper">
                      <span className="block h-2 rounded-full bg-blue" style={{ width: `${(n / svcMax) * 100}%` }} />
                    </span>
                    <span className="text-right font-semibold tabular-nums">{n}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <section className="rounded-xl border border-line" aria-labelledby="open">
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <h2 id="open" className="t-mono text-graphite">
              Open aanvragen
            </h2>
            <Link href="/admin/aanvragen" className="text-[13px] font-semibold text-blue hover:text-blue-deep">
              Naar de inbox
            </Link>
          </div>
          {open.length === 0 ? (
            <p className="p-5 text-graphite">Alles is afgehandeld.</p>
          ) : (
            <ul>
              {open.slice(0, 6).map((l) => (
                <li key={l.id} className="border-b border-line last:border-b-0">
                  <Link href={`/admin/aanvragen/${l.id}`} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-3 hover:bg-paper sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_120px_auto]">
                    <span className="truncate font-semibold">{l.name}</span>
                    <span className="hidden truncate text-slate sm:block">{(l.services ?? []).map((s) => TOPIC_LABEL[s] ?? s).join(", ")}</span>
                    <span className="hidden text-slate sm:block">{relativeTime(l.created_at)}</span>
                    <StatusPill status={l.status as LeadStatus} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {content.map((c) => (
            <ContentTile key={c.slug} {...c} />
          ))}
        </div>
      </div>
    </>
  );
}

function Kpi({ label, value, note, tone, href }: { label: string; value: number; note?: string; tone?: "new"; href?: string }) {
  const body = (
    <>
      <span className="t-mono text-graphite">{label}</span>
      <b className="text-[30px] font-[800] leading-none tabular-nums [font-stretch:120%]">{value}</b>
      {note && <span className={`text-[12px] ${tone === "new" ? "text-st-new" : "text-graphite"}`}>{note}</span>}
    </>
  );
  const cls = "flex flex-col gap-2 rounded-xl border border-line p-4 transition-colors";
  return href ? (
    <Link href={href} className={`${cls} hover:border-line-strong hover:bg-paper`}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

function ContentTile({ slug, label, icon, published, draft }: { slug: string; label: string; icon: Parameters<typeof Icon>[0]["name"]; published: number; draft: number }) {
  return (
    <Link href={`/admin/inhoud/${slug}`} className="flex items-center gap-3 rounded-xl border border-line p-4 transition-colors hover:border-line-strong hover:bg-paper">
      <span className="grid size-10 place-items-center rounded-lg bg-paper text-blue">
        <Icon name={icon} size={18} />
      </span>
      <span className="flex flex-col">
        <span className="font-semibold">{label}</span>
        <span className="text-[12px] text-graphite">
          {published} gepubliceerd{draft ? ` · ${draft} concept` : ""}
        </span>
      </span>
    </Link>
  );
}
