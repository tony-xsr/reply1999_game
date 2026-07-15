// Unit test cho Đập Vàng. Chạy: node src/dapvang.test.js

import {
  COLORS, ROWS, COLS, makeGrid, findCluster, clusterScore, popAt, hasValidMove, makeLevel, pop,
} from './dapvang.js';

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

check('bàn đúng kích thước, chỉ dùng đúng số màu yêu cầu', (() => {
  const g = makeGrid(ROWS, COLS, 3, seeded());
  const usedColors = new Set(g.flat());
  return g.length === ROWS && g[0].length === COLS
    && [...usedColors].every((c) => COLORS.slice(0, 3).includes(c));
})());

check('màn 0: bàn đầy đủ, mục tiêu 250đ, 20 nước đi', (() => {
  const g = makeLevel(0, seeded());
  return g.score === 0 && g.goal === 250 && g.movesLeft === 20 && !g.over
    && g.grid.flat().every((cell) => cell != null);
})());

check('màn cao hơn có nhiều màu hơn + mục tiêu cao hơn (tối đa 6 màu)', (() => {
  const g0 = makeLevel(0, seeded());
  const g6 = makeLevel(9, seeded());
  const g30 = makeLevel(30, seeded());
  return g0.palette.length === 4 && g6.palette.length === 6 && g30.palette.length === 6
    && g30.goal === 250 + 30 * 120;
})());

console.log('— Tìm cụm liền kề —');

check('cụm hình chữ L liền kề cùng màu được gom đủ, không lem sang màu khác', (() => {
  const grid = [
    ['red', 'red', 'blue'],
    ['red', 'green', 'blue'],
    ['green', 'green', 'blue'],
  ];
  const cluster = findCluster(grid, 0, 0);
  const key = (r, c) => `${r},${c}`;
  const set = new Set(cluster.map(([r, c]) => key(r, c)));
  return cluster.length === 3 && set.has(key(0, 0)) && set.has(key(0, 1)) && set.has(key(1, 0))
    && !set.has(key(1, 1)) && !set.has(key(0, 2));
})());

check('ô lẻ loi (không có hàng xóm cùng màu) vẫn tìm được cụm kích thước 1', (() => {
  const grid = [['red', 'blue'], ['green', 'yellow']];
  return findCluster(grid, 0, 0).length === 1;
})());

console.log('— Tính điểm theo cụm —');

check('cụm càng to điểm/viên càng cao (thưởng luỹ tiến)', (() => (
  clusterScore(1) === 0 // cụm 1 viên không đập được, không tính điểm
  && clusterScore(2) === 20 && clusterScore(3) === 45 && clusterScore(4) === 80
  && clusterScore(4) / 4 > clusterScore(2) / 2 // điểm trung bình mỗi viên tăng theo cụm
)));

console.log('— Đập cụm —');

check('cụm <2 viên: không đập được, bàn giữ nguyên', (() => {
  const grid = [['red', 'blue'], ['green', 'yellow']];
  const before = JSON.stringify(grid);
  const result = popAt(grid, COLORS.slice(0, 4), 0, 0, seeded());
  return result === null && JSON.stringify(grid) === before;
})());

check('đập cụm hợp lệ: các viên biến mất, phần chưa đập giữ nguyên vị trí, đỉnh cột được lấp đá mới', (() => {
  const grid = [
    ['blue', 'blue', 'blue'],
    ['red', 'red', 'green'],
    ['yellow', 'purple', 'green'],
  ];
  const result = popAt(grid, COLORS.slice(0, 5), 0, 0, seeded());
  const stillFull = grid.every((row) => row.every((cell) => cell != null));
  // chỉ hàng trên cùng (toàn "blue") bị đập — 2 hàng dưới không có khoảng trống bên dưới nên đứng yên,
  // chỉ hàng 0 (vừa trống) được lấp đá mới
  return result.popped === 3 && result.score === clusterScore(3) && stillFull
    && grid[1][0] === 'red' && grid[1][1] === 'red' && grid[1][2] === 'green'
    && grid[2][0] === 'yellow' && grid[2][1] === 'purple' && grid[2][2] === 'green';
})());

check('đập nhiều lần liên tiếp trừ đúng số nước đi + cộng dồn điểm', (() => {
  const g = makeLevel(0, seeded(5));
  let movesUsed = 0;
  let lastScore = 0;
  for (let r = 0; r < ROWS && movesUsed < 3; r++) {
    for (let c = 0; c < COLS && movesUsed < 3; c++) {
      const res = pop(g, r, c, seeded(r * 10 + c + 1));
      if (res) { movesUsed++; lastScore = g.score; }
    }
  }
  return movesUsed === 3 && g.movesLeft === 20 - 3 && g.score === lastScore && g.score > 0;
})());

check('bàn luôn còn nước đi sau mỗi lần đập (tự xào lại nếu bí)', (() => {
  const g = makeLevel(2, seeded(11));
  let guard = 0;
  while (!g.over && guard < 40) {
    let moved = false;
    for (let r = 0; r < ROWS && !moved; r++) {
      for (let c = 0; c < COLS && !moved; c++) {
        if (pop(g, r, c, seeded(guard * 7 + r * 3 + c))) moved = true;
      }
    }
    if (!g.over) {
      if (!hasValidMove(g.grid)) return false; // đáng lẽ phải tự xào lại, không được để bí bàn
    }
    guard++;
  }
  return true;
})());

console.log('— Kết thúc màn —');

check('vừa đủ điểm mục tiêu ngay sau 1 nước đập → thắng, dù còn nước đi', (() => {
  const g = makeLevel(0, seeded());
  g.score = g.goal - 1; // chỉ còn thiếu 1 điểm
  let result = null;
  outer:
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      result = pop(g, r, c, seeded(r * 10 + c));
      if (result) break outer;
    }
  }
  return result !== null && g.over === true && g.won === true && g.movesLeft === 19;
})());

check('hết nước đi mà chưa đủ điểm → thua', (() => {
  const g = makeLevel(0, seeded());
  g.movesLeft = 1;
  let popped = false;
  outer:
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (pop(g, r, c, seeded(r * 10 + c))) { popped = true; break outer; }
    }
  }
  return popped && g.over === true && g.won === false;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
