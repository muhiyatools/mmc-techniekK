"use client";

import { useState, useEffect } from "react";

/**
 * Returns true when the primary input is a touch/pointer device
 * (i.e. no fine-pointer hover capability).
 * SSR-safe: returns false on the server.
 */
export function useTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
    setIsTouch(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isTouch;
}
