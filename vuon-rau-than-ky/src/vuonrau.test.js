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

console.log('— Nâng cấp: ớt nổ, bắp cải, bọ giáp, bướm bay, sóng cuối —');

check('Ớt Đỏ: trồng xong kíp cháy → NỔ quét sạch côn trùng CÙNG HÀNG, ô trống lại, có báo nổ', (() => {
  const g = makeLevel(0, seeded());
  g.water = 200;
  g.bugs = [
    { row: 1, x: 5, hp: BUGS.armor.hp, type: 'armor', attackCooldown: 0 },
    { row: 1, x: 7, hp: BUGS.big.hp, type: 'big', attackCooldown: 0 },
    { row: 3, x: 5, hp: BUGS.small.hp, type: 'small', attackCooldown: 0 }, // khác hàng — không sao
  ];
  plantAt(g, 1, 0, 'ot_do');
  stepGame(g, PLANTS.ot_do.fuseMs + 50, seeded());
  return g.bugs.length === 1 && g.bugs[0].row === 3
    && g.grid[1][0] === null && g.booms.length === 1 && g.booms[0].row === 1;
})());

check('Bắp Cải Ném: đánh đau hơn Đậu Xanh nhưng hồi chiêu lâu hơn', (() => {
  const g = makeLevel(0, seeded());
  g.water = 200;
  plantAt(g, 2, 0, 'bap_cai');
  g.bugs = [{ row: 2, x: 5, hp: BUGS.armor.hp, type: 'armor', attackCooldown: 0 }];
  stepGame(g, 16, seeded());
  return PLANTS.bap_cai.damage > PLANTS.dau_xanh.damage
    && PLANTS.bap_cai.cooldownMs > PLANTS.dau_xanh.cooldownMs
    && g.bugs[0].hp === BUGS.armor.hp - PLANTS.bap_cai.damage;
})());

check('Bướm BAY QUA xương rồng: không bị chặn, bò xuyên qua ô có cây', (() => {
  const g = makeLevel(0, seeded());
  g.water = 200;
  plantAt(g, 0, 3, 'xuong_rong');
  g.bugs = [{ row: 0, x: 3.5, hp: BUGS.flyer.hp, type: 'flyer', attackCooldown: 0 }];
  const hpBefore = g.grid[0][3].hp;
  stepGame(g, 1000, seeded());
  return g.bugs[0].x < 3.5 && g.grid[0][3].hp === hpBefore; // bay tiếp, cây không bị cắn
})());

check('Bọ Giáp lì đòn nhất đám và vẫn bị cây bắn hạ dần', (() => {
  const g = makeLevel(0, seeded());
  g.water = 200;
  plantAt(g, 4, 0, 'dau_xanh');
  g.bugs = [{ row: 4, x: 6, hp: BUGS.armor.hp, type: 'armor', attackCooldown: 0 }];
  stepGame(g, 16, seeded());
  return BUGS.armor.hp > BUGS.big.hp && g.bugs[0].hp === BUGS.armor.hp - PLANTS.dau_xanh.damage;
})());

check('SÓNG CUỐI: sinh đủ 70% côn trùng thì nhịp sinh dồn dập gấp đôi', (() => {
  const g = makeLevel(0, seeded());
  const before = g.spawnEveryMs;
  g.spawnedThisWave = g.surgeAt - 1;
  g.spawnTimer = g.spawnEveryMs; // ép sinh ngay con chạm mốc
  stepGame(g, 16, seeded());
  return g.surged === true && g.spawnEveryMs <= Math.round(before / 2) + 1;
})());

check('màn 0 chưa có bướm/bọ giáp (spawn chỉ ra sâu nhỏ/bọ to)', (() => {
  const g = makeLevel(0, seeded(7));
  for (let i = 0; i < 40; i++) {
    g.spawnTimer = g.spawnEveryMs;
    g.bugsPerWave = 999;
    stepGame(g, 16, seeded(i + 1));
    g.bugs = [];
    g.lives = 3;
  }
  return true; // không văng lỗi + kiểm tra loại bên dưới
})() && (() => {
  const g = makeLevel(0, seeded(7));
  g.bugsPerWave = 999;
  const seen = new Set();
  for (let i = 0; i < 60; i++) {
    g.spawnTimer = g.spawnEveryMs;
    stepGame(g, 16, seeded(i + 1));
    for (const b of g.bugs) seen.add(b.type);
    g.bugs = [];
  }
  return !seen.has('flyer') && !seen.has('armor');
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
