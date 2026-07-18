import assert from 'node:assert/strict';
import {
  LEVELS, unitsForLevel, unitById, allQuestions, pickQuestions, makeQuiz, currentQuestion, answerQuiz,
  makeMockTest, answerMockTest, mockTestReport,
} from './examprep.js';
import {
  STARTERS_UNITS, MOVERS_UNITS, FLYERS_UNITS, KET_UNITS, PET_UNITS, TOEFL_JUNIOR_UNITS, TOEIC_UNITS,
} from './units.js';
import { _setStorage, recordMiss, recordHit, missMap, missedQuestionIds, missCount } from './misses.js';

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

/* ===== units.js: cấu trúc dữ liệu ===== */

check('có đúng 5 unit Starters, 11 unit Movers, 11 unit Flyers, 6 unit KET, 8 unit PET, 9 unit TOEFL Junior và 7 unit TOEIC', () => {
  assert.equal(STARTERS_UNITS.length, 5);
  assert.equal(MOVERS_UNITS.length, 11);
  assert.equal(FLYERS_UNITS.length, 11);
  assert.equal(KET_UNITS.length, 6);
  assert.equal(PET_UNITS.length, 8);
  assert.equal(TOEFL_JUNIOR_UNITS.length, 9);
  assert.equal(TOEIC_UNITS.length, 7);
});

check('unit "toeic-message-chain" có passage hợp lệ (chuỗi tin nhắn), câu hỏi type "reading" không cần chỗ trống', () => {
  const unit = TOEIC_UNITS.find((u) => u.id === 'toeic-message-chain');
  assert.ok(unit, 'thiếu unit toeic-message-chain');
  assert.ok(unit.passage && unit.passage.title && unit.passage.text, 'thiếu passage.title/text');
  assert.ok(unit.questions.every((q) => q.type === 'reading'));
});

check('unit "toefl-junior-reading" có passage hợp lệ + câu hỏi "closest in meaning to" (từ vựng theo văn cảnh)', () => {
  const unit = TOEFL_JUNIOR_UNITS.find((u) => u.id === 'toefl-junior-reading');
  assert.ok(unit, 'thiếu unit toefl-junior-reading');
  assert.ok(unit.passage && unit.passage.title && unit.passage.text, 'thiếu passage.title/text');
  assert.ok(unit.passage.text.length > 100, 'đoạn văn quá ngắn');
  assert.ok(unit.questions.every((q) => q.type === 'reading'));
  assert.ok(unit.questions.some((q) => q.prompt.includes('closest in meaning to')), 'thiếu câu hỏi từ vựng theo văn cảnh');
});

check('unit "pet-cloze-passage" có passage hợp lệ, mọi câu vẫn có chỗ trống ("___") dù đi kèm đoạn văn', () => {
  const unit = PET_UNITS.find((u) => u.id === 'pet-cloze-passage');
  assert.ok(unit, 'thiếu unit pet-cloze-passage');
  assert.ok(unit.passage && unit.passage.title && unit.passage.text, 'thiếu passage.title/text');
  assert.ok(unit.passage.text.length > 100, 'đoạn văn quá ngắn');
  for (const q of unit.questions) {
    assert.ok(q.prompt.includes('___'), `${q.id} thiếu chỗ trống`);
  }
});

check('unit "pet-rewrite-sentences" có type "rewrite", prompt luôn có mũi tên "→ ___" (câu gốc + chỗ trống cho câu viết lại)', () => {
  const unit = PET_UNITS.find((u) => u.id === 'pet-rewrite-sentences');
  assert.ok(unit, 'thiếu unit pet-rewrite-sentences');
  for (const q of unit.questions) {
    assert.equal(q.type, 'rewrite');
    assert.ok(q.prompt.includes('→ ___'), `${q.id} thiếu mũi tên/chỗ trống`);
  }
});

