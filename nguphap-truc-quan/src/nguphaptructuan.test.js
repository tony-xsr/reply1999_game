import assert from 'node:assert/strict';
import {
  CHARACTERS, VERBS, TENSES,
  makeTimeMachineRound, makeTimeMachineGame, currentTimeMachineRound, answerTimeMachine,
  makeTwoActionsRound, makeTwoActionsGame, currentTwoActionsRound, answerTwoActions,
  COMPARE_ENTITIES, ATTRIBUTES,
  makeComparativeGameRound, makeComparativeGame, currentComparativeRound, answerComparative,
  GOING_TO_WILL_SCENARIOS,
  makeGoingToWillRound, makeGoingToWillGame, currentGoingToWillRound, answerGoingToWill,
  MODALS, MODAL_SITUATIONS,
  makeModalRound, makeModalGame, currentModalRound, answerModal,
  CONDITIONAL_SITUATIONS,
  makeConditionalRound, makeConditionalGame, currentConditionalRound, answerConditional,
  SENTENCE_BUILDER_POOL,
  makeSentenceBuilderRound, makeSentenceBuilderGame, currentSentenceBuilderRound, tapSentenceBuilderChip,
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

check('có đủ 6 thì và mỗi thì có id/label/cue/timelineMark/build hợp lệ', () => {
  assert.equal(TENSES.length, 6);
  const ids = new Set(TENSES.map((t) => t.id));
  assert.equal(ids.size, 6);
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
    assert.match(correctOpt.sentence, /^While (I|He|She) was .+, .+ (rang|went out|flew in)\.$/);
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
    const subj = round.scenario.subject;
    if (subj === 'I') assert.match(opt.sentence, /^I am going to /);
    else if (subj === 'We' || subj === 'They') assert.match(opt.sentence, new RegExp(`^${subj} are going to `));
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

console.log(`\n${passed} passed`);
