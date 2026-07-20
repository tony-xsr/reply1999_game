// Điều phối Nhà Thám Hiểm Tí Hon: camera cuộn ngang, nút ◀▶ + NHẢY kiểu console cầm tay,
// sprite nhân vật/quái/đất từ Kenney Pixel Platformer (CC0), xu + cờ tự vẽ canvas.

import {
  TILE, VIEW_W, VIEW_H, START_LIVES, PLAYER_W, PLAYER_H, ENEMY_W, ENEMY_H, LEVELS,
  makeLevel, stepGame,
} from './thamhiem.js';
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
  padLeft: $('padLeft'), padRight: $('padRight'), padJump: $('padJump'),
  btnNew: $('btnNew'), btnHelp: $('btnHelp'), btnSound: $('btnSound'),
  hudScore: $('hudScore'), hudCoins: $('hudCoins'), hudLives: $('hudLives'), hudLevel: $('hudLevel'),
  overlay: $('overlay'), ovEmoji: $('ovEmoji'), ovText: $('ovText'), btnPlay: $('btnPlay'),
};
const ctx = els.canvas.getContext('2d');
ctx.imageSmoothingEnabled = false; // pixel-art giữ nét vuông

/* ===== Sprite Kenney Pixel Platformer (CC0 — xem images/CREDITS.md) ===== */
const IMAGES = {};
for (const name of ['hero_a', 'hero_b', 'enemy_a', 'enemy_b', 'grass', 'dirt']) {
  const img = new Image();
  img.src = `images/${name}.png`;
  IMAGES[name] = img;
}
function drawSprite(name, cx, cy, w, h, flip = false) {
  const img = IMAGES[name];
  if (!img.complete || img.naturalWidth === 0) return;
  ctx.save();
  ctx.translate(cx, cy);
  if (flip) ctx.scale(-1, 1);
  ctx.drawImage(img, -w / 2, -h / 2, w, h);
  ctx.restore();
}

