create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  display_name text default '',
  created_at timestamptz not null default now()
);
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
create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users on delete cascade,
  title text not null default '',
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index answers_rel_question_idx on public.answers (relationship_id, question_id);
create index memories_rel_date_idx on public.memories (relationship_id, memory_date desc);
create index journal_owner_idx on public.journal_entries (owner_id) where deleted_at is null;
create index relationship_members_user_idx on public.relationship_members (user_id);
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
create policy profiles_self_rw on public.profiles
  for all using (id = auth.uid()) with check (id = auth.uid());
create policy profiles_partner_read on public.profiles
  for select using (exists (
    select 1 from public.relationship_members a
    join public.relationship_members b on a.relationship_id = b.relationship_id
    where a.user_id = auth.uid() and b.user_id = profiles.id));
create policy rel_member_read on public.relationships
  for select using (public.is_member(id));
create policy relmembers_read on public.relationship_members
  for select using (public.is_member(relationship_id));
create policy answers_members on public.answers
  for all using (public.is_member(relationship_id)) with check (public.is_member(relationship_id));
create policy memories_members on public.memories
  for all using (public.is_member(relationship_id)) with check (public.is_member(relationship_id));
create policy journal_owner on public.journal_entries
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy invites_inviter on public.invitations
  for all using (inviter_id = auth.uid()) with check (inviter_id = auth.uid());
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
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  relationship_id uuid not null references public.relationships on delete cascade,
  author_id uuid not null references auth.users on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);
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
alter table public.memories add column if not exists image_ref text;
create index date_plans_rel_idx on public.date_plans (relationship_id) where deleted_at is null;
create index messages_rel_created_idx on public.messages (relationship_id, created_at);
create index checkins_rel_day_idx on public.checkins (relationship_id, date_key);
alter table public.date_plans enable row level security;
alter table public.messages   enable row level security;
alter table public.checkins   enable row level security;
create policy date_plans_members on public.date_plans
  for all using (public.is_member(relationship_id)) with check (public.is_member(relationship_id));
create policy checkins_members on public.checkins
  for all using (public.is_member(relationship_id)) with check (public.is_member(relationship_id));
create policy messages_read on public.messages
  for select using (public.is_member(relationship_id));
create policy messages_insert_self on public.messages
  for insert with check (public.is_member(relationship_id) and author_id = auth.uid());
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.checkins;
alter publication supabase_realtime add table public.answers;
insert into storage.buckets (id, name, public)
values ('memory-photos', 'memory-photos', false)
on conflict (id) do nothing;
do $$ begin
  create policy memory_photos_read on storage.objects
  for select using (
    bucket_id = 'memory-photos'
    and public.is_member(((storage.foldername(name))[1])::uuid)
  );
exception when others then
  raise notice 'skipped storage policy (set it in the dashboard): %', sqlerrm;
end $$;
do $$ begin
  create policy memory_photos_write on storage.objects
  for insert with check (
    bucket_id = 'memory-photos'
    and public.is_member(((storage.foldername(name))[1])::uuid)
  );
exception when others then
  raise notice 'skipped storage policy (set it in the dashboard): %', sqlerrm;
end $$;
do $$ begin
  create policy memory_photos_delete on storage.objects
  for delete using (
    bucket_id = 'memory-photos'
    and public.is_member(((storage.foldername(name))[1])::uuid)
  );
exception when others then
  raise notice 'skipped storage policy (set it in the dashboard): %', sqlerrm;
end $$;
alter table public.messages
  add column if not exists kind text not null default 'message'
  check (kind in ('message', 'ping'));
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
alter table public.profiles add column if not exists device_public text;
create table public.vault_items (
  id uuid primary key default gen_random_uuid(),
  relationship_id uuid not null references public.relationships on delete cascade,
  author_id uuid not null references auth.users on delete cascade,
  object_path text not null,
  created_at timestamptz not null default now()
);
create index vault_items_rel_idx on public.vault_items (relationship_id, created_at desc);
alter table public.vault_items enable row level security;
create policy vault_members_read on public.vault_items
  for select using (public.is_member(relationship_id));
create policy vault_members_insert on public.vault_items
  for insert with check (public.is_member(relationship_id) and author_id = auth.uid());
create policy vault_members_delete on public.vault_items
  for delete using (public.is_member(relationship_id));
insert into storage.buckets (id, name, public)
values ('vault', 'vault', false)
on conflict (id) do nothing;
do $$ begin
  create policy vault_objects_read on storage.objects
  for select using (
    bucket_id = 'vault'
    and public.is_member(((storage.foldername(name))[1])::uuid)
  );
exception when others then
  raise notice 'skipped storage policy (set it in the dashboard): %', sqlerrm;
end $$;
do $$ begin
  create policy vault_objects_write on storage.objects
  for insert with check (
    bucket_id = 'vault'
    and public.is_member(((storage.foldername(name))[1])::uuid)
  );
exception when others then
  raise notice 'skipped storage policy (set it in the dashboard): %', sqlerrm;
end $$;
do $$ begin
  create policy vault_objects_delete on storage.objects
  for delete using (
    bucket_id = 'vault'
    and public.is_member(((storage.foldername(name))[1])::uuid)
  );
exception when others then
  raise notice 'skipped storage policy (set it in the dashboard): %', sqlerrm;
end $$;
alter table public.vault_items add column if not exists view_once boolean not null default false;
alter table public.vault_items add column if not exists is_video boolean not null default false;
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
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  relationship_id uuid not null references public.relationships on delete cascade,
  author_id uuid not null references auth.users on delete cascade,
  kind text not null check (kind in ('weighing', 'lovely', 'idea')),
  content text not null,
  acknowledged_at timestamptz,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index notes_rel_idx on public.notes (relationship_id, created_at desc)
  where deleted_at is null;
alter table public.daily_scriptures enable row level security;
alter table public.notes            enable row level security;
create policy scripture_read on public.daily_scriptures
  for select using (public.is_member(relationship_id));
create policy scripture_insert on public.daily_scriptures
  for insert with check (public.is_member(relationship_id) and chooser_id = auth.uid());
create policy scripture_update on public.daily_scriptures
  for update using (public.is_member(relationship_id))
  with check (public.is_member(relationship_id));
create policy notes_read on public.notes
  for select using (public.is_member(relationship_id));
create policy notes_insert_self on public.notes
  for insert with check (public.is_member(relationship_id) and author_id = auth.uid());
create policy notes_update on public.notes
  for update using (public.is_member(relationship_id))
  with check (public.is_member(relationship_id));
alter publication supabase_realtime add table public.daily_scriptures;
alter publication supabase_realtime add table public.notes;
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
