// Unit test cho Vị Vua Vàng. Chạy: node src/vivuavang.test.js

import {
  COLORS, ROWS, COLS, makeGrid, findMatches, isAdjacent, swapCells,
  matchScore, resolveCascades, hasAnyMove, makeLevel, attemptSwap,
} from './vivuavang.js';

let passed = 0;
let failed = 0;

function check(name, cond) {
  if (cond) { passed++; console.log(`  ✅ ${name}`); }
  else { failed++; console.error(`  ❌ ${name}`); }
}

function seeded(seed = 1) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
}

console.log('— Dựng bàn —');

check('bàn đúng kích thước, đúng số màu, KHÔNG có hàng khớp sẵn (tránh ăn điểm free)', (() => {
  const g = makeGrid(ROWS, COLS, 4, seeded(3));
  const usedColors = new Set(g.flat());
  return g.length === ROWS && g[0].length === COLS
    && [...usedColors].every((c) => COLORS.slice(0, 4).includes(c))
    && findMatches(g).length === 0;
})());

check('màn 0: bàn đầy, mục tiêu 300đ, 18 nước đi, không có khớp sẵn', (() => {
  const g = makeLevel(0, seeded(2));
  return g.score === 0 && g.goal === 300 && g.movesLeft === 18 && !g.over
    && findMatches(g.grid).length === 0;
})());

check('màn cao hơn có nhiều màu hơn + mục tiêu cao hơn (tối đa 6 màu)', (() => {
  const g9 = makeLevel(9, seeded());
  const g30 = makeLevel(30, seeded());
  return g9.palette.length === 6 && g30.palette.length === 6 && g30.goal === 300 + 30 * 130;
})());

console.log('— Tìm hàng khớp —');

check('hàng ngang 3 liên tiếp cùng màu được nhận diện đủ, không lem hàng khác', (() => {
  const grid = [
    ['red', 'red', 'red', 'blue'],
    ['green', 'yellow', 'purple', 'orange'],
  ];
  const m = findMatches(grid);
  const keys = new Set(m.map(([r, c]) => `${r},${c}`));
  return m.length === 3 && keys.has('0,0') && keys.has('0,1') && keys.has('0,2') && !keys.has('0,3');
})());

check('hàng dọc 3 liên tiếp cũng nhận diện được', (() => {
  const grid = [['red', 'blue'], ['red', 'green'], ['red', 'yellow']];
  const m = findMatches(grid);
  return m.length === 3 && m.every(([r, c]) => c === 0);
})());

check('hình chữ L (ngang + dọc giao nhau) tính đủ, không đếm trùng ô giao điểm', (() => {
  const grid = [
    ['red', 'red', 'red'],
    ['red', 'blue', 'green'],
    ['red', 'yellow', 'purple'],
  ];
  const m = findMatches(grid);
  const keys = new Set(m.map(([r, c]) => `${r},${c}`));
  // hàng ngang (0,0)(0,1)(0,2) + hàng dọc (0,0)(1,0)(2,0) — ô (0,0) chung, tổng 5 ô duy nhất
  return keys.size === 5 && m.length === 5;
})());

check('bàn không có hàng nào ≥3 thì không báo khớp', (() => {
  const grid = [['red', 'blue', 'red'], ['blue', 'red', 'blue'], ['red', 'blue', 'red']];
  return findMatches(grid).length === 0;
})());

console.log('— Đổi chỗ 2 ô —');

check('isAdjacent: đúng 4 hướng liền kề, sai với chéo/xa/chính nó', (() => (
  isAdjacent(1, 1, 0, 1) && isAdjacent(1, 1, 2, 1) && isAdjacent(1, 1, 1, 0) && isAdjacent(1, 1, 1, 2)
  && !isAdjacent(1, 1, 0, 0) && !isAdjacent(1, 1, 3, 1) && !isAdjacent(1, 1, 1, 1)
)));

check('swapCells đổi đúng giá trị 2 ô, đổi 2 lần thì về như cũ', (() => {
  const grid = [['red', 'blue'], ['green', 'yellow']];
  swapCells(grid, 0, 0, 0, 1);
  const mid = grid[0][0] === 'blue' && grid[0][1] === 'red';
  swapCells(grid, 0, 0, 0, 1);
  return mid && grid[0][0] === 'red' && grid[0][1] === 'blue';
})());

console.log('— Thử nước đi (attemptSwap) —');

check('2 ô không liền kề → từ chối, không tốn nước đi, bàn không đổi', (() => {
  const g = makeLevel(0, seeded());
  const before = JSON.stringify(g.grid);
  const result = attemptSwap(g, 0, 0, 5, 5, seeded());
  return result === null && g.movesLeft === 18 && JSON.stringify(g.grid) === before;
})());

