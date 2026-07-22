// Điều phối Cơn Sốt Tìm Vàng: lưới đá quý vẽ canvas (viên đá có vân + ánh kim),
// bấm cụm cùng màu, hiệu ứng rơi lấp đầy, viền vàng rực khi bùng CƠN SỐT.

import {
  COLS, ROWS, ROUND_MS, FEVER_AT,
  makeLevel, findCluster, tapAt, dragTo, tick,
} from './consot.js';
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
  hudScore: $('hudScore'), hudTarget: $('hudTarget'), hudTime: $('hudTime'),
  hudCombo: $('hudCombo'), hudLevel: $('hudLevel'),
  overlay: $('overlay'), ovEmoji: $('ovEmoji'), ovText: $('ovText'), btnPlay: $('btnPlay'),
};
const ctx = els.canvas.getContext('2d');
const CELL = 54;

// 5 màu đá quý: vàng, đỏ ruby, xanh sapphire, xanh ngọc, tím thạch anh
const STONE = [
  ['#ffe082', '#e8a000'], ['#ff8a80', '#c62828'], ['#82b1ff', '#1a56b0'],
  ['#b9f6ca', '#1e8e3e'], ['#ea80fc', '#7b1fa2'],
];

// Vẽ sẵn 5 viên đá vào canvas phụ — nét + nhanh
const stoneSprites = STONE.map(([light, dark]) => {
  const c = document.createElement('canvas');
  c.width = CELL; c.height = CELL;
  const g2 = c.getContext('2d');
  const grad = g2.createRadialGradient(CELL * 0.36, CELL * 0.32, 4, CELL / 2, CELL / 2, CELL * 0.52);
  grad.addColorStop(0, light);
  grad.addColorStop(1, dark);
  g2.fillStyle = grad;
  // viên đá đa giác gồ ghề
  g2.beginPath();
  g2.moveTo(CELL * 0.5, CELL * 0.06);
  g2.lineTo(CELL * 0.9, CELL * 0.3);
  g2.lineTo(CELL * 0.94, CELL * 0.72);
  g2.lineTo(CELL * 0.62, CELL * 0.94);
  g2.lineTo(CELL * 0.14, CELL * 0.82);
  g2.lineTo(CELL * 0.06, CELL * 0.38);
  g2.closePath();
  g2.fill();
  g2.strokeStyle = 'rgba(0,0,0,0.25)';
  g2.lineWidth = 2;
  g2.stroke();
  // vân đá + ánh kim
  g2.strokeStyle = 'rgba(255,255,255,0.5)';
  g2.lineWidth = 2;
  g2.beginPath();
  g2.moveTo(CELL * 0.3, CELL * 0.25);
  g2.lineTo(CELL * 0.45, CELL * 0.42);
  g2.stroke();
  g2.fillStyle = 'rgba(255,255,255,0.85)';
  g2.beginPath();
  g2.arc(CELL * 0.36, CELL * 0.28, 4, 0, Math.PI * 2);
  g2.fill();
  return c;
});

const state = {
  level: 0, game: null, raf: 0, last: 0, startedAt: Date.now(), instruction: '',
  drops: new Map(), // "r,c" → offset rơi còn lại (px) cho hiệu ứng lấp đầy
  bursts: [],
  floaters: [],
  dragging: false, dragPath: [], dragPointer: null, // "r,c" đang kéo qua, vệt sáng theo ngón tay
};
bindMute(() => sfx.muted);

/** Đọc hướng dẫn + lưu lại để bấm ❓ nghe lại được (bé chưa đọc chữ vẫn chơi được). */
function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

/* ===== Vẽ ===== */

