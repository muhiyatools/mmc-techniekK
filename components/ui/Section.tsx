import type { ReactNode } from "react";

/** Heading block used at the top of sections: H2 with an optional lead and aside. */
export function SectionHeading({
  id,
  title,
  lead,
  aside,
  as: Tag = "h2",
  className = "",
}: {
  id?: string;
  title: ReactNode;
  lead?: ReactNode;
  aside?: ReactNode;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-end justify-between gap-x-8 gap-y-6 ${className}`} data-reveal>
      <div className="flex max-w-[760px] flex-col gap-5">
        <Tag id={id} className={Tag === "h1" ? "t-h1" : "t-h2"}>
          {title}
        </Tag>
        {lead && <p className="t-lead max-w-[600px]">{lead}</p>}
      </div>
      {aside && <div className="flex max-w-[400px] flex-col gap-4">{aside}</div>}
    </div>
  );
}

/** Small mono label above a value (spec sheets, meta). */
export function Meta({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="t-mono text-graphite">{label}</dt>
      <dd className="text-ink">{children}</dd>
    </div>
  );
}
