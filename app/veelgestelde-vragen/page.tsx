"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { contactInfo } from "@/lib/data";
import Reveal from "../components/Reveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function FAQPage() {
  const { t, language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [search, setSearch] = useState("");

  const items = t.sections.faq.items;

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
    );
  }, [search, items]);

  const openCount = openIndex !== null ? 1 : 0;

  return (
    <>
      <section className="pt-[70px] lg:pt-[114px] pb-16 lg:pb-20 bg-concrete border-b border-hairline">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="flex items-center gap-2.5 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
                {t.pages.faqPage.label}
              </span>
            </div>
            <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[0.95] tracking-tight text-ink mb-5"
              dangerouslySetInnerHTML={{ __html: t.pages.faqPage.title.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
            />
            <p className="text-base text-muted max-w-lg leading-relaxed mb-8">
              {t.pages.faqPage.description}
            </p>
          </Reveal>

          <div className="relative max-w-md">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/50 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setOpenIndex(null); }}
              placeholder={language === "nl" ? "Zoek in vragen..." : "Search questions..."}
              className="w-full h-11 pl-11 pr-4 text-sm bg-surface border border-hairline rounded-full focus:outline-none focus:border-brand focus:ring-0 text-ink placeholder:text-muted/40 transition-colors"
            />
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-base">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="max-w-3xl">
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-sm text-muted mb-4">{language === "nl" ? "Geen vragen gevonden voor" : "No questions found for"} &quot;{search}&quot;</p>
                <button onClick={() => setSearch("")} className="text-xs font-bold text-brand uppercase tracking-wide hover:underline">
                  {language === "nl" ? "Wis zoekopdracht" : "Clear search"}
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-[10px] font-bold text-muted/50 uppercase tracking-wider">
                    {filtered.length} {language === "nl" ? "vragen" : "questions"}
                  </p>
                </div>

                <div className="space-y-3">
                  {filtered.map((item, i) => {
                    const isOpen = openIndex === i;
                    return (
                      <Reveal key={i} delay={i * 30}>
                        <div className={`border rounded-lg overflow-hidden transition-all duration-300 ${
                          isOpen ? "border-brand/20 bg-brand/[0.03]" : "border-hairline hover:border-brand/15"
                        }`}>
                          <button
                            onClick={() => setOpenIndex(isOpen ? null : i)}
                            className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left group"
                          >
                            <span className={`text-sm lg:text-base font-bold leading-snug transition-colors duration-200 ${
                              isOpen ? "text-brand" : "text-ink group-hover:text-brand"
                            }`}>
                              {item.question}
                            </span>
                            <span className={`shrink-0 mt-0.5 w-6 h-6 flex items-center justify-center border rounded-full transition-all duration-300 ${
                              isOpen ? "border-brand bg-brand text-white" : "border-hairline text-muted group-hover:border-brand group-hover:text-brand"
                            }`}>
                              <svg className={`w-3 h-3 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                              </svg>
                            </span>
                          </button>
                          <div
                            className="grid transition-all duration-400 ease-out"
                            style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                          >
                            <div className="overflow-hidden">
                              <p className="text-sm leading-relaxed pb-5 px-6 text-copy">
                                {item.answer}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            )}

            <Reveal delay={200}>
              <div className="mt-14 lg:mt-16 p-8 lg:p-10 bg-mist border border-hairline rounded-lg relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-aurora-1 via-brand/50 to-aurora-2" />
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div>
                    <h3 className="text-base font-bold text-ink mb-1.5">
                      {t.pages.faqPage.contact.title}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed max-w-sm">
                      {t.pages.faqPage.contact.description}
                    </p>
                  </div>
                  <div className="flex gap-3 shrink-0">
                    <a
                      href={`tel:${contactInfo.phone}`}
                      className="px-5 py-2.5 bg-ink text-white text-[10px] font-bold uppercase tracking-wide rounded-full hover:bg-brand transition-colors"
                    >
                      {t.pages.faqPage.contact.call}
                    </a>
                    <Link
                      href="/contact/"
                      className="px-5 py-2.5 border border-ink text-ink text-[10px] font-bold uppercase tracking-wide rounded-full hover:border-brand hover:text-brand transition-colors"
                    >
                      {t.pages.faqPage.contact.message}
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
