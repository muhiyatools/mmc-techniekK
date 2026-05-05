"use client";

import { useEffect, useState } from "react";

/*
 * Top-of-page reading progress bar — 1px hairline that grows in width
 * as the user scrolls. Uses brand color so the indicator reads as a
 * subtle accent, not chrome.
 */
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const p = docHeight ? (scrollTop / docHeight) * 100 : 0;
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 w-full h-px z-[60] pointer-events-none"
      role="progressbar"
      aria-label="Leesvoortgang"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-brand transition-[width] duration-100 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
