// Điều phối Luyện Thi Cambridge (Movers & Flyers) — nay chia rõ 2 nhánh theo
// yêu cầu: "Học" (đọc bài học ngữ pháp theo unit rồi luyện tập có gợi ý khi
// sai, không tính giờ) và "Luyện Thi" (đề mô phỏng thi thật: trộn ngẫu nhiên
// toàn bộ unit của 1 cấp độ, tính giờ, mỗi câu chỉ 1 lần trả lời, có báo cáo
// chủ điểm yếu cuối đề). Cả 2 nhánh dùng chung màn "quizScreen" — chỉ khác
// engine gọi (answerQuiz có gợi ý vs answerMockTest 1 lần ăn thua) và HUD
// (đồng hồ đếm ngược chỉ hiện ở Luyện Thi).
//
// Animation minh hoạ ngữ pháp trực quan (cỗ máy thời gian, 2 hành động cùng
// lúc...) vẫn là việc của đợt sau — file này là engine luyện tập + luyện thi
// trắc nghiệm dùng chung.

import {
  LEVELS, unitsForLevel, unitById, allQuestions, makeQuiz, currentQuestion, answerQuiz,
  makeMockTest, answerMockTest, mockTestReport,
} from './examprep.js';
import { recordMiss, recordHit, missMap, missCount } from './misses.js';
import { speak, speakSequence, bindMute } from '../../to-mau/src/speech.js';
import { sfx } from '../../pokemon/src/sfx.js';
import { mountKidFeatures, answeredOne } from '../../shared/kid-bar.js';
import { currentProfile, recordSession } from '../../pokemon/src/stats.js';
import * as api from '../../shared/api.js';
import * as aiProvider from '../../shared/ai-provider.js';
import { examSessionsToday, EXAM_LEVEL_LABELS } from '../../shared/report.js';
import { buildTranslateEntryButton } from '../../shared/translate-ui.js';
import { buildGrammarQuizEntryButton } from '../../shared/grammar-quiz-ui.js';
import { buildMillionaireEntryButton } from '../../shared/millionaire-ui.js';

const t = (key, fallback) => {
  const v = window.I18N?.t(key);
  return v && v !== key ? v : fallback;
};

const $ = (id) => document.getElementById(id);
const els = {
  subLine: $('subLine'),
  levelScreen: $('levelScreen'), modeScreen: $('modeScreen'), unitScreen: $('unitScreen'),
  lessonScreen: $('lessonScreen'), mockSetupScreen: $('mockSetupScreen'), quizScreen: $('quizScreen'),
  reportScreen: $('reportScreen'),
  unitGrid: $('unitGrid'),
  lessonTopic: $('lessonTopic'), lessonIntro: $('lessonIntro'), lessonPoints: $('lessonPoints'),
  btnStartPractice: $('btnStartPractice'), btnAiExtra: $('btnAiExtra'), aiExtraMsg: $('aiExtraMsg'),
  btnGoStudy: $('btnGoStudy'), btnGoMock: $('btnGoMock'),
  btnBack: $('btnBack'), btnHelp: $('btnHelp'), btnSound: $('btnSound'), btnListen: $('btnListen'),
  hudScore: $('hudScore'), hudRound: $('hudRound'), hudStreak: $('hudStreak'),
  hudTimerWrap: $('hudTimerWrap'), hudTimer: $('hudTimer'),
  quizUnitLabel: $('quizUnitLabel'), quizPrompt: $('quizPrompt'), quizOptions: $('quizOptions'), quizExplain: $('quizExplain'),
  quizPassage: $('quizPassage'), quizPassageTitle: $('quizPassageTitle'), quizPassageText: $('quizPassageText'),
  reportScore: $('reportScore'), reportPercent: $('reportPercent'), reportWeak: $('reportWeak'),
  btnMockAgain: $('btnMockAgain'), btnStudyWeak: $('btnStudyWeak'),
  cheer: $('cheer'), cheerEmoji: $('cheerEmoji'), cheerText: $('cheerText'),
  btnAgain: $('btnAgain'), btnHome2: $('btnHome2'),
};

const state = {
  screen: 'level', history: [], level: null, mode: null, unitId: null, quiz: null,
  startedAt: Date.now(), instruction: '', busy: false, timerHandle: null,
};
bindMute(() => sfx.muted);

function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

/* ===== Điều hướng theo ngăn xếp (stack) — bấm ◀ luôn quay đúng màn trước ===== */

