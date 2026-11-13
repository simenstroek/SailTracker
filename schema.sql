-- Paste into Supabase: SQL Editor -> New query -> Run.
create table if not exists issues (
  id text primary key,                 -- "0007"
  data jsonb not null,                 -- the whole issue document (same shape as the old JSON files)
  created timestamptz not null default now()
);
alter table issues enable row level security;
create policy "team" on issues for all to authenticated using (true) with check (true);

insert into storage.buckets (id, name, public) values ('attachments', 'attachments', false) on conflict do nothing;
create policy "team files" on storage.objects for all to authenticated
  using (bucket_id = 'attachments') with check (bucket_id = 'attachments');
