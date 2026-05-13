"use client";

import {
  useRef,
  useState,
  useCallback,
  Children,
  cloneElement,
  isValidElement,
  type ReactNode,
} from "react";

interface SwipeCarouselProps {
  children: ReactNode;
  className?: string;
  /** Extra classes for each slide wrapper */
  slideClassName?: string;
  showDots?: boolean;
  /** Width of each slide, e.g. "85vw" or "100%" */
  slideWidth?: string;
  gap?: number;
}

export default function SwipeCarousel({
  children,
  className = "",
  slideClassName = "",
  showDots = true,
  slideWidth = "85vw",
  gap = 12,
}: SwipeCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = Children.toArray(children);
  const count = slides.length;

  const handleScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const slideW = el.scrollWidth / count;
    const idx = Math.round(el.scrollLeft / slideW);
    setActiveIndex(Math.max(0, Math.min(idx, count - 1)));
  }, [count]);

  const scrollTo = (idx: number) => {
    const el = trackRef.current;
    if (!el) return;
    const slideW = el.scrollWidth / count;
    el.scrollTo({ left: slideW * idx, behavior: "smooth" });
  };

  return (
    <div className={`relative ${className}`}>
      {/* Track */}
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto scrollbar-none snap-x-mandatory"
        style={{ gap, paddingLeft: 16, paddingRight: 16 }}
      >
        {slides.map((child, i) => (
          <div
            key={i}
            className={`flex-none snap-start ${slideClassName}`}
            style={{ width: slideWidth }}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Dots */}
      {showDots && count > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4" aria-hidden="true">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`dot${i === activeIndex ? " active" : ""}`}
              aria-label={`Ga naar slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
