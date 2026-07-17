// Unit test cho Ném Banh Đổ Tháp. Chạy: node src/nembanh.test.js

import {
  GROUND_Y, SLING_X, SLING_Y, BALL_R, CRITTER_R, MAX_POWER, MATERIALS, LEVELS,
  makeLevel, launch, stepGame,
} from './nembanh.js';

let passed = 0;
let failed = 0;

function check(name, cond) {
  if (cond) { passed++; console.log(`  ✅ ${name}`); }
  else { failed++; console.error(`  ❌ ${name}`); }
}

/** Chạy mô phỏng tới khi thế giới yên (banh xong + hết rơi) hoặc hết kiên nhẫn. */
function settle(g, maxFrames = 2000) {
  for (let i = 0; i < maxFrames; i++) {
    const ev = stepGame(g, 16.67);
    if (!g.ball && ev.settledEnd) return;
    if (!g.ball && i > 10 && !g.blocks.some((b) => b.falling)
      && !g.critters.some((c) => c.falling && !c.popped)) return;
  }
}

console.log('— Dữ liệu màn —');

check('5 màn: đều có banh, khối, quái; khối dùng vật liệu hợp lệ', LEVELS.every(
  (lv) => lv.shots > 0 && lv.blocks.length > 0 && lv.critters.length > 0
    && lv.blocks.every((b) => MATERIALS[b.mat]),
));

check('mọi khối trong 5 màn đều được ĐỠ ngay từ đầu (không có gì tự rơi khi mở màn)', (() => {
  for (let i = 0; i < LEVELS.length; i++) {
    const g = makeLevel(i);
    stepGame(g, 16.67);
    if (g.blocks.some((b) => b.falling) || g.critters.some((c) => c.falling)) return false;
  }
  return true;
})());

check('khởi tạo: đủ máu theo vật liệu, chưa kết thúc', (() => {
  const g = makeLevel(0);
  return g.blocks.every((b) => b.hp === MATERIALS[b.mat].hp) && !g.over && g.shotsLeft === 3;
})());

console.log('— Phóng banh —');

check('phóng banh: trừ 1 lượt, banh xuất phát từ ná, vận tốc bị kẹp trần', (() => {
  const g = makeLevel(0);
  const ok = launch(g, 99, -99);
  const speed = Math.hypot(g.ball.vx, g.ball.vy);
  return ok && g.shotsLeft === 2 && g.ball.x === SLING_X && g.ball.y === SLING_Y
    && Math.abs(speed - MAX_POWER) < 0.001;
})());

check('banh đang bay thì không phóng thêm được', (() => {
  const g = makeLevel(0);
  launch(g, 10, -10);
  return launch(g, 10, -10) === false && g.shotsLeft === 2;
})());

check('trọng lực kéo banh: vy tăng dần trong lúc bay', (() => {
  const g = makeLevel(0);
  launch(g, 8, -12);
  const vy0 = g.ball.vy;
  stepGame(g, 16.67);
  return g.ball.vy > vy0;
})());

console.log('— Va chạm & sát thương —');

check('banh nhanh đập vỡ kính ngay (1 máu), cộng điểm', (() => {
  const g = makeLevel(0);
  g.blocks = [{ x: 300, y: 464, w: 48, h: 96, mat: 'glass', id: 0, hp: 1, maxHp: 1, falling: false, vy: 0 }];
  g.critters = [{ x: 900, y: 540, id: 0, falling: false, vy: 0, fellFrom: 540 }];
  launch(g, 14, -1);
  settle(g);
  return g.blocks.length === 0 && g.score >= MATERIALS.glass.score;
})());

check('đá cứng: banh chậm chỉ trầy (trừ máu chưa vỡ), khối còn nguyên vị trí', (() => {
  const g = makeLevel(0);
  g.blocks = [{ x: 300, y: 464, w: 48, h: 96, mat: 'stone', id: 0, hp: 4, maxHp: 4, falling: false, vy: 0 }];
  g.critters = [{ x: 900, y: 540, id: 0, falling: false, vy: 0, fellFrom: 540 }];
  g.ball = { x: 260, y: 520, vx: 5, vy: 0 };
  for (let i = 0; i < 30; i++) stepGame(g, 16.67);
  return g.blocks.length === 1 && g.blocks[0].hp < 4 && g.blocks[0].hp > 0;
})());

