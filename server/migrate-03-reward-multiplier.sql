-- ============================================================================
-- MIGRATE 03 — Hệ số giá đổi quà (mặc định x6, phụ huynh chỉnh được)
-- Cách chạy: Supabase → SQL Editor → dán TOÀN BỘ file này → Run (1 lần).
-- (Ai cài mới từ schema.sql bản mới nhất thì KHÔNG cần chạy file này.)
-- ============================================================================

alter table settings
  add column if not exists reward_cost_multiplier real not null default 6;
