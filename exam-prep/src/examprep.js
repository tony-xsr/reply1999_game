// Luyện Thi Cambridge — engine logic THUẦN (không đụng DOM), dùng chung cho
// mọi cấp độ hiện có (Movers/Flyers) và các cấp sẽ thêm sau (KET/PET/TOEFL
// Junior/TOEIC — chỉ cần thêm 1 mảng UNITS mới trong units.js rồi đăng ký vào
// UNITS_BY_LEVEL bên dưới, không phải sửa engine).
//
// Luật chọn-lại giống hệt `nghe-doan-on-tap/src/ontap.js` (đã kiểm thử kỹ,
// quen thuộc với bé từ các game khác): sai lần ĐẦU được gợi ý chọn lại (câu
// chưa qua), đúng sau gợi ý vẫn có điểm (ít hơn, không tính chuỗi), sai lần 2
// mới lộ đáp án rồi qua câu mới.

import {
  STARTERS_UNITS, MOVERS_UNITS, FLYERS_UNITS, KET_UNITS, PET_UNITS, TOEFL_JUNIOR_UNITS, TOEIC_UNITS,
} from './units.js';

export const LEVELS = [
  { id: 'starters', label: 'Starters (tiền A1)', icon: '🔰' },
  { id: 'movers', label: 'Movers (A1)', icon: '🥉' },
  { id: 'flyers', label: 'Flyers (A2)', icon: '🥈' },
  { id: 'ket', label: 'KET (A2 Key)', icon: '🎫' },
  { id: 'pet', label: 'PET (B1 Preliminary)', icon: '🏅' },
  { id: 'toefl-junior', label: 'TOEFL Junior (>800/900)', icon: '📘' },
  { id: 'toeic', label: 'TOEIC (800/990)', icon: '💼' },
];

const UNITS_BY_LEVEL = {
  starters: STARTERS_UNITS,
  movers: MOVERS_UNITS,
  flyers: FLYERS_UNITS,
  ket: KET_UNITS,
  pet: PET_UNITS,
  'toefl-junior': TOEFL_JUNIOR_UNITS,
  toeic: TOEIC_UNITS,
};

export function unitsForLevel(levelId) {
  return UNITS_BY_LEVEL[levelId] || [];
}

export function unitById(unitId) {
  for (const units of Object.values(UNITS_BY_LEVEL)) {
    const u = units.find((x) => x.id === unitId);
    if (u) return u;
  }
  return null;
}

/** Toàn bộ câu hỏi của 1 cấp độ, gắn kèm unitId/unitTopic/unitPassage để hiển thị. */
export function allQuestions(levelId) {
  return unitsForLevel(levelId).flatMap((u) => u.questions.map((q) => (
    { ...q, unitId: u.id, unitTopic: u.topic, unitPassage: u.passage }
  )));
}

function shuffle(arr, rng) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Chọn `count` câu KHÔNG TRÙNG từ `pool`, ưu tiên câu có trong sổ "cần ôn"
 * (trọng số cao hơn hẳn) nhưng vẫn luôn có khả năng ra câu HOÀN TOÀN NGẪU
 * NHIÊN (trọng số nền = 1, không bao giờ về 0) — đúng yêu cầu "câu hỏi xuất
 * hiện ngẫu nhiên" đồng thời "tăng xác suất lặp lại câu hay sai".
 */
export function pickQuestions(pool, count, missMap = {}, rng = Math.random) {
  if (!pool.length) return [];
  const weighted = pool.map((q) => ({ q, w: 1 + (missMap[q.id] || 0) * 3 }));
  const used = new Set();
  const chosen = [];
  const total = Math.min(count, pool.length);
  while (chosen.length < total) {
    const avail = weighted.filter((x) => !used.has(x.q.id));
    if (!avail.length) break;
    const totalW = avail.reduce((s, x) => s + x.w, 0);
    let r = rng() * totalW;
    let pick = avail[avail.length - 1].q;
    for (const x of avail) {
      r -= x.w;
      if (r <= 0) { pick = x.q; break; }
    }
    used.add(pick.id);
    chosen.push(pick);
  }
  return chosen;
}

/**
 * Khởi tạo 1 ván luyện tập. `unitId` = luyện đúng 1 unit; bỏ trống/`null` =
 * luyện ngẫu nhiên trộn TOÀN BỘ unit của `levelId` (ưu tiên câu cần ôn).
 */
export function makeQuiz(levelId, unitId, missMap = {}, rng = Math.random, count = 8) {
  const pool = unitId
    ? (unitById(unitId)?.questions.map((q) => ({ ...q, unitId, unitPassage: unitById(unitId)?.passage })) || [])
    : allQuestions(levelId);
  const questions = pickQuestions(pool, count, missMap, rng);
  return {
    levelId,
    unitId: unitId || null,
    questions,
    index: 0,
    score: 0,
    streak: 0,
    bestStreak: 0,
    correctCount: 0,
    over: false,
    won: false,
  };
}

