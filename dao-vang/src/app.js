// Điều phối Đào Vàng: cần câu đu qua lại, bấm để thả mỏ, vẽ canvas, cửa hàng giữa màn.

import {
  TYPES, SHOP_ITEMS, FIELD_W, FIELD_H, GROUND_Y, ORIGIN,
  makeWallet, makeLevel, stepGame, fireHook, useDynamite, buyUpgrade,
} from './daovang.js';
import { speak, bindMute } from '../../to-mau/src/speech.js';
import { sfx } from '../../pokemon/src/sfx.js';
import { currentProfile, recordSession } from '../../pokemon/src/stats.js';

const t = (key, fallback) => {
  const v = window.I18N?.t(key);
  return v && v !== key ? v : fallback;
};

const $ = (id) => document.getElementById(id);
const els = {
  home: $('homeScreen'), play: $('playScreen'), shop: $('shopScreen'),
  btnNew: $('btnNew'), btnHelp: $('btnHelp'), btnSound: $('btnSound'),
  canvas: $('gameCanvas'),
  hudMoney: $('hudMoney'), hudGoal: $('hudGoal'), hudTime: $('hudTime'), hudLevel: $('hudLevel'),
  btnDynamite: $('btnDynamite'), hudDyn: $('hudDyn'),
  shopBank: $('shopBank'), shopList: $('shopList'), btnShopNext: $('btnShopNext'),
  cheer: $('cheer'), cheerEmoji: $('cheerEmoji'), cheerText: $('cheerText'),
  btnCheerGo: $('btnCheerGo'), btnHome2: $('btnHome2'),
};
const ctx2d = els.canvas.getContext('2d');

bindMute(() => sfx.muted);

const MODES = {
  classic: { drift: false, hard: false },
  mice: { drift: true, hard: false },
  hard: { drift: false, hard: true },
};
const HARD_PROB = {
  gold_s: 0.14, gold_m: 0.12, gold_l: 0.06, diamond: 0.04, dynamite: 0.06,
  rock: 0.32, skull: 0.12, pig: 0.08, rabbit: 0.06,
};

const state = {
  mode: 'classic', wallet: makeWallet(), level: 0, game: null,
  raf: 0, last: 0, startedAt: Date.now(), instruction: '', icons: {},
};

/* ===== Icon preload (Twemoji SVG — xem images/CREDITS.md) ===== */
const ICON_FILE = {
  gold_s: 'coin', gold_m: 'moneybag', gold_l: 'moneybag',
  diamond: 'gem', rock: 'rock', skull: 'skull',
  pig: 'pig', rabbit: 'rabbit', dynamite: 'dynamite',
};
const SHOP_ICON_FILE = { dynamite: 'dynamite', strength: 'bolt', clover: 'clover', book: 'book', polish: 'sparkles' };

function loadIcons() {
  const names = new Set([...Object.values(ICON_FILE), ...Object.values(SHOP_ICON_FILE)]);
  for (const name of names) {
    const img = new Image();
    img.src = `images/${name}.svg`;
    state.icons[name] = img;
  }
}
loadIcons();

/** Đọc hướng dẫn + lưu lại để bấm ❓ nghe lại được (bé chưa đọc chữ vẫn chơi được). */
function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

/* ===== Vẽ ===== */

function drawBackground() {
  // trời
  const sky = ctx2d.createLinearGradient(0, 0, 0, GROUND_Y);
  sky.addColorStop(0, '#8ec9ef');
  sky.addColorStop(1, '#cfe9fa');
  ctx2d.fillStyle = sky;
  ctx2d.fillRect(0, 0, FIELD_W, GROUND_Y);
  // đất — nhiều lớp nâu như trong mỏ
  const dirt = ctx2d.createLinearGradient(0, GROUND_Y, 0, FIELD_H);
  dirt.addColorStop(0, '#c9945a');
  dirt.addColorStop(0.4, '#a9713c');
  dirt.addColorStop(1, '#7a4c26');
  ctx2d.fillStyle = dirt;
  ctx2d.fillRect(0, GROUND_Y, FIELD_W, FIELD_H - GROUND_Y);
  // viền cỏ mặt đất
  ctx2d.fillStyle = '#5a9e4a';
  ctx2d.fillRect(0, GROUND_Y - 6, FIELD_W, 8);
}

