import assert from 'node:assert/strict';
import {
  TOPICS, WORD_BANK, wordsForTopic, tuningFor, rateFor, promptFor, pickRound, makeGame, currentRound, chooseOption,
} from './ontap.js';
import { _setStorage, recordMiss, recordHit, missedWords, missCount } from './misses.js';

function fakeStorage() {
  return {
    data: {},
    getItem(k) { return Object.prototype.hasOwnProperty.call(this.data, k) ? this.data[k] : null; },
    setItem(k, v) { this.data[k] = String(v); },
  };
}

let passed = 0;
function check(name, fn) {
  try {
    fn();
    passed++;
    console.log(`✅ ${name}`);
  } catch (e) {
    console.log(`❌ ${name}: ${e.message}`);
    process.exitCode = 1;
  }
}

function seeded(seed = 1) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

check('merged WORD_BANK has at least 750 entries (all 9 source games combined)', () => {
  assert.ok(WORD_BANK.length >= 750, `only ${WORD_BANK.length} entries`);
});

check('merged ids are unique thanks to gN- prefixes', () => {
  const ids = new Set(WORD_BANK.map((w) => w.id));
  assert.equal(ids.size, WORD_BANK.length);
});

check('every source game contributes at least 40 entries (weak filter is virtual, skipped)', () => {
  for (const t of TOPICS) {
    if (t.id === 'weak') continue;
    const n = wordsForTopic(t.id).length;
    assert.ok(n >= 40, `source ${t.id} only has ${n} entries`);
  }
});

check('misses: recordMiss/recordHit keep a per-word tally, hits eventually clear a word', () => {
  _setStorage(fakeStorage());
  recordMiss('carrot');
  recordMiss('carrot');
  recordMiss('run');
  assert.deepEqual(missedWords(), ['carrot', 'run']);
  assert.equal(missCount(), 2);
  recordHit('carrot');
  assert.ok(missedWords().includes('carrot'), 'one hit is not enough to clear a word missed twice');
  assert.equal(missCount(), 2);
  recordHit('carrot');
  assert.deepEqual(missedWords(), ['run']);
  recordHit('never-missed');
  assert.deepEqual(missedWords(), ['run'], 'hitting an untracked word must not add it');
});

check('wordsForTopic("weak"): returns exactly the merged entries whose word is in the miss book', () => {
  _setStorage(fakeStorage());
  recordMiss('carrot');
  recordMiss('Vietnam');
  recordMiss('run');
  const weak = wordsForTopic('weak');
  assert.deepEqual(weak.map((w) => w.word).sort(), ['Vietnam', 'carrot', 'run']);
});

check('makeGame("weak"): pads a tiny weak pool with random fillers so every round still has 4 options', () => {
  _setStorage(fakeStorage());
  recordMiss('carrot');
  const g = makeGame('weak', 0, seeded(3));
  assert.equal(g.rounds.length, 6);
  for (const r of g.rounds) assert.equal(r.options.length, 4);
});

check('makeGame("weak") with an EMPTY miss book still builds a playable game', () => {
  _setStorage(fakeStorage());
  const g = makeGame('weak', 0, seeded(5));
  assert.equal(g.rounds.length, 6);
  for (const r of g.rounds) assert.equal(r.options.length, 4);
});

check('every merged entry has required non-empty fields + valid topic', () => {
  const topicIds = new Set(TOPICS.map((t) => t.id));
  for (const w of WORD_BANK) {
    assert.ok(w.id && typeof w.id === 'string', `bad id: ${JSON.stringify(w)}`);
    assert.ok(w.word && w.word.length > 0, `bad word for ${w.id}`);
    assert.ok(w.emoji && w.emoji.length > 0, `bad emoji for ${w.id}`);
    assert.ok(w.vi && w.vi.length > 0, `bad vi for ${w.id}`);
    assert.ok(w.sentence && w.sentence.length > 3, `bad sentence for ${w.id}`);
    assert.ok(w.sentenceVi && w.sentenceVi.length > 3, `bad sentenceVi for ${w.id}`);
    assert.ok(topicIds.has(w.topic), `unknown topic "${w.topic}" for ${w.id}`);
  }
});

