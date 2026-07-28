-- ============================================================================
-- MIGRATE 14 — Trắc Nghiệm Ngữ Pháp thêm lựa chọn LOẠI đề: Ngữ pháp / Từ vựng
-- Cách chạy: Supabase → SQL Editor → dán TOÀN BỘ file này → Run (1 lần).
-- (Ai cài mới từ schema.sql bản mới nhất thì KHÔNG cần chạy file này.)
-- ============================================================================

alter table grammar_quizzes
  add column if not exists quiz_type text not null default 'grammar';
  -- 'grammar' (mặc định, giữ nguyên hành vi cũ) hoặc 'vocab' (trắc nghiệm từ vựng)
