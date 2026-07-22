// Điều phối Xây Thị Trấn Vàng: màn thị trấn (công trình tự vẽ canvas, đẹp dần theo cấp)
// xen kẽ chuyến xe goòng hứng vàng trong hầm mỏ. Tiến độ lưu localStorage — chơi tiếp mãi.

import {
  FIELD_W, FIELD_H, CART_Y, CART_W, CART_H, RUN_MS, DROPS, BUILDINGS,
  costOf, makeTown, buyUpgrade, townComplete, nextTown, serializeTown, deserializeTown,
  makeRun, moveCart, stepRun, bankRun,
} from './xaythitran.js';
import { speak, bindMute } from '../../to-mau/src/speech.js';
import { sfx } from '../../pokemon/src/sfx.js';
import { currentProfile, recordSession } from '../../pokemon/src/stats.js';
import { mountKidFeatures } from '../../shared/kid-bar.js';

const t = (key, fallback) => {
  const v = window.I18N?.t(key);
  return v && v !== key ? v : fallback;
};

const $ = (id) => document.getElementById(id);
const els = {
  wrap: $('boardWrap'), canvas: $('gameCanvas'),
  runHud: $('runHud'), runTime: $('runTime'), runCarried: $('runCarried'),
  buildPanel: $('buildPanel'), buildList: $('buildList'), btnGoMine: $('btnGoMine'),
  hudGold: $('hudGold'), hudTrips: $('hudTrips'), hudTown: $('hudTown'),
  btnHelp: $('btnHelp'), btnSound: $('btnSound'),
  cheer: $('cheer'), cheerEmoji: $('cheerEmoji'), cheerText: $('cheerText'), btnCheerGo: $('btnCheerGo'),
};
const ctx = els.canvas.getContext('2d');

const IMAGES = {};
for (const [name, ext] of [['coin', 'svg'], ['gem', 'svg'], ['rock', 'svg'], ['tree', 'png']]) {
  const img = new Image();
  img.src = `images/${name}.${ext}`;
  IMAGES[name] = img;
}

const TOWN_KEY = 'xaytt.town';
const state = {
  mode: 'town', // 'town' | 'run'
  town: deserializeTown(localStorage.getItem(TOWN_KEY) || ''),
  run: null,
  raf: 0, last: 0, startedAt: Date.now(), instruction: '',
  sparkles: [], shake: 0,
};
bindMute(() => sfx.muted);

function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

function persist() {
  localStorage.setItem(TOWN_KEY, serializeTown(state.town));
}

/* ===== VẼ THỊ TRẤN — công trình đẹp dần theo cấp ===== */

function roofTri(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x - 6, y);
  ctx.lineTo(x + w / 2, y - h);
  ctx.lineTo(x + w + 6, y);
  ctx.closePath();
  ctx.fill();
}

function windowRect(x, y, w = 12, h = 14) {
  ctx.fillStyle = '#fff3c4';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = 'rgba(0,0,0,0.35)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x, y, w, h);
}

function drawNha(x, y, lv) {
  // nhà dân: cấp 1 nhà nhỏ → cấp 3 biệt thự 2 tầng có cờ
  const w = 70 + lv * 8;
  const h = 40 + lv * 16;
  ctx.fillStyle = '#f5e0c0';
  ctx.fillRect(x, y - h, w, h);
  roofTri(x, y - h, w, 26 + lv * 4, ['#c0664a', '#b0509e', '#3f8fc4'][lv - 1]);
  ctx.fillStyle = '#8a5a34';
  ctx.fillRect(x + w / 2 - 9, y - 24, 18, 24);
  windowRect(x + 10, y - h + 12);
  if (lv >= 2) windowRect(x + w - 24, y - h + 12);
  if (lv >= 3) {
    windowRect(x + 10, y - 40);
    windowRect(x + w - 24, y - 40);
    ctx.strokeStyle = '#5d4037';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(x + w / 2, y - h - 30 - 12); ctx.lineTo(x + w / 2, y - h - 12); ctx.stroke();
    ctx.fillStyle = '#e53935';
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y - h - 42);
    ctx.lineTo(x + w / 2 + 18, y - h - 36);
    ctx.lineTo(x + w / 2, y - h - 30);
    ctx.closePath(); ctx.fill();
  }
}