check('image paths are rebased to absolute /game-dir/images/... form', () => {
  const withImg = WORD_BANK.filter((w) => w.img);
  assert.ok(withImg.length >= 30, `expected the merged bank to carry the real photos/SVGs, got ${withImg.length}`);
  for (const w of withImg) {
    assert.ok(/^\/nghe-doan-[a-z-]+\/images\//.test(w.img), `bad rebased img path for ${w.id}: ${w.img}`);
  }
});

check('wordsForTopic("all") returns the full merged bank', () => {
  assert.equal(wordsForTopic('all').length, WORD_BANK.length);
});

check('tuningFor: rounds count grows with level, capped at 10', () => {
  assert.equal(tuningFor(0).rounds, 6);
  assert.equal(tuningFor(2).rounds, 7);
  assert.equal(tuningFor(20).rounds, 10);
  assert.equal(tuningFor(0).choices, 4);
});

check('rateFor: sentence mode reads noticeably slower than word mode', () => {
  assert.ok(rateFor('sentence') < rateFor('word'), 'long sentences must be read slower than single words');
});

check('promptFor: reads the plain word in "word" mode, the full sentence in "sentence" mode', () => {
  const target = WORD_BANK.find((w) => w.id === 'g9-carrot');
  assert.ok(target, 'expected merged entry g9-carrot to exist');
  assert.equal(promptFor({ target, mode: 'word' }), 'carrot');
  assert.equal(promptFor({ target, mode: 'sentence' }), 'Rabbits love carrots.');
});

check('pickRound: target included, no duplicate ids among options', () => {
  const rng = seeded(7);
  const { target, options } = pickRound(WORD_BANK, new Set(), 4, rng);
  assert.equal(options.length, 4);
  assert.ok(options.some((o) => o.id === target.id));
  const ids = new Set(options.map((o) => o.id));
  assert.equal(ids.size, options.length);
});

check('pickRound: options NEVER share an emoji, across many seeds (emojis repeat between source games)', () => {
  for (let seed = 1; seed <= 60; seed++) {
    const { options } = pickRound(WORD_BANK, new Set(), 4, seeded(seed));
    const emojis = new Set(options.map((o) => o.emoji));
    assert.equal(emojis.size, options.length, `duplicate emoji in one round at seed ${seed}`);
  }
});

check('pickRound: avoids already-used target ids when possible', () => {
  const rng = seeded(3);
  const pool = wordsForTopic('g6');
  const used = new Set(pool.slice(0, pool.length - 1).map((w) => w.id));
  const { target } = pickRound(pool, used, 4, rng);
  assert.equal(target.id, pool[pool.length - 1].id);
});

check('makeGame("all", 0): builds correct number of rounds, starts fresh', () => {
  const g = makeGame('all', 0, seeded(1));
  assert.equal(g.rounds.length, 6);
  assert.equal(g.roundIndex, 0);
  assert.equal(g.score, 0);
  assert.equal(g.over, false);
});

check('makeGame(source, ...): every round option belongs to that source game pool', () => {
  const g = makeGame('g4', 1, seeded(5));
  const pool = new Set(wordsForTopic('g4').map((w) => w.id));
  for (const r of g.rounds) {
    for (const o of r.options) assert.ok(pool.has(o.id));
  }
});

check('makeGame: mixes "word" and "sentence" rounds — word mode dominates at level 0', () => {
  let wordTotal = 0;
  let total = 0;
  for (let seed = 1; seed <= 30; seed++) {
    const g = makeGame('all', 0, seeded(seed));
    for (const r of g.rounds) {
      assert.ok(r.mode === 'word' || r.mode === 'sentence', 'every round must have a valid mode');
      total++;
      if (r.mode === 'word') wordTotal++;
    }
  }
  assert.ok(wordTotal / total >= 0.6, `expected word-mode rounds to dominate at level 0, got ${wordTotal}/${total}`);
});

check('chooseOption: correct answer increases score and streak', () => {
  const g = makeGame('g1', 0, seeded(2));
  const r = currentRound(g);
  const ev = chooseOption(g, r.target.id);
  assert.equal(ev.correct, true);
  assert.equal(g.streak, 1);
  assert.equal(g.score, 10);
  assert.equal(g.roundIndex, 1);
});

check('chooseOption: first wrong answer gives a retry — streak resets, round does NOT advance', () => {
  const g = makeGame('g1', 0, seeded(2));
  const r = currentRound(g);
  const wrong = r.options.find((o) => o.id !== r.target.id);
  const ev = chooseOption(g, wrong.id);
  assert.equal(ev.correct, false);
  assert.equal(ev.retry, true);
  assert.equal(ev.roundDone, false);
  assert.equal(g.streak, 0);
  assert.equal(g.roundIndex, 0);
});

check('chooseOption: correct on the retry earns reduced points, no streak, round advances', () => {
  const g = makeGame('g1', 0, seeded(2));
  const r = currentRound(g);
  const wrong = r.options.find((o) => o.id !== r.target.id);
  chooseOption(g, wrong.id);
  const ev = chooseOption(g, r.target.id);
  assert.equal(ev.correct, true);
  assert.equal(ev.gain, 5);
  assert.equal(g.streak, 0);
  assert.equal(g.correctCount, 1);
  assert.equal(g.roundIndex, 1);
});

check('chooseOption: second wrong answer reveals the result and advances the round', () => {
  const g = makeGame('g1', 0, seeded(2));
  const r = currentRound(g);
  const wrongs = r.options.filter((o) => o.id !== r.target.id);
  chooseOption(g, wrongs[0].id);
  const ev = chooseOption(g, wrongs[1].id);
  assert.equal(ev.correct, false);
  assert.equal(ev.retry, false);
  assert.equal(ev.roundDone, true);
  assert.equal(g.roundIndex, 1);
});

check('chooseOption: streak bonus fires every 3rd consecutive correct answer', () => {
  const g = makeGame('all', 4, seeded(9));
  let bonusSeen = false;
  while (!g.over) {
    const r = currentRound(g);
    const ev = chooseOption(g, r.target.id);
    if (ev.streakBonus > 0) bonusSeen = true;
  }
  assert.ok(bonusSeen, 'expected at least one streak bonus across a fully-correct run');
});

check('chooseOption: game ends after all rounds, over+won set correctly', () => {
  const g = makeGame('g7', 0, seeded(4));
  const total = g.rounds.length;
  for (let i = 0; i < total; i++) {
    const r = currentRound(g);
    chooseOption(g, r.target.id);
  }
  assert.equal(g.over, true);
  assert.equal(g.won, true);
  assert.equal(g.correctCount, total);
});

check('chooseOption: no-op once game is over', () => {
  const g = makeGame('g9', 0, seeded(1));
  while (!g.over) {
    const r = currentRound(g);
    chooseOption(g, r.target.id);
  }
  const scoreBefore = g.score;
  const ev = chooseOption(g, 'anything');
  assert.equal(ev.roundDone, false);
  assert.equal(g.score, scoreBefore);
});

console.log(`\n${passed} checks passed`);
