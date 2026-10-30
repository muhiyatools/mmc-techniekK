import { SolarMap } from "@/components/site/SolarMap";
import { COVERAGE_LOCATIONS } from "@/lib/coverage";
import { type Locale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/ui";

/** Coverage proof for the solar-panel page: a real map of the towns we have worked in. */
export function SolarCoverage({ lang }: { lang: Locale }) {
  const d = getDict(lang);
  return (
    <section className="section-y bg-paper" aria-labelledby="coverage-title">
      <div className="wrap flex flex-col gap-8 sm:gap-10">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6" data-reveal>
          <div className="flex max-w-[620px] flex-col gap-4">
            <h2 id="coverage-title" className="t-h2">
              {d.map.title}
            </h2>
            <p className="text-[17px] leading-relaxed text-slate">{d.map.lead}</p>
          </div>
          <p className="t-mono text-graphite">{d.map.towns(COVERAGE_LOCATIONS.length)}</p>
        </div>
        <SolarMap lang={lang} />
      </div>
    </section>
  );
}
