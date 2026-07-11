// Unit test cho bộ sinh câu hỏi Toán Lớp 1. Chạy: node src/toan.test.js

import {
  makeAddSub, makeCompare, makeClock, timeLabel, makeShape, makePattern,
  makeShopping, payState, BILLS, SHAPES, SHAPE_OBJECTS,
} from './toan.js';

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

console.log('— Cộng trừ ≤ 20 —');

check('basic: kết quả 0..20, phép trừ không âm, đáp án trong 3 lựa chọn', (() => {
  for (let s = 0; s < 100; s++) {
    const q = makeAddSub(rng(s), 'basic');
    const expect = q.op === '+' ? q.a + q.b : q.a - q.b;
    if (q.result !== expect || expect < 0 || expect > 20) return false;
    if (q.blank !== 'result' || q.answer !== expect) return false;
    if (q.options.length !== 3 || !q.options.includes(q.answer)) return false;
    if (new Set(q.options).size !== 3 || q.options.some((o) => o < 0)) return false;
  }
  return true;
})());

check('missing: chỗ trống là a hoặc b, đáp án khớp', (() => {
  for (let s = 0; s < 100; s++) {
    const q = makeAddSub(rng(s), 'missing');
    if (!['a', 'b'].includes(q.blank)) return false;
    if (q.answer !== q[q.blank]) return false;
  }
  return true;
})());

console.log('— So sánh —');

check('answer đúng theo giá trị 2 vế, vế khó có phép tính', (() => {
  let sawExpr = false;
  let sawEq = false;
  for (let s = 0; s < 200; s++) {
    const q = makeCompare(rng(s), true);
    const expect = q.left.value > q.right.value ? '>' : q.left.value < q.right.value ? '<' : '=';
    if (q.answer !== expect) return false;
    if (q.left.text.includes('+') || q.left.text.includes('−')) sawExpr = true;
    if (q.answer === '=') sawEq = true;
  }
  return sawExpr && sawEq;
})());

console.log('— Xem giờ —');

check('giờ 1..12, nhãn đúng định dạng, đáp án trong 3 lựa chọn không trùng', (() => {
  for (let s = 0; s < 100; s++) {
    const q = makeClock(rng(s));
    if (q.hour < 1 || q.hour > 12) return false;
    if (q.label !== timeLabel(q.hour, q.half)) return false;
    if (q.options.length !== 3 || !q.options.includes(q.label)) return false;
    if (new Set(q.options).size !== 3) return false;
  }
  return true;
})());

check('allowHalf=false → chỉ giờ đúng', (() => {
  for (let s = 0; s < 50; s++) {
    if (makeClock(rng(s), false).half) return false;
  }
  return true;
})());

console.log('— Hình khối & quy luật —');

check('kho đồ vật: mỗi shape đều có mặt, id hợp lệ', (() => {
  const ids = new Set(SHAPES.map((sh) => sh.id));
  return SHAPE_OBJECTS.every((o) => ids.has(o.shape))
    && [...ids].every((id) => SHAPE_OBJECTS.some((o) => o.shape === id));
})());

check('makeShape: đáp án là hình của đồ vật', (() => {
  for (let s = 0; s < 50; s++) {
    const q = makeShape(rng(s));
    if (q.answer !== q.obj.shape) return false;
    if (!q.options.some((o) => o.id === q.answer)) return false;
  }
  return true;
})());

check('makePattern: phần tử tiếp theo đúng quy luật, 3 lựa chọn không trùng', (() => {
  for (let s = 0; s < 100; s++) {
    const q = makePattern(rng(s));
    if (q.seq.length !== 6 || !q.options.includes(q.answer)) return false;
    if (new Set(q.options).size !== 3) return false;
    // kiểm tra: nối answer vào dãy vẫn tuần hoàn theo chu kỳ 2, 3 hoặc 4
    const full = [...q.seq, q.answer];
    const periodic = (p) => full.every((tk, i) => tk === full[i % p]);
    if (!(periodic(2) || periodic(3) || periodic(4))) return false;
  }
  return true;
})());

console.log('— Đi chợ —');

check('giá 2..18 nghìn, tổng = cộng các món', (() => {
  for (let s = 0; s < 100; s++) {
    const q = makeShopping(rng(s));
    const sum = q.items.reduce((a, it) => a + it.price, 0);
    if (q.total !== sum || q.total < 2 || q.total > 18) return false;
  }
  return true;
})());

check('payState: đủ/thiếu/thừa', payState(5, [5]) === 'paid'
  && payState(5, [2, 2]) === 'more' && payState(5, [5, 1]) === 'over');

check('mọi giá đều trả được bằng 4 mệnh giá', BILLS.length === 4
  && BILLS.map((b) => b.value).join(',') === '1,2,5,10');

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
