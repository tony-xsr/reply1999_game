// Unit test cho logic Hồ Cá Từ Vựng. Chạy: node src/hoca.test.js

import { WORDS } from '../../shared/fruit-object-words.js';
import {
  ROUND_SECONDS, LANES, TARGET_HITS_TO_CHANGE, SWIM_MS_MIN, SWIM_MS_MAX,
  pickTarget, makeFishWord, catchScore, spawnDelay, pickFreeLane,
} from './hoca.js';

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

console.log('— Hồ Cá Từ Vựng —');

check('WORDS: đủ ít nhất 20 từ hợp lệ', WORDS.length >= 20);

check('hằng số hợp lý: 45 giây, 4 làn, đổi mục tiêu sau 3 lần, bơi 3.2–4.6s',
  ROUND_SECONDS === 45 && LANES === 4 && TARGET_HITS_TO_CHANGE === 3
  && SWIM_MS_MIN === 3200 && SWIM_MS_MAX === 4600);

check('pickTarget: không lặp lại đúng từ cũ', (() => {
  const r = rng(1);
  for (let i = 0; i < 50; i++) {
    const prev = pickTarget(null, r);
    const next = pickTarget(prev, r);
    if (next.en === prev.en) return false;
  }
  return true;
})());

check('makeFishWord: có cả từ mục tiêu lẫn từ khác, tỉ lệ khoảng 45%', (() => {
  const r = rng(2);
  const target = WORDS[0];
  const fish = Array.from({ length: 300 }, () => makeFishWord(target, r));
  const targets = fish.filter((w) => w.en === target.en).length;
  return targets > 80 && targets < 220;
})());

check('catchScore: đúng từ +10 (good), sai từ −5 (không good)', (() => {
  const target = WORDS[0];
  const other = WORDS.find((w) => w.en !== target.en);
  const good = catchScore(target, target);
  const bad = catchScore(other, target);
  return good.delta === 10 && good.good && bad.delta === -5 && !bad.good;
})());

check('spawnDelay: nhanh dần nhưng không dưới 500ms',
  spawnDelay(0) === 1000 && spawnDelay(30) === 700 && spawnDelay(100) === 500);

check('pickFreeLane: chọn đúng 1 làn còn trống, không trùng làn đang bận', (() => {
  const r = rng(3);
  for (let i = 0; i < 30; i++) {
    const busy = [0, 2];
    const lane = pickFreeLane(busy, r);
    if (busy.includes(lane)) return false;
    if (lane < 0 || lane >= LANES) return false;
  }
  return true;
})());

check('pickFreeLane: trả -1 khi hết làn trống', pickFreeLane([0, 1, 2, 3]) === -1);

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
