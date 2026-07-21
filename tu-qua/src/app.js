// Tủ Quà & Vườn Hoa — nơi bé TIÊU sao: đổi kẹo/hoa/thú cưng/danh hiệu từ
// CATALOG, xem bộ sưu tập đã có (hoa trồng trong vườn, thú cưng, số kẹo).
// Toàn bộ số dư/quà nằm trên server theo hồ sơ bé đang chọn ở /chon-be/.

import * as api from '../../shared/api.js';
import { CATALOG, catalogItem, effectiveCost, DEFAULT_REWARD_COST_MULTIPLIER } from '../../shared/rewards.js';

const $ = (id) => document.getElementById(id);

function speakVi(text) {
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'vi-VN';
    u.rate = 0.95;
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

async function refresh() {
  try {
    const kidId = api.getCurrentKidId();
    const cached = api.cachedSettings();
    if (cached?.reward_cost_multiplier) rewardMultiplier = cached.reward_cost_multiplier;
    if (cached?.custom_item_costs) customCosts = cached.custom_item_costs;
    const [stars, purchases, settings] = await Promise.all([
      api.starBalance(kidId), api.kidPurchases(kidId), api.getSettings(),
    ]);
    balance = stars;
    rewardMultiplier = settings.reward_cost_multiplier ?? DEFAULT_REWARD_COST_MULTIPLIER;
    customCosts = settings.custom_item_costs || {};
    $('starBox').textContent = `⭐ ${stars}`;
    renderCollection(purchases);
    renderShop();
  } catch (e) {
    guide(`Không tải được tủ quà (${e.message}) — kiểm tra mạng rồi tải lại nhé.`);
  }
}

function renderCollection(purchases) {
  // Khởi tạo đủ 1 khóa cho MỌI type đang có trong CATALOG (không cứng 4
  // loại nữa) — quà loại mới (voucher/drink) thêm sau này sẽ không làm
  // `byType[item.type].push` bị lỗi vì thiếu khóa.
  const byType = {};
  for (const item of CATALOG) if (!byType[item.type]) byType[item.type] = [];
  for (const p of purchases) {
    const item = catalogItem(p.item_id);
    if (item) byType[item.type].push(item);
  }
  $('garden').innerHTML = byType.flower.length
    ? byType.flower.map((f) => f.icon).join('')
    : '<span style="font-size:14px;letter-spacing:0;color:#5d5370">Vườn còn trống — đổi 🌸 để trồng hoa nhé!</span>';
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

function renderShop() {
  const shop = $('shop');
  shop.innerHTML = '';
  for (const item of CATALOG) {
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

boot();
