-- ============================================================================
-- MIGRATE 11 — Bài dịch/trắc nghiệm: bản dịch mẫu AI + thời gian làm bài
-- Cách chạy: Supabase → SQL Editor → dán TOÀN BỘ file này → Run (1 lần).
-- (Ai cài mới từ schema.sql bản mới nhất thì KHÔNG cần chạy file này.)
--
-- Đi kèm thay đổi luồng nộp bài (xem shared/translate-ui.js/grammar-quiz-
-- ui.js): bài dịch giờ được LƯU NGAY khi bé bấm nộp (trước cả khi AI chấm
-- xong), rồi cập nhật điểm/nhận xét/bản dịch mẫu SAU — để lỡ AI lỗi/hết
-- quota thì bài của bé vẫn không bị mất, phụ huynh vẫn thấy bé đã nộp.
-- ============================================================================

alter table translation_submissions
  add column if not exists ai_reference_vi text not null default '',
  add column if not exists seconds_spent   int;

alter table grammar_quiz_submissions
  add column if not exists seconds_spent int;
