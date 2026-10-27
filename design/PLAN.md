# Kringloop migration plan

This is the working plan for moving mmctechniek.nl to the Kringloop design system. The brief is `design/CLAUDE-CODE-PROMPT.md`, and the design source of truth is `design/DESIGN-SYSTEM.md`. When a phase is done, it gets ticked here and in the task list.

Branch: `redesign/kringloop`. Supabase project: **MMC Techniek B.V** (`stjmmlzykokwaqkushnu`). The other project on the account is never touched.

---

## 0. Findings that shape the plan

- **Database.** These tables exist: `admin_products`, `admin_brands`, `admin_services`, `admin_settings` and `quote_requests`.
  - All of them have **0 rows**. There are 0 auth users and no recorded migrations.
  - There is one storage bucket (`product-images`) with 0 objects.
  - Every policy grants `ALL` to `anon`, so anyone can write to every table and the bucket.
  - The advisor shows one warning: `handle_updated_at` has a mutable search_path.
  - Nothing has to be migrated row by row. The old tables can be dropped once the new schema exists.
- **Real content lives in code.** It's in `lib/data.ts`, `lib/i18n/translations.ts` and `supabase/seed.sql`, which has 17 products. `data/admin-store.json` is empty.
- **Photos.** Only the 24 files in `public/images/projects/` are MMC's own photos.
  - Everything in `public/images/services/` is stock: models in hard hats, a render of a villa, a person installing a green battery.
  - So is `background.avif`, `battery_service.jpg`, `bumpp_service.jpg`, `meterkast_service.avif` and `solarbackground.webp`.
  - The products in `seed.sql` point at Unsplash.
  - Under the "no stock" rule, warmtepomp, airco and verduurzaming have **no real photo**. Those service pages use typography and a single-line diagram until the owner supplies photos.
- **Next.js 16.2.**
  - Middleware is now `proxy.ts`.
  - `revalidateTag(tag, 'max')` takes a profile, and `updateTag` gives read-your-own-writes in server actions.
  - `<ViewTransition>` ships in the vendored React canary and needs `experimental.viewTransition`.
  - We use the previous caching model (`unstable_cache` with tags), not `cacheComponents`, to keep the dynamic admin simple.
- **No secret key in the repo.** Writing leads and uploading the seed photos need `SUPABASE_SECRET_KEY` in `.env.local`. That is the owner's to add.

---

## 1. Phases (with acceptance criteria)

### Phase 1: Security, schema, images, seed
- [ ] `supabase/migrations/*` applied through MCP: enums, `profiles` + `has_role()`, content tables, media, leads, lead_events, audit_log, rate_limits, storage buckets and policies, and realtime on `leads`.
- [ ] The old open tables, policies and the `handle_updated_at` function are dropped.
- [ ] Types are generated into `lib/supabase/database.types.ts`.
- [ ] `get_advisors` (security and performance) shows 0 warnings.
- [ ] RLS is checked with `execute_sql` while impersonating `anon`, `editor` and `admin`:
  - anon can't read drafts or leads, and can't write anything;
  - an editor can write content but can't read leads;
  - an admin can read and update leads.
- [ ] The 21 kept photos are moved to `design/photos/` (originals). The 15 rejected files go to `public/images/_unused/`.
- [ ] `scripts/seed-media.mjs` uploads the photos to the `media` bucket, with dimensions, sha256, dominant colour and alt text.
- [ ] The content seed is real content only: services, products (no images, prices kept and flagged), brands, projects (photo groups, no invented places), the four reviews, the FAQ, legal page stubs, site settings and home sections.
- [ ] `lib/supabase.ts` with its hard-coded key is deleted. `.env.example` documents every variable.

