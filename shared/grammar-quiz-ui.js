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

import * as api from './api.js';
import { generateGrammarQuiz, gradeGrammarQuiz } from './groq.js';
import { EXAM_LEVEL_LABELS } from './report.js';
import { openAiOverlay, closeAiOverlay, renderAiBox, buildEntryButton } from './ai-overlay.js';

/**
 * Trả về 1 nút <button> "🧩 Trắc Nghiệm Ngữ Pháp" nếu bé đang chọn CÓ cấu
 * hình đúng `levelId` này làm cấp độ Trắc Nghiệm Ngữ Pháp, hoặc `null` nếu
 * không áp dụng — bên gọi tự quyết định chèn nút vào đâu.
 */
export function buildGrammarQuizEntryButton(levelId, opts = {}) {
  const kid = api.currentKidInfo();
  const cfgLevel = kid?.settings?.grammarQuizLevel;
  if (!kid || !cfgLevel || cfgLevel !== levelId) return null;
  return buildEntryButton('🧩 Trắc Nghiệm Ngữ Pháp — 5 câu hôm nay', () => openGrammarQuizOverlay(levelId, opts));
}

async function openGrammarQuizOverlay(levelId, { speak } = {}) {
  const say = typeof speak === 'function' ? speak : () => {};
  const ov = openAiOverlay();
  renderAiBox(ov, '<h3>🧩 Trắc Nghiệm Ngữ Pháp</h3><p class="r99-ai-msg">Đang tải…</p>');

  const kid = api.currentKidInfo();
  if (!kid) { renderAiBox(ov, '<p class="r99-ai-msg">Cần chọn hồ sơ bé trước ở /chon-be/.</p>'); return; }
  if (!(await api.ready().catch(() => false))) {
    renderAiBox(ov, '<p class="r99-ai-msg">Cần cấu hình server + đăng nhập phụ huynh trước — xem Trang Phụ Huynh.</p>');
    return;
  }

  const levelLabel = EXAM_LEVEL_LABELS[levelId] || levelId;

  let quiz;
  try {
    quiz = await api.todayGrammarQuiz(kid.id);
    if (!quiz) {
      renderAiBox(ov, `<p class="r99-ai-msg">🤖 AI đang soạn 5 câu trắc nghiệm mới cho hôm nay (${levelLabel})…</p>`);
      const settings = api.cachedSettings() || await api.getSettings();
      const apiKey = settings?.ai_api_key;
      if (!apiKey) {
        renderAiBox(ov, '<p class="r99-ai-msg">⚠️ Chưa cấu hình key AI — nhờ phụ huynh vào Trang Phụ Huynh &gt; Cài đặt &gt; 🤖 Trợ Lý AI.</p>');
        return;
      }
      const questions = await generateGrammarQuiz({ apiKey, levelLabel, count: 5 });
      quiz = await api.saveGrammarQuiz(kid.id, { level: levelId, questions });
    }
  } catch (e) {
    renderAiBox(ov, `<p class="r99-ai-msg">⚠️ ${e.message}</p>`);
    return;
  }

  let submissions;
  try {
    submissions = await api.kidGrammarQuizSubmissions(kid.id, 30);
  } catch {
    submissions = [];
  }
  const done = submissions.find((s) => s.quiz_id === quiz.id) || null;

  if (done) {
    renderReview(ov, { levelLabel, quiz, say, score: done.score, suggestion: done.ai_suggestion, picks: done.answers.map((a) => a.selected) });
  } else {
    renderIntro(ov, { levelLabel, quiz, kid, say });
  }
}

function renderIntro(ov, ctx) {
  const { levelLabel, quiz } = ctx;
  renderAiBox(ov, `
    <h3>🧩 Trắc Nghiệm Ngữ Pháp</h3>
    <p style="font-size:13px;color:#5d5370;margin:0 0 10px">Cấp độ: <b>${levelLabel}</b> — ${quiz.questions.length} câu hôm nay. Làm 1 lượt, xong hết mới biết điểm và giải thích từng câu nhé!</p>
    <button type="button" class="r99-ai-btn" id="gqStartBtn">BẮT ĐẦU ▶</button>
  `);
  ov.querySelector('#gqStartBtn').addEventListener('click', () => renderQuestion(ov, { ...ctx, index: 0, picks: [] }));
}

function renderQuestion(ov, ctx) {
  const { quiz, index, picks } = ctx;
  const q = quiz.questions[index];
  renderAiBox(ov, `
    <h3 style="font-size:15px">Câu ${index + 1}/${quiz.questions.length}</h3>
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
        finishQuiz(ov, { ...ctx, picks: nextPicks });
      } else {
        renderQuestion(ov, { ...ctx, index: nextIndex, picks: nextPicks });
      }
    });
  });
}

async function finishQuiz(ov, ctx) {
  const { quiz, picks, say } = ctx;
  renderAiBox(ov, '<p class="r99-ai-msg">🤖 AI đang chấm bài + soạn gợi ý…</p>');
  const results = quiz.questions.map((q, i) => ({ prompt: q.prompt, correct: picks[i] === q.answer }));
  const score = results.filter((r) => r.correct).length;
  let suggestion = '';
  try {
    const settings = api.cachedSettings() || await api.getSettings();
    const grade = await gradeGrammarQuiz({ apiKey: settings?.ai_api_key, results });
    suggestion = grade.suggestion;
  } catch (e) {
    suggestion = `(Không lấy được gợi ý từ AI: ${e.message})`;
  }
  try {
    await api.submitGrammarQuiz(quiz.id, {
      answers: quiz.questions.map((q, i) => ({ selected: picks[i], correct: picks[i] === q.answer })),
      score,
      aiSuggestion: suggestion,
    });
  } catch { /* mất mạng lúc lưu: bé vẫn đã hoàn thành, không chặn */ }
  renderReview(ov, { ...ctx, score, suggestion, say });
}

function renderReview(ov, ctx) {
  const { quiz, score, suggestion, picks, say } = ctx;
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
    <div class="r99-ai-feedback">💬 ${suggestion}</div>
    ${questionsHtml}
    <button type="button" class="r99-ai-btn ghost" id="gqCloseBtn">Đóng</button>
  `);
  say(`Bé làm đúng ${score} trên ${total} câu. ${suggestion}`, { lang: 'vi-VN', rate: 0.92 });
  ov.querySelector('#gqCloseBtn').addEventListener('click', () => closeAiOverlay(ov));
}
