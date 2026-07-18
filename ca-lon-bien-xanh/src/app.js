// Điều phối Cá Lớn Biển Xanh: vẽ đáy biển, cá bơi theo ngón tay, ăn cá nhỏ né cá to.

import {
  FIELD_W, FIELD_H, START_LIVES, GROW_NEED, radiusOf, playerSize,
  makeLevel, movePlayer, stepGame,
} from './calon.js';
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
  hudScore: $('hudScore'), hudGrow: $('hudGrow'), hudLives: $('hudLives'), hudLevel: $('hudLevel'),
  overlay: $('overlay'), ovEmoji: $('ovEmoji'), ovText: $('ovText'), btnPlay: $('btnPlay'),
};
const ctx = els.canvas.getContext('2d');

/* ===== Sprite Kenney Fish Pack (CC0 — xem images/CREDITS.md) ===== */
const SIZE_SPRITE = { 1: 'fish_grey', 2: 'fish_green', 3: 'fish_pink', 4: 'fish_red', 5: 'fish_grey_long_a' };
const IMAGES = {};
for (const name of [
  'fish_orange', 'fish_grey', 'fish_green', 'fish_pink', 'fish_red', 'fish_brown', 'fish_grey_long_a',
  'bubble_a', 'bubble_b', 'background_seaweed_a', 'background_seaweed_c', 'background_seaweed_e', 'background_rock_a',
]) {
  const img = new Image();
  img.src = `images/${name}.png`;
  IMAGES[name] = img;
}
/** Vẽ cá: sprite gốc quay mặt TRÁI — bơi sang phải thì lật ngang. */
function drawFish(name, x, y, r, facingRight, alpha = 1) {
  const img = IMAGES[name];
  if (!img.complete || img.naturalWidth === 0) return;
  const s = r * 2.5;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  if (facingRight) ctx.scale(-1, 1);
  ctx.drawImage(img, -s / 2, -s / 2, s, s);
  ctx.restore();
}

const state = {
  level: 0, game: null, raf: 0, last: 0, startedAt: Date.now(), instruction: '',
  target: { x: FIELD_W / 2, y: FIELD_H / 2 },
  facingRight: true,
  bubbles: [], // bong bóng trang trí nổi lên
  rings: [], // vòng sáng khi lớn lên
};
bindMute(() => sfx.muted);

/** Đọc hướng dẫn + lưu lại để bấm ❓ nghe lại được (bé chưa đọc chữ vẫn chơi được). */
function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

/* ===== Vẽ ===== */

function drawBackground(now) {
  const sea = ctx.createLinearGradient(0, 0, 0, FIELD_H);
  sea.addColorStop(0, '#7fd0f0');
  sea.addColorStop(0.6, '#3a9fd6');
  sea.addColorStop(1, '#1e6fa8');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);

  // tia nắng xuyên nước
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 3; i++) {
    const x = 140 + i * 300 + Math.sin(now / 3000 + i) * 30;
    ctx.beginPath();
    ctx.moveTo(x, 0); ctx.lineTo(x + 110, 0); ctx.lineTo(x + 40, FIELD_H); ctx.lineTo(x - 40, FIELD_H);
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();

  // đáy cát + rong + đá
  ctx.fillStyle = '#d9b45c';
  ctx.beginPath();
  ctx.moveTo(0, FIELD_H);
  ctx.lineTo(0, FIELD_H - 34);
  ctx.quadraticCurveTo(FIELD_W / 2, FIELD_H - 62, FIELD_W, FIELD_H - 30);
  ctx.lineTo(FIELD_W, FIELD_H);
  ctx.closePath(); ctx.fill();
  const deco = [
    ['background_seaweed_a', 70, 74], ['background_seaweed_c', 320, 88], ['background_rock_a', 500, 56],
    ['background_seaweed_e', 700, 80], ['background_seaweed_c', 880, 66],
  ];
  for (const [name, x, size] of deco) {
    const img = IMAGES[name];
    if (img.complete && img.naturalWidth) ctx.drawImage(img, x - size / 2, FIELD_H - 30 - size, size, size);
  }

  // bong bóng nổi lên
  if (Math.random() < 0.05) {
    state.bubbles.push({ x: 30 + Math.random() * (FIELD_W - 60), y: FIELD_H - 20, r: 5 + Math.random() * 10, v: 0.6 + Math.random() });
  }
  ctx.globalAlpha = 0.6;
  for (const b of state.bubbles) {
    b.y -= b.v * 1.6;
    const img = IMAGES[b.r > 10 ? 'bubble_a' : 'bubble_b'];
    if (img.complete && img.naturalWidth) ctx.drawImage(img, b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
  }
  ctx.globalAlpha = 1;
  state.bubbles = state.bubbles.filter((b) => b.y > -20);
}

function draw(now) {
  drawBackground(now);
  const g = state.game;
  if (!g) return;

  for (const f of g.fish) {
    drawFish(SIZE_SPRITE[f.size] || 'fish_brown', f.x, f.y, radiusOf(f.size), f.vx > 0);
  }

  // vòng sáng khi lớn lên
  for (const ring of state.rings) {
    ring.r += 3;
    ring.life -= 1;
    ctx.strokeStyle = `rgba(255, 240, 150, ${Math.max(0, ring.life / 30)})`;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2);
    ctx.stroke();
  }
  state.rings = state.rings.filter((r2) => r2.life > 0);

  const p = g.player;
  const blink = p.invincibleMs > 0 ? (Math.floor(now / 120) % 2 ? 0.35 : 0.8) : 1;
  drawFish('fish_orange', p.x, p.y, radiusOf(playerSize(p.stage)), state.facingRight, blink);
}

