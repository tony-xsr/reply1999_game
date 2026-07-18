// Điều phối Vườn Rau Thần Kỳ: vẽ canvas, chọn cây rồi bấm vào ô để trồng, vòng lặp mô phỏng.

import {
  ROWS, COLS, START_LIVES, PLANTS, BUGS, makeLevel, plantAt, stepGame,
} from './vuonrau.js';
import { speak, bindMute } from '../../to-mau/src/speech.js';
import { sfx } from '../../pokemon/src/sfx.js';
import { currentProfile, recordSession } from '../../pokemon/src/stats.js';
import { mountKidFeatures } from '../../shared/kid-bar.js';

const t = (key, fallback) => {
  const v = window.I18N?.t(key);
  return v && v !== key ? v : fallback;
};

const FIELD_W = 640;
const FIELD_H = 400;
const CELL_W = FIELD_W / COLS;
const CELL_H = FIELD_H / ROWS;

/* ===== Icon SVG (Twemoji — xem images/CREDITS.md) thay cho emoji chữ, nét hơn hẳn ===== */
const ICON_OF = {
  hoa_nang: 'sunflower', dau_xanh: 'seedling', xuong_rong: 'cactus',
  bap_cai: 'cabbage', ot_do: 'pepper', // cây mới
  small: 'bug', big: 'cricket', armor: 'beetle', flyer: 'butterfly', // côn trùng
};
const ICONS = {};
for (const name of ['sunflower', 'seedling', 'cactus', 'cabbage', 'pepper', 'bug', 'cricket', 'beetle', 'butterfly', 'droplet']) {
  const img = new Image();
  img.src = `images/${name}.svg`;
  ICONS[name] = img;
}
function drawIcon(ctx2d, name, cx, cy, size) {
  const img = ICONS[name];
  if (img.complete && img.naturalWidth !== 0) {
    ctx2d.drawImage(img, cx - size / 2, cy - size / 2, size, size);
  }
}

const $ = (id) => document.getElementById(id);
const els = {
  wrap: $('boardWrap'), canvas: $('gameCanvas'), plantBar: $('plantBar'),
  btnNew: $('btnNew'), btnHelp: $('btnHelp'), btnSound: $('btnSound'),
  hudWater: $('hudWater'), hudLives: $('hudLives'), hudLevel: $('hudLevel'),
  cheer: $('cheer'), cheerEmoji: $('cheerEmoji'), cheerText: $('cheerText'), btnCheerGo: $('btnCheerGo'),
};
const ctx = els.canvas.getContext('2d');

const state = {
  level: 0, game: null, raf: 0, last: 0, selectedPlant: 'hoa_nang', startedAt: Date.now(), instruction: '',
  boomFx: [], // vệt nổ ớt: {row, life}
  surgeSaid: false,
};
bindMute(() => sfx.muted);

/** Đọc hướng dẫn + lưu lại để bấm ❓ nghe lại được (bé chưa đọc chữ vẫn chơi được). */
function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

function buildPlantBar() {
  els.plantBar.innerHTML = '';
  for (const type of Object.keys(PLANTS)) {
    const def = PLANTS[type];
    const btn = document.createElement('button');
    btn.className = 'plant-btn';
    btn.dataset.type = type;
    btn.innerHTML = `<img class="pb-icon" src="images/${ICON_OF[type]}.svg" alt="${def.name}" draggable="false"><span class="pb-cost">💧${def.cost}</span>`;
    btn.addEventListener('click', () => { state.selectedPlant = type; sfx.select(); renderPlantBar(); });
    els.plantBar.appendChild(btn);
  }
  renderPlantBar();
}

function renderPlantBar() {
  const g = state.game;
  for (const btn of els.plantBar.children) {
    const type = btn.dataset.type;
    btn.classList.toggle('selected', type === state.selectedPlant);
    btn.classList.toggle('disabled', !g || g.water < PLANTS[type].cost);
  }
}

/* ===== Vẽ ===== */

function draw() {
  const g = state.game;
  for (let r = 0; r < ROWS; r++) {
    ctx.fillStyle = r % 2 ? '#dff0c8' : '#e9f6d8';
    ctx.fillRect(0, r * CELL_H, FIELD_W, CELL_H);
  }
  ctx.strokeStyle = 'rgba(90,60,20,0.15)';
  ctx.lineWidth = 1;
  for (let c = 1; c < COLS; c++) {
    ctx.beginPath(); ctx.moveTo(c * CELL_W, 0); ctx.lineTo(c * CELL_W, FIELD_H); ctx.stroke();
  }
  if (!g) return;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = g.grid[r][c];
      if (!cell) continue;
      const cx = c * CELL_W + CELL_W / 2;
      const cy = r * CELL_H + CELL_H / 2;
      drawIcon(ctx, ICON_OF[cell.type], cx, cy, CELL_H * 0.68);
      // thanh máu cây
      const maxHp = PLANTS[cell.type].hp;
      const pct = Math.max(0, cell.hp / maxHp);
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(c * CELL_W + 6, r * CELL_H + CELL_H - 8, CELL_W - 12, 4);
      ctx.fillStyle = '#2f9e44';
      ctx.fillRect(c * CELL_W + 6, r * CELL_H + CELL_H - 8, (CELL_W - 12) * pct, 4);
    }
  }

  // vệt nổ ớt quét ngang hàng
  for (const fx of state.boomFx) {
    fx.life -= 1;
    ctx.fillStyle = `rgba(255, 120, 40, ${Math.max(0, fx.life / 20) * 0.55})`;
    ctx.fillRect(0, fx.row * CELL_H + 4, FIELD_W, CELL_H - 8);
    ctx.fillStyle = `rgba(255, 220, 120, ${Math.max(0, fx.life / 20) * 0.8})`;
    ctx.fillRect(0, fx.row * CELL_H + CELL_H / 2 - 6, FIELD_W, 12);
  }
  state.boomFx = state.boomFx.filter((fx) => fx.life > 0);

  for (const bug of g.bugs) {
    const cx = bug.x * CELL_W;
    const flyBob = BUGS[bug.type].flying ? Math.sin(performance.now() / 180 + bug.x * 2) * 6 - 10 : 0;
    const cy = bug.row * CELL_H + CELL_H / 2 + flyBob;
    drawIcon(ctx, ICON_OF[bug.type], cx, cy, CELL_H * 0.62);
    const maxHp = BUGS[bug.type].hp;
    const pct = Math.max(0, bug.hp / maxHp);
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(cx - CELL_W / 2 + 6, bug.row * CELL_H + 4, CELL_W - 12, 4);
    ctx.fillStyle = '#e0392a';
    ctx.fillRect(cx - CELL_W / 2 + 6, bug.row * CELL_H + 4, (CELL_W - 12) * pct, 4);
  }
}

