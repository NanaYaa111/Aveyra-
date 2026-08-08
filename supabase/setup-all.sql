-- Aveyra — complete database setup.
-- All five migrations, in order, in one file. Paste the whole thing into
-- the Supabase SQL Editor and press Run. Safe to run once on a new project.


-- ============================================================
-- 20260725000000_init.sql
-- ============================================================
-- Aveyra — initial schema (Milestone 2 backend, Q25 Supabase-native).
-- Applied via `supabase db push` / `supabase migration up` — see
-- docs/supabase-setup.md for project setup (auth, env vars, storage).
--
-- Every future schema change is a NEW migration file, never an edit to this
-- one, so the schema history stays reproducible across environments.

-- Profiles: one row per auth user (minimal — email + display name).
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  display_name text default '',
  created_at timestamptz not null default now()
);

-- A relationship space (exactly two members).
create table public.relationships (
  id uuid primary key default gen_random_uuid(),
  start_date date,
  created_at timestamptz not null default now()
);

create table public.relationship_members (
  relationship_id uuid not null references public.relationships on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (relationship_id, user_id)
);

-- Single-use invitations to join a space.
create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  relationship_id uuid not null references public.relationships on delete cascade,
  code text not null unique,
  inviter_id uuid not null references auth.users on delete cascade,
  expires_at timestamptz not null,
  accepted_by uuid references auth.users,
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

-- Shared content (RLS: members only). Staged privacy — see encryption note
-- in docs/supabase-setup.md.
create table public.answers (
  id uuid primary key default gen_random_uuid(),
  relationship_id uuid not null references public.relationships on delete cascade,
  question_id text not null,
  author_id uuid not null references auth.users on delete cascade,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (relationship_id, question_id, author_id)
);

create table public.memories (
  id uuid primary key default gen_random_uuid(),
  relationship_id uuid not null references public.relationships on delete cascade,
  title text not null default '',
  description text not null default '',
  memory_date timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Private journal (RLS: owner only — never shared).
-- Soft-delete only: `deleted_at` is set, the row is never removed. Matches the
-- local store's soft-delete + Recently Deleted; a hard-delete purge (mirroring
-- the client's explicit "empty trash" action) is a later refinement.
create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users on delete cascade,
  title text not null default '',
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- Indexes on the FK/filter columns every hot-path query above uses. Postgres
-- does not auto-index foreign keys, and every one of these is filtered on
-- directly (spAnswersFor, spGetMemories, spGetEntries, spSubmitAnswer's upsert).
create index answers_rel_question_idx on public.answers (relationship_id, question_id);
create index memories_rel_date_idx on public.memories (relationship_id, memory_date desc);
create index journal_owner_idx on public.journal_entries (owner_id) where deleted_at is null;
create index relationship_members_user_idx on public.relationship_members (user_id);
-- invitations.code already has its own unique-constraint index above, no separate one needed.

-- Membership helper.
create or replace function public.is_member(rel uuid)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.relationship_members m
    where m.relationship_id = rel and m.user_id = auth.uid()
  );
$$;

alter table public.profiles              enable row level security;
alter table public.relationships         enable row level security;
alter table public.relationship_members  enable row level security;
alter table public.invitations           enable row level security;
alter table public.answers               enable row level security;
alter table public.memories              enable row level security;
alter table public.journal_entries       enable row level security;

-- Profiles: read your own + your partner's; write only your own.
create policy profiles_self_rw on public.profiles
  for all using (id = auth.uid()) with check (id = auth.uid());
create policy profiles_partner_read on public.profiles
  for select using (exists (
    select 1 from public.relationship_members a
    join public.relationship_members b on a.relationship_id = b.relationship_id
    where a.user_id = auth.uid() and b.user_id = profiles.id));

-- Relationships + membership: members only.
create policy rel_member_read on public.relationships
  for select using (public.is_member(id));
create policy relmembers_read on public.relationship_members
  for select using (public.is_member(relationship_id));

-- Shared content: members only, all operations.
create policy answers_members on public.answers
  for all using (public.is_member(relationship_id)) with check (public.is_member(relationship_id));
create policy memories_members on public.memories
  for all using (public.is_member(relationship_id)) with check (public.is_member(relationship_id));

-- Journal: owner only.
create policy journal_owner on public.journal_entries
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- Invitations: inviter manages; acceptance goes through the RPC below.
create policy invites_inviter on public.invitations
  for all using (inviter_id = auth.uid()) with check (inviter_id = auth.uid());

-- Space creation + invitation acceptance (RPCs). Security-definer so a joiner
-- can accept a code without broad table access, and so creating a space
-- atomically adds the creator as a member.
create or replace function public.create_space(start date default null)
returns uuid language plpgsql security definer as $$
declare rel uuid;
begin
  insert into public.relationships (start_date) values (start) returning id into rel;
  insert into public.relationship_members (relationship_id, user_id) values (rel, auth.uid());
  return rel;
end; $$;

create or replace function public.accept_invitation(invite_code text)
returns uuid language plpgsql security definer as $$
declare inv public.invitations; count_members int;
begin
  select * into inv from public.invitations where code = invite_code;
  if inv is null or inv.expires_at < now() or inv.accepted_by is not null then
    raise exception 'invitation invalid or expired';
  end if;
  select count(*) into count_members from public.relationship_members where relationship_id = inv.relationship_id;
  if count_members >= 2 then raise exception 'space is full'; end if;
  insert into public.relationship_members (relationship_id, user_id) values (inv.relationship_id, auth.uid());
  update public.invitations set accepted_by = auth.uid(), accepted_at = now() where id = inv.id;
  return inv.relationship_id;
end; $$;

-- ============================================================
-- 20260808000000_full_app.sql
-- ============================================================
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

-- ============================================================
-- 20260808120000_pings.sql
-- ============================================================
-- Pings: one-tap affection for when you miss someone and can't find the words.
--
-- Deliberately not a new table. A ping is a message row with kind = 'ping',
-- whose content is one of a closed vocabulary rather than free text. That way
-- it inherits the thread's existing RLS (members read; insert only as
-- yourself; never editable or deletable) and its realtime channel, with no
-- second code path to keep in step.

