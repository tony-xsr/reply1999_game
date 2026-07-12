// Logic Bắt Vịt — thuần, test được.
// classic: đập mọi con vịt. letter: CHỈ đập con mang chữ mục tiêu (học mặt chữ).

import { LETTERS } from '../../to-mau/src/letters.js';

export const ROUND_SECONDS = 45;
export const HOLES = 9;
export const TARGET_HITS_TO_CHANGE = 3; // đập đúng 3 lần thì đổi chữ mục tiêu

/** Chọn chữ mục tiêu mới (khác chữ cũ). */
export function pickTarget(prev = null, rng = Math.random) {
  for (;;) {
    const l = LETTERS[Math.floor(rng() * LETTERS.length)];
    if (l.ch !== prev) return l.ch;
  }
}

/** Sinh con vịt mới: ~45% mang chữ mục tiêu, còn lại chữ khác. */
export function makeDuckLetter(target, rng = Math.random) {
  if (rng() < 0.45) return target;
  for (;;) {
    const l = LETTERS[Math.floor(rng() * LETTERS.length)];
    if (l.ch !== target) return l.ch;
  }
}

/** Điểm khi đập trúng vịt. @returns {delta, good} */
export function hitScore(mode, duckLetter, target) {
  if (mode === 'classic') return { delta: 10, good: true };
  return duckLetter === target
    ? { delta: 10, good: true }
    : { delta: -5, good: false }; // đập nhầm chữ: trừ nhẹ, không âm quá (app kẹp về 0)
}

/** Nhịp xuất hiện vịt nhanh dần theo thời gian đã trôi (giây). */
export function spawnDelay(elapsed) {
  return Math.max(450, 950 - elapsed * 10);
}

/** Thời gian vịt ngoi lên (ms) — lâu hơn ở chế độ chữ để bé kịp đọc. */
export function duckUpTime(mode) {
  return mode === 'letter' ? 1900 : 1300;
}
