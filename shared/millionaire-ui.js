// "🏆 Ai Là Triệu Phú" — 15 câu trắc nghiệm AI tự sinh, TĂNG DẦN độ khó, mỗi
// ngày chơi 1 lần. Trả lời đúng liên tục thì đi lên thang điểm; sai bất kỳ
// câu nào thì dừng lại, chỉ giữ số sao của các MỐC (câu 5/10/15) đã hoàn
// thành trọn vẹn trước đó — xem công thức đầy đủ ở shared/millionaire.js.
//
// Dùng CHUNG cho MỌI trang luyện thi (exam-prep + 4 bản khoá cấp độ
// luyen-thi-ket/pet/toefl-junior/toeic), cùng khung overlay ở
// shared/ai-overlay.js như Luyện Dịch/Trắc Nghiệm — xem ghi chú kiến trúc ở
// shared/translate-ui.js. KHÔNG cần phụ huynh bật/tắt riêng như 2 mục kia —
// dùng luôn cấp độ của trang đang mở, ai cũng chơi được.

import * as api from './api.js';
import * as aiProvider from './ai-provider.js';
import { EXAM_LEVEL_LABELS } from './report.js';
import { openAiOverlay, closeAiOverlay, renderAiBox, buildEntryButton } from './ai-overlay.js';
import { refreshStarBadge } from './kid-bar.js';
import {
  TOTAL_QUESTIONS, isMilestone, computeStarsEarned, buildLadder, formatStars,
} from './millionaire.js';

/* ===== Đề hôm nay lưu vào DB (dùng chung bảng grammar_quizzes, quiz_type =
   "millionaire" — CÙNG khuôn dạng câu hỏi hệt trắc nghiệm ngữ pháp thường)
   thay vì chỉ giữ tạm trong biến JS — để lỡ bé/phụ huynh bấm ✕ đóng overlay
   hoặc thoát app giữa chừng (KHÔNG phải trả lời SAI) thì mở lại vẫn ĐÚNG đề
   đó, tiếp tục đúng câu đang dở — không bị tính lại từ đầu bằng 1 đề MỚI do
   AI soạn lại. Draft (câu đang dở) lưu localStorage, chỉ cần nhớ `index` vì
   Ai Là Triệu Phú là "đúng liên tục" — còn tới được câu N nghĩa là N-1 câu
   trước ĐÃ đúng hết rồi, không cần lưu lại từng đáp án đã chọn. */