### Phase 2: Tokens, fonts, base components
- [ ] The Tailwind v4 `@theme` holds every colour, radius, shadow, container and motion token. There are no hex values in components.
- [ ] `next/font/google`: Archivo variable with the `wdth` axis, and IBM Plex Mono 500.
- [ ] Logos live in `public/brand/`, and the mono logos in `public/brand/logos/`.
- [ ] Favicon, apple-icon and manifest icons are generated from `mark.svg`.
- [ ] Components: Button (4 variants × 2 sizes, plus a link form), Chip, Field / Select / Textarea, Accordion, SectionHeading, GroupLabel (fuse), ProjectCard, ServiceRow, LoopDiagram, TrustStrip, LogoRow, Reveal, SnapScroller, Media (wraps next/image with a blur colour).

### Phase 3: Layout shell
- [ ] The header is sticky, hides on scroll down, and blurs only when it sits over content.
- [ ] The full-screen MobileMenu has a focus trap and Esc.
- [ ] The Footer and the MobileActionBar (with safe area) are in place.
- [ ] The NL/EN switch keeps the current path.
- [ ] There's a skip link, and `:focus-visible` everywhere.

### Phase 4: Homepage
- [ ] Desktop matches `Home.html` and mobile matches `Mobile-Home.html`, with the copy rewritten.
- [ ] The loop diagram draws on. Hovering or focusing a service syncs the arc and the row.
- [ ] The H1 has a mask reveal and the photo strip has light parallax. The LCP image is server-rendered with `priority`.

### Phase 5: Services and catalog
- [ ] `/diensten/[slug]` covers: what it is, who it's for, how it works, brands, products, related projects, FAQ and CTA.
- [ ] `/aanbod` filters by service and brand through URL state. `/aanbod/[slug]` has specs, a price range and "Offerte voor dit product" that prefills `/offerte`.

### Phase 6: Other pages
- [ ] `/projecten` has a filter, and `/projecten/[slug]` has a gallery and a view-transition morph from the card.
- [ ] Also built: `/zakelijk`, `/over-ons`, `/veelgestelde-vragen` (search, grouping and FAQPage JSON-LD), `/contact` (short form), and the legal pages.
- [ ] `/offerte` is the 3-step wizard with a progress ring, a shared-axis step transition and a loop success state. It prefills from `?dienst=&product=`.
  - The server action uses zod, a honeypot and a rate limit. It inserts the lead and its first event, emails the company and the customer, and returns a reference.

### Phase 7: i18n and redirects
- [ ] Routes live under `app/[lang]`. `proxy.ts` rewrites `/x` to `/nl/x` and redirects `/nl/x` to `/x`. EN lives under `/en/...`.
- [ ] hreflang and canonical tags on every page, plus a sitemap with alternates.
- [ ] All the old URLs in section 3 redirect permanently.

### Phase 8: Admin
- [ ] Login uses password or magic link. The session is checked on the server with `getClaims()`.
- [ ] Each role gets the navigation and access it's allowed.
- [ ] The dashboard, the leads inbox (realtime, tabs, search, detail, timeline, notes, assignee, quick actions, copy-as-text, CSV) and the generic content editor are built.
- [ ] Every text field is NL/EN, with a draft/published toggle.
- [ ] Lists can be reordered by dragging.
- [ ] Saves revalidate the public pages, and a preview runs through draft mode.
- [ ] The media library has upload validation, duplicate refusal, an "unused" filter, alt-text editing and a usage view.
- [ ] The users page (owner only) can invite people, change roles and deactivate accounts.
- [ ] Every list has empty, loading and error states.

### Phase 9: Cleanup
- [ ] Delete `hostinger-php/`, `old_site/`, `out/`, `scratch/`, `data/`, `.impeccable*`, the dev logs, the zip, the old docs and `nul`, after a grep confirms nothing references them.
- [ ] Delete the removed components (section 6).

### Phase 10: Verification
- [ ] `build`, `lint` and `tsc --noEmit` pass with 0 errors.
- [ ] Playwright screenshots at 360/390/768/1024/1280/1440 × NL/EN are reviewed and fixed.
- [ ] Lighthouse (mobile) on 4 routes.
- [ ] An a11y pass.
- [ ] The end-to-end lead test.
- [ ] A check that no image appears twice on any route, a motion check, and a reduced-motion check.

---

## 2. Database schema

