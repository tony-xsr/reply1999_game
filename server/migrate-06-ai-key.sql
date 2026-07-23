-- ============================================================================
-- MIGRATE 06 — Key AI (Groq) để tự sinh thêm câu hỏi ôn tập (ai_provider/ai_api_key)
-- Cách chạy: Supabase → SQL Editor → dán TOÀN BỘ file này → Run (1 lần).
-- (Ai cài mới từ schema.sql bản mới nhất thì KHÔNG cần chạy file này.)
--
-- Thiếu cột này sẽ gặp lỗi khi bấm "Lưu key AI" ở card "🤖 Trợ Lý AI":
--   REST 400: {"code":"PGRST204", "message":"Could not find the
--   'ai_api_key' column of 'settings' in the schema cache"}
--
-- LƯU Ý AN TOÀN: đây là app tĩnh chạy hoàn toàn trong trình duyệt, không có
-- server riêng để giấu key — key AI được gọi THẲNG từ máy đang mở Trang Phụ
-- Huynh/game (giống cách anon key Supabase đã lộ sẵn từ trước). Ai mở được
-- DevTools trên đúng máy đó xem được key. Khuyên dùng 1 key Groq RIÊNG cho
-- app này (Groq cho tạo free, thu hồi được bất cứ lúc nào), đừng dùng chung
-- key với việc khác.
-- ============================================================================

alter table settings
  add column if not exists ai_provider text not null default 'groq',
  add column if not exists ai_api_key  text not null default '';