const SCREEN_ELS = {
  level: els.levelScreen, mode: els.modeScreen, unit: els.unitScreen, lesson: els.lessonScreen,
  mockSetup: els.mockSetupScreen, quiz: els.quizScreen, report: els.reportScreen,
};

function stopTimer() {
  if (state.timerHandle) { clearInterval(state.timerHandle); state.timerHandle = null; }
}

function showScreen(name) {
  state.screen = name;
  for (const [key, el] of Object.entries(SCREEN_ELS)) el.classList.toggle('hidden', key !== name);
  els.btnBack.hidden = name === 'level';
  els.btnHelp.hidden = name === 'level' || name === 'mode';
  const lvl = LEVELS.find((l) => l.id === state.level);
  els.subLine.textContent = name === 'level' ? '' : `${lvl?.icon || ''} ${lvl?.label || ''}`;
}

function goTo(name) {
  if (state.screen !== name) state.history.push(state.screen);
  showScreen(name);
}

function goBack() {
  sfx.select();
  stopTimer();
  const prev = state.history.pop();
  if (prev) showScreen(prev);
  else { state.level = null; showScreen('level'); }
}

function confetti() {
  const colors = ['#4d7bf5', '#2547b8', '#22c55e', '#f5c542', '#e5484d'];
  for (let i = 0; i < 36; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.setProperty('--x', `${Math.random() * 100}vw`);
    p.style.setProperty('--delay', `${Math.random() * 0.5}s`);
    p.style.setProperty('--rot', `${Math.random() * 720 - 360}deg`);
    p.style.background = colors[i % colors.length];
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 2400);
  }
}

/* ===== Màn 1: chọn cấp độ ===== */

async function selectLevel(level) {
  state.level = level;
  state.history = [];
  goTo('mode');
  renderGoalBox();
  // Làm mới cache settings trước khi kiểm tra cấp độ Luyện Dịch/Trắc Nghiệm
  // — tránh nút biến mất do thiết bị bé còn giữ settings cũ (xem
  // shared/api.js#refreshCurrentKidSettings).
  await api.refreshCurrentKidSettings();
  renderTranslateEntry();
  renderGrammarQuizEntry();
  renderMillionaireEntry();
}

document.querySelectorAll('.level-card[data-level]').forEach((btn) => {
  btn.addEventListener('click', () => { sfx.select(); selectLevel(btn.dataset.level); });
});

// Trang chủ có mục "Tiếng Anh Hôm Nay" liên kết thẳng vào đây kèm
// ?level=starters|movers|flyers&open=translate|grammar|millionaire cho các
// cấp độ KHÔNG có trang riêng /luyen-thi-*/ — tự chọn cấp độ + bấm hộ nút đó
// nếu đang hiển thị (im lặng bỏ qua nếu bé/cấp độ này chưa cấu hình mục đó).
(async () => {
  const params = new URLSearchParams(location.search);
  const wantLevel = params.get('level');
  if (!wantLevel || !LEVELS.some((l) => l.id === wantLevel)) return;
  await selectLevel(wantLevel);
  const wantOpen = params.get('open');
  if (wantOpen === 'translate') document.getElementById('trEntryBox')?.querySelector('button')?.click();
  else if (wantOpen === 'grammar') document.getElementById('gqEntryBox')?.querySelector('button')?.click();
  else if (wantOpen === 'millionaire') document.getElementById('mpEntryBox')?.querySelector('button')?.click();
})();

/** Nút "📝 Luyện Dịch" — chỉ hiện khi phụ huynh đã đặt ĐÚNG cấp độ vừa chọn
 * làm cấp độ dùng cho Luyện Dịch (xem shared/translate-ui.js). */
function renderTranslateEntry() {
  const box = document.getElementById('trEntryBox');
  if (!box) return;
  box.innerHTML = '';
  const btn = buildTranslateEntryButton(state.level, { speak });
  if (btn) box.appendChild(btn);
}

/** Nút "🧩 Trắc Nghiệm Ngữ Pháp" — chỉ hiện khi phụ huynh đã đặt ĐÚNG cấp độ
 * vừa chọn làm cấp độ Trắc Nghiệm Ngữ Pháp (xem shared/grammar-quiz-ui.js). */
function renderGrammarQuizEntry() {
  const box = document.getElementById('gqEntryBox');
  if (!box) return;
  box.innerHTML = '';
  const btn = buildGrammarQuizEntryButton(state.level, { speak });
  if (btn) box.appendChild(btn);
}

