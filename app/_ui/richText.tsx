import React from "react";

/**
 * Render a translated string that may contain `<brand>…</brand>` emphasis
 * markers as real React nodes — no `dangerouslySetInnerHTML`. Replaces the
 * regex `__html` hack that was repeated across ~8 files.
 *
 * `brandClassName` defaults to the AA-safe text blue (`text-brand-ink`);
 * pass `"text-brand"` for headings that sit on a dark surface.
 */
export function renderRich(
  text: string,
  brandClassName = "text-brand-ink"
): React.ReactNode {
  return text.split(/(<brand>[\s\S]*?<\/brand>)/g).map((part, i) => {
    const match = part.match(/^<brand>([\s\S]*?)<\/brand>$/);
    return match ? (
      <span key={i} className={brandClassName}>
        {match[1]}
      </span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    );
  });
}
