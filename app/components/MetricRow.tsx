import { Fragment } from "react";

interface Metric {
  value: string;
  label: string;
}

interface MetricRowProps {
  items: Metric[];
  variant?: "muted" | "inverse";
  className?: string;
  align?: "start" | "center";
}

/*
 * Tabular-figures metric row. Replaces the hero-metric template
 * (no big numbers, no isolated stat blocks). Inline, hairline-separated,
 * meant to read as technical metadata under a headline.
 */
export default function MetricRow({
  items,
  variant = "muted",
  className = "",
  align = "start",
}: MetricRowProps) {
  const labelClass =
    variant === "inverse"
      ? "text-base/45"
      : "text-muted";
  const valueClass =
    variant === "inverse"
      ? "text-base"
      : "text-ink";
  const ruleClass =
    variant === "inverse"
      ? "bg-base/15"
      : "bg-hairline";

  return (
    <dl
      className={`flex flex-wrap items-baseline gap-x-6 gap-y-3 ${
        align === "center" ? "justify-center" : ""
      } ${className}`}
    >
      {items.map((m, i) => (
        <Fragment key={`${m.value}-${m.label}`}>
          {i > 0 && (
            <span
              aria-hidden="true"
              className={`block w-px h-3 self-center shrink-0 ${ruleClass}`}
            />
          )}
          <div className="flex items-baseline gap-2 shrink-0">
            <dt className={`tabular text-[0.9375rem] font-bold font-sans ${valueClass}`}>
              {m.value}
            </dt>
            <dd className={`text-[0.625rem] font-bold uppercase tracking-[0.2em] font-sans ${labelClass}`}>
              {m.label}
            </dd>
          </div>
        </Fragment>
      ))}
    </dl>
  );
}
