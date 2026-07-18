// Unit test cho Chém Từ Vựng. Chạy: node src/chemtuvung.test.js

import { WORDS } from '../../shared/fruit-object-words.js';
import {
  ROUND_SECONDS, MAX_ON_SCREEN, POINTS_PER_SLICE,
  makeGame, spawnItem, sliceItem, expireItem, tick,
} from './chemtuvung.js';

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

console.log('— Vốn từ —');

check('WORDS: đủ ít nhất 20 từ hợp lệ', WORDS.length >= 20 && WORDS.every((w) => w.en && w.vi && w.emoji));

console.log('— Sinh icon bay lên —');

check('makeGame: bắt đầu trống, đủ giờ, chưa kết thúc', (() => {
  const g = makeGame();
  return g.items.length === 0 && g.timeLeft === ROUND_SECONDS && g.over === false && g.score === 0;
})());

check(`spawnItem: sinh tối đa ${MAX_ON_SCREEN} icon cùng lúc, dư thì trả null`, (() => {
  const g = makeGame();
  const rng = seeded(2);
  for (let i = 0; i < MAX_ON_SCREEN; i++) {
    if (!spawnItem(g, rng)) return false;
  }
  return spawnItem(g, rng) === null && g.items.length === MAX_ON_SCREEN;
})());

check('mỗi icon đều là 1 từ hợp lệ trong WORDS, uid tăng dần', (() => {
  const g = makeGame();
  const rng = seeded(5);
  const a = spawnItem(g, rng);
  const b = spawnItem(g, rng);
  return WORDS.some((w) => w.en === a.word.en) && WORDS.some((w) => w.en === b.word.en) && b.uid === a.uid + 1;
})());

console.log('— Chém: luôn "đúng", không có khái niệm sai —');

check('chém trúng 1 icon: cộng điểm, trả về đúng từ của icon đó', (() => {
  const g = makeGame();
  const item = spawnItem(g, seeded(3));
  const word = sliceItem(g, item.uid);
  return word.en === item.word.en && g.score === POINTS_PER_SLICE && g.slicedCount === 1;
})());

check('chém 2 icon khác nhau: cộng dồn điểm đúng, mỗi icon chỉ tính 1 lần', (() => {
  const g = makeGame();
  const rng = seeded(4);
  const a = spawnItem(g, rng);
  const b = spawnItem(g, rng);
  sliceItem(g, a.uid);
  sliceItem(g, b.uid);
  return g.score === 2 * POINTS_PER_SLICE && g.slicedCount === 2;
})());

check('chém lại icon đã chém rồi (hoặc uid không tồn tại) → trả null, không cộng điểm thêm', (() => {
  const g = makeGame();
  const item = spawnItem(g, seeded(6));
  sliceItem(g, item.uid);
  const again = sliceItem(g, item.uid);
  const scoreAfterFirst = g.score;
  return again === null && sliceItem(g, 9999) === null && g.score === scoreAfterFirst;
})());

console.log('— Icon bay hết thời gian (không bị trừ điểm) —');

check('expireItem: dọn icon chưa chém khỏi màn hình, đếm missedCount, KHÔNG trừ điểm', (() => {
  const g = makeGame();
  const item = spawnItem(g, seeded(7));
  const ok = expireItem(g, item.uid);
  return ok && g.items.length === 0 && g.missedCount === 1 && g.score === 0;
})());

check('expireItem trên icon ĐÃ chém: dọn khỏi màn hình nhưng KHÔNG tính là bỏ lỡ', (() => {
  const g = makeGame();
  const item = spawnItem(g, seeded(8));
  sliceItem(g, item.uid);
  expireItem(g, item.uid);
  return g.items.length === 0 && g.missedCount === 0 && g.score === POINTS_PER_SLICE;
})());

check('expireItem với uid không tồn tại → trả false, không đổi gì', (() => {
  const g = makeGame();
  return expireItem(g, 12345) === false && g.missedCount === 0;
})());

console.log('— Đếm giờ ván chơi —');

check('tick: giảm dần thời gian, hết giờ thì kết thúc ván', (() => {
  const g = makeGame();
  tick(g, 10);
  const midTime = g.timeLeft;
  tick(g, 1000); // vượt xa thời lượng còn lại
  return midTime === ROUND_SECONDS - 10 && g.timeLeft === 0 && g.over === true;
})());

check('ván đã kết thúc thì tick tiếp không đổi gì thêm', (() => {
  const g = makeGame();
  tick(g, ROUND_SECONDS + 5);
  const timeLeftBefore = g.timeLeft;
  tick(g, 5);
  return g.over === true && g.timeLeft === timeLeftBefore;
})());

check('ván đã hết giờ thì spawnItem không sinh thêm icon mới', (() => {
  const g = makeGame();
  tick(g, ROUND_SECONDS + 1);
  return spawnItem(g, seeded(1)) === null && g.items.length === 0;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
