// Điều phối Giải Cứu Khủng Long Con: rừng parallax cuộn, chạm bất kỳ đâu để nhảy,
// các bé khủng long đã cứu chạy lũn cũn theo sau, khủng long mẹ + tổ trứng chờ ở đích.
// Nhân vật Kenney Pixel Platformer (CC0), khủng long/đá/dừa Twemoji (CC-BY).

import {
  FIELD_W, FIELD_H, GROUND_Y, RUNNER_X, RUNNER_R, START_LIVES, PIT_W,
  makeLevel, jump, stepGame,
} from './khunglong.js';
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
  hudScore: $('hudScore'), hudSaved: $('hudSaved'), hudDist: $('hudDist'),
  hudLives: $('hudLives'), hudLevel: $('hudLevel'),
  overlay: $('overlay'), ovEmoji: $('ovEmoji'), ovText: $('ovText'), btnPlay: $('btnPlay'),
};
const ctx = els.canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const IMAGES = {};
for (const [name, ext] of [
  ['baby', 'svg'], ['mama', 'svg'], ['egg', 'svg'], ['rock', 'svg'], ['palm', 'svg'],
  ['grass', 'png'], ['dirt', 'png'], ['hero_a', 'png'], ['hero_b', 'png'],
]) {
  const img = new Image();
  img.src = `images/${name}.${ext}`;
  IMAGES[name] = img;
}
function drawIcon(name, cx, cy, size, flip = false) {
  const img = IMAGES[name];
  if (!img.complete || img.naturalWidth === 0) return;
  ctx.save();
  ctx.translate(cx, cy);
  if (flip) ctx.scale(-1, 1);
  ctx.drawImage(img, -size / 2, -size / 2, size, size);
  ctx.restore();
}

const state = {
  level: 0, game: null, raf: 0, last: 0, startedAt: Date.now(), instruction: '',
  runT: 0, sparkles: [],
};
bindMute(() => sfx.muted);

/** Đọc hướng dẫn + lưu lại để bấm ❓ nghe lại được (bé chưa đọc chữ vẫn chơi được). */
function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

/* ===== Vẽ ===== */

function drawBackground(g) {
  const sky = ctx.createLinearGradient(0, 0, 0, FIELD_H);
  sky.addColorStop(0, '#a8e0c8');
  sky.addColorStop(1, '#e8f6d0');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);
  // dãy dừa parallax xa
  for (let i = 0; i < 5; i++) {
    const x = ((i * 260 - g.dist * 0.35) % (FIELD_W + 300) + FIELD_W + 300) % (FIELD_W + 300) - 150;
    drawIcon('palm', x, GROUND_Y - 60, 90);
  }
  ctx.fillStyle = 'rgba(90, 160, 110, 0.35)';
  for (let i = 0; i < 6; i++) {
    const x = ((i * 230 - g.dist * 0.6) % (FIELD_W + 260) + FIELD_W + 260) % (FIELD_W + 260) - 130;
    ctx.beginPath();
    ctx.arc(x, GROUND_Y + 8, 70, Math.PI, 0);
    ctx.fill();
  }
}

/** Mặt đất bằng tile Kenney — chừa lỗ ở các hố. */
function drawGround(g) {
  const T = 32;
  for (let sx = -T; sx < FIELD_W + T; sx += T) {
    const wx = g.dist + sx;
    const inPit = g.items.some((it) => it.type === 'pit' && wx + T / 2 > it.x && wx + T / 2 < it.x + PIT_W);
    if (inPit) continue;
    const off = -(g.dist % T);
    const img = IMAGES.grass;
    const img2 = IMAGES.dirt;
    if (img.complete && img.naturalWidth) ctx.drawImage(img, sx + off, GROUND_Y, T, T);
    if (img2.complete && img2.naturalWidth) {
      ctx.drawImage(img2, sx + off, GROUND_Y + T, T, T);
      ctx.drawImage(img2, sx + off, GROUND_Y + T * 2, T, T);
    }
  }
}

function drawItems(g, now) {
  for (const it of g.items) {
    const sx = it.x - g.dist;
    if (sx < -80 || sx > FIELD_W + 80) continue;
    if (it.type === 'rock') {
      drawIcon('rock', sx + 18, GROUND_Y - 16, 44);
    } else if (it.type === 'baby' && !it.saved) {
      const bob = Math.sin(now / 240 + it.x) * 4;
      drawIcon('baby', sx, GROUND_Y - 22 + bob, 42);
      // dấu chấm than kêu cứu
      ctx.fillStyle = '#e03131';
      ctx.font = '900 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('!', sx, GROUND_Y - 52 + bob);
    }
  }
  // tổ + mẹ ở cuối chặng
  const nestX = g.target - g.dist;
  if (nestX < FIELD_W + 120) {
    drawIcon('mama', nestX + 40, GROUND_Y - 42, 90, true);
    drawIcon('egg', nestX - 6, GROUND_Y - 12, 26);
    drawIcon('egg', nestX + 14, GROUND_Y - 10, 24);
  }
}

