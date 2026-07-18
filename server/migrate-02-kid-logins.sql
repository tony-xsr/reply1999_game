-- ============================================================================
-- MIGRATE 02 — Nhật ký đăng nhập của bé (thời gian + thiết bị + trình duyệt)
-- Cách chạy: Supabase → SQL Editor → dán TOÀN BỘ file này → Run (1 lần).
-- (Ai cài mới từ schema.sql bản mới nhất thì KHÔNG cần chạy file này.)
-- ============================================================================

create table if not exists kid_logins (
  id         bigint generated always as identity primary key,
  family_id  uuid not null references families(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  device     text not null default '',
  browser    text not null default '',
  ts         timestamptz not null default now()
);
create index if not exists kid_logins_fam_ts on kid_logins (family_id, ts desc);

alter table kid_logins enable row level security;
drop policy if exists kid_logins_fam on kid_logins;
create policy kid_logins_fam on kid_logins
  for all using (family_id = my_family_id()) with check (family_id = my_family_id());

-- Don dep: them buoc xoa nhat ky dang nhap cu hon 30 ngay vao tidy_my_family.
create or replace function tidy_my_family() returns void
language plpgsql security definer set search_path = public as $$
declare fam uuid;
begin
  select id into fam from families where owner = auth.uid();
  if fam is null then return; end if;

  with old as (
    delete from miss_events
    where family_id = fam and ts < now() - interval '30 days'
    returning profile_id, word, delta
  )
  insert into miss_events (family_id, profile_id, word, delta, ts)
  select fam, profile_id, word, sum(delta), now() - interval '30 days'
  from old
  group by profile_id, word
  having sum(delta) <> 0 and sum(delta) between -999 and 999;

  delete from sessions s
  where s.family_id = fam and s.id in (
    select id from (
      select id, row_number() over (partition by profile_id order by played_at desc) as rn
      from sessions where family_id = fam
    ) t where t.rn > 300
  );

  with old as (
    delete from reward_ledger
    where family_id = fam and ts < now() - interval '60 days'
    returning profile_id, delta
  )
  insert into reward_ledger (id, family_id, profile_id, delta, reason, ts)
  select gen_random_uuid(), fam, profile_id, sum(delta), 'so-du-cu', now() - interval '60 days'
  from old
  group by profile_id
  having sum(delta) <> 0;

  delete from kid_logins where family_id = fam and ts < now() - interval '30 days';
end $$;
