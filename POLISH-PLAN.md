# MMC Techniek — Production‑Grade Polish Plan

> A phased plan to take the site from "good bones, visibly AI‑built in places" to
> **ultimate production grade**, without a redesign. Direction is locked (see
> [`.impeccable.md`](.impeccable.md)): **refine the existing precision/technical DNA**,
> optimise for **trust & competence**, funnel to the **quote form**, and **keep the blue +
> Barlow Condensed identity** — just perfect its execution.

**How to use this doc:** work top‑to‑bottom. Phase 0 is defects (do first), Phases 1–2 build the
single source of truth everything else depends on, then 3–10 layer polish, a11y, perf, i18n,
conversion, SEO and hardening. Each task has a severity, file anchors, and a crisp
"done when" line. Each phase names the Impeccable sub‑skill that can drive it.

**Severity legend:** `P0` broken/defect · `P1` high (trust, a11y, perf) · `P2` medium
(consistency, polish) · `P3` low (nice‑to‑have).

---

## 1. Current‑state scorecard

| Dimension | Score | Verdict |
|---|:--:|---|
| Art direction / identity | 7.5 / 10 | Genuine, distinctive POV. Undermined by AI‑tells + inconsistency. |
| Design‑system rigor | 4 / 10 | Tokens exist but are **broken/mislabeled**; no spacing/type scale; magic numbers everywhere. |
| Consistency / DRY | 3.5 / 10 | Triplicated icons, dual mobile/desktop DOM, 121 i18n ternaries, 3 sources for brand/service data. |
| Accessibility | 3.5 / 10 | Multiple **mouse‑only** custom controls, contrast failures, ARIA gaps. |
| Performance | 5.5 / 10 | Good `next/image`+dynamic use in places; but all‑client pages, `<link>` fonts, missing `sizes`, heavy marquees. |
| Motion | 6.5 / 10 | Tasteful easing + core reduced‑motion; inconsistent guards, some gratuitous effects. |
| Content / i18n | 4 / 10 | EN users see Dutch across many surfaces; mojibake; no key parity. |
| SEO / metadata | 7 / 10 | Strong root metadata; missing per‑page, structured data, `noindex` on `/admin`. |
| Conversion design | 6 / 10 | CTAs present & repeated; hierarchy diffuse; the quote form is duplicated in DOM. |
| **Overall** | **≈5 / 10** | **Good bones. Not yet production‑grade.** This plan closes the gap. |

---

## 2. Systemic issues (fix once, benefits everywhere)

These recur across the codebase. Phases 1–2 resolve most of them at the root.

| # | Issue | Evidence | Fixed in |
|---|---|---|---|
| S1 | **Undefined color token** `--color-base` / `border-base` | `globals.css:59,187`; `contact/page.tsx:324`; `DESIGN.md:17` disagrees with real token `--color-bg` | Phase 0 + 1 |
| S2 | **Fonts: used weights aren't loaded** — 112× `font-black` (900) + many `font-extrabold` (800 on Barlow) vs `<link>` loading only Barlow 400‑600 / Condensed 600‑800 → faux‑bold | `layout.tsx:67`; 112 hits/14 files | Phase 1 |
| S3 | **Palette labeled "OKLCH" but is hex sRGB**, neutrals are stock Tailwind Slate (not brand‑tinted) | `globals.css:10‑27` | Phase 1 |
| S4 | **Brand‑blue contrast fails** — `#42a8f2` on white ≈ 2.4:1 | 132× `text-brand`/19 files | Phase 1 + 4 |
| S5 | **No spacing/type scale** — arbitrary Tailwind values everywhere (`py-32 lg:py-56`, `mb-36`, magic clamps) | passim | Phase 1 |
| S6 | **i18n bypass** — inline `language==="nl"?…` or pure Dutch | 121 hits/8 files; whole pages (`product`, `over-ons`, planners, solar, map) | Phase 5 |
| S7 | **Duplicated sources of truth** — `serviceIcons` ×3 (with mismatched keys), brand data in `data.ts` + `ClientStrip` + `translations`, phone number in ≥4 formats | `Header`, `aanbod/page`, `Services`; `ClientStrip.tsx:21`; `data.ts` | Phase 2 |
| S8 | **Dual mobile/desktop DOM copies** double node count & maintenance | `contact/page.tsx` (132‑280 / 295‑522), `ProductCard`, `Footer` | Phase 2 |
| S9 | **`dangerouslySetInnerHTML` mini‑templating** (`<brand>`→span via regex) | 10 hits (8 = brand pattern) | Phase 2 |
| S10 | **AI‑slop tells** — aurora purple→blue gradients, glassmorphism (7 `backdrop-blur`), vertical accent stripes, cyan‑on‑dark rainbow, cursor follower, blurred blobs, identical card grids | `over-ons`, `product`, `contact`, `SolarSection`, `HeroSection`, `CursorFollower` | Phase 3 |
| S11 | **Mouse‑only custom controls** (no keyboard/ARIA) | `PriceRangeSlider`, `over-ons` SVG hotspots, hero photo stack, `SwipeCarousel` dots, Meterkast steppers | Phase 4 |
| S12 | **Secrets & client‑only admin** | `supabase.ts:3‑4` (anon JWT literal), `adminStore.ts:273` (`mmc-admin-2024`), `/admin` client‑gated, no `noindex` | Phase 10 |
| S13 | **Dead code / drift** | `instagram-data.ts` (~537 lines, unimported), stale `data.ts faqItems`, unused imports | Phase 2 |

