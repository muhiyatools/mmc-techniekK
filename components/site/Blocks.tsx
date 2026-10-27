import Image from "next/image";
import type { Brand, Project, Review, Settings } from "@/lib/content/types";
import { CountUp } from "@/components/ui/CountUp";
import { t, type Locale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/ui";
import type { MediaClaims } from "@/lib/media";
import type { ProjectCardData } from "./ProjectCard";
import type { GridProject } from "./ProjectsGrid";

/** Project → card data, using the first photo of the project not yet shown on this page. */
export function projectCard(p: Project, lang: Locale, claims: MediaClaims): GridProject | null {
  const image = claims.pick(p.cover, ...p.images);
  if (!image) return null;
  const d = getDict(lang);
  const meta = [p.place, p.year].filter(Boolean).join(" · ");
  return { slug: p.slug, title: t(p.title, lang), meta, category: d.sectors[p.sector], image, sector: p.sector } satisfies ProjectCardData & { sector: string };
}

export function sectorFilters(lang: Locale) {
  const d = getDict(lang);
  return [
    { id: "all", label: d.filters.all, sectors: [] },
    { id: "particulier", label: d.sectors.particulier, sectors: ["particulier"] },
    { id: "zakelijk", label: `${d.sectors.utiliteit} & ${d.sectors.retail.toLowerCase()}`, sectors: ["utiliteit", "retail"] },
    { id: "nieuwbouw", label: d.sectors.nieuwbouw, sectors: ["nieuwbouw"] },
  ];
}

/** Certifications and three facts in a hairline grid. */
export function TrustStrip({ lang, settings }: { lang: Locale; settings: Settings }) {
  const d = getDict(lang);
  const years = new Date().getFullYear() - settings.company.founded;
  const cell = "flex flex-col justify-center gap-1.5 border-line py-5 sm:py-6";
  return (
    <div className="grid grid-cols-2 border-y border-line lg:grid-cols-[1.4fr_1fr_1fr_1fr]" data-reveal>
      <div className={`${cell} col-span-2 border-b lg:col-span-1 lg:border-b-0 lg:pr-7`}>
        <span className="t-mono text-graphite">{d.trust.certified}</span>
        <div className="flex items-center gap-4 pt-1">
          <Image src="/brand/certs/nen-1010.png" alt="NEN 1010" width={100} height={30} className="h-[26px] w-auto sm:h-[30px]" />
          <Image src="/brand/certs/nen-3140.png" alt="NEN 3140" width={44} height={44} className="h-10 w-auto sm:h-11" />
          <Image src="/brand/certs/vca.png" alt="VCA" width={44} height={44} className="h-10 w-auto sm:h-11" />
        </div>
      </div>
      <div className={`${cell} pr-4 lg:border-l lg:px-7`}>
        <span className="t-num text-[26px] leading-none sm:text-[30px]">
          <CountUp value={years} /> {lang === "nl" ? "jaar" : "years"}
        </span>
        <span className="text-sm text-slate">{d.trust.since(settings.company.founded).toLowerCase()}</span>
      </div>
      <div className={`${cell} border-l pl-4 lg:px-7`}>
        <span className="t-num text-[26px] leading-none sm:text-[30px]">{d.trust.own}</span>
        <span className="text-sm text-slate">{d.trust.ownText}</span>
      </div>
      <div className={`${cell} col-span-2 border-t lg:col-span-1 lg:border-l lg:border-t-0 lg:px-7`}>
        <span className="t-mono text-graphite">{d.trust.area}</span>
        <span className="text-[15px] font-medium leading-snug text-ink">{t(settings.area, lang)}</span>
      </div>
    </div>
  );
}

/** One static row of brand logos in a single ink colour. */
export function LogoRow({ brands, label, tone = "light" }: { brands: Brand[]; label?: string; tone?: "light" | "dark" }) {
  const withLogo = brands.filter((b) => b.logo_path);
  if (!withLogo.length) return null;
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-12" data-reveal>
      {label && <span className={`t-mono w-[150px] flex-none ${tone === "dark" ? "text-on-dark-muted" : "text-graphite"}`}>{label}</span>}
      <ul className="-mx-[var(--gutter)] flex items-center gap-10 overflow-x-auto px-[var(--gutter)] [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:gap-x-12 sm:gap-y-5 sm:overflow-visible sm:px-0">
        {withLogo.map((b) => (
          <li key={b.id} className="flex-none">
            <Image
              src={b.logo_path!}
              alt={b.name}
              width={140}
              height={40}
              className={`h-[22px] w-auto opacity-55 transition-opacity duration-[var(--dur)] hover:opacity-90 sm:h-[26px] ${tone === "dark" ? "invert" : ""}`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Stars({ n, lang }: { n: number; lang: Locale }) {
  return (
    <span className="stars" role="img" aria-label={getDict(lang).stars(n)}>
      {"★".repeat(n)}
    </span>
  );
}

export function ReviewQuote({ review, lang, size = "md" }: { review: Review; lang: Locale; size?: "md" | "lg" }) {
  const initials = review.author
    .split(/\s+/)
    .map((w) => w[0])
    .filter((c) => c && c === c.toUpperCase())
    .slice(0, 2)
    .join("");
  if (size === "lg") {
    return (
      <figure className="relative flex flex-col justify-between gap-10 overflow-hidden rounded-[var(--radius-card)] bg-paper p-7 sm:p-12" data-reveal>
        <svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true">
          <path d="M8 34c0-8 4-15 12-18l2 4c-4 2-6 5-6 8h6v10H8zm18 0c0-8 4-15 12-18l2 4c-4 2-6 5-6 8h6v10H26z" fill="var(--color-signal)" />
        </svg>
        <blockquote className="text-[clamp(22px,2.6vw,36px)] font-[650] leading-[1.2] tracking-[-0.015em] [font-stretch:110%]">{t(review.body, lang)}</blockquote>
        <figcaption className="flex items-center gap-4">
          <span className="grid size-[52px] flex-none place-items-center rounded-full bg-ink font-bold text-white" aria-hidden="true">
            {initials}
          </span>
          <span className="flex flex-col gap-0.5">
            <span className="font-semibold">{review.author}</span>
            {review.place && <span className="t-mono text-graphite">{review.place}</span>}
          </span>
          <span className="ml-auto">
            <Stars n={review.rating} lang={lang} />
          </span>
        </figcaption>
      </figure>
    );
  }
  return (
    <figure className="flex flex-col gap-4 rounded-[var(--radius-tile)] border border-line p-6 sm:p-7" data-reveal>
      <Stars n={review.rating} lang={lang} />
      <blockquote className="text-[17px] leading-relaxed">{t(review.body, lang)}</blockquote>
      <figcaption className="t-mono text-graphite">
        {review.author}
        {review.place ? ` · ${review.place}` : ""}
      </figcaption>
    </figure>
  );
}
