// Trang Admin — thống kê TOÀN HỆ THỐNG (mọi gia đình): số gia đình/bé, ván
// chơi, số máy đang online (~5 phút gần nhất), ping database, số dòng từng
// bảng, dung lượng database, số lượt gọi AI theo ngày. Chỉ tài khoản admin
// (biến môi trường ADMIN_EMAIL trên Vercel) mới xem được — xác thực THẬT SỰ
// nằm ở server (api/admin-stats.js kiểm tra access token qua Supabase Auth),
// trang này chỉ là giao diện gọi API đó.

import * as api from '../../shared/api.js';
import { mountThemePicker } from '../../shared/theme.js';

const $ = (id) => document.getElementById(id);
const VIEWS = ['viewSetup', 'viewAuth', 'viewLoading', 'viewDenied', 'viewMain'];

mountThemePicker($('themeSlot'));

function show(id) {
  for (const v of VIEWS) $(v).classList.toggle('hidden', v !== id);
}

async function boot() {
  if (!(await api.configured())) { show('viewSetup'); return; }
  if (!api.signedIn()) { show('viewAuth'); return; }
  show('viewLoading');
  await loadStats();
}

$('btnSignIn').addEventListener('click', async () => {
  $('authErr').textContent = '';
  try {
    await api.signIn($('email').value.trim(), $('password').value);
    boot();
  } catch (e) { $('authErr').textContent = e.message; }
});

$('btnSignOut').addEventListener('click', () => { api.signOut(); boot(); });
$('btnSignOut2').addEventListener('click', () => { api.signOut(); boot(); });
$('btnRefresh').addEventListener('click', () => { show('viewLoading'); loadStats(); });

async function loadStats() {
  try {
    const token = api.accessToken();
    const res = await fetch('/api/admin-stats', { headers: { Authorization: `Bearer ${token}` } });
    if (res.status === 403) { show('viewDenied'); return; }
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Lỗi ${res.status}`);
    renderStats(data);
    show('viewMain');
    loadCronState();
  } catch (e) {
    show('viewAuth');
    $('authErr').textContent = `Không tải được thống kê: ${e.message}`;
  }
}

/* ===== ⏯️ Cron sinh bài AI mỗi ngày (xem api/admin-cron.js) ===== */

async function loadCronState() {
  const row = $('cronStatusRow');
  const btn = $('btnToggleCron');
  try {
    const token = api.accessToken();
    const res = await fetch('/api/admin-cron', { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Lỗi ${res.status}`);
    renderCronState(data);
  } catch (e) {
    row.innerHTML = `<i style="color:var(--bad);font-size:13px">Không tải được (${e.message})</i>`;
    btn.disabled = true;
  }
}

function renderCronState(data) {
  const row = $('cronStatusRow');
  const btn = $('btnToggleCron');
  row.innerHTML = `<div class="stat">Trạng thái<b style="color:${data.enabled ? 'var(--good)' : 'var(--bad)'}">${data.enabled ? '🟢 Đang BẬT' : '🔴 Đang TẮT'}</b></div>`
    + (data.updatedAt ? `<div class="stat">Đổi lần cuối<b style="font-size:13px">${new Date(data.updatedAt).toLocaleString('vi-VN')}</b></div>` : '');
  btn.disabled = false;
  btn.textContent = data.enabled ? '⏸️ Tắt cron' : '▶️ Bật lại cron';
  btn.className = data.enabled ? 'ghost' : '';
  btn.onclick = () => toggleCron(!data.enabled);
}

