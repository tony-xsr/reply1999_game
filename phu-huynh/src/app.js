// Trang Phụ Huynh — đăng nhập tài khoản phụ huynh (Supabase Auth), quản lý hồ
// sơ bé, xem tiến độ + từ hay sai, phát thưởng kèm lời nhắn, cài đặt chung,
// xuất/xóa dữ liệu. Toàn bộ dữ liệu đọc/ghi qua shared/api.js (server thuần).

import * as api from '../../shared/api.js';
import {
  buildWeeklyReport, formatReportVi, minutesByGroup, minutesByTimeOfDay, weeklyWinRate, weekStart,
  examProgressReport, EXAM_LEVEL_LABELS, examSessionsToday,
} from '../../shared/report.js';
import {
  catalogItem, CATALOG, effectiveCost, DEFAULT_REWARD_COST_MULTIPLIER, mergeCatalog,
} from '../../shared/rewards.js';
import * as aiProvider from '../../shared/ai-provider.js';
import { mountThemePicker } from '../../shared/theme.js';
import { buildTargetedInstruction } from '../../shared/weak-points.js';

const $ = (id) => document.getElementById(id);
const AVATARS = ['🐰', '🐯', '🐸', '🦄', '🐼', '🐥', '🦊', '🐨', '🐷', '🦁', '🐳', '🦖'];

mountThemePicker($('themeSlot'));

const state = {
  kids: [], kid: null, avatar: AVATARS[0], compareMode: false, kidTab: 'stats', mainTab: 'kids',
};

/* ===== Tab lớn đầu trang: "Các bé" vs "Cài đặt" (gộp đăng nhập gần đây,
   dữ liệu & thiết bị, giá quà, cài đặt chung — vốn tách rời khỏi việc theo
   dõi từng bé — vào 1 chỗ riêng). ===== */
function showMainTab(tab) {
  state.mainTab = tab;
  for (const b of $('mainTabs').querySelectorAll('button[data-maintab]')) {
    b.classList.toggle('active', b.dataset.maintab === tab);
  }
  for (const el of document.querySelectorAll('.main-tab-panel')) {
    el.classList.toggle('hidden', el.dataset.maintab !== tab);
  }
}
$('mainTabs').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-maintab]');
  if (btn) showMainTab(btn.dataset.maintab);
});
showMainTab(state.mainTab);

/* ===== Tab con trong màn từng bé (thống kê/từ sai/báo cáo/sổ quà/cài đặt) =====
   Tách ra để phụ huynh không phải kéo dài 1 màn mới thấy hết chart + lịch sử. */
function showKidTab(tab) {
  state.kidTab = tab;
  for (const b of $('kidSubTabs').querySelectorAll('button[data-tab]')) {
    b.classList.toggle('active', b.dataset.tab === tab);
  }
  for (const el of document.querySelectorAll('.kp-tab')) {
    el.classList.toggle('hidden', el.dataset.kptab !== tab);
  }
}
$('kidSubTabs').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-tab]');
  if (btn) showKidTab(btn.dataset.tab);
});

function show(id) {
  for (const v of ['viewSetup', 'viewAuth', 'viewMain']) $(v).classList.toggle('hidden', v !== id);
}

/* ===== Khởi động: chọn màn hình theo trạng thái ===== */

async function boot() {
  if (!(await api.configured())) { show('viewSetup'); return; }
  if (!api.signedIn()) { show('viewAuth'); return; }
  show('viewMain');
  $('who').textContent = `(${api.sessionUser()?.email || ''})`;
  try {
    await api.ensureFamily();
    await api.touchDevice(guessDeviceLabel());
    maybeShowImport();
    weeklyTidy();
    await Promise.all([loadKids(), loadSettings(), loadDevices()]);
  } catch (e) {
    $('adminErr').textContent = `Lỗi kết nối server: ${e.message}`;
  }
}

/** Dọn dữ liệu cũ trên server ~1 lần/tuần (gộp sự kiện cũ, giữ DB gọn nhẹ). */
function weeklyTidy() {
  try {
    const last = Number(localStorage.getItem('r99-tidy')) || 0;
    if (Date.now() - last < 7 * 86400000) return;
    localStorage.setItem('r99-tidy', String(Date.now()));
  } catch { /* ignore */ }
  api.tidyFamily().catch(() => { /* chưa chạy migrate-01 thì thôi, lần sau thử lại */ });
}

function guessDeviceLabel() {
  const ua = navigator.userAgent;
  if (/iPad/i.test(ua)) return 'iPad';
  if (/iPhone/i.test(ua)) return 'iPhone';
  if (/Android/i.test(ua)) return 'Máy Android';
  return 'Máy tính';
}

/* ===== Đăng nhập / đăng ký ===== */

$('btnSignIn').addEventListener('click', async () => {
  $('authErr').textContent = '';
  try {
    await api.signIn($('email').value.trim(), $('password').value);
    boot();
  } catch (e) { $('authErr').textContent = viAuthError(e.message); }
});

$('btnSignUp').addEventListener('click', async () => {
  $('authErr').textContent = '';
  try {
    const data = await api.signUp($('email').value.trim(), $('password').value);
    if (!data.access_token) {
      $('authErr').textContent = 'Đã gửi email xác nhận — bấm link trong email rồi quay lại đăng nhập.';
      return;
    }
    boot();
  } catch (e) { $('authErr').textContent = viAuthError(e.message); }
});

$('btnSignOut').addEventListener('click', () => { api.signOut(); location.reload(); });

function viAuthError(msg) {
  if (/email not confirmed/i.test(msg)) return 'Email chưa được xác nhận — mở hộp thư bấm link xác nhận rồi đăng nhập lại (hoặc tắt "Confirm email" trong Supabase → Authentication).';
  if (/invalid login credentials/i.test(msg)) return 'Sai email hoặc mật khẩu.';
  if (/at least 6/i.test(msg)) return 'Mật khẩu cần ít nhất 6 ký tự.';
  if (/already registered/i.test(msg)) return 'Email này đã có tài khoản — hãy Đăng nhập.';
  if (/failed to fetch/i.test(msg)) return 'Không kết nối được server (kiểm tra mạng / config).';
  return msg;
}

/* ===== Hồ sơ bé ===== */

function buildAvatarPick() {
  const box = $('avatarPick');
  box.innerHTML = '';
  for (const a of AVATARS) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = a;
    b.className = a === state.avatar ? 'sel' : '';
    b.addEventListener('click', () => { state.avatar = a; buildAvatarPick(); });
    box.appendChild(b);
  }
}
buildAvatarPick();

async function loadKids() {
  state.kids = await api.listKids();
  const tabs = $('kidTabs');
  tabs.innerHTML = '';
  if (!state.kids.length) {
    tabs.innerHTML = '<i style="font-size:13px;color:var(--ink-dim)">Chưa có bé nào — thêm bé đầu tiên bên dưới nhé.</i>';
    $('kidPanel').classList.add('hidden');
    $('compareCard').classList.add('hidden');
    $('addKidBox').open = true;
    return;
  }
  // "Tất cả" chỉ có ý nghĩa khi có từ 2 bé trở lên — 1 bé thì so sánh với ai.
  if (state.kids.length >= 2) {
    const allBtn = document.createElement('button');
    allBtn.className = `kid-tab${state.compareMode ? ' active' : ''}`;
    allBtn.textContent = '🌟 Tất cả';
    allBtn.addEventListener('click', () => selectCompare());
    tabs.appendChild(allBtn);
  }
  for (const k of state.kids) {
    const b = document.createElement('button');
    b.className = `kid-tab${!state.compareMode && state.kid?.id === k.id ? ' active' : ''}`;
    b.textContent = `${k.avatar} ${k.name}`;
    b.addEventListener('click', () => selectKid(k));
    tabs.appendChild(b);
  }
  renderLoginLog();
  if (state.compareMode) {
    $('kidPanel').classList.add('hidden');
    $('compareCard').classList.remove('hidden');
    renderCompare();
  } else if (!state.kid) selectKid(state.kids[0]);
}

/* ===== Nhật ký đăng nhập của bé ===== */

let loginLogRenderedAt = 0;

async function renderLoginLog() {
  if (Date.now() - loginLogRenderedAt < 30000) return;
  loginLogRenderedAt = Date.now();
  const box = $('loginLog');
  try {
    const rows = await api.recentKidLogins(15);
    if (!rows.length) {
      box.innerHTML = '<i style="color:var(--ink-dim)">Chưa có lần đăng nhập nào — bé chọn avatar ở /chon-be/ là sẽ hiện ở đây.</i>';
      return;
    }
    const kidOf = new Map(state.kids.map((k) => [k.id, k]));
    box.innerHTML = rows.map((r) => {
      const k = kidOf.get(r.profile_id);
      const t = new Date(r.ts);
      const p = (n) => String(n).padStart(2, '0');
      const when = `${p(t.getDate())}/${p(t.getMonth() + 1)} ${p(t.getHours())}:${p(t.getMinutes())}`;
      return `${k ? `${k.avatar} <b>${k.name}</b>` : 'Bé (đã xóa)'} — ${when} — 📱 ${r.device || '?'} · ${r.browser || '?'}`;
    }).join('<br>');
  } catch (e) {
    box.innerHTML = /kid_logins/.test(e.message) || /404/.test(e.message)
      ? '<i style="color:var(--ink-dim)">Cần chạy <code>server/migrate-02-kid-logins.sql</code> trong Supabase SQL Editor để bật tính năng này.</i>'
      : `<i style="color:var(--ink-dim)">Không tải được (${e.message})</i>`;
  }
}

$('btnAddKid').addEventListener('click', async () => {
  $('kidErr').textContent = '';
  const name = $('kidName').value.trim();
  if (!name) { $('kidErr').textContent = 'Nhập tên bé đã nhé.'; return; }
  try {
    await api.addKid({ name, avatar: state.avatar });
    $('kidName').value = '';
    $('addKidBox').open = false;
    await loadKids();
  } catch (e) { $('kidErr').textContent = e.message; }
});

