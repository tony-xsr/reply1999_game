// Unit test cho Tiếng Anh Nâng Cao. Chạy: node src/tienganh.test.js

import { SENTENCES, makeSentenceSet, PRONOUNCE_ITEMS, makePronounceSet } from './tienganh.js';

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

console.log('— Ghép Câu Đơn Giản —');

check('≥12 câu, mỗi câu 3–4 từ, có emoji minh họa', SENTENCES.length >= 12
  && SENTENCES.every((s) => s.words.length >= 3 && s.words.length <= 4 && s.emoji));

check('không có câu trùng nhau', new Set(SENTENCES.map((s) => s.words.join(' '))).size === SENTENCES.length);

check('makeSentenceSet: 8 câu không lặp lại, xáo đủ từ, correctIndex khớp đúng vị trí gốc', (() => {
  for (let s = 0; s < 40; s++) {
    const set = makeSentenceSet(8, rng(s));
    if (set.length !== 8) return false;
    if (new Set(set.map((r) => r.sentence.words.join(' '))).size !== 8) return false;
    for (const { sentence, shuffled } of set) {
      if (shuffled.length !== sentence.words.length) return false;
      for (const tile of shuffled) {
        if (sentence.words[tile.correctIndex] !== tile.word) return false;
      }
    }
  }
  return true;
})());

console.log('— Phát Âm Theo Tôi —');

check('26 từ A–Z, mỗi từ có chữ cái + từ + emoji', PRONOUNCE_ITEMS.length === 26
  && PRONOUNCE_ITEMS.every((it) => it.letter && it.word && it.emoji)
  && PRONOUNCE_ITEMS.map((it) => it.letter).join('') === 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');

check('makePronounceSet: đúng số lượng, không trùng', (() => {
  for (let s = 0; s < 30; s++) {
    const set = makePronounceSet(8, rng(s));
    if (set.length !== 8) return false;
    if (new Set(set.map((it) => it.word)).size !== 8) return false;
  }
  return true;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
