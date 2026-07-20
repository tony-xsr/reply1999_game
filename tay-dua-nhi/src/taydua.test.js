// Unit test cho Tay Đua Nhí. Chạy: node src/taydua.test.js

import {
  LANES, ROAD_X, ROAD_W, CAR_H, PLAYER_Y, START_LIVES, BASE_SPEED, NITRO_SPEED,
  laneX, makeLevel, steer, steerTo, spawnTraffic, stepGame,
} from './taydua.js';

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

console.log('— Làn & lái —');

check('4 tâm làn nằm đều trong lòng đường', (() => {
  for (let i = 0; i < LANES; i++) {
    const x = laneX(i);
    if (x < ROAD_X || x > ROAD_X + ROAD_W) return false;
  }
  return laneX(0) < laneX(1) && laneX(2) < laneX(3);
})());

check('steer ±1 làn, kẹp trong 0..3', (() => {
  const g = makeLevel(0);
  steer(g, -1);
  steer(g, -1);
  const left = g.lane;
  for (let i = 0; i < 9; i++) steer(g, 1);
  return left === 0 && g.lane === LANES - 1;
})());

check('steerTo: chạm đâu chọn làn đó, kẹp trong biên đường', (() => {
  const g = makeLevel(0);
  steerTo(g, laneX(2));
  const mid = g.lane;
  steerTo(g, -999);
  const leftmost = g.lane;
  steerTo(g, 9999);
  return mid === 2 && leftmost === 0 && g.lane === LANES - 1;
})());

check('xe trườn mượt về tâm làn mới (lerp, không nhảy cóc)', (() => {
  const g = makeLevel(0);
  steer(g, 1); // làn 1 → 2
  const x0 = g.x;
  stepGame(g, 16.67, seeded());
  const moved1 = g.x;
  for (let i = 0; i < 60; i++) stepGame(g, 16.67, seeded());
  return moved1 > x0 && moved1 < laneX(2) && Math.abs(g.x - laneX(2)) < 1;
})());

console.log('— Sinh xe & vượt —');

check('mỗi lượt sinh tối đa 2 xe ở làn khác nhau (luôn còn ≥2 làn trống)', (() => {
  for (let s = 1; s < 40; s++) {
    const g = makeLevel(0);
    const lanes = spawnTraffic(g, seeded(s));
    if (lanes.length > 2 || new Set(lanes).size !== lanes.length) return false;
  }
  return true;
})());

check('chạy đường dài: xe tự sinh theo quãng đường, xe ra khỏi màn bị dọn', (() => {
  const g = makeLevel(0);
  for (let i = 0; i < 600; i++) {
    stepGame(g, 16.67, seeded(i + 1));
    g.invincibleMs = 99999; // bất tử để đo hệ thống sinh xe
  }
  return g.traffic.length > 0 && g.traffic.every((c) => c.y < 700 + CAR_H);
})());

check('vượt qua xe khác → +điểm, mỗi xe chỉ tính 1 lần', (() => {
  const g = makeLevel(0);
  g.lane = 0;
  g.x = laneX(0);
  g.traffic = [{ lane: 3, y: PLAYER_Y + CAR_H - 2, kind: 'car', color: 0, passed: false }];
  let overtakes = 0;
  for (let i = 0; i < 20; i++) overtakes += stepGame(g, 16.67, seeded()).overtake;
  return overtakes === 1 && g.score >= 5;
})());

console.log('— Va chạm & nitro —');

check('đâm xe cùng làn: mất 1 mạng + bất tử tạm + mất nitro', (() => {
  const g = makeLevel(0);
  g.nitroMs = 2000;
  g.traffic = [{ lane: 1, y: PLAYER_Y - 10, kind: 'car', color: 0, passed: false }];
  const ev = stepGame(g, 16.67, seeded());
  return ev.crash && g.lives === START_LIVES - 1 && g.invincibleMs > 0 && g.nitroMs === 0;
})());

check('đang bất tử thì xuyên qua xe không sao', (() => {
  const g = makeLevel(0);
  g.invincibleMs = 1500;
  g.traffic = [{ lane: 1, y: PLAYER_Y - 10, kind: 'car', color: 0, passed: false }];
  const ev = stepGame(g, 16.67, seeded());
  return ev.crash === false && g.lives === START_LIVES;
})());

check('khác làn thì không va chạm', (() => {
  const g = makeLevel(0);
  g.traffic = [{ lane: 3, y: PLAYER_Y, kind: 'car', color: 0, passed: false }];
  const ev = stepGame(g, 16.67, seeded());
  return ev.crash === false;
})());

check('nhặt nitro: tăng tốc NITRO_SPEED rồi hết giờ tự về tốc độ thường', (() => {
  const g = makeLevel(0);
  g.pickups = [{ lane: 1, y: PLAYER_Y, done: false }];
  const ev = stepGame(g, 16.67, seeded()); // nhặt nitro ở cuối bước này
  stepGame(g, 16.67, seeded()); // bước kế mới chạy bằng tốc độ nitro
  const fast = g.speed;
  for (let i = 0; i < 200; i++) { stepGame(g, 16.67, seeded()); g.traffic = []; }
  return ev.nitro && fast === NITRO_SPEED && g.speed === BASE_SPEED;
})());

console.log('— Vạch đích & thắng/thua —');

check('chạy đủ quãng đường: vạch đích ló ra, không sinh thêm xe, chạm vạch là THẮNG', (() => {
  const g = makeLevel(0);
  g.distance = g.target - 10;
  let sawFinish = false;
  let won = false;
  for (let i = 0; i < 400 && !won; i++) {
    const ev = stepGame(g, 16.67, seeded(i + 1));
    sawFinish = sawFinish || ev.finishVisible;
    won = ev.won;
    g.traffic = [];
  }
  return sawFinish && won && g.over && g.won && g.score >= 100 + START_LIVES * 30;
})());

check('màn cao hơn: quãng đường dài hơn, xe dày hơn', (() => {
  const g0 = makeLevel(0);
  const g5 = makeLevel(5);
  return g5.target > g0.target && g5.spawnGapPx < g0.spawnGapPx;
})());

check('đâm 3 lần → thua', (() => {
  const g = makeLevel(0);
  g.lives = 1;
  g.traffic = [{ lane: 1, y: PLAYER_Y - 10, kind: 'car', color: 0, passed: false }];
  stepGame(g, 16.67, seeded());
  return g.over === true && g.won === false;
})());

check('game kết thúc thì stepGame không làm gì', (() => {
  const g = makeLevel(0);
  g.over = true;
  const d0 = g.distance;
  stepGame(g, 16.67, seeded());
  return g.distance === d0;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
