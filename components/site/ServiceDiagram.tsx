import { Icon, type IconName } from "@/components/ui/Icon";

const R = 120;
const C = 160;

/**
 * Where a service sits in the loop: six nodes on a ring, this one filled, with the arc
 * drawn up to it. Used on service pages that have no project photo yet.
 */
export function ServiceDiagram({ slugs, active, label }: { slugs: string[]; active: string; label: string }) {
  const ring = slugs.filter((s) => s !== "verduurzaming");
  const idx = ring.indexOf(active);
  const isCore = active === "verduurzaming";
  const start = -137;
  const end = isCore ? start + 352 : -90 + idx * 60 - 16;
  const len = ((end - start) / 360) * 2 * Math.PI * R;
  const p = (deg: number, r = R) => ({ x: C + r * Math.cos((deg * Math.PI) / 180), y: C + r * Math.sin((deg * Math.PI) / 180) });
  const s = p(start);
  const e = p(start + 180);
  const ringPath = `M${s.x} ${s.y} A${R} ${R} 0 1 1 ${e.x} ${e.y} A${R} ${R} 0 1 1 ${s.x} ${s.y}`;

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[320px]" role="img" aria-label={label} data-reveal>
      <svg viewBox="0 0 320 320" className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
        <circle cx={C} cy={C} r={150} fill="none" stroke="var(--color-line)" strokeDasharray="2 7" />
        <circle cx={C} cy={C} r={R} fill="none" stroke="var(--color-line-strong)" strokeWidth="1.25" />
        {(idx >= 0 || isCore) && (
          <path
            className="draw"
            d={ringPath}
            fill="none"
            stroke="var(--color-signal)"
            strokeWidth="4"
            strokeLinecap="round"
            style={{ "--len": 2 * Math.PI * R, strokeDasharray: `${len} ${2 * Math.PI * R}` } as React.CSSProperties}
          />
        )}
      </svg>
      {ring.map((slug, i) => {
        const q = p(-90 + i * 60);
        const on = slug === active;
        return (
          <span
            key={slug}
            className={`absolute grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full ${
              on ? "bg-blue text-white shadow-[0_0_0_6px_var(--color-sky)]" : "bg-white text-graphite shadow-[inset_0_0_0_1.5px_var(--color-line-strong)]"
            }`}
            style={{ left: `${(q.x / 320) * 100}%`, top: `${(q.y / 320) * 100}%` }}
          >
            <Icon name={slug as IconName} size={18} />
          </span>
        );
      })}
      <span
        className={`absolute left-1/2 top-1/2 grid size-[34%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full ${isCore ? "bg-ink text-white" : "bg-paper text-ink"}`}
      >
        <Icon name={active as IconName} size={34} strokeWidth={1.5} />
      </span>
    </div>
  );
}
