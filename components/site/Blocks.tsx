import Image from "next/image";
import type { Review, Settings } from "@/lib/content/types";
import { CountUp } from "@/components/ui/CountUp";
import { t, type Locale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/ui";

/** Certifications and three facts in a hairline grid. */
export function TrustStrip({ lang, settings, showCerts = true }: { lang: Locale; settings: Settings; showCerts?: boolean }) {
  const d = getDict(lang);
  const years = new Date().getFullYear() - settings.company.founded;
  const cell = "flex flex-col justify-center gap-1.5 border-line py-5 sm:py-6";
  return (
    <div className={`grid grid-cols-2 border-y border-line ${showCerts ? "lg:grid-cols-[1.4fr_1fr_1fr_1fr]" : "lg:grid-cols-3"}`} data-reveal>
      {showCerts && (
      <div className={`${cell} col-span-2 border-b lg:col-span-1 lg:border-b-0 lg:pr-7`}>
        <span className="t-mono text-graphite">{d.trust.certified}</span>
        <div className="flex items-center gap-4 pt-1">
          <Image src="/brand/certs/nen-1010.png" alt="NEN 1010" width={100} height={30} className="h-[26px] sm:h-[30px]" style={{ width: "auto" }} />
          <Image src="/brand/certs/nen-3140.png" alt="NEN 3140" width={44} height={44} className="h-10 w-auto sm:h-11" />
          <Image src="/brand/certs/vca.png" alt="VCA" width={44} height={44} className="h-10 w-auto sm:h-11" />
        </div>
      </div>
      )}
      <div className={`${cell} pr-4 ${showCerts ? "lg:border-l lg:px-7" : "lg:pr-7"}`}>
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
