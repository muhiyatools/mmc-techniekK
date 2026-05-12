# Plan: Enhance Landing Page & Navbar for MMC Techniek

## Goal

Elevate the MMC Techniek landing page and navbar to production-grade brand quality by applying the DESIGN.md design system (Committed blue strategy, OKLCH palette, Barlow typography, shelf/motion tokens) and the frontend-design skill's emphasis on distinctive aesthetic direction. The current implementation is structurally sound but misses several signature design-system motions (hero word-lift, hairline draw-in), has incomplete landing page composition (two key sections are not rendered), and the navbar relies on shadows rather than hairline-based depth. This plan fixes those gaps, brings the page to full fidelity with the design system, and adds polish that makes the brand feel genuinely crafted rather than templated.

## Architecture

### Design Register
- **Brand** — marketing/landing site where design IS the product (from PRODUCT.md)
- **Strategy**: Committed blue (brand carries 30–50% of surface)
- **Theme**: Daylight, cool off-white base, no dark mode
- **Differentiation**: "Daylight visionOS for Dutch homeowners" — precision engineering visible at pixel level, iridescent accents as thin prisms, documentary-honest imagery, zero shadows

### Aesthetic Direction
- **Tone**: Warm + mechanical + opinionated (DESIGN.md stance: "Dutch precision engineering studio for homeowners")
- **Color**: Restrained-committed — cool pearled whites (98%→95%→90% lightness), brand blue (OKLCH 60% 0.18 250) carries CTAs/links/dots, iridescent aurora restricted to 1px hairlines
- **Typography**: Barlow Condensed (display, 800 weight, all-caps) + Barlow (sans, 400/500/600 body). High contrast scale (≥1.25 ratio)
- **Motion**: Hero word-lift (each word 115% Y→0, stagger 55ms, ease-outQuint), hairline draw-in (scaleX 0→1 on enter, 900ms), aurora drift (18s infinite gradient shift)

### Key Design Decisions
1. **No box shadows anywhere** — depth comes from surface contrast (Void → Pearl → Mist) plus 1px Hairline border, optionally with Aurora top stripe
2. **No card defaults** — use Shelf (Mist + Hairline + optional Aurora stripe) when a surface is needed
3. **InstrumentDot** (6px brand circle with 3px ring) replaces generic bullet markers
4. **HairlineDivider** with optional `draw` prop animates on enter
5. **Hero word-lift** is the signature motion — implemented as `overflow-hidden` wrapper per word with translateY animation via IntersectionObserver

### Landing Page Flow (top to bottom)
1. **Header** (fixed, aurora top stripe, TrustBar)
2. **Hero** (full-bleed image, instrument shelf, word-lift H1, metric row)
3. **Services** (magazine-style grid, first card spans 2 cols)
4. **Process** (4-step numbered grid, currently NOT rendered)
5. **ProjectsPreview** (asymmetric image grid, currently NOT rendered)
6. **TrustStrip** (numbered reasons + image + stat plaques)
7. **Client Logos** (5-col grid)
8. **FAQSection** (sticky header + accordion)
9. **PreFooterCTA** (brand-blue CTA band)
10. **Footer** (carbon-black with brand accents)

## Phases

### Phase 1: Hero Enhancement — Word-Lift & Signature Motions

**Objective**: Implement the DESIGN.md hero word-lift animation and depth parallax, replacing the current generic fade-in reveal.

- **1a**: Split H1 heading into individual word `<span>` elements wrapped in `overflow-hidden` containers for the word-lift effect
- **1b**: Create `HeroWordLift` client component with IntersectionObserver that applies `translateY(115%) → translateY(0)` with `55ms` stagger per word, `720ms` duration, `ease-outQuint` cubic-bezier(0.16, 1, 0.3, 1)
- **1c**: Add depth parallax to the hero instrument shelf — translateY at 0.4× scroll rate, disabled under `prefers-reduced-motion`
- **1d**: Replace current scroll-based image opacity fade with the parallax effect
- **1e**: Ensure the aurora top stripe on the hero shelf uses the `animate-aurora-drift` class (already in globals.css)

**Files**: `app/page.tsx` (extract hero into a dedicated section file `app/sections/HeroSection.tsx`, rewrite inline hero)

### Phase 2: Navbar Polish — Shadow Removal & Hairline Depth

**Objective**: Align the header with DESIGN.md by removing box shadows and using hairline-based depth, then polish micro-interactions.

