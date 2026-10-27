-- Core: enums, profiles, role helper, shared triggers.

create type public.app_role as enum ('editor', 'admin', 'owner');
create type public.content_status as enum ('draft', 'published');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text not null default '',
  role public.app_role not null default 'editor',
  active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'One row per auth user. New users start inactive; an owner activates them.';

alter table public.profiles enable row level security;

-- Rank roles so a check for ''editor'' also passes for admin and owner.
create or replace function public.role_rank(r public.app_role)
returns int
language sql
immutable
set search_path = ''
as $$
  select case r when 'editor' then 1 when 'admin' then 2 when 'owner' then 3 end;
$$;

create or replace function public.has_role(min_role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.active
      and public.role_rank(p.role) >= public.role_rank(min_role)
  );
$$;

revoke all on function public.has_role(public.app_role) from public;
grant execute on function public.has_role(public.app_role) to anon, authenticated, service_role;

-- updated_at + updated_by on every write.
create or replace function public.touch_row()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  if to_jsonb(new) ? 'updated_by' then
    new := jsonb_populate_record(new, jsonb_build_object('updated_by', (select auth.uid())));
  end if;
  return new;
end;
$$;

create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_row();

-- Create a profile for every new auth user.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Only an owner may change role or active; nobody may demote the last owner.
create or replace function public.guard_profile_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (new.role is distinct from old.role or new.active is distinct from old.active)
     and (select auth.uid()) is not null
     and not public.has_role('owner') then
    raise exception 'Only an owner can change roles or access';
  end if;
  if old.role = 'owner' and (new.role <> 'owner' or not new.active)
     and (select count(*) from public.profiles where role = 'owner' and active) <= 1 then
    raise exception 'There must be at least one active owner';
  end if;
  new.email := old.email;
  return new;
end;
$$;

create trigger profiles_guard before update on public.profiles
  for each row execute function public.guard_profile_update();

create policy "profiles: read self or admin" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or public.has_role('admin'));

create policy "profiles: update self or owner" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()) or public.has_role('owner'))
  with check (id = (select auth.uid()) or public.has_role('owner'));
