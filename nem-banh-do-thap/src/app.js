// Điều phối Ném Banh Đổ Tháp: kéo banh trên ná ra sau để ngắm (có chấm quỹ đạo dự kiến),
// thả để phóng — khối/quái dùng sprite Kenney Physics Assets (CC0), banh tự vẽ canvas.

import {
  FIELD_W, FIELD_H, GROUND_Y, SLING_X, SLING_Y, BALL_R, CRITTER_R,
  MAX_POWER, POWER_PER_PX, GRAVITY, MATERIALS, LEVELS,
  makeLevel, launch, stepGame,
} from './nembanh.js';
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
  hudScore: $('hudScore'), hudShots: $('hudShots'), hudLevel: $('hudLevel'),
  overlay: $('overlay'), ovEmoji: $('ovEmoji'), ovText: $('ovText'), btnPlay: $('btnPlay'),
};
const ctx = els.canvas.getContext('2d');

/* ===== Sprite Kenney Physics Assets (CC0 — xem images/CREDITS.md) ===== */
const IMAGES = {};
for (const name of [
  'wood_sq', 'wood_beam', 'wood_tall', 'glass_sq', 'glass_beam', 'glass_tall',
  'stone_sq', 'stone_beam', 'stone_tall', 'critter_green', 'critter_blue', 'critter_pink',
]) {
  const img = new Image();
  img.src = `images/${name}.png`;
  IMAGES[name] = img;
}
/** Chọn sprite theo vật liệu + tỉ lệ khối (vuông / xà ngang / trụ dọc). */
function blockSprite(b) {
  const shape = b.w > b.h * 1.5 ? 'beam' : b.h > b.w * 1.5 ? 'tall' : 'sq';
  return IMAGES[`${b.mat}_${shape}`];
}
const CRITTER_SPRITES = ['critter_green', 'critter_blue', 'critter_pink'];

const state = {
  level: 0, game: null, raf: 0, last: 0, startedAt: Date.now(), instruction: '',
  dragging: false, dragX: 0, dragY: 0,
  lastPath: [], // quỹ đạo phát trước — vẽ chấm mờ như bản gốc thể loại
  tracer: [], // điểm banh đã bay qua trong phát hiện tại
  parts: [], // mảnh vỡ + bụp
};
bindMute(() => sfx.muted);

/** Đọc hướng dẫn + lưu lại để bấm ❓ nghe lại được (bé chưa đọc chữ vẫn chơi được). */
function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

/* ===== Vẽ ===== */

function drawBackground() {
  const sky = ctx.createLinearGradient(0, 0, 0, FIELD_H);
  sky.addColorStop(0, '#9ad8f5');
  sky.addColorStop(0.8, '#e8f6d8');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  for (const [x, y] of [[180, 80], [520, 130], [820, 70]]) {
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.arc(x + 26, y - 9, 17, 0, Math.PI * 2);
    ctx.arc(x + 50, y, 19, 0, Math.PI * 2);
    ctx.fill();
  }
  // mặt đất
  ctx.fillStyle = '#8bc34a';
  ctx.fillRect(0, GROUND_Y, FIELD_W, 16);
  ctx.fillStyle = '#d9b45c';
  ctx.fillRect(0, GROUND_Y + 16, FIELD_W, FIELD_H - GROUND_Y - 16);
}

function ballPos() {
  if (state.dragging) return { x: state.dragX, y: state.dragY };
  return { x: SLING_X, y: SLING_Y };
}

function drawSling() {
  const g = state.game;
  const p = ballPos();
  // 2 cọc ná chữ Y
  ctx.strokeStyle = '#6d4c41';
  ctx.lineCap = 'round';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(SLING_X - 16, GROUND_Y);
  ctx.lineTo(SLING_X - 14, SLING_Y + 6);
  ctx.moveTo(SLING_X + 16, GROUND_Y);
  ctx.lineTo(SLING_X + 14, SLING_Y + 6);
  ctx.stroke();
  // dây thun nối tới banh (chỉ khi banh còn trên ná)
  if (!g.ball) {
    ctx.strokeStyle = '#4e342e';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(SLING_X - 14, SLING_Y + 4);
    ctx.lineTo(p.x, p.y);
    ctx.lineTo(SLING_X + 14, SLING_Y + 4);
    ctx.stroke();
  }
}

function drawBall(x, y, r = BALL_R, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.15, x, y, r);
  grad.addColorStop(0, '#ffab70');
  grad.addColorStop(1, '#d84315');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, r * 0.62, 0.5, 2.4);
  ctx.stroke();
  ctx.restore();
}

