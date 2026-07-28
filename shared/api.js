// Client Supabase dùng chung cho cả bộ sưu tập — gọi thẳng Auth + PostgREST
// bằng fetch, KHÔNG cần SDK/build. An toàn khi import trong Node (test): mọi
// truy cập window/localStorage đều nằm trong hàm và có kiểm tra tồn tại.
//
// Kiến trúc đã chốt: SERVER là nguồn sự thật (bỏ local-first). Khi chưa điền
// /server-config.js hoặc chưa đăng nhập, các hàm ghi trở thành no-op để game
// không hỏng — trang Phụ Huynh sẽ hướng dẫn cài đặt.

import { starsForSession, capDailyStars, DEFAULT_REWARD_COST_MULTIPLIER, catalogItem } from './rewards.js';
import { gardenValue, claimGardenYield as calcGardenYield, sellBackValue } from './garden.js';
import { DAILY_PRACTICE_BONUS_STARS } from './daily-bonus.js';
import { REUSE_WINDOW_DAYS, pickReusableContent } from './content-reuse.js';

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

/** Access token Supabase hiện tại của phiên phụ huynh — dùng để gọi các API
 * server cần xác thực đúng người (vd /api/admin-stats), null nếu chưa đăng
 * nhập. Khác PostgREST (qua rest()) ở chỗ hàm này KHÔNG tự làm mới token hết
 * hạn — bên gọi tự xử lý lỗi 401 nếu có (vd yêu cầu đăng nhập lại). */
