// "📝 Luyện Dịch" — đoạn văn ngắn AI tự sinh (3 bài/ngày/bé) + bé dịch sang
// tiếng Việt (chấm theo Ý NGHĨA, KHÔNG bắt đúng nguyên văn từng chữ) + nối từ
// vựng quan trọng sau khi được chấm + gửi bài cho phụ huynh xem lại (Trang
// Phụ Huynh > tab bé > 📝 Bài Dịch).
//
// Dùng CHUNG cho MỌI trang luyện thi (exam-prep có 3 cấp — Starters/Movers/
// Flyers — LẪN 4 bản "khoá cấp độ" luyen-thi-ket/pet/toefl-junior/toeic) —
// dùng chung khung overlay ở shared/ai-overlay.js, không cần mỗi trang phải
// tự viết lại HTML/CSS cho từng bước. Chỉ hiện nút vào khi phụ huynh đã đặt
// ĐÚNG cấp độ này làm "Cấp độ dùng cho Luyện Dịch" ở Trang Phụ Huynh > Cài
// đặt bé (mỗi bé chỉ 1 cấp độ, xem games.md).
//
// LƯU Ý "TỰ ĐỘNG mỗi ngày": app tĩnh này không có server/cron riêng để chạy
// theo lịch — "tự động" ở đây nghĩa là AI soạn 3 bài MỚI ngay khi bé (hoặc
// phụ huynh) mở mục Luyện Dịch LẦN ĐẦU TIÊN trong ngày đó (rồi lưu lại dùng
// chung cho cả ngày, không sinh thêm nếu mở lại) — xem "còn để ngỏ" ở games.md.
//
// LUỒNG NỘP BÀI (quan trọng — đã sửa sau phản hồi "AI lỗi thì mất bài"):
// bé bấm "Nộp bài dịch" -> LƯU NGAY submitted_text lên server (BƯỚC 1, chưa
// cần AI) -> mới thử nhờ AI chấm (BƯỚC 2, có thể lỗi/hết quota mà KHÔNG mất
// bài đã lưu) -> nối từ vựng (BƯỚC 3, độc lập với việc AI đã chấm hay chưa).
// Nếu bé nộp bài dịch xong nhưng bỏ dở phần nối từ vựng, lần sau bấm vào bài
// đó sẽ TIẾP TỤC đúng chỗ nối từ vựng, không bắt gõ lại từ đầu. Nếu AI chấm
// lỗi, có thử chấm lại NGẦM mỗi lần mở danh sách, và chấm lại NGAY nếu bé mở
// đúng bài đó ra.

import * as api from './api.js';
import * as aiProvider from './ai-provider.js';
import { EXAM_LEVEL_LABELS } from './report.js';
import { shuffleVocabColumns, vocabAnswerKey } from '../exam-prep/src/translate.js';
import { openAiOverlay, closeAiOverlay, renderAiBox, buildEntryButton } from './ai-overlay.js';
import { DAILY_PRACTICE_BONUS_STARS, isQuotaComplete, quotaProgress } from './daily-bonus.js';
import { REUSE_WINDOW_DAYS } from './content-reuse.js';
import { refreshStarBadge } from './kid-bar.js';

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

/* ===== Bản nháp đang gõ dở (localStorage) — sống sót qua xoay màn hình/đổi
   app/mất mạng giữa chừng, chỉ mất khi bé bấm nộp bài thành công. ===== */

function draftKey(kidId, passageId) {
  return `r99-tr-draft:${kidId}:${passageId}`;
}
function loadDraft(kidId, passageId) {
  try { return JSON.parse(localStorage.getItem(draftKey(kidId, passageId))); } catch { return null; }
}
function saveDraft(kidId, passageId, data) {
  try { localStorage.setItem(draftKey(kidId, passageId), JSON.stringify(data)); } catch { /* ignore */ }
}
function clearDraft(kidId, passageId) {
  try { localStorage.removeItem(draftKey(kidId, passageId)); } catch { /* ignore */ }
}

/**
 * Trả về 1 nút <button> "📝 Luyện Dịch" nếu bé đang chọn CÓ cấu hình đúng
 * `levelId` này làm cấp độ Luyện Dịch (Trang Phụ Huynh > Cài đặt bé), hoặc
 * `null` nếu không áp dụng (chưa chọn bé/level không khớp/chưa cấu hình) —
 * bên gọi tự quyết định chèn nút vào đâu trong màn hình của mình.
 */