function drawCuaHang(x, y, lv) {
  const w = 78 + lv * 8;
  const h = 44 + lv * 10;
  ctx.fillStyle = '#e8d3a8';
  ctx.fillRect(x, y - h, w, h);
  // mái hiên sọc
  for (let i = 0; i < Math.ceil(w / 14); i++) {
    ctx.fillStyle = i % 2 ? '#e53935' : '#fffaf2';
    ctx.fillRect(x - 4 + i * 14, y - h + 6, 14, 12);
  }
  ctx.fillStyle = '#8a5a34';
  ctx.fillRect(x + 8, y - 26, 20, 26);
  windowRect(x + w - 34, y - 30, 24, 18);
  ctx.fillStyle = '#5d4037';
  ctx.font = '900 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(lv >= 3 ? '🛒🛒' : '🛒', x + w / 2, y - h + 32);
  if (lv >= 2) { // biển hiệu
    ctx.fillStyle = '#ffd93d';
    ctx.fillRect(x + w / 2 - 22, y - h - 12, 44, 12);
  }
}

function drawDaiPhun(x, y, lv, now) {
  ctx.fillStyle = '#9db4c9';
  ctx.beginPath();
  ctx.ellipse(x, y - 8, 34 + lv * 6, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#7fc4e8';
  ctx.beginPath();
  ctx.ellipse(x, y - 10, 26 + lv * 6, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#9db4c9';
  ctx.fillRect(x - 5, y - 34 - lv * 6, 10, 26 + lv * 6);
  // tia nước nhấp nhô
  ctx.strokeStyle = 'rgba(140, 210, 250, 0.9)';
  ctx.lineWidth = 3;
  for (let i = -1; i <= 1; i++) {
    const sway = Math.sin(now / 300 + i) * 3;
    ctx.beginPath();
    ctx.moveTo(x, y - 34 - lv * 6);
    ctx.quadraticCurveTo(x + i * 14 + sway, y - 52 - lv * 8, x + i * 20 + sway, y - 14);
    ctx.stroke();
  }
}

function drawThapDongHo(x, y, lv, now) {
  const h = 80 + lv * 24;
  ctx.fillStyle = '#d9c49a';
  ctx.fillRect(x - 16, y - h, 32, h);
  roofTri(x - 16, y - h, 32, 22, '#7c3fc4');
  // mặt đồng hồ
  ctx.fillStyle = '#fffaf2';
  ctx.beginPath();
  ctx.arc(x, y - h + 26, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#241e2e';
  ctx.lineWidth = 2;
  ctx.stroke();
  const a = (now / 3000) % (Math.PI * 2);
  ctx.beginPath();
  ctx.moveTo(x, y - h + 26);
  ctx.lineTo(x + Math.cos(a) * 8, y - h + 26 + Math.sin(a) * 8);
  ctx.stroke();
  if (lv >= 3) { ctx.fillStyle = '#ffd93d'; ctx.beginPath(); ctx.arc(x, y - h - 26, 5, 0, Math.PI * 2); ctx.fill(); }
  windowRect(x - 6, y - 30);
}

function drawVuonCay(x, y, lv) {
  const img = IMAGES.tree;
  const n = 1 + lv;
  for (let i = 0; i < n; i++) {
    if (img.complete && img.naturalWidth) ctx.drawImage(img, x + i * 26 - 10, y - 46, 30, 46);
  }
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  for (let i = 0; i < 2 + lv; i++) ctx.fillText('🌼', x + i * 16 - 8, y - 2);
}

function drawCongThanh(x, y, lv) {
  const h = 66 + lv * 14;
  ctx.fillStyle = '#e0bd72';
  ctx.fillRect(x - 52, y - h, 20, h);
  ctx.fillRect(x + 32, y - h, 20, h);
  ctx.fillStyle = '#d9a05e';
  ctx.fillRect(x - 52, y - h - 10, 20, 10);
  ctx.fillRect(x + 32, y - h - 10, 20, 10);
  ctx.beginPath();
  ctx.moveTo(x - 32, y);
  ctx.lineTo(x - 32, y - h + 22);
  ctx.quadraticCurveTo(x, y - h - 8, x + 32, y - h + 22);
  ctx.lineTo(x + 32, y);
  ctx.fillStyle = '#c9995c';
  ctx.fill();
  if (lv >= 2) {
    ctx.fillStyle = '#ffd93d';
    ctx.font = '900 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('★', x, y - h + 10);
  }
}

const PLOTS = {
  nha: { x: 60, y: 330 },
  cuahang: { x: 220, y: 335 },
  daiphun: { x: 390, y: 335 },
  thapdongho: { x: 520, y: 330 },
  vuoncay: { x: 480, y: 420 },
  congthanh: { x: 150, y: 445 },
};

function drawEmptyPlot(x, y) {
  ctx.strokeStyle = 'rgba(90, 60, 20, 0.4)';
  ctx.setLineDash([6, 5]);
  ctx.lineWidth = 2;
  ctx.strokeRect(x - 8, y - 44, 86, 44);
  ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(90, 60, 20, 0.5)';
  ctx.font = '900 22px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🚧', x + 35, y - 16);
}

function drawTown(now) {
  const town = state.town;
  const sky = ctx.createLinearGradient(0, 0, 0, FIELD_H);
  sky.addColorStop(0, '#9ad8f5');
  sky.addColorStop(0.72, '#e8f0d0');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);
  ctx.fillStyle = 'rgba(150, 190, 130, 0.6)';
  for (const [hx, hr] of [[100, 120], [360, 150], [580, 110]]) {
    ctx.beginPath();
    ctx.arc(hx, 300, hr, Math.PI, 0);
    ctx.fill();
  }
  ctx.fillStyle = '#a8c878';
  ctx.fillRect(0, 300, FIELD_W, FIELD_H - 300);
  // đường làng
  ctx.fillStyle = '#d9c49a';
  ctx.beginPath();
  ctx.moveTo(280, FIELD_H);
  ctx.quadraticCurveTo(310, 380, 300, 300);
  ctx.lineTo(340, 300);
  ctx.quadraticCurveTo(360, 380, 360, FIELD_H);
  ctx.closePath();
  ctx.fill();

  const draws = {
    nha: drawNha, cuahang: drawCuaHang,
    daiphun: (x, y, lv) => drawDaiPhun(x + 35, y, lv, now),
    thapdongho: (x, y, lv) => drawThapDongHo(x + 35, y, lv, now),
    vuoncay: drawVuonCay,
    congthanh: (x, y, lv) => drawCongThanh(x + 35, y, lv),
  };
  for (const b of BUILDINGS) {
    const plot = PLOTS[b.id];
    const lv = town.built[b.id];
    if (lv === 0) drawEmptyPlot(plot.x, plot.y);
    else draws[b.id](plot.x, plot.y, lv);
  }
  // thị trấn hoàn thành → cờ hoa
  if (townComplete(town)) {
    ctx.font = '26px sans-serif';
    for (let i = 0; i < 6; i++) {
      ctx.fillText('🎉', 70 + i * 100, 80 + Math.sin(now / 400 + i) * 8);
    }
  }
}

/* ===== VẼ CHUYẾN XE GOÒNG ===== */

function drawRun(now) {
  const run = state.run;
  const bg = ctx.createLinearGradient(0, 0, 0, FIELD_H);
  bg.addColorStop(0, '#2d2140');
  bg.addColorStop(1, '#4a3323');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);
  // vách hầm + đèn lồng treo (glow ấm bằng radial gradient thay vì fill phẳng mờ nhạt)
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(0, 0, 26, FIELD_H);
  ctx.fillRect(FIELD_W - 26, 0, 26, FIELD_H);
  const flicker = 0.85 + Math.sin(now / 260) * 0.15;
  for (let i = 0; i < 3; i++) {
    const lx = 80 + i * 240;
    const glow = ctx.createRadialGradient(lx, 60, 2, lx, 60, 70);
    glow.addColorStop(0, `rgba(255, 226, 130, ${0.5 * flicker})`);
    glow.addColorStop(1, 'rgba(255, 226, 130, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(lx, 60, 70, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(lx - 3, 30, 6, 14);
    ctx.fillStyle = '#ffe082';
    ctx.beginPath();
    ctx.arc(lx, 50, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#8a5a34';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  // đường ray
  ctx.strokeStyle = '#8a6a3d';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, CART_Y + CART_H / 2 + 8);
  ctx.lineTo(FIELD_W, CART_Y + CART_H / 2 + 8);
  ctx.stroke();
  for (let x = 10; x < FIELD_W; x += 34) {
    ctx.strokeStyle = '#6a4a2d';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x, CART_Y + CART_H / 2 + 4);
    ctx.lineTo(x + 16, CART_Y + CART_H / 2 + 14);
    ctx.stroke();
  }
  // vật rơi
  for (const it of run.items) {
    const icon = it.kind === 'bag' ? 'coin' : it.kind;
    const img = IMAGES[icon];
    const size = DROPS[it.kind].r * (it.kind === 'bag' ? 2.6 : 2.2);
    if (img.complete && img.naturalWidth) ctx.drawImage(img, it.x - size / 2, it.y - size / 2, size, size);
    if (it.kind === 'bag') {
      ctx.fillStyle = '#ffd93d';
      ctx.font = '900 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('+15', it.x, it.y - 18);
    }
  }
  // bóng đổ dưới xe (giúp xe "đứng" trên ray, dễ nhận vị trí)
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath();
  ctx.ellipse(run.cartX, CART_Y + CART_H / 2 + 14, CART_W / 2, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // xe goòng — cam rực + viền sáng để KHÔNG lẫn vào nền tối
  const blink = run.stunMs > 0 ? (Math.floor(now / 110) % 2 ? 0.4 : 0.9) : 1;
  const bob = Math.sin(now / 180) * 2; // hơi nhún lên xuống cho có sức sống
  ctx.save();
  ctx.globalAlpha = blink;
  ctx.shadowColor = 'rgba(255, 170, 60, 0.9)';
  ctx.shadowBlur = 18;
  const cartGrad = ctx.createLinearGradient(0, CART_Y - CART_H / 2, 0, CART_Y + CART_H / 2);
  cartGrad.addColorStop(0, '#ffab40');
  cartGrad.addColorStop(1, '#e65100');
  ctx.fillStyle = cartGrad;
  ctx.beginPath();
  ctx.moveTo(run.cartX - CART_W / 2, CART_Y - CART_H / 2 + bob);
  ctx.lineTo(run.cartX + CART_W / 2, CART_Y - CART_H / 2 + bob);
  ctx.lineTo(run.cartX + CART_W / 2 - 12, CART_Y + CART_H / 2 + bob);
  ctx.lineTo(run.cartX - CART_W / 2 + 12, CART_Y + CART_H / 2 + bob);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = '#fff3c4';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.strokeStyle = 'rgba(93, 58, 30, 0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(run.cartX - CART_W / 2 + 6, CART_Y - CART_H / 2 + 10 + bob);
  ctx.lineTo(run.cartX + CART_W / 2 - 6, CART_Y - CART_H / 2 + 10 + bob);
  ctx.stroke();
  // vàng chất trong xe cao dần
  const pile = Math.min(4, Math.floor(run.carried / 60));
  if (run.carried > 0) {
    ctx.fillStyle = '#ffd93d';
    ctx.strokeStyle = '#c98a00';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(run.cartX, CART_Y - CART_H / 2 - 2 + bob, CART_W / 2 - 14, 6 + pile * 3, 0, Math.PI, 0);
    ctx.fill();
    ctx.stroke();
  }
  // bánh xe (đen, viền sáng nhẹ để nổi trên ray)
  ctx.fillStyle = '#241e2e';
  ctx.strokeStyle = '#ffd93d';
  ctx.lineWidth = 1.5;
  for (const wx of [run.cartX - CART_W / 4, run.cartX + CART_W / 4]) {
    ctx.beginPath();
    ctx.arc(wx, CART_Y + CART_H / 2 + 4 + bob, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();

  // lấp lánh khi vừa hứng được vàng
  for (const s of state.sparkles) {
    s.x += s.vx; s.y += s.vy; s.vy += 0.15; s.life -= 1;
    ctx.globalAlpha = Math.max(0, s.life / 26);
    ctx.fillStyle = '#ffe082';
    ctx.beginPath();
    ctx.arc(s.x, s.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  state.sparkles = state.sparkles.filter((s) => s.life > 0);
}

/* ===== HUD & vòng lặp ===== */

function updateHud() {
  els.hudGold.textContent = state.town.gold;
  els.hudTrips.textContent = state.town.trips;
  els.hudTown.textContent = `${t('xaytt.town', 'Thị trấn')} ${state.town.townLevel + 1}`;
}

function renderBuildList() {
  els.buildList.innerHTML = '';
  for (const b of BUILDINGS) {
    const lv = state.town.built[b.id];
    const maxed = lv >= b.costs.length;
    const cost = maxed ? 0 : costOf(b, lv, state.town.townLevel);
    const item = document.createElement('div');
    item.className = `build-item${maxed ? ' maxed' : ''}`;
    item.innerHTML = `<span>${b.name}<span class="lv">${t('xaytt.level', 'Cấp')} ${lv}/${b.costs.length}</span></span>`;
    const btn = document.createElement('button');
    btn.textContent = maxed ? '✔ MAX' : `💰${cost}`;
    btn.disabled = maxed || state.town.gold < cost;
    btn.addEventListener('click', () => {
      const newLv = buyUpgrade(state.town, b.id);
      if (newLv < 0) return;
      sfx.levelWin();
      speak(`${b.name}!`);
      persist();
      updateHud();
      renderBuildList();
      if (townComplete(state.town)) {
        setTimeout(() => {
          sfx.levelWin();
          speak(t('xaytt.complete', 'Thị trấn hoàn thành rồi! Mở thị trấn mới to hơn!'));
          setTimeout(() => {
            state.town = nextTown(state.town);
            persist();
            updateHud();
            renderBuildList();
          }, 2600);
        }, 600);
      }
    });
    item.appendChild(btn);
    els.buildList.appendChild(item);
  }
}

function loop(now) {
  const dtMs = Math.min(50, now - state.last);
  state.last = now;
  if (state.mode === 'run') {
    const run = state.run;
    const ev = stepRun(run, dtMs, Math.random);
    if (ev.caught.length) sfx.match(ev.caught.some((c) => c.kind === 'gem') ? 3 : 1);
    if (ev.hitRock) sfx.fail();
    els.runTime.textContent = Math.ceil(run.timeLeftMs / 1000);
    els.runCarried.textContent = `💰 ${run.carried}`;
    if (ev.caught.length) {
      for (let i = 0; i < 8; i++) {
        state.sparkles.push({
          x: run.cartX + (Math.random() - 0.5) * CART_W, y: CART_Y - CART_H / 2,
          vx: (Math.random() - 0.5) * 4, vy: -1 - Math.random() * 3, life: 26,
        });
      }
    }
    if (ev.hitRock) state.shake = 10;
    if (state.shake > 0) {
      els.canvas.style.transform = `translate(${(Math.random() - 0.5) * state.shake}px, ${(Math.random() - 0.5) * state.shake}px)`;
      state.shake = Math.max(0, state.shake - 0.7);
    } else if (els.canvas.style.transform) {
      els.canvas.style.transform = '';
    }
    drawRun(now);
    if (run.over) return endRun();
  } else {
    drawTown(now);
  }
  state.raf = requestAnimationFrame(loop);
}

function endRun() {
  const earned = bankRun(state.town, state.run);
  persist();
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'xaytt',
    result: 'win',
    score: earned,
    level: state.town.townLevel + 1,
    seconds: RUN_MS / 1000,
  });
  sfx.levelWin();
  els.cheerEmoji.textContent = '💰';
  els.cheerText.textContent = `${t('xaytt.earned', 'Chở về được')} ${earned} ${t('xaytt.gold', 'vàng')}!`;
  speak(`${t('xaytt.earned', 'Chở về được')} ${earned} ${t('xaytt.gold', 'vàng')}!`);
  els.cheer.classList.remove('hidden');
  els.btnCheerGo.onclick = () => {
    sfx.select();
    els.cheer.classList.add('hidden');
    showTown();
  };
}

function showTown() {
  state.mode = 'town';
  state.run = null;
  state.sparkles = [];
  state.shake = 0;
  els.canvas.style.transform = '';
  els.runHud.classList.add('hidden');
  els.buildPanel.style.display = '';
  updateHud();
  renderBuildList();
  state.last = performance.now();
  cancelAnimationFrame(state.raf);
  state.raf = requestAnimationFrame(loop);
}

function startRun() {
  state.mode = 'run';
  state.run = makeRun(state.town.townLevel);
  state.sparkles = [];
  state.shake = 0;
  els.runHud.classList.remove('hidden');
  els.buildPanel.style.display = 'none';
  sayInstruction(t('xaytt.runhelp', 'Kéo xe goòng qua lại hứng xu vàng, túi vàng và kim cương — né tảng đá kẻo văng mất vàng đang chở!'));
  state.last = performance.now();
  cancelAnimationFrame(state.raf);
  state.raf = requestAnimationFrame(loop);
}

/* ===== Điều khiển xe ===== */

// Đo rect() 1 lần lúc pointerdown, tránh đo lại mỗi pointermove (layout thrashing).
let cartRect = null;
function posX(e) {
  return ((e.clientX - cartRect.left) / cartRect.width) * FIELD_W;
}
let dragging = false;
els.wrap.addEventListener('pointerdown', (e) => {
  if (state.mode !== 'run' || !state.run) return;
  dragging = true;
  cartRect = els.canvas.getBoundingClientRect();
  moveCart(state.run, posX(e));
});
els.wrap.addEventListener('pointermove', (e) => {
  if (dragging && state.mode === 'run' && state.run) moveCart(state.run, posX(e));
});
els.wrap.addEventListener('pointerup', () => { dragging = false; });
els.wrap.addEventListener('pointercancel', () => { dragging = false; });
document.addEventListener('keydown', (e) => {
  if (state.mode !== 'run' || !state.run) return;
  if (e.key === 'ArrowLeft' || e.key === 'a') moveCart(state.run, state.run.cartX - 30);
  else if (e.key === 'ArrowRight' || e.key === 'd') moveCart(state.run, state.run.cartX + 30);
});

/* ===== Nút ===== */

els.btnGoMine.addEventListener('click', () => { sfx.shuffle(); startRun(); });
els.btnHelp.addEventListener('click', () => { sfx.select(); speak(state.instruction); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
sayInstruction(t('xaytt.help', 'Bấm ĐI CHỞ VÀNG để lái xe goòng vào hầm mỏ hứng vàng rơi — né tảng đá nhé! Mang vàng về xây và nâng cấp sáu công trình: nhà, cửa hàng, đài phun nước, tháp đồng hồ, vườn cây, cổng thành. Xây đủ hết là mở thị trấn mới to hơn! Thị trấn của bé được lưu lại, mai chơi tiếp vẫn còn nguyên!'));
showTown();

// Hook cho e2e test
window.__xaytt = { state, startRun, showTown };

mountKidFeatures(); // thanh avatar bé + huy hiệu sao header + kiểm tra giới hạn phút/ngày (áp dụng cho mọi game, kể cả game giải trí thuần)
