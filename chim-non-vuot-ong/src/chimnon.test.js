// Unit test cho Chim Non Vượt Ống. Chạy: node src/chimnon.test.js

import {
  FIELD_W, FIELD_H, GROUND_H, BIRD_X, BIRD_R, GRAVITY, FLAP_V,
  PIPE_W, PIPE_SPACING, GAP_START, GAP_MIN, LETTER_EVERY,
  makeGame, gapFor, flap, stepGame,
} from './chimnon.js';

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

console.log('— Khởi tạo & chờ chạm —');

check('bắt đầu: chim lơ lửng, 1 ống chờ ngoài mép phải, chưa tính là started', (() => {
  const g = makeGame(seeded());
  return !g.started && !g.over && g.pipes.length === 1 && g.pipes[0].x >= FIELD_W && g.score === 0;
})());

check('chưa chạm lần nào thì stepGame không làm chim rơi', (() => {
  const g = makeGame(seeded());
  const y0 = g.bird.y;
  for (let i = 0; i < 60; i++) stepGame(g, 16.67, seeded());
  return g.bird.y === y0 && !g.over;
})());

console.log('— Vỗ cánh & trọng lực —');

check('chạm lần đầu: started, vy vụt lên đúng FLAP_V', (() => {
  const g = makeGame(seeded());
  const ok = flap(g);
  return ok && g.started && g.bird.vy === FLAP_V;
})());

check('trọng lực kéo dần: vy tăng mỗi khung, chim rơi xuống', (() => {
  const g = makeGame(seeded());
  flap(g);
  const vy0 = g.bird.vy;
  stepGame(g, 16.67, seeded());
  stepGame(g, 16.67, seeded());
  return Math.abs(g.bird.vy - (vy0 + GRAVITY * 2)) < 0.001;
})());

check('bay chạm trần: bị chặn lại chứ KHÔNG chết', (() => {
  const g = makeGame(seeded());
  flap(g);
  g.bird.y = BIRD_R + 1;
  g.bird.vy = -10;
  stepGame(g, 16.67, seeded());
  return g.bird.y === BIRD_R && g.bird.vy === 0 && !g.over;
})());

console.log('— Ống & tính điểm —');

check('khe hẹp dần theo điểm, có sàn tối thiểu', (() => {
  return gapFor(0) === GAP_START && gapFor(10) === GAP_START - 20 && gapFor(999) === GAP_MIN;
})());

check('ống mới sinh đúng khoảng cách PIPE_SPACING, ống cũ ra khỏi màn thì bị dọn', (() => {
  const g = makeGame(seeded());
  flap(g);
  for (let i = 0; i < 600; i++) {
    stepGame(g, 16.67, seeded(i + 1));
    // chỉ đo hệ thống ống — cho chim "bất tử" để chạy dài không dừng giữa chừng
    g.bird.y = 300; g.bird.vy = 0; g.over = false;
  }
  const xs = g.pipes.map((p) => p.x);
  const gaps = xs.slice(1).map((x, i2) => x - xs[i2]);
  return xs.length >= 2 && gaps.every((d) => Math.abs(d - PIPE_SPACING) < 0.001)
    && xs.every((x) => x > -PIPE_W - 20);
})());

check('bay lọt qua ống → +1 điểm, chỉ tính 1 lần', (() => {
  const g = makeGame(seeded());
  flap(g);
  g.pipes = [{ x: BIRD_X - BIRD_R - PIPE_W - 1, gapY: 300, gapH: 200, passed: false, letter: null }];
  const ev1 = stepGame(g, 16.67, seeded());
  g.bird.y = 300; g.bird.vy = 0;
  const ev2 = stepGame(g, 16.67, seeded());
  return ev1.passed === true && g.score === 1 && ev2.passed === false && g.score === 1;
})());

check('mỗi ống thứ 5 mang 1 chữ cái, qua ống thì báo chữ đó (A rồi B...)', (() => {
  const g = makeGame(seeded());
  // ống 1..4 không chữ; ống 5 = A, ống 10 = B
  const letters = [];
  for (let i = g.pipesMade; i < 10; i++) {
    g.pipes[g.pipes.length - 1].x = FIELD_W - PIPE_SPACING - 1; // ép sinh ống mới
    flap(g);
    stepGame(g, 16.67, seeded(i));
    g.bird.y = 300; g.bird.vy = 0;
  }
  for (const p of g.pipes) if (p.letter) letters.push([p.letter, g.pipes.indexOf(p)]);
  const withLetters = g.pipes.filter((p) => p.letter);
  return withLetters.length === 2 && withLetters[0].letter === 'A' && withLetters[1].letter === 'B';
})());

console.log('— Va chạm & thua —');

check('đâm vào thân ống (trên hoặc dưới khe) → thua ngay', (() => {
  const g = makeGame(seeded());
  flap(g);
  g.pipes = [{ x: BIRD_X - 10, gapY: 300, gapH: 160, passed: false, letter: null }];
  g.bird.y = 100; g.bird.vy = 0; // trên khe → trúng thân ống trên
  const ev = stepGame(g, 16.67, seeded());
  return ev.died === true && g.over === true;
})());

check('bay đúng giữa khe thì không sao', (() => {
  const g = makeGame(seeded());
  flap(g);
  g.pipes = [{ x: BIRD_X - 10, gapY: 300, gapH: 160, passed: false, letter: null }];
  g.bird.y = 300; g.bird.vy = 0;
  const ev = stepGame(g, 16.67, seeded());
  return ev.died === false && !g.over;
})());

check('rơi chạm đất → thua', (() => {
  const g = makeGame(seeded());
  flap(g);
  g.bird.y = FIELD_H - GROUND_H - BIRD_R - 1;
  g.bird.vy = 8;
  const ev = stepGame(g, 16.67, seeded());
  return ev.died === true && g.over === true && g.bird.y === FIELD_H - GROUND_H - BIRD_R;
})());

check('thua rồi thì flap/stepGame không làm gì nữa', (() => {
  const g = makeGame(seeded());
  g.over = true;
  const okFlap = flap(g);
  const ev = stepGame(g, 16.67, seeded());
  return okFlap === false && ev.passed === false && ev.died === false;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