function draftKey(kidId, quizId) {
  return `r99-mp-draft:${kidId}:${quizId}`;
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

let styleInjected = false;
function injectMillionaireStyle() {
  if (styleInjected || document.getElementById('r99-mp-style')) return;
  styleInjected = true;
  const s = document.createElement('style');
  s.id = 'r99-mp-style';
  s.textContent = `
    .r99-mp-ladder{max-height:210px;overflow-y:auto;display:flex;flex-direction:column-reverse;gap:3px;
      margin:10px 0;border:2px solid #a8834a;border-radius:12px;padding:6px;background:#1b1730}
    .r99-mp-rung{display:flex;justify-content:space-between;gap:8px;padding:6px 10px;border-radius:7px;
      font-size:12.5px;font-weight:800;color:#b9c0e0}
    .r99-mp-rung .n{opacity:.85}
    .r99-mp-rung.milestone{color:#ffd15c}
    .r99-mp-rung.current{background:linear-gradient(90deg,#ff9d5c,#c2410c);color:#fff}
    .r99-mp-rung.done{background:#1e7a45;color:#fff}
    .r99-mp-result{font-size:44px;text-align:center;margin:6px 0}
    .r99-mp-played{background:#fff3df;border:2px solid #a8834a;border-radius:12px;padding:12px;
      text-align:center;font-weight:800;color:#c2410c;margin:8px 0}
  `;
  document.head.appendChild(s);
}

/**
 * Trả về 1 nút <button> "🏆 Ai Là Triệu Phú" — không cần cấu hình riêng như
 * Luyện Dịch/Trắc Nghiệm, chỉ cần đã chọn bé. Đổi nhãn nếu hôm nay đã chơi
 * rồi (hiện luôn số sao đã nhận, bấm vào vẫn xem lại được kết quả hôm nay).
 */
export function buildMillionaireEntryButton(levelId, opts = {}) {
  const kid = api.currentKidInfo();
  if (!kid) return null;
  const todayKey = api.dateKeyOffset(0);
  const playedToday = kid.settings?.millionaireLastPlayedDay === todayKey;
  const label = playedToday
    ? `🏆 Ai Là Triệu Phú — hôm nay được ${formatStars(kid.settings?.millionaireLastStars || 0)} sao ⭐`
    : '🏆 Ai Là Triệu Phú — 15 câu hôm nay';
  return buildEntryButton(label, () => openMillionaireOverlay(levelId, opts));
}

function renderLadderHtml(currentQ, doneUpTo) {
  const ladder = buildLadder();
  return `<div class="r99-mp-ladder">${ladder.map((stars, i) => {
    const qNum = i + 1;
    const cls = ['r99-mp-rung'];
    if (isMilestone(qNum)) cls.push('milestone');
    if (qNum === currentQ) cls.push('current');
    else if (qNum <= doneUpTo) cls.push('done');
    return `<div class="${cls.join(' ')}"><span class="n">Câu ${qNum}${isMilestone(qNum) ? ' 🏁' : ''}</span><span>⭐ ${formatStars(stars)}</span></div>`;
  }).join('')}</div>`;
}

async function openMillionaireOverlay(levelId, { speak } = {}) {
  injectMillionaireStyle();
  const say = typeof speak === 'function' ? speak : () => {};
  const ov = openAiOverlay();
  renderAiBox(ov, '<h3>🏆 Ai Là Triệu Phú</h3><p class="r99-ai-msg">Đang tải…</p>');

  let kid = api.currentKidInfo();
  if (!kid) { renderAiBox(ov, '<p class="r99-ai-msg">Cần chọn hồ sơ bé trước ở /chon-be/.</p>'); return; }
  if (!(await api.ready().catch(() => false))) {
    renderAiBox(ov, '<p class="r99-ai-msg">Cần cấu hình server + đăng nhập phụ huynh trước — xem Trang Phụ Huynh.</p>');
    return;
  }

  kid = (await api.refreshCurrentKidSettings().catch(() => null)) || kid;
  const todayKey = api.dateKeyOffset(0);
  if (kid.settings?.millionaireLastPlayedDay === todayKey) {
    renderAlreadyPlayed(ov, kid);
    return;
  }

  const levelLabel = EXAM_LEVEL_LABELS[levelId] || levelId;
  let quiz;
  try {
    quiz = await api.grammarQuizForDay(kid.id, todayKey, 'millionaire');
    if (!quiz) {
      renderAiBox(ov, `<p class="r99-ai-msg">🤖 AI đang soạn 15 câu hỏi tăng dần độ khó (${levelLabel})…</p>`);
      const settings = api.cachedSettings() || await api.getSettings();
      if (!aiProvider.resolveProvider(settings).apiKey) {
        renderAiBox(ov, '<p class="r99-ai-msg">⚠️ Chưa cấu hình key AI — nhờ phụ huynh vào Trang Phụ Huynh &gt; Cài đặt &gt; 🤖 Trợ Lý AI.</p>');
        return;
      }
      const questions = await aiProvider.generateMillionaireQuiz(settings, { levelLabel, count: TOTAL_QUESTIONS });
      if (questions.length < TOTAL_QUESTIONS) throw new Error('AI soạn thiếu câu, thử lại nhé');
      quiz = await api.saveGrammarQuiz(kid.id, { level: levelId, questions, quizType: 'millionaire' }, todayKey);
    }
  } catch (e) {
    renderAiBox(ov, `<p class="r99-ai-msg">⚠️ ${e.message}</p>`);
    return;
  }

  const questions = quiz.questions;
  const draft = loadDraft(kid.id, quiz.id);
  if (draft?.index > 0 && draft.index < TOTAL_QUESTIONS) {
    renderQuestion(ov, { levelLabel, questions, quizId: quiz.id, kid, say, index: draft.index });
  } else {
    renderIntro(ov, { levelLabel, questions, quizId: quiz.id, kid, say });
  }
}

function renderAlreadyPlayed(ov, kid) {
  const stars = kid.settings?.millionaireLastStars || 0;
  const streak = kid.settings?.millionaireLastCorrectStreak || 0;
  renderAiBox(ov, `
    <h3>🏆 Ai Là Triệu Phú</h3>
    <div class="r99-mp-played">
      ✅ Hôm nay bé đã chơi rồi!<br>
      Trả lời đúng liên tục <b>${streak}/${TOTAL_QUESTIONS}</b> câu — nhận được <b>⭐ ${formatStars(stars)} sao</b>.<br>
      Mai bé quay lại chơi tiếp nhé!
    </div>
    ${renderLadderHtml(0, streak)}
    <button type="button" class="r99-ai-btn ghost" id="mpCloseBtn">Đóng</button>
  `);
  ov.querySelector('#mpCloseBtn').addEventListener('click', () => closeAiOverlay(ov));
}

function renderIntro(ov, ctx) {
  const { levelLabel } = ctx;
  renderAiBox(ov, `
    <h3>🏆 Ai Là Triệu Phú</h3>
    <p style="font-size:13px;color:#5d5370;margin:0 0 8px">Cấp độ: <b>${levelLabel}</b> — ${TOTAL_QUESTIONS} câu, càng về sau càng khó. Trả lời ĐÚNG LIÊN TỤC để leo lên thang sao; SAI bất kỳ câu nào thì dừng lại — bé chỉ giữ được số sao của mốc 🏁 (câu 5/10/15) đã qua trọn vẹn gần nhất, mất hết số sao đang leo dở trong mốc đó.</p>
    ${renderLadderHtml(0, 0)}
    <button type="button" class="r99-ai-btn" id="mpStartBtn">BẮT ĐẦU ▶</button>
  `);
  ov.querySelector('#mpStartBtn').addEventListener('click', () => renderQuestion(ov, { ...ctx, index: 0 }));
}

function renderQuestion(ov, ctx) {
  const { questions, index } = ctx;
  const q = questions[index];
  const qNum = index + 1;
  renderAiBox(ov, `
    <h3 style="font-size:15px">Câu ${qNum}/${TOTAL_QUESTIONS} ${isMilestone(qNum) ? '🏁 MỐC AN TOÀN' : ''}</h3>
    ${renderLadderHtml(qNum, index)}
    <div class="r99-ai-q">${q.prompt}</div>
    <div id="mpOpts">
      ${q.options.map((o, i) => `<button type="button" class="r99-ai-opt" data-i="${i}">${String.fromCharCode(65 + i)}. ${o}</button>`).join('')}
    </div>
  `);
  ov.querySelectorAll('#mpOpts .r99-ai-opt').forEach((btn) => {
    btn.addEventListener('click', () => answerQuestion(ov, ctx, Number(btn.dataset.i)));
  });
}

function answerQuestion(ov, ctx, picked) {
  const { questions, index, kid, quizId } = ctx;
  const q = questions[index];
  const correct = picked === q.answer;
  ov.querySelectorAll('#mpOpts .r99-ai-opt').forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.answer) btn.classList.add('correct');
    else if (i === picked) btn.classList.add('wrong');
  });
  const explain = document.createElement('div');
  explain.className = 'r99-ai-explain';
  explain.style.marginTop = '8px';
  explain.textContent = q.explanations[picked];
  ov.querySelector('#mpOpts').insertAdjacentElement('afterend', explain);

  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'r99-ai-btn';
  const qNum = index + 1;
  if (correct && qNum < TOTAL_QUESTIONS) {
    nextBtn.textContent = 'CÂU TIẾP THEO ▶';
    nextBtn.addEventListener('click', () => {
      saveDraft(kid.id, quizId, { index: index + 1 });
      renderQuestion(ov, { ...ctx, index: index + 1 });
    });
  } else {
    nextBtn.textContent = 'XEM KẾT QUẢ ▶';
    const correctStreak = correct ? qNum : index; // đúng hết Q15 -> streak=15; sai câu này -> streak = số câu ĐÃ đúng trước đó
    nextBtn.addEventListener('click', () => finishGame(ov, ctx, correctStreak));
  }
  explain.insertAdjacentElement('afterend', nextBtn);
}

