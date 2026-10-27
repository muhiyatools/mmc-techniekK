-- Content: media, services, brands, products, projects, reviews, team, faqs, pages,
-- home sections, site settings, audit log.
-- Localised text is jsonb shaped {"nl": "...", "en": "..."}; nl is required where noted.

create type public.brand_kind as enum ('supplier', 'client');
create type public.project_sector as enum ('particulier', 'utiliteit', 'retail', 'nieuwbouw');

create or replace function public.has_nl(v jsonb)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select jsonb_typeof(v) = 'object' and coalesce(btrim(v ->> 'nl'), '') <> '';
$$;

-- Media ------------------------------------------------------------------

create table public.media (
  id uuid primary key default gen_random_uuid(),
  bucket text not null default 'media',
  path text not null unique,
  mime text not null,
  bytes integer not null check (bytes > 0),
  width integer not null check (width > 0),
  height integer not null check (height > 0),
  sha256 text not null unique,
  dominant_color text not null default '#DCE3EA',
  alt jsonb not null check (public.has_nl(alt)),
  focal_x smallint not null default 50 check (focal_x between 0 and 100),
  focal_y smallint not null default 50 check (focal_y between 0 and 100),
  created_by uuid default auth.uid() references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Services ---------------------------------------------------------------

create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  status public.content_status not null default 'draft',
  sort_order integer not null default 0,
  title jsonb not null check (public.has_nl(title)),
  kicker jsonb not null default '{}',
  summary jsonb not null default '{}',
  body jsonb not null default '{}',
  audience jsonb not null default '{}',
  steps jsonb not null default '[]' check (jsonb_typeof(steps) = 'array'),
  tags jsonb not null default '{}',
  hero_media_id uuid references public.media (id) on delete set null,
  seo_description jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id) on delete set null
);

-- Brands -----------------------------------------------------------------

create table public.brands (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  status public.content_status not null default 'published',
  sort_order integer not null default 0,
  kind public.brand_kind not null default 'supplier',
  name text not null,
  logo_path text,
  website text,
  show_in_strip boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id) on delete set null
);

-- Products ---------------------------------------------------------------

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  status public.content_status not null default 'draft',
  sort_order integer not null default 0,
  service_id uuid not null references public.services (id) on delete restrict,
  name text not null,
  tier text check (tier in ('basis', 'midden', 'premium')),
  summary jsonb not null default '{}',
  body jsonb not null default '{}',
  specs jsonb not null default '{"nl": [], "en": []}',
  price_from integer check (price_from >= 0),
  price_to integer check (price_to >= 0),
  price_note jsonb not null default '{}',
  media_id uuid references public.media (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id) on delete set null,
  check (price_to is null or price_from is null or price_to >= price_from)
);

create table public.product_brands (
  product_id uuid not null references public.products (id) on delete cascade,
  brand_id uuid not null references public.brands (id) on delete cascade,
  primary key (product_id, brand_id)
);

-- Projects ---------------------------------------------------------------

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  status public.content_status not null default 'draft',
  sort_order integer not null default 0,
  title jsonb not null check (public.has_nl(title)),
  summary jsonb not null default '{}',
  body jsonb not null default '{}',
  place text,
  year smallint check (year between 2008 and 2100),
  sector public.project_sector not null default 'particulier',
  cover_media_id uuid references public.media (id) on delete set null,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id) on delete set null
);

create table public.project_images (
  project_id uuid not null references public.projects (id) on delete cascade,
  media_id uuid not null references public.media (id) on delete cascade,
  sort_order integer not null default 0,
  primary key (project_id, media_id)
);

create table public.project_services (
  project_id uuid not null references public.projects (id) on delete cascade,
  service_id uuid not null references public.services (id) on delete cascade,
  primary key (project_id, service_id)
);

-- Reviews, team, FAQ, pages ---------------------------------------------

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  status public.content_status not null default 'draft',
  sort_order integer not null default 0,
  author text not null,
  place text,
  body jsonb not null check (public.has_nl(body)),
  rating smallint not null default 5 check (rating between 1 and 5),
  source text,
  consent boolean not null default false,
  review_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id) on delete set null
);

