// Ghép Từ Vựng Và Hình Ảnh Đúng: trò lật thẻ trí nhớ — mỗi từ có 2 lá bài,
// 1 lá hình (emoji), 1 lá CHỮ (từ tiếng Anh viết ra). Bé lật 2 lá bất kỳ,
// đúng cặp hình+chữ của cùng 1 từ thì giữ nguyên úp mở + máy đọc to từ đó;
// sai cặp thì úp lại. Khác các game khác trong bộ sưu tập (vốn chỉ luyện
// NGHE), trò này luyện thêm ĐỌC — bé phải nhận mặt chữ tiếng Anh viết ra.
// Ăn hết cả bàn là qua màn mới (nhiều cặp hơn), đi hết TOTAL_LEVELS màn là
// hoàn thành. File thuần logic, không đụng DOM, test độc lập.

import { WORDS } from '../../shared/fruit-object-words.js';

export const START_PAIRS = 6;
export const PAIRS_INCREMENT = 1;
export const MAX_PAIRS = 10;
export const TOTAL_LEVELS = 6;
export const POINTS_PER_MATCH = 10;

function shuffle(arr, rng) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Số cặp thẻ của 1 màn — tăng dần theo màn, chặn ở MAX_PAIRS. */
export function pairsForLevel(level) {
  return Math.min(MAX_PAIRS, START_PAIRS + (level - 1) * PAIRS_INCREMENT);
}

/** Sinh bộ bài cho 1 màn: mỗi từ có 2 lá (hình + chữ), xáo ngẫu nhiên. */
function makeCards(pairCount, rng) {
  const words = shuffle(WORDS, rng).slice(0, pairCount);
  const cards = [];
  let uid = 1;
  for (const word of words) {
    cards.push({
      uid: uid++, pairId: word.en, kind: 'picture', word, matched: false,
    });
    cards.push({
      uid: uid++, pairId: word.en, kind: 'word', word, matched: false,
    });
  }
  return shuffle(cards, rng);
}

/** Khởi tạo 1 lượt chơi, bắt đầu ở màn 1. */
export function makeGame(rng = Math.random) {
  return {
    rng,
    level: 1,
    cards: makeCards(START_PAIRS, rng),
    flipped: [],
    matchedCount: 0,
    score: 0,
    over: false,
    won: false,
  };
}

/**
 * Lật 1 lá bài theo uid.
 * - Lá thứ NHẤT trong lượt: trả về { flipped: card }.
 * - Lá thứ HAI: kiểm tra cặp ngay, trả về { pairResult: 'match'|'mismatch',
 *   cards: [a, b] } — đúng cặp thì tự đánh dấu matched + cộng điểm.
 * Trả về null nếu: ván đã kết thúc, đang có sẵn 2 lá chờ resolveFlip(), uid
 * không hợp lệ, lá đã ghép xong, hoặc lá đó đang lật dở (bấm trùng).
 */
export function flipCard(game, uid) {
  if (game.over || game.flipped.length >= 2) return null;
  const card = game.cards.find((c) => c.uid === uid);
  if (!card || card.matched || game.flipped.includes(uid)) return null;
  game.flipped.push(uid);
  if (game.flipped.length === 1) return { flipped: card };

  const [uidA, uidB] = game.flipped;
  const a = game.cards.find((c) => c.uid === uidA);
  const b = game.cards.find((c) => c.uid === uidB);
  const isMatch = a.pairId === b.pairId;
  if (isMatch) {
    a.matched = true;
    b.matched = true;
    game.matchedCount++;
    game.score += POINTS_PER_MATCH;
  }
  return { pairResult: isMatch ? 'match' : 'mismatch', cards: [a, b] };
}

/** Đóng lượt sau khi đã xử lý xong 2 lá vừa lật (dù đúng hay sai) — cho bé
 * lật cặp tiếp theo. */
export function resolveFlip(game) {
  game.flipped = [];
}

export function isLevelComplete(game) {
  return game.cards.every((c) => c.matched);
}

/** Qua màn kế tiếp — sinh bàn bài mới (nhiều cặp hơn). Đã tới màn cuối thì
 * hoàn thành, ván kết thúc THẮNG. */
export function nextLevel(game) {
  if (game.over) return game;
  if (game.level >= TOTAL_LEVELS) {
    game.over = true;
    game.won = true;
    return game;
  }
  game.level++;
  game.cards = makeCards(pairsForLevel(game.level), game.rng);
  game.flipped = [];
  return game;
}
