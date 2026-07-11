// Unit test cho Trò Xưa. Chạy: node src/troxua.test.js

import {
  RPS, rpsResult, rpsExplain, rpsAi,
  makeMarbleBoard, stepMarbles, RING_R,
  makeCans, throwBall, stepCans, TABLE_Y,
} from './troxua.js';

let passed = 0;
let failed = 0;

function check(name, cond) {
  if (cond) { passed++; console.log(`  ✅ ${name}`); }
  else { failed++; console.error(`  ❌ ${name}`); }
}

console.log('— Oẳn tù tì —');

check('luật khắc chế: búa>kéo, kéo>bao, bao>búa (và chiều ngược thua)', (() => {
  const wins = [['rock', 'scissors'], ['scissors', 'paper'], ['paper', 'rock']];
  return wins.every(([a, b]) => rpsResult(a, b) === 1 && rpsResult(b, a) === -1)
    && RPS.every((o) => rpsResult(o.id, o.id) === 0);
})());

check('giải thích đúng câu vè', rpsExplain('rock', 'scissors') === 'búa đập kéo'
  && rpsExplain('paper', 'rock') === 'bao bọc búa' && rpsExplain('scissors', 'paper') === 'kéo cắt bao');

check('máy ra đủ 3 loại', (() => {
  let seed = 1;
  const rng = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const seen = new Set(Array.from({ length: 60 }, () => rpsAi(rng)));
  return seen.size === 3;
})());

console.log('— Bắn bi —');

check('sân mới: 1 bi cái + 5 bi mục tiêu trong vòng, 3 lượt', (() => {
  const b = makeMarbleBoard(() => 0.5);
  return b.balls.length === 6 && b.shots === 3 && b.won === 0
    && b.balls.slice(1).every((ball) => Math.hypot(ball.x - 320, ball.y - 320) <= RING_R);
})());

check('ma sát làm bi dừng dần', (() => {
  const b = makeMarbleBoard(() => 0.5);
  b.balls[0].vx = 10;
  for (let i = 0; i < 600 && stepMarbles(b); i++);
  return b.balls[0].vx === 0 && b.balls[0].x > 320; // đã trôi về bên phải rồi dừng
})());

check('bắn thẳng vào bi mục tiêu → truyền đà, bi văng khỏi vòng được tính', (() => {
  const b = makeMarbleBoard(() => 0.5);
  b.balls = [
    { x: 320, y: 560, vx: 0, vy: -20, r: 19, player: true, out: false },
    { x: 320, y: 330, vx: 0, vy: 0, r: 16, player: false, out: false },
  ];
  for (let i = 0; i < 900 && stepMarbles(b); i++);
  return b.won === 1 && b.balls[1].out;
})());

console.log('— Ném lon —');

check('tháp 6 lon 3-2-1 trên bàn, 3 lượt ném', (() => {
  const s = makeCans();
  return s.cans.length === 6 && s.throws === 3
    && s.cans.every((can) => can.y <= TABLE_Y && !can.down);
})());

check('đạn bay parabol: đi tới + rơi dần', (() => {
  const ball = throwBall(15, 45);
  const s = makeCans();
  const y0 = ball.y;
  for (let i = 0; i < 10; i++) stepCans(s, ball);
  return ball.x > 60 && ball.vy > -15; // vy tăng dần vì trọng lực
})());

check('ném trúng tháp → có lon văng khỏi bàn', (() => {
  const s = makeCans();
  const ball = throwBall(20, 20);
  for (let i = 0; i < 1200 && stepCans(s, ball); i++);
  return s.knocked >= 1 && s.cans.filter((c) => c.down).length === s.knocked;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
