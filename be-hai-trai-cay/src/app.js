// Điều phối Bé Hái Trái Cây: vẽ canvas vườn cây, vuốt tay hái trái bay parabol.
// Vệt vuốt là "bàn tay sáng lấp lánh" thân thiện (không lưỡi kiếm), đọc to tên trái
// cây khi hái trúng để bé vừa chơi vừa học từ vựng.

import {
  FIELD_W, FIELD_H, START_LIVES, FRUITS,
  makeLevel, stepGame, slice,
} from './behai.js';
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
  hudScore: $('hudScore'), hudTarget: $('hudTarget'), hudLives: $('hudLives'), hudLevel: $('hudLevel'),
  overlay: $('overlay'), ovEmoji: $('ovEmoji'), ovText: $('ovText'), btnPlay: $('btnPlay'),
};
const ctx = els.canvas.getContext('2d');

/* ===== Icon SVG (Twemoji — xem images/CREDITS.md) thay cho emoji chữ, nét hơn hẳn ===== */
const FRUIT_ICON = {
  tao: 'apple', cam: 'orange', chuoi: 'banana', duahau: 'watermelon',
  dau: 'strawberry', nho: 'grapes', xoai: 'mango', dua: 'pineapple',
};
// Tên tiếng Anh đọc to khi hái trúng (giọng EN thật, học từ vựng) — trùng key icon luôn
const FRUIT_EN = {
  tao: 'apple', cam: 'orange', chuoi: 'banana', duahau: 'watermelon',
  dau: 'strawberry', nho: 'grapes', xoai: 'mango', dua: 'pineapple',
};
const ICONS = {};
for (const name of [...Object.values(FRUIT_ICON), 'bee', 'sparkles']) {
  const img = new Image();
  img.src = `images/${name}.svg`;
  ICONS[name] = img;
}
function drawIcon(name, cx, cy, size, rot = 0) {
  const img = ICONS[name];
  if (!img.complete || img.naturalWidth === 0) return;
  if (rot) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.drawImage(img, -size / 2, -size / 2, size, size);
    ctx.restore();
  } else {
    ctx.drawImage(img, cx - size / 2, cy - size / 2, size, size);
  }
}

const state = {
  level: 0, game: null, raf: 0, last: 0, startedAt: Date.now(), instruction: '',
  trail: [], // vệt vuốt lấp lánh: {x, y, t}
  parts: [], // nửa trái cây văng ra + giọt nước ép: {kind, ...}
  floaters: [], // chữ điểm bay lên: {text, x, y, life}
  gesture: 0, // số thứ tự lần vuốt (đặt tay → nhấc tay) để logic tính combo
  flash: 0, // màn đỏ nhẹ khi bị ong chích
  lastSpeak: 0,
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
  sky.addColorStop(0, '#aee3f7');
  sky.addColorStop(0.75, '#e6f6d8');
  sky.addColorStop(1, '#9ed17e');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '52px sans-serif';
  ctx.globalAlpha = 0.9;
  ctx.fillText('🌞', 570, 66);
  ctx.globalAlpha = 0.8;
  ctx.fillText('🌳', 60, FIELD_H - 46);
  ctx.fillText('🌳', 580, FIELD_H - 46);
  ctx.font = '30px sans-serif';
  ctx.fillText('🌼', 180, FIELD_H - 22);
  ctx.fillText('🌷', 440, FIELD_H - 22);
  ctx.globalAlpha = 1;
}

function drawObjects(dt) {
  const g = state.game;
  if (!g) return;
  for (const o of g.objects) {
    // xoay nhẹ khi bay cho sống động (chỉ là trang trí, không đụng vào logic)
    if (o._spin === undefined) o._spin = (Math.random() - 0.5) * 0.06;
    o._rot = (o._rot || 0) + o._spin * dt;
    const icon = o.kind === 'bee' ? 'bee' : FRUIT_ICON[FRUITS[o.fruitIndex].key];
    drawIcon(icon, o.x, o.y, o.r * 2.1, o.kind === 'bee' ? 0 : o._rot);
  }
}

