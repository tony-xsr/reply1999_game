// Unit test cho day-buffer.js (hàm thuần dùng để "dồn trước" nhiều ngày bài AI).
// Chạy: node shared/day-buffer.test.js

import { dateRange, missingDays } from './day-buffer.js';

let passed = 0;
let failed = 0;

function check(name, cond) {
  if (cond) { passed++; console.log(`  ✅ ${name}`); }
  else { failed++; console.error(`  ❌ ${name}`); }
}

console.log('— dateRange —');

check('sinh đúng N ngày liên tiếp, bắt đầu ĐÚNG từ startKey, tăng dần', (() => {
  const r = dateRange('2026-07-15', 5);
  return r.length === 5 && r[0] === '2026-07-15' && r[4] === '2026-07-19'
    && r.join(',') === '2026-07-15,2026-07-16,2026-07-17,2026-07-18,2026-07-19';
})());

check('bắc cầu qua cuối tháng/cuối năm đúng lịch dương', (() => {
  const r1 = dateRange('2026-01-30', 4);
  const r2 = dateRange('2026-12-30', 4);
  return r1.join(',') === '2026-01-30,2026-01-31,2026-02-01,2026-02-02'
    && r2.join(',') === '2026-12-30,2026-12-31,2027-01-01,2027-01-02';
})());

check('days=0 trả về mảng rỗng, days=1 trả về đúng 1 ngày', (() => {
  return dateRange('2026-07-15', 0).length === 0 && dateRange('2026-07-15', 1).join(',') === '2026-07-15';
})());

console.log('— missingDays —');

check('lọc đúng ngày còn thiếu, giữ nguyên thứ tự gần nhất trước', (() => {
  const want = ['2026-07-15', '2026-07-16', '2026-07-17', '2026-07-18'];
  const existing = ['2026-07-16', '2026-07-18'];
  const m = missingDays(want, existing);
  return m.join(',') === '2026-07-15,2026-07-17';
})());

check('không thiếu ngày nào → trả về mảng rỗng', (() => {
  const want = ['2026-07-15', '2026-07-16'];
  return missingDays(want, want).length === 0;
})());

check('cap giới hạn đúng số ngày trả về, vẫn ưu tiên ngày gần nhất', (() => {
  const want = dateRange('2026-07-15', 60); // 60 ngày, chưa có ngày nào
  const m = missingDays(want, [], 5);
  return m.length === 5 && m.join(',') === want.slice(0, 5).join(',');
})());

check('không truyền cap (mặc định Infinity) → trả về TẤT CẢ ngày thiếu', (() => {
  const want = dateRange('2026-07-15', 60);
  const m = missingDays(want, []);
  return m.length === 60;
})());

check('existingDays rỗng/không truyền vẫn hoạt động bình thường (mọi ngày đều thiếu)', (() => {
  const want = ['2026-07-15', '2026-07-16'];
  return missingDays(want, []).join(',') === want.join(',');
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
