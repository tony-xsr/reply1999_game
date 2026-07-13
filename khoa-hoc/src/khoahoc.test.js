// Unit test cho Khoa Học Khám Phá Vui. Chạy: node src/khoahoc.test.js

import {
  LIFE_CYCLES, makeLifeCycleRound,
  SEASONS, SEASON_ITEMS, makeSeasonFromItem, makeItemFromSeason, makeNatureSet,
  COLORS, MIXES, pairKey, makePredictQuestion, makeReverseQuestion, makeMixSet,
  FLOAT_ITEMS, makeFloatSet,
} from './khoahoc.js';

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

console.log('— Vòng Đời & Thiên Nhiên —');

check('4 vòng đời, mỗi vòng ≥3 giai đoạn không trùng', LIFE_CYCLES.length === 4
  && LIFE_CYCLES.every((c) => c.stages.length >= 3 && new Set(c.stages.map((s) => s.text)).size === c.stages.length));

check('makeLifeCycleRound: xáo đủ giai đoạn, correctIndex khớp đúng vị trí gốc', (() => {
  for (let s = 0; s < 40; s++) {
    for (const cycle of LIFE_CYCLES) {
      const { shuffled } = makeLifeCycleRound(cycle, rng(s));
      if (shuffled.length !== cycle.stages.length) return false;
      for (const st of shuffled) {
        if (cycle.stages[st.correctIndex].text !== st.text) return false;
      }
    }
  }
  return true;
})());

check('4 mùa, mọi hoạt động trỏ tới mùa hợp lệ, mỗi mùa ≥1 hoạt động', (() => {
  const ids = new Set(SEASONS.map((s) => s.id));
  return SEASONS.length === 4 && SEASON_ITEMS.every((it) => ids.has(it.season))
    && SEASONS.every((s) => SEASON_ITEMS.some((it) => it.season === s.id));
})());

check('makeSeasonFromItem: đáp án đúng mùa của hoạt động, đủ 4 lựa chọn (đúng số mùa)', (() => {
  for (let s = 0; s < 60; s++) {
    const q = makeSeasonFromItem(rng(s));
    if (q.answer !== q.item.season) return false;
    if (q.options.length !== 4 || new Set(q.options.map((o) => o.id)).size !== 4) return false;
  }
  return true;
})());

check('makeItemFromSeason: hoạt động đúng thuộc mùa, 4 lựa chọn không trùng', (() => {
  for (let s = 0; s < 60; s++) {
    const q = makeItemFromSeason(rng(s));
    if (q.answer.season !== q.season.id) return false;
    if (q.options.length !== 4 || new Set(q.options.map((o) => o.text)).size !== 4) return false;
    if (!q.options.includes(q.answer)) return false;
  }
  return true;
})());

check('makeNatureSet: 4 vòng đời không lặp lại + 4 câu đố mùa', (() => {
  const set = makeNatureSet(8, rng(3));
  const cycles = set.filter((q) => q.kind === 'cycle');
  const seasons = set.filter((q) => q.kind === 'season');
  return cycles.length === 4 && seasons.length === 4
    && new Set(cycles.map((c) => c.cycle.id)).size === 4;
})());

console.log('— Pha Màu Diệu Kỳ —');

check('mọi mã màu trong MIXES tồn tại trong bảng COLORS', MIXES.every(
  (m) => COLORS[m.a] && COLORS[m.b] && COLORS[m.result],
));

check('pairKey: không phân biệt thứ tự', pairKey(['red', 'blue']) === pairKey(['blue', 'red']));

check('makePredictQuestion: đáp án đúng màu ra, 3 lựa chọn không trùng, không lẫn màu gốc', (() => {
  for (let s = 0; s < 60; s++) {
    const q = makePredictQuestion(rng(s));
    if (q.answer !== q.mix.result) return false;
    if (q.options.length !== 3 || new Set(q.options).size !== 3) return false;
    if (!q.options.includes(q.answer)) return false;
    if (q.options.includes(q.mix.a) || q.options.includes(q.mix.b)) return false;
  }
  return true;
})());

check('makeReverseQuestion: đáp án đúng cặp màu gốc, 3 lựa chọn cặp không trùng', (() => {
  for (let s = 0; s < 60; s++) {
    const q = makeReverseQuestion(rng(s));
    if (pairKey(q.answer) !== pairKey([q.mix.a, q.mix.b])) return false;
    if (q.options.length !== 3) return false;
    const keys = q.options.map(pairKey);
    if (new Set(keys).size !== 3) return false;
    if (!keys.includes(pairKey(q.answer))) return false;
  }
  return true;
})());

check('makeMixSet: nửa đầu predict, nửa sau reverse', (() => {
  const set = makeMixSet(8, rng(5));
  return set.length === 8
    && set.slice(0, 4).every((q) => q.type === 'predict')
    && set.slice(4).every((q) => q.type === 'reverse');
})());

console.log('— Chìm Hay Nổi? —');

check('đủ vật chìm lẫn nổi, mỗi vật có lời giải thích', FLOAT_ITEMS.filter((it) => it.floats).length >= 5
  && FLOAT_ITEMS.filter((it) => !it.floats).length >= 5
  && FLOAT_ITEMS.every((it) => it.explain && it.explain.length > 5));

check('không trùng tên vật', new Set(FLOAT_ITEMS.map((it) => it.name)).size === FLOAT_ITEMS.length);

check('makeFloatSet: đúng số lượng, không trùng, có cả chìm lẫn nổi', (() => {
  for (let s = 0; s < 30; s++) {
    const set = makeFloatSet(8, rng(s));
    if (set.length !== 8 || new Set(set.map((it) => it.name)).size !== 8) return false;
  }
  const set = makeFloatSet(8, rng(1));
  return set.some((it) => it.floats) && set.some((it) => !it.floats);
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
