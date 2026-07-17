// Điều phối Rồng Con Bắn Trứng: kéo tay ngắm (đường chấm chấm có nảy tường), thả để bắn,
// diễn hoạt trứng bay/nổ/rơi. Trứng màu vẽ sẵn 1 lần vào canvas phụ cho nét và nhanh.

import {
  R, ROW_H, FIELD_W, FIELD_H, DEATH_ROW, SHOOTER_X, SHOOTER_Y, MAX_ANGLE, ADD_ROW_EVERY,
  cellCenter, makeLevel, tracePath, fireShot,
} from './rongcon.js';
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
  hudScore: $('hudScore'), hudDrop: $('hudDrop'), hudLevel: $('hudLevel'),
  overlay: $('overlay'), ovEmoji: $('ovEmoji'), ovText: $('ovText'), btnPlay: $('btnPlay'),
};
const ctx = els.canvas.getContext('2d');

/* ===== Trứng màu vẽ sẵn (không cần asset ngoài) ===== */
const EGG_COLORS = [
  ['#ff8a80', '#e0392a'], ['#82b1ff', '#1e63b5'], ['#b9f6ca', '#2f9e44'],
  ['#ffe57f', '#e8a000'], ['#ea80fc', '#8e24aa'], ['#ffd180', '#ef6c00'],
];
const eggSprites = EGG_COLORS.map(([light, dark]) => {
  const c = document.createElement('canvas');
  c.width = R * 2; c.height = R * 2;
  const g2 = c.getContext('2d');
  const grad = g2.createRadialGradient(R * 0.7, R * 0.6, R * 0.15, R, R, R);
  grad.addColorStop(0, light);
  grad.addColorStop(1, dark);
  g2.fillStyle = grad;
  g2.beginPath();
  g2.ellipse(R, R, R * 0.85, R * 0.97, 0, 0, Math.PI * 2);
  g2.fill();
  // đốm trứng + ánh sáng
  g2.fillStyle = 'rgba(255,255,255,0.35)';
  for (const [dx, dy, r2] of [[-0.25, 0.15, 0.13], [0.3, 0.35, 0.1], [0.05, 0.6, 0.11]]) {
    g2.beginPath();
    g2.arc(R + dx * R, R + dy * R, r2 * R, 0, Math.PI * 2);
    g2.fill();
  }
  g2.fillStyle = 'rgba(255,255,255,0.75)';
  g2.beginPath();
  g2.ellipse(R * 0.66, R * 0.5, R * 0.2, R * 0.3, -0.5, 0, Math.PI * 2);
  g2.fill();
  return c;
});
function drawEgg(color, x, y, scale = 1, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const s = R * 2 * scale;
  ctx.drawImage(eggSprites[color % eggSprites.length], x - s / 2, y - s / 2, s, s);
  ctx.restore();
}

const dragonImg = new Image();
dragonImg.src = 'images/dragon.svg';

const state = {
  level: 0, game: null, raf: 0, startedAt: Date.now(), instruction: '',
  aiming: false, aimAngle: 0,
  anim: null, // { path, idx, color, result, gridSnapshot, parity }
  parts: [], // hiệu ứng nổ/rơi
  busy: false,
};
bindMute(() => sfx.muted);

/** Đọc hướng dẫn + lưu lại để bấm ❓ nghe lại được (bé chưa đọc chữ vẫn chơi được). */
function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

/* ===== Vẽ ===== */

function drawBackground() {
  const bg = ctx.createLinearGradient(0, 0, 0, FIELD_H);
  bg.addColorStop(0, '#5d4037');
  bg.addColorStop(0.25, '#7a5a3e');
  bg.addColorStop(1, '#a8825a');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);
  // vách hang lởm chởm 2 bên
  ctx.fillStyle = 'rgba(0,0,0,0.14)';
  for (let y = 0; y < FIELD_H; y += 64) {
    ctx.beginPath();
    ctx.arc(0, y, 14, 0, Math.PI * 2);
    ctx.arc(FIELD_W, y + 32, 14, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawGrid(grid, parity) {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === null) continue;
      const cc = cellCenter(r, c, parity);
      drawEgg(grid[r][c], cc.x, cc.y);
    }
  }
}

