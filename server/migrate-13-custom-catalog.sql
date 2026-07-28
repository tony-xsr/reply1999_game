-- ============================================================================
-- MIGRATE 13 — Phụ huynh tự thêm quà riêng vào Tủ Quà (ngoài 17+5 món có sẵn)
-- Cách chạy: Supabase → SQL Editor → dán TOÀN BỘ file này → Run (1 lần).
-- (Ai cài mới từ schema.sql bản mới nhất thì KHÔNG cần chạy file này.)
-- ============================================================================

alter table settings
  add column if not exists custom_catalog_items jsonb not null default '[]';
  -- [{"id":"...","icon":"🎁","name":"...","cost":500}, ...] - xem shared/rewards.js mergeCatalog()
