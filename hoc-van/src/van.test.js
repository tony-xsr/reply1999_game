// Unit test cho logic Học Vần. Chạy: node src/van.test.js

import { WORDS, splitSyllable, stripTone, spellParts, makeGhepVan, makeDienChu, makeNgheViet, CONFUSABLE } from './van.js';

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

console.log('— Tách tiếng & đánh vần —');

check('splitSyllable: phụ âm đơn, kép, gi/qu', (() => {
  const cases = [
    ['bò', 'b', 'ò'], ['trăng', 'tr', 'ăng'], ['nhà', 'nh', 'à'],
    ['khỉ', 'kh', 'ỉ'], ['giày', 'gi', 'ày'], ['thuyền', 'th', 'uyền'],
  ];
  return cases.every(([w, i, r]) => {
    const p = splitSyllable(w);
    return p.initial === i && p.rim === r;
  });
})());

check('stripTone: đủ 5 thanh + không thanh', (() => {
  return stripTone('ò').tone === 'huyền' && stripTone('ó').tone === 'sắc'
    && stripTone('õ').tone === 'ngã' && stripTone('ỏ').tone === 'hỏi'
    && stripTone('ọ').tone === 'nặng' && stripTone('o').tone === null
    && stripTone('ằng').base === 'ăng';
})());

check('spellParts "bò" → bờ, o, bo, huyền, bò',
  spellParts('bò').join(',') === 'bờ,o,bo,huyền,bò');

check('spellParts "trăng" (không thanh) → trờ, ăng, trăng',
  spellParts('trăng').join(',') === 'trờ,ăng,trăng');

check('spellParts "mèo" → mờ, eo, meo, huyền, mèo',
  spellParts('mèo').join(',') === 'mờ,eo,meo,huyền,mèo');

check('spellParts "vịt" → vờ, it, vit, nặng, vịt',
  spellParts('vịt').join(',') === 'vờ,it,vit,nặng,vịt');

check('mọi từ trong kho đều tách + đánh vần được', WORDS.every((it) => {
  const parts = spellParts(it.word);
  return it.emoji && parts.length >= 1 && parts.every((p) => p && p.length > 0);
}));

console.log('— Sinh câu hỏi —');

check('makeGhepVan: đáp án nằm trong 4 lựa chọn không trùng', (() => {
  for (let s = 0; s < 40; s++) {
    const q = makeGhepVan(WORDS, rng(s));
    if (q.options.length !== 4 || !q.options.includes(q.answer)) return false;
    if (new Set(q.options).size !== 4) return false;
    const p = splitSyllable(q.item.word);
    const expected = q.hide === 'initial' ? p.initial : p.rim;
    if (q.answer !== expected) return false;
  }
  return true;
})());

check('makeGhepVan: ép giấu phụ âm/vần theo yêu cầu',
  makeGhepVan(WORDS, rng(1), 'initial').hide === 'initial'
  && makeGhepVan(WORDS, rng(1), 'rim').hide === 'rim');

check('makeDienChu: chỗ trống đúng vị trí, đáp án trong nhóm dễ lẫn', (() => {
  for (let s = 0; s < 40; s++) {
    const q = makeDienChu(WORDS, rng(s));
    if (!q || !q.display.includes('_')) return false;
    if (!q.options.includes(q.answer)) return false;
    if (!CONFUSABLE.some((grp) => grp.includes(q.answer))) return false;
    const rebuilt = q.display.toLowerCase().replace('_', q.answer);
    if (rebuilt !== q.item.word.toLowerCase()) return false;
  }
  return true;
})());

check('makeNgheViet: bàn phím chứa đủ chữ của từ + 3 chữ nhiễu', (() => {
  for (let s = 0; s < 40; s++) {
    const q = makeNgheViet(WORDS, rng(s));
    if (q.letters.join('') !== q.item.word.toUpperCase()) return false;
    if (!q.letters.every((l) => q.keys.includes(l))) return false;
    if (q.keys.length !== new Set(q.letters).size + 3) return false;
  }
  return true;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