function drawDeathLine() {
  const y = R + (DEATH_ROW - 0.5) * ROW_H;
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 82, 82, 0.85)';
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 8]);
  ctx.beginPath();
  ctx.moveTo(8, y);
  ctx.lineTo(FIELD_W - 8, y);
  ctx.stroke();
  ctx.restore();
}

function drawShooter() {
  const g = state.game;
  // đường ngắm chấm chấm (có nảy tường — dùng chung mô phỏng với phát bắn thật)
  if (state.aiming && !state.busy) {
    const path = tracePath(g, state.aimAngle);
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    for (let i = 4; i < Math.min(path.length, 46); i += 3) {
      ctx.beginPath();
      ctx.arc(path[i].x, path[i].y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // nòng pháo
  const a = state.aiming ? state.aimAngle : 0;
  ctx.save();
  ctx.translate(SHOOTER_X, SHOOTER_Y);
  ctx.rotate(a);
  ctx.fillStyle = '#4e342e';
  ctx.fillRect(-9, -R * 2.1, 18, R * 1.4);
  ctx.restore();
  // bệ + rồng con + trứng sắp bắn & trứng kế tiếp
  ctx.fillStyle = '#3e2723';
  ctx.beginPath();
  ctx.arc(SHOOTER_X, SHOOTER_Y + 14, 34, Math.PI, 0);
  ctx.fill();
  if (dragonImg.complete && dragonImg.naturalWidth) {
    ctx.drawImage(dragonImg, SHOOTER_X - 76, SHOOTER_Y - 26, 44, 44);
  }
  if (!state.busy && !state.game.over) drawEgg(state.game.nextColor, SHOOTER_X, SHOOTER_Y - 10);
  drawEgg(state.game.queueColor, SHOOTER_X + 62, SHOOTER_Y + 2, 0.6, 0.85);
}

function drawParticles() {
  for (const p of state.parts) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.3;
    p.life -= 1;
    if (p.kind === 'egg') drawEgg(p.color, p.x, p.y, 1, Math.max(0, p.life / 40));
    else {
      ctx.globalAlpha = Math.max(0, p.life / 25);
      ctx.fillStyle = p.fill;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
  state.parts = state.parts.filter((p) => p.life > 0 && p.y < FIELD_H + 60);
}

function draw() {
  drawBackground();
  const g = state.game;
  if (!g) return;
  const anim = state.anim;
  if (anim) {
    drawGrid(anim.gridSnapshot, anim.parity);
    drawEgg(anim.color, anim.path[anim.idx].x, anim.path[anim.idx].y);
  } else {
    drawGrid(g.grid, g.parity);
  }
  drawDeathLine();
  drawParticles();
  drawShooter();
}

/* ===== HUD ===== */

function updateHud() {
  const g = state.game;
  els.hudScore.textContent = g.score;
  els.hudDrop.textContent = ADD_ROW_EVERY - g.shotsSinceRow;
  els.hudLevel.textContent = `${t('daovang.level', 'Màn')} ${g.level + 1}`;
}

/* ===== Vòng lặp ===== */

function loop() {
  const anim = state.anim;
  if (anim) {
    anim.idx = Math.min(anim.path.length - 1, anim.idx + 3); // trứng bay nhanh, 3 bước/khung
    if (anim.idx >= anim.path.length - 1) finishShot();
  }
  draw();
  updateHud();
  state.raf = requestAnimationFrame(loop);
}

/** Trứng đã bay tới nơi: hiện kết quả nổ/rơi rồi mở khóa bắn tiếp. */
function finishShot() {
  const { result } = state.anim;
  state.anim = null;
  const g = state.game;
  if (result.popped.length) {
    sfx.match(result.popped.length >= 6 ? 3 : 2);
    for (const cell of result.popped) {
      const cc = cellCenter(cell.r, cell.c, g.parity);
      for (let i = 0; i < 6; i++) {
        state.parts.push({
          kind: 'dot', fill: EGG_COLORS[cell.color % EGG_COLORS.length][0],
          x: cc.x, y: cc.y, vx: (Math.random() - 0.5) * 6, vy: -Math.random() * 4,
          r: 4 + Math.random() * 4, life: 25,
        });
      }
    }
    if (result.popped.length >= 6) speak(t('rongcon.great', 'Giỏi quá!'));
  } else {
    sfx.select();
  }
  for (const cell of result.dropped) {
    const cc = cellCenter(cell.r, cell.c, g.parity);
    state.parts.push({ kind: 'egg', color: cell.color, x: cc.x, y: cc.y, vx: (Math.random() - 0.5) * 2, vy: -1, life: 40 });
  }
  if (result.addedRow) sfx.shuffle();
  state.busy = false;
  if (g.over) setTimeout(endLevel, 500);
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
    mode: 'rongcon',
    result: g.won ? 'win' : 'quit',
    score: g.score,
    level: g.level + 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  if (g.won) {
    sfx.levelWin();
    confetti();
    els.ovEmoji.textContent = '🐲';
    els.ovText.textContent = `${t('rongcon.win', 'Dọn sạch trứng rồi, rồng con vui quá!')}\n⭐ ${g.score}`;
    els.btnPlay.textContent = t('rongcon.next', 'MÀN TIẾP ▶');
    speak(t('rongcon.win', 'Dọn sạch trứng rồi, rồng con vui quá!'));
  } else {
    sfx.gameOver();
    els.ovEmoji.textContent = '🥚';
    els.ovText.textContent = `${t('rongcon.lose', 'Trứng tràn tới vạch đỏ mất rồi!')}\n⭐ ${g.score}`;
    els.btnPlay.textContent = t('ran.retry', 'CHƠI LẠI ▶');
    speak(t('rongcon.lose', 'Trứng tràn tới vạch đỏ mất rồi, chơi lại nhé!'));
  }
  els.overlay.classList.remove('hidden');
}

function startLevel() {
  cancelAnimationFrame(state.raf);
  els.overlay.classList.add('hidden');
  state.game = makeLevel(state.level, Math.random);
  state.anim = null;
  state.parts = [];
  state.busy = false;
  state.aiming = false;
  state.startedAt = Date.now();
  updateHud();
  state.raf = requestAnimationFrame(loop);
}

/* ===== Ngắm & bắn ===== */

function angleFromEvent(e) {
  const rect = els.canvas.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * FIELD_W;
  const y = ((e.clientY - rect.top) / rect.height) * FIELD_H;
  const a = Math.atan2(x - SHOOTER_X, SHOOTER_Y - y); // 0 = thẳng lên
  return Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, a));
}

els.wrap.addEventListener('pointerdown', (e) => {
  if (!state.game || state.game.over || state.busy) return;
  state.aiming = true;
  state.aimAngle = angleFromEvent(e);
});
els.wrap.addEventListener('pointermove', (e) => {
  if (state.aiming) state.aimAngle = angleFromEvent(e);
});
els.wrap.addEventListener('pointerup', (e) => {
  if (!state.aiming) return;
  state.aiming = false;
  if (!state.game || state.game.over || state.busy) return;
  const angle = angleFromEvent(e);
  // chụp lại lưới TRƯỚC khi bắn để vẽ trong lúc trứng còn đang bay
  const gridSnapshot = state.game.grid.map((row) => [...row]);
  const parity = state.game.parity;
  const result = fireShot(state.game, angle, Math.random);
  if (!result) return;
  state.busy = true;
  state.anim = { path: result.path, idx: 0, color: result.color, result, gridSnapshot, parity };
  sfx.select();
});
els.wrap.addEventListener('pointercancel', () => { state.aiming = false; });

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
sayInstruction(t('rongcon.help', 'Kéo tay để ngắm — đường chấm chấm cho biết trứng sẽ bay đi đâu, bắn vào tường còn nảy lại được! Gom đủ 3 trứng cùng màu dính nhau là nổ. Đừng để trứng tràn xuống vạch đỏ nhé!'));
state.game = makeLevel(0, Math.random);
draw();

// Hook cho e2e test
window.__rongcon = { state, startLevel };