---

## Phase 0 — Stop the bleeding (defects) · `P0`
*Small, surgical, high‑impact. Ship these first; they're visible or broken.*
**Drive with:** `/impeccable:polish`

- **P0** Define/repair the missing token. Add `--color-base` **or** rename usages to `--color-bg`; fix `contact/page.tsx:324` `border-base`, `globals.css:59` (body bg) and `:187` (`.product-card-v1` bg). Reconcile `DESIGN.md:17`.
- **P0** Fix the mojibake `Oudewater Â· Sinds 2008` / `… Â· Since 2008` → real `·` — `translations.ts:15,336`. Re‑save file as UTF‑8.
- **P0** Malformed SVG path in the filter icon (missing coord `m0 a2 2 0 …`) — `aanbod/page.tsx:425`.
- **P0** `serviceIcons` **key mismatch**: `aanbod/page.tsx` defines `vloerverwarming` + `meterkast-liften` while `Header.tsx` defines `meterkast` + `renovaties`; services whose slug isn't in the map render a blank/`bg-current` dot. Align keys to the real `services` slugs (fixed at the source in Phase 2).
- **P0** Header search computes `matchedProducts` but the results panel only renders `matchedServices` — products never show. Render both (or drop the dead compute). `Header.tsx:152‑160,281‑298`.
- **P1** Contradictory utility classes: duplicate `font-bold` on one element and `font-bold` fighting `font-black` — `product/page.tsx:410,477`. Remove the loser.
- **P1** Heading‑order violations (screen‑reader + SEO): `h1→h2→h4` skipping `h3` in `ServiceContent.tsx` (67/95/130); `h3` rendered **before** `h1` in `product/page.tsx` (294 vs 359). Normalise to sequential levels.

**Done when:** no undefined tokens resolve to `currentColor`; no faux glyphs; all service icons render; search shows products; each page has exactly one `h1` and no skipped levels; `npm run build` + `lint` clean.

---

## Phase 1 — The design system (single source of truth) · `P1`
*The backbone. Everything downstream references these tokens.*
**Drive with:** `/impeccable:colorize` (color) + `/impeccable:typeset` (type) + `/impeccable:layout` (spacing)

### 1a. Color → real OKLCH, brand‑tinted neutrals, contrast‑safe
- Convert the palette in `globals.css:10‑27` to `oklch()`. Keep the *identity* (same perceived blue) but gain perceptual uniformity and control.
- **Tint neutrals toward the brand hue** (~240°) at chroma `0.004–0.01` so surfaces feel cohesive instead of stock Slate.
- Reduce chroma as lightness approaches white/black (aurora tints, `bg`, `ink`).
- **Add contrast‑safe roles** so brand blue stops failing AA:
  - `--color-brand` stays the *fill/brand* color (buttons, dots, on‑dark).
  - Introduce `--color-brand-text` = a darker step (≈ `--color-brand-deep`, ≥4.5:1 on `bg`/white) for **brand‑colored text and links on light surfaces**.
  - Audit the 132 `text-brand` sites: on‑dark keep `brand`; on‑light switch to `brand-text`.
