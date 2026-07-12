// Điều phối Cờ Gánh: bàn SVG 5×5 kẻ chéo xen kẽ, chạm quân → chạm điểm trống.
// Bé cầm ĐỎ đi trước; đấu máy hoặc 2 người cùng máy.

import { createGame, legalMoves, play, aiMove, neighbors, count, N } from './coganh.js';
import { speak, bindMute } from '../../to-mau/src/speech.js';
import { sfx } from '../../pokemon/src/sfx.js';
import { currentProfile, recordSession } from '../../pokemon/src/stats.js';

const t = (key, fallback) => {
  const v = window.I18N?.t(key);
  return v && v !== key ? v : fallback;
};

const $ = (id) => document.getElementById(id);
const els = {
  svg: $('boardSvg'), turnLabel: $('turnLabel'), countR: $('countR'), countB: $('countB'),
  tabAi: $('tabAi'), tab2p: $('tab2p'),
  cheer: $('cheer'), cheerEmoji: $('cheerEmoji'), cheerText: $('cheerText'), btnAgain: $('btnAgain'),
  btnNew: $('btnNew'), btnSound: $('btnSound'),
};

const state = {
  vsAi: true,
  game: null,
  selected: null,
  busy: false,
  startedAt: Date.now(),
};

bindMute(() => sfx.muted);
const PAD = 50;
const GAP = 100;
const px = (i) => PAD + (i % N) * GAP;
const py = (i) => PAD + Math.floor(i / N) * GAP;
const COLORS = { r: { fill: '#d84343', edge: '#8e1f1f' }, b: { fill: '#3f74d1', edge: '#1c3f7d' } };
const MARKS = { r: '🔴', b: '🔵' };

/* ===== Vẽ bàn ===== */

function render() {
  const g = state.game;
  const svgNS = 'http://www.w3.org/2000/svg';
  els.svg.innerHTML = '';

  // Đường kẻ: ngang dọc + chéo từ các điểm chẵn
  const lines = [];
  for (let i = 0; i < N * N; i++) {
    for (const nb of neighbors(i)) {
      if (nb > i) lines.push([i, nb]);
    }
  }
  for (const [a, b] of lines) {
    const ln = document.createElementNS(svgNS, 'line');
    ln.setAttribute('x1', px(a)); ln.setAttribute('y1', py(a));
    ln.setAttribute('x2', px(b)); ln.setAttribute('y2', py(b));
    ln.setAttribute('stroke', '#8a6a3a');
    ln.setAttribute('stroke-width', '3');
    els.svg.appendChild(ln);
  }

  const moves = state.selected != null
    ? legalMoves(g).filter((m) => m.from === state.selected).map((m) => m.to)
    : [];

  for (let i = 0; i < N * N; i++) {
    const piece = g.cells[i];
    const spot = document.createElementNS(svgNS, 'circle');
    spot.setAttribute('cx', px(i));
    spot.setAttribute('cy', py(i));
    if (piece) {
      spot.setAttribute('r', '19');
      spot.setAttribute('fill', COLORS[piece].fill);
      spot.setAttribute('stroke', state.selected === i ? '#ffb100' : COLORS[piece].edge);
      spot.setAttribute('stroke-width', state.selected === i ? '6' : '3');
    } else {
      spot.setAttribute('r', moves.includes(i) ? '13' : '7');
      spot.setAttribute('fill', moves.includes(i) ? '#ffb100' : '#8a6a3a');
      if (moves.includes(i)) {
        spot.setAttribute('stroke', '#c2410c');
        spot.setAttribute('stroke-width', '3');
      }
    }
    spot.style.cursor = 'pointer';
    spot.addEventListener('click', () => onPoint(i));
    els.svg.appendChild(spot);
  }

  els.countR.textContent = `🔴 ${count(g, 'r')}`;
  els.countB.textContent = `🔵 ${count(g, 'b')}`;
  els.turnLabel.textContent = g.winner
    ? ''
    : `${MARKS[g.turn]} ${t('caro.turn', 'đi nào')}${state.vsAi && g.turn === 'b' ? ' 🤖' : ''}`;
}

/* ===== Lượt đi ===== */

function onPoint(i) {
  const g = state.game;
  if (state.busy || g.winner) return;
  if (state.vsAi && g.turn === 'b') return;
  if (g.cells[i] === g.turn) {
    state.selected = state.selected === i ? null : i;
    sfx.select();
    render();
    return;
  }
  if (state.selected != null && g.cells[i] === null) {
    const legal = legalMoves(g).some((m) => m.from === state.selected && m.to === i);
    if (!legal) return;
    doMove(state.selected, i);
  }
}

function doMove(from, to) {
  const g = state.game;
  state.selected = null;
  const result = play(g, from, to);
  if (!result) return;
  if (result.flipped.length) {
    sfx.match(3);
    speak(`Gánh ${result.flipped.length} quân!`);
  } else {
    sfx.select();
  }
  render();
  if (g.winner) return endGame();

  if (state.vsAi && g.turn === 'b') {
    state.busy = true;
    setTimeout(() => {
      state.busy = false;
      const mv = aiMove(g);
      if (mv) doMove(mv.from, mv.to);
    }, 650);
  }
  return null;
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

function endGame() {
  const g = state.game;
  const humanWon = g.winner === 'r';
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'coganh',
    result: state.vsAi ? (humanWon ? 'win' : 'loss') : 'duel',
    score: count(g, g.winner),
    level: 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  els.cheerEmoji.textContent = state.vsAi && !humanWon ? '🤖' : '🏆';
  els.cheerText.textContent = `${MARKS[g.winner]} ${t('caro.win', 'thắng rồi!')}`;
  if (!state.vsAi || humanWon) {
    sfx.levelWin();
    confetti();
    speak('Hoan hô! Gánh hết quân đối thủ rồi!');
  } else {
    sfx.gameOver();
  }
  els.cheer.classList.remove('hidden');
}

function newGame() {
  state.game = createGame();
  state.selected = null;
  state.busy = false;
  state.startedAt = Date.now();
  els.cheer.classList.add('hidden');
  render();
}

/* ===== Nút ===== */

function selectVs(vsAi) {
  state.vsAi = vsAi;
  els.tabAi.classList.toggle('active', vsAi);
  els.tab2p.classList.toggle('active', !vsAi);
  sfx.select();
  newGame();
}

els.tabAi.addEventListener('click', () => selectVs(true));
els.tab2p.addEventListener('click', () => selectVs(false));
els.btnNew.addEventListener('click', () => { sfx.shuffle(); newGame(); });
els.btnAgain.addEventListener('click', () => { sfx.select(); newGame(); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
newGame();

// Hook cho e2e test
window.__coganh = { state, newGame, doMove, onPoint };
