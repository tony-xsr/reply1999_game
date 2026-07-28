// "🧩 Trắc Nghiệm Ngữ Pháp" — 5 câu trắc nghiệm ngữ pháp AI tự sinh MỖI NGÀY,
// riêng cho 1 cấp độ do phụ huynh chỉ định (Trang Phụ Huynh > Cài đặt bé).
// Bé làm 1 lượt duy nhất (không gợi ý khi chọn sai NGAY LÚC làm, giống thi
// thật) — làm xong cả 5 câu mới thấy: điểm, và với TỪNG câu — giải thích vì
// sao đáp án đúng đúng, vì sao từng đáp án sai không nên chọn. Sau đó AI chấm
// tổng kết + gợi ý nên ôn lại gì, rồi bài nộp được gửi cho phụ huynh xem lại
// (Trang Phụ Huynh > tab bé > 📝 Bài Dịch — dùng chung tab với Luyện Dịch,
// xem phần "🧩 Trắc nghiệm ngữ pháp").
//
// Dùng CHUNG cho MỌI trang luyện thi (exam-prep + 4 bản khoá cấp độ
// luyen-thi-ket/pet/toefl-junior/toeic), dùng chung khung overlay ở
// shared/ai-overlay.js — xem thêm ghi chú kiến trúc ở shared/translate-ui.js
// (cùng mẫu thiết kế, kể cả lưu ý "tự động mỗi ngày" = sinh-khi-cần).
//
// LUỒNG NỘP BÀI: điểm tính CLIENT-SIDE (so đáp án chọn với đáp án đúng, đã
// biết sẵn, không cần AI) nên lưu đáp án+điểm NGAY sau câu cuối — AI chỉ lo
// phần "gợi ý" (bổ sung, không phải điều kiện để bài được ghi nhận). AI lỗi
// vẫn không mất bài, có thử lại ngầm mỗi lần mở lại bài đã làm.

import * as api from './api.js';
import * as aiProvider from './ai-provider.js';
import { EXAM_LEVEL_LABELS } from './report.js';
import { openAiOverlay, closeAiOverlay, renderAiBox, buildEntryButton } from './ai-overlay.js';
import { DAILY_PRACTICE_BONUS_STARS, quotaProgress } from './daily-bonus.js';
import { REUSE_WINDOW_DAYS } from './content-reuse.js';
import { refreshStarBadge } from './kid-bar.js';

/* ===== Bài đang làm dở (localStorage) — sống sót qua xoay màn hình/đổi app
   giữa chừng, chỉ mất khi bé trả lời xong câu cuối và nộp thành công. ===== */

function draftKey(kidId, quizId) {
  return `r99-gq-draft:${kidId}:${quizId}`;
}
function loadDraft(kidId, quizId) {
  try { return JSON.parse(localStorage.getItem(draftKey(kidId, quizId))); } catch { return null; }
}
function saveDraft(kidId, quizId, data) {
  try { localStorage.setItem(draftKey(kidId, quizId), JSON.stringify(data)); } catch { /* ignore */ }
}
function clearDraft(kidId, quizId) {
  try { localStorage.removeItem(draftKey(kidId, quizId)); } catch { /* ignore */ }
}

/**
 * Trả về 1 nút <button> "🧩 Trắc Nghiệm Ngữ Pháp" nếu bé đang chọn CÓ cấu
 * hình đúng `levelId` này làm cấp độ Trắc Nghiệm Ngữ Pháp, hoặc `null` nếu
 * không áp dụng — bên gọi tự quyết định chèn nút vào đâu.
 */
export function buildGrammarQuizEntryButton(levelId, opts = {}) {
  const kid = api.currentKidInfo();
  const cfgLevel = kid?.settings?.grammarQuizLevel;
  if (!kid || !cfgLevel || cfgLevel !== levelId) return null;
  const quizType = kid?.settings?.grammarQuizType || 'grammar';
  const label = quizType === 'vocab' ? '🧩 Trắc Nghiệm Từ Vựng — 5 câu hôm nay' : '🧩 Trắc Nghiệm Ngữ Pháp — 5 câu hôm nay';
  return buildEntryButton(label, () => openGrammarQuizOverlay(levelId, opts));
}