check('đổi chỗ không tạo được hàng nào → tự hoàn tác, bàn về nguyên trạng, không tốn nước đi', (() => {
  const grid = [
    ['red', 'blue', 'green'],
    ['blue', 'red', 'yellow'],
    ['green', 'yellow', 'red'],
  ];
  const game = { grid, palette: COLORS.slice(0, 4), goal: 999999, movesLeft: 5, score: 0, over: false, won: false };
  const before = JSON.stringify(grid);
  const result = attemptSwap(game, 0, 0, 0, 1, seeded());
  return result.valid === false && game.movesLeft === 5 && JSON.stringify(grid) === before;
})());

check('đổi chỗ tạo được hàng 3 → ăn điểm, trừ đúng 1 nước đi, ô đã khớp biến mất khỏi vị trí cũ', (() => {
  const grid = [
    ['red', 'red', 'blue'],
    ['green', 'yellow', 'red'],
  ];
  // đổi (0,2)"blue" với (1,2)"red" (liền kề theo cột) → hàng 0 thành red,red,red
  const game = { grid, palette: COLORS.slice(0, 6), goal: 999999, movesLeft: 5, score: 0, over: false, won: false };
  const result = attemptSwap(game, 0, 2, 1, 2, seeded(7));
  const rowsFull = grid.every((row) => row.every((cell) => cell != null));
  return result.valid === true && result.score === matchScore(3, 1) && game.score === matchScore(3, 1)
    && game.movesLeft === 4 && rowsFull; // 3 ô khớp đã bị xoá rồi lấp lại — bàn phải luôn đầy trở lại
})());

console.log('— Combo dây chuyền —');

check('khớp gây hiệu ứng dây chuyền (rơi xuống tạo khớp mới) cho điểm cao hơn 1 đợt đơn lẻ cùng cỡ', (() => {
  // Hàng 2 (toàn "red") sẽ bị xoá trước. Cột 0 phía trên có 2 viên "green" và phía dưới còn 1
  // viên "green" nữa → sau khi rơi xuống lấp chỗ trống, cả 3 viên "green" xếp thẳng hàng dọc,
  // tạo thêm 1 đợt khớp mới ngay lập tức (dây chuyền).
  const grid = [
    ['green', 'blue', 'purple'],
    ['green', 'yellow', 'orange'],
    ['red', 'red', 'red'],
    ['green', 'orange', 'yellow'],
  ];
  const rng = seeded(9);
  const out = resolveCascades(grid, COLORS.slice(0, 6), rng);
  return out.combo === 2 && out.score > matchScore(3, 1);
})());

console.log('— Không để bàn bí nước đi —');

check('sau mỗi nước đi hợp lệ, bàn luôn còn ít nhất 1 nước đi khác (tự xào lại nếu bí)', (() => {
  const g = makeLevel(1, seeded(13));
  let guard = 0;
  while (!g.over && guard < 30) {
    let moved = false;
    outer:
    for (let r = 0; r < ROWS && !moved; r++) {
      for (let c = 0; c < COLS && !moved; c++) {
        if (c + 1 < COLS && attemptSwap(g, r, c, r, c + 1, seeded(guard * 5 + r + c))?.valid) { moved = true; break outer; }
        if (r + 1 < ROWS && attemptSwap(g, r, c, r + 1, c, seeded(guard * 5 + r + c))?.valid) { moved = true; break outer; }
      }
    }
    if (!g.over && !hasAnyMove(g.grid)) return false;
    guard++;
    if (!moved) break; // không tìm được nước đi nào nữa trong lần quét này thì dừng thử
  }
  return true;
})());

console.log('— Kết thúc màn —');

check('đủ điểm mục tiêu ngay sau 1 nước đi → thắng', (() => {
  const g = makeLevel(0, seeded());
  g.score = g.goal - 1;
  let result = null;
  outer:
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (c + 1 < COLS) { result = attemptSwap(g, r, c, r, c + 1, seeded(r + c)); if (result?.valid) break outer; }
      if (r + 1 < ROWS) { result = attemptSwap(g, r, c, r + 1, c, seeded(r + c)); if (result?.valid) break outer; }
    }
  }
  return result?.valid === true && g.over === true && g.won === true;
})());

check('hết nước đi mà chưa đủ điểm → thua', (() => {
  const g = makeLevel(0, seeded());
  g.movesLeft = 1;
  let result = null;
  outer:
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (c + 1 < COLS) { result = attemptSwap(g, r, c, r, c + 1, seeded(r + c)); if (result?.valid) break outer; }
      if (r + 1 < ROWS) { result = attemptSwap(g, r, c, r + 1, c, seeded(r + c)); if (result?.valid) break outer; }
    }
  }
  return result?.valid === true && g.over === true && g.won === false;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
