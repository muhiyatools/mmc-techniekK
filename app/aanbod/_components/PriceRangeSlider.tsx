"use client";

import { useState, useEffect, useRef } from "react";

const SLIDER_MIN = 0;
const SLIDER_MAX = 20000;
const SLIDER_STEP = 500;

export { SLIDER_MIN, SLIDER_MAX, SLIDER_STEP };

interface PriceRangeSliderProps {
  value: [number, number];
  onChange: (v: [number, number]) => void;
}

export default function PriceRangeSlider({ value, onChange }: PriceRangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<"min" | "max" | null>(null);

  const getPct = (v: number) => ((v - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100;
  const getVal = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return SLIDER_MIN;
    const rect = el.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round((SLIDER_MIN + pct * (SLIDER_MAX - SLIDER_MIN)) / SLIDER_STEP) * SLIDER_STEP;
  };

  useEffect(() => {
    if (!dragging) return;
    const move = (e: MouseEvent) => {
      const raw = getVal(e.clientX);
      if (dragging === "min") onChange([Math.min(raw, value[1] - SLIDER_STEP), value[1]]);
      else onChange([value[0], Math.max(raw, value[0] + SLIDER_STEP)]);
    };
    const up = () => setDragging(null);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
  }, [dragging, value, onChange]);

  const fmt = (n: number) => n >= 1000 ? `€${(n / 1000).toFixed(0)}k` : `€${n}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-ink tabular-nums">{fmt(value[0])}</span>
        <span className="text-xs font-bold text-ink tabular-nums">{fmt(value[1])}</span>
      </div>
      <div ref={trackRef} className="relative h-2 bg-hairline rounded-full cursor-pointer">
        <div className="absolute top-0 h-full bg-brand rounded-full" style={{ left: `${getPct(value[0])}%`, right: `${100 - getPct(value[1])}%` }} />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-brand border-2 border-white rounded-full shadow cursor-pointer hover:scale-110 transition-transform"
          style={{ left: `${getPct(value[0])}%` }}
          onMouseDown={() => setDragging("min")}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-brand border-2 border-white rounded-full shadow cursor-pointer hover:scale-110 transition-transform"
          style={{ left: `${getPct(value[1])}%` }}
          onMouseDown={() => setDragging("max")}
        />
      </div>
    </div>
  );
}
