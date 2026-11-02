"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { Icon } from "@/components/ui/Icon";
import { deleteMedia, listMedia, updateMedia, type MediaRow } from "@/lib/admin/actions";
import { mediaUrl } from "@/lib/media";
import { UploadForm } from "./MediaPicker";
import { toast } from "./Toast";

/** Media library: grid, search, "unused" filter, upload, alt text + focal point, safe delete. */
export function MediaLibrary({ initial }: { initial: MediaRow[] }) {
  const [items, setItems] = useState(initial);
  const [query, setQuery] = useState("");
  const [unused, setUnused] = useState(false);
  const [active, setActive] = useState<MediaRow | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const reload = async () => setItems(await listMedia());
  const shown = items.filter((m) => (!unused || m.uses === 0) && (!query.trim() || `${m.alt.nl} ${m.alt.en ?? ""}`.toLowerCase().includes(query.trim().toLowerCase())));
  const missingEn = items.filter((m) => !m.alt.en).length;

  return (
    <div className="flex min-h-0 flex-1">
      <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative w-full sm:w-72">
            <span className="sr-only">Zoeken</span>
            <Icon name="search" size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-graphite" />
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Zoek op beschrijving…" className="input h-9 rounded-lg pl-9 text-[14px]" />
          </label>
          <button type="button" aria-pressed={unused} onClick={() => setUnused((u) => !u)} className="h-9 rounded-lg px-3 font-semibold text-slate shadow-[inset_0_0_0_1.5px_var(--color-line-strong)] aria-pressed:bg-ink aria-pressed:text-white aria-pressed:shadow-none">
            Ongebruikt
          </button>
          <span className="text-[12px] text-graphite">
            {items.length} foto&apos;s{missingEn ? ` · ${missingEn} zonder Engelse alt-tekst` : ""}
          </span>
          <button type="button" onClick={() => setShowUpload((v) => !v)} className="ml-auto flex h-9 items-center gap-1.5 rounded-lg bg-blue px-3.5 font-semibold text-white hover:bg-blue-deep">
            <Icon name="upload" size={15} />
            Uploaden
          </button>
        </div>
        {showUpload && (
          <UploadForm
            onFinished={() => {
              void reload();
              setShowUpload(false);
            }}
          />
        )}
        {shown.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line-strong p-10 text-center text-graphite">Geen foto&apos;s gevonden.</div>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
            {shown.map((m) => (
              <li key={m.id}>
                <button type="button" onClick={() => setActive(m)} aria-pressed={active?.id === m.id} className="group flex w-full flex-col gap-1.5 rounded-xl p-1.5 text-left transition-colors hover:bg-paper aria-pressed:bg-sky">
                  <span className="relative block aspect-[4/3] w-full overflow-hidden rounded-lg" style={{ backgroundColor: m.dominant_color }}>
                    <Image src={mediaUrl(m)} alt={m.alt.nl} fill sizes="220px" className={m.bucket === "product-images" ? "bg-white object-contain p-2" : "object-cover"} />
                    <span className={`t-mono absolute left-1.5 top-1.5 rounded px-1.5 py-0.5 text-[10px] ${m.uses ? "bg-white/90 text-ink" : "bg-sun/90 text-ink"}`}>{m.uses ? `${m.uses}× gebruikt` : "ongebruikt"}</span>
                  </span>
                  <span className="line-clamp-2 px-0.5 text-[12px] text-slate">{m.alt.nl}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {active && (
        <MediaDetail
          key={active.id}
          media={active}
          onClose={() => setActive(null)}
          onSaved={(m) => {
            setItems((cur) => cur.map((x) => (x.id === m.id ? m : x)));
            setActive(m);
          }}
          onDeleted={(id) => {
            setItems((cur) => cur.filter((x) => x.id !== id));
            setActive(null);
          }}
        />
      )}
    </div>
  );
}

function MediaDetail({ media, onClose, onSaved, onDeleted }: { media: MediaRow; onClose: () => void; onSaved: (m: MediaRow) => void; onDeleted: (id: string) => void }) {
  const [nl, setNl] = useState(media.alt.nl);
  const [en, setEn] = useState(media.alt.en ?? "");
  const [focal, setFocal] = useState({ x: media.focal_x, y: media.focal_y });
  const [pending, start] = useTransition();

  return (
    <aside className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-white xl:static xl:w-[380px] xl:flex-none xl:border-l xl:border-line" aria-label="Foto bewerken">
      <div className="flex items-center justify-between border-b border-line p-4">
        <span className="font-semibold">Foto</span>
        <button type="button" onClick={onClose} aria-label="Sluiten" className="grid size-9 place-items-center rounded-lg hover:bg-paper">
          <Icon name="close" />
        </button>
      </div>
      <div className="flex flex-col gap-4 p-4">
        {/* Click to set the focal point (what stays visible when the photo is cropped). */}
        <button
          type="button"
          className="relative block aspect-[4/3] w-full cursor-crosshair overflow-hidden rounded-lg"
          style={{ backgroundColor: media.dominant_color }}
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setFocal({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
          }}
          aria-label="Klik om het focuspunt te kiezen"
        >
          <Image src={mediaUrl(media)} alt={media.alt.nl} fill sizes="380px" className="object-contain" />
          <span className="absolute size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_2px_var(--color-blue)]" style={{ left: `${focal.x}%`, top: `${focal.y}%` }} />
        </button>
        <p className="text-[12px] text-graphite">Klik op de foto om het focuspunt te zetten: dat blijft zichtbaar als de foto wordt bijgesneden. {media.width}×{media.height}px.</p>
        <label className="flex flex-col gap-1">
          <span className="text-[13px] font-semibold">Alt-tekst (NL, verplicht)</span>
          <textarea value={nl} onChange={(e) => setNl(e.target.value)} rows={2} className="input min-h-0 text-[14px]" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[13px] font-semibold">Alt-tekst (EN)</span>
          <textarea value={en} onChange={(e) => setEn(e.target.value)} rows={2} className="input min-h-0 text-[14px]" />
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              start(async () => {
                const res = await updateMedia(media.id, { nl, en }, focal);
                if (!res.ok) return toast(res.error, "error");
                toast("Opgeslagen");
                onSaved({ ...media, alt: en.trim() ? { nl: nl.trim(), en: en.trim() } : { nl: nl.trim() }, focal_x: Math.round(focal.x), focal_y: Math.round(focal.y) });
              })
            }
            className="h-9 rounded-lg bg-blue px-4 font-semibold text-white hover:bg-blue-deep"
          >
            Opslaan
          </button>
          <button
            type="button"
            disabled={pending || media.uses > 0}
            title={media.uses > 0 ? "In gebruik: haal de foto eerst weg waar hij staat" : undefined}
            onClick={() => {
              if (!window.confirm("Deze foto definitief verwijderen?")) return;
              start(async () => {
                const res = await deleteMedia(media.id);
                if (!res.ok) return toast(res.error, "error");
                toast("Verwijderd");
                onDeleted(media.id);
              });
            }}
            className="flex h-9 items-center gap-1.5 rounded-lg px-3 font-semibold text-error hover:bg-[color-mix(in_srgb,var(--color-error-line)_8%,white)] disabled:opacity-40"
          >
            <Icon name="trash" size={15} />
            Verwijderen
          </button>
        </div>
        {media.uses > 0 && <p className="text-[12px] text-graphite">Deze foto wordt op {media.uses} plek(ken) gebruikt en kan daarom niet worden verwijderd.</p>}
      </div>
    </aside>
  );
}
