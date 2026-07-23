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

import * as api from './api.js';
import { generatePassages, gradeTranslation } from './groq.js';
import { EXAM_LEVEL_LABELS } from './report.js';
import { shuffleVocabColumns, vocabAnswerKey } from '../exam-prep/src/translate.js';
import { openAiOverlay, closeAiOverlay, renderAiBox, buildEntryButton } from './ai-overlay.js';

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
      api.kidTranslationSubmissions(kid.id, 30),
    ]);
    if (!passages.length) {
      renderAiBox(ov, `<p class="r99-ai-msg">🤖 AI đang soạn 3 bài dịch mới cho hôm nay (${levelLabel})…</p>`);
      const settings = api.cachedSettings() || await api.getSettings();
      const apiKey = settings?.ai_api_key;
      if (!apiKey) {
        renderAiBox(ov, '<p class="r99-ai-msg">⚠️ Chưa cấu hình key AI — nhờ phụ huynh vào Trang Phụ Huynh &gt; Cài đặt &gt; 🤖 Trợ Lý AI.</p>');
        return;
      }
      const generated = await generatePassages({ apiKey, levelLabel, count: 3 });
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

function renderList(ov, ctx) {
  const { levelLabel, passages, submissions } = ctx;
  const cardsHtml = passages.map((p, i) => {
    const sub = latestSubmissionFor(submissions, p.id);
    return `<div class="r99-ai-card" data-idx="${i}">
      ${i + 1}. ${p.title}
      ${sub ? `<div class="done">✅ Đã làm — điểm ${sub.ai_score ?? '—'}/100</div>` : '<div style="font-size:12.5px;color:#5d5370;font-weight:600">Chưa làm</div>'}
    </div>`;
  }).join('');
  renderAiBox(ov, `
    <h3>📝 Luyện Dịch</h3>
    <p style="font-size:13px;color:#5d5370;margin:0 0 10px">Cấp độ: <b>${levelLabel}</b> — chọn 1 trong 3 bài hôm nay để dịch:</p>
    ${cardsHtml}
  `);
  ov.querySelectorAll('.r99-ai-card').forEach((card) => {
    card.addEventListener('click', () => renderWork(ov, { ...ctx, passage: passages[Number(card.dataset.idx)] }));
  });
}

function renderWork(ov, ctx) {
  const { passage } = ctx;
  renderAiBox(ov, `
    <h3 style="font-size:15px">${passage.title}</h3>
    <div class="r99-ai-passage">${passage.passage_en}</div>
    <textarea id="trInput" rows="4" placeholder="Bé dịch đoạn văn trên sang tiếng Việt ở đây..."></textarea>
    <button type="button" class="r99-ai-btn" id="trSubmitBtn">NỘP BÀI DỊCH ▶</button>
    <p class="r99-ai-msg" id="trMsg"></p>
  `);
  const btn = ov.querySelector('#trSubmitBtn');
  const msg = ov.querySelector('#trMsg');
  btn.addEventListener('click', async () => {
    const text = ov.querySelector('#trInput').value.trim();
    if (!text) { msg.textContent = 'Bé viết bản dịch vào ô trên đã nhé!'; return; }
    btn.disabled = true;
    msg.textContent = '🤖 AI đang chấm bài…';
    try {
      const settings = api.cachedSettings() || await api.getSettings();
      const grade = await gradeTranslation({ apiKey: settings?.ai_api_key, passageEn: passage.passage_en, submittedVi: text });
      renderFeedback(ov, { ...ctx, submittedText: text, grade });
    } catch (e) {
      msg.textContent = `⚠️ ${e.message}`;
      btn.disabled = false;
    }
  });
}

function renderFeedback(ov, ctx) {
  const { grade, say } = ctx;
  renderAiBox(ov, `
    <div class="r99-ai-score">${grade.score}/100</div>
    <div class="r99-ai-feedback">💬 ${grade.feedback}</div>
    <button type="button" class="r99-ai-btn" id="trNextBtn">Tiếp theo: Nối từ vựng ▶</button>
  `);
  say(grade.feedback, { lang: 'vi-VN', rate: 0.92 });
  ov.querySelector('#trNextBtn').addEventListener('click', () => renderMatch(ov, ctx));
}

function renderMatch(ov, ctx) {
  const { passage } = ctx;
  const vocab = passage.vocab || [];
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
      msg.textContent = '🎉 Xong rồi! Đang lưu bài…';
      finish(ov, { ...ctx, vocabCorrect: correct, vocabTotal: total });
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
  const { passage, submittedText, grade, vocabCorrect, vocabTotal } = ctx;
  try {
    await api.submitTranslation(passage.id, {
      submittedText, aiScore: grade.score, aiFeedback: grade.feedback, vocabCorrect, vocabTotal,
    });
  } catch { /* mất mạng lúc lưu: bé vẫn đã hoàn thành, không chặn */ }
  renderAiBox(ov, `
    <div style="font-size:56px;text-align:center">🏆</div>
    <p style="text-align:center;font-weight:800;font-size:15px">Hoàn thành bài dịch! Điểm AI: ${grade.score}/100 · Nối từ: ${vocabCorrect}/${vocabTotal}</p>
    <button type="button" class="r99-ai-btn ghost" id="trBackBtn">Về danh sách bài hôm nay</button>
  `);
  ov.querySelector('#trBackBtn').addEventListener('click', () => closeAiOverlay(ov));
}
