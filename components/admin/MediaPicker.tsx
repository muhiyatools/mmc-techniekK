"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import { Icon } from "@/components/ui/Icon";
import { listMedia, uploadMedia, type MediaRow } from "@/lib/admin/actions";
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";
import { mediaUrl } from "@/lib/media";
import { toast } from "./Toast";

export function Thumb({ media, size = 96, className = "" }: { media: Pick<MediaRow, "bucket" | "path" | "alt" | "dominant_color">; size?: number; className?: string }) {
  return (
    <span className={`relative block overflow-hidden rounded-lg ${className}`} style={{ width: size, height: size, backgroundColor: media.dominant_color }}>
      <Image src={mediaUrl(media)} alt={media.alt.nl} fill sizes={`${size}px`} className={media.bucket === "product-images" ? "bg-white object-contain p-1" : "object-cover"} />
    </span>
  );
}

/** Upload form: file + required alt text. Shared by the picker and the media library. */
export function UploadForm({ onUploaded }: { onUploaded: (id: string) => void }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => () => void (preview && URL.revokeObjectURL(preview)), [preview]);

  return (
    <form
      ref={formRef}
      className="flex flex-col gap-3 rounded-xl border border-line bg-paper p-4"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setError(null);
        start(async () => {
          const res = await uploadMedia(fd);
          if (!res.ok) return setError(res.error);
          toast(res.data?.duplicate ? "Deze foto stond er al; die wordt gebruikt." : "Foto geüpload");
          formRef.current?.reset();
          setPreview(null);
          onUploaded(res.data!.id);
        });
      }}
    >
      <div className="flex items-start gap-3">
        <label className="grid size-20 flex-none cursor-pointer place-items-center overflow-hidden rounded-lg border border-dashed border-line-strong bg-white text-graphite hover:border-ink">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="size-full object-cover" />
          ) : (
            <Icon name="upload" size={20} />
          )}
          <input
            name="file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            required
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              setPreview(f ? URL.createObjectURL(f) : null);
            }}
          />
          <span className="sr-only">Kies een foto</span>
        </label>
        <div className="flex flex-1 flex-col gap-2">
          <label className="flex flex-col gap-1">
            <span className="text-[13px] font-semibold">Wat staat er op de foto? (NL, verplicht)</span>
            <input name="alt_nl" required className="input h-10 text-[14px]" placeholder="Bijv. zonnepanelen op een plat dak in Woerden" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[13px] font-semibold">Engels (optioneel)</span>
            <input name="alt_en" className="input h-10 text-[14px]" />
          </label>
        </div>
      </div>
      {error && (
        <p role="alert" className="field-error">
          <Icon name="alert" size={16} className="mt-px" />
          {error}
        </p>
      )}
      <p className="text-[12px] text-graphite">JPG, PNG, WebP of AVIF, maximaal 10 MB. Alleen eigen foto's, geen stockfoto's. Locatiegegevens worden verwijderd.</p>
      <button type="submit" disabled={pending} className="btn btn-primary btn-sm btn-plain self-start">
        {pending ? "Uploaden…" : "Uploaden"}
      </button>
    </form>
  );
}

/** Modal to choose one or more photos from the library, or upload a new one. */
export function MediaPicker({ open, multiple, selected, onClose, onPick }: { open: boolean; multiple?: boolean; selected: string[]; onClose: () => void; onPick: (ids: string[], rows: MediaRow[]) => void }) {
  const [items, setItems] = useState<MediaRow[] | null>(null);
  const [picked, setPicked] = useState<string[]>(selected);
  const [query, setQuery] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const ref = useFocusTrap<HTMLDivElement>(open, onClose);

  const load = () => listMedia().then(setItems);
  useEffect(() => {
    if (!open) return;
    let live = true;
    listMedia().then((rows) => live && setItems(rows));
    return () => {
      live = false;
    };
  }, [open]);

  if (!open) return null;
  const shown = (items ?? []).filter((m) => !query.trim() || `${m.alt.nl} ${m.alt.en ?? ""} ${m.path}`.toLowerCase().includes(query.trim().toLowerCase()));
  const toggle = (id: string) => setPicked((p) => (multiple ? (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]) : [id]));

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-0 sm:p-6" role="dialog" aria-modal="true" aria-label="Foto kiezen">
      <button type="button" aria-label="Sluiten" className="absolute inset-0 bg-ink/50" onClick={onClose} />
      <div ref={ref} tabIndex={-1} className="fade-up relative flex h-full w-full max-w-[960px] flex-col overflow-hidden bg-white outline-none sm:h-[80vh] sm:rounded-2xl">
        <div className="flex items-center gap-3 border-b border-line p-4">
          <h2 className="flex-1 text-[18px] font-bold">{multiple ? "Foto's kiezen" : "Foto kiezen"}</h2>
          <button type="button" onClick={() => setShowUpload((v) => !v)} className="flex h-9 items-center gap-1.5 rounded-lg px-3 font-semibold shadow-[inset_0_0_0_1.5px_var(--color-line-strong)] hover:bg-paper">
            <Icon name="upload" size={15} />
            Uploaden
          </button>
          <button type="button" onClick={onClose} aria-label="Sluiten" className="grid size-9 place-items-center rounded-lg hover:bg-paper" data-autofocus>
            <Icon name="close" />
          </button>
        </div>
        <div className="flex flex-col gap-3 overflow-y-auto p-4">
          {showUpload && (
            <UploadForm
              onUploaded={async (id) => {
                await load();
                setShowUpload(false);
                toggle(id);
              }}
            />
          )}
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Zoek op beschrijving…" className="input h-9 text-[14px]" aria-label="Zoek foto's" />
          {items === null ? (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {Array.from({ length: 10 }, (_, i) => (
                <span key={i} className="aspect-square animate-pulse rounded-lg bg-paper" />
              ))}
            </div>
          ) : (
            <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {shown.map((m) => {
                const on = picked.includes(m.id);
                return (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => toggle(m.id)}
                      aria-pressed={on}
                      title={m.alt.nl}
                      className={`relative block aspect-square w-full overflow-hidden rounded-lg transition-shadow ${on ? "shadow-[0_0_0_3px_var(--color-blue)]" : "hover:shadow-[0_0_0_2px_var(--color-line-strong)]"}`}
                      style={{ backgroundColor: m.dominant_color }}
                    >
                      <Image src={mediaUrl(m)} alt={m.alt.nl} fill sizes="180px" className={m.bucket === "product-images" ? "bg-white object-contain p-2" : "object-cover"} />
                      {on && (
                        <span className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-blue text-white">
                          <Icon name="check" size={14} strokeWidth={3} />
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-line p-4">
          <span className="text-graphite">{picked.length ? `${picked.length} gekozen` : "Niets gekozen"}</span>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="h-10 rounded-lg px-4 font-semibold hover:bg-paper">
              Annuleren
            </button>
            <button type="button" onClick={() => onPick(picked, (items ?? []).filter((m) => picked.includes(m.id)))} className="h-10 rounded-lg bg-blue px-4 font-semibold text-white hover:bg-blue-deep">
              Gebruiken
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
