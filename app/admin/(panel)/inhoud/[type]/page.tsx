import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentList, type ListRow } from "@/components/admin/ContentList";
import { AdminHeader } from "@/components/admin/Shell";
import { Icon } from "@/components/ui/Icon";
import { requirePage } from "@/lib/admin/auth";
import { CONTENT_TYPES, isContentKey } from "@/lib/admin/content-types";
import { t } from "@/lib/i18n/config";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({ params }: PageProps<"/admin/inhoud/[type]">) {
  const { type } = await params;
  return { title: isContentKey(type) ? CONTENT_TYPES[type].label : "Inhoud" };
}

export default async function ContentIndex({ params }: PageProps<"/admin/inhoud/[type]">) {
  await requirePage("editor");
  const { type: key } = await params;
  if (!isContentKey(key)) notFound();
  const type = CONTENT_TYPES[key];
  const db = await createClient();
  const { data } = await db.from(type.table as "pages").select("*").order("sort_order").order("created_at");
  const raw = (data ?? []) as unknown as Record<string, unknown>[];

  // A little context per row, so lists are scannable.
  const services = key === "aanbod" || key === "vragen" ? ((await db.from("services").select("id, title")).data ?? []) : [];
  const svc = (id: unknown) => t(services.find((s) => s.id === id)?.title, "nl") as string | undefined;
  const meta = (r: Record<string, unknown>) => {
    switch (key) {
      case "aanbod":
        return [svc(r.service_id), r.slug].filter(Boolean).join(" · ");
      case "reviews":
        return [r.place, `${r.rating}★`, r.consent ? "toestemming" : "toestemming nog bevestigen"].filter(Boolean).join(" · ");
      case "vragen":
        return svc(r.service_id) ?? "Algemeen";
      case "merken":
        return r.kind === "client" ? "Klant" : "Merk dat we installeren";
      default:
        return r.slug ? `/${r.slug}` : "";
    }
  };

  const rows: ListRow[] = raw.map((r) => {
    const title = r[type.titleKey];
    return {
      id: String(r.id),
      title: (typeof title === "object" ? t(title, "nl") : String(title ?? "")) || "(zonder titel)",
      meta: String(meta(r) ?? ""),
      status: r.status as ListRow["status"],
      publicHref: type.publicPath ? type.publicPath(r) : null,
    };
  });

  return (
    <>
      <AdminHeader
        crumbs={[{ label: "Website" }, { label: type.label }]}
        title={type.label}
        actions={
          <Link href={`/admin/inhoud/${key}/nieuw`} className="flex h-9 items-center gap-1.5 rounded-lg bg-blue px-3.5 font-semibold text-white hover:bg-blue-deep">
            <Icon name="plus" size={15} />
            Nieuw {type.singular}
          </Link>
        }
      />
      <ContentList typeKey={key} rows={rows} sortable={type.sortable} singular={type.label.toLowerCase()} />
    </>
  );
}