export function buildTranslateEntryButton(levelId, opts = {}) {
  const kid = api.currentKidInfo();
  const cfgLevel = kid?.settings?.translationLevel;
  if (!kid || !cfgLevel || cfgLevel !== levelId) return null;
  return buildEntryButton('📝 Luyện Dịch — 3 bài hôm nay', () => openTranslateOverlay(levelId, opts));
}

async function openTranslateOverlay(levelId, { speak } = {}) {
  const say = typeof speak === 'function' ? speak : () => {};
  const ov = openAiOverlay();
  renderAiBox(ov, '<h3>📝 Luyện Dịch</h3><p class="r99-ai-msg">Đang tải…</p>');

  const kid = api.currentKidInfo();
  if (!kid) { renderAiBox(ov, '<p class="r99-ai-msg">Cần chọn hồ sơ bé trước ở /chon-be/.</p>'); return; }
  if (!(await api.ready().catch(() => false))) {
    renderAiBox(ov, '<p class="r99-ai-msg">Cần cấu hình server + đăng nhập phụ huynh trước — xem Trang Phụ Huynh.</p>');
    return;
  }

  const levelLabel = EXAM_LEVEL_LABELS[levelId] || levelId;

  let passages;
  let submissions;
  try {
    [passages, submissions] = await Promise.all([
      api.todayPassages(kid.id),
      api.kidTranslationSubmissions(kid.id, 60), // đủ lịch sử cho mục "Ôn lại bài cũ" (45 ngày)
    ]);
    if (!passages.length) {
      // Thử TÁI SỬ DỤNG nội dung có sẵn của cả nhà trước (tiết kiệm AI, tự
      // nhiên thành ôn tập, anh/chị/em không trùng bài — xem shared/content-
      // reuse.js) — chỉ gọi AI khi không tìm được gì phù hợp.
      passages = await api.ensureTranslationPassages(kid.id, levelId, api.dateKeyOffset(0));
    }
    if (!passages.length) {
      renderAiBox(ov, `<p class="r99-ai-msg">🤖 AI đang soạn 3 bài dịch mới cho hôm nay (${levelLabel})…</p>`);
      const settings = api.cachedSettings() || await api.getSettings();
      if (!aiProvider.resolveProvider(settings).apiKey) {
        renderAiBox(ov, '<p class="r99-ai-msg">⚠️ Chưa cấu hình key AI — nhờ phụ huynh vào Trang Phụ Huynh &gt; Cài đặt &gt; 🤖 Trợ Lý AI.</p>');
        return;
      }
      const weakSummary = await api.weakPointsSummaryText(kid.id).catch(() => '');
      const generated = await aiProvider.generatePassages(settings, { levelLabel, count: 3, weakSummary });
      passages = await api.savePassages(kid.id, generated.map((p) => ({ level: levelId, ...p })));
    }
  } catch (e) {
    renderAiBox(ov, `<p class="r99-ai-msg">⚠️ ${e.message}</p>`);
    return;
  }

  renderList(ov, { levelLabel, passages, submissions, kid, say });
}

function latestSubmissionFor(submissions, passageId) {
  return submissions.find((s) => s.passage_id === passageId) || null;
}

/** Bài đã dịch VÀ đã nối từ vựng xong — "hoàn thành" đúng nghĩa để tính %/thưởng. */
function isFullyDone(sub) {
  return !!sub && sub.vocab_total > 0;
}

/** Bài CŨ (không thuộc "hôm nay") bé từng làm trong REUSE_WINDOW_DAYS ngày
 * gần đây — mỗi bài gốc chỉ liệt kê 1 lần (lần nộp gần nhất) — để bé "làm
 * lại" ôn tập, tạo 1 lượt nộp MỚI trên CÙNG bài dịch cũ đó. */
function recentOldPassages(passages, submissions) {
  const todayIds = new Set(passages.map((p) => p.id));
  const cutoff = Date.now() - REUSE_WINDOW_DAYS * 86400000;
  const seen = new Set();
  const out = [];
  for (const s of submissions) {
    if (todayIds.has(s.passage_id) || seen.has(s.passage_id)) continue;
    if (!s.submitted_at || new Date(s.submitted_at).getTime() < cutoff) continue;
    seen.add(s.passage_id);
    out.push(s);
  }
  return out;
}

