// Sổ theo dõi "câu hay sai" cho Luyện Thi Cambridge — cùng thuật toán với
// `nghe-doan-on-tap/src/misses.js` nhưng khoá theo QUESTION ID thay vì từ
// tiếng Anh (1 điểm ngữ pháp có thể có nhiều câu hỏi khác nhau, không thể
// dùng từ làm khoá duy nhất như bên vocab). Tách file riêng để KHÔNG đụng vào
// misses.js gốc đang chạy ổn định cho 17 game Nghe & Đoán/Ôn Tập Vui.
//
// Mỗi lần bé chọn SAI 1 câu (kể cả lần sai thứ 2), câu đó +1 điểm "cần ôn";
// đúng NGAY LẦN ĐẦU thì -1 (đúng đủ nhiều lần thì ra khỏi sổ). Lưu
// localStorage, mọi thao tác bọc try/catch — hỏng storage thì game vẫn chạy.

import { ready as serverReady, recordMissBatch } from '../../shared/api.js';

const KEY = 'examprep-misses';
const MAX_QUESTIONS = 300;
const MAX_COUNT = 99;

let storage = typeof localStorage !== 'undefined' ? localStorage : null;

let queue = [];
let flushTimer = null;

function flushEvents() {
  if (flushTimer) { clearTimeout(flushTimer); flushTimer = null; }
  if (!queue.length) return;
  const batch = queue;
  queue = [];
  serverReady().then((ok) => (ok ? recordMissBatch(batch) : null)).catch(() => {});
}

function pushEvent(questionId, delta) {
  queue.push({ word: `exam:${questionId}`, delta, ts: new Date().toISOString() });
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
    const entries = Object.entries(map);
    if (entries.length > MAX_QUESTIONS) {
      entries.sort((a, b) => b[1] - a[1]);
      map = Object.fromEntries(entries.slice(0, MAX_QUESTIONS));
    }
    if (storage) storage.setItem(KEY, JSON.stringify(map));
  } catch { /* ignore */ }
}

/** Bé vừa chọn SAI câu này (mỗi lần sai đều tính, kể cả lần sai thứ 2 trong 1 câu). */
export function recordMiss(questionId) {
  if (!questionId) return;
  const map = load();
  map[questionId] = Math.min(MAX_COUNT, (map[questionId] || 0) + 1);
  save(map);
  pushEvent(questionId, +1);
}

/** Bé trả lời ĐÚNG NGAY LẦN ĐẦU câu này — trừ dần điểm "cần ôn", về 0 thì ra khỏi sổ. */
export function recordHit(questionId) {
  if (!questionId) return;
  const map = load();
  if (!(questionId in map)) return;
  map[questionId] -= 1;
  if (map[questionId] <= 0) delete map[questionId];
  save(map);
  pushEvent(questionId, -1);
}

/** Bản đồ { questionId: điểm cần ôn } — dùng để tính trọng số chọn câu. */
export function missMap() {
  return load();
}

/** Danh sách questionId hay sai, sắp theo mức độ cần ôn giảm dần. */
export function missedQuestionIds() {
  const map = load();
  return Object.keys(map).sort((a, b) => map[b] - map[a]);
}

/** Số câu đang nằm trong sổ cần ôn. */
export function missCount() {
  return missedQuestionIds().length;
}
