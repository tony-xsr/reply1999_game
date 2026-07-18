// Tiện ích "bé đang chơi" gắn vào TRONG game (module dùng chung):
// 1. mountKidFeatures(): thanh avatar bé (góc dưới-trái, chạm để đổi bé ở
//    /chon-be/) + kiểm tra GIỚI HẠN PHÚT/NGÀY của phụ huynh (vượt thì phủ màn
//    "bé nghỉ mắt nhé" — đọc bằng giọng nói).
// 2. answeredOne(): các game gọi sau MỖI CÂU bé trả lời xong — cứ đủ 15 câu
//    trong ngày (cộng dồn mọi game) bé nhận 1 hộp quà kẹo nhỏ (toast + ghi vào
//    tủ quà trên server, miễn phí không tốn sao).
// Mọi thứ tự tắt êm khi chưa cấu hình server / chưa chọn bé — game chạy như cũ.

import * as api from './api.js';
import { newGiftCount, randomSmallGift } from './rewards.js';
import { missCount } from '../nghe-doan-on-tap/src/misses.js';

function todayKey() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function speakVi(text) {
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'vi-VN';
    u.rate = 0.95;
    speechSynthesis.speak(u);
  } catch { /* ignore */ }
}

/* ===== Thanh avatar bé ===== */

function mountBar(kid) {
  if (document.getElementById('kidBar')) return;
  const chipCss = [
    'background:#fffaf2', 'border:2px solid #a8834a', 'border-radius:999px',
    'padding:5px 12px', 'font:800 13px -apple-system,Segoe UI,Roboto,Arial,sans-serif',
    'color:#241e2e', 'text-decoration:none', 'box-shadow:0 2px 8px rgba(90,60,20,.25)',
    'opacity:.92',
  ].join(';');

  const bar = document.createElement('a');
  bar.id = 'kidBar';
  bar.href = '/chon-be/';
  bar.title = `Đang chơi: ${kid.name} — chạm để đổi bé`;
  bar.textContent = `${kid.avatar} ${kid.name}`;
  bar.style.cssText = `position:fixed;left:10px;bottom:10px;z-index:70;${chipCss}`;
  document.body.appendChild(bar);

  // Hiện SỐ SAO hiện có của bé trên thanh (cache 5 phút cho đỡ tốn request).
  showStars(kid, bar);

  // Huy hiệu 🎯 "từ cần ôn" (đọc sổ cục bộ, không tốn mạng) — chạm là vào Ôn Tập.
  const weak = missCount();
  if (weak > 0) {
    const badge = document.createElement('a');
    badge.id = 'kidWeakBadge';
    badge.href = '/nghe-doan-on-tap/';
    badge.title = `Bé còn ${weak} từ cần ôn — chạm để vào Ôn Tập!`;
    badge.textContent = `🎯 ${weak} từ cần ôn`;
    badge.style.cssText = `position:fixed;left:10px;bottom:48px;z-index:70;${chipCss};color:#c2410c`;
    document.body.appendChild(badge);
  }
}

async function showStars(kid, bar) {
  try {
    const key = `r99-stars-cache:${kid.id}`;
    let stars = null;
    try {
      const cached = JSON.parse(localStorage.getItem(key));
      if (cached && Date.now() - cached.ts < 5 * 60000) stars = cached.stars;
    } catch { /* ignore */ }
    if (stars === null && (await api.ready())) {
      stars = await api.starBalance(kid.id);
      try { localStorage.setItem(key, JSON.stringify({ stars, ts: Date.now() })); } catch { /* ignore */ }
    }
    if (stars !== null) bar.textContent = `${kid.avatar} ${kid.name} · ⭐${stars}`;
  } catch { /* mất mạng: chỉ hiện tên */ }
}

/* ===== Toast quà ===== */

function showGiftToast(gift) {
  const t = document.createElement('div');
  t.style.cssText = [
    'position:fixed', 'left:50%', 'top:18%', 'transform:translateX(-50%) scale(.6)',
    'z-index:80', 'background:#fffaf2', 'border:3px solid #ff8a3d', 'border-radius:18px',
    'padding:14px 22px', 'text-align:center', 'box-shadow:0 8px 24px rgba(90,60,20,.35)',
    'font:800 15px -apple-system,Segoe UI,Roboto,Arial,sans-serif', 'color:#241e2e',
    'transition:transform .25s ease-out',
  ].join(';');
  t.innerHTML = `<div style="font-size:44px;line-height:1.2">🎁</div>Bé học chăm quá!<br>Được thưởng ${gift.icon} ${gift.name}!`;
  document.body.appendChild(t);
  requestAnimationFrame(() => { t.style.transform = 'translateX(-50%) scale(1)'; });
  speakVi(`Bé học chăm quá! Được thưởng ${gift.name}!`);
  setTimeout(() => t.remove(), 3800);
}

/* ===== Đếm câu trong ngày → quà mỗi 15 câu ===== */

/** Gọi sau mỗi câu bé trả lời xong. Tự hiện toast + ghi tủ quà khi đủ mốc. */
export function answeredOne() {
  const kid = api.getCurrentKidId();
  if (!kid) return;
  const key = `r99-answered:${kid}:${todayKey()}`;
  let n = 0;
  try { n = Number(localStorage.getItem(key)) || 0; } catch { /* ignore */ }
  const gifts = newGiftCount(n, n + 1);
  try { localStorage.setItem(key, String(n + 1)); } catch { /* ignore */ }
  if (gifts > 0) {
    const gift = randomSmallGift();
    showGiftToast(gift);
    api.ready().then((ok) => (ok ? api.recordFreeGift(kid, gift.id) : null)).catch(() => {});
  }
}

