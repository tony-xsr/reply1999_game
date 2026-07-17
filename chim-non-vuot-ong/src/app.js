// Điều phối Chim Non Vượt Ống: chạm bất kỳ đâu để vỗ cánh, chim + ống + nền tự vẽ canvas,
// mỗi 5 ống có 1 chữ cái trong khe — bay qua thì đọc to để bé vừa chơi vừa học mặt chữ.

import {
  FIELD_W, FIELD_H, GROUND_H, BIRD_X, BIRD_R,
  makeGame, flap, stepGame,
} from './chimnon.js';
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
  hudScore: $('hudScore'), hudBest: $('hudBest'),
  overlay: $('overlay'), ovEmoji: $('ovEmoji'), ovText: $('ovText'), btnPlay: $('btnPlay'),
};
const ctx = els.canvas.getContext('2d');

const BEST_KEY = 'chimnon.best';
const state = {
  game: null, raf: 0, last: 0, startedAt: Date.now(), instruction: '',
  scroll: 0, // cuộn nền + mặt đất
  best: Number(localStorage.getItem(BEST_KEY) || 0),
};
bindMute(() => sfx.muted);

/** Đọc hướng dẫn + lưu lại để bấm ❓ nghe lại được (bé chưa đọc chữ vẫn chơi được). */
function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

/* ===== Vẽ (toàn bộ tự vẽ canvas — không asset ngoài) ===== */

function drawBackground() {
  const sky = ctx.createLinearGradient(0, 0, 0, FIELD_H);
  sky.addColorStop(0, '#8fd3f4');
  sky.addColorStop(1, '#d8f0e0');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);

  // mây tròn trôi chậm (parallax lớp xa)
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  for (let i = 0; i < 4; i++) {
    const x = ((i * 170 - state.scroll * 0.3) % (FIELD_W + 160) + FIELD_W + 160) % (FIELD_W + 160) - 80;
    const y = 70 + (i % 2) * 90;
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.arc(x + 24, y - 10, 18, 0, Math.PI * 2);
    ctx.arc(x + 46, y, 20, 0, Math.PI * 2);
    ctx.fill();
  }

  // đồi xa (parallax lớp giữa)
  ctx.fillStyle = '#b5e0b0';
  for (let i = 0; i < 5; i++) {
    const x = ((i * 200 - state.scroll * 0.6) % (FIELD_W + 240) + FIELD_W + 240) % (FIELD_W + 240) - 120;
    ctx.beginPath();
    ctx.arc(x, FIELD_H - GROUND_H + 40, 90, Math.PI, 0);
    ctx.fill();
  }
}

function drawPipes(game) {
  for (const p of game.pipes) {
    const gapTop = p.gapY - p.gapH / 2;
    const gapBottom = p.gapY + p.gapH / 2;
    for (const [y, h, flip] of [[0, gapTop, true], [gapBottom, FIELD_H - GROUND_H - gapBottom, false]]) {
      const grad = ctx.createLinearGradient(p.x, 0, p.x + 70, 0);
      grad.addColorStop(0, '#5cb85c');
      grad.addColorStop(0.45, '#8fdc7f');
      grad.addColorStop(1, '#3e8e41');
      ctx.fillStyle = grad;
      ctx.fillRect(p.x, y, 70, h);
      // miệng ống
      const lipY = flip ? gapTop - 26 : gapBottom;
      ctx.fillRect(p.x - 5, lipY, 80, 26);
      ctx.strokeStyle = 'rgba(0,0,0,0.25)';
      ctx.lineWidth = 2;
      ctx.strokeRect(p.x - 5, lipY, 80, 26);
    }
    // chữ cái học trong khe
    if (p.letter && !p.passed) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.strokeStyle = '#e8a000';
      ctx.lineWidth = 3;
      ctx.font = '900 44px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeText(p.letter, p.x + 35, p.gapY);
      ctx.fillText(p.letter, p.x + 35, p.gapY);
    }
  }
}

function drawGround() {
  ctx.fillStyle = '#d9b45c';
  ctx.fillRect(0, FIELD_H - GROUND_H, FIELD_W, GROUND_H);
  ctx.fillStyle = '#8bc34a';
  ctx.fillRect(0, FIELD_H - GROUND_H, FIELD_W, 14);
  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  for (let i = -1; i < 9; i++) {
    const x = ((i * 64 - state.scroll * 2.5) % (FIELD_W + 64) + FIELD_W + 64) % (FIELD_W + 64) - 32;
    ctx.fillRect(x, FIELD_H - GROUND_H + 20, 32, 10);
  }
}