alter table public.messages
  add column if not exists kind text not null default 'message'
  check (kind in ('message', 'ping'));

-- A ping's content must be one of the six; free text belongs in a message.
alter table public.messages
  add constraint messages_ping_vocabulary check (
    kind <> 'ping'
    or content in (
      'thinking-of-you',
      'miss-you',
      'hope-today-is-kind',
      'saw-something-you-would-like',
      'no-need-to-reply',
      'goodnight'
    )
  );

-- The client keeps the daily cap gentle, but a cap enforced only in the client
-- is not a cap. This holds it at the database, where it also survives a second
-- device: at most five pings per person per relationship per day.
create or replace function public.enforce_ping_limit()
returns trigger language plpgsql as $$
begin
  if new.kind = 'ping' and (
    select count(*) from public.messages m
    where m.relationship_id = new.relationship_id
      and m.author_id = new.author_id
      and m.kind = 'ping'
      and m.created_at >= date_trunc('day', now())
  ) >= 5 then
    raise exception 'ping limit reached for today';
  end if;
  return new;
end;
$$;

create trigger messages_ping_limit
  before insert on public.messages
  for each row execute function public.enforce_ping_limit();

-- ============================================================
-- 20260808140000_vault.sql
-- ============================================================
-- The private vault: end-to-end encrypted photos.
--
-- What is different about this table is what it does NOT hold. There is no
-- title, caption, filename or description — nothing that could describe the
-- content to anyone reading the database, and nothing to index. The bytes
-- themselves live in a private storage bucket as ciphertext produced on the
-- user's device; the server has no key and no way to derive one.
--
-- Deletion is a real delete (see the policies below): no deleted_at, no
-- Recently Deleted. Recoverable intimate photos are not deleted photos.

-- Each member publishes their ECDH public key here so the two devices can
-- agree on a shared key. Public keys are not secret; the private half never
-- leaves the device it was generated on.
alter table public.profiles add column if not exists device_public text;

create table public.vault_items (
  id uuid primary key default gen_random_uuid(),
  relationship_id uuid not null references public.relationships on delete cascade,
  author_id uuid not null references auth.users on delete cascade,
  -- Path into the private 'vault' bucket. The object is ciphertext.
  object_path text not null,
  created_at timestamptz not null default now()
);

create index vault_items_rel_idx on public.vault_items (relationship_id, created_at desc);

alter table public.vault_items enable row level security;

-- Either partner may read and add; either may delete. Deliberately no UPDATE
-- policy — a vault item is added or removed, never quietly rewritten.
create policy vault_members_read on public.vault_items
  for select using (public.is_member(relationship_id));
create policy vault_members_insert on public.vault_items
  for insert with check (public.is_member(relationship_id) and author_id = auth.uid());
create policy vault_members_delete on public.vault_items
  for delete using (public.is_member(relationship_id));

-- Private bucket. Object paths start with the relationship id, which is what
-- these policies check membership against.
insert into storage.buckets (id, name, public)
values ('vault', 'vault', false)
on conflict (id) do nothing;

create policy vault_objects_read on storage.objects
  for select using (
    bucket_id = 'vault'
    and public.is_member(((storage.foldername(name))[1])::uuid)
  );

create policy vault_objects_write on storage.objects
  for insert with check (
    bucket_id = 'vault'
    and public.is_member(((storage.foldername(name))[1])::uuid)
  );

create policy vault_objects_delete on storage.objects
  for delete using (
    bucket_id = 'vault'
    and public.is_member(((storage.foldername(name))[1])::uuid)
  );

-- View-once media, and video. A view-once item is destroyed the moment the
-- *other* person opens it (the sender can check their own without spending it).
-- The delete happens client-side after a successful decrypt, so a failure to
-- open never silently burns the one viewing.
alter table public.vault_items add column if not exists view_once boolean not null default false;
alter table public.vault_items add column if not exists is_video boolean not null default false;

-- ============================================================
-- 20260808160000_scripture_and_notes.sql
-- ============================================================
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


-- ============================================================
-- Did it work? This should return:  13  |  2  |  5
-- ============================================================
select
  (select count(*) from information_schema.tables
     where table_schema = 'public'
       and table_name in ('profiles','relationships','relationship_members',
                          'invitations','answers','memories','journal_entries',
                          'date_plans','messages','checkins','vault_items',
                          'daily_scriptures','notes')) as tables_found,
  (select count(*) from storage.buckets
     where id in ('memory-photos','vault')) as buckets_found,
  (select count(*) from information_schema.columns
     where table_schema = 'public'
       and (table_name, column_name) in (
         ('memories','image_ref'), ('messages','kind'),
         ('profiles','device_public'), ('vault_items','view_once'),
         ('vault_items','is_video'))) as columns_found;
