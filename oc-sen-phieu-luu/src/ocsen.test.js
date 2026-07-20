// Unit test cho Ốc Sên Phiêu Lưu Ăn Từ Vựng. Chạy: node src/ocsen.test.js

import { WORDS } from '../../shared/fruit-object-words.js';
import {
  START_ITEMS, MAX_ITEMS, TOTAL_LEVELS, POINTS_PER_ITEM,
  foodCountForLevel, makeGame, eatFood, isLevelComplete, nextLevel,
} from './ocsen.js';

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

console.log('— Vốn từ & số món mỗi màn —');

check('WORDS: đủ ít nhất 20 từ hợp lệ', WORDS.length >= 20 && WORDS.every((w) => w.en && w.vi && w.emoji));

check('foodCountForLevel: tăng dần theo màn, chặn ở MAX_ITEMS', (() => {
  return foodCountForLevel(1) === START_ITEMS
    && foodCountForLevel(2) === START_ITEMS + 1
    && foodCountForLevel(50) === MAX_ITEMS;
})());

console.log('— Khởi tạo & ăn thức ăn —');

check(`makeGame: bắt đầu màn 1, đủ ${START_ITEMS} món, không món nào bị trùng từ, chưa kết thúc`, (() => {
  const g = makeGame(seeded(2));
  const ens = new Set(g.foods.map((f) => f.word.en));
  return g.level === 1 && g.foods.length === START_ITEMS && ens.size === START_ITEMS
    && g.over === false && g.score === 0;
})());

check('eatFood: ăn 1 món hợp lệ → cộng điểm, trả về đúng từ, đánh dấu đã ăn', (() => {
  const g = makeGame(seeded(3));
  const target = g.foods[0];
  const word = eatFood(g, target.uid);
  return word.en === target.word.en && g.foods[0].eaten === true
    && g.score === POINTS_PER_ITEM && g.eatenCount === 1;
})());

check('eatFood: ăn lại món đã ăn rồi, hoặc uid không tồn tại → trả null, không cộng điểm thêm', (() => {
  const g = makeGame(seeded(4));
  const target = g.foods[0];
  eatFood(g, target.uid);
  const scoreAfterFirst = g.score;
  return eatFood(g, target.uid) === null && eatFood(g, 9999) === null && g.score === scoreAfterFirst;
})());

check('ăn món nào cũng "đúng" — không có khái niệm sai, ăn theo thứ tự bất kỳ vẫn được', (() => {
  const g = makeGame(seeded(5));
  const last = g.foods[g.foods.length - 1];
  const first = g.foods[0];
  const w1 = eatFood(g, last.uid); // ăn món cuối trước
  const w2 = eatFood(g, first.uid); // rồi ăn món đầu
  return w1 !== null && w2 !== null && g.eatenCount === 2;
})());

console.log('— Qua màn —');

check('isLevelComplete: false khi còn món chưa ăn, true khi ăn hết cả hàng', (() => {
  const g = makeGame(seeded(6));
  if (isLevelComplete(g)) return false; // vừa khởi tạo, chưa ăn gì thì chưa thể xong
  for (const f of g.foods) eatFood(g, f.uid);
  return isLevelComplete(g) === true;
})());

check('nextLevel: sang màn kế tiếp có NHIỀU món hơn, chưa đụng màn cuối thì chưa kết thúc', (() => {
  const g = makeGame(seeded(7));
  const prevCount = g.foods.length;
  nextLevel(g);
  return g.level === 2 && g.foods.length === prevCount + 1 && g.over === false
    && g.foods.every((f) => !f.eaten); // màn mới, chưa ăn món nào
})());

check(`đi hết ${TOTAL_LEVELS} màn thì hoàn thành cuộc phiêu lưu, THẮNG`, (() => {
  const g = makeGame(seeded(8));
  for (let i = 1; i < TOTAL_LEVELS; i++) nextLevel(g);
  return g.level === TOTAL_LEVELS && g.over === false; // chưa gọi nextLevel() lần cuối thì vẫn đang ở màn cuối
})());

check('gọi nextLevel() ở màn cuối cùng thì kết thúc cuộc phiêu lưu, THẮNG', (() => {
  const g = makeGame(seeded(8));
  for (let i = 1; i < TOTAL_LEVELS; i++) nextLevel(g);
  nextLevel(g); // vượt quá màn cuối
  return g.over === true && g.won === true;
})());

check('ván đã kết thúc thì ăn thêm/qua màn thêm không làm gì nữa', (() => {
  const g = makeGame(seeded(9));
  for (let i = 1; i <= TOTAL_LEVELS; i++) nextLevel(g);
  const levelBefore = g.level;
  const scoreBefore = g.score;
  nextLevel(g);
  const ateAfterOver = eatFood(g, g.foods[0]?.uid);
  return g.level === levelBefore && g.score === scoreBefore && ateAfterOver === null;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
