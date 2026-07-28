-- ============================================================================
-- MIGRATE 15 — Ghi lại CẤU TRÚC NGỮ PHÁP bé hay làm SAI trong Trắc Nghiệm Ngữ
-- Pháp (mỗi câu AI soạn kèm sẵn field "structure" — xem migrate liên quan
-- shared/groq.js generateGrammarQuiz) để phụ huynh xem lại, và để AI ưu tiên
-- ra thêm câu ôn đúng các điểm yếu này (xem shared/api.js weakPointsSummaryText).
-- Y HỆT mẫu "miss_events" (từ vựng hay sai) đã có, chỉ khác: "structure" là
-- tên cấu trúc ngữ pháp (chuỗi AI tự soạn, KHÔNG cố định) thay vì 1 từ tiếng
-- Anh cố định — nên chỉ CỘNG DỒN khi sai, KHÔNG trừ khi đúng lại (khác cách
-- diễn đạt của AI qua các lần có thể không khớp y hệt để trừ đúng dòng cũ).
-- Cách chạy: Supabase → SQL Editor → dán TOÀN BỘ file này → Run (1 lần).
-- ============================================================================

create table if not exists grammar_miss_events (
  id         bigint generated always as identity primary key,
  family_id  uuid not null references families(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  structure  text not null,
  delta      int  not null check (delta between -999 and 999 and delta <> 0),
  ts         timestamptz not null default now()
);
create index if not exists grammar_miss_events_profile_structure on grammar_miss_events (profile_id, structure);

alter table grammar_miss_events enable row level security;
drop policy if exists grammar_miss_events_fam on grammar_miss_events;
create policy grammar_miss_events_fam on grammar_miss_events
  for all using (family_id = my_family_id()) with check (family_id = my_family_id());

create or replace view weak_grammar_points with (security_invoker = on) as
  select profile_id, structure, sum(delta)::int as misses
  from grammar_miss_events
  group by profile_id, structure
  having sum(delta) > 0;

-- Cập nhật lại tidy_my_family() (dọn dẹp định kỳ, trang Phụ Huynh tự gọi
-- ~1 lần/tuần) để gộp luôn grammar_miss_events cũ (>30 ngày) — TOÀN VĂN hàm,
-- ghi đè hàm cũ (đã có từ migrate-01), giữ NGUYÊN mọi logic dọn dẹp cũ.
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

  with old_gr as (
    delete from grammar_miss_events
    where family_id = fam and ts < now() - interval '30 days'
    returning profile_id, structure, delta
  )
  insert into grammar_miss_events (family_id, profile_id, structure, delta, ts)
  select fam, profile_id, structure, sum(delta), now() - interval '30 days'
  from old_gr
  group by profile_id, structure
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
