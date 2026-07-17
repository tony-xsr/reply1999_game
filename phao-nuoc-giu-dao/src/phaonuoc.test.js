// Unit test cho Pháo Nước Giữ Đảo. Chạy: node src/phaonuoc.test.js

import {
  CX, CY, R_ISLAND, SPAWN_R, CASTLE_HP, MAX_AMMO, RELOAD_MS, SPLASH_R,
  ENEMY_TYPES, wavesFor, makeLevel, spawnEnemy, fire, reload, stepGame,
} from './phaonuoc.js';

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

function stepN(g, n, rng) {
  for (let i = 0; i < n; i++) stepGame(g, 16.67, rng || seeded(i + 1));
}

console.log('— Đợt sóng —');

check('màn cao hơn: nhiều đợt hơn, mỗi đợt đông hơn, ra quân dày hơn (có sàn)', (() => {
  const w0 = wavesFor(0);
  const w4 = wavesFor(4);
  return w4.length > w0.length && w4[0].boats > w0[0].boats
    && w4[w4.length - 1].spawnEveryMs >= 450
    && w0[0].robots === 0; // đợt đầu màn đầu chỉ có thuyền giấy cho bé làm quen
})());

check('địch sinh ở rìa ngoài, đủ máu theo loại, robot to lì đòn nhất', (() => {
  const g = makeLevel(0, seeded());
  const e = spawnEnemy(g, 'bigbot', seeded());
  return Math.abs(Math.hypot(e.x - CX, e.y - CY) - SPAWN_R) < 1
    && e.hp === ENEMY_TYPES.bigbot.hp
    && ENEMY_TYPES.bigbot.hp > ENEMY_TYPES.robot.hp && ENEMY_TYPES.robot.hp > ENEMY_TYPES.boat.hp;
})());

check('chạy dài: địch tự sinh theo nhịp và bơi DẦN vào đảo', (() => {
  const g = makeLevel(0, seeded());
  stepN(g, 120);
  if (g.enemies.length === 0) return false;
  const d0 = g.enemies.map((e) => Math.hypot(e.x - CX, e.y - CY));
  stepN(g, 60);
  return g.enemies.every((e, i) => i >= d0.length || Math.hypot(e.x - CX, e.y - CY) < d0[i]);
})());

console.log('— Pháo nước & nạp đạn —');

check('bắn: trừ 1 nước, pháo quay theo hướng chạm, có nhịp hồi giữa 2 phát', (() => {
  const g = makeLevel(0, seeded());
  const ok = fire(g, 500, 320);
  const blocked = fire(g, 500, 320); // còn cooldown
  return ok && g.ammo === MAX_AMMO - 1 && g.shots.length === 1
    && Math.abs(g.aimAngle) < 0.3 && blocked === false;
})());

check('chạm quá sát pháo thì không bắn (không tự xịt vào mình)', (() => {
  const g = makeLevel(0, seeded());
  return fire(g, CX + 10, CY + 10) === false && g.ammo === MAX_AMMO;
})());

check('hết nước thì không bắn được; NẠP xong đầy bình lại', (() => {
  const g = makeLevel(0, seeded());
  g.ammo = 0;
  const cant = fire(g, 500, 320);
  reload(g);
  const duringReload = fire(g, 500, 320); // đang nạp cũng không bắn được
  let reloaded = false;
  for (let i = 0; i < Math.ceil(RELOAD_MS / 16.67) + 2; i++) {
    reloaded = reloaded || stepGame(g, 16.67, seeded()).reloaded;
  }
  return cant === false && duringReload === false && reloaded && g.ammo === MAX_AMMO;
})());

check('bình đang đầy thì nút nạp không làm gì', (() => {
  const g = makeLevel(0, seeded());
  return reload(g) === false && g.reloadingMs === 0;
})());

console.log('— Bóng nước TÙM & kẹo văng —');

check('bóng nước bay tới điểm chạm rồi TÙM: địch trong vùng nước dính, ngoài vùng không', (() => {
  const g = makeLevel(0, seeded());
  g.spawnQueue = []; g._waveLoaded = true; // tắt sinh thêm
  g.enemies = [
    { type: 'boat', x: 500, y: 320, hp: 1, speed: 0, wobble: 0 },
    { type: 'boat', x: 500 + SPLASH_R + 30, y: 320, hp: 1, speed: 0, wobble: 0 },
  ];
  fire(g, 500, 320);
  let killed = 0;
  for (let i = 0; i < 60; i++) killed += stepGame(g, 16.67, seeded()).killed;
  return killed === 1 && g.enemies.length === 1 && g.score === ENEMY_TYPES.boat.score;
})());

check('robot 2 máu: ướt 1 lần chưa gục, lần 2 mới bung kẹo', (() => {
  const g = makeLevel(0, seeded());
  g.spawnQueue = []; g._waveLoaded = true;
  g.enemies = [{ type: 'robot', x: 500, y: 320, hp: 2, speed: 0, wobble: 0 }];
  fire(g, 500, 320);
  stepN(g, 60);
  const survived = g.enemies.length === 1 && g.enemies[0].hp === 1;
  g.cooldownMs = 0;
  fire(g, 500, 320);
  stepN(g, 60);
  return survived && g.enemies.length === 0;
})());

console.log('— Lâu đài cát & thắng/thua —');

check('địch lọt vào bãi cát → lâu đài mất 1 tim, địch biến mất', (() => {
  const g = makeLevel(0, seeded());
  g.spawnQueue = []; g._waveLoaded = true;
  g.enemies = [{ type: 'boat', x: CX + R_ISLAND + 4, y: CY, hp: 1, speed: 3, wobble: 0 }];
  let hit = false;
  for (let i = 0; i < 30 && !hit; i++) hit = stepGame(g, 16.67, seeded()).castleHit;
  return hit && g.castleHp === CASTLE_HP - 1 && g.enemies.length === 0;
})());

check('lâu đài 0 tim → thua', (() => {
  const g = makeLevel(0, seeded());
  g.spawnQueue = []; g._waveLoaded = true;
  g.castleHp = 1;
  g.enemies = [{ type: 'boat', x: CX + R_ISLAND + 4, y: CY, hp: 1, speed: 3, wobble: 0 }];
  stepN(g, 30);
  return g.over === true && g.won === false;
})());

check('dọn sạch đợt → nghỉ 2 giây rồi đợt kế báo waveStart', (() => {
  const g = makeLevel(0, seeded());
  g.spawnQueue = []; g._waveLoaded = true; g.enemies = [];
  stepGame(g, 16.67, seeded()); // phát hiện sạch đợt → chuyển waveIndex + đặt nghỉ
  const paused = g.waveIndex === 1 && g.wavePauseMs > 0;
  let started = false;
  for (let i = 0; i < 150 && !started; i++) started = stepGame(g, 16.67, seeded()).waveStart;
  return paused && started && g.spawnQueue.length > 0;
})());

check('dọn sạch đợt CUỐI → thắng + thưởng theo tim lâu đài', (() => {
  const g = makeLevel(0, seeded());
  g.waveIndex = g.waves.length - 1;
  g.spawnQueue = []; g._waveLoaded = true; g.enemies = [];
  stepGame(g, 16.67, seeded());
  return g.over === true && g.won === true && g.score === 50 + CASTLE_HP * 30;
})());

check('game kết thúc thì fire/reload/stepGame không làm gì', (() => {
  const g = makeLevel(0, seeded());
  g.over = true;
  const ev = stepGame(g, 16.67, seeded());
  return fire(g, 500, 320) === false && reload(g) === false && ev.killed === 0;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
