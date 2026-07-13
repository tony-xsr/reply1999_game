// Unit test cho logic Nhảy Lò Cò. Chạy: node src/loco.test.js

import { MODES, makeCourse, COURT_ROWS, viNumber } from './loco.js';

let passed = 0;
let failed = 0;

function check(name, cond) {
  if (cond) { passed++; console.log(`  ✅ ${name}`); }
  else { failed++; console.error(`  ❌ ${name}`); }
}

console.log('— Nhảy Lò Cò —');

check('1→10: dãy 1..10', makeCourse('step1').join(',') === '1,2,3,4,5,6,7,8,9,10');
check('cách 2: dãy 2..20', makeCourse('step2').join(',') === '2,4,6,8,10,12,14,16,18,20');
check('cách 5: dãy 5..50', makeCourse('step5').join(',') === '5,10,15,20,25,30,35,40,45,50');

check('sân lò cò: 7 hàng đơn–đôi phủ đủ 10 ô 0..9', (() => {
  const all = COURT_ROWS.flat().sort((a, b) => a - b);
  return COURT_ROWS.length === 7 && all.join(',') === '0,1,2,3,4,5,6,7,8,9';
})());

check('viNumber: số cơ bản', viNumber(1) === 'một' && viNumber(5) === 'năm' && viNumber(10) === 'mười');
check('viNumber: 11..19', viNumber(14) === 'mười bốn' && viNumber(15) === 'mười lăm');
check('viNumber: tròn chục', viNumber(20) === 'hai mươi' && viNumber(50) === 'năm mươi');
check('viNumber: mốt & lăm', viNumber(21) === 'hai mươi mốt' && viNumber(45) === 'bốn mươi lăm');
check('mọi số trong 3 chế độ đều đọc được', ['step1', 'step2', 'step5'].every(
  (m) => makeCourse(m).every((n) => typeof viNumber(n) === 'string' && viNumber(n).length > 1),
));
check('MODES có nhãn cho cả 3 chế độ', Object.values(MODES).every((m) => m.label && m.step > 0));

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
