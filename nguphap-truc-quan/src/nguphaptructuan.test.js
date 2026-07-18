import assert from 'node:assert/strict';
import {
  CHARACTERS, VERBS, TENSES,
  makeTimeMachineRound, makeTimeMachineGame, currentTimeMachineRound, answerTimeMachine,
  makeTwoActionsRound, makeTwoActionsGame, currentTwoActionsRound, answerTwoActions,
  BG_ACTIONS, INTERRUPT_EVENTS,
  COMPARE_ENTITIES, ATTRIBUTES,
  makeComparativeGameRound, makeComparativeGame, currentComparativeRound, answerComparative,
  GOING_TO_WILL_SCENARIOS, GOING_TO_WILL_QUESTION_COUNT,
  makeGoingToWillRound, makeGoingToWillGame, currentGoingToWillRound, answerGoingToWill,
  MODALS, MODAL_SITUATIONS, MODAL_SUBJECTS,
  makeModalRound, makeModalGame, currentModalRound, answerModal,
  CONDITIONAL_SITUATIONS,
  makeConditionalRound, makeConditionalGame, currentConditionalRound, answerConditional,
  SENTENCE_BUILDER_POOL,
  makeSentenceBuilderRound, makeSentenceBuilderGame, currentSentenceBuilderRound, tapSentenceBuilderChip,
  PASSIVE_SCENARIOS, PASSIVE_TENSES,
  makePassiveRound, makePassiveGame, currentPassiveRound, answerPassive,
  REPORTED_SPEECH_SCENARIOS,
  makeReportedRound, makeReportedGame, currentReportedRound, answerReported,
  QUANTIFIER_NOUNS,
  makeQuantifierRound, makeQuantifierGame, currentQuantifierRound, answerQuantifier,
  POS_WORDS, POS_CATEGORIES,
  makePosRound, makePosGame, currentPosRound, answerPos,
} from './nguphaptructuan.js';

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

/* ===== 1. Cỗ Máy Thời Gian Ngữ Pháp ===== */

check('có đủ 13 thì (12 thì cơ bản + going-to) và mỗi thì có id/label/cue/timelineMark/build hợp lệ', () => {
  assert.equal(TENSES.length, 13);
  const ids = new Set(TENSES.map((t) => t.id));
  assert.equal(ids.size, 13);
  for (const t of TENSES) {
    assert.ok(t.label && t.cue && t.timelineMark, `thì ${t.id} thiếu label/cue/timelineMark`);
    assert.equal(typeof t.build, 'function');
  }
});

check('present-simple chia đúng ngôi thứ 3 số ít (thêm -s/-es)', () => {
  const tense = TENSES.find((t) => t.id === 'present-simple');
  const char = CHARACTERS.find((c) => c.id === 'boy');
  const verb = VERBS.find((v) => v.base === 'run');
  assert.equal(tense.build(char, verb), 'He runs every day.');
});

check('past-continuous dùng "was" + V-ing', () => {
  const tense = TENSES.find((t) => t.id === 'past-continuous');
  const char = CHARACTERS.find((c) => c.id === 'girl');
  const verb = VERBS.find((v) => v.base === 'swim');
  assert.equal(tense.build(char, verb), 'She was swimming at 8pm yesterday.');
});

check('present-perfect dùng đúng quá khứ phân từ bất quy tắc (swim → swum)', () => {
  const tense = TENSES.find((t) => t.id === 'present-perfect');
  const char = CHARACTERS.find((c) => c.id === 'dog');
  const verb = VERBS.find((v) => v.base === 'swim');
  assert.equal(tense.build(char, verb), 'The dog has just swum.');
});

check('going-to dùng đúng cấu trúc "is going to + V nguyên mẫu"', () => {
  const tense = TENSES.find((t) => t.id === 'going-to');
  const char = CHARACTERS.find((c) => c.id === 'cat');
  const verb = VERBS.find((v) => v.base === 'jump');
  assert.equal(tense.build(char, verb), 'The cat is going to jump tomorrow.');
});

check('đủ 12 thì cơ bản: 3 mốc thời gian (present/past/future) x 4 dạng (đơn/tiếp diễn/hoàn thành/hoàn thành tiếp diễn)', () => {
  const expectedIds = [
    'present-simple', 'present-continuous', 'present-perfect', 'present-perfect-continuous',
    'past-simple', 'past-continuous', 'past-perfect', 'past-perfect-continuous',
    'future-simple', 'future-continuous', 'future-perfect', 'future-perfect-continuous',
  ];
  for (const id of expectedIds) {
    assert.ok(TENSES.some((t) => t.id === id), `thiếu thì cơ bản: ${id}`);
  }
  assert.equal(expectedIds.length, 12);
});

check('present-perfect-continuous dùng đúng "has been + V-ing"', () => {
  const tense = TENSES.find((t) => t.id === 'present-perfect-continuous');
  const char = CHARACTERS.find((c) => c.id === 'boy');
  const verb = VERBS.find((v) => v.base === 'read');
  assert.equal(tense.build(char, verb), 'He has been reading for two hours.');
});

check('past-perfect dùng đúng "had + V3" (bất quy tắc: write → written)', () => {
  const tense = TENSES.find((t) => t.id === 'past-perfect');
  const char = CHARACTERS.find((c) => c.id === 'girl');
  const verb = VERBS.find((v) => v.base === 'write');
  assert.equal(tense.build(char, verb), 'She had already written before it rained.');
});

check('past-perfect-continuous dùng đúng "had been + V-ing"', () => {
  const tense = TENSES.find((t) => t.id === 'past-perfect-continuous');
  const char = CHARACTERS.find((c) => c.id === 'dog');
  const verb = VERBS.find((v) => v.base === 'run');
  assert.equal(tense.build(char, verb), 'The dog had been running for an hour before the storm started.');
});

check('future-simple dùng đúng "will + V nguyên mẫu" (khác "going to")', () => {
  const tense = TENSES.find((t) => t.id === 'future-simple');
  const char = CHARACTERS.find((c) => c.id === 'cat');
  const verb = VERBS.find((v) => v.base === 'jump');
  assert.equal(tense.build(char, verb), 'The cat will jump tomorrow.');
});

check('future-continuous dùng đúng "will be + V-ing"', () => {
  const tense = TENSES.find((t) => t.id === 'future-continuous');
  const char = CHARACTERS.find((c) => c.id === 'boy');
  const verb = VERBS.find((v) => v.base === 'cook');
  assert.equal(tense.build(char, verb), 'He will be cooking at 8pm tomorrow.');
});

check('future-perfect dùng đúng "will have + V3"', () => {
  const tense = TENSES.find((t) => t.id === 'future-perfect');
  const char = CHARACTERS.find((c) => c.id === 'girl');
  const verb = VERBS.find((v) => v.base === 'cook');
  assert.equal(tense.build(char, verb), 'She will have already cooked by 8pm tomorrow.');
});

check('future-perfect-continuous dùng đúng "will have been + V-ing"', () => {
  const tense = TENSES.find((t) => t.id === 'future-perfect-continuous');
  const char = CHARACTERS.find((c) => c.id === 'dog');
  const verb = VERBS.find((v) => v.base === 'swim');
  assert.equal(tense.build(char, verb), 'The dog will have been swimming for two hours by 8pm tomorrow.');
});

check('13 thì đều sinh câu KHÁC NHAU cho cùng 1 nhân vật/động từ (không trùng lặp, bé phân biệt được)', () => {
  const char = CHARACTERS.find((c) => c.id === 'boy');
  const verb = VERBS.find((v) => v.base === 'play');
  const sentences = TENSES.map((t) => t.build(char, verb));
  assert.equal(new Set(sentences).size, TENSES.length, `câu trùng nhau: ${JSON.stringify(sentences)}`);
});

check('makeTimeMachineRound sinh đúng 4 lựa chọn, không trùng thì, có đúng 1 đáp án đúng', () => {
  const round = makeTimeMachineRound(seeded(1));
  assert.equal(round.options.length, 4);
  const tenseIds = round.options.map((o) => o.tenseId);
  assert.equal(new Set(tenseIds).size, 4);
  assert.ok(tenseIds.includes(round.correctTenseId));
  assert.ok(round.cue && round.timelineMark);
});

check('4 lựa chọn dùng CÙNG 1 nhân vật/động từ (chỉ khác thì)', () => {
  const round = makeTimeMachineRound(seeded(7));
  const tense = TENSES.find((t) => t.id === round.correctTenseId);
  const expectedCorrectSentence = tense.build(round.character, round.verb);
  const opt = round.options.find((o) => o.tenseId === round.correctTenseId);
  assert.equal(opt.sentence, expectedCorrectSentence);
});

check('answerTimeMachine: đúng ngay lần đầu +10, qua vòng, tăng streak', () => {
  const game = makeTimeMachineGame(3, seeded(2));
  const round = currentTimeMachineRound(game);
  const ev = answerTimeMachine(game, round.correctTenseId);
  assert.equal(ev.correct, true);
  assert.equal(ev.gain, 10);
  assert.equal(game.index, 1);
  assert.equal(game.streak, 1);
});