- Kill washed‑out muted opacities on light (`text-muted/40`, `/50`) — replace with a defined `--color-muted-2` that actually passes.
- **Done when:** every text/background pair meets **AA** (4.5:1 body, 3:1 large); neutrals visibly share the brand hue; no raw hex in components for palette colors.

### 1b. Typography → load what you use, real modular scale
- Replace the `<head>` `<link>` (`layout.tsx:65‑67`) with **`next/font/google`** (self‑hosted, no render‑block, no CLS). Load the **weights actually used**: Barlow Condensed `700,800,900`; Barlow `400,500,600,700`. This removes 112 faux‑bold renders (S2).
- Wire the font CSS variables (`--font-barlow`, `--font-barlow-condensed`) from `next/font` so the `@theme` mapping keeps working.
- Define a **modular type scale** (fixed `rem` for app UI like `/aanbod` & `/admin`; `clamp()` for marketing/hero/section headings). ≥1.25 ratio, ~5 steps. Replace ad‑hoc `text-[clamp(...)]` and `style={{fontSize:"clamp(...)"}}` in `HeroSection`, `Services`, `aanbod`, `over-ons`.
- Enforce the 65–75ch measure on body copy (some paragraphs run wide).
- **Done when:** DevTools shows real 800/900 files (no "faux"), and heading sizes come from named scale steps, not one‑off clamps.

### 1c. Spacing & layout tokens
- Introduce a **4pt semantic scale** (`--space-2xs…3xl` = 4/8/12/16/24/32/48/64/96) and migrate the worst magic numbers (`py-32 lg:py-56`, `mb-24 lg:mb-36`, `gap-12 lg:gap-16`) to a consistent section rhythm.
- Standardise the page container (recurring `max-w-[1280px] mx-auto px-6 lg:px-10`) into one `<Container>` / utility.
- Consolidate one‑off custom classes in `globals.css` (`instrument-layout`, `compact-service-header`, `text-micro/label/technical`) and document them.
- **Done when:** section vertical rhythm is derived from ≤4 spacing steps; one container definition; no `min-h-[__vh]` (see Phase 6 dvh).

---

## Phase 2 — Kill the drift (DRY + consistency) · `P1`
**Drive with:** `/impeccable:distill`

- **Icons:** create `app/_ui/serviceIcons.tsx` as the single icon map keyed by real `services` slugs; import in `Header`, `aanbod/page`, `Services`, mobile sheet. Deletes 2 duplicate definitions and fixes S7/P0 key drift.
- **WhatsApp mark:** extract the 1KB `<path d="M17.472…">` into `<WhatsAppIcon/>`; reuse in `WhatsAppButton` + contact page's 4 copies. Centralise the phone number + `wa.me` link in `lib/data.ts` `contactInfo` (one canonical `+31 6 3431 1225` / `31634311225`), delete the hardcoded `31634311225`/`0634311225`/`#25D366` scatter.
- **Collapse dual DOM:** refactor `contact/page.tsx`, `ProductCard`, `Footer` so one responsive markup serves mobile+desktop (Tailwind responsive utilities), not two full copies rendered and hidden. Roughly halves their node count.
- **Rich‑brand heading helper:** replace all 8 `dangerouslySetInnerHTML` `<brand>`→`<span>` regex sites with a small `<RichHeading text=… />` that parses the marker safely (no `__html`). Keeps the copy‑with‑emphasis pattern without the XSS surface.
- **One data source:** make `services`/`brandImages` in `lib/data.ts` canonical; have `ClientStrip` read `brandImages` instead of its own `partnerLogos` (S7); ensure service copy lives in `translations` and `data.ts` references it (stop the verbatim copy).
- **Delete dead code:** remove `lib/instagram-data.ts` (~537 lines, unimported) and the superseded `data.ts faqItems`; drop unused imports (`testimonials` in contact, `NAV_ITEMS.label` defaults in BottomNav).
- **Type collision:** `Product`/`Service` are declared in **both** `lib/data.ts` and `lib/supabase.ts` with different shapes — rename the DB ones (`DbProduct`, `DbService`) to end import confusion.
- **Done when:** one icon map, one WhatsApp icon, one phone constant, one container; no component renders two full layout copies; zero `dangerouslySetInnerHTML` for headings; `instagram-data.ts` gone.

