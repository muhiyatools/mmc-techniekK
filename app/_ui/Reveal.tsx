"use client";

import { useEffect, useRef, ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  variant?: "reveal" | "scale" | "left" | "right";
  delay?: number;
  threshold?: number;
}

export default function Reveal({
  children,
  className = "",
  variant = "reveal",
  delay = 0,
  threshold = 0.15,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            timerRef.current = setTimeout(() => {
              el.classList.add("revealed");
            }, delay);
            observer.unobserve(el);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [delay, threshold]);

  const baseClass =
    variant === "scale"
      ? "reveal-scale"
      : variant === "left"
      ? "reveal-left"
      : variant === "right"
      ? "reveal-right"
      : "reveal";

  return (
    <div ref={ref} className={`${baseClass} ${className}`}>
      {children}
    </div>
  );
}
