-- Supabase RLS policy examples for Aveyra
-- WARNING: Treat this as a starting point. Review, adjust, and test in a non-production project.
-- RLS policies for Aveyra (aligned with docs/supabase-setup.md)
-- WARNING: Run in a staging project first and adapt to your project's auth claims.

-- Profiles table should exist in schema (see docs/supabase-setup.md for full schema).

-- Membership helper: returns true when auth.uid() is a member of the relationship.
create or replace function public.is_member(rel uuid)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.relationship_members m
    where m.relationship_id = rel and m.user_id = auth.uid()
  );
$$;

-- Enable RLS on core tables
alter table if exists public.profiles              enable row level security;
alter table if exists public.relationships         enable row level security;
alter table if exists public.relationship_members  enable row level security;
alter table if exists public.invitations           enable row level security;
alter table if exists public.answers               enable row level security;
alter table if exists public.memories              enable row level security;
alter table if exists public.journal_entries       enable row level security;

-- Profiles: read your own + your partner's; write only your own.
create policy if not exists profiles_self_rw on public.profiles
  for all using (id = auth.uid()) with check (id = auth.uid());
create policy if not exists profiles_partner_read on public.profiles
  for select using (exists (
    select 1 from public.relationship_members a
    join public.relationship_members b on a.relationship_id = b.relationship_id
    where a.user_id = auth.uid() and b.user_id = profiles.id));

-- Relationships + membership: members only.
create policy if not exists rel_member_read on public.relationships
  for select using (public.is_member(id));
create policy if not exists relmembers_read on public.relationship_members
  for select using (public.is_member(relationship_id));

-- Shared content: members only, all operations.
create policy if not exists answers_members on public.answers
  for all using (public.is_member(relationship_id)) with check (public.is_member(relationship_id));
create policy if not exists memories_members on public.memories
  for all using (public.is_member(relationship_id)) with check (public.is_member(relationship_id));

-- Journal: owner only.
create policy if not exists journal_owner on public.journal_entries
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- Invitations: inviter manages; acceptance goes through the RPC.
create policy if not exists invites_inviter on public.invitations
  for all using (inviter_id = auth.uid()) with check (inviter_id = auth.uid());

-- Index suggestions (post-deploy):
-- CREATE INDEX ON public.answers (relationship_id);
-- CREATE INDEX ON public.memories (relationship_id);

-- NOTE: Adjust functions and policies if your JWT contains a different claim
-- mapping (e.g. `relationship_id` claim) or if you prefer a mapping function
-- from `auth.uid()` to relationship ids.