All content text is `jsonb` shaped `{"nl": "...", "en": "..."}` (type `Localized`). NL is required in the app and EN is optional, falling back to NL.

**Enums:**
- `app_role` (`editor` < `admin` < `owner`)
- `content_status` (`draft`, `published`)
- `lead_status` (`new`, `in_progress`, `quote_sent`, `won`, `lost`)
- `lead_event_type` (`created`, `status`, `note`, `call`, `email`, `whatsapp`, `assign`)
- `brand_kind` (`supplier`, `client`)

**Shared columns on content tables:** `id uuid`, `slug text unique`, `status`, `sort_order int`, `created_at`, `updated_at` (trigger), `updated_by uuid` (trigger sets `auth.uid()`).

| Table | Purpose | Key columns |
|---|---|---|
| `profiles` | One per auth user | `role app_role`, `full_name`, `active bool`. Created by a trigger on `auth.users`. Role changes are allowed only for the owner (trigger guard). |
| `media` | Every uploaded image | `bucket`, `path unique`, `width`, `height`, `mime`, `bytes`, `sha256 unique`, `dominant_color`, `alt jsonb` (NL required, check constraint), `focal_x`, `focal_y` (object-position %) |
| `services` | The 7 services | `number`, `title`, `kicker` (mono subtitle), `summary`, `body` (markdown), `audience`, `steps jsonb[]`, `tags`, `hero_media_id` |
| `brands` | Suppliers and clients | `name`, `kind`, `logo_path` (static `/brand/logos/*`), `website`, `show_in_strip` |
| `products` | Catalog | `service_id`, `name`, `tier`, `summary`, `specs jsonb {nl:[],en:[]}`, `price_from`, `price_to` (EUR, incl. installation, nullable), `media_id` |
| `product_brands` | product ↔ brand | composite PK |
| `projects` | Real jobs | `title`, `summary`, `body`, `place` (nullable), `year`, `sector` (`particulier`, `utiliteit`, `retail`, `nieuwbouw`), `cover_media_id`, `featured` |
| `project_images` | Gallery | `project_id`, `media_id`, `sort_order` |
| `project_services` | project ↔ service | composite PK |
| `reviews` | Testimonials | `author`, `place`, `body`, `rating`, `source`, `consent bool` |
| `team_members` | Over ons | `name`, `role`, `bio`, `media_id` |
| `faqs` | FAQ | `service_id` (nullable = general), `question`, `answer` |
| `pages` | Legal pages and simple pages | `slug`, `title`, `body` (markdown), `seo_description` |
| `home_sections` | Homepage text blocks | `key` PK (`hero`, `trust`, `audience`, `process`, `quote`), `content jsonb` |
| `site_settings` | Contact details, hours, socials | `key` PK, `value jsonb` |
| `leads` | Quote and contact requests | `ref` (`MMC-YYYY-NNNN` from a sequence), `status`, `kind` (`offerte` / `contact`), `name`, `email`, `phone`, `postcode`, `house_number`, `property_type`, `timing`, `services text[]`, `product_slug`, `message`, `answers jsonb`, `source_page`, `utm jsonb`, `locale`, `consent_at`, `assignee` → profiles, `last_activity_at` |
| `lead_events` | Append-only timeline | `lead_id`, `type`, `from_status`, `to_status`, `body`, `actor`, `created_at` |
| `lead_files` | Customer photos | `lead_id`, `path` (private bucket), `mime`, `bytes` |
| `audit_log` | Content changes | `table_name`, `row_id`, `action`, `actor`, `changed jsonb`. Written by a trigger. |
| `rate_limits` | Lead throttling | `key` (sha256 of IP + salt), `window_start`, `hits`. Only reachable through `check_rate_limit()`, granted to service_role. |

**Helpers:** `has_role(min app_role)` is `security definer stable`, with `search_path = ''`. Every function gets `set search_path = ''`.

