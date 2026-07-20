// Theo dõi tiến độ "đã học" của từng trò trong Ngữ Pháp Trực Quan — RIÊNG
// theo từng hồ sơ bé (mỗi hồ sơ có ID lấy từ pokemon/src/stats.js, hệ hồ sơ
// dùng chung toàn dự án). Mỗi khi bé trả lời ĐÚNG 1 tình huống/thì cụ thể
// (kể cả đúng sau khi được gợi ý), tình huống đó (đánh dấu theo VỊ TRÍ
// trong mảng dữ liệu gốc — ổn định vì quy ước của dự án là chỉ THÊM MỚI vào
// cuối mảng, không bao giờ sắp xếp lại) được ghi nhận "đã học". % tiến độ =
// số mục đã học / tổng số mục trong pool dữ liệu của trò đó.

let storage = typeof localStorage !== 'undefined' ? localStorage : null;
let getProfileId = () => 'guest';

/** Cho unit test: thay localStorage bằng object giả { getItem, setItem }. */
export function _setStorage(s) {
  storage = s;
}

/** Cho unit test / app.js: đổi hàm lấy id hồ sơ hiện tại. */
export function _setProfileIdGetter(fn) {
  getProfileId = fn;
}

function storageKey(gameKey) {
  return `nguphap-progress:${getProfileId()}:${gameKey}`;
}

function loadSet(gameKey) {
  try {
    const raw = storage ? storage.getItem(storageKey(gameKey)) : null;
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function saveSet(gameKey, set) {
  try {
    if (storage) storage.setItem(storageKey(gameKey), JSON.stringify([...set]));
  } catch { /* ignore, không làm hỏng ván chơi */ }
}

/** Đánh dấu 1 mục (theo index trong mảng dữ liệu gốc) là ĐÃ HỌC cho 1 trò. */
export function markLearned(gameKey, index) {
  if (index == null || index < 0) return;
  const set = loadSet(gameKey);
  if (set.has(index)) return;
  set.add(index);
  saveSet(gameKey, set);
}

/** Số mục đã học của 1 trò. */
export function learnedCount(gameKey) {
  return loadSet(gameKey).size;
}

/** % tiến độ (0-100, làm tròn) của 1 trò so với tổng số mục dữ liệu. */
export function progressPercent(gameKey, total) {
  if (!total) return 0;
  return Math.min(100, Math.round((learnedCount(gameKey) / total) * 100));
}
