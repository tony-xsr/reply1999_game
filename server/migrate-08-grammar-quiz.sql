-- ============================================================================
-- MIGRATE 08 — Trắc Nghiệm Ngữ Pháp mỗi ngày (5 câu AI tự sinh + chấm điểm/
-- gợi ý bằng AI)
-- Cách chạy: Supabase → SQL Editor → dán TOÀN BỘ file này → Run (1 lần).
-- (Ai cài mới từ schema.sql bản mới nhất thì KHÔNG cần chạy file này.)
--
-- Thiếu 2 bảng này sẽ gặp lỗi khi bấm "🧩 Trắc Nghiệm Ngữ Pháp — 5 câu hôm
-- nay" trong Thi Chứng Chỉ Anh:
--   REST 404/400: relation "grammar_quizzes" does not exist
-- ============================================================================

create table if not exists grammar_quizzes (
  id         uuid primary key default gen_random_uuid(),
  family_id  uuid not null references families(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  level      text not null,
  day        date not null,
  questions  jsonb not null default '[]',
  created_at timestamptz not null default now()
);
create index if not exists grammar_quizzes_profile_day on grammar_quizzes (profile_id, day);

create table if not exists grammar_quiz_submissions (
  id            uuid primary key default gen_random_uuid(),
  family_id     uuid not null references families(id) on delete cascade,
  profile_id    uuid not null references profiles(id) on delete cascade,
  quiz_id       uuid not null references grammar_quizzes(id) on delete cascade,
  answers       jsonb not null default '[]',
  score         int not null default 0,
  ai_suggestion text not null default '',
  submitted_at  timestamptz not null default now()
);
create index if not exists grammar_quiz_submissions_profile_time on grammar_quiz_submissions (profile_id, submitted_at desc);

alter table grammar_quizzes          enable row level security;
alter table grammar_quiz_submissions enable row level security;

drop policy if exists grammar_quizzes_fam on grammar_quizzes;
create policy grammar_quizzes_fam on grammar_quizzes
  for all using (family_id = my_family_id()) with check (family_id = my_family_id());

drop policy if exists grammar_quiz_submissions_fam on grammar_quiz_submissions;
create policy grammar_quiz_submissions_fam on grammar_quiz_submissions
  for all using (family_id = my_family_id()) with check (family_id = my_family_id());
