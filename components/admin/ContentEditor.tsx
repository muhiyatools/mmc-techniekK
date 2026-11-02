"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Icon } from "@/components/ui/Icon";
import type { MediaRow } from "@/lib/admin/actions";
import { deleteContent, saveContent } from "@/lib/admin/content-actions";
import type { FieldDef } from "@/lib/admin/content-types";
import { slugify } from "@/lib/slugify";
import { MediaPicker, Thumb } from "./MediaPicker";
import { toast } from "./Toast";

type L = { nl?: string; en?: string };
type Data = Record<string, unknown>;
export type Option = { value: string; label: string };
export type MediaLite = Pick<MediaRow, "id" | "bucket" | "path" | "alt" | "dominant_color">;

const cls = {
  label: "text-[13px] font-semibold text-ink",
  hint: "text-[12px] text-graphite",
  input: "input h-10 text-[14px]",
  area: "input min-h-0 text-[14px] leading-relaxed",
};

/** Generic form for one content row, driven by the field config. */
export function ContentEditor({
  typeKey,
  typeLabel,
  singular,
  id,
  fields,
  initial,
  options,
  media,
  publicPath,
}: {
  typeKey: string;
  typeLabel: string;
  singular: string;
  id: string | null;
  fields: FieldDef[];
  initial: Data;
  options: Record<string, Option[]>;
  media: Record<string, MediaLite>;
  publicPath: string | null;
}) {
  const router = useRouter();
  const [data, setData] = useState<Data>(initial);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<{ text: string; field?: string } | null>(null);
  const [mediaCache, setMediaCache] = useState(media);
  const [pending, start] = useTransition();
  const [slugTouched, setSlugTouched] = useState(!!id);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const set = (key: string, value: unknown) => {
    setData((d) => {
      const next = { ...d, [key]: value };
      // Keep the URL in step with the title until someone edits it by hand.
      const slugField = fields.find((f) => f.kind === "slug" && f.from === key);
      if (slugField && !slugTouched) {
        const v = value as L | string;
        next[slugField.key] = slugify(typeof v === "string" ? v : v?.nl ?? "");
      }
      return next;
    });
    setDirty(true);
  };

  const save = (andView = false) =>
    start(async () => {
      setError(null);
      const res = await saveContent(typeKey, id, data);
      if (!res.ok) {
        setError({ text: res.error, field: res.field });
        toast(res.error, "error");
        if (res.field) document.getElementById(`f-${res.field}`)?.scrollIntoView({ block: "center", behavior: "smooth" });
        return;
      }
      setDirty(false);
      toast("Opgeslagen");
      if (andView && publicPath) window.open(`/api/draft?path=${encodeURIComponent(publicPath)}`, "_blank", "noopener");
      if (!id) router.replace(`/admin/inhoud/${typeKey}/${res.id}`);
      else router.refresh();
    });

  const remove = () => {
    if (!id || !window.confirm(`Deze ${singular} verwijderen? Dit kan niet ongedaan worden. Kies anders "Concept" om hem te verbergen.`)) return;
    start(async () => {
      const res = await deleteContent(typeKey, id);
      if (!res.ok) return toast(res.error, "error");
      setDirty(false);
      toast("Verwijderd");
      router.replace(`/admin/inhoud/${typeKey}`);
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      className="flex flex-col"
    >
      {/* Sticky action bar */}
      <div className="sticky top-14 z-20 flex flex-wrap items-center gap-2 border-b border-line bg-white/95 px-4 py-2.5 backdrop-blur sm:px-6 lg:top-0">
        <Link href={`/admin/inhoud/${typeKey}`} className="flex h-9 items-center gap-1.5 rounded-lg px-2 font-semibold text-slate hover:bg-paper">
          <Icon name="arrowLeft" size={15} />
          {typeLabel}
        </Link>
        <span className="text-[12px] text-graphite">{dirty ? "Niet opgeslagen wijzigingen" : id ? "Alles opgeslagen" : ""}</span>
        <div className="ml-auto flex gap-2">
          {publicPath && id && (
            <button type="button" onClick={() => save(true)} disabled={pending} className="flex h-9 items-center gap-1.5 rounded-lg px-3 font-semibold shadow-[inset_0_0_0_1.5px_var(--color-line-strong)] hover:bg-paper">
              <Icon name="eye" size={15} />
              <span className="hidden sm:inline">Opslaan en bekijken</span>
            </button>
          )}
          <button type="submit" disabled={pending} className="h-9 rounded-lg bg-blue px-4 font-semibold text-white hover:bg-blue-deep disabled:opacity-60">
            {pending ? "Bezig…" : "Opslaan"}
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="field-error mx-4 mt-4 rounded-lg bg-[color-mix(in_srgb,var(--color-error-line)_8%,white)] p-3 sm:mx-6">
          <Icon name="alert" size={16} className="mt-px" />
          {error.text}
        </p>
      )}

      <div className="flex max-w-[1000px] flex-col gap-6 p-4 sm:p-6">
        {fields.map((f) => (
          <div key={f.key} id={`f-${f.key}`} className={`flex flex-col gap-1.5 ${error?.field === f.key ? "rounded-lg outline outline-2 outline-offset-4 outline-error-line" : ""}`}>
            <FieldInput
              f={f}
              value={data[f.key]}
              onChange={(v) => {
                if (f.kind === "slug") setSlugTouched(true);
                set(f.key, v);
              }}
              options={options}
              media={mediaCache}
              addMedia={(rows) => setMediaCache((c) => ({ ...c, ...Object.fromEntries(rows.map((r) => [r.id, r])) }))}
            />
          </div>
        ))}

        {id && (
          <div className="mt-6 flex items-center justify-between gap-4 border-t border-line pt-6">
            <span className="text-graphite">Verwijderen kan niet ongedaan worden. Op concept zetten verbergt het van de site.</span>
            <button type="button" onClick={remove} className="flex h-9 flex-none items-center gap-1.5 rounded-lg px-3 font-semibold text-error hover:bg-[color-mix(in_srgb,var(--color-error-line)_8%,white)]">
              <Icon name="trash" size={15} />
              Verwijderen
            </button>
          </div>
        )}
      </div>
    </form>
  );
}

