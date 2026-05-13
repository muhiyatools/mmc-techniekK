"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { contactInfo } from "@/lib/data";
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

  return (
    <div className="pt-[70px] lg:pt-[114px]">
      <section className="border-b border-hairline bg-concrete pb-12 lg:pb-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pt-12 lg:pt-16">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
              {t.pages.faqPage.label}
            </span>
          </div>
          <h1 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] font-extrabold leading-[0.92] tracking-tight mb-4"
            style={{ color: "#0f172a" }}
            dangerouslySetInnerHTML={{ __html: t.pages.faqPage.title.replace(/<brand>/g, '<span class="text-brand">').replace(/<\/brand>/g, '</span>') }}
          />
          <p className="text-sm text-muted leading-relaxed max-w-lg mb-8">
            {t.pages.faqPage.description}
          </p>

          <div className="relative max-w-sm">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-muted/40 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setOpenIndex(null); }}
              placeholder={language === "nl" ? "Zoek in vragen..." : "Search questions..."}
              className="w-full h-10 pl-10 pr-4 text-sm bg-surface border border-hairline rounded-full focus:outline-none focus:border-brand focus:ring-0 transition-colors"
              style={{ color: "#0f172a" }}
            />
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="max-w-2xl">
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-muted mb-4">
                  {language === "nl" ? "Geen vragen gevonden voor" : "No questions found for"} &quot;{search}&quot;
                </p>
                <button onClick={() => setSearch("")} className="text-[10px] font-bold text-brand uppercase tracking-wider hover:underline">
                  {language === "nl" ? "Wis zoekopdracht" : "Clear search"}
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.map((item, i) => {
                  const isOpen = openIndex === i;
                  return (
                    <div key={i} className="border border-hairline rounded-lg overflow-hidden transition-colors duration-200" style={{ borderColor: isOpen ? "#42a8f240" : undefined, background: isOpen ? "#f8fafc" : undefined }}>
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : i)}
                        className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left group"
                      >
                        <span className="text-sm font-bold leading-snug transition-colors duration-200" style={{ color: isOpen ? "#42a8f2" : "#0f172a" }}>
                          {item.question}
                        </span>
                        <span className="shrink-0 mt-0.5 w-5 h-5 flex items-center justify-center border rounded-full transition-all duration-200" style={{
                          borderColor: isOpen ? "#42a8f2" : undefined,
                          background: isOpen ? "#42a8f2" : undefined,
                        }}>
                          <svg className="w-2.5 h-2.5 transition-transform duration-200" style={{ transform: isOpen ? "rotate(45deg)" : undefined, color: isOpen ? "#fff" : "#64748b" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                          </svg>
                        </span>
                      </button>
                      <div className="grid transition-all duration-400 ease-out" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
                        <div className="overflow-hidden">
                          <p className="text-sm leading-relaxed pb-5 px-5" style={{ color: "#334155" }}>
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-12 p-6 lg:p-8 border border-hairline rounded-lg bg-concrete">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                <div>
                  <p className="text-sm font-bold mb-1" style={{ color: "#0f172a" }}>
                    {t.pages.faqPage.contact.title}
                  </p>
                  <p className="text-xs text-muted leading-relaxed max-w-xs">
                    {t.pages.faqPage.contact.description}
                  </p>
                </div>
                <div className="flex gap-3 shrink-0">
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-wide rounded-full transition-colors"
                    style={{ background: "#0f172a", color: "#fff" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#42a8f2" }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#0f172a" }}
                  >
                    {t.pages.faqPage.contact.call}
                  </a>
                  <Link
                    href="/contact/"
                    className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-wide rounded-full transition-colors"
                    style={{ border: "1px solid #0f172a", color: "#0f172a" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#42a8f2"; e.currentTarget.style.color = "#42a8f2" }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#0f172a"; e.currentTarget.style.color = "#0f172a" }}
                  >
                    {t.pages.faqPage.contact.message}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
