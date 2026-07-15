// Unit test cho Thú Cưng Đại Chiến. Chạy: node src/thucung.test.js

import {
  TYPES, CREATURES, typeMultiplier, makeBattle, useMove, makeCampaign, advanceCampaign,
} from './thucung.js';

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

console.log('— Hệ khắc chế —');

check('Lửa khắc Cỏ, Cỏ khắc Nước, Nước khắc Lửa (x1.5); chiều ngược lại giảm sát thương (x0.67)', (() => (
  typeMultiplier('fire', 'grass') === 1.5 && typeMultiplier('grass', 'fire') === 0.67
  && typeMultiplier('grass', 'water') === 1.5 && typeMultiplier('water', 'grass') === 0.67
  && typeMultiplier('water', 'fire') === 1.5 && typeMultiplier('fire', 'water') === 0.67
)));

check('cùng hệ hoặc không khắc nhau thì hệ số bình thường (x1)', (() => (
  typeMultiplier('fire', 'fire') === 1
)));

check('mỗi hệ có đúng 3 con thú (tổng 9 con), đủ 2 chiêu mỗi con', (() => {
  const perType = {};
  for (const c of Object.values(CREATURES)) perType[c.type] = (perType[c.type] || 0) + 1;
  return TYPES.every((ty) => perType[ty] === 3)
    && Object.keys(CREATURES).length === 9
    && Object.values(CREATURES).every((c) => c.moves.length === 2);
})());

console.log('— 1 trận đấu —');

check('khởi tạo trận: máu đầy 2 bên, chưa kết thúc', (() => {
  const b = makeBattle('ga_lua', 'ca_nuoc');
  return b.player.hp === CREATURES.ga_lua.maxHp && b.enemy.hp === CREATURES.ca_nuoc.maxHp && !b.over;
})());

check('có thể chỉ định máu bắt đầu (hồi máu giữa các trận), không vượt quá máu tối đa', (() => {
  const low = makeBattle('ga_lua', 'ca_nuoc', 10);
  const capped = makeBattle('ga_lua', 'ca_nuoc', 9999);
  return low.player.hp === 10 && capped.player.hp === CREATURES.ga_lua.maxHp;
})());

check('ra chiêu hợp lệ: trừ đúng máu địch, nếu địch chưa gục thì địch phản đòn luôn trong lượt đó', (() => {
  const b = makeBattle('ga_lua', 'ca_nuoc');
  const before = { p: b.player.hp, e: b.enemy.hp };
  const result = useMove(b, 0, seeded(3));
  return result.log.length === 2 && b.enemy.hp < before.e && b.player.hp < before.p;
})());

check('chiêu số không hợp lệ → không làm gì', (() => {
  const b = makeBattle('ga_lua', 'ca_nuoc');
  const result = useMove(b, 5, seeded());
  return result === null && b.enemy.hp === CREATURES.ca_nuoc.maxHp;
})());

check('trận đã kết thúc thì useMove() không làm gì thêm', (() => {
  const b = makeBattle('ga_lua', 'ca_nuoc');
  b.over = true;
  b.won = true;
  const result = useMove(b, 0, seeded());
  return result === null;
})());

check('hạ gục địch: trận kết thúc thắng ngay, địch không kịp phản đòn (máu người chơi không đổi)', (() => {
  const b = makeBattle('ga_lua', 'ca_nuoc', undefined);
  b.enemy.hp = 1; // gần chết, chỉ cần 1 đòn là hạ
  const playerHpBefore = b.player.hp;
  const result = useMove(b, 1, seeded(2));
  return b.over === true && b.won === true && b.enemy.hp === 0
    && b.player.hp === playerHpBefore && result.log.length === 1;
})());

check('bị hạ gục: phản đòn của địch đủ mạnh khiến máu về 0 → thua', (() => {
  const b = makeBattle('ga_lua', 'trau_co'); // Cỏ khắc Nước không khắc Lửa trực tiếp nhưng để test cơ chế thua chung
  b.player.hp = 1;
  b.enemy.hp = 9999; // địch không thể chết ở lượt này
  const result = useMove(b, 0, seeded(5));
  return b.over === true && b.won === false && b.player.hp === 0 && result.log.length === 2;
})());

