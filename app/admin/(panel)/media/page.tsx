import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { AdminHeader } from "@/components/admin/Shell";
import { listMedia } from "@/lib/admin/actions";
import { requirePage } from "@/lib/admin/auth";

export const metadata = { title: "Media" };

export default async function MediaPage() {
  await requirePage("editor");
  const media = await listMedia();
  return (
    <>
      <AdminHeader crumbs={[{ label: "Website" }, { label: "Media" }]} title="Media" description="Eigen foto's van projecten en producten. Elke foto heeft een beschrijving (alt-tekst) nodig." />
      <MediaLibrary initial={media} />
    </>
  );
}