**RLS:**
- **Content** (`services`, `products`, `brands`, `projects`, `reviews`, `team_members`, `faqs`, `pages`, plus the join tables): select is `status = 'published' or has_role('editor')`, and writes need `has_role('editor')`.
- **`media`, `home_sections`, `site_settings`:** select is public. Writes need editor for `media` and `home_sections`, and admin for `site_settings`.
- **`leads`, `lead_files`:** select and update need `has_role('admin')`, delete needs owner, and there's **no insert policy** (inserts go through service_role from the server action).
- **`lead_events`:** select needs admin. Insert needs admin with `actor = auth.uid()`. There are no update or delete policies.
- **`profiles`:** select is self or admin. Users can update their own name, and only the owner can change `role` or `active`.
- **`audit_log`:** select needs admin. Writes only come from the trigger.

**Storage:**
- `media` is public read, with editor+ writes, a 10 MB limit, and jpeg/png/webp/avif/svg only.
- `lead-attachments` is private, with admin read, service-role writes and a 10 MB limit.
- The old `product-images` bucket is emptied and its open policies dropped.

**Realtime:** `leads` is in `supabase_realtime`, and RLS applies.

**Indexes:** every FK, plus `(status, sort_order)` on content tables, and `leads(status, created_at desc)`, `leads(assignee)` and `lead_events(lead_id, created_at)`.

**Email on a new lead:** sent from the same server action, after the insert. The provider comes from env (`MAIL_PROVIDER=resend|smtp|log`).
- **Why not Webhook → Edge Function:** it adds a second deploy target and a second secret store for one email. In the server action the lead is already validated, and failures are logged into `lead_events`.

**First owner:** the owner signs up through `/admin/login` (magic link) or is invited. Then they run this once in the SQL editor:

```sql
update public.profiles set role = 'owner', active = true
where id = (select id from auth.users where email = 'info@mmctechniek.nl');
```

---

## 3. Route map and redirects

| New route (NL `/…`, EN `/en/…`) | Source |
|---|---|
| `/` | Home |
| `/diensten/[slug]`, with slugs `zonnepanelen`, `thuisbatterij`, `meterkast`, `warmtepompen`, `airconditioning`, `onderhoud`, `verduurzaming` | services |
| `/aanbod`, `/aanbod/[slug]` | products |
| `/projecten`, `/projecten/[slug]` | projects |
| `/zakelijk`, `/over-ons`, `/veelgestelde-vragen`, `/offerte`, `/contact` | |
| `/privacy`, `/cookies`, `/algemene-voorwaarden` | pages |
| `/admin/**` | Admin, not localised |

Permanent redirects (308):

| Old | New |
|---|---|
| `/our-work` | `/projecten` |
| `/product?name=X[&service=Y]` | `/aanbod/slugify(X)`, or `/aanbod` without a name |
| `/aanbod?dienst=X[&type=…]` | `/diensten/X` (mapped through the slug renames below) |
| `/contact?service=X&product=Y[&size=Z]` | `/offerte?dienst=X&product=slugify(Y)` |
| `/diensten/batterijopslag` | `/diensten/thuisbatterij` |
| `/diensten/renovaties` | `/diensten/verduurzaming` |
| any `?lang=en` | `/en` + path (param stripped) |
| trailing-slash URLs from the static export | without the slash (Next default) |

---

## 4. Section purpose per page

Each fact appears **once** per page. Rules: "Sinds 2008" lives in the trust strip; "binnen 24 uur" lives only in the quote panel; the certifications appear in the trust strip on content pages, and in the footer as small text only.

**Home**
1. **Hero:** what MMC does and where, plus one action (quote) and a direct line (call / WhatsApp). The photo strip proves it's real work. The floating review card is the one review in the hero.
2. **Trust strip:** certifications, years active, own fitters, area served. It answers "can I trust them".
3. **Brands we install:** a single static row (no marquee). It answers "do they fit the brand I want".
4. **Services and loop:** the 7 services and how they connect. It's the entry point to each service page.
5. **For homes / for businesses:** sends the two audiences to the right next page (`/offerte` and `/zakelijk`). The client logos appear only here on the homepage.
6. **Projects:** 6 recent real jobs with a filter. It's the proof.
7. **Process (dark):** what happens after a request, in 4 steps. The stats row is **removed**, because it repeated the trust strip.
8. **Reviews:** three of the four reviews (the fourth is in the hero card, so none repeats).
9. **Quote panel:** starts the wizard inline (step 1), with the alternative contact routes.
10. **FAQ:** the 5 most common questions, linking to the full list.

