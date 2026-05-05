"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { contactInfo } from "@/lib/data";

/*
 * StickyMobileBar — fixed bottom bar on mobile only.
 * Slides up after scrolling past hero (~200px). Dismissible.
 * Two actions: call directly, or request quote.
 * Hidden on desktop (lg and up).
 */

export default function StickyMobileBar() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("main-content");
      if (!hero) return;
      const scrollY = window.scrollY;
      const threshold = 200;
      setVisible(scrollY > threshold && !dismissed);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <div
      className={`lg:hidden fixed inset-x-0 bottom-0 z-[60] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!visible}
    >
      <div className="bg-base/95 backdrop-blur-xl border-t border-hairline shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-3 px-4 py-3 max-w-[1280px] mx-auto">
          <a
            href={`tel:${contactInfo.phone}`}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full border border-hairline text-ink font-sans text-[0.8125rem] font-semibold hover:border-brand hover:text-brand transition-colors duration-200 active:scale-[0.98]"
            aria-label={`Bel ${contactInfo.phoneDisplay}`}
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Bel
          </a>

          <Link
            href="/contact"
            className="flex-[1.5] flex items-center justify-center gap-2 py-3.5 bg-brand text-base font-sans text-[0.8125rem] font-bold uppercase tracking-[0.08em] rounded-full hover:bg-brand-deep transition-colors duration-200 active:scale-[0.98]"
          >
            Offerte aanvragen
            <span
              aria-hidden="true"
              className="block w-[5px] h-[5px] rounded-full bg-base/85"
            />
          </Link>

          <button
            onClick={() => setDismissed(true)}
            className="w-10 h-10 flex items-center justify-center text-muted hover:text-ink transition-colors duration-200 shrink-0"
            aria-label="Sluit balk"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Safe area padding for notched phones */}
        <div
          className="h-[env(safe-area-inset-bottom)]"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
