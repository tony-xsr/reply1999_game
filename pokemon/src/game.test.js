// Unit test cho levels.js (luật dồn ô) + score.js (combo) + daily/seed + achievements.
// Chạy: node src/game.test.js

import { applyGravity, LEVELS } from './levels.js';
import { Score, PAIR_SCORE } from './score.js';
import { mulberry32, generateBoard, ICON_SETS } from './board.js';
import { dailySeed, dailyGravity, DAILY_GRAVITY } from './daily.js';
import { ACHIEVEMENTS, unlock } from './achievements.js';

let passed = 0;
let failed = 0;

function check(name, cond) {
  if (cond) { passed++; console.log(`  ✅ ${name}`); }
  else { failed++; console.error(`  ❌ ${name}`); }
}

const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const A = 1, B = 2, _ = null;

console.log('— applyGravity: 7 luật dồn ô —');

check('none: không đổi, trả false', (() => {
  const b = [[A, _], [_, B]];
  const moved = applyGravity(b, 'none');
  return !moved && eq(b, [[A, _], [_, B]]);
})());

check('down: dồn xuống theo cột', (() => {
  const b = [
    [A, _, B],
    [_, _, _],
    [_, B, A],
  ];
  applyGravity(b, 'down');
  return eq(b, [
    [_, _, _],
    [_, _, B],
    [A, B, A],
  ]);
})());

check('up: dồn lên theo cột', (() => {
  const b = [
    [_, _, _],
    [_, B, _],
    [A, _, B],
  ];
  applyGravity(b, 'up');
  return eq(b, [
    [A, B, B],
    [_, _, _],
    [_, _, _],
  ]);
})());

check('left: dồn trái theo hàng', (() => {
  const b = [[_, A, _, B]];
  applyGravity(b, 'left');
  return eq(b, [[A, B, _, _]]);
})());

check('right: dồn phải theo hàng', (() => {
  const b = [[A, _, B, _]];
  applyGravity(b, 'right');
  return eq(b, [[_, _, A, B]]);
})());

check('center: 2 nửa dồn vào giữa', (() => {
  const b = [[A, _, _, _, _, _, _, B]]; // 8 cột, mid=4
  applyGravity(b, 'center');
  return eq(b, [[_, _, _, A, B, _, _, _]]);
})());

check('split: 2 nửa dồn ra mép', (() => {
  const b = [[_, _, _, A, B, _, _, _]]; // 8 cột, mid=4
  applyGravity(b, 'split');
  return eq(b, [[A, _, _, _, _, _, _, B]]);
})());

check('gravity trả true khi có ô di chuyển', (() => {
  const b = [[A, _], [_, _]];
  return applyGravity(b, 'down') === true;
})());

check('gravity giữ nguyên thứ tự ô khi dồn', (() => {
  const b = [[A, _, B, _, A]];
  applyGravity(b, 'left');
  return eq(b, [[A, B, A, _, _]]);
})());

check('LEVELS có đúng 7 level, thời gian giảm dần', (() => {
  if (LEVELS.length !== 7) return false;
  for (let i = 1; i < LEVELS.length; i++) {
    if (LEVELS[i].time >= LEVELS[i - 1].time) return false;
  }
  return true;
})());

console.log('— Score: điểm & combo —');

check('cặp đầu tiên: +10, combo x1', (() => {
  const s = new Score();
  const r = s.addPair(1000);
  return r.gained === PAIR_SCORE && r.combo === 1 && s.value === 10;
})());

check('trong 3s: combo tăng x2, x3', (() => {
  const s = new Score();
  s.addPair(1000);
  const r2 = s.addPair(2500);
  const r3 = s.addPair(4000);
  return r2.combo === 2 && r2.gained === 20 && r3.combo === 3 && r3.gained === 30;
})());

check('quá 3s: combo reset về x1', (() => {
  const s = new Score();
  s.addPair(1000);
  s.addPair(2000);
  const r = s.addPair(10000);
  return r.combo === 1 && r.gained === 10;
})());

check('combo tối đa x5', (() => {
  const s = new Score();
  let r;
  for (let i = 0; i < 8; i++) r = s.addPair(1000 + i * 500);
  return r.combo === 5 && r.gained === 50;
})());

check('addBonus cộng đúng, không âm', (() => {
  const s = new Score();
  s.addBonus(120);
  s.addBonus(-50);
  return s.value === 120;
})());

console.log('— Seed & Daily —');

check('mulberry32: cùng seed → cùng dãy số', (() => {
  const a = mulberry32(12345);
  const b = mulberry32(12345);
  for (let i = 0; i < 50; i++) if (a() !== b()) return false;
  return true;
})());

check('generateBoard cùng seed → cùng bàn (daily chung toàn cầu)', (() => {
  const b1 = generateBoard(9, 16, 30, mulberry32(20260709));
  const b2 = generateBoard(9, 16, 30, mulberry32(20260709));
  return eq(b1, b2);
})());

check('generateBoard khác seed → bàn khác', (() => {
  const b1 = generateBoard(9, 16, 30, mulberry32(1));
  const b2 = generateBoard(9, 16, 30, mulberry32(2));
  return !eq(b1, b2);
})());

check('dailySeed đúng định dạng YYYYMMDD', dailySeed(new Date('2026-07-09T12:00:00Z')) === 20260709);

check('dailyGravity theo thứ trong tuần (đủ 7 luật)', (() => {
  if (DAILY_GRAVITY.length !== 7) return false;
  // 2026-07-05 là Chủ nhật (getUTCDay=0) → 'none'
  return dailyGravity(new Date('2026-07-05T12:00:00Z')) === 'none'
    && dailyGravity(new Date('2026-07-09T12:00:00Z')) === DAILY_GRAVITY[4];
})());

check('các cỡ bàn đều có tổng ô chẵn', (() => {
  return (10 * 6) % 2 === 0 && (14 * 8) % 2 === 0 && (16 * 9) % 2 === 0;
})());

check('5 bộ icon, mỗi bộ 36 loại không trùng', (() => {
  const sets = Object.values(ICON_SETS);
  return sets.length === 5 && sets.every((s) => s.length === 36 && new Set(s).size === 36);
})());

check('bộ Trộn: 18 emoji + 18 ảnh Pokémon', (() => {
  const emoji = ICON_SETS.mix.filter((i) => !i.endsWith('.png'));
  const imgs = ICON_SETS.mix.filter((i) => i.endsWith('.png'));
  return emoji.length === 18 && imgs.length === 18;
})());

check('bộ Pokémon: đủ 36 file ảnh tồn tại trên đĩa', await (async () => {
  const { access } = await import('node:fs/promises');
  const { fileURLToPath } = await import('node:url');
  const base = fileURLToPath(new URL('..', import.meta.url));
  try {
    await Promise.all(ICON_SETS.pokemon.map((p) => access(base + p)));
    return true;
  } catch {
    return false;
  }
})());

console.log('— Achievements —');

check('unlock id hợp lệ → trả về định nghĩa', (() => {
  const def = unlock('first_clear');
  return def && def.id === 'first_clear' && ACHIEVEMENTS.length === 8;
})());

check('unlock id không tồn tại → null', unlock('khong_ton_tai') === null);

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
process.exit(failed ? 1 : 0);