function renderList(ov, ctx) {
  const { levelLabel, passages, submissions } = ctx;
  const doneCount = passages.filter((p) => isFullyDone(latestSubmissionFor(submissions, p.id))).length;
  const total = passages.length;
  const pct = Math.round(quotaProgress(doneCount, total) * 100);
  const done = isQuotaComplete(doneCount, total);
  const cardsHtml = passages.map((p, i) => {
    const sub = latestSubmissionFor(submissions, p.id);
    let statusHtml;
    if (!sub) statusHtml = '<div style="font-size:12.5px;color:#5d5370;font-weight:600">Chưa làm</div>';
    else if (!isFullyDone(sub)) statusHtml = '<div style="font-size:12.5px;color:#b45309;font-weight:700">⏳ Đã nộp bài dịch — bấm để làm tiếp phần nối từ vựng</div>';
    else statusHtml = `<div class="done">✅ Đã làm — điểm ${sub.ai_score ?? '⏳ đang chờ chấm'}${sub.ai_score != null ? '/100' : ''}</div>`;
    return `<div class="r99-ai-card" data-idx="${i}">
      ${i + 1}. ${p.title}
      ${statusHtml}
    </div>`;
  }).join('');
  const oldItems = recentOldPassages(passages, submissions);
  const oldHtml = oldItems.length ? `
    <p style="font-size:12.5px;color:#5d5370;font-weight:700;margin:16px 0 6px">📚 Ôn lại bài cũ (làm lại để nhớ lâu hơn):</p>
    ${oldItems.map((s, i) => `<div class="r99-ai-card" data-old-idx="${i}">
      ${escapeHtml(s.translation_passages?.title || '(không rõ tiêu đề)')}
      <div style="font-size:12px;color:#5d5370">Điểm lần trước: ${s.ai_score ?? '—'}${s.ai_score != null ? '/100' : ''}</div>
    </div>`).join('')}` : '';
  renderAiBox(ov, `
    <h3>📝 Luyện Dịch</h3>
    <p style="font-size:13px;color:#5d5370;margin:0 0 6px">Cấp độ: <b>${levelLabel}</b> — chọn 1 trong ${total} bài hôm nay để dịch:</p>
    <div class="r99-ai-progress"><div class="r99-ai-progress-fill" style="width:${pct}%"></div></div>
    <p class="r99-ai-progress-text">${done
      ? `🎉 Xong hết ${total}/${total} bài hôm nay — được thưởng +${DAILY_PRACTICE_BONUS_STARS} sao!`
      : `Làm xong hết ${total} bài hôm nay để được thưởng +${DAILY_PRACTICE_BONUS_STARS} sao (đã làm ${doneCount}/${total})`}</p>
    ${cardsHtml}
    ${oldHtml}
  `);
  ov.querySelectorAll('.r99-ai-card[data-idx]').forEach((card) => {
    card.addEventListener('click', () => {
      const passage = passages[Number(card.dataset.idx)];
      const sub = latestSubmissionFor(submissions, passage.id);
      const nextCtx = { ...ctx, passage };
      if (sub && !isFullyDone(sub)) resumeUnfinished(ov, nextCtx, sub);
      else if (sub) reviewDone(ov, nextCtx, sub);
      else renderWork(ov, nextCtx);
    });
  });
  ov.querySelectorAll('.r99-ai-card[data-old-idx]').forEach((card) => {
    card.addEventListener('click', () => {
      const s = oldItems[Number(card.dataset.oldIdx)];
      const passage = {
        id: s.passage_id,
        title: s.translation_passages?.title || '',
        passage_en: s.translation_passages?.passage_en || '',
        vocab: s.translation_passages?.vocab || [],
      };
      renderWork(ov, { ...ctx, passage });
    });
  });

  // Thử chấm lại NGẦM cho bài đã nộp nhưng AI chưa chấm được lần trước (lỗi
  // mạng/hết quota) — không chặn giao diện, chỉ âm thầm cập nhật lên server.
  for (const p of passages) {
    const sub = latestSubmissionFor(submissions, p.id);
    if (sub && sub.ai_score == null) backgroundRegrade(p, sub);
  }
}

