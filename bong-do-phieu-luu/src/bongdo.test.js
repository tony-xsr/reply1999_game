// Unit test cho Bóng Đỏ Phiêu Lưu. Chạy: node src/bongdo.test.js

import {
  TILE, START_LIVES, R_SMALL, R_BIG, BOUNCE_SMALL, BOUNCE_BIG, GRAVITY, MAX_VX, LEVELS,
  radiusOf, bounceOf, makeLevel, stepGame,
} from './bongdo.js';

let passed = 0;
let failed = 0;

function check(name, cond) {
  if (cond) { passed++; console.log(`  ✅ ${name}`); }
  else { failed++; console.error(`  ❌ ${name}`); }
}

const NOOP = { left: false, right: false };
const RIGHT = { left: false, right: true };
const LEFT = { left: true, right: false };

/** Màn thử nhỏ gọn tự dựng để test từng luật — không phụ thuộc thiết kế màn thật. */
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

console.log('— Dựng màn từ bản đồ ký tự —');

check('4 màn thật: đều có điểm xuất phát, có vòng để nhặt, có cờ đích, có đất', (() => {
  for (let i = 0; i < LEVELS.length; i++) {
    const g = makeLevel(i);
    const flat = g.tiles.flat();
    if (g.ringsTotal < 1 || !flat.includes('F') || !flat.includes('#')) return false;
    if (g.ball.x <= 0 || g.ball.y <= 0) return false;
  }
  return true;
})());

check('hàng ngắn được đệm cho đủ chiều rộng, mọi hàng bằng nhau', (() => {
  const g = makeLevel(0);
  return g.tiles.every((row) => row.length === g.cols);
})());

check('bóng khởi đầu nhỏ, 3 mạng, chưa kết thúc', (() => {
  const g = makeLevel(0);
  return !g.ball.big && radiusOf(g.ball) === R_SMALL && g.lives === START_LIVES && !g.over;
})());

console.log('— Vật lý nảy —');

check('thả rơi xuống đất: chạm đất thì TỰ nảy lên đúng lực nảy bóng nhỏ', (() => {
  const g = testLevel(['S', '', '', '', '#']);
  let bounced = false;
  for (let i = 0; i < 120 && !bounced; i++) bounced = stepGame(g, NOOP, 16.67).bounced;
  return bounced && g.ball.vy === -BOUNCE_SMALL;
})());

check('bóng to nảy cao hơn bóng nhỏ', BOUNCE_BIG > BOUNCE_SMALL && R_BIG > R_SMALL);

check('trọng lực kéo vy tăng dần khi đang bay', (() => {
  const g = testLevel(['S', '', '', '', '', '', '', '', '#']);
  const vy0 = g.ball.vy;
  stepGame(g, NOOP, 16.67);
  return Math.abs(g.ball.vy - (vy0 + GRAVITY)) < 0.001;
})());

check('chạm trần khi bay lên → dội nhẹ xuống, không kẹt', (() => {
  const g = testLevel(['####', 'S...', '####']);
  g.ball.vy = -8;
  stepGame(g, NOOP, 16.67);
  return g.ball.vy === 1 && g.ball.y >= TILE + R_SMALL;
})());

console.log('— Lái trái/phải —');

check('giữ phải: vx tăng dần, có trần tốc độ; thả tay thì chậm dần', (() => {
  const g = testLevel(['S.........', '##########']);
  stepN(g, RIGHT, 60);
  const atMax = Math.abs(g.ball.vx - MAX_VX) < 0.001;
  const vBefore = g.ball.vx;
  stepN(g, NOOP, 30);
  return atMax && g.ball.vx < vBefore;
})());

check('đâm vào tường: dừng sát mép, vx = 0', (() => {
  const g = testLevel(['S..#', '####']);
  stepN(g, RIGHT, 90);
  return g.ball.vx === 0 && g.ball.x <= 3 * TILE - R_SMALL + 0.001;
})());

console.log('— Vật phẩm —');

check('lăn qua vòng: nhặt được, đếm giảm, ô thành trống, cộng điểm', (() => {
  const g = testLevel(['S.o', '###']);
  const before = g.ringsLeft;
  let got = false;
  for (let i = 0; i < 200 && !got; i++) got = stepGame(g, RIGHT, 16.67).ring;
  return got && g.ringsLeft === before - 1 && !g.tiles.flat().includes('o') && g.score === 10;
})());

check('chạm "+" phồng to, chạm "-" xì nhỏ', (() => {
  // phòng cao 2 ô (64px) để bóng to (40px) vẫn lăn tiếp được sau khi phồng
  const g = testLevel(['......', 'S.+.-.', '######']);
  let grew = false;
  let shrank = false;
  for (let i = 0; i < 400 && !shrank; i++) {
    const ev = stepGame(g, RIGHT, 16.67);
    grew = grew || ev.grew;
    shrank = shrank || ev.shrank;
  }
  return grew && shrank && !g.ball.big;
})());

check('đường hầm cao 1 ô: bóng nhỏ chui lọt, bóng TO bị kẹt không đi tiếp được', (() => {
  const rows = ['######', 'S.....', '######'];
  const small = testLevel(rows);
  stepN(small, RIGHT, 400);
  const smallThrough = small.ball.x > 4 * TILE;
  const big = testLevel(rows);
  big.ball.big = true;
  stepN(big, RIGHT, 400);
  const bigStuck = big.ball.x < 2 * TILE;
  return smallThrough && bigStuck;
})());

console.log('— Gai, hố & mạng —');

check('chạm gai: mất 1 mạng, về điểm xuất phát, vòng đã nhặt vẫn giữ', (() => {
  const g = testLevel(['S.o.^', '#####']);
  let hurt = false;
  for (let i = 0; i < 400 && !hurt; i++) hurt = stepGame(g, RIGHT, 16.67).hurt;
  return hurt && g.lives === START_LIVES - 1
    && Math.abs(g.ball.x - g.spawn.x) < 0.001 && g.ringsLeft === g.ringsTotal - 1;
})());

check('rơi lọt hố (thủng đáy màn) → mất mạng như chạm gai', (() => {
  const g = testLevel(['S..', '#..']);
  let hurt = false;
  for (let i = 0; i < 600 && !hurt; i++) hurt = stepGame(g, RIGHT, 16.67).hurt;
  return hurt && g.lives === START_LIVES - 1;
})());

check('mất hết 3 mạng → thua', (() => {
  const g = testLevel(['S^', '##']);
  for (let i = 0; i < 2000 && !g.over; i++) stepGame(g, RIGHT, 16.67);
  return g.over === true && g.won === false && g.lives === 0;
})());

console.log('— Cờ đích —');

check('chạm cờ khi CHƯA nhặt đủ vòng: chưa qua màn', (() => {
  const g = testLevel(['S.F.o', '#####']);
  stepN(g, RIGHT, 60); // tới cờ trước khi tới vòng
  return g.over === false && g.won === false;
})());

check('nhặt đủ vòng rồi chạm cờ → thắng màn + điểm thưởng', (() => {
  const g = testLevel(['S.o.F', '#####']);
  let won = false;
  for (let i = 0; i < 400 && !won; i++) won = stepGame(g, RIGHT, 16.67).won;
  return won && g.over && g.won && g.score === 60;
})());

check('game đã kết thúc thì stepGame không làm gì', (() => {
  const g = testLevel(['S.', '##']);
  g.over = true;
  const x0 = g.ball.x;
  const ev = stepGame(g, RIGHT, 16.67);
  return ev.ring === false && g.ball.x === x0;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
