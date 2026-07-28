// 🖨️ In Bài Tập — phụ huynh dùng AI soạn 2 loại tài liệu để in ra giấy A4:
// 1) Đề thi chuẩn (trắc nghiệm ngữ pháp/từ vựng hoặc luyện dịch), theo đúng
//    cấp độ/chuẩn thi đã có trong hệ thống (Starters..TOEIC, Ngữ Pháp Trực
//    Quan) — CÓ đáp án ở trang riêng cuối tài liệu.
// 2) Bài tập kiểu "bài đăng mạng xã hội" (giống giao diện TikTok/Instagram)
//    — caption + bình luận tiếng Anh hài hước cho bé dịch, đáp án ở trang cuối.
// Đây là công cụ TẠO-RỒI-IN thuần tuý: KHÔNG lưu vào translation_passages/
// grammar_quizzes (không ảnh hưởng nhiệm vụ/streak/thưởng sao hằng ngày của
// bé) — mỗi lần bấm "Tạo" là 1 lượt gọi AI mới, không tái sử dụng nội dung
// (khác cơ chế shared/content-reuse.js dùng cho bài học hằng ngày).

import * as api from '../../shared/api.js';
import * as aiProvider from '../../shared/ai-provider.js';
import { EXAM_LEVEL_LABELS } from '../../shared/report.js';

const $ = (id) => document.getElementById(id);

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function guide(html) {
  $('viewGuide').classList.remove('hidden');
  $('viewMain').classList.add('hidden');
  $('viewGuide').innerHTML = html;
}

async function boot() {
  if (!(await api.configured())) {
    guide('Chưa kết nối server — nhờ bố mẹ vào <a href="/phu-huynh/">Trang Phụ Huynh</a> cài đặt 1 lần nhé.');
    return;
  }
  if (!api.signedIn()) {
    guide('Cần đăng nhập phụ huynh trước — vào <a href="/phu-huynh/">Trang Phụ Huynh</a> đăng nhập rồi quay lại đây.');
    return;
  }
  $('viewGuide').classList.add('hidden');
  $('viewMain').classList.remove('hidden');
  buildLevelOptions();
}

function buildLevelOptions() {
  const sel = $('examLevel');
  sel.innerHTML = Object.entries(EXAM_LEVEL_LABELS).map(([id, label]) => `<option value="${id}">${label}</option>`).join('');
}

/* ===== Chuyển tab ===== */
document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('active', t === tab));
    $('examForm').classList.toggle('hidden', tab.dataset.mode !== 'exam');
    $('socialForm').classList.toggle('hidden', tab.dataset.mode !== 'social');
  });
});

$('examType').addEventListener('change', () => {
  $('examCountLabel').textContent = $('examType').value === 'translate' ? 'Số đoạn văn' : 'Số câu';
  $('examCount').value = $('examType').value === 'translate' ? 3 : 15;
});

/* ===== Đề thi chuẩn ===== */

$('btnGenExam').addEventListener('click', async () => {
  const err = $('examErr');
  const btn = $('btnGenExam');
  err.textContent = '';
  const levelId = $('examLevel').value;
  const levelLabel = EXAM_LEVEL_LABELS[levelId] || levelId;
  const examType = $('examType').value;
  const count = Math.max(1, Number($('examCount').value) || (examType === 'translate' ? 3 : 15));
  const kidName = $('examKidName').value.trim();

  btn.disabled = true;
  err.textContent = '🤖 AI đang soạn đề, chờ chút nhé…';
  err.style.color = 'var(--ink-dim)';
  try {
    const settings = api.cachedSettings() || await api.getSettings();
    if (!aiProvider.resolveProvider(settings).apiKey) {
      throw new Error('Chưa cấu hình key AI — vào Trang Phụ Huynh > Cài đặt > 🤖 Trợ Lý AI');
    }
    if (examType === 'translate') {
      const passages = await aiProvider.generatePassages(settings, { levelLabel, count });
      renderTranslateExamPrint({ kidName, levelLabel, passages });
    } else {
      const questions = await aiProvider.generateGrammarQuiz(settings, { levelLabel, count, quizType: examType });
      renderQuizExamPrint({
        kidName, levelLabel, questions,
        title: examType === 'vocab' ? 'ĐỀ TRẮC NGHIỆM TỪ VỰNG' : 'ĐỀ TRẮC NGHIỆM NGỮ PHÁP',
      });
    }
    err.textContent = '';
    showPreview(`${levelLabel} — ${count} ${examType === 'translate' ? 'đoạn văn' : 'câu'}`);
  } catch (e) {
    err.style.color = 'var(--bad)';
    err.textContent = `Lỗi: ${e.message}`;
  } finally {
    btn.disabled = false;
  }
});

function renderQuizExamPrint({ kidName, levelLabel, questions, title }) {
  const questionsHtml = questions.map((q, i) => `
    <li>${escapeHtml(q.prompt)}
      <div class="print-opts">${q.options.map((o, oi) => `${String.fromCharCode(65 + oi)}. ${escapeHtml(o)}`).join('&emsp;')}</div>
    </li>`).join('');
  const answerHtml = questions.map((q, i) => `<li>Câu ${i + 1}: <b>${String.fromCharCode(65 + q.answer)}. ${escapeHtml(q.options[q.answer])}</b></li>`).join('');
  $('printArea').innerHTML = `
    <div class="a4-page">
      <h1>${title}</h1>
      <div class="print-meta">Cấp độ: <b>${escapeHtml(levelLabel)}</b> &nbsp;·&nbsp; Họ tên: ${escapeHtml(kidName) || '_________________________'} &nbsp;·&nbsp; Ngày: ___/___/______</div>
      <ol class="print-questions">${questionsHtml}</ol>
    </div>
    <div class="a4-page">
      <h2>📋 ĐÁP ÁN</h2>
      <ol class="answer-list">${answerHtml}</ol>
    </div>
  `;
}

