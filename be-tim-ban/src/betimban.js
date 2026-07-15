// Bé Tìm Bạn: chuyển thể "trốn tìm" sang dạng tìm-đồ-vật-ẩn — vài bạn nhỏ/con vật "trốn"
// lẫn trong 1 đám đồ vật lộn xộn, bé chạm đúng hết số lượng cần tìm trước khi hết giờ.
// Toàn bộ file này thuần logic, test được độc lập.

export const FIELD_W = 640;
export const FIELD_H = 640;
export const ITEM_R = 26;

const DECOY_POOL = ['🍎', '🍌', '🍇', '🥕', '⚽', '🎈', '🚗', '📚', '🧸', '🌟', '🍀', '🎀', '🐚', '🍄', '🎲', '🔔'];
const TARGET_POOL = ['🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🐮', '🐸', '🐱', '🐶'];

function shuffle(arr, rng) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Đặt 1 vật vào vị trí ngẫu nhiên, tránh chồng quá sát vật đã có (thử tối đa 30 lần). */
function placeItem(items, emoji, isTarget, rng) {
  let x = FIELD_W / 2;
  let y = FIELD_H / 2;
  let tries = 0;
  do {
    x = ITEM_R + rng() * (FIELD_W - ITEM_R * 2);
    y = ITEM_R + rng() * (FIELD_H - ITEM_R * 2);
    tries++;
    // Khoảng cách tối thiểu phải LỚN HƠN đường kính vùng chạm (2×ITEM_R) — nếu không, 2 vật
    // sát nhau sẽ có vùng chạm đè lên nhau, chạm vào 1 vật có thể vô tình trúng vật bên cạnh.
  } while (tries < 30 && items.some((it) => Math.hypot(it.x - x, it.y - y) < ITEM_R * 2.15));
  items.push({ id: items.length, emoji, x, y, isTarget, found: false });
}

export function makeLevel(levelIndex, rng = Math.random) {
  const numTargetTypes = 1 + Math.min(2, Math.floor(levelIndex / 3));
  const targetEmojis = shuffle(TARGET_POOL, rng).slice(0, numTargetTypes);
  const targetsNeeded = {};
  for (const e of targetEmojis) targetsNeeded[e] = 2 + Math.floor(rng() * 3); // 2-4 lần mỗi loại

  const items = [];
  for (const e of targetEmojis) {
    for (let i = 0; i < targetsNeeded[e]; i++) placeItem(items, e, true, rng);
  }

  const totalItems = 24 + Math.min(16, levelIndex * 3);
  const decoyPool = DECOY_POOL.filter((e) => !targetEmojis.includes(e));
  const decoyCount = Math.max(0, totalItems - items.length);
  for (let i = 0; i < decoyCount; i++) {
    const e = decoyPool[Math.floor(rng() * decoyPool.length)];
    placeItem(items, e, false, rng);
  }

  return {
    level: levelIndex,
    items,
    targetsNeeded,
    timeLeft: Math.max(20, 40 - levelIndex),
    score: 0,
    over: false,
    won: false,
  };
}

function checkEnd(game) {
  const allFound = Object.values(game.targetsNeeded).every((n) => n <= 0);
  if (allFound) { game.over = true; game.won = true; return; }
  if (game.timeLeft <= 0) { game.over = true; game.won = false; }
}

/** Chạm vào (x,y): tìm vật CHƯA được tìm thấy gần nhất trong bán kính ITEM_R.
 * Trả {hit:true,emoji} nếu chạm trúng bạn cần tìm; {hit:false,wrong:true} nếu trúng đồ vật
 * không cần tìm; {hit:false} nếu chạm vào chỗ trống. */
export function tapAt(game, x, y) {
  if (game.over) return { hit: false };
  const item = game.items.find((it) => !it.found && Math.hypot(it.x - x, it.y - y) < ITEM_R);
  if (!item) return { hit: false };
  if (!item.isTarget) return { hit: false, wrong: true };
  item.found = true;
  game.targetsNeeded[item.emoji]--;
  game.score += 10;
  checkEnd(game);
  return { hit: true, emoji: item.emoji };
}

/** Một bước đếm giờ. dtMs = số mili-giây trôi qua kể từ bước trước. */
export function stepTime(game, dtMs) {
  if (game.over) return game;
  game.timeLeft = Math.max(0, game.timeLeft - dtMs / 1000);
  if (game.timeLeft <= 0) {
    game.over = true;
    game.won = false;
  }
  return game;
}