function drawRig(game) {
  const h = game.hook;
  // Lúc đang đu (len=0) vẫn cần thấy rõ mỏ đang chĩa hướng nào để bé canh bấm —
  // dùng độ dài tối thiểu để VẼ, không đụng tới h.len thật (va chạm vẫn tính đúng).
  const visLen = Math.max(h.len, 46);
  const tip = { x: ORIGIN.x + Math.cos(h.angle) * visLen, y: ORIGIN.y + Math.sin(h.angle) * visLen };
  // giá đỡ
  ctx2d.strokeStyle = '#5a4326';
  ctx2d.lineWidth = 10;
  ctx2d.lineCap = 'round';
  ctx2d.beginPath();
  ctx2d.moveTo(ORIGIN.x - 34, 20);
  ctx2d.lineTo(ORIGIN.x, ORIGIN.y);
  ctx2d.lineTo(ORIGIN.x + 34, 20);
  ctx2d.stroke();
  // dây
  ctx2d.strokeStyle = '#3a2c18';
  ctx2d.lineWidth = 3;
  ctx2d.beginPath();
  ctx2d.moveTo(ORIGIN.x, ORIGIN.y);
  ctx2d.lineTo(tip.x, tip.y);
  ctx2d.stroke();
  // người thợ mỏ (mặt cười đơn giản, không dùng ảnh bản quyền)
  ctx2d.font = '30px sans-serif';
  ctx2d.textAlign = 'center';
  ctx2d.textBaseline = 'middle';
  ctx2d.fillText('👷', ORIGIN.x, ORIGIN.y - 22);
  // mỏ (móc câu)
  ctx2d.fillStyle = '#3a3a3a';
  ctx2d.beginPath();
  ctx2d.arc(tip.x, tip.y, 8, 0, Math.PI * 2);
  ctx2d.fill();
  ctx2d.strokeStyle = '#1d1d1d';
  ctx2d.lineWidth = 2;
  ctx2d.beginPath();
  ctx2d.arc(tip.x, tip.y + 6, 6, 0.2, Math.PI - 0.2);
  ctx2d.stroke();
}

function drawItems(game) {
  for (const it of game.items) {
    if (!it.alive) continue;
    const img = state.icons[ICON_FILE[it.type]];
    const size = it.r * 2.1;
    if (it.vx) {
      ctx2d.font = `${it.r * 1.3}px sans-serif`;
      ctx2d.textAlign = 'center';
      ctx2d.textBaseline = 'middle';
      ctx2d.fillText('🐭', it.x - Math.sign(it.vx) * it.r * 0.9, it.y + it.r * 0.5);
    }
    if (img && img.complete && img.naturalWidth > 0) {
      ctx2d.drawImage(img, it.x - size / 2, it.y - size / 2, size, size);
    } else {
      ctx2d.fillStyle = '#d9a520';
      ctx2d.beginPath();
      ctx2d.arc(it.x, it.y, it.r, 0, Math.PI * 2);
      ctx2d.fill();
    }
  }
}

function draw() {
  ctx2d.clearRect(0, 0, FIELD_W, FIELD_H);
  drawBackground();
  drawItems(state.game);
  drawRig(state.game);
}

/* ===== HUD ===== */

function updateHud() {
  const g = state.game;
  els.hudMoney.textContent = g.money;
  els.hudGoal.textContent = g.goal;
  els.hudTime.textContent = Math.ceil(g.timeLeft);
  els.hudLevel.textContent = `${t('daovang.level', 'Màn')} ${g.level + 1}`;
  els.btnDynamite.hidden = g.dynamiteCount <= 0;
  els.hudDyn.textContent = g.dynamiteCount;
}

/* ===== Vòng lặp ===== */

function loop(now) {
  const dt = Math.min(50, now - state.last);
  state.last = now;
  stepGame(state.game, dt);
  updateHud();
  draw();
  if (state.game.over) return endLevel();
  state.raf = requestAnimationFrame(loop);
}

function startLevel() {
  const opts = MODES[state.mode];
  const genOpts = { drift: opts.drift, probOverride: opts.hard ? HARD_PROB : undefined };
  state.game = makeLevel(state.level, Math.random, state.wallet, genOpts);
  updateHud();
  draw();
  state.last = performance.now();
  state.raf = requestAnimationFrame(loop);
}

function endLevel() {
  cancelAnimationFrame(state.raf);
  const g = state.game;
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'daovang',
    result: g.won ? 'win' : 'quit',
    score: g.money,
    level: g.level + 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  if (g.won) {
    state.wallet.bank += g.money;
    sfx.levelWin();
    confetti();
    els.cheerEmoji.textContent = '🏆';
    els.cheerText.textContent = `${t('daovang.win', 'Đủ tiền qua màn!')}\n💰 ${g.money}/${g.goal}`;
    els.btnCheerGo.textContent = t('daovang.shop.go', 'ĐI MUA ĐỒ ▶');
    els.btnCheerGo.onclick = () => { sfx.select(); showShop(); };
    speak(t('daovang.win', 'Đủ tiền qua màn!'));
  } else {
    sfx.gameOver();
    els.cheerEmoji.textContent = '⛏️';
    els.cheerText.textContent = `${t('daovang.lose', 'Chưa đủ tiền rồi!')}\n💰 ${g.money}/${g.goal}`;
    els.btnCheerGo.textContent = t('ran.retry', 'CHƠI LẠI ▶');
    els.btnCheerGo.onclick = () => { sfx.select(); state.level = 0; state.wallet = makeWallet(); showPlay(); };
    speak(t('daovang.lose', 'Chưa đủ tiền rồi, chơi lại nhé!'));
  }
  els.cheer.classList.remove('hidden');
}

