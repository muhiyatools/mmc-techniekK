You're rebuilding the frontend and admin of mmctechniek.nl, the website of MMC Techniek B.V. They're an installation company in Oudewater (solar panels, home batteries, heat pumps, air conditioning, meter cabinets and electrical work, maintenance). The stack stays **Next.js + Supabase, hosted on Vercel**. A new design direction has been approved. Your job is to migrate this project to it, keep what already works well, and produce a site that feels hand-made by a senior designer and copywriter. It should not look generated.

## 1. Read first, in this order

1. `AGENTS.md`. This Next.js version has breaking changes. Read the relevant guides in `node_modules/next/dist/docs/` before writing code, and follow the deprecation notices.
2. `design/DESIGN-SYSTEM.md`. This is the source of truth for tokens, type, components, motifs, and the list of corrections.
3. `design/boards/*.html`. These are reference prototypes for layout, spacing, hierarchy and interaction. They use a canvas format (`<x-dc>`, `{{holes}}`, `<sc-for>`, `DCLogic`), so don't copy that code. Open them in a browser (they render as static HTML minus the interactivity) or read the source.
4. The existing app: `app/`, `lib/data.ts`, `lib/i18n/translations.ts`, `lib/supabase.ts`, `supabase/*.sql`, `PRODUCT.md`.
5. The live database, through the Supabase MCP tools (see section 3). Use the project named **"MMC Techniek B.V"**, ref `stjmmlzykokwaqkushnu` (eu-central-1). The same account also has an unrelated project ("Arabstrg Roleplay Platform"). Never read from or write to it. Pass the project id explicitly on every call.

`DESIGN.md`, `.impeccable.md`, `POLISH-PLAN.md`, `plan.md` and `hostinger-php/MIGRATION-PLAN.md` describe older directions. Use them only to understand the existing features, then delete them.

Before you change anything: the working tree has uncommitted changes. Commit them as they are on the current branch, then create `redesign/kringloop` and work there. Commit after every phase with a clear message.

## 2. What to build

### Public site (Dutch default at `/`, English at `/en/...`, server-rendered)

| Route | Notes |
|---|---|
| `/` | Homepage per `design/boards/Home.html` (desktop) and `Mobile-Home.html` (mobile) |
| `/diensten/[slug]` | One page per service: what it is, who it's for, how it works, brands we install, the products from the catalog, related projects, FAQ, quote CTA |
| `/aanbod` and `/aanbod/[slug]` | Redesigned product catalog: filter by service and brand, indicative price, "Offerte voor dit product" prefilling the quote form. Replaces `/product?name=` |
| `/projecten` and `/projecten/[slug]` | Real projects from the admin. Replaces `/our-work` and the Instagram iframe |
| `/zakelijk` | For businesses: utility, retail, new-build, NEN 3140 inspections, client logos |
| `/over-ons` | Short and honest: since 2008, own team, certifications, team members (from admin), area served |
| `/veelgestelde-vragen` | Searchable FAQ grouped by service, FAQPage JSON-LD |
| `/offerte` | The 3-step quote wizard (`Mobile-Offerte.html`), also usable on desktop. Prefill from `?dienst=&product=` |
| `/contact` | Address, phone, WhatsApp, email, hours, map link, short contact form |
| `/privacy`, `/cookies`, `/algemene-voorwaarden` | Simple legal pages, content editable in admin |

Add permanent redirects for every old URL: `/our-work`, `/product?name=`, `/aanbod?dienst=`, the old `/contact` prefill parameters, and `?lang=en`. Keep or improve the LocalBusiness JSON-LD, sitemap, robots, hreflang, OG images and per-page metadata.

### Admin (`/admin`) per `design/boards/Admin.html`

- **Auth:** Supabase Auth (email + password, plus magic link if easy), using the `@supabase/ssr` session cookies and checking the session on the server.
- **Roles:** `owner` (everything, including users), `admin` (everything except users and roles), `editor` (content only, no leads).
- **Aanvragen (leads inbox):**
  - list with status tabs, search and a detail panel;
  - statuses: nieuw → in behandeling → offerte verstuurd → gewonnen / verloren;
  - assignee, internal notes, timeline;
  - one-tap call / WhatsApp / mail, CSV export;
  - an email notification to the company on every new request (provider via env: Resend, or SMTP for the existing `info@mmctechniek.nl` mailbox).
