"use client";

import { useState } from "react";
import HairlineDivider from "./HairlineDivider";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  title?: string;
}

export default function FaqAccordion({ items, title }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="max-w-[720px] mx-auto">
      {title && (
        <h3 className="font-display font-bold uppercase tracking-[-0.005em] text-ink text-[1.25rem] leading-tight mb-6">
          {title}
        </h3>
      )}
      <div className="divide-y divide-hairline border-t border-hairline">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="py-0">
              <button
                onClick={() => toggle(index)}
                className="flex items-center justify-between gap-4 w-full py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-base rounded-sm"
                aria-expanded={isOpen}
              >
                <span className="text-[0.9375rem] font-semibold text-ink font-sans leading-snug">
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className={`block w-5 h-5 shrink-0 text-muted transition-transform duration-200 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>
              <div
                className="grid transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  gridTemplateRows: isOpen ? "1fr" : "0fr",
                }}
              >
                <div className="overflow-hidden">
                  <p className="text-[0.9375rem] leading-[1.7] text-copy/80 font-sans pb-5 pr-8">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