check('banh trúng quái → quái nổ bụp, +50 điểm', (() => {
  const g = makeLevel(0);
  g.blocks = [];
  g.critters = [{ x: 400, y: 540, id: 0, falling: false, vy: 0, fellFrom: 540 },
    { x: 900, y: 540, id: 1, falling: false, vy: 0, fellFrom: 540 }];
  launch(g, 13, -1); // bắn là là mặt đất, trúng thẳng quái đầu tiên
  let popped = 0;
  for (let i = 0; i < 300; i++) popped += stepGame(g, 16.67).popped;
  return popped === 1 && g.critters[0].popped === true && g.score >= 50;
})());

console.log('— Sập đổ dây chuyền —');

check('phá trụ đỡ → xà ngang mất chỗ đỡ rơi xuống đất và nằm lại đúng mặt đất', (() => {
  const g = makeLevel(0);
  g.blocks = [
    { x: 300, y: 464, w: 48, h: 96, mat: 'glass', id: 0, hp: 1, maxHp: 1, falling: false, vy: 0 },
    { x: 276, y: 416, w: 120, h: 48, mat: 'wood', id: 1, hp: 2, maxHp: 2, falling: false, vy: 0 },
  ];
  g.critters = [{ x: 900, y: 540, id: 0, falling: false, vy: 0, fellFrom: 540 }];
  launch(g, 14, 0.5); // bắn hơi chúc xuống: trúng THÂN trụ kính, không sượt góc xà gỗ
  settle(g);
  const beam = g.blocks.find((b) => b.w === 120);
  return beam && !beam.falling && Math.abs(beam.y + beam.h - GROUND_Y) < 0.6;
})());

check('khối rơi đè trúng quái → quái nổ bụp', (() => {
  const g = makeLevel(0);
  g.blocks = [
    { x: 300, y: 464, w: 48, h: 96, mat: 'glass', id: 0, hp: 1, maxHp: 1, falling: false, vy: 0 },
    { x: 276, y: 416, w: 120, h: 48, mat: 'wood', id: 1, hp: 2, maxHp: 2, falling: false, vy: 0 },
  ];
  g.critters = [{ x: 370, y: 540, id: 0, falling: false, vy: 0, fellFrom: 540 }]; // đứng dưới rìa xà
  launch(g, 14, 0.5);
  settle(g);
  return g.critters[0].popped === true;
})());

check('quái đứng trên khối bị phá → ngã từ trên cao xuống cũng nổ bụp', (() => {
  const g = makeLevel(0);
  g.blocks = [{ x: 300, y: 440, w: 48, h: 120, mat: 'glass', id: 0, hp: 1, maxHp: 1, falling: false, vy: 0 }];
  g.critters = [{ x: 324, y: 420, id: 0, falling: false, vy: 0, fellFrom: 420 }];
  launch(g, 14, -2);
  settle(g);
  return g.critters[0].popped === true;
})());

console.log('— Thắng / thua & sao —');

check('diệt hết quái với ≥2 banh còn dư → thắng 3 sao', (() => {
  const g = makeLevel(0);
  g.blocks = [];
  g.critters = [{ x: 400, y: 540, id: 0, falling: false, vy: 0, fellFrom: 540 }];
  launch(g, 13, -1);
  settle(g);
  return g.over && g.won && g.stars === 3;
})());

check('hết banh mà quái vẫn còn → thua', (() => {
  const g = makeLevel(0);
  g.blocks = [];
  g.critters = [{ x: 900, y: 100, id: 0, falling: false, vy: 0, fellFrom: 100 }];
  g.critters[0].y = 540; // đứng góc xa
  g.critters[0].x = 60; // sau lưng ná — banh bắn về trước không trúng
  g.shotsLeft = 1;
  launch(g, 13, -3);
  settle(g);
  return g.over === true && g.won === false;
})());

check('game kết thúc thì stepGame/launch không làm gì nữa', (() => {
  const g = makeLevel(0);
  g.over = true;
  const ev = stepGame(g, 16.67);
  return launch(g, 10, -10) === false && ev.popped === 0;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
