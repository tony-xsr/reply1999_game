// Unit test cho Đường Hầm Săn Vàng. Chạy: node src/duonghham.test.js

import {
  ROWS, COLS, START_LIVES, makeGrid, makeLevel, act, stepGravity,
} from './duonghham.js';

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

console.log('— Dựng hầm —');

check('bàn đúng kích thước, 2 hàng trên cùng luôn là cửa hầm trống', (() => {
  const g = makeGrid(ROWS, COLS, 0, seeded());
  return g.length === ROWS && g[0].length === COLS
    && g[0].every((cell) => cell.type === 'empty') && g[1].every((cell) => cell.type === 'empty');
})());

check('phần còn lại toàn đá, máu 1 (đá thường) hoặc 2 (tảng to)', (() => {
  const g = makeGrid(ROWS, COLS, 0, seeded());
  const rockRows = g.slice(2).flat();
  return rockRows.every((cell) => cell.type === 'rock' && (cell.hp === 1 || cell.hp === 2));
})());

check('màn 0: bé xuất phát ở cửa hầm, chưa có vàng, đủ 3 mạng, mục tiêu 120đ', (() => {
  const g = makeLevel(0, seeded());
  return g.grid[g.player.r][g.player.c].type === 'empty'
    && g.gold === 0 && g.lives === START_LIVES && g.goal === 120 && !g.over;
})());

check('màn cao hơn có mục tiêu cao hơn', (() => {
  const g10 = makeLevel(10, seeded());
  return g10.goal === 120 + 10 * 60;
})());

console.log('— Di chuyển / đập đá —');

check('đi ra ngoài biên hầm thì không có gì xảy ra', (() => {
  const g = makeLevel(0, seeded());
  g.player = { r: 0, c: 0 };
  const result = act(g, 'left');
  return result.type === 'none' && g.player.r === 0 && g.player.c === 0;
})());

check('bước vào ô trống thì di chuyển bình thường', (() => {
  const g = makeLevel(0, seeded());
  const result = act(g, 'right');
  return result.type === 'move' && g.player.c === Math.floor(COLS / 2) + 1;
})());

check('đập vỡ đá 1 máu: vỡ ngay, cộng vàng, bé bước vào ô vừa đập', (() => {
  const g = makeLevel(0, seeded());
  g.player = { r: 1, c: 3 };
  g.grid[2][3] = { type: 'rock', hp: 1, gold: 25 };
  const result = act(g, 'down');
  return result.broken === true && result.gold === 25 && g.gold === 25
    && g.player.r === 2 && g.player.c === 3 && g.grid[2][3].type === 'empty';
})());

check('đập tảng đá 2 máu: nhát đầu chưa vỡ (bé chưa bước vào), nhát 2 mới vỡ', (() => {
  const g = makeLevel(0, seeded());
  g.player = { r: 1, c: 3 };
  g.grid[2][3] = { type: 'rock', hp: 2, gold: 15 };
  const first = act(g, 'down');
  const stillOutside = g.player.r === 1 && g.grid[2][3].type === 'rock' && g.grid[2][3].hp === 1;
  const second = act(g, 'down');
  return first.broken === false && stillOutside
    && second.broken === true && g.gold === 15 && g.player.r === 2;
})());

console.log('— Trọng lực & né đá rơi —');

check('đá không có điểm tựa (dưới là ô trống) sẽ rơi xuống 1 ô mỗi nhịp', (() => {
  const g = makeLevel(0, seeded());
  // dọn sạch cả cột để cô lập tình huống — tránh đá ngẫu nhiên phía trên tự đổ xuống lấp lại
  // ngay trong cùng 1 nhịp (bàn thật cho phép hiệu ứng dây chuyền này, nhưng ở đây chỉ muốn
  // kiểm tra đúng 1 bước rơi đơn lẻ).
  for (let r = 2; r < g.rows; r++) g.grid[r][2] = { type: 'empty', hp: 0, gold: 0 };
  g.grid[3][2] = { type: 'rock', hp: 1, gold: 0 };
  const moved = stepGravity(g);
  return moved === true && g.grid[3][2].type === 'empty' && g.grid[4][2].type === 'rock';
})());

check('đá đã có điểm tựa (dưới là đá khác) thì đứng yên', (() => {
  const g = makeLevel(0, seeded());
  g.grid[3][2] = { type: 'rock', hp: 1, gold: 0 };
  g.grid[4][2] = { type: 'rock', hp: 1, gold: 0 };
  const moved = stepGravity(g);
  return moved === false && g.grid[3][2].type === 'rock' && g.grid[4][2].type === 'rock';
})());

check('đá rơi trúng đúng vị trí bé đang đứng: mất 1 mạng, đá vỡ tan không tính vàng, bé không bị đẩy đi', (() => {
  const g = makeLevel(0, seeded());
  g.player = { r: 4, c: 2 };
  g.grid[4][2] = { type: 'empty', hp: 0, gold: 0 };
  g.grid[3][2] = { type: 'rock', hp: 1, gold: 50 };
  const livesBefore = g.lives;
  const moved = stepGravity(g);
  return moved === true && g.lives === livesBefore - 1 && g.gold === 0
    && g.grid[4][2].type === 'empty' && g.player.r === 4 && g.player.c === 2;
})());

console.log('— Kết thúc màn —');

check('đủ vàng mục tiêu ngay sau khi đập đá → thắng', (() => {
  const g = makeLevel(0, seeded());
  g.gold = g.goal - 10;
  g.player = { r: 1, c: 3 };
  g.grid[2][3] = { type: 'rock', hp: 1, gold: 10 };
  act(g, 'down');
  return g.over === true && g.won === true;
})());

check('hết 3 mạng vì đá rơi trúng liên tục → thua', (() => {
  const g = makeLevel(0, seeded());
  g.player = { r: 5, c: 1 };
  for (let i = 0; i < START_LIVES; i++) {
    g.grid[5][1] = { type: 'empty', hp: 0, gold: 0 };
    g.grid[4][1] = { type: 'rock', hp: 1, gold: 0 };
    stepGravity(g);
  }
  return g.lives === 0 && g.over === true && g.won === false;
})());

check('game đã kết thúc thì act()/stepGravity() không làm gì thêm', (() => {
  const g = makeLevel(0, seeded());
  g.over = true;
  g.won = false;
  const before = JSON.stringify(g.grid);
  const beforePlayer = { ...g.player };
  act(g, 'down');
  const moved = stepGravity(g);
  return moved === false && JSON.stringify(g.grid) === before
    && g.player.r === beforePlayer.r && g.player.c === beforePlayer.c;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
