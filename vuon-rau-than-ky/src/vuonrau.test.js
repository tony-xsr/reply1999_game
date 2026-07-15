// Unit test cho Vườn Rau Thần Kỳ. Chạy: node src/vuonrau.test.js

import {
  ROWS, COLS, START_LIVES, START_WATER, PLANTS, BUGS, makeLevel, plantAt, stepGame,
} from './vuonrau.js';

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

check('bàn trống hoàn toàn, đủ nước tưới ban đầu, đủ 3 mạng, chưa kết thúc', (() => {
  const g = makeLevel(0, seeded());
  return g.grid.every((row) => row.every((c) => c === null))
    && g.water === START_WATER && g.lives === START_LIVES && !g.over;
})());

check('màn cao hơn có nhiều côn trùng hơn, sinh dày hơn', (() => {
  const g0 = makeLevel(0, seeded());
  const g5 = makeLevel(5, seeded());
  return g5.bugsPerWave > g0.bugsPerWave && g5.spawnEveryMs < g0.spawnEveryMs;
})());

console.log('— Trồng cây —');

check('trồng cây hợp lệ: trừ đúng nước tưới, ô có cây', (() => {
  const g = makeLevel(0, seeded());
  const ok = plantAt(g, 0, 0, 'hoa_nang');
  return ok === true && g.water === START_WATER - PLANTS.hoa_nang.cost && g.grid[0][0].type === 'hoa_nang';
})());

check('không đủ nước tưới thì không trồng được, nước không đổi', (() => {
  const g = makeLevel(0, seeded());
  g.water = 5;
  const ok = plantAt(g, 0, 0, 'xuong_rong');
  return ok === false && g.water === 5 && g.grid[0][0] === null;
})());

check('ô đã có cây rồi thì không trồng chồng lên được', (() => {
  const g = makeLevel(0, seeded());
  plantAt(g, 1, 1, 'hoa_nang');
  const waterAfterFirst = g.water;
  const ok = plantAt(g, 1, 1, 'dau_xanh');
  return ok === false && g.water === waterAfterFirst && g.grid[1][1].type === 'hoa_nang';
})());

console.log('— Cây tạo nước tưới —');

check('Hoa Mặt Trời nhận đợt đầu ngay (cooldown khởi tạo = 0), rồi phải đợi đủ 1 chu kỳ mới nhận tiếp', (() => {
  const g = makeLevel(0, seeded());
  plantAt(g, 0, 0, 'hoa_nang');
  const waterAfterPlant = g.water;
  stepGame(g, 16, seeded());
  const firstPayout = g.water === waterAfterPlant + PLANTS.hoa_nang.genAmount;
  stepGame(g, 2000, seeded()); // chưa đủ 1 chu kỳ tiếp theo
  const tooSoon = g.water === waterAfterPlant + PLANTS.hoa_nang.genAmount;
  stepGame(g, PLANTS.hoa_nang.cooldownMs, seeded()); // đủ 1 chu kỳ nữa
  return firstPayout && tooSoon && g.water === waterAfterPlant + PLANTS.hoa_nang.genAmount * 2;
})());

console.log('— Cây bắn hạ côn trùng —');

check('Đậu Xanh bắn trúng côn trùng gần nhất CÙNG HÀNG sau khi hết thời gian hồi', (() => {
  const g = makeLevel(0, seeded());
  plantAt(g, 2, 0, 'dau_xanh');
  // Giữ tham chiếu trực tiếp — không tìm lại theo x vì các con không bị chắn sẽ tự bò trong bước này.
  const far = { row: 2, x: 5, hp: BUGS.small.hp, type: 'small', attackCooldown: 0 };
  const near = { row: 2, x: 3, hp: BUGS.small.hp, type: 'small', attackCooldown: 0 }; // gần hơn -> phải bị bắn trước
  const otherRow = { row: 4, x: 1, hp: BUGS.small.hp, type: 'small', attackCooldown: 0 }; // khác hàng -> không bị ảnh hưởng
  g.bugs = [far, near, otherRow];
  stepGame(g, 16, seeded());
  return near.hp === BUGS.small.hp - PLANTS.dau_xanh.damage
    && far.hp === BUGS.small.hp && otherRow.hp === BUGS.small.hp;
})());