- **2a**: Remove `shadow-[0_4px_20px_rgba(15,23,42,0.10)]` from header — replace with `border-b border-hairline` for scroll state
- **2b**: Add subtle background shift on scroll: `bg-base` → `bg-surface` instead of shadow
- **2c**: Ensure the TrustBar (`bg-ink`) sits flush below the nav row, using `border-b border-hairline` for visual separation
- **2d**: Polish the "Aanbod" dropdown — add aurora top stripe (already present), ensure `animate-dropdown-in` uses the correct easing (ease.outQuint cubic-bezier(0.16, 1, 0.3, 1))
- **2e**: Add InstrumentDot (6px brand circle) to active nav item instead of the 2px underline bar
- **2f**: Ensure mobile menu honors the design system (no hardcoded colors, use CSS variables)

**Files**: `app/components/Header.tsx`, `app/components/TrustBar.tsx`

### Phase 3: Landing Page Composition — Add Missing Sections

**Objective**: Complete the landing page narrative by adding Process and ProjectsPreview sections in the correct order, with proper Reveal staggering.

- **3a**: Import `Process` and `ProjectsPreview` into `app/page.tsx` between Services and TrustStrip
- **3b**: Ensure section background alternation: Services (`bg-concrete`) → Process (`bg-concrete` — currently same, consider `bg-base` for visual rhythm per DESIGN.md alternating rule)
- **3c**: Adjust section spacing to match the DESIGN.md spec (96–160px desktop, 64–96px mobile)
- **3d**: Add anchor IDs for each section (`#diensten`, `#werkwijze`, `#projecten`) to support deep-linking from footer

**Files**: `app/page.tsx`

### Phase 4: Hairline Draw-In & Section Polish

**Objective**: Implement the signature hairline draw-in animation across section dividers, and polish each section for design-system consistency.

- **4a**: Create a `HairlineDivider` component with optional `draw` prop that animates `scaleX(0)→1` on viewport enter (900ms, ease-outQuint, transform-origin left)
- **4b**: Apply `HairlineDivider` to section top/bottom borders in place of current static `h-px` divs
- **4c**: Audit each section for DESIGN.md compliance:
  - TrustStrip: number large ghost numbers use inline style `oklch(60% 0.18 250 / 0.12)` — replace with CSS variable `var(--color-brand)` at reduced opacity
  - FAQSection: inline `style={{ color: "#334155" }}` → replace with `text-copy` Tailwind class
  - PreFooterCTA: ensure `bg-brand` section uses proper `var(--color-brand)` not hardcoded
- **4d**: Add `tabular-nums` class to all numerical displays (years, metrics, step numbers)

**Files**: `app/components/HairlineDivider.tsx` (new), `app/globals.css` (any missing util classes), each section file

### Phase 5: Motion & Micro-Interaction Pass

**Objective**: Add purposeful motion per DESIGN.md tokens — aurora drift, staggered reveals, subtle hover states.

- **5a**: Add `animate-aurora-drift` class to all Aurora gradient hairlines (header, hero shelf, dropdown, footer pre-CTA)
- **5b**: Ensure Reveal stagger delays follow the 60ms token (currently 50–90ms, some are 80ms). Unify to 60ms but allow exceptions for larger elements
- **5c**: Add hover state polish: CTA arrow `gap-3` transition on hover for all service cards (already in Services.tsx, ensure consistency)
- **5d**: Add `prefers-reduced-motion` guard to all new animated elements
- **5e**: Verify all animation properties are `transform` and `opacity` only — no width/height/top/left

**Files**: `app/components/Reveal.tsx`, each section file as needed, `app/globals.css`

### Phase 6: Responsive & Accessibility Polish

**Objective**: Ensure mobile experience and accessibility match the desktop quality.

- **6a**: Audit hero on mobile — ensure shelf, metrics row, and CTAs stack cleanly below 640px
- **6b**: Audit Process grid on mobile — ensure 4-step layout collapses to single column with proper spacing
- **6c**: Audit ProjectsPreview grid on mobile — ensure asymmetric layout collapses gracefully
- **6d**: Add `aria-label` to all icon-only buttons (mobile hamburger, scroll-to-top, WhatsApp)
- **6e**: Verify keyboard navigation through header dropdown and search results
- **6f**: Ensure all color contrasts meet WCAG AA (body text `oklch(26% 0.025 240)` on `oklch(98% 0.004 240)` = ~16:1, brand `oklch(60% 0.18 250)` on white = ~3.3:1 — acceptable for UI elements per WCAG)

