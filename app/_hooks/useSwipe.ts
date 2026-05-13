"use client";

import { useEffect, useRef } from "react";

type SwipeDirection = "left" | "right" | "up" | "down" | null;

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
}

/**
 * Attaches touch-swipe listeners to a ref'd element.
 * Returns the ref to attach to your container.
 */
export function useSwipe<T extends HTMLElement>(handlers: SwipeHandlers) {
  const ref = useRef<T>(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const threshold = handlers.threshold ?? 50;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      startX.current = e.touches[0].clientX;
      startY.current = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX.current;
      const dy = e.changedTouches[0].clientY - startY.current;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (Math.max(absDx, absDy) < threshold) return;

      let direction: SwipeDirection = null;
      if (absDx > absDy) {
        direction = dx < 0 ? "left" : "right";
      } else {
        direction = dy < 0 ? "up" : "down";
      }

      if (direction === "left")  handlers.onSwipeLeft?.();
      if (direction === "right") handlers.onSwipeRight?.();
      if (direction === "up")    handlers.onSwipeUp?.();
      if (direction === "down")  handlers.onSwipeDown?.();
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend",   onTouchEnd,   { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend",   onTouchEnd);
    };
  }, [handlers, threshold]);

  return ref;
}