- **Content:** services, products (catalog), brands, projects (with photo gallery), reviews, team, FAQ, homepage sections (hero text, stats), legal pages, site settings (contact details, hours, social links). Every text field NL + EN, with a draft / published toggle where it makes sense.
- **Media:** uploads to Supabase Storage, server-side image validation, alt text required.
- **Admin look:** quiet and dense. Same tokens, ink sidebar, works on a phone (leads must be workable on mobile).

## 3. Security and data (do this early, it's urgent)

- The current RLS policies let **anyone** write to every table and the storage bucket, and the anon key is hardcoded in `lib/supabase.ts`. Replace this with:
  - SQL migrations in `supabase/migrations/`;
  - public read only for published content;
  - quote requests inserted only through a server action or route handler with validation (zod), a honeypot and rate limiting;
  - every write requires an authenticated user with the right role;
  - the service-role key only on the server.
- Move all keys to env vars and document them in `.env.example`.
- Drop `output: "export"` and `images.unoptimized` so server actions, auth and `next/image` optimisation work on Vercel.
- Migrate existing data (`admin_products`, `admin_brands`, `admin_services`, `admin_settings`, `quote_requests`) into the new schema without loss. Write the migration and say exactly what the owner must run.
- Don't put the sample leads from the admin board into the database.

### Live state of the Supabase project (checked 2026-10-27, re-check before you start)

- `public` has the five `admin_*` / `quote_requests` tables above. RLS is on, but the policies are wide open. **All five tables have 0 rows.**
- No migrations are recorded (`list_migrations` is empty), so the schema was created by hand from `supabase/admin.sql`.
- Storage has **no buckets** yet.
- The security advisor reports one warning: `public.handle_updated_at` has a mutable `search_path`.
- So the real content today lives in `lib/data.ts`, `lib/i18n/translations.ts` and `data/admin-store.json`. Seed the new tables from those files (real content only), not from the empty tables.

### How to work with the database

- Use the Supabase MCP tools: `list_tables` (verbose) before any change, `apply_migration` for every DDL change, `execute_sql` only for reads and checks, and `generate_typescript_types` into `lib/supabase/database.types.ts` after every migration.
- Every migration also lives as a file in `supabase/migrations/<timestamp>_<name>.sql`, with the same content you applied, so the repo stays the source of truth. Make migrations idempotent where you can.
- Run `get_advisors` (security **and** performance) after each migration and fix everything it reports, including the `handle_updated_at` warning (`set search_path = ''`).
- If the MCP lets you create a development branch, do the schema work there first and merge when it's verified. If not, apply to the main project in small, reversible steps. The tables are empty, so the risk is low, but don't drop anything that has rows without checking first.
- Use `@supabase/ssr` with three clients: browser (publishable key), server components / actions (cookie session), and an admin client (service-role, server-only, in a file marked `import 'server-only'`).
- Check the user with `getClaims()` / `getUser()` on the server, never with `getSession()` alone.

### Schema the new admin needs

Design it yourself, but cover at least:

- **`profiles`**: linked to `auth.users`, with a `role` enum (`owner`, `admin`, `editor`), name and avatar. Add a `security definer` helper `public.has_role(role)` with a fixed `search_path`, and use it in every RLS policy. The first owner is created by an SQL snippet the owner runs once. Write it down in the report.
- **Content tables**: `services`, `products`, `brands`, `projects`, `project_images`, `reviews`, `team_members`, `faqs`, `pages` (legal and other simple pages), `home_sections`, `site_settings`.
  - NL and EN fields: either `_nl` / `_en` columns or a `jsonb` `{nl, en}`. Pick one approach and use it everywhere.
  - Every content table gets `slug` (unique), `status` (`draft` / `published`), `sort_order`, `created_at`, `updated_at` (trigger) and `updated_by`.
  - Join tables: products ↔ brands, projects ↔ services.
- **`media`**: one row per uploaded file, with storage path, width, height, blurhash or dominant colour, alt text NL/EN (required), a `sha256` hash with a unique index (this is how duplicates are blocked, see section 5b), and a usage count.
- **Leads**:
  - `leads` (the new `quote_requests`): contact fields, service, product, postcode, the wizard answers as `jsonb`, source page, UTM parameters, `status`, `assignee`, and consent with a timestamp.
  - `lead_events`: an append-only timeline with status changes, notes, calls and emails, plus who did it and when.
- **`audit_log`**: who changed which content row and when. Fill it with a trigger.
- **Storage buckets**:
  - `media` is public read, and only authenticated editors and up can write. Set a size limit and an allowed MIME list (jpeg, png, webp, avif, svg for logos).
  - `lead-attachments` is private, with signed URLs only, in case customers upload photos of their meter cabinet in the wizard.
