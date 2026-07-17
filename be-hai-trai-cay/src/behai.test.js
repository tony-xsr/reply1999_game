// Unit test cho Bé Hái Trái Cây. Chạy: node src/behai.test.js

import {
  FIELD_W, FIELD_H, GRAVITY, START_LIVES, FRUIT_SCORE, FRUITS,
  makeLevel, spawnToss, stepGame, segmentHitsCircle, slice,
} from './behai.js';

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

/** 1 quả táo bay giữa màn hình, đứng yên tương đối để test vuốt chém. */
function fruitAt(x, y, extra = {}) {
  return { kind: 'fruit', fruitIndex: 0, x, y, vx: 0, vy: 0, r: 26, sliced: false, ...extra };
}

console.log('— Khởi tạo màn —');

check('màn 0: 3 tim, chưa có ong, mục tiêu dương', (() => {
  const g = makeLevel(0, seeded());
  return g.lives === START_LIVES && g.beeChance === 0 && g.target > 0 && !g.over;
})());

check('màn cao hơn: mục tiêu cao hơn, tung dày hơn, có ong (chặn trần 30%)', (() => {
  const g0 = makeLevel(0, seeded());
  const g5 = makeLevel(5, seeded());
  const g99 = makeLevel(99, seeded());
  return g5.target > g0.target && g5.tossEveryMs < g0.tossEveryMs
    && g5.beeChance > 0 && g99.beeChance <= 0.3 && g99.tossEveryMs >= 1200;
})());

console.log('— Tung trái cây (vật lý parabol) —');

check('tung từ mép dưới, bay LÊN (vy âm), x nằm trong sân', (() => {
  const g = makeLevel(0, seeded());
  spawnToss(g, seeded());
  return g.objects.length >= 1 && g.objects.every(
    (o) => o.y > FIELD_H && o.vy < 0 && o.x >= 0 && o.x <= FIELD_W,
  );
})());

check('trọng lực kéo dần: sau nhiều bước vy tăng lên (chậm dần rồi rơi xuống)', (() => {
  const g = makeLevel(0, seeded());
  g.objects = [fruitAt(320, 600, { vy: -14 })];
  g.tossTimer = 999999; // tắt tung thêm để đo riêng 1 quả
  const vy0 = g.objects[0].vy;
  for (let i = 0; i < 30; i++) stepGame(g, 16.67, seeded());
  return g.objects[0].vy > vy0 && Math.abs(g.objects[0].vy - (vy0 + GRAVITY * 30)) < 0.01;
})());

check('đỉnh parabol không vượt quá dải 90–270px cách mép trên (bé với tay tới)', (() => {
  const g = makeLevel(3, seeded(7));
  spawnToss(g, seeded(7));
  return g.objects.every((o) => {
    const apex = (FIELD_H + 30) - (o.vy * o.vy) / (2 * GRAVITY);
    return apex >= 89 && apex <= 271;
  });
})());

console.log('— Giao điểm đoạn vuốt × hình tròn —');

check('vuốt xuyên qua tâm → trúng', segmentHitsCircle(0, 100, 200, 100, 100, 100, 26) === true);
check('vuốt đi sát mép trong bán kính → trúng', segmentHitsCircle(0, 120, 200, 120, 100, 100, 26) === true);
check('vuốt cách xa hơn bán kính → trượt', segmentHitsCircle(0, 200, 200, 200, 100, 100, 26) === false);
check('đoạn vuốt ngắn dừng trước khi tới trái → trượt', segmentHitsCircle(0, 100, 40, 100, 100, 100, 26) === false);
check('đoạn vuốt dài 0 (chấm 1 điểm) ngay trên trái → vẫn trúng', segmentHitsCircle(100, 100, 100, 100, 100, 100, 26) === true);

console.log('— Hái trái & combo —');

check('hái 1 trái: đúng điểm gốc, trái biến khỏi sân', (() => {
  const g = makeLevel(0, seeded());
  g.objects = [fruitAt(320, 300)];
  const r = slice(g, 200, 300, 440, 300, 1);
  return r.fruits.length === 1 && r.gained === FRUIT_SCORE && g.score === FRUIT_SCORE && g.objects.length === 0;
})());

