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
import * as aiProvider from './ai-provider.js';
import { EXAM_LEVEL_LABELS } from './report.js';

function todayKey() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function speakVi(text) {
  try {
    if (!window.speechSynthesis) return;
    // Vài máy (một số dòng Samsung) thiếu gói giọng tiếng Việt cài sẵn -> nếu
    // không gán `voice` rõ ràng, máy tự lấy giọng mặc định (thường là tiếng
    // Anh) đọc chữ tiếng Việt, nghe sai hoàn toàn. Im lặng còn hơn đọc sai giọng.
    const voice = speechSynthesis.getVoices().find((v) => v.lang?.startsWith('vi'));
    if (!voice) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'vi-VN';
    u.rate = 0.95;
    u.voice = voice;
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

/** Lấy số sao hiện có của bé — cache 5 phút cho đỡ tốn request, dùng chung
 * cho cả thanh avatar góc dưới VÀ huy hiệu sao trên header. */
async function fetchStars(kid) {
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
    return stars;
  } catch {
    return null; // mất mạng: không hiện số sao
  }
}

/** Gắn huy hiệu "⭐ N" vào header của game (mọi game dùng chung <header
 * class="top">) — để bé/phụ huynh luôn thấy số sao hiện tại ngay trên đầu
 * màn hình, không chỉ ở thanh avatar góc dưới. Chạm vào huy hiệu sẽ mở màn
 * "Hồ sơ của bé" (xem showProfileOverlay). Không tìm thấy header thì bỏ qua
 * êm, không phá game (vài game như pokemon dùng header khác). */
function mountHeaderStars() {
  const header = document.querySelector('header.top');
  if (!header || document.getElementById('kidHeaderStars')) return null;
  // Header của mỗi game vốn đã có sẵn 3-4 nút tròn cố định (44px) + tiêu đề —
  // trên màn hình hẹp, hàng flex "nowrap" mặc định khiến huy hiệu ⭐ (thêm
  // SAU CÙNG) bị đẩy tràn ra NGOÀI khung nhìn, không có thanh cuộn ngang nên
  // bé/phụ huynh không thấy được. Ép hàng header cho phép xuống dòng — huy
  // hiệu sẽ tự rơi xuống dòng 2 khi không đủ chỗ, thay vì mất hút ngoài màn.
  header.style.flexWrap = 'wrap';
  const badge = document.createElement('span');
  badge.id = 'kidHeaderStars';
  badge.title = 'Chạm để xem hồ sơ của bé';
  badge.style.cssText = [
    'display:inline-flex', 'align-items:center', 'flex-shrink:0', 'cursor:pointer',
    'background:#fffaf2', 'border:2px solid #a8834a', 'border-radius:999px',
    'padding:4px 10px', 'font:800 13px -apple-system,Segoe UI,Roboto,Arial,sans-serif',
    'color:#241e2e', 'box-shadow:0 2px 6px rgba(90,60,20,.2)',
  ].join(';');
  badge.textContent = '⭐ …';
  header.appendChild(badge);
  return badge;
}

/** Xoá cache số sao (5 phút) + cập nhật ngay huy hiệu ⭐ trên header/thanh
 * avatar — gọi ngay sau khi cộng/trừ sao NGOÀI luồng chơi game bình thường
 * (vd thưởng hoàn thành Luyện Dịch/Trắc Nghiệm) để bé thấy số sao mới liền,
 * không phải đợi cache hết hạn hay tải lại trang. */
export function refreshStarBadge() {
  try {
    const kid = api.currentKidInfo();
    if (!kid) return;
    try { localStorage.removeItem(`r99-stars-cache:${kid.id}`); } catch { /* ignore */ }
    fetchStars(kid).then((stars) => {
      if (stars === null) return;
      const bar = document.getElementById('kidBar');
      if (bar) bar.textContent = `${kid.avatar} ${kid.name} · ⭐${stars}`;
      const headerBadge = document.getElementById('kidHeaderStars');
      if (headerBadge) headerBadge.textContent = `⭐ ${stars}`;
    });
  } catch { /* không bao giờ làm hỏng game */ }
}

/* ===== Hồ sơ của bé (avatar + tên + sao + từ cần ôn) ===== */

/** Màn thông tin hồ sơ bé — mở khi chạm huy hiệu sao trên header. Chỉ đọc
 * dữ liệu đã có sẵn (không gọi thêm mạng), nên luôn mở được kể cả khi mất
 * mạng (số sao sẽ hiện "đang cập nhật" thay vì con số). */
function showProfileOverlay(kid, stars) {
  if (document.getElementById('kidProfileOverlay')) return;
  const weak = missCount();
  const starsText = stars === null ? 'đang cập nhật…' : `${stars}`;
  const ov = document.createElement('div');
  ov.id = 'kidProfileOverlay';
  ov.style.cssText = [
    'position:fixed', 'inset:0', 'z-index:96', 'background:rgba(36,30,46,.85)',
    'display:flex', 'align-items:center', 'justify-content:center', 'padding:20px',
  ].join(';');
  ov.innerHTML = `<div style="background:#fffaf2;border:3px solid #a8834a;border-radius:20px;padding:26px 22px;
      max-width:320px;text-align:center;font:800 15px -apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#241e2e">
    <div style="font-size:64px;line-height:1.2">${kid.avatar}</div>
    <p style="font-size:19px;margin:6px 0 16px">${kid.name}</p>
    <div style="display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-bottom:18px">
      <span style="background:#fff;border:2px solid #a8834a;border-radius:999px;padding:6px 12px">⭐ ${starsText}</span>
      ${weak > 0 ? `<span style="background:#fff;border:2px solid #c2410c;border-radius:999px;padding:6px 12px;color:#c2410c">🎯 ${weak} từ cần ôn</span>` : ''}
    </div>
    <a href="/chon-be/" style="display:block;color:#5d5370;font-size:13px;margin-bottom:16px;text-decoration:underline">Đổi bé khác</a>
    <button id="kidProfileClose" style="background:linear-gradient(180deg,#34b566,#1e7a45);color:#fff;border:none;
      border-radius:12px;padding:10px 26px;font-weight:900;font-size:14px;cursor:pointer">ĐÓNG</button>
  </div>`;
  document.body.appendChild(ov);
  ov.querySelector('#kidProfileClose').addEventListener('click', () => ov.remove());
  ov.addEventListener('click', (e) => { if (e.target === ov) ov.remove(); });
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

/* ===== Bài Luyện Dịch / Trắc Nghiệm Ngữ Pháp hôm nay + NGÀY MAI — DỰ PHÒNG
   khi Vercel Cron (api/generate-daily-content.js) lỡ chưa chạy tới/bị lỗi
   ngày đó. Chạy ÊM trong nền mỗi khi bé vào BẤT KỲ trang nào của site (không
   chỉ trang luyện thi) — nếu cron đã sinh sẵn thì thấy có bài luôn nên không
   làm gì cả, không tốn thêm lệnh gọi AI nào. Sinh thêm CẢ ngày mai (không chỉ
   hôm nay) để lần sau vào site đã có sẵn — việc "dồn 60 ngày" thật sự do cron
   lo (xem api/generate-daily-content.js), ở đây chỉ dự phòng 2 ngày gần nhất
   vì sinh nhiều hơn ngay trong lúc bé đang tải trang sẽ quá chậm. Không hiện
   thông báo gì (khác lúc bé tự bấm mở "📝 Luyện Dịch"/"🧩 Trắc Nghiệm" — lúc
   đó có hiện "AI đang soạn..."). */
async function ensureDailyAiContentForDay(kidId, settings, trLevel, gqLevel, gqType, day) {
  if (trLevel) {
    // Thử TÁI SỬ DỤNG nội dung có sẵn của cả nhà trước khi gọi AI (tiết kiệm
    // chi phí, anh/chị/em không trùng bài — xem shared/content-reuse.js).
    let passages = await api.ensureTranslationPassages(kidId, trLevel, day);
    if (!passages.length) {
      const levelLabel = EXAM_LEVEL_LABELS[trLevel] || trLevel;
      const generated = await aiProvider.generatePassages(settings, { levelLabel, count: 3 });
      passages = await api.savePassages(kidId, generated.map((p) => ({ level: trLevel, ...p })), day);
    }
  }
  if (gqLevel) {
    let quiz = await api.ensureGrammarQuiz(kidId, gqLevel, gqType, day);
    if (!quiz) {
      const levelLabel = EXAM_LEVEL_LABELS[gqLevel] || gqLevel;
      const questions = await aiProvider.generateGrammarQuiz(settings, { levelLabel, count: 5, quizType: gqType });
      quiz = await api.saveGrammarQuiz(kidId, { level: gqLevel, questions, quizType: gqType }, day);
    }
  }
}

async function checkDailyAiContent() {
  const kid = api.currentKidInfo();
  const trLevel = kid?.settings?.translationLevel;
  const gqLevel = kid?.settings?.grammarQuizLevel;
  const gqType = kid?.settings?.grammarQuizType || 'grammar';
  if (!kid || (!trLevel && !gqLevel)) return; // bé không dùng 2 tính năng này -> khỏi tốn mạng kiểm tra
  const kidId = api.getCurrentKidId();
  // Tiết kiệm request: mỗi bé chỉ kiểm tra tối đa 1 lần/30 phút dù mở bao nhiêu trang.
  if (throttled(`r99-ai-daily-check:${kidId}`, 30)) return;
  if (!(await api.ready())) return;
  try {
    const settings = api.cachedSettings() || await api.getSettings();
    if (!aiProvider.resolveProvider(settings).apiKey) return; // chưa cấu hình key AI -> chịu, để bé tự thấy thông báo khi mở mục đó
    // Hôm nay TRƯỚC (bé cần ngay), rồi tới ngày mai (chuẩn bị trước 1 hôm) —
    // làm tuần tự để không gọi AI dồn dập cùng lúc.
    await ensureDailyAiContentForDay(kidId, settings, trLevel, gqLevel, gqType, api.dateKeyOffset(0));
    await ensureDailyAiContentForDay(kidId, settings, trLevel, gqLevel, gqType, api.dateKeyOffset(1));
  } catch { /* mất mạng/AI lỗi: im lặng — bé tự mở mục đó sẽ tự thử sinh lại */ }
}

/** Gọi 1 lần khi game khởi động: thanh avatar + huy hiệu sao trên header +
 * giới hạn ngày + quà bố mẹ chờ mở. */
export function mountKidFeatures() {
  try {
    const kid = api.currentKidInfo();
    if (kid) {
      mountBar(kid);
      const headerBadge = mountHeaderStars();
      let knownStars = null;
      if (headerBadge) headerBadge.addEventListener('click', () => showProfileOverlay(kid, knownStars));
      fetchStars(kid).then((stars) => {
        if (stars === null) {
          // Mất mạng: không biết số sao, nhưng vẫn giữ huy hiệu để bé chạm
          // vào xem hồ sơ (avatar/tên/từ cần ôn) — chỉ đổi nhãn, không xoá.
          if (headerBadge) headerBadge.textContent = '⭐ Hồ sơ';
          return;
        }
        knownStars = stars;
        const bar = document.getElementById('kidBar');
        if (bar) bar.textContent = `${kid.avatar} ${kid.name} · ⭐${stars}`;
        if (headerBadge) headerBadge.textContent = `⭐ ${stars}`;
      });
    }
    checkDailyLimit();
    checkParentGifts();
    checkDailyAiContent();
  } catch { /* không bao giờ làm hỏng game */ }
}

/** Gắn 1 ô hồ sơ bé vào trang chủ (index.html) — nơi không phải "game" nên
 * không dùng mountKidFeatures() (vốn cần <header class="top">, gắn thanh
 * avatar nổi, kiểm tra giới hạn giờ...). Nếu đã chọn bé: hiện avatar+tên,
 * chạm vào mở màn hồ sơ (số sao/từ cần ôn) — số sao tự cập nhật khi tải
 * xong. Nếu CHƯA chọn bé: hiện nút "Chọn bé" dẫn tới /chon-be/. Gọi 1 lần
 * lúc trang chủ tải xong, truyền vào 1 phần tử container rỗng để gắn vào. */
export function mountHomeProfileChip(container) {
  if (!container) return;
  try {
    const chipCss = [
      'display:inline-flex', 'align-items:center', 'gap:6px',
      'background:#fffaf2', 'border:2px solid #a8834a', 'border-radius:999px',
      'padding:6px 14px', 'font:800 13px -apple-system,Segoe UI,Roboto,Arial,sans-serif',
      'color:#241e2e', 'text-decoration:none', 'cursor:pointer', 'box-shadow:0 2px 6px rgba(90,60,20,.2)',
    ].join(';');
    const kid = api.currentKidInfo();
    if (!kid) {
      const link = document.createElement('a');
      link.href = '/chon-be/';
      link.textContent = '👤 Chọn bé';
      link.style.cssText = chipCss;
      container.appendChild(link);
      return;
    }
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.style.cssText = chipCss;
    chip.textContent = `${kid.avatar} ${kid.name} · ⭐ …`;
    let knownStars = null;
    chip.addEventListener('click', () => showProfileOverlay(kid, knownStars));
    container.appendChild(chip);
    fetchStars(kid).then((stars) => {
      if (stars === null) { chip.textContent = `${kid.avatar} ${kid.name} · ⭐ Hồ sơ`; return; }
      knownStars = stars;
      chip.textContent = `${kid.avatar} ${kid.name} · ⭐${stars}`;
    });
    checkDailyAiContent(); // trang chủ cũng là "vào site" -> kiểm tra dự phòng luôn, không chỉ trong game
  } catch { /* không bao giờ làm hỏng trang chủ */ }
}
