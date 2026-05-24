"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function TrustStrip() {
  const { t } = useLanguage();

  return (
    <div className="relative bg-ink py-6 lg:py-10 overflow-hidden border-b border-white/5">
      {/* Infinite scrolling text for high monitor visibility */}
      <div className="flex animate-marquee whitespace-nowrap">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-16 lg:gap-32 px-8 lg:px-16">
            {t.components.trustBar.map((text, idx) => (
              <div key={idx} className="flex items-center gap-4 lg:gap-6 group">
                <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-brand group-hover:scale-150 transition-transform duration-500 shadow-[0_0_12px_rgba(66,168,242,0.6)]" />
                <span className="text-white/60 text-[0.75rem] lg:text-[0.9375rem] font-black uppercase tracking-[0.3em] group-hover:text-white transition-colors duration-300">
                  {text}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Edge fades */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-ink to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-ink to-transparent z-10" />
    </div>
  );
}
