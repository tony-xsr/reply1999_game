// Thú Cưng Đại Chiến: đấu thú cưng theo lượt, có hệ khắc chế đơn giản (Lửa > Cỏ > Nước > Lửa).
// Bộ thú hoàn toàn tự đặt tên/hình (không dùng nhân vật/tên gọi của bất kỳ game thương mại nào).
// Toàn bộ file này thuần logic, test được độc lập.

export const TYPES = ['fire', 'water', 'grass'];
// Vòng khắc chế: Lửa thắng Cỏ, Cỏ thắng Nước, Nước thắng Lửa.
const BEATS = { fire: 'grass', grass: 'water', water: 'fire' };

export const CREATURES = {
  ga_lua: {
    name: 'Gà Lửa', type: 'fire', emoji: '🐓', maxHp: 42,
    moves: [{ name: 'Mổ Lửa', power: 11 }, { name: 'Hỏa Cầu', power: 19 }],
  },
  ca_nuoc: {
    name: 'Cá Chép Nước', type: 'water', emoji: '🐟', maxHp: 44,
    moves: [{ name: 'Vẫy Đuôi', power: 11 }, { name: 'Vòi Nước', power: 19 }],
  },
  trau_co: {
    name: 'Trâu Cỏ', type: 'grass', emoji: '🐃', maxHp: 46,
    moves: [{ name: 'Húc Đầu', power: 11 }, { name: 'Dây Leo', power: 19 }],
  },
};

/** Hệ tấn công khắc hệ phòng thủ → sát thương x1.5; bị khắc lại → x0.67; còn lại → x1. */
export function typeMultiplier(atkType, defType) {
  if (BEATS[atkType] === defType) return 1.5;
  if (BEATS[defType] === atkType) return 0.67;
  return 1;
}

function computeDamage(power, atkType, defType, rng) {
  const mult = typeMultiplier(atkType, defType);
  const variance = 0.85 + rng() * 0.3; // dao động nhẹ 85%-115%, không có "trượt đòn" gây ức chế
  return Math.max(1, Math.round(power * mult * variance));
}

/** Đối thủ AI: nếu có chiêu khắc chế người chơi thì dùng chiêu mạnh nhất, không thì chọn ngẫu nhiên. */
function pickEnemyMoveIndex(defDef, atkDef, rng) {
  if (typeMultiplier(defDef.type, atkDef.type) > 1) return defDef.moves.length - 1;
  return Math.floor(rng() * defDef.moves.length);
}

export function makeBattle(playerCreatureId, enemyCreatureId, startHp) {
  const playerMax = CREATURES[playerCreatureId].maxHp;
  return {
    player: { id: playerCreatureId, hp: startHp == null ? playerMax : Math.min(playerMax, startHp) },
    enemy: { id: enemyCreatureId, hp: CREATURES[enemyCreatureId].maxHp },
    turn: 0,
    log: [],
    over: false,
    won: false,
  };
}

/** Người chơi ra chiêu `moveIndex`; nếu địch chưa gục thì địch phản đòn ngay trong cùng lượt. */
export function useMove(battle, moveIndex, rng = Math.random) {
  if (battle.over) return null;
  const atkDef = CREATURES[battle.player.id];
  const defDef = CREATURES[battle.enemy.id];
  const move = atkDef.moves[moveIndex];
  if (!move) return null;

  const dmgToEnemy = computeDamage(move.power, atkDef.type, defDef.type, rng);
  battle.enemy.hp = Math.max(0, battle.enemy.hp - dmgToEnemy);
  const turnLog = [{ side: 'player', move: move.name, dmg: dmgToEnemy }];

  if (battle.enemy.hp <= 0) {
    battle.over = true;
    battle.won = true;
    battle.turn++;
    battle.log.push(...turnLog);
    return { log: turnLog };
  }

  const enemyMoveIdx = pickEnemyMoveIndex(defDef, atkDef, rng);
  const enemyMove = defDef.moves[enemyMoveIdx];
  const dmgToPlayer = computeDamage(enemyMove.power, defDef.type, atkDef.type, rng);
  battle.player.hp = Math.max(0, battle.player.hp - dmgToPlayer);
  turnLog.push({ side: 'enemy', move: enemyMove.name, dmg: dmgToPlayer });

  if (battle.player.hp <= 0) {
    battle.over = true;
    battle.won = false;
  }

  battle.turn++;
  battle.log.push(...turnLog);
  return { log: turnLog };
}

function shuffle(arr, rng) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Chuỗi trận đấu liên tiếp: thắng 1 trận thì được hồi 30% máu rồi đấu tiếp đối thủ kế. */
export function makeCampaign(playerCreatureId, levelIndex, rng = Math.random) {
  const otherIds = Object.keys(CREATURES).filter((id) => id !== playerCreatureId);
  const rounds = Math.min(otherIds.length, 2 + Math.floor(levelIndex / 2));
  const opponents = shuffle(otherIds, rng).slice(0, rounds);
  // Đảm bảo luôn có ít nhất 1 đối thủ (khi otherIds rỗng thì không thể chơi — không xảy ra với 3 con thú)
  return {
    level: levelIndex,
    playerCreatureId,
    opponents,
    roundIndex: 0,
    battle: makeBattle(playerCreatureId, opponents[0]),
    over: false,
    won: false,
  };
}

/** Gọi sau khi 1 trận trong chuỗi kết thúc: thua → cả chuỗi thua; thắng trận cuối → cả chuỗi thắng;
 * thắng nhưng còn đối thủ → hồi máu 30% rồi vào trận kế. Trả về trận đấu mới hoặc null nếu chuỗi đã xong. */
export function advanceCampaign(campaign, rng = Math.random) {
  if (!campaign.battle.over || campaign.over) return null;
  if (!campaign.battle.won) {
    campaign.over = true;
    campaign.won = false;
    return null;
  }
  campaign.roundIndex++;
  if (campaign.roundIndex >= campaign.opponents.length) {
    campaign.over = true;
    campaign.won = true;
    return null;
  }
  const maxHp = CREATURES[campaign.playerCreatureId].maxHp;
  const healedHp = Math.min(maxHp, campaign.battle.player.hp + Math.round(maxHp * 0.3));
  campaign.battle = makeBattle(campaign.playerCreatureId, campaign.opponents[campaign.roundIndex], healedHp);
  return campaign.battle;
}
