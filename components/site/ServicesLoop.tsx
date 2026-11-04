"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, ViewTransition } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { href, type Locale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/ui";

export type LoopService = {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
};

// Geometry in a 560 × 560 box (design/boards/Home.html).
const C = 280;
const R = 180;
const NODE = 60;
const START = -137; // arc starts just after the last ring node (maintenance → generate)
const NODE_GAP = 13; // degrees between arrow tip and the node it points at
const STROKE = 5;

const rad = (deg: number) => (deg * Math.PI) / 180;
const nodeAngle = (i: number) => -90 + i * 60;
const pos = (deg: number, r = R) => ({ x: C + r * Math.cos(rad(deg)), y: C + r * Math.sin(rad(deg)) });

/** Clockwise sweep from START to just before node i; the core (6) closes the loop. */
function sweepFor(i: number) {
  if (i < 0) return 0;
  if (i >= 6) return 352;
  return nodeAngle(i) - NODE_GAP - START;
}

// Full circle starting at START, drawn clockwise, so a dash of length `sweep` is the arc.
const s = pos(START);
const e = pos(START + 180);
const RING = `M${s.x} ${s.y} A${R} ${R} 0 1 1 ${e.x} ${e.y} A${R} ${R} 0 1 1 ${s.x} ${s.y}`;

/**
 * Arrowhead drawn at angle 0 (3 o'clock), pointing clockwise (down). Its shape follows the
 * head of the C in the logo: a flat base about 2.4× the stroke, a short tip.
 */
const HEAD_W = STROKE * 2.6;
const HEAD_L = STROKE * 2;
const HEAD = `M${C + R - HEAD_W / 2} ${C} L${C + R + HEAD_W / 2} ${C} L${C + R} ${C + HEAD_L} Z`;

