// Unit test cho Xếp Chữ Tiếng Anh. Chạy: node src/xepchu.test.js

import {
  WORD_BANK, tuningFor, pickWords, makeRound, currentWord, tapTile,
} from './xepchu.js';

let passed = 0;
let failed = 0;

function check(name, cond) {
  if (cond) { passed++; console.log(`  ✅ ${name}`); }
  else { failed++; console.error(`  ❌ ${name}`); }
}

function seeded(seed = 1) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
}

/** Gõ đúng thứ tự cả từ hiện tại (không đụng chữ nhiễu). */
function spellCurrentWord(round) {
  const w = currentWord(round);
  let last = null;
  while (w.filled.length < w.word.length) {
    const needed = w.word[w.filled.length];
    const tile = w.tiles.find((t) => t.char === needed && !w.usedKeys.includes(t.key));
    last = tapTile(round, tile.key);
  }
  return last;
}

console.log('— Ngân hàng từ vựng —');

check('mọi từ: chỉ chữ HOA A-Z, có emoji + nghĩa tiếng Việt, đã sắp theo độ dài tăng dần', (() => {
  return WORD_BANK.every((w) => /^[A-Z]+$/.test(w.word) && w.emoji && w.vi)
    && WORD_BANK.every((w, i) => i === 0 || w.word.length >= WORD_BANK[i - 1].word.length);
})());

console.log('— Sinh màn —');

check('màn cao hơn: nhiều từ hơn, nhiều chữ nhiễu hơn (có chặn trần)', (() => {
  const t0 = tuningFor(0);
  const t5 = tuningFor(5);
  const t99 = tuningFor(99);
  return t5.wordsPerRound > t0.wordsPerRound && t5.decoyCount > t0.decoyCount
    && t99.wordsPerRound <= 8 && t99.decoyCount <= 3;
})());

check('màn 0: từ ngắn (cửa sổ đầu ngân hàng); không trùng từ trong 1 màn', (() => {
  const words = pickWords(6, 0, seeded());
  const unique = new Set(words.map((w) => w.word));
  return unique.size === 6 && words.every((w) => w.word.length <= 4);
})());

check('mỗi ô chữ cái có key duy nhất; số ô = độ dài từ + số chữ nhiễu', (() => {
  const round = makeRound(3, seeded()); // level 3 → decoyCount = 1
  const w = round.words[0];
  const keys = new Set(w.tiles.map((t) => t.key));
  return keys.size === w.tiles.length && w.tiles.length === w.word.length + tuningFor(3).decoyCount;
})());

console.log('— Ghép chữ (tapTile) —');

check('chạm đúng chữ cái kế tiếp: tiến 1 nấc, cộng điểm, ô đó không dùng lại được nữa', (() => {
  const round = makeRound(0, seeded());
  const w = currentWord(round);
  const firstTile = w.tiles.find((t) => t.char === w.word[0]);
  const ev = tapTile(round, firstTile.key);
  const again = tapTile(round, firstTile.key); // bấm lại ô vừa dùng
  return ev.correct === true && w.filled.join('') === w.word[0] && round.score === 10
    && again.correct === false;
})());

check('chạm sai thứ tự hoặc chữ nhiễu: không có gì đổi, không mất điểm/mạng', (() => {
  const round = makeRound(5, seeded()); // có chữ nhiễu
  const w = currentWord(round);
  const wrongTile = w.tiles.find((t) => t.char !== w.word[0]);
  const ev = tapTile(round, wrongTile.key);
  return ev.correct === false && w.filled.length === 0 && round.score === 0;
})());

check('ghép đủ 1 từ → wordDone=true, sang từ kế tiếp', (() => {
  const round = makeRound(0, seeded());
  const firstWord = currentWord(round).word;
  const ev = spellCurrentWord(round);
  return ev.wordDone === true && round.wordsDone === 1
    && (round.over || currentWord(round).word !== firstWord);
})());

check('ghép hết MỌI từ trong màn → roundDone=true, thắng, cộng điểm thưởng', (() => {
  const round = makeRound(0, seeded());
  const totalWords = round.words.length;
  let ev = null;
  while (!round.over) ev = spellCurrentWord(round);
  return ev.roundDone === true && round.won === true && round.wordsDone === totalWords
    && round.score > totalWords * round.words[0].word.length * 10; // có cộng thưởng thêm
})());

check('màn đã kết thúc thì tapTile không làm gì', (() => {
  const round = makeRound(0, seeded());
  round.over = true;
  const w = currentWord(round);
  const ev = tapTile(round, w.tiles[0].key);
  return ev.correct === false;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
