// Điều phối Đường Hầm Săn Vàng: dựng hầm, bé đập đá/di chuyển, đá không điểm tựa tự rơi.

import { makeLevel, act, stepGravity, ROWS, COLS } from './duonghham.js';
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
  hudGold: $('hudGold'), hudGoal: $('hudGoal'), hudLives: $('hudLives'), hudLevel: $('hudLevel'),
  cheer: $('cheer'), cheerEmoji: $('cheerEmoji'), cheerText: $('cheerText'), btnCheerGo: $('btnCheerGo'),
};

const state = { level: 0, game: null, cellEls: null, gravityTimer: 0, startedAt: Date.now(), instruction: '' };
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
      btn.addEventListener('click', () => onCellClick(r, c));
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
      const cell = g.grid[r][c];
      const el = state.cellEls[r][c];
      const isPlayer = g.player.r === r && g.player.c === c;
      const isReachable = !g.over && Math.abs(g.player.r - r) + Math.abs(g.player.c - c) === 1;
      let cls = `cell ${cell.type}`;
      if (cell.type === 'rock' && cell.hp === 2) cls += ' boulder';
      if (cell.type === 'rock' && cell.hp === 1) cls += ' cracked';
      if (isReachable) cls += ' reachable';
      el.className = cls;
      el.textContent = '';
      if (isPlayer) {
        const span = document.createElement('span');
        span.className = 'player';
        span.textContent = '👷';
        el.appendChild(span);
      }
    }
  }
  els.hudGold.textContent = g.gold;
  els.hudGoal.textContent = g.goal;
  els.hudLives.textContent = '❤️'.repeat(Math.max(0, g.lives)) + '🖤'.repeat(3 - Math.max(0, g.lives));
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
  clearInterval(state.gravityTimer);
  const g = state.game;
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'duonghham',
    result: g.won ? 'win' : 'quit',
    score: g.gold,
    level: g.level + 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  if (g.won) {
    sfx.levelWin();
    confetti();
    els.cheerEmoji.textContent = '🏆';
    els.cheerText.textContent = `${t('hamvang.win', 'Đủ vàng qua màn!')}\n💰 ${g.gold}/${g.goal}`;
    els.btnCheerGo.textContent = t('hamvang.next', 'MÀN TIẾP ▶');
    els.btnCheerGo.onclick = () => { sfx.select(); state.level++; startLevel(); };
    speak(t('hamvang.win', 'Đủ vàng qua màn!'));
  } else {
    sfx.gameOver();
    els.cheerEmoji.textContent = '💥';
    els.cheerText.textContent = `${t('hamvang.lose', 'Đá rơi trúng hết rồi!')}\n💰 ${g.gold}/${g.goal}`;
    els.btnCheerGo.textContent = t('ran.retry', 'CHƠI LẠI ▶');
    els.btnCheerGo.onclick = () => { sfx.select(); state.level = 0; startLevel(); };
    speak(t('hamvang.lose', 'Đá rơi trúng hết rồi, chơi lại nhé!'));
  }
  els.cheer.classList.remove('hidden');
}

function onCellClick(r, c) {
  const g = state.game;
  if (g.over) return;
  const dr = r - g.player.r;
  const dc = c - g.player.c;
  let dir = null;
  if (dr === -1 && dc === 0) dir = 'up';
  else if (dr === 1 && dc === 0) dir = 'down';
  else if (dr === 0 && dc === -1) dir = 'left';
  else if (dr === 0 && dc === 1) dir = 'right';
  if (!dir) return;
  doAct(dir);
}

function doAct(dir) {
  const g = state.game;
  if (g.over) return;
  const result = act(g, dir);
  if (result.type === 'move') sfx.select();
  else if (result.type === 'dig') {
    sfx.match(result.broken ? 2 : 1);
    if (result.broken && result.gold > 0) speak(`+${result.gold}`);
  }
  render();
  if (g.over) setTimeout(endLevel, 400);
}

function runGravityLoop() {
  clearInterval(state.gravityTimer);
  state.gravityTimer = setInterval(() => {
    const g = state.game;
    if (g.over) { clearInterval(state.gravityTimer); return; }
    const livesBefore = g.lives;
    const moved = stepGravity(g);
    if (!moved) return;
    if (g.lives < livesBefore) {
      sfx.fail();
      speak(t('hamvang.hit', 'Á, đá rơi trúng rồi!'));
    } else {
      sfx.select();
    }
    render();
    if (g.over) setTimeout(endLevel, 400);
  }, 260);
}

function startLevel() {
  els.cheer.classList.add('hidden');
  state.game = makeLevel(state.level, Math.random);
  state.startedAt = Date.now();
  render();
  runGravityLoop();
}

/* ===== Nút & bàn phím ===== */

els.btnNew.addEventListener('click', () => { sfx.shuffle(); state.level = 0; startLevel(); });
els.btnHelp.addEventListener('click', () => { sfx.select(); speak(state.instruction); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});
document.addEventListener('keydown', (e) => {
  const map = {
    ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
    w: 'up', s: 'down', a: 'left', d: 'right',
  };
  const dir = map[e.key];
  if (!dir) return;
  e.preventDefault();
  doAct(dir);
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
buildBoard();
sayInstruction(t('hamvang.help', 'Bấm ô đá kề bên để đập lấy vàng, bấm ô trống để di chuyển. Đá phía trên có thể rơi xuống — nhớ tránh ra chỗ khác nhé!'));
startLevel();

// Hook cho e2e test
window.__hamvang = { state, startLevel, doAct };
