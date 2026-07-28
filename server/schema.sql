-- ============================================================================
-- Reply1999 Games — Schema Supabase cho Quản lý bé + Thưởng + Trang Phụ Huynh
-- Cách dùng: Supabase Dashboard → SQL Editor → dán TOÀN BỘ file này → Run.
-- Chạy lại an toàn (idempotent ở mức "drop policy if exists / create or replace").
-- ============================================================================

-- ===== Bảng =================================================================

create table if not exists families (
  id         uuid primary key default gen_random_uuid(),
  owner      uuid not null unique references auth.users(id) on delete cascade,
  name       text not null default 'Gia đình',
  created_at timestamptz not null default now()
);

create table if not exists profiles (
  id         uuid primary key default gen_random_uuid(),
  family_id  uuid not null references families(id) on delete cascade,
  name       text not null,
  avatar     text not null default '🐰',
  color      text not null default '#ff8a3d',
  -- cai dat RIENG cua be, de len cai dat chung: {"daily_limit_min":30,"tts_rate":0.8}
  settings   jsonb not null default '{}',
  created_at timestamptz not null default now()
);
alter table profiles add column if not exists settings jsonb not null default '{}';

-- Moi van choi 1 dong. id sinh PHIA CLIENT (uuid) -> gui trung khong tao ban sao.
create table if not exists sessions (
  id         uuid primary key,
  family_id  uuid not null references families(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  mode       text not null,
  result     text not null,
  score      int  not null default 0,
  level      int  not null default 1,
  seconds    real not null default 0,
  played_at  timestamptz not null default now()
);
create index if not exists sessions_profile_time on sessions (profile_id, played_at desc);

-- So "tu hay sai": moi lan sai +1 / dung ngay lan dau -1 — CHI GHI THEM,
-- nhieu may cung ghi khong bao gio xung dot. Tong theo tu = muc do can on.
create table if not exists miss_events (
  id         bigint generated always as identity primary key,
  family_id  uuid not null references families(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  word       text not null,
  -- ±1 khi choi; dòng GỘP khi dọn dẹp có thể lớn hơn (xem tidy_my_family)
  delta      int  not null check (delta between -999 and 999 and delta <> 0),
  ts         timestamptz not null default now()
);
create index if not exists miss_events_profile_word on miss_events (profile_id, word);

-- So SAO (chi-ghi-them): so du = SUM(delta). id sinh phia client.
create table if not exists reward_ledger (
  id         uuid primary key,
  family_id  uuid not null references families(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  delta      int  not null,
  reason     text not null,
  ts         timestamptz not null default now()
);
create index if not exists reward_ledger_profile on reward_ledger (profile_id, ts desc);

-- Qua da doi bang sao.
create table if not exists purchases (
  id           uuid primary key,
  family_id    uuid not null references families(id) on delete cascade,
  profile_id   uuid not null references profiles(id) on delete cascade,
  item_id      text not null,
  cost         int  not null,
  ts           timestamptz not null default now(),
  delivered_at timestamptz, -- null = bo me chua giao qua tay cho be; phu huynh bam "Da giao" de danh dau
  sold_at      timestamptz -- hoa vuon: khac null = be da ban lai lay sao, khong con trong vuon nua
);

-- Thuong tay cua bo me (kem loi nhan); be mo qua thi ghi opened_at.
create table if not exists manual_rewards (
  id         uuid primary key default gen_random_uuid(),
  family_id  uuid not null references families(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  stars      int  not null default 0,
  item_id    text,
  message    text not null default '',
  created_at timestamptz not null default now(),
  opened_at  timestamptz
);

-- Cai dat chung ca gia dinh (ap dung dong loat moi may).
create table if not exists settings (
  family_id              uuid primary key references families(id) on delete cascade,
  tts_rate               real not null default 1.0,
  daily_limit_min        int  not null default 45,
  reward_cost_multiplier real not null default 36,
  custom_item_costs      jsonb not null default '{}',
  -- Key AI (Groq...) de tu sinh them cau hoi on tap - xem canh bao an toan o
  -- migrate-06-ai-key.sql (key goi THANG tu trinh duyet, khong co server rieng giau key).
  ai_provider            text not null default 'groq',
  ai_api_key             text not null default '',
  -- DeepSeek (lua chon thu 2 ben canh Groq) - xem canh bao an toan o
  -- migrate-10-deepseek.sql (key goi THANG tu trinh duyet nhu Groq).
  deepseek_api_key       text not null default '',
  deepseek_model         text not null default '',
  -- Qua phu huynh TU THEM ngoai CATALOG co san - xem shared/rewards.js mergeCatalog().
  custom_catalog_items   jsonb not null default '[]',
  updated_at             timestamptz not null default now()
);
-- Gia dinh da tao truoc 07/2026 can chay server/migrate-05-custom-item-costs.sql
-- (Supabase SQL Editor) de them cot gia rieng tung mon qua nay - dong ALTER
-- duoi day chi ap dung cho project MOI tao (chay schema.sql lan dau).
alter table settings add column if not exists custom_item_costs jsonb not null default '{}';
-- Gia dinh da tao truoc phai chay server/migrate-06-ai-key.sql de them 2 cot AI nay.
alter table settings add column if not exists ai_provider text not null default 'groq';
alter table settings add column if not exists ai_api_key  text not null default '';
-- Gia dinh da tao truoc phai chay server/migrate-10-deepseek.sql de them 2 cot DeepSeek nay.
alter table settings add column if not exists deepseek_api_key text not null default '';
alter table settings add column if not exists deepseek_model   text not null default '';
-- Gia dinh da tao truoc phai chay server/migrate-13-custom-catalog.sql.
alter table settings add column if not exists custom_catalog_items jsonb not null default '[]';

-- May da lien ket (chi de hien thi/quan ly, khong phai co che bao mat).
create table if not exists devices (
  id         uuid primary key,
  family_id  uuid not null references families(id) on delete cascade,
  label      text not null default 'Thiết bị',
  last_seen  timestamptz not null default now()
);

-- Nhat ky dang nhap cua be (thong bao cho phu huynh: luc nao, may nao, trinh duyet nao).
create table if not exists kid_logins (
  id         bigint generated always as identity primary key,
  family_id  uuid not null references families(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  device     text not null default '',
  browser    text not null default '',
  ts         timestamptz not null default now()
);
create index if not exists kid_logins_fam_ts on kid_logins (family_id, ts desc);

-- Doan van AI tu sinh de luyen dich (3 bai/ngay/be, xem shared/groq.js
-- generatePassages()). `day` do CLIENT truyen vao (theo ngay dia phuong cua
-- may dang mo, khong dung default server) de tranh lech mui gio.
create table if not exists translation_passages (
  id         uuid primary key default gen_random_uuid(),
  family_id  uuid not null references families(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  level      text not null,
  day        date not null,
  title      text not null,
  passage_en text not null,
  vocab      jsonb not null default '[]', -- [{"word":"...", "vi":"..."}]
  created_at timestamptz not null default now()
);
create index if not exists translation_passages_profile_day on translation_passages (profile_id, day);

-- Bai lam cua be: ban dich tieng Viet + diem/nhan xet AI cham (xem
-- shared/groq.js gradeTranslation()) + ket qua noi tu vung sau do.
create table if not exists translation_submissions (
  id             uuid primary key default gen_random_uuid(),
  family_id      uuid not null references families(id) on delete cascade,
  profile_id     uuid not null references profiles(id) on delete cascade,
  passage_id     uuid not null references translation_passages(id) on delete cascade,
  submitted_text text not null,
  ai_score       int,
  ai_feedback    text not null default '',
  ai_reference_vi text not null default '', -- ban dich mau AI de be so sanh - dien SAU khi AI cham xong
  vocab_correct  int not null default 0,
  vocab_total    int not null default 0,
  seconds_spent  int, -- thoi gian be go bai (giay), null = ban ghi cu truoc migrate-11
  submitted_at   timestamptz not null default now()
);
create index if not exists translation_submissions_profile_time on translation_submissions (profile_id, submitted_at desc);

-- De trac nghiem ngu phap AI tu sinh (5 cau/ngay/be, xem shared/groq.js
-- generateGrammarQuiz()) — 1 dong = TRON BO 5 cau cua 1 ngay (khac
-- translation_passages moi dong 1 doan van, o day gop chung 1 dong cho gon).
create table if not exists grammar_quizzes (
  id         uuid primary key default gen_random_uuid(),
  family_id  uuid not null references families(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  level      text not null,
  day        date not null,
  quiz_type  text not null default 'grammar', -- 'grammar' hoac 'vocab' - xem shared/groq.js generateGrammarQuiz()
  questions  jsonb not null default '[]', -- [{"prompt":"...","options":["...","...","...","..."],"answer":0,"explanations":["...","...","...","..."]}]
  created_at timestamptz not null default now()
);
create index if not exists grammar_quizzes_profile_day on grammar_quizzes (profile_id, day);
-- Gia dinh da tao truoc phai chay server/migrate-14-quiz-type.sql.
alter table grammar_quizzes add column if not exists quiz_type text not null default 'grammar';

-- Bai lam cua be: dap an da chon + diem + goi y AI cham sau khi nop
-- (xem shared/groq.js gradeGrammarQuiz()).
create table if not exists grammar_quiz_submissions (
  id            uuid primary key default gen_random_uuid(),
  family_id     uuid not null references families(id) on delete cascade,
  profile_id    uuid not null references profiles(id) on delete cascade,
  quiz_id       uuid not null references grammar_quizzes(id) on delete cascade,
  answers       jsonb not null default '[]', -- [{"selected":0,"correct":true}, ...]
  score         int not null default 0, -- so cau dung / tong so cau
  ai_suggestion text not null default '',
  seconds_spent int, -- thoi gian be lam bai (giay), null = ban ghi cu truoc migrate-11
  submitted_at  timestamptz not null default now()
);
create index if not exists grammar_quiz_submissions_profile_time on grammar_quiz_submissions (profile_id, submitted_at desc);
-- Gia dinh da tao truoc phai chay server/migrate-11-submission-reliability.sql.
alter table translation_submissions add column if not exists ai_reference_vi text not null default '';
alter table translation_submissions add column if not exists seconds_spent  int;
alter table grammar_quiz_submissions add column if not exists seconds_spent int;

-- Ghi lai moi luot goi AI (Groq/DeepSeek) - dung cho Admin Dashboard dem tong
-- theo ngay/nha cung cap (xem shared/ai-provider.js logAiCall, migrate-12).
create table if not exists ai_call_log (
  id         uuid primary key default gen_random_uuid(),
  family_id  uuid not null references families(id) on delete cascade,
  provider   text not null,
  purpose    text not null,
  ok         boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists ai_call_log_created on ai_call_log (created_at desc);

-- Cau truc ngu phap be hay lam SAI trong Trac Nghiem Ngu Phap (xem migrate-15).
-- Chi CONG DON khi sai, KHONG tru khi dung lai (khac miss_events) vi "structure"
-- la chuoi AI tu soan, cach dien dat co the khac nhau giua cac lan.
create table if not exists grammar_miss_events (
  id         bigint generated always as identity primary key,
  family_id  uuid not null references families(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  structure  text not null,
  delta      int  not null check (delta between -999 and 999 and delta <> 0),
  ts         timestamptz not null default now()
);
create index if not exists grammar_miss_events_profile_structure on grammar_miss_events (profile_id, structure);

-- ===== View =================================================================

-- So tu yeu hien tai cua tung be (security_invoker de RLS ap dung theo nguoi goi).
create or replace view weak_words with (security_invoker = on) as
  select profile_id, word, sum(delta)::int as misses
  from miss_events
  group by profile_id, word
  having sum(delta) > 0;

-- So cau truc ngu phap yeu hien tai cua tung be.
create or replace view weak_grammar_points with (security_invoker = on) as
  select profile_id, structure, sum(delta)::int as misses
  from grammar_miss_events
  group by profile_id, structure
  having sum(delta) > 0;

-- So du sao cua tung be.
create or replace view star_balance with (security_invoker = on) as
  select profile_id, coalesce(sum(delta), 0)::int as stars
  from reward_ledger
  group by profile_id;

-- ===== RLS: moi gia dinh chi thay du lieu cua minh ==========================

alter table families       enable row level security;
alter table profiles       enable row level security;
alter table sessions       enable row level security;
alter table miss_events    enable row level security;
alter table grammar_miss_events enable row level security;
alter table reward_ledger  enable row level security;
alter table purchases      enable row level security;
alter table manual_rewards enable row level security;
alter table settings       enable row level security;
alter table devices        enable row level security;
alter table translation_passages    enable row level security;
alter table translation_submissions enable row level security;
alter table grammar_quizzes             enable row level security;
alter table grammar_quiz_submissions    enable row level security;
alter table ai_call_log                 enable row level security;

drop policy if exists families_own on families;
create policy families_own on families
  for all using (owner = auth.uid()) with check (owner = auth.uid());

-- Ham tien ich: id gia dinh cua nguoi dang dang nhap.
create or replace function my_family_id() returns uuid
language sql stable security definer set search_path = public as
$$ select id from families where owner = auth.uid() $$;

do $$
declare t text;
begin
  foreach t in array array['profiles','sessions','miss_events','grammar_miss_events','reward_ledger',
                           'purchases','manual_rewards','settings','devices','kid_logins',
                           'translation_passages','translation_submissions',
                           'grammar_quizzes','grammar_quiz_submissions','ai_call_log']
  loop
    execute format('drop policy if exists %I_fam on %I', t, t);
    execute format(
      'create policy %I_fam on %I for all using (family_id = my_family_id()) with check (family_id = my_family_id())',
      t, t);
  end loop;
end $$;

-- ===== Xoa toan bo du lieu gia dinh (nut 1 cham trong trang Phu Huynh) ======
-- Chi xoa duoc gia dinh CUA CHINH MINH (kiem tra owner ben trong ham).
create or replace function delete_my_family() returns void
language plpgsql security definer set search_path = public as $$
begin
  delete from families where owner = auth.uid();
end $$;

-- ===== Admin Dashboard: thong ke so dong cac bang + dung luong database ====
-- CHI goi duoc tu server (api/admin-stats.js dung SERVICE ROLE KEY) - REVOKE
-- khoi anon/authenticated de 1 phu huynh binh thuong KHONG tu goi thang RPC
-- nay bang anon key cua ho ma xem duoc thong ke cua CA HE THONG.
create or replace function admin_db_stats() returns json
language plpgsql security definer set search_path = public as $$
declare result json;
begin
  select json_build_object(
    'db_size_bytes', pg_database_size(current_database()),
    'families', (select count(*) from families),
    'profiles', (select count(*) from profiles),
    'sessions', (select count(*) from sessions),
    'reward_ledger', (select count(*) from reward_ledger),
    'purchases', (select count(*) from purchases),
    'translation_submissions', (select count(*) from translation_submissions),
    'grammar_quiz_submissions', (select count(*) from grammar_quiz_submissions),
    'ai_call_log', (select count(*) from ai_call_log)
  ) into result;
  return result;
end $$;
revoke execute on function admin_db_stats() from public, anon, authenticated;

-- ===== Don dep dinh ky (trang Phu Huynh tu goi ~1 lan/tuan) ==================
-- Gop miss_events cu (>30 ngay) thanh 1 dong/tu; giu 300 van moi nhat moi be;
-- gop reward_ledger cu (>60 ngay) thanh 1 dong "so du cu" (tong SAO khong doi).
create or replace function tidy_my_family() returns void
language plpgsql security definer set search_path = public as $$
declare fam uuid;
begin
  select id into fam from families where owner = auth.uid();
  if fam is null then return; end if;

  with old as (
    delete from miss_events
    where family_id = fam and ts < now() - interval '30 days'
    returning profile_id, word, delta
  )
  insert into miss_events (family_id, profile_id, word, delta, ts)
  select fam, profile_id, word, sum(delta), now() - interval '30 days'
  from old
  group by profile_id, word
  having sum(delta) <> 0 and sum(delta) between -999 and 999;

  with old_gr as (
    delete from grammar_miss_events
    where family_id = fam and ts < now() - interval '30 days'
    returning profile_id, structure, delta
  )
  insert into grammar_miss_events (family_id, profile_id, structure, delta, ts)
  select fam, profile_id, structure, sum(delta), now() - interval '30 days'
  from old_gr
  group by profile_id, structure
  having sum(delta) <> 0 and sum(delta) between -999 and 999;

  delete from sessions s
  where s.family_id = fam and s.id in (
    select id from (
      select id, row_number() over (partition by profile_id order by played_at desc) as rn
      from sessions where family_id = fam
    ) t where t.rn > 300
  );

  with old as (
    delete from reward_ledger
    where family_id = fam and ts < now() - interval '60 days'
    returning profile_id, delta
  )
  insert into reward_ledger (id, family_id, profile_id, delta, reason, ts)
  select gen_random_uuid(), fam, profile_id, sum(delta), 'so-du-cu', now() - interval '60 days'
  from old
  group by profile_id
  having sum(delta) <> 0;

  delete from kid_logins where family_id = fam and ts < now() - interval '30 days';
end $$;