async function openGrammarQuizOverlay(levelId, { speak } = {}) {
  const say = typeof speak === 'function' ? speak : () => {};
  const ov = openAiOverlay();
  renderAiBox(ov, '<h3>🧩 Trắc Nghiệm</h3><p class="r99-ai-msg">Đang tải…</p>');

  const kid = api.currentKidInfo();
  if (!kid) { renderAiBox(ov, '<p class="r99-ai-msg">Cần chọn hồ sơ bé trước ở /chon-be/.</p>'); return; }
  if (!(await api.ready().catch(() => false))) {
    renderAiBox(ov, '<p class="r99-ai-msg">Cần cấu hình server + đăng nhập phụ huynh trước — xem Trang Phụ Huynh.</p>');
    return;
  }

  const levelLabel = EXAM_LEVEL_LABELS[levelId] || levelId;
  const quizType = kid.settings?.grammarQuizType || 'grammar';
  const typeLabel = quizType === 'vocab' ? 'Từ Vựng' : 'Ngữ Pháp';

  let quiz;
  try {
    quiz = await api.todayGrammarQuiz(kid.id, quizType);
    if (!quiz) {
      // Thử TÁI SỬ DỤNG nội dung có sẵn của cả nhà trước (tiết kiệm AI, tự
      // nhiên thành ôn tập, anh/chị/em không trùng bài — xem shared/content-
      // reuse.js) — chỉ gọi AI khi không tìm được gì phù hợp.
      quiz = await api.ensureGrammarQuiz(kid.id, levelId, quizType, api.dateKeyOffset(0));
    }
    if (!quiz) {
      renderAiBox(ov, `<p class="r99-ai-msg">🤖 AI đang soạn 5 câu trắc nghiệm ${typeLabel} mới cho hôm nay (${levelLabel})…</p>`);
      const settings = api.cachedSettings() || await api.getSettings();
      if (!aiProvider.resolveProvider(settings).apiKey) {
        renderAiBox(ov, '<p class="r99-ai-msg">⚠️ Chưa cấu hình key AI — nhờ phụ huynh vào Trang Phụ Huynh &gt; Cài đặt &gt; 🤖 Trợ Lý AI.</p>');
        return;
      }
      const questions = await aiProvider.generateGrammarQuiz(settings, { levelLabel, count: 5, quizType });
      quiz = await api.saveGrammarQuiz(kid.id, { level: levelId, questions, quizType });
    }
  } catch (e) {
    renderAiBox(ov, `<p class="r99-ai-msg">⚠️ ${e.message}</p>`);
    return;
  }

  let submissions;
  try {
    submissions = await api.kidGrammarQuizSubmissions(kid.id, 60); // đủ lịch sử cho mục "Ôn lại bài cũ" (45 ngày)
  } catch {
    submissions = [];
  }
  const done = submissions.find((s) => s.quiz_id === quiz.id) || null;
  const oldQuizzes = recentOldQuizzes(quiz.id, quizType, submissions);

  if (done) {
    if (!done.ai_suggestion) backgroundRegradeQuiz(quiz, done); // AI lỗi lần trước -> thử lại ngầm
    renderReview(ov, { levelLabel, typeLabel, quiz, kid, say, score: done.score, suggestion: done.ai_suggestion, picks: done.answers.map((a) => a.selected), oldQuizzes });
    return;
  }

  const draft = loadDraft(kid.id, quiz.id);
  if (draft?.picks?.length) {
    renderQuestion(ov, { levelLabel, typeLabel, quiz, kid, say, oldQuizzes, index: draft.index, picks: draft.picks, startedAt: draft.startedAt });
  } else {
    renderIntro(ov, { levelLabel, typeLabel, quiz, kid, say, oldQuizzes });
  }
}

/** Đề CŨ (khác đề hôm nay, CÙNG loại) bé từng làm trong REUSE_WINDOW_DAYS
 * ngày gần đây — mỗi đề gốc chỉ liệt kê 1 lần (lần nộp gần nhất) — để bé
 * "làm lại" ôn tập, tạo 1 lượt nộp MỚI trên CÙNG đề cũ đó. */
function recentOldQuizzes(todayQuizId, quizType, submissions) {
  const cutoff = Date.now() - REUSE_WINDOW_DAYS * 86400000;
  const seen = new Set();
  const out = [];
  for (const s of submissions) {
    if (s.quiz_id === todayQuizId || seen.has(s.quiz_id)) continue;
    if ((s.grammar_quizzes?.quiz_type || 'grammar') !== quizType) continue;
    if (!s.submitted_at || new Date(s.submitted_at).getTime() < cutoff) continue;
    seen.add(s.quiz_id);
    out.push(s);
  }
  return out;
}

