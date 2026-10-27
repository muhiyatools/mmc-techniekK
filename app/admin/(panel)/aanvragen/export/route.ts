import { NextResponse, type NextRequest } from "next/server";
import { getAdminUser, hasRole } from "@/lib/admin/auth";
import { LEAD_STATUSES, PROPERTY_LABEL, STATUS_LABEL, TIMING_LABEL, TOPIC_LABEL, type LeadStatus } from "@/lib/admin/leads";
import { createClient } from "@/lib/supabase/server";

/** CSV of the (filtered) inbox, for Excel: semicolon-separated, UTF-8 with BOM. */
export async function GET(request: NextRequest) {
  const user = await getAdminUser();
  if (!hasRole(user, "admin")) return new NextResponse("Geen toegang", { status: 403 });
  const status = request.nextUrl.searchParams.get("status") ?? "all";
  const q = (request.nextUrl.searchParams.get("q") ?? "").toLowerCase();

  const db = await createClient();
  let query = db
    .from("quote_requests")
    .select("ref, created_at, status, kind, name, email, phone, postcode, house_number, property_type, timing, services, service_slug, product_slug, message, locale, source_page")
    .order("created_at", { ascending: false });
  if ((LEAD_STATUSES as readonly string[]).includes(status)) query = query.eq("status", status);
  const { data } = await query;

  const rows = (data ?? []).filter((l) => !q || [l.name, l.email, l.phone, l.ref, l.postcode, l.message].some((v) => v?.toLowerCase().includes(q)));
  const cell = (v: unknown) => {
    const s = String(v ?? "");
    // Neutralise spreadsheet formulas and quote everything.
    const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
    return `"${safe.replace(/"/g, '""')}"`;
  };
  const header = ["Referentie", "Ontvangen", "Status", "Soort", "Naam", "E-mail", "Telefoon", "Postcode", "Huisnummer", "Type pand", "Start", "Diensten", "Product", "Toelichting", "Taal", "Bron"];
  const lines = rows.map((l) =>
    [
      l.ref,
      new Date(l.created_at).toLocaleString("nl-NL", { timeZone: "Europe/Amsterdam" }),
      STATUS_LABEL[l.status as LeadStatus] ?? l.status,
      l.kind,
      l.name,
      l.email,
      l.phone,
      l.postcode,
      l.house_number,
      l.property_type ? PROPERTY_LABEL[l.property_type] ?? l.property_type : "",
      l.timing ? TIMING_LABEL[l.timing] ?? l.timing : "",
      (l.services?.length ? l.services : l.service_slug ? [l.service_slug] : []).map((s) => TOPIC_LABEL[s] ?? s).join(", "),
      l.product_slug,
      l.message,
      l.locale,
      l.source_page,
    ]
      .map(cell)
      .join(";"),
  );
  const csv = "﻿" + [header.map(cell).join(";"), ...lines].join("\r\n");
  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="aanvragen-${date}.csv"`, "Cache-Control": "no-store" },
  });
}
