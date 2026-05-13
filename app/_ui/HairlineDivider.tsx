"use client";

import { useEffect, useRef } from "react";

interface HairlineDividerProps {
  className?: string;
  draw?: boolean;
  aurora?: boolean;
  delay?: number;
}

/**
 * 1px Hairline rule. Optional `draw` animates from scaleX(0) → 1 on viewport enter.
 * Optional `aurora` adds an iridescent gradient prism.
 */
export default function HairlineDivider({
  className = "",
  draw = false,
  aurora = false,
  delay = 0,
}: HairlineDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!draw || !ref.current) return;

    const el = ref.current;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      el.style.transform = "scaleX(1)";
      el.style.opacity = "1";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            timerRef.current = setTimeout(() => {
              el.style.transform = "scaleX(1)";
              el.style.opacity = "1";
            }, delay);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [draw, delay]);

  const base = "h-px w-full";
  const color = aurora
    ? "bg-gradient-to-r from-aurora-1 via-brand/40 to-aurora-2"
    : "bg-hairline";
  const motion =
    draw
      ? "transition-transform duration-[900ms] cubic-bezier(0.16, 1, 0.3, 1) opacity-0"
      : "";

  return (
    <div
      ref={ref}
      className={`${base} ${color} ${motion} ${className}`}
      style={
        draw
          ? { transform: "scaleX(0)", transformOrigin: "left", willChange: "transform" }
          : undefined
      }
      aria-hidden="true"
    />
  );
}
