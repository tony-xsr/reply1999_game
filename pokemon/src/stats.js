// Hồ sơ người chơi + thống kê thắng/thua & thời gian chơi (localStorage).
// Danh tính gắn với trình duyệt qua device id; mỗi hồ sơ chỉ cần nhập tên,
// lần sau mở app trên cùng thiết bị là dùng lại được.

const DEVICE_KEY = 'pika.device';
const PROFILES_KEY = 'pika.profiles';
const statsKey = (pid) => `pika.stats.${pid}`;
const MAX_SESSIONS = 400; // giữ 400 ván gần nhất mỗi hồ sơ

function readJSON(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private mode */ }
}

function randomId() {
  try { return crypto.randomUUID(); } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

/** Id định danh trình duyệt/thiết bị — tạo 1 lần, dùng mãi. */
export function getDeviceId() {
  let id = null;
  try { id = localStorage.getItem(DEVICE_KEY); } catch { /* private mode */ }
  if (!id) {
    id = randomId();
    try { localStorage.setItem(DEVICE_KEY, id); } catch { /* private mode */ }
  }
  return id;
}

/* ===== Hồ sơ người chơi ===== */

/** @returns {{list:{id:string,name:string,created:string}[], current:string|null}} */
export function getProfiles() {
  const p = readJSON(PROFILES_KEY, null);
  if (p && Array.isArray(p.list)) return p;
  return { list: [], current: null };
}

export function addProfile(name) {
  const clean = String(name || '').trim().slice(0, 20);
  if (!clean) return null;
  const profiles = getProfiles();
  // Trùng tên (không phân biệt hoa thường) thì chuyển sang hồ sơ cũ thay vì tạo mới
  const existing = profiles.list.find((u) => u.name.toLowerCase() === clean.toLowerCase());
  if (existing) {
    profiles.current = existing.id;
    writeJSON(PROFILES_KEY, profiles);
    return existing;
  }
  const profile = { id: `p-${randomId()}`, name: clean, created: new Date().toISOString().slice(0, 10) };
  profiles.list.push(profile);
  profiles.current = profile.id;
  writeJSON(PROFILES_KEY, profiles);
  return profile;
}

export function setCurrentProfile(id) {
  const profiles = getProfiles();
  if (!profiles.list.some((u) => u.id === id)) return;
  profiles.current = id;
  writeJSON(PROFILES_KEY, profiles);
}

/** Hồ sơ đang chọn — tự tạo "Khách" nếu chưa có ai (lần đầu mở app). */
export function currentProfile(guestName = 'Khách') {
  const profiles = getProfiles();
  const cur = profiles.list.find((u) => u.id === profiles.current);
  if (cur) return cur;
  if (profiles.list.length) {
    setCurrentProfile(profiles.list[0].id);
    return profiles.list[0];
  }
  return addProfile(guestName);
}

/* ===== Ghi & đọc phiên chơi ===== */

/** Khóa ngày theo giờ ĐỊA PHƯƠNG (yyyy-mm-dd) — ván chơi buổi tối phải tính vào hôm nay. */
export function dateKey(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/**
 * Ghi 1 ván đã chơi cho hồ sơ hiện tại.
 * @param {{mode:string, result:'win'|'loss'|'quit'|'duel', score:number, level:number, seconds:number}} s
 */
export function recordSession(s) {
  const profile = currentProfile();
  if (!profile) return;
  const list = getSessions(profile.id);
  list.push({
    mode: s.mode,
    result: s.result,
    score: s.score | 0,
    level: s.level | 0,
    seconds: Math.max(0, Math.round(s.seconds)),
    date: s.date || dateKey(),
  });
  writeJSON(statsKey(profile.id), list.slice(-MAX_SESSIONS));
}

/** @returns {object[]} các ván đã ghi của 1 hồ sơ */
export function getSessions(pid) {
  const list = readJSON(statsKey(pid), []);
  return Array.isArray(list) ? list : [];
}

/* ===== Tổng hợp (hàm thuần — test được) ===== */

/** Tổng quan: số ván, thắng/thua, tỷ lệ thắng, tổng giây chơi. */
export function summarize(sessions) {
  const sum = { games: 0, wins: 0, losses: 0, quits: 0, seconds: 0, winRate: null };
  for (const s of sessions) {
    sum.games++;
    sum.seconds += s.seconds || 0;
    if (s.result === 'win') sum.wins++;
    else if (s.result === 'loss') sum.losses++;
    else if (s.result === 'quit') sum.quits++;
  }
  const decided = sum.wins + sum.losses;
  sum.winRate = decided ? sum.wins / decided : null;
  return sum;
}

/**
 * Gộp theo 7 ngày gần nhất (cũ → mới) để vẽ chart.
 * @returns {{date:string, seconds:number, games:number, wins:number}[]} đủ 7 phần tử
 */
export function last7Days(sessions, now = new Date()) {
  const days = [];
  const byDate = new Map();
  for (const s of sessions) {
    const d = byDate.get(s.date) || { seconds: 0, games: 0, wins: 0 };
    d.seconds += s.seconds || 0;
    d.games++;
    if (s.result === 'win') d.wins++;
    byDate.set(s.date, d);
  }
  for (let i = 6; i >= 0; i--) {
    const date = dateKey(new Date(now.getTime() - i * 86400000));
    const d = byDate.get(date) || { seconds: 0, games: 0, wins: 0 };
    days.push({ date, ...d });
  }
  return days;
}
