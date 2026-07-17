// Điều phối Rắn Săn Mồi: vòng lặp game + vẽ canvas + điều khiển
// (phím mũi tên/WASD, vuốt màn hình, d-pad). Tốc độ chậm thân thiện với bé.

import { createGame, step, turn, targetLabel, MODE_SEQ } from './snake.js';
import { speak, bindMute } from '../../to-mau/src/speech.js';
import { sfx } from '../../pokemon/src/sfx.js';
import { currentProfile, recordSession } from '../../pokemon/src/stats.js';

const t = (key, fallback) => {
  const v = window.I18N?.t(key);
  return v && v !== key ? v : fallback;
};

const $ = (id) => document.getElementById(id);
const els = {
  canvas: $('gameCanvas'), wrap: $('boardWrap'),
  target: $('target'), score: $('score'),
  tabs: { classic: $('tabClassic'), abc: $('tabAbc'), num: $('tabNum') },
  overlay: $('overlay'), ovEmoji: $('ovEmoji'), ovText: $('ovText'), btnPlay: $('btnPlay'),
  btnHelp: $('btnHelp'), btnSound: $('btnSound'),
};

const COLS = 17;
const ROWS = 15;
const TICK_START = 260;   // ms mỗi nhịp — chậm cho bé
const TICK_MIN = 150;

const state = {
  mode: 'classic',
  game: null,
  timer: null,
  running: false,
  paused: false,
  startedAt: Date.now(),
  instruction: '',
};

function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

const ctx = els.canvas.getContext('2d');
bindMute(() => sfx.muted);

const DIRS = {
  up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 },
};

/* ===== Vẽ ===== */

