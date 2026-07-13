// Sinh bộ thẻ cho game Lật hình trí nhớ — 3 kiểu cặp:
//  classic: 2 thẻ cùng hình 🐱–🐱
//  letter:  thẻ CHỮ ↔ thẻ HÌNH minh họa (A ↔ 🐔 gà) — học bảng chữ cái
//  number:  thẻ SỐ ↔ thẻ N con vật (3 ↔ 🐸🐸🐸) — học đếm
// Hàm thuần, nhận rng để test tất định.

import { LETTERS, DIGITS } from '../../to-mau/src/letters.js';
import { ALL_ITEMS } from '../../hoc-vui/src/words.js';

function shuffle(arr, rng = Math.random) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * @param {'classic'|'letter'|'number'} mode
 * @param {number} pairs - số cặp (mặc định 8 → lưới 4×4)
 * @returns {{id:number, face:string, small:boolean, pairKey:string, speech:string|null}[]}
 */
export function makeDeck(mode, pairs = 8, rng = Math.random) {
  let cards = [];

  if (mode === 'letter') {
    for (const l of shuffle(LETTERS, rng).slice(0, pairs)) {
      cards.push(
        { face: l.ch, small: false, pairKey: l.ch, speech: `${l.ch} — ${l.word}` },
        { face: l.emoji, small: false, pairKey: l.ch, speech: `${l.ch} — ${l.word}` },
      );
    }
  } else if (mode === 'number') {
    // Số 1..pairs (tối đa 8) ↔ bấy nhiêu con vật
    for (const d of DIGITS.slice(1, pairs + 1)) {
      const n = Number(d.ch);
      cards.push(
        { face: d.ch, small: false, pairKey: d.ch, speech: `Số ${d.ch}` },
        { face: d.animal.repeat(n), small: n > 2, pairKey: d.ch, speech: `Số ${d.ch}` },
      );
    }
  } else {
    for (const item of shuffle(ALL_ITEMS, rng).slice(0, pairs)) {
      cards.push(
        { face: item.emoji, small: false, pairKey: item.emoji, speech: null },
        { face: item.emoji, small: false, pairKey: item.emoji, speech: null },
      );
    }
  }

  cards = shuffle(cards, rng);
  cards.forEach((c, i) => { c.id = i; });
  return cards;
}

/** Chấm sao theo số lượt lật so với tối ưu (mỗi cặp 1 lượt). */
export function starsForMoves(moves, pairs) {
  if (moves <= pairs * 1.6) return 3;
  if (moves <= pairs * 2.4) return 2;
  return 1;
}