check('unit "ket-reading-comprehension" có passage hợp lệ, câu hỏi type "reading" không cần chỗ trống', () => {
  const unit = KET_UNITS.find((u) => u.id === 'ket-reading-comprehension');
  assert.ok(unit, 'thiếu unit ket-reading-comprehension');
  assert.ok(unit.passage && unit.passage.title && unit.passage.text, 'thiếu passage.title/text');
  assert.ok(unit.passage.text.length > 100, 'đoạn văn quá ngắn');
  for (const q of unit.questions) {
    assert.equal(q.type, 'reading');
    assert.ok(!q.prompt.includes('___'), `${q.id} là câu đọc hiểu không nên có chỗ trống`);
  }
});

check('mọi unit có nội dung "lesson" (Học) trước khi luyện tập', () => {
  for (const u of [...STARTERS_UNITS, ...MOVERS_UNITS, ...FLYERS_UNITS, ...KET_UNITS, ...PET_UNITS, ...TOEFL_JUNIOR_UNITS, ...TOEIC_UNITS]) {
    assert.ok(u.lesson && u.lesson.intro, `${u.id} thiếu lesson.intro`);
    assert.ok(Array.isArray(u.lesson.points) && u.lesson.points.length > 0, `${u.id} thiếu lesson.points`);
    for (const p of u.lesson.points) {
      assert.ok(p.rule, `${u.id} có point thiếu rule`);
      assert.ok(Array.isArray(p.examples) && p.examples.length > 0, `${u.id} có point thiếu examples`);
    }
  }
});

check('mọi unit có level đúng, topic, grammarPoints, vocab, questions không rỗng', () => {
  for (const u of [...STARTERS_UNITS, ...MOVERS_UNITS, ...FLYERS_UNITS, ...KET_UNITS, ...PET_UNITS, ...TOEFL_JUNIOR_UNITS, ...TOEIC_UNITS]) {
    assert.ok(u.id && u.topic, `unit thiếu id/topic: ${JSON.stringify(u)}`);
    assert.ok(['starters', 'movers', 'flyers', 'ket', 'pet', 'toefl-junior', 'toeic'].includes(u.level), `level lạ: ${u.level}`);
    assert.ok(Array.isArray(u.grammarPoints) && u.grammarPoints.length > 0, `${u.id} thiếu grammarPoints`);
    assert.ok(Array.isArray(u.vocab) && u.vocab.length > 0, `${u.id} thiếu vocab`);
    assert.ok(Array.isArray(u.questions) && u.questions.length >= 6, `${u.id} thiếu câu hỏi`);
  }
});

check('mọi câu hỏi có id duy nhất toàn hệ thống, answer hợp lệ, options >= 3 (câu grammar/vocab có chỗ trống, câu reading thì không cần)', () => {
  const allUnits = [...STARTERS_UNITS, ...MOVERS_UNITS, ...FLYERS_UNITS, ...KET_UNITS, ...PET_UNITS, ...TOEFL_JUNIOR_UNITS, ...TOEIC_UNITS];
  const ids = new Set();
  for (const u of allUnits) {
    for (const q of u.questions) {
      assert.ok(!ids.has(q.id), `id câu hỏi trùng: ${q.id}`);
      ids.add(q.id);
      if (q.type !== 'reading') assert.ok(q.prompt.includes('___'), `${q.id} thiếu chỗ trống trong câu`);
      assert.ok(q.options.length >= 3, `${q.id} thiếu lựa chọn`);
      assert.ok(q.answer >= 0 && q.answer < q.options.length, `${q.id} answer ngoài phạm vi`);
      assert.ok(q.explain && q.explain.length > 0, `${q.id} thiếu giải thích`);
    }
  }
  assert.ok(ids.size >= 560, `tổng số câu hỏi quá ít: ${ids.size}`);
});

/* ===== examprep.js: engine thuần ===== */

check('LEVELS có Starters, Movers, Flyers, KET, PET, TOEFL Junior và TOEIC', () => {
  const ids = LEVELS.map((l) => l.id);
  assert.deepEqual(ids, ['starters', 'movers', 'flyers', 'ket', 'pet', 'toefl-junior', 'toeic']);
});

check('unitsForLevel trả đúng bộ unit từng cấp, cấp lạ trả mảng rỗng', () => {
  assert.equal(unitsForLevel('starters').length, 5);
  assert.equal(unitsForLevel('movers').length, 11);
  assert.equal(unitsForLevel('flyers').length, 11);
  assert.equal(unitsForLevel('ket').length, 6);
  assert.equal(unitsForLevel('pet').length, 8);
  assert.equal(unitsForLevel('toefl-junior').length, 9);
  assert.equal(unitsForLevel('toeic').length, 7);
  assert.deepEqual(unitsForLevel('ielts'), []);
});

