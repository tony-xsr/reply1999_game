import assert from 'node:assert/strict';
import {
  TOPICS, WORD_BANK, wordsForTopic, tuningFor, pickRound, makeGame, currentRound, chooseOption,
} from './nghedoan.js';

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

check('WORD_BANK has at least 100 entries', () => {
  assert.ok(WORD_BANK.length >= 100, `only ${WORD_BANK.length} entries`);
});

check('WORD_BANK ids are unique', () => {
  const ids = new Set(WORD_BANK.map((w) => w.id));
  assert.equal(ids.size, WORD_BANK.length);
});

check('every WORD_BANK entry has required non-empty fields + valid topic', () => {
  const topicIds = new Set(TOPICS.map((t) => t.id));
  for (const w of WORD_BANK) {
    assert.ok(w.id && typeof w.id === 'string', `bad id: ${JSON.stringify(w)}`);
    assert.ok(w.emoji && w.emoji.length > 0, `bad emoji for ${w.id}`);
    assert.ok(w.vi && w.vi.length > 0, `bad vi for ${w.id}`);
    assert.ok(w.sentence && w.sentence.length > 3, `bad sentence for ${w.id}`);
    assert.ok(w.sentenceVi && w.sentenceVi.length > 3, `bad sentenceVi for ${w.id}`);
    assert.ok(topicIds.has(w.topic), `unknown topic "${w.topic}" for ${w.id}`);
  }
});

check('TOPICS each have at least 4 words (enough for 4-choice rounds)', () => {
  for (const t of TOPICS) {
    const n = wordsForTopic(t.id).length;
    assert.ok(n >= 4, `topic ${t.id} only has ${n} words`);
  }
});

check('wordsForTopic("all") returns the full bank', () => {
  assert.equal(wordsForTopic('all').length, WORD_BANK.length);
});

check('tuningFor: rounds count grows with level, capped at 10', () => {
  assert.equal(tuningFor(0).rounds, 6);
  assert.equal(tuningFor(2).rounds, 7);
  assert.equal(tuningFor(20).rounds, 10);
  assert.equal(tuningFor(0).choices, 4);
});

check('pickRound: target is included among options, options has no duplicate ids', () => {
  const rng = seeded(7);
  const pool = wordsForTopic('fruit');
  const { target, options } = pickRound(pool, new Set(), 4, rng);
  assert.equal(options.length, 4);
  assert.ok(options.some((o) => o.id === target.id));
  const ids = new Set(options.map((o) => o.id));
  assert.equal(ids.size, options.length);
});

check('pickRound: avoids already-used target ids when possible', () => {
  const rng = seeded(3);
  const pool = wordsForTopic('holiday');
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

check('makeGame(topic, ...): every round option belongs to that topic pool', () => {
  const g = makeGame('fun', 1, seeded(5));
  const pool = new Set(wordsForTopic('fun').map((w) => w.id));
  for (const r of g.rounds) {
    for (const o of r.options) assert.ok(pool.has(o.id));
  }
});

check('chooseOption: correct answer increases score and streak', () => {
  const g = makeGame('fruit', 0, seeded(2));
  const r = currentRound(g);
  const ev = chooseOption(g, r.target.id);
  assert.equal(ev.correct, true);
  assert.equal(g.streak, 1);
  assert.equal(g.score, 10);
  assert.equal(g.roundIndex, 1);
});

check('chooseOption: wrong answer resets streak to 0, still advances round', () => {
  const g = makeGame('fruit', 0, seeded(2));
  const r = currentRound(g);
  const wrong = r.options.find((o) => o.id !== r.target.id);
  const ev = chooseOption(g, wrong.id);
  assert.equal(ev.correct, false);
  assert.equal(g.streak, 0);
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
  const g = makeGame('food', 0, seeded(4));
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
  const g = makeGame('holiday', 0, seeded(1));
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
