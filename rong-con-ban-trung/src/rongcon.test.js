// Unit test cho Rồng Con Bắn Trứng. Chạy: node src/rongcon.test.js

import {
  COLS, R, ROW_H, FIELD_W, DEATH_ROW, SHOOTER_X, ADD_ROW_EVERY,
  rowCols, cellCenter, neighbors, makeLevel, tracePath, findSnapCell,
  popMatches, dropOrphans, addRow, fireShot,
} from './rongcon.js';

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

/** Game trống hoàn toàn để tự dựng lưới theo ý test. */
function emptyGame() {
  const g = makeLevel(0, seeded());
  g.grid = [];
  return g;
}

/** Đặt trứng thủ công (tự mở rộng lưới nếu cần). */
function put(game, r, c, color) {
  while (game.grid.length <= r) {
    game.grid.push(Array.from({ length: rowCols(game.grid.length, game.parity) }, () => null));
  }
  game.grid[r][c] = color;
}

console.log('— Hình học lưới lục giác —');

check('hàng đầy 10 ô, hàng lệch 9 ô, đổi vai khi parity đổi', (() => {
  return rowCols(0, 0) === COLS && rowCols(1, 0) === COLS - 1
    && rowCols(0, 1) === COLS - 1 && rowCols(1, 1) === COLS;
})());

check('tâm ô: hàng lệch dịch ngang đúng 1 bán kính, hàng dưới thấp hơn đúng ROW_H', (() => {
  const a = cellCenter(0, 0, 0);
  const b = cellCenter(1, 0, 0);
  return a.x === R && a.y === R && b.x === R * 2 && Math.abs(b.y - (R + ROW_H)) < 0.001;
})());

check('ô giữa lưới có đúng 6 ô kề, ô góc trần trái chỉ có 2 (phải + chéo dưới)', (() => {
  const g = emptyGame();
  put(g, 2, 4, 0); // chỉ để lưới đủ rộng
  return neighbors(g, 1, 4).length === 6 && neighbors(g, 0, 0).length === 2;
})());

console.log('— Khởi tạo màn —');

check('màn 0: 4 hàng trứng đầy, màu trong phạm vi, trứng sắp bắn lấy màu có trên lưới', (() => {
  const g = makeLevel(0, seeded());
  const colors = new Set(g.grid.flat());
  return g.grid.length === 4
    && g.grid.every((row, r) => row.length === rowCols(r, 0) && row.every((v) => v >= 0 && v < g.numColors))
    && colors.has(g.nextColor) && colors.has(g.queueColor);
})());

check('màn cao hơn: nhiều màu hơn, nhiều hàng hơn (có chặn trần)', (() => {
  const g4 = makeLevel(4, seeded());
  const g99 = makeLevel(99, seeded());
  return g4.numColors === 6 && g4.grid.length === 5 && g99.numColors === 6 && g99.grid.length === 6;
})());

console.log('— Đường bay —');

check('bắn thẳng lên giữa lưới trống: bay thẳng đứng tới trần, không lệch ngang', (() => {
  const g = emptyGame();
  const path = tracePath(g, 0);
  const end = path[path.length - 1];
  return end.y <= R + 0.001 && path.every((p) => Math.abs(p.x - SHOOTER_X) < 0.001);
})());

check('bắn xiên góc rộng: có nảy tường (chạm mép rồi đổi hướng), vẫn tới nơi', (() => {
  const g = emptyGame();
  const path = tracePath(g, 1.1);
  const maxX = Math.max(...path.map((p) => p.x));
  const end = path[path.length - 1];
  return maxX >= FIELD_W - R - 14 && end.y <= R + 0.001;
})());

check('có trứng chắn đường thì dừng ngay khi chạm trứng', (() => {
  const g = emptyGame();
  put(g, 0, 4, 0); // ngay trên đường bắn thẳng
  const path = tracePath(g, 0);
  const end = path[path.length - 1];
  return end.y > R + ROW_H * 0.5; // dừng sớm hơn hẳn so với trần
})());

console.log('— Dính ô & nổ cụm —');

check('trứng chạm trần lưới trống → dính vào hàng 0 gần điểm chạm', (() => {
  const g = emptyGame();
  const snap = findSnapCell(g, SHOOTER_X, R);
  return snap.r === 0 && (snap.c === 4 || snap.c === 5);
})());

