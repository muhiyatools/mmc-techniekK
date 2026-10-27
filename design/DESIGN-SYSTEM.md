# MMC Techniek — Design system "Kringloop"

This is the approved visual direction for the new mmctechniek.nl. It replaces `DESIGN.md`, `.impeccable.md` and `POLISH-PLAN.md` in the project root, which describe the previous direction.

## What is in this folder

| Path | What it is |
|---|---|
| `boards/Main.html` | Design system board: logo, colour, type, motifs, components |
| `boards/Home.html` | Desktop homepage (fluid, with responsive rules) |
| `boards/Mobile-Home.html` | Mobile homepage at 390 × 844, with sticky top bar and fixed bottom action bar |
| `boards/Mobile-Menu.html` | Mobile menu, open |
| `boards/Mobile-Offerte.html` | 3-step quote wizard plus confirmation |
| `boards/Admin.html` | Admin lead inbox: list plus detail panel |
| `assets/logo.svg` and the other SVGs | Logo redrawn as vector (traced from `public/images/logo.png`). `logo-dark.svg` is for dark backgrounds, `mark.svg` / `mark-white.svg` are the C-mark alone |
| `assets/brands-mono/*.png` | Supplier and client logos, trimmed and recoloured to one ink colour so they read as one set |

**The boards are reference prototypes, not code to copy.** They use a canvas format (`<x-dc>`, `{{holes}}`, `<sc-for>`, `<sc-if>`, `class Component extends DCLogic`). Read them for layout, spacing, tokens, hierarchy, copy and interaction. Then build properly in React/Tailwind. Image paths in the boards already point at files in `/public` (for example `/images/projects/...`), except `../assets/...`, which point into this folder.

## Concept

The C in the logo is a plug and an arrow that goes around. MMC works the same way: generate (solar), store (battery), distribute (meter cabinet), heat (heat pump), cool (airco) and maintain (service). One installer closes the loop. The identity uses that loop, plus the visual language of the trade: single-line electrical diagrams, the groups in a fuse box, and spec labels.

Three principles:
1. **Precise.** Technical labels, hairlines, measurements. No decoration for its own sake.
2. **Real.** MMC's own project photos come before stock. Proof comes before promises.
3. **Round.** Every route ends at contact, and after delivery comes service.

## Colour

Light site. Dark only for the footer, the process band and the business card.

| Token | Hex | Use |
|---|---|---|
| `signal` | `#41A7F2` | The exact logo blue. Fills, lines, graphics, accent text **on dark only**. Never text on white (2.6:1). |
| `current` | `#0A6BC2` | Primary buttons, links, active states. White on it = 5.4:1 |
| `current-deep` | `#08508F` | Hover and pressed |
| `sky` | `#E7F3FD` | Selected and tint backgrounds |
| `sun` | `#F2B634` | Review stars only |
| `ink` | `#0F1B26` | Text, dark sections (17:1 on white) |
| `slate` | `#44525F` | Body copy, secondary (7.9:1) |
| `graphite` | `#66737F` | Labels, meta (4.9:1 on white, 4.5:1 on paper). Never smaller than 11px |
| `line-strong` | `#C5D0DA` | Control borders, schematic lines |
| `line` | `#DCE3EA` | Hairlines, dividers |
| `paper` | `#F3F6F9` | Alternate section background |
| `white` | `#FFFFFF` | Page background |
| on-dark text | `#B4C0CB` body, `#9AA7B3` labels, `#2C3D4E` dark hairlines | |
| error | `#B3370B` text, `#C2410C` border | |
| Admin status | new `#08508F/#E7F3FD`, busy `#7A4E00/#FFF4DB`, sent `#4B3A9A/#EEEAFB`, won `#17663F/#E3F5EC`, lost `#44525F/#EEF1F4` | |

## Type