check('unitById tìm đúng unit ở cả 2 cấp, id lạ trả null', () => {
  assert.equal(unitById('movers-present-simple').topic, 'Thì Hiện Tại Đơn');
  assert.equal(unitById('flyers-past-continuous').level, 'flyers');
  assert.equal(unitById('khong-ton-tai'), null);
});

check('allQuestions gộp đủ câu hỏi của 1 cấp, gắn kèm unitId', () => {
  const qs = allQuestions('movers');
  const total = MOVERS_UNITS.reduce((s, u) => s + u.questions.length, 0);
  assert.equal(qs.length, total);
  assert.ok(qs.every((q) => typeof q.unitId === 'string'));
});

check('allQuestions gắn đúng unitPassage cho câu reading, không gắn cho unit không có passage', () => {
  const qs = allQuestions('ket');
  const readingQs = qs.filter((q) => q.type === 'reading');
  assert.ok(readingQs.length > 0, 'phải có câu reading ở KET');
  for (const q of readingQs) {
    assert.ok(q.unitPassage && q.unitPassage.title && q.unitPassage.text, `${q.id} thiếu unitPassage`);
  }
  const nonReadingQs = qs.filter((q) => q.type !== 'reading');
  assert.ok(nonReadingQs.every((q) => q.unitPassage === undefined), 'unit không có passage thì không nên gắn unitPassage');
});

check('makeQuiz theo unit "ket-reading-comprehension" cũng gắn đúng unitPassage cho từng câu', () => {
  const quiz = makeQuiz('ket', 'ket-reading-comprehension', {}, seeded(1), 6);
  assert.ok(quiz.questions.every((q) => q.unitPassage && q.unitPassage.title));
});

check('pickQuestions không lấy trùng câu, đúng số lượng yêu cầu (hoặc hết pool)', () => {
  const pool = allQuestions('flyers');
  const rng = seeded(7);
  const picked = pickQuestions(pool, 10, {}, rng);
  assert.equal(picked.length, 10);
  assert.equal(new Set(picked.map((q) => q.id)).size, 10);
});

check('pickQuestions trả về ít hơn count nếu pool nhỏ hơn', () => {
  const pool = allQuestions('movers').slice(0, 3);
  const picked = pickQuestions(pool, 10, {}, seeded(3));
  assert.equal(picked.length, 3);
});

check('pickQuestions ưu tiên rõ rệt câu có điểm "cần ôn" cao hơn (thống kê qua nhiều lần chọn)', () => {
  const pool = allQuestions('movers').slice(0, 4); // 4 câu, mỗi lần chỉ chọn 1
  const hotId = pool[0].id;
  const missM = { [hotId]: 20 }; // trọng số hotId = 61, còn lại = 1 mỗi câu
  const rng = seeded(1234); // 1 bộ sinh số liên tục (KHÔNG re-seed mỗi lần — seed liền kề của LCG tương quan cao, gây méo thống kê)
  let hotCount = 0;
  const N = 300;
  for (let i = 0; i < N; i++) {
    const [picked] = pickQuestions(pool, 1, missM, rng);
    if (picked.id === hotId) hotCount++;
  }
  // Kỳ vọng lý thuyết ~61/64 ≈ 95% — cho biên độ rộng để tránh test không ổn định.
  assert.ok(hotCount > N * 0.7, `câu "cần ôn" chỉ được chọn ${hotCount}/${N} lần, kỳ vọng ưu tiên rõ rệt hơn`);
});

check('pickQuestions vẫn có thể ra câu khác ngoài "cần ôn" (không loại bỏ hoàn toàn tính ngẫu nhiên)', () => {
  const pool = allQuestions('movers').slice(0, 4);
  const hotId = pool[0].id;
  const missM = { [hotId]: 20 };
  const rng = seeded(4321);
  const others = new Set();
  for (let i = 0; i < 200; i++) {
    const [picked] = pickQuestions(pool, 1, missM, rng);
    if (picked.id !== hotId) others.add(picked.id);
  }
  assert.ok(others.size > 0, 'câu không "cần ôn" không bao giờ xuất hiện — mất tính ngẫu nhiên');
});

