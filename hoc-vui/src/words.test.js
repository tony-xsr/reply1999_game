// Unit test cho dữ liệu từ vựng + bộ sinh câu hỏi. Chạy: node src/words.test.js

import {
  TOPICS, ALL_ITEMS,
  makeMatchRound, makeCountQuestion, makeCompareQuestion, makeMathQuestion,
  makeCountSet, makeListenQuestion,
} from './words.js';

let passed = 0;
let failed = 0;

function check(name, cond) {
  if (cond) { passed++; console.log(`  ✅ ${name}`); }
  else { failed++; console.error(`  ❌ ${name}`); }
}

// RNG có seed để test tất định
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

console.log('— Từ vựng —');

check('4 chủ đề, mỗi mục đủ vi/en/emoji', TOPICS.length === 4
  && ALL_ITEMS.every((w) => w.vi && w.en && w.emoji));

check('không trùng emoji giữa các mục', new Set(ALL_ITEMS.map((w) => w.emoji)).size === ALL_ITEMS.length);

console.log('— Sinh câu hỏi —');

check('makeMatchRound: 4 hình + 4 chữ là hoán vị của nhau', (() => {
  const r = makeMatchRound(ALL_ITEMS, rng(1));
  return r.pictures.length === 4 && r.words.length === 4
    && [...r.pictures].sort((a, b) => a.en.localeCompare(b.en)).every(
      (p, i) => [...r.words].sort((a, b) => a.en.localeCompare(b.en))[i] === p,
    );
})());

check('makeCountQuestion: đáp án nằm trong 3 lựa chọn, không trùng', (() => {
  for (let s = 0; s < 50; s++) {
    const q = makeCountQuestion(ALL_ITEMS, rng(s));
    if (q.options.length !== 3 || !q.options.includes(q.answer)) return false;
    if (new Set(q.options).size !== 3) return false;
    if (q.n < 1 || q.n > 10) return false;
  }
  return true;
})());

check('makeCompareQuestion: hai bên không bằng nhau, answer chỉ đúng bên nhiều hơn', (() => {
  for (let s = 0; s < 50; s++) {
    const q = makeCompareQuestion(ALL_ITEMS, rng(s));
    const [a, b] = q.sides;
    if (a.n === b.n) return false;
    if (q.answer !== (a.n > b.n ? 0 : 1)) return false;
  }
  return true;
})());

check('makeMathQuestion: kết quả 1–9, phép trừ không âm, đáp án trong lựa chọn', (() => {
  for (let s = 0; s < 80; s++) {
    const q = makeMathQuestion(ALL_ITEMS, rng(s));
    const expect = q.plus ? q.a + q.b : q.a - q.b;
    if (q.answer !== expect || q.answer < 1 || q.answer > 9) return false;
    if (!q.options.includes(q.answer) || new Set(q.options).size !== 3) return false;
  }
  return true;
})());

check('makeCountSet: đủ số câu, độ khó tăng dần (đếm → so sánh → cộng trừ)', (() => {
  const set = makeCountSet(ALL_ITEMS, 9, rng(7));
  const types = set.map((q) => q.type);
  return set.length === 9
    && types.slice(0, 3).every((x) => x === 'count')
    && types.slice(3, 6).every((x) => x === 'compare')
    && types.slice(6).every((x) => x === 'math');
})());

check('makeListenQuestion: mục tiêu nằm trong lưới 6 hình không trùng', (() => {
  for (let s = 0; s < 30; s++) {
    const q = makeListenQuestion(ALL_ITEMS, 6, rng(s));
    if (q.grid.length !== 6 || !q.grid.includes(q.target)) return false;
    if (new Set(q.grid.map((w) => w.emoji)).size !== 6) return false;
  }
  return true;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