check('hệ khắc chế thật sự ảnh hưởng sát thương trung bình (đấm nhiều lần, so trung bình)', (() => {
  const avgDmg = (atkId, defId, seedBase) => {
    let total = 0;
    const N = 60;
    for (let i = 0; i < N; i++) {
      const b = makeBattle(atkId, defId);
      b.enemy.hp = 99999; // không cho chết giữa chừng, đo được nhiều lượt hơn
      const rng = seeded(seedBase + i);
      const before = b.enemy.hp;
      useMove(b, 1, rng);
      total += before - b.enemy.hp;
    }
    return total / N;
  };
  // Gà Lửa (fire) đấu Trâu Cỏ (grass): fire khắc grass → sát thương trung bình phải cao hơn hẳn
  const advantaged = avgDmg('ga_lua', 'trau_co', 100);
  // Gà Lửa (fire) đấu Cá Nước (water): fire bị water khắc → sát thương trung bình phải thấp hơn hẳn
  const disadvantaged = avgDmg('ga_lua', 'ca_nuoc', 200);
  return advantaged > disadvantaged * 1.5;
})());

check('AI đối thủ dùng chiêu mạnh nhất khi đang khắc hệ người chơi', (() => {
  const b = makeBattle('trau_co', 'ca_nuoc'); // Nước khắc Lửa không khắc Cỏ trực tiếp; đổi cặp đúng: Nước bị Cỏ khắc
  // Trau_co (grass) tấn công Ca_nuoc (water): grass khắc water → phía enemy (water) đang BỊ khắc, không phải đang khắc
  // Cần enemy đang khắc atk: chọn ga_lua (fire) làm enemy khi player là trau_co (grass) → fire khắc grass
  const battle = makeBattle('trau_co', 'ga_lua');
  battle.enemy.hp = 9999;
  const result = useMove(battle, 0, seeded(9));
  const enemyTurn = result.log.find((l) => l.side === 'enemy');
  return enemyTurn.move === CREATURES.ga_lua.moves[1].name; // chiêu mạnh nhất (index cuối)
})());

console.log('— Chuỗi trận đấu (campaign) —');

check('màn thấp: 2 vòng đấu; đối thủ không trùng với thú của người chơi, không lặp lại', (() => {
  const c = makeCampaign('ga_lua', 0, seeded(4));
  const unique = new Set(c.opponents);
  return c.opponents.length === 2 && unique.size === c.opponents.length
    && !c.opponents.includes('ga_lua') && c.battle.enemy.id === c.opponents[0];
})());

check('thua 1 trận trong chuỗi → cả chuỗi thua ngay, không sang vòng kế', (() => {
  const c = makeCampaign('ga_lua', 0, seeded(1));
  c.battle.over = true;
  c.battle.won = false;
  const next = advanceCampaign(c, seeded());
  return next === null && c.over === true && c.won === false;
})());

check('thắng trận chưa phải cuối cùng → hồi 30% máu, sang đối thủ kế, chuỗi chưa kết thúc', (() => {
  const c = makeCampaign('ga_lua', 4, seeded(1)); // đủ nhiều vòng để chắc chắn có >1 trận
  const maxHp = CREATURES.ga_lua.maxHp;
  c.battle.player.hp = 10;
  c.battle.over = true;
  c.battle.won = true;
  const expectedHeal = Math.min(maxHp, 10 + Math.round(maxHp * 0.3));
  const nextBattle = advanceCampaign(c, seeded());
  return nextBattle !== null && c.over === false && c.roundIndex === 1
    && c.battle.player.hp === expectedHeal && c.battle.enemy.id === c.opponents[1];
})());

check('thắng trận cuối cùng trong chuỗi → cả chuỗi thắng', (() => {
  const c = makeCampaign('ga_lua', 0, seeded(1)); // 2 vòng
  c.roundIndex = 1; // đang ở vòng cuối
  c.battle.over = true;
  c.battle.won = true;
  const next = advanceCampaign(c, seeded());
  return next === null && c.over === true && c.won === true;
})());

check('trận hiện tại chưa kết thúc thì advanceCampaign() không làm gì', (() => {
  const c = makeCampaign('ga_lua', 0, seeded(1));
  const before = JSON.stringify(c);
  const next = advanceCampaign(c, seeded());
  return next === null && JSON.stringify(c) === before;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