/** Nút "🏆 Ai Là Triệu Phú" — luôn hiện (không cần phụ huynh bật riêng như 2
 * mục trên), dùng cấp độ vừa chọn (xem shared/millionaire-ui.js). */
function renderMillionaireEntry() {
  const box = document.getElementById('mpEntryBox');
  if (!box) return;
  box.innerHTML = '';
  const btn = buildMillionaireEntryButton(state.level, { speak });
  if (btn) box.appendChild(btn);
}

/** Mục tiêu học hôm nay (phụ huynh đặt ở Trang Phụ Huynh > Cài đặt bé) — chỉ
 * hiện khi bé có đặt mục tiêu ĐÚNG cấp độ vừa chọn. Mất mạng/chưa cấu hình
 * server thì ẩn êm, không chặn game. */
async function renderGoalBox() {
  const box = document.getElementById('goalBox');
  if (!box) return;
  box.classList.add('hidden');
  box.innerHTML = '';
  try {
    const kid = api.currentKidInfo();
    const goal = kid?.settings?.examGoal;
    if (!goal?.level || goal.level !== state.level || !goal.perDay) return;
    if (!(await api.ready())) return;
    const sessions = await api.kidSessions(kid.id, 400);
    const done = examSessionsToday(sessions, goal.level);
    const pct = Math.min(100, Math.round((done / goal.perDay) * 100));
    const label = EXAM_LEVEL_LABELS[goal.level] || goal.level;
    box.innerHTML = `<div style="background:var(--panel,#fffaf2);border:2px solid var(--line,#a8834a);border-radius:14px;padding:12px 16px">
      <div style="display:flex;justify-content:space-between;font-weight:800;font-size:14px;margin-bottom:6px">
        <span>🎯 Mục tiêu hôm nay — ${label}</span><span>${done}/${goal.perDay} bài</span>
      </div>
      <div style="background:var(--panel2,#fff3df);border-radius:999px;height:14px;overflow:hidden">
        <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,#ff9d5c,#c2410c);border-radius:999px"></div>
      </div>
      <p style="font-size:12.5px;color:var(--ink-dim,#5d5370);margin:6px 0 0">${pct >= 100 ? '🎉 Bé đã đạt mục tiêu hôm nay rồi, giỏi quá!' : `Còn ${goal.perDay - done} bài nữa là đạt mục tiêu hôm nay!`}</p>
    </div>`;
    box.classList.remove('hidden');
  } catch { /* mất mạng/chưa cấu hình: ẩn êm */ }
}

/* ===== Màn 2: Học hay Luyện Thi? ===== */

els.btnGoStudy.addEventListener('click', () => {
  sfx.select();
  state.mode = 'study';
  buildUnitGrid();
  goTo('unit');
});
els.btnGoMock.addEventListener('click', () => {
  sfx.select();
  state.mode = 'mock';
  goTo('mockSetup');
});

/* ===== Màn 3: chọn unit (nhánh Học) ===== */

function buildUnitGrid() {
  els.unitGrid.innerHTML = '';
  const units = unitsForLevel(state.level);

  const randomCard = document.createElement('button');
  randomCard.className = 'unit-card special';
  randomCard.innerHTML = `<span class="uc-topic">🎲 ${t('examprep.mixall', 'Luyện ngẫu nhiên — trộn tất cả unit')}</span>`
    + `<span class="uc-grammar">${units.length} units · ${allQuestions(state.level).length} câu hỏi</span>`;
  randomCard.addEventListener('click', () => startStudyQuiz(null));
  els.unitGrid.appendChild(randomCard);

  const weak = missCount();
  if (weak > 0) {
    const weakCard = document.createElement('button');
    weakCard.className = 'unit-card special';
    weakCard.innerHTML = `<span class="uc-topic">🎯 ${t('examprep.weak', 'Ôn câu hay sai')}</span>`
      + `<span class="uc-grammar">${weak} ${t('examprep.weak.count', 'câu đang cần ôn')}</span>`;
    weakCard.addEventListener('click', () => startStudyQuiz(null));
    els.unitGrid.appendChild(weakCard);
  }

  for (const u of units) {
    const card = document.createElement('button');
    card.className = 'unit-card';
    card.innerHTML = `<span class="uc-topic">${u.topic}</span>`
      + `<span class="uc-grammar">${u.grammarPoints.slice(0, 2).join(' · ')}</span>`
      + `<span class="uc-badge">${u.questions.length} câu</span>`;
    card.addEventListener('click', () => goToLesson(u.id));
    els.unitGrid.appendChild(card);
  }
}