function renderOldQuizzesHtml(oldQuizzes) {
  if (!oldQuizzes.length) return '';
  return `
    <p style="font-size:12.5px;color:#5d5370;font-weight:700;margin:16px 0 6px">📚 Ôn lại đề cũ (làm lại để nhớ lâu hơn):</p>
    ${oldQuizzes.map((s, i) => `<div class="r99-ai-card" data-old-idx="${i}">
      Đề ngày ${s.grammar_quizzes?.day || '—'}
      <div style="font-size:12px;color:#5d5370">Điểm lần trước: ${s.score}/${s.grammar_quizzes?.questions?.length ?? '—'}</div>
    </div>`).join('')}`;
}

function wireOldQuizzesClicks(ov, ctx, oldQuizzes) {
  ov.querySelectorAll('.r99-ai-card[data-old-idx]').forEach((card) => {
    card.addEventListener('click', () => {
      const s = oldQuizzes[Number(card.dataset.oldIdx)];
      const quiz = { id: s.quiz_id, questions: s.grammar_quizzes?.questions || [] };
      renderQuestion(ov, { ...ctx, quiz, index: 0, picks: [], startedAt: Date.now() });
    });
  });
}

async function backgroundRegradeQuiz(quiz, submission) {
  try {
    const settings = api.cachedSettings() || await api.getSettings();
    if (!aiProvider.resolveProvider(settings).apiKey) return;
    const results = quiz.questions.map((q, i) => ({ prompt: q.prompt, correct: !!submission.answers[i]?.correct }));
    const grade = await aiProvider.gradeGrammarQuiz(settings, { results });
    await api.updateGrammarQuizSuggestion(submission.id, grade.suggestion);
  } catch { /* vẫn lỗi — thử lại lần sau khi bé mở lại mục này */ }
}

function renderIntro(ov, ctx) {
  const { levelLabel, typeLabel, quiz, oldQuizzes = [] } = ctx;
  renderAiBox(ov, `
    <h3>🧩 Trắc Nghiệm ${typeLabel}</h3>
    <p style="font-size:13px;color:#5d5370;margin:0 0 10px">Cấp độ: <b>${levelLabel}</b> — ${quiz.questions.length} câu hôm nay. Làm 1 lượt, xong hết mới biết điểm và giải thích từng câu nhé!</p>
    <p class="r99-ai-progress-text">Làm xong hết ${quiz.questions.length} câu được thưởng +${DAILY_PRACTICE_BONUS_STARS} sao 🌟</p>
    <button type="button" class="r99-ai-btn" id="gqStartBtn">BẮT ĐẦU ▶</button>
    ${renderOldQuizzesHtml(oldQuizzes)}
  `);
  ov.querySelector('#gqStartBtn').addEventListener('click', () => renderQuestion(ov, { ...ctx, index: 0, picks: [], startedAt: Date.now() }));
  wireOldQuizzesClicks(ov, ctx, oldQuizzes);
}

function renderQuestion(ov, ctx) {
  const { quiz, index, picks, kid } = ctx;
  const q = quiz.questions[index];
  const pct = Math.round(quotaProgress(index, quiz.questions.length) * 100);
  renderAiBox(ov, `
    <h3 style="font-size:15px">Câu ${index + 1}/${quiz.questions.length}</h3>
    <div class="r99-ai-progress"><div class="r99-ai-progress-fill" style="width:${pct}%"></div></div>
    <div class="r99-ai-q">${q.prompt}</div>
    <div id="gqOpts">
      ${q.options.map((o, i) => `<button type="button" class="r99-ai-opt" data-i="${i}">${o}</button>`).join('')}
    </div>
  `);
  ov.querySelectorAll('#gqOpts .r99-ai-opt').forEach((btn) => {
    btn.addEventListener('click', () => {
      const selected = Number(btn.dataset.i);
      const nextPicks = [...picks, selected];
      const nextIndex = index + 1;
      if (nextIndex >= quiz.questions.length) {
        clearDraft(kid.id, quiz.id);
        finishQuiz(ov, { ...ctx, picks: nextPicks });
      } else {
        saveDraft(kid.id, quiz.id, { index: nextIndex, picks: nextPicks, startedAt: ctx.startedAt });
        renderQuestion(ov, { ...ctx, index: nextIndex, picks: nextPicks });
      }
    });
  });
}

