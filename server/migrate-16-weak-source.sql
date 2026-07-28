-- ============================================================================
-- MIGRATE 16 — Đánh dấu bài dịch/trắc nghiệm nào được TẠO THEO YÊU CẦU của
-- phụ huynh từ danh sách "từ hay sai"/"cấu trúc ngữ pháp hay sai" (mục 🎯 Từ
-- hay sai ở Trang Phụ Huynh — phụ huynh chọn từ/điểm ngữ pháp rồi bấm "Tạo
-- bài từ AI") — để: (1) đếm "đã tạo mấy bài" cho mỗi từ/điểm, hiện số nhỏ bên
-- cạnh trong danh sách; (2) hiện lịch sử các lần tạo.
-- Cách chạy: Supabase → SQL Editor → dán TOÀN BỘ file này → Run (1 lần).
-- ============================================================================

alter table translation_passages add column if not exists source_weak text[] not null default '{}';
alter table grammar_quizzes      add column if not exists source_weak text[] not null default '{}';

create index if not exists translation_passages_source_weak on translation_passages using gin (source_weak);
create index if not exists grammar_quizzes_source_weak on grammar_quizzes using gin (source_weak);
