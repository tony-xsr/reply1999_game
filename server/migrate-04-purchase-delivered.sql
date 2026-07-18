-- ============================================================================
-- MIGRATE 04 — Đánh dấu quà đã đổi đã được giao tận tay bé chưa
-- Cách chạy: Supabase → SQL Editor → dán TOÀN BỘ file này → Run (1 lần).
-- (Ai cài mới từ schema.sql bản mới nhất thì KHÔNG cần chạy file này.)
-- ============================================================================

alter table purchases
  add column if not exists delivered_at timestamptz;