check('makeQuiz theo 1 unit cụ thể chỉ lấy câu của unit đó', () => {
  const quiz = makeQuiz('movers', 'movers-present-simple', {}, seeded(5), 6);
  assert.equal(quiz.questions.length, 6);
  assert.ok(quiz.questions.every((q) => q.unitId === 'movers-present-simple'));
});

check('makeQuiz không truyền unitId trộn toàn bộ unit của cấp', () => {
  const quiz = makeQuiz('flyers', null, {}, seeded(9), 8);
  const unitIds = new Set(quiz.questions.map((q) => q.unitId));
  assert.ok(unitIds.size >= 1);
  assert.equal(quiz.questions.length, 8);
});

check('answerQuiz: đúng ngay lần đầu +10 điểm, qua câu, tăng streak', () => {
  const quiz = makeQuiz('movers', 'movers-present-simple', {}, seeded(1), 3);
  const q = currentQuestion(quiz);
  const ev = answerQuiz(quiz, q.answer);
  assert.equal(ev.correct, true);
  assert.equal(ev.gain, 10);
  assert.equal(ev.retry, false);
  assert.equal(quiz.score, 10);
  assert.equal(quiz.streak, 1);
  assert.equal(quiz.index, 1);
});

check('answerQuiz: sai lần đầu -> retry = true, câu KHÔNG qua, streak về 0', () => {
  const quiz = makeQuiz('movers', 'movers-present-simple', {}, seeded(1), 3);
  const q = currentQuestion(quiz);
  quiz.streak = 5;
  const wrongIndex = (q.answer + 1) % q.options.length;
  const ev = answerQuiz(quiz, wrongIndex);
  assert.equal(ev.retry, true);
  assert.equal(ev.roundDone, false);
  assert.equal(quiz.index, 0); // vẫn ở câu cũ
  assert.equal(quiz.streak, 0);
});

check('answerQuiz: đúng SAU khi được gợi ý (retry) chỉ được +5, không tính streak', () => {
  const quiz = makeQuiz('movers', 'movers-present-simple', {}, seeded(1), 3);
  const q = currentQuestion(quiz);
  const wrongIndex = (q.answer + 1) % q.options.length;
  answerQuiz(quiz, wrongIndex); // sai lần 1 -> retry
  const ev = answerQuiz(quiz, q.answer); // đúng sau gợi ý
  assert.equal(ev.correct, true);
  assert.equal(ev.gain, 5);
  assert.equal(quiz.score, 5);
  assert.equal(quiz.streak, 0);
  assert.equal(quiz.index, 1);
});

check('answerQuiz: sai lần 2 liên tiếp thì qua câu luôn (đáp án lộ ra ngoài)', () => {
  const quiz = makeQuiz('movers', 'movers-present-simple', {}, seeded(1), 3);
  const q = currentQuestion(quiz);
  const wrongIndex = (q.answer + 1) % q.options.length;
  answerQuiz(quiz, wrongIndex); // sai lần 1 -> retry
  const ev = answerQuiz(quiz, wrongIndex); // sai lần 2
  assert.equal(ev.correct, false);
  assert.equal(ev.roundDone, true);
  assert.equal(quiz.index, 1);
});

check('quiz kết thúc đúng lúc hết câu, won khi đúng >= 60%', () => {
  const quiz = makeQuiz('movers', 'movers-present-simple', {}, seeded(1), 3);
  for (let i = 0; i < 3; i++) {
    const q = currentQuestion(quiz);
    answerQuiz(quiz, q.answer);
  }
  assert.equal(quiz.over, true);
  assert.equal(quiz.won, true);
  assert.equal(quiz.correctCount, 3);
});

