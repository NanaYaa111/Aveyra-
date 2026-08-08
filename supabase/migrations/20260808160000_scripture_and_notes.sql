-- The daily scripture ritual, and labelled notes.

-- ------------------------------------------------------- daily scripture
-- One row per relationship per day. The unique constraint is what makes the
-- ritual work: whoever inserts first has chosen, and a simultaneous second
-- insert loses cleanly instead of creating two competing verses for one day.
create table public.daily_scriptures (
  id uuid primary key default gen_random_uuid(),
  relationship_id uuid not null references public.relationships on delete cascade,
  date_key text not null,
  chooser_id uuid not null references auth.users on delete cascade,
  reference text not null,
  text text not null,
  chooser_note text not null default '',
  response text not null default '',
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  unique (relationship_id, date_key)
);

-- ---------------------------------------------------------------- notes
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  relationship_id uuid not null references public.relationships on delete cascade,
  author_id uuid not null references auth.users on delete cascade,
  kind text not null check (kind in ('weighing', 'lovely', 'idea')),
  content text not null,
  -- Set by the *reader*, for their own sense of what they've dealt with. The
  -- client never shows this back to the author: a read receipt on "something is
  -- weighing on me" would turn silence into an accusation.
  acknowledged_at timestamptz,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index notes_rel_idx on public.notes (relationship_id, created_at desc)
  where deleted_at is null;

alter table public.daily_scriptures enable row level security;
alter table public.notes            enable row level security;

-- Scripture: either member reads. Only the chooser inserts, as themselves.
-- Update is open to both members because the *other* one writes the response.
create policy scripture_read on public.daily_scriptures
  for select using (public.is_member(relationship_id));
create policy scripture_insert on public.daily_scriptures
  for insert with check (public.is_member(relationship_id) and chooser_id = auth.uid());
create policy scripture_update on public.daily_scriptures
  for update using (public.is_member(relationship_id))
  with check (public.is_member(relationship_id));

-- Notes: either member reads; you write only as yourself. Update is allowed to
-- both so the recipient can acknowledge. Deliberately no DELETE policy — a note
-- someone worked up the nerve to send shouldn't be quietly removable.
create policy notes_read on public.notes
  for select using (public.is_member(relationship_id));
create policy notes_insert_self on public.notes
  for insert with check (public.is_member(relationship_id) and author_id = auth.uid());
create policy notes_update on public.notes
  for update using (public.is_member(relationship_id))
  with check (public.is_member(relationship_id));

-- Realtime: the second person should see the verse, and a note should arrive,
-- without anyone pulling to refresh.
alter publication supabase_realtime add table public.daily_scriptures;
alter publication supabase_realtime add table public.notes;
