// Unit test cho logic Bắt Vịt. Chạy: node src/ducks.test.js

import { pickTarget, makeDuckLetter, hitScore, spawnDelay, duckUpTime } from './ducks.js';

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

console.log('— Bắt Vịt —');

check('pickTarget: không lặp lại chữ cũ', (() => {
  const r = rng(1);
  for (let i = 0; i < 50; i++) {
    const prev = pickTarget(null, r);
    if (pickTarget(prev, r) === prev) return false;
  }
  return true;
})());

check('makeDuckLetter: có cả chữ mục tiêu lẫn chữ khác', (() => {
  const r = rng(2);
  const letters = Array.from({ length: 200 }, () => makeDuckLetter('B', r));
  const targets = letters.filter((l) => l === 'B').length;
  return targets > 40 && targets < 160; // ~45%
})());

check('hitScore classic: con nào cũng +10', (() => {
  const a = hitScore('classic', 'X', 'B');
  return a.delta === 10 && a.good;
})());

check('hitScore letter: đúng chữ +10, sai chữ −5', (() => {
  const good = hitScore('letter', 'B', 'B');
  const bad = hitScore('letter', 'C', 'B');
  return good.delta === 10 && good.good && bad.delta === -5 && !bad.good;
})());

check('spawnDelay: nhanh dần nhưng không dưới 450ms',
  spawnDelay(0) === 950 && spawnDelay(30) === 650 && spawnDelay(100) === 450);

check('duckUpTime: chế độ chữ lâu hơn để bé kịp đọc', duckUpTime('letter') > duckUpTime('classic'));

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