async function backgroundRegrade(passage, submission) {
  try {
    const settings = api.cachedSettings() || await api.getSettings();
    if (!aiProvider.resolveProvider(settings).apiKey) return;
    const grade = await aiProvider.gradeTranslation(settings, { passageEn: passage.passage_en, submittedVi: submission.submitted_text });
    await api.updateTranslationGrade(submission.id, { aiScore: grade.score, aiFeedback: grade.feedback, aiReferenceVi: grade.referenceVi });
  } catch { /* vẫn lỗi — thử lại lần sau khi bé mở lại mục này */ }
}

function renderWork(ov, ctx) {
  const { passage, kid } = ctx;
  const draft = loadDraft(kid.id, passage.id);
  const startedAt = draft?.startedAt || Date.now();
  renderAiBox(ov, `
    <h3 style="font-size:15px">${passage.title}</h3>
    <div class="r99-ai-passage">${passage.passage_en}</div>
    <textarea id="trInput" rows="4" placeholder="Bé dịch đoạn văn trên sang tiếng Việt ở đây...">${escapeHtml(draft?.text)}</textarea>
    <button type="button" class="r99-ai-btn" id="trSubmitBtn">NỘP BÀI DỊCH ▶</button>
    <p class="r99-ai-msg" id="trMsg">${draft?.text ? 'Đã khôi phục bản nháp bé gõ dở lần trước.' : ''}</p>
  `);
  const input = ov.querySelector('#trInput');
  const btn = ov.querySelector('#trSubmitBtn');
  const msg = ov.querySelector('#trMsg');

  let saveTimer = null;
  input.addEventListener('input', () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => saveDraft(kid.id, passage.id, { text: input.value, startedAt }), 400);
  });

  btn.addEventListener('click', async () => {
    const text = input.value.trim();
    if (!text) { msg.textContent = 'Bé viết bản dịch vào ô trên đã nhé!'; return; }
    btn.disabled = true;
    msg.textContent = 'Đang lưu bài…';
    const secondsSpent = Math.max(1, Math.round((Date.now() - startedAt) / 1000));

    // BƯỚC 1 — lưu bài NGAY, trước khi nhờ AI chấm (AI lỗi thì bài vẫn còn).
    let submission;
    try {
      submission = await api.submitTranslationDraft(passage.id, { submittedText: text, secondsSpent });
    } catch (e) {
      msg.textContent = `⚠️ Không lưu được bài (${e.message}) — kiểm tra mạng rồi bấm nộp lại, bản nháp vẫn được giữ.`;
      btn.disabled = false;
      return;
    }
    clearDraft(kid.id, passage.id);

    // BƯỚC 2 — nhờ AI chấm (lỗi/hết quota cũng KHÔNG mất bài đã lưu ở bước 1).
    msg.textContent = '🤖 AI đang chấm bài…';
    let grade = null;
    try {
      const settings = api.cachedSettings() || await api.getSettings();
      grade = await aiProvider.gradeTranslation(settings, { passageEn: passage.passage_en, submittedVi: text });
      await api.updateTranslationGrade(submission.id, { aiScore: grade.score, aiFeedback: grade.feedback, aiReferenceVi: grade.referenceVi });
    } catch { /* AI lỗi: bài đã an toàn, chấm lại sau (renderList/resumeUnfinished tự thử lại) */ }
    renderFeedback(ov, { ...ctx, submission, grade });
  });
}

/** Bé quay lại 1 bài ĐÃ NỘP nhưng CHƯA nối từ vựng xong — tiếp tục đúng chỗ,
 * không bắt gõ lại bản dịch. Nếu AI chưa chấm được lần trước, thử chấm lại
 * ngay lúc này (bé đang chờ ở đây, không cần đợi lần retry ngầm sau). */
async function resumeUnfinished(ov, ctx, sub) {
  const { passage } = ctx;
  let grade = sub.ai_score != null
    ? { score: sub.ai_score, feedback: sub.ai_feedback, referenceVi: sub.ai_reference_vi }
    : null;
  if (!grade) {
    renderAiBox(ov, '<p class="r99-ai-msg">🤖 Đang thử chấm lại bài dịch của bé…</p>');
    try {
      const settings = api.cachedSettings() || await api.getSettings();
      grade = await aiProvider.gradeTranslation(settings, { passageEn: passage.passage_en, submittedVi: sub.submitted_text });
      await api.updateTranslationGrade(sub.id, { aiScore: grade.score, aiFeedback: grade.feedback, aiReferenceVi: grade.referenceVi });
    } catch { grade = null; }
  }
  renderFeedback(ov, { ...ctx, submission: sub, grade });
}

