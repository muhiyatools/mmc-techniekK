"use client";

import { useEffect, useRef, useState } from "react";

/*
 * Viewport entrance reveal. Plays once when the element crosses
 * 8% in. Stagger between siblings stays 60ms — anything faster
 * reads as a flash, anything slower reads as drag.
 */
export default function FadeIn({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "scale" | "right" | "left";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const el = ref.current;
    if (!el) return;

    // Immediate visibility check for elements already in viewport
    const rect = el.getBoundingClientRect();
    const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
    if (inViewport) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const animName =
    direction === "scale"
      ? "reveal-scale"
      : direction === "right"
        ? "slide-in-right"
        : direction === "left"
          ? "slide-in-left"
          : "reveal";

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: mounted && !isVisible ? 0 : undefined,
        animation: isVisible
          ? `${animName} 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms both`
          : "none",
      }}
    >
      {children}
    </div>
  );
}
