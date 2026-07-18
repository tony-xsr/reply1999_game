// Logic Trường Bắn Từ Vựng — thuần, test được.
// 1 hàng "mục tiêu" (bia bắn) đứng yên, mỗi mục tiêu mang 1 từ vựng (emoji +
// tên tiếng Anh). Máy XƯỚNG TÊN lần lượt từng từ trong hàng (không theo thứ
// tự cố định) — bé phải bắn (chạm) ĐÚNG mục tiêu đang được xướng tên, bắn
// nhầm không tính. Bắn hết cả hàng là qua màn mới (nhiều mục tiêu hơn).
// Khác Bắn Chim Từ Vựng (chim ngẫu nhiên xuất hiện, tự do bắn bất kỳ lúc
// nào) — ở đây TOÀN BỘ mục tiêu hiện diện cùng lúc, thử thách là tìm ĐÚNG
// mục tiêu đang được gọi tên giữa các lựa chọn nhìn thấy hết.

import { WORDS } from '../../shared/fruit-object-words.js';

export const START_TARGETS = 6;
export const TARGETS_INCREMENT = 1;
export const MAX_TARGETS = 10;
export const TOTAL_LEVELS = 6;
export const POINTS_PER_HIT = 10;

function shuffle(arr, rng) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Số mục tiêu của 1 màn — tăng dần theo màn, chặn ở MAX_TARGETS. */
export function targetsForLevel(level) {
  return Math.min(MAX_TARGETS, START_TARGETS + (level - 1) * TARGETS_INCREMENT);
}

function makeRow(count, rng) {
  return shuffle(WORDS, rng).slice(0, count).map((word, i) => ({ uid: i + 1, word, down: false }));
}

/** Chọn 1 mục tiêu CÒN ĐỨNG bất kỳ để xướng tên tiếp theo, null nếu hết. */
function pickNextCallout(targets, rng) {
  const alive = targets.filter((tg) => !tg.down);
  if (!alive.length) return null;
  return alive[Math.floor(rng() * alive.length)].word;
}

/** Khởi tạo 1 lượt chơi, bắt đầu ở màn 1 với 1 hàng mục tiêu + từ đang xướng. */
export function makeGame(rng = Math.random) {
  const targets = makeRow(START_TARGETS, rng);
  return {
    rng, level: 1, targets, current: pickNextCallout(targets, rng), score: 0, over: false, won: false,
  };
}

/**
 * Bắn 1 mục tiêu theo uid. Chỉ tính điểm nếu mục tiêu đó ĐÚNG là mục tiêu
 * đang được xướng tên (`game.current`) — bắn nhầm mục tiêu khác không có
 * tác dụng gì (mục tiêu vẫn đứng, không mất lượt).
 * @returns {{target, correct, roundDone}|null}
 */
export function shoot(game, uid) {
  if (game.over || !game.current) return null;
  const tg = game.targets.find((x) => x.uid === uid && !x.down);
  if (!tg) return null;
  const correct = tg.word.en === game.current.en;
  if (!correct) return { target: tg, correct: false, roundDone: false };
  tg.down = true;
  game.score += POINTS_PER_HIT;
  game.current = pickNextCallout(game.targets, game.rng);
  return { target: tg, correct: true, roundDone: game.targets.every((x) => x.down) };
}

/** Qua màn kế tiếp — sinh hàng mục tiêu mới (nhiều hơn). Đã tới màn cuối thì
 * hoàn thành, ván kết thúc THẮNG. */
export function nextLevel(game) {
  if (game.over) return game;
  if (game.level >= TOTAL_LEVELS) {
    game.over = true;
    game.won = true;
    return game;
  }
  game.level++;
  game.targets = makeRow(targetsForLevel(game.level), game.rng);
  game.current = pickNextCallout(game.targets, game.rng);
  return game;
}
