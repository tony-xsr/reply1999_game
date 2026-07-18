// Điều phối Hang Kim Cương Bí Ẩn: vuốt 4 hướng để đào từng bước, nhịp vật lý đá rơi
// chạy đều mỗi TICK_MS. Đá/kim cương dùng icon Twemoji tái dùng từ Đào Vàng (CC-BY),
// đất/tường/cửa/thợ mỏ tự vẽ canvas.

import {
  TILE, START_LIVES, TICK_MS, LEVELS,
  makeLevel, exitOpen, move, tickPhysics,
} from './hangkim.js';
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
  hudGems: $('hudGems'), hudLives: $('hudLives'), hudLevel: $('hudLevel'),
  overlay: $('overlay'), ovEmoji: $('ovEmoji'), ovText: $('ovText'), btnPlay: $('btnPlay'),
};
const ctx = els.canvas.getContext('2d');

const IMAGES = {};
for (const name of ['rock', 'gem']) {
  const img = new Image();
  img.src = `images/${name}.svg`;
  IMAGES[name] = img;
}

const state = {
  level: 0, game: null, raf: 0, last: 0, tickAcc: 0, startedAt: Date.now(), instruction: '',
  doorAnnounced: false,
};
bindMute(() => sfx.muted);

/** Đọc hướng dẫn + lưu lại để bấm ❓ nghe lại được (bé chưa đọc chữ vẫn chơi được). */
function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

/* ===== Vẽ (đất/tường/cửa/thợ mỏ tự vẽ) ===== */

