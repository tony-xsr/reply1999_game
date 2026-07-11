// Điều phối Xếp Gạch: vòng lặp rơi + vẽ canvas + điều khiển phím/d-pad/vuốt.
// Tốc độ khởi đầu chậm (900ms/nhịp) — thân thiện với trẻ em.

import { createGame, tick, move, rotate, hardDrop, COLS, ROWS } from './tetris.js';
import { bindMute } from '../../to-mau/src/speech.js';
import { sfx } from '../../pokemon/src/sfx.js';
import { currentProfile, recordSession } from '../../pokemon/src/stats.js';

const t = (key, fallback) => {
  const v = window.I18N?.t(key);
  return v && v !== key ? v : fallback;
};

const $ = (id) => document.getElementById(id);
const els = {
  canvas: $('gameCanvas'), next: $('nextCanvas'),
  score: $('score'), lines: $('lines'),
  overlay: $('overlay'), ovEmoji: $('ovEmoji'), ovText: $('ovText'), btnPlay: $('btnPlay'),
  btnSound: $('btnSound'),
};

const TICK_START = 900;
const TICK_MIN = 250;

const state = { game: null, timer: null, running: false, startedAt: Date.now() };
const ctx = els.canvas.getContext('2d');
const nctx = els.next.getContext('2d');
bindMute(() => sfx.muted);

/* ===== Vẽ ===== */

function drawCell(c, x, y, size, color) {
  c.fillStyle = color;
  c.beginPath();
  c.roundRect(x + 1, y + 1, size - 2, size - 2, 4);
  c.fill();
  c.fillStyle = 'rgba(255,255,255,0.35)';
  c.beginPath();
  c.roundRect(x + 3, y + 3, size - 6, (size - 6) * 0.4, 3);
  c.fill();
}

function draw() {
  const g = state.game;
  const size = els.canvas.width / COLS;
  ctx.clearRect(0, 0, els.canvas.width, els.canvas.height);
  // lưới mờ
  ctx.strokeStyle = '#f3e9d4';
  for (let x = 1; x < COLS; x++) {
    ctx.beginPath(); ctx.moveTo(x * size, 0); ctx.lineTo(x * size, ROWS * size); ctx.stroke();
  }
  for (let y = 1; y < ROWS; y++) {
    ctx.beginPath(); ctx.moveTo(0, y * size); ctx.lineTo(COLS * size, y * size); ctx.stroke();
  }
  if (!g) return;
  g.grid.forEach((row, y) => row.forEach((color, x) => {
    if (color) drawCell(ctx, x * size, y * size, size, color);
  }));
  for (const [cx, cy] of g.cur.cells) {
    const gy = g.cur.y + cy;
    if (gy >= 0) drawCell(ctx, (g.cur.x + cx) * size, gy * size, size, g.cur.color);
  }
  // Khối kế tiếp
  nctx.clearRect(0, 0, els.next.width, els.next.height);
  const ns = 24;
  for (const [cx, cy] of g.next.cells) {
    drawCell(nctx, (cx + 1.5) * ns, (cy + 0.6) * ns, ns, g.next.color);
  }
}

/* ===== Vòng lặp ===== */

const delay = () => Math.max(TICK_MIN, TICK_START - state.game.lines * 35);

function loop() {
  const result = tick(state.game);
  afterStep(result);
  if (state.running) state.timer = setTimeout(loop, delay());
}

function afterStep(result) {
  const g = state.game;
  els.score.textContent = g.score;
  els.lines.textContent = `${g.lines} ${t('xepgach.lines', 'dòng')}`;
  if (result === 'over') return gameOver();
  if (result?.locked) sfx.match(result.cleared ? 3 : 1);
  draw();
  return null;
}

function start() {
  clearTimeout(state.timer);
  state.game = createGame();
  state.running = true;
  state.startedAt = Date.now();
  els.overlay.classList.add('hidden');
  els.score.textContent = '0';
  els.lines.textContent = `0 ${t('xepgach.lines', 'dòng')}`;
  draw();
  state.timer = setTimeout(loop, delay());
}

function gameOver() {
  clearTimeout(state.timer);
  state.running = false;
  sfx.gameOver();
  draw();
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'xepgach',
    result: 'quit', // giải trí — không tính vào tỷ lệ thắng
    score: state.game.score,
    level: state.game.lines,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  els.ovEmoji.textContent = '🧱';
  els.ovText.textContent = `${t('xepgach.over', 'Đầy bàn rồi!')}\n${t('pika.end.score', 'Điểm của bạn')}: ${state.game.score}`;
  els.btnPlay.textContent = t('ran.retry', 'CHƠI LẠI ▶');
  els.overlay.classList.remove('hidden');
}

/* ===== Điều khiển ===== */

function act(name) {
  if (!state.running) return;
  const g = state.game;
  if (name === 'left' && move(g, -1)) sfx.select();
  if (name === 'right' && move(g, 1)) sfx.select();
  if (name === 'rotate' && rotate(g)) sfx.select();
  if (name === 'down') afterStep(tick(g));
  if (name === 'drop') afterStep(hardDrop(g));
  draw();
}

document.addEventListener('keydown', (e) => {
  const map = {
    ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'rotate', ArrowDown: 'down',
    ' ': 'drop', a: 'left', d: 'right', w: 'rotate', s: 'down',
  };
  const name = map[e.key];
  if (!name) return;
  e.preventDefault();
  act(name);
});

for (const btn of document.querySelectorAll('.dpad-btn')) {
  btn.addEventListener('pointerdown', (e) => { e.preventDefault(); act(btn.dataset.act); });
}

// Chạm bàn: nửa trái/phải = qua trái/phải, chạm giữa = xoay, vuốt xuống = thả
let touchFrom = null;
els.canvas.addEventListener('pointerdown', (e) => { touchFrom = { x: e.clientX, y: e.clientY, t: Date.now() }; });
els.canvas.addEventListener('pointerup', (e) => {
  if (!touchFrom) return;
  const dy = e.clientY - touchFrom.y;
  const dx = e.clientX - touchFrom.x;
  const rect = els.canvas.getBoundingClientRect();
  touchFrom = null;
  if (dy > 60 && Math.abs(dy) > Math.abs(dx)) return act('drop');
  if (Math.abs(dx) < 18 && Math.abs(dy) < 18) {
    const rel = (e.clientX - rect.left) / rect.width;
    return act(rel < 0.33 ? 'left' : rel > 0.67 ? 'right' : 'rotate');
  }
  return null;
});

els.btnPlay.addEventListener('click', start);
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden && state.running) {
    clearTimeout(state.timer);
    state.running = false;
    els.ovEmoji.textContent = '⏸';
    els.ovText.textContent = t('ran.paused', 'Tạm dừng');
    els.btnPlay.textContent = t('ran.resume', 'TIẾP TỤC ▶');
    els.overlay.classList.remove('hidden');
  }
});
// Nút CHƠI thông minh: ván dở còn sống → tiếp tục, ngược lại → ván mới
els.btnPlay.addEventListener('click', (e) => {
  if (state.game && !state.game.over && !state.running) {
    e.stopImmediatePropagation();
    state.running = true;
    els.overlay.classList.add('hidden');
    state.timer = setTimeout(loop, delay());
  }
}, { capture: true });

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
draw();

// Hook cho e2e test
window.__xepgach = { state, start, act };