async function selectKid(k) {
  state.kid = k;
  state.compareMode = false;
  await loadKids();
  $('compareCard').classList.add('hidden');
  $('kidPanel').classList.remove('hidden');
  $('kidTitle').textContent = `${k.avatar} ${k.name}`;
  showKidTab(state.kidTab); // giữ nguyên tab con đang xem khi chuyển bé (dễ so sánh cùng 1 mục giữa các bé)
  fillEditKid(k);
  renderKidStats(k).catch((e) => { $('adminErr').textContent = e.message; });
}

async function selectCompare() {
  state.compareMode = true;
  state.kid = null;
  await loadKids();
}

/* ===== Sửa hồ sơ + cài đặt riêng của bé ===== */

const KID_COLORS = ['#ff8a3d', '#e5484d', '#2f9e60', '#2f6bd8', '#9b59d0', '#d9720c', '#0ea5b7', '#e04f9c'];

// Đổ 1 lần danh sách cấp độ vào ô chọn mục tiêu học Chứng Chỉ Anh mỗi ngày +
// ô chọn cấp độ dùng cho Luyện Dịch + ô chọn cấp độ dùng cho Trắc Nghiệm Ngữ Pháp.
(function buildGoalLevelPick() {
  const opts = Object.entries(EXAM_LEVEL_LABELS).map(([id, label]) => `<option value="${id}">${label}</option>`).join('');
  const sel = $('editGoalLevel');
  if (sel) sel.innerHTML = `<option value="">(Không đặt mục tiêu)</option>${opts}`;
  const trSel = $('editTranslationLevel');
  if (trSel) trSel.innerHTML = `<option value="">(Không dùng Luyện Dịch)</option>${opts}`;
  const gqSel = $('editGrammarQuizLevel');
  if (gqSel) gqSel.innerHTML = `<option value="">(Không dùng Trắc Nghiệm Ngữ Pháp)</option>${opts}`;
})();

function fillEditKid(k) {
  $('editKidName').value = k.name;
  state.editAvatar = k.avatar;
  state.editColor = k.color || KID_COLORS[0];
  buildEditAvatarPick();
  buildEditColorPick();
  $('editKidCode').value = k.settings?.code || '';
  $('editKidLimit').value = k.settings?.daily_limit_min ?? '';
  $('editGoalLevel').value = k.settings?.examGoal?.level || '';
  $('editGoalPerDay').value = k.settings?.examGoal?.perDay ?? '';
  $('editNguphapPerDay').value = k.settings?.nguphapGoal?.perDay ?? '';
  $('editNguphapReward').value = k.settings?.nguphapGoal?.rewardStars ?? '';
  $('editTranslationLevel').value = k.settings?.translationLevel || '';
  $('editConfirmSubmit').checked = !!k.settings?.confirmBeforeSubmitTranslation;
  $('editGrammarQuizLevel').value = k.settings?.grammarQuizLevel || '';
  $('editGrammarQuizType').value = k.settings?.grammarQuizType || 'grammar';
  $('editKidOk').textContent = '';
}

function buildEditColorPick() {
  const box = $('editColorPick');
  box.innerHTML = '';
  for (const c of KID_COLORS) {
    const b = document.createElement('button');
    b.type = 'button';
    b.style.cssText = `background:${c};width:34px;height:34px;border-radius:50%;border:3px solid ${c === state.editColor ? '#241e2e' : 'transparent'}`;
    b.addEventListener('click', () => { state.editColor = c; buildEditColorPick(); });
    box.appendChild(b);
  }
}

$('btnGenCode').addEventListener('click', () => {
  $('editKidCode').value = String(Math.floor(100000 + Math.random() * 900000));
});

function buildEditAvatarPick() {
  const box = $('editAvatarPick');
  box.innerHTML = '';
  for (const a of AVATARS) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = a;
    b.className = a === state.editAvatar ? 'sel' : '';
    b.addEventListener('click', () => { state.editAvatar = a; buildEditAvatarPick(); });
    box.appendChild(b);
  }
}

$('btnSaveKid').addEventListener('click', async () => {
  if (!state.kid) return;
  $('editKidOk').textContent = '';
  const name = $('editKidName').value.trim();
  if (!name) { $('editKidOk').textContent = 'Tên bé không được để trống.'; return; }
  const limitRaw = $('editKidLimit').value.trim();
  const codeRaw = $('editKidCode').value.trim();
  if (codeRaw && !/^\d{6}$/.test(codeRaw)) {
    $('editKidOk').textContent = 'Mã đăng nhập phải đúng 6 chữ số (hoặc bỏ trống).';
    return;
  }
  const goalLevel = $('editGoalLevel').value;
  const goalPerDayRaw = $('editGoalPerDay').value.trim();
  const settings = { ...(state.kid.settings || {}) };
  if (limitRaw === '') delete settings.daily_limit_min;
  else settings.daily_limit_min = Math.max(0, Number(limitRaw) | 0);
  if (codeRaw === '') delete settings.code;
  else settings.code = codeRaw;
  if (!goalLevel || goalPerDayRaw === '') delete settings.examGoal;
  else settings.examGoal = { level: goalLevel, perDay: Math.max(1, Number(goalPerDayRaw) | 0) };
  const nguphapPerDayRaw = $('editNguphapPerDay').value.trim();
  const nguphapRewardRaw = $('editNguphapReward').value.trim();
  if (nguphapPerDayRaw === '' && nguphapRewardRaw === '') delete settings.nguphapGoal;
  else settings.nguphapGoal = {
    perDay: nguphapPerDayRaw === '' ? 5 : Math.max(1, Number(nguphapPerDayRaw) | 0),
    rewardStars: nguphapRewardRaw === '' ? 2 : Math.max(0, Number(nguphapRewardRaw) | 0),
  };
  const translationLevel = $('editTranslationLevel').value;
  if (!translationLevel) delete settings.translationLevel;
  else settings.translationLevel = translationLevel;
  if ($('editConfirmSubmit').checked) settings.confirmBeforeSubmitTranslation = true;
  else delete settings.confirmBeforeSubmitTranslation;
  const grammarQuizLevel = $('editGrammarQuizLevel').value;
  if (!grammarQuizLevel) delete settings.grammarQuizLevel;
  else settings.grammarQuizLevel = grammarQuizLevel;
  if (!grammarQuizLevel) delete settings.grammarQuizType;
  else settings.grammarQuizType = $('editGrammarQuizType').value || 'grammar';
  try {
    const updated = await api.updateKid(state.kid.id, { name, avatar: state.editAvatar, color: state.editColor, settings });
    $('editKidOk').textContent = 'Đã lưu. (Máy của bé sẽ nhận giới hạn mới khi bé chọn lại avatar ở /chon-be/.)';
    state.kid = updated || { ...state.kid, name, avatar: state.editAvatar, settings };
    await loadKids();
    $('kidTitle').textContent = `${state.kid.avatar} ${state.kid.name}`;
  } catch (e) {
    $('editKidOk').textContent = /settings/.test(e.message) && /column/.test(e.message)
      ? 'Server chưa có cột cài đặt riêng — chạy server/migrate-01-tiet-kiem.sql trong Supabase SQL Editor rồi thử lại.'
      : `Lỗi: ${e.message}`;
  }
});

$('btnDeleteKid').addEventListener('click', async () => {
  if (!state.kid) return;
  const typed = prompt(`Xóa VĨNH VIỄN hồ sơ "${state.kid.name}" cùng toàn bộ tiến độ, sao và quà của bé?\nGõ tên bé để xác nhận:`);
  if (typed !== state.kid.name) return;
  try {
    await api.deleteKid(state.kid.id);
    state.kid = null;
    $('kidPanel').classList.add('hidden');
    await loadKids();
  } catch (e) { $('adminErr').textContent = e.message; }
});

/* ===== Thống kê + biểu đồ 7 ngày ===== */

function dayKey(d) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

let lastReportText = '';
let lastWeakGrammarPoints = [];
let weakGenCountsCache = {};

