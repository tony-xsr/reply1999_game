-- ============================================================================
-- MIGRATE 07 — Luyện Dịch (đoạn văn ngắn AI tự sinh + chấm điểm bằng AI)
-- Cách chạy: Supabase → SQL Editor → dán TOÀN BỘ file này → Run (1 lần).
-- (Ai cài mới từ schema.sql bản mới nhất thì KHÔNG cần chạy file này.)
--
-- Thiếu 2 bảng này sẽ gặp lỗi khi bấm "Xem 3 bài hôm nay" / "Nộp bài dịch"
-- trong mục "📝 Luyện Dịch" (Thi Chứng Chỉ Anh):
--   REST 404/400: relation "translation_passages" does not exist
-- ============================================================================

create table if not exists translation_passages (
  id         uuid primary key default gen_random_uuid(),
  family_id  uuid not null references families(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  level      text not null,
  day        date not null,
  title      text not null,
  passage_en text not null,
  vocab      jsonb not null default '[]',
  created_at timestamptz not null default now()
);
create index if not exists translation_passages_profile_day on translation_passages (profile_id, day);

create table if not exists translation_submissions (
  id             uuid primary key default gen_random_uuid(),
  family_id      uuid not null references families(id) on delete cascade,
  profile_id     uuid not null references profiles(id) on delete cascade,
  passage_id     uuid not null references translation_passages(id) on delete cascade,
  submitted_text text not null,
  ai_score       int,
  ai_feedback    text not null default '',
  vocab_correct  int not null default 0,
  vocab_total    int not null default 0,
  submitted_at   timestamptz not null default now()
);
create index if not exists translation_submissions_profile_time on translation_submissions (profile_id, submitted_at desc);

alter table translation_passages    enable row level security;
alter table translation_submissions enable row level security;

drop policy if exists translation_passages_fam on translation_passages;
create policy translation_passages_fam on translation_passages
  for all using (family_id = my_family_id()) with check (family_id = my_family_id());

drop policy if exists translation_submissions_fam on translation_submissions;
create policy translation_submissions_fam on translation_submissions
  for all using (family_id = my_family_id()) with check (family_id = my_family_id());
