// Unit test cho Đào Vàng. Chạy: node src/daovang.test.js

import {
  TYPES, SHOP_ITEMS, FIELD_W, FIELD_H, GROUND_Y,
  makeWallet, makeLevel, stepGame, fireHook, hookTip,
  useDynamite, buyUpgrade, itemValue,
} from './daovang.js';

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

check('màn 0: 9 vật, mục tiêu 180đ, 55s, cần câu ở giữa đang đu', (() => {
  const g = makeLevel(0, seeded());
  return g.items.length === 9 && g.goal === 180 && g.timeLeft === 55
    && g.hook.state === 'swing' && g.money === 0 && !g.over;
})());

check('màn cao hơn có nhiều vật + mục tiêu cao hơn (tối đa 18 vật)', (() => {
  const g5 = makeLevel(5, seeded());
  const g20 = makeLevel(20, seeded());
  return g5.items.length === 14 && g5.goal === 730 && g20.items.length === 18;
})());

check('mọi vật nằm trong sân, dưới mặt đất', (() => {
  const g = makeLevel(3, seeded(42));
  return g.items.every((it) => it.x - it.r >= 0 && it.x + it.r <= FIELD_W
    && it.y - it.r >= GROUND_Y && it.y + it.r <= FIELD_H);
})());

check('cỏ 3 lá may mắn (clover) làm vật quý xuất hiện nhiều hơn', (() => {
  const rng = seeded(7);
  const noLuck = makeLevel(30, rng, { ...makeWallet() });
  const rng2 = seeded(7);
  const wallet = { ...makeWallet(), clover: 3 };
  const luck = makeLevel(30, rng2, wallet);
  const goodCount = (g) => g.items.filter((it) => it.type === 'diamond' || it.type === 'gold_l' || it.type === 'gold_m').length;
  return goodCount(luck) >= goodCount(noLuck);
})());

console.log('— Cần câu đu & bắn mỏ —');

check('lúc rảnh, cần câu tự đu qua lại trong 1 góc cố định', (() => {
  const g = makeLevel(0, seeded());
  const angles = [];
  for (let i = 0; i < 400; i++) { stepGame(g, 16); angles.push(g.hook.angle); }
  return angles.every((a) => a >= 0.1 && a <= Math.PI - 0.1) && new Set(angles.map((a) => a.toFixed(2))).size > 5;
})());

check('bắn mỏ: chỉ hoạt động khi đang đu (swing), chuyển sang extend', (() => {
  const g = makeLevel(0, seeded());
  fireHook(g);
  const ok1 = g.hook.state === 'extend';
  fireHook(g); // đang extend, bắn lại không có tác dụng
  return ok1 && g.hook.state === 'extend';
})());

check('mỏ thả xuống, độ dài dây tăng dần theo thời gian', (() => {
  const g = makeLevel(0, seeded());
  fireHook(g);
  const len0 = g.hook.len;
  for (let i = 0; i < 5; i++) stepGame(g, 16);
  return g.hook.len > len0;
})());

console.log('— Câu trúng vật, cuốn về, tính điểm —');

check('mỏ chạm đúng vị trí vật → chuyển sang retract, gắn vật vào mỏ', (() => {
  const g = makeLevel(0, seeded());
  g.hook.angle = Math.PI / 2; // chĩa thẳng xuống
  for (const it of g.items) it.alive = false; // dẹp hết vật khác khỏi đường đi
  const target = g.items[0];
  target.alive = true;
  target.type = 'gold_s';
  target.x = FIELD_W / 2; // đặt đúng dưới trục quay để mỏ thẳng đứng chạm trúng
  target.y = 400;
  fireHook(g);
  let steps = 0;
  while (g.hook.state === 'extend' && steps < 500) { stepGame(g, 16); steps++; }
  return g.hook.state === 'retract' && g.hook.caught === target;
})());

check('vật nhẹ (kim cương) cuốn về nhanh hơn vật nặng (đá) — cùng khoảng cách', (() => {
  const mkCaught = (type) => {
    const g = makeLevel(0, seeded());
    g.hook.len = 300;
    g.hook.state = 'retract';
    g.hook.caught = { id: 0, type, x: 0, y: 0, r: TYPES[type].r, alive: true };
    let steps = 0;
    while (g.hook.state === 'retract' && steps < 2000) { stepGame(g, 16); steps++; }
    return steps;
  };
  return mkCaught('diamond') < mkCaught('rock');
})());

check('cuốn vật vàng về tới nơi → cộng đúng số tiền, vật biến mất khỏi sân', (() => {
  const g = makeLevel(0, seeded());
  const it = g.items[0];
  it.type = 'gold_m';
  g.hook.len = 50;
  g.hook.state = 'retract';
  g.hook.caught = it;
  let steps = 0;
  while (g.hook.state === 'retract' && steps < 500) { stepGame(g, 16); steps++; }
  return g.money === 50 && !it.alive && g.hook.state === 'swing';
})());

check('sách sưu tầm đá tăng giá trị đá, đánh bóng tăng giá trị kim cương', (() => (
  itemValue('rock', { book: 2 }) === TYPES.rock.value + 30
  && itemValue('diamond', { polish: 1 }) === TYPES.diamond.value + 40
  && itemValue('gold_s', { book: 5, polish: 5 }) === TYPES.gold_s.value
)));

