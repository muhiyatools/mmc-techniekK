"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { createUploadTarget, finalizeMediaUpload, listMedia, type MediaRow } from "@/lib/admin/actions";
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";
import { mediaUrl } from "@/lib/media";
import { prepareImageForUpload } from "@/lib/prepare-image";
import { createClient } from "@/lib/supabase/browser";
import { toast } from "./Toast";

const ACCEPT = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_BYTES = 10 * 1024 * 1024;

export function Thumb({ media, size = 96, className = "" }: { media: Pick<MediaRow, "bucket" | "path" | "alt" | "dominant_color">; size?: number; className?: string }) {
  return (
    <span className={`relative block overflow-hidden rounded-lg ${className}`} style={{ width: size, height: size, backgroundColor: media.dominant_color }}>
      <Image src={mediaUrl(media)} alt={media.alt.nl} fill sizes={`${size}px`} className={media.bucket === "product-images" ? "bg-white object-contain p-1" : "object-cover"} />
    </span>
  );
}

type Status = "ready" | "busy" | "done" | "error";
type QueueItem = { key: string; file: File; preview: string; altNl: string; altEn: string; status: Status; error?: string };

/**
 * Upload form: drop as many photos as you like, describe each one, upload them one by
 * one. The file itself goes straight to Storage with a signed URL so its size never
 * matters to the Next.js request limit; the server then re-encodes it, strips EXIF and
 * records the row.
 */
