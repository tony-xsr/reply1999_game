// Unit test cho logic Trường Bắn Từ Vựng. Chạy: node src/truongban.test.js

import { WORDS } from '../../shared/fruit-object-words.js';
import {
  START_TARGETS, TARGETS_INCREMENT, MAX_TARGETS, TOTAL_LEVELS, POINTS_PER_HIT,
  targetsForLevel, makeGame, shoot, nextLevel,
} from './truongban.js';

let passed = 0;
let failed = 0;

function check(name, cond) {
  if (cond) { passed++; console.log(`  ✅ ${name}`); }
  else { failed++; console.error(`  ❌ ${name}`); }
}

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

console.log('— Trường Bắn Từ Vựng —');

check('WORDS: đủ ít nhất MAX_TARGETS từ hợp lệ', WORDS.length >= MAX_TARGETS);

check('targetsForLevel: tăng dần theo màn, chặn ở MAX_TARGETS', (() => (
  targetsForLevel(1) === START_TARGETS
  && targetsForLevel(2) === START_TARGETS + TARGETS_INCREMENT
  && targetsForLevel(50) === MAX_TARGETS
))());

check('makeGame: đủ START_TARGETS mục tiêu không trùng từ, current nằm trong hàng, chưa hạ mục tiêu nào', (() => {
  const g = makeGame(rng(1));
  if (g.targets.length !== START_TARGETS) return false;
  if (g.targets.some((x) => x.down)) return false;
  const ens = g.targets.map((x) => x.word.en);
  if (new Set(ens).size !== ens.length) return false;
  if (!g.targets.some((x) => x.word.en === g.current.en)) return false;
  return g.level === 1 && g.score === 0 && !g.over && !g.won;
})());

check('shoot: bắn ĐÚNG mục tiêu đang xướng tên -> correct=true, cộng điểm, hạ mục tiêu, đổi current', (() => {
  const g = makeGame(rng(2));
  const currentTarget = g.targets.find((x) => x.word.en === g.current.en);
  const res = shoot(g, currentTarget.uid);
  return res.correct === true && res.target.down === true && g.score === POINTS_PER_HIT;
})());

check('shoot: bắn mục tiêu KHÁC (không phải mục tiêu đang xướng) -> correct=false, không cộng điểm, mục tiêu vẫn đứng', (() => {
  const g = makeGame(rng(3));
  const otherTarget = g.targets.find((x) => x.word.en !== g.current.en);
  const res = shoot(g, otherTarget.uid);
  return res.correct === false && otherTarget.down === false && g.score === 0;
})());

check('shoot: bắn mục tiêu đã hạ rồi hoặc uid không tồn tại -> trả null', (() => {
  const g = makeGame(rng(4));
  const currentTarget = g.targets.find((x) => x.word.en === g.current.en);
  shoot(g, currentTarget.uid);
  return shoot(g, currentTarget.uid) === null && shoot(g, 999999) === null;
})());

check('bắn hết cả hàng theo đúng thứ tự xướng tên -> roundDone=true ở phát cuối', (() => {
  const g = makeGame(rng(5));
  let lastRes = null;
  for (let i = 0; i < START_TARGETS; i++) {
    const currentTarget = g.targets.find((x) => x.word.en === g.current.en && !x.down);
    lastRes = shoot(g, currentTarget.uid);
  }
  return lastRes.roundDone === true && g.targets.every((x) => x.down);
})());

check('nextLevel: sang màn kế tiếp có NHIỀU mục tiêu hơn, current mới nằm trong hàng mới', (() => {
  const g = makeGame(rng(6));
  nextLevel(g);
  return g.level === 2
    && g.targets.length === targetsForLevel(2)
    && g.targets.every((x) => !x.down)
    && g.targets.some((x) => x.word.en === g.current.en)
    && !g.over;
})());

check('nextLevel ở màn cuối cùng thì kết thúc, THẮNG', (() => {
  const g = makeGame(rng(7));
  g.level = TOTAL_LEVELS;
  nextLevel(g);
  return g.over === true && g.won === true;
})());

check('shoot và nextLevel là no-op sau khi ván đã kết thúc', (() => {
  const g = makeGame(rng(8));
  g.level = TOTAL_LEVELS;
  nextLevel(g);
  const res = shoot(g, g.targets[0].uid);
  const levelBefore = g.level;
  nextLevel(g);
  return res === null && g.level === levelBefore;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
