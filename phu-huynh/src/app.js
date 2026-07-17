// Trang Phụ Huynh — đăng nhập tài khoản phụ huynh (Supabase Auth), quản lý hồ
// sơ bé, xem tiến độ + từ hay sai, phát thưởng kèm lời nhắn, cài đặt chung,
// xuất/xóa dữ liệu. Toàn bộ dữ liệu đọc/ghi qua shared/api.js (server thuần).

import * as api from '../../shared/api.js';
import { buildWeeklyReport, formatReportVi } from '../../shared/report.js';

const $ = (id) => document.getElementById(id);
const AVATARS = ['🐰', '🐯', '🐸', '🦄', '🐼', '🐥', '🦊', '🐨', '🐷', '🦁', '🐳', '🦖'];

const state = { kids: [], kid: null, avatar: AVATARS[0] };

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
    $('addKidBox').open = true;
    return;
  }
  for (const k of state.kids) {
    const b = document.createElement('button');
    b.className = `kid-tab${state.kid?.id === k.id ? ' active' : ''}`;
    b.textContent = `${k.avatar} ${k.name}`;
    b.addEventListener('click', () => selectKid(k));
    tabs.appendChild(b);
  }
  if (!state.kid) selectKid(state.kids[0]);
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
  await loadKids();
  $('kidPanel').classList.remove('hidden');
  $('kidTitle').textContent = `${k.avatar} ${k.name}`;
  fillEditKid(k);
  renderKidStats(k).catch((e) => { $('adminErr').textContent = e.message; });
}

/* ===== Sửa hồ sơ + cài đặt riêng của bé ===== */

function fillEditKid(k) {
  $('editKidName').value = k.name;
  state.editAvatar = k.avatar;
  buildEditAvatarPick();
  $('editKidLimit').value = k.settings?.daily_limit_min ?? '';
  $('editKidOk').textContent = '';
}

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
  const settings = { ...(state.kid.settings || {}) };
  if (limitRaw === '') delete settings.daily_limit_min;
  else settings.daily_limit_min = Math.max(0, Number(limitRaw) | 0);
  try {
    const updated = await api.updateKid(state.kid.id, { name, avatar: state.editAvatar, settings });
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

async function renderKidStats(k) {
  const [sessions, stars, weak, ledger, purchases] = await Promise.all([
    api.kidSessions(k.id), api.starBalance(k.id), api.weakWordsServer(k.id),
    apiLedger(k.id), api.kidPurchases(k.id).catch(() => []),
  ]);

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

  // Từ hay sai + nút đọc thử
  const box = $('weakWords');
  box.innerHTML = weak.length ? '' : '<i style="font-size:13px;color:var(--good)">Không có từ nào cần ôn — bé đang làm rất tốt! 🎉</i>';
  for (const w of weak.slice(0, 60)) {
    const chip = document.createElement('span');
    chip.className = 'word-chip';
    chip.innerHTML = `<b>${w.word}</b> <span class="n">×${w.misses}</span>`;
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
    chip.appendChild(btn);
    box.appendChild(chip);
  }

  // Sổ sao gần nhất
  $('rewardLog').innerHTML = ledger.length
    ? `<table>${ledger.slice(0, 25).map((r) =>
        `<tr><td>${(r.ts || '').slice(0, 10)}</td><td>${r.delta > 0 ? '+' : ''}${r.delta}⭐</td><td>${viReason(r.reason)}</td></tr>`).join('')}</table>`
    : '<i style="color:var(--ink-dim)">Chưa có giao dịch sao nào.</i>';
}

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
  return reason;
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
      if (state.kid) renderKidStats(state.kid).catch(() => {});
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

/* ===== Cài đặt + thiết bị + quản trị ===== */

async function loadSettings() {
  const s = await api.getSettings();
  $('setLimit').value = s.daily_limit_min;
  $('setRate').value = s.tts_rate;
}

$('btnSaveSettings').addEventListener('click', async () => {
  $('setOk').textContent = '';
  try {
    await api.saveSettings({
      daily_limit_min: Number($('setLimit').value) || 45,
      tts_rate: Number($('setRate').value) || 1.0,
    });
    $('setOk').textContent = 'Đã lưu — áp dụng cho mọi máy của gia đình.';
  } catch (e) { $('setOk').textContent = `Lỗi: ${e.message}`; }
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
