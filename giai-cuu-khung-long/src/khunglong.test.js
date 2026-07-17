// Unit test cho Giải Cứu Khủng Long Con. Chạy: node src/khunglong.test.js

import {
  GROUND_Y, RUNNER_X, RUNNER_R, JUMP_V, START_LIVES, MIN_GAP, PIT_W,
  makeLevel, jump, stepGame,
} from './khunglong.js';

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

function stepN(g, n) {
  let evs = { hit: 0, fell: 0, saved: 0, won: false };
  for (let i = 0; i < n && !g.over; i++) {
    const ev = stepGame(g, 16.67);
    evs.hit += ev.hit ? 1 : 0;
    evs.fell += ev.fell ? 1 : 0;
    evs.saved += ev.saved;
    evs.won = evs.won || ev.won;
  }
  return evs;
}

console.log('— Dựng chặng đường —');

check('chặng CÔNG BẰNG: 2 chướng ngại liên tiếp cách nhau ≥ MIN_GAP, có ≥2 bé để cứu', (() => {
  for (const seed of [1, 7, 42, 99]) {
    const g = makeLevel(2, seeded(seed));
    const xs = g.items.map((it) => it.x).sort((a, b) => a - b);
    for (let i = 1; i < xs.length; i++) {
      if (xs[i] - xs[i - 1] < MIN_GAP - 1) return false;
    }
    if (g.items.filter((it) => it.type === 'baby').length < 2) return false;
  }
  return true;
})());

check('đoạn đầu chặng để trống lấy đà (không chướng ngại trước 700px)', (() => {
  const g = makeLevel(0, seeded());
  return g.items.every((it) => it.x >= 700);
})());

check('màn cao hơn: chặng dài hơn, chạy nhanh hơn', (() => {
  const g0 = makeLevel(0, seeded());
  const g3 = makeLevel(3, seeded());
  return g3.target > g0.target && g3.speed > g0.speed;
})());

console.log('— Chạy & nhảy —');

check('thế giới tự trôi, nhân vật đứng yên trên đất', (() => {
  const g = makeLevel(0, seeded());
  const d0 = g.dist;
  stepN(g, 30);
  return g.dist > d0 && g.grounded && g.y === GROUND_Y - RUNNER_R;
})());

check('chạm nhảy: vụt lên rồi đáp lại đất; đang bay thì không nhảy tiếp được', (() => {
  const g = makeLevel(0, seeded());
  stepN(g, 5);
  const ok = jump(g);
  const mid = jump(g); // double jump phải bị chặn
  if (!ok || mid || g.vy !== JUMP_V) return false;
  stepN(g, 80);
  return g.grounded === true;
})());

console.log('— Chướng ngại —');

check('đâm vào đá (chạy dưới đất) → mất 1 tim + bất tử tạm', (() => {
  const g = makeLevel(0, seeded());
  g.items = [{ type: 'rock', x: 900 }];
  const evs = stepN(g, 600);
  return evs.hit >= 1 && g.lives === START_LIVES - 1;
})());

check('nhảy qua đá đúng lúc thì không sao', (() => {
  const g = makeLevel(0, seeded());
  g.items = [{ type: 'rock', x: 900 }];
  let jumped = false;
  for (let i = 0; i < 600 && !g.over; i++) {
    // nhảy khi đá còn cách ~100px phía trước (canh giữa cú nhảy bay ngang qua đá)
    const gap = 900 - (g.dist + RUNNER_X);
    if (!jumped && gap < 100 && gap > 0) { jump(g); jumped = true; }
    const ev = stepGame(g, 16.67);
    if (ev.hit) return false;
    if (g.dist + RUNNER_X > 900 + 120) break;
  }
  return jumped && g.lives === START_LIVES;
})());

check('không nhảy qua hố → rơi xuống, mất tim, được đặt lại sau miệng hố', (() => {
  const g = makeLevel(0, seeded());
  g.items = [{ type: 'pit', x: 900 }];
  const evs = stepN(g, 700);
  return evs.fell >= 1 && g.lives === START_LIVES - 1
    && g.dist + RUNNER_X > 900 + PIT_W;
})());

check('nhảy qua hố đúng lúc thì bay qua an toàn', (() => {
  const g = makeLevel(0, seeded());
  g.items = [{ type: 'pit', x: 900 }];
  let jumped = false;
  for (let i = 0; i < 700 && !g.over; i++) {
    const gap = 900 - (g.dist + RUNNER_X);
    if (!jumped && gap < 90 && gap > 0) { jump(g); jumped = true; }
    const ev = stepGame(g, 16.67);
    if (ev.fell) return false;
    if (g.dist + RUNNER_X > 900 + PIT_W + 80) break;
  }
  return jumped && g.lives === START_LIVES;
})());

console.log('— Cứu bé & về tổ —');

check('chạy ngang bé khủng long → cứu được, cộng điểm, không cứu lại lần 2', (() => {
  const g = makeLevel(0, seeded());
  g.items = [{ type: 'baby', x: 900, saved: false }];
  const evs = stepN(g, 400);
  return evs.saved === 1 && g.saved === 1 && g.score === 30;
})());

check('về tới tổ → thắng + thưởng theo số bé cứu được và tim còn lại', (() => {
  const g = makeLevel(0, seeded());
  g.items = [];
  g.saved = 2;
  g.dist = g.target - RUNNER_X - 30;
  const evs = stepN(g, 30);
  return evs.won && g.over && g.won
    && g.score === 50 + 2 * 20 + START_LIVES * 15;
})());

check('mất hết 3 tim → thua', (() => {
  const g = makeLevel(0, seeded());
  g.items = [{ type: 'rock', x: 900 }, { type: 'rock', x: 1300 }, { type: 'rock', x: 1700 }];
  stepN(g, 3000);
  return g.over === true && g.won === false;
})());

check('game kết thúc thì jump/stepGame không làm gì', (() => {
  const g = makeLevel(0, seeded());
  g.over = true;
  const d0 = g.dist;
  const ok = jump(g);
  stepGame(g, 16.67);
  return ok === false && g.dist === d0;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
