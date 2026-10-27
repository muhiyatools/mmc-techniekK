"use client";

import { useState } from "react";
import { ProjectCard, type ProjectCardData } from "./ProjectCard";
import type { Locale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/ui";

export type GridProject = ProjectCardData & { sector: string };
type Filter = { id: string; label: string; sectors: string[] };

// Bento spans for the first six cards on wide screens (design/boards/Home.html).
const BENTO = [
  "lg:col-span-7 lg:row-span-2",
  "lg:col-span-5",
  "lg:col-span-5",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-4",
];

export function ProjectsGrid({ lang, projects, filters, layout = "bento" }: { lang: Locale; projects: GridProject[]; filters: Filter[]; layout?: "bento" | "grid" }) {
  const d = getDict(lang);
  const [filter, setFilter] = useState("all");
  const current = filters.find((f) => f.id === filter);
  const shown = current && filter !== "all" ? projects.filter((p) => current.sectors.includes(p.sector)) : projects;
  const bento = layout === "bento" && filter === "all";

  return (
    <div className="flex flex-col gap-8">
      {filters.length > 1 && (
        <div role="group" aria-label={d.filters.label} className="-mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
          {filters.map((f) => (
            <button key={f.id} type="button" className="chip" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.label}
            </button>
          ))}
        </div>
      )}

      {shown.length === 0 ? (
        <p className="text-slate">{d.projects.empty}</p>
      ) : (
        <ul
          key={filter}
          className={
            layout === "bento"
              ? "-mx-[var(--gutter)] flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-[var(--gutter)] px-[var(--gutter)] pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:auto-rows-[250px] lg:grid-cols-12"
              : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          }
        >
          {shown.map((p, i) => (
            <li
              key={p.slug}
              className={`fade-up ${
                layout === "bento"
                  ? `w-[78vw] max-w-[320px] flex-none snap-start sm:w-auto sm:max-w-none ${bento ? BENTO[i] ?? "lg:col-span-4" : "lg:col-span-6 lg:row-span-2"}`
                  : ""
              }`}
              style={{ "--d": `${i * 50}ms` } as React.CSSProperties}
            >
              <ProjectCard
                lang={lang}
                project={p}
                className={layout === "bento" ? "h-[360px] sm:h-[300px] lg:h-full" : "aspect-[4/3]"}
                sizes={layout === "bento" ? "(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 80vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