/* ===== Màn 4: bài học của 1 unit (nhánh Học) ===== */

function goToLesson(unitId) {
  const u = unitById(unitId);
  if (!u) return;
  state.unitId = unitId;
  els.lessonTopic.textContent = u.topic;
  els.lessonIntro.textContent = u.lesson.intro;
  els.lessonPoints.innerHTML = '';
  for (const p of u.lesson.points) {
    const div = document.createElement('div');
    div.className = 'lesson-point';
    const examplesHtml = p.examples.map((ex) => `<div class="lesson-example">🇬🇧 <b>${ex.en}</b> — ${ex.vi}</div>`).join('');
    div.innerHTML = `<div class="lesson-rule">${p.rule}</div>${examplesHtml}`;
    els.lessonPoints.appendChild(div);
  }
  goTo('lesson');
}

els.btnStartPractice.addEventListener('click', () => {
  sfx.select();
  startStudyQuiz(state.unitId);
});

/* ===== Màn 5: chọn độ dài đề (nhánh Luyện Thi) ===== */

document.querySelectorAll('#mockSetupScreen .level-card[data-count]').forEach((btn) => {
  btn.addEventListener('click', () => {
    sfx.select();
    startMockTest(Number(btn.dataset.count));
  });
});

/* ===== Màn 6: luyện tập / làm đề (dùng chung) ===== */

function updateHud() {
  const q = state.quiz;
  els.hudScore.textContent = q.score;
  els.hudRound.textContent = `${q.index}/${q.questions.length}`;
  els.hudStreak.textContent = q.streak;
}

function speakPrompt(question) {
  if (!question) return;
  speak(question.prompt.replace('___', '...'), { lang: 'en-US', rate: 0.72 });
}

function renderQuestion() {
  const q = currentQuestion(state.quiz);
  if (!q) return;
  els.quizUnitLabel.textContent = q.unitTopic || unitsForLevel(state.level).find((u) => u.id === q.unitId)?.topic || '';
  if (q.unitPassage) {
    els.quizPassage.classList.remove('hidden');
    els.quizPassageTitle.textContent = q.unitPassage.title;
    els.quizPassageText.textContent = q.unitPassage.text;
  } else {
    els.quizPassage.classList.add('hidden');
  }
  els.quizPrompt.textContent = q.prompt;
  els.quizExplain.textContent = '';
  els.quizOptions.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt';
    btn.textContent = opt;
    btn.dataset.i = i;
    btn.addEventListener('click', () => onPick(i, btn));
    els.quizOptions.appendChild(btn);
  });
}

function onPick(i, btn) {
  if (state.busy) return;
  const quiz = state.quiz;
  if (!quiz || quiz.over) return;
  state.busy = true;
  sfx.select();

  const q = currentQuestion(quiz);
  const ev = state.mode === 'mock' ? answerMockTest(quiz, i) : answerQuiz(quiz, i);

  if (ev.retry) {
    recordMiss(q.id);
    btn.classList.add('wrong');
    btn.disabled = true;
    els.quizExplain.textContent = q.explain;
    sfx.fail();
    updateHud();
    speakSequence([
      { text: 'Chưa đúng, thử lại nhé.', lang: 'vi-VN', rate: 0.92 },
      { text: q.explain, lang: 'vi-VN', rate: 0.88 },
    ], () => { state.busy = false; });
    return;
  }

  const buttons = [...els.quizOptions.querySelectorAll('.quiz-opt')];
  for (const b of buttons) {
    if (Number(b.dataset.i) === q.answer) b.classList.add('correct');
    else b.classList.add('dim');
  }
  if (!ev.correct) {
    btn.classList.remove('dim');
    btn.classList.add('wrong');
  }

  if (state.mode === 'mock') {
    if (ev.correct) recordHit(q.id); else recordMiss(q.id);
  } else if (ev.correct && ev.gain >= 10) recordHit(q.id);
  else if (!ev.correct) recordMiss(q.id);

  els.quizExplain.textContent = q.explain;
  if (ev.correct) sfx.match(1);
  else sfx.fail();
  updateHud();
  answeredOne();

  const seq = ev.correct
    ? [{ text: 'Đúng rồi, bé giỏi quá!', lang: 'vi-VN', rate: 0.92 }, { text: q.explain, lang: 'vi-VN', rate: 0.88 }]
    : [{ text: 'Chưa đúng.', lang: 'vi-VN', rate: 0.92 }, { text: q.explain, lang: 'vi-VN', rate: 0.88 }];
  speakSequence(seq, () => {
    state.busy = false;
    if (ev.quizDone) {
      if (state.mode === 'mock') endMockTest(false);
      else endStudyQuiz();
    } else {
      renderQuestion();
      updateHud();
      setTimeout(() => speakPrompt(currentQuestion(quiz)), 200);
    }
  });
}