function draw() {
  const g = state.game;
  const W = els.canvas.width;
  const H = els.canvas.height;
  const cw = W / COLS;
  const ch = H / ROWS;

  // Nền cỏ kẻ ca-rô nhạt
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      ctx.fillStyle = (x + y) % 2 ? '#ddf0cd' : '#e8f6dc';
      ctx.fillRect(x * cw, y * ch, cw + 1, ch + 1);
    }
  }
  if (!g) return;

  // Mồi
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const f of g.foods) {
    const isTarget = f.label === targetLabel(g);
    if (MODE_SEQ[g.mode]) {
      ctx.fillStyle = isTarget ? '#ff8a3d' : '#c9bfd6';
      ctx.beginPath();
      ctx.arc((f.x + 0.5) * cw, (f.y + 0.5) * ch, Math.min(cw, ch) * 0.42, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = `900 ${Math.min(cw, ch) * 0.52}px Arial, sans-serif`;
      ctx.fillText(f.label, (f.x + 0.5) * cw, (f.y + 0.53) * ch);
    } else {
      ctx.font = `${Math.min(cw, ch) * 0.8}px sans-serif`;
      ctx.fillText(f.label, (f.x + 0.5) * cw, (f.y + 0.55) * ch);
    }
  }

  // Rắn: thân bo tròn, đầu có mắt
  for (let i = g.snake.length - 1; i >= 0; i--) {
    const s = g.snake[i];
    const pad = i === 0 ? 1 : 2;
    ctx.fillStyle = i === 0 ? '#2f9e44' : (i % 2 ? '#51b45f' : '#69c176');
    roundRect((s.x * cw) + pad, (s.y * ch) + pad, cw - pad * 2, ch - pad * 2, 7);
  }
  const head = g.snake[0];
  ctx.fillStyle = '#fff';
  const ex = (head.x + 0.5 + g.dir.x * 0.16) * cw;
  const ey = (head.y + 0.5 + g.dir.y * 0.16) * ch;
  const perp = { x: -g.dir.y, y: g.dir.x };
  for (const sign of [-1, 1]) {
    ctx.beginPath();
    ctx.arc(ex + perp.x * cw * 0.17 * sign, ey + perp.y * ch * 0.17 * sign, cw * 0.09, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#1d3a24';
  for (const sign of [-1, 1]) {
    ctx.beginPath();
    ctx.arc(ex + perp.x * cw * 0.17 * sign + g.dir.x, ey + perp.y * ch * 0.17 * sign + g.dir.y, cw * 0.045, 0, Math.PI * 2);
    ctx.fill();
  }
}

function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

/* ===== Vòng lặp ===== */

function tickDelay() {
  const g = state.game;
  return Math.max(TICK_MIN, TICK_START - g.score * 2);
}

function loop() {
  const g = state.game;
  const result = step(g);
  els.score.textContent = g.score;
  els.target.textContent = MODE_SEQ[g.mode]
    ? `${t('ran.eat', 'Ăn')}: ${targetLabel(g)}`
    : '🍎';

  if (result === 'eat') {
    sfx.match(2);
    const seq = MODE_SEQ[g.mode];
    if (seq) speak(g.mode === 'num' ? `Số ${seq[g.seqIdx - 1]}` : seq[g.seqIdx - 1]);
  } else if (result === 'wrong') {
    sfx.fail();
    speak(`${t('ran.find', 'Tìm')} ${targetLabel(g)} ${t('ran.please', 'nhé')}!`);
  } else if (result === 'dead') {
    return gameOver();
  } else if (result === 'win') {
    return winGame();
  }

  draw();
  state.timer = setTimeout(loop, tickDelay());
}

function start() {
  clearTimeout(state.timer);
  // Đang tạm dừng (ẩn tab) → chơi tiếp ván dở, không tạo ván mới
  if (state.paused && state.game?.alive && !state.game.won) {
    state.paused = false;
    state.running = true;
    els.overlay.classList.add('hidden');
    state.timer = setTimeout(loop, tickDelay());
    return;
  }
  state.paused = false;
  state.game = createGame(state.mode, COLS, ROWS);
  state.running = true;
  state.startedAt = Date.now();
  els.overlay.classList.add('hidden');
  els.score.textContent = '0';
  els.target.textContent = MODE_SEQ[state.mode] ? `${t('ran.eat', 'Ăn')}: ${targetLabel(state.game)}` : '🍎';
  draw();
  if (MODE_SEQ[state.mode]) speak(`${t('ran.find', 'Tìm')} ${targetLabel(state.game)}!`);
  state.timer = setTimeout(loop, tickDelay());
}

function stopAndRecord(result) {
  clearTimeout(state.timer);
  state.running = false;
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'ransanmoi',
    result,
    score: state.game.score,
    level: state.game.snake.length,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
}

function gameOver() {
  stopAndRecord('quit'); // không tính vào tỷ lệ thắng — game giải trí
  sfx.gameOver();
  draw();
  els.ovEmoji.textContent = '😵';
  els.ovText.textContent = `${t('ran.over', 'Ôi, rắn tự cắn mình rồi!')}\n${t('pika.end.score', 'Điểm của bạn')}: ${state.game.score}`;
  els.btnPlay.textContent = t('ran.retry', 'CHƠI LẠI ▶');
  els.overlay.classList.remove('hidden');
}

function winGame() {
  stopAndRecord('win');
  sfx.levelWin();
  draw();
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
  els.ovEmoji.textContent = '🏆';
  els.ovText.textContent = state.mode === 'abc'
    ? t('ran.win.abc', 'Tuyệt vời! Ăn hết A đến Z!')
    : t('ran.win.num', 'Tuyệt vời! Ăn hết 1 đến 9!');
  els.btnPlay.textContent = t('ran.retry', 'CHƠI LẠI ▶');
  els.overlay.classList.remove('hidden');
  speak(state.mode === 'abc' ? 'Tuyệt vời! Bé thuộc bảng chữ cái rồi!' : 'Tuyệt vời! Bé đếm giỏi quá!');
}

/* ===== Điều khiển ===== */

function go(name) {
  if (!state.running || !state.game) return;
  turn(state.game, DIRS[name]);
}

document.addEventListener('keydown', (e) => {
  const map = {
    ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
    w: 'up', s: 'down', a: 'left', d: 'right',
  };
  const name = map[e.key];
  if (!name) return;
  e.preventDefault();
  go(name);
});

// Vuốt trên bàn chơi
let swipeFrom = null;
els.wrap.addEventListener('pointerdown', (e) => { swipeFrom = { x: e.clientX, y: e.clientY }; });
els.wrap.addEventListener('pointerup', (e) => {
  if (!swipeFrom) return;
  const dx = e.clientX - swipeFrom.x;
  const dy = e.clientY - swipeFrom.y;
  swipeFrom = null;
  if (Math.hypot(dx, dy) < 24) return;
  go(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
});

for (const btn of document.querySelectorAll('.dpad-btn')) {
  btn.addEventListener('pointerdown', (e) => { e.preventDefault(); go(btn.dataset.dir); });
}

function selectMode(mode) {
  state.mode = mode;
  for (const [k, el] of Object.entries(els.tabs)) el.classList.toggle('active', k === mode);
  sfx.select();
  start();
}

els.tabs.classic.addEventListener('click', () => selectMode('classic'));
els.tabs.abc.addEventListener('click', () => selectMode('abc'));
els.tabs.num.addEventListener('click', () => selectMode('num'));
els.btnPlay.addEventListener('click', start);
els.btnHelp.addEventListener('click', () => { sfx.select(); speak(state.instruction); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});

// Tab ẩn → tạm dừng cho công bằng
document.addEventListener('visibilitychange', () => {
  if (document.hidden && state.running) {
    clearTimeout(state.timer);
    state.running = false;
    state.paused = true;
    els.ovEmoji.textContent = '⏸';
    els.ovText.textContent = t('ran.paused', 'Tạm dừng');
    els.btnPlay.textContent = t('ran.resume', 'TIẾP TỤC ▶');
    els.overlay.classList.remove('hidden');
  }
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
sayInstruction(t('ran.help', 'Dùng nút mũi tên hoặc vuốt để dẫn rắn đi ăn mồi — ăn xong rắn dài thêm ra! Đừng để rắn đụng tường hay đụng chính mình nhé. Có 3 chế độ: Cổ điển ăn táo, A tới Z ăn đúng thứ tự chữ cái, 1 tới 9 ăn đúng thứ tự số.'));
draw();

// Hook cho e2e test
window.__ran = { state, start, selectMode, go };
