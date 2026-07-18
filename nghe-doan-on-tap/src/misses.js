// Sổ theo dõi "từ hay sai" dùng CHUNG cho cả 10 game Nghe & Đoán: mỗi lần bé
// chọn sai, từ tiếng Anh đó được +1 điểm "cần ôn"; mỗi lần trả lời đúng ngay
// lần đầu, từ đó được -1 (đúng đủ nhiều lần thì ra khỏi danh sách — coi như đã
// thuộc). Màn Ôn Tập Tổng Hợp đọc danh sách này cho bộ lọc "🎯 Ôn chỗ yếu".
//
// Từ tiếng Anh là khóa duy nhất hợp lệ vì chính sách của dự án là KHÔNG dạy
// trùng 1 từ ở 2 game. Lưu trong localStorage (offline, bền qua các phiên),
// mọi thao tác đều bọc try/catch — hỏng storage thì game vẫn chạy bình thường.

import { ready as serverReady, recordMissBatch } from '../../shared/api.js';

const KEY = 'nghedoan-misses';
const MAX_WORDS = 300;
const MAX_COUNT = 99;

let storage = typeof localStorage !== 'undefined' ? localStorage : null;

/*
 * Gửi sự kiện sai/đúng lên server theo LÔ (tiết kiệm số request Supabase):
 * gom vào hàng đợi trong trang, đẩy 1 POST khi đủ 10 sự kiện / sau 8 giây /
 * khi rời trang — lỗi mạng bỏ qua im lặng (kiến trúc server-thuần đã chốt).
 */
let queue = [];
let flushTimer = null;

function flushEvents() {
  if (flushTimer) { clearTimeout(flushTimer); flushTimer = null; }
  if (!queue.length) return;
  const batch = queue;
  queue = [];
  serverReady().then((ok) => (ok ? recordMissBatch(batch) : null)).catch(() => {});
}

function pushEvent(word, delta) {
  queue.push({ word, delta, ts: new Date().toISOString() });
  if (queue.length >= 10) flushEvents();
  else if (!flushTimer) flushTimer = setTimeout(flushEvents, 8000);
}

if (typeof addEventListener !== 'undefined') {
  addEventListener('pagehide', flushEvents);
  addEventListener('visibilitychange', () => {
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') flushEvents();
  });
}

/** Cho unit test: thay localStorage bằng object giả { getItem, setItem }. */
export function _setStorage(s) {
  storage = s;
}

function load() {
  try {
    const raw = storage ? storage.getItem(KEY) : null;
    const map = raw ? JSON.parse(raw) : {};
    return map && typeof map === 'object' ? map : {};
  } catch {
    return {};
  }
}

function save(map) {
  try {
    // Giữ sổ gọn: nếu quá nhiều từ, bỏ bớt những từ ít sai nhất.
    const entries = Object.entries(map);
    if (entries.length > MAX_WORDS) {
      entries.sort((a, b) => b[1] - a[1]);
      map = Object.fromEntries(entries.slice(0, MAX_WORDS));
    }
    if (storage) storage.setItem(KEY, JSON.stringify(map));
  } catch { /* ignore */ }
}

/** Bé vừa chọn SAI từ này (mỗi lần sai đều tính, kể cả lần sai thứ 2 trong 1 câu). */
export function recordMiss(word) {
  if (!word) return;
  const map = load();
  map[word] = Math.min(MAX_COUNT, (map[word] || 0) + 1);
  save(map);
  pushEvent(word, +1);
}

/** Bé trả lời ĐÚNG NGAY LẦN ĐẦU từ này — trừ dần điểm "cần ôn", về 0 thì ra khỏi sổ. */
export function recordHit(word) {
  if (!word) return;
  const map = load();
  if (!(word in map)) return;
  map[word] -= 1;
  if (map[word] <= 0) delete map[word];
  save(map);
  pushEvent(word, -1);
}

/** Danh sách từ hay sai, sắp theo mức độ cần ôn giảm dần. */
export function missedWords() {
  const map = load();
  return Object.keys(map).sort((a, b) => map[b] - map[a]);
}

/** Số từ đang nằm trong sổ cần ôn. */
export function missCount() {
  return missedWords().length;
}
