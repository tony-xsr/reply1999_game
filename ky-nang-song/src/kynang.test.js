// Unit test cho Kỹ Năng Sống & Cảm Xúc. Chạy: node src/kynang.test.js

import {
  EMOTIONS, SITUATIONS, makeEmotionFromSituation, makeSituationFromEmotion, makeEmotionSet,
  ROUTINES, makeRoutineRound,
  SAFETY_ITEMS, makeSafetySet,
} from './kynang.js';

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

console.log('— Bé Vui Bé Buồn —');

check('mỗi cảm xúc có ít nhất 1 tình huống, mọi tình huống trỏ tới cảm xúc hợp lệ', (() => {
  const ids = new Set(EMOTIONS.map((e) => e.id));
  return EMOTIONS.every((e) => SITUATIONS.some((s) => s.emotion === e.id))
    && SITUATIONS.every((s) => ids.has(s.emotion));
})());

check('makeEmotionFromSituation: đáp án đúng cảm xúc của tình huống, 4 lựa chọn không trùng', (() => {
  for (let s = 0; s < 60; s++) {
    const q = makeEmotionFromSituation(rng(s));
    if (q.answer !== q.situation.emotion) return false;
    if (q.options.length !== 4 || new Set(q.options.map((o) => o.id)).size !== 4) return false;
    if (!q.options.some((o) => o.id === q.answer)) return false;
  }
  return true;
})());

check('makeSituationFromEmotion: tình huống đúng thuộc cảm xúc, 4 lựa chọn không trùng', (() => {
  for (let s = 0; s < 60; s++) {
    const q = makeSituationFromEmotion(rng(s));
    if (q.answer.emotion !== q.emotion.id) return false;
    if (q.options.length !== 4 || new Set(q.options.map((o) => o.text)).size !== 4) return false;
    if (!q.options.includes(q.answer)) return false;
  }
  return true;
})());

check('makeEmotionSet: nửa đầu s2e, nửa sau e2s', (() => {
  const set = makeEmotionSet(8, rng(3));
  return set.length === 8
    && set.slice(0, 4).every((q) => q.type === 's2e')
    && set.slice(4).every((q) => q.type === 'e2s');
})());

console.log('— Bé Tự Làm Được —');

check('5 thói quen, mỗi thói quen ≥3 bước', ROUTINES.length === 5 && ROUTINES.every((r) => r.steps.length >= 3));

check('makeRoutineRound: xáo đủ các bước, correctIndex tạo hoán vị 0..n-1', (() => {
  for (let s = 0; s < 60; s++) {
    const { routine, shuffled } = makeRoutineRound(rng(s));
    if (shuffled.length !== routine.steps.length) return false;
    const texts = new Set(shuffled.map((st) => st.text));
    if (texts.size !== routine.steps.length) return false;
    const indices = shuffled.map((st) => st.correctIndex).sort((a, b) => a - b);
    if (indices.join(',') !== routine.steps.map((_, i) => i).join(',')) return false;
    // correctIndex khớp đúng text ở đúng vị trí trong routine.steps gốc
    for (const st of shuffled) {
      if (routine.steps[st.correctIndex].text !== st.text) return false;
    }
  }
  return true;
})());

console.log('— An Toàn Cho Bé —');

check('đủ tình huống an toàn lẫn nguy hiểm, mỗi tình huống có lời giải thích', SAFETY_ITEMS.filter((it) => it.safe).length >= 6
  && SAFETY_ITEMS.filter((it) => !it.safe).length >= 6
  && SAFETY_ITEMS.every((it) => it.explain && it.explain.length > 5));

check('không trùng nội dung tình huống', new Set(SAFETY_ITEMS.map((it) => it.text)).size === SAFETY_ITEMS.length);

check('makeSafetySet: đúng số lượng, không trùng, có cả 2 loại', (() => {
  for (let s = 0; s < 30; s++) {
    const set = makeSafetySet(8, rng(s));
    if (set.length !== 8) return false;
    if (new Set(set.map((it) => it.text)).size !== 8) return false;
  }
  const set = makeSafetySet(8, rng(1));
  return set.some((it) => it.safe) && set.some((it) => !it.safe);
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
