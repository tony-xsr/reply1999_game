// Unit test cho Phi Đội Nhí. Chạy: node src/phidoinhi.test.js

import {
  FIELD_W, PLANE_Y, PLANE_R, START_LIVES, OBSTACLE_TYPES,
  makeLevel, movePlane, fireBullet, stepGame,
} from './phidoinhi.js';

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

console.log('— Khởi tạo màn —');

check('màn 0: máy bay giữa sân, chưa điểm, đủ 3 mạng, chưa kết thúc', (() => {
  const g = makeLevel(0, seeded());
  return g.plane.x === FIELD_W / 2 && g.score === 0 && g.lives === START_LIVES && !g.over;
})());

check('màn cao hơn có nhiều vật cản hơn, sinh dày hơn (khó hơn)', (() => {
  const g0 = makeLevel(0, seeded());
  const g5 = makeLevel(5, seeded());
  return g5.totalObstacles > g0.totalObstacles && g5.spawnEveryMs < g0.spawnEveryMs;
})());

console.log('— Điều khiển máy bay —');

check('máy bay không bay ra ngoài biên trái/phải', (() => {
  const g = makeLevel(0, seeded());
  movePlane(g, -9999);
  const leftOk = g.plane.x === PLANE_R;
  movePlane(g, 9999);
  const rightOk = g.plane.x === FIELD_W - PLANE_R;
  return leftOk && rightOk;
})());

check('bắn đạn có thời gian hồi chiêu, không bắn liên tục ngay được', (() => {
  const g = makeLevel(0, seeded());
  const first = fireBullet(g);
  const second = fireBullet(g);
  return first === true && second === false && g.bullets.length === 1;
})());

check('hết thời gian hồi chiêu thì bắn lại được', (() => {
  const g = makeLevel(0, seeded());
  fireBullet(g);
  for (let i = 0; i < 20; i++) stepGame(g, 16, seeded());
  return fireBullet(g) === true;
})());

console.log('— Sinh vật cản —');

check('vật cản cuối màn luôn là "trùm" (boss)', (() => {
  const g = makeLevel(0, seeded());
  g.totalObstacles = 3;
  g.spawnedCount = 2;
  g.spawnTimer = g.spawnEveryMs;
  stepGame(g, 16, seeded());
  return g.obstacles.length === 1 && g.obstacles[0].type === 'boss';
})());

check('không sinh thêm vật cản khi đã đủ tổng số của màn', (() => {
  const g = makeLevel(0, seeded());
  g.totalObstacles = 2;
  g.spawnedCount = 2;
  g.spawnTimer = g.spawnEveryMs;
  stepGame(g, 16, seeded());
  return g.obstacles.length === 0 && g.spawnedCount === 2;
})());

console.log('— Va chạm đạn / vật cản / máy bay —');

check('đạn trúng vật cản 1 máu (thiên thạch): vỡ ngay, cộng đúng điểm, đạn biến mất', (() => {
  const g = makeLevel(0, seeded());
  g.bullets = [{ x: 300, y: 300 }];
  g.obstacles = [{ type: 'meteor', x: 300, y: 300, r: 24, hp: 1, speed: 2 }];
  stepGame(g, 16, seeded());
  return g.score === OBSTACLE_TYPES.meteor.score && g.bullets.length === 0 && g.obstacles.length === 0;
})());

check('đạn trúng vật cản 2 máu (mây): cần đúng 2 nhát mới vỡ', (() => {
  const g = makeLevel(0, seeded());
  g.obstacles = [{ type: 'cloud', x: 300, y: 300, r: 30, hp: 2, speed: 1.6 }];
  g.bullets = [{ x: 300, y: 300 }];
  stepGame(g, 16, seeded());
  const stillAlive = g.obstacles.length === 1 && g.obstacles[0].hp === 1 && g.score === 0;
  g.bullets = [{ x: g.obstacles[0].x, y: g.obstacles[0].y }];
  stepGame(g, 16, seeded());
  return stillAlive && g.obstacles.length === 0 && g.score === OBSTACLE_TYPES.cloud.score;
})());

check('vật cản va trúng máy bay: mất 1 mạng, vật cản biến mất, không cộng điểm', (() => {
  const g = makeLevel(0, seeded());
  g.obstacles = [{ type: 'meteor', x: g.plane.x, y: PLANE_Y, r: 24, hp: 1, speed: 2 }];
  const livesBefore = g.lives;
  stepGame(g, 16, seeded());
  return g.lives === livesBefore - 1 && g.obstacles.length === 0 && g.score === 0;
})());

check('nhặt vật phẩm thưởng: cộng 30 điểm, vật phẩm biến mất', (() => {
  const g = makeLevel(0, seeded());
  g.powerups = [{ x: g.plane.x, y: PLANE_Y, r: 14 }];
  stepGame(g, 16, seeded());
  return g.score === 30 && g.powerups.length === 0;
})());

console.log('— Kết thúc màn —');

check('bắn/né hết tổng số vật cản của màn → thắng', (() => {
  const g = makeLevel(0, seeded());
  g.totalObstacles = 1;
  g.spawnedCount = 1;
  g.obstacles = [];
  stepGame(g, 16, seeded());
  return g.over === true && g.won === true;
})());

check('hết 3 mạng vì va chạm liên tục → thua', (() => {
  const g = makeLevel(0, seeded());
  g.lives = 1;
  g.obstacles = [{ type: 'meteor', x: g.plane.x, y: PLANE_Y, r: 24, hp: 1, speed: 2 }];
  stepGame(g, 16, seeded());
  return g.lives === 0 && g.over === true && g.won === false;
})());

check('game đã kết thúc thì stepGame()/fireBullet() không làm gì thêm', (() => {
  const g = makeLevel(0, seeded());
  g.over = true;
  g.won = false;
  const before = JSON.stringify(g);
  stepGame(g, 16, seeded());
  const fired = fireBullet(g);
  return fired === false && JSON.stringify(g) === before;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
