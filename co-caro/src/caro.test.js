// Unit test cho logic cờ ca-rô. Chạy: node src/caro.test.js

import { createBoard, winner, aiMove } from './caro.js';

let passed = 0;
let failed = 0;

function check(name, cond) {
  if (cond) { passed++; console.log(`  ✅ ${name}`); }
  else { failed++; console.error(`  ❌ ${name}`); }
}

const put = (cells, n, coords, player) => {
  for (const [x, y] of coords) cells[y * n + x] = player;
};

console.log('— Cờ ca-rô —');

check('bàn mới trống, chưa ai thắng', (() => {
  const c = createBoard(3);
  return c.length === 9 && winner(c, 3, 3) === null;
})());

check('3×3: thắng hàng ngang / dọc / chéo', (() => {
  for (const coords of [
    [[0, 0], [1, 0], [2, 0]],
    [[1, 0], [1, 1], [1, 2]],
    [[0, 0], [1, 1], [2, 2]],
    [[2, 0], [1, 1], [0, 2]],
  ]) {
    const c = createBoard(3);
    put(c, 3, coords, 'x');
    const w = winner(c, 3, 3);
    if (!w || w === 'draw' || w.player !== 'x' || w.line.length !== 3) return false;
  }
  return true;
})());

check('3×3: bàn đầy không ai thắng → hòa', (() => {
  const c = ['x', 'o', 'x', 'x', 'o', 'o', 'o', 'x', 'x'];
  return winner(c, 3, 3) === 'draw';
})());

check('9×9: 4 liên tiếp chưa thắng, 5 mới thắng', (() => {
  const c = createBoard(9);
  put(c, 9, [[2, 4], [3, 4], [4, 4], [5, 4]], 'o');
  if (winner(c, 9, 5) !== null) return false;
  put(c, 9, [[6, 4]], 'o');
  const w = winner(c, 9, 5);
  return w && w.player === 'o' && w.line.length === 5;
})());

check('AI: thắng ngay khi có thể', (() => {
  const c = createBoard(3);
  put(c, 3, [[0, 0], [1, 0]], 'o'); // máy sắp thắng hàng đầu
  put(c, 3, [[0, 1], [1, 1]], 'x');
  return aiMove(c, 3, 3, 'o', 'x', () => 0) === 2; // ô (2,0)
})());

check('AI: chặn người sắp thắng', (() => {
  const c = createBoard(3);
  put(c, 3, [[0, 2], [1, 2]], 'x'); // bé sắp thắng hàng cuối
  put(c, 3, [[0, 0]], 'o');
  return aiMove(c, 3, 3, 'o', 'x', () => 0) === 8; // ô (2,2)
})());

check('AI 9×9: chặn dãy 4 quân của người', (() => {
  const c = createBoard(9);
  put(c, 9, [[2, 2], [3, 2], [4, 2], [5, 2]], 'x');
  put(c, 9, [[2, 5], [3, 5], [4, 5]], 'o');
  const mv = aiMove(c, 9, 5, 'o', 'x', () => 0);
  return mv === 2 * 9 + 1 || mv === 2 * 9 + 6; // (1,2) hoặc (6,2)
})());

check('AI: bàn đầy → trả -1', (() => {
  const c = ['x', 'o', 'x', 'x', 'o', 'o', 'o', 'x', 'x'];
  return aiMove(c, 3, 3, 'o', 'x') === -1;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