- **Realtime** on `leads`, so the inbox updates live and shows a count badge.
- **Email on new lead**: use a Next.js route handler / server action (Resend via env, or SMTP), or a Database Webhook → Edge Function. Pick one and explain why. Also send the customer a plain confirmation email.
- **Rate limiting on lead inserts**: a small `rate_limits` table or an RPC keyed on a hashed IP, so you don't need an external service.
- Indexes on every foreign key and on the `status` / `created_at` columns the admin filters on. Check the performance advisor.

### Admin features on top of section 2

- Dashboard home with leads this week and month by status and by service, the open leads, and the oldest unanswered lead. Plain numbers and one simple chart, nothing decorative.
- Drag-to-reorder for services, projects, FAQs and team members (it writes `sort_order`).
- Live preview: "Bekijk op site" opens draft content using Next.js draft mode.
- Revalidation: after a save, call `revalidateTag` / `revalidatePath`, so published changes show up within seconds without a redeploy.
- Media library with a grid, search, an "unused" filter, duplicate detection at upload, and alt-text editing. Show where an image is used before it can be deleted.
- Lead detail: timeline, notes, status, assignee, one-tap call / WhatsApp / mail, "copy as text" for pasting into a quote, and CSV export of the filtered list.
- Users page (owner only): invite by email, change roles, deactivate.
- Every list has empty, loading (skeleton) and error states. Use optimistic updates for status changes.

## 4. Design implementation

- Put the tokens from `DESIGN-SYSTEM.md` in Tailwind v4 `@theme` (one source of truth). No hard-coded hex values in components.
- Load fonts with `next/font/google`: Archivo variable including the `wdth` axis, plus IBM Plex Mono 500.
- Logos: move `design/assets/*.svg` to `public/brand/`. Generate favicon, apple-touch icon and manifest icons from `mark.svg`. Use `design/assets/brands-mono/` for the supplier and client logo rows.
- Build a small, typed component set and reuse it everywhere: Button (primary / secondary / on-dark / white, md / sm), Chip, Field, Select, Textarea, Accordion, SectionHeading, ProjectCard, ServiceRow, LoopDiagram, TrustStrip, LogoRow, MobileActionBar, Header, MobileMenu, Footer.
- Draw the loop arrowheads precisely, matching the logo's C (derive them from `mark.svg`). The loop is a signature: use it a few times, not everywhere.
- Mobile is first-class, not a shrunk desktop:
  - sticky header that hides on scroll down, and a full-screen menu like `Mobile-Menu.html`;
  - a fixed bottom bar with call / WhatsApp / offerte, with `env(safe-area-inset-bottom)` padding;
  - horizontal snap scrollers for photos and projects, 16px gutters, 44px+ targets;
  - inputs at 16px, no horizontal scroll at 360px.
- Motion: subtle and purposeful (reveal on scroll, image hover, accordion), 150–250ms, and everything off under `prefers-reduced-motion`. Section 4b has the details.

## 4b. Motion and experience

The site should feel modern and alive, like a well-made product site, not a template with fade-ins on every block. Motion explains something (where you are, what changed, what belongs together). It is never decoration.

**Signature moments.** Do these really well:

1. **Loop diagram on the homepage.** The arcs draw themselves (`stroke-dashoffset`) once the diagram scrolls into view. Hovering or focusing a service highlights its arc and its row, and the arrowhead travels along the path. On mobile it becomes a tappable list with the same highlight.
2. **Hero.**
   - The H1 comes in with a short staggered reveal per line (a mask, not a fade from 0).
   - The photo strip drifts slowly on scroll (light parallax, at most 40px).
   - The LCP image must be visible at first paint and must not wait for JS.
3. **Quote wizard.**
   - The loop progress ring fills per step.
   - Steps slide with a shared-axis transition.
   - Selected chips react immediately.
   - The success state closes the loop with one satisfying draw-on of the full C.
4. **Page transitions.** Use the View Transitions API (check what this Next.js version supports in `node_modules/next/dist/docs/`) for a quiet cross-fade between pages. A project card's photo morphs into the project page hero.
5. **Numbers** in the process band count up once, only when they're real numbers.

**Everywhere else:**

