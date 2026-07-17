// Điều phối Cờ Cá Ngựa: bàn Ludo 15×15 dựng bằng CSS grid, xúc xắc, ngựa emoji.
// Bé luôn cầm ĐỎ. 3 chế độ: vs 1 máy / vs 3 máy / 2 người cùng máy.

import {
  createLudo, rollDie, legalPieces, applyMove, passTurn, aiPick,
  cellOf, RING, HOME_PATH, STABLE_SPOTS, STARTS, COLOR_INFO, GOAL,
} from './ludo.js';
import { speak, bindMute } from '../../to-mau/src/speech.js';
import { sfx } from '../../pokemon/src/sfx.js';
import { currentProfile, recordSession } from '../../pokemon/src/stats.js';

const t = (key, fallback) => {
  const v = window.I18N?.t(key);
  return v && v !== key ? v : fallback;
};

const $ = (id) => document.getElementById(id);
const els = {
  board: $('board'), turnChip: $('turnChip'), btnDie: $('btnDie'), note: $('note'),
  tab2: $('tab2'), tab4: $('tab4'), tab2p: $('tab2p'),
  cheer: $('cheer'), cheerEmoji: $('cheerEmoji'), cheerText: $('cheerText'), btnAgain: $('btnAgain'),
  btnNew: $('btnNew'), btnHelp: $('btnHelp'), btnSound: $('btnSound'),
};

const MODES = {
  2: [{ color: 'r', ai: false }, { color: 'y', ai: true }],
  4: [{ color: 'r', ai: false }, { color: 'g', ai: true }, { color: 'y', ai: true }, { color: 'b', ai: true }],
  '2p': [{ color: 'r', ai: false }, { color: 'y', ai: false }],
};
const DIE_FACES = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

const state = {
  mode: 2,
  game: null,
  roll: null,       // nước gieo đang chờ đi
  busy: false,
  cellEls: null,    // Map "r,c" → element
  startedAt: Date.now(),
  instruction: '',
};

bindMute(() => sfx.muted);

function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

/* ===== Dựng bàn tĩnh 15×15 ===== */

function buildBoard() {
  els.board.innerHTML = '';
  state.cellEls = new Map();
  const cls = Array.from({ length: 15 }, () => Array(15).fill(''));

  for (const [r, c] of RING) cls[r][c] = 'ring';
  for (const color of ['r', 'g', 'y', 'b']) {
    for (const [r, c] of HOME_PATH[color]) cls[r][c] = `home-${color}`;
    const [sr, sc] = RING[STARTS[color]];
    cls[sr][sc] = `start-${color}`;
    // Chuồng: khối 6×6 ở 4 góc
    const corner = { r: [0, 0], g: [0, 9], y: [9, 9], b: [9, 0] }[color];
    for (let r = corner[0]; r < corner[0] + 6; r++) {
      for (let c = corner[1]; c < corner[1] + 6; c++) cls[r][c] = `stable-${color}`;
    }
  }
  for (let r = 6; r <= 8; r++) for (let c = 6; c <= 8; c++) cls[r][c] = 'center';

  for (let r = 0; r < 15; r++) {
    for (let c = 0; c < 15; c++) {
      const cell = document.createElement('div');
      cell.className = `bc ${cls[r][c]}`;
      if (r === 7 && c === 7) cell.textContent = '🏁';
      els.board.appendChild(cell);
      state.cellEls.set(`${r},${c}`, cell);
    }
  }
}

/* ===== Vẽ ngựa ===== */

function render(legal = []) {
  document.querySelectorAll('.horse').forEach((h) => h.remove());
  const g = state.game;
  // Nhóm ngựa theo ô: khi >1 con cùng ô, xếp 2×2 để con nào cũng thấy được
  // (trước đây chỉ tách được tối đa 2 con, con thứ 3-4 sẽ bị đè khuất hoàn toàn).
  const byCell = new Map();
  g.players.forEach((player, pi) => {
    player.pieces.forEach((p, i) => {
      if (p === GOAL) return;
      const [r, c] = cellOf(player.color, p, i);
      const key = `${r},${c}`;
      if (!byCell.has(key)) byCell.set(key, []);
      byCell.get(key).push({ player, pi, i });
    });
  });
  for (const [key, horses] of byCell) {
    const cell = state.cellEls.get(key);
    const stacked = horses.length > 1;
    horses.forEach(({ player, pi, i }, idx) => {
      const movable = pi === g.turn && legal.includes(i) && !player.ai;
      const horse = document.createElement('div');
      horse.className = `horse${movable ? ' movable' : ''}${stacked ? ` stack stack-${idx % 4}` : ''}`;
      horse.style.background = COLOR_INFO[player.color].hex;
      horse.textContent = '🐴';
      if (movable) horse.addEventListener('click', () => humanMove(i));
      cell.appendChild(horse);
    });
  }
  const cur = g.players[g.turn];
  const info = COLOR_INFO[cur.color];
  els.turnChip.textContent = `${info.emoji} ${cur.ai ? '🤖 ' : ''}${t('caro.turn', 'đi nào')}`;
  els.turnChip.style.color = info.hex;
}

/* ===== Lượt chơi ===== */

