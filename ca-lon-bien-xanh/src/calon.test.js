// Unit test cho Cá Lớn Biển Xanh. Chạy: node src/calon.test.js

import {
  FIELD_W, FIELD_H, START_LIVES, MAX_STAGE, GROW_NEED, MAX_FISH_SIZE,
  radiusOf, playerSize, makeLevel, spawnFish, movePlayer, stepGame,
} from './calon.js';

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

/** Đặt 1 con cá đứng yên ngay trước miệng cá người chơi để test va chạm. */
function fishAt(game, size, dx = 0, dy = 0) {
  const f = {
    size, x: game.player.x + dx, baseY: game.player.y + dy, y: game.player.y + dy,
    vx: 0, wobblePhase: 0, wobbleAmp: 0,
  };
  game.fish.push(f);
  return f;
}

console.log('— Khởi tạo & sinh cá —');

check('màn 0: 3 mạng, cá người chơi cỡ 2 đứng giữa sân, chưa có cá AI', (() => {
  const g = makeLevel(0, seeded());
  return g.lives === START_LIVES && playerSize(g.player.stage) === 2
    && g.player.x === FIELD_W / 2 && g.fish.length === 0 && !g.over;
})());

check('màn cao hơn: cá dữ nhiều hơn, sinh cá dày hơn (có chặn trần/sàn)', (() => {
  const g0 = makeLevel(0, seeded());
  const g5 = makeLevel(5, seeded());
  const g99 = makeLevel(99, seeded());
  return g5.dangerChance > g0.dangerChance && g5.spawnEveryMs < g0.spawnEveryMs
    && g99.dangerChance <= 0.5 && g99.spawnEveryMs >= 450;
})());

check('cá sinh từ mép, bơi vào trong sân, cỡ hợp lệ 1–5, cá to bơi chậm hơn', (() => {
  const g = makeLevel(0, seeded(7));
  const speeds = { small: [], big: [] };
  for (let i = 0; i < 60; i++) {
    const f = spawnFish(g, seeded(i + 1));
    const r = radiusOf(f.size);
    const fromLeft = f.x < 0;
    if (f.size < 1 || f.size > MAX_FISH_SIZE) return false;
    if (fromLeft && f.vx <= 0) return false;
    if (!fromLeft && f.vx >= 0) return false;
    if (f.baseY < r || f.baseY > FIELD_H - r) return false;
    (f.size <= 2 ? speeds.small : speeds.big).push(Math.abs(f.vx));
  }
  const avg = (a) => a.reduce((x, y) => x + y, 0) / a.length;
  return avg(speeds.small) > avg(speeds.big);
})());

console.log('— Bơi theo ngón tay —');

check('bơi về phía điểm chạm, không vượt quá tốc độ tối đa', (() => {
  const g = makeLevel(0, seeded());
  const x0 = g.player.x;
  movePlayer(g, x0 + 500, g.player.y, 16.67);
  const moved = g.player.x - x0;
  return moved > 0 && moved <= 0.34 * 16.67 + 0.01;
})());

check('không bơi lọt ra ngoài mép sân (kẹp theo bán kính)', (() => {
  const g = makeLevel(0, seeded());
  for (let i = 0; i < 300; i++) movePlayer(g, -999, -999, 16.67);
  const r = radiusOf(playerSize(g.player.stage));
  return g.player.x === r && g.player.y === r;
})());

console.log('— Ăn & bị ăn —');

check('chạm cá NHỎ hơn → ăn: cá biến mất, đếm tăng, cộng điểm', (() => {
  const g = makeLevel(0, seeded());
  g.spawnTimer = -999999; // tắt sinh cá để test sạch
  fishAt(g, 1);
  const ev = stepGame(g, 16.67, seeded());
  return ev.ate === 1 && g.player.eaten === 1 && g.score === 10 && g.fish.length === 0;
})());

check('chạm cá BẰNG cỡ mình → bị cắn: mất 1 mạng + bất tử tạm thời', (() => {
  const g = makeLevel(0, seeded());
  g.spawnTimer = -999999;
  fishAt(g, playerSize(g.player.stage));
  const ev = stepGame(g, 16.67, seeded());
  return ev.hit === true && g.lives === START_LIVES - 1 && g.player.invincibleMs > 0;
})());

check('đang bất tử thì cá dữ không cắn thêm được', (() => {
  const g = makeLevel(0, seeded());
  g.spawnTimer = -999999;
  g.player.invincibleMs = 1000;
  fishAt(g, 5);
  const ev = stepGame(g, 16.67, seeded());
  return ev.hit === false && g.lives === START_LIVES;
})());

check('cá ở xa thì không có chuyện gì xảy ra', (() => {
  const g = makeLevel(0, seeded());
  g.spawnTimer = -999999;
  fishAt(g, 1, 300, 0);
  const ev = stepGame(g, 16.67, seeded());
  return ev.ate === 0 && g.fish.length === 1;
})());

console.log('— Lớn lên & thắng/thua —');

check('ăn đủ GROW_NEED[0] con → lên cấp, cỡ tăng, đếm reset', (() => {
  const g = makeLevel(0, seeded());
  g.spawnTimer = -999999;
  let grew = false;
  for (let i = 0; i < GROW_NEED[0]; i++) {
    fishAt(g, 1);
    const ev = stepGame(g, 16.67, seeded());
    grew = grew || ev.grew;
  }
  return grew && g.player.stage === 1 && playerSize(g.player.stage) === 3 && g.player.eaten === 0;
})());

check('lớn đủ 3 cấp → thắng màn', (() => {
  const g = makeLevel(0, seeded());
  g.spawnTimer = -999999;
  for (let stage = 0; stage < MAX_STAGE; stage++) {
    for (let i = 0; i < GROW_NEED[stage]; i++) {
      fishAt(g, 1);
      stepGame(g, 16.67, seeded());
    }
  }
  return g.over === true && g.won === true && g.player.stage === MAX_STAGE;
})());

check('mất hết 3 mạng → thua', (() => {
  const g = makeLevel(0, seeded());
  g.spawnTimer = -999999;
  for (let i = 0; i < START_LIVES; i++) {
    g.player.invincibleMs = 0;
    fishAt(g, 5);
    stepGame(g, 16.67, seeded());
    g.fish = [];
  }
  return g.over === true && g.won === false && g.lives === 0;
})());

console.log('— Dọn dẹp & kết thúc —');

check('cá bơi lọt hẳn qua mép đối diện thì bị dọn khỏi sân', (() => {
  const g = makeLevel(0, seeded());
  g.spawnTimer = -999999;
  g.fish.push({ size: 1, x: FIELD_W + 200, baseY: 300, y: 300, vx: 2, wobblePhase: 0, wobbleAmp: 0 });
  stepGame(g, 16.67, seeded());
  return g.fish.length === 0;
})());

check('game đã kết thúc thì stepGame không làm gì thêm', (() => {
  const g = makeLevel(0, seeded());
  g.over = true;
  fishAt(g, 1);
  const ev = stepGame(g, 16.67, seeded());
  return ev.ate === 0 && g.fish.length === 1;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