/* ===== Nhánh Học: kết thúc ván luyện tập (cheer, không tính giờ) ===== */

function endStudyQuiz() {
  const q = state.quiz;
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: `exam-${state.level}${state.unitId ? `-${state.unitId}` : '-mix'}${q.ai ? '-ai' : ''}`,
    result: q.won ? 'win' : 'loss',
    score: q.score,
    level: 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  if (q.won) {
    sfx.levelWin();
    confetti();
    els.cheerEmoji.textContent = '🏆';
    els.cheerText.textContent = `${t('examprep.win', 'Giỏi quá, bé nắm chắc ngữ pháp rồi!')}\n⭐ ${q.score} · 🔥 ${q.bestStreak}`;
    speak(t('examprep.win', 'Giỏi quá, bé nắm chắc ngữ pháp rồi!'));
  } else {
    sfx.gameOver();
    els.cheerEmoji.textContent = '💪';
    els.cheerText.textContent = `${t('examprep.tryagain', 'Ôn thêm chút nữa rồi thử lại nhé!')}\n⭐ ${q.score} · 🔥 ${q.bestStreak}`;
    speak(t('examprep.tryagain', 'Ôn thêm chút nữa rồi thử lại nhé!'));
  }
  els.cheer.classList.remove('hidden');
}

function startStudyQuiz(unitId) {
  state.mode = 'study';
  state.unitId = unitId;
  state.busy = false;
  els.hudTimerWrap.classList.add('hidden');
  state.quiz = makeQuiz(state.level, unitId, missMap(), Math.random, 8);
  state.startedAt = Date.now();
  goTo('quiz');
  renderQuestion();
  updateHud();
  setTimeout(() => speakPrompt(currentQuestion(state.quiz)), 300);
}

/* ===== "🤖 Ôn thêm với AI" — nhờ Groq soạn thêm câu hỏi MỚI cho đúng unit
   đang học (khác accord bộ câu hỏi tĩnh có sẵn), rồi luyện tập như bình
   thường bằng CHÍNH engine study (answerQuiz — có gợi ý khi sai). Yêu cầu
   phụ huynh đã cấu hình key AI ở Trang Phụ Huynh > Cài đặt > 🤖 Trợ Lý AI. */
function startAiQuiz(unitId, questions) {
  state.mode = 'study';
  state.unitId = unitId;
  state.busy = false;
  els.hudTimerWrap.classList.add('hidden');
  state.quiz = {
    levelId: state.level, unitId, questions, index: 0,
    score: 0, streak: 0, bestStreak: 0, correctCount: 0, over: false, won: false, ai: true,
  };
  state.startedAt = Date.now();
  goTo('quiz');
  renderQuestion();
  updateHud();
  setTimeout(() => speakPrompt(currentQuestion(state.quiz)), 300);
}

els.btnAiExtra.addEventListener('click', async () => {
  const u = unitById(state.unitId);
  if (!u) return;
  els.btnAiExtra.disabled = true;
  els.aiExtraMsg.textContent = '🤖 Đang nhờ AI soạn thêm câu hỏi…';
  try {
    const settings = api.cachedSettings() || (await api.getSettings());
    const levelLabel = LEVELS.find((l) => l.id === state.level)?.label || state.level;
    const questions = await aiProvider.generateQuestions(settings, {
      levelLabel,
      topic: u.topic,
      grammarPoints: u.grammarPoints,
      count: 5,
      avoidPrompts: u.questions.map((q) => q.prompt),
    });
    for (const q of questions) q.unitId = u.id;
    els.aiExtraMsg.textContent = '';
    sfx.select();
    startAiQuiz(u.id, questions);
  } catch (e) {
    els.aiExtraMsg.textContent = `⚠️ ${e.message}`;
  } finally {
    els.btnAiExtra.disabled = false;
  }
});