async function finishQuiz(ov, ctx) {
  const { quiz, picks, say, kid, startedAt } = ctx;
  renderAiBox(ov, '<p class="r99-ai-msg">Đang lưu bài…</p>');
  const results = quiz.questions.map((q, i) => ({ prompt: q.prompt, correct: picks[i] === q.answer }));
  const score = results.filter((r) => r.correct).length;
  const secondsSpent = Math.max(1, Math.round((Date.now() - (startedAt || Date.now())) / 1000));

  // BƯỚC 1 — điểm tính CLIENT-SIDE (không cần AI) nên lưu bài NGAY, trước
  // khi nhờ AI soạn gợi ý (AI lỗi thì bài vẫn được ghi nhận đầy đủ).
  let submission;
  try {
    submission = await api.submitGrammarQuizDraft(quiz.id, {
      answers: quiz.questions.map((q, i) => ({ selected: picks[i], correct: picks[i] === q.answer })),
      score, secondsSpent,
    });
  } catch (e) {
    renderAiBox(ov, `<p class="r99-ai-msg">⚠️ Không lưu được bài (${e.message}) — kiểm tra mạng rồi thử lại.</p><button type="button" class="r99-ai-btn ghost" id="gqRetryBtn">Thử lại</button>`);
    ov.querySelector('#gqRetryBtn')?.addEventListener('click', () => finishQuiz(ov, ctx));
    return;
  }
  clearDraft(kid.id, quiz.id);

  // BƯỚC 2 — nhờ AI soạn gợi ý tổng kết (lỗi/hết quota cũng KHÔNG mất bài đã lưu).
  renderAiBox(ov, '<p class="r99-ai-msg">🤖 AI đang soạn gợi ý…</p>');
  let suggestion = '';
  try {
    const settings = api.cachedSettings() || await api.getSettings();
    const grade = await aiProvider.gradeGrammarQuiz(settings, { results });
    suggestion = grade.suggestion;
    await api.updateGrammarQuizSuggestion(submission.id, suggestion);
  } catch { /* AI lỗi: bài đã lưu an toàn, chỉ thiếu gợi ý — thử lại ngầm lần sau */ }

  // Làm tới đây nghĩa là đã trả lời HẾT các câu -> luôn tính là xong chỉ tiêu
  // trắc nghiệm hôm nay (không cần so đếm như Luyện Dịch nhiều bài/ngày).
  let bonusGranted = false;
  try {
    bonusGranted = await api.claimDailyPracticeBonus(kid.id, 'gqRewardedDay', api.dateKeyOffset(0), 'trac-nghiem:hoan-thanh');
    if (bonusGranted) refreshStarBadge();
  } catch { /* mất mạng lúc thưởng: không chặn bé xem kết quả */ }

  renderReview(ov, { ...ctx, score, suggestion, bonusGranted });
}

function renderReview(ov, ctx) {
  const { quiz, score, suggestion, picks, say, bonusGranted, oldQuizzes = [] } = ctx;
  const total = quiz.questions.length;
  const questionsHtml = quiz.questions.map((q, qi) => {
    const picked = picks?.[qi];
    const optsHtml = q.options.map((o, oi) => {
      const cls = oi === q.answer ? 'correct' : (oi === picked ? 'wrong' : '');
      const pickedMark = oi === picked ? ' 👈 bé chọn' : '';
      return `<div class="r99-ai-opt ${cls}" style="cursor:default">${o}${pickedMark}</div>
        <div class="r99-ai-explain">${q.explanations[oi]}</div>`;
    }).join('');
    return `<div class="r99-ai-q"><b>Câu ${qi + 1}:</b> ${q.prompt}${optsHtml}</div>`;
  }).join('');

  renderAiBox(ov, `
    <div class="r99-ai-score">${score}/${total}</div>
    ${bonusGranted ? `<p class="r99-ai-bonus">🌟 Hoàn thành hết bài trắc nghiệm hôm nay — thưởng +${DAILY_PRACTICE_BONUS_STARS} sao!</p>` : ''}
    ${suggestion ? `<div class="r99-ai-feedback">💬 ${suggestion}</div>` : '<p class="r99-ai-msg">⏳ AI chưa soạn được gợi ý ngay lúc này, đang tự thử lại...</p>'}
    ${questionsHtml}
    <button type="button" class="r99-ai-btn ghost" id="gqCloseBtn">Đóng</button>
    ${renderOldQuizzesHtml(oldQuizzes)}
  `);
  say(`Bé làm đúng ${score} trên ${total} câu.${suggestion ? ` ${suggestion}` : ''}${bonusGranted ? ' Bé còn được thưởng thêm 5 sao vì đã làm xong hết bài hôm nay!' : ''}`, { lang: 'vi-VN', rate: 0.92 });
  ov.querySelector('#gqCloseBtn').addEventListener('click', () => closeAiOverlay(ov));
  wireOldQuizzesClicks(ov, ctx, oldQuizzes);
}
