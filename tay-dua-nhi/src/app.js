// Điều phối Tay Đua Nhí: đường cuộn dọc, chạm làn nào xe lách sang làn đó,
// xe Kenney Racing Pack (CC0), vệt nitro + vạch đích ca-rô tự vẽ canvas.

import {
  FIELD_W, FIELD_H, LANES, ROAD_X, ROAD_W, CAR_W, CAR_H, PLAYER_Y, START_LIVES,
  laneX, makeLevel, steer, steerTo, stepGame,
} from './taydua.js';
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
  hudScore: $('hudScore'), hudDist: $('hudDist'), hudLives: $('hudLives'), hudLevel: $('hudLevel'),
  overlay: $('overlay'), ovEmoji: $('ovEmoji'), ovText: $('ovText'), btnPlay: $('btnPlay'),
};
const ctx = els.canvas.getContext('2d');

const IMAGES = {};
for (const name of ['car_red', 'car_blue', 'car_green', 'car_yellow', 'car_black', 'tree', 'cone', 'oil']) {
  const img = new Image();
  img.src = `images/${name}.png`;
  IMAGES[name] = img;
}
const TRAFFIC_COLORS = ['car_blue', 'car_green', 'car_yellow', 'car_black', 'car_red'];

/** Vẽ xe hướng lên/xuống — sprite Kenney vốn quay đầu LÊN. */
function drawCar(name, x, y, w, h, flip = false) {
  const img = IMAGES[name];
  if (!img.complete || img.naturalWidth === 0) return;
  ctx.save();
  ctx.translate(x, y);
  if (flip) ctx.rotate(Math.PI);
  ctx.drawImage(img, -w / 2, -h / 2, w, h);
  ctx.restore();
}

const state = {
  level: 0, game: null, raf: 0, last: 0, startedAt: Date.now(), instruction: '',
  roadScroll: 0, trail: [],
};
bindMute(() => sfx.muted);

/** Đọc hướng dẫn + lưu lại để bấm ❓ nghe lại được (bé chưa đọc chữ vẫn chơi được). */
function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

/* ===== Vẽ ===== */

function drawRoad() {
  // lề cỏ + hàng cây
  ctx.fillStyle = '#7cb85c';
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);
  const treeGap = 170;
  for (let i = -1; i < 6; i++) {
    const y = ((i * treeGap + state.roadScroll) % (FIELD_H + treeGap) + FIELD_H + treeGap) % (FIELD_H + treeGap) - treeGap / 2;
    const img = IMAGES.tree;
    if (img.complete && img.naturalWidth) {
      ctx.drawImage(img, 2, y, 36, 36);
      ctx.drawImage(img, FIELD_W - 38, y + 80, 36, 36);
    }
  }
  // mặt đường
  ctx.fillStyle = '#4a4f58';
  ctx.fillRect(ROAD_X, 0, ROAD_W, FIELD_H);
  ctx.fillStyle = '#e8e8e8';
  ctx.fillRect(ROAD_X - 4, 0, 4, FIELD_H);
  ctx.fillRect(ROAD_X + ROAD_W, 0, 4, FIELD_H);
  // vạch làn đứt quãng cuộn xuống
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  const dashLen = 34;
  for (let l = 1; l < LANES; l++) {
    const x = ROAD_X + (ROAD_W / LANES) * l - 2;
    for (let i = -1; i < 12; i++) {
      const y = ((i * dashLen * 2 + state.roadScroll) % (FIELD_H + dashLen * 2) + FIELD_H + dashLen * 2) % (FIELD_H + dashLen * 2) - dashLen;
      ctx.fillRect(x, y, 4, dashLen);
    }
  }
}

function drawFinish(y) {
  const sq = 12;
  for (let r = 0; r < 3; r++) {
    for (let cx = 0; cx < ROAD_W / sq; cx++) {
      ctx.fillStyle = (r + cx) % 2 ? '#fff' : '#241e2e';
      ctx.fillRect(ROAD_X + cx * sq, y + r * sq, sq, sq);
    }
  }
}

