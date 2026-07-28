-- ============================================================================
-- MIGRATE 12 — Admin Dashboard: đếm lượt gọi AI + thống kê database
-- Cách chạy: Supabase → SQL Editor → dán TOÀN BỘ file này → Run (1 lần).
-- (Ai cài mới từ schema.sql bản mới nhất thì KHÔNG cần chạy file này.)
--
-- Đi kèm: api/admin-stats.js (Vercel Function, cần thêm biến môi trường MỚI
-- ADMIN_EMAIL trên Vercel — xem hướng dẫn trong file đó) + trang /admin/.
-- ============================================================================

-- Ghi lại mỗi lượt gọi AI (Groq/DeepSeek) thành/không thành — trình duyệt tự
-- ghi (shared/ai-provider.js), Admin Dashboard đếm tổng theo ngày/nhà cung cấp.
create table if not exists ai_call_log (
  id         uuid primary key default gen_random_uuid(),
  family_id  uuid not null references families(id) on delete cascade,
  provider   text not null,
  purpose    text not null,
  ok         boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists ai_call_log_created on ai_call_log (created_at desc);
alter table ai_call_log enable row level security;
drop policy if exists ai_call_log_fam on ai_call_log;
create policy ai_call_log_fam on ai_call_log
  for all using (family_id = my_family_id()) with check (family_id = my_family_id());

-- Thống kê số dòng các bảng + dung lượng database — CHỈ gọi được từ server
-- (api/admin-stats.js dùng SERVICE ROLE KEY) — REVOKE khỏi anon/authenticated
-- để 1 phụ huynh bình thường KHÔNG tự gọi thẳng RPC này bằng anon key của họ
-- mà xem được thống kê của CẢ HỆ THỐNG.
create or replace function admin_db_stats() returns json
language plpgsql security definer set search_path = public as $$
declare result json;
begin
  select json_build_object(
    'db_size_bytes', pg_database_size(current_database()),
    'families', (select count(*) from families),
    'profiles', (select count(*) from profiles),
    'sessions', (select count(*) from sessions),
    'reward_ledger', (select count(*) from reward_ledger),
    'purchases', (select count(*) from purchases),
    'translation_submissions', (select count(*) from translation_submissions),
    'grammar_quiz_submissions', (select count(*) from grammar_quiz_submissions),
    'ai_call_log', (select count(*) from ai_call_log)
  ) into result;
  return result;
end $$;
revoke execute on function admin_db_stats() from public, anon, authenticated;
