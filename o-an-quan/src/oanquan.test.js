// Unit test cho luật Ô Ăn Quan. Chạy: node src/oanquan.test.js

import { createGame, play, aiMove, legalMoves, totalValue, SIDES, QUAN_VALUE } from './oanquan.js';

let passed = 0;
let failed = 0;

function check(name, cond) {
  if (cond) { passed++; console.log(`  ✅ ${name}`); }
  else { failed++; console.error(`  ❌ ${name}`); }
}

console.log('— Ô Ăn Quan —');

check('bàn mới: 10 ô dân × 5 quân, 2 quan, tổng giá trị 70', (() => {
  const g = createGame();
  return g.stones[0] === 0 && g.stones[6] === 0
    && SIDES.A.concat(SIDES.B).every((c) => g.stones[c] === 5)
    && totalValue(g) === 70;
})());

check('legalMoves: đầu ván A có 10 nước (5 ô × 2 hướng)', (() => {
  const g = createGame();
  return legalMoves(g).length === 10 && legalMoves(g).every((m) => SIDES.A.includes(m.cell));
})());

check('rải quân: bốc ô 3 đi xuôi → các ô 4,5,quan,7,8 mỗi ô +1', (() => {
  const g = createGame();
  // dừng chuỗi bốc-tiếp bằng bàn tùy chỉnh: chỉ ô 3 có 5 quân
  g.stones = [0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0];
  play(g, 3, 1);
  // rải vào 4,5,6,7,8 → ô kế (9) trống, ô sau (10) trống → mất lượt, không ăn
  return g.stones[4] === 1 && g.stones[5] === 1 && g.stones[6] === 1
    && g.stones[7] === 1 && g.stones[8] === 1 && g.scores.A === 0 && g.turn === 'B';
})());

check('ăn quân: ô kế trống + ô sau có quân → ăn ô sau', (() => {
  const g = createGame();
  g.stones = [0, 0, 2, 0, 0, 7, 0, 0, 0, 0, 0, 0];
  // A bốc ô 2 (2 quân) đi xuôi: rải 3,4 → ô kế 5... ô 5 có 7 quân → bốc tiếp!
  // Chỉnh lại cho gọn: bốc ô 2 đi NGƯỢC: rải 1,0? ô 0 là quan.
  // Dùng thế đơn giản: A bốc ô 4 (1 quân) đi xuôi: rải vào 5 → ô kế 6 là quan → mất lượt.
  g.stones = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0];
  play(g, 4, 1);
  if (g.scores.A !== 0) return false;
  // Thế ăn thật: A bốc ô 2 (1 quân) đi xuôi: rải vào 3 → ô kế 4 TRỐNG, ô sau 5 có 6 quân → ăn 6
  const g2 = createGame();
  g2.stones = [0, 0, 1, 0, 0, 6, 0, 3, 0, 0, 0, 0];
  play(g2, 2, 1);
  return g2.scores.A === 6 && g2.stones[5] === 0;
})());

check('ăn chuỗi: (trống, có quân) lặp lại thì ăn tiếp', (() => {
  const g = createGame();
  // A bốc ô 1 (1 quân) → rải vào 2 → kế 3 trống, 4 có 2 → ăn; kế 5 trống, 6... là quan (có quan) → ăn luôn quan
  g.stones = [0, 1, 0, 0, 2, 0, 3, 1, 1, 1, 1, 1];
  play(g, 1, 1);
  // ăn ô 4 (2 quân) rồi ô 6 (3 dân + quan 10)
  return g.scores.A === 2 + 3 + QUAN_VALUE && g.quan[1] === false;
})());

check('bảo toàn tổng giá trị 70 qua 200 nước ngẫu nhiên', (() => {
  for (let s = 0; s < 10; s++) {
    const g = createGame();
    for (let i = 0; i < 20 && !g.finished; i++) {
      const mv = aiMove(g);
      if (!mv) break;
      play(g, mv.cell, mv.dir);
      if (totalValue(g) !== 70) return false;
    }
  }
  return true;
})());

check('hết 2 quan → tàn cuộc, dân bên nào bên ấy hưởng', (() => {
  const g = createGame();
  g.quan = [false, true];
  g.stones = [0, 1, 0, 0, 0, 0, 2, 4, 0, 0, 0, 0];
  g.scores = { A: 30, B: 23 };
  // A bốc ô 1 đi ngược... ô 0 là quan → thử: bốc ô 1 (1 quân) đi xuôi: rải 2 → kế 3 trống, 4 trống → mất lượt (không ăn)
  // Thế ăn quan cuối: A bốc ô 4? trống. Dùng thế: ô 5 có 1 quân, rải vào 6 (quan còn 2 dân+quan)... rải vào quan không ăn.
  // Cách chắc: ô 4 có 1, rải vào 5 → kế 6 là quan → mất lượt. Không được.
  // Thế chuẩn: ô 3 có 1, rải vào 4 → kế 5 TRỐNG, ô sau 6 là quan (còn quan + 2 dân) → ăn quan!
  g.stones = [0, 0, 0, 1, 0, 0, 2, 4, 0, 0, 0, 0];
  play(g, 3, 1);
  // Ăn quan phải (10 + 2 dân) → hết 2 quan → tàn cuộc "hết quan tàn dân":
  // A hưởng thêm quân vừa rải vào ô 4 (hàng mình), B hưởng 4 quân ô 7.
  return g.finished && g.scores.A === 30 + 12 + 1 && g.scores.B === 23 + 4
    && g.stones.every((s) => s === 0);
})());

check('máy chọn nước ăn được nhiều nhất', (() => {
  const g = createGame();
  g.turn = 'B';
  // B bốc ô 7 (1 quân) xuôi (+1): rải 8 → kế 9 trống, 10 có 9 quân → ăn 9!
  g.stones = [0, 5, 5, 5, 5, 5, 0, 1, 0, 0, 9, 0];
  const mv = aiMove(g, () => 0);
  const clone = structuredClone(g);
  play(clone, mv.cell, mv.dir);
  return clone.scores.B >= 9;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
