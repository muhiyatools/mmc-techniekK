const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'app/aanbod/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const searchStart = '<section className="pt-[104px]';
const searchEnd = '<div className="max-w-[1280px] mx-auto px-5 lg:px-10 instrument-layout">';

const startIndex = content.indexOf(searchStart);
const endIndex = content.indexOf(searchEnd);

if (startIndex !== -1 && endIndex !== -1) {
  const before = content.substring(0, startIndex);
  const after = content.substring(endIndex);
  
  const newMiddle = `<section className="pt-[104px] lg:pt-[114px] bg-bg/50 border-b border-hairline relative z-10">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-10 py-10 lg:py-16">
          <Reveal>
            <div className="flex items-center gap-3 mb-4 md:mb-5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand shadow-sm shadow-brand/20" />
              <span className="text-label text-muted font-black tracking-[0.25em]">{t.pages.aanbod.label}</span>
            </div>
          </Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 md:gap-10">
            <Reveal delay={60}>
              <h1 className="font-display font-black text-[clamp(2.5rem,6vw,6rem)] leading-[0.85] tracking-[-0.04em] text-ink max-w-2xl"
                dangerouslySetInnerHTML={{ __html: t.pages.aanbod.title.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
              />
            </Reveal>
            <Reveal delay={120}>
              <p className="text-base lg:text-xl text-muted/80 font-medium leading-relaxed max-w-sm sm:text-right">
                {t.pages.aanbod.description}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="bg-bg">
        <div className="lg:hidden border-b border-hairline bg-surface sticky top-[94px] z-30">
          <div className="flex gap-1 px-4 py-3 overflow-x-auto scrollbar-none" role="tablist">
            <div className="flex gap-2 mx-auto">
              {services.map((service, i) => (
                <button
                  key={"tab-" + service.slug}
                  role="tab"
                  aria-selected={activeSlug === service.slug}
                  onClick={() => handleCategorySelect(service.slug)}
                  className={"relative flex items-center gap-3 px-5 py-3 text-[12px] font-black uppercase tracking-wider whitespace-nowrap touch-target transition-all shrink-0 rounded-xl border " + (
                    activeSlug === service.slug
                      ? "bg-brand text-white border-brand shadow-lg shadow-brand/20"
                      : "text-muted border-hairline hover:text-ink hover:bg-concrete"
                  )}
                >
                  <span className={"w-4 h-4 shrink-0 " + (activeSlug === service.slug ? "" : "opacity-60")}>
                    {serviceIcons[service.slug]}
                  </span>
                  <span>{serviceTitleMap[service.slug]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>\n\n      `;
      
  fs.writeFileSync(filePath, before + newMiddle + after, 'utf8');
  console.log('Successfully restructured app/aanbod/page.tsx');
} else {
  console.log('Error: search indices not found in app/aanbod/page.tsx');
}
