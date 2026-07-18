// Chém Từ Vựng: hàng loạt icon từ vựng (trái cây/đồ vật) bay lên từ dưới màn
// hình — bé chạm/"chém" TRÚNG icon nào, máy đọc to tên tiếng Anh của icon đó
// và cộng điểm. KHÔNG có đáp án sai — chém trúng bất kỳ icon nào cũng đúng,
// đây là trò rèn phản xạ + làm quen âm thanh từ vựng, không phải quiz đố.
// Icon bay hết thời gian mà chưa chạm tới thì biến mất, không bị trừ điểm.
// File thuần logic, không đụng DOM, test độc lập.

import { WORDS } from '../../shared/fruit-object-words.js';

export const ROUND_SECONDS = 45;
export const MAX_ON_SCREEN = 4;
export const POINTS_PER_SLICE = 10;

export function pickIcon(rng = Math.random) {
  return WORDS[Math.floor(rng() * WORDS.length)];
}

export function makeGame() {
  return {
    items: [],
    nextUid: 1,
    score: 0,
    slicedCount: 0,
    missedCount: 0,
    timeLeft: ROUND_SECONDS,
    over: false,
  };
}

/** Sinh 1 icon mới bay lên — bỏ qua êm nếu màn đã đủ icon hoặc ván đã hết giờ. */
export function spawnItem(game, rng = Math.random) {
  if (game.over || game.items.length >= MAX_ON_SCREEN) return null;
  const word = pickIcon(rng);
  const item = { uid: game.nextUid++, word, sliced: false };
  game.items.push(item);
  return item;
}

/** Chém trúng icon theo uid — luôn "đúng" (không có khái niệm sai), cộng điểm
 * và trả về từ để đọc to. Trả về null nếu icon không còn tồn tại/đã chém rồi. */
export function sliceItem(game, uid) {
  const item = game.items.find((it) => it.uid === uid && !it.sliced);
  if (!item) return null;
  item.sliced = true;
  game.score += POINTS_PER_SLICE;
  game.slicedCount++;
  return item.word;
}

/** Icon bay hết thời gian (rời khỏi màn hình) mà chưa bị chém — dọn khỏi
 * danh sách, không trừ điểm (đúng tinh thần "không có đáp án sai" của trò
 * này), chỉ đếm lại để phụ huynh xem tỉ lệ chém trúng nếu muốn. */
export function expireItem(game, uid) {
  const idx = game.items.findIndex((it) => it.uid === uid);
  if (idx === -1) return false;
  const wasSliced = game.items[idx].sliced;
  game.items.splice(idx, 1);
  if (!wasSliced) game.missedCount++;
  return true;
}

/** Trôi thời gian ván chơi — hết giờ thì kết thúc. */
export function tick(game, deltaSeconds) {
  if (game.over) return;
  game.timeLeft = Math.max(0, game.timeLeft - deltaSeconds);
  if (game.timeLeft <= 0) game.over = true;
}
