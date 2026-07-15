// Điều phối Đào Hầm Vàng: dựng bàn 7×7, kéo vẽ đường liền kề cho bóng lăn tới đích,
// nhặt vàng dọc đường, né chướng ngại vật.

import { makeLevel, applyPath, ROWS, COLS } from './daohamvang.js';
import { speak, bindMute } from '../../to-mau/src/speech.js';
import { sfx } from '../../pokemon/src/sfx.js';
import { currentProfile, recordSession } from '../../pokemon/src/stats.js';

const t = (key, fallback) => {
  const v = window.I18N?.t(key);
  return v && v !== key ? v : fallback;
};

const $ = (id) => document.getElementById(id);
const els = {
  board: $('board'), btnNew: $('btnNew'), btnHelp: $('btnHelp'), btnSound: $('btnSound'),
  hudCoins: $('hudCoins'), hudCoinsTotal: $('hudCoinsTotal'), hudSteps: $('hudSteps'), hudLevel: $('hudLevel'),
  cheer: $('cheer'), cheerEmoji: $('cheerEmoji'), cheerText: $('cheerText'), btnCheerGo: $('btnCheerGo'),
};

const state = {
  level: 0, game: null, cellEls: null, drawing: false, currentPath: [],
  startedAt: Date.now(), instruction: '',
};
bindMute(() => sfx.muted);

/** Đọc hướng dẫn + lưu lại để bấm ❓ nghe lại được (bé chưa đọc chữ vẫn chơi được). */
function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

function buildBoard() {
  els.board.innerHTML = '';
  state.cellEls = [];
  for (let r = 0; r < ROWS; r++) {
    const row = [];
    for (let c = 0; c < COLS; c++) {
      const btn = document.createElement('button');
      btn.className = 'cell';
      btn.dataset.r = r;
      btn.dataset.c = c;
      els.board.appendChild(btn);
      row.push(btn);
    }
    state.cellEls.push(row);
  }
}

function render() {
  const g = state.game;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const el = state.cellEls[r][c];
      const cellType = g.grid[r][c];
      const isStart = r === g.start.r && c === g.start.c;
      const isGoal = r === g.goal.r && c === g.goal.c;
      let cls = 'cell';
      if (cellType === 'obstacle') cls += ' obstacle';
      else if (isStart) cls += ' start';
      else if (isGoal) cls += ' goal';
      el.className = cls;
      el.innerHTML = '';
      const key = `${r},${c}`;
      if (g.coins.has(key) && !g.collected.has(key)) {
        const coin = document.createElement('span');
        coin.className = 'coin-mark';
        coin.textContent = '💰';
        el.appendChild(coin);
      }
      if (isGoal && !(g.ball.r === r && g.ball.c === c)) {
        const flag = document.createElement('span');
        flag.className = 'flag';
        flag.textContent = '🚩';
        el.appendChild(flag);
      }
      if (g.ball.r === r && g.ball.c === c) {
        const ball = document.createElement('span');
        ball.className = 'ball';
        ball.textContent = '⚽';
        el.appendChild(ball);
      }
    }
  }
  renderPath();
  els.hudCoins.textContent = g.collected.size;
  els.hudCoinsTotal.textContent = g.coins.size;
  els.hudSteps.textContent = g.stepsLeft;
  els.hudLevel.textContent = `${t('daovang.level', 'Màn')} ${g.level + 1}`;
}

