// Unit test cho Gộp Số Vui. Chạy: node src/gopsovui.test.js

import {
  SIZE, spawnTile, slideGrid, hasMoves, makeGame, makeLevel, applyMove,
} from './gopsovui.js';

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

function countNonZero(grid) {
  return grid.flat().filter((v) => v !== 0).length;
}

console.log('— Khởi tạo —');

check('bàn 4×4, đúng 2 ô có số ban đầu (mỗi ô là 2 hoặc 4), điểm 0', (() => {
  const g = makeGame(2048, seeded());
  return g.grid.length === SIZE && g.grid[0].length === SIZE
    && countNonZero(g.grid) === 2
    && g.grid.flat().filter((v) => v !== 0).every((v) => v === 2 || v === 4)
    && g.score === 0 && !g.over;
})());

check('màn cao hơn có mục tiêu cao hơn, chặn trần ở 2048', (() => {
  const g0 = makeLevel(0, seeded());
  const g3 = makeLevel(3, seeded());
  const g99 = makeLevel(99, seeded());
  return g0.target === 64 && g3.target === 512 && g99.target === 2048;
})());

console.log('— Sinh ô mới —');

check('sinh đúng 1 ô mới vào đúng 1 ô trống, không đụng ô đã có số', (() => {
  const grid = [[2, 0, 4, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
  const before = countNonZero(grid);
  spawnTile(grid, seeded());
  return countNonZero(grid) === before + 1;
})());

check('bàn đã đầy kín thì không sinh thêm được nữa', (() => {
  const grid = Array.from({ length: 4 }, () => [2, 2, 2, 2]);
  const ok = spawnTile(grid, seeded());
  return ok === false;
})());

console.log('— Trượt & gộp —');

check('trượt trái: 2 ô cùng số [2,0,2,0] gộp thành [4,0,0,0], cộng đúng điểm', (() => {
  const grid = [[2, 0, 2, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
  const result = slideGrid(grid, 'left');
  return result.moved === true && result.gained === 4
    && result.grid[0].join(',') === '4,0,0,0';
})());

check('mỗi ô chỉ gộp 1 lần/lượt: [2,2,2,2] trượt trái → [4,4,0,0], KHÔNG dồn tiếp thành [8,0,0,0]', (() => {
  const grid = [[2, 2, 2, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
  const result = slideGrid(grid, 'left');
  return result.grid[0].join(',') === '4,4,0,0' && result.gained === 8;
})());

check('trượt phải đẩy đúng về phía bên phải', (() => {
  const grid = [[2, 0, 0, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
  const result = slideGrid(grid, 'right');
  return result.grid[0].join(',') === '0,0,0,4';
})());

check('trượt lên/xuống hoạt động đúng theo cột', (() => {
  const grid = [[2, 0, 0, 0], [0, 0, 0, 0], [2, 0, 0, 0], [0, 0, 0, 0]];
  const up = slideGrid(grid, 'up');
  const col0Up = up.grid.map((row) => row[0]).join(',');
  const down = slideGrid(grid, 'down');
  const col0Down = down.grid.map((row) => row[0]).join(',');
  return col0Up === '4,0,0,0' && col0Down === '0,0,0,4';
})());

check('bàn không thể trượt thêm theo hướng đó thì moved=false, bàn giữ nguyên', (() => {
  const grid = [[2, 4, 8, 16], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
  const result = slideGrid(grid, 'left'); // đã dồn hết sang trái, không còn gì để gộp/di chuyển
  return result.moved === false;
})());

console.log('— Còn nước đi không? —');

check('còn ô trống → còn nước đi', (() => {
  const grid = [[2, 4, 8, 0], [4, 2, 4, 2], [2, 4, 2, 4], [4, 2, 4, 2]];
  return hasMoves(grid) === true;
})());

check('bàn đầy nhưng còn 2 ô cạnh nhau cùng số → vẫn còn nước đi', (() => {
  const grid = [[2, 4, 8, 16], [4, 8, 16, 2], [8, 16, 2, 4], [16, 2, 4, 4]];
  return hasMoves(grid) === true;
})());

check('bàn đầy kín, không còn cặp nào giống nhau liền kề → hết nước đi', (() => {
  const grid = [
    [2, 4, 2, 4],
    [4, 2, 4, 2],
    [2, 4, 2, 4],
    [4, 2, 4, 2],
  ];
  return hasMoves(grid) === false;
})());

console.log('— Một nước đi đầy đủ (applyMove) —');

check('trượt hợp lệ: điểm cộng đúng, có thêm đúng 1 ô mới xuất hiện', (() => {
  const g = makeGame(2048, seeded());
  g.grid = [[2, 0, 2, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
  const before = countNonZero(g.grid);
  const result = applyMove(g, 'left', seeded(5));
  return result.moved === true && g.score === 4 && countNonZero(g.grid) === before - 1 + 1;
})());

check('trượt không hợp lệ (không đổi gì): không sinh ô mới, điểm không đổi', (() => {
  const g = makeGame(2048, seeded());
  g.grid = [[2, 4, 8, 16], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
  const before = JSON.stringify(g.grid);
  const result = applyMove(g, 'left', seeded());
  return result.moved === false && g.score === 0 && JSON.stringify(g.grid) === before;
})());

console.log('— Kết thúc màn —');

check('gộp ra đúng ô đạt mục tiêu → thắng ngay', (() => {
  const g = makeGame(8, seeded());
  g.grid = [[4, 4, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
  applyMove(g, 'left', seeded());
  return g.over === true && g.won === true;
})());

check('bàn đầy kín + hết nước đi → thua', (() => {
  const g = makeGame(2048, seeded());
  g.grid = [
    [2, 4, 2, 4],
    [4, 2, 4, 2],
    [2, 4, 2, 4],
    [4, 2, 4, 8],
  ];
  const result = applyMove(g, 'left', seeded());
  return result.moved === false && !hasMoves(g.grid);
})());

check('game đã kết thúc thì applyMove() không làm gì thêm', (() => {
  const g = makeGame(2048, seeded());
  g.over = true;
  g.won = false;
  const before = JSON.stringify(g.grid);
  const result = applyMove(g, 'left', seeded());
  return result.moved === false && result.gained === 0 && JSON.stringify(g.grid) === before;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