check('answerTimeMachine: sai lần đầu → retry, vòng KHÔNG qua, streak về 0', () => {
  const game = makeTimeMachineGame(3, seeded(2));
  const round = currentTimeMachineRound(game);
  game.streak = 4;
  const wrongId = round.options.find((o) => o.tenseId !== round.correctTenseId).tenseId;
  const ev = answerTimeMachine(game, wrongId);
  assert.equal(ev.retry, true);
  assert.equal(game.index, 0);
  assert.equal(game.streak, 0);
});

check('answerTimeMachine: đúng sau gợi ý chỉ +5, sai lần 2 thì qua vòng luôn', () => {
  const game = makeTimeMachineGame(3, seeded(2));
  const round = currentTimeMachineRound(game);
  const wrongId = round.options.find((o) => o.tenseId !== round.correctTenseId).tenseId;
  answerTimeMachine(game, wrongId); // sai lần 1 -> retry
  const ev = answerTimeMachine(game, round.correctTenseId); // đúng sau gợi ý
  assert.equal(ev.gain, 5);
  assert.equal(game.index, 1);

  const game2 = makeTimeMachineGame(3, seeded(3));
  const round2 = currentTimeMachineRound(game2);
  const wrongId2 = round2.options.find((o) => o.tenseId !== round2.correctTenseId).tenseId;
  answerTimeMachine(game2, wrongId2); // sai lần 1
  const ev2 = answerTimeMachine(game2, wrongId2); // sai lần 2
  assert.equal(ev2.correct, false);
  assert.equal(ev2.roundDone, true);
  assert.equal(game2.index, 1);
});

check('game Cỗ Máy Thời Gian kết thúc đúng lúc hết vòng, won khi đúng >= 60%', () => {
  const game = makeTimeMachineGame(3, seeded(9));
  for (let i = 0; i < 3; i++) {
    const round = currentTimeMachineRound(game);
    answerTimeMachine(game, round.correctTenseId);
  }
  assert.equal(game.over, true);
  assert.equal(game.won, true);
});

/* ===== 2. Hai Hành Động Cùng Lúc ===== */

check('makeTwoActionsRound sinh đúng 4 câu (4 pattern), có đúng 1 câu "correct"', () => {
  const round = makeTwoActionsRound(seeded(4));
  assert.equal(round.options.length, 4);
  const patterns = round.options.map((o) => o.pattern);
  assert.equal(new Set(patterns).size, 4);
  assert.ok(patterns.includes('correct'));
});

check('câu "correct" đúng cấu trúc: While + chủ ngữ nền + was + V-ing, sự kiện + quá khứ đơn', () => {
  for (let i = 0; i < 20; i++) {
    const round = makeTwoActionsRound(seeded(100 + i));
    const correctOpt = round.options.find((o) => o.pattern === 'correct');
    assert.match(correctOpt.sentence, /^While (I|He|She) was .+, .+ (rang|went out|went off|flew in|honked|arrived|buzzed in|exploded|cried|broke|knocked|crashed|crawled out|popped|slammed|squeaked|turned off)\.$/);
  }
});

check('4 pattern cho ra 4 câu KHÁC NHAU (không trùng lặp — mỗi kiểu sai đều nhận biết được)', () => {
  const round = makeTwoActionsRound(seeded(6));
  const sentences = round.options.map((o) => o.sentence);
  assert.equal(new Set(sentences).size, 4, `câu trùng nhau: ${JSON.stringify(sentences)}`);
});

check('answerTwoActions: đúng ngay lần đầu +10, qua vòng', () => {
  const game = makeTwoActionsGame(3, seeded(8));
  const round = currentTwoActionsRound(game);
  const ev = answerTwoActions(game, round.correctPattern);
  assert.equal(ev.correct, true);
  assert.equal(ev.gain, 10);
  assert.equal(game.index, 1);
});

check('answerTwoActions: sai lần đầu → retry, vòng không qua; sai lần 2 → qua vòng', () => {
  const game = makeTwoActionsGame(3, seeded(8));
  const round = currentTwoActionsRound(game);
  const wrongPattern = round.options.find((o) => o.pattern !== round.correctPattern).pattern;
  const ev1 = answerTwoActions(game, wrongPattern);
  assert.equal(ev1.retry, true);
  assert.equal(game.index, 0);
  const ev2 = answerTwoActions(game, wrongPattern);
  assert.equal(ev2.correct, false);
  assert.equal(ev2.roundDone, true);
  assert.equal(game.index, 1);
});

check('game Hai Hành Động Cùng Lúc không làm gì khi đã kết thúc', () => {
  const game = makeTwoActionsGame(1, seeded(10));
  const round = currentTwoActionsRound(game);
  answerTwoActions(game, round.correctPattern);
  assert.equal(game.over, true);
  const ev = answerTwoActions(game, 'correct');
  assert.deepEqual(ev, {
    correct: false, retry: false, gain: 0, streakBonus: 0, roundDone: false, gameDone: false, won: false,
  });
});

/* ===== 3. So Sánh Hơn/Nhất Trực Quan ===== */

check('makeComparativeGameRound sinh vòng "comparative" (2 thực thể) hoặc "superlative" (3 thực thể)', () => {
  let sawComparative = false;
  let sawSuperlative = false;
  const rng = seeded(11);
  for (let i = 0; i < 100; i++) {
    const round = makeComparativeGameRound(rng);
    if (round.subtype === 'comparative') { sawComparative = true; assert.equal(round.entities.length, 2); }
    else { sawSuperlative = true; assert.equal(round.entities.length, 3); }
    assert.equal(round.options.length, 4);
    assert.equal(new Set(round.options.map((o) => o.key)).size, 4);
    assert.ok(round.options.some((o) => o.key === round.correctKey));
  }
  assert.ok(sawComparative && sawSuperlative, 'phải xuất hiện cả 2 dạng vòng qua nhiều lần chơi');
});

