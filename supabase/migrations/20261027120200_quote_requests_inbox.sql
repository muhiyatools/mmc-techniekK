-- Leads inbox on the existing quote_requests table (name and rows kept; columns only added).
-- Additive only. The status values and the removal of the old open policies are in
-- 20261027120250_quote_requests_lockdown.sql, run by the owner in the SQL editor.

alter table public.quote_requests
  alter column status set default 'pending',
  alter column status set not null,
  alter column created_at set not null;

create sequence if not exists public.lead_ref_seq;

alter table public.quote_requests
  add column if not exists ref text,
  add column if not exists kind text not null default 'offerte' check (kind in ('offerte', 'contact')),
  add column if not exists postcode text check (char_length(postcode) <= 10),
  add column if not exists house_number text check (char_length(house_number) <= 12),
  add column if not exists property_type text check (char_length(property_type) <= 40),
  add column if not exists timing text check (char_length(timing) <= 40),
  add column if not exists services text[] not null default '{}',
  add column if not exists product_slug text,
  add column if not exists answers jsonb not null default '{}',
  add column if not exists source_page text,
  add column if not exists utm jsonb not null default '{}',
  add column if not exists locale text not null default 'nl' check (locale in ('nl', 'en')),
  add column if not exists consent_at timestamptz,
  add column if not exists assignee uuid references public.profiles (id) on delete set null,
  add column if not exists last_activity_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

-- Existing rows: copy the single service into services[], give each a reference.
update public.quote_requests
   set services = case when service_slug is not null then array[service_slug] else '{}' end,
       ref = 'MMC-' || to_char(created_at, 'YYYY') || '-' || lpad(nextval('public.lead_ref_seq')::text, 4, '0'),
       last_activity_at = created_at
 where ref is null;

alter table public.quote_requests
  alter column ref set default (
    'MMC-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.lead_ref_seq')::text, 4, '0')
  ),
  alter column ref set not null,
  add constraint quote_requests_ref_key unique (ref),
  add constraint quote_requests_name_len check (char_length(name) between 1 and 120),
  add constraint quote_requests_email_format check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 200),
  add constraint quote_requests_phone_len check (char_length(phone) <= 40),
  add constraint quote_requests_message_len check (char_length(message) <= 4000);

comment on table public.quote_requests is 'Leads inbox: quote and contact requests. Inserted only by the server (service role).';
comment on column public.quote_requests.service_slug is 'Legacy single service; new requests use services[].';
comment on column public.quote_requests.product_name is 'Legacy product name; new requests use product_slug.';
comment on column public.quote_requests.consent_at is 'Set for every request from the new site; null on legacy rows.';

-- Timeline and attachments ------------------------------------------------

create type public.lead_event_type as enum ('created', 'status', 'note', 'call', 'email', 'whatsapp', 'assign', 'notify');

create table public.lead_events (
  id bigint generated always as identity primary key,
  lead_id uuid not null references public.quote_requests (id) on delete cascade,
  type public.lead_event_type not null,
  from_status text,
  to_status text,
  body text check (char_length(body) <= 4000),
  actor uuid default auth.uid() references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.lead_files (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.quote_requests (id) on delete cascade,
  path text not null unique,
  mime text not null,
  bytes integer not null check (bytes > 0),
  created_at timestamptz not null default now()
);

insert into public.lead_events (lead_id, type, body, actor, created_at)
select id, 'created', 'Bestaande aanvraag', null, created_at from public.quote_requests;

create index if not exists quote_requests_status_created_idx on public.quote_requests (status, created_at desc);
create index if not exists quote_requests_created_idx on public.quote_requests (created_at desc);
create index if not exists quote_requests_assignee_idx on public.quote_requests (assignee);
create index lead_events_lead_idx on public.lead_events (lead_id, created_at);
create index lead_events_actor_idx on public.lead_events (actor);
create index lead_files_lead_idx on public.lead_files (lead_id);

create trigger quote_requests_touch before update on public.quote_requests
  for each row execute function public.touch_row();

-- Status and assignee changes write their own timeline entries.
create or replace function public.log_lead_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status is distinct from old.status then
    insert into public.lead_events (lead_id, type, from_status, to_status, actor)
    values (new.id, 'status', old.status, new.status, (select auth.uid()));
  end if;
  if new.assignee is distinct from old.assignee then
    insert into public.lead_events (lead_id, type, body, actor)
    values (new.id, 'assign', new.assignee::text, (select auth.uid()));
  end if;
  return new;
end;
$$;

create trigger quote_requests_log_change after update on public.quote_requests
  for each row execute function public.log_lead_change();

create or replace function public.bump_lead_activity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.quote_requests set last_activity_at = new.created_at where id = new.lead_id;
  return new;
end;
$$;

create trigger lead_events_bump after insert on public.lead_events
  for each row execute function public.bump_lead_activity();

alter table public.quote_requests enable row level security;
alter table public.lead_events enable row level security;
alter table public.lead_files enable row level security;

-- No insert policy: new requests only come in through the server (service role).
create policy "admin read" on public.quote_requests for select to authenticated using ((select public.has_role('admin')));
create policy "admin update" on public.quote_requests for update to authenticated
  using ((select public.has_role('admin'))) with check ((select public.has_role('admin')));
create policy "owner delete" on public.quote_requests for delete to authenticated using ((select public.has_role('owner')));

create policy "admin read" on public.lead_events for select to authenticated using ((select public.has_role('admin')));
create policy "admin insert own" on public.lead_events for insert to authenticated
  with check ((select public.has_role('admin')) and actor = (select auth.uid()) and type in ('note', 'call', 'email', 'whatsapp'));

create policy "admin read" on public.lead_files for select to authenticated using ((select public.has_role('admin')));

-- Rate limiting (fixed window), callable by the service role only -----------

create table public.rate_limits (
  key text not null,
  window_start timestamptz not null,
  hits integer not null default 1,
  primary key (key, window_start)
);

alter table public.rate_limits enable row level security;

create or replace function public.check_rate_limit(p_key text, p_max integer, p_window_seconds integer)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  w timestamptz := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);
  n integer;
begin
  insert into public.rate_limits (key, window_start, hits)
  values (p_key, w, 1)
  on conflict (key, window_start) do update set hits = public.rate_limits.hits + 1
  returning hits into n;
  delete from public.rate_limits where window_start < now() - interval '1 day';
  return n <= p_max;
end;
$$;

revoke all on function public.check_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.check_rate_limit(text, integer, integer) to service_role;

-- Realtime for the inbox (RLS still applies to subscribers).
alter publication supabase_realtime add table public.quote_requests;
