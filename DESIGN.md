# DESIGN.md — MMC Techniek B.V.

## Color Strategy
**Committed** — The logo blue carries 30–50% of the surface. Clean, trustworthy, Dutch. Not the cliché "energy green" or "solar orange." The blue embodies reliability, technical precision, and approachability.

### Palette (OKLCH)

| Token | OKLCH | Hex | Usage |
|-------|-------|-----|-------|
| **Base** | 97% 0.008 240 | `#F4F7FB` | Page background, cool off-white with blue tint |
| **Surface** | 93% 0.015 240 | `#E8EEF6` | Section alternates, form backgrounds |
| **Muted** | 58% 0.02 240 | `#838FA0` | Secondary text, labels, borders |
| **Text** | 28% 0.02 240 | `#2E3542` | Primary text, headings |
| **Ink** | 18% 0.015 240 | `#1A2030` | Maximum contrast, buttons, nav |
| **Brand** | 62% 0.16 250 | `#6BA4F5` | Logo blue. CTAs, links, active states, highlights |
| **Brand-light** | 90% 0.06 250 | `#D4E4FA` | Accent backgrounds, badges, highlights |
| **Brand-dark** | 45% 0.14 250 | `#3B6FC4` | Hover states, emphasis |

### Rules
- Never use `#000` or `#fff`. Tint every neutral toward the brand blue (hue ~240).
- Brand appears in: buttons, links, active nav, badges, icons, progress bar.
- Surface/Base alternate every section for rhythm.
- Orange (#C75B28) is retired from the design system; replaced by brand blue.

## Typography

**Font:** Figtree (Google Fonts) — geometric, warm, highly legible. Not on the reflex-reject list. Feels approachable and professional without being boring.
**Fallback:** system-ui, -apple-system, sans-serif.

| Role | Size | Weight | Line-height | Letter-spacing |
|------|------|--------|-------------|----------------|
| Display | clamp(3rem, 6vw, 5rem) | 800 | 1.05 | -0.03em |
| H1 | clamp(2.5rem, 4vw, 3.5rem) | 700 | 1.1 | -0.02em |
| H2 | clamp(1.75rem, 3vw, 2.5rem) | 700 | 1.2 | -0.01em |
| H3 | 1.25rem | 600 | 1.3 | 0 |
| Body | 1rem (16px) | 400 | 1.7 | 0 |
| Body-sm | 0.875rem | 400 | 1.6 | 0 |
| Label | 0.75rem | 600 | 1.4 | 0.06em |
| Nav | 0.8125rem | 600 | 1 | 0.04em |

- Max line length: 65ch for body text.
- Hierarchy through scale + weight contrast (ratio ≥1.25 between steps).

## Spacing System

Base unit: 4px

| Token | Value |
|-------|-------|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 40px |
| 2xl | 64px |
| 3xl | 96px |
| 4xl | 128px |

- Section vertical padding: 3xl–4xl (desktop), 2xl–3xl (mobile)
- Container max-width: 1280px, horizontal padding: lg

## Elevation

No box shadows for cards. Use subtle border separators or background color shifts instead.

| Token | Value |
|-------|-------|
| flat | none |
| subtle | 0 1px 3px oklch(0% 0 0 / 0.06) |
| float | 0 8px 30px oklch(0% 0 0 / 0.08) |

## Components

### Button
- Primary: bg Ink, text Base, no radius (0px), padding 16px 32px, font Label uppercase
- Hover: bg Brand, text Base
- Secondary: bg transparent, border 1.5px Ink, text Ink

### Badge
- bg Brand-light, text Brand-dark, padding 6px 14px, font Label uppercase
- Dot: 6px circle, bg Brand, inline before text

### Card (use sparingly)
- bg Surface, no radius, padding xl
- No border. Separation via color or spacing, not lines.

### Section Label
- Font Label uppercase, text Muted

## Motion

- Easing: cubic-bezier(0.22, 1, 0.36, 1) — ease-out-quint
- Entrance duration: 600ms
- Hover transitions: 200ms
- Stagger delay: 80ms between siblings

## Layout Principles

- No identical card grids. Vary image sizes, text positions, and aspect ratios.
- Full-bleed sections alternate with contained content.
- Generous whitespace. Let elements breathe.
- Images: slightly desaturated warmth, or high-contrast documentary style.

## Image Organization

Images are organized into folders under `/public/images/`:
- `branding/` — logo variants, brand icons
- `services/` — service-related imagery (warmtepompen, zonnepanelen, etc.)
- `projects/` — project gallery and portfolio images
- `partners/` — client and partner logos
- `certifications/` — certification badges (NEN-3140, VCA)
