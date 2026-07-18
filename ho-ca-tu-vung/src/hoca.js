// Logic Hồ Cá Từ Vựng — thuần, test được.
// Cá bơi ngang qua hồ theo từng "làn nước" (lane), mỗi con mang 1 từ vựng
// (emoji + tên tiếng Anh). Máy công bố từ mục tiêu — bé CHỈ câu (chạm) con cá
// mang đúng từ đó trong 45 giây. Câu đúng 3 lần liên tiếp thì đổi từ mục
// tiêu khác. Khác game Bắn Chim Từ Vựng (chim ngoi lên ở ổ cố định), ở đây cá
// liên tục BƠI NGANG qua màn hình theo nhiều làn cùng lúc.

import { WORDS } from '../../shared/fruit-object-words.js';

export const ROUND_SECONDS = 45;
export const LANES = 4;
export const TARGET_HITS_TO_CHANGE = 3; // câu đúng 3 lần thì đổi từ mục tiêu
export const SWIM_MS_MIN = 3200;
export const SWIM_MS_MAX = 4600;

/** Chọn từ mục tiêu mới (khác từ cũ). */
export function pickTarget(prev = null, rng = Math.random) {
  for (;;) {
    const w = WORDS[Math.floor(rng() * WORDS.length)];
    if (!prev || w.en !== prev.en) return w;
  }
}

/** Sinh con cá mới: ~45% mang đúng từ mục tiêu, còn lại từ khác. */
export function makeFishWord(target, rng = Math.random) {
  if (rng() < 0.45) return target;
  for (;;) {
    const w = WORDS[Math.floor(rng() * WORDS.length)];
    if (w.en !== target.en) return w;
  }
}

/** Điểm khi câu trúng cá. @returns {delta, good} */
export function catchScore(fishWord, target) {
  return fishWord.en === target.en
    ? { delta: 10, good: true }
    : { delta: -5, good: false }; // câu nhầm cá: trừ nhẹ, không âm quá (app kẹp về 0)
}

/** Nhịp cá bơi vào nhanh dần theo thời gian đã trôi (giây). */
export function spawnDelay(elapsed) {
  return Math.max(500, 1000 - elapsed * 10);
}

/** Chọn 1 làn nước còn trống (không có cá) trong số LANES làn, trả -1 nếu hết làn trống. */
export function pickFreeLane(busyLanes, rng = Math.random) {
  const free = [];
  for (let i = 0; i < LANES; i++) if (!busyLanes.includes(i)) free.push(i);
  if (!free.length) return -1;
  return free[Math.floor(rng() * free.length)];
}