function drawTrail(now) {
  const pts = state.trail.filter((p) => now - p.t < 260);
  state.trail = pts;
  if (pts.length >= 2) {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (let k = 1; k < pts.length; k++) {
      const age = (now - pts[k].t) / 260;
      ctx.strokeStyle = `rgba(255, 236, 150, ${0.85 * (1 - age)})`;
      ctx.lineWidth = 14 * (1 - age) + 2;
      ctx.beginPath();
      ctx.moveTo(pts[k - 1].x, pts[k - 1].y);
      ctx.lineTo(pts[k].x, pts[k].y);
      ctx.stroke();
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.9 * (1 - age)})`;
      ctx.lineWidth = 4 * (1 - age) + 1;
      ctx.stroke();
    }
    const head = pts[pts.length - 1];
    drawIcon('sparkles', head.x + 10, head.y - 10, 24);
  }
}

function drawParticles(dt) {
  for (const p of state.parts) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 0.25 * dt;
    p.life -= dt;
    if (p.kind === 'half') {
      p.rot += p.vrot * dt;
      const img = ICONS[p.icon];
      if (img && img.complete && img.naturalWidth !== 0) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 20));
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.beginPath();
        ctx.rect(-44, p.side === 0 ? -44 : 0, 88, 44); // che nửa trên/nửa dưới → "bổ đôi"
        ctx.clip();
        ctx.drawImage(img, -26, -26, 52, 52);
        ctx.restore();
      }
    } else {
      ctx.globalAlpha = Math.max(0, p.life / 30);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
  state.parts = state.parts.filter((p) => p.life > 0 && p.y < FIELD_H + 80);
}

function drawFloaters(dt) {
  ctx.font = 'bold 30px sans-serif';
  for (const f of state.floaters) {
    f.y -= 1.2 * dt;
    f.life -= dt;
    ctx.globalAlpha = Math.max(0, f.life / 40);
    ctx.fillStyle = '#c2410c';
    ctx.fillText(f.text, f.x, f.y);
    ctx.globalAlpha = 1;
  }
  state.floaters = state.floaters.filter((f) => f.life > 0);
}

function draw(now, dt) {
  drawBackground();
  drawObjects(dt);
  drawParticles(dt);
  drawTrail(now);
  drawFloaters(dt);
  if (state.flash > 0) {
    ctx.fillStyle = `rgba(230, 60, 60, ${state.flash * 0.35})`;
    ctx.fillRect(0, 0, FIELD_W, FIELD_H);
    state.flash = Math.max(0, state.flash - dt * 0.04);
  }
}

/* ===== HUD ===== */

function updateHud() {
  const g = state.game;
  els.hudScore.textContent = g.score;
  els.hudTarget.textContent = g.target;
  els.hudLives.textContent = '❤️'.repeat(Math.max(0, g.lives)) + '🖤'.repeat(START_LIVES - Math.max(0, g.lives));
  els.hudLevel.textContent = `${t('daovang.level', 'Màn')} ${g.level + 1}`;
}

/* ===== Vòng lặp ===== */

function loop(now) {
  const dtMs = Math.min(50, now - state.last);
  state.last = now;
  const dt = dtMs / 16.67;
  const g = state.game;
  const dropped = stepGame(g, dtMs, Math.random);
  if (dropped > 0) { sfx.fail(); state.flash = Math.max(state.flash, 0.6); }
  updateHud();
  draw(now, dt);
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
    mode: 'behai',
    result: g.won ? 'win' : 'quit',
    score: g.score,
    level: g.level + 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  if (g.won) {
    sfx.levelWin();
    confetti();
    els.ovEmoji.textContent = '🧺';
    els.ovText.textContent = `${t('behai.win', 'Hái đầy giỏ trái cây rồi!')}\n⭐ ${g.score}`;
    els.btnPlay.textContent = t('behai.next', 'MÀN TIẾP ▶');
    speak(t('behai.win', 'Hái đầy giỏ trái cây rồi!'));
  } else {
    sfx.gameOver();
    els.ovEmoji.textContent = '🐝';
    els.ovText.textContent = `${t('behai.lose', 'Hết tim mất rồi!')}\n⭐ ${g.score}`;
    els.btnPlay.textContent = t('ran.retry', 'CHƠI LẠI ▶');
    speak(t('behai.lose', 'Hết tim mất rồi, chơi lại nhé!'));
  }
  els.overlay.classList.remove('hidden');
}

function startLevel() {
  els.overlay.classList.add('hidden');
  state.game = makeLevel(state.level, Math.random);
  state.trail = [];
  state.parts = [];
  state.floaters = [];
  state.flash = 0;
  state.startedAt = Date.now();
  state.last = performance.now();
  updateHud();
  state.raf = requestAnimationFrame(loop);
}

/* ===== Vuốt hái ===== */

// Đo rect() 1 lần lúc pointerdown, tránh đo lại mỗi pointermove (layout thrashing).
let fieldRect = null;
function fieldPos(e) {
  return {
    x: ((e.clientX - fieldRect.left) / fieldRect.width) * FIELD_W,
    y: ((e.clientY - fieldRect.top) / fieldRect.height) * FIELD_H,
  };
}

function burstFruit(o, angle) {
  const fruit = FRUITS[o.fruitIndex];
  const px = Math.cos(angle + Math.PI / 2);
  const py = Math.sin(angle + Math.PI / 2);
  for (const side of [0, 1]) {
    const dir = side === 0 ? -1 : 1;
    state.parts.push({
      kind: 'half', icon: FRUIT_ICON[fruit.key], side,
      x: o.x + px * dir * 6, y: o.y + py * dir * 6,
      vx: o.vx + px * dir * 2.2, vy: py * dir * 2.2 - 1.5,
      rot: angle, vrot: dir * 0.08, life: 55,
    });
  }
  for (let i = 0; i < 7; i++) {
    state.parts.push({
      kind: 'drop', color: fruit.color,
      x: o.x, y: o.y,
      vx: (Math.random() - 0.5) * 5, vy: -Math.random() * 4,
      r: 3 + Math.random() * 4, life: 30,
    });
  }
}

function handleSwipe(from, to) {
  const g = state.game;
  if (!g || g.over) return;
  const result = slice(g, from.x, from.y, to.x, to.y, state.gesture);
  if (result.fruits.length) {
    sfx.match(2);
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    for (const o of result.fruits) burstFruit(o, angle);
    const last = result.fruits[result.fruits.length - 1];
    const combo = g.gestureHits > 1; // slice() vừa cộng dồn số trái trong lần vuốt này
    state.floaters.push({ text: `+${result.gained}${combo ? ' ✨' : ''}`, x: last.x, y: last.y - 30, life: 45 });
    const now = performance.now();
    if (now - state.lastSpeak > 1400) {
      state.lastSpeak = now;
      const fruit = FRUITS[last.fruitIndex];
      // đọc TÊN TIẾNG ANH bằng giọng tiếng Anh thật (không đọc kiểu giọng Việt)
      speak(FRUIT_EN[fruit.key], { lang: 'en-US', rate: 0.68 });
    }
  }
  if (result.bees > 0) {
    sfx.fail();
    state.flash = 1;
  }
  if (g.over) updateHud();
}

let swiping = false;
let prev = null;
els.wrap.addEventListener('pointerdown', (e) => {
  swiping = true;
  state.gesture++;
  fieldRect = els.canvas.getBoundingClientRect();
  prev = fieldPos(e);
  state.trail.push({ ...prev, t: performance.now() });
});
els.wrap.addEventListener('pointermove', (e) => {
  if (!swiping) return;
  const pos = fieldPos(e);
  state.trail.push({ ...pos, t: performance.now() });
  if (prev) handleSwipe(prev, pos);
  prev = pos;
});
const stopSwipe = () => { swiping = false; prev = null; };
els.wrap.addEventListener('pointerup', stopSwipe);
els.wrap.addEventListener('pointercancel', stopSwipe);

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
sayInstruction(t('behai.help', 'Vuốt tay ngang qua trái cây đang bay để hái — vuốt 1 đường trúng nhiều trái được thưởng combo. Đừng chạm vào chú ong kẻo bị chích, và đừng để rơi trái nhé!'));
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
drawBackground();

// Hook cho e2e test
window.__behai = { state, startLevel, handleSwipe };

mountKidFeatures(); // thanh avatar bé + huy hiệu sao header + kiểm tra giới hạn phút/ngày (áp dụng cho mọi game, kể cả game giải trí thuần)
