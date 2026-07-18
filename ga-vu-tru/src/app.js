// Điều phối Gà Vũ Trụ Xâm Lăng: vẽ canvas nền vũ trụ, kéo tay lái máy bay, súng tự bắn.
// UFO Kenney (CC0) chở chú gà Twemoji trên lưng — theme tự thiết kế.

import {
  FIELD_W, FIELD_H, PLANE_Y, PLANE_R, START_LIVES, MAX_WEAPON,
  makeLevel, movePlane, stepGame,
} from './gavutru.js';
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
  btnNew: $('btnNew'), btnHelp: $('btnHelp'), btnSound: $('btnSound'),
  hudScore: $('hudScore'), hudLives: $('hudLives'), hudLevel: $('hudLevel'),
  overlay: $('overlay'), ovEmoji: $('ovEmoji'), ovText: $('ovText'), btnPlay: $('btnPlay'),
};
const ctx = els.canvas.getContext('2d');

const IMAGES = {};
for (const name of ['ufo_green', 'ufo_blue', 'ufo_pink', 'ufo_boss', 'chicken', 'plane', 'star', 'burst']) {
  const img = new Image();
  img.src = `images/${name}.${name === 'chicken' || name === 'plane' || name === 'star' ? 'svg' : 'png'}`;
  IMAGES[name] = img;
}
function drawIcon(name, cx, cy, size) {
  const img = IMAGES[name];
  if (img.complete && img.naturalWidth !== 0) {
    ctx.drawImage(img, cx - size / 2, cy - size / 2, size, size);
  }
}

const UFO_BY_ROW = ['ufo_pink', 'ufo_green', 'ufo_blue', 'ufo_green'];

const state = {
  level: 0, game: null, raf: 0, last: 0, startedAt: Date.now(), instruction: '',
  starsBg: [], bursts: [],
};
for (let i = 0; i < 60; i++) {
  state.starsBg.push({ x: Math.random() * FIELD_W, y: Math.random() * FIELD_H, r: Math.random() * 1.6 + 0.4, v: 0.3 + Math.random() });
}
bindMute(() => sfx.muted);

/** Đọc hướng dẫn + lưu lại để bấm ❓ nghe lại được (bé chưa đọc chữ vẫn chơi được). */
function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

/* ===== Vẽ ===== */

