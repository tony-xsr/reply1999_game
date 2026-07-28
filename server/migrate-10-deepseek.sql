-- ============================================================================
-- MIGRATE 10 — Thêm DeepSeek làm lựa chọn thứ 2 bên cạnh Groq cho Trợ Lý AI
-- Cách chạy: Supabase → SQL Editor → dán TOÀN BỘ file này → Run (1 lần).
-- (Ai cài mới từ schema.sql bản mới nhất thì KHÔNG cần chạy file này.)
--
-- Thiếu 2 cột này sẽ gặp lỗi khi bấm "Lưu key AI" sau khi chọn DeepSeek:
--   REST 400: {"code":"PGRST204", "message":"Could not find the
--   'deepseek_api_key' column of 'settings' in the schema cache"}
--
-- Cùng cảnh báo an toàn như migrate-06-ai-key.sql: key gọi THẲNG từ trình
-- duyệt (chưa có server riêng giấu key) — dùng 1 key DeepSeek RIÊNG cho app
-- này, đừng dùng chung key với việc khác.
-- ============================================================================

alter table settings
  add column if not exists deepseek_api_key text not null default '',
  add column if not exists deepseek_model   text not null default '';
