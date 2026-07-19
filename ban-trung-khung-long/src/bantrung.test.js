// Unit test cho logic Bắn Trứng Khủng Long Từ Vựng. Chạy: node src/bantrung.test.js

import { WORDS } from '../../shared/fruit-object-words.js';
import {
  ROUND_SECONDS, LANES, TARGET_HITS_TO_CHANGE, POINTS_HIT, POINTS_MISS,
  pickTarget, makeEggWord, hitScore, spawnDelay,
  makeGame, spawnEgg, shootEgg, landEgg, tick,
} from './bantrung.js';

let passed = 0;
let failed = 0;

function check(name, cond) {
  if (cond) { passed++; console.log(`  ✅ ${name}`); }
  else { failed++; console.error(`  ❌ ${name}`); }
}

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

console.log('— Bắn Trứng Khủng Long Từ Vựng —');

check('WORDS: đủ ít nhất 20 từ hợp lệ', WORDS.length >= 20);

check('hằng số hợp lý: 45 giây, 4 cột, đổi mục tiêu sau 3 lần', (() => (
  ROUND_SECONDS === 45 && LANES === 4 && TARGET_HITS_TO_CHANGE === 3
))());

check('pickTarget: không lặp lại đúng từ cũ', (() => {
  const r = rng(1);
  for (let i = 0; i < 50; i++) {
    const prev = pickTarget(null, r);
    const next = pickTarget(prev, r);
    if (next.en === prev.en) return false;
  }
  return true;
})());

check('makeEggWord: có cả từ mục tiêu lẫn từ khác, tỉ lệ khoảng 45%', (() => {
  const r = rng(2);
  const target = WORDS[0];
  const eggs = Array.from({ length: 300 }, () => makeEggWord(target, r));
  const targets = eggs.filter((w) => w.en === target.en).length;
  return targets > 80 && targets < 220;
})());

check('hitScore: đúng từ +10 (good), sai từ −5 (không good)', (() => {
  const target = WORDS[0];
  const other = WORDS.find((w) => w.en !== target.en);
  const good = hitScore(target, target);
  const bad = hitScore(other, target);
  return good.delta === 10 && good.good && bad.delta === -5 && !bad.good;
})());

check('spawnDelay: nhanh dần nhưng không dưới 500ms',
  spawnDelay(0) === 1100 && spawnDelay(30) === 800 && spawnDelay(100) === 500);

console.log('— Khởi tạo & thả trứng ——');

check('makeGame: bắt đầu trống, đủ giờ, chưa kết thúc', (() => {
  const g = makeGame();
  return g.items.length === 0 && g.timeLeft === ROUND_SECONDS && !g.over && g.score === 0;
})());

check('spawnEgg: sinh tối đa LANES trứng cùng lúc, dư thì trả null, lane hợp lệ', (() => {
  const g = makeGame();
  g.target = WORDS[0];
  for (let i = 0; i < LANES; i++) {
    const egg = spawnEgg(g, rng(i));
    if (!egg || egg.lane < 0 || egg.lane >= LANES) return false;
  }
  return spawnEgg(g, rng(99)) === null && g.items.length === LANES;
})());

check('spawnEgg: busyLanes tránh thả chồng 2 quả cùng cột, trả null khi hết cột trống', (() => {
  const g = makeGame();
  g.target = WORDS[0];
  const r = rng(42);
  for (let i = 0; i < 30; i++) {
    const egg = spawnEgg(g, r, [0, 1, 2]);
    if (!egg || egg.lane !== 3) return false;
    g.items = [];
  }
  return spawnEgg(g, r, [0, 1, 2, 3]) === null;
})());

console.log('— Bắn trứng ——');

check('shootEgg: bắn trúng từ mục tiêu -> cộng điểm, good=true, dọn khỏi màn hình', (() => {
  const g = makeGame();
  g.target = WORDS[0];
  const egg = { uid: g.nextUid++, lane: 0, word: WORDS[0] };
  g.items.push(egg);
  const res = shootEgg(g, egg.uid);
  return res.good === true && res.delta === POINTS_HIT && g.score === POINTS_HIT && g.items.length === 0;
})());

check('shootEgg: bắn trứng SAI từ -> trừ điểm (không âm), good=false', (() => {
  const g = makeGame();
  g.target = WORDS[0];
  g.score = 3;
  const other = WORDS.find((w) => w.en !== g.target.en);
  const egg = { uid: g.nextUid++, lane: 0, word: other };
  g.items.push(egg);
  const res = shootEgg(g, egg.uid);
  return res.good === false && res.delta === POINTS_MISS && g.score === 0; // 3-5 kẹp về 0
})());

check('shootEgg: đúng 3 lần liên tiếp -> tự đổi mục tiêu (targetChanged=true)', (() => {
  const g = makeGame();
  g.target = WORDS[0];
  let lastRes;
  for (let i = 0; i < TARGET_HITS_TO_CHANGE; i++) {
    const egg = { uid: g.nextUid++, lane: 0, word: g.target };
    g.items.push(egg);
    lastRes = shootEgg(g, egg.uid);
  }
  return lastRes.targetChanged === true && g.targetHits === 0;
})());

check('shootEgg: uid không tồn tại -> trả null, không đổi gì', (() => {
  const g = makeGame();
  g.target = WORDS[0];
  const scoreBefore = g.score;
  return shootEgg(g, 999999) === null && g.score === scoreBefore;
})());

console.log('— Trứng rơi chạm đất (không bị phạt) ——');

check('landEgg: dọn trứng chưa bắn khỏi màn hình, KHÔNG trừ điểm', (() => {
  const g = makeGame();
  g.target = WORDS[0];
  const egg = { uid: g.nextUid++, lane: 0, word: WORDS[1] };
  g.items.push(egg);
  const ok = landEgg(g, egg.uid);
  return ok === true && g.items.length === 0 && g.score === 0;
})());

check('landEgg: uid không tồn tại -> trả false', landEgg(makeGame(), 999999) === false);

console.log('— Đếm giờ ván chơi ——');

check('tick: giảm dần thời gian, hết giờ thì kết thúc ván', (() => {
  const g = makeGame();
  tick(g, 10);
  if (g.timeLeft !== ROUND_SECONDS - 10 || g.over) return false;
  tick(g, 1000);
  return g.timeLeft === 0 && g.over === true;
})());

check('ván đã kết thúc thì tick/spawnEgg/shootEgg tiếp không đổi gì thêm', (() => {
  const g = makeGame();
  g.target = WORDS[0];
  g.over = true;
  const timeBefore = g.timeLeft;
  tick(g, 5);
  const spawned = spawnEgg(g, rng(1));
  const shot = shootEgg(g, 1);
  return g.timeLeft === timeBefore && spawned === null && shot === null;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
