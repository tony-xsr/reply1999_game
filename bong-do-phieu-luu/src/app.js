// Điều phối Bóng Đỏ Phiêu Lưu: camera cuộn ngang theo bóng, 2 nút lái ◀▶ cho tablet
// (bàn phím là phụ trợ desktop), toàn bộ hình vẽ canvas — không asset ngoài.

import {
  TILE, VIEW_W, VIEW_H, START_LIVES, LEVELS,
  radiusOf, makeLevel, stepGame,
} from './bongdo.js';
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
  padLeft: $('padLeft'), padRight: $('padRight'),
  btnNew: $('btnNew'), btnHelp: $('btnHelp'), btnSound: $('btnSound'),
  hudScore: $('hudScore'), hudRings: $('hudRings'), hudLives: $('hudLives'), hudLevel: $('hudLevel'),
  overlay: $('overlay'), ovEmoji: $('ovEmoji'), ovText: $('ovText'), btnPlay: $('btnPlay'),
};
const ctx = els.canvas.getContext('2d');

const state = {
  level: 0, game: null, raf: 0, last: 0, startedAt: Date.now(), instruction: '',
  input: { left: false, right: false },
  camX: 0,
  spin: 0, // góc lăn của bóng (trang trí)
  sparkles: [],
};
bindMute(() => sfx.muted);

/** Đọc hướng dẫn + lưu lại để bấm ❓ nghe lại được (bé chưa đọc chữ vẫn chơi được). */
function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

/* ===== Vẽ ===== */

