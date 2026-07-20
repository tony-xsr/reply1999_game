// Unit test cho Vũ Điệu Theo Nhịp. Chạy: node src/vudieu.test.js

import {
  DIRS, START_HEARTS, BEAT_PERFECT, PERFECT_WINDOW, GOOD_WINDOW, BEAT_OVER,
  tuningFor, makeGame, currentArrows, tapArrow, tapBeat, tickTime,
} from './vudieu.js';

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

/** Bấm hết chuỗi mũi tên hiện tại cho đúng. */
function clearArrows(g) {
  while (g.phase === 'arrows' && !g.over) {
    tapArrow(g, currentArrows(g)[g.arrowIndex]);
  }
}

console.log('— Sinh màn —');

check('màn cao hơn: nhiều câu hơn, chuỗi dài hơn, thời gian ngắn hơn (có chặn)', (() => {
  const t0 = tuningFor(0);
  const t5 = tuningFor(5);
  const t99 = tuningFor(99);
  return t5.rounds > t0.rounds && t5.arrowsPerRound > t0.arrowsPerRound
    && t5.arrowTimeMs < t0.arrowTimeMs && t99.rounds === 10 && t99.arrowTimeMs >= 4200;
})());

check('chuỗi chỉ gồm 4 hướng hợp lệ, không có 3 mũi tên giống nhau liền', (() => {
  for (const seed of [1, 7, 42]) {
    const g = makeGame(3, seeded(seed));
    for (const round of g.rounds) {
      if (!round.arrows.every((d) => DIRS.includes(d))) return false;
      for (let i = 2; i < round.arrows.length; i++) {
        if (round.arrows[i] === round.arrows[i - 1] && round.arrows[i] === round.arrows[i - 2]) return false;
      }
    }
  }
  return true;
})());

console.log('— Pha mũi tên —');

check('bấm đúng: tiến 1 bước + điểm; bấm sai: đứng yên + mất combo', (() => {
  const g = makeGame(0, seeded());
  g.combo = 4;
  const expected = currentArrows(g)[0];
  const wrong = DIRS.find((d) => d !== expected);
  const evWrong = tapArrow(g, wrong);
  const idxAfterWrong = g.arrowIndex;
  const comboAfterWrong = g.combo;
  const evRight = tapArrow(g, expected);
  return evWrong.ok === false && comboAfterWrong === 0 && idxAfterWrong === 0
    && evRight.ok === true && g.arrowIndex === 1 && g.score === 5;
})());

check('bấm xong cả chuỗi → chuyển sang pha chốt nhịp', (() => {
  const g = makeGame(0, seeded());
  clearArrows(g);
  return g.phase === 'beat' && g.beatT === 0;
})());

check('hết giờ pha mũi tên → mất 1 tim, nhảy sang câu kế', (() => {
  const g = makeGame(0, seeded());
  const ev = tickTime(g, g.arrowTimeMs + 1);
  return ev.arrowTimeout && g.hearts === START_HEARTS - 1 && g.roundIndex === 1 && g.phase === 'arrows';
})());

console.log('— Pha chốt nhịp —');

check('bấm đúng điểm chuẩn → TUYỆT VỜI, combo tăng, điểm thưởng combo', (() => {
  const g = makeGame(0, seeded());
  clearArrows(g);
  tickTime(g, BEAT_PERFECT); // vòng vừa chạm viền
  const ev = tapBeat(g);
  return ev.grade === 'perfect' && g.combo === 1 && g.roundIndex === 1;
})());

check('bấm lệch trong cửa sổ TỐT → good; lệch quá xa → miss mất tim', (() => {
  const g1 = makeGame(0, seeded());
  clearArrows(g1);
  tickTime(g1, BEAT_PERFECT - GOOD_WINDOW + 10);
  const good = tapBeat(g1).grade;
  const g2 = makeGame(0, seeded());
  clearArrows(g2);
  tickTime(g2, BEAT_PERFECT - GOOD_WINDOW - 300); // bấm quá sớm
  const miss = tapBeat(g2).grade;
  return good === 'good' && miss === 'miss' && g2.hearts === START_HEARTS - 1;
})());

check('quên bấm nhịp (quá BEAT_OVER) → trượt, mất tim, sang câu kế', (() => {
  const g = makeGame(0, seeded());
  clearArrows(g);
  const ev = tickTime(g, BEAT_OVER + 10);
  return ev.beatTimeout && g.hearts === START_HEARTS - 1 && g.roundIndex === 1;
})());

console.log('— Thắng / thua —');

check('qua hết các câu → thắng + thưởng theo tim còn lại', (() => {
  const g = makeGame(0, seeded());
  while (!g.over) {
    clearArrows(g);
    if (g.over) break;
    tickTime(g, BEAT_PERFECT);
    tapBeat(g);
  }
  return g.won === true && g.maxCombo === g.rounds.length && g.score > 0;
})());

check('trượt nhịp 3 lần → thua', (() => {
  const g = makeGame(0, seeded());
  for (let i = 0; i < START_HEARTS && !g.over; i++) {
    clearArrows(g);
    tickTime(g, BEAT_OVER + 10);
  }
  return g.over === true && g.won === false && g.hearts === 0;
})());

check('game kết thúc thì tapArrow/tapBeat/tickTime không làm gì', (() => {
  const g = makeGame(0, seeded());
  g.over = true;
  const a = tapArrow(g, 'left');
  const b = tapBeat(g);
  const c = tickTime(g, 99999);
  return a.ok === false && b.grade === null && c.arrowTimeout === false;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