export function UploadForm({ onFinished }: { onFinished?: (ids: string[]) => void }) {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemsRef = useRef<QueueItem[]>([]);

  // Object URLs live as long as the component does; release the last batch on unmount.
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);
  useEffect(() => () => itemsRef.current.forEach((item) => URL.revokeObjectURL(item.preview)), []);

  const patch = (key: string, next: Partial<QueueItem>) => setItems((cur) => cur.map((item) => (item.key === key ? { ...item, ...next } : item)));

  const add = (files: FileList | File[]) => {
    const picked: QueueItem[] = [];
    const rejected: string[] = [];
    for (const file of Array.from(files)) {
      if (!ACCEPT.includes(file.type)) {
        rejected.push(file.name);
        continue;
      }
      picked.push({ key: crypto.randomUUID(), file, preview: URL.createObjectURL(file), altNl: describe(file.name), altEn: "", status: "ready" });
    }
    if (picked.length) {
      setError(null);
      setItems((cur) => [...cur, ...picked]);
    }
    if (rejected.length) setError(`${rejected.length === 1 ? `"${rejected[0]}" is` : `${rejected.length} bestanden zijn`} geen JPG, PNG, WebP of AVIF.`);
  };

  const remove = (key: string) => {
    setItems((cur) => {
      const gone = cur.find((item) => item.key === key);
      if (gone) URL.revokeObjectURL(gone.preview);
      return cur.filter((item) => item.key !== key);
    });
  };

  const clear = () => {
    itemsRef.current.forEach((item) => URL.revokeObjectURL(item.preview));
    setItems([]);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const upload = async () => {
    if (busy || !items.length) return;
    const missing = items.find((item) => item.status !== "done" && !item.altNl.trim());
    if (missing) {
      setError("Elke foto heeft een beschrijving (alt-tekst) nodig. Die staat ook op de website voor slechtzienden en Google.");
      return;
    }
    setError(null);
    setBusy(true);
    setProgress({ done: 0, total: items.length });
    const ids: string[] = [];
    let duplicates = 0;
    let failed = 0;

    for (const item of items) {
      patch(item.key, { status: "busy", error: undefined });
      try {
        const file = await prepareImageForUpload(item.file);
        if (file.size > MAX_BYTES) throw new Error("Het bestand is groter dan 10 MB.");
        const target = await createUploadTarget(file.name);
        if (!target.ok) throw new Error(target.error);
        const { path, token, proof } = target.data!;
        const up = await createClient()
          .storage.from("media")
          .uploadToSignedUrl(path, token, file, { contentType: file.type || undefined, cacheControl: "31536000" });
        if (up.error) throw new Error(friendly(up.error.message));
        const done = await finalizeMediaUpload({ path, proof, altNl: item.altNl, altEn: item.altEn });
        if (!done.ok) throw new Error(done.error);
        if (done.data!.duplicate) duplicates += 1;
        ids.push(done.data!.id);
        patch(item.key, { status: "done" });
        setItems((cur) => cur.filter((current) => current.key !== item.key));
        URL.revokeObjectURL(item.preview);
      } catch (e) {
        failed += 1;
        patch(item.key, { status: "error", error: e instanceof Error ? e.message : "Uploaden mislukt." });
      } finally {
        setProgress((p) => ({ ...p, done: p.done + 1 }));
      }
    }

    setBusy(false);
    if (ids.length) {
      const message = `${ids.length} ${ids.length === 1 ? "foto" : "foto's"} geüpload${duplicates ? ` · ${duplicates} stond${duplicates === 1 ? "" : "en"} er al` : ""}`;
      toast(failed ? `${message} · ${failed} mislukt` : message, failed ? "error" : "ok");
      onFinished?.(ids);
    } else if (failed) {
      setError("Geen enkele foto is geüpload. Los de melding hierboven op en probeer het opnieuw.");
    }
  };


  return (
    <div className="flex flex-col gap-3 rounded-xl border border-line bg-paper p-4">
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (e.dataTransfer.files.length) add(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed bg-white px-4 py-6 text-center transition-colors ${dragging ? "border-blue bg-sky" : "border-line-strong hover:border-ink"}`}
      >
        <Icon name="upload" size={20} className="text-graphite" />
        <span className="text-[14px] font-semibold">Sleep foto&apos;s hierheen of klik om te kiezen</span>
        <span className="text-[12px] text-graphite">JPG, PNG, WebP of AVIF · maximaal 10 MB per foto · meerdere tegelijk mag</span>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="sr-only"
          onChange={(e) => {
            if (e.currentTarget.files?.length) add(e.currentTarget.files);
            e.currentTarget.value = "";
          }}
        />
      </label>

      {items.length > 0 && (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li key={item.key} className="flex items-start gap-3 rounded-lg border border-line bg-white p-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.preview} alt="" className="size-14 flex-none rounded-md bg-paper object-cover" />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="min-w-0 flex-1 truncate text-[12px] text-graphite">
                    {item.file.name} · {formatSize(item.file.size)}
                  </span>
                  {item.status === "busy" && <span className="t-mono text-[10px] uppercase text-blue-deep">bezig</span>}
                  {item.status === "error" && <span className="t-mono text-[10px] uppercase text-error">mislukt</span>}
                  <button type="button" onClick={() => remove(item.key)} disabled={busy} aria-label={`${item.file.name} weghalen`} className="grid size-7 flex-none place-items-center rounded-md text-graphite hover:bg-paper hover:text-ink disabled:opacity-40">
                    <Icon name="close" size={14} />
                  </button>
                </div>
                <input
                  value={item.altNl}
                  onChange={(e) => patch(item.key, { altNl: e.target.value })}
                  disabled={busy}
                  required
                  placeholder="Wat staat er op de foto? (verplicht)"
                  aria-label={`Beschrijving (NL) voor ${item.file.name}`}
                  className="input h-9 text-[13px]"
                />
                <input
                  value={item.altEn}
                  onChange={(e) => patch(item.key, { altEn: e.target.value })}
                  disabled={busy}
                  placeholder="Engels (optioneel)"
                  aria-label={`Beschrijving (EN) voor ${item.file.name}`}
                  className="input h-9 text-[13px]"
                />
                {item.error && (
                  <p role="alert" className="field-error">
                    <Icon name="alert" size={15} className="mt-px" />
                    {item.error}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p role="alert" className="field-error">
          <Icon name="alert" size={16} className="mt-px" />
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={upload} disabled={busy || !items.length} className="btn btn-primary btn-sm btn-plain">
          {busy ? `Uploaden… ${progress.done}/${progress.total}` : items.length > 1 ? `${items.length} foto's uploaden` : "Uploaden"}
        </button>
        {items.length > 0 && (
          <button type="button" onClick={clear} disabled={busy} className="flex h-9 items-center rounded-lg px-3 font-semibold text-graphite hover:bg-white disabled:opacity-40">
            Lijst leegmaken
          </button>
        )}
        <span className="text-[12px] text-graphite">Foto&apos;s worden verkleind en locatiegegevens worden verwijderd.</span>
      </div>
    </div>
  );
}

/** "msz-hr50vfk-cb2096.png" → "Msz hr50vfk", a starting point the editor can correct. */
function describe(name: string) {
  const text = name
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}

function formatSize(bytes: number) {
  return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} kB`;
}

function friendly(message: string) {
  if (/too large|maximum allowed size|exceeded/i.test(message)) return "Het bestand is groter dan 10 MB.";
  if (/mime|content.?type/i.test(message)) return "Alleen JPG, PNG, WebP of AVIF.";
  return message;
}

/** Modal to choose one or more photos from the library, or upload new ones. */
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
              onFinished={async (ids) => {
                await load();
                setShowUpload(false);
                setPicked((cur) => (multiple ? Array.from(new Set([...cur, ...ids])) : ids.slice(-1)));
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