function confetti() {
  const colors = ['#ff5aa8', '#f5c542', '#35d435', '#42c5f5', '#b06af5'];
  for (let i = 0; i < 36; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.setProperty('--x', `${Math.random() * 100}vw`);
    p.style.setProperty('--delay', `${Math.random() * 0.5}s`);
    p.style.setProperty('--rot', `${Math.random() * 720 - 360}deg`);
    p.style.background = colors[i % colors.length];
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 2400);
  }
}

/* ===== Cửa hàng ===== */

function renderShop() {
  els.shopBank.textContent = state.wallet.bank;
  els.shopList.innerHTML = '';
  for (const key of Object.keys(SHOP_ITEMS)) {
    const def = SHOP_ITEMS[key];
    const btn = document.createElement('button');
    const owned = key === 'dynamite' ? state.wallet.dynamiteCharges : (state.wallet[key] || 0);
    const canAfford = state.wallet.bank >= def.cost;
    btn.className = `shop-item${canAfford ? '' : ' disabled'}`;
    const iconName = SHOP_ICON_FILE[key];
    btn.innerHTML = `
      <img class="si-icon" src="images/${iconName}.svg" alt="">
      <span class="si-label">${t(`daovang.shop.${key}`, def.label)}</span>
      <span class="si-cost">💰 ${def.cost}</span>
      ${owned > 0 ? `<span class="si-owned">${t('daovang.shop.owned', 'Đã có')}: ${owned}</span>` : ''}
    `;
    btn.addEventListener('click', () => {
      if (!buyUpgrade(state.wallet, key)) { sfx.fail(); return; }
      sfx.match(2);
      speak(`${t(`daovang.shop.${key}`, def.label)}!`);
      renderShop();
    });
    els.shopList.appendChild(btn);
  }
}

function showShop() {
  els.play.classList.add('hidden');
  els.cheer.classList.add('hidden');
  els.shop.classList.remove('hidden');
  renderShop();
  sayInstruction(t('daovang.help.shop', 'Dùng tiền vừa đào được để mua đồ giúp màn sau dễ hơn nhé!'));
}

/* ===== Điều hướng màn hình ===== */

function showHome() {
  cancelAnimationFrame(state.raf);
  els.home.classList.remove('hidden');
  els.play.classList.add('hidden');
  els.shop.classList.add('hidden');
  els.cheer.classList.add('hidden');
  els.btnNew.hidden = true;
  state.instruction = t('daovang.help.home', 'Chọn kiểu chơi: Đào Vàng, Cuộc Săn Vàng, hoặc Thợ Mỏ Liều Lĩnh!');
}

function showPlay() {
  els.home.classList.add('hidden');
  els.shop.classList.add('hidden');
  els.cheer.classList.add('hidden');
  els.play.classList.remove('hidden');
  els.btnNew.hidden = false;
  state.startedAt = Date.now();
  sayInstruction(t('daovang.help.play', 'Chờ cần câu đu tới chỗ muốn thả rồi bấm vào sân để thả mỏ xuống nhé! Mỏ chạm vật gì sẽ tự cuốn về.'));
  startLevel();
}

function startMode(mode) {
  state.mode = mode;
  state.level = 0;
  state.wallet = makeWallet();
  sfx.select();
  showPlay();
}

/* ===== Nút bấm ===== */

for (const card of document.querySelectorAll('.mode-card')) {
  card.addEventListener('click', () => startMode(card.dataset.mode));
}
els.canvas.addEventListener('pointerdown', () => {
  if (!state.game || state.game.over) return;
  fireHook(state.game);
});
els.btnDynamite.addEventListener('click', (e) => {
  e.stopPropagation();
  if (!state.game) return;
  if (useDynamite(state.game)) { sfx.match(3); updateHud(); } else sfx.fail();
});
els.btnShopNext.addEventListener('click', () => {
  sfx.select();
  state.level++;
  els.shop.classList.add('hidden');
  showPlay();
});
els.btnHome2.addEventListener('click', () => { sfx.select(); showHome(); });
els.btnNew.addEventListener('click', () => {
  sfx.shuffle();
  state.level = 0;
  state.wallet = makeWallet();
  showPlay();
});
els.btnHelp.addEventListener('click', () => { sfx.select(); speak(state.instruction); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
showHome();
speak(state.instruction);

// Hook cho e2e test
window.__daovang = { state, startMode, showHome, showShop, TYPES };
