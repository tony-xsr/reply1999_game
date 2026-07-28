-- ============================================================================
-- MIGRATE 09 — Vườn hoa sinh sao mỗi ngày + bán lại hoa
-- Cách chạy: Supabase → SQL Editor → dán TOÀN BỘ file này → Run (1 lần).
-- (Ai cài mới từ schema.sql bản mới nhất thì KHÔNG cần chạy file này.)
-- ============================================================================

-- khac null = be da ban hoa nay lai lay sao, khong con tinh trong vuon nua
alter table purchases
  add column if not exists sold_at timestamptz;

-- Mốc thời gian lần cuối "thu lãi vườn hoa" của từng bé được lưu trong
-- profiles.settings (jsonb, đã có sẵn từ migrate-01) dưới khóa "gardenLastYieldAt"
-- — không cần cột/bảng riêng, theo đúng quy ước settings hiện có (daily_limit_min,
-- translationLevel, ...).