async function renderKidStats(k) {
  const [sessions, stars, weak, weakGrammar, ledger, purchases, translations, grammarQuizzes, allPassages, allQuizzes, weakGenCounts, weakGenHistory] = await Promise.all([
    api.kidSessions(k.id), api.starBalance(k.id), api.weakWordsServer(k.id),
    api.weakGrammarPointsServer(k.id).catch(() => []),
    apiLedger(k.id), api.kidPurchases(k.id).catch(() => []),
    api.kidTranslationSubmissions(k.id, 500).catch(() => []),
    api.kidGrammarQuizSubmissions(k.id, 500).catch(() => []),
    api.kidTranslationPassages(k.id).catch(() => []),
    api.kidGrammarQuizzes(k.id).catch(() => []),
    api.weakItemGeneratedCounts(k.id).catch(() => ({})),
    api.weakGenerationHistory(k.id).catch(() => []),
  ]);
  renderAiResourceStats({ translations, grammarQuizzes, allPassages, allQuizzes });
  lastWeakGrammarPoints = weakGrammar;
  weakGenCountsCache = weakGenCounts;
  renderWeakGrammarPoints(weakGrammar);
  renderWeakGenHistory(weakGenHistory);

  // Báo cáo tuần (module thuần shared/report.js)
  const report = buildWeeklyReport({ sessions, ledger, purchases, weakWords: weak });
  lastReportText = formatReportVi(k.name, report);
  $('weeklyReport').textContent = lastReportText;

  const totalSec = sessions.reduce((s, x) => s + (x.seconds || 0), 0);
  const wins = sessions.filter((s) => s.result === 'win').length;
  $('statsRow').innerHTML = `
    <div class="stat">Tổng ván<b>${sessions.length}</b></div>
    <div class="stat">Thắng<b>${wins}</b></div>
    <div class="stat">Giờ chơi<b>${(totalSec / 3600).toFixed(1)}h</b></div>
    <div class="stat">Sao hiện có<b>⭐ ${stars}</b></div>
    <div class="stat">Từ cần ôn<b>🎯 ${weak.length}</b></div>`;

  // Biểu đồ phút chơi 7 ngày gần nhất
  const byDay = new Map();
  for (const s of sessions) {
    const key = (s.played_at || '').slice(0, 10);
    byDay.set(key, (byDay.get(key) || 0) + (s.seconds || 0));
  }
  const bars = $('bars');
  const labels = $('barLabels');
  bars.innerHTML = '';
  labels.innerHTML = '';
  const days = [];
  for (let i = 6; i >= 0; i--) days.push(dayKey(new Date(Date.now() - i * 86400000)));
  const maxSec = Math.max(60, ...days.map((d) => byDay.get(d) || 0));
  for (const d of days) {
    const sec = byDay.get(d) || 0;
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = `${Math.round((sec / maxSec) * 100)}%`;
    bar.innerHTML = `<span>${Math.round(sec / 60)}p</span>`;
    bars.appendChild(bar);
    const lb = document.createElement('div');
    lb.textContent = d.slice(5).replace('-', '/');
    labels.appendChild(lb);
  }

  // Từ hay sai + nút đọc thử — danh sách dạng hàng dọc gọn gàng (dễ quét mắt
  // hơn lưới chip cũ khi có nhiều mục), cuộn trong khung nhỏ mặc định, có
  // thể "🔍 Mở rộng xem tất cả" ra popup để xem hết không bị giới hạn chiều cao.
  const box = $('weakWords');
  box.innerHTML = weak.length ? '' : '<i style="font-size:13px;color:var(--good)">Không có từ nào cần ôn — bé đang làm rất tốt! 🎉</i>';
  for (const w of weak.slice(0, 60)) {
    const row = document.createElement('div');
    row.className = 'word-row';
    const genCount = weakGenCountsCache[w.word] || 0;
    row.innerHTML = `<input type="checkbox" class="weak-pick" data-word="${w.word}" title="Chọn để tạo bài từ AI" />`
      + `<b title="${w.word}">${w.word}</b> <span class="n">×${w.misses}</span>${genCount ? ` <span title="Đã tạo ${genCount} bài riêng cho từ này">🤖${genCount}</span>` : ''}`;
    const btn = document.createElement('button');
    btn.textContent = '🔊';
    btn.addEventListener('click', () => {
      try {
        const u = new SpeechSynthesisUtterance(w.word);
        u.lang = 'en-US';
        u.rate = 0.78;
        speechSynthesis.cancel();
        speechSynthesis.speak(u);
      } catch { /* ignore */ }
    });
    row.appendChild(btn);
    box.appendChild(row);
  }

  renderAnalytics(sessions);
  renderExamProgress(sessions);
  renderExamGoal(k, sessions);
  renderTranslateLog(translations);
  renderGrammarQuizLog(grammarQuizzes);

  // Sổ sao gần nhất
  $('rewardLog').innerHTML = ledger.length
    ? `<table>${ledger.slice(0, 25).map((r) =>
        `<tr><td>${(r.ts || '').slice(0, 10)}</td><td>${r.delta > 0 ? '+' : ''}${r.delta}⭐</td><td>${viReason(r.reason)}</td></tr>`).join('')}</table>`
    : '<i style="color:var(--ink-dim)">Chưa có giao dịch sao nào.</i>';

  renderPurchaseLog(purchases);
}

// Quà đã đổi bằng sao (đồ THẬT như kẹo/hoa/thú bông) — bố mẹ cần tự tay giao
// cho bé ngoài đời, rồi bấm "Đã giao" để đánh dấu, khỏi quên món nào chưa đưa.
function renderPurchaseLog(purchases) {
  const box = $('purchaseLog');
  if (!purchases.length) {
    box.innerHTML = '<i style="color:var(--ink-dim)">Bé chưa đổi quà nào.</i>';
    return;
  }
  box.innerHTML = purchases.slice(0, 40).map((p) => {
    const custom = api.cachedSettings()?.custom_catalog_items;
    const item = catalogItem(p.item_id) || (custom && mergeCatalog(custom).find((c) => c.id === p.item_id))
      || { icon: '🎁', name: p.item_id };
    const date = (p.ts || '').slice(0, 10);
    const status = p.delivered_at
      ? `<span style="color:var(--good)">✅ Đã giao ${(p.delivered_at || '').slice(0, 10)}</span>
         <button class="ghost" data-action="undeliver" data-id="${p.id}" style="margin:0 0 0 8px;padding:2px 9px;font-size:12px">Bỏ đánh dấu</button>`
      : `<span style="color:var(--bad, #c2410c)">⏳ Chưa giao</span>
         <button data-action="deliver" data-id="${p.id}" style="margin:0 0 0 8px;padding:2px 9px;font-size:12px">✅ Đánh dấu đã giao</button>`;
    return `<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:6px 0;border-bottom:1px solid var(--line)">
      <span>${item.icon} ${item.name} <span style="color:var(--ink-dim);font-size:12px">(${date})</span></span>
      <span style="white-space:nowrap">${status}</span>
    </div>`;
  }).join('');
}

$('purchaseLog').addEventListener('click', async (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn || !state.kid) return;
  btn.disabled = true;
  try {
    if (btn.dataset.action === 'deliver') await api.markPurchaseDelivered(btn.dataset.id);
    else await api.unmarkPurchaseDelivered(btn.dataset.id);
    await renderKidStats(state.kid);
  } catch { btn.disabled = false; }
});

async function apiLedger(profileId) {
  // Chỉ tải sổ sao của đúng bé này (kidLedger) — không kéo cả database như trước.
  try { return await api.kidLedger(profileId, 30); } catch { return []; }
}

function viReason(reason) {
  if (!reason) return '';
  if (reason.startsWith('choi:')) return `Chơi game (${reason.slice(5)})`;
  if (reason.startsWith('doi:')) return `Đổi quà (${reason.slice(4)})`;
  if (reason === 'bo-me-thuong') return 'Bố mẹ thưởng 🎁';
  if (reason === 'qua-hoc-cham') return 'Quà chăm học';
  if (reason.startsWith('phu-huynh:')) {
    const note = reason.slice(10);
    return note && note !== 'dieu-chinh' ? `Phụ huynh chỉnh tay (${note})` : 'Phụ huynh chỉnh tay';
  }
  return reason;
}

/* ===== Biểu đồ phân tích chi tiết (thuần CSS/SVG, không thư viện) ===== */

const GROUP_COLORS = { 'Tiếng Anh': '#c2410c', 'Học & tư duy': '#1e7a45', 'Game vui': '#2f6bd8' };

function renderAnalytics(sessions) {
  const cutoff = Date.now() - 30 * 86400000;
  const recent = sessions.filter((s) => s.played_at && new Date(s.played_at).getTime() >= cutoff);

  // 1) Donut: bé chơi gì nhiều nhất (30 ngày)
  const groups = minutesByGroup(recent);
  const total = groups.reduce((sum, g) => sum + g.minutes, 0);
  const svg = $('donut');
  const legend = $('donutLegend');
  svg.innerHTML = '';
  legend.innerHTML = '';
  if (!total) {
    legend.innerHTML = '<i style="color:var(--ink-dim)">Chưa có dữ liệu 30 ngày qua.</i>';
  } else {
    // vòng nền + từng cung bằng stroke-dasharray (chu vi r=15.915 ≈ 100)
    svg.innerHTML = '<circle cx="21" cy="21" r="15.915" fill="none" stroke="#fff3df" stroke-width="7"></circle>';
    let offset = 25; // bắt đầu từ đỉnh
    for (const g of groups) {
      const pct = (g.minutes / total) * 100;
      const c = GROUP_COLORS[g.group] || '#a8834a';
      const seg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      seg.setAttribute('cx', '21'); seg.setAttribute('cy', '21'); seg.setAttribute('r', '15.915');
      seg.setAttribute('fill', 'none'); seg.setAttribute('stroke', c); seg.setAttribute('stroke-width', '7');
      seg.setAttribute('stroke-dasharray', `${pct} ${100 - pct}`);
      seg.setAttribute('stroke-dashoffset', String(offset));
      svg.appendChild(seg);
      offset -= pct;
      legend.innerHTML += `<div><span class="dot" style="background:${c}"></span>${g.group}: <b>${g.minutes} phút</b> (${Math.round(pct)}%)</div>`;
    }
  }

  // 2) Khung giờ chơi (thanh ngang)
  const tod = minutesByTimeOfDay(recent);
  const maxTod = Math.max(1, ...tod.map((b) => b.minutes));
  $('todBars').innerHTML = tod.map((b) => `
    <div class="row"><div class="lab">${b.label}</div>
      <div class="track"><div class="fill" style="width:${Math.round((b.minutes / maxTod) * 100)}%"></div></div>
      <div class="val">${b.minutes}p</div></div>`).join('');

  // 3) Tiến bộ 4 tuần (cột tỷ lệ thắng)
  const trend = weeklyWinRate(sessions);
  $('trendBars').innerHTML = trend.map((w) => {
    const pct = w.rate === null ? 0 : Math.round(w.rate * 100);
    return `<div class="col">
      <div class="pct">${w.rate === null ? '—' : pct + '%'}</div>
      <div class="tbar" style="height:${w.rate === null ? 3 : Math.max(4, pct * 0.6)}px;${w.rate === null ? 'background:#d8cdb6' : ''}"></div>
      <div class="tlab">${w.label}</div></div>`;
  }).join('');
}

/* ===== Tiến độ khu Thi Chứng Chỉ Anh (Cambridge YLE/KET/PET/TOEFL Junior/
   TOEIC/Ngữ Pháp Trực Quan) — gộp theo cấp độ, hiện phút học/số ván/lần
   chơi gần nhất/xu hướng hiệu quả (module thuần shared/report.js). ===== */