- **Archivo** (Google, variable `wdth 62–125`, `wght 100–900`) for everything except labels. Self-host it with `next/font/google` using the `axes: ['wdth']` option.
  - Display: `font-stretch:125%`, weight 800, letter-spacing −0.04em, line-height 0.93. Homepage H1 is `clamp(58px, 9.3vw, 136px)`.
  - H2: 118%, weight 750, −0.028em, line-height 1.02, `clamp(34px, 4.2vw, 56px)`.
  - H3: 108%, weight 650, −0.012em, line-height 1.2, 18–32px.
  - Body: 100%, weight 400. Lead is 19/30, body is 16/26 (desktop) and 15–16 (mobile). Buttons are weight 600.
- **IBM Plex Mono** weight 500, uppercase, letter-spacing +0.08em, 11–12px. For labels, metadata and specs only (for example "Oudewater · 2024", "NEN 1010"). Never for sentences.

## Shape, space, motion

- Radii: buttons and chips are pills (999px); inputs 12px; small cards 14–16px; image tiles and cards 20–28px; big panels 32px.
- Container max 1360px with 40px side padding (24px at ≤1023, 16px at ≤640). Sections have 120px vertical padding on desktop and 48–56px on mobile.
- Touch targets ≥ 44px. Inputs are 52px tall with 16px text (prevents iOS zoom).
- Shadows only for floating elements (the review card over a photo, the quote form). Everything else uses hairlines.
- Motion: 150–250ms. Image hover is a slow scale to 1.035. Button knob nudges 3px. Respect `prefers-reduced-motion`.

## Motifs (use with restraint)

1. **The loop.** An arc with an arrowhead, taken from the logo C. Used for the services diagram on the homepage, the progress ring in the quote wizard, and the success state. Use it a few times at most, not on every section.
2. **Fuse "Groep" label.** A small fuse with a blue toggle, then "GROEP 01", a short wire, then the section name. It's the section marker on the homepage only. Drop it where a plain heading is enough. Don't put it on every page.
3. **Single-line diagram.** Hairlines with nodes. Used in the process steps.
4. **Spec labels on photos.** A small white mono label with service · place. Keep to one per photo.

## Components

- **Button primary**: pill, `current` background, white text, with a 40px white circular "knob" holding the arrow on the right (the plug). Variants: secondary (white with a line-strong ring), on-dark (signal background with ink text), white (on blue panels). Small size is 44–46px tall.
- **Chip / option**: pill or 14px-radius box with a line-strong ring. Selected uses a `current` ring and `sky` fill, or an inverted ink fill for single-select filters.
- **Service row**: number, title plus mono subtitle, round arrow button. It expands into image, text, tags and CTA.
- **Project card**: photo, a white caption box bottom-left (title + mono meta), a round arrow button bottom-right.
- **Trust strip**: certification logos and three facts in a hairline grid.
- **Accordion (FAQ)**: question plus a round plus/minus button that rotates to an ×.
- **Mobile action bar**: call, WhatsApp, primary "Offerte aanvragen". Fixed at the bottom, with safe-area padding.

## Homepage structure (desktop board)

Header → Hero (H1 + lead + CTA + photo strip) → trust strip and brand logos → services with interactive loop diagram → for homeowners / for businesses → projects with filter → process (dark) with stats → reviews → quote panel (step 1 of wizard inline) → FAQ → footer.

## Things in the boards that must be corrected during the build

- Copy is a first draft. Some lines use a staged two-beat "contrast" rhythm that reads as machine-written: "Zo werken we. En daarna blijven we.", "Voor thuis. En voor de zaak.", "Wij maken de cirkel rond.", "Combinaties zijn onze specialiteit." Rewrite these plainly.
- Remove the pulsing dot in the hero pill. Consider dropping the pill entirely.
- Hero photo-strip labels and project titles and locations are partly guesses. Real titles come from the admin.
- The admin board uses sample data (names, amounts, conversion). Do not seed the database with it.
- Arrowheads on the loop arcs are hand-placed. Draw them precisely, or derive them from the `mark.svg` geometry.
- Facts to confirm with the owner before publishing: opening hours (live site says Mon–Fri 08:00–17:00, `lib/data.ts` says 09:00–18:00), "2500+ projecten", "16+ vakmensen", and the four testimonials.