- Scroll reveals: a short rise (8–12px) plus opacity, 200ms, staggered by at most 60ms. Run each one once, and only on section-level blocks, not on every paragraph.
- Hover, focus and press states on every control: the button knob nudges, cards lift with a hairline (no heavy shadow), images scale slowly to 1.035, links get an underline offset animation.
- Use a sticky header with a blur only when it sits over content, and a scroll progress hairline on long pages (FAQ, projects).
- Snap scrollers get momentum, visible scroll hints (partial next card) and keyboard arrows.
- Admin: list items animate in and out on filter changes. A status change gives instant feedback, and toasts are quiet.

**Technique and budget:**

- CSS first: transitions, `@starting-style`, scroll-driven animations (`animation-timeline: view()`) with an IntersectionObserver fallback.
- Add **one** small library only if it clearly earns its place (for example `motion` for the wizard and layout animations). Import it only in the client components that need it.
- Animate only `transform`, `opacity` and `clip-path`, and keep it at 60fps on a mid-range Android phone. No scroll-jacking, no smooth-scroll libraries, no cursor effects, no particles, no gradients that move.
- Under `prefers-reduced-motion: reduce`, all of it turns into instant state changes, and the content stays fully visible. Nothing may start with `opacity: 0` in a way that leaves it hidden when JS fails.
- Put the timings and easings in tokens (`--ease-out`, `--dur-fast` 150ms, `--dur` 220ms, `--dur-slow` 400ms for draw-ons) so every animation feels like the same hand made it.

## 5. Simplicity and copy (this matters as much as the visuals)

The owner wants it organized, calm and human-written. Treat every section, label and sentence as something that has to earn its place.

- **Cut what doesn't serve a homeowner or business deciding to request a quote.** Candidates to remove or simplify:
  - the Leaflet solar map and the maintenance planner;
  - the Instagram embed;
  - the cursor follower, the grain overlay and "aurora" / iridescent effects;
  - the live header search;
  - duplicated trust bars and brand marquees;
  - dead code (`MeterkastPlanner`, `SwipeCarousel`, `TrustBar`, `CursorFollower`, unused hooks).

  Judge each one and list what you removed and why.