**Files**: `app/globals.css`, `app/components/Header.tsx`, each section file as needed

## Validation

### Phase 1 — Hero Enhancement
- [ ] H1 heading animates word-by-word with staggered lift on page load / scroll into view
- [ ] Parallax effect moves hero shelf at 0.4× scroll rate
- [ ] `prefers-reduced-motion` disables all hero animations
- [ ] Screenshot comparison shows visual parity with current hero layout

### Phase 2 — Navbar Polish
- [ ] No box-shadow present in header at any scroll state (replace with `border-b border-hairline`)
- [ ] Active nav item shows InstrumentDot (6px brand circle) instead of underline bar
- [ ] Dropdown uses `animate-dropdown-in` with correct easing
- [ ] Mobile menu opens/closes smoothly, no hardcoded colors

### Phase 3 — Landing Page Composition
- [ ] Process section visible between Services and TrustStrip on landing page
- [ ] ProjectsPreview section visible between Process and TrustStrip
- [ ] Section backgrounds alternate (base ↔ concrete) per DESIGN.md rhythm
- [ ] `npm run build` succeeds with no type errors

### Phase 4 — Hairline Draw-In
- [ ] Hairline dividers animate `scaleX(0)→1` on scroll into view (when `draw` prop is true)
- [ ] No hardcoded hex values remain — all colors use CSS variables
- [ ] Tabular numbers display consistently across all sections

### Phase 5 — Motion Pass
- [ ] Aurora drift animations run at 18s on all gradient hairlines
- [ ] All Reveal stagger delays are within 50–80ms range (aligned to 60ms token)
- [ ] No layout property animations (width/height/top/left) present in any component

### Phase 6 — Responsive & Accessibility
- [ ] Landing page is fully navigable and visually correct at 375px, 768px, 1024px, 1440px
- [ ] All interactive elements are keyboard-focusable and show visible focus rings
- [ ] No contrast failures in any text/surface combination
- [ ] Lighthouse Accessibility score ≥ 90, Best Practices ≥ 90

### Full Validation Commands
```bash
# Build check
cd /c/Users/mydwa/mmc-techniek && npm run build

# Dev server
npm run dev &  # then open in browser to verify visually

# WCAG contrast check (scan output)
node .agents/skills/impeccable/scripts/detect-csp.mjs  # CSP check if needed

# Manual: browser DevTools → Lighthouse → Accessibility + Best Practices
```

## Files

| File | Action | Description |
|------|--------|-------------|
| `app/page.tsx` | Modify | Import Process + ProjectsPreview sections; restructure hero into dedicated component path |
| `app/sections/HeroSection.tsx` | **Create** | Extract inline hero from page.tsx into a standalone section with word-lift animation |
| `app/sections/HeroWordLift.tsx` | **Create** | Client component implementing hero word-lift animation (staggered translateY per word) |
| `app/components/Header.tsx` | Modify | Remove shadow, add hairline-based depth on scroll, InstrumentDot for active nav item |
| `app/components/TrustBar.tsx` | Modify | Add `border-b border-hairline`, align with design system tokens |
| `app/components/HairlineDivider.tsx` | **Create** | Section divider with optional `draw` animation (scaleX 0→1 on enter) |
| `app/components/Reveal.tsx` | Modify | Ensure stagger delays align with 60ms token; add prefers-reduced-motion guard |
| `app/globals.css` | Modify | Add any missing utility classes; ensure all animations use transform/opacity |
| `app/sections/Services.tsx` | Modify | Minor: ensure heading sizing aligns with scale tokens |
| `app/sections/Process.tsx` | Modify | Minor: add `id="werkwijze"`, ensure spacing respects 4px base unit |
| `app/sections/ProjectsPreview.tsx` | Modify | Minor: add `id="projecten"`, polish mobile layout |
| `app/sections/TrustStrip.tsx` | Modify | Replace inline OKLCH with CSS variable; add tabular-nums to stat plaques |
| `app/sections/FAQSection.tsx` | Modify | Replace hardcoded `#334155` with `text-copy` class |
| `app/components/PreFooterCTA.tsx` | Modify | Ensure brand section uses `bg-brand` token consistently |
