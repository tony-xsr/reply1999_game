// Unit test cho Văn Hóa & Địa Lý Việt Nam. Chạy: node src/vanhoa.test.js

import {
  REGIONS, makeMapQuestion, makeMapSet,
  FOOD_ITEMS, makeFoodRegionQuestion, makeFoodSet,
  TET_STICKERS, LANTERN_ITEMS, currentFestivalSeason, makeLanternDeck,
} from './vanhoa.js';

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

console.log('— Bản Đồ Việt Nam Bé —');

check('đúng 3 miền, mỗi miền có địa danh đủ tên/icon/mô tả', REGIONS.length === 3
  && REGIONS.every((r) => r.landmark.name && r.landmark.icon && r.landmark.desc)
  && new Set(REGIONS.map((r) => r.id)).size === 3);

check('makeMapQuestion: type hợp lệ, region là 1 trong 3 miền', (() => {
  for (let s = 0; s < 60; s++) {
    const q = makeMapQuestion(rng(s));
    if (!['landmark', 'region'].includes(q.type)) return false;
    if (!REGIONS.includes(q.region)) return false;
  }
  return true;
})());

check('makeMapSet: đúng số câu', makeMapSet(8, rng(1)).length === 8);

console.log('— Món Ăn Ba Miền —');

check('12 món, mỗi miền đúng 4 món, emoji không trùng', FOOD_ITEMS.length === 12
  && ['bac', 'trung', 'nam'].every((id) => FOOD_ITEMS.filter((f) => f.region === id).length === 4)
  && new Set(FOOD_ITEMS.map((f) => f.emoji)).size === 12
  && new Set(FOOD_ITEMS.map((f) => f.vi)).size === 12);

check('makeFoodRegionQuestion: đáp án đúng miền của món, đủ 3 lựa chọn (đúng số miền)', (() => {
  for (let s = 0; s < 60; s++) {
    const q = makeFoodRegionQuestion(rng(s));
    if (q.answer !== q.item.region) return false;
    if (q.options.length !== 3 || new Set(q.options.map((o) => o.id)).size !== 3) return false;
  }
  return true;
})());

check('makeFoodSet: nửa đầu ghép chữ-hình (4 hình/4 chữ), nửa sau đố miền', (() => {
  const set = makeFoodSet(8, rng(2));
  const matches = set.filter((q) => q.kind === 'match');
  const quizzes = set.filter((q) => q.kind === 'quiz');
  return set.length === 8 && matches.length === 4 && quizzes.length === 4
    && matches.every((m) => m.pictures.length === 4 && m.words.length === 4);
})());

console.log('— Lễ Hội & Ngày Tết —');

check('đủ sticker Tết và biểu tượng đèn lồng Trung Thu', TET_STICKERS.length >= 6 && LANTERN_ITEMS.length >= 6);

check('currentFestivalSeason: tháng 1–2 → tet, tháng 8–9 → trungthu, còn lại → null', (() => {
  const cases = [
    ['2026-01-15', 'tet'], ['2026-02-20', 'tet'],
    ['2026-08-05', 'trungthu'], ['2026-09-10', 'trungthu'],
    ['2026-05-01', null], ['2026-12-25', null],
  ];
  return cases.every(([iso, expect]) => currentFestivalSeason(new Date(iso)) === expect);
})());

check('makeLanternDeck: 12 thẻ, mỗi pairKey đúng 2 thẻ, id không trùng', (() => {
  for (let s = 0; s < 30; s++) {
    const deck = makeLanternDeck(rng(s));
    if (deck.length !== 12) return false;
    const counts = new Map();
    for (const c of deck) counts.set(c.pairKey, (counts.get(c.pairKey) || 0) + 1);
    if ([...counts.values()].some((n) => n !== 2)) return false;
    if (new Set(deck.map((c) => c.id)).size !== 12) return false;
  }
  return true;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
