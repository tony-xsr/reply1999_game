// Tủ Quà & Vườn Hoa — nơi bé TIÊU sao: đổi kẹo/hoa/thú cưng/danh hiệu từ
// CATALOG, xem bộ sưu tập đã có (hoa trồng trong vườn, thú cưng, số kẹo).
// Toàn bộ số dư/quà nằm trên server theo hồ sơ bé đang chọn ở /chon-be/.

import * as api from '../../shared/api.js';
import { effectiveCost, DEFAULT_REWARD_COST_MULTIPLIER, mergeCatalog } from '../../shared/rewards.js';
import { GARDEN_DAILY_RATE, GARDEN_ANNUAL_RATE, todayProgress, sellBackValue } from '../../shared/garden.js';
import {
  STREAK_MILESTONES, starsForMilestone, uniqueLoginDays, computeCurrentStreak, nextClaimableMilestone,
} from '../../shared/streak.js';

const $ = (id) => document.getElementById(id);

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
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  } catch { /* ignore */ }
}

function guide(html) {
  $('viewGuide').classList.remove('hidden');
  $('viewMain').classList.add('hidden');
  $('viewGuide').innerHTML = html;
  $('starBox').textContent = '⭐ —';
}

async function boot() {
  if (!(await api.configured())) {
    guide('Chưa kết nối server — nhờ bố mẹ vào <a href="/phu-huynh/">Trang Phụ Huynh</a> cài đặt 1 lần nhé.');
    return;
  }
  if (!api.signedIn()) {
    guide('Máy này chưa liên kết — nhờ bố mẹ đăng nhập trong <a href="/phu-huynh/">Trang Phụ Huynh</a> nhé.');
    return;
  }
  const kid = api.currentKidInfo();
  if (!kid) {
    guide('Bé chưa chọn hồ sơ — vào <a href="/chon-be/">"Bé nào đang chơi?"</a> chạm avatar của con trước nhé.');
    return;
  }
  $('viewGuide').classList.add('hidden');
  $('viewMain').classList.remove('hidden');
  document.querySelector('h1').textContent = `🎁 Tủ Quà của ${kid.avatar} ${kid.name}`;
  await refresh();
}

let balance = 0;
let rewardMultiplier = DEFAULT_REWARD_COST_MULTIPLIER;
let customCosts = {};
let catalog = mergeCatalog();
let gardenLastYieldAtMs = Date.now();
let gardenTickTimer = null;

/** Tìm quà theo id trong catalog ĐÃ GỘP (gốc + quà phụ huynh tự thêm). */
function findItem(id) {
  return catalog.find((c) => c.id === id) || null;
}

async function refresh() {
  try {
    const kidId = api.getCurrentKidId();
    const cached = api.cachedSettings();
    if (cached?.reward_cost_multiplier) rewardMultiplier = cached.reward_cost_multiplier;
    if (cached?.custom_item_costs) customCosts = cached.custom_item_costs;
    if (cached?.custom_catalog_items) catalog = mergeCatalog(cached.custom_catalog_items);
    const [stars, purchases, settings] = await Promise.all([
      api.starBalance(kidId), api.kidPurchases(kidId), api.getSettings(),
    ]);
    balance = stars;
    rewardMultiplier = settings.reward_cost_multiplier ?? DEFAULT_REWARD_COST_MULTIPLIER;
    customCosts = settings.custom_item_costs || {};
    catalog = mergeCatalog(settings.custom_catalog_items);

    // Mỗi lần bé mở Tủ Quà, thu luôn số sao vườn hoa đã sinh ra từ lần trước
    // (trần 36.5%/năm — xem shared/garden.js). Về sau nếu muốn "sống" hơn có
    // thể thu theo hẹn giờ, nhưng thu khi mở trang là đủ dùng và đơn giản.
    const claim = await api.claimGardenYield(kidId);
    gardenLastYieldAtMs = claim.lastYieldAtMs;
    if (claim.stars > 0) {
      balance += claim.stars;
      speakVi(`Vườn hoa của bé vừa lớn thêm, tặng bé ${claim.stars} sao!`);
    }

    $('starBox').textContent = `⭐ ${balance}`;
    renderCollection(purchases);
    renderGarden(purchases);
    renderShop();
    renderStreak(kidId);
    if (gardenTickTimer) clearInterval(gardenTickTimer);
    gardenTickTimer = setInterval(updateGardenProgress, 30000);
  } catch (e) {
    guide(`Không tải được tủ quà (${e.message}) — kiểm tra mạng rồi tải lại nhé.`);
  }
}

