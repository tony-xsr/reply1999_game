// Điều phối Ô Ăn Quan: bàn 2 hàng dân + 2 ô quan, chạm ô → chọn hướng rải,
// animation rải quân từng ô. 2 người cùng máy hoặc đấu với máy.

import { createGame, play, aiMove, legalMoves, SIDES, isQuanCell } from './oanquan.js';
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
  board: $('board'), turnLabel: $('turnLabel'), scoreA: $('scoreA'), scoreB: $('scoreB'),
  tabAi: $('tabAi'), tab2p: $('tab2p'),
  dirPick: $('dirPick'), dirLeft: $('dirLeft'), dirRight: $('dirRight'),
  cheer: $('cheer'), cheerEmoji: $('cheerEmoji'), cheerText: $('cheerText'), btnAgain: $('btnAgain'),
  btnNew: $('btnNew'), btnHelp: $('btnHelp'), btnSound: $('btnSound'),
};

const state = {
  vsAi: true,
  game: null,
  busy: false,
  selected: null,
  cellEls: [],   // theo chỉ số ô 0..11
  startedAt: Date.now(),
  instruction: '',
};

bindMute(() => sfx.muted);

function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}
const MARKS = { A: '🔵', B: '🔴' };

/* ===== Dựng bàn ===== */

function buildBoard() {
  els.board.innerHTML = '';
  state.cellEls = [];
  const put = (idx, extraClass, col, row) => {
    const cell = document.createElement('button');
    cell.className = `cell ${extraClass}`;
    if (col) { cell.style.gridColumn = col; cell.style.gridRow = row; }
    cell.addEventListener('click', () => onCell(idx));
    els.board.appendChild(cell);
    state.cellEls[idx] = cell;
  };
  put(0, 'quan left');
  put(6, 'quan right');
  // Hàng trên (B): hiển thị trái→phải là 11,10,9,8,7
  [11, 10, 9, 8, 7].forEach((idx, i) => put(idx, 'top', `${i + 2}`, '1'));
  // Hàng dưới (A): 1..5
  [1, 2, 3, 4, 5].forEach((idx, i) => put(idx, 'bottom', `${i + 2}`, '2'));
}

function refresh() {
  const g = state.game;
  for (let i = 0; i < 12; i++) {
    const cell = state.cellEls[i];
    const n = g.stones[i];
    if (isQuanCell(i)) {
      const hasQuan = g.quan[i === 0 ? 0 : 1];
      cell.innerHTML = `<span class="quan-mark">${hasQuan ? '👑' : ''}</span><span class="count">${n || ''}</span>`;
    } else {
      cell.innerHTML = `<span class="count">${n}</span><span class="stones">${'●'.repeat(Math.min(n, 12))}</span>`;
    }
    cell.classList.toggle('empty', n === 0);
    const owner = SIDES.A.includes(i) ? 'A' : SIDES.B.includes(i) ? 'B' : null;
    const humanTurn = !state.vsAi || g.turn === 'A';
    cell.classList.toggle('mine', !g.finished && !state.busy && humanTurn && owner === g.turn && n > 0);
    cell.classList.remove('selected');
  }
  els.scoreA.textContent = `🔵 ${g.scores.A}`;
  els.scoreB.textContent = `🔴 ${g.scores.B}`;
  els.turnLabel.textContent = g.finished
    ? ''
    : `${MARKS[g.turn]} ${t('caro.turn', 'đi nào')}${state.vsAi && g.turn === 'B' ? ' 🤖' : ''}`;
}

/* ===== Lượt đi ===== */

function onCell(idx) {
  const g = state.game;
  if (state.busy || g.finished) return;
  if (state.vsAi && g.turn === 'B') return;
  if (!SIDES[g.turn].includes(idx) || g.stones[idx] === 0) return;
  state.selected = idx;
  refresh();
  state.cellEls[idx].classList.add('selected');
  els.dirPick.classList.remove('hidden');
  sfx.select();
}

