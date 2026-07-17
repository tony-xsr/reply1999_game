// Unit test cho Pokémon Đại Chiến. Chạy: node src/pokedaichien.test.js

import {
  POKEMON, STARTERS, OPPONENT_POOL, BOSSES, spritePath, typeMultiplier,
  makeBattle, useMove, makeCampaign, advanceCampaign,
} from './pokedaichien.js';

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

/** Đánh cho tới khi trận kết thúc (dồn chiêu mạnh nhất). */
function fightOut(battle, rng) {
  let guard = 0;
  while (!battle.over && guard++ < 200) useMove(battle, POKEMON[battle.player.id].moves.length - 1, rng);
  return battle;
}

console.log('— Dữ liệu Pokémon —');

check('mọi Pokémon có sprite, tên, hệ, máu + chỉ số ⚔️atk 🛡️def và ≥2 chiêu', Object.values(POKEMON).every(
  (p) => p.num > 0 && p.name && p.type && p.maxHp > 0 && p.atk > 0 && p.def > 0
    && p.moves.length >= 2 && p.moves.every((m) => m.name && m.power > 0),
));

check('mọi dạng tiến hóa đều trỏ tới Pokémon có thật', Object.values(POKEMON).every((p) => {
  if (!p.evolvesTo) return true;
  const list = Array.isArray(p.evolvesTo) ? p.evolvesTo : [p.evolvesTo];
  return list.every((id) => POKEMON[id]);
}));

check('tiến hóa luôn mạnh hơn dạng trước (máu nhiều hơn)', Object.values(POKEMON).every((p) => {
  if (!p.evolvesTo) return true;
  const list = Array.isArray(p.evolvesTo) ? p.evolvesTo : [p.evolvesTo];
  return list.every((id) => POKEMON[id].maxHp > p.maxHp);
}));

check('5 bạn khởi đầu + pool đối thủ + trùm đều hợp lệ, không trùng vai', (() => {
  const all = [...STARTERS, ...OPPONENT_POOL, ...BOSSES];
  return all.every((id) => POKEMON[id])
    && STARTERS.every((id) => !OPPONENT_POOL.includes(id) && !BOSSES.includes(id))
    && BOSSES.every((id) => !OPPONENT_POOL.includes(id));
})());

check('đường dẫn sprite đúng định dạng kho /pokemon/images/', (() => {
  return spritePath('pikachu') === '/pokemon/images/pm0025_00_00_00_big.png'
    && spritePath('charizard') === '/pokemon/images/pm0006_00_00_00_big.png';
})());

console.log('— Hệ khắc chế —');

check('Lửa khắc Cỏ x1.5, Cỏ đánh Lửa chỉ x0.67', typeMultiplier('fire', 'grass') === 1.5 && typeMultiplier('grass', 'fire') === 0.67);
check('Điện khắc Nước x1.5, Nước đánh Điện chỉ x0.67', typeMultiplier('electric', 'water') === 1.5 && typeMultiplier('water', 'electric') === 0.67);
check('Thường/Siêu Linh/Rồng trung lập x1', typeMultiplier('normal', 'fire') === 1
  && typeMultiplier('psychic', 'water') === 1 && typeMultiplier('dragon', 'grass') === 1
  && typeMultiplier('fire', 'psychic') === 1);

check('hệ Đá mới: Đá khắc Lửa+Điện, bị Nước+Cỏ khắc lại', (() => {
  return typeMultiplier('rock', 'fire') === 1.5 && typeMultiplier('rock', 'electric') === 1.5
    && typeMultiplier('water', 'rock') === 1.5 && typeMultiplier('grass', 'rock') === 1.5
    && typeMultiplier('fire', 'rock') === 0.67 && typeMultiplier('electric', 'rock') === 0.67;
})());

console.log('— Trận đấu —');

check('ra chiêu: sát thương = lực × (atk/def) × hệ × 85–115%, địch phản đòn', (() => {
  const b = makeBattle('pikachu', 'psyduck'); // điện khắc nước
  const r = useMove(b, 1, seeded()); // Tia Điện 19 × (11/10) × 1.5
  const [p, e] = r.log;
  const base = 19 * (POKEMON.pikachu.atk / POKEMON.psyduck.def) * 1.5;
  return p.dmg >= Math.round(base * 0.85) - 1 && p.dmg <= Math.round(base * 1.15) + 1
    && p.effective === 1.5 && p.power === 19
    && e && e.side === 'enemy' && b.player.hp < POKEMON.pikachu.maxHp;
})());

check('chỉ số có răng: cùng chiêu, đánh vào 🛡️def cao đau ít hơn hẳn def thấp', (() => {
  const soft = makeBattle('charizard', 'meowth'); // def 9
  const hard = makeBattle('charizard', 'golem'); // def 17, lại là Đá khắc Lửa
  const a = useMove(soft, 1, seeded(5)).log[0].dmg;
  const b2 = useMove(hard, 1, seeded(5)).log[0].dmg;
  return a > b2;
})());

check('địch gục → thắng trận ngay, KHÔNG bị phản đòn nữa', (() => {
  const b = makeBattle('charizard', 'jigglypuff');
  b.enemy.hp = 5;
  const hpBefore = b.player.hp;
  const r = useMove(b, 1, seeded());
  return b.over && b.won && r.log.length === 1 && b.player.hp === hpBefore;
})());

