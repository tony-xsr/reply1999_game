import assert from 'node:assert';
import {
  START_PAIRS, PAIRS_INCREMENT, MAX_PAIRS, TOTAL_LEVELS, POINTS_PER_MATCH,
  pairsForLevel, makeGame, flipCard, resolveFlip, isLevelComplete, nextLevel,
} from './ghepvung.js';
import { WORDS } from '../../shared/fruit-object-words.js';

function seq(seed = 1) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

let pass = 0;
function check(name, fn) {
  fn();
  pass++;
  console.log(`ok - ${name}`);
}

check('WORDS has at least MAX_PAIRS entries with en/vi/emoji', () => {
  assert.ok(WORDS.length >= MAX_PAIRS);
  for (const w of WORDS) {
    assert.ok(w.en && w.vi && w.emoji);
  }
});

check('pairsForLevel increases and caps at MAX_PAIRS', () => {
  assert.strictEqual(pairsForLevel(1), START_PAIRS);
  assert.strictEqual(pairsForLevel(2), START_PAIRS + PAIRS_INCREMENT);
  assert.strictEqual(pairsForLevel(50), MAX_PAIRS);
});

check('makeGame builds 2 cards per pair, one picture one word, shuffled', () => {
  const g = makeGame(seq(1));
  assert.strictEqual(g.cards.length, START_PAIRS * 2);
  const byPair = new Map();
  for (const c of g.cards) {
    if (!byPair.has(c.pairId)) byPair.set(c.pairId, []);
    byPair.get(c.pairId).push(c.kind);
  }
  assert.strictEqual(byPair.size, START_PAIRS);
  for (const kinds of byPair.values()) {
    assert.deepStrictEqual(kinds.sort(), ['picture', 'word']);
  }
  assert.strictEqual(g.level, 1);
  assert.strictEqual(g.matchedCount, 0);
  assert.strictEqual(g.score, 0);
  assert.strictEqual(g.over, false);
  assert.strictEqual(g.won, false);
});

check('flipCard first flip returns { flipped: card }, does not resolve yet', () => {
  const g = makeGame(seq(2));
  const uid = g.cards[0].uid;
  const res = flipCard(g, uid);
  assert.ok(res.flipped);
  assert.strictEqual(res.flipped.uid, uid);
  assert.deepStrictEqual(g.flipped, [uid]);
});

check('flipCard second flip on matching pair marks both matched + scores', () => {
  const g = makeGame(seq(3));
  const a = g.cards[0];
  const b = g.cards.find((c) => c.pairId === a.pairId && c.uid !== a.uid);
  flipCard(g, a.uid);
  const res = flipCard(g, b.uid);
  assert.strictEqual(res.pairResult, 'match');
  assert.strictEqual(a.matched, true);
  assert.strictEqual(b.matched, true);
  assert.strictEqual(g.matchedCount, 1);
  assert.strictEqual(g.score, POINTS_PER_MATCH);
});

check('flipCard second flip on mismatching pair does not mark matched or score', () => {
  const g = makeGame(seq(4));
  const a = g.cards[0];
  const b = g.cards.find((c) => c.pairId !== a.pairId);
  flipCard(g, a.uid);
  const res = flipCard(g, b.uid);
  assert.strictEqual(res.pairResult, 'mismatch');
  assert.strictEqual(a.matched, false);
  assert.strictEqual(b.matched, false);
  assert.strictEqual(g.matchedCount, 0);
  assert.strictEqual(g.score, 0);
});

check('flipCard blocks a 3rd flip until resolveFlip() is called', () => {
  const g = makeGame(seq(5));
  const a = g.cards[0];
  const b = g.cards.find((c) => c.uid !== a.uid);
  const c = g.cards.find((c2) => c2.uid !== a.uid && c2.uid !== b.uid);
  flipCard(g, a.uid);
  flipCard(g, b.uid);
  const blocked = flipCard(g, c.uid);
  assert.strictEqual(blocked, null);
  resolveFlip(g);
  assert.deepStrictEqual(g.flipped, []);
  const afterResolve = flipCard(g, c.uid);
  assert.ok(afterResolve.flipped);
});

check('flipCard returns null for already-matched card or repeat uid in same pending flip', () => {
  const g = makeGame(seq(6));
  const a = g.cards[0];
  const b = g.cards.find((c) => c.pairId === a.pairId && c.uid !== a.uid);
  flipCard(g, a.uid);
  flipCard(g, b.uid);
  resolveFlip(g);
  assert.strictEqual(flipCard(g, a.uid), null);

  const x = g.cards.find((c) => !c.matched);
  flipCard(g, x.uid);
  assert.strictEqual(flipCard(g, x.uid), null);
});

check('flipCard returns null for unknown uid', () => {
  const g = makeGame(seq(7));
  assert.strictEqual(flipCard(g, 999999), null);
});

check('isLevelComplete true only once all cards matched', () => {
  const g = makeGame(seq(8));
  assert.strictEqual(isLevelComplete(g), false);
  const pairIds = [...new Set(g.cards.map((c) => c.pairId))];
  for (const pid of pairIds) {
    const [x, y] = g.cards.filter((c) => c.pairId === pid);
    flipCard(g, x.uid);
    flipCard(g, y.uid);
    resolveFlip(g);
  }
  assert.strictEqual(isLevelComplete(g), true);
  assert.strictEqual(g.matchedCount, START_PAIRS);
});

check('nextLevel advances level and grows pair count, resets flipped', () => {
  const g = makeGame(seq(9));
  flipCard(g, g.cards[0].uid);
  nextLevel(g);
  assert.strictEqual(g.level, 2);
  assert.strictEqual(g.cards.length, pairsForLevel(2) * 2);
  assert.deepStrictEqual(g.flipped, []);
  assert.strictEqual(g.over, false);
});

check('nextLevel at final level ends game as won', () => {
  const g = makeGame(seq(10));
  g.level = TOTAL_LEVELS;
  nextLevel(g);
  assert.strictEqual(g.over, true);
  assert.strictEqual(g.won, true);
});

check('flipCard and nextLevel are no-ops after game over', () => {
  const g = makeGame(seq(11));
  g.level = TOTAL_LEVELS;
  nextLevel(g);
  assert.strictEqual(flipCard(g, g.cards[0].uid), null);
  const before = g.level;
  nextLevel(g);
  assert.strictEqual(g.level, before);
});

console.log(`\n${pass} tests passed`);