async function finishGame(ov, ctx, correctStreak) {
  const { kid, say, quizId } = ctx;
  clearDraft(kid.id, quizId);
  renderAiBox(ov, '<p class="r99-ai-msg">Đang lưu kết quả…</p>');
  const stars = computeStarsEarned(correctStreak);
  const todayKey = api.dateKeyOffset(0);
  try {
    await api.claimMillionaireResult(kid.id, { stars, correctStreak }, todayKey);
    if (stars > 0) refreshStarBadge();
  } catch { /* mất mạng: bé vẫn xem được kết quả, thử lại coi như chưa chơi (không mất lượt) */ }

  const won = correctStreak >= TOTAL_QUESTIONS;
  const emoji = won ? '🏆' : stars > 0 ? '🎉' : '💪';
  const msg = won
    ? `Xuất sắc! Bé trả lời đúng TRỌN VẸN cả ${TOTAL_QUESTIONS} câu!`
    : stars > 0
      ? `Bé dừng lại ở câu ${correctStreak + 1} nhưng đã giữ được mốc an toàn gần nhất!`
      : `Bé dừng lại ở câu ${correctStreak + 1} — chưa qua được mốc an toàn đầu tiên, mai chơi lại nhé!`;
  renderAiBox(ov, `
    <div class="r99-mp-result">${emoji}</div>
    <p style="text-align:center;font-weight:800;font-size:15px">${msg}</p>
    <div class="r99-ai-score">⭐ ${formatStars(stars)} sao</div>
    ${renderLadderHtml(0, correctStreak)}
    <p style="font-size:12px;color:#5d5370;text-align:center;margin-top:8px">Mỗi ngày chỉ chơi được 1 lần — hẹn bé ngày mai nhé!</p>
    <button type="button" class="r99-ai-btn ghost" id="mpCloseBtn">Đóng</button>
  `);
  say(`${msg} Bé nhận được ${formatStars(stars)} sao!`, { lang: 'vi-VN', rate: 0.92 });
  ov.querySelector('#mpCloseBtn').addEventListener('click', () => closeAiOverlay(ov));
}
