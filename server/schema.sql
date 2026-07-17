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
  created_at timestamptz not null default now()
);

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
  delta      int  not null check (delta in (-1, 1)),
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
  id         uuid primary key,
  family_id  uuid not null references families(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  item_id    text not null,
  cost       int  not null,
  ts         timestamptz not null default now()
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
  family_id       uuid primary key references families(id) on delete cascade,
  tts_rate        real not null default 1.0,
  daily_limit_min int  not null default 45,
  updated_at      timestamptz not null default now()
);

-- May da lien ket (chi de hien thi/quan ly, khong phai co che bao mat).
create table if not exists devices (
  id         uuid primary key,
  family_id  uuid not null references families(id) on delete cascade,
  label      text not null default 'Thiết bị',
  last_seen  timestamptz not null default now()
);

-- ===== View =================================================================

-- So tu yeu hien tai cua tung be (security_invoker de RLS ap dung theo nguoi goi).
create or replace view weak_words with (security_invoker = on) as
  select profile_id, word, sum(delta)::int as misses
  from miss_events
  group by profile_id, word
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
alter table reward_ledger  enable row level security;
alter table purchases      enable row level security;
alter table manual_rewards enable row level security;
alter table settings       enable row level security;
alter table devices        enable row level security;

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
  foreach t in array array['profiles','sessions','miss_events','reward_ledger',
                           'purchases','manual_rewards','settings','devices']
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
