// Trang Phụ Huynh — đăng nhập tài khoản phụ huynh (Supabase Auth), quản lý hồ
// sơ bé, xem tiến độ + từ hay sai, phát thưởng kèm lời nhắn, cài đặt chung,
// xuất/xóa dữ liệu. Toàn bộ dữ liệu đọc/ghi qua shared/api.js (server thuần).

import * as api from '../../shared/api.js';
import {
  buildWeeklyReport, formatReportVi, minutesByGroup, minutesByTimeOfDay, weeklyWinRate, weekStart,
} from '../../shared/report.js';
import {
  catalogItem, CATALOG, effectiveCost, DEFAULT_REWARD_COST_MULTIPLIER,
} from '../../shared/rewards.js';

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
  renderCompare();
  renderLoginLog();
  if (!state.kid) selectKid(state.kids[0]);
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
  await loadKids();
  $('kidPanel').classList.remove('hidden');
  $('kidTitle').textContent = `${k.avatar} ${k.name}`;
  fillEditKid(k);
  renderKidStats(k).catch((e) => { $('adminErr').textContent = e.message; });
}

/* ===== Sửa hồ sơ + cài đặt riêng của bé ===== */

const KID_COLORS = ['#ff8a3d', '#e5484d', '#2f9e60', '#2f6bd8', '#9b59d0', '#d9720c', '#0ea5b7', '#e04f9c'];

function fillEditKid(k) {
  $('editKidName').value = k.name;
  state.editAvatar = k.avatar;
  state.editColor = k.color || KID_COLORS[0];
  buildEditAvatarPick();
  buildEditColorPick();
  $('editKidCode').value = k.settings?.code || '';
  $('editKidLimit').value = k.settings?.daily_limit_min ?? '';
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
  const settings = { ...(state.kid.settings || {}) };
  if (limitRaw === '') delete settings.daily_limit_min;
  else settings.daily_limit_min = Math.max(0, Number(limitRaw) | 0);
  if (codeRaw === '') delete settings.code;
  else settings.code = codeRaw;
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

  renderAnalytics(sessions);

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
    const item = catalogItem(p.item_id) || { icon: '🎁', name: p.item_id };
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

/* ===== So sánh các bé (1 request/bảng nhờ truy vấn gộp cả nhà) ===== */

let compareRenderedAt = 0;

async function renderCompare() {
  if (state.kids.length < 2) { $('compareCard').classList.add('hidden'); return; }
  $('compareCard').classList.remove('hidden');
  if (Date.now() - compareRenderedAt < 30000) return; // loadKids gọi nhiều lần — chỉ tải lại sau 30s
  compareRenderedAt = Date.now();
  try {
    const [stars, weak, sessions] = await Promise.all([
      api.familyStarBalances(), api.familyWeakCounts(),
      api.familySessionsSince(weekStart().toISOString()),
    ]);
    const perKid = state.kids.map((k) => {
      const mine = sessions.filter((s) => s.profile_id === k.id);
      const minutes = Math.round(mine.reduce((sum, s) => sum + (s.seconds || 0), 0) / 60);
      const days = new Set(mine.map((s) => (s.played_at || '').slice(0, 10))).size;
      return { k, minutes, days, stars: stars.get(k.id) || 0, weak: weak.get(k.id) || 0 };
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
      if (state.kid) renderKidStats(state.kid).catch(() => {});
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
  renderPriceEditor(s);
}

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
  } catch (e) { $('priceOk').textContent = `Lỗi: ${e.message}`; }
});

$('btnResetPrices').addEventListener('click', async () => {
  $('priceOk').textContent = '';
  try {
    await api.saveSettings({ custom_item_costs: {} });
    $('priceOk').textContent = 'Đã đưa mọi giá quà về mặc định.';
    await loadSettings();
  } catch (e) { $('priceOk').textContent = `Lỗi: ${e.message}`; }
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
