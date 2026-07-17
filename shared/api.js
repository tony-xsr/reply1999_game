// Client Supabase dùng chung cho cả bộ sưu tập — gọi thẳng Auth + PostgREST
// bằng fetch, KHÔNG cần SDK/build. An toàn khi import trong Node (test): mọi
// truy cập window/localStorage đều nằm trong hàm và có kiểm tra tồn tại.
//
// Kiến trúc đã chốt: SERVER là nguồn sự thật (bỏ local-first). Khi chưa điền
// /server-config.js hoặc chưa đăng nhập, các hàm ghi trở thành no-op để game
// không hỏng — trang Phụ Huynh sẽ hướng dẫn cài đặt.

import { starsFromScore, capDailyStars } from './rewards.js';

const SESSION_KEY = 'r99-session';
const KID_KEY = 'r99-kid';

const isBrowser = typeof window !== 'undefined';
let configPromise = null;

/* ===== Cấu hình ===== */

function loadConfig() {
  if (!isBrowser) return Promise.resolve({ url: '', anonKey: '' });
  if (window.SERVER_CONFIG) return Promise.resolve(window.SERVER_CONFIG);
  if (!configPromise) {
    configPromise = new Promise((resolve) => {
      const s = document.createElement('script');
      s.src = '/server-config.js';
      s.onload = () => resolve(window.SERVER_CONFIG || { url: '', anonKey: '' });
      s.onerror = () => resolve({ url: '', anonKey: '' });
      document.head.appendChild(s);
    });
  }
  return configPromise;
}

/** Server đã được cấu hình chưa (điền url + anonKey trong /server-config.js). */
export async function configured() {
  const c = await loadConfig();
  return Boolean(c.url && c.anonKey);
}

/* ===== Phiên đăng nhập (tài khoản PHỤ HUYNH — lưu bền trên thiết bị) ===== */

function readSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || null; } catch { return null; }
}
function writeSession(s) {
  try {
    if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    else localStorage.removeItem(SESSION_KEY);
  } catch { /* private mode */ }
}

/** Có phiên phụ huynh trên thiết bị này không (đã liên kết máy). */
export function signedIn() {
  return isBrowser && Boolean(readSession()?.refresh_token);
}

export function sessionUser() {
  return readSession()?.user || null;
}

