// Điều phối Đập Vàng: dựng bàn đá màu, bấm cụm ≥2 viên liền kề để đập vỡ, ăn điểm qua màn.

import { makeLevel, pop, findCluster, ROWS, COLS } from './dapvang.js';
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

const state = { level: 0, game: null, cellEls: null, startedAt: Date.now(), instruction: '' };
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
      btn.className = 'rock';
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
      state.cellEls[r][c].className = `rock ${g.grid[r][c]}`;
    }
  }
  els.hudScore.textContent = g.score;
  els.hudGoal.textContent = g.goal;
  els.hudMoves.textContent = g.movesLeft;
  els.hudLevel.textContent = `${t('daovang.level', 'Màn')} ${g.level + 1}`;
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
    mode: 'dapvang',
    result: g.won ? 'win' : 'quit',
    score: g.score,
    level: g.level + 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  if (g.won) {
    sfx.levelWin();
    confetti();
    els.cheerEmoji.textContent = '🏆';
    els.cheerText.textContent = `${t('dapvang.win', 'Đủ điểm qua màn!')}\n⭐ ${g.score}/${g.goal}`;
    els.btnCheerGo.textContent = t('dapvang.next', 'MÀN TIẾP ▶');
    els.btnCheerGo.onclick = () => { sfx.select(); state.level++; startLevel(); };
    speak(t('dapvang.win', 'Đủ điểm qua màn!'));
  } else {
    sfx.gameOver();
    els.cheerEmoji.textContent = '🪨';
    els.cheerText.textContent = `${t('dapvang.lose', 'Hết nước đập rồi!')}\n⭐ ${g.score}/${g.goal}`;
    els.btnCheerGo.textContent = t('ran.retry', 'CHƠI LẠI ▶');
    els.btnCheerGo.onclick = () => { sfx.select(); state.level = 0; startLevel(); };
    speak(t('dapvang.lose', 'Hết nước đập rồi, chơi lại nhé!'));
  }
  els.cheer.classList.remove('hidden');
}

function onCell(r, c) {
  const g = state.game;
  if (g.over) return;
  const cluster = findCluster(g.grid, r, c);
  const el = state.cellEls[r][c];
  if (cluster.length < 2) {
    sfx.fail();
    el.classList.remove('shake');
    void el.offsetWidth;
    el.classList.add('shake');
    return;
  }
  sfx.match(Math.min(3, Math.ceil(cluster.length / 3)));
  el.classList.remove('axe');
  void el.offsetWidth;
  el.classList.add('axe');
  pop(g, r, c);
  render();
  if (cluster.length >= 5) speak(t('dapvang.big', 'Cụm to quá, giỏi ghê!'));
  if (g.over) setTimeout(endLevel, 500);
}

function startLevel() {
  els.cheer.classList.add('hidden');
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
sayInstruction(t('dapvang.help', 'Bấm vào cụm từ 2 viên đá cùng màu liền kề trở lên để đập vỡ — cụm càng to càng nhiều điểm!'));
startLevel();

// Hook cho e2e test
window.__dapvang = { state, startLevel, onCell };
