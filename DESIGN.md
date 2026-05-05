# DESIGN.md — MMC Techniek B.V.

## Stance

Daylight, on-brand, futuristic by precision (not by darkness). The site reads as a Dutch precision engineering studio for homeowners. Trust comes from craft visible at the pixel level: hairline borders, layered light surfaces, generous void, restrained iridescent accents, exact typography. The work IS the work.

PRODUCT.md anti-references hold: no dark themes, no corporate coldness, no greenwashing. This file encodes the daylight visionOS variant of the Committed blue identity.

## Color strategy

**Committed.** The logo blue (--color-brand) carries 30–50% of the surface across CTAs, links, active states, the instrument dot, hairline accents, and the footer accent block. Iridescence is layered on top as a thin prism (1–2px), never as fill.

### Palette (OKLCH)

| Role | Token | OKLCH | Usage |
|------|-------|-------|-------|
| Void | `--color-base` | 98% 0.004 240 | Page background. Pearled cool off-white. |
| Pearl | `--color-concrete` | 95% 0.010 240 | Section alternate, gentle ground for content. |
| Mist | `--color-mist` | 90% 0.018 240 | Layered shelf surface (forms, hero panel, certifications). |
| Hairline | `--color-hairline` | 82% 0.022 240 | All 1px borders and dividers. Tinted, never grey. |
| Muted | `--color-muted` | 55% 0.025 240 | Secondary text, technical labels, breadcrumbs. |
| Copy | `--color-copy` | 26% 0.025 240 | Body text. |
| Ink | `--color-ink` | 14% 0.014 240 | Primary buttons, headlines on Pearl. Never #000. |
| Brand | `--color-brand` | 60% 0.18 250 | Logo blue. CTAs, links, active states, dot, hairlines. |
| Brand-deep | `--color-brand-deep` | 38% 0.18 250 | Hover, footer block, emphasis. |
| Aurora-1 | `--color-aurora-1` | 78% 0.10 220 | Iridescent stop A (cool cyan-blue). Hairlines + dots only. |
| Aurora-2 | `--color-aurora-2` | 80% 0.09 290 | Iridescent stop B (cool violet). Hairlines + dots only. |

### Rules

- Never `#000` or `#fff`. Every neutral tinted toward hue 240.
- Brand carries 30–50% of the surface across the page. Concentrated in nav active state, CTAs, instrument dots, and the footer block.
- Surfaces alternate Void → Pearl → Void → Pearl for rhythm; Mist appears only as a discrete shelf above either ground.
- Iridescence is restricted to: Aurora hairlines (1px gradient strips), the InstrumentDot focus ring, and the ReadingProgress bar. Never as text fill, never as a default card background, never on hero imagery.
- Orange (`#C75B28`) is retired. Brand blue replaces every previous orange use.

## Typography

**Display**: Barlow Condensed, weights 600/700/800 — high-condensation geometric, all-caps treatments.
**Sans**: Barlow, weights 400/500/600 — humanist sans for body and UI.
**Fallback**: system-ui, -apple-system, sans-serif.

Both are loaded via `next/font/google` and exposed as `--font-barlow` + `--font-barlow-condensed`. Neither appears in the impeccable reflex-reject list.

| Role | Size | Weight | LH | Tracking |
|------|------|--------|----|----------|
| display | clamp(2.5rem, 6vw, 5.5rem) | 800 | 0.86 | -0.02em |
| h1 | clamp(2rem, 4vw, 3.5rem) | 700 | 1.0 | -0.015em |
| h2 | clamp(1.5rem, 3vw, 2.25rem) | 700 | 1.1 | -0.01em |
| h3 | 1.25rem | 600 | 1.3 | 0 |
| lead | 1.0625rem | 400 | 1.65 | 0 |
| body | 1rem | 400 | 1.7 | 0 |
| small | 0.8125rem | 400 | 1.6 | 0 |
| label | 0.6875rem | 700 | 1.4 | 0.18em (uppercase) |
| micro | 0.625rem | 700 | 1.4 | 0.24em (uppercase) |