function drawBird(game, now) {
  const b = game.bird;
  const tilt = game.started ? Math.max(-0.5, Math.min(0.9, b.vy * 0.07)) : 0;
  const hover = game.started ? 0 : Math.sin(now / 300) * 6;
  ctx.save();
  ctx.translate(BIRD_X, b.y + hover);
  ctx.rotate(tilt);
  // thân
  const grad = ctx.createRadialGradient(-4, -5, 3, 0, 0, BIRD_R + 3);
  grad.addColorStop(0, '#ffe082');
  grad.addColorStop(1, '#f9a825');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(0, 0, BIRD_R + 2, BIRD_R, 0, 0, Math.PI * 2);
  ctx.fill();
  // cánh vỗ theo vận tốc
  const wingUp = game.started ? (b.vy < 0 ? -6 : 4) : Math.sin(now / 120) * 5;
  ctx.fillStyle = '#f57f17';
  ctx.beginPath();
  ctx.ellipse(-4, wingUp, 10, 6, -0.4, 0, Math.PI * 2);
  ctx.fill();
  // mắt + mỏ
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(7, -5, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#241e2e';
  ctx.beginPath(); ctx.arc(9, -5, 2.6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ef6c00';
  ctx.beginPath();
  ctx.moveTo(BIRD_R, -2); ctx.lineTo(BIRD_R + 10, 2); ctx.lineTo(BIRD_R, 6);
  ctx.closePath(); ctx.fill();
  ctx.restore();
}

function draw(now) {
  drawBackground();
  const g = state.game;
  if (g) drawPipes(g);
  drawGround();
  if (g) drawBird(g, now);
  if (g && !g.started && !g.over) {
    ctx.fillStyle = 'rgba(36, 30, 46, 0.75)';
    ctx.font = '900 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(t('chimnon.tap', 'Chạm để bay!'), FIELD_W / 2, FIELD_H * 0.62);
  }
}

/* ===== HUD & vòng lặp ===== */

function updateHud() {
  els.hudScore.textContent = state.game ? state.game.score : 0;
  els.hudBest.textContent = state.best;
}

function loop(now) {
  const dtMs = Math.min(50, now - state.last);
  state.last = now;
  const g = state.game;
  if (g.started && !g.over) state.scroll += dtMs / 16.67;
  const ev = stepGame(g, dtMs, Math.random);
  if (ev.passed) {
    sfx.match(2);
    if (ev.letter) speak(ev.letter);
  }
  updateHud();
  draw(now);
  if (g.over) return endGame();
  state.raf = requestAnimationFrame(loop);
}

function endGame() {
  cancelAnimationFrame(state.raf);
  const g = state.game;
  sfx.gameOver();
  const isBest = g.score > state.best;
  if (isBest) {
    state.best = g.score;
    localStorage.setItem(BEST_KEY, String(state.best));
  }
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'chimnon',
    result: 'quit',
    score: g.score,
    level: 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  els.ovEmoji.textContent = isBest ? '🏆' : '🐤';
  els.ovText.textContent = isBest
    ? `${t('chimnon.best', 'Kỷ lục mới!')}\n⭐ ${g.score}`
    : `${t('chimnon.end', 'Chim ngã rồi!')}\n⭐ ${g.score} · 🏆 ${state.best}`;
  els.btnPlay.textContent = t('ran.retry', 'CHƠI LẠI ▶');
  speak(isBest ? t('chimnon.best', 'Kỷ lục mới!') : t('chimnon.end', 'Chim ngã rồi, chơi lại nhé!'));
  updateHud();
  els.overlay.classList.remove('hidden');
}

function startGame() {
  els.overlay.classList.add('hidden');
  state.game = makeGame(Math.random);
  state.scroll = 0;
  state.startedAt = Date.now();
  state.last = performance.now();
  updateHud();
  state.raf = requestAnimationFrame(loop);
}

/* ===== Điều khiển: chạm bất kỳ đâu trong sân ===== */

els.wrap.addEventListener('pointerdown', () => {
  if (!state.game || state.game.over) return;
  if (flap(state.game)) sfx.select();
});
document.addEventListener('keydown', (e) => {
  if (e.code !== 'Space' && e.key !== 'ArrowUp') return;
  e.preventDefault();
  const playing = els.overlay.classList.contains('hidden');
  if (playing && state.game && !state.game.over && flap(state.game)) sfx.select();
});

/* ===== Nút ===== */

els.btnPlay.addEventListener('click', () => { sfx.select(); startGame(); });
els.btnNew.addEventListener('click', () => { sfx.shuffle(); startGame(); });
els.btnHelp.addEventListener('click', () => { sfx.select(); speak(state.instruction); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
sayInstruction(t('chimnon.help', 'Chạm màn hình để chim vỗ cánh bay lên, thả tay thì chim rơi xuống — bay lọt qua khe giữa hai ống nhé! Mỗi năm ống có một chữ cái, bay qua sẽ được nghe đọc chữ đó!'));
state.game = makeGame(Math.random);
updateHud();
draw(performance.now());

// Hook cho e2e test
window.__chimnon = { state, startGame };