**Service page:**
- intro with what it is and who it's for;
- how it works (3–4 steps, single-line diagram);
- brands;
- products (only when the catalog has some);
- related projects (only when there are some);
- FAQ for this service;
- CTA.

**Aanbod:** filter, then the grid, then a CTA for "not sure what you need".

**Product:**
- specs and price range;
- the brand;
- the service it belongs to;
- "Offerte voor dit product";
- 3 related products.

**Projecten:** a sector filter, then the grid. **Project detail:** title and meta, gallery, what we did, related service, CTA.

**Zakelijk:**
- what we do for businesses (utility, retail, new build, NEN 3140);
- client logos;
- business projects;
- CTA "Zakelijke aanvraag".

**Over ons:**
- the short story (since 2008, Oudewater, own team);
- certifications explained;
- the team (only when there are members);
- area served;
- CTA.

**FAQ:** search, groups by service, and "question not listed?" contact.

**Contact:**
- details (address, phone, WhatsApp, email, hours, map link);
- a short form;
- KvK and BTW.

**Offerte:** the wizard only, inside the minimal chrome from the board.

---

## 5. Image audit

All files were hashed with sha256 and checked visually on a contact sheet.

| File | Shows | Use | Decision |
|---|---|---|---|
| projects/20240920_112524-scaled.jpg | New groepenkast with RCBOs | Meterkast | **keep** (meterkast hero) |
| projects/20240920_120951-scaled.jpg | Supermarket interior, new lighting runs | Retail project | **keep** |
| projects/20240920_121002-scaled.jpg | Same store, ducts and lighting, other angle | Retail project gallery | **keep** (gallery only) |
| projects/20240923_175045-scaled.jpg | MMC fitter at supermarket façade sign | Retail project | **keep** (cover) |
| projects/DSC_0004-scaled.jpg | Building under renovation, MMC vans | Renovation project | **keep** |
| projects/IMG-20240930-WA0010.jpg | Close-up of a steel door, unclear subject | — | **drop** → `_unused` |
| projects/PHOTO-2024-12-03-12-54-01.jpg | Solar panels on a flat roof | Solar project | **keep** (cover) |
| projects/PHOTO-…-54-02_1.jpg | Two inverters and a battery on a brick wall | Battery | **keep** (thuisbatterij hero) |
| projects/PHOTO-…-54-03.jpg | Large main distribution board | Utility project | **keep** |
| projects/PHOTO-…-54-04_2.jpg | Flat-roof mounting frame | Solar gallery | **keep** |
| projects/PHOTO-…-54-04_3.jpg | Same roof, mounting frame, near-duplicate of 04_2 | Solar gallery | **keep, gallery only** (never next to 04_2 outside the gallery) |
| projects/PHOTO-…-54-06_1.jpg | Commercial hall ceiling, scissor lift | Utility project | **keep** |
| projects/PHOTO-…-54-06_2.jpg | Empty hall during construction | Utility gallery | **keep** |
| projects/PHOTO-…-54-07_2.jpg | Groepenkast on a timber wall, new build | New-build project | **keep** |
| projects/PHOTO-…-54-08.jpg | Inverter in a technical room | Onderhoud hero | **keep** |
| projects/PHOTO-…-54-08_2.jpg | Finished room with ceiling spots | Utility gallery | **keep** |
| projects/PHOTO-2024-12-08-15-05-58.jpg | Data / server cabinet | Utility gallery | **keep** |
| projects/PHOTO-…-15-05-59.jpg | Solar on new-build pitched roofs, scaffolding | New-build solar | **keep** (cover) |
| projects/PHOTO-…-15-05-59-2.jpg | Garden with fence posts, no installation visible | — | **drop** → `_unused` |
| projects/PHOTO-…-15-05-59-3.jpg | House in scaffolding and a van | New-build solar gallery | **keep** |
| projects/PHOTO-…-15-06-00.jpg | Shop ceiling work from a scissor lift | Retail 2 | **keep** (cover) |
| projects/PHOTO-…-15-06-01.jpg | Same shop, aisles | Retail 2 gallery | **keep** |
| projects/PHOTO-…-15-12-08.jpg | New-build site with a crane | New-build | **keep** (cover) |
| projects/PHOTO-…-15-12-09.jpg | Timber-frame interior with cabling | New-build gallery | **keep** |
| services/*.webp, services/airco.jpg (7 files) | Stock photography | — | **drop** → `_unused` (stock) |
| background.avif, solarbackground.webp, battery_service.jpg, bumpp_service.jpg, meterkast_service.avif | Stock and render | — | **drop** → `_unused` (stock) |
| logo.png | **Byte-identical** to branding/logo.png | — | **drop** (duplicate) → `_unused` |
| branding/icon-*.png | Old decorative icons | — | **drop** → `_unused` |
| MMC_Techniek_Arabic_Clear.docx | A document, publicly served by mistake | — | moved out of `public/` to `design/archive/` |
| brands/*, partners/* | Coloured logos | — | replaced by `design/assets/brands-mono` → `_unused` |
| certifications/*, nen1010.png | Cert marks | Trust strip | **keep** (moved to `public/brand/certs/`) |

**Photo assignment, so nothing repeats on a page.** The services are taken from the loop (zonnepanelen, thuisbatterij, meterkast, onderhoud).
- **Home hero strip:**
  - zonnepanelen cover (54-01);
  - retail façade (175045), with the review card;
  - groepenkast (112524).
- **Home services rows:** each row uses its own service hero.
  - zonnepanelen uses 54-04_2 (not 54-01, which the hero already uses);
  - thuisbatterij uses 54-02_1;
  - meterkast uses 54-07_2 (not 112524);
  - onderhoud uses 54-08;
  - warmtepompen, airco and verduurzaming show **no image**, with the loop node only. That's flagged as TODO(owner).
- **Home audience cards:**
  - particulier uses 15-05-59 (new-build roofs);
  - zakelijk uses 54-03 (main board).
- **Home projects grid:** the first 6 projects whose cover isn't already used above.

A test script (`scripts/check-dup-images.mjs`) crawls every route and fails if any image source appears twice on a page.

---

## 6. Removal list

| Item | Why |
|---|---|
| Leaflet solar map (`LeafletMap`, `SolarSection`) and the `leaflet` dependency | Heavy (a map library) for a toy estimate. It doesn't help anyone decide to ask for a quote. |
| `MaintenancePlanner`, `MeterkastPlanner` | Calculators with made-up outputs. They aren't used or aren't trustworthy. |
| Instagram iframe (`our-work/InstagramFeed`) | It's a third-party embed that's slow and shows someone else's UI. Replaced by real projects. |
| `CursorFollower`, grain overlay, aurora / iridescent CSS | Decoration that reads as generated. |
| Live header search | Too few pages to justify it. The FAQ has its own search. |
| `TrustBar`, `ClientStrip` marquee, `TrustStrip` (old), `HairlineDivider`, `SwipeCarousel`, `BottomNav`, `StickyCTA`, `ScrollToTop`, `MobileSheet`, `WhatsAppButton` floating button | Duplicated trust bars and marquees. Mobile CTAs are unified into one MobileActionBar. |
| `swiper` dependency | Replaced by CSS scroll-snap. |
| `lib/adminStore.ts`, the old `app/admin/page.tsx` (client-side password) | An insecure admin, replaced. |
| `lib/supabase.ts` | The anon key was hard-coded. |
| `lib/i18n/LanguageContext` client context | Language now comes from the URL, rendered on the server. |
| `useClickOutside`, `useTouchDevice`, `useSwipe` | Unused once the components above are gone. `useFocusTrap` is kept and reworked. |
| `/product?name=`, `/our-work` routes | Replaced and redirected. |
| Pulsing dot, hero pill, sparkles, badges, "Populair" ribbons | AI tags. |

---

## 7. Motion inventory

Tokens:
- `--ease-out: cubic-bezier(.2,.7,.2,1)`
- `--ease-in-out: cubic-bezier(.65,0,.35,1)`
- `--dur-fast: 150ms`
- `--dur: 220ms`
- `--dur-slow: 400ms`
- `--dur-draw: 900ms`

| Element | Animation | Duration | Technique |
|---|---|---|---|
| Hero H1 lines | Mask reveal, rising out of `overflow:hidden`, 70ms stagger | 600ms total | CSS keyframes at first paint (no JS gate; text stays visible if CSS animations are off) |
| Hero photo strip | Parallax translateY, up to 40px | scroll-linked | `animation-timeline: view()` with an IO fallback that does nothing |
| Section blocks | Rise of 10px plus opacity, once | `--dur` | `@supports (animation-timeline)` with CSS; otherwise IO adds `.in` (content visible without JS) |
| Loop diagram arcs | Draw-on with stroke-dashoffset on enter | `--dur-draw` | IO, then a class |
| Loop node / service row | Highlight sync, arc segment grows to the active node, arrowhead follows | `--dur` | state + CSS transitions |
| Buttons | Knob nudges 3px, colour changes | `--dur-fast` | CSS |
| Image tiles and cards | Image scales to 1.035 on hover, card lifts 2px with a hairline | 800ms / `--dur` | CSS |
| Links | Underline-offset animation | `--dur-fast` | CSS |
| Accordion | Height via `grid-template-rows: 0fr→1fr`, plus/minus rotates 45° | `--dur` | CSS |
| Header | Hides and shows on scroll direction, blur when over content | `--dur` | small hook |
| Mobile menu | Fade plus 12px rise, links stagger 30ms | `--dur` | CSS `@starting-style` |
| Scroll progress hairline | Width tracks the scroll position | scroll-linked | `animation-timeline: scroll()` (no fallback, decorative) |
| Trust number ("18 jaar") | Counts up once on enter | 900ms | IO + rAF. Shows the final value without JS. |
| Page navigation | Root cross-fade | 200ms | `<ViewTransition>` plus `experimental.viewTransition` |
| Project card → project hero | Shared-element morph | 400ms | `<ViewTransition name="project-{slug}">` |
| Wizard progress ring | Arc length grows per step | `--dur-slow` | CSS transition on `stroke-dashoffset` |
| Wizard steps | Shared axis: out x−24 with fade, in x+24 with fade (reversed for back) | `--dur` | CSS classes keyed by direction |
| Wizard chips | Check box fills, ring colour changes | `--dur-fast` | CSS |
| Wizard success | Full C draws on, then the check | 900ms + 300ms | CSS |
| Admin list | Rows fade and slide in on filter change, status pill cross-fades | `--dur` | CSS |
| Admin toast | Slides up 8px, auto-hides after 3s | `--dur` | CSS |

Under `prefers-reduced-motion: reduce`, every keyframe, transition and view transition is turned off. Content stays at its final state.

---

## 8. Open TODO(owner)

These are collected in the final report:

- Opening hours: the live site says 08:00–17:00, the code says 09:00–18:00. 08:00–17:00 is seeded, editable in admin.
- "2500+ projecten" and "16+ vakmensen" aren't shown until confirmed.
- Permission to publish the four testimonials. They're seeded as published because they're already live; `consent=false` until confirmed.
- The Google reviews link.
- The email provider: `MAIL_PROVIDER` plus `RESEND_API_KEY`, or SMTP for info@mmctechniek.nl.
- `SUPABASE_SECRET_KEY` in `.env.local` / Vercel.
- Photos for warmtepompen, airconditioning and verduurzaming.
- Places and years for the projects (seeded without places).
- Product prices from `seed.sql`: confirm they're current.
- Team members for over-ons.