create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  status public.content_status not null default 'draft',
  sort_order integer not null default 0,
  name text not null,
  role jsonb not null default '{}',
  bio jsonb not null default '{}',
  media_id uuid references public.media (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id) on delete set null
);

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  status public.content_status not null default 'draft',
  sort_order integer not null default 0,
  service_id uuid references public.services (id) on delete set null,
  featured boolean not null default false,
  question jsonb not null check (public.has_nl(question)),
  answer jsonb not null check (public.has_nl(answer)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id) on delete set null
);

create table public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  status public.content_status not null default 'draft',
  sort_order integer not null default 0,
  title jsonb not null check (public.has_nl(title)),
  body jsonb not null default '{}',
  seo_description jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id) on delete set null
);

create table public.home_sections (
  key text primary key check (key ~ '^[a-z_]+$'),
  content jsonb not null default '{}',
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id) on delete set null
);

create table public.site_settings (
  key text primary key check (key ~ '^[a-z_]+$'),
  value jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id) on delete set null
);

-- Audit log --------------------------------------------------------------

create table public.audit_log (
  id bigint generated always as identity primary key,
  table_name text not null,
  row_id text not null,
  action text not null check (action in ('insert', 'update', 'delete')),
  actor uuid references public.profiles (id) on delete set null,
  changed jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.write_audit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  rid text;
  diff jsonb;
begin
  if tg_op = 'DELETE' then
    rid := coalesce(to_jsonb(old) ->> 'id', to_jsonb(old) ->> 'key');
    diff := to_jsonb(old);
  elsif tg_op = 'INSERT' then
    rid := coalesce(to_jsonb(new) ->> 'id', to_jsonb(new) ->> 'key');
    diff := to_jsonb(new);
  else
    rid := coalesce(to_jsonb(new) ->> 'id', to_jsonb(new) ->> 'key');
    select coalesce(jsonb_object_agg(n.key, n.value), '{}')
      into diff
      from jsonb_each(to_jsonb(new)) n
     where n.key not in ('updated_at', 'updated_by')
       and n.value is distinct from (to_jsonb(old) -> n.key);
    if diff = '{}' then
      return new;
    end if;
  end if;
  insert into public.audit_log (table_name, row_id, action, actor, changed)
  values (tg_table_name, rid, lower(tg_op), (select auth.uid()), diff);
  return coalesce(new, old);
end;
$$;

-- Triggers + RLS for every content table ---------------------------------

do $$
declare
  t text;
begin
  foreach t in array array['media', 'services', 'brands', 'products', 'projects', 'reviews',
                            'team_members', 'faqs', 'pages', 'home_sections', 'site_settings']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create trigger %I before update on public.%I for each row execute function public.touch_row()', t || '_touch', t);
    execute format('create trigger %I after insert or update or delete on public.%I for each row execute function public.write_audit()', t || '_audit', t);
  end loop;

  -- Published content is public; editors see and write everything.
  foreach t in array array['services', 'brands', 'products', 'projects', 'reviews', 'team_members', 'faqs', 'pages']
  loop
    execute format($p$create policy "read published or editor" on public.%I for select to anon, authenticated
      using (status = 'published' or (select public.has_role('editor')))$p$, t);
    execute format($p$create policy "editor insert" on public.%I for insert to authenticated
      with check ((select public.has_role('editor')))$p$, t);
    execute format($p$create policy "editor update" on public.%I for update to authenticated
      using ((select public.has_role('editor'))) with check ((select public.has_role('editor')))$p$, t);
    execute format($p$create policy "editor delete" on public.%I for delete to authenticated
      using ((select public.has_role('editor')))$p$, t);
  end loop;

  foreach t in array array['product_brands', 'project_images', 'project_services']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format($p$create policy "public read" on public.%I for select to anon, authenticated using (true)$p$, t);
    execute format($p$create policy "editor insert" on public.%I for insert to authenticated
      with check ((select public.has_role('editor')))$p$, t);
    execute format($p$create policy "editor update" on public.%I for update to authenticated
      using ((select public.has_role('editor'))) with check ((select public.has_role('editor')))$p$, t);
    execute format($p$create policy "editor delete" on public.%I for delete to authenticated
      using ((select public.has_role('editor')))$p$, t);
  end loop;
end;
$$;

create policy "public read" on public.media for select to anon, authenticated using (true);
create policy "editor insert" on public.media for insert to authenticated with check ((select public.has_role('editor')));
create policy "editor update" on public.media for update to authenticated
  using ((select public.has_role('editor'))) with check ((select public.has_role('editor')));
create policy "editor delete" on public.media for delete to authenticated using ((select public.has_role('editor')));

create policy "public read" on public.home_sections for select to anon, authenticated using (true);
create policy "editor insert" on public.home_sections for insert to authenticated with check ((select public.has_role('editor')));
create policy "editor update" on public.home_sections for update to authenticated
  using ((select public.has_role('editor'))) with check ((select public.has_role('editor')));

create policy "public read" on public.site_settings for select to anon, authenticated using (true);
create policy "admin insert" on public.site_settings for insert to authenticated with check ((select public.has_role('admin')));
create policy "admin update" on public.site_settings for update to authenticated
  using ((select public.has_role('admin'))) with check ((select public.has_role('admin')));

alter table public.audit_log enable row level security;
create policy "admin read" on public.audit_log for select to authenticated using ((select public.has_role('admin')));

-- Indexes ----------------------------------------------------------------

create index services_status_sort_idx on public.services (status, sort_order);
create index services_hero_media_idx on public.services (hero_media_id);
create index brands_kind_sort_idx on public.brands (kind, sort_order);
create index products_service_idx on public.products (service_id);
create index products_status_sort_idx on public.products (status, sort_order);
create index products_media_idx on public.products (media_id);
create index product_brands_brand_idx on public.product_brands (brand_id);
create index projects_status_sort_idx on public.projects (status, sort_order);
create index projects_cover_idx on public.projects (cover_media_id);
create index project_images_media_idx on public.project_images (media_id);
create index project_services_service_idx on public.project_services (service_id);
create index reviews_status_sort_idx on public.reviews (status, sort_order);
create index team_members_status_sort_idx on public.team_members (status, sort_order);
create index team_members_media_idx on public.team_members (media_id);
create index faqs_service_idx on public.faqs (service_id);
create index faqs_status_sort_idx on public.faqs (status, sort_order);
create index media_created_by_idx on public.media (created_by);
create index audit_log_row_idx on public.audit_log (table_name, row_id, created_at desc);
create index audit_log_actor_idx on public.audit_log (actor);
create index services_updated_by_idx on public.services (updated_by);
create index brands_updated_by_idx on public.brands (updated_by);
create index products_updated_by_idx on public.products (updated_by);
create index projects_updated_by_idx on public.projects (updated_by);
create index reviews_updated_by_idx on public.reviews (updated_by);
create index team_members_updated_by_idx on public.team_members (updated_by);
create index faqs_updated_by_idx on public.faqs (updated_by);
create index pages_updated_by_idx on public.pages (updated_by);
create index home_sections_updated_by_idx on public.home_sections (updated_by);
create index site_settings_updated_by_idx on public.site_settings (updated_by);

-- How many places use a media row (for the media library).
create or replace view public.media_usage
with (security_invoker = true)
as
select m.id as media_id,
  (select count(*) from public.services s where s.hero_media_id = m.id)
  + (select count(*) from public.products p where p.media_id = m.id)
  + (select count(*) from public.projects pr where pr.cover_media_id = m.id)
  + (select count(*) from public.project_images pi where pi.media_id = m.id)
  + (select count(*) from public.team_members t where t.media_id = m.id) as uses
from public.media m;