async function toggleCron(enabled) {
  const btn = $('btnToggleCron');
  const msg = $('cronMsg');
  btn.disabled = true;
  msg.textContent = '';
  try {
    const token = api.accessToken();
    const res = await fetch('/api/admin-cron', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Lỗi ${res.status}`);
    renderCronState({ enabled: data.enabled, updatedAt: new Date().toISOString() });
  } catch (e) {
    msg.textContent = `Lỗi: ${e.message}`;
    btn.disabled = false;
  }
}

function formatBytes(n) {
  if (n == null) return '—';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let v = n;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return `${v.toFixed(1)} ${units[i]}`;
}

function renderStats(data) {
  $('who').textContent = api.sessionUser()?.email || '';
  $('generatedAt').textContent = `Cập nhật lúc ${new Date(data.generatedAt).toLocaleString('vi-VN')}`;
  $('statsRow').innerHTML = `
    <div class="stat">Gia đình<b>${data.families}</b></div>
    <div class="stat">Tổng số bé<b>${data.profiles}</b></div>
    <div class="stat">Ván chơi 7 ngày<b>${data.sessionsWeek}</b></div>
    <div class="stat">Ván chơi hôm nay<b>${data.sessionsToday}</b></div>
    <div class="stat">Đang online (~5 phút)<b>${data.onlineNow}</b></div>
    <div class="stat">Ping DB<b>${data.pingMs} ms</b></div>
  `;
  $('dbRow').innerHTML = data.db ? `
    <div class="stat">Dung lượng DB<b>${formatBytes(data.db.db_size_bytes)}</b></div>
    <div class="stat">sessions<b>${data.db.sessions}</b></div>
    <div class="stat">reward_ledger<b>${data.db.reward_ledger}</b></div>
    <div class="stat">purchases<b>${data.db.purchases}</b></div>
    <div class="stat">bài dịch<b>${data.db.translation_submissions}</b></div>
    <div class="stat">trắc nghiệm<b>${data.db.grammar_quiz_submissions}</b></div>
    <div class="stat">lượt gọi AI<b>${data.db.ai_call_log}</b></div>
  ` : '<i style="color:var(--ink-dim)">Chưa chạy migrate-12 nên chưa có thống kê DB (xem server/migrate-12-admin-stats.sql).</i>';

  $('aiRow').innerHTML = `
    <div class="stat">Thành công (7 ngày)<b style="color:var(--good)">${data.ai.ok}</b></div>
    <div class="stat">Lỗi (7 ngày)<b style="color:var(--bad)">${data.ai.fail}</b></div>
  `;
  renderAiChart(data.ai.byDay);
}

function renderAiChart(byDay) {
  const bars = $('aiBars');
  const labels = $('aiBarLabels');
  bars.innerHTML = '';
  labels.innerHTML = '';
  if (!byDay.length) {
    bars.innerHTML = '<i style="color:var(--ink-dim);font-size:13px">Chưa có lượt gọi AI nào trong 7 ngày qua.</i>';
    return;
  }
  const maxTotal = Math.max(1, ...byDay.map((d) => d.groq + d.deepseek + d.fail));
  for (const d of byDay) {
    const total = d.groq + d.deepseek + d.fail;
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = `${Math.max(2, Math.round((total / maxTotal) * 100))}%`;
    bar.innerHTML = `<span>${total}</span>`;
    bars.appendChild(bar);
    const lb = document.createElement('div');
    lb.textContent = d.day.slice(5).replace('-', '/');
    labels.appendChild(lb);
  }
}

/* ===== Sao lưu & Khôi phục toàn bộ dữ liệu (xem api/admin-backup.js) ===== */

$('btnDownloadBackup').addEventListener('click', async () => {
  const ok = $('backupOk');
  ok.textContent = 'Đang tải bản sao lưu…';
  try {
    const token = api.accessToken();
    const res = await fetch('/api/admin-backup', { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Lỗi ${res.status}`);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = data.exportedAt.slice(0, 19).replace(/[:T]/g, '-');
    a.href = url;
    a.download = `reply1999-backup-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    const totalRows = Object.values(data.tables).reduce((s, rows) => s + rows.length, 0);
    ok.textContent = `Đã tải xong — ${totalRows} dòng dữ liệu (${Object.keys(data.tables).length} bảng), lúc ${new Date(data.exportedAt).toLocaleString('vi-VN')}.`;
  } catch (e) {
    ok.textContent = `Lỗi: ${e.message}`;
  }
});

const CONFIRM_PHRASE = 'KHÔI PHỤC';
function updateRestoreButtonState() {
  const hasFile = $('restoreFile').files.length > 0;
  const typedOk = $('restoreConfirmText').value.trim().toUpperCase() === CONFIRM_PHRASE;
  $('btnRestore').disabled = !(hasFile && typedOk);
}
$('restoreFile').addEventListener('change', updateRestoreButtonState);
$('restoreConfirmText').addEventListener('input', updateRestoreButtonState);

$('btnRestore').addEventListener('click', async () => {
  const msg = $('restoreMsg');
  msg.textContent = '';
  const file = $('restoreFile').files[0];
  if (!file) return;

  let parsed;
  try {
    parsed = JSON.parse(await file.text());
  } catch {
    msg.textContent = 'File này không phải JSON hợp lệ.';
    return;
  }

  const totalRows = parsed?.tables ? Object.values(parsed.tables).reduce((s, rows) => s + (rows?.length || 0), 0) : 0;
  const confirmed = window.confirm(
    `XÁC NHẬN LẦN CUỐI:\n\nThao tác này sẽ XOÁ SẠCH toàn bộ dữ liệu hiện tại trên server\n`
    + `và thay bằng ${totalRows} dòng dữ liệu từ file backup lúc ${parsed.exportedAt || '(không rõ)'}.\n\n`
    + `KHÔNG THỂ HOÀN TÁC. Bấm OK để tiếp tục, Cancel để huỷ.`,
  );
  if (!confirmed) { msg.textContent = 'Đã huỷ — không có gì thay đổi.'; return; }

  $('btnRestore').disabled = true;
  msg.style.color = 'var(--ink-dim)';
  msg.textContent = 'Đang khôi phục — ĐỪNG đóng trang này…';
  try {
    const token = api.accessToken();
    const res = await fetch('/api/admin-backup', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Lỗi ${res.status}`);
    msg.style.color = 'var(--good)';
    msg.textContent = `✅ Khôi phục xong lúc ${new Date(data.restoredAt).toLocaleString('vi-VN')} — đã nạp lại ${Object.values(data.counts).reduce((s, n) => s + n, 0)} dòng.`;
    $('restoreConfirmText').value = '';
    $('restoreFile').value = '';
  } catch (e) {
    msg.style.color = 'var(--bad)';
    msg.textContent = `⚠️ ${e.message}`;
  } finally {
    updateRestoreButtonState();
  }
});

boot();
