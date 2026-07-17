// Xếp Chữ Tiếng Anh: nghe/nhìn 1 từ vựng tiếng Anh minh họa bằng emoji, rồi CHẠM các
// ô chữ cái xáo trộn theo ĐÚNG THỨ TỰ để ghép lại đúng từ đó — giống Học Vần (ghép âm
// tiếng Việt) nhưng dành cho chính tả tiếng Anh, đọc bằng giọng en-US thật. Càng lên màn
// càng nhiều chữ cái GÂY NHIỄU trộn lẫn vào. Không mất mạng khi bấm sai — chỉ đứng yên
// chờ bấm đúng, giữ tinh thần "học mà chơi" nhẹ nhàng. File thuần logic, test độc lập.

/** Ngân hàng từ vựng — sắp theo ĐỘ DÀI tăng dần để chọn từ dễ→khó theo màn. */
export const WORD_BANK = [
  { word: 'CAT', emoji: '🐱', vi: 'con mèo' },
  { word: 'DOG', emoji: '🐶', vi: 'con chó' },
  { word: 'SUN', emoji: '☀️', vi: 'mặt trời' },
  { word: 'HAT', emoji: '🎩', vi: 'cái mũ' },
  { word: 'PIG', emoji: '🐷', vi: 'con lợn' },
  { word: 'CUP', emoji: '☕', vi: 'cái cốc' },
  { word: 'BUS', emoji: '🚌', vi: 'xe buýt' },
  { word: 'BED', emoji: '🛏️', vi: 'cái giường' },
  { word: 'FROG', emoji: '🐸', vi: 'con ếch' },
  { word: 'FISH', emoji: '🐟', vi: 'con cá' },
  { word: 'STAR', emoji: '⭐', vi: 'ngôi sao' },
  { word: 'MILK', emoji: '🥛', vi: 'sữa' },
  { word: 'BALL', emoji: '⚽', vi: 'quả bóng' },
  { word: 'BOOK', emoji: '📚', vi: 'quyển sách' },
  { word: 'DUCK', emoji: '🦆', vi: 'con vịt' },
  { word: 'MOON', emoji: '🌙', vi: 'mặt trăng' },
  { word: 'APPLE', emoji: '🍎', vi: 'quả táo' },
  { word: 'HOUSE', emoji: '🏠', vi: 'ngôi nhà' },
  { word: 'WATER', emoji: '💧', vi: 'nước' },
  { word: 'MOUSE', emoji: '🐭', vi: 'con chuột' },
  { word: 'HAPPY', emoji: '😀', vi: 'vui vẻ' },
  { word: 'GRAPE', emoji: '🍇', vi: 'quả nho' },
  { word: 'CLOUD', emoji: '☁️', vi: 'đám mây' },
  { word: 'TIGER', emoji: '🐯', vi: 'con hổ' },
  { word: 'ROBOT', emoji: '🤖', vi: 'người máy' },
  { word: 'ORANGE', emoji: '🍊', vi: 'quả cam' },
  { word: 'FLOWER', emoji: '🌸', vi: 'bông hoa' },
  { word: 'BANANA', emoji: '🍌', vi: 'quả chuối' },
  { word: 'RAINBOW', emoji: '🌈', vi: 'cầu vồng' },
  { word: 'ELEPHANT', emoji: '🐘', vi: 'con voi' },
].sort((a, b) => a.word.length - b.word.length);

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** Màn cao hơn: nhiều từ hơn, từ dài hơn (window trượt theo độ dài), nhiều chữ nhiễu hơn. */
export function tuningFor(levelIndex) {
  return {
    wordsPerRound: Math.min(8, 4 + Math.floor(levelIndex / 2)),
    decoyCount: Math.min(3, Math.floor(levelIndex / 2)),
  };
}

function shuffle(arr, rng) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Chọn N từ không lặp từ 1 "cửa sổ" độ dài phù hợp màn — càng lên màn cửa sổ càng dịch tới từ dài. */
export function pickWords(count, levelIndex, rng = Math.random) {
  const start = Math.min(levelIndex * 2, Math.max(0, WORD_BANK.length - count));
  const window = WORD_BANK.slice(start, Math.min(WORD_BANK.length, start + count + 4));
  return shuffle(window, rng).slice(0, count);
}

/** Xáo chữ cái của từ + chèn thêm vài chữ GÂY NHIỄU không thuộc từ. */
function scrambleTiles(word, decoyCount, rng) {
  const tiles = word.split('').map((ch, i) => ({ key: `${ch}${i}`, char: ch }));
  for (let i = 0; i < decoyCount; i++) {
    let ch;
    do { ch = ALPHABET[Math.floor(rng() * ALPHABET.length)]; } while (word.includes(ch));
    tiles.push({ key: `decoy${i}`, char: ch });
  }
  return shuffle(tiles, rng);
}

export function makeRound(levelIndex, rng = Math.random) {
  const tune = tuningFor(levelIndex);
  const picked = pickWords(tune.wordsPerRound, levelIndex, rng);
  return {
    level: levelIndex,
    words: picked.map((w) => ({
      word: w.word, emoji: w.emoji, vi: w.vi,
      tiles: scrambleTiles(w.word, tune.decoyCount, rng),
      filled: [],
      usedKeys: [],
    })),
    wordIndex: 0,
    score: 0,
    wordsDone: 0,
    over: false,
    won: false,
  };
}

export function currentWord(round) {
  return round.words[round.wordIndex];
}

/**
 * Bé chạm 1 ô chữ cái theo `tileKey`. Trả về sự kiện:
 * { correct, wordDone, roundDone } — sai/đã dùng rồi thì correct=false, không có gì đổi.
 */
export function tapTile(round, tileKey) {
  const ev = { correct: false, wordDone: false, roundDone: false };
  if (round.over) return ev;
  const w = currentWord(round);
  if (!w || w.usedKeys.includes(tileKey)) return ev;
  const tile = w.tiles.find((t) => t.key === tileKey);
  if (!tile) return ev;
  const needed = w.word[w.filled.length];
  if (tile.char !== needed) return ev;

  w.usedKeys.push(tileKey);
  w.filled.push(tile.char);
  round.score += 10;
  ev.correct = true;

  if (w.filled.length === w.word.length) {
    ev.wordDone = true;
    round.wordsDone++;
    round.wordIndex++;
    if (round.wordIndex >= round.words.length) {
      round.over = true;
      round.won = true;
      round.score += round.words.length * 5; // thưởng hoàn thành cả màn
      ev.roundDone = true;
    }
  }
  return ev;
}
