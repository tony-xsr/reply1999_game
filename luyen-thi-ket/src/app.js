// Điều phối Luyện Thi KET (A2 Key) — bản "KHOÁ CẤP ĐỘ" tách riêng từ
// exam-prep/: trước đây exam-prep/ gộp cả 6 cấp độ (Starters/Movers/Flyers/
// KET/PET/TOEFL Junior) trong CÙNG 1 màn chọn cấp độ, theo phản hồi của
// người dùng "gộp vậy bé rối" nên KET được tách thành mục riêng biệt — bấm
// vào là vào thẳng KET, không phải chọn cấp độ trước.
//
// Dùng lại NGUYÊN VẸN engine/dữ liệu từ exam-prep/ (cùng Unit/misses.js) —
// chỉ khoá cứng LEVEL_ID = 'ket' và bỏ hẳn màn chọn cấp độ khỏi luồng UI.

import {
  unitsForLevel, unitById, allQuestions, makeQuiz, currentQuestion, answerQuiz,
  makeMockTest, answerMockTest, mockTestReport,
} from '../../exam-prep/src/examprep.js';
import { recordMiss, recordHit, missMap, missCount } from '../../exam-prep/src/misses.js';
import { speak, speakSequence, bindMute } from '../../to-mau/src/speech.js';
import { sfx } from '../../pokemon/src/sfx.js';
import { mountKidFeatures, answeredOne } from '../../shared/kid-bar.js';
import { buildTranslateEntryButton } from '../../shared/translate-ui.js';
import { buildGrammarQuizEntryButton } from '../../shared/grammar-quiz-ui.js';
import { buildMillionaireEntryButton } from '../../shared/millionaire-ui.js';
import { currentProfile, recordSession } from '../../pokemon/src/stats.js';
import * as api from '../../shared/api.js';

const LEVEL_ID = 'ket';
const LEVEL_LABEL = '🎫 KET (A2 Key)';

const t = (key, fallback) => {
  const v = window.I18N?.t(key);
  return v && v !== key ? v : fallback;
};

const $ = (id) => document.getElementById(id);
const els = {
  subLine: $('subLine'),
  modeScreen: $('modeScreen'), unitScreen: $('unitScreen'),
  lessonScreen: $('lessonScreen'), mockSetupScreen: $('mockSetupScreen'), quizScreen: $('quizScreen'),
  reportScreen: $('reportScreen'),
  unitGrid: $('unitGrid'),
  lessonTopic: $('lessonTopic'), lessonIntro: $('lessonIntro'), lessonPoints: $('lessonPoints'),
  btnStartPractice: $('btnStartPractice'),
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
  screen: 'mode', history: [], mode: null, unitId: null, quiz: null,
  startedAt: Date.now(), instruction: '', busy: false, timerHandle: null,
};
bindMute(() => sfx.muted);

function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

/* ===== Điều hướng theo ngăn xếp (stack) — "mode" là màn gốc (không có màn chọn cấp độ) ===== */

const SCREEN_ELS = {
  mode: els.modeScreen, unit: els.unitScreen, lesson: els.lessonScreen,
  mockSetup: els.mockSetupScreen, quiz: els.quizScreen, report: els.reportScreen,
};

function stopTimer() {
  if (state.timerHandle) { clearInterval(state.timerHandle); state.timerHandle = null; }
}

function showScreen(name) {
  state.screen = name;
  for (const [key, el] of Object.entries(SCREEN_ELS)) el.classList.toggle('hidden', key !== name);
  els.btnBack.hidden = name === 'mode';
  els.btnHelp.hidden = name === 'mode';
  els.subLine.textContent = LEVEL_LABEL;
}

function goTo(name) {
  if (state.screen !== name) state.history.push(state.screen);
  showScreen(name);
}