console.log('— Mìn (dynamite) —');

check('câu trúng thùng mìn → nổ NGAY tại chỗ (không cuốn về), vật quanh đó biến mất và được nửa giá trị', (() => {
  const g = makeLevel(0, seeded());
  g.hook.angle = Math.PI / 2; // chĩa thẳng xuống
  for (const it of g.items) it.alive = false; // dẹp hết vật khác khỏi đường đi
  const bomb = g.items[0];
  bomb.alive = true;
  bomb.type = 'dynamite';
  bomb.x = FIELD_W / 2;
  bomb.y = 300;
  const near = g.items[1];
  near.alive = true;
  near.type = 'gold_m';
  near.x = bomb.x + 30;
  near.y = bomb.y + 20;
  fireHook(g);
  let steps = 0;
  while (g.hook.state === 'extend' && steps < 500) { stepGame(g, 16); steps++; }
  const caughtNothing = g.hook.caught === null;
  const moneyAtBlast = g.money;
  return caughtNothing && !bomb.alive && !near.alive && moneyAtBlast === Math.round(50 * 0.6);
})());

check('mìn cầm tay (mua ở shop): chỉ dùng được khi có sẵn charge & đang đu', (() => {
  const g = makeLevel(0, seeded());
  const before = useDynamite(g); // chưa mua charge nào
  g.dynamiteCount = 1;
  g.items[0].x = hookTip(g).x;
  g.items[0].y = hookTip(g).y;
  g.items[0].type = 'gold_s';
  const after = useDynamite(g);
  return before === false && after === true && g.dynamiteCount === 0;
})());

console.log('— Kết thúc màn —');

check('đủ tiền mục tiêu → thắng ngay, dừng mô phỏng', (() => {
  const g = makeLevel(0, seeded());
  g.money = g.goal;
  stepGame(g, 16);
  return g.over === true && g.won === true;
})());

check('hết giờ mà chưa đủ tiền → thua', (() => {
  const g = makeLevel(0, seeded());
  g.timeLeft = 0.01;
  stepGame(g, 20);
  return g.over === true && g.won === false;
})());

check('hết vật trên sân mà chưa đủ tiền → thua', (() => {
  const g = makeLevel(0, seeded());
  for (const it of g.items) it.alive = false;
  stepGame(g, 16);
  return g.over === true && g.won === false;
})());

console.log('— Cửa hàng nâng cấp —');

check('không đủ tiền thì không mua được, ví không đổi', (() => {
  const wallet = makeWallet();
  const ok = buyUpgrade(wallet, 'dynamite');
  return ok === false && wallet.bank === 0 && wallet.dynamiteCharges === 0;
})());

check('đủ tiền: trừ đúng giá, cộng đúng loại nâng cấp', (() => {
  const wallet = { ...makeWallet(), bank: 500 };
  buyUpgrade(wallet, 'strength');
  buyUpgrade(wallet, 'dynamite');
  buyUpgrade(wallet, 'dynamite');
  const spent = SHOP_ITEMS.strength.cost + SHOP_ITEMS.dynamite.cost * 2;
  return wallet.bank === 500 - spent && wallet.strength === 1 && wallet.dynamiteCharges === 2;
})());

check('nước tăng lực (strength) làm mỏ đu và cuốn nhanh hơn', (() => {
  const g0 = makeLevel(0, seeded());
  fireHook(g0);
  for (let i = 0; i < 5; i++) stepGame(g0, 16);
  const g1 = makeLevel(0, seeded(), { ...makeWallet(), strength: 3 });
  fireHook(g1);
  for (let i = 0; i < 5; i++) stepGame(g1, 16);
  return g1.hook.len > g0.hook.len;
})());

console.log('— Biến thể (Cuộc Săn Vàng / Thợ Mỏ Liều Lĩnh) —');

check('drift: vật phẩm bò qua lại và dội tường, không đi ra ngoài sân', (() => {
  const g = makeLevel(0, seeded(9), makeWallet(), { drift: true });
  const hasMovers = g.items.some((it) => it.vx !== 0);
  for (let i = 0; i < 2000; i++) stepGame(g, 16);
  const inBounds = g.items.every((it) => it.x - it.r >= -0.01 && it.x + it.r <= FIELD_W + 0.01);
  return hasMovers && inBounds;
})());

check('không bật drift thì vật phẩm đứng yên như bình thường', (() => {
  const g = makeLevel(0, seeded(9));
  const x0 = g.items.map((it) => it.x);
  for (let i = 0; i < 100; i++) stepGame(g, 16);
  return g.items.every((it, i) => it.x === x0[i]);
})());

check('probOverride: dồn xác suất về 1 loại duy nhất để tạo màn khó (nhiều đá)', (() => {
  const allRock = { gold_s: 0, gold_m: 0, gold_l: 0, diamond: 0, rock: 1, skull: 0, pig: 0, rabbit: 0, dynamite: 0 };
  const g = makeLevel(2, seeded(3), makeWallet(), { probOverride: allRock });
  return g.items.every((it) => it.type === 'rock');
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
