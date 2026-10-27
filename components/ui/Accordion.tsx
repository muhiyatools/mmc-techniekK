"use client";

import { useId, useState, type ReactNode } from "react";
import { Icon } from "./Icon";

export type AccordionItem = { id: string; title: ReactNode; content: ReactNode };

/** FAQ-style accordion. One item open at a time; height animates via CSS grid rows. */
export function Accordion({ items, defaultOpen = null, size = "md" }: { items: AccordionItem[]; defaultOpen?: string | null; size?: "md" | "sm" }) {
  const [open, setOpen] = useState<string | null>(defaultOpen);
  const base = useId();

  return (
    <div className="border-b border-line">
      {items.map((item) => {
        const isOpen = open === item.id;
        const btn = `${base}-${item.id}-btn`;
        const panel = `${base}-${item.id}-panel`;
        return (
          <div key={item.id} className="border-t border-line" data-open={isOpen}>
            <h3>
              <button
                id={btn}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panel}
                onClick={() => setOpen(isOpen ? null : item.id)}
                className={`flex w-full items-center justify-between gap-6 text-left font-semibold [font-stretch:104%] ${size === "sm" ? "py-5 text-[17px]" : "py-6 text-[17px] sm:text-[19px]"}`}
              >
                <span>{item.title}</span>
                <span className="pm">
                  <Icon name="plus" size={16} />
                </span>
              </button>
            </h3>
            <div id={panel} role="region" aria-labelledby={btn} className="acc-panel" inert={!isOpen}>
              <div>
                <div className="pb-6 pr-0 text-[16px] leading-[1.65] text-slate sm:pr-16 sm:text-[17px]">{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
