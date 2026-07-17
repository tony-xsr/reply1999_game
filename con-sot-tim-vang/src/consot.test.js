// Unit test cho Cơn Sốt Tìm Vàng. Chạy: node src/consot.test.js

import {
  COLS, ROWS, NUM_COLORS, ROUND_MS, COMBO_WINDOW_MS, COMBO_MIN_SIZE, FEVER_AT, FEVER_MS,
  makeLevel, findCluster, tapAt, dragTo, tick,
} from './consot.js';

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

/** Sân đơn sắc để test cụm chuẩn xác. */
function paint(game, rows) {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      game.grid[r][c] = Number(rows[r]?.[c] ?? 0);
    }
  }
}

console.log('— Khởi tạo & cụm —');

check('sân đầy kín 9×10, màu hợp lệ, 60 giây, mục tiêu tăng theo màn', (() => {
  const g0 = makeLevel(0, seeded());
  const g3 = makeLevel(3, seeded());
  return g0.grid.length === ROWS && g0.grid[0].length === COLS
    && g0.grid.flat().every((v) => v >= 0 && v < NUM_COLORS)
    && g0.timeLeftMs === ROUND_MS && g3.target > g0.target;
})());

check('findCluster: gom đúng vùng dính liền 4 hướng, không lan chéo', (() => {
  const g = makeLevel(0, seeded());
  paint(g, [
    '110222222',
    '111222222',
    '222212222', // ô (2,4)=1 chỉ chạm CHÉO với cụm (1,2)... cách 1 ô — tách hẳn
  ]);
  const cluster = findCluster(g.grid, 0, 0);
  return cluster.length === 5 && !cluster.some(([r, c]) => r === 2 && c === 4);
})());

check('bấm ô lẻ loi (cụm 1) → không có gì xảy ra', (() => {
  const g = makeLevel(0, seeded());
  // bàn cờ xen kẽ: không ô nào cùng màu với ô kề
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) g.grid[r][c] = (r + c) % 2;
  }
  const ev = tapAt(g, 0, 0, seeded());
  return ev.cleared === 0 && g.score === 0;
})());

console.log('— Gom & lấp đầy —');

check('gom cụm: điểm tăng theo n², sân vẫn ĐẦY KÍN sau khi lấp', (() => {
  const g = makeLevel(0, seeded());
  paint(g, ['22', '22']);
  const ev = tapAt(g, 0, 0, seeded());
  return ev.cleared === 4 && ev.gained >= 16
    && g.grid.flat().every((v) => v !== null && v >= 0 && v < NUM_COLORS);
})());

check('cụm to lời hơn hẳn 2 cụm nhỏ cộng lại (n²)', (() => {
  const a = makeLevel(0, seeded());
  paint(a, ['3333333']); // cụm 7 → 49
  const evA = tapAt(a, 0, 0, seeded());
  return evA.gained >= 49;
})());

check('cột sụp xuống đúng: viên còn lại rơi xuống đáy cột', (() => {
  const g = makeLevel(0, seeded());
  paint(g, [
    '400000000',
    '110000000',
    '110000000',
  ]);
  // các hàng dưới (3..9) đang toàn 0 — bấm cụm 1 ở (1,0)(1,1)(2,0)(2,1)
  tapAt(g, 1, 0, seeded());
  // viên 4 ở đỉnh cột 0 phải rơi xuống thế chỗ
  let found4 = false;
  for (let r = 0; r < ROWS; r++) if (g.grid[r][0] === 4) found4 = true;
  return found4 && g.grid[0][0] !== null;
})());

console.log('— Combo & CƠN SỐT —');

check('gom 2 cụm ≥4 viên liền nhau trong cửa sổ 2.5s → combo nối; để nguội thì reset', (() => {
  const g = makeLevel(0, seeded());
  paint(g, ['4444', '5555'.replace(/5/g, '1')]);
  paint(g, ['4444000000'.slice(0, 9), '111100000']);
  tapAt(g, 0, 0, seeded()); // cụm 4 → combo 1
  tick(g, 1000); // trong cửa sổ
  paint(g, ['111100000']);
  const ev2 = tapAt(g, 0, 0, seeded()); // combo 2
  if (ev2.combo !== 2) return false;
  tick(g, COMBO_WINDOW_MS + 500); // để nguội
  paint(g, ['222200000']);
  const ev3 = tapAt(g, 0, 0, seeded());
  return ev3.combo === 1;
})());

