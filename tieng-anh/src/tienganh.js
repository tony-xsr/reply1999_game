// Logic Tiếng Anh Nâng Cao — thuần, nhận rng để test tất định.
// 2 trò: ghép câu đơn giản S+V+O / phát âm theo mẫu (dữ liệu từ dùng chung với tap-viet).

import { EN_WORDS } from '../../tap-viet/src/strokes.js';

function shuffle(arr, rng = Math.random) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const pick = (arr, n, rng) => shuffle(arr, rng).slice(0, n);

/* ===== 1. Ghép Câu Đơn Giản (Subject + Verb + Object) ===== */

export const SENTENCES = [
  { words: ['I', 'like', 'cats'], emoji: '🐱' },
  { words: ['I', 'like', 'dogs'], emoji: '🐶' },
  { words: ['She', 'has', 'a', 'ball'], emoji: '⚽' },
  { words: ['He', 'has', 'a', 'kite'], emoji: '🪁' },
  { words: ['We', 'like', 'apples'], emoji: '🍎' },
  { words: ['They', 'like', 'bananas'], emoji: '🍌' },
  { words: ['I', 'see', 'a', 'bird'], emoji: '🐦' },
  { words: ['She', 'sees', 'a', 'fish'], emoji: '🐟' },
  { words: ['He', 'wants', 'water'], emoji: '💧' },
  { words: ['I', 'want', 'juice'], emoji: '🧃' },
  { words: ['We', 'see', 'the', 'sun'], emoji: '☀️' },
  { words: ['They', 'have', 'a', 'cake'], emoji: '🍰' },
];

/** Bộ 1 lượt: chọn câu (không lặp lại) + xáo từ, giữ correctIndex để chấm. */
export function makeSentenceSet(total = 8, rng = Math.random) {
  return pick(SENTENCES, total, rng).map((sentence) => ({
    sentence,
    shuffled: shuffle(sentence.words.map((w, i) => ({ word: w, correctIndex: i })), rng),
  }));
}

/* ===== 2. Phát Âm Theo Tôi (dùng lại 26 từ tiếng Anh của tap-viet) ===== */

export const PRONOUNCE_ITEMS = Object.entries(EN_WORDS).map(([letter, w]) => ({
  letter, word: w.word, emoji: w.emoji,
}));

/** Bộ 1 lượt: lấy ngẫu nhiên không trùng — không chấm đúng/sai, chỉ luyện nói. */
export function makePronounceSet(total = 8, rng = Math.random) {
  return pick(PRONOUNCE_ITEMS, total, rng);
}
