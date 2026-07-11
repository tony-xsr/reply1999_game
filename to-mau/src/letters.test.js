// Unit test cho dữ liệu game Tô Màu. Chạy: node to-mau/src/letters.test.js

import { LETTERS, DIGITS, COUNT_WORDS, PALETTE, BY_NUMBER_COLORS } from './letters.js';

let passed = 0;
let failed = 0;

function check(name, cond) {
  if (cond) { passed++; console.log(`  ✅ ${name}`); }
  else { failed++; console.error(`  ❌ ${name}`); }
}

console.log('— Dữ liệu Tô Màu —');

const VN_ALPHABET = 'A Ă Â B C D Đ E Ê G H I K L M N O Ô Ơ P Q R S T U Ư V X Y'.split(' ');

check('đủ 29 chữ cái tiếng Việt, đúng thứ tự bảng chữ cái',
  LETTERS.length === 29 && LETTERS.every((l, i) => l.ch === VN_ALPHABET[i]));

check('mỗi chữ có từ minh họa + emoji',
  LETTERS.every((l) => l.word && l.emoji));

check('đủ 10 chữ số 0–9, đúng thứ tự',
  DIGITS.length === 10 && DIGITS.every((d, i) => d.ch === String(i)));

check('số 1–9 có con vật để đếm, số 0 thì không',
  DIGITS[0].animal === null && DIGITS.slice(1).every((d) => d.animal));

check('đủ số đếm tiếng Việt 0–9',
  COUNT_WORDS.length === 10 && COUNT_WORDS[1] === 'một' && COUNT_WORDS[9] === 'chín');

check('bảng màu: mã hex hợp lệ, không trùng',
  PALETTE.every((p) => /^#[0-9a-f]{6}$/.test(p.hex))
  && new Set(PALETTE.map((p) => p.hex)).size === PALETTE.length);

check('tẩy (trắng) nằm cuối khay — không lọt vào bộ màu tô-theo-số',
  PALETTE[PALETTE.length - 1].id === 'white' && BY_NUMBER_COLORS < PALETTE.length);

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
