// Unit test cho phần thuần logic của bài tập nối từ vựng (Luyện Dịch).
// Chạy: node exam-prep/src/translate.test.js

import { shuffleVocabColumns, vocabAnswerKey, isCorrectMatch } from './translate.js';

let passed = 0;
let failed = 0;

function check(name, cond) {
  if (cond) { passed++; console.log(`  ✅ ${name}`); }
  else { failed++; console.error(`  ❌ ${name}`); }
}

function seeded(seed = 1) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
}

const VOCAB = [
  { word: 'garden', vi: 'khu vườn' },
  { word: 'water', vi: 'tưới nước' },
  { word: 'flower', vi: 'bông hoa' },
  { word: 'sunny', vi: 'nắng ráo' },
  { word: 'happy', vi: 'vui vẻ' },
];

console.log('— shuffleVocabColumns —');

check('giữ đủ số phần tử ở cả 2 cột, đúng nội dung (chỉ đổi thứ tự)', (() => {
  const { words, meanings } = shuffleVocabColumns(VOCAB, seeded(1));
  return words.length === 5 && meanings.length === 5
    && new Set(words).size === 5 && new Set(meanings).size === 5
    && VOCAB.every((v) => words.includes(v.word) && meanings.includes(v.vi));
})());

check('2 seed khác nhau cho thứ tự khác nhau (không phải trùng hợp luôn giữ nguyên)', (() => {
  const a = shuffleVocabColumns(VOCAB, seeded(1));
  const b = shuffleVocabColumns(VOCAB, seeded(42));
  return a.words.join(',') !== b.words.join(',') || a.meanings.join(',') !== b.meanings.join(',');
})());

check('không sửa đổi mảng vocab gốc truyền vào', (() => {
  const before = JSON.stringify(VOCAB);
  shuffleVocabColumns(VOCAB, seeded(7));
  return JSON.stringify(VOCAB) === before;
})());

console.log('— vocabAnswerKey / isCorrectMatch —');

check('vocabAnswerKey: tra đúng nghĩa của từng từ', (() => {
  const key = vocabAnswerKey(VOCAB);
  return key.get('garden') === 'khu vườn' && key.get('happy') === 'vui vẻ' && key.size === 5;
})());

check('isCorrectMatch: đúng cặp trả về true, sai cặp trả về false', (() => {
  return isCorrectMatch(VOCAB, 'garden', 'khu vườn') === true
    && isCorrectMatch(VOCAB, 'garden', 'vui vẻ') === false
    && isCorrectMatch(VOCAB, 'khong-co-tu-nay', 'khu vườn') === false;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
