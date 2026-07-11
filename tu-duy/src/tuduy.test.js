// Unit test cho 6 trò Luyện Tư Duy. Chạy: node src/tuduy.test.js

import {
  makeMaze, canGo, mazeSolvable, WALL,
  makeSudoku, countSolutions,
  makeSpotDiff, DOT_SHAPES, makeOddOneOut,
  createHanoi, moveHanoi, isHanoiDone, hanoiOptimal,
} from './tuduy.js';

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

console.log('— Mê cung —');

check('mọi cỡ mê cung đều đi tới đích được (30 seed)', (() => {
  for (let s = 1; s <= 30; s++) {
    for (const [c, r] of [[7, 7], [11, 9], [15, 11]]) {
      if (!mazeSolvable(makeMaze(c, r, rng(s * 7 + c)))) return false;
    }
  }
  return true;
})());

check('tường 2 chiều khớp nhau: A mở sang B thì B mở về A', (() => {
  const m = makeMaze(9, 9, rng(3));
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 8; x++) {
      if (canGo(m, x, y, 'E') !== canGo(m, x + 1, y, 'W')) return false;
    }
  }
  return true;
})());

check('viền ngoài luôn kín', (() => {
  const m = makeMaze(9, 7, rng(5));
  for (let x = 0; x < 9; x++) {
    if (canGo(m, x, 0, 'N') || canGo(m, x, 6, 'S')) return false;
  }
  for (let y = 0; y < 7; y++) {
    if (canGo(m, 0, y, 'W') || canGo(m, 8, y, 'E')) return false;
  }
  return true;
})());

console.log('— Sudoku bé —');

check('4×4 và 6×6: nghiệm hợp lệ + đề nghiệm DUY NHẤT (10 seed)', (() => {
  for (let s = 1; s <= 10; s++) {
    for (const size of [4, 6]) {
      const { solution, puzzle } = makeSudoku(size, rng(s * 13 + size));
      // nghiệm: mỗi hàng/cột đủ 1..size
      for (let i = 0; i < size; i++) {
        const row = new Set();
        const col = new Set();
        for (let j = 0; j < size; j++) {
          row.add(solution[i * size + j]);
          col.add(solution[j * size + i]);
        }
        if (row.size !== size || col.size !== size) return false;
      }
      if (countSolutions(puzzle, size) !== 1) return false;
      // đề là tập con của nghiệm
      if (!puzzle.every((v, i) => v === 0 || v === solution[i])) return false;
    }
  }
  return true;
})());

console.log('— Tìm điểm khác —');

check('đúng số điểm khác, các ô khác thật sự khác', (() => {
  const pool = ['🐱', '🐶', '🐔', '🐟', '🐘', '🐰'];
  for (let s = 0; s < 30; s++) {
    const q = makeSpotDiff(pool, 4, 4, rng(s));
    if (q.diffs.size !== 4) return false;
    for (let i = 0; i < 16; i++) {
      const differs = q.left[i] !== q.right[i];
      if (differs !== q.diffs.has(i)) return false;
    }
  }
  return true;
})());

console.log('— Nối số thành hình —');

check('5 hình, mỗi hình ≥7 chấm, tọa độ trong khung 0..100', DOT_SHAPES.length === 5
  && DOT_SHAPES.every((sh) => sh.points.length >= 7 && sh.emoji
    && sh.points.every(([x, y]) => x >= 0 && x <= 100 && y >= 0 && y <= 100)));

console.log('— Khác nhóm —');

check('3 cùng chủ đề + 1 khác, oddIndex đúng', (() => {
  const topics = [
    { id: 'a', vi: 'Động vật', items: [{ vi: 'mèo', emoji: '🐱' }, { vi: 'chó', emoji: '🐶' }, { vi: 'gà', emoji: '🐔' }, { vi: 'cá', emoji: '🐟' }] },
    { id: 'b', vi: 'Trái cây', items: [{ vi: 'táo', emoji: '🍎' }, { vi: 'chuối', emoji: '🍌' }, { vi: 'nho', emoji: '🍇' }] },
    { id: 'c', vi: 'Đồ vật', items: [{ vi: 'ô tô', emoji: '🚗' }, { vi: 'nhà', emoji: '🏠' }, { vi: 'ghế', emoji: '🪑' }] },
  ];
  for (let s = 0; s < 30; s++) {
    const q = makeOddOneOut(topics, rng(s));
    if (q.items.length !== 4) return false;
    const odd = q.items[q.oddIndex];
    if (odd.topic.id !== q.oddTopic.id) return false;
    const rest = q.items.filter((_, i) => i !== q.oddIndex);
    if (!rest.every((it) => it.topic.id === q.groupTopic.id)) return false;
    if (q.groupTopic.id === q.oddTopic.id) return false;
  }
  return true;
})());

console.log('— Tháp Hà Nội —');

check('luật: không đặt bánh to lên bánh nhỏ, cọc rỗng không bốc được', (() => {
  const h = createHanoi(3);
  if (moveHanoi(h, 1, 2) !== 'empty') return false;
  if (moveHanoi(h, 0, 1) !== 'ok') return false;        // bánh 1 → cọc B
  if (moveHanoi(h, 0, 1) !== 'bigOnSmall') return false; // bánh 2 đè bánh 1: cấm
  return h.moves === 1;
})());

check('giải 3 tầng đúng 7 nước tối ưu → xong', (() => {
  const h = createHanoi(3);
  const seq = [[0, 2], [0, 1], [2, 1], [0, 2], [1, 0], [1, 2], [0, 2]];
  for (const [f, t] of seq) {
    if (moveHanoi(h, f, t) !== 'ok') return false;
  }
  return isHanoiDone(h) && h.moves === hanoiOptimal(3);
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
