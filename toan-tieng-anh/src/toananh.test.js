// Unit test cho bộ sinh câu hỏi Học Tiếng Anh Qua Toán. Chạy: node src/toananh.test.js

import {
  QUESTIONS, POINTS_PER_CORRECT, makeProblem, equationDisplay, equationSpeech,
} from './toananh.js';

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

console.log('— Hằng số —');

check('QUESTIONS = 8, POINTS_PER_CORRECT = 10', QUESTIONS === 8 && POINTS_PER_CORRECT === 10);

console.log('— Sinh phép tính dễ (hard=false: chỉ cộng, phạm vi 0..10) —');

check('easy: luôn là phép cộng, kết quả 0..10, đáp án nằm trong 3 lựa chọn không trùng', (() => {
  for (let s = 0; s < 100; s++) {
    const q = makeProblem(rng(s), false);
    if (q.op !== '+') return false;
    if (q.result !== q.a + q.b) return false;
    if (q.result < 0 || q.result > 10) return false;
    if (q.options.length !== 3 || !q.options.includes(q.result)) return false;
    if (new Set(q.options).size !== 3) return false;
    if (q.options.some((o) => o < 0 || o > 10)) return false;
  }
  return true;
})());

console.log('— Sinh phép tính khó (hard=true: cộng lẫn trừ, phạm vi 0..20) —');

check('hard: có cả phép cộng lẫn phép trừ, kết quả không âm, phạm vi 0..20', (() => {
  const ops = new Set();
  for (let s = 0; s < 200; s++) {
    const q = makeProblem(rng(s), true);
    ops.add(q.op);
    const expect = q.op === '+' ? q.a + q.b : q.a - q.b;
    if (q.result !== expect || expect < 0 || expect > 20) return false;
    if (q.options.length !== 3 || !q.options.includes(q.result)) return false;
    if (new Set(q.options).size !== 3 || q.options.some((o) => o < 0 || o > 20)) return false;
  }
  return ops.has('+') && ops.has('−');
})());

console.log('— Hiển thị & giọng đọc —');

check('equationDisplay: luôn ẩn đáp án bằng dấu ?', (() => {
  const q = makeProblem(rng(1), false);
  return equationDisplay(q) === `${q.a} + ${q.b} = ?`;
})());

check('equationDisplay: phép trừ hiện đúng dấu −', (() => {
  const q = { a: 9, b: 4, op: '−', result: 5, options: [3, 4, 5] };
  return equationDisplay(q) === '9 − 4 = ?';
})());

check('equationSpeech: câu tiếng Anh đầy đủ CÓ đáp án, dùng "plus"/"equals" cho phép cộng', (() => {
  const q = { a: 1, b: 1, op: '+', result: 2, options: [1, 2, 3] };
  return equationSpeech(q) === '1 plus 1 equals 2';
})());

check('equationSpeech: dùng "minus" cho phép trừ', (() => {
  const q = { a: 9, b: 4, op: '−', result: 5, options: [3, 4, 5] };
  return equationSpeech(q) === '9 minus 4 equals 5';
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
