// Điều phối Phi Đội Nhí: vẽ canvas, kéo tay lái máy bay, tự động bắn, né/bắn vật cản.

import {
  FIELD_W, FIELD_H, PLANE_Y, PLANE_R, START_LIVES, OBSTACLE_TYPES,
  makeLevel, movePlane, fireBullet, stepGame,
} from './phidoinhi.js';
import { speak, bindMute } from '../../to-mau/src/speech.js';
import { sfx } from '../../pokemon/src/sfx.js';
import { currentProfile, recordSession } from '../../pokemon/src/stats.js';

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

const OBSTACLE_ICON = { meteor: '🌑', wasp: '🐝', cloud: '🌩️', boss: '☄️' };

const state = {
  level: 0, game: null, raf: 0, last: 0, startedAt: Date.now(), instruction: '', skyOffset: 0,
};
bindMute(() => sfx.muted);

/** Đọc hướng dẫn + lưu lại để bấm ❓ nghe lại được (bé chưa đọc chữ vẫn chơi được). */
function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

/* ===== Vẽ ===== */

function draw() {
  const g = state.game;
  // trời cuộn 2 lớp mây nhẹ
  const sky = ctx.createLinearGradient(0, 0, 0, FIELD_H);
  sky.addColorStop(0, '#8ec9ef');
  sky.addColorStop(1, '#cfe9fa');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);
  ctx.font = '46px sans-serif';
  ctx.textAlign = 'center';
  ctx.globalAlpha = 0.55;
  for (let i = 0; i < 4; i++) {
    const y = ((state.skyOffset * 0.6 + i * 190) % (FIELD_H + 100)) - 50;
    ctx.fillText('☁️', 90 + (i % 2) * 420, y);
  }
  ctx.globalAlpha = 1;
  if (!g) return;

  // vật phẩm thưởng
  ctx.font = '30px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const p of g.powerups) ctx.fillText('⭐', p.x, p.y);

  // đạn
  ctx.fillStyle = '#ffd93d';
  for (const b of g.bullets) {
    ctx.beginPath();
    ctx.arc(b.x, b.y, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // vật cản
  for (const o of g.obstacles) {
    ctx.font = `${o.r * 1.8}px sans-serif`;
    ctx.fillText(OBSTACLE_ICON[o.type], o.x, o.y);
  }

  // máy bay
  ctx.font = '44px sans-serif';
  ctx.fillText('✈️', g.plane.x, PLANE_Y);
}

/* ===== HUD ===== */

function updateHud() {
  const g = state.game;
  els.hudScore.textContent = g.score;
  els.hudLives.textContent = '❤️'.repeat(Math.max(0, g.lives)) + '🖤'.repeat(START_LIVES - Math.max(0, g.lives));
  els.hudLevel.textContent = `${t('daovang.level', 'Màn')} ${g.level + 1}`;
}

/* ===== Vòng lặp ===== */

function loop(now) {
  const dt = Math.min(50, now - state.last);
  state.last = now;
  state.skyOffset += dt * 0.05;
  const g = state.game;
  const livesBefore = g.lives;
  const scoreBefore = g.score;
  fireBullet(g);
  stepGame(g, dt, Math.random);
  if (g.lives < livesBefore) sfx.fail();
  else if (g.score > scoreBefore) sfx.match(2);
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
    mode: 'phidoinhi',
    result: g.won ? 'win' : 'quit',
    score: g.score,
    level: g.level + 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  if (g.won) {
    sfx.levelWin();
    confetti();
    els.ovEmoji.textContent = '🏆';
    els.ovText.textContent = `${t('phinhi.win', 'Bay qua màn rồi!')}\n⭐ ${g.score}`;
    els.btnPlay.textContent = t('phinhi.next', 'MÀN TIẾP ▶');
    speak(t('phinhi.win', 'Bay qua màn rồi!'));
  } else {
    sfx.gameOver();
    els.ovEmoji.textContent = '💥';
    els.ovText.textContent = `${t('phinhi.lose', 'Máy bay hết xăng rồi!')}\n⭐ ${g.score}`;
    els.btnPlay.textContent = t('ran.retry', 'CHƠI LẠI ▶');
    speak(t('phinhi.lose', 'Máy bay hết xăng rồi, chơi lại nhé!'));
  }
  els.overlay.classList.remove('hidden');
}

function startLevel() {
  els.overlay.classList.add('hidden');
  state.game = makeLevel(state.level, Math.random);
  state.startedAt = Date.now();
  state.last = performance.now();
  updateHud();
  draw();
  state.raf = requestAnimationFrame(loop);
}

/* ===== Điều khiển: kéo tay lái máy bay trái/phải ===== */

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
  else state.level = 0;
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
sayInstruction(t('phinhi.help', 'Kéo tay để máy bay bay trái phải né thiên thạch — máy bay tự động bắn giúp bé rồi, cứ nhặt sao vàng để được thêm điểm nhé!'));
draw();

// Hook cho e2e test
window.__phinhi = { state, startLevel, movePlane: (dx) => state.game && movePlane(state.game, dx) };