Headlines use sentence case in the source (`aria-label`) but render as display all-caps via Barlow Condensed where the rhythm calls for it. Body lines cap at 65–75ch.

## Spacing & layout

Base unit 4px. Section vertical padding 96–160px desktop, 64–96px mobile. Container max-width 1280px, gutter 24/40px. Default flow is left-aligned single column. Asymmetric two-column appears on hero, about, contact. The 12-column grid is available for editorial blocks.

No box shadows on cards. Depth comes from surface contrast (Void → Pearl → Mist) plus a 1px Hairline border, optionally with an Aurora top stripe.

## Components

### Shelf
A Mist-tinted layered surface with a 1px Hairline border. Optional Aurora-hairline stripe on the top edge. Used for: hero instrument panel, contact form, certification plates. Replaces the default "card" pattern.

### MicroLabel / Overline
Tracked uppercase, font Label or Micro. Variants: `muted` (default), `brand`, `inverse` (for the brand block). Sits above headings, never as a pill or filled badge.

### InstrumentDot
6px brand circle with a soft 3px ring. Used in nav (active/hover) and as an inline mark in section overlines.

### HairlineDivider
1px Hairline rule. Optional Aurora variant draws an iridescent 1px prism. Optional `draw` prop animates from `scaleX(0)` to 1 on enter.

### MetricRow
Tabular-figures numeric callouts (`16 jaar · 4 stappen · 24 uur offerte`). Replaces the hero-metric template. Inline, hairline-separated, never giant.

### Button
- **Primary**: `bg-ink text-base`, `rounded-full`, font Label uppercase, hover `bg-brand`.
- **Secondary**: `bg-transparent border-1 border-ink`, hover `border-brand text-brand`.
- **Brand-CTA** (used in Footer): `bg-brand text-base`, hover `bg-brand-deep`.

### Card (use sparingly)
Default to no card. When a discrete surface is needed, use Shelf. No border-radius. Depth through surface contrast plus 1px Hairline.

### SectionBadge
Replaced by MicroLabel + InstrumentDot lockup.

## Motion

| Token | Value |
|-------|-------|
| ease.out | cubic-bezier(0.22, 1, 0.36, 1) |
| ease.outQuint | cubic-bezier(0.16, 1, 0.3, 1) — used for hero word-lift |
| dur.entrance | 600ms |
| dur.hover | 180ms |
| stagger | 60ms between siblings |

Signature motions:

1. **Hero word-lift** — each word translates from 115% Y to 0, masked by overflow-clip. Stagger 55ms between words, 720ms duration, ease.outQuint.
2. **Hairline draw-in** — 1px rules scale from `scaleX(0)` → 1 on viewport enter. 900ms, ease.outQuint, transform-origin left.
3. **Aurora drift** — the iridescent gradient shifts horizontally over 18s, linear, infinite. Subtle, slow, never feels like a screensaver.
4. **Depth parallax** — hero instrument shelf translates Y at 0.4× scroll rate. Disabled under `prefers-reduced-motion`.

Animate transform and opacity only. Never animate width/height/top/left.

## Layout principles

- Vary section rhythm. No two sections share the exact same column / spacing layout in sequence.
- Full-bleed alternates with contained content. Imagery breathes against generous void.
- Cards are the lazy answer. Default is type-first, list-first, or asymmetric editorial.
- Hairline borders carry the depth, not shadows.
- Imagery is documentary-honest (real installations) and slightly cool-balanced; no stock energy-company hero shots.

## Image organization

Images live under `/public/images/`:

- `branding/` — logo variants, brand icons
- `services/` — service photography (warmtepompen, zonnepanelen, etc.)
- `projects/` — project gallery
- `partners/` — client and partner logos
- `certifications/` — certification badges (NEN-3140, VCA)