- **Remove "AI tags"**: eyebrow pills above every heading, pulsing status dots, sparkle and badge decoration, gradient text, glass cards, "NEW" or "Popular" ribbons, emoji, icons repeated next to every line. Keep the fuse-group section label on the homepage only, and drop it wherever a plain heading is enough.
- **Copy rules (Dutch, addressing the reader as "u", B1 level, short sentences):**
  - No staged contrast or two-beat lines: "Niet alleen X, maar Y", "X. En Y.", "Zo werken we. En daarna blijven we.", "Voor thuis. En voor de zaak." Say it once, plainly.
  - No slogan-speak or filler: "Precisie in verduurzaming", "de techniek van morgen", "naadloos", "ontzorgen", "next level", "duurzame toekomst", "Bouw mee aan de toekomst", "Ontdek…".
  - No rule-of-three lists by reflex, no exclamation marks, and few em dashes.
  - Concrete beats abstract: what we install, where, how long it takes, what it costs (as ranges where they're known), what happens next.
  - Headings say what the section is. Buttons say what happens ("Offerte aanvragen", "Bel 06 3431 1225").
  - Never invent facts, numbers, reviews, prices or project details. If something is unknown, leave a clearly marked `TODO(owner)` in the content and list it in your report.
  - The English version is written for English readers, not translated word for word.
- Rewrite the draft lines flagged in `DESIGN-SYSTEM.md` (the "Things … must be corrected" section).
- **No duplicated content.** The current site repeats the same claims across the hero, trust bar, services, about and footer. Each fact lives in one place, on one page, and is said once. Write a one-line purpose for every section in `design/PLAN.md`. If two sections share a purpose, merge them.

## 5b. Images: real, unique, well-used

- **Audit first.** `public/images/` has 77 files.
  - Hash them all (sha256). At least one pair is already byte-identical.
  - Also look for near-duplicates: the same shot at a different size or crop, or `-scaled` / `_1` / `_2` variants. Compare them visually.
  - Write the result as a table in `design/PLAN.md`: file, what it shows, service, keep / merge / drop.
  - Don't delete originals. Move rejected files to `public/images/_unused/` and list them in the report.
- **One photo, one job.** A photo appears at most once per page, and the hero photos aren't reused as card thumbnails elsewhere on the same page. Across the site, prefer a different photo for each service and each project.
- **No stock, no AI-generated images, no placeholder people.**
  - If a section has no real photo, it uses typography or a single-line diagram instead, or it doesn't exist.
  - Mark missing photos as `TODO(owner): photo of X` and leave the slot out of the layout. Don't use a grey box.
- Move every kept image into Supabase Storage via the `media` table, with real alt text (what's in the photo, plus the place if known). The site reads images from the database. `public/` keeps only brand assets and icons.
- Use `next/image` with correct `sizes`, AVIF/WebP, a blur placeholder from the stored dominant colour or blurhash, and `priority` only on the LCP image. Crop for intent with `object-position` stored per image, so faces and panels aren't cut off on mobile.
- Brand and client logos come only from `design/assets/brands-mono/`, shown in one row in one place. No infinite marquee.

## 6. Keep what's already good

The NL/EN dictionary content (rework the copy, keep the coverage), the FAQ content and JSON-LD, contact details, KvK and BTW numbers, WhatsApp prefilled messages, quote prefill from product pages, catalog data and filtering logic (simplified), accessibility helpers (skip link, focus trap, keyboard handling), sitemap and robots, and all project photos in `public/images/`. Don't delete images.

## 7. Delete when no longer referenced

`hostinger-php/`, `old_site/`, `out/`, `scratch/`, `data/admin-store.json` (after migrating anything useful), `.impeccable/`, `dev-server*.log`, `app/veelgestelde-vragen.zip`, the old design docs listed in section 1, and the `nul` file. Check that nothing imports them first.

## 8. Quality bar and verification (required before you call it done)

- `npm run build`, `lint` and `tsc --noEmit` all pass with zero errors and zero warnings you introduced.
- Use Playwright to screenshot **every route** at 360, 390, 768, 1024, 1280 and 1440 widths, NL and EN. Look at each screenshot yourself and fix:
  - overlap, clipping or orphaned words in headings;
  - uneven spacing or misaligned grids;
  - horizontal scroll;
  - broken images;
  - contrast failures.

  Repeat until clean.
- Run Lighthouse on mobile for `/`, a service page, `/aanbod` and `/offerte`: Performance ≥ 90, Accessibility 100, Best Practices ≥ 95, SEO 100. LCP image is preloaded and correctly sized, and there's no layout shift from fonts or images.
- Accessibility: everything works by keyboard, focus is always visible, labels on all inputs, errors announced, WCAG 2.2 AA contrast, sensible headings order, alt text on every photo.
- Test end-to-end:
  - submit a quote → the row appears live in the admin inbox (realtime) → the email notification fires (log it in dev) → change its status → a timeline event is written;
  - login, and role restrictions (an editor can't see leads; test this against the database with `execute_sql` as each role, not just in the UI);
  - content edits showing up on the site after revalidation;
  - uploading a duplicate image is refused.
- The Supabase `get_advisors` checks (security and performance) return zero warnings.
- Motion check: record one Playwright run of the homepage and the wizard at 390px. Confirm there's no jank, nothing stays hidden with JS disabled, and everything is static under reduced motion.
- No image appears twice on the same page. Add a small script or test that checks this for every route.
- Do a last pass with fresh eyes, page by page, asking "would a senior designer ship this?" Pay attention to detail: consistent radii, one primary button per view, aligned baselines, no widows in headings, real hover / focus / active / disabled states on every control, empty and loading states in the admin.

## 9. How to work

Start with a plan in `design/PLAN.md`. It must cover:

- phases with acceptance criteria;
- the full schema (tables, columns, RLS per role, buckets);
- the route map with old → new redirects;
- the section-purpose list per page;
- the image audit table;
- the removal list with a reason for each item;
- the motion inventory (which element, which animation, which duration).

Then put that plan into your task list, the task tool this environment provides. Make one task per phase, with sub-steps concrete enough to tick off (for example "RLS policies for leads + test editor can't read"). Keep exactly one task in progress, and update the list as you go so the owner can follow along. Also tick off the matching items in `PLAN.md` when a phase lands.

Then go ahead without waiting, unless you're blocked on something only the owner can decide. Suggested phases:

1. Security and schema, via MCP migrations, plus RLS tests, types and clean advisors. Then the image audit and the content seed into Supabase.
2. Tokens (including motion tokens), fonts and base components.
3. Layout shell (header, menu, footer, mobile bar).
4. Homepage.
5. Service pages and catalog.
6. Projects, business, about, FAQ, contact, quote wizard.
7. i18n and redirects.
8. Admin.
9. Cleanup.
10. Verification.

Finish with a short report: what changed, what was removed and why, env vars and SQL the owner must run, and the open `TODO(owner)` items. Those already include opening hours (live site 08:00–17:00 vs code 09:00–18:00), "2500+ projecten" / "16+ vakmensen", permission to publish the four testimonials, the Google reviews link, and the email provider.
