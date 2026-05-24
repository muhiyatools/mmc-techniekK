"use client";

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
          {t.sections.services.items.map((service, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="mb-10 relative aspect-[4/5] overflow-hidden rounded-3xl shadow-xl group-hover:shadow-2xl transition-all duration-700">
                <div className="absolute inset-0 bg-ink group-hover:bg-brand transition-colors duration-700" />
                <div className="absolute inset-0 flex flex-col justify-end p-10 z-10">
                   <div className="w-16 h-1 bg-white/20 mb-8 group-hover:w-full transition-all duration-700" />
                   <h3 className="font-display text-3xl lg:text-4xl font-black text-white uppercase tracking-tight mb-4 group-hover:translate-x-2 transition-transform duration-500">
                    {service.title}
                   </h3>
                   <p className="text-white/60 text-lg lg:text-xl font-medium line-clamp-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500 delay-100">
                    {service.summary}
                   </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
