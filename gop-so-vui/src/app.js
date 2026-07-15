// Điều phối Gộp Số Vui: dựng bàn 4×4, vuốt/bấm phím mũi tên để trượt & gộp ô số.

import { SIZE, makeLevel, applyMove } from './gopsovui.js';
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
  hudScore: $('hudScore'), hudTarget: $('hudTarget'), hudLevel: $('hudLevel'),
  cheer: $('cheer'), cheerEmoji: $('cheerEmoji'), cheerText: $('cheerText'), btnCheerGo: $('btnCheerGo'),
};

const state = { level: 0, game: null, cellEls: null, spoken: new Set(), startedAt: Date.now(), instruction: '' };
bindMute(() => sfx.muted);

/** Đọc hướng dẫn + lưu lại để bấm ❓ nghe lại được (bé chưa đọc chữ vẫn chơi được). */
function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

function buildBoard() {
  els.board.innerHTML = '';
  state.cellEls = [];
  for (let r = 0; r < SIZE; r++) {
    const row = [];
    for (let c = 0; c < SIZE; c++) {
      const div = document.createElement('div');
      div.className = 'tile empty';
      els.board.appendChild(div);
      row.push(div);
    }
    state.cellEls.push(row);
  }
}

function render() {
  const g = state.game;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const v = g.grid[r][c];
      const el = state.cellEls[r][c];
      el.className = v === 0 ? 'tile empty' : `tile v${v}`;
      el.textContent = v === 0 ? '' : v;
    }
  }
  els.hudScore.textContent = g.score;
  els.hudTarget.textContent = g.target;
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
    mode: 'gopsovui',
    result: g.won ? 'win' : 'quit',
    score: g.score,
    level: g.level + 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  if (g.won) {
    sfx.levelWin();
    confetti();
    els.cheerEmoji.textContent = '🏆';
    els.cheerText.textContent = `${t('gopso.win', 'Gộp được số mục tiêu rồi!')}\n🎯 ${g.target} · ⭐ ${g.score}`;
    els.btnCheerGo.textContent = t('gopso.next', 'MÀN TIẾP ▶');
    els.btnCheerGo.onclick = () => { sfx.select(); state.level++; startLevel(); };
    speak(t('gopso.win', 'Gộp được số mục tiêu rồi!'));
  } else {
    sfx.gameOver();
    els.cheerEmoji.textContent = '🧩';
    els.cheerText.textContent = `${t('gopso.lose', 'Bàn đầy rồi, hết cách gộp nữa!')}\n⭐ ${g.score}`;
    els.btnCheerGo.textContent = t('ran.retry', 'CHƠI LẠI ▶');
    els.btnCheerGo.onclick = () => { sfx.select(); state.level = 0; startLevel(); };
    speak(t('gopso.lose', 'Bàn đầy rồi, chơi lại nhé!'));
  }
  els.cheer.classList.remove('hidden');
}

function doMove(direction) {
  const g = state.game;
  if (!g || g.over) return;
  const result = applyMove(g, direction, Math.random);
  if (!result.moved) return;
  sfx.select();
  if (result.gained > 0) sfx.match(2);
  render();
  const maxVal = Math.max(...g.grid.flat());
  if (maxVal >= 8 && !state.spoken.has(maxVal)) {
    state.spoken.add(maxVal);
    speak(String(maxVal));
  }
  if (g.over) setTimeout(endLevel, 400);
}

function startLevel() {
  els.cheer.classList.add('hidden');
  state.spoken = new Set();
  state.game = makeLevel(state.level, Math.random);
  state.startedAt = Date.now();
  render();
}

/* ===== Vuốt & bàn phím ===== */

let swipeFrom = null;
els.board.addEventListener('pointerdown', (e) => { swipeFrom = { x: e.clientX, y: e.clientY }; });
els.board.addEventListener('pointerup', (e) => {
  if (!swipeFrom) return;
  const dx = e.clientX - swipeFrom.x;
  const dy = e.clientY - swipeFrom.y;
  swipeFrom = null;
  if (Math.hypot(dx, dy) < 24) return;
  doMove(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
});

document.addEventListener('keydown', (e) => {
  const map = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
  const dir = map[e.key];
  if (!dir) return;
  e.preventDefault();
  doMove(dir);
});

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
sayInstruction(t('gopso.help', 'Vuốt tay theo 4 hướng để đẩy các ô số — 2 ô cùng số chạm nhau sẽ gộp thành 1 ô gấp đôi. Gộp đủ tới số mục tiêu để qua màn nhé!'));
startLevel();

// Hook cho e2e test
window.__gopso = { state, startLevel, doMove };
