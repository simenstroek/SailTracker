-- Paste into Supabase: SQL Editor -> New query -> Run. (Run schema.sql first.)
create table if not exists pins (
  id uuid primary key default gen_random_uuid(),
  x double precision not null,          -- 0..1 across the map image, 0 = left edge
  y double precision not null,          -- 0..1 down the map image, 0 = top edge
  category text not null check (category in ('landmark','mural','pickup','lore','poi')),
  age integer not null default 0 check (age between 0 and 10000),   -- years before present; 0 = gameplay pin, not on the timeline
  title text not null,
  content text not null default '',
  images text[] not null default '{}',  -- keys in the 'attachments' storage bucket, under pins/<id>/
  author text,
  created timestamptz not null default now(),
  updated timestamptz not null default now()
);
alter table pins enable row level security;
create policy "team pins" on pins for all to authenticated using (true) with check (true);
