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
