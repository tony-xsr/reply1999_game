// Unit test cho Nhà Thám Hiểm Tí Hon. Chạy: node src/thamhiem.test.js

import {
  TILE, START_LIVES, PLAYER_H, JUMP_V, COYOTE_MS, JUMP_BUFFER_MS, LEVELS,
  makeLevel, stepGame,
} from './thamhiem.js';

let passed = 0;
let failed = 0;

function check(name, cond) {
  if (cond) { passed++; console.log(`  ✅ ${name}`); }
  else { failed++; console.error(`  ❌ ${name}`); }
}

const IDLE = { left: false, right: false, jump: false };
const RIGHT = { left: false, right: true, jump: false };
const JUMP = { left: false, right: false, jump: true };

/** Màn thử tự dựng — không phụ thuộc thiết kế màn thật. */
function testLevel(rows) {
  const backup = LEVELS[0];
  LEVELS[0] = rows;
  const g = makeLevel(0);
  LEVELS[0] = backup;
  return g;
}

function stepN(g, input, n) {
  let last = null;
  for (let i = 0; i < n; i++) last = stepGame(g, input, 16.67);
  return last;
}

console.log('— Dựng màn —');

check('4 màn thật: có xuất phát, xu, cờ đích, đất; hàng đệm đều nhau', (() => {
  for (let i = 0; i < LEVELS.length; i++) {
    const g = makeLevel(i);
    const flat = g.tiles.flat();
    if (g.coinsTotal < 1 || !flat.includes('F') || !flat.includes('#')) return false;
    if (!g.tiles.every((row) => row.length === g.cols)) return false;
  }
  return true;
})());

check('quái tách khỏi lưới thành thực thể tuần tra', (() => {
  const g = makeLevel(0);
  return g.enemies.length >= 1 && !g.tiles.flat().includes('E');
})());

console.log('— Vật lý cơ bản —');

check('trọng lực kéo rơi rồi ĐÁP xuống đất, grounded = true', (() => {
  const g = testLevel(['S....', '.....', '#####']);
  stepN(g, IDLE, 60);
  return g.player.grounded === true
    && Math.abs((g.player.y + PLAYER_H / 2) - 2 * TILE) < 0.6;
})());

check('bấm nhảy khi đứng đất: vụt lên đúng JUMP_V rồi rơi lại', (() => {
  const g = testLevel(['S....', '.....', '#####']);
  stepN(g, IDLE, 60); // đáp đất
  const ev = stepGame(g, JUMP, 16.67);
  return ev.jumped === true && g.player.vy < JUMP_V + 1;
})());

check('đang lơ lửng giữa trời (quá coyote) thì bấm nhảy KHÔNG ăn', (() => {
  const g = testLevel(['S....', '.....', '.....', '.....', '.....', '.....', '#####']);
  // rơi tự do lâu hơn coyote
  stepN(g, IDLE, Math.ceil(COYOTE_MS / 16.67) + 3);
  const ev = stepGame(g, JUMP, 16.67);
  return ev.jumped === false;
})());

check('coyote-time: vừa bước hụt khỏi mép vẫn nhảy được trong 100ms', (() => {
  const g = testLevel(['S....', '#....', '.....', '.....', '.....']);
  stepN(g, IDLE, 30); // đáp lên ô đất
  // chạy sang phải tới ĐÚNG khung hình vừa hụt chân, rồi nhảy ngay khung kế
  let fell = false;
  for (let i = 0; i < 60 && !fell; i++) {
    stepGame(g, RIGHT, 16.67);
    fell = !g.player.grounded;
  }
  if (!fell) return false;
  const ev = stepGame(g, JUMP, 16.67); // trong cửa sổ coyote
  return ev.jumped === true;
})());

check('jump-buffer: bấm nhảy TRƯỚC khi chạm đất 1 chút → chạm đất là bật lên luôn', (() => {
  const g = testLevel(['S....', '.....', '.....', '#####']);
  // rơi; bấm nhảy khi còn cách đất một đoạn ngắn
  let jumped = false;
  let pressed = false;
  for (let i = 0; i < 60 && !jumped; i++) {
    const nearGround = (g.player.y + PLAYER_H / 2) > 3 * TILE - 24;
    const input = !pressed && nearGround && !g.player.grounded
      ? (pressed = true, JUMP) : IDLE;
    jumped = stepGame(g, input, 16.67).jumped;
  }
  return jumped === true;
})());

