// Tô Màu Từ Vựng: chọn ngẫu nhiên 1 từ (trái cây/đồ vật) trong vốn từ dùng
// chung, tránh lặp lại đúng từ vừa xong. File thuần logic, test độc lập —
// phần vẽ/tô màu tái dùng thẳng engine `Painter` có sẵn ở to-mau/src/paint.js
// (chỉ cần đưa emoji vào làm "glyph" thay vì chữ cái, engine tự chia vùng).

import { WORDS } from '../../shared/fruit-object-words.js';

export { WORDS };

/** Chọn 1 từ ngẫu nhiên trong vốn từ, tránh lặp lại đúng từ vừa xong (nếu
 * vốn từ có từ 2 từ trở lên). */
export function pickWord(prevEn, rng = Math.random) {
  if (WORDS.length <= 1) return WORDS[0];
  let word;
  do {
    word = WORDS[Math.floor(rng() * WORDS.length)];
  } while (word.en === prevEn);
  return word;
}