function drawBackground(dt) {
  const bg = ctx.createLinearGradient(0, 0, 0, FIELD_H);
  bg.addColorStop(0, '#171233');
  bg.addColorStop(1, '#2c2158');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);
  ctx.fillStyle = '#fff';
  for (const s of state.starsBg) {
    s.y += s.v * dt;
    if (s.y > FIELD_H) { s.y = -2; s.x = Math.random() * FIELD_W; }
    ctx.globalAlpha = 0.4 + s.r * 0.3;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawEnemy(e, rowIdx) {
  drawIcon(UFO_BY_ROW[rowIdx % UFO_BY_ROW.length], e.x, e.y + 6, 52);
  drawIcon('chicken', e.x, e.y - 12, 26); // chú gà ngồi trên UFO
  if (e.hp >= 2) { // gà "đội mũ giáp" — vẽ vành sáng
    ctx.strokeStyle = 'rgba(255, 220, 120, 0.8)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(e.x, e.y - 12, 16, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function draw(dt) {
  drawBackground(dt);
  const g = state.game;
  if (!g) return;

  for (const s of g.stars) drawIcon('star', s.x, s.y, 30);

  ctx.fillStyle = '#ffe082';
  for (const b of g.bullets) {
    ctx.beginPath();
    ctx.ellipse(b.x, b.y, 4, 9, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // trứng — vẽ hình trứng trắng ngà
  for (const e2 of g.eggs) {
    const grad = ctx.createRadialGradient(e2.x - 3, e2.y - 4, 1, e2.x, e2.y, 10);
    grad.addColorStop(0, '#fffdf5');
    grad.addColorStop(1, '#e8d9b0');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(e2.x, e2.y, 7, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  if (g.phase === 'formation') {
    g.enemies.forEach((e) => drawEnemy(e, Math.round((e.slot.y - 80) / 58)));
  } else if (g.boss) {
    drawIcon('ufo_boss', g.boss.x, g.boss.y + 10, 130);
    drawIcon('chicken', g.boss.x, g.boss.y - 34, 52);
    // thanh máu trùm
    const pct = Math.max(0, g.boss.hp / g.boss.maxHp);
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(FIELD_W / 2 - 120, 18, 240, 14);
    ctx.fillStyle = pct > 0.5 ? '#35d435' : pct > 0.25 ? '#ffd93d' : '#ff5a5a';
    ctx.fillRect(FIELD_W / 2 - 118, 20, 236 * pct, 10);
  }

  for (const b of state.bursts) {
    b.life -= 1;
    ctx.globalAlpha = Math.max(0, b.life / 18);
    drawIcon('burst', b.x, b.y, 46 + (18 - b.life) * 2);
    ctx.globalAlpha = 1;
  }
  state.bursts = state.bursts.filter((b) => b.life > 0);

  const blink = g.invincibleMs > 0 ? (Math.floor(performance.now() / 120) % 2 ? 0.35 : 0.85) : 1;
  ctx.globalAlpha = blink;
  drawIcon('plane', g.plane.x, PLANE_Y, 52);
  ctx.globalAlpha = 1;
  // báo cấp súng
  ctx.fillStyle = '#ffd93d';
  for (let i = 0; i < g.weapon; i++) {
    ctx.beginPath();
    ctx.arc(g.plane.x - 12 + i * 12, PLANE_Y + 26, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* ===== HUD & vòng lặp ===== */

function updateHud() {
  const g = state.game;
  els.hudScore.textContent = g.score;
  els.hudLives.textContent = '❤️'.repeat(Math.max(0, g.lives)) + '🖤'.repeat(START_LIVES - Math.max(0, g.lives));
  els.hudLevel.textContent = `${t('daovang.level', 'Màn')} ${g.level + 1}`;
}

function loop(now) {
  const dtMs = Math.min(50, now - state.last);
  state.last = now;
  const g = state.game;
  const enemiesBefore = g.enemies.map((e) => ({ x: e.x, y: e.y }));
  const ev = stepGame(g, dtMs, Math.random);
  if (ev.killed) {
    sfx.match(2);
    // nổ bụp tại chỗ những con vừa biến mất — so sánh danh sách trước/sau
    const nowSet = new Set(g.enemies.map((e) => `${Math.round(e.x)},${Math.round(e.y)}`));
    for (const p of enemiesBefore) {
      if (!nowSet.has(`${Math.round(p.x)},${Math.round(p.y)}`)) state.bursts.push({ x: p.x, y: p.y, life: 18 });
    }
  }
  if (ev.bossHit) sfx.select();
  if (ev.hit) sfx.fail();
  if (ev.star) { sfx.levelWin(); speak(t('gavutru.upgrade', 'Súng mạnh hơn rồi!')); }
  if (ev.bossSpawned) { sfx.shuffle(); speak(t('gavutru.boss', 'Gà chúa xuất hiện!')); }
  updateHud();
  draw(dtMs / 16.67);
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
    mode: 'gavutru',
    result: g.won ? 'win' : 'quit',
    score: g.score,
    level: g.level + 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  if (g.won) {
    sfx.levelWin();
    confetti();
    els.ovEmoji.textContent = '🏆';
    els.ovText.textContent = `${t('gavutru.win', 'Đuổi được đàn gà vũ trụ rồi!')}\n⭐ ${g.score}`;
    els.btnPlay.textContent = t('gavutru.next', 'MÀN TIẾP ▶');
    speak(t('gavutru.win', 'Đuổi được đàn gà vũ trụ rồi!'));
  } else {
    sfx.gameOver();
    els.ovEmoji.textContent = '🥚';
    els.ovText.textContent = `${t('gavutru.lose', 'Bị trứng rơi trúng hết tim rồi!')}\n⭐ ${g.score}`;
    els.btnPlay.textContent = t('ran.retry', 'CHƠI LẠI ▶');
    speak(t('gavutru.lose', 'Bị trứng rơi trúng hết tim rồi, chơi lại nhé!'));
  }
  els.overlay.classList.remove('hidden');
}

function startLevel() {
  els.overlay.classList.add('hidden');
  state.game = makeLevel(state.level, Math.random);
  state.bursts = [];
  state.startedAt = Date.now();
  state.last = performance.now();
  updateHud();
  state.raf = requestAnimationFrame(loop);
}

/* ===== Điều khiển: kéo tay lái máy bay ===== */

function posX(e) {
  const rect = els.canvas.getBoundingClientRect();
  return ((e.clientX - rect.left) / rect.width) * FIELD_W;
}
let dragging = false;
els.wrap.addEventListener('pointerdown', (e) => { dragging = true; if (state.game) movePlane(state.game, posX(e) - state.game.plane.x); });
els.wrap.addEventListener('pointermove', (e) => { if (dragging && state.game) movePlane(state.game, posX(e) - state.game.plane.x); });
els.wrap.addEventListener('pointerup', () => { dragging = false; });
els.wrap.addEventListener('pointercancel', () => { dragging = false; });
document.addEventListener('keydown', (e) => {
  if (!state.game || state.game.over) return;
  if (e.key === 'ArrowLeft' || e.key === 'a') movePlane(state.game, -24);
  else if (e.key === 'ArrowRight' || e.key === 'd') movePlane(state.game, 24);
});

/* ===== Nút ===== */

els.btnPlay.addEventListener('click', () => {
  sfx.select();
  if (state.game && state.game.won) state.level++;
  else if (state.game && state.game.over) state.level = 0;
  startLevel();
});
els.btnNew.addEventListener('click', () => { sfx.shuffle(); state.level = 0; startLevel(); });
els.btnHelp.addEventListener('click', () => { sfx.select(); speak(state.instruction); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
sayInstruction(t('gavutru.help', 'Đàn gà cưỡi đĩa bay đang xếp đội hình thả trứng xuống — kéo tay để máy bay né trứng, súng tự bắn giúp bé rồi! Nhặt ngôi sao để súng lên tới ba nòng. Hạ hết đàn gà thì gà chúa khổng lồ xuất hiện đấy!'));
state.game = makeLevel(0, Math.random);
updateHud();
draw(1);

// Hook cho e2e test
window.__gavutru = { state, startLevel };

mountKidFeatures(); // thanh avatar bé + huy hiệu sao header + kiểm tra giới hạn phút/ngày (áp dụng cho mọi game, kể cả game giải trí thuần)