function draw(dt) {
  const g = state.game;
  // lòng mỏ tối, cơn sốt thì rực vàng
  const fever = g && g.feverMs > 0;
  ctx.fillStyle = fever ? '#4a3208' : '#241a30';
  ctx.fillRect(0, 0, els.canvas.width, els.canvas.height);
  if (fever) {
    ctx.fillStyle = `rgba(255, 200, 60, ${0.12 + Math.sin(performance.now() / 120) * 0.06})`;
    ctx.fillRect(0, 0, els.canvas.width, els.canvas.height);
  }
  if (!g) return;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const v = g.grid[r][c];
      if (v === null) continue;
      const key = `${r},${c}`;
      let dy = 0;
      if (state.drops.has(key)) {
        dy = state.drops.get(key);
        dy = Math.max(0, dy - 14 * dt);
        if (dy <= 0) state.drops.delete(key);
        else state.drops.set(key, dy);
      }
      ctx.drawImage(stoneSprites[v], c * CELL, r * CELL - dy, CELL, CELL);
    }
  }
  for (const b of state.bursts) {
    b.x += b.vx; b.y += b.vy; b.vy += 0.3; b.life -= 1;
    ctx.globalAlpha = Math.max(0, b.life / 25);
    ctx.fillStyle = b.fill;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  state.bursts = state.bursts.filter((b) => b.life > 0);
  ctx.font = '900 26px sans-serif';
  ctx.textAlign = 'center';
  for (const f of state.floaters) {
    f.y -= 1.3; f.life -= 1;
    ctx.globalAlpha = Math.max(0, f.life / 40);
    ctx.fillStyle = f.fever ? '#ffd93d' : '#fff';
    ctx.fillText(f.text, f.x, f.y);
    ctx.globalAlpha = 1;
  }
  state.floaters = state.floaters.filter((f) => f.life > 0);

  // vệt kéo tay: viền vàng quanh từng ô đã chọn + đường nối sáng lấp lánh
  if (state.dragging && state.dragPath.length) {
    ctx.save();
    ctx.strokeStyle = '#ffd93d';
    ctx.lineWidth = 4;
    for (const [r, c] of state.dragPath) {
      ctx.strokeRect(c * CELL + 3, r * CELL + 3, CELL - 6, CELL - 6);
    }
    if (state.dragPath.length >= 2) {
      ctx.strokeStyle = 'rgba(255, 245, 200, 0.9)';
      ctx.lineWidth = 7;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      state.dragPath.forEach(([r, c], i) => {
        const x = c * CELL + CELL / 2;
        const y = r * CELL + CELL / 2;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }
    ctx.restore();
  }
}

/* ===== HUD & vòng lặp ===== */

function updateHud() {
  const g = state.game;
  els.hudScore.textContent = g.score;
  els.hudTarget.textContent = g.target;
  els.hudTime.textContent = Math.ceil(g.timeLeftMs / 1000);
  els.hudCombo.textContent = g.combo;
  els.hudLevel.textContent = `${t('daovang.level', 'Màn')} ${g.level + 1}`;
}

function loop(now) {
  const dtMs = Math.min(60, now - state.last);
  state.last = now;
  const g = state.game;
  tick(g, dtMs);
  updateHud();
  draw(dtMs / 16.67);
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
    mode: 'consot',
    result: g.won ? 'win' : 'quit',
    score: g.score,
    level: g.level + 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  if (g.won) {
    sfx.levelWin();
    confetti();
    els.ovEmoji.textContent = '🏆';
    els.ovText.textContent = `${t('consot.win', 'Trúng đậm mùa vàng!')}\n⭐ ${g.score} · 🔥 ${g.maxCombo}`;
    els.btnPlay.textContent = t('consot.next', 'MÀN TIẾP ▶');
    speak(t('consot.win', 'Trúng đậm mùa vàng!'));
  } else {
    sfx.gameOver();
    els.ovEmoji.textContent = '⏱️';
    els.ovText.textContent = `${t('consot.lose', 'Hết giờ mất rồi!')}\n⭐ ${g.score}/${g.target}`;
    els.btnPlay.textContent = t('ran.retry', 'CHƠI LẠI ▶');
    speak(t('consot.lose', 'Hết giờ mất rồi, đào lại nhé!'));
  }
  els.overlay.classList.remove('hidden');
}

function startLevel() {
  els.overlay.classList.add('hidden');
  state.game = makeLevel(state.level, Math.random);
  state.drops.clear();
  state.bursts = [];
  state.floaters = [];
  state.startedAt = Date.now();
  state.last = performance.now();
  updateHud();
  state.raf = requestAnimationFrame(loop);
}

/* ===== Bấm cụm HOẶC kéo tay lướt qua nhiều viên cùng màu ===== */

// Đo rect() 1 lần lúc pointerdown, tránh đo lại mỗi pointermove (layout thrashing).
let cellRect = null;
function cellFromEvent(e) {
  const c = Math.floor(((e.clientX - cellRect.left) / cellRect.width) * COLS);
  const r = Math.floor(((e.clientY - cellRect.top) / cellRect.height) * ROWS);
  if (r < 0 || c < 0 || r >= ROWS || c >= COLS) return null;
  return [r, c];
}

/** Hiệu ứng dùng chung cho cả bấm cụm lẫn kéo tay: bụi văng theo màu + số điểm bay lên. */
function playClearFx(g, ev, cellsCleared, anchorR, anchorC) {
  sfx.match(Math.min(3, 1 + Math.floor(ev.cleared / 4)));
  for (const [cr, cc] of cellsCleared) {
    const colorIdx = clearedColors.get(`${cr},${cc}`) ?? 0;
    const color = STONE[colorIdx];
    for (let i = 0; i < 3; i++) {
      state.bursts.push({
        x: cc * CELL + CELL / 2, y: cr * CELL + CELL / 2,
        vx: (Math.random() - 0.5) * 5, vy: -Math.random() * 4,
        r: 3 + Math.random() * 4, fill: color[0], life: 25,
      });
    }
    for (let rr = 0; rr <= cr; rr++) state.drops.set(`${rr},${cc}`, CELL * 1.2);
  }
  state.floaters.push({
    text: `+${ev.gained}${ev.fever ? ' 🔥' : ''}`,
    x: anchorC * CELL + CELL / 2, y: anchorR * CELL, life: 40, fever: g.feverMs > 0,
  });
  if (ev.fever) {
    sfx.levelWin();
    speak(t('consot.fever', 'Cơn sốt vàng! Điểm nhân đôi!'));
  }
  updateHud();
}

// Chụp lại màu của từng ô TRƯỚC khi lưới thay đổi (áp dụng cho cả tap lẫn kéo)
const clearedColors = new Map();
function snapshotColors(cells, g) {
  clearedColors.clear();
  for (const [r, c] of cells) clearedColors.set(`${r},${c}`, g.grid[r][c]);
}

els.wrap.addEventListener('pointerdown', (e) => {
  const g = state.game;
  if (!g || g.over) return;
  cellRect = els.canvas.getBoundingClientRect();
  const cell = cellFromEvent(e);
  if (!cell) return;
  state.dragging = true;
  state.dragPath = [cell];
});

els.wrap.addEventListener('pointermove', (e) => {
  const g = state.game;
  if (!state.dragging || !g || g.over) return;
  const cell = cellFromEvent(e);
  if (!cell) return;
  const [r, c] = cell;
  const path = state.dragPath;
  const [lr, lc] = path[path.length - 1];
  if (lr === r && lc === c) return; // vẫn ô cũ
  if (path.some(([pr, pc]) => pr === r && pc === c)) return; // đã đi qua rồi
  const startColor = g.grid[path[0][0]][path[0][1]];
  const adjacent = Math.abs(lr - r) + Math.abs(lc - c) === 1;
  if (!adjacent || g.grid[r][c] !== startColor) return; // chỉ nối tiếp ô liền kề cùng màu
  path.push(cell);
  sfx.select();
});

els.wrap.addEventListener('pointerup', () => {
  const g = state.game;
  state.dragging = false;
  if (!g || g.over) return;
  const path = state.dragPath;
  state.dragPath = [];
  if (path.length === 0) return;

  if (path.length === 1) {
    // chạm 1 ô không kéo: giữ hành vi cũ — tự dò gom cả cụm cùng màu dính liền
    const [r, c] = path[0];
    const cluster = findCluster(g.grid, r, c);
    snapshotColors(cluster, g);
    const ev = tapAt(g, r, c, Math.random);
    if (!ev.cleared) { sfx.fail(); return; }
    playClearFx(g, ev, cluster, r, c);
  } else {
    // kéo tay: chỉ gom ĐÚNG đường đã lướt qua
    snapshotColors(path, g);
    const ev = dragTo(g, path, Math.random);
    if (!ev.cleared) { sfx.fail(); return; }
    playClearFx(g, ev, path, path[0][0], path[0][1]);
  }
});
els.wrap.addEventListener('pointercancel', () => { state.dragging = false; state.dragPath = []; });

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
sayInstruction(t('consot.help', 'Sáu mươi giây đào cuồng nhiệt! Bấm vào 1 viên để gom cả cụm cùng màu, hoặc KÉO ngón tay lướt qua nhiều viên cùng màu liền kề để gom đúng đường đó — cụm càng to càng nhiều điểm, đá mới rơi xuống lấp đầy liên tục. Gom cụm to thật nhanh liên tiếp sẽ bùng CƠN SỐT VÀNG nhân đôi điểm! Đạt đủ điểm mục tiêu trước khi hết giờ nhé!'));
state.game = makeLevel(0, Math.random);
updateHud();
draw(1);

// Hook cho e2e test
window.__consot = { state, startLevel };

mountKidFeatures(); // thanh avatar bé + huy hiệu sao header + kiểm tra giới hạn phút/ngày (áp dụng cho mọi game, kể cả game giải trí thuần)
