// Unit test cho logic Đào Vàng Từ Vựng. Chạy: node src/daovangtuvung.test.js

import { WORDS } from '../../shared/fruit-object-words.js';
import {
  START_TILES, TILES_INCREMENT, MAX_TILES, TOTAL_LEVELS, POINTS_PER_FIND,
  tilesForLevel, makeGame, digTile, nextLevel,
} from './daovangtuvung.js';

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

console.log('— Đào Vàng Từ Vựng —');

check('WORDS: đủ ít nhất MAX_TILES từ hợp lệ', WORDS.length >= MAX_TILES);

check('tilesForLevel: tăng dần theo màn, chặn ở MAX_TILES', (() => (
  tilesForLevel(1) === START_TILES
  && tilesForLevel(2) === START_TILES + TILES_INCREMENT
  && tilesForLevel(50) === MAX_TILES
))());

check('makeGame: đủ START_TILES ô, từ mục tiêu nằm trong số các ô, chưa đào ô nào', (() => {
  const g = makeGame(rng(1));
  if (g.tiles.length !== START_TILES) return false;
  if (g.tiles.some((t) => t.dug)) return false;
  if (!g.tiles.some((t) => t.word.en === g.target.en)) return false;
  return g.level === 1 && g.score === 0 && !g.over && !g.won;
})());

check('digTile: đào trúng ô mang từ mục tiêu -> correct=true, cộng điểm, ô lộ ra', (() => {
  const g = makeGame(rng(2));
  const targetTile = g.tiles.find((t) => t.word.en === g.target.en);
  const res = digTile(g, targetTile.uid);
  return res.correct === true && res.tile.dug === true && g.score === POINTS_PER_FIND;
})());

check('digTile: đào ô KHÔNG mang từ mục tiêu -> correct=false, không cộng điểm, ô vẫn lộ ra', (() => {
  const g = makeGame(rng(3));
  const wrongTile = g.tiles.find((t) => t.word.en !== g.target.en);
  const res = digTile(g, wrongTile.uid);
  return res.correct === false && res.tile.dug === true && g.score === 0;
})());

check('digTile: đào lại ô đã đào rồi, hoặc uid không tồn tại -> trả null, không đổi gì', (() => {
  const g = makeGame(rng(4));
  const tile = g.tiles[0];
  digTile(g, tile.uid);
  const scoreBefore = g.score;
  const again = digTile(g, tile.uid);
  const invalid = digTile(g, 999999);
  return again === null && invalid === null && g.score === scoreBefore;
})());

check('nextLevel: sang màn kế tiếp có NHIỀU ô hơn + từ mục tiêu mới nằm trong số ô đó', (() => {
  const g = makeGame(rng(5));
  nextLevel(g);
  return g.level === 2
    && g.tiles.length === tilesForLevel(2)
    && g.tiles.every((t) => !t.dug)
    && g.tiles.some((t) => t.word.en === g.target.en)
    && !g.over;
})());

check('nextLevel ở màn cuối cùng thì kết thúc, THẮNG', (() => {
  const g = makeGame(rng(6));
  g.level = TOTAL_LEVELS;
  nextLevel(g);
  return g.over === true && g.won === true;
})());

check('digTile và nextLevel là no-op sau khi ván đã kết thúc', (() => {
  const g = makeGame(rng(7));
  g.level = TOTAL_LEVELS;
  nextLevel(g);
  const dug = digTile(g, g.tiles[0].uid);
  const levelBefore = g.level;
  nextLevel(g);
  return dug === null && g.level === levelBefore;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
