"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { contactInfo } from "@/lib/data";

export default function PreFooterCTA() {
  const pathname = usePathname();

  if (pathname === "/contact" || pathname === "/contact/") return null;

  return (
    <div className="bg-ink relative py-8 border-t border-hairline before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-aurora-1 before:via-brand before:to-aurora-2">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 flex flex-col lg:flex-row gap-6 items-center justify-between">
        <div className="flex items-center gap-8 text-center lg:text-left">
          <h2 className="font-display text-4xl font-extrabold text-base leading-none uppercase">
            BOUW MEE AAN DE TOEKOMST
          </h2>
          <p className="text-sm text-white/60 hidden lg:block max-w-sm">
            Plan uw gratis verduurzamings-audit (binnen 48 uur).
          </p>
        </div>
        <div className="flex gap-4 items-center w-full lg:w-auto">
          <Link 
            href="/contact/" 
            className="flex-1 lg:flex-none bg-brand text-base px-8 py-3 text-xs font-bold uppercase tracking-[0.15em] text-center hover:opacity-90 transition-opacity"
          >
            Offerte Aanvragen
          </Link>
          <a 
            href={`tel:${contactInfo.phone}`} 
            className="hidden sm:block text-base px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] border border-white/20 hover:border-base transition-colors"
          >
            Bel Direct
          </a>
        </div>
      </div>
    </div>
  );
}
