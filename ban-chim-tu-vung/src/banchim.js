// Logic Bắn Chim Từ Vựng — thuần, test được.
// Chim ngoi lên ở các "ổ mây" ngẫu nhiên, mỗi con mang 1 từ vựng (emoji + tên
// tiếng Anh). Máy công bố 1 từ mục tiêu, bé CHỈ bắn con chim mang đúng từ đó
// — bắn đúng 3 lần thì đổi từ mục tiêu khác. Mô phỏng lại đúng cơ chế
// "Đập theo chữ" của Bắt Vịt (bat-vit/src/ducks.js) nhưng thay chữ cái đơn lẻ
// bằng cả 1 từ vựng có hình minh hoạ.

import { WORDS } from '../../shared/fruit-object-words.js';

export const ROUND_SECONDS = 45;
export const SKY_SLOTS = 9;
export const TARGET_HITS_TO_CHANGE = 3; // bắn đúng 3 lần thì đổi từ mục tiêu
export const BIRD_UP_MS = 1900; // chim lơ lửng lâu hơn vịt vì cần đọc cả từ, không chỉ 1 chữ

/** Chọn từ mục tiêu mới (khác từ cũ). */
export function pickTarget(prev = null, rng = Math.random) {
  for (;;) {
    const w = WORDS[Math.floor(rng() * WORDS.length)];
    if (!prev || w.en !== prev.en) return w;
  }
}

/** Sinh con chim mới: ~45% mang đúng từ mục tiêu, còn lại từ khác. */
export function makeBirdWord(target, rng = Math.random) {
  if (rng() < 0.45) return target;
  for (;;) {
    const w = WORDS[Math.floor(rng() * WORDS.length)];
    if (w.en !== target.en) return w;
  }
}

/** Điểm khi bắn trúng chim. @returns {delta, good} */
export function hitScore(birdWord, target) {
  return birdWord.en === target.en
    ? { delta: 10, good: true }
    : { delta: -5, good: false }; // bắn nhầm từ: trừ nhẹ, không âm quá (app kẹp về 0)
}

/** Nhịp xuất hiện chim nhanh dần theo thời gian đã trôi (giây). */
export function spawnDelay(elapsed) {
  return Math.max(450, 950 - elapsed * 10);
}
