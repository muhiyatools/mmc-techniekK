"use client";

import Link from "next/link";
import Image from "next/image";
import { services } from "@/lib/data";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Services() {
  const { t } = useLanguage();

  return (
    <section id="diensten" className="py-32 lg:py-56 bg-white relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24 lg:mb-36">
          <div className="max-w-3xl">
            <span className="text-label text-brand font-black tracking-[0.4em] mb-8 block">
              {t.sections.services.label}
            </span>
            <h2 
              className="font-display text-[clamp(3rem,6vw,5.5rem)] font-black leading-[0.85] tracking-[-0.04em] text-ink uppercase"
              dangerouslySetInnerHTML={{ __html: t.sections.services.title.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
            />
          </div>
          <p className="text-xl lg:text-3xl text-muted/80 font-bold max-w-xl leading-relaxed">
            {t.sections.services.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {services.map((service, i) => {
            const itemTranslation = t.sections.services.items[i];
            if (!itemTranslation) return null;
            return (
              <Link href={`/aanbod/?dienst=${service.slug}`} key={service.slug} className="group cursor-pointer block">
                <div className="mb-10 relative aspect-[4/5] overflow-hidden rounded-3xl shadow-xl group-hover:shadow-2xl transition-all duration-700">
                  <Image
                    src={service.image}
                    alt={itemTranslation.title}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 opacity-40 group-hover:opacity-85 group-hover:scale-105 transition-all duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/40 to-transparent transition-colors duration-700 group-hover:from-ink/90" />
                  <div className="absolute inset-0 flex flex-col justify-end p-8 z-10">
                     <div className="w-16 h-1 bg-brand mb-6 group-hover:w-full transition-all duration-700" />
                     <span className="text-[10px] font-black uppercase tracking-[0.25em] text-brand mb-2 block opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500">
                       {t.nav.aanbod} &rarr;
                     </span>
                     <h3 className="font-display text-2xl lg:text-3xl font-black text-white uppercase tracking-tight mb-2 group-hover:translate-x-2 transition-transform duration-500">
                      {itemTranslation.title}
                     </h3>
                     <p className="text-white/60 text-sm font-medium line-clamp-2 group-hover:translate-x-2 transition-all duration-500 delay-100">
                      {itemTranslation.summary}
                     </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
