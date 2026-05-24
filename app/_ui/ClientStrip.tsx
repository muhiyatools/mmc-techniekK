"use client";

import Image from "next/image";
import Reveal from "./Reveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const partnerLogos = [
  { name: "Daikin", src: "/images/brands/daikin.png" },
  { name: "LG", src: "/images/brands/lg.png" },
  { name: "Mitsubishi Electric", src: "/images/brands/mitsubishi_electric.png" },
  { name: "Trina Solar", src: "/images/brands/trina_solar.png" },
  { name: "Jinko Solar", src: "/images/brands/jinko.png" },
  { name: "Growatt", src: "/images/brands/growatt.png" },
  { name: "Enphase", src: "/images/brands/enphase.png" },
  { name: "AlphaESS", src: "/images/brands/alphaess.png" },
  { name: "Sigenergy", src: "/images/brands/sigenergy.png" },
  { name: "TSUN", src: "/images/brands/tsun.png" },
];

export default function ClientStrip() {
  const { t } = useLanguage();

  return (
    <section className="py-24 lg:py-40 bg-white relative overflow-hidden border-y border-hairline/40">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 mb-16 lg:mb-24">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <span className="text-label text-brand font-black tracking-[0.3em] mb-6 block">
                {t.pages.overOns.clients.label}
              </span>
              <h2 
                className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-black leading-[0.85] tracking-[-0.04em] text-ink uppercase"
                dangerouslySetInnerHTML={{ __html: t.pages.overOns.clients.title.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
              />
            </div>
            <p className="text-lg md:text-xl text-muted/80 font-medium max-w-md leading-relaxed">
              {t.pages.overOns.clients.description}
            </p>
          </div>
        </Reveal>
      </div>

      <div className="relative group">
        <div className="flex overflow-hidden select-none mask-fade">
          <div className="flex items-center gap-16 lg:gap-32 animate-marquee py-4">
            {[...partnerLogos, ...partnerLogos].map((logo, i) => (
              <div key={`${logo.name}-${i}`} className="relative w-32 md:w-48 lg:w-64 h-16 md:h-24 lg:h-32 shrink-0">
                <Image
                  src={logo.src}
                  alt={logo.name}
                  fill
                  className="object-contain grayscale brightness-0 opacity-20 hover:grayscale-0 hover:brightness-100 hover:opacity-100 transition-all duration-700 cursor-pointer"
                  sizes="(max-width: 768px) 128px, (max-width: 1024px) 192px, 256px"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Gradient overlays for the fade effect */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      </div>

      <style jsx>{`
        .mask-fade {
          -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
          mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
        }
      `}</style>
    </section>
  );
}