/* ===== HUD ===== */

function updateHud() {
  const g = state.game;
  els.hudScore.textContent = g.score;
  els.hudGrow.textContent = g.player.stage >= GROW_NEED.length
    ? '🏆' : `${g.player.eaten}/${GROW_NEED[g.player.stage]}`;
  els.hudLives.textContent = '❤️'.repeat(Math.max(0, g.lives)) + '🖤'.repeat(START_LIVES - Math.max(0, g.lives));
  els.hudLevel.textContent = `${t('daovang.level', 'Màn')} ${g.level + 1}`;
}

/* ===== Vòng lặp ===== */

function loop(now) {
  const dtMs = Math.min(50, now - state.last);
  state.last = now;
  const g = state.game;

  const beforeX = g.player.x;
  movePlayer(g, state.target.x, state.target.y, dtMs);
  if (Math.abs(g.player.x - beforeX) > 0.3) state.facingRight = g.player.x > beforeX;

  const ev = stepGame(g, dtMs, Math.random);
  if (ev.ate > 0) sfx.match(2);
  if (ev.hit) sfx.fail();
  if (ev.grew) {
    sfx.levelWin();
    state.rings.push({ x: g.player.x, y: g.player.y, r: radiusOf(playerSize(g.player.stage)), life: 30 });
    speak(t('calon.grew', 'Lớn lên rồi!'));
  }
  updateHud();
  draw(now);
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
    mode: 'calon',
    result: g.won ? 'win' : 'quit',
    score: g.score,
    level: g.level + 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  if (g.won) {
    sfx.levelWin();
    confetti();
    els.ovEmoji.textContent = '🐋';
    els.ovText.textContent = `${t('calon.win', 'Thành cá lớn nhất biển rồi!')}\n⭐ ${g.score}`;
    els.btnPlay.textContent = t('calon.next', 'MÀN TIẾP ▶');
    speak(t('calon.win', 'Thành cá lớn nhất biển rồi!'));
  } else {
    sfx.gameOver();
    els.ovEmoji.textContent = '🫧';
    els.ovText.textContent = `${t('calon.lose', 'Hết tim mất rồi!')}\n⭐ ${g.score}`;
    els.btnPlay.textContent = t('ran.retry', 'CHƠI LẠI ▶');
    speak(t('calon.lose', 'Hết tim mất rồi, chơi lại nhé!'));
  }
  els.overlay.classList.remove('hidden');
}

function startLevel() {
  els.overlay.classList.add('hidden');
  state.game = makeLevel(state.level, Math.random);
  state.target = { x: FIELD_W / 2, y: FIELD_H / 2 };
  state.rings = [];
  state.startedAt = Date.now();
  state.last = performance.now();
  updateHud();
  state.raf = requestAnimationFrame(loop);
}

/* ===== Điều khiển: cá bơi về phía ngón tay ===== */

function fieldPos(e) {
  const rect = els.canvas.getBoundingClientRect();
  return {
    x: ((e.clientX - rect.left) / rect.width) * FIELD_W,
    y: ((e.clientY - rect.top) / rect.height) * FIELD_H,
  };
}

let touching = false;
els.wrap.addEventListener('pointerdown', (e) => { touching = true; state.target = fieldPos(e); });
els.wrap.addEventListener('pointermove', (e) => { if (touching) state.target = fieldPos(e); });
els.wrap.addEventListener('pointerup', () => { touching = false; });
els.wrap.addEventListener('pointercancel', () => { touching = false; });

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
sayInstruction(t('calon.help', 'Đặt ngón tay vào màn hình để cá bơi theo — chỉ ăn được cá NHỎ hơn mình thôi, gặp cá to hơn thì bơi tránh xa nhé! Ăn đủ cá sẽ lớn lên, lớn đủ ba lần là thắng!'));
draw(performance.now());

// Hook cho e2e test
window.__calon = { state, startLevel };

mountKidFeatures(); // thanh avatar bé + huy hiệu sao header + kiểm tra giới hạn phút/ngày (áp dụng cho mọi game, kể cả game giải trí thuần)
