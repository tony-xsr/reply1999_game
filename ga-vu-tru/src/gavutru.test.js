// Unit test cho Gà Vũ Trụ Xâm Lăng. Chạy: node src/gavutru.test.js

import {
  FIELD_W, PLANE_Y, PLANE_R, START_LIVES, MAX_WEAPON, SWAY_AMP,
  formationFor, slotPos, makeLevel, movePlane, stepGame,
} from './gavutru.js';

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

console.log('— Đội hình —');

check('màn cao hơn: đội hình đông hơn, trứng dày hơn, trùm trâu hơn (có trần)', (() => {
  const f0 = formationFor(0);
  const f6 = formationFor(6);
  const f99 = formationFor(99);
  return f6.cols > f0.cols && f6.eggEveryMs < f0.eggEveryMs && f6.bossHp > f0.bossHp
    && f99.cols === 8 && f99.rows === 4 && f99.eggEveryMs >= 500;
})());

check('slot đội hình căn giữa, không tràn mép sân (kể cả khi lắc hết biên)', (() => {
  for (const lv of [0, 3, 9]) {
    const f = formationFor(lv);
    for (let i = 0; i < f.cols * f.rows; i++) {
      const p = slotPos(f, i);
      if (p.x - SWAY_AMP < 20 || p.x + SWAY_AMP > FIELD_W - 20) return false;
    }
  }
  return true;
})());

check('gà xuất phát từ ngoài 2 mép, chưa vào đội hình', (() => {
  const g = makeLevel(0, seeded());
  return g.enemies.every((e) => !e.entered && (e.x < 0 || e.x > FIELD_W));
})());

check('sau 1 lúc: cả đàn bay VÀO đúng slot rồi lắc lư quanh slot', (() => {
  const g = makeLevel(0, seeded());
  stepN(g, 300);
  return g.enemies.every((e) => e.entered)
    && g.enemies.every((e) => Math.abs(e.x - e.slot.x) <= SWAY_AMP + 1);
})());

console.log('— Bắn & nâng cấp —');

check('súng tự bắn theo nhịp; cấp 1 mỗi loạt 1 viên', (() => {
  const g = makeLevel(0, seeded());
  stepGame(g, 16.67, seeded());
  return g.bullets.length === 1 && g.bullets[0].x === g.plane.x;
})());

check('nhặt sao: súng lên cấp (tối đa 3 nòng), loạt bắn nhiều viên hơn', (() => {
  const g = makeLevel(0, seeded());
  g.weapon = 2;
  g.stars = [{ x: g.plane.x, y: PLANE_Y }];
  const ev = stepGame(g, 16.67, seeded());
  const g2 = makeLevel(0, seeded());
  g2.weapon = MAX_WEAPON;
  g2.fireTimer = 0;
  g2.bullets = [];
  stepGame(g2, 16.67, seeded());
  return ev.star && g.weapon === 3 && g2.bullets.length === 3;
})());

check('đạn hạ gà: gà biến mất, cộng điểm; hàng đầu 2 máu phải bắn 2 phát', (() => {
  const g = makeLevel(0, seeded());
  stepN(g, 300); // đợi vào đội hình
  const front = g.enemies.find((e) => e.hp === 2);
  if (!front) return false;
  g.bullets = [{ x: front.x, y: front.y }];
  stepGame(g, 16.67, seeded());
  if (g.enemies.indexOf(front) === -1) return false; // mới 1 phát chưa chết
  g.bullets = [{ x: front.slot.x + Math.sin(g.swayT * 1.5) * 0, y: front.y }];
  g.bullets[0].x = front.x;
  const before = g.enemies.length;
  stepGame(g, 16.67, seeded());
  return g.enemies.length === before - 1 && g.score >= 15;
})());

console.log('— Trứng & mạng —');

check('trứng rơi trúng máy bay: mất 1 mạng + bất tử tạm + tụt 1 cấp súng', (() => {
  const g = makeLevel(0, seeded());
  g.weapon = 3;
  g.eggs = [{ x: g.plane.x, y: PLANE_Y - 2 }];
  const ev = stepGame(g, 16.67, seeded());
  return ev.hit && g.lives === START_LIVES - 1 && g.invincibleMs > 0 && g.weapon === 2;
})());

check('đang bất tử thì trứng xuyên qua không sao', (() => {
  const g = makeLevel(0, seeded());
  g.invincibleMs = 1000;
  g.eggs = [{ x: g.plane.x, y: PLANE_Y - 2 }];
  const ev = stepGame(g, 16.67, seeded());
  return ev.hit === false && g.lives === START_LIVES;
})());

check('máy bay bị kẹp trong biên sân', (() => {
  const g = makeLevel(0, seeded());
  movePlane(g, -9999);
  const left = g.plane.x;
  movePlane(g, 9999);
  return left === PLANE_R && g.plane.x === FIELD_W - PLANE_R;
})());

console.log('— Trùm —');

check('dọn sạch đội hình → TRÙM xuất hiện với thanh máu theo màn', (() => {
  const g = makeLevel(0, seeded());
  // gà đã vào đội hình sẽ bị kéo về slot + lắc — đặt slot ngay tại chỗ để đạn trúng chắc
  g.enemies = [{ slot: { x: 300, y: 80 }, x: 300, y: 80, hp: 1, entered: true }];
  g.bullets = [{ x: 300, y: 80 }];
  const ev = stepGame(g, 16.67, seeded());
  return ev.bossSpawned && g.phase === 'boss' && g.boss.hp === g.form.bossHp;
})());

check('trùm đi qua lại trong biên, bắn đủ máu thì thắng + thưởng mạng', (() => {
  const g = makeLevel(0, seeded());
  g.enemies = [];
  g.phase = 'boss';
  g.boss = { x: 300, y: 110, hp: 2, maxHp: 14, vx: 2.2 };
  g.bullets = [{ x: 300, y: 110 }, { x: 301, y: 111 }];
  stepGame(g, 16.67, seeded());
  return g.over === true && g.won === true && g.score >= 150 + START_LIVES * 30;
})());

check('hết 3 mạng → thua', (() => {
  const g = makeLevel(0, seeded());
  g.lives = 1;
  g.eggs = [{ x: g.plane.x, y: PLANE_Y - 2 }];
  stepGame(g, 16.67, seeded());
  return g.over === true && g.won === false;
})());

check('game kết thúc thì stepGame không làm gì', (() => {
  const g = makeLevel(0, seeded());
  g.over = true;
  const ev = stepGame(g, 16.67, seeded());
  return ev.killed === 0 && g.bullets.length === 0;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
