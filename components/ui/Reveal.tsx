"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Adds `.in` to every [data-reveal] element as it scrolls into view (once).
 * Elements are only hidden after this runs (html.reveal-ready), so no JS = no hidden content.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    root.classList.add("reveal-ready");

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.in)"));
    const vh = window.innerHeight;
    for (const el of els) {
      // Already on screen at load: show immediately, no animation on first paint.
      if (el.getBoundingClientRect().top < vh * 0.9) el.classList.add("in");
      else io.observe(el);
    }
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