function drawBlocks(g) {
  for (const b of g.blocks) {
    const img = blockSprite(b);
    if (img && img.complete && img.naturalWidth) ctx.drawImage(img, b.x, b.y, b.w, b.h);
    // vết nứt mờ dần theo máu còn lại
    if (b.hp < b.maxHp) {
      ctx.strokeStyle = `rgba(40, 20, 10, ${0.5 * (1 - b.hp / b.maxHp) + 0.15})`;
      ctx.lineWidth = 2;
      const cx = b.x + b.w / 2;
      const cy = b.y + b.h / 2;
      ctx.beginPath();
      ctx.moveTo(cx - 10, cy - 8); ctx.lineTo(cx, cy); ctx.lineTo(cx - 4, cy + 10);
      ctx.moveTo(cx + 8, cy - 10); ctx.lineTo(cx + 2, cy - 2); ctx.lineTo(cx + 12, cy + 6);
      ctx.stroke();
    }
  }
}

function drawCritters(g) {
  for (const c of g.critters) {
    if (c.popped) continue;
    const img = IMAGES[CRITTER_SPRITES[c.id % CRITTER_SPRITES.length]];
    if (img && img.complete && img.naturalWidth) {
      ctx.drawImage(img, c.x - CRITTER_R, c.y - CRITTER_R, CRITTER_R * 2, CRITTER_R * 2);
    }
  }
}