const EXAM_TREND_BADGE = {
  improving: { icon: '📈', text: 'Đang tiến bộ', cls: 'good' },
  declining: { icon: '📉', text: 'Đang giảm', cls: 'bad' },
  stable: { icon: '➖', text: 'Ổn định', cls: '' },
  'not-enough-data': { icon: '⏳', text: 'Chưa đủ ván để đánh giá', cls: '' },
};

/** Mục tiêu học Chứng Chỉ Anh HÔM NAY (phụ huynh đặt ở "Cài đặt bé"): thanh
 * tiến độ X/N bài (P%) — chỉ hiện thẻ khi bé này có đặt mục tiêu. */
function renderExamGoal(k, sessions) {
  const card = $('examGoalCard');
  const goal = k.settings?.examGoal;
  if (!goal?.level || !goal?.perDay) { card.classList.add('hidden'); return; }
  card.classList.remove('hidden');
  const done = examSessionsToday(sessions, goal.level);
  const pct = Math.min(100, Math.round((done / goal.perDay) * 100));
  const label = EXAM_LEVEL_LABELS[goal.level] || goal.level;
  $('examGoalBox').innerHTML = `
    <div class="hbars"><div class="row">
      <div class="lab">${label}</div>
      <div class="track"><div class="fill" style="width:${pct}%"></div></div>
      <div class="val">${done}/${goal.perDay}</div>
    </div></div>
    <p style="font-size:12.5px;color:var(--ink-dim);margin:8px 0 0">${pct >= 100 ? '🎉 Bé đã đạt mục tiêu hôm nay!' : `Còn ${goal.perDay - done} bài nữa là đạt mục tiêu hôm nay.`}</p>`;
}

/** "1 phút 20 giây" từ số giây — rỗng nếu chưa có dữ liệu (bản ghi cũ trước migrate-11). */
function formatSeconds(sec) {
  if (sec == null) return '';
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return m > 0 ? `⏱️ ${m} phút ${s} giây` : `⏱️ ${s} giây`;
}

/** Bài dịch + trắc nghiệm ngữ pháp AI đã soạn sẵn (buffer) cho bé: bao nhiêu
 * bài đã làm, bao nhiêu bài còn sẵn trong kho chưa làm (đếm bằng cách so
 * passage/quiz id với id đã có trong translation_submissions/
 * grammar_quiz_submissions của bé). */
function renderAiResourceStats({ translations, grammarQuizzes, allPassages, allQuizzes }) {
  // Đếm theo SỐ BÀI GỐC (passage_id/quiz_id) khác nhau, không phải số dòng
  // nộp bài — 1 bài có thể có NHIỀU lượt nộp nếu bé "làm lại để chấm lại"
  // (điểm dưới 80/100, trong vòng 24h — xem shared/translate-ui.js), nên
  // đếm thẳng translations.length sẽ bị tính trùng.
  const trDoneIds = new Set(translations.map((t) => t.passage_id));
  const trAvailable = allPassages.filter((p) => !trDoneIds.has(p.id)).length;
  const gqDoneIds = new Set(grammarQuizzes.map((s) => s.quiz_id));
  const gqAvailable = allQuizzes.filter((q) => !gqDoneIds.has(q.id)).length;
  $('trResourceStats').innerHTML = `
    <div class="stat">📝 Bài dịch đã làm<b>${trDoneIds.size}</b></div>
    <div class="stat">📝 Bài dịch còn sẵn<b>${trAvailable}</b></div>`;
  $('gqResourceStats').innerHTML = `
    <div class="stat">🧩 Trắc nghiệm đã làm<b>${gqDoneIds.size}</b></div>
    <div class="stat">🧩 Trắc nghiệm còn sẵn<b>${gqAvailable}</b></div>`;
}

/** Cấu trúc ngữ pháp bé hay chọn SAI (gộp từ mọi đề Trắc Nghiệm Ngữ Pháp đã
 * làm — xem migrate-15-grammar-miss.sql), sai nhiều nhất lên đầu. */
function renderWeakGrammarPoints(weakGrammar) {
  const box = $('weakGrammarPoints');
  if (!weakGrammar.length) {
    box.innerHTML = '<i style="color:var(--good)">Chưa có điểm ngữ pháp nào bé hay sai — đang làm rất tốt! 🎉</i>';
    return;
  }
  box.innerHTML = weakGrammar.map((g, i) => {
    const genCount = weakGenCountsCache[g.structure] || 0;
    return `
    <div style="margin:6px 0;padding:8px 10px;background:var(--panel2);border-radius:8px;display:flex;align-items:center;gap:8px">
      <input type="checkbox" class="weak-pick" data-structure-idx="${i}" title="Chọn để tạo bài từ AI" />
      <span style="flex:1">${g.structure}</span>
      ${genCount ? `<span title="Đã tạo ${genCount} bài riêng cho điểm này">🤖${genCount}</span>` : ''}
      <b style="color:var(--bad);white-space:nowrap">×${g.misses}</b>
    </div>`;
  }).join('');
}

/** Lịch sử "tạo bài từ AI theo mục đã chọn" — xem migrate-16-weak-source.sql. */
function renderWeakGenHistory(history) {
  const box = $('weakGenHistory');
  if (!history.length) {
    box.innerHTML = '<i style="color:var(--ink-dim)">Chưa có lượt tạo nào.</i>';
    return;
  }
  box.innerHTML = history.map((h) => `
    <div style="margin:4px 0;padding:6px 10px;background:var(--panel2);border-radius:8px">
      <b>${h.label}</b> · dùng cho ngày ${h.day} <span style="color:var(--ink-dim)">(tạo lúc ${new Date(h.createdAt).toLocaleString('vi-VN')})</span>
      <div style="font-size:12px;color:var(--ink-dim);margin-top:2px">Từ mục: ${h.sourceWeak.join(', ')}</div>
    </div>`).join('');
}

function getSelectedWeakWords() {
  return [...document.querySelectorAll('#weakWords input.weak-pick:checked')].map((el) => el.dataset.word);
}

function getSelectedWeakStructures() {
  return [...document.querySelectorAll('#weakGrammarPoints input.weak-pick:checked')]
    .map((el) => lastWeakGrammarPoints[Number(el.dataset.structureIdx)]?.structure)
    .filter(Boolean);
}

// "🔍 Mở rộng xem tất cả" — CHUYỂN (không nhân bản) chính node #weakWords
// sang trong popup rồi trả về đúng chỗ cũ khi đóng, để giữ nguyên mọi ô
// checkbox đã tick + nút 🔊 gắn sẵn, không cần đồng bộ 2 bản sao riêng.
$('btnExpandWeakWords').addEventListener('click', () => {
  $('wwModalSlot').appendChild($('weakWords'));
  $('wwModalBackdrop').classList.remove('hidden');
});
function closeWeakWordsModal() {
  $('weakWordsSlot').appendChild($('weakWords'));
  $('wwModalBackdrop').classList.add('hidden');
}
$('wwModalClose').addEventListener('click', closeWeakWordsModal);
$('wwModalBackdrop').addEventListener('click', (e) => {
  if (e.target.id === 'wwModalBackdrop') closeWeakWordsModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !$('wwModalBackdrop').classList.contains('hidden')) closeWeakWordsModal();
});

$('btnCreateTargetedTranslate').addEventListener('click', async () => {
  const msg = $('targetedGenOk');
  const kid = state.kid;
  if (!kid) return;
  const words = getSelectedWeakWords();
  const structures = getSelectedWeakStructures();
  if (!words.length && !structures.length) { msg.style.color = 'var(--bad)'; msg.textContent = 'Chọn ít nhất 1 từ/điểm ngữ pháp ở trên trước đã.'; return; }
  const level = kid.settings?.translationLevel;
  if (!level) { msg.style.color = 'var(--bad)'; msg.textContent = 'Bé này chưa đặt cấp độ Luyện Dịch ở "⚙️ Cài đặt bé" — không biết soạn ở cấp độ nào.'; return; }
  msg.style.color = 'var(--ink-dim)';
  msg.textContent = '🤖 AI đang soạn bài dịch...';
  try {
    const settings = await api.getSettings();
    const levelLabel = EXAM_LEVEL_LABELS[level] || level;
    const weakSummary = buildTargetedInstruction(words, structures);
    const [generated] = await aiProvider.generatePassages(settings, { levelLabel, count: 1, weakSummary });
    const day = api.dateKeyOffset(1);
    await api.savePassages(kid.id, [{ level, ...generated, source_weak: [...words, ...structures] }], day);
    msg.style.color = 'var(--good)';
    msg.textContent = `✅ Đã tạo xong bài dịch "${generated.title}" cho ngày mai (${day}).`;
    await renderKidStats(kid);
  } catch (e) {
    msg.style.color = 'var(--bad)';
    msg.textContent = `Lỗi: ${e.message}`;
  }
});

$('btnCreateTargetedGrammar').addEventListener('click', async () => {
  const msg = $('targetedGenOk');
  const kid = state.kid;
  if (!kid) return;
  const words = getSelectedWeakWords();
  const structures = getSelectedWeakStructures();
  if (!words.length && !structures.length) { msg.style.color = 'var(--bad)'; msg.textContent = 'Chọn ít nhất 1 từ/điểm ngữ pháp ở trên trước đã.'; return; }
  const level = kid.settings?.grammarQuizLevel;
  if (!level) { msg.style.color = 'var(--bad)'; msg.textContent = 'Bé này chưa đặt cấp độ Trắc Nghiệm ở "⚙️ Cài đặt bé" — không biết soạn ở cấp độ nào.'; return; }
  const quizType = kid.settings?.grammarQuizType || 'grammar';
  msg.style.color = 'var(--ink-dim)';
  msg.textContent = '🤖 AI đang soạn trắc nghiệm...';
  try {
    const settings = await api.getSettings();
    const levelLabel = EXAM_LEVEL_LABELS[level] || level;
    const weakSummary = buildTargetedInstruction(words, structures);
    const questions = await aiProvider.generateGrammarQuiz(settings, { levelLabel, count: 5, quizType, weakSummary });
    const day = api.dateKeyOffset(1);
    await api.saveGrammarQuiz(kid.id, { level, questions, quizType, sourceWeak: [...words, ...structures] }, day);
    msg.style.color = 'var(--good)';
    msg.textContent = `✅ Đã tạo xong đề trắc nghiệm cho ngày mai (${day}).`;
    await renderKidStats(kid);
  } catch (e) {
    msg.style.color = 'var(--bad)';
    msg.textContent = `Lỗi: ${e.message}`;
  }
});

