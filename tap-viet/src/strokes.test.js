// Unit test cho dữ liệu nét viết. Chạy: node src/strokes.test.js

import { GLYPHS, BASE_GLYPHS, BASIC_STROKES, EN_WORDS, nameToGlyphs, arc } from './strokes.js';

let passed = 0;
let failed = 0;

function check(name, cond) {
  if (cond) { passed++; console.log(`  ✅ ${name}`); }
  else { failed++; console.error(`  ❌ ${name}`); }
}

console.log('— Dữ liệu nét viết —');

const AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
check('đủ 26 chữ A–Z', AZ.every((ch) => BASE_GLYPHS[ch]?.length >= 1));

const VN_EXTRA = ['Ă', 'Â', 'Đ', 'Ê', 'Ô', 'Ơ', 'Ư'];
check('đủ 7 chữ có dấu tiếng Việt', VN_EXTRA.every((ch) => GLYPHS[ch]?.length >= 2));

check('chữ có dấu = nhiều nét hơn chữ gốc (thêm nét dấu)',
  GLYPHS['Ă'].length > BASE_GLYPHS.A.length && GLYPHS['Đ'].length === BASE_GLYPHS.D.length + 1);

check('mọi điểm nằm trong khung 0..100', Object.values(GLYPHS).every(
  (strokes) => strokes.every((s) => s.every(([x, y]) => x >= 0 && x <= 100 && y >= 0 && y <= 100)),
));

check('mỗi nét có ít nhất 2 điểm và có độ dài', Object.values(GLYPHS).every(
  (strokes) => strokes.every((s) => {
    if (s.length < 2) return false;
    let len = 0;
    for (let i = 1; i < s.length; i++) len += Math.hypot(s[i][0] - s[i - 1][0], s[i][1] - s[i - 1][1]);
    return len > 10;
  }),
));

check('8 nét cơ bản, có tên tiếng Việt', BASIC_STROKES.length === 8 && BASIC_STROKES.every((b) => b.name && b.strokes.length));

check('đủ 26 từ tiếng Anh kèm emoji', AZ.every((ch) => EN_WORDS[ch]?.word && EN_WORDS[ch]?.emoji));

check('arc: đủ số điểm, đúng điểm đầu/cuối', (() => {
  const a = arc(50, 50, 10, 10, 0, 90, 4);
  return a.length === 5
    && Math.abs(a[0][0] - 60) < 1e-9 && Math.abs(a[0][1] - 50) < 1e-9
    && Math.abs(a[4][0] - 50) < 1e-9 && Math.abs(a[4][1] - 60) < 1e-9;
})());

console.log('— Chuẩn hóa tên bé —');

check('"Bống" → B Ô N G (bỏ dấu thanh, giữ dấu chữ)',
  nameToGlyphs('Bống').join('') === 'BÔNG');

check('"Trần Đức" → T R Â N Đ Ư C (bỏ khoảng trắng, giữ Đ Â Ư)',
  nameToGlyphs('Trần Đức').join('') === 'TRÂNĐƯC');

check('tên rỗng/ký tự lạ → mảng rỗng', nameToGlyphs('!@# 123').length === 0);

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
