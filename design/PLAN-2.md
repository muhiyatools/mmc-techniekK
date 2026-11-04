# Polish pass: plan

This round of work comes from the owner's review of the live build (2026-11-04). The earlier plan in `design/PLAN.md` still applies (tokens, copy rules, motion rules, image rules). This file lists only what changes now.

Each item ends in a check that can be verified.

---

## 1. Layout: responsive on every page, full width on large monitors

**Problem.** `.wrap` caps content at `--container-site: 1360px`. On 1920px and wider screens every page sits in a narrow centred column with wide empty sides (owner screenshots 1 and 3). Several sections also break between 360 and 1024px.

**Do:**
- Make the container fluid.
  - `--container-site` grows with the viewport: `clamp(1360px, 86vw, 1760px)`, or something equivalent. Gutters stay as they are, and widen at ≥1600px, for example 56px.
  - Long reading text keeps its own measure (`prose-mmc` at max 68ch). Only layout grids widen.
- Let the grids use the room on wide screens:
  - the homepage hero strip, services and audience grids;
  - the catalog grid at 4 columns from ≥1600px;
  - product, FAQ and contact columns.

  Images in the full-bleed sections (hero strip, audience cards) should feel edge-to-edge, not boxed.
- Make the type scale with the viewport. The display, h1 and h2 `clamp()` upper bounds go up for ≥1600px, so headings don't look small on 2560px.
- Check every route at **360, 390, 768, 1024, 1280, 1440, 1920 and 2560**, NL and EN. Look for:
  - horizontal scroll;
  - clipped or overlapping elements;
  - orphan words in headings;
  - buttons wrapping;
  - empty half-screens.

  Fix everything found.

**Check:** a Playwright screenshot of every route at the 8 widths, all reviewed. `document.documentElement.scrollWidth <= innerWidth` everywhere.

---

## 2. Homepage services: no accordion, rows link straight to the service page

**Problem.** The service rows in `components/site/ServicesLoop.tsx` expand into an image, text and a "Meer over…" button (owner screenshot 2). The owner wants that collapse removed.

**Do:**
- Each row becomes a `<Link>` to `/diensten/<slug>`, with the localised path.
  - The row shows: number, title, kicker, the one-line summary (always visible, one line, truncated on small screens) and the round arrow.
  - Remove the expanded panel and its image.
- Hovering or focusing a row still highlights its node and arc in the loop diagram (keep the existing sync).
  - The arrow rotates from → to ↗ and fills blue.
  - The row background tints `paper`.
  - The title shifts 4px right.
- **Transition to the service page.** The project already uses React `<ViewTransition>` (`experimental.viewTransition` is on).
  - Give the row's service icon and title a shared `ViewTransition name={`service-${slug}`}`, matched on the service page: the title in `PageIntro`, and the icon or diagram node.
  - The heading then morphs from the row into the page H1.
  - Add a short slide-up for the incoming page content.
  - All of it is turned off under `prefers-reduced-motion`.
- Clicking a node in the diagram also navigates to the service page.
- Keep the services that have no photo honest: no images in this list at all now.

**Check:** a click on any row lands on the right service page with a visible morph. Keyboard Tab and Enter work. No `aria-expanded` is left behind.

---

## 3. Brands: from a static strip to a designed element

**Problem.** Brand logos are a flat, static row (`LogoRow` in `components/site/Blocks.tsx`). They are tiny on the Zakelijk page and look like an afterthought.

**Do:**
- Replace `LogoRow` with a `BrandGrid` component.
  - It's a hairline grid of logo cells: each brand's mono logo, centred in a fixed-height cell, `line` borders, consistent optical size (normalise by logo aspect ratio, not one fixed height).
  - On hover the logo goes from 55% to 100% opacity, and the cell tints `paper`.
  - Suppliers link to `/aanbod?merk=<slug>` when products exist for that brand. Clients don't link.
  - The cell can show a small mono caption (the brand name) for accessibility and scannability.
- Homepage: the supplier grid replaces the logo row under the trust strip, with a heading like "Merken die we installeren" in mono, and "Bekijk het aanbod" on the right.
- Mobile: 3 columns on phones, 4 to 6 on tablet, up to 8 on wide screens. No horizontal scroll strip.
- A subtle, one-time stagger reveal on enter (existing `data-reveal` and `--i`). **No marquee.**
- Admin: brands already have `logo_path` and `show_in_strip`. Keep them working; `sort_order` drives the order.

**Check:** logos are readable and the same visual weight at all widths. Supplier cells link to filtered products.

---

## 4. Zakelijk page: lively, credible, all certifications

**Problem.** Screenshot 3 shows a page that is a heading, a thin logo row and a bullet list. It's lifeless, and it only mentions NEN 3140.

**New structure:**
1. **Hero (split layout).**
   - Left: H1, lead, `Zakelijke aanvraag` (primary) and a phone link.
   - Right: a real photo from the media library, a business one (supermarket façade / main distribution board / commercial hall, chosen via `MediaClaims`), with a spec label.
   - The text comes from the existing `pages` row `zakelijk`.
2. **What we do for businesses.**
   - A 2×2 (desktop) or 1-column (phone) grid of cards, one per offering: electrics and lighting for shops and offices, new build and renovation, solar on commercial roofs, NEN 3140 inspections and maintenance.
   - Each card has an icon, a title, 2 lines of copy, and a link to the matching service page where one exists.
   - Copy follows the rules in `design/CLAUDE-CODE-PROMPT.md` §5: plain, "u", no slogans.
