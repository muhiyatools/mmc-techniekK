"use client";

import { useEffect, useRef, useState } from "react";

type Variant = "hairline" | "aurora" | "muted-inverse";

interface HairlineDividerProps {
  variant?: Variant;
  draw?: boolean;
  className?: string;
}

/*
 * 1px tinted rule. Default uses --color-hairline. The aurora variant
 * draws a 1px iridescent prism (cool blue → brand → cool violet).
 * The muted-inverse variant is for use on the Brand-deep footer block.
 *
 * draw=true: the rule scales from 0 to 1 on viewport enter.
 *
 * Bans: never use as a >1px decorative border or side-stripe accent.
 */
export default function HairlineDivider({
  variant = "hairline",
  draw = false,
  className = "",
}: HairlineDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(!draw);

  useEffect(() => {
    if (!draw) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [draw]);

  const bg =
    variant === "aurora"
      ? "linear-gradient(90deg, transparent 0%, var(--color-aurora-1) 28%, var(--color-brand) 50%, var(--color-aurora-2) 72%, transparent 100%)"
      : variant === "muted-inverse"
        ? "color-mix(in oklch, var(--color-base) 14%, transparent)"
        : "var(--color-hairline)";

  return (
    <div
      ref={ref}
      role="separator"
      aria-hidden="true"
      className={`h-px w-full ${className}`}
      style={{
        background: bg,
        backgroundSize: variant === "aurora" ? "200% 100%" : undefined,
        animation: variant === "aurora" ? "aurora-drift 18s linear infinite" : undefined,
        transform: seen ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left center",
        transition: draw
          ? "transform 0.9s cubic-bezier(0.16,1,0.3,1)"
          : undefined,
        willChange: draw ? "transform" : undefined,
      }}
    />
  );
}