/** Bé xem lại 1 bài ĐÃ hoàn thành hết (đã nộp + đã nối từ vựng) — chỉ đọc. */
function reviewDone(ov, ctx, sub) {
  const grade = sub.ai_score != null
    ? { score: sub.ai_score, feedback: sub.ai_feedback, referenceVi: sub.ai_reference_vi }
    : null;
  renderAiBox(ov, `
    <h3 style="font-size:15px">${ctx.passage.title}</h3>
    <p style="margin:6px 0"><b>Bản dịch của bé:</b> ${escapeHtml(sub.submitted_text)}</p>
    ${grade
      ? `<div class="r99-ai-score">${grade.score}/100</div>
         <div class="r99-ai-feedback">💬 ${grade.feedback}</div>
         ${grade.referenceVi ? `<div class="r99-ai-feedback"><b>📖 Bản dịch mẫu của AI:</b><br>${grade.referenceVi}</div>` : ''}`
      : '<p class="r99-ai-msg">⏳ AI chưa chấm được bài này, đang tự thử lại...</p>'}
    <p style="font-size:13px;color:#5d5370;margin:8px 0 0">Nối từ vựng: ${sub.vocab_correct}/${sub.vocab_total}</p>
    <button type="button" class="r99-ai-btn ghost" id="trBackBtn">Về danh sách bài hôm nay</button>
  `);
  ov.querySelector('#trBackBtn').addEventListener('click', () => renderList(ov, ctx));
}

function renderFeedback(ov, ctx) {
  const { grade, say } = ctx;
  const gradedHtml = grade
    ? `<div class="r99-ai-score">${grade.score}/100</div>
       <div class="r99-ai-feedback">💬 ${grade.feedback}</div>
       ${grade.referenceVi ? `<div class="r99-ai-feedback"><b>📖 Bản dịch mẫu của AI:</b><br>${grade.referenceVi}</div>` : ''}`
    : '<p class="r99-ai-msg">⏳ Bài dịch của bé đã được lưu an toàn, nhưng AI chưa chấm được ngay lúc này (lỗi mạng/hết quota) — điểm sẽ tự cập nhật sau, bé làm tiếp phần nối từ vựng nhé!</p>';
  renderAiBox(ov, `
    ${gradedHtml}
    <button type="button" class="r99-ai-btn" id="trNextBtn">Tiếp theo: Nối từ vựng ▶</button>
  `);
  if (grade) say(grade.feedback, { lang: 'vi-VN', rate: 0.92 });
  ov.querySelector('#trNextBtn').addEventListener('click', () => {
    try {
      renderMatch(ov, ctx);
    } catch (e) {
      renderAiBox(ov, `<p class="r99-ai-msg">⚠️ ${e.message} — bấm ✕ rồi vào lại bài này thử lại nhé.</p>`);
    }
  });
}

