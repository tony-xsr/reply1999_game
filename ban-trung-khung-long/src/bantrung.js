// Logic Bắn Trứng Khủng Long Từ Vựng — thuần, test được.
// Khủng long mẹ đứng trên cao thả trứng rơi xuống theo nhiều cột (lane),
// mỗi quả trứng mang 1 từ vựng (emoji + tên tiếng Anh). Máy công bố từ mục
// tiêu — bé CHỈ bắn (chạm) quả trứng mang đúng từ đó trước khi nó rơi chạm
// đất trong 45 giây. Bắn đúng 3 lần liên tiếp thì đổi từ mục tiêu khác. Bắn
// nhầm trứng bị trừ nhẹ điểm; để trứng rơi chạm đất mà chưa bắn thì không
// bị phạt (chỉ đơn giản biến mất, giống Chém Từ Vựng).

import { WORDS } from '../../shared/fruit-object-words.js';

export const ROUND_SECONDS = 45;
export const LANES = 4;
export const TARGET_HITS_TO_CHANGE = 3;
export const POINTS_HIT = 10;
export const POINTS_MISS = -5;

/** Chọn từ mục tiêu mới (khác từ cũ). */
export function pickTarget(prev = null, rng = Math.random) {
  for (;;) {
    const w = WORDS[Math.floor(rng() * WORDS.length)];
    if (!prev || w.en !== prev.en) return w;
  }
}

/** Sinh quả trứng mới: ~45% mang đúng từ mục tiêu, còn lại từ khác. */
export function makeEggWord(target, rng = Math.random) {
  if (rng() < 0.45) return target;
  for (;;) {
    const w = WORDS[Math.floor(rng() * WORDS.length)];
    if (w.en !== target.en) return w;
  }
}

/** Điểm khi bắn trúng trứng. @returns {delta, good} */
export function hitScore(eggWord, target) {
  return eggWord.en === target.en
    ? { delta: 10, good: true }
    : { delta: -5, good: false };
}

/** Nhịp trứng rơi nhanh dần theo thời gian đã trôi (giây). */
export function spawnDelay(elapsed) {
  return Math.max(500, 1100 - elapsed * 10);
}

export function makeGame() {
  return {
    items: [], nextUid: 1, score: 0, target: null, targetHits: 0, timeLeft: ROUND_SECONDS, over: false,
  };
}

/** Thả 1 quả trứng mới vào 1 cột còn trống, tối đa LANES quả cùng lúc.
 * `busyLanes` (tuỳ chọn) liệt kê các cột đang có trứng rơi, tránh thả chồng
 * 2 quả cùng cột. */
export function spawnEgg(game, rng = Math.random, busyLanes = []) {
  if (game.over || game.items.length >= LANES) return null;
  const free = [];
  for (let i = 0; i < LANES; i++) if (!busyLanes.includes(i)) free.push(i);
  if (!free.length) return null;
  const lane = free[Math.floor(rng() * free.length)];
  const word = makeEggWord(game.target, rng);
  const item = {
    uid: game.nextUid++, lane, word,
  };
  game.items.push(item);
  return item;
}

/**
 * Bắn 1 quả trứng theo uid. Trả về { word, good, delta, targetChanged } hoặc
 * null nếu uid không tồn tại. Bắn đúng 3 lần liên tiếp thì tự đổi mục tiêu.
 */
export function shootEgg(game, uid) {
  if (game.over) return null;
  const idx = game.items.findIndex((it) => it.uid === uid);
  if (idx === -1) return null;
  const item = game.items[idx];
  game.items.splice(idx, 1);
  const { delta, good } = hitScore(item.word, game.target);
  game.score = Math.max(0, game.score + delta);
  let targetChanged = false;
  if (good) {
    game.targetHits++;
    if (game.targetHits >= TARGET_HITS_TO_CHANGE) {
      game.target = pickTarget(game.target);
      game.targetHits = 0;
      targetChanged = true;
    }
  }
  return {
    word: item.word, good, delta, targetChanged,
  };
}

/** Trứng rơi chạm đất mà chưa bắn — dọn khỏi màn hình, KHÔNG bị phạt. */
export function landEgg(game, uid) {
  const idx = game.items.findIndex((it) => it.uid === uid);
  if (idx === -1) return false;
  game.items.splice(idx, 1);
  return true;
}

export function tick(game, deltaSeconds) {
  if (game.over) return;
  game.timeLeft = Math.max(0, game.timeLeft - deltaSeconds);
  if (game.timeLeft <= 0) game.over = true;
}
