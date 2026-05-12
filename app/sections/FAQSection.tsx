"use client";

import { useState } from "react";
import Link from "next/link";
import { faqItems } from "@/lib/data";
import Reveal from "../components/Reveal";

const previewFaq = faqItems.slice(0, 4);

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative py-24 lg:py-32 bg-concrete">
      {/* Top hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-hairline to-transparent" />

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left — sticky header */}
          <div className="lg:col-span-4">
            <Reveal>
              <div className="lg:sticky lg:top-28">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
                    Veelgestelde vragen
                  </span>
                </div>
                <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.0] tracking-tight text-ink mb-5">
                  Antwoorden op uw <span className="text-brand">vragen</span>
                </h2>
                <p className="text-base text-muted leading-relaxed mb-8 max-w-sm">
                  Hier vindt u de meest gestelde vragen over onze diensten, offertes en werkwijze.
                </p>
                <Link
                  href="/veelgestelde-vragen/"
                  className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-ink hover:text-brand transition-colors duration-200"
                >
                  Bekijk alle vragen
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Right — accordion */}
          <div className="lg:col-span-8">
            <div className="space-y-0">
              {previewFaq.map((item, i) => {
                const isOpen = openIndex === i;
                const isFirst = i === 0;
                return (
                  <Reveal key={i} delay={i * 60}>
                    {isFirst ? (
                      /* Featured first question */
                      <div className={`mb-3 rounded-xl border overflow-hidden transition-colors duration-300 ${
                        isOpen ? "border-brand/25 bg-brand/5" : "border-hairline hover:border-brand/20 bg-mist/40"
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
                          style={{ maxHeight: isOpen ? "400px" : "0px", opacity: isOpen ? 1 : 0 }}
                        >
                          <p className="text-copy text-base leading-relaxed pb-7 px-6">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* Regular items */
                      <div className={`border-b border-hairline ${isOpen ? "bg-mist/60" : ""}`}>
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : i)}
                          className="w-full flex items-start justify-between gap-4 py-6 lg:py-7 text-left group px-2 -mx-2"
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
                            maxHeight: isOpen ? "300px" : "0px",
                            opacity: isOpen ? 1 : 0,
                          }}
                        >
                          <p className="text-copy text-sm lg:text-base leading-relaxed pb-6 lg:pb-7 pr-10 px-2">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom hairline */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-hairline to-transparent" />
    </section>
  );
}
