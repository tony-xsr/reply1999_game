// Unit test cho Leo Thác Vượt Bẫy. Chạy: node src/leothac.test.js

import { WORDS } from '../../shared/fruit-object-words.js';
import {
  TOTAL_STEPS, POINTS_PER_STEP, START_HEARTS, makeGame, currentStep, choosePath,
} from './leothac.js';

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

console.log('— Từ vựng dùng chung —');

check('WORDS: đủ ít nhất 20 từ, id/emoji không trùng, có tên EN + VI', (() => {
  const ens = new Set(WORDS.map((w) => w.en));
  const emojis = new Set(WORDS.map((w) => w.emoji));
  return WORDS.length >= 20 && ens.size === WORDS.length && emojis.size === WORDS.length
    && WORDS.every((w) => w.en && w.vi && w.emoji);
})());

console.log('— Sinh bậc thang —');

check('mỗi bậc: đúng 1 trong 2 lối khớp từ mục tiêu, lối kia khác hẳn (không trùng)', (() => {
  const game = makeGame(TOTAL_STEPS, seeded(3));
  for (let i = 0; i < 20; i++) {
    const s = currentStep(game);
    const correctWord = s.correctSide === 'left' ? s.left : s.right;
    const wrongWord = s.correctSide === 'left' ? s.right : s.left;
    if (correctWord.en !== s.target.en || wrongWord.en === s.target.en) return false;
    choosePath(game, s.correctSide); // sinh bậc mới để kiểm tra tiếp
    if (game.over) break;
  }
  return true;
})());

check('makeGame: bắt đầu ở bậc 0, đủ 5 trái tim, chưa kết thúc', (() => {
  const game = makeGame(7, seeded(1));
  return game.totalSteps === 7 && game.stepIndex === 0 && game.over === false
    && game.score === 0 && game.won === false && game.hearts === START_HEARTS;
})());

console.log('— Chọn lối: leo lên hoặc sập bẫy mất tim —');

check('chọn ĐÚNG lối: leo lên bậc kế tiếp, cộng điểm, KHÔNG mất tim, ván chưa kết thúc', (() => {
  const game = makeGame(5, seeded(2));
  const step = currentStep(game);
  const ev = choosePath(game, step.correctSide);
  return ev.correct === true && ev.fell === false && ev.gameDone === false
    && game.stepIndex === 1 && game.score === POINTS_PER_STEP && game.over === false
    && game.hearts === START_HEARTS;
})());

check('chọn SAI lối lần đầu: SẬP BẪY nhưng còn tim → được thử lại NGAY bậc đó (chưa thua)', (() => {
  const game = makeGame(5, seeded(2));
  const step = currentStep(game);
  const wrongSide = step.correctSide === 'left' ? 'right' : 'left';
  const ev = choosePath(game, wrongSide);
  return ev.correct === false && ev.fell === true && ev.gameDone === false
    && ev.hearts === START_HEARTS - 1 && game.hearts === START_HEARTS - 1
    && game.over === false && game.stepIndex === 0; // vẫn ở bậc cũ, chưa leo lên
})());

check('sai đủ 5 lần liên tiếp (hết sạch tim) mới thực sự THUA', (() => {
  const game = makeGame(5, seeded(6));
  let lastEv = null;
  for (let i = 0; i < START_HEARTS; i++) {
    const step = currentStep(game);
    const wrongSide = step.correctSide === 'left' ? 'right' : 'left';
    lastEv = choosePath(game, wrongSide);
  }
  return lastEv.gameDone === true && lastEv.won === false && lastEv.hearts === 0
    && game.over === true && game.won === false && game.hearts === 0;
})());

check('mất vài tim giữa chừng rồi vẫn leo tiếp đúng thì KHÔNG cộng dồn mất mạng lần sau', (() => {
  const game = makeGame(5, seeded(9));
  const step1 = currentStep(game);
  const wrongSide1 = step1.correctSide === 'left' ? 'right' : 'left';
  choosePath(game, wrongSide1); // sai 1 lần, mất 1 tim, còn 4
  const step2 = currentStep(game); // bậc thử lại (từ mới)
  const ev = choosePath(game, step2.correctSide); // đúng lần này
  return game.hearts === START_HEARTS - 1 && ev.correct === true && game.stepIndex === 1;
})());

check('leo hết TOÀN BỘ bậc thang đúng liên tiếp (không sai lần nào) thì THẮNG, còn nguyên tim', (() => {
  const game = makeGame(4, seeded(5));
  let lastEv = null;
  for (let i = 0; i < 4; i++) {
    const step = currentStep(game);
    lastEv = choosePath(game, step.correctSide);
  }
  return lastEv.gameDone === true && lastEv.won === true
    && game.over === true && game.won === true
    && game.score === 4 * POINTS_PER_STEP && game.hearts === START_HEARTS;
})());

check('ván đã kết thúc (thắng/thua) thì chọn tiếp không làm gì thêm, điểm/tim giữ nguyên', (() => {
  const game = makeGame(3, seeded(9));
  for (let i = 0; i < START_HEARTS; i++) {
    const step = currentStep(game);
    const wrongSide = step.correctSide === 'left' ? 'right' : 'left';
    choosePath(game, wrongSide);
  }
  const scoreBefore = game.score;
  const heartsBefore = game.hearts;
  const ev = choosePath(game, 'left');
  return ev.gameDone === true && game.score === scoreBefore && game.hearts === heartsBefore && game.over === true;
})());

check('leo được vài bậc rồi thua hết tim vẫn giữ đúng điểm số các bậc đã leo qua', (() => {
  const game = makeGame(8, seeded(11));
  // Leo đúng 2 bậc đầu
  choosePath(game, currentStep(game).correctSide);
  choosePath(game, currentStep(game).correctSide);
  // Sai liên tục cho tới khi hết tim
  let lastEv = null;
  for (let i = 0; i < START_HEARTS; i++) {
    const step = currentStep(game);
    const wrongSide = step.correctSide === 'left' ? 'right' : 'left';
    lastEv = choosePath(game, wrongSide);
    if (lastEv.gameDone) break;
  }
  return game.score === 2 * POINTS_PER_STEP && game.over === true && game.won === false;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