function goBack() {
  sfx.select();
  stopTimer();
  const prev = state.history.pop();
  showScreen(prev || 'mode');
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

/* ===== Màn gốc: Học hay Luyện Thi? ===== */

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

/* ===== Màn: chọn unit (nhánh Học) ===== */

function buildUnitGrid() {
  els.unitGrid.innerHTML = '';
  const units = unitsForLevel(LEVEL_ID);

  const randomCard = document.createElement('button');
  randomCard.className = 'unit-card special';
  randomCard.innerHTML = `<span class="uc-topic">🎲 ${t('examprep.mixall', 'Luyện ngẫu nhiên — trộn tất cả unit')}</span>`
    + `<span class="uc-grammar">${units.length} units · ${allQuestions(LEVEL_ID).length} câu hỏi</span>`;
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

/* ===== Màn: bài học của 1 unit (nhánh Học) ===== */

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

/* ===== Màn: chọn độ dài đề (nhánh Luyện Thi) ===== */

document.querySelectorAll('#mockSetupScreen .level-card[data-count]').forEach((btn) => {
  btn.addEventListener('click', () => {
    sfx.select();
    startMockTest(Number(btn.dataset.count));
  });
});

/* ===== Màn: luyện tập / làm đề (dùng chung) ===== */

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
  els.quizUnitLabel.textContent = q.unitTopic || unitsForLevel(LEVEL_ID).find((u) => u.id === q.unitId)?.topic || '';
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
    mode: `exam-${LEVEL_ID}${state.unitId ? `-${state.unitId}` : '-mix'}`,
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
  state.quiz = makeQuiz(LEVEL_ID, unitId, missMap(), Math.random, 8);
  state.startedAt = Date.now();
  goTo('quiz');
  renderQuestion();
  updateHud();
  setTimeout(() => speakPrompt(currentQuestion(state.quiz)), 300);
}

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
  state.quiz = makeMockTest(LEVEL_ID, missMap(), Math.random, count);
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
    mode: `exam-${LEVEL_ID}-mock`,
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

els.btnMockAgain.addEventListener('click', () => { sfx.select(); state.history = []; showScreen('mockSetup'); });
els.btnStudyWeak.addEventListener('click', () => { sfx.select(); state.mode = 'study'; buildUnitGrid(); state.history = []; showScreen('unit'); });

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
showScreen('mode');
mountKidFeatures(); // thanh avatar bé + kiểm tra giới hạn phút/ngày
(async () => {
  // Làm mới cache settings trước khi kiểm tra cấp độ Luyện Dịch/Trắc Nghiệm —
  // tránh trường hợp phụ huynh vừa đổi cấu hình nhưng thiết bị bé vẫn giữ
  // bản settings cũ (chỉ nạp lại lúc chọn hồ sơ ở /chon-be/), khiến nút biến
  // mất dù cấu hình mới đã đúng trên server.
  await api.refreshCurrentKidSettings();
  const trBox = document.getElementById('trEntryBox');
  const trBtn = trBox && buildTranslateEntryButton(LEVEL_ID, { speak });
  if (trBtn) trBox.appendChild(trBtn);
  const gqBox = document.getElementById('gqEntryBox');
  const gqBtn = gqBox && buildGrammarQuizEntryButton(LEVEL_ID, { speak });
  if (gqBtn) gqBox.appendChild(gqBtn);
  const mpBox = document.getElementById('mpEntryBox');
  const mpBtn = mpBox && buildMillionaireEntryButton(LEVEL_ID, { speak });
  if (mpBtn) mpBox.appendChild(mpBtn);
  // Trang chủ có mục "Tiếng Anh Hôm Nay" liên kết thẳng vào đây kèm
  // ?open=translate|grammar|millionaire để bé đỡ phải tự tìm nút — tự bấm hộ
  // nếu nút đó đang hiển thị (im lặng bỏ qua nếu bé/cấp độ này chưa cấu hình mục đó).
  const autoOpen = new URLSearchParams(location.search).get('open');
  if (autoOpen === 'translate' && trBtn) trBtn.click();
  else if (autoOpen === 'grammar' && gqBtn) gqBtn.click();
  else if (autoOpen === 'millionaire' && mpBtn) mpBtn.click();
})();
sayInstruction(t('examket.help', 'Đây là Luyện Thi KET! Chọn Học theo Unit để đọc bài học và luyện tập có gợi ý, hoặc chọn Luyện Thi để làm đề trộn ngẫu nhiên có tính giờ giống thi thật. Mỗi câu có 1 câu tiếng Anh thiếu từ, bé chọn đúng từ để điền vào chỗ trống.'));

// Hook cho e2e test
window.__examket = { state, startStudyQuiz, startMockTest };
