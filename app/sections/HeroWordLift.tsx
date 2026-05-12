"use client";

import { useEffect, useRef } from "react";

interface HeroWordLiftProps {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "div" | "span";
  stagger?: number;
  duration?: number;
}

/**
 * Splits text into words and animates each word from translateY(115%) → 0
 * with staggered delays. Respects prefers-reduced-motion.
 */
export default function HeroWordLift({
  children,
  className = "",
  as: Tag = "h1",
  stagger = 55,
  duration = 720,
}: HeroWordLiftProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const words = children.split(" ");

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Check reduced motion
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const wordSpans = el.querySelectorAll<HTMLSpanElement>(".word-inner");

    if (prefersReduced) {
      wordSpans.forEach((span) => {
        span.style.transform = "translateY(0)";
        span.style.opacity = "1";
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            wordSpans.forEach((span, i) => {
              setTimeout(() => {
                span.style.transform = "translateY(0)";
                span.style.opacity = "1";
              }, i * stagger);
            });
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [stagger]);

  return (
    <Tag
      ref={containerRef}
      className={className}
      style={{ overflow: "visible" }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="word-wrapper"
          style={{
            display: "inline-block",
            overflow: "hidden",
            verticalAlign: "bottom",
            lineHeight: 1.1,
          }}
        >
          <span
            className="word-inner"
            style={{
              display: "inline-block",
              transform: "translateY(115%)",
              opacity: 0,
              transition: `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${duration * 0.6}ms cubic-bezier(0.16, 1, 0.3, 1)`,
              willChange: "transform, opacity",
            }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}