3. **Client logos.** The new `BrandGrid` with `kind = client`, titled "We werkten onder meer voor".
4. **Certifications: all of them.**
   - Make a dedicated section listing **every** certification in `site_settings.certifications`. Today that's NEN 1010, NEN 3140 and VCA.
   - Each one gets its logo (`public/brand/certs/*`), what it means in one sentence, and why it matters for a business.
   - Reuse and move the cert data that currently sits hard-coded in `app/[lang]/over-ons/page.tsx` (`CERTS`) into one shared module, for example `lib/certifications.ts`, used by Over ons, Zakelijk and the footer, so nothing is duplicated.
   - Search the git history (`git log -p -S "F-gassen"`, `-S "BRL"`, `-S "SCIOS"`, `-S "InstallQ"`, `-S "STEK"`) and `old_site` in the snapshot commit `8db48ad` for other certifications the company has claimed (airco installers usually need F-gassen / BRL 100). Add only what is found there. Anything uncertain becomes `TODO(owner)` in the report, never invented.
5. **How a business job runs.** 4 steps on the dark single-line diagram band: survey, quote, execution outside opening hours if needed, inspection report. Use only claims that are already in existing copy, or mark them `TODO(owner)`.
6. **Instagram / work** block: keep `InstagramProfile` if it's still used.
7. **CTA panel.**

**Check:** the page reads as a proper B2B landing page at 390 and 1920. All three (or more) certifications are shown with logos.

---

## 5. Aanbod (catalog): real overhaul, filters first

**Problem.** Screenshot 4: the filters are two rows of plain text pills. Brands are names, categories have no icons, and there is no price filter.

**Do:**
- **Layout.**
  - ≥1024: a sticky filter **sidebar** on the left (about 280px) and the product grid on the right (3 columns, 4 at ≥1600).
  - <1024: a "Filters (n)" button opens a bottom sheet with the same controls, plus an "Apply / show N products" button. Use the existing focus trap, Esc and safe-area padding.
- **Category filter.**
  - Each category is a selectable row or card with its **service icon** (`Icon name={slug}`, the same glyphs as the loop), the label and the count.
  - Categories with 0 products are shown disabled with "binnenkort", or hidden. Pick hidden unless the owner wants otherwise, and say so in the report.
- **Brand filter.**
  - Show **brand logos** (mono PNGs from `brands.logo_path`) in a grid of small toggle tiles.
  - The selected state uses a `blue` ring and `sky` fill.
  - Multi-select is allowed.
  - The name is the accessible label and a tooltip.
  - A brand without a logo falls back to its name in mono.
- **Price slider.**
  - A dual-thumb range slider on `price_from` / `price_to` (EUR), built accessibly: two `input[type=range]` styled with tokens, keyboard-operable, with a live value readout.
  - The range comes from the products that have prices.
  - Products without a price stay visible under a "Prijs op aanvraag" checkbox, checked by default, so filtering doesn't hide most of the catalog. Today most products have no price, which is a TODO(owner).
  - If no product has a price, hide the slider and show nothing broken.
- **State in the URL:** `?categorie=…&merk=a,b&min=…&max=…&opaanvraag=1`, using `router.replace` without scrolling. The legacy `?dienst=` redirect in `proxy.ts` must keep working.
- **Active filter chips** above the grid, each removable, plus "Alles wissen".
- Show the result count. Use the existing `fade-up` stagger when results change. The empty state has a reset button.
- **Sort:** relevance (`sort_order`), price low to high, price high to low, name.
- **Product cards:** keep the current card, but tighten it. The brand logo replaces the mono brand name when a logo exists. Show variant count and price, and price on request only once.
- Keep the one-photo-per-page rule (`MediaClaims`).
- Keep `lib/catalog.ts` `catalogCategories` as the source of categories.

**Check:** filters work by keyboard and touch. The URL round-trips. No horizontal scroll at 360. The bottom sheet traps focus.

---

## 6. Remaining pages to finish

- **Admin (empty folders exist):**
  - `app/admin/(panel)/instellingen` (admin): edit `site_settings`. That covers contact details, opening hours, service area, certifications list, social links incl. `google_reviews_url` and Instagram, and the WhatsApp message. Reuse `components/admin/SectionsEditor.tsx` with `target="settings"`, and `saveSetting` in `lib/admin/actions.ts`.
  - `app/admin/(panel)/gebruikers` (owner): list profiles (name, email, role, active, last sign-in if available).
    - Invite by email with a role (`inviteUser`).
    - Change role and active (`setUserAccess`).
    - Guard against demoting the last owner (the DB already enforces this; show the error nicely).
  - `app/admin/(panel)/account` (any active user): own name (`updateOwnName`) and set or change password (browser client `auth.updateUser({ password })`).
    - Handle `?welkom=1`, which invite links land on: prompt "Kies een wachtwoord".
    - Sign out.
- **Public:** make sure every link in the header, footer, mobile menu and sitemap resolves. `/projecten` was removed, so remove leftover links and redirect `/projecten*` and `/our-work` to `/zakelijk#werk` or wherever the work now lives. Check `next.config.ts` redirects.

**Check:** no 404 from any internal link. Crawl all `<a href>` on every route with Playwright and assert status < 400.

---

## 7. Consistency and polish (all pages)

- Same section rhythm (`section-y`) and heading treatment on every page. Use one primary button per view.
- Every interactive element has hover, focus-visible, active and disabled states.
- No hard-coded hex in components; tokens only (`app/globals.css` `@theme`).
- Motion follows the tokens in `globals.css`. Everything is off under reduced motion.
- `npm run build`, `npm run lint` and `npx tsc --noEmit` are all clean.

## Out of scope

Database schema changes. If one is truly needed, write the SQL file in `supabase/migrations/` and **do not apply it**. The owner runs migrations in the SQL editor themselves (MCP `apply_migration` is declined there).