/** Lọc theo khoảng thời gian ("all"/7/30/90 ngày, dựa vào `dateField`) + sắp
 * xếp ("new"/"old"/"score-desc"/"score-asc", dựa vào `scoreField`) — dùng
 * chung cho cả 2 danh sách Bài Dịch/Trắc Nghiệm ở Trang Phụ Huynh, dữ liệu
 * càng ngày càng nhiều nên cần lọc bớt thay vì kéo tay hết cả danh sách. */
function filterAndSortLog(list, range, sort, dateField, scoreField) {
  let out = list;
  if (range !== 'all') {
    const cutoff = Date.now() - Number(range) * 86400000;
    out = out.filter((x) => x[dateField] && new Date(x[dateField]).getTime() >= cutoff);
  }
  out = [...out];
  if (sort === 'old') out.sort((a, b) => new Date(a[dateField]) - new Date(b[dateField]));
  else if (sort === 'score-desc') out.sort((a, b) => (b[scoreField] ?? -1) - (a[scoreField] ?? -1));
  else if (sort === 'score-asc') out.sort((a, b) => (a[scoreField] ?? Infinity) - (b[scoreField] ?? Infinity));
  else out.sort((a, b) => new Date(b[dateField]) - new Date(a[dateField])); // 'new' (mặc định)
  return out;
}

let lastTranslations = [];

/** Bài dịch bé đã nộp — đoạn văn gốc, bản dịch của bé, điểm/nhận xét/bản
 * dịch mẫu AI, kết quả nối từ vựng, thời gian làm bài. Dữ liệu đã embed sẵn
 * `translation_passages` qua PostgREST (xem shared/api.js
 * kidTranslationSubmissions). Bài chưa được AI chấm (lỗi/hết quota lúc bé
 * nộp) hiện nút "Chấm lại" để phụ huynh tự thử lại bằng key AI của mình. */
function renderTranslateLog(translations) {
  lastTranslations = translations;
  applyTranslateFilters();
}

function applyTranslateFilters() {
  const range = $('trFilterRange').value;
  const sort = $('trFilterSort').value;
  renderTranslateLogRows(filterAndSortLog(lastTranslations, range, sort, 'submitted_at', 'ai_score'));
}
$('trFilterRange').addEventListener('change', applyTranslateFilters);
$('trFilterSort').addEventListener('change', applyTranslateFilters);

function renderTranslateLogRows(translations) {
  const box = $('translateLog');
  if (!translations.length) {
    box.innerHTML = lastTranslations.length
      ? '<i style="color:var(--ink-dim)">Không có bài dịch nào khớp bộ lọc đang chọn.</i>'
      : '<i style="color:var(--ink-dim)">Bé chưa nộp bài dịch nào.</i>';
    return;
  }
  box.innerHTML = translations.map((t) => {
    const p = t.translation_passages || {};
    const when = t.submitted_at ? new Date(t.submitted_at).toLocaleString('vi-VN') : '';
    const timeSpent = formatSeconds(t.seconds_spent);
    const graded = t.ai_score != null;
    const scoreLine = graded
      ? `<b style="color:${t.ai_score >= 70 ? 'var(--good)' : t.ai_score >= 40 ? '#b45309' : 'var(--bad)'}">Điểm AI chấm: ${t.ai_score}/100</b> · Nối từ vựng: ${t.vocab_correct ?? 0}/${t.vocab_total ?? 0}`
      : `<b style="color:#b45309">⏳ AI chưa chấm được bài này</b>
         <button data-action="regrade-tr" data-id="${t.id}" style="margin-left:8px;padding:2px 9px;font-size:12px">🔁 Chấm lại</button>
         <span style="margin-left:6px">· Nối từ vựng: ${t.vocab_correct ?? 0}/${t.vocab_total ?? 0}</span>`;
    return `<div class="card" style="margin-bottom:10px;padding:12px 14px">
      <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px">
        <b>${p.title || '(không rõ tiêu đề)'}</b>
        <span style="color:var(--ink-dim);font-size:12px">${when}${timeSpent ? ' · ' + timeSpent : ''}</span>
      </div>
      <p style="font-style:italic;color:var(--ink-dim);margin:6px 0">${p.passage_en || ''}</p>
      <p style="margin:6px 0"><b>Bản dịch của bé:</b> ${t.submitted_text || ''}</p>
      <p style="margin:6px 0">${scoreLine}</p>
      ${t.ai_feedback ? `<p style="margin:6px 0 0;font-size:13px">💬 ${t.ai_feedback}</p>` : ''}
      ${t.ai_reference_vi ? `<p style="margin:6px 0 0;font-size:13px"><b>📖 Bản dịch mẫu AI:</b> ${t.ai_reference_vi}</p>` : ''}
    </div>`;
  }).join('');
}

$('translateLog').addEventListener('click', async (e) => {
  const btn = e.target.closest('button[data-action="regrade-tr"]');
  if (!btn) return;
  const t = lastTranslations.find((x) => x.id === btn.dataset.id);
  if (!t || !state.kid) return;
  btn.disabled = true;
  btn.textContent = '🤖 Đang chấm...';
  try {
    const settings = await api.getSettings();
    const grade = await aiProvider.gradeTranslation(settings, {
      passageEn: t.translation_passages?.passage_en || '', submittedVi: t.submitted_text,
    });
    await api.updateTranslationGrade(t.id, { aiScore: grade.score, aiFeedback: grade.feedback, aiReferenceVi: grade.referenceVi });
    await renderKidStats(state.kid);
  } catch (e2) {
    btn.disabled = false;
    btn.textContent = `❌ Lỗi (${e2.message}) — bấm thử lại`;
  }
});

let lastGrammarQuizzes = [];

/** Đề trắc nghiệm ngữ pháp bé đã làm — điểm, gợi ý AI, thời gian làm bài, và
 * chi tiết từng câu (đáp án bé chọn + đáp án đúng + giải thích) — dữ liệu đã
 * embed sẵn `grammar_quizzes` qua PostgREST (xem shared/api.js
 * kidGrammarQuizSubmissions). Điểm luôn có ngay (tính client-side lúc bé
 * nộp) — chỉ riêng GỢI Ý AI có thể chưa có nếu AI lỗi/hết quota, hiện nút
 * "Chấm lại" để phụ huynh tự thử lại. */
function renderGrammarQuizLog(submissions) {
  lastGrammarQuizzes = submissions;
  applyGrammarFilters();
  renderFavoriteQuizQuestions();
}

function applyGrammarFilters() {
  const range = $('gqFilterRange').value;
  const sort = $('gqFilterSort').value;
  renderGrammarQuizLogRows(filterAndSortLog(lastGrammarQuizzes, range, sort, 'submitted_at', 'score'));
}
$('gqFilterRange').addEventListener('change', applyGrammarFilters);
$('gqFilterSort').addEventListener('change', applyGrammarFilters);

/** true nếu câu hỏi (so theo `prompt`, giống quy ước dedup của cả dự án) đã
 * được phụ huynh đánh dấu ⭐ yêu thích cho bé đang chọn. */
function isFavoriteQuizQuestion(prompt) {
  return !!state.kid?.settings?.favoriteQuizQuestions?.some((f) => f.prompt === prompt);
}

/** Render 1 câu hỏi trắc nghiệm: hiện CẢ 4 lựa chọn kèm giải thích riêng của
 * từng lựa chọn (dữ liệu `q.explanations` đã có sẵn giải thích cho mọi
 * option, không chỉ đáp án đúng/lựa chọn của bé) — để phụ huynh giải thích
 * được với bé vì sao các đáp án còn lại sai, không chỉ đáp án bé chọn. Dùng
 * chung cho cả log bài đã làm và danh sách ⭐ Yêu Thích. */
function renderQuestionDetail(q, pickedIndex) {
  const optionsHtml = (q.options || []).map((opt, oi) => {
    const isPicked = oi === pickedIndex;
    const isCorrect = oi === q.answer;
    const tag = isCorrect ? ' ✅ đáp án đúng' : isPicked ? ' ❌ bé chọn' : '';
    const color = isCorrect ? 'var(--good)' : isPicked ? 'var(--bad)' : 'var(--ink)';
    const explain = q.explanations?.[oi];
    return `<div style="margin:5px 0;padding:5px 8px;background:${isPicked || isCorrect ? 'var(--panel)' : 'transparent'};border-radius:6px;border:1px solid ${isCorrect ? 'var(--good)' : isPicked ? 'var(--bad)' : 'transparent'}">
      <div style="font-size:12.5px"><b style="color:${color}">${opt}</b>${tag}</div>
      ${explain ? `<div style="font-size:12px;margin:2px 0 0;color:var(--ink-dim)">💡 ${explain}</div>` : ''}
    </div>`;
  }).join('');
  return `<div style="font-size:12.5px;margin:6px 0 2px;font-weight:700;color:var(--ink-dim)">Tất cả 4 đáp án:</div>
    ${optionsHtml}
    ${q.structure ? `<div style="font-size:12.5px;margin:6px 0 0">📚 <b>Cấu trúc:</b> ${q.structure}</div>` : ''}
    ${q.translation ? `<div style="font-size:12.5px;margin:4px 0 0">🇻🇳 <b>Dịch:</b> ${q.translation}</div>` : ''}`;
}