// Mũi tên theo hướng NHÌN THẤY: hàng dưới ➡️ = +1; hàng trên ngược lại
function chooseDir(visualRight) {
  const idx = state.selected;
  els.dirPick.classList.add('hidden');
  if (idx == null) return;
  const isBottom = SIDES.A.includes(idx);
  const dir = (visualRight ? 1 : -1) * (isBottom ? 1 : -1);
  state.selected = null;
  doMove(idx, dir);
}

async function doMove(cell, dir) {
  const g = state.game;
  state.busy = true;
  const result = play(g, cell, dir);
  // Animation: lần theo đường rải (số âm = bốc tiếp)
  for (const p of result.path) {
    const i = p < 0 ? -p - 1 : p;
    state.cellEls[i].classList.add('sowing');
    sfx.select();
    // eslint-disable-next-line no-await-in-loop
    await new Promise((r) => setTimeout(r, p < 0 ? 300 : 110));
    state.cellEls[i].classList.remove('sowing');
  }
  for (const cap of result.captures) {
    state.cellEls[cap.cell].classList.add('eaten');
    sfx.match(2);
    // eslint-disable-next-line no-await-in-loop
    await new Promise((r) => setTimeout(r, 350));
    state.cellEls[cap.cell].classList.remove('eaten');
  }
  if (result.captures.length) {
    const total = result.captures.reduce((a, c) => a + c.gained, 0);
    speak(`Ăn ${total} quân!`);
  }
  state.busy = false;
  refresh();

  if (g.finished) return endGame();
  if (state.vsAi && g.turn === 'B') {
    state.busy = true;
    setTimeout(() => {
      state.busy = false;
      const mv = aiMove(g);
      if (mv) doMove(mv.cell, mv.dir);
    }, 700);
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
  const { A, B } = g.scores;
  const draw = A === B;
  const humanWon = A > B;
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'oanquan',
    result: draw ? 'duel' : (state.vsAi ? (humanWon ? 'win' : 'loss') : 'duel'),
    score: Math.max(A, B),
    level: 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  els.cheerEmoji.textContent = draw ? '🤝' : (state.vsAi && !humanWon ? '🤖' : '🏆');
  els.cheerText.textContent = draw
    ? `${t('caro.draw', 'Hòa rồi!')} ${A} — ${B}`
    : `${MARKS[humanWon ? 'A' : 'B']} ${t('caro.win', 'thắng rồi!')} ${A} — ${B}`;
  if (!draw && (!state.vsAi || humanWon)) {
    sfx.levelWin();
    confetti();
    speak(`Hết quan tàn dân! ${humanWon ? 'Xanh' : 'Đỏ'} thắng ${Math.max(A, B)} điểm!`);
  } else {
    sfx.gameOver();
  }
  els.cheer.classList.remove('hidden');
}

function newGame() {
  state.game = createGame();
  state.busy = false;
  state.selected = null;
  state.startedAt = Date.now();
  els.cheer.classList.add('hidden');
  els.dirPick.classList.add('hidden');
  refresh();
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
els.dirLeft.addEventListener('click', () => chooseDir(false));
els.dirRight.addEventListener('click', () => chooseDir(true));
els.dirPick.addEventListener('click', (e) => {
  if (e.target === els.dirPick) { // chạm ra ngoài: bỏ chọn
    els.dirPick.classList.add('hidden');
    state.selected = null;
    refresh();
  }
});
els.btnNew.addEventListener('click', () => { sfx.shuffle(); newGame(); });
els.btnAgain.addEventListener('click', () => { sfx.select(); newGame(); });
els.btnHelp.addEventListener('click', () => { sfx.select(); speak(state.instruction); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
sayInstruction(t('oanquan.help', 'Chạm vào 1 ô dân của mình rồi chọn hướng rải trái hoặc phải. Quân sẽ rải dần từng ô một. Nếu ô kế tiếp sau khi rải hết là ô trống mà ô liền sau đó có quân, bé sẽ ăn được hết quân ở ô đó!'));
buildBoard();
newGame();

// Hook cho e2e test
window.__oanquan = { state, newGame, doMove, onCell, legalMoves };

mountKidFeatures(); // thanh avatar bé + huy hiệu sao header + kiểm tra giới hạn phút/ngày (áp dụng cho mọi game, kể cả game giải trí thuần)
