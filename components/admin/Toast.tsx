"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";

type Toast = { id: number; text: string; tone: "ok" | "error" };

/** Fire-and-forget toast: `toast("Opgeslagen")`. Quiet, bottom-left, gone after 3s. */
export function toast(text: string, tone: Toast["tone"] = "ok") {
  window.dispatchEvent(new CustomEvent("mmc-toast", { detail: { text, tone } }));
}

export function Toaster() {
  const [items, setItems] = useState<Toast[]>([]);
  useEffect(() => {
    let n = 0;
    const on = (e: Event) => {
      const { text, tone } = (e as CustomEvent<Omit<Toast, "id">>).detail;
      const id = ++n;
      setItems((t) => [...t, { id, text, tone }]);
      setTimeout(() => setItems((t) => t.filter((x) => x.id !== id)), tone === "error" ? 6000 : 3000);
    };
    window.addEventListener("mmc-toast", on);
    return () => window.removeEventListener("mmc-toast", on);
  }, []);
  return (
    <div aria-live="polite" className="pointer-events-none fixed bottom-4 left-4 right-4 z-50 flex flex-col items-start gap-2 sm:left-[264px] lg:left-[264px]">
      {items.map((t) => (
        <div
          key={t.id}
          role={t.tone === "error" ? "alert" : "status"}
          className={`fade-up pointer-events-auto flex max-w-[420px] items-start gap-2.5 rounded-xl px-4 py-3 text-[14px] font-medium shadow-[var(--shadow-float)] ${t.tone === "error" ? "bg-error text-white" : "bg-ink text-white"}`}
        >
          <Icon name={t.tone === "error" ? "alert" : "check"} size={16} className="mt-0.5" />
          {t.text}
        </div>
      ))}
    </div>
  );
}