function Label({ f, htmlFor }: { f: FieldDef; htmlFor?: string }) {
  const required = "required" in f && f.required;
  return (
    <label htmlFor={htmlFor} className={cls.label}>
      {f.label}
      {required && <span className="text-error"> *</span>}
    </label>
  );
}

function Hint({ f }: { f: FieldDef }) {
  const hint = "hint" in f ? f.hint : undefined;
  return hint ? <p className={cls.hint}>{hint}</p> : null;
}

export function FieldInput({
  f,
  value,
  onChange,
  options,
  media,
  addMedia,
}: {
  f: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
  options: Record<string, Option[]>;
  media: Record<string, MediaLite>;
  addMedia: (rows: MediaLite[]) => void;
}) {
  const id = `in-${f.key}`;
  const [picker, setPicker] = useState(false);

  switch (f.kind) {
    case "i18n": {
      const v = (value as L) ?? {};
      const Tag = f.multiline ? "textarea" : "input";
      return (
        <>
          <Label f={f} htmlFor={`${id}-nl`} />
          <div className="grid gap-2 md:grid-cols-2">
            {(["nl", "en"] as const).map((lang) => (
              <div key={lang} className="relative">
                <span className="t-mono pointer-events-none absolute right-2.5 top-2.5 text-[10px] text-graphite">{lang}</span>
                <Tag
                  id={`${id}-${lang}`}
                  aria-label={`${f.label} (${lang === "nl" ? "Nederlands" : "Engels"})`}
                  value={v[lang] ?? ""}
                  onChange={(e) => onChange({ ...v, [lang]: e.target.value })}
                  rows={f.markdown ? 10 : f.multiline ? 3 : undefined}
                  className={`${f.multiline ? cls.area : cls.input} pr-9`}
                  placeholder={lang === "en" ? "English (optional; Dutch is shown when empty)" : undefined}
                />
              </div>
            ))}
          </div>
          {f.markdown && <p className={cls.hint}>Witregel = nieuwe alinea. ## Kop, - lijstje, **vet**, [link](https://…).</p>}
          <Hint f={f} />
        </>
      );
    }
    case "text":
      return (
        <>
          <Label f={f} htmlFor={id} />
          <input id={id} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={f.placeholder} className={cls.input} />
          <Hint f={f} />
        </>
      );
    case "slug":
      return (
        <>
          <Label f={f} htmlFor={id} />
          <div className="flex items-center rounded-[12px] border-[1.5px] border-line-strong focus-within:border-blue focus-within:shadow-[0_0_0_4px_var(--color-sky)]">
            <span className="pl-3 text-graphite">/</span>
            <input id={id} value={(value as string) ?? ""} onChange={(e) => onChange(slugify(e.target.value))} className="h-10 flex-1 rounded-[12px] bg-transparent px-1 text-[14px] outline-none" />
          </div>
          <p className={cls.hint}>Alleen kleine letters, cijfers en streepjes. Wijzigen maakt oude links ongeldig.</p>
        </>
      );
    case "number":
      return (
        <>
          <Label f={f} htmlFor={id} />
          <input id={id} type="number" inputMode="numeric" min={f.min} max={f.max} value={value === null || value === undefined ? "" : String(value)} onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))} className={`${cls.input} max-w-[220px]`} />
          <Hint f={f} />
        </>
      );
    case "boolean":
      return (
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" checked={value === true} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 size-5 accent-[var(--color-blue)]" />
          <span className="flex flex-col">
            <span className={cls.label}>{f.label}</span>
            <Hint f={f} />
          </span>
        </label>
      );
    case "select":
      return (
        <>
          <Label f={f} htmlFor={id} />
          <select id={id} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} className={`${cls.input} max-w-[360px]`}>
            {f.nullable && <option value="">—</option>}
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </>
      );
    case "relation": {
      const opts = options[f.source] ?? [];
      return (
        <>
          <Label f={f} htmlFor={id} />
          <select id={id} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} className={`${cls.input} max-w-[360px]`}>
            <option value="">{f.nullable ? "Algemeen (geen dienst)" : "Kies…"}</option>
            {opts.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </>
      );
    }
    case "relationMulti": {
      const opts = options[f.source] ?? [];
      const v = (value as string[]) ?? [];
      return (
        <fieldset className="flex flex-col gap-2">
          <legend className={`${cls.label} mb-2`}>{f.label}</legend>
          <div className="flex flex-wrap gap-1.5">
            {opts.map((o) => (
              <button key={o.value} type="button" aria-pressed={v.includes(o.value)} onClick={() => onChange(v.includes(o.value) ? v.filter((x) => x !== o.value) : [...v, o.value])} className="chip min-h-9 px-3.5 text-[14px]">
                {o.label}
              </button>
            ))}
          </div>
        </fieldset>
      );
    }
    case "i18nList": {
      const v = (value as { nl?: string[]; en?: string[] }) ?? {};
      return (
        <>
          <Label f={f} htmlFor={`${id}-nl`} />
          <div className="grid gap-2 md:grid-cols-2">
            {(["nl", "en"] as const).map((lang) => (
              <div key={lang} className="relative">
                <span className="t-mono pointer-events-none absolute right-2.5 top-2.5 text-[10px] text-graphite">{lang}</span>
                <textarea
                  id={`${id}-${lang}`}
                  aria-label={`${f.label} (${lang})`}
                  rows={5}
                  value={(v[lang] ?? []).join("\n")}
                  onChange={(e) => onChange({ ...v, [lang]: e.target.value.split("\n") })}
                  className={`${cls.area} pr-9`}
                />
              </div>
            ))}
          </div>
          <Hint f={f} />
        </>
      );
    }
    case "variants": {
      const v = (value as L[]) ?? [];
      return (
        <fieldset className="flex flex-col gap-2">
          <legend className={`${cls.label} mb-1`}>{f.label}</legend>
          <Hint f={f} />
          {v.map((row, i) => (
            <div key={i} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_36px] gap-2">
              <input aria-label={`Uitvoering ${i + 1} (nl)`} value={row.nl ?? ""} onChange={(e) => onChange(v.map((r, j) => (j === i ? { ...r, nl: e.target.value } : r)))} className={cls.input} placeholder="3,5 kW · 12.000 BTU" />
              <input aria-label={`Uitvoering ${i + 1} (en)`} value={row.en ?? ""} onChange={(e) => onChange(v.map((r, j) => (j === i ? { ...r, en: e.target.value } : r)))} className={cls.input} placeholder="English" />
              <button type="button" aria-label="Verwijderen" onClick={() => onChange(v.filter((_, j) => j !== i))} className="grid size-10 place-items-center rounded-lg text-graphite hover:bg-paper hover:text-error">
                <Icon name="close" size={16} />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => onChange([...v, { nl: "", en: "" }])} className="flex h-9 items-center gap-1.5 self-start rounded-lg px-3 font-semibold text-blue hover:bg-sky">
            <Icon name="plus" size={15} />
            Uitvoering toevoegen
          </button>
        </fieldset>
      );
    }
    case "steps": {
      const v = (value as { title: L; text: L }[]) ?? [];
      const upd = (i: number, k: "title" | "text", lang: "nl" | "en", text: string) => onChange(v.map((s, j) => (j === i ? { ...s, [k]: { ...s[k], [lang]: text } } : s)));
      return (
        <fieldset className="flex flex-col gap-3">
          <legend className={`${cls.label} mb-1`}>{f.label}</legend>
          {v.map((s, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-xl border border-line p-3">
              <div className="flex items-center justify-between">
                <span className="t-mono text-graphite">Stap {i + 1}</span>
                <span className="flex gap-1">
                  <button type="button" disabled={i === 0} aria-label="Omhoog" onClick={() => onChange(v.map((x, j) => (j === i - 1 ? v[i] : j === i ? v[i - 1] : x)))} className="grid size-8 place-items-center rounded-lg text-graphite hover:bg-paper disabled:opacity-30">
                    <Icon name="chevronDown" size={14} className="rotate-180" />
                  </button>
                  <button type="button" disabled={i === v.length - 1} aria-label="Omlaag" onClick={() => onChange(v.map((x, j) => (j === i + 1 ? v[i] : j === i ? v[i + 1] : x)))} className="grid size-8 place-items-center rounded-lg text-graphite hover:bg-paper disabled:opacity-30">
                    <Icon name="chevronDown" size={14} />
                  </button>
                  <button type="button" aria-label="Verwijderen" onClick={() => onChange(v.filter((_, j) => j !== i))} className="grid size-8 place-items-center rounded-lg text-graphite hover:bg-paper hover:text-error">
                    <Icon name="close" size={14} />
                  </button>
                </span>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <input aria-label={`Stap ${i + 1} titel (nl)`} value={s.title?.nl ?? ""} onChange={(e) => upd(i, "title", "nl", e.target.value)} placeholder="Titel" className={cls.input} />
                <input aria-label={`Stap ${i + 1} titel (en)`} value={s.title?.en ?? ""} onChange={(e) => upd(i, "title", "en", e.target.value)} placeholder="Title (English)" className={cls.input} />
                <textarea aria-label={`Stap ${i + 1} tekst (nl)`} rows={2} value={s.text?.nl ?? ""} onChange={(e) => upd(i, "text", "nl", e.target.value)} placeholder="Wat gebeurt er in deze stap?" className={cls.area} />
                <textarea aria-label={`Stap ${i + 1} tekst (en)`} rows={2} value={s.text?.en ?? ""} onChange={(e) => upd(i, "text", "en", e.target.value)} placeholder="English" className={cls.area} />
              </div>
            </div>
          ))}
          <button type="button" onClick={() => onChange([...v, { title: { nl: "" }, text: { nl: "" } }])} className="flex h-9 items-center gap-1.5 self-start rounded-lg px-3 font-semibold text-blue hover:bg-sky">
            <Icon name="plus" size={15} />
            Stap toevoegen
          </button>
        </fieldset>
      );
    }
    case "media": {
      const m = value ? media[value as string] : null;
      return (
        <>
          <Label f={f} />
          <div className="flex items-center gap-3">
            {m ? <Thumb media={m} size={96} /> : <span className="grid size-24 place-items-center rounded-lg border border-dashed border-line-strong text-graphite"><Icon name="image" size={22} /></span>}
            <div className="flex flex-col items-start gap-1.5">
              {m && <span className="max-w-[360px] text-[13px] text-slate">{m.alt.nl}</span>}
              <span className="flex gap-2">
                <button type="button" onClick={() => setPicker(true)} className="h-9 rounded-lg px-3 font-semibold shadow-[inset_0_0_0_1.5px_var(--color-line-strong)] hover:bg-paper">
                  {m ? "Andere foto" : "Foto kiezen"}
                </button>
                {m && (
                  <button type="button" onClick={() => onChange(null)} className="h-9 rounded-lg px-3 font-semibold text-graphite hover:bg-paper">
                    Weghalen
                  </button>
                )}
              </span>
            </div>
          </div>
          <Hint f={f} />
          <MediaPicker
            key={(value as string) ?? "geen-foto"}
            open={picker}
            selected={value ? [value as string] : []}
            onClose={() => setPicker(false)}
            onPick={(ids, rows) => {
              addMedia(rows);
              onChange(ids[0] ?? null);
              setPicker(false);
            }}
          />
        </>
      );
    }
    case "gallery": {
      const v = (value as string[]) ?? [];
      return (
        <>
          <Label f={f} />
          <ul className="flex flex-wrap gap-2">
            {v.map((mid, i) =>
              media[mid] ? (
                <li key={mid} className="group relative">
                  <Thumb media={media[mid]} size={88} />
                  <span className="absolute inset-x-1 bottom-1 flex justify-between opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
                    <button type="button" aria-label="Naar links" disabled={i === 0} onClick={() => onChange(v.map((x, j) => (j === i - 1 ? v[i] : j === i ? v[i - 1] : x)))} className="grid size-6 place-items-center rounded bg-white/90 disabled:opacity-30">
                      <Icon name="arrowLeft" size={12} />
                    </button>
                    <button type="button" aria-label="Weghalen" onClick={() => onChange(v.filter((x) => x !== mid))} className="grid size-6 place-items-center rounded bg-white/90 text-error">
                      <Icon name="close" size={12} />
                    </button>
                  </span>
                </li>
              ) : null,
            )}
            <li>
              <button type="button" onClick={() => setPicker(true)} className="grid size-[88px] place-items-center rounded-lg border border-dashed border-line-strong text-graphite hover:border-ink hover:text-ink" aria-label="Foto's toevoegen">
                <Icon name="plus" size={20} />
              </button>
            </li>
          </ul>
          <MediaPicker
            key={v.join("|") || "geen-foto"}
            open={picker}
            multiple
            selected={v}
            onClose={() => setPicker(false)}
            onPick={(ids, rows) => {
              addMedia(rows);
              onChange(ids);
              setPicker(false);
            }}
          />
        </>
      );
    }
  }
}