export function currentQuestion(quiz) {
  return quiz.questions[quiz.index];
}

/**
 * Bé chọn đáp án `optionIndex` cho câu hiện tại. Trả về sự kiện mô tả kết quả
 * — không throw, không làm gì nếu ván đã xong hoặc hết câu.
 */
export function answerQuiz(quiz, optionIndex) {
  const ev = {
    correct: false, retry: false, gain: 0, streakBonus: 0, roundDone: false, quizDone: false, won: false,
  };
  if (quiz.over) return ev;
  const q = currentQuestion(quiz);
  if (!q) return ev;

  if (optionIndex === q.answer) {
    ev.correct = true;
    quiz.correctCount++;
    if (q.retried) {
      quiz.score += 5;
      ev.gain = 5;
    } else {
      quiz.streak++;
      quiz.bestStreak = Math.max(quiz.bestStreak, quiz.streak);
      let gain = 10;
      if (quiz.streak > 0 && quiz.streak % 3 === 0) {
        gain += 10;
        ev.streakBonus = 10;
      }
      quiz.score += gain;
      ev.gain = gain;
    }
  } else if (!q.retried) {
    q.retried = true;
    quiz.streak = 0;
    ev.retry = true;
    return ev;
  }

  ev.roundDone = true;
  quiz.index++;
  if (quiz.index >= quiz.questions.length) {
    quiz.over = true;
    quiz.won = quiz.correctCount >= Math.ceil(quiz.questions.length * 0.6);
    ev.quizDone = true;
    ev.won = quiz.won;
  }
  return ev;
}

/* ===== "Luyện Thi" — đề mô phỏng thi thật: trộn NGẪU NHIÊN toàn bộ unit của
   1 cấp độ, MỘT LẦN TRẢ LỜI DUY NHẤT cho mỗi câu (không có gợi ý/chọn lại,
   đúng cảm giác áp lực phòng thi thật) rồi cho báo cáo điểm yếu theo topic
   cuối bài để bé biết nên quay lại "Học" unit nào. ===== */

/** Khởi tạo 1 đề luyện thi: trộn toàn bộ unit của `levelId`, không giới hạn 1 unit. */
export function makeMockTest(levelId, missMap = {}, rng = Math.random, count = 15) {
  const quiz = makeQuiz(levelId, null, missMap, rng, count);
  quiz.mock = true;
  quiz.wrongTopics = [];
  return quiz;
}

/**
 * Trả lời trong chế độ "Luyện Thi": ĐÚNG NGAY LẦN DUY NHẤT mới tính điểm —
 * không có cơ chế gợi ý/chọn lại. Dù đúng hay sai, câu luôn qua ngay.
 */
export function answerMockTest(quiz, optionIndex) {
  const ev = {
    correct: false, gain: 0, streakBonus: 0, roundDone: false, quizDone: false, won: false,
  };
  if (quiz.over) return ev;
  const q = currentQuestion(quiz);
  if (!q) return ev;

  if (optionIndex === q.answer) {
    ev.correct = true;
    quiz.correctCount++;
    quiz.streak++;
    quiz.bestStreak = Math.max(quiz.bestStreak, quiz.streak);
    let gain = 10;
    if (quiz.streak > 0 && quiz.streak % 3 === 0) {
      gain += 10;
      ev.streakBonus = 10;
    }
    quiz.score += gain;
    ev.gain = gain;
  } else {
    quiz.streak = 0;
    quiz.wrongTopics.push(q.unitTopic || unitById(q.unitId)?.topic || '');
  }

  ev.roundDone = true;
  quiz.index++;
  if (quiz.index >= quiz.questions.length) {
    quiz.over = true;
    quiz.won = quiz.correctCount >= Math.ceil(quiz.questions.length * 0.6);
    ev.quizDone = true;
    ev.won = quiz.won;
  }
  return ev;
}

/**
 * Báo cáo cuối đề luyện thi: điểm, số câu đúng, và các CHỦ ĐIỂM (topic) sai
 * nhiều nhất — sắp giảm dần để bé biết nên ôn "Học" unit nào trước.
 */
export function mockTestReport(quiz) {
  const counts = {};
  for (const topic of quiz.wrongTopics) {
    if (!topic) continue;
    counts[topic] = (counts[topic] || 0) + 1;
  }
  const weakTopics = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([topic, count]) => ({ topic, count }));
  return {
    score: quiz.score,
    correctCount: quiz.correctCount,
    total: quiz.questions.length,
    percent: Math.round((quiz.correctCount / quiz.questions.length) * 100),
    weakTopics,
  };
}