function draw() {
  drawRoad();
  const g = state.game;
  if (!g) return;

  if (g.finishY !== null) drawFinish(g.finishY - 18);

  for (const p of g.pickups) {
    // bình nitro — vẽ tia chớp xanh
    const x = laneX(p.lane);
    ctx.fillStyle = '#2fb4ff';
    ctx.beginPath();
    ctx.arc(x, p.y, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '900 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⚡', x, p.y + 1);
  }

  for (const c of g.traffic) {
    if (c.kind === 'cone') {
      const img = IMAGES.cone;
      if (img.complete && img.naturalWidth) ctx.drawImage(img, laneX(c.lane) - 14, c.y - 14, 28, 28);
    } else {
      drawCar(TRAFFIC_COLORS[c.color % TRAFFIC_COLORS.length], laneX(c.lane), c.y, CAR_W, CAR_H, true);
    }
  }

  // vệt nitro sáng sau đuôi xe
  if (g.nitroMs > 0) {
    state.trail.push({ x: g.x + (Math.random() - 0.5) * 10, y: PLAYER_Y + CAR_H / 2, life: 16 });
  }
  for (const tr of state.trail) {
    tr.y += 7;
    tr.life -= 1;
    ctx.globalAlpha = Math.max(0, tr.life / 16);
    ctx.fillStyle = '#7fd4ff';
    ctx.beginPath();
    ctx.arc(tr.x, tr.y, 3 + (16 - tr.life) * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  state.trail = state.trail.filter((tr) => tr.life > 0);

  const blink = g.invincibleMs > 0 ? (Math.floor(performance.now() / 120) % 2 ? 0.35 : 0.85) : 1;
  ctx.globalAlpha = blink;
  drawCar('car_red', g.x, PLAYER_Y, CAR_W, CAR_H);
  ctx.globalAlpha = 1;
}

/* ===== HUD & vòng lặp ===== */

function updateHud() {
  const g = state.game;
  els.hudScore.textContent = g.score;
  els.hudDist.textContent = `${Math.min(100, Math.floor((g.distance / g.target) * 100))}%`;
  els.hudLives.textContent = '❤️'.repeat(Math.max(0, g.lives)) + '🖤'.repeat(START_LIVES - Math.max(0, g.lives));
  els.hudLevel.textContent = `${t('daovang.level', 'Màn')} ${g.level + 1}`;
}

function loop(now) {
  const dtMs = Math.min(50, now - state.last);
  state.last = now;
  const g = state.game;
  const ev = stepGame(g, dtMs, Math.random);
  state.roadScroll += g.speed * (dtMs / 16.67);
  if (ev.crash) sfx.fail();
  if (ev.overtake) sfx.select();
  if (ev.nitro) { sfx.levelWin(); speak(t('taydua.nitro', 'Tăng tốc!')); }
  if (ev.finishVisible) speak(t('taydua.finish', 'Vạch đích kia rồi!'));
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
    mode: 'taydua',
    result: g.won ? 'win' : 'quit',
    score: g.score,
    level: g.level + 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  if (g.won) {
    sfx.levelWin();
    confetti();
    els.ovEmoji.textContent = '🏆';
    els.ovText.textContent = `${t('taydua.win', 'Về đích rồi!')}\n⭐ ${g.score}`;
    els.btnPlay.textContent = t('taydua.next', 'MÀN TIẾP ▶');
    speak(t('taydua.win', 'Về đích rồi!'));
  } else {
    sfx.gameOver();
    els.ovEmoji.textContent = '💥';
    els.ovText.textContent = `${t('taydua.lose', 'Xe móp hết rồi!')}\n⭐ ${g.score}`;
    els.btnPlay.textContent = t('ran.retry', 'CHƠI LẠI ▶');
    speak(t('taydua.lose', 'Xe móp hết rồi, chơi lại nhé!'));
  }
  els.overlay.classList.remove('hidden');
}

function startLevel() {
  els.overlay.classList.add('hidden');
  state.game = makeLevel(state.level);
  state.trail = [];
  state.startedAt = Date.now();
  state.last = performance.now();
  updateHud();
  state.raf = requestAnimationFrame(loop);
}

/* ===== Điều khiển: chạm làn / vuốt + bàn phím ===== */

els.wrap.addEventListener('pointerdown', (e) => {
  const g = state.game;
  if (!g || g.over) return;
  const rect = els.canvas.getBoundingClientRect();
  steerTo(g, ((e.clientX - rect.left) / rect.width) * FIELD_W);
});
document.addEventListener('keydown', (e) => {
  const g = state.game;
  if (!g || g.over) return;
  if (e.key === 'ArrowLeft' || e.key === 'a') steer(g, -1);
  else if (e.key === 'ArrowRight' || e.key === 'd') steer(g, 1);
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
sayInstruction(t('taydua.help', 'Chạm vào làn nào là xe lách sang làn đó! Né xe chạy chậm phía trước, nhặt tia chớp xanh để tăng tốc vù vù. Chạy đủ quãng đường sẽ thấy vạch đích ca-rô — chạm vạch là thắng!'));
state.game = makeLevel(0);
updateHud();
draw();

// Hook cho e2e test
window.__taydua = { state, startLevel };

mountKidFeatures(); // thanh avatar bé + huy hiệu sao header + kiểm tra giới hạn phút/ngày (áp dụng cho mọi game, kể cả game giải trí thuần)