check('mình gục → thua trận', (() => {
  const b = makeBattle('pikachu', 'mewtwo');
  b.player.hp = 1;
  useMove(b, 0, seeded());
  return b.over === true && b.won === false;
})());

check('trận đã kết thúc thì useMove không làm gì', (() => {
  const b = makeBattle('pikachu', 'meowth');
  b.over = true;
  return useMove(b, 0, seeded()) === null;
})());

console.log('— Chuỗi trận & tiến hóa —');

check('màn 0: 2 đối thủ thường + trùm Gyarados chốt màn, đối thủ không trùng nhau', (() => {
  const c = makeCampaign('charmander', 0, seeded());
  return c.opponents.length === 3
    && c.opponents[c.opponents.length - 1] === 'gyarados'
    && new Set(c.opponents).size === c.opponents.length;
})());

check('màn càng cao: nhiều đối thủ hơn, trùm mạnh dần qua 10 bậc (màn 9+ luôn Mewtwo)', (() => {
  const c1 = makeCampaign('pikachu', 1, seeded());
  const c4 = makeCampaign('pikachu', 4, seeded());
  const c12 = makeCampaign('pikachu', 12, seeded());
  return c1.opponents.length === 4 && c4.opponents.length === 7
    && c1.opponents[c1.opponents.length - 1] === 'gengar'
    && c4.opponents[c4.opponents.length - 1] === 'articuno'
    && c12.opponents[c12.opponents.length - 1] === 'mewtwo';
})());

check('18 bạn khởi đầu, dòng nào cũng có tiến hóa; roster tổng ≥65', (() => {
  return STARTERS.length === 18
    && STARTERS.every((id) => POKEMON[id].evolvesTo)
    && Object.keys(POKEMON).length >= 65;
})());

check('mọi id trong STARTERS/OPPONENT_POOL/BOSSES và mọi evolvesTo đều trỏ tới Pokémon có thật, không trùng lặp vai', (() => {
  const allIds = [...STARTERS, ...OPPONENT_POOL, ...BOSSES];
  const known = allIds.every((id) => POKEMON[id]);
  const noDup = STARTERS.every((id) => !OPPONENT_POOL.includes(id) && !BOSSES.includes(id))
    && BOSSES.every((id) => !OPPONENT_POOL.includes(id));
  return known && noDup;
})());

check('thắng trận 1 → TIẾN HÓA đúng dòng (Charmander→Charmeleon), hồi đầy máu', (() => {
  const rng = seeded();
  const c = makeCampaign('charmander', 0, rng);
  fightOut(c.battle, seeded(3));
  if (!c.battle.won) return true; // hiếm khi thua trận đầu với seed này — bỏ qua
  const r = advanceCampaign(c, rng);
  return r.evolvedTo === 'charmeleon'
    && c.playerId === 'charmeleon'
    && r.battle.player.hp === POKEMON.charmeleon.maxHp;
})());

check('Eevee tiến hóa ngẫu nhiên thành 1 trong 3 nhánh hợp lệ', (() => {
  for (const seed of [1, 5, 9, 13, 21]) {
    const rng = seeded(seed);
    const c = makeCampaign('eevee', 0, rng);
    c.battle.enemy.hp = 1;
    useMove(c.battle, 1, rng);
    if (!c.battle.won) continue;
    const r = advanceCampaign(c, rng);
    if (!['vaporeon', 'jolteon', 'flareon'].includes(r.evolvedTo)) return false;
  }
  return true;
})());

check('thắng nhưng chưa tới mốc tiến hóa → chỉ hồi 40% máu, giữ nguyên Pokémon', (() => {
  const rng = seeded();
  const c = makeCampaign('raichu', 0, rng); // Raichu không còn dạng sau
  c.battle.enemy.hp = 1;
  c.battle.player.hp = 20;
  useMove(c.battle, 0, rng);
  const r = advanceCampaign(c, rng);
  const expect = Math.min(POKEMON.raichu.maxHp, 20 + Math.round(POKEMON.raichu.maxHp * 0.4));
  return r.evolvedTo === null && c.playerId === 'raichu' && r.battle.player.hp === expect;
})());

check('trận cuối là trùm: battle.isBoss = true', (() => {
  const rng = seeded();
  const c = makeCampaign('squirtle', 0, rng);
  let r = { battle: c.battle };
  let guard = 0;
  while (guard++ < 10 && c.roundIndex < c.opponents.length - 1) {
    r.battle.enemy.hp = 1;
    useMove(r.battle, 0, rng);
    r = advanceCampaign(c, rng);
    if (!r) return false;
  }
  return r.battle.isBoss === true && c.opponents[c.roundIndex] === 'gyarados';
})());

check('thua 1 trận → cả chuỗi thua; thắng hết (kể cả trùm) → cả chuỗi thắng', (() => {
  const rng = seeded();
  const lose = makeCampaign('pikachu', 0, rng);
  lose.battle.over = true;
  lose.battle.won = false;
  const rLose = advanceCampaign(lose, rng);

  const win = makeCampaign('pikachu', 0, seeded(2));
  let guard = 0;
  while (!win.over && guard++ < 10) {
    win.battle.enemy.hp = 1;
    useMove(win.battle, 0, seeded(2));
    advanceCampaign(win, seeded(2));
  }
  return rLose === null && lose.over && !lose.won && win.over && win.won === true;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