check('tường chặn ngang: chạy vào tường thì dừng sát mép', (() => {
  const g = testLevel(['S..#', '####']);
  stepN(g, RIGHT, 90);
  return g.player.x <= 3 * TILE - 22 / 2 + 0.001 && Math.abs(g.player.vx) < 3;
})());

console.log('— Xu & cờ —');

check('chạy qua xu: nhặt, đếm tăng, ô thành trống', (() => {
  const g = testLevel(['S.c..', '#####']);
  let got = false;
  for (let i = 0; i < 90 && !got; i++) got = stepGame(g, RIGHT, 16.67).coin;
  return got && g.coinsGot === 1 && !g.tiles.flat().includes('c');
})());

check('chạm cờ → thắng màn + điểm thưởng theo mạng còn lại', (() => {
  const g = testLevel(['S..F.', '#####']);
  let won = false;
  for (let i = 0; i < 120 && !won; i++) won = stepGame(g, RIGHT, 16.67).won;
  return won && g.over && g.won && g.score === 50 + START_LIVES * 20;
})());

console.log('— Quái —');

check('quái tuần tra quay đầu ở mép vực (không bước hụt)', (() => {
  const g = testLevel(['S........E...', '....##########']);
  const e = g.enemies[0];
  let minX = e.x;
  let maxX = e.x;
  for (let i = 0; i < 700; i++) {
    stepGame(g, IDLE, 16.67);
    g.player.x = 40; g.player.y = 8; g.player.vy = 0; // giữ người chơi tránh xa
    minX = Math.min(minX, e.x);
    maxX = Math.max(maxX, e.x);
  }
  // quái phải còn trên nền của nó (cột 4..13), không rơi khỏi mép trái
  return minX > 4 * TILE && maxX < 14 * TILE && !e.dead;
})());

check('dậm đầu quái từ trên xuống → quái chết, người chơi nảy lên, +điểm', (() => {
  const g = testLevel(['S.........', '..........', '.....E....', '##########']);
  // thả người chơi rơi thẳng xuống đầu quái
  g.player.x = g.enemies[0].x;
  g.player.y = g.enemies[0].y - 60;
  g.player.vy = 4;
  let stomped = false;
  for (let i = 0; i < 30 && !stomped; i++) stomped = stepGame(g, IDLE, 16.67).stomp;
  return stomped && g.enemies[0].dead === true && g.player.vy < 0 && g.score === 30;
})());

check('đụng quái ngang hông → mất mạng, về điểm xuất phát', (() => {
  const g = testLevel(['S...E.....', '##########']);
  let hurt = false;
  for (let i = 0; i < 200 && !hurt; i++) hurt = stepGame(g, RIGHT, 16.67).hurt;
  return hurt && g.lives === START_LIVES - 1
    && Math.abs(g.player.x - g.spawn.x) < 0.001;
})());

console.log('— Hố & thua —');

check('rơi lọt hố → mất mạng như đụng quái', (() => {
  const g = testLevel(['S..', '#..']);
  let hurt = false;
  for (let i = 0; i < 400 && !hurt; i++) hurt = stepGame(g, RIGHT, 16.67).hurt;
  return hurt && g.lives === START_LIVES - 1;
})());

check('mất hết 3 mạng → thua', (() => {
  const g = testLevel(['S..', '#..']);
  for (let i = 0; i < 3000 && !g.over; i++) stepGame(g, RIGHT, 16.67);
  return g.over === true && g.won === false && g.lives === 0;
})());

check('game kết thúc thì stepGame không làm gì', (() => {
  const g = testLevel(['S..', '###']);
  g.over = true;
  const x0 = g.player.x;
  stepGame(g, RIGHT, 16.67);
  return g.player.x === x0;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
