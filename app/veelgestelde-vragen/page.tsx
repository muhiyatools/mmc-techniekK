"use client";

import { useState } from "react";
import Link from "next/link";
import { faqItems, contactInfo } from "@/lib/data";
import Reveal from "../components/Reveal";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      {/* Page header */}
      <section className="relative pt-32 pb-16 lg:pb-20 bg-concrete">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-hairline to-transparent" />
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
                Klantenservice
              </span>
            </div>
            <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[0.95] tracking-tight text-ink mb-5">
              Veelgestelde <span className="text-brand">vragen</span>
            </h1>
            <p className="text-base text-muted max-w-lg leading-relaxed">
              Antwoorden op de meest gestelde vragen over onze diensten, offertes en werkwijze.
            </p>
          </Reveal>
        </div>
      </section>

      {/* FAQ list */}
      <section className="py-16 lg:py-24 bg-base">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="space-y-0">
              {faqItems.map((item, i) => {
                const isOpen = openIndex === i;
                const isFirst = i === 0;
                return (
                  <Reveal key={i} delay={i * 50}>
                    {isFirst ? (
                      /* Featured first question */
                      <div className={`mb-4 rounded-xl border overflow-hidden transition-colors duration-300 ${
                        isOpen ? "border-brand/25 bg-brand/5" : "border-hairline hover:border-brand/20"
                      }`}>
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : i)}
                          className="w-full flex items-start justify-between gap-4 py-7 px-6 text-left group"
                        >
                          <span className={`text-xl lg:text-2xl font-bold leading-snug transition-colors duration-200 ${
                            isOpen ? "text-brand" : "text-ink group-hover:text-brand"
                          }`}>
                            {item.question}
                          </span>
                          <span className={`shrink-0 mt-1 w-7 h-7 flex items-center justify-center border rounded-full transition-all duration-200 ${
                            isOpen ? "border-brand bg-brand text-white rotate-45" : "border-hairline text-muted group-hover:border-brand group-hover:text-brand"
                          }`}>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                            </svg>
                          </span>
                        </button>
                        <div
                          className="overflow-hidden transition-all duration-500 ease-out"
                          style={{ maxHeight: isOpen ? "500px" : "0px", opacity: isOpen ? 1 : 0 }}
                        >
                          <p className="text-base leading-relaxed pb-7 px-6" style={{ color: "#334155" }}>
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* Regular items */
                      <div className={`border-b border-hairline ${isOpen ? "bg-concrete/50" : ""}`}>
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : i)}
                          className="w-full flex items-start justify-between gap-4 py-6 lg:py-7 text-left group"
                        >
                          <span className={`text-base lg:text-lg font-bold transition-colors duration-200 ${isOpen ? "text-brand" : "text-ink group-hover:text-brand"}`}>
                            {item.question}
                          </span>
                          <span className={`shrink-0 mt-1 w-6 h-6 flex items-center justify-center border rounded-full transition-all duration-200 ${
                            isOpen ? "border-brand bg-brand text-white rotate-45" : "border-hairline text-muted group-hover:border-brand group-hover:text-brand"
                          }`}>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                            </svg>
                          </span>
                        </button>
                        <div
                          className="overflow-hidden transition-all duration-500 ease-out"
                          style={{
                            maxHeight: isOpen ? "500px" : "0px",
                            opacity: isOpen ? 1 : 0,
                          }}
                        >
                          <p className="text-sm lg:text-base leading-relaxed pb-6 lg:pb-7 pr-10" style={{ color: "#334155" }}>
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </Reveal>
                );
              })}
            </div>

            {/* Contact CTA */}
            <Reveal delay={300}>
              <div className="mt-14 lg:mt-16 p-8 lg:p-10 bg-mist border border-hairline relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-aurora-1 via-brand/50 to-aurora-2" />
                <h3 className="text-xl font-bold text-ink mb-3">
                  Staat uw vraag er niet bij?
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-6 max-w-md">
                  Neem gerust contact met ons op. We reageren binnen één werkdag en denken graag met u mee.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="px-6 py-3 bg-ink text-white text-sm font-bold uppercase tracking-wide rounded-full hover:bg-brand transition-colors duration-200"
                  >
                    Bel ons
                  </a>
                  <Link
                    href="/contact/"
                    className="px-6 py-3 border border-ink text-ink text-sm font-bold uppercase tracking-wide rounded-full hover:border-brand hover:text-brand transition-colors duration-200"
                  >
                    Stuur een bericht
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
