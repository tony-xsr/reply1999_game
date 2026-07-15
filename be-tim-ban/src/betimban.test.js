// Unit test cho Bé Tìm Bạn. Chạy: node src/betimban.test.js

import { FIELD_W, FIELD_H, ITEM_R, makeLevel, tapAt, stepTime } from './betimban.js';

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

console.log('— Dựng màn —');

check('màn 0: 1 loại bạn cần tìm, cần 2-4 con, chưa kết thúc', (() => {
  const g = makeLevel(0, seeded());
  const types = Object.keys(g.targetsNeeded);
  return types.length === 1 && g.targetsNeeded[types[0]] >= 2 && g.targetsNeeded[types[0]] <= 4 && !g.over;
})());

check('màn cao hơn có nhiều loại bạn cần tìm hơn (tối đa 3 loại)', (() => {
  const g3 = makeLevel(3, seeded());
  const g6 = makeLevel(6, seeded());
  const g99 = makeLevel(99, seeded());
  return Object.keys(g3.targetsNeeded).length === 2
    && Object.keys(g6.targetsNeeded).length === 3
    && Object.keys(g99.targetsNeeded).length === 3;
})());

check('mọi vật nằm trong sân, không có 2 vật nào chồng quá sát nhau', (() => {
  const g = makeLevel(2, seeded(5));
  const inBounds = g.items.every((it) => it.x >= ITEM_R && it.x <= FIELD_W - ITEM_R
    && it.y >= ITEM_R && it.y <= FIELD_H - ITEM_R);
  let noOverlap = true;
  for (let i = 0; i < g.items.length && noOverlap; i++) {
    for (let j = i + 1; j < g.items.length; j++) {
      if (Math.hypot(g.items[i].x - g.items[j].x, g.items[i].y - g.items[j].y) < ITEM_R * 1.5) { noOverlap = false; break; }
    }
  }
  return inBounds && noOverlap;
})());

check('số lượng bạn cần tìm đặt trên sân đúng khớp với targetsNeeded, đồ vật thường không trùng loại bạn cần tìm', (() => {
  const g = makeLevel(4, seeded(9));
  const targetEmojis = Object.keys(g.targetsNeeded);
  const placedPerType = {};
  for (const it of g.items) {
    if (it.isTarget) placedPerType[it.emoji] = (placedPerType[it.emoji] || 0) + 1;
  }
  const countsMatch = targetEmojis.every((e) => placedPerType[e] === g.targetsNeeded[e]);
  const decoysClean = g.items.filter((it) => !it.isTarget).every((it) => !targetEmojis.includes(it.emoji));
  return countsMatch && decoysClean;
})());

console.log('— Chạm tìm bạn —');

check('chạm đúng vị trí 1 bạn cần tìm: tìm thấy, trừ đúng số lượng còn thiếu, cộng điểm', (() => {
  const g = makeLevel(0, seeded());
  const target = g.items.find((it) => it.isTarget);
  const before = g.targetsNeeded[target.emoji];
  const result = tapAt(g, target.x, target.y);
  return result.hit === true && result.emoji === target.emoji
    && target.found === true && g.targetsNeeded[target.emoji] === before - 1 && g.score === 10;
})());

check('chạm đúng vị trí 1 đồ vật KHÔNG cần tìm: báo trúng nhầm, không cộng điểm, không đổi trạng thái', (() => {
  const g = makeLevel(0, seeded());
  const decoy = g.items.find((it) => !it.isTarget);
  const result = tapAt(g, decoy.x, decoy.y);
  return result.hit === false && result.wrong === true && decoy.found === false && g.score === 0;
})());

check('chạm vào chỗ trống (không có vật nào gần đó): không có gì xảy ra', (() => {
  const g = makeLevel(0, seeded());
  // tìm 1 điểm đủ xa mọi vật trên sân
  let fx = 0; let fy = 0;
  outer:
  for (let x = 0; x <= FIELD_W; x += 40) {
    for (let y = 0; y <= FIELD_H; y += 40) {
      if (g.items.every((it) => Math.hypot(it.x - x, it.y - y) > ITEM_R * 2)) { fx = x; fy = y; break outer; }
    }
  }
  const result = tapAt(g, fx, fy);
  return result.hit === false && result.wrong === undefined && g.score === 0;
})());

check('chạm lại đúng chỗ 1 bạn đã tìm thấy rồi: không tính thêm lần nữa', (() => {
  const g = makeLevel(0, seeded());
  const target = g.items.find((it) => it.isTarget);
  tapAt(g, target.x, target.y);
  const scoreAfterFirst = g.score;
  const result = tapAt(g, target.x, target.y);
  return result.hit === false && g.score === scoreAfterFirst;
})());

console.log('— Kết thúc màn —');

check('tìm đủ hết tất cả các bạn cần tìm → thắng', (() => {
  const g = makeLevel(0, seeded());
  for (const it of g.items) {
    if (it.isTarget) tapAt(g, it.x, it.y);
  }
  return g.over === true && g.won === true
    && Object.values(g.targetsNeeded).every((n) => n === 0);
})());

check('hết giờ mà chưa tìm đủ → thua', (() => {
  const g = makeLevel(0, seeded());
  stepTime(g, 999999);
  return g.timeLeft === 0 && g.over === true && g.won === false;
})());

check('game đã kết thúc thì tapAt()/stepTime() không làm gì thêm', (() => {
  const g = makeLevel(0, seeded());
  g.over = true;
  g.won = false;
  const target = g.items.find((it) => it.isTarget);
  const timeBefore = g.timeLeft;
  const result = tapAt(g, target.x, target.y);
  stepTime(g, 1000);
  return result.hit === false && target.found === false && g.timeLeft === timeBefore;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
