// Unit test cho logic Rắn Săn Mồi. Chạy: node src/snake.test.js

import { createGame, step, turn, targetLabel, ABC, NUMS } from './snake.js';

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

console.log('— Rắn Săn Mồi —');

check('ván mới: rắn 3 đốt, đi sang phải, còn sống', (() => {
  const g = createGame('classic', 17, 15, rng(1));
  return g.snake.length === 3 && g.dir.x === 1 && g.alive && g.foods.length === 1;
})());

check('đi 1 nhịp: đầu tiến 1 ô, dài không đổi', (() => {
  const g = createGame('classic', 17, 15, rng(1));
  g.foods = []; // dọn mồi để không ăn trúng
  const before = { ...g.snake[0] };
  step(g);
  return g.snake[0].x === before.x + 1 && g.snake.length === 3;
})());

check('xuyên tường: qua mép phải vòng về cột 0', (() => {
  const g = createGame('classic', 17, 15, rng(1));
  g.foods = [];
  g.snake = [{ x: 16, y: 7 }, { x: 15, y: 7 }];
  step(g);
  return g.snake[0].x === 0 && g.alive;
})());

check('không cho quay đầu 180°', (() => {
  const g = createGame('classic', 17, 15, rng(1));
  turn(g, { x: -1, y: 0 }); // đang đi phải, đòi rẽ trái ngược chiều
  return g.nextDir.x === 1;
})());

check('ăn táo: dài thêm 1, +10 điểm, có mồi mới', (() => {
  const g = createGame('classic', 17, 15, rng(2));
  g.foods = [{ x: g.snake[0].x + 1, y: g.snake[0].y, label: '🍎' }];
  const result = step(g);
  return result === 'eat' && g.snake.length === 4 && g.score === 10 && g.foods.length === 1;
})());

check('tự cắn thân → chết', (() => {
  const g = createGame('classic', 17, 15, rng(1));
  g.snake = [{ x: 5, y: 5 }, { x: 5, y: 6 }, { x: 4, y: 6 }, { x: 4, y: 5 }, { x: 4, y: 4 }];
  g.dir = { x: -1, y: 0 };
  g.nextDir = { x: -1, y: 0 }; // đâm vào (4,5) là thân
  return step(g) === 'dead' && !g.alive;
})());

check('abc: mục tiêu đầu là A, ăn đúng → sang B', (() => {
  const g = createGame('abc', 17, 15, rng(3));
  if (targetLabel(g) !== 'A') return false;
  const foodA = g.foods.find((f) => f.label === 'A');
  g.snake[0] = { x: foodA.x - 1, y: foodA.y };
  g.snake[1] = { x: foodA.x - 2, y: foodA.y };
  g.snake.length = 2;
  g.dir = g.nextDir = { x: 1, y: 0 };
  return step(g) === 'eat' && targetLabel(g) === 'B';
})());

check('abc: ăn nhầm chữ → rắn ngắn bớt, mục tiêu giữ nguyên', (() => {
  const g = createGame('abc', 17, 15, rng(4));
  const wrongFood = g.foods.find((f) => f.label !== 'A');
  g.snake = [
    { x: wrongFood.x - 1, y: wrongFood.y },
    { x: wrongFood.x - 2, y: wrongFood.y },
    { x: wrongFood.x - 3, y: wrongFood.y },
  ];
  g.dir = g.nextDir = { x: 1, y: 0 };
  const result = step(g);
  return result === 'wrong' && targetLabel(g) === 'A' && g.snake.length === 2 && g.ateWrong === 1;
})());

check('num: ăn hết 1→9 là thắng', (() => {
  const g = createGame('num', 17, 15, rng(5));
  for (let i = 0; i < 9; i++) {
    const food = g.foods.find((f) => f.label === targetLabel(g));
    g.snake = [{ x: (food.x + 16) % 17, y: food.y }, { x: (food.x + 15) % 17, y: food.y }];
    g.dir = g.nextDir = { x: 1, y: 0 };
    const result = step(g);
    if (i < 8 && result !== 'eat') return false;
    if (i === 8 && result !== 'win') return false;
  }
  return g.won && g.score === 90;
})());

check('dãy học đủ: ABC 26 chữ, NUMS 9 số', ABC.length === 26 && NUMS.length === 9);

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