function drawBackground() {
  const sky = ctx.createLinearGradient(0, 0, 0, VIEW_H);
  sky.addColorStop(0, '#9ad8f5');
  sky.addColorStop(1, '#e8f6d8');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  // đồi xa parallax
  ctx.fillStyle = 'rgba(140, 195, 120, 0.5)';
  for (let i = 0; i < 6; i++) {
    const x = ((i * 260 - state.camX * 0.4) % (VIEW_W + 320) + VIEW_W + 320) % (VIEW_W + 320) - 160;
    ctx.beginPath();
    ctx.arc(x, VIEW_H + 30, 130, Math.PI, 0);
    ctx.fill();
  }
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  for (let i = 0; i < 3; i++) {
    const x = ((i * 300 - state.camX * 0.2) % (VIEW_W + 200) + VIEW_W + 200) % (VIEW_W + 200) - 100;
    const y = 60 + i * 46;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.arc(x + 26, y - 8, 15, 0, Math.PI * 2);
    ctx.arc(x + 48, y, 17, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawTile(ch, px, py) {
  if (ch === '#') {
    ctx.fillStyle = '#a86a3d';
    ctx.fillRect(px, py, TILE, TILE);
    ctx.fillStyle = '#c98a55';
    ctx.fillRect(px + 2, py + 2, TILE - 4, 8);
    ctx.strokeStyle = 'rgba(0,0,0,0.18)';
    ctx.strokeRect(px + 0.5, py + 0.5, TILE - 1, TILE - 1);
  } else if (ch === '^') {
    ctx.fillStyle = '#8d8d8d';
    ctx.beginPath();
    ctx.moveTo(px + 2, py + TILE);
    ctx.lineTo(px + TILE / 4, py + 8);
    ctx.lineTo(px + TILE / 2, py + TILE);
    ctx.lineTo(px + TILE * 0.75, py + 8);
    ctx.lineTo(px + TILE - 2, py + TILE);
    ctx.closePath();
    ctx.fill();
  } else if (ch === 'o') {
    ctx.strokeStyle = '#f2b705';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(px + TILE / 2, py + TILE / 2, 11, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(px + TILE / 2, py + TILE / 2, 11, -1.2, 0.2);
    ctx.stroke();
  } else if (ch === '+' || ch === '-') {
    ctx.fillStyle = ch === '+' ? '#42a5f5' : '#ab47bc';
    ctx.beginPath();
    ctx.arc(px + TILE / 2, py + TILE / 2, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '900 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(ch, px + TILE / 2, py + TILE / 2 + 1);
  } else if (ch === 'F') {
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(px + 6, py - TILE + 6, 4, TILE * 2 - 6);
    ctx.fillStyle = '#e53935';
    ctx.beginPath();
    ctx.moveTo(px + 10, py - TILE + 6);
    ctx.lineTo(px + TILE + 2, py - TILE + 16);
    ctx.lineTo(px + 10, py - TILE + 26);
    ctx.closePath();
    ctx.fill();
  }
}

function drawBall(g) {
  const b = g.ball;
  const r = radiusOf(b);
  const px = b.x - state.camX;
  ctx.save();
  ctx.translate(px, b.y);
  ctx.rotate(state.spin);
  const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.15, 0, 0, r);
  grad.addColorStop(0, '#ff8a80');
  grad.addColorStop(1, '#c62828');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  // sọc lăn + ánh sáng
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.6, 0.4, 2.2);
  ctx.stroke();
  ctx.restore();
}

function draw() {
  drawBackground();
  const g = state.game;
  if (!g) return;
  const tx0 = Math.max(0, Math.floor(state.camX / TILE));
  const tx1 = Math.min(g.cols - 1, Math.ceil((state.camX + VIEW_W) / TILE));
  for (let r = 0; r < g.rows; r++) {
    for (let c = tx0; c <= tx1; c++) {
      const ch = g.tiles[r][c];
      if (ch !== '.') drawTile(ch, c * TILE - state.camX, r * TILE);
    }
  }
  // hạt lấp lánh khi nhặt vòng
  for (const s of state.sparkles) {
    s.y -= 1.5;
    s.life -= 1;
    ctx.globalAlpha = Math.max(0, s.life / 25);
    ctx.fillStyle = '#ffd93d';
    ctx.beginPath();
    ctx.arc(s.x - state.camX, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  state.sparkles = state.sparkles.filter((s) => s.life > 0);
  drawBall(g);
}

/* ===== HUD & vòng lặp ===== */

function updateHud() {
  const g = state.game;
  els.hudScore.textContent = g.score;
  els.hudRings.textContent = `${g.ringsTotal - g.ringsLeft}/${g.ringsTotal}`;
  els.hudLives.textContent = '❤️'.repeat(Math.max(0, g.lives)) + '🖤'.repeat(START_LIVES - Math.max(0, g.lives));
  els.hudLevel.textContent = `${t('daovang.level', 'Màn')} ${g.level + 1}`;
}

function loop(now) {
  const dtMs = Math.min(50, now - state.last);
  state.last = now;
  const g = state.game;
  const ev = stepGame(g, state.input, dtMs);
  state.spin += (g.ball.vx / radiusOf(g.ball)) * (dtMs / 16.67);
  if (ev.ring) {
    sfx.match(2);
    for (let i = 0; i < 6; i++) {
      state.sparkles.push({
        x: g.ball.x + (Math.random() - 0.5) * 30, y: g.ball.y + (Math.random() - 0.5) * 30,
        r: 3 + Math.random() * 3, life: 25,
      });
    }
  }
  if (ev.grew) { sfx.levelWin(); speak(t('bongdo.grew', 'Phồng to rồi!')); }
  if (ev.shrank) { sfx.select(); speak(t('bongdo.shrank', 'Xì nhỏ lại rồi!')); }
  if (ev.hurt) sfx.fail();

  // camera đuổi theo bóng, kẹp trong biên màn
  const target = g.ball.x - VIEW_W / 2;
  state.camX = Math.max(0, Math.min(g.cols * TILE - VIEW_W, target));

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
    mode: 'bongdo',
    result: g.won ? 'win' : 'quit',
    score: g.score,
    level: g.level + 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  if (g.won) {
    sfx.levelWin();
    confetti();
    els.ovEmoji.textContent = '🏁';
    els.ovText.textContent = `${t('bongdo.win', 'Tới cờ đích rồi!')}\n⭐ ${g.score}`;
    els.btnPlay.textContent = t('bongdo.next', 'MÀN TIẾP ▶');
    speak(t('bongdo.win', 'Tới cờ đích rồi!'));
  } else {
    sfx.gameOver();
    els.ovEmoji.textContent = '🫧';
    els.ovText.textContent = `${t('bongdo.lose', 'Bóng xẹp mất rồi!')}\n⭐ ${g.score}`;
    els.btnPlay.textContent = t('ran.retry', 'CHƠI LẠI ▶');
    speak(t('bongdo.lose', 'Bóng xẹp mất rồi, chơi lại nhé!'));
  }
  els.overlay.classList.remove('hidden');
}

function startLevel() {
  els.overlay.classList.add('hidden');
  state.game = makeLevel(state.level);
  state.camX = 0;
  state.sparkles = [];
  state.input = { left: false, right: false };
  state.startedAt = Date.now();
  state.last = performance.now();
  updateHud();
  state.raf = requestAnimationFrame(loop);
}

/* ===== Điều khiển: 2 nút ◀▶ (đa điểm chạm) + bàn phím desktop ===== */

function bindPad(btn, key) {
  btn.addEventListener('pointerdown', (e) => { e.preventDefault(); state.input[key] = true; });
  btn.addEventListener('pointerup', () => { state.input[key] = false; });
  btn.addEventListener('pointercancel', () => { state.input[key] = false; });
  btn.addEventListener('pointerleave', () => { state.input[key] = false; });
}
bindPad(els.padLeft, 'left');
bindPad(els.padRight, 'right');

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'a') state.input.left = true;
  else if (e.key === 'ArrowRight' || e.key === 'd') state.input.right = true;
});
document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'a') state.input.left = false;
  else if (e.key === 'ArrowRight' || e.key === 'd') state.input.right = false;
});

/* ===== Nút ===== */

els.btnPlay.addEventListener('click', () => {
  sfx.select();
  if (state.game && state.game.won) state.level = (state.level + 1) % LEVELS.length;
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
sayInstruction(t('bongdo.help', 'Bóng tự nảy liên tục — bé chỉ cần bấm hai nút để lái trái phải! Nhặt hết các vòng vàng rồi chạm lá cờ để qua màn. Bóng xanh phồng to nảy cao hơn, bóng tím xì nhỏ chui được đường hầm thấp. Cẩn thận gai nhọn và hố sâu nhé!'));
state.game = makeLevel(0);
updateHud();
draw();

// Hook cho e2e test
window.__bongdo = { state, startLevel };