/* ===== HUD ===== */

function updateHud() {
  const g = state.game;
  els.hudWater.textContent = g.water;
  els.hudLives.textContent = '❤️'.repeat(Math.max(0, g.lives)) + '🖤'.repeat(START_LIVES - Math.max(0, g.lives));
  els.hudLevel.textContent = `${t('daovang.level', 'Màn')} ${g.level + 1}`;
  renderPlantBar();
}

/* ===== Vòng lặp ===== */

function loop(now) {
  const dt = Math.min(50, now - state.last);
  state.last = now;
  const g = state.game;
  const livesBefore = g.lives;
  const scoreBefore = g.score;
  stepGame(g, dt, Math.random);
  if (g.lives < livesBefore) sfx.fail();
  else if (g.score > scoreBefore) sfx.match(2);
  // ớt vừa nổ → vệt lửa quét hàng + tiếng nổ
  while (g.booms.length) {
    const boom = g.booms.pop();
    state.boomFx.push({ row: boom.row, life: 20 });
    sfx.match(3);
  }
  // sóng cuối ập vào → báo 1 lần
  if (g.surged && !state.surgeSaid) {
    state.surgeSaid = true;
    sfx.shuffle();
    speak(t('vuonrau.surge', 'Sóng cuối tới rồi, giữ vững vườn rau!'));
  }
  updateHud();
  draw();
  if (g.over) return endLevel();
  state.raf = requestAnimationFrame(loop);
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

function endLevel() {
  cancelAnimationFrame(state.raf);
  const g = state.game;
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'vuonrau',
    result: g.won ? 'win' : 'quit',
    score: g.score,
    level: g.level + 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  if (g.won) {
    sfx.levelWin();
    confetti();
    els.cheerEmoji.textContent = '🏆';
    els.cheerText.textContent = `${t('vuonrau.win', 'Vườn rau an toàn rồi!')}\n⭐ ${g.score}`;
    els.btnCheerGo.textContent = t('vuonrau.next', 'MÀN TIẾP ▶');
    els.btnCheerGo.onclick = () => { sfx.select(); state.level++; startLevel(); };
    speak(t('vuonrau.win', 'Vườn rau an toàn rồi!'));
  } else {
    sfx.gameOver();
    els.cheerEmoji.textContent = '🐛';
    els.cheerText.textContent = `${t('vuonrau.lose', 'Côn trùng tràn vào vườn rồi!')}\n⭐ ${g.score}`;
    els.btnCheerGo.textContent = t('ran.retry', 'CHƠI LẠI ▶');
    els.btnCheerGo.onclick = () => { sfx.select(); state.level = 0; startLevel(); };
    speak(t('vuonrau.lose', 'Côn trùng tràn vào vườn rồi, chơi lại nhé!'));
  }
  els.cheer.classList.remove('hidden');
}

function startLevel() {
  els.cheer.classList.add('hidden');
  state.boomFx = [];
  state.surgeSaid = false;
  state.game = makeLevel(state.level, Math.random);
  state.startedAt = Date.now();
  state.last = performance.now();
  updateHud();
  draw();
  state.raf = requestAnimationFrame(loop);
}

/* ===== Trồng cây ===== */

function posToCell(e) {
  const rect = els.canvas.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * FIELD_W;
  const y = ((e.clientY - rect.top) / rect.height) * FIELD_H;
  return { row: Math.floor(y / CELL_H), col: Math.floor(x / CELL_W) };
}

els.wrap.addEventListener('pointerdown', (e) => {
  if (!state.game || state.game.over) return;
  const { row, col } = posToCell(e);
  if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return;
  const ok = plantAt(state.game, row, col, state.selectedPlant);
  if (ok) { sfx.match(1); updateHud(); draw(); }
  else sfx.fail();
});

/* ===== Nút ===== */

els.btnNew.addEventListener('click', () => { sfx.shuffle(); state.level = 0; startLevel(); });
els.btnHelp.addEventListener('click', () => { sfx.select(); speak(state.instruction); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
buildPlantBar();
sayInstruction(t('vuonrau.help', 'Chọn 1 loại cây rồi bấm vào ô trống để trồng — Hoa Mặt Trời tạo nước tưới, Đậu Xanh bắn côn trùng, Xương Rồng chắn đường. Đừng để côn trùng lọt qua hết vườn nhé!'));
startLevel();

// Hook cho e2e test
window.__vuonrau = { state, startLevel, plantAt: (r, c, type) => plantAt(state.game, r, c, type) };

mountKidFeatures(); // thanh avatar bé + huy hiệu sao header + kiểm tra giới hạn phút/ngày (áp dụng cho mọi game, kể cả game giải trí thuần)