---

## Phase 3 — Remove the AI‑slop tells · `P1`
*The tells are what make people say "an AI made this." Each has an on‑brand replacement that reads as intentional craft.*
**Drive with:** `/impeccable:critique` (detect) → `/impeccable:quieter` (tone down)

| Tell | Where | Replace with |
|---|---|---|
| **Aurora purple→blue gradients** (`from-aurora-1 … to-aurora-2`, animated drift) | `Footer:34`, `ServiceContent:160`, `over-ons:175`, `product:248`, `contact:341`, `SolarSection:21`, `globals.css` aurora utils | A single **hairline rule** in `brand`/`hairline`, or a precise 1px top‑border. Drop the lilac (`#f3e8ff`) entirely — it's off‑brand for a technical installer. |
| **Glassmorphism** (`bg-white/x backdrop-blur-md`) ×7 | `over-ons:260,294`, `Meterkast:45`, `ProductCard:54`, `Hero:328`, `product`, `Maintenance` | Solid `surface` panels with a real `hairline` border + the existing `shelf-shadow`. Keep at most one deliberate frosted element (hero project tag) if it truly earns it. |
| **Vertical accent stripes** (`border-l-2`, `absolute w-1` color bar) | `over-ons:201,262‑265` | Full 1px border, a leading number/label, or a tinted `concrete` background block. (Impeccable hard‑ban on >1px side stripes.) |
| **Cyan‑on‑dark rainbow** (`text-cyan-400`, amber/teal/emerald/indigo + `rgba()` from raw rgb strings) | `over-ons systemsData:68‑123` | The **brand blue at varied lightness steps** (from the OKLCH ramp) — one hue, many values. On‑brand and not a neon tell. |
| **Cursor follower** dot | `CursorFollower.tsx` (mounted globally in `layout.tsx:71`) | Remove. It's a portfolio‑demo tell, adds a global `mousemove` listener, and does nothing for a homeowner buying a heat pump. |
| **Blurred brand "blobs"** (`bg-brand/5 blur-[100‑140px]`) | `contact:298`, `over-ons:232` | Delete or replace with a crisp geometric/technical motif (blueprint grid, hairline) consistent with "precision studio". |
| **Identical 4‑up icon‑card grid** | `Services.tsx:29` | Introduce rhythm — vary one card's size/emphasis, or use an editorial asymmetric layout so it doesn't read as a template. |
| **Oversized shouty CTAs** (`px-16 py-8 text-xl tracking-[0.25em] hover:-translate-y-2`) | `SolarSection:42` | Match the standard button scale from Phase 1; reserve size for the primary quote CTA only. |

**Done when:** a designer shown the site can't point to a "stock AI" element; the lilac aurora is gone; one hue system; no decorative glass/blur/stripe.

---

## Phase 4 — Accessibility to WCAG AA · `P1`
*Trust dies on broken/inaccessible controls. Also the right thing to do.*
**Drive with:** `/impeccable:audit`

- **Contrast:** land the Phase‑1 `brand-text` swap across the 132 `text-brand` sites + muted‑opacity cleanup. Verify with axe/Lighthouse.
- **Keyboard‑operable custom controls (currently mouse‑only):**
  - `PriceRangeSlider` — bare `<div>` thumbs → `role="slider"` + `aria-valuemin/max/now`, `tabindex="0"`, arrow‑key handling (or a native dual `<input type=range>`).
  - `over-ons` blueprint `<g onClick/onMouseEnter>` hotspots + windmill → focusable buttons with `role`, `aria-label`, key handlers (or a non‑interactive decorative fallback).
  - Hero photo stack — `<div onClick>` layers (`HeroSection:263,285,307`) → `<button>` with labels; the vertical selector already uses buttons (good).
  - `SwipeCarousel` dots — remove `aria-hidden` from the wrapper that contains real buttons (`:75`); add arrow‑key support.
  - Meterkast `+`/`−` steppers → `aria-label`; the styled‑div "checkbox" → `role="checkbox" aria-checked` (or real input).