function renderCollection(purchases) {
  // Khởi tạo đủ 1 khóa cho MỌI type đang có trong CATALOG (không cứng 4
  // loại nữa) — quà loại mới (voucher/drink) thêm sau này sẽ không làm
  // `byType[item.type].push` bị lỗi vì thiếu khóa.
  const byType = {};
  for (const item of catalog) if (!byType[item.type]) byType[item.type] = [];
  for (const p of purchases) {
    const item = findItem(p.item_id);
    if (item) byType[item.type].push(item);
  }
  $('petsRow').textContent = byType.pet.length
    ? `Thú cưng: ${byType.pet.map((p) => p.icon).join(' ')}`
    : 'Thú cưng: chưa có (để dành sao đổi 🐣 nhé!)';
  $('candyRow').textContent = `Kẹo đã nhận: ${byType.candy.length} 🍬`;
  $('badgeRow').textContent = byType.badge.length
    ? `Danh hiệu: ${byType.badge.map((b) => `${b.icon} ${b.name}`).join(', ')}`
    : '';
  $('drinkRow').textContent = byType.drink.length
    ? `Nước uống đã đổi: ${byType.drink.map((d) => d.icon).join(' ')}`
    : '';
  $('voucherRow').textContent = byType.voucher.length
    ? `Phiếu mua đồ chơi đã đổi: ${byType.voucher.map((v) => `${v.icon} ${v.name}`).join(', ')}`
    : '';
}

// ===== Vườn hoa sinh sao: hoa trồng càng lâu càng sinh thêm sao, tối đa
// 36,5%/năm (giống 1000 sao tiền hoa -> mỗi ngày +1 sao) — công thức thật
// nằm ở shared/garden.js, ở đây chỉ hiển thị + cho bé bán lại hoa.
let gardenValue = 0;

function renderGarden(purchases) {
  const flowers = purchases.filter((p) => !p.sold_at && findItem(p.item_id)?.type === 'flower');
  gardenValue = flowers.reduce((sum, p) => sum + (p.cost | 0), 0);

  const garden = $('garden');
  garden.innerHTML = '';
  if (!flowers.length) {
    garden.innerHTML = '<span class="empty">Vườn còn trống — đổi 🌸 ở "Đổi sao lấy quà" bên dưới để trồng hoa đầu tiên nhé!</span>';
  }
  for (const p of flowers) {
    const item = findItem(p.item_id);
    const refund = sellBackValue(p.cost);
    const div = document.createElement('div');
    div.className = 'flower';
    div.innerHTML = `<span class="ic">${item.icon}</span>`;
    const btn = document.createElement('button');
    btn.textContent = `Bán ⭐${refund}`;
    btn.title = `Bé mua hoa này hết ${p.cost} sao — bán lại được ${refund} sao (mất 1 sao)`;
    btn.addEventListener('click', () => sellFlower(p, btn));
    div.appendChild(btn);
    garden.appendChild(div);
  }

  const growBox = $('growBox');
  if (gardenValue <= 0) {
    growBox.classList.add('hidden');
    return;
  }
  growBox.classList.remove('hidden');
  const dailyStars = Math.round(gardenValue * GARDEN_DAILY_RATE);
  const yearStars = Math.round(gardenValue * GARDEN_ANNUAL_RATE);
  $('growText').textContent = `Vườn của bé đang trồng ${gardenValue} sao tiền hoa 🌸 — mỗi ngày tự nhiên `
    + `nở ra thêm khoảng ${dailyStars} sao cho bé (khoảng ${yearStars} sao mỗi năm). Cứ để hoa trong vườn `
    + `càng lâu, bé càng được thêm nhiều sao, giống như nuôi heo đất vậy đó!`;
  updateGardenProgress();
}

function updateGardenProgress() {
  if (gardenValue <= 0) return;
  const pct = Math.round(todayProgress(gardenLastYieldAtMs, Date.now()) * 100);
  $('growFill').style.width = `${pct}%`;
  const dailyStars = Math.round(gardenValue * GARDEN_DAILY_RATE);
  $('growHint').textContent = dailyStars > 0
    ? `Hôm nay vườn đã tích được ${pct}% trên đường tới +${dailyStars} sao tiếp theo 🌟`
    : 'Trồng thêm hoa để vườn bắt đầu sinh sao mỗi ngày nhé!';
}

