"use client";

import Link from "next/link";

const IconPhone = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);
const IconDoc = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

interface StickyCTAProps {
  quoteHref?: string;
  phone?: string;
  quoteLabel?: string;
  callLabel?: string;
}

export default function StickyCTA({
  quoteHref = "/contact",
  phone = "0634311225",
  quoteLabel = "Offerte aanvragen",
  callLabel = "Bel ons",
}: StickyCTAProps) {
  return (
    <div className="sticky-cta-bar md:hidden">
      <a
        href={`tel:${phone}`}
        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-hairline text-ink font-semibold text-sm transition-colors active:bg-concrete"
        aria-label={callLabel}
      >
        <IconPhone />
        {callLabel}
      </a>
      <Link
        href={quoteHref}
        className="flex-[1.5] flex items-center justify-center gap-2 py-3 rounded-xl bg-brand text-white font-bold text-sm transition-colors active:bg-brand-deep"
      >
        <IconDoc />
        {quoteLabel}
      </Link>
    </div>
  );
}
