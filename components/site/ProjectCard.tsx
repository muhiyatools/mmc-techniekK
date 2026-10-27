import Link from "next/link";
import { ViewTransition } from "react";
import { Icon } from "@/components/ui/Icon";
import { Photo } from "@/components/ui/Photo";
import type { Media } from "@/lib/content/types";
import { href, type Locale } from "@/lib/i18n/config";

export type ProjectCardData = {
  slug: string;
  title: string;
  meta: string;
  category: string;
  image: Media;
};

/** Photo card with a white caption box and a round arrow (design system "Project card"). */
export function ProjectCard({ lang, project, sizes, className = "", priority }: { lang: Locale; project: ProjectCardData; sizes: string; className?: string; priority?: boolean }) {
  return (
    <Link href={href(lang, `/projecten/${project.slug}`)} className={`group tile relative block rounded-[var(--radius-tile)] ${className}`}>
      <ViewTransition name={`project-${project.slug}`} share="morph">
        <div className="absolute inset-0">
          <Photo media={project.image} lang={lang} sizes={sizes} priority={priority} decorative />
        </div>
      </ViewTransition>
      <span className="t-mono spec-tag absolute left-3 top-3">{project.category}</span>
      <span className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-3">
        <span className="flex max-w-[360px] flex-col gap-1.5 rounded-[var(--radius-sm)] bg-white px-4 py-3.5">
          <span className="t-h3 text-[17px] sm:text-[18px]">{project.title}</span>
          {project.meta && <span className="t-mono text-graphite">{project.meta}</span>}
        </span>
        <span className="go">
          <Icon name="arrowUpRight" />
        </span>
      </span>
    </Link>
  );
}
