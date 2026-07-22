// Unit test cho Xây Thị Trấn Vàng. Chạy: node src/xaythitran.test.js

import {
  FIELD_W, CART_W, CART_Y, RUN_MS, STUN_MS, DROPS, BUILDINGS,
  costOf, makeTown, buyUpgrade, townComplete, nextTown, serializeTown, deserializeTown,
  makeRun, moveCart, stepRun, bankRun,
} from './xaythitran.js';

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

console.log('— Thị trấn & xây dựng —');

check('6 công trình: đủ tên + bảng giá tăng dần theo cấp', (() => {
  return BUILDINGS.length === 6 && BUILDINGS.every((b) => b.name && b.costs.length >= 2
    && b.costs.every((c, i) => i === 0 || c > b.costs[i - 1]));
})());

check('thị trấn mới: chưa xây gì, 0 vàng; giá nhân theo cấp thị trấn', (() => {
  const town = makeTown(0);
  const nha = BUILDINGS[0];
  return Object.values(town.built).every((v) => v === 0)
    && costOf(nha, 0, 0) === nha.costs[0]
    && costOf(nha, 0, 2) === Math.round(nha.costs[0] * 2);
})());

check('mua công trình: trừ đúng vàng, lên cấp 1; thiếu vàng thì không mua được', (() => {
  const town = makeTown(0);
  town.gold = 100;
  const ok = buyUpgrade(town, 'nha'); // giá 60
  const fail = buyUpgrade(town, 'thapdongho'); // giá 200 > 40 còn lại
  return ok === 1 && town.gold === 40 && fail === -1 && town.built.thapdongho === 0;
})());

check('nâng hết cấp thì không mua thêm được nữa', (() => {
  const town = makeTown(0);
  town.gold = 99999;
  const def = BUILDINGS.find((b) => b.id === 'daiphun'); // 2 cấp
  buyUpgrade(town, 'daiphun');
  buyUpgrade(town, 'daiphun');
  return town.built.daiphun === def.costs.length && buyUpgrade(town, 'daiphun') === -1;
})());

check('xây đủ MỌI công trình tối đa → thị trấn hoàn thành → mở thị trấn mới giữ vàng dư', (() => {
  const town = makeTown(0);
  town.gold = 999999;
  for (const b of BUILDINGS) for (let i = 0; i < b.costs.length; i++) buyUpgrade(town, b.id);
  if (!townComplete(town)) return false;
  const goldLeft = town.gold;
  const t2 = nextTown(town);
  return t2.townLevel === 1 && t2.gold === goldLeft
    && Object.values(t2.built).every((v) => v === 0);
})());

check('lưu → khôi phục giữ nguyên tiến độ; dữ liệu hỏng → thị trấn mới an toàn', (() => {
  const town = makeTown(1);
  town.gold = 250;
  town.trips = 7;
  buyUpgrade(town, 'nha');
  const restored = deserializeTown(serializeTown(town));
  const bad = deserializeTown('{hỏng');
  const weird = deserializeTown('{"gold":-50,"built":{"nha":99}}');
  return JSON.stringify(restored) === JSON.stringify(town)
    && bad.townLevel === 0 && weird.gold === 0
    && weird.built.nha === BUILDINGS[0].costs.length; // kẹp trần cấp
})());

console.log('— Chuyến xe goòng —');

check('xe kẹp trong biên hầm', (() => {
  const run = makeRun(0);
  moveCart(run, -999);
  const left = run.cartX;
  moveCart(run, 9999);
  return left === CART_W / 2 && run.cartX === FIELD_W - CART_W / 2;
})());

check('vàng rơi trúng lòng xe → chở thêm đúng giá trị', (() => {
  const run = makeRun(0);
  run.spawnEveryMs = 999999;
  run.items = [{ kind: 'gem', x: run.cartX, y: CART_Y - 10, vy: 3 }];
  let got = 0;
  for (let i = 0; i < 30; i++) got += stepRun(run, 16.67, seeded()).caught.reduce((s, c2) => s + c2.value, 0);
  return got === DROPS.gem.value && run.carried === DROPS.gem.value;
})());

check('đá rơi trúng xe → văng mất 30% vàng đang chở + choáng (đang choáng không hứng được)', (() => {
  const run = makeRun(0);
  run.spawnEveryMs = 999999;
  run.carried = 100;
  run.items = [{ kind: 'rock', x: run.cartX, y: CART_Y - 10, vy: 3 }];
  let hit = false;
  for (let i = 0; i < 30 && !hit; i++) hit = stepRun(run, 16.67, seeded()).hitRock;
  if (!hit || run.carried !== 70 || run.stunMs <= 0) return false;
  run.items = [{ kind: 'coin', x: run.cartX, y: CART_Y - 10, vy: 3 }];
  let got = 0;
  for (let i = 0; i < 20; i++) got += stepRun(run, 16.67, seeded()).caught.length;
  return got === 0; // đang choáng — xu rơi xuyên qua
})());

check('vật rơi lệch xa xe thì không hứng được', (() => {
  const run = makeRun(0);
  run.spawnEveryMs = 999999;
  run.items = [{ kind: 'coin', x: run.cartX + CART_W, y: CART_Y - 10, vy: 3 }];
  for (let i = 0; i < 40; i++) stepRun(run, 16.67, seeded());
  return run.carried === 0;
})());

check('hết 45 giây → chuyến xong, đổ vàng vào kho, đếm chuyến', (() => {
  const town = makeTown(0);
  const run = makeRun(0);
  run.carried = 123;
  run.timeLeftMs = 10;
  const ev = stepRun(run, 16.67, seeded());
  const banked = bankRun(town, run);
  return ev.done && run.over && banked === 123 && town.gold === 123 && town.trips === 1;
})());

check('chuyến chưa xong thì chưa đổ vàng được', (() => {
  const town = makeTown(0);
  const run = makeRun(0);
  run.carried = 50;
  return bankRun(town, run) === 0 && town.gold === 0;
})());

check('thị trấn cấp cao: hầm mỏ khó hơn (đá nhiều hơn, rơi dày hơn)', (() => {
  const r0 = makeRun(0);
  const r3 = makeRun(3);
  return r3.rockChance > r0.rockChance && r3.spawnEveryMs < r0.spawnEveryMs
    && RUN_MS === 45000 && STUN_MS > 0;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
