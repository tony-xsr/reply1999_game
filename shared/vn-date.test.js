// Unit test cho vnDateKey (ngày theo giờ Việt Nam, dùng ở server).
// Chạy: node shared/vn-date.test.js

import { vnDateKey } from './vn-date.js';

let passed = 0;
let failed = 0;

function check(name, cond) {
  if (cond) { passed++; console.log(`  ✅ ${name}`); }
  else { failed++; console.error(`  ❌ ${name}`); }
}

console.log('— vnDateKey —');

check('00:30 UTC (07:30 VN) cùng ngày UTC → ra đúng ngày đó', (() => {
  return vnDateKey(new Date('2026-07-15T00:30:00Z')) === '2026-07-15';
})());

check('18:00 UTC (01:00 VN NGÀY HÔM SAU) → phải ra ngày VN kế tiếp, không phải ngày UTC', (() => {
  return vnDateKey(new Date('2026-07-15T18:00:00Z')) === '2026-07-16';
})());

check('23:59 UTC 31/12 (06:59 VN 1/1) → sang đúng năm mới theo giờ VN', (() => {
  return vnDateKey(new Date('2026-12-31T23:59:00Z')) === '2027-01-01';
})());

check('định dạng luôn YYYY-MM-DD, có số 0 đứng trước', (() => {
  return vnDateKey(new Date('2026-01-05T00:00:00Z')) === '2026-01-05';
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