function renderGrammarQuizLogRows(submissions) {
  const box = $('grammarQuizLog');
  if (!submissions.length) {
    box.innerHTML = lastGrammarQuizzes.length
      ? '<i style="color:var(--ink-dim)">Không có bài trắc nghiệm nào khớp bộ lọc đang chọn.</i>'
      : '<i style="color:var(--ink-dim)">Bé chưa làm bài trắc nghiệm ngữ pháp nào.</i>';
    return;
  }
  box.innerHTML = submissions.map((s) => {
    const quiz = s.grammar_quizzes || {};
    const questions = quiz.questions || [];
    const when = s.submitted_at ? new Date(s.submitted_at).toLocaleString('vi-VN') : '';
    const timeSpent = formatSeconds(s.seconds_spent);
    const total = questions.length || s.answers?.length || 0;
    const scoreColor = s.score >= total * 0.7 ? 'var(--good)' : s.score >= total * 0.4 ? '#b45309' : 'var(--bad)';
    const suggestionHtml = s.ai_suggestion
      ? `<p style="margin:6px 0;font-size:13px">💬 ${s.ai_suggestion}</p>`
      : `<p style="margin:6px 0;font-size:13px;color:#b45309">⏳ AI chưa soạn được gợi ý
         <button data-action="regrade-gq" data-id="${s.id}" style="margin-left:6px;padding:2px 9px;font-size:12px">🔁 Chấm lại</button></p>`;
    const qsHtml = questions.map((q, i) => {
      const a = s.answers?.[i] || {};
      const fav = isFavoriteQuizQuestion(q.prompt);
      return `<div style="margin:8px 0;padding:8px 10px;background:var(--panel2);border-radius:8px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
          <div><b>Câu ${i + 1}:</b> ${q.prompt}</div>
          <button type="button" class="ghost" data-action="toggle-fav-gq" data-sub-id="${s.id}" data-qi="${i}"
            style="margin:0;padding:2px 8px;font-size:13px;flex-shrink:0" title="${fav ? 'Bỏ yêu thích' : 'Lưu câu này vào ⭐ Yêu Thích'}">${fav ? '⭐' : '☆'}</button>
        </div>
        ${renderQuestionDetail(q, a.selected)}
      </div>`;
    }).join('');
    return `<div class="card" style="margin-bottom:10px;padding:12px 14px">
      <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px">
        <b>${EXAM_LEVEL_LABELS[quiz.level] || quiz.level || ''} · ${quiz.quiz_type === 'vocab' ? 'Từ Vựng' : 'Ngữ Pháp'} — ${quiz.day || ''}</b>
        <span style="color:var(--ink-dim);font-size:12px">${when}${timeSpent ? ' · ' + timeSpent : ''}</span>
      </div>
      <p style="margin:6px 0"><b style="color:${scoreColor}">Điểm: ${s.score}/${total}</b></p>
      ${suggestionHtml}
      ${qsHtml}
    </div>`;
  }).join('');
}

/** Đánh dấu/bỏ đánh dấu ⭐ 1 câu hỏi (so trùng theo `prompt`) — lưu SNAPSHOT
 * đầy đủ câu hỏi (không chỉ id) vào kid.settings.favoriteQuizQuestions vì
 * "Ai Là Triệu Phú"/trắc nghiệm thường không có bảng riêng dễ tra cứu lại 1
 * câu cụ thể theo thời gian, và câu hỏi có thể bị dedup/không còn xuất hiện
 * trong log sau này. */
async function toggleFavoriteQuizQuestion(quiz, question, pickedIndex) {
  if (!state.kid) return;
  const settings = { ...(state.kid.settings || {}) };
  const favs = [...(settings.favoriteQuizQuestions || [])];
  const idx = favs.findIndex((f) => f.prompt === question.prompt);
  if (idx >= 0) favs.splice(idx, 1);
  else {
    favs.unshift({
      prompt: question.prompt,
      options: question.options,
      answer: question.answer,
      explanations: question.explanations,
      structure: question.structure,
      translation: question.translation,
      pickedIndex,
      level: quiz.level,
      quizType: quiz.quiz_type,
      savedAt: new Date().toISOString(),
    });
  }
  settings.favoriteQuizQuestions = favs;
  const updated = await api.updateKid(state.kid.id, { settings });
  state.kid = updated || { ...state.kid, settings };
  applyGrammarFilters();
  renderFavoriteQuizQuestions();
}

function renderFavoriteQuizQuestions() {
  const box = $('favoriteQuizQuestions');
  if (!box) return;
  const favs = state.kid?.settings?.favoriteQuizQuestions || [];
  if (!favs.length) {
    box.innerHTML = '<i style="color:var(--ink-dim)">Chưa có câu nào được đánh dấu yêu thích — bấm ☆ cạnh 1 câu trong danh sách bài đã làm ở trên để lưu lại.</i>';
    return;
  }
  box.innerHTML = favs.map((f, i) => `<div style="margin:8px 0;padding:8px 10px;background:var(--panel2);border-radius:8px">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
      <div><b>${EXAM_LEVEL_LABELS[f.level] || f.level || ''}${f.quizType && f.quizType !== 'grammar' ? ` · ${f.quizType}` : ''}:</b> ${f.prompt}</div>
      <button type="button" class="ghost" data-action="remove-fav-gq" data-i="${i}" style="margin:0;padding:2px 8px;font-size:13px;flex-shrink:0">🗑️</button>
    </div>
    ${renderQuestionDetail(f, f.pickedIndex)}
  </div>`).join('');
}

$('favoriteQuizQuestions').addEventListener('click', async (e) => {
  const btn = e.target.closest('button[data-action="remove-fav-gq"]');
  if (!btn || !state.kid) return;
  const i = Number(btn.dataset.i);
  const settings = { ...(state.kid.settings || {}) };
  const favs = [...(settings.favoriteQuizQuestions || [])];
  favs.splice(i, 1);
  settings.favoriteQuizQuestions = favs;
  const updated = await api.updateKid(state.kid.id, { settings });
  state.kid = updated || { ...state.kid, settings };
  applyGrammarFilters();
  renderFavoriteQuizQuestions();
});

$('grammarQuizLog').addEventListener('click', async (e) => {
  const favBtn = e.target.closest('button[data-action="toggle-fav-gq"]');
  if (favBtn) {
    const s = lastGrammarQuizzes.find((x) => x.id === favBtn.dataset.subId);
    const qi = Number(favBtn.dataset.qi);
    const q = s?.grammar_quizzes?.questions?.[qi];
    if (!s || !q) return;
    favBtn.disabled = true;
    try {
      await toggleFavoriteQuizQuestion(s.grammar_quizzes, q, s.answers?.[qi]?.selected);
    } finally {
      favBtn.disabled = false;
    }
    return;
  }
  const btn = e.target.closest('button[data-action="regrade-gq"]');
  if (!btn) return;
  const s = lastGrammarQuizzes.find((x) => x.id === btn.dataset.id);
  if (!s || !state.kid) return;
  btn.disabled = true;
  btn.textContent = '🤖 Đang chấm...';
  try {
    const quiz = s.grammar_quizzes || {};
    const results = (quiz.questions || []).map((q, i) => ({ prompt: q.prompt, correct: !!s.answers?.[i]?.correct }));
    const settings = await api.getSettings();
    const grade = await aiProvider.gradeGrammarQuiz(settings, { results });
    await api.updateGrammarQuizSuggestion(s.id, grade.suggestion);
    await renderKidStats(state.kid);
  } catch (e2) {
    btn.disabled = false;
    btn.textContent = `❌ Lỗi (${e2.message}) — bấm thử lại`;
  }
});

function renderExamProgress(sessions) {
  const box = $('examProgress');
  const rows = examProgressReport(sessions);
  if (!rows.length) {
    box.innerHTML = '<i style="font-size:13px;color:var(--ink-dim)">Bé chưa chơi game nào trong khu Thi Chứng Chỉ Anh.</i>';
    return;
  }
  box.innerHTML = `<div class="cmp">
    <div class="head"></div><div class="head">Phút học</div><div class="head">Số ván</div><div class="head">Lần chơi gần nhất</div><div class="head">Hiệu quả</div>
    ${rows.map((r) => {
      const badge = EXAM_TREND_BADGE[r.trend];
      const last = r.daysSinceLast === null ? '—'
        : r.daysSinceLast === 0 ? 'Hôm nay'
          : `${r.daysSinceLast} ngày trước`;
      return `
      <div class="kname">${r.label}</div>
      <div>${r.minutes} phút</div>
      <div>${r.sessions} ván</div>
      <div>${last}</div>
      <div style="${badge.cls === 'good' ? 'color:var(--good)' : badge.cls === 'bad' ? 'color:var(--bad)' : ''}">${badge.icon} ${badge.text}</div>`;
    }).join('')}
  </div>`;
}

/* ===== So sánh các bé (1 request/bảng nhờ truy vấn gộp cả nhà) ===== */

let compareRenderedAt = 0;