/* ===== Nhánh Luyện Thi: đề tính giờ, 1 lần trả lời, báo cáo cuối đề ===== */

function fmtTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.max(0, sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function startMockTest(count) {
  state.mode = 'mock';
  state.unitId = null;
  state.busy = false;
  state.quiz = makeMockTest(state.level, missMap(), Math.random, count);
  state.startedAt = Date.now();
  state.mockDeadline = Date.now() + count * 25 * 1000; // ~25s/câu — đủ đọc + suy nghĩ, có áp lực thời gian thật
  els.hudTimerWrap.classList.remove('hidden');
  goTo('quiz');
  renderQuestion();
  updateHud();
  stopTimer();
  state.timerHandle = setInterval(() => {
    const remain = Math.round((state.mockDeadline - Date.now()) / 1000);
    els.hudTimer.textContent = fmtTime(remain);
    if (remain <= 0) { stopTimer(); endMockTest(true); }
  }, 500);
  els.hudTimer.textContent = fmtTime(count * 25);
  setTimeout(() => speakPrompt(currentQuestion(state.quiz)), 300);
}

function endMockTest(timedOut) {
  stopTimer();
  const quiz = state.quiz;
  // Hết giờ giữa chừng: chỉ tính báo cáo trên số câu ĐÃ làm, không tính các câu chưa kịp làm là sai.
  const attempted = timedOut ? { ...quiz, questions: quiz.questions.slice(0, quiz.index) } : quiz;
  const report = mockTestReport(attempted);

  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: `exam-${state.level}-mock`,
    result: report.percent >= 60 ? 'win' : 'loss',
    score: quiz.score,
    level: 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });

  els.reportScore.textContent = `⭐ ${report.score}`;
  els.reportPercent.textContent = `${t('examprep.mock.correct', 'Đúng')} ${report.correctCount}/${report.total} (${report.percent}%)`;
  els.reportWeak.innerHTML = '';
  if (report.weakTopics.length) {
    for (const w of report.weakTopics) {
      const row = document.createElement('div');
      row.className = 'report-weak-item';
      row.innerHTML = `<span>${w.topic}</span><span>${w.count} ${t('examprep.mock.wrong', 'câu sai')}</span>`;
      els.reportWeak.appendChild(row);
    }
  } else {
    const row = document.createElement('div');
    row.className = 'report-weak-empty';
    row.textContent = `🎉 ${t('examprep.mock.perfect', 'Không sai chủ điểm nào — xuất sắc!')}`;
    els.reportWeak.appendChild(row);
  }

  if (report.percent >= 60) { sfx.levelWin(); confetti(); } else sfx.gameOver();
  speak(report.percent >= 60
    ? t('examprep.win', 'Giỏi quá, bé nắm chắc ngữ pháp rồi!')
    : t('examprep.tryagain', 'Ôn thêm chút nữa rồi thử lại nhé!'));
  goTo('report');
}

els.btnMockAgain.addEventListener('click', () => { sfx.select(); state.history = ['level', 'mode']; showScreen('mockSetup'); });
els.btnStudyWeak.addEventListener('click', () => { sfx.select(); state.mode = 'study'; buildUnitGrid(); state.history = ['level', 'mode']; showScreen('unit'); });

/* ===== Nút chung ===== */

els.btnBack.addEventListener('click', goBack);
els.btnHelp.addEventListener('click', () => { sfx.select(); speak(state.instruction); });
els.btnListen.addEventListener('click', () => { sfx.select(); speakPrompt(currentQuestion(state.quiz)); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});
els.btnAgain.addEventListener('click', () => { els.cheer.classList.add('hidden'); startStudyQuiz(state.unitId); });
els.btnHome2.addEventListener('click', () => { els.cheer.classList.add('hidden'); buildUnitGrid(); showScreen('unit'); });

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
showScreen('level');
mountKidFeatures(); // thanh avatar bé + kiểm tra giới hạn phút/ngày
sayInstruction(t('examprep.help', 'Đây là Luyện Thi Cambridge! Bé chọn cấp độ Movers hoặc Flyers, rồi chọn Học theo Unit để đọc bài học và luyện tập có gợi ý, hoặc chọn Luyện Thi để làm đề trộn ngẫu nhiên có tính giờ giống thi thật. Mỗi câu có 1 câu tiếng Anh thiếu từ, bé chọn đúng từ để điền vào chỗ trống.'));

// Hook cho e2e test
window.__examprep = {
  state, startStudyQuiz, startMockTest,
};
