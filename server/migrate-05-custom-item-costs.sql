-- ============================================================================
-- MIGRATE 05 — Giá riêng từng món quà do phụ huynh tự chỉnh (custom_item_costs)
-- Cách chạy: Supabase → SQL Editor → dán TOÀN BỘ file này → Run (1 lần).
-- (Ai cài mới từ schema.sql bản mới nhất thì KHÔNG cần chạy file này.)
--
-- Thiếu cột này sẽ gặp lỗi khi bấm "Lưu giá quà" / "Đưa tất cả về giá mặc
-- định" ở card "🏷️ Chỉnh giá riêng từng món quà":
--   REST 400: {"code":"PGRST204", "message":"Could not find the
--   'custom_item_costs' column of 'settings' in the schema cache"}
-- ============================================================================

alter table settings
  add column if not exists custom_item_costs jsonb not null default '{}';
