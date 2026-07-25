# Supabase setup — Milestone 2 backend

**Status:** initial migration for review — not production-audited. Provisioning is
author-owned (I can't create the project). Once done, drop the two public env vars
in and the app switches from the local stub to real auth automatically (the
Supabase adapter is already wired behind `AuthProvider`).

Decisions this implements: **Q25 Supabase-native**, **Q15 passwordless email OTP**,
**Q20 EU region**, **staged privacy** (RLS + Supabase at-rest encryption; **no E2EE
claim** at launch — see the encryption note at the end).

---

## 1. Create the project
1. supabase.com → **New project**.
2. **Region: EU** — **West EU (London)** or **Central EU (Frankfurt)** (Q20).
3. Save the **Project URL** and the **anon public key** (Project Settings → API).

## 2. Configure Auth (passwordless email OTP)
Authentication → Providers → **Email**:
- **Enable Email provider**; turn **OFF** "Confirm email" password flows — we use OTP.
- **Enable email OTP** (6-digit code).
- **OTP expiry: 600 seconds** (matches the app's "expires in 10 minutes" copy).
- Under URL Configuration, add the **Site URL** (e.g. `https://aveyra.app`) and
  local `http://localhost:3000` to redirect allow-list (for magic-link return).
- Email template subject: `Your Aveyra verification code is: {{ .Token }}` (no
  tracking pixels — Document P §12.1).

## 3. Environment variables
Add to `.env.local` (never commit) and to Vercel's project env:
```
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-public-key>
```
The anon key is public by design; **RLS** is what protects data.

## 4. Schema + Row-Level Security (SQL editor → run once)
```sql
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

-- Shared content (RLS: members only). Staged privacy — see note.
create table public.answers (
  id uuid primary key default gen_random_uuid(),
  relationship_id uuid not null references public.relationships on delete cascade,
  question_id text not null,
  author_id uuid not null references auth.users on delete cascade,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
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
create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users on delete cascade,
  title text not null default '',
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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
```

## 5. Space creation + invitation acceptance (RPCs)
Security-definer functions so a joiner can accept a code without broad table
access, and so creating a space atomically adds the creator as a member:
```sql
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
```

## 6. Storage (photos — later increment)
Storage → new bucket `memory-photos` (private). Add RLS so only relationship
members can read/write objects under a `relationship_id/` prefix. Wired when photo
attachments land.

---

## Encryption note (guardian — flag, don't silently resolve)
The M1 client field-encryption uses a **device-local** key, which a partner's
device can't decrypt. Cross-device sharing therefore can't use that key as-is.
Per the **staged-privacy** decision, shared content (answers, memories) launches
protected by **RLS + Supabase at-rest encryption**, not E2EE, and the product must
**not claim E2EE**. Reconciling the existing client field-encryption with
cross-device sync (either store shared content server-side in plaintext-under-RLS,
or introduce a shared relationship key for a later E2EE stage) is a **design
decision for the sync-integration increment** — it is not settled here.
