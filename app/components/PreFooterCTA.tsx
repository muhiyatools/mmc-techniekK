"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { contactInfo } from "@/lib/data";
import Reveal from "./Reveal";

export default function PreFooterCTA() {
  const pathname = usePathname();

  // Hide on contact page
  if (pathname === "/contact" || pathname === "/contact/") return null;

  return (
    <div className="bg-brand relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-brand-deep)/40,_transparent_60%)]" />
      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-8 py-20 lg:py-24 text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white/60 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
            Klaar om te beginnen?
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-display text-[clamp(2rem,5vw,3.75rem)] font-extrabold leading-[1.0] tracking-tight text-white mb-5">
            Klaar voor een duurzame woning?
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="text-white/75 text-lg max-w-xl mx-auto mb-10">
            Vraag vandaag nog een gratis en vrijblijvend adviesgesprek aan. Wij nemen binnen 24 uur contact op.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact/"
              className="px-8 py-4 bg-white text-brand text-sm font-bold uppercase tracking-wide rounded-full hover:bg-mist transition-all duration-200 shadow-lg shadow-ink/10"
            >
              Offerte aanvragen
            </Link>
            <a
              href={`tel:${contactInfo.phone}`}
              className="px-8 py-4 border-2 border-white/60 text-white text-sm font-bold uppercase tracking-wide rounded-full hover:border-white hover:bg-white/10 transition-all duration-200"
            >
              {contactInfo.phoneDisplay}
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
