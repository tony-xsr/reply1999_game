// Unit test cho logic ghép hình trượt. Chạy: node src/puzzle.test.js

import { createPuzzle, scramble, slide, canSlide, isSolved, isSolvable, blankIndex } from './puzzle.js';

let passed = 0;
let failed = 0;

function check(name, cond) {
  if (cond) { passed++; console.log(`  ✅ ${name}`); }
  else { failed++; console.error(`  ❌ ${name}`); }
}

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

console.log('— Ghép hình trượt —');

check('bàn mới đã giải, ô trống ở góc cuối', (() => {
  const p = createPuzzle(3);
  return isSolved(p) && blankIndex(p) === 8;
})());

check('canSlide: chỉ ô cùng hàng/cột với ô trống', (() => {
  const p = createPuzzle(3); // trống ở 8 (hàng 2, cột 2)
  return canSlide(p, 6) && canSlide(p, 2) && canSlide(p, 7) && !canSlide(p, 0) && !canSlide(p, 4);
})());

check('slide 1 ô kề: đổi chỗ với ô trống', (() => {
  const p = createPuzzle(3);
  slide(p, 7);
  return p.tiles[8] === 7 && blankIndex(p) === 7;
})());

check('slide cả dãy: bấm ô 6, cả 6 và 7 trượt sang phải', (() => {
  const p = createPuzzle(3);
  slide(p, 6); // trống ở 8, cùng hàng
  return blankIndex(p) === 6 && p.tiles[7] === 6 && p.tiles[8] === 7;
})());

check('slide theo cột: bấm ô 2, cả cột trượt xuống', (() => {
  const p = createPuzzle(3);
  slide(p, 2); // trống 8, cột 2: ô 2 và 5 trượt xuống
  return blankIndex(p) === 2 && p.tiles[5] === 2 && p.tiles[8] === 5;
})());

check('scramble 3×3 và 4×4: đủ mảnh, không tự giải, LUÔN giải được (100 seed)', (() => {
  for (let s = 1; s <= 100; s++) {
    for (const n of [3, 4]) {
      const p = scramble(createPuzzle(n), n === 3 ? 60 : 140, rng(s * 10 + n));
      const sorted = [...p.tiles].sort((a, b) => a - b);
      if (!sorted.every((v, i) => v === i)) return false;
      if (isSolved(p) || !isSolvable(p)) return false;
    }
  }
  return true;
})());

check('cùng seed → cùng thế xáo (tất định)', (() => {
  const a = scramble(createPuzzle(4), 140, rng(9)).tiles.join(',');
  const b = scramble(createPuzzle(4), 140, rng(9)).tiles.join(',');
  return a === b;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