export function ServicesLoop({ lang, services, coreIndex }: { lang: Locale; services: LoopService[]; coreIndex: number }) {
  const d = getDict(lang);
  const selected = 0; // resting state of the diagram before any hover
  const [hover, setHover] = useState<number | null>(null);
  const [drawn, setDrawn] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const maskId = `${uid.replace(/[^a-zA-Z0-9_-]/g, "")}-flow`;
  const active = hover ?? selected;

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setDrawn(true);
        io.disconnect();
      }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const ringIndex = (i: number) => (i === coreIndex ? 6 : i);
  const sweep = drawn ? sweepFor(ringIndex(active)) : 0;
  const ring = services.filter((_, i) => i !== coreIndex);
  const core = services[coreIndex];

  return (
    <div className="grid items-start gap-12 xl:grid-cols-[minmax(520px,0.82fr)_minmax(0,1.18fr)] xl:gap-16 3xl:gap-24">
      {/* Diagram: decorative mirror of the list; the list is the accessible control. */}
      <div ref={boxRef} className="relative mx-auto hidden aspect-square w-full max-w-[560px] sm:block 3xl:max-w-[720px] xl:sticky xl:top-[calc(var(--header-h)+40px)]">
        <svg viewBox="0 0 560 560" className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
          <circle cx={C} cy={C} r={250} fill="none" stroke="var(--color-line)" strokeWidth="1" strokeDasharray="2 8" />
          <circle cx={C} cy={C} r={R} fill="none" stroke="var(--color-line)" strokeWidth="1.5" />
          <path
            d={RING}
            pathLength={360}
            fill="none"
            stroke="var(--color-signal)"
            strokeWidth={STROKE}
            strokeLinecap="round"
            style={{
              strokeDasharray: `${sweep} 360`,
              transition: `stroke-dasharray ${drawn && hover === null ? "var(--dur-draw)" : "var(--dur-slow)"} var(--ease-in-out)`,
            }}
          />
          <defs>
            <mask id={maskId}>
              <path
                d={RING}
                pathLength={360}
                fill="none"
                stroke="white"
                strokeWidth={STROKE + 2}
                style={{ strokeDasharray: `${Math.max(sweep - 8, 0)} 360`, transition: "stroke-dasharray var(--dur-slow) var(--ease-in-out)" }}
              />
            </mask>
          </defs>
          <g mask={`url(#${maskId})`} style={{ opacity: sweep > 24 ? 1 : 0, transition: "opacity var(--dur)" }}>
            <path d={RING} className="flow" />
          </g>
          <path
            d={HEAD}
            fill="var(--color-signal)"
            stroke="var(--color-signal)"
            strokeWidth="2"
            strokeLinejoin="round"
            style={{
              transformOrigin: `${C}px ${C}px`,
              transform: `rotate(${START + sweep}deg)`,
              opacity: sweep > 0 ? 1 : 0,
              transition: `transform ${drawn && hover === null ? "var(--dur-draw)" : "var(--dur-slow)"} var(--ease-in-out), opacity var(--dur)`,
            }}
          />
        </svg>

        {ring.map((svc, j) => {
          const i = services.indexOf(svc);
          const p = pos(nodeAngle(j));
          const lp = pos(nodeAngle(j), R + 66);
          const on = active === i;
          const reached = drawn && ringIndex(active) >= j;
          return (
            <div key={svc.slug} aria-hidden="true">
              <Link
                href={href(lang, `/diensten/${svc.slug}`)}
                tabIndex={-1}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                className={`absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full transition-[background-color,box-shadow,color,transform] duration-[var(--dur)] ease-[var(--ease-out)] hover:scale-[1.06] ${
                  on
                    ? "bg-blue text-white shadow-[0_0_0_8px_var(--color-sky)]"
                    : reached
                      ? "bg-white text-blue shadow-[inset_0_0_0_1.5px_var(--color-signal)]"
                      : "bg-white text-ink shadow-[inset_0_0_0_1.5px_var(--color-line-strong)]"
                }`}
                style={{ left: `${(p.x / 560) * 100}%`, top: `${(p.y / 560) * 100}%`, width: `${(NODE / 560) * 100}%`, height: `${(NODE / 560) * 100}%` }}
              >
                <Icon name={svc.slug as IconName} size={24} />
              </Link>
              <span
                className={`t-mono pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap transition-colors duration-[var(--dur)] ${on ? "text-blue-deep" : "text-slate"}`}
                style={{ left: `${(lp.x / 560) * 100}%`, top: `${(lp.y / 560) * 100}%` }}
              >
                {svc.kicker}
              </span>
            </div>
          );
        })}

        {core && (
          <Link
            href={href(lang, `/diensten/${core.slug}`)}
            tabIndex={-1}
            aria-hidden="true"
            onMouseEnter={() => setHover(coreIndex)}
            onMouseLeave={() => setHover(null)}
            className={`absolute left-1/2 top-1/2 flex aspect-square w-[35.7%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1.5 rounded-full text-center transition-colors duration-[var(--dur)] ${
              active === coreIndex ? "bg-ink text-white" : "bg-paper text-ink hover:bg-sky"
            }`}
          >
            <Icon name="verduurzaming" size={28} />
            <span className="t-mono opacity-80">{String(coreIndex + 1).padStart(2, "0")}</span>
            <span className="t-h3 text-[18px]">{core.title}</span>
            <span className="text-[13px] opacity-80">{d.home.loopCore}</span>
          </Link>
        )}
      </div>

      {/* The list: every row goes straight to its service page. */}
      <ul className="border-b border-line" onMouseLeave={() => setHover(null)}>
        {services.map((svc, i) => {
          const on = active === i;
          return (
            <li key={svc.slug} className="border-t border-line">
              <Link
                href={href(lang, `/diensten/${svc.slug}`)}
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                className="group grid grid-cols-[32px_minmax(0,1fr)_44px] items-center gap-x-4 px-1 py-5 transition-colors duration-[var(--dur)] ease-[var(--ease-out)] hover:bg-paper focus-visible:bg-paper sm:grid-cols-[48px_minmax(0,1fr)_48px] sm:px-3 sm:py-6 3xl:py-8"
              >
                <span className={`t-mono transition-colors ${on ? "text-blue" : "text-graphite"}`}>{String(i + 1).padStart(2, "0")}</span>
                <span className="flex min-w-0 flex-col gap-1.5 transition-transform duration-[var(--dur)] ease-[var(--ease-out)] group-hover:translate-x-1 group-focus-visible:translate-x-1">
                  <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <ViewTransition name={`service-${svc.slug}`} share="morph" default="none">
                      <span className="t-h3 text-[21px] sm:text-[28px] 3xl:text-[34px]">{svc.title}</span>
                    </ViewTransition>
                    <span className="t-mono text-graphite">{svc.kicker}</span>
                  </span>
                  <span className="truncate text-[15px] text-slate sm:text-[16px]">{svc.summary}</span>
                </span>
                <span
                  className="grid size-11 place-items-center rounded-full shadow-[inset_0_0_0_1.5px_var(--color-line-strong)] transition-[transform,background-color,box-shadow,color] duration-[var(--dur)] ease-[var(--ease-out)] group-hover:-rotate-45 group-hover:bg-blue group-hover:text-white group-hover:shadow-none group-focus-visible:-rotate-45 group-focus-visible:bg-blue group-focus-visible:text-white group-focus-visible:shadow-none group-active:scale-95 sm:size-12"
                >
                  <Icon name="arrow" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
