// Logic Đào Vàng Từ Vựng — thuần, test được.
// Dưới lòng đất là các ô đất chôn từ vựng (emoji + tên tiếng Anh). Máy công
// bố 1 từ mục tiêu — bé đào (chạm) từng ô cho tới khi đào trúng ô mang đúng
// từ đó. Ô đã đào (dù đúng hay sai) giữ nguyên lộ ra vĩnh viễn — giống việc
// đào đất thật, không "lấp lại" — nên bé có thể ghi nhớ & loại trừ dần.
// Đào trúng là qua màn mới (nhiều ô hơn, khó nhớ hơn).

import { WORDS } from '../../shared/fruit-object-words.js';

export const START_TILES = 8;
export const TILES_INCREMENT = 2;
export const MAX_TILES = 18;
export const TOTAL_LEVELS = 6;
export const POINTS_PER_FIND = 10;

function shuffle(arr, rng) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Số ô đất của 1 màn — tăng dần theo màn, chặn ở MAX_TILES. */
export function tilesForLevel(level) {
  return Math.min(MAX_TILES, START_TILES + (level - 1) * TILES_INCREMENT);
}

function makeField(count, rng) {
  return shuffle(WORDS, rng).slice(0, count).map((word, i) => ({ uid: i + 1, word, dug: false }));
}

/** Khởi tạo 1 lượt chơi, bắt đầu ở màn 1 với 1 từ mục tiêu chôn sẵn trong ô đất. */
export function makeGame(rng = Math.random) {
  const tiles = makeField(START_TILES, rng);
  const target = tiles[Math.floor(rng() * tiles.length)].word;
  return {
    rng, level: 1, tiles, target, score: 0, over: false, won: false,
  };
}

/**
 * Đào 1 ô đất theo uid. Trả về { tile, correct } — tile.word luôn lộ ra dù
 * đúng hay sai (đào là vĩnh viễn, không "lấp lại"). Trả về null nếu: ván đã
 * kết thúc, uid không hợp lệ, hoặc ô đó đã đào rồi.
 */
export function digTile(game, uid) {
  if (game.over) return null;
  const tile = game.tiles.find((t) => t.uid === uid && !t.dug);
  if (!tile) return null;
  tile.dug = true;
  const correct = tile.word.en === game.target.en;
  if (correct) game.score += POINTS_PER_FIND;
  return { tile, correct };
}

/** Qua màn kế tiếp — sinh bãi đất mới (nhiều ô hơn) + từ mục tiêu mới. Đã tới
 * màn cuối thì hoàn thành, ván kết thúc THẮNG. */
export function nextLevel(game) {
  if (game.over) return game;
  if (game.level >= TOTAL_LEVELS) {
    game.over = true;
    game.won = true;
    return game;
  }
  game.level++;
  game.tiles = makeField(tilesForLevel(game.level), game.rng);
  game.target = game.tiles[Math.floor(game.rng() * game.tiles.length)].word;
  return game;
}