async function sellFlower(purchase, btn) {
  const msg = $('shopMsg');
  btn.disabled = true;
  try {
    const refund = await api.sellFlower(api.getCurrentKidId(), purchase);
    msg.className = 'msg ok';
    msg.textContent = `Bé đã bán lại hoa, nhận thêm ${refund} sao!`;
    speakVi(`Bé đã bán lại hoa, nhận thêm ${refund} sao!`);
    await refresh();
  } catch (e) {
    msg.className = 'msg bad';
    msg.textContent = `Lỗi: ${e.message}`;
    btn.disabled = false;
  }
}

function renderShop() {
  const shop = $('shop');
  shop.innerHTML = '';
  for (const item of catalog) {
    const cost = effectiveCost(item, rewardMultiplier, customCosts);
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `<div class="icon">${item.icon}</div><div class="name">${item.name}</div>`;
    const btn = document.createElement('button');
    btn.textContent = `⭐ ${cost}`;
    btn.disabled = balance < cost;
    btn.addEventListener('click', () => buy(item, cost, btn));
    div.appendChild(btn);
    shop.appendChild(div);
  }
}

async function buy(item, cost, btn) {
  const msg = $('shopMsg');
  msg.className = 'msg';
  btn.disabled = true;
  try {
    await api.buyItem(api.getCurrentKidId(), { ...item, cost });
    msg.classList.add('ok');
    msg.textContent = `Bé đã đổi được ${item.icon} ${item.name}! Tuyệt vời!`;
    speakVi(`Bé đã đổi được ${item.name}! Tuyệt vời!`);
    await refresh();
  } catch (e) {
    msg.classList.add('bad');
    msg.textContent = e.message === 'NOT_ENOUGH_STARS'
      ? 'Chưa đủ sao — bé chơi thêm các game học để kiếm sao nhé!'
      : `Lỗi: ${e.message}`;
    btn.disabled = false;
  }
}

// ===== Chuỗi ngày điểm danh liên tục (xem shared/streak.js) — thanh dài các
// kho báu ở mốc 5/10/20/50 ngày, mở được ngay tại đây nếu bỏ lỡ lúc chọn hồ
// sơ ở /chon-be/ (chỗ hiện popup mừng ngay lúc đăng nhập).
async function renderStreak(kidId) {
  try {
    const [timestamps, freshKid] = await Promise.all([
      api.kidLoginTimestamps(kidId),
      api.refreshCurrentKidSettings(),
    ]);
    const days = uniqueLoginDays(timestamps);
    const todayKey = new Date().toISOString().slice(0, 10);
    const streak = computeCurrentStreak(days, todayKey);
    const claimedMax = freshKid?.settings?.streakClaimedMax || 0;
    const milestone = nextClaimableMilestone(streak, claimedMax);
    $('streakInfo').textContent = milestone
      ? `🎉 Bé đang điểm danh liên tục ${streak} ngày — có 1 kho báu sẵn sàng mở, bấm vào nhé!`
      : `Bé đang điểm danh liên tục ${streak} ngày! Vào chơi mỗi ngày để mở kho báu tiếp theo nhé.`;
    $('streakRow').innerHTML = STREAK_MILESTONES.map((m) => {
      const state = m <= claimedMax ? 'done' : (m === milestone ? 'ready' : '');
      const icon = m <= claimedMax ? '✅' : '📦';
      return `<div class="streak-chest ${state}" data-milestone="${m}"><span class="ic">${icon}</span><span>${m} ngày</span></div>`;
    }).join('');
    if (milestone) {
      $('streakRow').querySelector(`[data-milestone="${milestone}"]`)
        ?.addEventListener('click', () => claimStreakFromTuQua(kidId, milestone));
    }
  } catch {
    $('streakCard').classList.add('hidden'); // mất mạng: ẩn êm, không chặn phần còn lại của Tủ Quà
  }
}

async function claimStreakFromTuQua(kidId, milestone) {
  const stars = starsForMilestone(milestone);
  try {
    const granted = await api.claimStreakMilestone(kidId, milestone, stars);
    if (granted) {
      speakVi(`Chúc mừng! Bé nhận được ${stars} sao từ kho báu điểm danh!`);
      await refresh();
    }
  } catch { /* mất mạng: bé thử bấm lại sau */ }
}

boot();