function drawRunner(g, now) {
  const blink = g.invincibleMs > 0 ? (Math.floor(now / 120) % 2 ? 0.35 : 0.85) : 1;
  ctx.globalAlpha = blink;
  const frame = g.grounded && Math.floor(state.runT / 6) % 2 ? 'hero_b' : 'hero_a';
  drawIcon(frame, RUNNER_X, g.y, RUNNER_R * 2.4);
  ctx.globalAlpha = 1;
  // các bé đã cứu chạy theo sau, nhún nhảy
  for (let i = 0; i < g.saved; i++) {
    const bx = RUNNER_X - 34 - i * 26;
    const by = GROUND_Y - 16 - Math.abs(Math.sin(now / 160 + i * 1.3)) * 8;
    drawIcon('baby', bx, by, 30);
  }
}

function draw(now) {
  const g = state.game;
  if (!g) return;
  drawBackground(g);
  drawGround(g);
  drawItems(g, now);
  for (const s of state.sparkles) {
    s.y -= 1.4;
    s.life -= 1;
    ctx.globalAlpha = Math.max(0, s.life / 25);
    ctx.fillStyle = '#ffd93d';
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  state.sparkles = state.sparkles.filter((s) => s.life > 0);
  drawRunner(g, now);
}

/* ===== HUD & vòng lặp ===== */

function updateHud() {
  const g = state.game;
  els.hudScore.textContent = g.score;
  els.hudSaved.textContent = g.saved;
  els.hudDist.textContent = `${Math.min(100, Math.floor(((g.dist + RUNNER_X) / g.target) * 100))}%`;
  els.hudLives.textContent = '❤️'.repeat(Math.max(0, g.lives)) + '🖤'.repeat(START_LIVES - Math.max(0, g.lives));
  els.hudLevel.textContent = `${t('daovang.level', 'Màn')} ${g.level + 1}`;
}

function loop(now) {
  const dtMs = Math.min(50, now - state.last);
  state.last = now;
  const g = state.game;
  if (g.grounded) state.runT += dtMs / 16.67;
  const ev = stepGame(g, dtMs);
  if (ev.hit || ev.fell) sfx.fail();
  if (ev.saved) {
    sfx.match(3);
    speak(t('khunglong.saved', 'Cứu được một bé rồi!'));
    for (let i = 0; i < 6; i++) {
      state.sparkles.push({
        x: RUNNER_X + (Math.random() - 0.5) * 40, y: g.y - 10,
        r: 2.5 + Math.random() * 3.5, life: 25,
      });
    }
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
    mode: 'khunglong',
    result: g.won ? 'win' : 'quit',
    score: g.score,
    level: g.level + 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  if (g.won) {
    sfx.levelWin();
    confetti();
    els.ovEmoji.textContent = '🦖💕';
    els.ovText.textContent = `${t('khunglong.win', 'Về tổ an toàn, mẹ khủng long vui quá!')}\n🦕 ${g.saved} · ⭐ ${g.score}`;
    els.btnPlay.textContent = t('khunglong.next', 'MÀN TIẾP ▶');
    speak(t('khunglong.win', 'Về tổ an toàn, mẹ khủng long vui quá!'));
  } else {
    sfx.gameOver();
    els.ovEmoji.textContent = '🦕';
    els.ovText.textContent = `${t('khunglong.lose', 'Hết tim mất rồi!')}\n⭐ ${g.score}`;
    els.btnPlay.textContent = t('ran.retry', 'CHƠI LẠI ▶');
    speak(t('khunglong.lose', 'Hết tim mất rồi, chạy lại nhé!'));
  }
  els.overlay.classList.remove('hidden');
}

function startLevel() {
  els.overlay.classList.add('hidden');
  state.game = makeLevel(state.level, Math.random);
  state.sparkles = [];
  state.startedAt = Date.now();
  state.last = performance.now();
  updateHud();
  state.raf = requestAnimationFrame(loop);
}

/* ===== Điều khiển: chạm bất kỳ đâu để nhảy ===== */

els.wrap.addEventListener('pointerdown', (e) => {
  if (e.target.closest('.overlay')) return;
  if (state.game && !state.game.over && jump(state.game)) sfx.select();
});
document.addEventListener('keydown', (e) => {
  if (e.code !== 'Space' && e.key !== 'ArrowUp') return;
  e.preventDefault();
  if (els.overlay.classList.contains('hidden') && state.game && !state.game.over && jump(state.game)) sfx.select();
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
sayInstruction(t('khunglong.help', 'Bạn nhỏ tự chạy, bé chỉ cần chạm màn hình để NHẢY qua tảng đá và hố sâu! Chạy ngang bé khủng long đang kêu cứu là bế theo luôn — đưa các bé về tổ với mẹ khủng long ở cuối đường nhé!'));
state.game = makeLevel(0, Math.random);
updateHud();
draw(performance.now());

// Hook cho e2e test
window.__khunglong = { state, startLevel };