async function renderCompare(force = false) {
  if (state.kids.length < 2) { $('compareCard').classList.add('hidden'); return; }
  if (!force && Date.now() - compareRenderedAt < 30000) return; // loadKids/live gọi nhiều lần — chỉ tải lại sau 30s
  compareRenderedAt = Date.now();
  try {
    const fourWeeksAgo = new Date(Date.now() - 28 * 86400000).toISOString();
    const [stars, weak, sessions4w, ledgerAll] = await Promise.all([
      api.familyStarBalances(), api.familyWeakCounts(),
      api.familySessionsSince(fourWeeksAgo),
      api.familyLedgerSince(fourWeeksAgo),
    ]);
    const start = weekStart();
    const perKid = state.kids.map((k) => {
      const mine4w = sessions4w.filter((s) => s.profile_id === k.id);
      const mineWeek = mine4w.filter((s) => s.played_at && new Date(s.played_at) >= start);
      const minutes = Math.round(mineWeek.reduce((sum, s) => sum + (s.seconds || 0), 0) / 60);
      const days = new Set(mineWeek.map((s) => (s.played_at || '').slice(0, 10))).size;
      return {
        k, minutes, days, stars: stars.get(k.id) || 0, weak: weak.get(k.id) || 0,
        trend: weeklyWinRate(mine4w),
      };
    });
    const maxMin = Math.max(1, ...perKid.map((r) => r.minutes));
    $('compareBox').innerHTML = `<div class="cmp">
      <div class="head"></div><div class="head">Phút chơi tuần</div><div class="head">Ngày học</div><div class="head">⭐ Sao</div><div class="head">🎯 Từ cần ôn</div>
      ${perKid.map((r) => `
        <div class="kname">${r.k.avatar} ${r.k.name}</div>
        <div class="track"><div class="fill" style="width:${Math.round((r.minutes / maxMin) * 100)}%;background:${r.k.color || '#ff8a3d'}"></div></div>
        <div>${r.days}/7 <span style="color:var(--ink-dim)">(${r.minutes}p)</span></div>
        <div><b>${r.stars}</b></div>
        <div>${r.weak ? `<b style="color:var(--bad)">${r.weak}</b>` : '<span style="color:var(--good)">0 🎉</span>'}</div>`).join('')}
    </div>`;

    // Tiến bộ 4 tuần: 1 hàng cột nhỏ riêng cho mỗi bé (dùng đúng màu bé).
    $('compareTrend').innerHTML = perKid.map((r) => `
      <div style="margin-bottom:12px">
        <div style="font-weight:800;font-size:13px;margin-bottom:4px">${r.k.avatar} ${r.k.name}</div>
        <div class="trend">${r.trend.map((w) => {
          const pct = w.rate === null ? 0 : Math.round(w.rate * 100);
          return `<div class="col">
            <div class="pct">${w.rate === null ? '—' : `${pct}%`}</div>
            <div class="tbar" style="height:${w.rate === null ? 3 : Math.max(4, pct * 0.6)}px;${w.rate === null ? 'background:#d8cdb6' : `background:${r.k.color || '#ff8a3d'}`}"></div>
            <div class="tlab">${w.label}</div></div>`;
        }).join('')}</div>
      </div>`).join('');

    // Hoạt động gần đây gộp cả nhà (sổ sao mọi bé, sắp theo thời gian).
    const kidOf = new Map(state.kids.map((k) => [k.id, k]));
    $('compareActivity').innerHTML = ledgerAll.length
      ? ledgerAll.slice(0, 40).map((r) => {
          const k = kidOf.get(r.profile_id);
          return `<div style="padding:4px 0;border-bottom:1px solid var(--line)">
            ${k ? `${k.avatar} <b>${k.name}</b>` : 'Bé (đã xóa)'} — ${(r.ts || '').slice(0, 10)} —
            <span style="color:${r.delta > 0 ? 'var(--good)' : 'var(--bad, #c2410c)'}">${r.delta > 0 ? '+' : ''}${r.delta}⭐</span> —
            ${viReason(r.reason)}
          </div>`;
        }).join('')
      : '<i style="color:var(--ink-dim)">Chưa có giao dịch sao nào trong 4 tuần qua.</i>';
  } catch (e) {
    $('compareBox').innerHTML = `<i style="font-size:13px;color:var(--ink-dim)">Không tải được (${e.message})</i>`;
  }
}

/* ===== Sao chép báo cáo + chế độ trực tiếp ===== */

$('btnCopyReport').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(lastReportText);
    $('copyOk').textContent = 'Đã sao chép — dán vào Zalo/tin nhắn để chia sẻ.';
  } catch {
    $('copyOk').textContent = 'Không sao chép được — chọn tay đoạn trên rồi Ctrl+C nhé.';
  }
  setTimeout(() => { $('copyOk').textContent = ''; }, 4000);
});

// "Trực tiếp" = tự tải lại mỗi 15 giây (đủ nhanh cho mắt người; chọn polling
// thay vì WebSocket Realtime để giữ nguyên kiểu "không SDK, không build").
let liveTimer = null;
$('liveToggle').addEventListener('change', (e) => {
  clearInterval(liveTimer);
  liveTimer = null;
  if (e.target.checked) {
    liveTimer = setInterval(() => {
      if (state.compareMode) renderCompare(true).catch(() => {});
      else if (state.kid) renderKidStats(state.kid).catch(() => {});
      renderLoginLog();
    }, 15000);
  }
});

/* ===== Phát thưởng tay ===== */

$('btnGift').addEventListener('click', async () => {
  if (!state.kid) return;
  $('giftOk').textContent = '';
  try {
    await api.sendManualReward(state.kid.id, {
      stars: Number($('giftStars').value) || 0,
      message: $('giftMsg').value.trim(),
    });
    $('giftOk').textContent = `Đã gửi! Bé ${state.kid.name} sẽ thấy hộp quà khi mở game. 🎁`;
    $('giftMsg').value = '';
  } catch (e) { $('giftOk').textContent = `Lỗi: ${e.message}`; }
});

// Chỉnh tay số sao hiện có của bé — cộng (số dương) hoặc trừ (số âm) NGAY
// LẬP TỨC vào số dư, khác với "Thưởng cho bé" ở trên (chỉ cộng, và bé phải
// tự mở hộp quà trong game mới được cộng). Dùng lại đúng hàm grantStars()
// (ghi thẳng vào reward_ledger) đã có sẵn cho các luồng thưởng/trừ khác.
$('btnAdjustStars').addEventListener('click', async () => {
  if (!state.kid) return;
  $('adjustOk').textContent = '';
  const delta = Math.trunc(Number($('adjustStars').value));
  if (!delta) {
    $('adjustOk').textContent = 'Nhập số sao muốn cộng (số dương) hoặc trừ (số âm), khác 0.';
    return;
  }
  try {
    if (delta < 0) {
      const balance = await api.starBalance(state.kid.id);
      if (balance + delta < 0) {
        $('adjustOk').textContent = `Bé chỉ có ${balance} sao, không thể trừ ${-delta} sao.`;
        return;
      }
    }
    const note = $('adjustNote').value.trim();
    await api.grantStars(state.kid.id, delta, `phu-huynh:${note || 'dieu-chinh'}`);
    $('adjustOk').textContent = delta > 0
      ? `Đã cộng thêm ${delta} sao cho bé ${state.kid.name}.`
      : `Đã trừ ${-delta} sao của bé ${state.kid.name}.`;
    $('adjustStars').value = '';
    $('adjustNote').value = '';
    await renderKidStats(state.kid);
  } catch (e) { $('adjustOk').textContent = `Lỗi: ${e.message}`; }
});

/* ===== Cài đặt + thiết bị + quản trị ===== */

async function loadSettings() {
  const s = await api.getSettings();
  $('setLimit').value = s.daily_limit_min;
  $('setRate').value = s.tts_rate;
  $('setRewardMult').value = s.reward_cost_multiplier ?? DEFAULT_REWARD_COST_MULTIPLIER;
  $('aiProvider').value = s.ai_provider || 'groq';
  $('aiKey').value = s.ai_api_key || '';
  $('deepseekKey').value = s.deepseek_api_key || '';
  $('deepseekModel').value = s.deepseek_model || '';
  updateAiProviderBoxes();
  renderPriceEditor(s);
  renderCustomItemList(s.custom_catalog_items || []);
}

/* ===== Quà tự thêm (settings.custom_catalog_items) ===== */

function renderCustomItemList(items) {
  const box = $('customItemList');
  if (!items.length) {
    box.innerHTML = '<i style="color:var(--ink-dim)">Chưa có quà tự thêm nào.</i>';
    return;
  }
  box.innerHTML = items.map((it) => `
    <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:6px 0;border-bottom:1px solid var(--line)">
      <span>${it.icon} ${it.name} — ⭐ ${it.cost}</span>
      <button data-action="remove-custom-item" data-id="${it.id}" class="ghost" style="margin:0;padding:2px 9px;font-size:12px">🗑️ Xoá</button>
    </div>`).join('');
}

$('btnAddCustomItem').addEventListener('click', async () => {
  const ok = $('customItemOk');
  ok.textContent = '';
  const icon = $('newItemIcon').value.trim() || '🎁';
  const name = $('newItemName').value.trim();
  const cost = Number($('newItemCost').value);
  if (!name || !(cost > 0)) { ok.textContent = 'Nhập tên quà và giá sao (lớn hơn 0) đã nhé.'; return; }
  try {
    const settings = await api.getSettings();
    const items = [...(settings.custom_catalog_items || [])];
    items.push({ id: `custom-${Date.now()}`, icon, name, cost: Math.round(cost) });
    await api.saveSettings({ custom_catalog_items: items });
    $('newItemIcon').value = ''; $('newItemName').value = ''; $('newItemCost').value = '';
    ok.textContent = `Đã thêm "${name}" vào Tủ Quà!`;
    renderCustomItemList(items);
  } catch (e) { ok.textContent = `Lỗi: ${e.message}`; }
});

$('customItemList').addEventListener('click', async (e) => {
  const btn = e.target.closest('button[data-action="remove-custom-item"]');
  if (!btn) return;
  btn.disabled = true;
  try {
    const settings = await api.getSettings();
    const items = (settings.custom_catalog_items || []).filter((it) => it.id !== btn.dataset.id);
    await api.saveSettings({ custom_catalog_items: items });
    renderCustomItemList(items);
  } catch { btn.disabled = false; }
});

/* ===== Trợ Lý AI (Groq/DeepSeek) — key gọi thẳng từ trình duyệt (xem cảnh báo trong index.html) ===== */