function renderMatch(ov, ctx) {
  const { passage } = ctx;
  const vocab = passage.vocab || [];
  // Phòng trường hợp bài cũ/lỗi dữ liệu không có từ vựng nào (không có gì để
  // nối) — tự tính xong luôn thay vì hiện màn trống khiến bé bấm không thấy
  // gì xảy ra.
  if (!vocab.length) {
    finish(ov, { ...ctx, vocabCorrect: 0, vocabTotal: 0, wrongWords: [] });
    return;
  }
  const { words, meanings } = shuffleVocabColumns(vocab);
  const answerKey = vocabAnswerKey(vocab);
  const matchState = new Map(vocab.map((v) => [v.word, { matched: false, wrongOnce: false }]));
  let selectedWord = null;

  renderAiBox(ov, `
    <h3 style="font-size:15px">Nối từ với nghĩa</h3>
    <p style="font-size:13px;color:#5d5370;margin:0 0 4px">Chạm 1 từ tiếng Anh rồi chạm đúng nghĩa tiếng Việt bên cạnh.</p>
    <div class="r99-ai-cols">
      <div class="r99-ai-col" id="trWordCol">${words.map((w) => `<div class="r99-ai-chip" data-word="${w}">${w}</div>`).join('')}</div>
      <div class="r99-ai-col" id="trMeaningCol">${meanings.map((m) => `<div class="r99-ai-chip" data-meaning="${m}">${m}</div>`).join('')}</div>
    </div>
    <p class="r99-ai-msg" id="trMatchMsg"></p>
  `);

  const wordEls = [...ov.querySelectorAll('[data-word]')];
  const meaningEls = [...ov.querySelectorAll('[data-meaning]')];
  const msg = ov.querySelector('#trMatchMsg');

  function checkDone() {
    if ([...matchState.values()].every((v) => v.matched)) {
      const total = vocab.length;
      const correct = [...matchState.values()].filter((v) => !v.wrongOnce).length;
      const wrongWords = [...matchState.entries()].filter(([, v]) => v.wrongOnce).map(([word]) => word);
      msg.textContent = '🎉 Xong rồi! Đang lưu bài…';
      finish(ov, { ...ctx, vocabCorrect: correct, vocabTotal: total, wrongWords });
    }
  }

  wordEls.forEach((el) => {
    el.addEventListener('click', () => {
      if (el.classList.contains('matched')) return;
      wordEls.forEach((w) => w.classList.remove('sel'));
      el.classList.add('sel');
      selectedWord = el.dataset.word;
    });
  });
  meaningEls.forEach((el) => {
    el.addEventListener('click', () => {
      if (el.classList.contains('matched') || !selectedWord) return;
      const wordEl = wordEls.find((w) => w.dataset.word === selectedWord);
      if (answerKey.get(selectedWord) === el.dataset.meaning) {
        wordEl.classList.remove('sel');
        wordEl.classList.add('matched');
        el.classList.add('matched');
        matchState.get(selectedWord).matched = true;
        selectedWord = null;
        checkDone();
      } else {
        matchState.get(selectedWord).wrongOnce = true;
        el.classList.add('wrong');
        setTimeout(() => el.classList.remove('wrong'), 500);
      }
    });
  });
}

async function finish(ov, ctx) {
  const { submission, grade, vocabCorrect, vocabTotal, wrongWords, kid, say } = ctx;
  try {
    await api.updateTranslationVocab(submission.id, { vocabCorrect, vocabTotal });
  } catch { /* mất mạng lúc lưu nối từ: bé vẫn đã hoàn thành, không chặn */ }

  // Ghi "từ hay sai" (dùng lại đúng sổ miss_events sẵn có của các mini-game từ
  // vựng khác) — để cùng hiện trong "Từ cần ôn" của Trang Phụ Huynh + Ôn Tập Vui.
  if (wrongWords?.length) {
    api.recordMissBatch(wrongWords.map((word) => ({ word, delta: 1 }))).catch(() => {});
  }

  let bonusHtml = '';
  try {
    const [passages, submissions] = await Promise.all([
      api.todayPassages(kid.id), api.kidTranslationSubmissions(kid.id, 30),
    ]);
    const doneCount = passages.filter((p) => isFullyDone(submissions.find((s) => s.passage_id === p.id))).length;
    if (isQuotaComplete(doneCount, passages.length)) {
      const granted = await api.claimDailyPracticeBonus(kid.id, 'trRewardedDay', api.dateKeyOffset(0), 'luyen-dich:hoan-thanh');
      if (granted) {
        bonusHtml = `<p class="r99-ai-bonus">🌟 Hoàn thành hết ${passages.length}/${passages.length} bài dịch hôm nay — thưởng +${DAILY_PRACTICE_BONUS_STARS} sao!</p>`;
        refreshStarBadge();
      }
    }
  } catch { /* mất mạng lúc thưởng: không chặn bé xem kết quả bài dịch */ }

  const scoreLine = grade ? `Điểm AI: ${grade.score}/100` : 'Điểm AI: đang chờ chấm lại';
  renderAiBox(ov, `
    <div style="font-size:56px;text-align:center">🏆</div>
    <p style="text-align:center;font-weight:800;font-size:15px">Hoàn thành bài dịch! ${scoreLine} · Nối từ: ${vocabCorrect}/${vocabTotal}</p>
    ${bonusHtml}
    <button type="button" class="r99-ai-btn ghost" id="trBackBtn">Về danh sách bài hôm nay</button>
  `);
  if (bonusHtml) say('Chúc mừng! Bé đã hoàn thành hết bài dịch hôm nay, được thưởng thêm 5 sao!', { lang: 'vi-VN', rate: 0.92 });
  ov.querySelector('#trBackBtn').addEventListener('click', () => closeAiOverlay(ov));
}