const state = {
  level: 0, game: null, raf: 0, last: 0, startedAt: Date.now(), instruction: '',
  input: { left: false, right: false, jump: false },
  camX: 0,
  walkT: 0, // pha bước chân để đảo 2 khung hình
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
  sky.addColorStop(0, '#8fd3f4');
  sky.addColorStop(1, '#e6f6d8');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  for (let i = 0; i < 4; i++) {
    const x = ((i * 220 - state.camX * 0.25) % (VIEW_W + 260) + VIEW_W + 260) % (VIEW_W + 260) - 130;
    const y = 56 + (i % 2) * 60;
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.arc(x + 22, y - 8, 14, 0, Math.PI * 2);
    ctx.arc(x + 42, y, 16, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = 'rgba(130, 190, 110, 0.45)';
  for (let i = 0; i < 6; i++) {
    const x = ((i * 240 - state.camX * 0.5) % (VIEW_W + 300) + VIEW_W + 300) % (VIEW_W + 300) - 150;
    ctx.beginPath();
    ctx.arc(x, VIEW_H + 20, 110, Math.PI, 0);
    ctx.fill();
  }
}

function drawTile(game, ch, tx, ty) {
  const px = tx * TILE - state.camX;
  const py = ty * TILE;
  if (ch === '#') {
    // ô trên cùng của cột đất dùng sprite cỏ, bên dưới dùng đất
    const isTop = ty === 0 || game.tiles[ty - 1][tx] !== '#';
    const img = IMAGES[isTop ? 'grass' : 'dirt'];
    if (img.complete && img.naturalWidth) ctx.drawImage(img, px, py, TILE, TILE);
  } else if (ch === 'c') {
    const bob = Math.sin(performance.now() / 300 + tx) * 3;
    const cx = px + TILE / 2;
    const cy = py + TILE / 2 + bob;
    const grad = ctx.createRadialGradient(cx - 3, cy - 4, 2, cx, cy, 11);
    grad.addColorStop(0, '#ffe082');
    grad.addColorStop(1, '#e8a000');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(140, 90, 0, 0.7)';
    ctx.lineWidth = 2;
    ctx.stroke();
  } else if (ch === 'F') {
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(px + 12, py - TILE, 5, TILE * 2);
    ctx.fillStyle = '#e53935';
    ctx.beginPath();
    ctx.moveTo(px + 17, py - TILE);
    ctx.lineTo(px + TILE + 8, py - TILE + 11);
    ctx.lineTo(px + 17, py - TILE + 22);
    ctx.closePath();
    ctx.fill();
  }
}

function draw() {
  drawBackground();
  const g = state.game;
  if (!g) return;
  const tx0 = Math.max(0, Math.floor(state.camX / TILE));
  const tx1 = Math.min(g.cols - 1, Math.ceil((state.camX + VIEW_W) / TILE));
  for (let r = 0; r < g.rows; r++) {
    for (let c = tx0; c <= tx1; c++) {
      if (g.tiles[r][c] !== '.') drawTile(g, g.tiles[r][c], c, r);
    }
  }
  for (const e of g.enemies) {
    if (e.dead) continue;
    const frame = Math.floor(performance.now() / 220) % 2 ? 'enemy_a' : 'enemy_b';
    drawSprite(frame, e.x - state.camX, e.y, ENEMY_W + 6, ENEMY_H + 6, e.vx > 0);
  }
  for (const s of state.sparkles) {
    s.y -= 1.4;
    s.life -= 1;
    ctx.globalAlpha = Math.max(0, s.life / 25);
    ctx.fillStyle = '#ffd93d';
    ctx.beginPath();
    ctx.arc(s.x - state.camX, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  state.sparkles = state.sparkles.filter((s) => s.life > 0);
  const p = g.player;
  const moving = Math.abs(p.vx) > 0.4 && p.grounded;
  const frame = moving && Math.floor(state.walkT / 8) % 2 ? 'hero_b' : 'hero_a';
  drawSprite(frame, p.x - state.camX, p.y, PLAYER_W + 8, PLAYER_H + 6, p.facing < 0);
}

/* ===== HUD & vòng lặp ===== */

function updateHud() {
  const g = state.game;
  els.hudScore.textContent = g.score;
  els.hudCoins.textContent = `${g.coinsGot}/${g.coinsTotal}`;
  els.hudLives.textContent = '❤️'.repeat(Math.max(0, g.lives)) + '🖤'.repeat(START_LIVES - Math.max(0, g.lives));
  els.hudLevel.textContent = `${t('daovang.level', 'Màn')} ${g.level + 1}`;
}

function loop(now) {
  const dtMs = Math.min(50, now - state.last);
  state.last = now;
  const g = state.game;
  const ev = stepGame(g, state.input, dtMs);
  if (Math.abs(g.player.vx) > 0.4) state.walkT += dtMs / 16.67;
  if (ev.jumped) sfx.select();
  if (ev.coin) {
    sfx.match(2);
    for (let i = 0; i < 5; i++) {
      state.sparkles.push({
        x: g.player.x + (Math.random() - 0.5) * 24, y: g.player.y - 10,
        r: 2.5 + Math.random() * 3, life: 25,
      });
    }
  }
  if (ev.stomp) sfx.match(3);
  if (ev.hurt) sfx.fail();

  const target = g.player.x - VIEW_W / 2;
  state.camX = Math.max(0, Math.min(Math.max(0, g.cols * TILE - VIEW_W), target));

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
    mode: 'thamhiem',
    result: g.won ? 'win' : 'quit',
    score: g.score,
    level: g.level + 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  if (g.won) {
    sfx.levelWin();
    confetti();
    els.ovEmoji.textContent = '🏁';
    els.ovText.textContent = `${t('thamhiem.win', 'Tới cờ đích rồi!')}\n⭐ ${g.score} · 🪙 ${g.coinsGot}/${g.coinsTotal}`;
    els.btnPlay.textContent = t('thamhiem.next', 'MÀN TIẾP ▶');
    speak(t('thamhiem.win', 'Tới cờ đích rồi!'));
  } else {
    sfx.gameOver();
    els.ovEmoji.textContent = '😵';
    els.ovText.textContent = `${t('thamhiem.lose', 'Hết tim mất rồi!')}\n⭐ ${g.score}`;
    els.btnPlay.textContent = t('ran.retry', 'CHƠI LẠI ▶');
    speak(t('thamhiem.lose', 'Hết tim mất rồi, chơi lại nhé!'));
  }
  els.overlay.classList.remove('hidden');
}

function startLevel() {
  els.overlay.classList.add('hidden');
  state.game = makeLevel(state.level);
  state.camX = 0;
  state.sparkles = [];
  state.input = { left: false, right: false, jump: false };
  state.startedAt = Date.now();
  state.last = performance.now();
  updateHud();
  state.raf = requestAnimationFrame(loop);
}

/* ===== Điều khiển: ◀▶ + NHẢY (đa điểm chạm) + bàn phím desktop ===== */

function bindPad(btn, key) {
  btn.addEventListener('pointerdown', (e) => { e.preventDefault(); state.input[key] = true; });
  btn.addEventListener('pointerup', () => { state.input[key] = false; });
  btn.addEventListener('pointercancel', () => { state.input[key] = false; });
  btn.addEventListener('pointerleave', () => { state.input[key] = false; });
}
bindPad(els.padLeft, 'left');
bindPad(els.padRight, 'right');
bindPad(els.padJump, 'jump');

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'a') state.input.left = true;
  else if (e.key === 'ArrowRight' || e.key === 'd') state.input.right = true;
  else if (e.code === 'Space' || e.key === 'ArrowUp' || e.key === 'w') { e.preventDefault(); state.input.jump = true; }
});
document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'a') state.input.left = false;
  else if (e.key === 'ArrowRight' || e.key === 'd') state.input.right = false;
  else if (e.code === 'Space' || e.key === 'ArrowUp' || e.key === 'w') state.input.jump = false;
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
sayInstruction(t('thamhiem.help', 'Bấm hai nút mũi tên để chạy, nút to bên phải để nhảy! Nhảy dậm lên ĐẦU quái thì thắng nó, đụng ngang hông là bị đau đấy. Ăn xu vàng, né hố sâu, chạm lá cờ để qua màn nhé!'));
state.game = makeLevel(0);
updateHud();
draw();

// Hook cho e2e test
window.__thamhiem = { state, startLevel };

mountKidFeatures(); // thanh avatar bé + huy hiệu sao header + kiểm tra giới hạn phút/ngày (áp dụng cho mọi game, kể cả game giải trí thuần)