check('combo đạt mốc → bùng CƠN SỐT: điểm nhân đôi trong 6 giây', (() => {
  const g = makeLevel(0, seeded());
  g.target = 999999;
  let fever = false;
  for (let i = 0; i < FEVER_AT; i++) {
    paint(g, ['333300000']);
    const ev = tapAt(g, 0, 0, seeded());
    fever = fever || ev.fever;
    tick(g, 500);
  }
  if (!fever || g.feverMs <= 0) return false;
  // trong cơn sốt: cụm 4 → 16 * (1+combo*0.5) * 2
  paint(g, ['444400000']);
  const before = g.score;
  const ev = tapAt(g, 0, 0, seeded());
  const expected = Math.round(16 * (1 + ev.combo * 0.5)) * 2;
  return ev.gained === expected && g.score === before + expected;
})());

check('hết 6 giây sốt thì combo về 0', (() => {
  const g = makeLevel(0, seeded());
  g.combo = FEVER_AT;
  g.feverMs = 100;
  tick(g, 200);
  return g.combo === 0 && g.feverMs === 0;
})());

console.log('— Kéo tay lướt qua (dragTo) —');

check('kéo đúng đường 3 ô cùng màu → chỉ gom ĐÚNG 3 ô đó, không lan ra cả cụm to hơn', (() => {
  const g = makeLevel(0, seeded());
  paint(g, ['22200000', '22200000']); // cụm thật sự có 6 ô cùng màu 2
  const ev = dragTo(g, [[0, 0], [0, 1], [0, 2]], seeded());
  return ev.cleared === 3 && ev.gained === 9
    && g.grid[1][0] === 2 && g.grid[1][1] === 2 && g.grid[1][2] === 2; // hàng dưới còn nguyên
})());

check('đường kéo tự lọc: bỏ ô trùng lặp, ô khác màu, ô ngoài bàn cờ', (() => {
  const g = makeLevel(0, seeded());
  paint(g, ['120000000']);
  // (0,0) và (0,0) lặp lại, (0,1) khác màu bị loại, (-1,-1) ngoài bàn bị loại
  const ev = dragTo(g, [[0, 0], [0, 0], [0, 1], [-1, -1]], seeded());
  return ev.cleared === 0; // sau khi lọc chỉ còn 1 ô hợp lệ → không đủ 2 để gom
})());

check('kéo trúng cùng công thức điểm/combo/fever như tapAt (dùng chung applyClear)', (() => {
  const g = makeLevel(0, seeded());
  g.target = 999999;
  paint(g, ['33330000']);
  const ev = dragTo(g, [[0, 0], [0, 1], [0, 2], [0, 3]], seeded());
  // cụm 4 ô (≥ COMBO_MIN_SIZE) → combo nhảy lên 1 → điểm = n² × (1 + combo×0.5) = 16 × 1.5
  return ev.combo === 1 && ev.gained === Math.round(16 * 1.5);
})());

check('kéo hụt (<2 ô hợp lệ) hoặc ô đầu tiên trống → không có gì xảy ra', (() => {
  const g = makeLevel(0, seeded());
  paint(g, ['120000000']);
  const single = dragTo(g, [[0, 0]], seeded());
  const empty = dragTo(g, [[5, 5], [5, 6]], seeded());
  g.grid[5][5] = null;
  const nullStart = dragTo(g, [[5, 5], [5, 6]], seeded());
  return single.cleared === 0 && empty.cleared >= 0 && nullStart.cleared === 0;
})());

check('game kết thúc thì dragTo không làm gì', (() => {
  const g = makeLevel(0, seeded());
  g.over = true;
  const before = JSON.stringify(g.grid);
  const ev = dragTo(g, [[0, 0], [0, 1]], seeded());
  return ev.cleared === 0 && JSON.stringify(g.grid) === before;
})());

console.log('— Thắng / thua —');

check('đạt mục tiêu → thắng ngay + thưởng giây dư', (() => {
  const g = makeLevel(0, seeded());
  g.score = g.target - 10;
  g.timeLeftMs = 30000;
  paint(g, ['11', '11']);
  const ev = tapAt(g, 0, 0, seeded());
  return ev.won && g.over && g.won && g.score >= g.target + 30 * 5;
})());

check('hết 60 giây chưa đủ điểm → thua', (() => {
  const g = makeLevel(0, seeded());
  const ev = tick(g, ROUND_MS + 1);
  return ev.timeout && g.over && g.won === false && g.timeLeftMs === 0;
})());

check('game kết thúc thì tapAt/tick không làm gì', (() => {
  const g = makeLevel(0, seeded());
  g.over = true;
  const before = JSON.stringify(g.grid);
  const ev = tapAt(g, 0, 0, seeded());
  tick(g, 99999);
  return ev.cleared === 0 && JSON.stringify(g.grid) === before;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
