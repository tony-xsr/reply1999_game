import assert from 'node:assert/strict';
import {
  TOPICS, WORD_BANK, wordsForTopic, tuningFor, rateFor, promptFor, pickRound, makeGame, currentRound, chooseOption,
} from './giaothong.js';

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

check('WORD_BANK has at least 90 entries', () => {
  assert.ok(WORD_BANK.length >= 90, `only ${WORD_BANK.length} entries`);
});

check('WORD_BANK ids are unique', () => {
  const ids = new Set(WORD_BANK.map((w) => w.id));
  assert.equal(ids.size, WORD_BANK.length);
});

check('WORD_BANK emojis are unique (avoid confusing 2 near-identical pictures in a 4-choice round)', () => {
  const emojis = new Set(WORD_BANK.map((w) => w.emoji));
  assert.equal(emojis.size, WORD_BANK.length, 'duplicate emoji found across entries');
});

check('every WORD_BANK entry has required non-empty fields + valid topic', () => {
  const topicIds = new Set(TOPICS.map((t) => t.id));
  for (const w of WORD_BANK) {
    assert.ok(w.id && typeof w.id === 'string', `bad id: ${JSON.stringify(w)}`);
    assert.ok(w.word && w.word.length > 0, `bad word for ${w.id}`);
    assert.ok(w.emoji && w.emoji.length > 0, `bad emoji for ${w.id}`);
    assert.ok(w.vi && w.vi.length > 0, `bad vi for ${w.id}`);
    assert.ok(w.sentence && w.sentence.length > 3, `bad sentence for ${w.id}`);
    assert.ok(w.sentenceVi && w.sentenceVi.length > 3, `bad sentenceVi for ${w.id}`);
    assert.ok(topicIds.has(w.topic), `unknown topic "${w.topic}" for ${w.id}`);
    if (w.img !== undefined) assert.ok(typeof w.img === 'string' && w.img.startsWith('images/'), `bad img path for ${w.id}`);
  }
});

check('real-photo entries (crane truck, buffalo, cave, coral reef, helmet, waterfall, cliff) are wired with a local images/ path', () => {
  const withPhoto = ['cranetruck', 'buffalo', 'cave', 'coralreef', 'helmet', 'waterfall', 'cliff', 'bamboo'];
  for (const id of withPhoto) {
    const w = WORD_BANK.find((e) => e.id === id);
    assert.ok(w, `expected entry ${id} to exist`);
    assert.ok(w.img, `expected entry ${id} to have a real photo`);
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

check('tuningFor: sentenceChance starts low and stays capped so word-only rounds dominate', () => {
  assert.equal(tuningFor(0).sentenceChance, 0.2);
  assert.ok(tuningFor(20).sentenceChance <= 0.45, 'sentenceChance must stay capped at high levels');
  assert.ok(tuningFor(0).sentenceChance < tuningFor(10).sentenceChance, 'sentenceChance should grow with level');
});

check('rateFor: sentence mode reads noticeably slower than word mode', () => {
  assert.ok(rateFor('sentence') < rateFor('word'), 'long sentences must be read slower than single words');
});

check('promptFor: reads the plain word in "word" mode, the full sentence in "sentence" mode', () => {
  const target = WORD_BANK.find((w) => w.id === 'car');
  assert.equal(promptFor({ target, mode: 'word' }), 'car');
  assert.equal(promptFor({ target, mode: 'sentence' }), 'I ride in a car.');
});

check('pickRound: target is included among options, options has no duplicate ids', () => {
  const rng = seeded(7);
  const pool = wordsForTopic('vehicle');
  const { target, options } = pickRound(pool, new Set(), 4, rng);
  assert.equal(options.length, 4);
  assert.ok(options.some((o) => o.id === target.id));
  const ids = new Set(options.map((o) => o.id));
  assert.equal(ids.size, options.length);
});

check('pickRound: avoids already-used target ids when possible', () => {
  const rng = seeded(3);
  const pool = wordsForTopic('geo');
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
  const g = makeGame('urban', 1, seeded(5));
  const pool = new Set(wordsForTopic('urban').map((w) => w.id));
  for (const r of g.rounds) {
    for (const o of r.options) assert.ok(pool.has(o.id));
  }
});

check('makeGame: mixes "word" and "sentence" rounds — word mode dominates on average at level 0', () => {
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
  const g = makeGame('vehicle', 0, seeded(2));
  const r = currentRound(g);
  const ev = chooseOption(g, r.target.id);
  assert.equal(ev.correct, true);
  assert.equal(g.streak, 1);
  assert.equal(g.score, 10);
  assert.equal(g.roundIndex, 1);
});

check('chooseOption: first wrong answer gives a retry — streak resets, round does NOT advance', () => {
  const g = makeGame('vehicle', 0, seeded(2));
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
  const g = makeGame('vehicle', 0, seeded(2));
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
  const g = makeGame('vehicle', 0, seeded(2));
  const r = currentRound(g);
  const wrongs = r.options.filter((o) => o.id !== r.target.id);
  chooseOption(g, wrongs[0].id);
  const ev = chooseOption(g, wrongs[1].id);
  assert.equal(ev.correct, false);
  assert.equal(ev.retry, false);
  assert.equal(ev.roundDone, true);
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
  const g = makeGame('environment', 0, seeded(4));
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
  const g = makeGame('utility', 0, seeded(1));
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