function renderPath() {
  for (const row of state.cellEls) for (const el of row) el.classList.remove('in-path');
  for (const [r, c] of state.currentPath) state.cellEls[r][c].classList.add('in-path');
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
  const g = state.game;
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'daohamvang',
    result: g.won ? 'win' : 'quit',
    score: g.collected.size * 10,
    level: g.level + 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  if (g.won) {
    sfx.levelWin();
    confetti();
    els.cheerEmoji.textContent = g.allCoins ? '🌟' : '🏆';
    const bonus = g.allCoins ? `\n${t('hamvang2.allcoins', 'Nhặt hết vàng luôn!')}` : '';
    els.cheerText.textContent = `${t('hamvang2.win', 'Bóng về đích rồi!')}\n💰 ${g.collected.size}/${g.coins.size}${bonus}`;
    els.btnCheerGo.textContent = t('hamvang2.next', 'MÀN TIẾP ▶');
    els.btnCheerGo.onclick = () => { sfx.select(); state.level++; startLevel(); };
    speak(g.allCoins ? 'Tuyệt vời! Bóng về đích và nhặt hết vàng luôn!' : t('hamvang2.win', 'Bóng về đích rồi!'));
  } else {
    sfx.gameOver();
    els.cheerEmoji.textContent = '😵';
    els.cheerText.textContent = `${t('hamvang2.lose', 'Hết bước rồi, bóng chưa về đích!')}\n💰 ${g.collected.size}/${g.coins.size}`;
    els.btnCheerGo.textContent = t('ran.retry', 'CHƠI LẠI ▶');
    els.btnCheerGo.onclick = () => { sfx.select(); state.level = 0; startLevel(); };
    speak(t('hamvang2.lose', 'Hết bước rồi, chơi lại nhé!'));
  }
  els.cheer.classList.remove('hidden');
}

/* ===== Kéo vẽ đường ===== */

function cellFromPoint(x, y) {
  const el = document.elementFromPoint(x, y);
  // elementFromPoint có thể trả về span con (bóng/vàng/cờ) bên trong nút .cell,
  // nên phải tìm lên tới đúng phần tử .cell chứa toạ độ hàng/cột.
  const cellEl = el?.closest('.cell');
  if (!cellEl || cellEl.dataset.r === undefined) return null;
  return { r: Number(cellEl.dataset.r), c: Number(cellEl.dataset.c) };
}

function finishDraw() {
  const g = state.game;
  const path = state.currentPath;
  state.currentPath = [];
  if (path.length < 2) { renderPath(); return; }
  const result = applyPath(g, path);
  if (!result) { render(); return; }
  sfx.select();
  if (result.coins > 0) sfx.match(Math.min(3, result.coins));
  render();
  if (g.over) setTimeout(endLevel, 400);
}

els.board.addEventListener('pointerdown', (e) => {
  const g = state.game;
  if (g.over) return;
  const cell = cellFromPoint(e.clientX, e.clientY);
  if (!cell || cell.r !== g.ball.r || cell.c !== g.ball.c) return;
  e.preventDefault();
  state.drawing = true;
  state.currentPath = [[cell.r, cell.c]];
  renderPath();
});
els.board.addEventListener('pointermove', (e) => {
  if (!state.drawing) return;
  const cell = cellFromPoint(e.clientX, e.clientY);
  if (!cell) return;
  const path = state.currentPath;
  const last = path[path.length - 1];
  if (cell.r === last[0] && cell.c === last[1]) return;
  if (path.length >= 2) {
    const prev = path[path.length - 2];
    if (cell.r === prev[0] && cell.c === prev[1]) { path.pop(); renderPath(); return; }
  }
  if (Math.abs(cell.r - last[0]) + Math.abs(cell.c - last[1]) !== 1) return;
  if (state.game.grid[cell.r][cell.c] === 'obstacle') return;
  if (path.some(([r, c]) => r === cell.r && c === cell.c)) return;
  path.push([cell.r, cell.c]);
  renderPath();
});
els.board.addEventListener('pointerup', () => { if (state.drawing) { state.drawing = false; finishDraw(); } });
els.board.addEventListener('pointercancel', () => { state.drawing = false; state.currentPath = []; renderPath(); });

/* ===== Nút ===== */

function startLevel() {
  els.cheer.classList.add('hidden');
  state.currentPath = [];
  state.game = makeLevel(state.level, Math.random);
  state.startedAt = Date.now();
  render();
}

els.btnNew.addEventListener('click', () => { sfx.shuffle(); state.level = 0; startLevel(); });
els.btnHelp.addEventListener('click', () => { sfx.select(); speak(state.instruction); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
buildBoard();
sayInstruction(t('hamvang2.help', 'Kéo tay từ quả bóng qua các ô liền kề để vẽ đường — bóng sẽ lăn theo, nhặt vàng và né chỗ có đá xám, cố về tới lá cờ nhé!'));
startLevel();

// Hook cho e2e test
window.__hamvang2 = { state, startLevel };
