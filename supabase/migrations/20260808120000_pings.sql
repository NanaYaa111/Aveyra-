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