// Gia đình tạo trước 07/2026 chưa có các cột này -> PostgREST từ chối ghi (PGRST204).
function viAiKeyError(msg) {
  if (/deepseek_api_key|deepseek_model/.test(msg)) {
    return 'Cần chạy server/migrate-10-deepseek.sql trong Supabase SQL Editor để dùng DeepSeek (database gia đình tạo trước chưa có 2 cột này).';
  }
  if (/ai_api_key/.test(msg) || /ai_provider/.test(msg) || /PGRST204/.test(msg)) {
    return 'Cần chạy server/migrate-06-ai-key.sql trong Supabase SQL Editor để bật Trợ Lý AI (database gia đình tạo trước chưa có 2 cột này).';
  }
  return msg;
}

function updateAiProviderBoxes() {
  const isDeepSeek = $('aiProvider').value === 'deepseek';
  $('groqBox').classList.toggle('hidden', isDeepSeek);
  $('deepseekBox').classList.toggle('hidden', !isDeepSeek);
}
$('aiProvider').addEventListener('change', updateAiProviderBoxes);

function currentAiSettingsFromForm() {
  return {
    ai_provider: $('aiProvider').value,
    ai_api_key: $('aiKey').value.trim(),
    deepseek_api_key: $('deepseekKey').value.trim(),
    deepseek_model: $('deepseekModel').value.trim(),
  };
}

$('btnSaveAiKey').addEventListener('click', async () => {
  $('aiKeyOk').textContent = '';
  try {
    await api.saveSettings(currentAiSettingsFromForm());
    $('aiKeyOk').textContent = 'Đã lưu — áp dụng cho mọi máy của gia đình.';
  } catch (e) { $('aiKeyOk').textContent = `Lỗi: ${viAiKeyError(e.message)}`; }
});

$('btnTestAiKey').addEventListener('click', async () => {
  $('aiKeyOk').textContent = 'Đang kiểm tra…';
  const ok = await aiProvider.testProviderKey(currentAiSettingsFromForm());
  $('aiKeyOk').textContent = ok ? '✅ Key hoạt động tốt!' : '❌ Key không hoạt động — kiểm tra lại key hoặc mạng.';
});

$('btnClearAiKey').addEventListener('click', async () => {
  $('aiKeyOk').textContent = '';
  try {
    const isDeepSeek = $('aiProvider').value === 'deepseek';
    await api.saveSettings(isDeepSeek ? { deepseek_api_key: '' } : { ai_api_key: '' });
    if (isDeepSeek) $('deepseekKey').value = ''; else $('aiKey').value = '';
    $('aiKeyOk').textContent = 'Đã xóa key.';
  } catch (e) { $('aiKeyOk').textContent = `Lỗi: ${viAiKeyError(e.message)}`; }
});

$('btnSaveSettings').addEventListener('click', async () => {
  $('setOk').textContent = '';
  try {
    await api.saveSettings({
      daily_limit_min: Number($('setLimit').value) || 45,
      tts_rate: Number($('setRate').value) || 1.0,
      reward_cost_multiplier: Number($('setRewardMult').value) || DEFAULT_REWARD_COST_MULTIPLIER,
    });
    $('setOk').textContent = 'Đã lưu — áp dụng cho mọi máy của gia đình.';
    await loadSettings(); // giá riêng từng món hiển thị lại đúng theo hệ số chung MỚI
  } catch (e) { $('setOk').textContent = `Lỗi: ${e.message}`; }
});

/* ===== Chỉnh giá riêng từng món quà (ghi đè hệ số chung, riêng cho gia đình này) ===== */

// Gia đình tạo trước 07/2026 chưa có cột custom_item_costs -> PostgREST từ
// chối ghi với PGRST204 ("Could not find the 'custom_item_costs' column").
function viSettingsError(msg) {
  if (/custom_item_costs/.test(msg) || /PGRST204/.test(msg)) {
    return 'Cần chạy server/migrate-05-custom-item-costs.sql trong Supabase SQL Editor để bật tính năng chỉnh giá riêng từng món quà (database gia đình tạo trước 07/2026 chưa có cột này).';
  }
  return msg;
}

function renderPriceEditor(settings) {
  const overrides = settings.custom_item_costs || {};
  const multiplier = settings.reward_cost_multiplier ?? DEFAULT_REWARD_COST_MULTIPLIER;
  $('priceEditor').innerHTML = CATALOG.map((item) => {
    const current = effectiveCost(item, multiplier, overrides);
    const isCustom = Object.prototype.hasOwnProperty.call(overrides, item.id) && Number(overrides[item.id]) > 0;
    return `<div style="display:flex;align-items:center;gap:8px;margin:5px 0">
      <span style="font-size:20px;flex:none">${item.icon}</span>
      <span style="flex:1">${item.name}${isCustom ? ' <b style="color:var(--gold2)">(đã chỉnh)</b>' : ''}</span>
      <input type="number" min="1" step="1" data-item-id="${item.id}" value="${current}" style="width:80px" />
    </div>`;
  }).join('');
}

$('btnSavePrices').addEventListener('click', async () => {
  $('priceOk').textContent = '';
  try {
    const settings = await api.getSettings();
    const multiplier = settings.reward_cost_multiplier ?? DEFAULT_REWARD_COST_MULTIPLIER;
    const overrides = {};
    for (const input of $('priceEditor').querySelectorAll('input[data-item-id]')) {
      const id = input.dataset.itemId;
      const item = catalogItem(id);
      const val = Number(input.value);
      if (!item || !(val > 0)) continue;
      // Chỉ lưu override nếu KHÁC giá mặc định (chưa chỉnh gì) — để nếu sau
      // này đổi hệ số chung, món chưa chỉnh vẫn tự động ăn theo hệ số mới.
      const defaultVal = effectiveCost(item, multiplier, null);
      if (val !== defaultVal) overrides[id] = val;
    }
    await api.saveSettings({ custom_item_costs: overrides });
    $('priceOk').textContent = 'Đã lưu giá quà riêng cho Tủ Quà của gia đình!';
    await loadSettings();
  } catch (e) { $('priceOk').textContent = `Lỗi: ${viSettingsError(e.message)}`; }
});

$('btnResetPrices').addEventListener('click', async () => {
  $('priceOk').textContent = '';
  try {
    await api.saveSettings({ custom_item_costs: {} });
    $('priceOk').textContent = 'Đã đưa mọi giá quà về mặc định.';
    await loadSettings();
  } catch (e) { $('priceOk').textContent = `Lỗi: ${viSettingsError(e.message)}`; }
});

async function loadDevices() {
  try {
    const list = await api.listDevices();
    $('deviceList').innerHTML = list.length
      ? list.map((d) => `📱 ${d.label} — hoạt động ${(d.last_seen || '').slice(0, 10)}`).join('<br>')
      : 'Chưa có thiết bị nào liên kết.';
  } catch { $('deviceList').textContent = '…'; }
}

/* ===== Nhập dữ liệu cũ trên máy này (localStorage thời chưa có server) ===== */

function legacyData() {
  try {
    const profiles = JSON.parse(localStorage.getItem('pika.profiles'))?.list || [];
    if (!profiles.length) return null;
    const misses = JSON.parse(localStorage.getItem('nghedoan-misses')) || {};
    return { profiles, misses };
  } catch { return null; }
}

function maybeShowImport() {
  const done = localStorage.getItem('r99-imported');
  if (!done && legacyData()) $('btnImportLegacy').classList.remove('hidden');
}

$('btnImportLegacy').addEventListener('click', async () => {
  $('adminErr').textContent = '';
  const legacy = legacyData();
  if (!legacy) return;
  const names = legacy.profiles.map((p) => p.name).join(', ');
  if (!confirm(`Nhập ${legacy.profiles.length} hồ sơ cũ trên máy này (${names}) cùng lịch sử chơi + sổ từ hay sai lên server?`)) return;
  const btn = $('btnImportLegacy');
  btn.disabled = true;
  btn.textContent = 'Đang nhập…';
  try {
    let firstKidId = null;
    for (const old of legacy.profiles) {
      const kid = await api.addKid({ name: old.name, avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)] });
      if (!firstKidId) firstKidId = kid.id;
      let sessions = [];
      try { sessions = JSON.parse(localStorage.getItem(`pika.stats.${old.id}`)) || []; } catch { /* ignore */ }
      if (sessions.length) await api.importLegacySessions(kid.id, sessions);
    }
    // Sổ từ hay sai cũ là sổ chung cả máy — gán cho bé đầu tiên vừa nhập.
    if (firstKidId && Object.keys(legacy.misses).length) {
      await api.importLegacyMisses(firstKidId, legacy.misses);
    }
    localStorage.setItem('r99-imported', '1');
    btn.classList.add('hidden');
    await loadKids();
    alert('Đã nhập xong dữ liệu cũ lên server!');
  } catch (e) {
    $('adminErr').textContent = `Nhập lỗi giữa chừng: ${e.message} (bấm lại để thử tiếp — dữ liệu trùng tên bé sẽ tạo hồ sơ mới).`;
    btn.disabled = false;
    btn.textContent = '📥 Nhập dữ liệu cũ trên máy này';
  }
});

$('btnExport').addEventListener('click', async () => {
  $('adminErr').textContent = '';
  try {
    const data = await api.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `reply1999-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  } catch (e) { $('adminErr').textContent = e.message; }
});

$('btnDeleteAll').addEventListener('click', async () => {
  $('adminErr').textContent = '';
  const typed = prompt('Thao tác này XÓA VĨNH VIỄN mọi hồ sơ bé, tiến độ, sao và quà trên server.\nGõ chữ XOA để xác nhận:');
  if (typed !== 'XOA') return;
  try {
    await api.deleteFamily();
    alert('Đã xóa toàn bộ dữ liệu gia đình.');
    location.reload();
  } catch (e) { $('adminErr').textContent = e.message; }
});

boot();