- **Dialogs / disclosure:** add focus‑trap + focus‑restore to `MobileSheet` (has Escape + scroll‑lock, lacks trap); add `aria-expanded`/`aria-controls` to the FAQ accordion (`veelgestelde-vragen`) and Header dropdown; give the FAQ search an `aria-label`/`<label>`.
- **Motion for AT:** `TrustStrip`/`ClientStrip` marquees render text 4×/2× — mark duplicates `aria-hidden`; add `prefers-reduced-motion` guards to `Reveal` and the marquees (core CSS already guards, these components don't).
- **Language:** `LanguageContext` should set `<html lang>` to the active locale on load (not just default `nl`), and derive `dir` (currently hardcoded; the unused `dir` field in translation data becomes the source if RTL is ever added).
- **Images:** replace generic `alt="Client"` (`contact:325`) with meaningful/empty‑decorative alts; ensure every `next/image` fill has correct alt intent.
- **Done when:** axe = 0 criticals; full keyboard walkthrough of home, `/aanbod`, `/contact`, `/over-ons` works; reduced‑motion truly stills the page.

---

## Phase 5 — i18n completeness · `P2`
**Drive with:** `/impeccable:clarify`

- Route the **fully‑hardcoded Dutch** surfaces through `t()`: `product/page.tsx`, `over-ons/page.tsx`, `MeterkastPlanner`, `MaintenancePlanner`, `SolarSection`, `LeafletMap` popups, `ProductCard` "Prijs op aanvraag", FAQ search/empty states, contact placeholders + `"1. Contactgegevens"` headers, InstagramFeed states, BottomNav `offerte`/`more`.
- **Enforce EN↔NL key parity:** change `TranslationKey` so `en` must structurally match `nl` (e.g. `const translations: Record<Language, TranslationShape>`), so missing keys are a compile error instead of silent Dutch.
- **Fix the FOUC/hydration:** EN users get a flash of Dutch because language resolves in `useEffect` post‑mount (`LanguageContext:17‑22`). Persist locale in a cookie and read it in the server layout (or inline a pre‑hydration script) so first paint is correct.
- Decouple copy from markup: with `<RichHeading>` (Phase 2) the translation strings stop carrying `<brand>`/`&rarr;` HTML.
- **Done when:** switching to EN leaves no Dutch on any page; adding a key to `nl` without `en` fails the build; no first‑paint language flash.

---

## Phase 6 — Performance · `P2`
**Drive with:** `/impeccable:optimize`

- **Server‑first:** the homepage is fully `"use client"` only because of `useLanguage`. Move the language boundary lower (server shell + small client islands for the interactive hero selector, header, etc.), so `Services`/`TrustStrip`/static content render on the server. Same for `over-ons` (630‑line client component).
- **Fonts:** `next/font` (Phase 1b) already removes the render‑blocking `<link>` + DNS to Google.
- **Images:** add `sizes` to every `fill` image missing it (`ServiceContent:49,187`, `over-ons` hero, `contact:458,325`, related‑services); convert `/admin` raw `<img>` ×6 and `BrandLogo` to `next/image` where the source is known (keep raw only for arbitrary admin URLs, but add width/height to curb CLS).
- **Marquees:** `ClientStrip` renders **42** filtered `<Image>` with per‑logo hover inside an auto‑scroll — cut to a single duplicated track, drop per‑item hover, lazy‑load offscreen.
- **InstagramFeed:** the `min-h-[1200px]` reserves a huge blank; lazy‑mount the iframe on scroll and shrink the reserved space; ship without the `PLACEHOLDER_SOCIABLEKIT_ID` default so a misconfig doesn't render a broken widget.
- **dvh:** swap the 4 `min-h/ max-h-[__vh]` (`hero:122`, `over-ons:169`, `product:165`, `aanbod:470`) for `dvh` utilities (already defined in `globals.css`) to fix mobile‑chrome jump.
- **Done when:** Lighthouse mobile ≥ 90 perf, CLS < 0.05; homepage ships meaningfully less client JS; no font‑swap flash.

---

## Phase 7 — Motion & micro‑interaction polish · `P3`
**Drive with:** `/impeccable:animate`

- Tokenise motion: standard durations/easings as CSS vars (you already favour `cubic-bezier(0.22,1,0.36,1)` — name it `--ease-out-quint`); fix the invalid Tailwind `transition … cubic-bezier(...)` in `HairlineDivider` (must be `ease-[cubic-bezier(...)]`).
- Replace JS hover handlers with CSS: FAQ `onMouseEnter/onMouseLeave` mutating `style` (`veelgestelde-vragen:121‑131`) → Tailwind `hover:` (also fixes touch + re‑render churn).
- Ensure **every** animation honours reduced motion (Phase 4 covers the gaps).
- Refine the hero: 6s autoplay is fine with hover‑pause, but pause on focus‑within and when tab hidden; keep the parallax subtle (already ≤22px).
- Move component `<style jsx global>` keyframes (`over-ons:467‑481`) into `globals.css`.
- **Done when:** one motion vocabulary; no JS‑driven hover styling; reduced‑motion fully respected; no keyframes defined inside components.

---

## Phase 8 — Conversion polish: funnel to the quote · `P2`
**Drive with:** `/impeccable:critique` → `/impeccable:polish`

- Make **"Request a quote"** the unmistakable primary action on every page; demote call/WhatsApp to clear secondary (consistent button hierarchy from Phase 1 — one primary style, one ghost/secondary).
- Rebuild the contact page around a single, trustworthy quote form (post Phase‑2 de‑dupe): inline validation, disabled→loading→success states, error recovery if the Supabase insert fails (today errors can be swallowed).
- Put **proof next to asks:** certifications (NEN‑1010/3140, VCA), years (16+), local projects and reviews adjacent to CTAs — this is the "trust & competence" payload.
- **Empty states that teach:** `/aanbod` with no category, search "no results", planners at zero — each should guide the next step (and point to the quote), not dead‑end.
- Tidy the sticky mobile CTA / bottom‑nav / WhatsApp float stack so they never overlap and always show the primary path.
- **Done when:** on any page, the primary next step is obvious and leads to the quote; the form gives feedback at every step; trust proof is visible without scrolling to the footer.

---

## Phase 9 — Content, SEO & metadata · `P2`
**Drive with:** `/impeccable:polish`

- Fix OG copy: `"airco and complete verduurzaming"` → `"airco en …"` (`layout.tsx:38`).
- **Per‑page metadata** (title/description/canonical/OG) for `/aanbod`, `/over-ons`, `/veelgestelde-vragen`, `/contact`, `/our-work`, each `/diensten/[slug]` (dynamic already has `generateMetadata` — verify quality).
- **Structured data** (big local‑SEO win): `LocalBusiness`/`HVACBusiness` + `Service` + `FAQPage` JSON‑LD. You have the NAP, hours, certs and FAQ content already.
- `noindex` on `/admin` (Phase 10 also hardens it); review `robots.ts`/`sitemap.ts` coverage.
- Proper **favicon set** (currently `icon: /images/logo.png` — provide `.ico` + sized PNGs + `apple-touch-icon`).
- Alt‑text quality pass (meaningful vs decorative).
- **Done when:** each route has tailored metadata; Rich Results test validates LocalBusiness + FAQ; `/admin` is not indexable; favicons render crisply.

---

## Phase 10 — Production hardening (beyond pure design, required for "production grade") · `P1`
> Not visual polish, but "ultimate production grade" can't ship with these open. Flagging clearly.

- **Admin auth:** the gate is client‑only with a hardcoded fallback password `mmc-admin-2024` (`adminStore.ts:273`) and `sessionStorage` flag. Move auth server‑side (Supabase Auth / a server route) and enforce **RLS** on `quote_requests`/`admin_settings`/product tables.
- **Secrets:** the anon key in `supabase.ts:3‑4` is *publishable by design*, but (a) it shouldn't be a hardcoded literal fallback — read from `env`; (b) confirm RLS so the anon key can't write admin tables; (c) remove the admin password from source entirely.
- **Stored‑XSS:** `InstagramFeed` injects admin‑stored HTML via `dangerouslySetInnerHTML` (`:101`) — sanitise or restrict to an iframe `src` allowlist.
- **Error handling:** `adminStore` swallows nearly every DB error (`catch {}`) so the UI can't tell "saved to cloud" from "localStorage only" — surface failures.
- Replace native `confirm()`/`alert()` in `/admin` (83,229,519) with the in‑app toast/dialog already present there.
- **Done when:** no secret/password literals in the repo; admin is server‑enforced + `noindex`; no unsanitised HTML injection; DB failures are visible.

---

## 3. Suggested sequencing & effort

| Order | Phase | Rough effort | Why here |
|:--:|---|:--:|---|
| 1 | 0 — Defects | ~½ day | Visible/broken; unblocks the rest. |
| 2 | 1 — Design system | 1–2 days | Everything references it. |
| 3 | 2 — DRY | 1–2 days | Do before page polish so you polish once. |
| 4 | 4 — Accessibility | 1–1.5 days | Depends on Phase‑1 tokens; high trust value. |
| 5 | 3 — Remove AI‑tells | 1 day | Now that tokens/components exist. |
| 6 | 5 — i18n | 1 day | Parallelisable with 3. |
| 7 | 6 — Performance | 1 day | After server/client boundary is clear. |
| 8 | 8 — Conversion | 1 day | Uses the cleaned components. |
| 9 | 9 — SEO/meta | ½ day | Independent; can slot anywhere. |
| 10 | 7 — Motion | ½ day | Final finish. |
| 11 | 10 — Hardening | 1–2 days | Independent track; can run in parallel from day 1. |

*Total ≈ 9–13 focused days. Phases 0/1/2 deliver the biggest visible jump.*

---

## 4. Definition of Done (global acceptance criteria)

- [ ] `npm run build` and `npm run lint` clean; no console errors/warnings in the browser.
- [ ] **axe** 0 criticals; full **keyboard** pass on home, `/aanbod`, `/contact`, `/over-ons`, `/diensten/[slug]`.
- [ ] **Contrast** AA everywhere (4.5:1 body / 3:1 large); no `text-brand` on white.
- [ ] **Fonts** self‑hosted via `next/font`; real 800/900 (no faux‑bold); no layout shift on load.
- [ ] **Tokens** only — no raw hex or magic clamps/spacing in components; OKLCH palette; brand‑tinted neutrals.
- [ ] **No AI‑tells** — no lilac aurora, decorative glass, >1px accent stripes, cyan‑on‑dark, cursor follower, blurred blobs.
- [ ] **i18n parity** enforced by types; EN shows zero Dutch; no first‑paint language flash.
- [ ] **Lighthouse mobile** ≥ 90 Perf / ≥ 95 A11y / ≥ 95 Best‑Practices / ≥ 95 SEO; CLS < 0.05.
- [ ] **Reduced motion** stills the page (marquees, reveals, aurora, hero).
- [ ] **One source of truth** — one icon map, one WhatsApp icon, one phone constant, one container; no dual DOM copies; dead code removed.
- [ ] **Conversion**: quote is the obvious primary action on every page; form has validation + success/error states; trust proof sits near CTAs.
- [ ] **Hardening**: no secrets/passwords in source; `/admin` server‑enforced + `noindex`; no unsanitised HTML injection.
- [ ] Visual QA at 360 / 768 / 1024 / 1440 — no overflow, overlap, or broken sticky/nav stacking.

---

## 5. Running it with Impeccable

Each phase maps to a sub‑skill you can invoke on the relevant files:

`/impeccable:polish` (0, 9) · `/impeccable:colorize` + `/impeccable:typeset` + `/impeccable:layout` (1) ·
`/impeccable:distill` (2) · `/impeccable:critique` → `/impeccable:quieter` (3) · `/impeccable:audit` (4) ·
`/impeccable:clarify` (5) · `/impeccable:optimize` (6) · `/impeccable:animate` (7) · `/impeccable:critique` (8).

Recommended first move: **Phase 0 now** (fast, unblocks everything), then **Phase 1** to lay the token/type/spacing foundation the rest builds on.