console.log('— Côn trùng di chuyển / phá cây —');

check('không có cây chắn đường thì côn trùng bò dần sang trái theo tốc độ', (() => {
  const g = makeLevel(0, seeded());
  g.bugs = [{ row: 0, x: 5, hp: BUGS.small.hp, type: 'small', attackCooldown: 0 }];
  stepGame(g, 1000, seeded());
  return g.bugs[0].x === 5 - BUGS.small.speed;
})());

check('bị cây chắn đường: đứng yên, cắn cây giảm máu theo nhịp cắn, không tự đi tiếp', (() => {
  const g = makeLevel(0, seeded());
  g.water = 999;
  plantAt(g, 0, 3, 'xuong_rong');
  const startHp = g.grid[0][3].hp;
  g.bugs = [{ row: 0, x: 3, hp: BUGS.small.hp, type: 'small', attackCooldown: 0 }];
  stepGame(g, 500, seeded());
  return g.bugs[0].x === 3 && g.grid[0][3].hp === startHp - BUGS.small.dmgToPlant;
})());

check('cây chắn đường bị phá hết máu → biến mất, côn trùng đi tiếp ở bước sau', (() => {
  const g = makeLevel(0, seeded());
  g.grid[0][3] = { type: 'xuong_rong', hp: 1, cooldown: 0 }; // gần chết, 1 nhát là vỡ
  g.bugs = [{ row: 0, x: 3, hp: BUGS.small.hp, type: 'small', attackCooldown: 0 }];
  stepGame(g, 500, seeded()); // cắn vỡ cây
  const plantGone = g.grid[0][3] === null;
  stepGame(g, 1000, seeded()); // bước sau: hết vật cản, đi tiếp
  return plantGone && g.bugs[0].x < 3;
})());

check('côn trùng lọt tới nhà (x ≤ 0): mất đúng số mạng tương ứng, bị loại khỏi sân', (() => {
  const g = makeLevel(0, seeded());
  g.bugs = [
    { row: 0, x: 0.1, hp: BUGS.small.hp, type: 'small', attackCooldown: 0 },
    { row: 1, x: 5, hp: BUGS.small.hp, type: 'small', attackCooldown: 0 },
  ];
  const livesBefore = g.lives;
  stepGame(g, 1000, seeded());
  return g.lives === livesBefore - 1 && g.bugs.length === 1 && g.bugs[0].row === 1;
})());

console.log('— Kết thúc màn —');

check('đã sinh đủ côn trùng của màn và sân sạch bóng → thắng', (() => {
  const g = makeLevel(0, seeded());
  g.bugsPerWave = 1;
  g.spawnedThisWave = 1;
  g.bugs = [];
  stepGame(g, 16, seeded());
  return g.over === true && g.won === true;
})());

check('hết mạng vì côn trùng tràn vào → thua', (() => {
  const g = makeLevel(0, seeded());
  g.lives = 1;
  g.bugs = [{ row: 0, x: 0.1, hp: BUGS.small.hp, type: 'small', attackCooldown: 0 }];
  stepGame(g, 1000, seeded());
  return g.lives === 0 && g.over === true && g.won === false;
})());

check('game đã kết thúc thì stepGame()/plantAt() không làm gì thêm', (() => {
  const g = makeLevel(0, seeded());
  g.over = true;
  g.won = false;
  const before = JSON.stringify(g);
  stepGame(g, 16, seeded());
  const planted = plantAt(g, 0, 0, 'hoa_nang');
  return planted === false && JSON.stringify(g) === before;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