check('vòng "comparative": câu correct đúng gán đúng thực thể có thanh đo LỚN HƠN', () => {
  const rng = seeded(21);
  for (let i = 0; i < 30; i++) {
    const round = makeComparativeGameRound(rng);
    if (round.subtype !== 'comparative') continue;
    const [a, b] = round.entities;
    const bigger = round.heights[a.id] > round.heights[b.id] ? a : b;
    const correctOpt = round.options.find((o) => o.key === 'correct');
    assert.ok(correctOpt.sentence.startsWith(cap0(bigger.noun)), `câu correct phải bắt đầu bằng thực thể lớn hơn: ${correctOpt.sentence}`);
  }
});
function cap0(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

check('vòng "superlative": câu "top" đúng gán thực thể có thanh đo LỚN NHẤT', () => {
  const rng = seeded(31);
  for (let i = 0; i < 30; i++) {
    const round = makeComparativeGameRound(rng);
    if (round.subtype !== 'superlative') continue;
    const top = round.entities.reduce((best, e) => (round.heights[e.id] > round.heights[best.id] ? e : best));
    const topOpt = round.options.find((o) => o.key === 'top');
    assert.ok(topOpt.sentence.startsWith(cap0(top.noun)), `câu "top" phải bắt đầu bằng thực thể lớn nhất: ${topOpt.sentence}`);
  }
});

check('answerComparative: đúng ngay lần đầu +10, sai lần đầu -> retry', () => {
  const game = makeComparativeGame(3, seeded(2));
  const round = currentComparativeRound(game);
  const ev = answerComparative(game, round.correctKey);
  assert.equal(ev.correct, true);
  assert.equal(ev.gain, 10);
  assert.equal(game.index, 1);

  const game2 = makeComparativeGame(3, seeded(2));
  const round2 = currentComparativeRound(game2);
  const wrongKey = round2.options.find((o) => o.key !== round2.correctKey).key;
  const ev2 = answerComparative(game2, wrongKey);
  assert.equal(ev2.retry, true);
  assert.equal(game2.index, 0);
});

/* ===== 4. Going To vs Will Trực Quan ===== */

check('GOING_TO_WILL_SCENARIOS đều có cue/cueLabel/subject/verb/correctForm hợp lệ', () => {
  for (const s of GOING_TO_WILL_SCENARIOS) {
    assert.ok(s.cue && s.cueLabel && s.subject && s.verb);
    assert.ok(s.correctForm === 'going-to' || s.correctForm === 'will');
  }
});

check('makeGoingToWillRound sinh 4 lựa chọn khác nhau, đúng 1 đáp án đúng theo scenario.correctForm', () => {
  const rng = seeded(41);
  for (let i = 0; i < 50; i++) {
    const round = makeGoingToWillRound(rng);
    assert.equal(round.options.length, 4);
    assert.equal(new Set(round.options.map((o) => o.key)).size, 4);
    const expectedKey = round.scenario.correctForm === 'going-to' ? 'going-to-correct' : 'will-correct';
    assert.equal(round.correctKey, expectedKey);
  }
});

check('chia động từ "to be" đúng theo chủ ngữ trong lựa chọn "going-to-correct"', () => {
  const rng = seeded(51);
  for (let i = 0; i < 40; i++) {
    const round = makeGoingToWillRound(rng);
    const opt = round.options.find((o) => o.key === 'going-to-correct');
    const subj = round.subject;
    if (subj === 'I') assert.match(opt.sentence, /^I am going to /);
    else if (subj === 'We' || subj === 'They' || subj === 'You') assert.match(opt.sentence, new RegExp(`^${subj} are going to `));
    else assert.match(opt.sentence, new RegExp(`^${subj} is going to `));
  }
});

check('answerGoingToWill: đúng ngay lần đầu +10; sai lần 2 liên tiếp thì qua vòng', () => {
  const game = makeGoingToWillGame(3, seeded(6));
  const round = currentGoingToWillRound(game);
  const ev = answerGoingToWill(game, round.correctKey);
  assert.equal(ev.correct, true);
  assert.equal(ev.gain, 10);

  const game2 = makeGoingToWillGame(3, seeded(6));
  const round2 = currentGoingToWillRound(game2);
  const wrongKey = round2.options.find((o) => o.key !== round2.correctKey).key;
  answerGoingToWill(game2, wrongKey);
  const ev2 = answerGoingToWill(game2, wrongKey);
  assert.equal(ev2.correct, false);
  assert.equal(ev2.roundDone, true);
  assert.equal(game2.index, 1);
});

/* ===== 5. Modal Ai Đúng ===== */

check('MODAL_SITUATIONS đều có icon/label/verb/modal hợp lệ (modal nằm trong MODALS)', () => {
  for (const s of MODAL_SITUATIONS) {
    assert.ok(s.icon && s.label && s.verb);
    assert.ok(MODALS.includes(s.modal), `modal lạ: ${s.modal}`);
  }
});

check('makeModalRound sinh đúng 4 lựa chọn = đúng 4 modal cố định, không trùng lặp', () => {
  const round = makeModalRound(seeded(61));
  const modals = round.options.map((o) => o.modal);
  assert.deepEqual([...modals].sort(), [...MODALS].sort());
  assert.ok(MODALS.includes(round.correctModal));
});

check('answerModal: đúng ngay lần đầu +10; sai lần đầu -> retry, không qua vòng', () => {
  const game = makeModalGame(3, seeded(9));
  const round = currentModalRound(game);
  const ev = answerModal(game, round.correctModal);
  assert.equal(ev.correct, true);
  assert.equal(ev.gain, 10);
  assert.equal(game.index, 1);

  const game2 = makeModalGame(3, seeded(9));
  const round2 = currentModalRound(game2);
  const wrongModal = round2.options.find((o) => o.modal !== round2.correctModal).modal;
  const ev2 = answerModal(game2, wrongModal);
  assert.equal(ev2.retry, true);
  assert.equal(game2.index, 0);
});

check('game Modal Ai Đúng kết thúc đúng lúc hết vòng, won khi đúng >= 60%', () => {
  const game = makeModalGame(3, seeded(12));
  for (let i = 0; i < 3; i++) {
    const round = currentModalRound(game);
    answerModal(game, round.correctModal);
  }
  assert.equal(game.over, true);
  assert.equal(game.won, true);
});

check('không đụng vào COMPARE_ENTITIES/ATTRIBUTES gốc: đủ dữ liệu tối thiểu', () => {
  assert.ok(COMPARE_ENTITIES.length >= 4);
  assert.ok(ATTRIBUTES.length >= 3);
});

/* ===== 6. Câu Điều Kiện Loại 1 ===== */

check('CONDITIONAL_SITUATIONS đều có cue/label/ifSubject/ifBase/ifPresent/resultWill/resultBase/ifPast hợp lệ', () => {
  for (const s of CONDITIONAL_SITUATIONS) {
    assert.ok(s.cue && s.label && s.ifSubject && s.ifBase && s.ifPresent && s.resultWill && s.resultBase && s.ifPast, `thiếu trường ở tình huống: ${JSON.stringify(s)}`);
  }
});

check('makeConditionalRound sinh 4 lựa chọn khác nhau (correct/will-in-if/no-will-result/past-mix), có đúng 1 đáp án đúng', () => {
  const rng = seeded(71);
  for (let i = 0; i < 50; i++) {
    const round = makeConditionalRound(rng);
    assert.equal(round.options.length, 4);
    const keys = round.options.map((o) => o.key);
    assert.deepEqual([...keys].sort(), ['correct', 'no-will-result', 'past-mix', 'will-in-if']);
    assert.equal(round.correctKey, 'correct');
    const sentences = round.options.map((o) => o.sentence);
    assert.equal(new Set(sentences).size, 4, `câu trùng nhau: ${JSON.stringify(sentences)}`);
  }
});

check('câu "correct" đúng cấu trúc: If + hiện tại đơn, S + will + V (không có "will" trong mệnh đề if)', () => {
  const rng = seeded(81);
  for (let i = 0; i < 30; i++) {
    const round = makeConditionalRound(rng);
    const correctOpt = round.options.find((o) => o.key === 'correct');
    const [ifPart, resultPart] = correctOpt.sentence.replace(/\.$/, '').split(', ');
    assert.ok(ifPart.startsWith('If '), `mệnh đề if phải bắt đầu bằng "If ": ${correctOpt.sentence}`);
    assert.ok(!ifPart.includes('will'), `mệnh đề if KHÔNG được có "will": ${correctOpt.sentence}`);
    assert.ok(resultPart.includes('will '), `mệnh đề kết quả phải có "will": ${correctOpt.sentence}`);
  }
});

check('câu "will-in-if" chứa "will" ngay trong mệnh đề if (lỗi thường gặp cần nhận biết)', () => {
  const rng = seeded(91);
  for (let i = 0; i < 30; i++) {
    const round = makeConditionalRound(rng);
    const opt = round.options.find((o) => o.key === 'will-in-if');
    const ifPart = opt.sentence.split(',')[0];
    assert.ok(ifPart.includes('will'), `câu "will-in-if" phải có "will" trong mệnh đề if: ${opt.sentence}`);
  }
});

check('answerConditional: đúng ngay lần đầu +10, qua vòng; sai lần đầu -> retry, streak về 0', () => {
  const game = makeConditionalGame(3, seeded(2));
  const round = currentConditionalRound(game);
  const ev = answerConditional(game, round.correctKey);
  assert.equal(ev.correct, true);
  assert.equal(ev.gain, 10);
  assert.equal(game.index, 1);

  const game2 = makeConditionalGame(3, seeded(2));
  const round2 = currentConditionalRound(game2);
  const wrongKey = round2.options.find((o) => o.key !== round2.correctKey).key;
  const ev2 = answerConditional(game2, wrongKey);
  assert.equal(ev2.retry, true);
  assert.equal(game2.index, 0);
  assert.equal(game2.streak, 0);
});

check('answerConditional: sai lần 2 liên tiếp thì qua vòng luôn (đáp án lộ ra ngoài)', () => {
  const game = makeConditionalGame(3, seeded(6));
  const round = currentConditionalRound(game);
  const wrongKey = round.options.find((o) => o.key !== round.correctKey).key;
  answerConditional(game, wrongKey);
  const ev = answerConditional(game, wrongKey);
  assert.equal(ev.correct, false);
  assert.equal(ev.roundDone, true);
  assert.equal(game.index, 1);
});

check('game Câu Điều Kiện kết thúc đúng lúc hết vòng, won khi đúng >= 60%', () => {
  const game = makeConditionalGame(3, seeded(15));
  for (let i = 0; i < 3; i++) {
    const round = currentConditionalRound(game);
    answerConditional(game, round.correctKey);
  }
  assert.equal(game.over, true);
  assert.equal(game.won, true);
});

/* ===== 7. Ghép Câu ===== */

check('SENTENCE_BUILDER_POOL đủ dữ liệu, mỗi câu có icon/vi/en hợp lệ, en có ít nhất 4 từ', () => {
  assert.ok(SENTENCE_BUILDER_POOL.length >= 10);
  for (const item of SENTENCE_BUILDER_POOL) {
    assert.ok(item.icon && item.vi && item.en, `thiếu trường ở câu: ${JSON.stringify(item)}`);
    assert.ok(item.en.replace(/\.$/, '').split(' ').length >= 4, `câu quá ngắn: ${item.en}`);
  }
});

check('makeSentenceBuilderRound: chips xáo trộn đủ đúng số từ, mỗi wordIndex xuất hiện đúng 1 lần, placedCount bắt đầu ở 0', () => {
  const rng = seeded(101);
  for (let i = 0; i < 30; i++) {
    const round = makeSentenceBuilderRound(rng);
    assert.equal(round.chips.length, round.words.length);
    const indices = round.chips.map((c) => c.wordIndex).sort((a, b) => a - b);
    assert.deepEqual(indices, round.words.map((_, i2) => i2));
    assert.equal(round.placedCount, 0);
    assert.equal(round.mistakes, 0);
  }
});

check('tapSentenceBuilderChip: bấm ĐÚNG từ tiếp theo thì placedCount tăng và chip đó biến mất khỏi round.chips', () => {
  const game = makeSentenceBuilderGame(3, seeded(3));
  const round = currentSentenceBuilderRound(game);
  const ev = tapSentenceBuilderChip(game, 0);
  assert.equal(ev.correct, true);
  assert.equal(round.placedCount, 1);
  assert.ok(!round.chips.some((c) => c.wordIndex === 0));
});

check('tapSentenceBuilderChip: bấm SAI (không phải từ tiếp theo) lần đầu -> retry, KHÔNG đổi placedCount, không xoá chip', () => {
  const game = makeSentenceBuilderGame(3, seeded(3));
  const round = currentSentenceBuilderRound(game);
  const wrongIndex = round.words.length - 1; // từ cuối cùng chắc chắn không phải từ tiếp theo (0)
  const ev = tapSentenceBuilderChip(game, wrongIndex);
  assert.equal(ev.wrong, true);
  assert.equal(ev.retry, true);
  assert.equal(round.placedCount, 0);
  assert.equal(round.mistakes, 1);
  assert.ok(round.chips.some((c) => c.wordIndex === wrongIndex), 'chip bấm sai KHÔNG bị xoá, bé còn cơ hội bấm lại');
});

check('hoàn thành câu KHÔNG sai lần nào -> +10 điểm, tăng streak, roundDone/complete = true', () => {
  const game = makeSentenceBuilderGame(3, seeded(5));
  const round = currentSentenceBuilderRound(game);
  let lastEv;
  for (let i = 0; i < round.words.length; i++) lastEv = tapSentenceBuilderChip(game, i);
  assert.equal(lastEv.complete, true);
  assert.equal(lastEv.correct, true);
  assert.equal(lastEv.gain, 10);
  assert.equal(lastEv.roundDone, true);
  assert.equal(game.streak, 1);
  assert.equal(game.index, 1);
});

check('hoàn thành câu sau 1 lần bấm sai (đã được gợi ý) -> chỉ +5 điểm, không tăng streak', () => {
  const game = makeSentenceBuilderGame(3, seeded(5));
  const round = currentSentenceBuilderRound(game);
  tapSentenceBuilderChip(game, round.words.length - 1); // bấm sai 1 lần (retry)
  let lastEv;
  for (let i = 0; i < round.words.length; i++) lastEv = tapSentenceBuilderChip(game, i);
  assert.equal(lastEv.complete, true);
  assert.equal(lastEv.gain, 5);
  assert.equal(game.streak, 0);
});

check('bấm sai lần 2 liên tiếp -> lộ đáp án (placedCount = hết câu, chips rỗng), qua vòng, KHÔNG tính đúng', () => {
  const game = makeSentenceBuilderGame(3, seeded(5));
  const round = currentSentenceBuilderRound(game);
  const wrongIndex = round.words.length - 1;
  tapSentenceBuilderChip(game, wrongIndex); // sai lần 1 -> retry
  const ev = tapSentenceBuilderChip(game, wrongIndex); // sai lần 2 -> lộ đáp án
  assert.equal(ev.wrong, true);
  assert.equal(ev.correct, false);
  assert.equal(ev.roundDone, true);
  assert.equal(round.placedCount, round.words.length);
  assert.equal(round.chips.length, 0);
  assert.equal(game.index, 1);
  assert.equal(game.correctCount, 0);
});

check('game Ghép Câu kết thúc đúng lúc hết vòng, won khi đúng >= 60%; không làm gì khi đã kết thúc', () => {
  const game = makeSentenceBuilderGame(2, seeded(8));
  for (let r = 0; r < 2; r++) {
    const round = currentSentenceBuilderRound(game);
    for (let i = 0; i < round.words.length; i++) tapSentenceBuilderChip(game, i);
  }
  assert.equal(game.over, true);
  assert.equal(game.won, true);
  const ev = tapSentenceBuilderChip(game, 0);
  assert.deepEqual(ev, {
    correct: false, wrong: false, retry: false, gain: 0, streakBonus: 0, roundDone: false, gameDone: false, won: false, complete: false,
  });
});

check('bổ sung dữ liệu vòng 2: mọi pool chính đã tăng đáng kể (không còn mỏng dưới 12 tình huống/pool)', () => {
  assert.ok(CHARACTERS.length >= 12);
  assert.ok(VERBS.length >= 20);
  assert.ok(COMPARE_ENTITIES.length >= 14);
  assert.ok(ATTRIBUTES.length >= 10);
  assert.ok(GOING_TO_WILL_SCENARIOS.length >= 20);
  assert.ok(MODAL_SITUATIONS.length >= 20);
  assert.ok(CONDITIONAL_SITUATIONS.length >= 20);
  assert.ok(SENTENCE_BUILDER_POOL.length >= 28);
});

check('bổ sung dữ liệu vòng 3: đào sâu thêm lần nữa, mọi pool tiếp tục tăng', () => {
  assert.ok(CHARACTERS.length >= 14);
  assert.ok(VERBS.length >= 24);
  assert.ok(BG_ACTIONS.length >= 20);
  assert.ok(INTERRUPT_EVENTS.length >= 18);
  assert.ok(COMPARE_ENTITIES.length >= 18);
  assert.ok(ATTRIBUTES.length >= 12);
  assert.ok(GOING_TO_WILL_SCENARIOS.length >= 30);
  assert.ok(MODAL_SITUATIONS.length >= 32);
  assert.ok(CONDITIONAL_SITUATIONS.length >= 30);
  assert.ok(SENTENCE_BUILDER_POOL.length >= 40);
  assert.ok(PASSIVE_SCENARIOS.length >= 22);
  assert.ok(REPORTED_SPEECH_SCENARIOS.length >= 20);
});

check('bổ sung dữ liệu vòng 4: đào sâu tiếp các pool dùng làm mẫu số thanh tiến độ', () => {
  assert.ok(GOING_TO_WILL_SCENARIOS.length >= 36);
  assert.ok(MODAL_SITUATIONS.length >= 38);
  assert.ok(CONDITIONAL_SITUATIONS.length >= 36);
  assert.ok(PASSIVE_SCENARIOS.length >= 26);
  assert.ok(REPORTED_SPEECH_SCENARIOS.length >= 24);
  assert.ok(SENTENCE_BUILDER_POOL.length >= 48);
});

check('bổ sung dữ liệu vòng 5: các pool nền tảng (nhân vật/động từ/hành động/thực thể) tiếp tục tăng', () => {
  assert.ok(CHARACTERS.length >= 16);
  assert.ok(VERBS.length >= 26);
  assert.ok(BG_ACTIONS.length >= 22);
  assert.ok(INTERRUPT_EVENTS.length >= 20);
  assert.ok(COMPARE_ENTITIES.length >= 20);
  assert.ok(ATTRIBUTES.length >= 14);
});

check('bổ sung dữ liệu vòng 6: trò mới Lượng Từ Đúng đã có đủ đồ vật, các pool khác tiếp tục tăng', () => {
  assert.ok(QUANTIFIER_NOUNS.length >= 14);
  assert.ok(GOING_TO_WILL_SCENARIOS.length >= 40);
  assert.ok(MODAL_SITUATIONS.length >= 42);
  assert.ok(CONDITIONAL_SITUATIONS.length >= 40);
  assert.ok(SENTENCE_BUILDER_POOL.length >= 52);
});

check('bổ sung dữ liệu vòng 7: nhân vật/động từ + 3 pool tình huống + Ghép Câu tiếp tục tăng', () => {
  assert.ok(CHARACTERS.length >= 18);
  assert.ok(VERBS.length >= 28);
  assert.ok(GOING_TO_WILL_SCENARIOS.length >= 44);
  assert.ok(MODAL_SITUATIONS.length >= 46);
  assert.ok(CONDITIONAL_SITUATIONS.length >= 44);
  assert.ok(SENTENCE_BUILDER_POOL.length >= 56);
});

check('bổ sung dữ liệu vòng 8: đào sâu đúng 3 trò bị phản hồi "quá ít câu hỏi" (Cỗ Máy Thời Gian, Ghép Câu, Chủ Động/Bị Động)', () => {
  assert.ok(CHARACTERS.length >= 20);
  assert.ok(VERBS.length >= 32);
  assert.ok(PASSIVE_SCENARIOS.length >= 30);
  assert.ok(SENTENCE_BUILDER_POOL.length >= 70);
  // "Số câu hỏi" thật của Cỗ Máy Thời Gian là TÍCH các mảng thành phần, không
  // phải chỉ số thì — xác nhận tích này đủ lớn (>= 5000 câu khác nhau).
  assert.ok(CHARACTERS.length * VERBS.length * TENSES.length >= 5000);
  // Chủ Động/Bị Động: mỗi tình huống x 2 thì (hiện tại/quá khứ đơn) = câu hỏi thật.
  assert.ok(PASSIVE_SCENARIOS.length * 2 >= 60);
});

check('bổ sung dữ liệu vòng 9: đào sâu thêm lần 2 đúng 3 trò user vẫn báo "quá ít câu hỏi" (do bản cũ chưa deploy tới máy test)', () => {
  assert.ok(CHARACTERS.length >= 23);
  assert.ok(VERBS.length >= 36);
  assert.ok(PASSIVE_SCENARIOS.length >= 40);
  assert.ok(SENTENCE_BUILDER_POOL.length >= 80);
  assert.ok(CHARACTERS.length * VERBS.length * TENSES.length >= 10000);
  assert.ok(PASSIVE_SCENARIOS.length * 2 >= 80);
  // Không trùng câu tiếng Anh nào trong Ghép Câu (bẫy lỗi đã gặp ở vòng trước).
  const enTexts = SENTENCE_BUILDER_POOL.map((x) => x.en);
  assert.equal(new Set(enTexts).size, enTexts.length);
  // Không trùng tổ hợp agent|object|verb nào trong Chủ Động/Bị Động.
  const combos = PASSIVE_SCENARIOS.map((s) => `${s.agentNoun}|${s.objectNoun}|${s.base}`);
  assert.equal(new Set(combos).size, combos.length);
});

check('bổ sung dữ liệu vòng 10: nâng MỌI trò lên >=200 câu hỏi/từ vựng (yêu cầu mới của user)', () => {
  // Going To vs Will + Modal: nhân subject-pool (không đổi ý nghĩa ngữ pháp).
  assert.ok(GOING_TO_WILL_QUESTION_COUNT >= 200, `Going To vs Will chỉ có ${GOING_TO_WILL_QUESTION_COUNT} câu hỏi`);
  assert.ok(MODAL_SITUATIONS.length * MODAL_SUBJECTS.length >= 200);
  // Chủ Động/Bị Động: thêm thì "future" (2->3) + thêm tình huống (40->70).
  assert.ok(PASSIVE_TENSES.length >= 3);
  assert.ok(PASSIVE_SCENARIOS.length * PASSIVE_TENSES.length >= 200);
  // Câu Điều Kiện: template + subject-pool (44 gốc + 30 mẫu × 6 chủ ngữ).
  assert.ok(CONDITIONAL_SITUATIONS.length >= 200, `Câu Điều Kiện chỉ có ${CONDITIONAL_SITUATIONS.length} câu hỏi`);
  // Không có tình huống Điều Kiện nào bị lỗi ifPresent === ifPast (bẫy lỗi đã gặp nhiều lần trước đây).
  for (const s of CONDITIONAL_SITUATIONS) {
    assert.notEqual(s.ifPresent, s.ifPast, `ifPresent trùng ifPast ở: ${JSON.stringify(s)}`);
  }
  // Không trùng cặp ifPresent+resultWill nào trong toàn bộ Câu Điều Kiện.
  const condKeys = CONDITIONAL_SITUATIONS.map((s) => `${s.ifPresent}|${s.resultWill}`);
  assert.equal(new Set(condKeys).size, condKeys.length);
  // Lượng Từ Đúng: mở rộng vốn từ vựng lên >=200 đồ vật, không trùng từ/emoji.
  assert.ok(QUANTIFIER_NOUNS.length >= 200, `Lượng Từ Đúng chỉ có ${QUANTIFIER_NOUNS.length} đồ vật`);
  const qPlurals = QUANTIFIER_NOUNS.map((n) => n.plural);
  assert.equal(new Set(qPlurals).size, qPlurals.length);
  const qEmojis = QUANTIFIER_NOUNS.map((n) => n.emoji);
  assert.equal(new Set(qEmojis).size, qEmojis.length);
  // Lời Nói Gián Tiếp: template lùi thì theo "kind" × 2 người tường thuật (he/she).
  assert.ok(REPORTED_SPEECH_SCENARIOS.length >= 200, `Lời Nói Gián Tiếp chỉ có ${REPORTED_SPEECH_SCENARIOS.length} câu hỏi`);
  const repKeys = ['correct', 'noBackshift', 'wrongPronoun', 'wrongReportingVerb'];
  for (const k of repKeys) {
    const vals = REPORTED_SPEECH_SCENARIOS.map((s) => s[k]);
    assert.equal(new Set(vals).size, vals.length, `trùng câu "${k}" trong Lời Nói Gián Tiếp`);
  }
  // Ghép Câu: nhân CHARACTERS × VERBS × 6 mẫu câu để đạt >=200, không trùng câu, không câu nào quá ngắn.
  assert.ok(SENTENCE_BUILDER_POOL.length >= 200, `Ghép Câu chỉ có ${SENTENCE_BUILDER_POOL.length} câu hỏi`);
  const sbEn = SENTENCE_BUILDER_POOL.map((x) => x.en);
  assert.equal(new Set(sbEn).size, sbEn.length);
  for (const item of SENTENCE_BUILDER_POOL) {
    assert.ok(item.en.replace(/\.$/, '').split(' ').length >= 4, `câu Ghép Câu quá ngắn: ${item.en}`);
  }
});

/* ===== 8. Chủ Động vs Bị Động (Passive Voice) ===== */

check('PASSIVE_SCENARIOS đủ dữ liệu (>=18), mỗi tình huống có đủ agent/object/3 dạng động từ hợp lệ', () => {
  assert.ok(PASSIVE_SCENARIOS.length >= 18);
  for (const s of PASSIVE_SCENARIOS) {
    assert.ok(s.agentIcon && s.agentNoun && s.objectIcon && s.objectNoun, `thiếu trường ở tình huống: ${JSON.stringify(s)}`);
    assert.ok(s.base && s.past && s.pp && s.s3, `thiếu dạng động từ ở: ${s.agentNoun}`);
    assert.equal(typeof s.objectPlural, 'boolean');
  }
});

check('makePassiveRound sinh 4 lựa chọn khác nhau (correct/active-instead/wrong-be/wrong-participle), đúng 1 đáp án đúng', () => {
  const rng = seeded(201);
  for (let i = 0; i < 60; i++) {
    const round = makePassiveRound(rng);
    assert.equal(round.options.length, 4);
    const keys = round.options.map((o) => o.key);
    assert.deepEqual([...keys].sort(), ['active-instead', 'correct', 'wrong-be', 'wrong-participle']);
    assert.equal(round.correctKey, 'correct');
    const sentences = round.options.map((o) => o.sentence);
    assert.equal(new Set(sentences).size, 4, `câu trùng nhau: ${JSON.stringify(sentences)}`);
    assert.ok(['present', 'past', 'future'].includes(round.tense));
  }
});

check('câu "correct" đúng cấu trúc bị động: Object + is/are/was/were/will be + quá khứ phân từ + by + agent, chia đúng theo objectPlural và thì', () => {
  const rng = seeded(211);
  for (let i = 0; i < 90; i++) {
    const round = makePassiveRound(rng);
    const correctOpt = round.options.find((o) => o.key === 'correct');
    const beWord = round.tense === 'future'
      ? 'will be'
      : (round.scenario.objectPlural
        ? (round.tense === 'present' ? 'are' : 'were')
        : (round.tense === 'present' ? 'is' : 'was'));
    assert.ok(correctOpt.sentence.includes(` ${beWord} ${round.scenario.pp} by `), `câu correct sai cấu trúc: ${correctOpt.sentence}`);
    assert.ok(correctOpt.sentence.endsWith(`by ${round.scenario.agentNoun}.`), `câu correct thiếu "by + agent" đúng cuối câu: ${correctOpt.sentence}`);
  }
});

check('câu "active-instead" luôn ở dạng CHỦ ĐỘNG (agent làm chủ ngữ, không có "by")', () => {
  const rng = seeded(221);
  for (let i = 0; i < 40; i++) {
    const round = makePassiveRound(rng);
    const opt = round.options.find((o) => o.key === 'active-instead');
    assert.ok(!opt.sentence.includes(' by '), `câu active-instead không được có "by": ${opt.sentence}`);
    assert.ok(opt.sentence.startsWith(cap0(round.scenario.agentNoun)), `câu active-instead phải bắt đầu bằng agent: ${opt.sentence}`);
  }
});

check('answerPassive: đúng ngay lần đầu +10, qua vòng; sai lần đầu -> retry, streak về 0; sai lần 2 -> qua vòng luôn', () => {
  const game = makePassiveGame(3, seeded(3));
  const round = currentPassiveRound(game);
  const ev = answerPassive(game, round.correctKey);
  assert.equal(ev.correct, true);
  assert.equal(ev.gain, 10);
  assert.equal(game.index, 1);

  const game2 = makePassiveGame(3, seeded(3));
  const round2 = currentPassiveRound(game2);
  const wrongKey = round2.options.find((o) => o.key !== round2.correctKey).key;
  const ev2 = answerPassive(game2, wrongKey);
  assert.equal(ev2.retry, true);
  assert.equal(game2.index, 0);
  assert.equal(game2.streak, 0);
  const ev3 = answerPassive(game2, wrongKey);
  assert.equal(ev3.correct, false);
  assert.equal(ev3.roundDone, true);
  assert.equal(game2.index, 1);
});

check('game Chủ Động vs Bị Động kết thúc đúng lúc hết vòng, won khi đúng >= 60%', () => {
  const game = makePassiveGame(3, seeded(9));
  for (let i = 0; i < 3; i++) {
    const round = currentPassiveRound(game);
    answerPassive(game, round.correctKey);
  }
  assert.equal(game.over, true);
  assert.equal(game.won, true);
});

/* ===== 9. Lời Nói Trực Tiếp → Gián Tiếp (Reported Speech) ===== */

check('REPORTED_SPEECH_SCENARIOS đủ dữ liệu (>=16), mỗi tình huống có đủ icon/quote/4 câu hợp lệ', () => {
  assert.ok(REPORTED_SPEECH_SCENARIOS.length >= 16);
  for (const s of REPORTED_SPEECH_SCENARIOS) {
    assert.ok(s.icon && s.quote && s.correct && s.noBackshift && s.wrongPronoun && s.wrongReportingVerb, `thiếu trường ở: ${JSON.stringify(s)}`);
    assert.ok(s.quote.startsWith('"') && s.quote.endsWith('."'), `quote phải nằm trong dấu ngoặc kép: ${s.quote}`);
    const variants = [s.correct, s.noBackshift, s.wrongPronoun, s.wrongReportingVerb];
    assert.equal(new Set(variants).size, 4, `4 câu phải khác nhau: ${JSON.stringify(variants)}`);
  }
});

check('makeReportedRound sinh 4 lựa chọn khác nhau (correct/no-backshift/wrong-pronoun/wrong-reporting-verb), đúng 1 đáp án đúng', () => {
  const rng = seeded(231);
  for (let i = 0; i < 40; i++) {
    const round = makeReportedRound(rng);
    assert.equal(round.options.length, 4);
    const keys = round.options.map((o) => o.key);
    assert.deepEqual([...keys].sort(), ['correct', 'no-backshift', 'wrong-pronoun', 'wrong-reporting-verb']);
    assert.equal(round.correctKey, 'correct');
    const correctOpt = round.options.find((o) => o.key === 'correct');
    assert.equal(correctOpt.sentence, round.scenario.correct);
  }
});

check('câu "no-backshift" không lùi thì (vẫn giữ am/is/will/can/have như câu trực tiếp)', () => {
  const rng = seeded(241);
  for (let i = 0; i < 30; i++) {
    const round = makeReportedRound(rng);
    const opt = round.options.find((o) => o.key === 'no-backshift');
    assert.equal(opt.sentence, round.scenario.noBackshift);
    assert.notEqual(opt.sentence, round.scenario.correct, 'no-backshift phải khác câu đúng');
  }
});

check('answerReported: đúng ngay lần đầu +10, qua vòng; sai lần đầu -> retry; sai lần 2 -> qua vòng luôn', () => {
  const game = makeReportedGame(3, seeded(5));
  const round = currentReportedRound(game);
  const ev = answerReported(game, round.correctKey);
  assert.equal(ev.correct, true);
  assert.equal(ev.gain, 10);
  assert.equal(game.index, 1);

  const game2 = makeReportedGame(3, seeded(5));
  const round2 = currentReportedRound(game2);
  const wrongKey = round2.options.find((o) => o.key !== round2.correctKey).key;
  const ev2 = answerReported(game2, wrongKey);
  assert.equal(ev2.retry, true);
  const ev3 = answerReported(game2, wrongKey);
  assert.equal(ev3.correct, false);
  assert.equal(ev3.roundDone, true);
});

check('game Lời Nói Trực Tiếp → Gián Tiếp kết thúc đúng lúc hết vòng, won khi đúng >= 60%', () => {
  const game = makeReportedGame(3, seeded(13));
  for (let i = 0; i < 3; i++) {
    const round = currentReportedRound(game);
    answerReported(game, round.correctKey);
  }
  assert.equal(game.over, true);
  assert.equal(game.won, true);
});

/* ===== 10. Lượng Từ Đúng (All/Some/None/Every) ===== */

check('QUANTIFIER_NOUNS đủ dữ liệu (>=8), mỗi mục có emoji/plural hợp lệ', () => {
  assert.ok(QUANTIFIER_NOUNS.length >= 8);
  for (const n of QUANTIFIER_NOUNS) {
    assert.ok(n.emoji && n.plural, `thiếu trường ở: ${JSON.stringify(n)}`);
  }
});

check('makeQuantifierRound: total trong khoảng 4-6, đúng 1 trong 3 trường hợp all/none/some khớp với highlighted', () => {
  const rng = seeded(301);
  for (let i = 0; i < 60; i++) {
    const round = makeQuantifierRound(rng);
    assert.ok(round.total >= 4 && round.total <= 6, `total ngoài khoảng: ${round.total}`);
    assert.ok(round.highlighted >= 0 && round.highlighted <= round.total);
    if (round.correctKey === 'all') assert.equal(round.highlighted, round.total);
    else if (round.correctKey === 'none') assert.equal(round.highlighted, 0);
    else { // some
      assert.ok(round.highlighted > 0 && round.highlighted < round.total, `"some" nhưng highlighted không nằm giữa: ${round.highlighted}/${round.total}`);
    }
  }
});

check('makeQuantifierRound sinh đúng 4 lựa chọn (all/some/none/every), luôn khác nhau, "every" không bao giờ là đáp án đúng', () => {
  const rng = seeded(311);
  for (let i = 0; i < 60; i++) {
    const round = makeQuantifierRound(rng);
    assert.equal(round.options.length, 4);
    const keys = round.options.map((o) => o.key);
    assert.deepEqual([...keys].sort(), ['all', 'every', 'none', 'some']);
    const sentences = round.options.map((o) => o.sentence);
    assert.equal(new Set(sentences).size, 4, `câu trùng nhau: ${JSON.stringify(sentences)}`);
    assert.notEqual(round.correctKey, 'every', '"every" không bao giờ đúng vì luôn đi với danh từ SỐ NHIỀU trong trò này');
  }
});

check('câu "every" luôn chia SAI (Every + danh từ số nhiều + is) — đúng lỗi thường gặp cần nhận biết', () => {
  const rng = seeded(321);
  for (let i = 0; i < 30; i++) {
    const round = makeQuantifierRound(rng);
    const opt = round.options.find((o) => o.key === 'every');
    assert.ok(opt.sentence.startsWith('Every '), `câu every phải bắt đầu bằng "Every ": ${opt.sentence}`);
    assert.ok(opt.sentence.endsWith(' is red.'), `câu every phải kết thúc bằng "is red.": ${opt.sentence}`);
  }
});

check('answerQuantifier: đúng ngay lần đầu +10, qua vòng; sai lần đầu -> retry; sai lần 2 -> qua vòng luôn', () => {
  const game = makeQuantifierGame(3, seeded(7));
  const round = currentQuantifierRound(game);
  const ev = answerQuantifier(game, round.correctKey);
  assert.equal(ev.correct, true);
  assert.equal(ev.gain, 10);
  assert.equal(game.index, 1);

  const game2 = makeQuantifierGame(3, seeded(7));
  const round2 = currentQuantifierRound(game2);
  const wrongKey = round2.options.find((o) => o.key !== round2.correctKey).key;
  const ev2 = answerQuantifier(game2, wrongKey);
  assert.equal(ev2.retry, true);
  assert.equal(game2.index, 0);
  const ev3 = answerQuantifier(game2, wrongKey);
  assert.equal(ev3.correct, false);
  assert.equal(ev3.roundDone, true);
  assert.equal(game2.index, 1);
});

check('game Lượng Từ Đúng kết thúc đúng lúc hết vòng, won khi đúng >= 60%', () => {
  const game = makeQuantifierGame(3, seeded(17));
  for (let i = 0; i < 3; i++) {
    const round = currentQuantifierRound(game);
    answerQuantifier(game, round.correctKey);
  }
  assert.equal(game.over, true);
  assert.equal(game.won, true);
});

/* ===== 11. Nhận Biết Từ Loại (Parts of Speech) ===== */

check('POS_CATEGORIES đủ 8 từ loại cơ bản, POS_WORDS đủ dữ liệu (>=16), mỗi mục có sentence/word/pos/hint hợp lệ và word THẬT SỰ nằm trong sentence', () => {
  assert.equal(POS_CATEGORIES.length, 8);
  const catIds = new Set(POS_CATEGORIES.map((c) => c.id));
  assert.ok(POS_WORDS.length >= 16);
  for (const w of POS_WORDS) {
    assert.ok(w.sentence && w.word && w.pos && w.hint, `thiếu trường ở: ${JSON.stringify(w)}`);
    assert.ok(catIds.has(w.pos), `pos "${w.pos}" không nằm trong POS_CATEGORIES`);
    assert.ok(w.sentence.includes(w.word), `word "${w.word}" không nằm trong sentence: "${w.sentence}"`);
  }
  // Không trùng câu nào trong toàn bộ ngân hàng câu.
  const sentences = POS_WORDS.map((w) => w.sentence);
  assert.equal(new Set(sentences).size, sentences.length);
});

check('makePosRound sinh đúng 4 lựa chọn (1 đúng + 3 nhiễu khác nhau) trong 8 từ loại', () => {
  const rng = seeded(401);
  for (let i = 0; i < 80; i++) {
    const round = makePosRound(rng);
    assert.equal(round.options.length, 4);
    const posIds = round.options.map((o) => o.posId);
    assert.equal(new Set(posIds).size, 4, `4 lựa chọn phải khác nhau: ${JSON.stringify(posIds)}`);
    assert.ok(posIds.includes(round.correctPosId));
    assert.equal(round.correctPosId, round.item.pos);
  }
});

check('answerPos: đúng ngay lần đầu +10, qua vòng; sai lần đầu -> retry, streak về 0; sai lần 2 -> qua vòng luôn', () => {
  const game = makePosGame(3, seeded(3));
  const round = currentPosRound(game);
  const ev = answerPos(game, round.correctPosId);
  assert.equal(ev.correct, true);
  assert.equal(ev.gain, 10);
  assert.equal(game.index, 1);

  const game2 = makePosGame(3, seeded(3));
  const round2 = currentPosRound(game2);
  const wrongId2 = round2.options.find((o) => o.posId !== round2.correctPosId).posId;
  const ev2 = answerPos(game2, wrongId2);
  assert.equal(ev2.retry, true);
  assert.equal(game2.streak, 0);
  const ev3 = answerPos(game2, wrongId2);
  assert.equal(ev3.retry, false);
  assert.equal(ev3.correct, false);
  assert.equal(game2.index, 1);
});

check('game Nhận Biết Từ Loại kết thúc đúng lúc hết vòng, won khi đúng >= 60%', () => {
  const game = makePosGame(3, seeded(17));
  for (let i = 0; i < 3; i++) {
    const round = currentPosRound(game);
    answerPos(game, round.correctPosId);
  }
  assert.equal(game.over, true);
  assert.equal(game.won, true);
});

check('bổ sung dữ liệu vòng 11: áp chuẩn >=500 câu hỏi/từ vựng cho 7/8 trò còn mỏng (yêu cầu mới nhất của user)', () => {
  assert.ok(GOING_TO_WILL_QUESTION_COUNT >= 500, `Going To vs Will chỉ có ${GOING_TO_WILL_QUESTION_COUNT}`);
  assert.ok(MODAL_SITUATIONS.length * MODAL_SUBJECTS.length >= 500);
  assert.ok(CONDITIONAL_SITUATIONS.length >= 500, `Câu Điều Kiện chỉ có ${CONDITIONAL_SITUATIONS.length}`);
  assert.ok(SENTENCE_BUILDER_POOL.length >= 500, `Ghép Câu chỉ có ${SENTENCE_BUILDER_POOL.length}`);
  assert.ok(PASSIVE_SCENARIOS.length * PASSIVE_TENSES.length >= 500);
  assert.ok(REPORTED_SPEECH_SCENARIOS.length >= 500, `Lời Nói Gián Tiếp chỉ có ${REPORTED_SPEECH_SCENARIOS.length}`);
  assert.ok(QUANTIFIER_NOUNS.length >= 500, `Lượng Từ Đúng chỉ có ${QUANTIFIER_NOUNS.length}`);
  // Nhận Biết Từ Loại (POS) mới tăng 100->220 đợt này, CHƯA đạt 500 — ghi nhận trung thực thay vì ép số giả.
  assert.ok(POS_WORDS.length >= 200, `Nhận Biết Từ Loại chỉ có ${POS_WORDS.length}`);
  // Không trùng lặp phát sinh trong lúc nhân dữ liệu lên quy mô lớn.
  const condKeys = CONDITIONAL_SITUATIONS.map((s) => `${s.ifPresent}|${s.resultWill}`);
  assert.equal(new Set(condKeys).size, condKeys.length);
  const sbEn = SENTENCE_BUILDER_POOL.map((x) => x.en);
  assert.equal(new Set(sbEn).size, sbEn.length);
  const passiveCombos = PASSIVE_SCENARIOS.map((s) => `${s.agentNoun}|${s.objectNoun}|${s.base}`);
  assert.equal(new Set(passiveCombos).size, passiveCombos.length);
  const repKeys = ['correct', 'noBackshift', 'wrongPronoun', 'wrongReportingVerb'];
  for (const k of repKeys) {
    const vals = REPORTED_SPEECH_SCENARIOS.map((s) => s[k]);
    assert.equal(new Set(vals).size, vals.length, `trùng câu "${k}"`);
  }
  const qWords = QUANTIFIER_NOUNS.map((n) => n.plural);
  const qEmojis = QUANTIFIER_NOUNS.map((n) => n.emoji);
  assert.equal(new Set(qWords).size, qWords.length);
  assert.equal(new Set(qEmojis).size, qEmojis.length);
  const posSentences = POS_WORDS.map((w) => w.sentence);
  assert.equal(new Set(posSentences).size, posSentences.length);
});

check('bổ sung dữ liệu vòng 12: áp chuẩn >=700 câu hỏi/từ vựng cho 7/8 trò (yêu cầu mới nhất của user)', () => {
  assert.ok(GOING_TO_WILL_QUESTION_COUNT >= 700, `Going To vs Will chỉ có ${GOING_TO_WILL_QUESTION_COUNT}`);
  assert.ok(MODAL_SITUATIONS.length * MODAL_SUBJECTS.length >= 700);
  assert.ok(CONDITIONAL_SITUATIONS.length >= 700, `Câu Điều Kiện chỉ có ${CONDITIONAL_SITUATIONS.length}`);
  assert.ok(SENTENCE_BUILDER_POOL.length >= 700, `Ghép Câu chỉ có ${SENTENCE_BUILDER_POOL.length}`);
  assert.ok(PASSIVE_SCENARIOS.length * PASSIVE_TENSES.length >= 700);
  assert.ok(REPORTED_SPEECH_SCENARIOS.length >= 700, `Lời Nói Gián Tiếp chỉ có ${REPORTED_SPEECH_SCENARIOS.length}`);
  assert.ok(QUANTIFIER_NOUNS.length >= 700, `Lượng Từ Đúng chỉ có ${QUANTIFIER_NOUNS.length}`);
  // Nhận Biết Từ Loại mới tăng 220->340 đợt này, CHƯA đạt 700 — ghi nhận trung thực.
  assert.ok(POS_WORDS.length >= 300, `Nhận Biết Từ Loại chỉ có ${POS_WORDS.length}`);
});

check('bổ sung dữ liệu vòng 13: Nhận Biết Từ Loại 340->700 câu, đạt chuẩn 8/8 trò (yêu cầu tiếp theo của user)', () => {
  // Mốc 700 đã đạt ở vòng này rồi tiếp tục tăng thêm ở vòng 14 (mục tiêu 850)
  // nên chỉ còn kiểm tra ">=700" (không còn "===700") để không bị lỗi thời.
  assert.ok(POS_WORDS.length >= 700, `Nhận Biết Từ Loại kỳ vọng >=700, hiện có ${POS_WORDS.length}`);
  const byPos = {};
  for (const w of POS_WORDS) byPos[w.pos] = (byPos[w.pos] || 0) + 1;
  for (const cat of POS_CATEGORIES) {
    assert.ok(byPos[cat.id] >= 80, `từ loại "${cat.id}" chỉ có ${byPos[cat.id] || 0} câu`);
  }
  const posSentences2 = POS_WORDS.map((w) => w.sentence);
  assert.equal(new Set(posSentences2).size, posSentences2.length, 'có câu bị trùng lặp');
  for (const w of POS_WORDS) {
    assert.ok(w.sentence.includes(w.word), `từ "${w.word}" không nằm trong câu "${w.sentence}"`);
  }
  // Chống tái diễn lỗi "base === pp" (vd "cut/cut/cut") khiến câu đúng/sai
  // của Chủ Động Bị Động trùng nhau — quét nhiều vòng ngẫu nhiên để chắc
  // chắn bắt được cả những scenario base===pp nếu random rơi trúng.
  const rngCheck = seeded(777);
  for (let i = 0; i < 300; i++) {
    const round = makePassiveRound(rngCheck);
    const sentences = round.options.map((o) => o.sentence);
    assert.equal(new Set(sentences).size, 4, `câu trùng nhau (scenario base===pp?): ${JSON.stringify(sentences)}`);
  }
  // Không trùng lặp phát sinh trong lúc nhân dữ liệu lên quy mô lớn hơn.
  const condKeys = CONDITIONAL_SITUATIONS.map((s) => `${s.ifPresent}|${s.resultWill}`);
  assert.equal(new Set(condKeys).size, condKeys.length);
  const sbEn = SENTENCE_BUILDER_POOL.map((x) => x.en);
  assert.equal(new Set(sbEn).size, sbEn.length);
  const passiveCombos = PASSIVE_SCENARIOS.map((s) => `${s.agentNoun}|${s.objectNoun}|${s.base}`);
  assert.equal(new Set(passiveCombos).size, passiveCombos.length);
  const repKeys = ['correct', 'noBackshift', 'wrongPronoun', 'wrongReportingVerb'];
  for (const k of repKeys) {
    const vals = REPORTED_SPEECH_SCENARIOS.map((s) => s[k]);
    assert.equal(new Set(vals).size, vals.length, `trùng câu "${k}"`);
  }
  const qWords = QUANTIFIER_NOUNS.map((n) => n.plural);
  const qEmojis = QUANTIFIER_NOUNS.map((n) => n.emoji);
  assert.equal(new Set(qWords).size, qWords.length);
  assert.equal(new Set(qEmojis).size, qEmojis.length);
  const posSentences = POS_WORDS.map((w) => w.sentence);
  assert.equal(new Set(posSentences).size, posSentences.length);
  const goingToVerbs = GOING_TO_WILL_SCENARIOS.map((s) => s.verb);
  assert.equal(new Set(goingToVerbs).size, goingToVerbs.length);
  const modalVerbs = MODAL_SITUATIONS.map((s) => s.verb);
  assert.equal(new Set(modalVerbs).size, modalVerbs.length);
});

check('bổ sung dữ liệu vòng 14: áp chuẩn >=850 câu hỏi/từ vựng cho 8/8 trò (yêu cầu "tiếp tục mục tiêu 850" của user)', () => {
  assert.ok(GOING_TO_WILL_QUESTION_COUNT >= 850, `Going To vs Will chỉ có ${GOING_TO_WILL_QUESTION_COUNT}`);
  assert.ok(MODAL_SITUATIONS.length * MODAL_SUBJECTS.length >= 850, `Modal chỉ có ${MODAL_SITUATIONS.length * MODAL_SUBJECTS.length}`);
  assert.ok(CONDITIONAL_SITUATIONS.length >= 850, `Câu Điều Kiện chỉ có ${CONDITIONAL_SITUATIONS.length}`);
  assert.ok(SENTENCE_BUILDER_POOL.length >= 850, `Ghép Câu chỉ có ${SENTENCE_BUILDER_POOL.length}`);
  assert.ok(PASSIVE_SCENARIOS.length * PASSIVE_TENSES.length >= 850, `Bị Động chỉ có ${PASSIVE_SCENARIOS.length * PASSIVE_TENSES.length}`);
  assert.ok(REPORTED_SPEECH_SCENARIOS.length >= 850, `Lời Nói Gián Tiếp chỉ có ${REPORTED_SPEECH_SCENARIOS.length}`);
  assert.ok(QUANTIFIER_NOUNS.length >= 850, `Lượng Từ Đúng chỉ có ${QUANTIFIER_NOUNS.length}`);
  assert.ok(POS_WORDS.length >= 850, `Nhận Biết Từ Loại chỉ có ${POS_WORDS.length}`);

  // Chống trùng lặp phát sinh khi nhân dữ liệu lên quy mô lớn hơn — quét lại
  // TOÀN BỘ các khoá đã kiểm tra ở vòng 12/13, áp dụng cho dữ liệu MỚI vòng 14.
  const rngCheck2 = seeded(2024);
  for (let i = 0; i < 300; i++) {
    const round = makePassiveRound(rngCheck2);
    const sentences = round.options.map((o) => o.sentence);
    assert.equal(new Set(sentences).size, 4, `câu trùng nhau (scenario base===pp?): ${JSON.stringify(sentences)}`);
  }
  const condKeys2 = CONDITIONAL_SITUATIONS.map((s) => `${s.ifPresent}|${s.resultWill}`);
  assert.equal(new Set(condKeys2).size, condKeys2.length);
  let badPair = 0;
  for (const s of CONDITIONAL_SITUATIONS) if (s.ifPresent === s.ifPast) badPair++;
  assert.equal(badPair, 0);
  const sbEn2 = SENTENCE_BUILDER_POOL.map((x) => x.en);
  assert.equal(new Set(sbEn2).size, sbEn2.length);
  let shortSentence = 0;
  for (const x of SENTENCE_BUILDER_POOL) if (x.en.replace(/\.$/, '').split(' ').length < 4) shortSentence++;
  assert.equal(shortSentence, 0);
  const passiveCombos2 = PASSIVE_SCENARIOS.map((s) => `${s.agentNoun}|${s.objectNoun}|${s.base}`);
  assert.equal(new Set(passiveCombos2).size, passiveCombos2.length);
  const repKeys2 = ['correct', 'noBackshift', 'wrongPronoun', 'wrongReportingVerb'];
  for (const k of repKeys2) {
    const vals = REPORTED_SPEECH_SCENARIOS.map((s) => s[k]);
    assert.equal(new Set(vals).size, vals.length, `trùng câu "${k}"`);
  }
  const qWords2 = QUANTIFIER_NOUNS.map((n) => n.plural);
  const qEmojis2 = QUANTIFIER_NOUNS.map((n) => n.emoji);
  assert.equal(new Set(qWords2).size, qWords2.length);
  assert.equal(new Set(qEmojis2).size, qEmojis2.length);
  const posSentences3 = POS_WORDS.map((w) => w.sentence);
  assert.equal(new Set(posSentences3).size, posSentences3.length);
  for (const w of POS_WORDS) {
    assert.ok(w.sentence.includes(w.word), `từ "${w.word}" không nằm trong câu "${w.sentence}"`);
  }
  const goingToVerbs2 = GOING_TO_WILL_SCENARIOS.map((s) => s.verb);
  assert.equal(new Set(goingToVerbs2).size, goingToVerbs2.length);
  const modalVerbs2 = MODAL_SITUATIONS.map((s) => s.verb);
  assert.equal(new Set(modalVerbs2).size, modalVerbs2.length);
});

check('bổ sung dữ liệu vòng 15: áp chuẩn >=1000 câu hỏi/từ vựng cho 8/8 trò (yêu cầu "tiếp tục mục tiêu 1000" của user)', () => {
  assert.ok(GOING_TO_WILL_QUESTION_COUNT >= 1000, `Going To vs Will chỉ có ${GOING_TO_WILL_QUESTION_COUNT}`);
  assert.ok(MODAL_SITUATIONS.length * MODAL_SUBJECTS.length >= 1000, `Modal chỉ có ${MODAL_SITUATIONS.length * MODAL_SUBJECTS.length}`);
  assert.ok(CONDITIONAL_SITUATIONS.length >= 1000, `Câu Điều Kiện chỉ có ${CONDITIONAL_SITUATIONS.length}`);
  assert.ok(SENTENCE_BUILDER_POOL.length >= 1000, `Ghép Câu chỉ có ${SENTENCE_BUILDER_POOL.length}`);
  assert.ok(PASSIVE_SCENARIOS.length * PASSIVE_TENSES.length >= 1000, `Bị Động chỉ có ${PASSIVE_SCENARIOS.length * PASSIVE_TENSES.length}`);
  assert.ok(REPORTED_SPEECH_SCENARIOS.length >= 1000, `Lời Nói Gián Tiếp chỉ có ${REPORTED_SPEECH_SCENARIOS.length}`);
  assert.ok(QUANTIFIER_NOUNS.length >= 1000, `Lượng Từ Đúng chỉ có ${QUANTIFIER_NOUNS.length}`);
  assert.ok(POS_WORDS.length >= 1000, `Nhận Biết Từ Loại chỉ có ${POS_WORDS.length}`);

  // Quét lại toàn bộ các khoá chống trùng lặp đã dùng ở vòng 12/13/14, áp
  // dụng cho dữ liệu MỚI của vòng 15 — cùng seed khác để phủ thêm trường hợp.
  const rngCheck3 = seeded(99001);
  for (let i = 0; i < 300; i++) {
    const round = makePassiveRound(rngCheck3);
    const sentences = round.options.map((o) => o.sentence);
    assert.equal(new Set(sentences).size, 4, `câu trùng nhau (scenario base===pp?): ${JSON.stringify(sentences)}`);
  }
  const condKeys3 = CONDITIONAL_SITUATIONS.map((s) => `${s.ifPresent}|${s.resultWill}`);
  assert.equal(new Set(condKeys3).size, condKeys3.length);
  let badPair2 = 0;
  for (const s of CONDITIONAL_SITUATIONS) if (s.ifPresent === s.ifPast) badPair2++;
  assert.equal(badPair2, 0);
  const sbEn3 = SENTENCE_BUILDER_POOL.map((x) => x.en);
  assert.equal(new Set(sbEn3).size, sbEn3.length);
  let shortSentence2 = 0;
  for (const x of SENTENCE_BUILDER_POOL) if (x.en.replace(/\.$/, '').split(' ').length < 4) shortSentence2++;
  assert.equal(shortSentence2, 0);
  const passiveCombos3 = PASSIVE_SCENARIOS.map((s) => `${s.agentNoun}|${s.objectNoun}|${s.base}`);
  assert.equal(new Set(passiveCombos3).size, passiveCombos3.length);
  const repKeys3 = ['correct', 'noBackshift', 'wrongPronoun', 'wrongReportingVerb'];
  for (const k of repKeys3) {
    const vals = REPORTED_SPEECH_SCENARIOS.map((s) => s[k]);
    assert.equal(new Set(vals).size, vals.length, `trùng câu "${k}"`);
  }
  const qWords3 = QUANTIFIER_NOUNS.map((n) => n.plural);
  const qEmojis3 = QUANTIFIER_NOUNS.map((n) => n.emoji);
  assert.equal(new Set(qWords3).size, qWords3.length);
  assert.equal(new Set(qEmojis3).size, qEmojis3.length);
  const posSentences4 = POS_WORDS.map((w) => w.sentence);
  assert.equal(new Set(posSentences4).size, posSentences4.length);
  for (const w of POS_WORDS) {
    assert.ok(w.sentence.includes(w.word), `từ "${w.word}" không nằm trong câu "${w.sentence}"`);
  }
  const goingToVerbs3 = GOING_TO_WILL_SCENARIOS.map((s) => s.verb);
  assert.equal(new Set(goingToVerbs3).size, goingToVerbs3.length);
  const modalVerbs3 = MODAL_SITUATIONS.map((s) => s.verb);
  assert.equal(new Set(modalVerbs3).size, modalVerbs3.length);
});

console.log(`\n${passed} passed`);