check('ô trống lơ lửng (không kề trứng nào, không phải hàng trần) thì KHÔNG được chọn', (() => {
  const g = emptyGame();
  put(g, 0, 0, 0);
  const snap = findSnapCell(g, cellCenter(3, 4, 0).x, cellCenter(3, 4, 0).y);
  // gần (3,4) nhất nhưng (3,4) lơ lửng → phải chọn ô kề trứng (hàng 0/1) hoặc hàng trần
  return snap.r <= 1;
})());

check('cụm 3 cùng màu dính liền → nổ hết, cụm 2 thì không', (() => {
  const g = emptyGame();
  put(g, 0, 3, 1); put(g, 0, 4, 1); put(g, 1, 3, 1);
  const popped = popMatches(g, 0, 3);
  const g2 = emptyGame();
  put(g2, 0, 3, 2); put(g2, 0, 4, 2);
  const popped2 = popMatches(g2, 0, 3);
  return popped.length === 3 && g.grid[0][3] === null && g.grid[1][3] === null
    && popped2.length === 0 && g2.grid[0][3] === 2;
})());

check('trứng hở chân (mất đường nối về trần) → rơi; trứng còn nối thì ở lại', (() => {
  const g = emptyGame();
  put(g, 0, 0, 0); // nối trần
  put(g, 1, 0, 1); // treo dưới (0,0) — còn nối
  put(g, 3, 5, 2); // lơ lửng — phải rơi
  const dropped = dropOrphans(g);
  return dropped.length === 1 && dropped[0].r === 3 && g.grid[1][0] === 1 && g.grid[3][5] === null;
})());

console.log('— Bắn tích hợp —');

check('bắn thẳng vào hàng trứng cùng màu → dính, nổ cả cụm, lưới sạch → thắng', (() => {
  const g = emptyGame();
  for (let c = 0; c < COLS; c++) put(g, 0, c, 3);
  g.nextColor = 3;
  const result = fireShot(g, 0, seeded());
  return result.landed.r === 1 && result.popped.length === COLS + 1
    && g.over === true && g.won === true;
})());

check('bắn không nổ gì: trứng nằm lại lưới, đếm phát bắn tăng', (() => {
  const g = emptyGame();
  for (let c = 0; c < COLS; c++) put(g, 0, c, c % 4); // xen kẽ 4 màu, không cụm 3
  g.nextColor = 5;
  const result = fireShot(g, 0, seeded());
  return result.popped.length === 0 && g.grid[result.landed.r][result.landed.c] === 5
    && g.shotsSinceRow === 1 && !g.over;
})());

check('trần tụt sau đủ ADD_ROW_EVERY phát: thêm 1 hàng đỉnh, hàng cũ tụt xuống, parity đổi', (() => {
  const g = emptyGame();
  for (let c = 0; c < COLS; c++) put(g, 0, c, c % 4);
  const rowsBefore = g.grid.length;
  const marker = g.grid[0].join(',');
  g.shotsSinceRow = ADD_ROW_EVERY - 1;
  g.nextColor = 5;
  fireShot(g, 0.9, seeded()); // bắn xiên cho khỏi nổ
  return g.grid.length >= rowsBefore + 1 && g.parity === 1 && g.grid[1].join(',') === marker;
})());

check('addRow trực tiếp: hàng mới đúng độ dài theo parity mới', (() => {
  const g = emptyGame();
  put(g, 0, 0, 0);
  addRow(g, seeded());
  return g.parity === 1 && g.grid[0].length === rowCols(0, 1) && g.grid[1][0] === 0;
})());

check('trứng chạm vạch tử thần (hàng ≥ DEATH_ROW) → thua', (() => {
  const g = emptyGame();
  // chuỗi trứng nối từ trần xuống quá vạch, màu xen kẽ để không nổ
  for (let r = 0; r <= DEATH_ROW; r++) put(g, r, 0, r % 2);
  g.nextColor = 5;
  fireShot(g, 0, seeded());
  return g.over === true && g.won === false;
})());

check('game đã kết thúc thì fireShot không làm gì', (() => {
  const g = emptyGame();
  put(g, 0, 0, 0);
  g.over = true;
  return fireShot(g, 0, seeded()) === null;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
