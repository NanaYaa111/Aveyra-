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
