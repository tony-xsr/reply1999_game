// Unit test cho bộ thẻ Lật Hình. Chạy: node src/deck.test.js

import { makeDeck, starsForMoves } from './deck.js';

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

const pairKeyCounts = (deck) => {
  const m = new Map();
  for (const c of deck) m.set(c.pairKey, (m.get(c.pairKey) || 0) + 1);
  return m;
};

console.log('— Bộ thẻ Lật Hình —');

for (const mode of ['classic', 'letter', 'number']) {
  check(`${mode}: 16 thẻ, mỗi pairKey đúng 2 thẻ`, (() => {
    const deck = makeDeck(mode, 8, rng(3));
    return deck.length === 16 && [...pairKeyCounts(deck).values()].every((n) => n === 2);
  })());
}

check('letter: cặp gồm 1 thẻ chữ + 1 thẻ emoji, có câu đọc', (() => {
  const deck = makeDeck('letter', 8, rng(5));
  const byKey = new Map();
  for (const c of deck) {
    if (!byKey.has(c.pairKey)) byKey.set(c.pairKey, []);
    byKey.get(c.pairKey).push(c);
  }
  return [...byKey.values()].every(([a, b]) => a.face !== b.face && a.speech && a.speech === b.speech);
})());

check('number: thẻ số 3 ghép với 3 con vật', (() => {
  const deck = makeDeck('number', 8, rng(7));
  const three = deck.filter((c) => c.pairKey === '3');
  const [digit, animals] = three[0].face === '3' ? three : [three[1], three[0]];
  return digit.face === '3' && [...animals.face].filter((c) => c.trim()).length >= 3;
})());

check('classic: 2 thẻ trong cặp cùng hình', (() => {
  const deck = makeDeck('classic', 8, rng(9));
  const byKey = new Map();
  for (const c of deck) {
    if (!byKey.has(c.pairKey)) byKey.set(c.pairKey, []);
    byKey.get(c.pairKey).push(c);
  }
  return [...byKey.values()].every(([a, b]) => a.face === b.face);
})());

check('cùng seed → cùng bộ thẻ (tất định)', (() => {
  const a = makeDeck('classic', 8, rng(11)).map((c) => c.face).join('');
  const b = makeDeck('classic', 8, rng(11)).map((c) => c.face).join('');
  return a === b;
})());

check('chấm sao: 8 lượt/8 cặp = 3⭐, 15 lượt = 2⭐, 30 lượt = 1⭐',
  starsForMoves(8, 8) === 3 && starsForMoves(15, 8) === 2 && starsForMoves(30, 8) === 1);

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