function drawGuide() {
  // chấm quỹ đạo dự kiến khi đang kéo — mô phỏng nhanh 30 bước
  if (state.dragging) {
    let vx = (SLING_X - state.dragX) * POWER_PER_PX;
    let vy = (SLING_Y - state.dragY) * POWER_PER_PX;
    const sp = Math.hypot(vx, vy);
    if (sp > MAX_POWER) { vx *= MAX_POWER / sp; vy *= MAX_POWER / sp; }
    let x = SLING_X;
    let y = SLING_Y;
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    for (let i = 0; i < 30; i++) {
      vy += GRAVITY;
      x += vx;
      y += vy;
      if (i % 2 === 0) {
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      if (y > GROUND_Y) break;
    }
  }
  // vệt phát bắn trước (mờ)
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  for (let i = 0; i < state.lastPath.length; i += 4) {
    ctx.beginPath();
    ctx.arc(state.lastPath[i].x, state.lastPath[i].y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawParticles() {
  for (const p of state.parts) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.3;
    p.rot += p.vrot;
    p.life -= 1;
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.life / 30);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.fill;
    ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2);
    ctx.restore();
  }
  state.parts = state.parts.filter((p) => p.life > 0 && p.y < FIELD_H + 40);
}

function burst(x, y, fill, n = 8) {
  for (let i = 0; i < n; i++) {
    state.parts.push({
      x, y, fill,
      vx: (Math.random() - 0.5) * 7, vy: -Math.random() * 5,
      r: 3 + Math.random() * 5, rot: Math.random() * 6, vrot: (Math.random() - 0.5) * 0.4,
      life: 30,
    });
  }
}

function draw() {
  drawBackground();
  const g = state.game;
  if (!g) return;
  drawGuide();
  drawBlocks(g);
  drawCritters(g);
  drawSling();
  if (g.ball) {
    state.tracer.push({ x: g.ball.x, y: g.ball.y });
    drawBall(g.ball.x, g.ball.y);
  } else if (!g.over && g.shotsLeft > 0) {
    const p = ballPos();
    drawBall(p.x, p.y);
  }
  drawParticles();
}

/* ===== HUD & vòng lặp ===== */

function updateHud() {
  const g = state.game;
  els.hudScore.textContent = g.score;
  els.hudShots.textContent = '🏀'.repeat(Math.max(0, g.shotsLeft)) || '—';
  els.hudLevel.textContent = `${t('daovang.level', 'Màn')} ${g.level + 1}`;
}

const MAT_COLOR = { wood: '#a86a3d', glass: '#bfe3f0', stone: '#9e9e9e' };

function loop(now) {
  const dtMs = Math.min(50, now - state.last);
  state.last = now;
  const g = state.game;

  const crittersBefore = g.critters.map((c) => ({ x: c.x, y: c.y, popped: c.popped }));
  const blocksBefore = new Map(g.blocks.map((b) => [b.id, { x: b.x, y: b.y, mat: b.mat }]));
  const ev = stepGame(g, dtMs);

  if (ev.hit) sfx.select();
  if (ev.destroyed) {
    sfx.match(2);
    for (const [id, info] of blocksBefore) {
      if (!g.blocks.some((b) => b.id === id)) burst(info.x + 20, info.y + 20, MAT_COLOR[info.mat]);
    }
  }
  if (ev.popped) {
    sfx.match(3);
    g.critters.forEach((c, i) => {
      if (c.popped && !crittersBefore[i].popped) burst(crittersBefore[i].x, crittersBefore[i].y, '#7cc35b', 10);
    });
  }
  if (ev.ballDone) {
    state.lastPath = state.tracer;
    state.tracer = [];
  }

  updateHud();
  draw();
  if (g.over && ev.settledEnd) return endLevel();
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
    mode: 'nembanh',
    result: g.won ? 'win' : 'quit',
    score: g.score,
    level: g.level + 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  if (g.won) {
    sfx.levelWin();
    confetti();
    els.ovEmoji.textContent = '⭐'.repeat(g.stars);
    els.ovText.textContent = `${t('nembanh.win', 'Đổ sạch tháp rồi!')}\n⭐ ${g.score}`;
    els.btnPlay.textContent = t('nembanh.next', 'MÀN TIẾP ▶');
    speak(t('nembanh.win', 'Đổ sạch tháp rồi!'));
  } else {
    sfx.gameOver();
    els.ovEmoji.textContent = '🏀';
    els.ovText.textContent = `${t('nembanh.lose', 'Hết banh mất rồi!')}\n⭐ ${g.score}`;
    els.btnPlay.textContent = t('ran.retry', 'CHƠI LẠI ▶');
    speak(t('nembanh.lose', 'Hết banh mất rồi, chơi lại nhé!'));
  }
  els.overlay.classList.remove('hidden');
}

function startLevel() {
  els.overlay.classList.add('hidden');
  state.game = makeLevel(state.level);
  state.lastPath = [];
  state.tracer = [];
  state.parts = [];
  state.dragging = false;
  state.startedAt = Date.now();
  state.last = performance.now();
  updateHud();
  state.raf = requestAnimationFrame(loop);
}

/* ===== Kéo ná & phóng ===== */

function fieldPos(e) {
  const rect = els.canvas.getBoundingClientRect();
  return {
    x: ((e.clientX - rect.left) / rect.width) * FIELD_W,
    y: ((e.clientY - rect.top) / rect.height) * FIELD_H,
  };
}

els.wrap.addEventListener('pointerdown', (e) => {
  const g = state.game;
  if (!g || g.over || g.ball || g.shotsLeft <= 0) return;
  const p = fieldPos(e);
  if (Math.hypot(p.x - SLING_X, p.y - SLING_Y) < 120) {
    state.dragging = true;
    state.dragX = p.x;
    state.dragY = p.y;
  }
});
els.wrap.addEventListener('pointermove', (e) => {
  if (!state.dragging) return;
  const p = fieldPos(e);
  // giới hạn kéo trong bán kính quanh ná
  const dx = p.x - SLING_X;
  const dy = p.y - SLING_Y;
  const d = Math.hypot(dx, dy);
  const max = MAX_POWER / POWER_PER_PX;
  const k = d > max ? max / d : 1;
  state.dragX = SLING_X + dx * k;
  state.dragY = SLING_Y + dy * k;
});
els.wrap.addEventListener('pointerup', () => {
  if (!state.dragging) return;
  state.dragging = false;
  const vx = (SLING_X - state.dragX) * POWER_PER_PX;
  const vy = (SLING_Y - state.dragY) * POWER_PER_PX;
  if (Math.hypot(vx, vy) < 2) return; // kéo quá nhẹ thì thôi
  if (launch(state.game, vx, vy)) {
    sfx.shuffle();
    updateHud();
  }
});
els.wrap.addEventListener('pointercancel', () => { state.dragging = false; });

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
sayInstruction(t('nembanh.help', 'Kéo quả banh trên ná ra sau để ngắm — đường chấm chấm cho biết banh sẽ bay đi đâu — rồi thả tay để phóng! Kính vỡ ngay, gỗ chịu được vài nhát, đá thì phải ném thật mạnh. Đổ tháp đè trúng hết các chú quái tròn là thắng!'));
state.game = makeLevel(0);
updateHud();
draw();

// Hook cho e2e test
window.__nembanh = { state, startLevel };

mountKidFeatures(); // thanh avatar bé + huy hiệu sao header + kiểm tra giới hạn phút/ngày (áp dụng cho mọi game, kể cả game giải trí thuần)