function renderTranslateExamPrint({ kidName, levelLabel, passages }) {
  const bodyHtml = passages.map((p, i) => `
    <h3>Bài ${i + 1}: ${escapeHtml(p.title)}</h3>
    <p class="passage-en">${escapeHtml(p.passage_en)}</p>
    <p style="font-size:13px;margin:8px 0 2px">Bản dịch của bé:</p>
    <div class="write-lines"></div><div class="write-lines"></div><div class="write-lines"></div>
  `).join('');
  const vocabHtml = passages.map((p, i) => `<p><b>Bài ${i + 1}:</b> ${p.vocab.map((v) => `${escapeHtml(v.word)} = ${escapeHtml(v.vi)}`).join('; ')}</p>`).join('');
  $('printArea').innerHTML = `
    <div class="a4-page">
      <h1>ĐỀ LUYỆN DỊCH</h1>
      <div class="print-meta">Cấp độ: <b>${escapeHtml(levelLabel)}</b> &nbsp;·&nbsp; Họ tên: ${escapeHtml(kidName) || '_________________________'} &nbsp;·&nbsp; Ngày: ___/___/______</div>
      ${bodyHtml}
    </div>
    <div class="a4-page">
      <h2>📖 TỪ VỰNG THAM KHẢO</h2>
      ${vocabHtml}
    </div>
  `;
}

/* ===== Bài tập mạng xã hội ===== */

$('btnGenSocial').addEventListener('click', async () => {
  const err = $('socialErr');
  const btn = $('btnGenSocial');
  err.textContent = '';
  const topic = $('socialTopic').value.trim();
  const count = Math.max(1, Math.min(4, Number($('socialCount').value) || 2));
  const kidName = $('socialKidName').value.trim();

  btn.disabled = true;
  err.textContent = '🤖 AI đang soạn bài đăng, chờ chút nhé…';
  err.style.color = 'var(--ink-dim)';
  try {
    const settings = api.cachedSettings() || await api.getSettings();
    if (!aiProvider.resolveProvider(settings).apiKey) {
      throw new Error('Chưa cấu hình key AI — vào Trang Phụ Huynh > Cài đặt > 🤖 Trợ Lý AI');
    }
    const posts = await aiProvider.generateSocialPosts(settings, { topic, count });
    renderSocialPrint({ kidName, topic, posts });
    err.textContent = '';
    showPreview(`Bài tập Mạng Xã Hội — ${count} bài đăng${topic ? ` — chủ đề: ${topic}` : ''}`);
  } catch (e) {
    err.style.color = 'var(--bad)';
    err.textContent = `Lỗi: ${e.message}`;
  } finally {
    btn.disabled = false;
  }
});

function renderSocialPrint({ kidName, posts }) {
  const postsHtml = posts.map((post) => `
    <div class="social-post">
      <div class="post-header"><span class="post-avatar">${escapeHtml(post.emoji)}</span><b>@${escapeHtml(post.username)}</b></div>
      <div class="post-caption">${escapeHtml(post.caption)}</div>
      <div class="post-likes">❤️ ${Number(post.likes).toLocaleString('vi-VN')} likes</div>
      <div class="post-comments">
        ${post.comments.map((c) => `
          <div class="comment">
            <b>@${escapeHtml(c.username)}:</b> <span class="ctext">${escapeHtml(c.text)}</span>
            <div class="translate-line"></div>
          </div>`).join('')}
      </div>
    </div>`).join('');
  const answerHtml = posts.map((post, pi) => `
    <p><b>Bài ${pi + 1} — @${escapeHtml(post.username)}:</b></p>
    <ol>${post.comments.map((c) => `<li>${escapeHtml(c.text)} → <b>${escapeHtml(c.vi)}</b></li>`).join('')}</ol>
  `).join('');
  $('printArea').innerHTML = `
    <div class="a4-page">
      <h1>📱 DỊCH BÀI ĐĂNG MẠNG XÃ HỘI</h1>
      <div class="print-meta">Họ tên: ${escapeHtml(kidName) || '_________________________'} &nbsp;·&nbsp; Ngày: ___/___/______ — Đọc caption + bình luận rồi viết bản dịch tiếng Việt vào dòng kẻ bên dưới mỗi bình luận nhé!</div>
      ${postsHtml}
    </div>
    <div class="a4-page">
      <h2>📋 ĐÁP ÁN DỊCH</h2>
      ${answerHtml}
    </div>
  `;
}

/* ===== Xem trước + in ===== */

function showPreview(info) {
  $('previewInfo').textContent = info;
  $('previewWrap').classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

$('btnPrint').addEventListener('click', () => window.print());
$('btnClosePreview').addEventListener('click', () => $('previewWrap').classList.remove('active'));

boot();
