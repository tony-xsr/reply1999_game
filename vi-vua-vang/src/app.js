// Điều phối Vị Vua Vàng: dựng bàn 8×8, chọn 2 ô liền kề để đổi chỗ tạo hàng ≥3, qua màn.

import { makeLevel, attemptSwap, isAdjacent, ROWS, COLS } from './vivuavang.js';
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
  hudScore: $('hudScore'), hudGoal: $('hudGoal'), hudMoves: $('hudMoves'), hudLevel: $('hudLevel'),
  cheer: $('cheer'), cheerEmoji: $('cheerEmoji'), cheerText: $('cheerText'), btnCheerGo: $('btnCheerGo'),
};

const state = { level: 0, game: null, cellEls: null, selected: null, startedAt: Date.now(), instruction: '' };
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
      btn.className = 'pot';
      btn.addEventListener('click', () => onCell(r, c));
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
      state.cellEls[r][c].className = `pot ${g.grid[r][c]}`;
    }
  }
  els.hudScore.textContent = g.score;
  els.hudGoal.textContent = g.goal;
  els.hudMoves.textContent = g.movesLeft;
  els.hudLevel.textContent = `${t('daovang.level', 'Màn')} ${g.level + 1}`;
}

function flashCombo(text) {
  const el = document.createElement('div');
  el.className = 'combo-flash';
  el.textContent = text;
  els.board.appendChild(el);
  setTimeout(() => el.remove(), 900);
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
    mode: 'vivuavang',
    result: g.won ? 'win' : 'quit',
    score: g.score,
    level: g.level + 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  if (g.won) {
    sfx.levelWin();
    confetti();
    els.cheerEmoji.textContent = '👑';
    els.cheerText.textContent = `${t('vivua.win', 'Đủ điểm qua màn!')}\n⭐ ${g.score}/${g.goal}`;
    els.btnCheerGo.textContent = t('vivua.next', 'MÀN TIẾP ▶');
    els.btnCheerGo.onclick = () => { sfx.select(); state.level++; startLevel(); };
    speak(t('vivua.win', 'Đủ điểm qua màn!'));
  } else {
    sfx.gameOver();
    els.cheerEmoji.textContent = '🏺';
    els.cheerText.textContent = `${t('vivua.lose', 'Hết nước đi rồi!')}\n⭐ ${g.score}/${g.goal}`;
    els.btnCheerGo.textContent = t('ran.retry', 'CHƠI LẠI ▶');
    els.btnCheerGo.onclick = () => { sfx.select(); state.level = 0; startLevel(); };
    speak(t('vivua.lose', 'Hết nước đi rồi, chơi lại nhé!'));
  }
  els.cheer.classList.remove('hidden');
}

function clearSelection() {
  if (state.selected) {
    const [sr, sc] = state.selected;
    state.cellEls[sr][sc].classList.remove('selected');
  }
  state.selected = null;
}

function onCell(r, c) {
  const g = state.game;
  if (g.over) return;
  const el = state.cellEls[r][c];

  if (!state.selected) {
    state.selected = [r, c];
    el.classList.add('selected');
    sfx.select();
    return;
  }

  const [sr, sc] = state.selected;
  if (sr === r && sc === c) { clearSelection(); return; }

  if (!isAdjacent(sr, sc, r, c)) {
    clearSelection();
    state.selected = [r, c];
    el.classList.add('selected');
    sfx.select();
    return;
  }

  clearSelection();
  const result = attemptSwap(g, sr, sc, r, c);
  if (!result || !result.valid) {
    sfx.fail();
    for (const [rr, cc] of [[sr, sc], [r, c]]) {
      const cell = state.cellEls[rr][cc];
      cell.classList.remove('shake');
      void cell.offsetWidth;
      cell.classList.add('shake');
    }
    return;
  }

  sfx.match(Math.min(3, result.combo));
  render();
  if (result.combo >= 2) {
    flashCombo(`Combo x${result.combo}! 🎉`);
    speak(t('vivua.combo', 'Combo!'));
  }
  if (g.over) setTimeout(endLevel, 500);
}

function startLevel() {
  els.cheer.classList.add('hidden');
  state.selected = null;
  state.game = makeLevel(state.level, Math.random);
  state.startedAt = Date.now();
  render();
}

/* ===== Nút ===== */

els.btnNew.addEventListener('click', () => { sfx.shuffle(); state.level = 0; startLevel(); });
els.btnHelp.addEventListener('click', () => { sfx.select(); speak(state.instruction); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
buildBoard();
sayInstruction(t('vivua.help', 'Chạm 1 hũ rồi chạm hũ bên cạnh để đổi chỗ — tạo được hàng 3 hũ cùng màu là ăn điểm!'));
startLevel();

// Hook cho e2e test
window.__vivua = { state, startLevel, onCell };