function beginTurn() {
  const g = state.game;
  if (g.winner != null) return;
  render();
  const player = g.players[g.turn];
  els.btnDie.disabled = player.ai;
  els.btnDie.textContent = '🎲';
  if (player.ai) setTimeout(aiTurn, 750);
}

async function doRollAnimation() {
  els.btnDie.classList.add('rolling');
  await new Promise((r) => setTimeout(r, 450));
  els.btnDie.classList.remove('rolling');
}

async function humanRoll() {
  const g = state.game;
  if (state.busy || g.winner != null || g.players[g.turn].ai || state.roll != null) return;
  state.busy = true;
  els.btnDie.disabled = true;
  await doRollAnimation();
  const roll = rollDie();
  state.roll = roll;
  els.btnDie.innerHTML = `<span class="face">${DIE_FACES[roll]}</span><span class="num">${roll}</span>`;
  sfx.select();
  const info = COLOR_INFO[g.players[g.turn].color];
  speak(`Ngựa ${info.name} đi ${roll} ô!`);
  const legal = legalPieces(g, roll);
  state.busy = false;
  if (!legal.length) {
    els.note.textContent = t('cangua.stuck', 'Không đi được 😅');
    setTimeout(() => {
      els.note.textContent = '';
      state.roll = null;
      passTurn(g);
      beginTurn();
    }, 900);
    return;
  }
  els.note.textContent = t('cangua.pick', 'Chọn ngựa nhấp nháy!');
  render(legal);
}

function humanMove(pieceIdx) {
  const g = state.game;
  if (state.roll == null) return;
  const roll = state.roll;
  state.roll = null;
  els.note.textContent = '';
  const result = applyMove(g, pieceIdx, roll);
  afterMove(result);
}

async function aiTurn() {
  const g = state.game;
  if (g.winner != null) return;
  await doRollAnimation();
  const roll = rollDie();
  els.btnDie.innerHTML = `<span class="face">${DIE_FACES[roll]}</span><span class="num">${roll}</span>`;
  const legal = legalPieces(g, roll);
  if (!legal.length) {
    passTurn(g);
    setTimeout(beginTurn, 550);
    return;
  }
  const pick = aiPick(g, roll, legal);
  setTimeout(() => afterMove(applyMove(g, pick, roll)), 480);
}

function afterMove(result) {
  const g = state.game;
  if (result.captured.length) {
    sfx.match(3);
    speak('Đá ngựa! Về chuồng nhé!');
  } else {
    sfx.select();
  }
  render();
  if (result.finished) return endGame();
  if (result.extra) {
    els.note.textContent = t('cangua.extra', 'Được đi thêm lượt! 🎉');
    setTimeout(() => { els.note.textContent = ''; }, 1100);
  }
  const player = g.players[g.turn];
  els.btnDie.disabled = player.ai;
  if (player.ai) setTimeout(aiTurn, 800);
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
  const winner = g.players[g.winner];
  const humanWon = !winner.ai && winner.color === 'r';
  const vsAi = state.mode !== '2p';
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'cangua',
    result: vsAi ? (humanWon ? 'win' : 'loss') : 'duel',
    score: humanWon ? 40 : 10,
    level: state.game.players.length,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  els.cheerEmoji.textContent = vsAi && !humanWon ? '🤖' : '🏆';
  els.cheerText.textContent = `${COLOR_INFO[winner.color].emoji} ${COLOR_INFO[winner.color].name} ${t('caro.win', 'thắng rồi!')}`;
  if (!vsAi || humanWon) {
    sfx.levelWin();
    confetti();
    speak('Hoan hô! Về đích cả 4 con ngựa rồi!');
  } else {
    sfx.gameOver();
  }
  els.cheer.classList.remove('hidden');
}

function newGame() {
  state.game = createLudo(MODES[state.mode]);
  state.roll = null;
  state.busy = false;
  state.startedAt = Date.now();
  els.cheer.classList.add('hidden');
  els.note.textContent = '';
  beginTurn();
}

/* ===== Nút ===== */

function selectMode(mode, el) {
  state.mode = mode;
  for (const tab of [els.tab2, els.tab4, els.tab2p]) tab.classList.toggle('active', tab === el);
  sfx.select();
  newGame();
}

els.tab2.addEventListener('click', () => selectMode(2, els.tab2));
els.tab4.addEventListener('click', () => selectMode(4, els.tab4));
els.tab2p.addEventListener('click', () => selectMode('2p', els.tab2p));
els.btnDie.addEventListener('click', humanRoll);
els.btnNew.addEventListener('click', () => { sfx.shuffle(); newGame(); });
els.btnAgain.addEventListener('click', () => { sfx.select(); newGame(); });
els.btnHelp.addEventListener('click', () => { sfx.select(); speak(state.instruction); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
buildBoard();
sayInstruction(t('cangua.help', 'Bấm xúc xắc để gieo, rồi chạm vào con ngựa của bé (màu đỏ) để đi theo số vừa gieo. Gieo được 6 thì được đi thêm 1 lượt và có thể đưa ngựa ra khỏi chuồng. Về đích trước là thắng!'));
newGame();

// Hook cho e2e test
window.__cangua = { state, newGame, humanMove, applyMove, render, beginTurn };
