// Unit test cho Đào Hầm Vàng. Chạy: node src/daohamvang.test.js

import { ROWS, COLS, makeLevel, isValidPath, applyPath } from './daohamvang.js';

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

console.log('— Dựng màn —');

check('bàn đúng kích thước, bóng xuất phát góc trên trái, đích ở góc dưới phải', (() => {
  const g = makeLevel(0, seeded());
  return g.grid.length === ROWS && g.grid[0].length === COLS
    && g.ball.r === 0 && g.ball.c === 0 && g.goal.r === ROWS - 1 && g.goal.c === COLS - 1
    && g.stepsLeft === 16 && !g.over;
})());

check('luôn tồn tại ít nhất 1 đường đi từ xuất phát tới đích (test nhiều seed/màn)', (() => {
  for (let seed = 1; seed <= 40; seed++) {
    for (const lvl of [0, 3, 8, 15]) {
      const g = makeLevel(lvl, seeded(seed));
      // BFS lại thủ công để chắc chắn màn luôn giải được
      const seen = new Set(['0,0']);
      const queue = [g.ball];
      let reached = false;
      while (queue.length) {
        const { r, c } = queue.shift();
        if (r === g.goal.r && c === g.goal.c) { reached = true; break; }
        for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
          const nr = r + dr; const nc = c + dc;
          if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
          if (g.grid[nr][nc] === 'obstacle') continue;
          const key = `${nr},${nc}`;
          if (seen.has(key)) continue;
          seen.add(key);
          queue.push({ r: nr, c: nc });
        }
      }
      if (!reached) return false;
    }
  }
  return true;
})());

check('vàng và chướng ngại vật không đè lên ô xuất phát/đích', (() => {
  const g = makeLevel(5, seeded(3));
  return g.grid[0][0] !== 'obstacle' && g.grid[ROWS - 1][COLS - 1] !== 'obstacle'
    && !g.coins.has('0,0') && !g.coins.has(`${ROWS - 1},${COLS - 1}`);
})());

console.log('— Vẽ đường hợp lệ —');

check('đường liền kề hợp lệ, không xuyên chướng ngại → hợp lệ', (() => {
  const g = makeLevel(0, seeded());
  g.grid = g.grid.map((row) => row.map(() => 'empty'));
  const path = [[0, 0], [0, 1], [1, 1], [2, 1]];
  return isValidPath(g, path) === true;
})());

check('đường không bắt đầu đúng vị trí bóng → không hợp lệ', (() => {
  const g = makeLevel(0, seeded());
  return isValidPath(g, [[1, 1], [1, 2]]) === false;
})());

check('nhảy cách ô (không liền kề) → không hợp lệ', (() => {
  const g = makeLevel(0, seeded());
  return isValidPath(g, [[0, 0], [2, 0]]) === false;
})());

check('đi xuyên qua ô chướng ngại vật → không hợp lệ', (() => {
  const g = makeLevel(0, seeded());
  g.grid = g.grid.map((row) => row.map(() => 'empty'));
  g.grid[0][1] = 'obstacle';
  return isValidPath(g, [[0, 0], [0, 1]]) === false;
})());

check('tự cắt lại đường đã đi (quay lại ô cũ) → không hợp lệ', (() => {
  const g = makeLevel(0, seeded());
  g.grid = g.grid.map((row) => row.map(() => 'empty'));
  return isValidPath(g, [[0, 0], [0, 1], [1, 1], [0, 1]]) === false;
})());

console.log('— Cho bóng lăn theo đường —');

check('lăn theo đường hợp lệ: bóng tới đúng ô cuối, trừ đúng số bước', (() => {
  const g = makeLevel(0, seeded());
  g.grid = g.grid.map((row) => row.map(() => 'empty'));
  const before = g.stepsLeft;
  const result = applyPath(g, [[0, 0], [0, 1], [0, 2]]);
  return result.moved === 2 && g.ball.r === 0 && g.ball.c === 2 && g.stepsLeft === before - 2;
})());

check('lăn qua ô có vàng thì nhặt được, lăn lại lần 2 không tính thêm', (() => {
  const g = makeLevel(0, seeded());
  g.grid = g.grid.map((row) => row.map(() => 'empty'));
  g.coins = new Set(['0,1']);
  const first = applyPath(g, [[0, 0], [0, 1]]);
  const second = applyPath(g, [[0, 1], [0, 0]]);
  const third = applyPath(g, [[0, 0], [0, 1]]);
  return first.coins === 1 && second.coins === 0 && third.coins === 0 && g.collected.size === 1;
})());

check('đường dài hơn số bước còn lại: bị cắt bớt, bóng dừng đúng chỗ hết bước', (() => {
  const g = makeLevel(0, seeded());
  g.grid = g.grid.map((row) => row.map(() => 'empty'));
  g.stepsLeft = 2;
  const result = applyPath(g, [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]]);
  return result.moved === 2 && g.ball.c === 2 && g.stepsLeft === 0;
})());

check('đường không hợp lệ thì không làm gì, bóng đứng yên', (() => {
  const g = makeLevel(0, seeded());
  g.grid = g.grid.map((row) => row.map(() => 'empty'));
  g.grid[0][1] = 'obstacle';
  const result = applyPath(g, [[0, 0], [0, 1]]);
  return result === null && g.ball.r === 0 && g.ball.c === 0;
})());

console.log('— Kết thúc màn —');

check('lăn tới đích giữa đường → thắng ngay, không tiêu hao bước thừa phía sau', (() => {
  const g = makeLevel(0, seeded());
  g.grid = g.grid.map((row) => row.map(() => 'empty'));
  g.goal = { r: 0, c: 2 };
  g.ball = { r: 0, c: 0 };
  const before = g.stepsLeft;
  const result = applyPath(g, [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]]);
  return result.moved === 2 && g.over === true && g.won === true && g.stepsLeft === before - 2;
})());

check('thắng và đã nhặt hết vàng trên bàn → có cờ allCoins', (() => {
  const g = makeLevel(0, seeded());
  g.grid = g.grid.map((row) => row.map(() => 'empty'));
  g.goal = { r: 0, c: 2 };
  g.ball = { r: 0, c: 0 };
  g.coins = new Set(['0,1']);
  applyPath(g, [[0, 0], [0, 1], [0, 2]]);
  return g.won === true && g.allCoins === true;
})());

check('thắng nhưng còn bỏ sót vàng → allCoins = false', (() => {
  const g = makeLevel(0, seeded());
  g.grid = g.grid.map((row) => row.map(() => 'empty'));
  g.goal = { r: 0, c: 2 };
  g.ball = { r: 0, c: 0 };
  g.coins = new Set(['1,0']); // vàng nằm ngoài đường đi, không nhặt được
  applyPath(g, [[0, 0], [0, 1], [0, 2]]);
  return g.won === true && g.allCoins === false;
})());

check('hết bước mà chưa tới đích → thua', (() => {
  const g = makeLevel(0, seeded());
  g.grid = g.grid.map((row) => row.map(() => 'empty'));
  g.stepsLeft = 1;
  applyPath(g, [[0, 0], [0, 1]]);
  return g.over === true && g.won === false;
})());

check('game đã kết thúc thì applyPath() không làm gì thêm', (() => {
  const g = makeLevel(0, seeded());
  g.over = true;
  g.won = true;
  const before = { ...g.ball };
  const result = applyPath(g, [[0, 0], [0, 1]]);
  return result === null && g.ball.r === before.r && g.ball.c === before.c;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
