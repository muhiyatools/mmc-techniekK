-- Storage buckets and policies (additive). Closing the old open write access on the
-- legacy admin_* tables and the product-images bucket is in 20261027120250_quote_requests_lockdown.sql.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('media', 'media', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml']),
  ('lead-attachments', 'lead-attachments', false, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Public files are served through the public URL, so anon needs no select policy
-- (and gets none, which keeps the bucket from being listed).
create policy "media: editor insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and (select public.has_role('editor')));
create policy "media: editor update" on storage.objects for update to authenticated
  using (bucket_id = 'media' and (select public.has_role('editor')))
  with check (bucket_id = 'media' and (select public.has_role('editor')));
create policy "media: editor delete" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and (select public.has_role('editor')));
create policy "media: editor list" on storage.objects for select to authenticated
  using (bucket_id = 'media' and (select public.has_role('editor')));

create policy "lead-attachments: admin read" on storage.objects for select to authenticated
  using (bucket_id = 'lead-attachments' and (select public.has_role('admin')));

-- The old trigger function still serves the legacy tables; pin its search_path.
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