function drawCell(game, ch, tx, ty) {
  const px = tx * TILE;
  const py = ty * TILE;
  if (ch === '#') {
    ctx.fillStyle = '#4a3a55';
    ctx.fillRect(px, py, TILE, TILE);
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fillRect(px + 2, py + 2, TILE - 4, 6);
    ctx.strokeStyle = 'rgba(0,0,0,0.35)';
    ctx.strokeRect(px + 0.5, py + 0.5, TILE - 1, TILE - 1);
  } else if (ch === 'd') {
    ctx.fillStyle = '#8a5a34';
    ctx.fillRect(px, py, TILE, TILE);
    ctx.fillStyle = 'rgba(0,0,0,0.14)';
    for (const [dx, dy] of [[7, 8], [20, 14], [12, 23], [25, 25], [4, 19]]) {
      ctx.fillRect(px + dx, py + dy, 4, 3);
    }
  } else if (ch === 'r' || ch === 'g') {
    const img = IMAGES[ch === 'r' ? 'rock' : 'gem'];
    if (img.complete && img.naturalWidth) {
      ctx.drawImage(img, px + 2, py + 2, TILE - 4, TILE - 4);
    }
  } else if (ch === 'X') {
    const open = exitOpen(state.game);
    ctx.fillStyle = open ? '#f5c542' : '#6d6d6d';
    ctx.fillRect(px + 3, py + 2, TILE - 6, TILE - 2);
    ctx.fillStyle = open ? '#fff7d1' : '#4d4d4d';
    ctx.fillRect(px + 8, py + 7, TILE - 16, TILE - 12);
    if (!open) {
      ctx.fillStyle = '#2d2d2d';
      ctx.beginPath();
      ctx.arc(px + TILE / 2, py + TILE / 2 + 2, 4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = 'rgba(255, 235, 130, 0.35)';
      ctx.beginPath();
      ctx.arc(px + TILE / 2, py + TILE / 2, TILE * 0.75, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawMiner(game, now) {
  const px = game.player.c * TILE + TILE / 2;
  const py = game.player.r * TILE + TILE / 2;
  const bob = Math.sin(now / 260) * 1.5;
  // thân
  ctx.fillStyle = '#3f6fb5';
  ctx.fillRect(px - 8, py - 2 + bob, 16, 14);
  // mặt
  ctx.fillStyle = '#ffd9b0';
  ctx.beginPath();
  ctx.arc(px, py - 6 + bob, 9, 0, Math.PI * 2);
  ctx.fill();
  // nón bảo hộ
  ctx.fillStyle = '#f5c542';
  ctx.beginPath();
  ctx.arc(px, py - 8 + bob, 10, Math.PI, 0);
  ctx.fill();
  ctx.fillRect(px - 11, py - 9 + bob, 22, 3);
  // mắt
  ctx.fillStyle = '#241e2e';
  ctx.beginPath();
  ctx.arc(px - 3, py - 5 + bob, 1.6, 0, Math.PI * 2);
  ctx.arc(px + 3, py - 5 + bob, 1.6, 0, Math.PI * 2);
  ctx.fill();
}

function draw(now) {
  const g = state.game;
  ctx.fillStyle = '#1c1526'; // lòng hang tối
  ctx.fillRect(0, 0, els.canvas.width, els.canvas.height);
  if (!g) return;
  for (let r = 0; r < g.rows; r++) {
    for (let c = 0; c < g.cols; c++) {
      if (g.grid[r][c] !== '.') drawCell(g, g.grid[r][c], c, r);
    }
  }
  drawMiner(g, now);
}

/* ===== HUD & vòng lặp ===== */

function updateHud() {
  const g = state.game;
  els.hudGems.textContent = `${g.gemsTotal - g.gemsLeft}/${g.gemsTotal}`;
  els.hudLives.textContent = '❤️'.repeat(Math.max(0, g.lives)) + '🖤'.repeat(START_LIVES - Math.max(0, g.lives));
  els.hudLevel.textContent = `${t('daovang.level', 'Màn')} ${g.level + 1}`;
}

function loop(now) {
  const dtMs = Math.min(80, now - state.last);
  state.last = now;
  const g = state.game;
  state.tickAcc += dtMs;
  while (state.tickAcc >= TICK_MS) {
    state.tickAcc -= TICK_MS;
    const r = tickPhysics(g);
    if (r.hurt) sfx.fail();
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
    mode: 'hangkim',
    result: g.won ? 'win' : 'quit',
    score: g.score,
    level: g.level + 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  if (g.won) {
    sfx.levelWin();
    confetti();
    els.ovEmoji.textContent = '💎';
    els.ovText.textContent = `${t('hangkim.win', 'Thoát khỏi hang với túi đầy kim cương!')}\n⭐ ${g.score}`;
    els.btnPlay.textContent = t('hangkim.next', 'MÀN TIẾP ▶');
    speak(t('hangkim.win', 'Thoát khỏi hang với túi đầy kim cương!'));
  } else {
    sfx.gameOver();
    els.ovEmoji.textContent = '🪨';
    els.ovText.textContent = `${t('hangkim.lose', 'Bị đá đè hết tim rồi!')}\n⭐ ${g.score}`;
    els.btnPlay.textContent = t('ran.retry', 'CHƠI LẠI ▶');
    speak(t('hangkim.lose', 'Bị đá đè hết tim rồi, chơi lại nhé!'));
  }
  els.overlay.classList.remove('hidden');
}

function startLevel() {
  els.overlay.classList.add('hidden');
  state.game = makeLevel(state.level);
  state.tickAcc = 0;
  state.doorAnnounced = false;
  state.startedAt = Date.now();
  state.last = performance.now();
  updateHud();
  state.raf = requestAnimationFrame(loop);
}

function doMove(dir) {
  const g = state.game;
  if (!g || g.over) return;
  const ev = move(g, dir);
  if (ev.gem) {
    sfx.match(2);
    if (exitOpen(g) && !state.doorAnnounced) {
      state.doorAnnounced = true;
      sfx.levelWin();
      speak(t('hangkim.dooropen', 'Cửa mở rồi, chạy tới cửa thôi!'));
    }
  } else if (ev.dug) sfx.select();
  else if (ev.pushed) sfx.shuffle();
  updateHud();
}

/* ===== Vuốt 4 hướng + bàn phím ===== */

let swipeFrom = null;
els.wrap.addEventListener('pointerdown', (e) => { swipeFrom = { x: e.clientX, y: e.clientY }; });
els.wrap.addEventListener('pointerup', (e) => {
  if (!swipeFrom) return;
  const dx = e.clientX - swipeFrom.x;
  const dy = e.clientY - swipeFrom.y;
  swipeFrom = null;
  if (Math.hypot(dx, dy) < 20) return;
  doMove(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
});
document.addEventListener('keydown', (e) => {
  const map = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
  const dir = map[e.key];
  if (!dir) return;
  e.preventDefault();
  doMove(dir);
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
sayInstruction(t('hangkim.help', 'Vuốt theo bốn hướng để thợ mỏ đào đất từng bước. Gom đủ kim cương thì cửa vàng mở ra. Nhớ nhé: đào ô ngay dưới tảng đá thì đá sẽ RƠI xuống — đừng đứng bên dưới! Còn có thể đẩy đá sang ngang để mở đường.'));
state.game = makeLevel(0);
updateHud();
draw(performance.now());

// Hook cho e2e test
window.__hangkim = { state, startLevel, doMove };

mountKidFeatures(); // thanh avatar bé + huy hiệu sao header + kiểm tra giới hạn phút/ngày (áp dụng cho mọi game, kể cả game giải trí thuần)
