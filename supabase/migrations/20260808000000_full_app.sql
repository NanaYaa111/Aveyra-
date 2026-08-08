-- Full-app tables: shared date plans, the private message thread, daily
-- emotional check-ins, and photo attachments on memories.
--
-- Every table follows the pattern already established in the init migration:
-- relationship-scoped, RLS via public.is_member(), soft-delete via deleted_at,
-- and (where a row is per-person-per-thing) a unique constraint the client
-- upserts against so a retry can never duplicate.

-- ---------------------------------------------------------------- date plans
create table public.date_plans (
  id uuid primary key default gen_random_uuid(),
  relationship_id uuid not null references public.relationships on delete cascade,
  title text not null,
  notes text not null default '',
  status text not null default 'idea' check (status in ('idea', 'planned', 'done')),
  planned_for timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- ------------------------------------------------------------------ messages
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  relationship_id uuid not null references public.relationships on delete cascade,
  author_id uuid not null references auth.users on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------ check-ins
-- One per person per day; editable all day via upsert on the unique key.
-- `mood` is a small closed set — a feeling word, never a score (no numbers,
-- no streaks, nothing to optimise).
create table public.checkins (
  id uuid primary key default gen_random_uuid(),
  relationship_id uuid not null references public.relationships on delete cascade,
  author_id uuid not null references auth.users on delete cascade,
  date_key text not null,
  mood text not null check (mood in ('calm', 'happy', 'grateful', 'tired', 'stressed', 'sad')),
  note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (relationship_id, date_key, author_id)
);

-- ----------------------------------------------------- memory photo referenc
-- Storage object path for a memory's single Phase-1 photo.
alter table public.memories add column if not exists image_ref text;

create index date_plans_rel_idx on public.date_plans (relationship_id) where deleted_at is null;
create index messages_rel_created_idx on public.messages (relationship_id, created_at);
create index checkins_rel_day_idx on public.checkins (relationship_id, date_key);

alter table public.date_plans enable row level security;
alter table public.messages   enable row level security;
alter table public.checkins   enable row level security;

-- Shared content: members only, all operations.
create policy date_plans_members on public.date_plans
  for all using (public.is_member(relationship_id)) with check (public.is_member(relationship_id));
create policy checkins_members on public.checkins
  for all using (public.is_member(relationship_id)) with check (public.is_member(relationship_id));

-- Messages: any member reads the thread, but you may only send as yourself,
-- and a sent message is not editable or deletable (a conversation is a record,
-- not a document either person can quietly rewrite).
create policy messages_read on public.messages
  for select using (public.is_member(relationship_id));
create policy messages_insert_self on public.messages
  for insert with check (public.is_member(relationship_id) and author_id = auth.uid());

-- Realtime: the client subscribes to answers, messages and check-ins so a
-- partner's action appears on the other device without a refresh.
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.checkins;
alter publication supabase_realtime add table public.answers;

-- ------------------------------------------------------------------- storage
-- Private bucket for memory photos. Object paths start with the relationship
-- id ("<rel_id>/<uuid>.jpg"), which is what these policies check membership
-- against; the bucket is never public, so the client reads via signed URLs.
insert into storage.buckets (id, name, public)
values ('memory-photos', 'memory-photos', false)
on conflict (id) do nothing;

create policy memory_photos_read on storage.objects
  for select using (
    bucket_id = 'memory-photos'
    and public.is_member(((storage.foldername(name))[1])::uuid)
  );

create policy memory_photos_write on storage.objects
  for insert with check (
    bucket_id = 'memory-photos'
    and public.is_member(((storage.foldername(name))[1])::uuid)
  );

create policy memory_photos_delete on storage.objects
  for delete using (
    bucket_id = 'memory-photos'
    and public.is_member(((storage.foldername(name))[1])::uuid)
  );
