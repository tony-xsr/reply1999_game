// Điều phối Cờ Ca-rô: 3×3 (3 thẳng hàng) hoặc 9×9 (5 thẳng hàng),
// chơi 2 người trên cùng máy hoặc đấu với máy (bé luôn cầm ❌ đi trước).

import { createBoard, winner, aiMove } from './caro.js';
import { speak, bindMute } from '../../to-mau/src/speech.js';
import { sfx } from '../../pokemon/src/sfx.js';
import { currentProfile, recordSession } from '../../pokemon/src/stats.js';

const t = (key, fallback) => {
  const v = window.I18N?.t(key);
  return v && v !== key ? v : fallback;
};

const $ = (id) => document.getElementById(id);
const els = {
  board: $('board'),
  tab3: $('tab3'), tab9: $('tab9'), tabAi: $('tabAi'), tab2p: $('tab2p'),
  scoreX: $('scoreX'), scoreO: $('scoreO'), turnLabel: $('turnLabel'),
  btnNew: $('btnNew'), btnSound: $('btnSound'),
  cheer: $('cheer'), cheerEmoji: $('cheerEmoji'), cheerText: $('cheerText'), btnAgain: $('btnAgain'),
};

const SIZES = { 3: { n: 3, k: 3 }, 9: { n: 9, k: 5 } };

const state = {
  size: 3,
  vsAi: true,
  cells: null,
  turn: 'x',       // ❌ đi trước; đấu máy thì bé là ❌
  over: false,
  scores: { x: 0, o: 0 },
  startedAt: Date.now(),
};

bindMute(() => sfx.muted);
const MARK = { x: '❌', o: '⭕' };

function newRound() {
  const { n } = SIZES[state.size];
  state.cells = createBoard(n);
  state.turn = 'x';
  state.over = false;
  state.startedAt = Date.now();
  els.cheer.classList.add('hidden');
  els.board.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
  els.board.innerHTML = '';
  const fontPct = state.size === 3 ? 3 : 1.15;
  for (let i = 0; i < n * n; i++) {
    const cell = document.createElement('button');
    cell.className = 'cell';
    cell.style.fontSize = `${fontPct}rem`;
    cell.addEventListener('click', () => onCell(i));
    els.board.appendChild(cell);
  }
  updateHud();
}

function updateHud() {
  els.scoreX.textContent = `❌ ${state.scores.x}`;
  els.scoreO.textContent = `⭕ ${state.scores.o}`;
  els.turnLabel.textContent = state.over
    ? ''
    : `${MARK[state.turn]} ${t('caro.turn', 'đi nào')}${state.vsAi && state.turn === 'o' ? ' 🤖' : ''}`;
}

function place(idx) {
  const cell = els.board.children[idx];
  state.cells[idx] = state.turn;
  cell.textContent = MARK[state.turn];
  cell.classList.add(state.turn, 'pop');
  els.board.querySelector('.last')?.classList.remove('last');
  cell.classList.add('last');
  sfx.select();

  const { n, k } = SIZES[state.size];
  const result = winner(state.cells, n, k);
  if (result) return endRound(result);

  state.turn = state.turn === 'x' ? 'o' : 'x';
  updateHud();
  if (state.vsAi && state.turn === 'o') setTimeout(aiTurn, 420);
  return null;
}

function onCell(idx) {
  if (state.over || state.cells[idx]) return;
  if (state.vsAi && state.turn === 'o') return; // đang tới lượt máy
  place(idx);
}

function aiTurn() {
  if (state.over) return;
  const { n, k } = SIZES[state.size];
  const idx = aiMove(state.cells, n, k, 'o', 'x');
  if (idx >= 0) place(idx);
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

function endRound(result) {
  state.over = true;
  const draw = result === 'draw';
  if (!draw) {
    state.scores[result.player]++;
    for (const i of result.line) els.board.children[i].classList.add('winline');
  }
  updateHud();

  // Ghi thống kê: đấu máy → thắng/thua thật; 2 người/hòa → trung tính
  const humanWon = !draw && (!state.vsAi || result.player === 'x');
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'cocaro',
    result: draw ? 'duel' : (state.vsAi ? (result.player === 'x' ? 'win' : 'loss') : 'duel'),
    score: draw ? 5 : (humanWon ? 10 : 0),
    level: state.size,
    seconds: (Date.now() - state.startedAt) / 1000,
  });

  setTimeout(() => {
    if (draw) {
      els.cheerEmoji.textContent = '🤝';
      els.cheerText.textContent = t('caro.draw', 'Hòa rồi!');
      sfx.shuffle();
    } else if (state.vsAi && result.player === 'o') {
      els.cheerEmoji.textContent = '🤖';
      els.cheerText.textContent = t('caro.ai.win', 'Máy thắng — thử lại nhé!');
      sfx.gameOver();
    } else {
      els.cheerEmoji.textContent = '🏆';
      els.cheerText.textContent = `${MARK[result.player]} ${t('caro.win', 'thắng rồi!')}`;
      sfx.levelWin();
      confetti();
      speak('Hoan hô! Thắng rồi!');
    }
    els.cheer.classList.remove('hidden');
  }, draw ? 300 : 800);
}

/* ===== Nút ===== */

function selectSize(size) {
  state.size = size;
  els.tab3.classList.toggle('active', size === 3);
  els.tab9.classList.toggle('active', size === 9);
  sfx.select();
  newRound();
}

function selectVs(vsAi) {
  state.vsAi = vsAi;
  els.tabAi.classList.toggle('active', vsAi);
  els.tab2p.classList.toggle('active', !vsAi);
  state.scores = { x: 0, o: 0 };
  sfx.select();
  newRound();
}

els.tab3.addEventListener('click', () => selectSize(3));
els.tab9.addEventListener('click', () => selectSize(9));
els.tabAi.addEventListener('click', () => selectVs(true));
els.tab2p.addEventListener('click', () => selectVs(false));
els.btnNew.addEventListener('click', () => { sfx.shuffle(); newRound(); });
els.btnAgain.addEventListener('click', () => { sfx.select(); newRound(); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
newRound();

// Hook cho e2e test
window.__caro = { state, newRound, selectSize, selectVs, onCell };
