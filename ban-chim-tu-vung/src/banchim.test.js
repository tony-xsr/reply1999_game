// Unit test cho logic Bắn Chim Từ Vựng. Chạy: node src/banchim.test.js

import {
  WORDS,
} from '../../shared/fruit-object-words.js';
import {
  ROUND_SECONDS, SKY_SLOTS, TARGET_HITS_TO_CHANGE, BIRD_UP_MS,
  pickTarget, makeBirdWord, hitScore, spawnDelay,
} from './banchim.js';

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

console.log('— Bắn Chim Từ Vựng —');

check('WORDS: đủ ít nhất 20 từ hợp lệ, có en/vi/emoji',
  WORDS.length >= 20 && WORDS.every((w) => w.en && w.vi && w.emoji));

check('hằng số hợp lý: 45 giây, 9 ổ, đổi mục tiêu sau 3 lần, chim lơ lửng lâu hơn 1s',
  ROUND_SECONDS === 45 && SKY_SLOTS === 9 && TARGET_HITS_TO_CHANGE === 3 && BIRD_UP_MS > 1000);

check('pickTarget: không lặp lại đúng từ cũ', (() => {
  const r = rng(1);
  for (let i = 0; i < 50; i++) {
    const prev = pickTarget(null, r);
    const next = pickTarget(prev, r);
    if (next.en === prev.en) return false;
  }
  return true;
})());

check('makeBirdWord: có cả từ mục tiêu lẫn từ khác, tỉ lệ khoảng 45%', (() => {
  const r = rng(2);
  const target = WORDS[0];
  const birds = Array.from({ length: 300 }, () => makeBirdWord(target, r));
  const targets = birds.filter((w) => w.en === target.en).length;
  return targets > 80 && targets < 220; // ~45% của 300
})());

check('hitScore: đúng từ +10 (good), sai từ −5 (không good)', (() => {
  const target = WORDS[0];
  const other = WORDS.find((w) => w.en !== target.en);
  const good = hitScore(target, target);
  const bad = hitScore(other, target);
  return good.delta === 10 && good.good && bad.delta === -5 && !bad.good;
})());

check('spawnDelay: nhanh dần nhưng không dưới 450ms',
  spawnDelay(0) === 950 && spawnDelay(30) === 650 && spawnDelay(100) === 450);

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