/* ===== Giới hạn phút chơi/ngày ===== */

function showLimitOverlay(minutes) {
  if (document.getElementById('kidLimitOverlay')) return;
  const ov = document.createElement('div');
  ov.id = 'kidLimitOverlay';
  ov.style.cssText = [
    'position:fixed', 'inset:0', 'z-index:99', 'background:rgba(36,30,46,.93)',
    'display:flex', 'flex-direction:column', 'align-items:center', 'justify-content:center',
    'text-align:center', 'color:#fff6e8', 'padding:24px',
    'font:800 18px -apple-system,Segoe UI,Roboto,Arial,sans-serif',
  ].join(';');
  ov.innerHTML = `<div style="font-size:70px">🌙</div>
    <p>Hôm nay bé đã chơi đủ ${minutes} phút rồi!<br>Bé nghỉ mắt, mai mình học tiếp nhé!</p>
    <a href="/" style="color:#ffd9a0;font-size:14px">🏠 Về trang chủ</a>`;
  document.body.appendChild(ov);
  speakVi(`Hôm nay bé đã chơi đủ ${minutes} phút rồi. Bé nghỉ mắt, mai mình học tiếp nhé!`);
}

/** Throttle 1 việc theo phút (đỡ tốn request Supabase mỗi lần mở game). */
function throttled(key, minutes) {
  try {
    const last = Number(localStorage.getItem(key)) || 0;
    if (Date.now() - last < minutes * 60000) return true;
    localStorage.setItem(key, String(Date.now()));
  } catch { /* ignore */ }
  return false;
}

async function checkDailyLimit() {
  const kid = api.getCurrentKidId();
  if (!kid || !(await api.ready())) return;
  // Giới hạn RIÊNG của bé (profiles.settings) thắng giới hạn chung của gia đình.
  const kidOverride = api.currentKidInfo()?.settings?.daily_limit_min;
  // Tiết kiệm request: chỉ hỏi server tối đa 3 phút/lần; giữa các lần dùng kết quả cũ.
  if (throttled(`r99-limit-check:${kid}`, 3)) {
    try {
      const cached = JSON.parse(localStorage.getItem(`r99-limit-state:${kid}`));
      if (cached?.over) showLimitOverlay(cached.limitMin);
    } catch { /* ignore */ }
    return;
  }
  try {
    const settings = api.cachedSettings() || await api.getSettings();
    const limitMin = kidOverride ?? settings.daily_limit_min ?? 45;
    const playedSec = await api.todayPlaySeconds(kid);
    const over = limitMin > 0 && playedSec >= limitMin * 60;
    try { localStorage.setItem(`r99-limit-state:${kid}`, JSON.stringify({ over, limitMin })); } catch { /* ignore */ }
    if (over) showLimitOverlay(limitMin);
  } catch { /* mất mạng: không chặn */ }
}

/* ===== Quà bố mẹ gửi — hiện ngay trong game ===== */

function showParentGift(gift) {
  if (document.getElementById('parentGiftBox')) return;
  const ov = document.createElement('div');
  ov.id = 'parentGiftBox';
  ov.style.cssText = [
    'position:fixed', 'inset:0', 'z-index:95', 'background:rgba(36,30,46,.85)',
    'display:flex', 'align-items:center', 'justify-content:center', 'padding:20px',
  ].join(';');
  ov.innerHTML = `<div style="background:#fffaf2;border:3px solid #ff8a3d;border-radius:20px;padding:24px;
      max-width:330px;text-align:center;font:800 15px -apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#241e2e">
    <div id="pgIcon" style="font-size:62px;line-height:1.3">🎁</div>
    <p id="pgText" style="font-weight:800;line-height:1.6">Có quà từ bố mẹ gửi cho bé nè!</p>
    <button id="pgBtn" style="background:linear-gradient(180deg,#34b566,#1e7a45);color:#fff;border:none;
      border-radius:12px;padding:11px 26px;font-weight:900;font-size:15px;cursor:pointer">MỞ QUÀ ▶</button>
  </div>`;
  document.body.appendChild(ov);
  const btn = ov.querySelector('#pgBtn');
  btn.addEventListener('click', async () => {
    try { await api.openReward(gift); } catch { /* vẫn cho bé xem lời nhắn */ }
    const starsMsg = gift.stars > 0 ? ` Bé được tặng ${gift.stars} ngôi sao!` : '';
    ov.querySelector('#pgIcon').textContent = '⭐';
    ov.querySelector('#pgText').textContent = `${gift.message || 'Bé giỏi lắm!'}${starsMsg}`;
    speakVi(`${gift.message || 'Bé giỏi lắm!'}.${starsMsg}`);
    btn.textContent = 'TUYỆT VỜI ▶';
    btn.onclick = () => ov.remove();
  }, { once: true });
}

async function checkParentGifts() {
  const kid = api.getCurrentKidId();
  if (!kid || !(await api.ready())) return;
  if (throttled(`r99-gift-check:${kid}`, 2)) return; // tối đa 1 lần / 2 phút
  try {
    const gifts = await api.unopenedRewards(kid);
    if (gifts.length) showParentGift(gifts[0]);
  } catch { /* mất mạng: lần sau hiện */ }
}

/** Gọi 1 lần khi game khởi động: thanh avatar + giới hạn ngày + quà bố mẹ chờ mở. */
export function mountKidFeatures() {
  try {
    const kid = api.currentKidInfo();
    if (kid) mountBar(kid);
    checkDailyLimit();
    checkParentGifts();
  } catch { /* không bao giờ làm hỏng game */ }
}
