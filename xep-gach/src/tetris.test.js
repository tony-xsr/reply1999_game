// Unit test cho logic Xếp Gạch. Chạy: node src/tetris.test.js

import { createGame, tick, move, rotate, hardDrop, collides, PIECES, COLS, ROWS } from './tetris.js';

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

console.log('— Xếp Gạch —');

check('7 khối, mỗi khối đúng 4 ô', Object.values(PIECES).every((p) => p.cells.length === 4));

check('tick: khối rơi xuống 1 hàng', (() => {
  const g = createGame(rng(1));
  const y0 = g.cur.y;
  return tick(g) === 'move' && g.cur.y === y0 + 1;
})());

check('move: chặn ở tường trái/phải', (() => {
  const g = createGame(rng(1));
  let guard = 60;
  while (move(g, -1) && guard-- > 0); // đẩy sát trái
  const atWall = g.cur.cells.some(([cx]) => g.cur.x + cx === 0);
  return atWall && !move(g, -1);
})());

check('rotate: xoay giữ nguyên 4 ô, khối O đứng yên', (() => {
  const g = createGame(rng(2));
  const name0 = g.cur.name;
  const before = JSON.stringify(g.cur.cells);
  rotate(g);
  if (g.cur.cells.length !== 4) return false;
  return name0 === 'O' ? JSON.stringify(g.cur.cells) === before : true;
})());

check('hardDrop: khối khóa vào bàn, sinh khối mới', (() => {
  const g = createGame(rng(3));
  const r = hardDrop(g);
  const filled = g.grid.flat().filter(Boolean).length;
  return r.locked && filled === 4 && g.cur !== null;
})());

check('nổ dòng: hàng đầy biến mất + cộng điểm dòng', (() => {
  const g = createGame(rng(4));
  // Lấp kín hàng cuối trừ 1 khe dọc cho khối I đứng... đơn giản hơn:
  // lấp hàng cuối trừ 4 ô cuối, rồi đặt khối I nằm ngang rơi xuống đúng khe
  for (let x = 0; x < COLS - 4; x++) g.grid[ROWS - 1][x] = '#000';
  g.cur = { name: 'I', cells: PIECES.I.cells.map((c) => [...c]), color: '#0ff', x: COLS - 3, y: 0 };
  const r = hardDrop(g);
  return r.cleared === 1 && g.lines === 1 && g.grid[ROWS - 1].every((c) => !c === false || true)
    && g.grid.flat().filter(Boolean).length === 0 && g.score === 110;
})());

check('game over: chồng đầy cột giữa', (() => {
  const g = createGame(rng(5));
  for (let y = 0; y < ROWS; y++) for (let x = 3; x <= 6; x++) g.grid[y][x] = '#000';
  return hardDrop(g) === 'over' && g.over;
})());

check('collides: khối ngoài biên là va chạm', collides(
  Array.from({ length: ROWS }, () => Array(COLS).fill(null)),
  PIECES.I.cells, -1, 0,
));

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
