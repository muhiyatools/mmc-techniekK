-- Lockdown of the old open access. Run by the owner in the Supabase SQL editor
-- (the MCP confirmation step declines statements that drop anything).
-- No table and no row is removed. Only these go:
--   * two policies that let anyone read every quote request (names, phones, emails) and insert unvalidated rows;
--   * the "Allow public write" policies on the four admin_* tables and the product-images bucket;
--   * the old status check on quote_requests, replaced by one with the new inbox statuses.

begin;

-- quote_requests: new statuses (old ones mapped).
alter table public.quote_requests drop constraint if exists quote_requests_status_check;

update public.quote_requests
   set status = case status
     when 'contacted' then 'in_progress'
     when 'quoted' then 'quote_sent'
     when 'completed' then 'won'
     when 'pending' then 'new'
     else coalesce(status, 'new')
   end;

alter table public.quote_requests
  alter column status set default 'new',
  add constraint quote_requests_status_check
    check (status in ('new', 'in_progress', 'quote_sent', 'won', 'lost'));

-- quote_requests: role-based policies (from the inbox migration) replace these.
drop policy if exists "Allow public read access quotes" on public.quote_requests;
drop policy if exists "Allow public insert" on public.quote_requests;

-- product-images: keep the bucket and any files; reads stay public, writes need an editor.
drop policy if exists "Allow public write images" on storage.objects;
drop policy if exists "Allow public delete images" on storage.objects;
create policy "product-images: editor insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images' and (select public.has_role('editor')));
create policy "product-images: editor delete" on storage.objects for delete to authenticated
  using (bucket_id = 'product-images' and (select public.has_role('editor')));

-- Legacy tables: keep rows, readable as before, writes only for editors.
do $$
declare
  t text;
begin
  foreach t in array array['admin_products', 'admin_brands', 'admin_services', 'admin_settings']
  loop
    execute format('drop policy if exists %I on public.%I', 'Allow public write ' || replace(t, 'admin_', ''), t);
    execute format($p$create policy "editor write" on public.%I for all to authenticated
      using ((select public.has_role('editor'))) with check ((select public.has_role('editor')))$p$, t);
    execute format('comment on table public.%I is %L', t,
      'Legacy table from the previous site. Kept with its rows; the new site reads the new tables. Rows are copied over by the seed migration.');
  end loop;
end;
$$;

commit;
