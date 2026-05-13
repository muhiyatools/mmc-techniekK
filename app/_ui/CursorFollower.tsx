"use client";

import { useEffect, useRef } from "react";

export default function CursorFollower() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const dot = dotRef.current;
    if (!dot) return;
    let raf: number;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div
      ref={dotRef}
      className="fixed top-0 left-0 w-3 h-3 bg-brand/30 rounded-full pointer-events-none z-[100] -translate-x-1/2 -translate-y-1/2 hidden lg:block"
      style={{ boxShadow: "0 0 12px rgba(66,168,242,0.15)" }}
      aria-hidden="true"
    />
  );
}