export function accessToken() {
  return readSession()?.access_token || null;
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
  // PostgREST trả body RỖNG với Prefer: return=minimal (kể cả status 201) —
  // không được gọi res.json() thẳng kẻo nổ "Unexpected end of JSON input".
  const text = await res.text().catch(() => '');
  if (!text) return null;
  try { return JSON.parse(text); } catch { return null; }
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

/** Sửa hồ sơ bé: tên/avatar/màu/cài đặt riêng (patch: {name?, avatar?, color?, settings?}). */
export async function updateKid(profileId, patchBody) {
  const rows = await patch(`profiles?id=eq.${profileId}`, patchBody);
  return rows?.[0] || null;
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

/**
 * Làm mới `settings` (jsonb) trong cache cục bộ của bé đang chơi từ server —
 * gọi trước khi kiểm tra các cấu hình phụ thuộc `settings` (vd cấp độ dùng
 * cho Luyện Dịch/Trắc Nghiệm Ngữ Pháp ở shared/translate-ui.js/grammar-quiz-
 * ui.js). Không làm vậy thì nếu phụ huynh VỪA đổi cấu hình trong khi thiết bị
 * của bé vẫn giữ bản `settings` CŨ (chỉ được nạp lại lúc chọn hồ sơ ở
 * /chon-be/), các nút phụ thuộc cấu hình đó sẽ "biến mất" dù cấu hình mới đã
 * đúng trên server — bé phải quay lại /chon-be/ chọn lại mới thấy. Mất mạng
 * thì giữ nguyên cache cũ, không phá vỡ gì.
 * @returns {Promise<object|null>} thông tin bé đã cập nhật, hoặc null nếu chưa chọn bé
 */
export async function refreshCurrentKidSettings() {
  const id = getCurrentKidId();
  const info = currentKidInfo();
  if (!id || !info) return null;
  try {
    const settings = await fetchKidSettings(id);
    const updated = { ...info, settings };
    setCurrentKid(id, updated);
    return updated;
  } catch {
    return info; // mất mạng: giữ nguyên cache cũ
  }
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

  const want = starsForSession(mode, score);
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
  // Chỉ lấy đúng cột dashboard cần — tiết kiệm băng thông egress của Supabase.
  return get(`sessions?select=played_at,seconds,result,score,mode&profile_id=eq.${profileId}&order=played_at.desc&limit=${limit}`);
}

/* ===== Truy vấn GỘP CẢ NHÀ — 1 request cho mọi bé (cho màn so sánh) ===== */

/** Số dư sao của TẤT CẢ các bé trong 1 request. @returns Map profileId→stars */
export async function familyStarBalances() {
  const rows = await get('star_balance?select=profile_id,stars');
  return new Map(rows.map((r) => [r.profile_id, r.stars]));
}

/** Số từ cần ôn của TẤT CẢ các bé trong 1 request. @returns Map profileId→count */
export async function familyWeakCounts() {
  const rows = await get('weak_words?select=profile_id,word');
  const map = new Map();
  for (const r of rows) map.set(r.profile_id, (map.get(r.profile_id) || 0) + 1);
  return map;
}

/** Ván chơi của CẢ NHÀ từ mốc thời gian (1 request, cho so sánh tuần). */
export async function familySessionsSince(sinceISO) {
  return get(`sessions?select=profile_id,played_at,seconds,result&played_at=gte.${sinceISO}&order=played_at.desc&limit=1000`);
}

/** Sổ sao của CẢ NHÀ từ mốc thời gian (1 request, cho tab "Tất cả" xem hoạt động gộp). */
export async function familyLedgerSince(sinceISO, limit = 200) {
  return get(`reward_ledger?select=profile_id,delta,reason,ts&ts=gte.${sinceISO}&order=ts.desc&limit=${limit}`);
}

/** Sổ sao gần nhất của 1 bé (thay cho việc tải cả exportAll — tiết kiệm egress). */
export async function kidLedger(profileId, limit = 30) {
  return get(`reward_ledger?select=delta,reason,ts&profile_id=eq.${profileId}&order=ts.desc&limit=${limit}`);
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

/**
 * Ghi 1 LÔ sự kiện sai/đúng trong 1 request duy nhất (tiết kiệm số request
 * Supabase — thay vì mỗi câu trả lời 1 POST). events: [{word, delta, ts}].
 */
export async function recordMissBatch(events) {
  const profileId = getCurrentKidId();
  if (!profileId || !events?.length) return;
  const fam = await ensureFamily();
  await post('miss_events', events.map((e) => ({
    family_id: fam.id, profile_id: profileId,
    word: e.word, delta: e.delta >= 0 ? 1 : -1, ts: e.ts,
  })), { Prefer: 'return=minimal' });
}

/** Dọn dữ liệu cũ định kỳ (rpc tidy_my_family — cần chạy migrate-01 trước). */
export async function tidyFamily() {
  await rest('POST', 'rpc/tidy_my_family', {});
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

/** Phụ huynh đánh dấu 1 quà đã đổi là ĐÃ GIAO tận tay bé (vd đã đưa socola).
 * Chỉ để lưu vết — không hoàn/trừ sao, vì sao đã bị trừ lúc đổi quà rồi. */
export async function markPurchaseDelivered(purchaseId) {
  await patch(`purchases?id=eq.${purchaseId}`, { delivered_at: new Date().toISOString() });
}

/** Phụ huynh lỡ tay đánh dấu nhầm — bỏ đánh dấu đã giao (đưa về "chưa giao"). */
export async function unmarkPurchaseDelivered(purchaseId) {
  await patch(`purchases?id=eq.${purchaseId}`, { delivered_at: null });
}

/** Đọc `settings` (jsonb) MỚI NHẤT của 1 hồ sơ bé thẳng từ server — không
 * qua cache local (`currentKidInfo()` có thể cũ nếu bé vừa đổi cài đặt ở
 * thiết bị khác), dùng khi cần đọc-sửa-ghi 1 khoá trong đó cho an toàn. */
async function fetchKidSettings(profileId) {
  const rows = await get(`profiles?select=settings&id=eq.${profileId}`);
  return rows[0]?.settings || {};
}

/* ===== Vườn hoa sinh sao (xem công thức thuần trong shared/garden.js) ===== */

/**
 * "Thu lãi vườn hoa": cộng sao vườn hoa đã sinh ra kể từ lần thu gần nhất
 * (trần 36.5%/năm, tức 0,1%/ngày trên tổng giá hoa đang trồng), rồi lưu lại
 * mốc thu mới vào profiles.settings.gardenLastYieldAt (cần chạy migrate-01 để
 * có cột settings, và migrate-09 để có cột purchases.sold_at). An toàn gọi
 * lại nhiều lần liên tiếp trong cùng ngày — chưa đủ 1 ngày thì trả 0 sao và
 * KHÔNG đổi mốc, để progress bar phía UI vẫn tính đúng tiến độ hôm nay.
 * @returns {Promise<{stars:number, value:number, lastYieldAtMs:number}>}
 */
export async function claimGardenYield(profileId) {
  const [purchases, settings] = await Promise.all([kidPurchases(profileId), fetchKidSettings(profileId)]);
  const value = gardenValue(purchases, catalogItem);
  const lastYieldAtMs = settings.gardenLastYieldAt ? new Date(settings.gardenLastYieldAt).getTime() : Date.now();
  const { stars, days, newLastYieldAtMs } = calcGardenYield(value, lastYieldAtMs, Date.now());
  if (days > 0 || !settings.gardenLastYieldAt) {
    await updateKid(profileId, {
      settings: { ...settings, gardenLastYieldAt: new Date(newLastYieldAtMs).toISOString() },
    });
  }
  if (stars > 0) await grantStars(profileId, stars, 'vuon-hoa');
  return { stars, value, lastYieldAtMs: newLastYieldAtMs };
}

/** Bé bán lại 1 bông hoa trong vườn: mất đúng 1 sao so với giá đã mua. */
export async function sellFlower(profileId, purchase) {
  const refund = sellBackValue(purchase.cost);
  await patch(`purchases?id=eq.${purchase.id}`, { sold_at: new Date().toISOString() });
  if (refund > 0) await grantStars(profileId, refund, `ban:${purchase.item_id}`);
  return refund;
}

/* ===== Thưởng hoàn thành Luyện Dịch / Trắc Nghiệm Ngữ Pháp (xem shared/daily-bonus.js) ===== */

/**
 * Thưởng DAILY_PRACTICE_BONUS_STARS sao khi bé hoàn thành hết chỉ tiêu 1
 * phần luyện thi hôm nay — tự chặn thưởng quá 1 lần/ngày/phần bằng mốc lưu
 * ở profiles.settings[sectionKey]. Bên gọi tự kiểm tra đã làm xong hết chỉ
 * tiêu chưa (isQuotaComplete trong shared/daily-bonus.js) rồi mới gọi hàm
 * này — hàm chỉ lo phần chống thưởng trùng + ghi sổ.
 * @param {string} sectionKey khoá lưu mốc trong settings, vd 'trRewardedDay'/'gqRewardedDay'
 * @param {string} todayKey ngày hôm nay, vd dateKeyOffset(0)
 * @param {string} reason lý do ghi vào reward_ledger
 * @param {number} stars số sao thưởng — mặc định DAILY_PRACTICE_BONUS_STARS (Luyện Dịch/Trắc
 *   Nghiệm), truyền riêng cho các nhiệm vụ khác có mức thưởng khác (vd Ngữ Pháp Trực Quan 2 sao).
 * @returns {Promise<boolean>} true nếu vừa thưởng, false nếu hôm nay đã thưởng rồi
 */
export async function claimDailyPracticeBonus(profileId, sectionKey, todayKey, reason, stars = DAILY_PRACTICE_BONUS_STARS) {
  const settings = await fetchKidSettings(profileId);
  if (settings[sectionKey] === todayKey) return false;
  await updateKid(profileId, { settings: { ...settings, [sectionKey]: todayKey } });
  await grantStars(profileId, stars, reason);
  return true;
}

/* ===== Ai Là Triệu Phú (xem shared/millionaire.js) — 1 lần/ngày/bé ===== */

/**
 * Ghi kết quả 1 lượt chơi "Ai Là Triệu Phú" hôm nay — CHẶN chơi lần 2 trong
 * cùng ngày (đọc settings MỚI NHẤT từ server, không tin cache, để 2 thiết bị/
 * 2 tab không lách chơi được 2 lần/ngày). Cộng sao nếu có.
 * @returns {Promise<boolean>} true nếu vừa ghi nhận, false nếu HÔM NAY đã chơi rồi
 */
export async function claimMillionaireResult(profileId, { stars, correctStreak }, todayKey) {
  const settings = await fetchKidSettings(profileId);
  if (settings.millionaireLastPlayedDay === todayKey) return false;
  await updateKid(profileId, {
    settings: {
      ...settings, millionaireLastPlayedDay: todayKey, millionaireLastStars: stars, millionaireLastCorrectStreak: correctStreak,
    },
  });
  if (stars > 0) await grantStars(profileId, stars, 'trieu-phu:hoan-thanh');
  return true;
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
  const s = rows[0] || {
    family_id: fam.id, tts_rate: 1.0, daily_limit_min: 45,
    reward_cost_multiplier: DEFAULT_REWARD_COST_MULTIPLIER, custom_item_costs: {},
    ai_provider: 'groq', ai_api_key: '', deepseek_api_key: '', deepseek_model: '',
    custom_catalog_items: [],
  };
  if (s.reward_cost_multiplier == null) s.reward_cost_multiplier = DEFAULT_REWARD_COST_MULTIPLIER; // gia dinh cu chua chay migrate-03
  if (s.custom_item_costs == null) s.custom_item_costs = {}; // gia dinh cu chua chay migrate-04
  if (s.ai_provider == null) s.ai_provider = 'groq'; // gia dinh cu chua chay migrate-06
  if (s.ai_api_key == null) s.ai_api_key = ''; // gia dinh cu chua chay migrate-06
  if (s.deepseek_api_key == null) s.deepseek_api_key = ''; // gia dinh cu chua chay migrate-10
  if (s.deepseek_model == null) s.deepseek_model = ''; // gia dinh cu chua chay migrate-10
  if (s.custom_catalog_items == null) s.custom_catalog_items = []; // gia dinh cu chua chay migrate-13
  try { localStorage.setItem('r99-settings-cache', JSON.stringify({ ...s, cachedAt: Date.now() })); } catch { /* ignore */ }
  return s;
}

/** Bản cache cài đặt gần nhất (đọc nhanh không cần mạng; có thể null). */
export function cachedSettings() {
  try { return JSON.parse(localStorage.getItem('r99-settings-cache')); } catch { return null; }
}

// Chỉ ghi những trường THẬT SỰ được truyền vào (bỏ qua `undefined`) — form
// "Cài đặt chung" (tts_rate/daily_limit_min/reward_cost_multiplier) và form
// "Chỉnh giá quà" (custom_item_costs) lưu ĐỘC LẬP nhau; nếu luôn ghi đè cả
// 4 cột mỗi lần gọi, lưu form này sẽ vô tình XOÁ TRẮNG dữ liệu form kia.
export async function saveSettings({
  tts_rate, daily_limit_min, reward_cost_multiplier, custom_item_costs,
  ai_provider, ai_api_key, deepseek_api_key, deepseek_model, custom_catalog_items,
} = {}) {
  const fam = await ensureFamily();
  const payload = { family_id: fam.id, updated_at: new Date().toISOString() };
  if (tts_rate !== undefined) payload.tts_rate = tts_rate;
  if (daily_limit_min !== undefined) payload.daily_limit_min = daily_limit_min;
  if (reward_cost_multiplier !== undefined) payload.reward_cost_multiplier = reward_cost_multiplier;
  if (custom_item_costs !== undefined) payload.custom_item_costs = custom_item_costs;
  if (ai_provider !== undefined) payload.ai_provider = ai_provider;
  if (ai_api_key !== undefined) payload.ai_api_key = ai_api_key;
  if (deepseek_api_key !== undefined) payload.deepseek_api_key = deepseek_api_key;
  if (deepseek_model !== undefined) payload.deepseek_model = deepseek_model;
  if (custom_catalog_items !== undefined) payload.custom_catalog_items = custom_catalog_items;
  await post('settings', payload, { Prefer: 'return=minimal,resolution=merge-duplicates' });
}

/** Ghi 1 lượt gọi AI (Groq/DeepSeek) thành/không thành — chỉ dùng cho thống
 * kê Admin Dashboard (đếm tổng lượt gọi/ngày, xem api/admin-stats.js). Cần
 * chạy server/migrate-12-admin-stats.sql để có bảng này — best-effort, KHÔNG
 * BAO GIỜ ném lỗi (thống kê không quan trọng bằng tính năng AI chính, gọi từ
 * shared/ai-provider.js sau mỗi lần gọi AI thật). */
export async function logAiCall(provider, purpose, ok) {
  try {
    const fam = await ensureFamily();
    await post('ai_call_log', {
      family_id: fam.id, provider, purpose, ok: !!ok,
    }, { Prefer: 'return=minimal' });
  } catch { /* bảng chưa tồn tại (chưa chạy migrate-12) hoặc mất mạng: bỏ qua êm */ }
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

/* ===== Nhật ký đăng nhập của bé (thông báo cho phụ huynh) ===== */

/** Ghi 1 lần bé đăng nhập thành công (chọn hồ sơ ở /chon-be/). */
export async function recordKidLogin(profileId, { device = '', browser = '' } = {}) {
  const fam = await ensureFamily();
  await post('kid_logins', {
    family_id: fam.id, profile_id: profileId, device, browser,
  }, { Prefer: 'return=minimal' });
}

/** Các lần đăng nhập gần nhất của CẢ NHÀ (cho trang Phụ Huynh). */
export async function recentKidLogins(limit = 15) {
  return get(`kid_logins?select=profile_id,device,browser,ts&order=ts.desc&limit=${limit}`);
}

/* ===== Chuỗi ngày đăng nhập liên tục (streak) — xem shared/streak.js ===== */

/** Mốc thời gian (`ts`) các lần đăng nhập của 1 bé trong `days` ngày gần
 * nhất — đủ để tính streak hiện tại (xem streak.computeCurrentStreak). */
export async function kidLoginTimestamps(profileId, days = 90) {
  const since = new Date(Date.now() - days * 86400000).toISOString();
  const rows = await get(`kid_logins?select=ts&profile_id=eq.${profileId}&ts=gte.${since}&order=ts.asc`);
  return rows.map((r) => r.ts);
}

/**
 * Nhận thưởng 1 mốc streak đăng nhập — cộng sao + đánh dấu mốc này đã nhận
 * (profiles.settings.streakClaimedMax) để không nhận trùng. Bên gọi tự tính
 * streak hiện tại + mốc khả dụng (shared/streak.js) rồi mới gọi hàm này —
 * hàm chỉ lo chống nhận trùng + ghi sổ, tự đọc lại settings MỚI NHẤT từ
 * server (không tin cache) để 2 thiết bị/2 tab không thể nhận trùng 1 mốc.
 * @returns {Promise<boolean>} true nếu vừa nhận, false nếu mốc này đã nhận rồi
 */
export async function claimStreakMilestone(profileId, milestone, stars) {
  const settings = await fetchKidSettings(profileId);
  const claimedMax = settings.streakClaimedMax || 0;
  if (milestone <= claimedMax) return false;
  await updateKid(profileId, { settings: { ...settings, streakClaimedMax: milestone } });
  await grantStars(profileId, stars, `streak:${milestone}`);
  return true;
}

/* ===== Luyện Dịch (đoạn văn ngắn AI tự sinh + chấm điểm bằng AI) ===== */

/** Ngày N (mặc định 0 = hôm nay) tính theo giờ ĐỊA PHƯƠNG của thiết bị đang
 * mở — dùng để "dồn trước" bài của các ngày SẮP TỚI (offset dương) khi vào
 * site (xem shared/kid-bar.js checkDailyAiContent()). Khác `shared/vn-date.js`
 * (server dùng giờ CỐ ĐỊNH +7 vì không có "giờ địa phương máy chủ" đáng tin). */
export function dateKeyOffset(offsetDays = 0, base = new Date()) {
  const d = new Date(base.getTime() + offsetDays * 86400000);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function todayDateKey() {
  return dateKeyOffset(0);
}

/** Bài dịch của bé vào ĐÚNG ngày `day` (chuỗi "YYYY-MM-DD") — rỗng nếu chưa sinh. */
export async function passagesForDay(profileId, day) {
  return get(`translation_passages?select=*&profile_id=eq.${profileId}&day=eq.${day}&order=created_at.asc`);
}

/** 3 bài dịch HÔM NAY của bé (rỗng nếu chưa sinh — bên gọi tự sinh mới qua savePassages). */
export async function todayPassages(profileId) {
  return passagesForDay(profileId, todayDateKey());
}

/** Lưu các bài dịch MỚI sinh cho đúng ngày `day` (mặc định hôm nay — truyền
 * ngày khác để "dồn trước" bài của ngày sắp tới). passages: [{level, title, passage_en, vocab}]. */
export async function savePassages(profileId, passages, day = todayDateKey()) {
  const fam = await ensureFamily();
  const rows = passages.map((p) => ({ family_id: fam.id, profile_id: profileId, day, ...p }));
  return post('translation_passages', rows, { Prefer: 'return=representation' });
}

/**
 * Bé NỘP bản dịch — BƯỚC 1: lưu ngay bài làm lên server, CHƯA cần điểm AI.
 * Làm vậy để lỡ AI chấm lỗi/hết quota thì bài của bé vẫn KHÔNG MẤT, phụ
 * huynh vẫn thấy bé đã nộp — điểm/nhận xét được điền vào SAU bằng
 * `updateTranslationGrade` (gọi lại được nhiều lần nếu lần trước lỗi).
 * @returns {Promise<object>} bản ghi vừa tạo (có `id` để dùng cho 2 hàm dưới)
 */
export async function submitTranslationDraft(passageId, { submittedText, secondsSpent }) {
  const profileId = getCurrentKidId();
  if (!profileId) throw new Error('NO_KID_SELECTED');
  const fam = await ensureFamily();
  const rows = await post('translation_submissions', {
    family_id: fam.id, profile_id: profileId, passage_id: passageId,
    submitted_text: submittedText, seconds_spent: secondsSpent ?? null,
  }, { Prefer: 'return=representation' });
  return rows[0];
}

/** BƯỚC 2 (sau khi AI chấm xong, có thể gọi lại nếu lần trước lỗi): điền điểm/nhận xét/bản dịch mẫu AI. */
export async function updateTranslationGrade(submissionId, { aiScore, aiFeedback, aiReferenceVi }) {
  await patch(`translation_submissions?id=eq.${submissionId}`, {
    ai_score: aiScore, ai_feedback: aiFeedback, ai_reference_vi: aiReferenceVi || '',
  });
}

/** BƯỚC 3 (độc lập với việc AI đã chấm hay chưa): điền kết quả nối từ vựng sau khi bé làm xong. */
export async function updateTranslationVocab(submissionId, { vocabCorrect, vocabTotal }) {
  await patch(`translation_submissions?id=eq.${submissionId}`, {
    vocab_correct: vocabCorrect, vocab_total: vocabTotal,
  });
}

/** Bài dịch bé đã nộp, kèm nội dung đoạn văn gốc — cho Trang Phụ Huynh xem lại. */
export async function kidTranslationSubmissions(profileId, limit = 30) {
  return get(`translation_submissions?select=*,translation_passages(title,passage_en,level,vocab)&profile_id=eq.${profileId}&order=submitted_at.desc&limit=${limit}`);
}

/* ===== Trắc Nghiệm Ngữ Pháp mỗi ngày (5 câu AI tự sinh + chấm điểm/gợi ý bằng AI) ===== */

/** Đề trắc nghiệm ngữ pháp/từ vựng vào ĐÚNG ngày `day` (chuỗi "YYYY-MM-DD") — null nếu chưa sinh. */
export async function grammarQuizForDay(profileId, day, quizType = 'grammar') {
  const rows = await get(`grammar_quizzes?select=*&profile_id=eq.${profileId}&day=eq.${day}&quiz_type=eq.${quizType}&order=created_at.desc&limit=1`);
  return rows[0] || null;
}

/** Đề trắc nghiệm HÔM NAY của bé (null nếu chưa sinh — bên gọi tự sinh mới qua saveGrammarQuiz). */
export async function todayGrammarQuiz(profileId, quizType = 'grammar') {
  return grammarQuizForDay(profileId, todayDateKey(), quizType);
}

/** Lưu đề MỚI sinh cho đúng ngày `day` (mặc định hôm nay — truyền ngày khác
 * để "dồn trước" đề của ngày sắp tới). questions: [{prompt, options, answer, explanations}]. */
export async function saveGrammarQuiz(profileId, { level, questions, quizType = 'grammar' }, day = todayDateKey()) {
  const fam = await ensureFamily();
  const rows = await post('grammar_quizzes', {
    family_id: fam.id, profile_id: profileId, level, day, quiz_type: quizType, questions,
  }, { Prefer: 'return=representation' });
  return rows[0];
}

/* ===== Tái sử dụng nội dung của cả nhà — xem shared/content-reuse.js ===== */

/** Nội dung Luyện Dịch của CẢ NHÀ (không riêng 1 bé) trong `sinceDay` (chuỗi
 * "YYYY-MM-DD") tới nay, cùng cấp độ — nguồn để tìm bài PHÙ HỢP tái sử dụng. */
export async function familyPassagesForReuse(level, sinceDay) {
  return get(`translation_passages?select=id,day,profile_id,title,passage_en,vocab&level=eq.${level}&day=gte.${sinceDay}&order=day.asc&limit=500`);
}

/** Tương tự familyPassagesForReuse nhưng cho Trắc Nghiệm Ngữ Pháp/Từ Vựng. */
export async function familyGrammarQuizzesForReuse(level, quizType, sinceDay) {
  return get(`grammar_quizzes?select=id,day,profile_id,questions&level=eq.${level}&quiz_type=eq.${quizType}&day=gte.${sinceDay}&order=day.asc&limit=500`);
}

/**
 * Chuẩn bị bài Luyện Dịch cho `profileId` vào ngày `day` — ưu tiên TÁI SỬ
 * DỤNG nội dung có sẵn của CẢ NHÀ nếu tìm được phù hợp (xem shared/content-
 * reuse.js: tiết kiệm AI, anh/chị/em cùng ngày không trùng bài, nội dung cũ
 * tự nhiên "trồi lại" thành ôn tập). Trả về mảng passages đã sẵn sàng nếu
 * tái dùng được, hoặc [] nếu KHÔNG tìm được gì phù hợp — bên gọi tự sinh AI
 * mới rồi lưu bằng savePassages(profileId, generated, day).
 */
export async function ensureTranslationPassages(profileId, level, day) {
  const existing = await passagesForDay(profileId, day);
  if (existing.length) return existing;
  const sinceDay = dateKeyOffset(-REUSE_WINDOW_DAYS);
  const [pool, submissions] = await Promise.all([
    familyPassagesForReuse(level, sinceDay),
    kidTranslationSubmissions(profileId, 300),
  ]);
  const doneIds = new Set(submissions.map((s) => s.passage_id));
  const picked = pickReusableContent(pool, { profileId, todayKey: day, doneIds });
  if (!picked) return [];
  return savePassages(profileId, [{ level, title: picked.title, passage_en: picked.passage_en, vocab: picked.vocab }], day);
}

/** Tương tự ensureTranslationPassages nhưng cho Trắc Nghiệm — trả về đề nếu
 * tái dùng được, hoặc null nếu bên gọi cần tự sinh AI mới. */
export async function ensureGrammarQuiz(profileId, level, quizType, day) {
  const existing = await grammarQuizForDay(profileId, day, quizType);
  if (existing) return existing;
  const sinceDay = dateKeyOffset(-REUSE_WINDOW_DAYS);
  const [pool, submissions] = await Promise.all([
    familyGrammarQuizzesForReuse(level, quizType, sinceDay),
    kidGrammarQuizSubmissions(profileId, 300),
  ]);
  const doneIds = new Set(submissions.map((s) => s.quiz_id));
  const picked = pickReusableContent(pool, { profileId, todayKey: day, doneIds });
  if (!picked) return null;
  return saveGrammarQuiz(profileId, { level, questions: picked.questions, quizType }, day);
}

/**
 * Bé NỘP bài trắc nghiệm — BƯỚC 1: lưu ngay đáp án + điểm (điểm tính CLIENT-
 * SIDE từ đáp án đúng/sai, KHÔNG cần AI) — bài luôn được ghi nhận dù AI có
 * chấm gợi ý được hay không. Gợi ý AI điền SAU bằng `updateGrammarQuizSuggestion`.
 * @returns {Promise<object>} bản ghi vừa tạo (có `id` để dùng cho hàm dưới)
 */
export async function submitGrammarQuizDraft(quizId, { answers, score, secondsSpent }) {
  const profileId = getCurrentKidId();
  if (!profileId) throw new Error('NO_KID_SELECTED');
  const fam = await ensureFamily();
  const rows = await post('grammar_quiz_submissions', {
    family_id: fam.id, profile_id: profileId, quiz_id: quizId,
    answers, score, seconds_spent: secondsSpent ?? null,
  }, { Prefer: 'return=representation' });
  return rows[0];
}

/** BƯỚC 2 (sau khi AI soạn gợi ý xong, có thể gọi lại nếu lần trước lỗi): điền gợi ý AI. */
export async function updateGrammarQuizSuggestion(submissionId, aiSuggestion) {
  await patch(`grammar_quiz_submissions?id=eq.${submissionId}`, { ai_suggestion: aiSuggestion });
}

/** Đề trắc nghiệm ngữ pháp bé đã nộp, kèm nội dung đề gốc — cho Trang Phụ Huynh xem lại. */
export async function kidGrammarQuizSubmissions(profileId, limit = 30) {
  return get(`grammar_quiz_submissions?select=*,grammar_quizzes(level,day,quiz_type,questions)&profile_id=eq.${profileId}&order=submitted_at.desc&limit=${limit}`);
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
