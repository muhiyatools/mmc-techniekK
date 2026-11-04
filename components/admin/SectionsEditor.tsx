"use client";

import { useState, useTransition } from "react";
import { saveHomeSection, saveSetting } from "@/lib/admin/actions";
import type { FieldDef } from "@/lib/admin/content-types";
import { FieldInput, type MediaLite } from "./ContentEditor";
import { toast } from "./Toast";

/** `self`: the stored value is the single field itself (hours, certifications), not an object of fields. */
export type SectionDef = { key: string; title: string; description?: string; fields: FieldDef[]; self?: boolean };

/**
 * Edits keyed JSON documents (home_sections or site_settings), one card per key,
 * each saved on its own.
 */
export function SectionsEditor({ target, sections, initial, media }: { target: "home" | "settings"; sections: SectionDef[]; initial: Record<string, unknown>; media: Record<string, MediaLite> }) {
  const [values, setValues] = useState(initial);
  const [dirty, setDirty] = useState<Record<string, boolean>>({});
  const [mediaCache, setMediaCache] = useState(media);
  const [pending, start] = useTransition();

  const save = (key: string) =>
    start(async () => {
      const res = target === "home" ? await saveHomeSection(key, values[key]) : await saveSetting(key, values[key]);
      if (!res.ok) return toast(res.error, "error");
      setDirty((d) => ({ ...d, [key]: false }));
      toast("Opgeslagen");
    });

  return (
    <div className="flex max-w-[1000px] flex-col gap-5 p-4 sm:p-6">
      {sections.map((s) => (
        <section key={s.key} className="flex flex-col gap-5 rounded-xl border border-line p-5" aria-labelledby={`sec-${s.key}`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <h2 id={`sec-${s.key}`} className="text-[17px] font-bold">
                {s.title}
              </h2>
              {s.description && <p className="text-graphite">{s.description}</p>}
            </div>
            <button type="button" disabled={pending || !dirty[s.key]} onClick={() => save(s.key)} className="h-9 rounded-lg bg-blue px-4 font-semibold text-white hover:bg-blue-deep disabled:bg-line disabled:text-graphite">
              {dirty[s.key] ? "Opslaan" : "Opgeslagen"}
            </button>
          </div>
          {s.fields.map((f) => (
            <div key={f.key} className="flex flex-col gap-1.5">
              <FieldInput
                f={f}
                value={s.self ? values[s.key] : (values[s.key] as Record<string, unknown> | undefined)?.[f.key]}
                onChange={(v) => {
                  setValues((cur) => ({ ...cur, [s.key]: s.self ? v : { ...(cur[s.key] as Record<string, unknown>), [f.key]: v } }));
                  setDirty((d) => ({ ...d, [s.key]: true }));
                }}
                options={{}}
                media={mediaCache}
                addMedia={(rows) => setMediaCache((c) => ({ ...c, ...Object.fromEntries(rows.map((r) => [r.id, r])) }))}
              />
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