check('trái thứ 2+ trong CÙNG 1 lần vuốt được thưởng combo gấp đôi', (() => {
  const g = makeLevel(0, seeded());
  g.objects = [fruitAt(200, 300), fruitAt(400, 300)];
  const r = slice(g, 100, 300, 500, 300, 1);
  return r.fruits.length === 2 && r.gained === FRUIT_SCORE + FRUIT_SCORE * 2;
})());

check('combo giữ qua nhiều đoạn của cùng 1 lần vuốt, reset khi vuốt lần mới', (() => {
  const g = makeLevel(0, seeded());
  g.objects = [fruitAt(200, 300)];
  slice(g, 150, 300, 250, 300, 1);
  g.objects = [fruitAt(400, 300)];
  const same = slice(g, 350, 300, 450, 300, 1); // vẫn gesture 1 → combo
  g.objects = [fruitAt(300, 300)];
  const fresh = slice(g, 250, 300, 350, 300, 2); // gesture mới → điểm gốc
  return same.gained === FRUIT_SCORE * 2 && fresh.gained === FRUIT_SCORE;
})());

check('vuốt hụt: không điểm, trái vẫn còn đó', (() => {
  const g = makeLevel(0, seeded());
  g.objects = [fruitAt(320, 300)];
  const r = slice(g, 0, 600, 100, 600, 1);
  return r.fruits.length === 0 && g.score === 0 && g.objects.length === 1;
})());

console.log('— Ong & mất tim —');

check('vuốt trúng ong → bị chích mất 1 tim, không được điểm', (() => {
  const g = makeLevel(0, seeded());
  g.objects = [{ kind: 'bee', fruitIndex: 0, x: 320, y: 300, vx: 0, vy: 0, r: 20, sliced: false }];
  const r = slice(g, 200, 300, 440, 300, 1);
  return r.bees === 1 && r.gained === 0 && g.lives === START_LIVES - 1;
})());

check('trái cây rơi lọt đáy mà chưa hái → mất 1 tim', (() => {
  const g = makeLevel(0, seeded());
  g.tossTimer = 999999;
  g.objects = [fruitAt(320, FIELD_H + 100, { vy: 5 })];
  const dropped = stepGame(g, 16.67, seeded());
  return dropped === 1 && g.lives === START_LIVES - 1 && g.objects.length === 0;
})());

check('ong bay lọt đáy thì thôi, KHÔNG mất tim', (() => {
  const g = makeLevel(0, seeded());
  g.tossTimer = 999999;
  g.objects = [{ kind: 'bee', fruitIndex: 0, x: 320, y: FIELD_H + 100, vx: 0, vy: 5, r: 20, sliced: false }];
  const dropped = stepGame(g, 16.67, seeded());
  return dropped === 0 && g.lives === START_LIVES && g.objects.length === 0;
})());

console.log('— Thắng / thua —');

check('điểm chạm mục tiêu → thắng ngay', (() => {
  const g = makeLevel(0, seeded());
  g.score = g.target - FRUIT_SCORE;
  g.objects = [fruitAt(320, 300)];
  slice(g, 200, 300, 440, 300, 1);
  return g.over === true && g.won === true;
})());

check('hết tim (rơi nhiều trái) → thua', (() => {
  const g = makeLevel(0, seeded());
  g.tossTimer = 999999;
  g.lives = 1;
  g.objects = [fruitAt(320, FIELD_H + 100, { vy: 5 })];
  stepGame(g, 16.67, seeded());
  return g.over === true && g.won === false;
})());

check('hết tim vì ong chích → thua', (() => {
  const g = makeLevel(0, seeded());
  g.lives = 1;
  g.objects = [{ kind: 'bee', fruitIndex: 0, x: 320, y: 300, vx: 0, vy: 0, r: 20, sliced: false }];
  slice(g, 200, 300, 440, 300, 1);
  return g.over === true && g.won === false;
})());

check('game đã kết thúc: stepGame/slice không làm gì thêm', (() => {
  const g = makeLevel(0, seeded());
  g.over = true;
  g.objects = [fruitAt(320, 300)];
  const dropped = stepGame(g, 16.67, seeded());
  const r = slice(g, 200, 300, 440, 300, 1);
  return dropped === 0 && r.fruits.length === 0 && g.objects.length === 1;
})());

check('có đủ 8 loại trái cây, mỗi loại đủ icon/tên/màu nước ép', FRUITS.length === 8
  && FRUITS.every((f) => f.key && f.icon && f.name && f.color));

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
