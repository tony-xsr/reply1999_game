-- ============================================================================
-- MIGRATE 01 — Tiết kiệm tài nguyên + cài đặt riêng từng bé
-- Cách chạy: Supabase → SQL Editor → dán TOÀN BỘ file này → Run (1 lần).
-- (Ai cài mới từ đầu bằng schema.sql bản mới thì KHÔNG cần chạy file này.)
-- ============================================================================

-- 1) Cài đặt RIÊNG của từng bé (đè lên cài đặt chung của gia đình khi có):
--    ví dụ {"daily_limit_min": 30, "tts_rate": 0.8}
alter table profiles add column if not exists settings jsonb not null default '{}';

-- 2) Cho phép dòng miss_events GỘP (khi dọn dẹp, nhiều sự kiện cũ được cộng
--    dồn thành 1 dòng có delta lớn) — bỏ ràng buộc delta chỉ ±1.
alter table miss_events drop constraint if exists miss_events_delta_check;
alter table miss_events add constraint miss_events_delta_check
  check (delta between -999 and 999 and delta <> 0);

-- 3) Hàm DỌN DẸP định kỳ (trang Phụ Huynh tự gọi ~1 lần/tuần):
--    - miss_events cũ hơn 30 ngày: gộp thành 1 dòng/1 từ (giữ nguyên tổng);
--    - sessions: mỗi bé giữ 300 ván mới nhất;
--    - reward_ledger cũ hơn 60 ngày: gộp thành 1 dòng "số dư cũ"/bé
--      (SUM không đổi nên số sao của bé không đổi).
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
end $$;
