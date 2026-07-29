-- ============================================================================
-- MIGRATE 19 — Thêm số dòng passage_pool/quiz_pool (kho Luyện Dịch/Trắc
-- Nghiệm DÙNG CHUNG mọi gia đình, xem migrate-18-content-pool.sql) vào thống
-- kê Admin Dashboard (/admin/) — trang đó là thống kê TOÀN HỆ THỐNG, trước
-- migration này CHƯA hiện được kho chung này ở đâu cả.
--
-- ⚠️ PHẢI chạy server/migrate-18-content-pool.sql TRƯỚC (tạo 2 bảng
-- passage_pool/quiz_pool) rồi mới chạy file này.
-- Cách chạy: Supabase → SQL Editor → dán TOÀN BỘ file này → Run (1 lần).
-- ============================================================================

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
    'ai_call_log', (select count(*) from ai_call_log),
    'passage_pool', (select count(*) from passage_pool),
    'quiz_pool', (select count(*) from quiz_pool)
  ) into result;
  return result;
end $$;
revoke execute on function admin_db_stats() from public, anon, authenticated;
