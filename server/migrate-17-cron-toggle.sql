-- ============================================================================
-- MIGRATE 17 — Cho phép Admin BẬT/TẮT cron sinh bài AI mỗi ngày
-- (api/generate-daily-content.js) ngay từ trang /admin/, khỏi phải vào tận
-- Vercel Dashboard xoá lịch cron. Vercel Cron vẫn gọi route này đúng giờ mỗi
-- ngày như cũ — route chỉ tự kiểm tra cờ này, TẮT thì thoát ngay không sinh
-- gì cả (không tốn quota AI).
-- Cách chạy: Supabase → SQL Editor → dán TOÀN BỘ file này → Run (1 lần).
-- ============================================================================

create table if not exists system_settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

-- KHÔNG tạo policy nào bên dưới — bật RLS mà không có policy nghĩa là KHÔNG
-- AI qua anon/authenticated key (trình duyệt bình thường) đọc/ghi được bảng
-- này, CHỈ server (api/admin-cron.js, dùng SERVICE ROLE KEY bỏ qua RLS) mới
-- truy cập được — giống hệt cách ly admin_db_stats() ở migrate-12.
alter table system_settings enable row level security;

insert into system_settings (key, value) values ('cron_generate_daily_content_enabled', 'true'::jsonb)
  on conflict (key) do nothing;
