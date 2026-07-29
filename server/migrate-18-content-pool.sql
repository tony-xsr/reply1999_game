-- ============================================================================
-- MIGRATE 18 — Kho nội dung Luyện Dịch/Trắc Nghiệm Ngữ Pháp DÙNG CHUNG cho
-- TẤT CẢ gia đình (không gắn family_id/profile_id/day như translation_passages/
-- grammar_quizzes) — nơi chứa các bài do Claude soạn tay hàng loạt (xem
-- server/bulk-insert-content.js) để MỌI gia đình, kể cả gia đình đăng ký
-- SAU NÀY, đều tự động lấy được thay vì luôn phải gọi AI sinh mới.
--
-- Cách dùng: mỗi khi cần bài mới cho 1 bé, hệ thống thử theo thứ tự —
--   1) tái sử dụng bài CÙNG NHÀ đã có (shared/content-reuse.js, như cũ)
--   2) NẾU không có, "mượn" 1 bài từ kho chung này mà bé ĐÓ CHƯA từng làm
--      (so theo title/prompt câu đầu) rồi COPY nội dung vào translation_passages/
--      grammar_quizzes như bình thường — bảng pool giữ nguyên, không bị xoá/
--      sửa, gia đình khác vẫn mượn được y hệt bài đó
--   3) NẾU kho chung cũng hết (bé đã làm hết), mới gọi AI sinh bài mới
-- Xem api/generate-daily-content.js (server, cron) và shared/api.js
-- (ensureTranslationPassages/ensureGrammarQuiz, dùng khi bé tự mở trang).
--
-- Cách chạy: Supabase → SQL Editor → dán TOÀN BỘ file này → Run (1 lần).
-- ============================================================================

create table if not exists passage_pool (
  id         uuid primary key default gen_random_uuid(),
  level      text not null,
  title      text not null,
  passage_en text not null,
  vocab      jsonb not null default '[]', -- [{"word":"...", "vi":"..."}]
  created_at timestamptz not null default now()
);
create unique index if not exists passage_pool_level_title on passage_pool (level, title);

create table if not exists quiz_pool (
  id         uuid primary key default gen_random_uuid(),
  level      text not null,
  quiz_type  text not null default 'grammar',
  questions  jsonb not null default '[]', -- [{"prompt":"...","options":[...],"answer":0,"explanations":[...],"structure":"...","translation":"..."}]
  created_at timestamptz not null default now()
);

alter table passage_pool enable row level security;
alter table quiz_pool    enable row level security;

-- Bất kỳ ai ĐÃ ĐĂNG NHẬP (authenticated, tức phụ huynh/bé đang dùng app) đều
-- ĐỌC được toàn bộ kho chung — nội dung học tiếng Anh, không phải dữ liệu
-- riêng tư của gia đình nào nên không cần lọc theo family_id. KHÔNG tạo
-- policy INSERT/UPDATE/DELETE nào — nghĩa là CHỈ server (SERVICE ROLE KEY,
-- dùng trong server/bulk-insert-content.js) mới ghi được, tránh 1 gia đình
-- tự ý sửa/xoá kho chung của người khác.
drop policy if exists passage_pool_read on passage_pool;
create policy passage_pool_read on passage_pool for select to authenticated using (true);

drop policy if exists quiz_pool_read on quiz_pool;
create policy quiz_pool_read on quiz_pool for select to authenticated using (true);
