// Ốc Sên Phiêu Lưu Ăn Từ Vựng: chú ốc sên bò dọc 1 hàng thức ăn (trái cây/đồ
// vật) đặt sẵn trên đường — bé chạm vào món nào, ốc sên bò tới ăn món đó,
// máy đọc to tên tiếng Anh. Ăn hết cả hàng là qua màn mới (nhiều món hơn 1
// chút, đúng tinh thần "phiêu lưu" — hành trình dài dần), đi hết 8 màn thì
// hoàn thành cuộc phiêu lưu. Không có đáp án sai — ăn món nào cũng đúng.
// File thuần logic, không đụng DOM, test độc lập.

import { WORDS } from '../../shared/fruit-object-words.js';

export const START_ITEMS = 5;
export const ITEMS_PER_LEVEL_INCREMENT = 1;
export const MAX_ITEMS = 10;
export const TOTAL_LEVELS = 8;
export const POINTS_PER_ITEM = 10;

function shuffle(arr, rng) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Số món ăn của 1 màn — tăng dần theo màn, chặn ở MAX_ITEMS. */
export function foodCountForLevel(level) {
  return Math.min(MAX_ITEMS, START_ITEMS + (level - 1) * ITEMS_PER_LEVEL_INCREMENT);
}

/** Sinh hàng thức ăn cho 1 màn — không trùng từ trong cùng màn. */
function makeFoods(count, rng) {
  return shuffle(WORDS, rng).slice(0, count).map((word, i) => ({ uid: i + 1, word, eaten: false }));
}

/** Khởi tạo 1 lượt phiêu lưu, bắt đầu ở màn 1. */
export function makeGame(rng = Math.random) {
  return {
    rng,
    level: 1,
    foods: makeFoods(START_ITEMS, rng),
    eatenCount: 0,
    score: 0,
    over: false,
    won: false,
  };
}

/** Ốc sên ăn 1 món theo uid — trả về từ đã ăn, hoặc null nếu không hợp lệ/đã
 * ăn rồi/ván đã kết thúc. Không có khái niệm "ăn sai" — món nào cũng được. */
export function eatFood(game, uid) {
  if (game.over) return null;
  const food = game.foods.find((f) => f.uid === uid && !f.eaten);
  if (!food) return null;
  food.eaten = true;
  game.eatenCount++;
  game.score += POINTS_PER_ITEM;
  return food.word;
}

/** Cả hàng thức ăn của màn hiện tại đã được ăn hết chưa? */
export function isLevelComplete(game) {
  return game.foods.every((f) => f.eaten);
}

/** Qua màn kế tiếp — sinh hàng thức ăn mới (nhiều hơn 1 chút). Đã tới màn
 * cuối (TOTAL_LEVELS) thì hoàn thành cuộc phiêu lưu, ván kết thúc THẮNG. */
export function nextLevel(game) {
  if (game.over) return game;
  if (game.level >= TOTAL_LEVELS) {
    game.over = true;
    game.won = true;
    return game;
  }
  game.level++;
  game.foods = makeFoods(foodCountForLevel(game.level), game.rng);
  return game;
}