check('answerQuiz không làm gì khi quiz đã over', () => {
  const quiz = makeQuiz('movers', 'movers-present-simple', {}, seeded(1), 1);
  const q = currentQuestion(quiz);
  answerQuiz(quiz, q.answer);
  assert.equal(quiz.over, true);
  const ev = answerQuiz(quiz, 0);
  assert.deepEqual(ev, {
    correct: false, retry: false, gain: 0, streakBonus: 0, roundDone: false, quizDone: false, won: false,
  });
});

/* ===== makeMockTest/answerMockTest/mockTestReport: chế độ "Luyện Thi" ===== */

check('makeMockTest trộn toàn bộ unit của 1 cấp, không giới hạn 1 unit', () => {
  const test = makeMockTest('flyers', {}, seeded(11), 15);
  assert.equal(test.mock, true);
  assert.equal(test.questions.length, 15);
  assert.deepEqual(test.wrongTopics, []);
});

check('answerMockTest: đúng thì +10 và qua câu NGAY (không có retry)', () => {
  const test = makeMockTest('movers', {}, seeded(2), 5);
  const q = currentQuestion(test);
  const ev = answerMockTest(test, q.answer);
  assert.equal(ev.correct, true);
  assert.equal(ev.gain, 10);
  assert.equal(ev.roundDone, true);
  assert.equal(test.index, 1);
});

check('answerMockTest: sai thì KHÔNG có cơ hội chọn lại — qua câu ngay và ghi nhận topic sai', () => {
  const test = makeMockTest('movers', {}, seeded(2), 5);
  const q = currentQuestion(test);
  const wrongIndex = (q.answer + 1) % q.options.length;
  const ev = answerMockTest(test, wrongIndex);
  assert.equal(ev.correct, false);
  assert.equal(ev.roundDone, true); // khác answerQuiz: không có ev.retry
  assert.equal(test.index, 1);
  assert.equal(test.wrongTopics.length, 1);
});

check('answerMockTest không làm gì khi đề đã kết thúc', () => {
  const test = makeMockTest('movers', {}, seeded(2), 1);
  const q = currentQuestion(test);
  answerMockTest(test, q.answer);
  assert.equal(test.over, true);
  const ev = answerMockTest(test, 0);
  assert.deepEqual(ev, {
    correct: false, gain: 0, streakBonus: 0, roundDone: false, quizDone: false, won: false,
  });
});

check('mockTestReport tổng hợp điểm + phần trăm đúng + chủ điểm sai nhiều nhất', () => {
  const test = makeMockTest('movers', {}, seeded(5), 4);
  // Cố tình trả lời sai câu 1 và 2 (cùng 1 unit lặp lại nếu trùng), đúng câu 3 và 4.
  for (let i = 0; i < 4; i++) {
    const q = currentQuestion(test);
    if (i < 2) answerMockTest(test, (q.answer + 1) % q.options.length);
    else answerMockTest(test, q.answer);
  }
  const report = mockTestReport(test);
  assert.equal(report.total, 4);
  assert.equal(report.correctCount, 2);
  assert.equal(report.percent, 50);
  assert.ok(report.weakTopics.length >= 1);
  assert.ok(report.weakTopics[0].count >= 1);
});

/* ===== misses.js: sổ "câu hay sai" khoá theo questionId ===== */

check('recordMiss/recordHit cộng trừ đúng, đúng đủ nhiều lần thì ra khỏi sổ', () => {
  _setStorage(fakeStorage());
  recordMiss('q1');
  recordMiss('q1');
  assert.equal(missMap().q1, 2);
  recordHit('q1');
  assert.equal(missMap().q1, 1);
  recordHit('q1');
  assert.equal('q1' in missMap(), false);
});

check('missedQuestionIds sắp theo mức cần ôn giảm dần, missCount đúng số lượng', () => {
  _setStorage(fakeStorage());
  recordMiss('a');
  recordMiss('b'); recordMiss('b'); recordMiss('b');
  recordMiss('c'); recordMiss('c');
  assert.deepEqual(missedQuestionIds(), ['b', 'c', 'a']);
  assert.equal(missCount(), 3);
});

check('recordHit trên câu chưa từng sai thì không làm gì (không tạo điểm âm)', () => {
  _setStorage(fakeStorage());
  recordHit('never-missed');
  assert.equal('never-missed' in missMap(), false);
});

console.log(`\n${passed} passed`);