async function authFetch(path, body) {
  const c = await loadConfig();
  const res = await fetch(`${c.url}/auth/v1/${path}`, {
    method: 'POST',
    headers: { apikey: c.anonKey, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.msg || data.error_description || data.error || `Auth ${res.status}`);
  return data;
}

export async function signUp(email, password) {
  const data = await authFetch('signup', { email, password });
  if (data.access_token) writeSession(data);
  return data;
}

export async function signIn(email, password) {
  const data = await authFetch('token?grant_type=password', { email, password });
  writeSession(data);
  return data;
}

export function signOut() {
  writeSession(null);
}

async function refreshToken() {
  const s = readSession();
  if (!s?.refresh_token) return null;
  try {
    const data = await authFetch('token?grant_type=refresh_token', { refresh_token: s.refresh_token });
    writeSession(data);
    return data;
  } catch {
    writeSession(null);
    return null;
  }
}

/* ===== Gọi PostgREST (tự làm mới token khi hết hạn) ===== */

async function rest(method, path, body, extraHeaders = {}, retry = true) {
  const c = await loadConfig();
  if (!c.url || !c.anonKey) throw new Error('SERVER_NOT_CONFIGURED');
  const s = readSession();
  if (!s?.access_token) throw new Error('NOT_SIGNED_IN');
  const res = await fetch(`${c.url}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: c.anonKey,
      Authorization: `Bearer ${s.access_token}`,
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (res.status === 401 && retry) {
    const renewed = await refreshToken();
    if (renewed) return rest(method, path, body, extraHeaders, false);
  }
  if (!res.ok) {
    const err = await res.text().catch(() => '');
    throw new Error(`REST ${res.status}: ${err.slice(0, 200)}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

const get = (path) => rest('GET', path);
const post = (path, body, headers) => rest('POST', path, body, { Prefer: 'return=representation', ...headers });
const patch = (path, body) => rest('PATCH', path, body, { Prefer: 'return=representation' });
const del = (path) => rest('DELETE', path);

export function uuid() {
  try { return crypto.randomUUID(); } catch {
    return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 10)}-${Math.random().toString(16).slice(2, 10)}`;
  }
}

/** Sẵn sàng ghi dữ liệu chưa: có config + có phiên + đã chọn bé. */
export async function ready() {
  return (await configured()) && signedIn() && Boolean(getCurrentKidId());
}

/* ===== Gia đình ===== */

let familyCache = null;

/** Lấy (tự tạo nếu chưa có) gia đình của tài khoản đang đăng nhập. */
export async function ensureFamily() {
  if (familyCache) return familyCache;
  const rows = await get('families?select=*');
  if (rows.length) {
    familyCache = rows[0];
    return familyCache;
  }
  const user = sessionUser();
  const created = await post('families', { owner: user.id });
  familyCache = created[0];
  return familyCache;
}

/* ===== Hồ sơ bé ===== */

export async function listKids() {
  return get('profiles?select=*&order=created_at.asc');
}

export async function addKid({ name, avatar = '🐰', color = '#ff8a3d' }) {
  const fam = await ensureFamily();
  const rows = await post('profiles', { family_id: fam.id, name, avatar, color });
  return rows[0];
}

export async function deleteKid(profileId) {
  await del(`profiles?id=eq.${profileId}`);
}

/** Bé đang chơi trên THIẾT BỊ này (con trỏ cục bộ — dữ liệu thật ở server). */
export function getCurrentKidId() {
  try { return localStorage.getItem(KID_KEY) || null; } catch { return null; }
}

/**
 * Chọn bé đang chơi. Truyền thêm info {name, avatar} để các game hiện thanh
 * avatar mà không cần gọi mạng.
 */
export function setCurrentKid(profileId, info = null) {
  try {
    if (profileId) {
      localStorage.setItem(KID_KEY, profileId);
      if (info) localStorage.setItem('r99-kid-info', JSON.stringify({ id: profileId, ...info }));
    } else {
      localStorage.removeItem(KID_KEY);
      localStorage.removeItem('r99-kid-info');
    }
  } catch { /* private mode */ }
}

/** Thông tin bé đang chơi đã lưu cục bộ ({id, name, avatar}) — null nếu chưa chọn. */
export function currentKidInfo() {
  try {
    const info = JSON.parse(localStorage.getItem('r99-kid-info'));
    return info && info.id === getCurrentKidId() ? info : null;
  } catch { return null; }
}

/* ===== Phiên chơi + sao thưởng ===== */

function todayISO() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

/** Tổng sao ĐÃ KIẾM hôm nay (không tính tiêu) — để áp trần ngày. */
export async function starsEarnedToday(profileId) {
  const rows = await get(
    `reward_ledger?select=delta&profile_id=eq.${profileId}&delta=gt.0&ts=gte.${todayISO()}`);
  return rows.reduce((sum, r) => sum + r.delta, 0);
}

/**
 * Ghi 1 ván chơi lên server + tự cộng sao theo luật (10 điểm = 1 sao, trần
 * ngày). Trả về { stars } số sao thật sự được cộng. Ném lỗi khi mất mạng /
 * chưa cấu hình — bên gọi quyết định im lặng hay báo.
 */
export async function recordSessionServer({ mode, result, score = 0, level = 1, seconds = 0 }) {
  const profileId = getCurrentKidId();
  if (!profileId) throw new Error('NO_KID_SELECTED');
  const fam = await ensureFamily();
  await post('sessions', {
    id: uuid(), family_id: fam.id, profile_id: profileId,
    mode, result, score: score | 0, level: level | 0, seconds: Math.max(0, Math.round(seconds)),
  }, { Prefer: 'return=minimal,resolution=ignore-duplicates' });

  const want = starsFromScore(score);
  let granted = 0;
  if (want > 0) {
    const earned = await starsEarnedToday(profileId);
    granted = capDailyStars(earned, want);
    if (granted > 0) {
      await post('reward_ledger', {
        id: uuid(), family_id: fam.id, profile_id: profileId,
        delta: granted, reason: `choi:${mode}`,
      }, { Prefer: 'return=minimal' });
    }
  }
  return { stars: granted };
}

export async function kidSessions(profileId, limit = 400) {
  return get(`sessions?select=*&profile_id=eq.${profileId}&order=played_at.desc&limit=${limit}`);
}

/* ===== Sổ "từ hay sai" ===== */

export async function recordMissServer(word, delta) {
  const profileId = getCurrentKidId();
  if (!profileId || !word) throw new Error('NO_KID_SELECTED');
  const fam = await ensureFamily();
  await post('miss_events', {
    family_id: fam.id, profile_id: profileId, word, delta: delta >= 0 ? 1 : -1,
  }, { Prefer: 'return=minimal' });
}

export async function weakWordsServer(profileId) {
  return get(`weak_words?select=word,misses&profile_id=eq.${profileId}&order=misses.desc`);
}

/* ===== Sao & quà ===== */

export async function starBalance(profileId) {
  const rows = await get(`star_balance?select=stars&profile_id=eq.${profileId}`);
  return rows.length ? rows[0].stars : 0;
}

export async function grantStars(profileId, delta, reason) {
  const fam = await ensureFamily();
  await post('reward_ledger', {
    id: uuid(), family_id: fam.id, profile_id: profileId, delta: delta | 0, reason,
  }, { Prefer: 'return=minimal' });
}

/** Đổi quà bằng sao: trừ sao + ghi purchases. Ném 'NOT_ENOUGH_STARS' nếu thiếu. */
export async function buyItem(profileId, item) {
  const balance = await starBalance(profileId);
  if (balance < item.cost) throw new Error('NOT_ENOUGH_STARS');
  const fam = await ensureFamily();
  await post('reward_ledger', {
    id: uuid(), family_id: fam.id, profile_id: profileId,
    delta: -item.cost, reason: `doi:${item.id}`,
  }, { Prefer: 'return=minimal' });
  await post('purchases', {
    id: uuid(), family_id: fam.id, profile_id: profileId, item_id: item.id, cost: item.cost,
  }, { Prefer: 'return=minimal' });
}

export async function kidPurchases(profileId) {
  return get(`purchases?select=*&profile_id=eq.${profileId}&order=ts.desc`);
}

/** Quà MIỄN PHÍ "học chăm" (hộp quà mỗi 15 câu) — vào tủ quà với cost 0. */
export async function recordFreeGift(profileId, itemId) {
  const fam = await ensureFamily();
  await post('purchases', {
    id: uuid(), family_id: fam.id, profile_id: profileId, item_id: itemId, cost: 0,
  }, { Prefer: 'return=minimal' });
}

/* ===== Thưởng tay của bố mẹ ===== */

export async function sendManualReward(profileId, { stars = 0, itemId = null, message = '' }) {
  const fam = await ensureFamily();
  await post('manual_rewards', {
    family_id: fam.id, profile_id: profileId, stars: stars | 0, item_id: itemId, message,
  }, { Prefer: 'return=minimal' });
}

export async function unopenedRewards(profileId) {
  return get(`manual_rewards?select=*&profile_id=eq.${profileId}&opened_at=is.null&order=created_at.asc`);
}

/** Bé mở hộp quà: đánh dấu đã mở + cộng sao đính kèm (nếu có). */
export async function openReward(reward) {
  await patch(`manual_rewards?id=eq.${reward.id}`, { opened_at: new Date().toISOString() });
  if (reward.stars > 0) await grantStars(reward.profile_id, reward.stars, 'bo-me-thuong');
}

/* ===== Cài đặt + thiết bị + quản trị ===== */

export async function getSettings() {
  const fam = await ensureFamily();
  const rows = await get(`settings?select=*&family_id=eq.${fam.id}`);
  const s = rows[0] || { family_id: fam.id, tts_rate: 1.0, daily_limit_min: 45 };
  try { localStorage.setItem('r99-settings-cache', JSON.stringify({ ...s, cachedAt: Date.now() })); } catch { /* ignore */ }
  return s;
}

/** Bản cache cài đặt gần nhất (đọc nhanh không cần mạng; có thể null). */
export function cachedSettings() {
  try { return JSON.parse(localStorage.getItem('r99-settings-cache')); } catch { return null; }
}

export async function saveSettings({ tts_rate, daily_limit_min }) {
  const fam = await ensureFamily();
  await post('settings', {
    family_id: fam.id, tts_rate, daily_limit_min, updated_at: new Date().toISOString(),
  }, { Prefer: 'return=minimal,resolution=merge-duplicates' });
}

/** Tổng số GIÂY bé đã chơi hôm nay (để áp giới hạn giờ chơi). */
export async function todayPlaySeconds(profileId) {
  const rows = await get(
    `sessions?select=seconds&profile_id=eq.${profileId}&played_at=gte.${todayISO()}`);
  return rows.reduce((sum, r) => sum + (r.seconds || 0), 0);
}

export async function touchDevice(label) {
  const fam = await ensureFamily();
  let id = null;
  try { id = localStorage.getItem('r99-device'); } catch { /* ignore */ }
  if (!id) {
    id = uuid();
    try { localStorage.setItem('r99-device', id); } catch { /* ignore */ }
  }
  await post('devices', {
    id, family_id: fam.id, label: label || 'Thiết bị', last_seen: new Date().toISOString(),
  }, { Prefer: 'return=minimal,resolution=merge-duplicates' });
}

export async function listDevices() {
  return get('devices?select=*&order=last_seen.desc');
}

/** Xuất toàn bộ dữ liệu gia đình (backup JSON tải về). */
export async function exportAll() {
  const [kids, sessions, misses, ledger, purchases, gifts, settings] = await Promise.all([
    get('profiles?select=*'), get('sessions?select=*'), get('miss_events?select=*'),
    get('reward_ledger?select=*'), get('purchases?select=*'), get('manual_rewards?select=*'),
    get('settings?select=*'),
  ]);
  return { exportedAt: new Date().toISOString(), kids, sessions, misses, ledger, purchases, gifts, settings };
}

/** XÓA TOÀN BỘ dữ liệu gia đình trên server (không hoàn tác được). */
export async function deleteFamily() {
  await rest('POST', 'rpc/delete_my_family', {});
  familyCache = null;
}

/* ===== Nhập dữ liệu localStorage cũ (1 lần, từ trang Phụ Huynh) ===== */

/** Đẩy danh sách ván chơi cũ (định dạng stats.js) lên server cho 1 bé. */
export async function importLegacySessions(profileId, sessions) {
  const fam = await ensureFamily();
  const rows = sessions.map((s) => ({
    id: uuid(), family_id: fam.id, profile_id: profileId,
    mode: s.mode || 'khac', result: s.result || 'quit',
    score: s.score | 0, level: s.level | 0, seconds: Math.max(0, Math.round(s.seconds || 0)),
    played_at: s.date ? `${s.date}T12:00:00+07:00` : new Date().toISOString(),
  }));
  for (let i = 0; i < rows.length; i += 100) {
    await post('sessions', rows.slice(i, i + 100), { Prefer: 'return=minimal' });
  }
  return rows.length;
}

/** Đẩy sổ "từ hay sai" cũ ({word: count}) lên server cho 1 bé (tối đa 5 điểm/từ). */
export async function importLegacyMisses(profileId, missMap) {
  const fam = await ensureFamily();
  const rows = [];
  for (const [word, count] of Object.entries(missMap || {})) {
    const n = Math.min(5, Math.max(1, count | 0));
    for (let i = 0; i < n; i++) {
      rows.push({ family_id: fam.id, profile_id: profileId, word, delta: 1 });
    }
  }
  for (let i = 0; i < rows.length; i += 200) {
    await post('miss_events', rows.slice(i, i + 200), { Prefer: 'return=minimal' });
  }
  return rows.length;
}
