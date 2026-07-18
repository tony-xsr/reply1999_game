// Điều phối Kim Cương Lấp Lánh: dựng bàn, kéo tay nối 2 viên kim cương cùng màu.

import { makeGame, startPath, extendPath, connectedCount } from './kimcuong.js';
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
  wrap: $('boardWrap'), board: $('board'), lines: $('lines'),
  btnNew: $('btnNew'), btnHelp: $('btnHelp'), btnSound: $('btnSound'),
  hudPairs: $('hudPairs'), hudLevel: $('hudLevel'),
  cheer: $('cheer'), cheerEmoji: $('cheerEmoji'), cheerText: $('cheerText'), btnCheerGo: $('btnCheerGo'),
};

// 12 màu phân biệt rõ — khớp MAX_PAIRS bên logic (bàn 6×6 tối đa 12 cặp)
const COLORS = [
  '#e53935', '#1e88e5', '#43a047', '#fdd835', '#8e24aa', '#fb8c00',
  '#ec407a', '#00acc1', '#a1887f', '#c0ca33', '#7986cb', '#90a4ae',
];

const state = { level: 0, game: null, active: -1, gemEls: [], startedAt: Date.now(), instruction: '' };
bindMute(() => sfx.muted);

/** Đọc hướng dẫn + lưu lại để bấm ❓ nghe lại được (bé chưa đọc chữ vẫn chơi được). */
function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

/* ===== Dựng bàn & vẽ ===== */

function buildBoard() {
  const g = state.game;
  els.board.innerHTML = '';
  els.board.style.gridTemplate = `repeat(${g.size}, 1fr) / repeat(${g.size}, 1fr)`;
  els.lines.setAttribute('viewBox', `0 0 ${g.size * 100} ${g.size * 100}`);
  state.gemEls = [];
  const gemAt = new Map();
  g.pairs.forEach((p, i) => {
    gemAt.set(`${p.a[0]},${p.a[1]}`, i);
    gemAt.set(`${p.b[0]},${p.b[1]}`, i);
  });
  for (let r = 0; r < g.size; r++) {
    for (let c = 0; c < g.size; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      const pi = gemAt.get(`${r},${c}`);
      if (pi !== undefined) {
        const gem = document.createElement('div');
        gem.className = 'gem';
        gem.style.setProperty('--gem', COLORS[pi]);
        cell.appendChild(gem);
        state.gemEls.push({ pair: pi, el: gem });
      }
      els.board.appendChild(cell);
    }
  }
}

function renderPaths() {
  const g = state.game;
  let svg = '';
  g.paths.forEach((path, i) => {
    if (path.length < 2) return;
    const pts = path.map(([r, c]) => `${c * 100 + 50},${r * 100 + 50}`).join(' ');
    const op = g.done[i] ? 0.85 : 0.5;
    svg += `<polyline points="${pts}" fill="none" stroke="${COLORS[i]}" stroke-width="34" stroke-opacity="${op}" stroke-linecap="round" stroke-linejoin="round"/>`;
  });
  els.lines.innerHTML = svg;
  for (const { pair, el } of state.gemEls) el.classList.toggle('done', g.done[pair]);
  els.hudPairs.textContent = `${connectedCount(g)}/${g.pairs.length}`;
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
    mode: 'kimcuong',
    result: 'win',
    score: g.pairs.length,
    level: g.level + 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  sfx.levelWin();
  confetti();
  els.cheerEmoji.textContent = '💎';
  els.cheerText.textContent = `${t('kimcuong.win', 'Nối hết kim cương rồi, lấp lánh quá!')}\n💎 ${g.pairs.length}`;
  els.btnCheerGo.textContent = t('kimcuong.next', 'MÀN TIẾP ▶');
  els.btnCheerGo.onclick = () => { sfx.select(); state.level++; startLevel(); };
  speak(t('kimcuong.win', 'Nối hết kim cương rồi, lấp lánh quá!'));
  els.cheer.classList.remove('hidden');
}

function startLevel() {
  els.cheer.classList.add('hidden');
  state.game = makeGame(state.level, Math.random);
  state.active = -1;
  state.startedAt = Date.now();
  buildBoard();
  renderPaths();
}

/* ===== Kéo tay nối đường ===== */

function cellFromEvent(e) {
  const g = state.game;
  const rect = els.board.getBoundingClientRect();
  const c = Math.floor(((e.clientX - rect.left) / rect.width) * g.size);
  const r = Math.floor(((e.clientY - rect.top) / rect.height) * g.size);
  if (r < 0 || c < 0 || r >= g.size || c >= g.size) return null;
  return [r, c];
}

/** Đi từng bước 1 ô từ cuối đường về phía ô dưới ngón tay (ngón tay có thể lướt nhanh qua vài ô). */
function dragTo(r, c) {
  const g = state.game;
  const i = state.active;
  let guard = 0;
  while (guard++ < 16) {
    const path = g.paths[i]; // extendPath có thể thay mảng khi cắt ngắn — luôn đọc lại
    const [lr, lc] = path[path.length - 1];
    if (lr === r && lc === c) break;
    const dr = r - lr;
    const dc = c - lc;
    const first = Math.abs(dr) >= Math.abs(dc) ? [lr + Math.sign(dr), lc] : [lr, lc + Math.sign(dc)];
    const second = Math.abs(dr) >= Math.abs(dc) ? [lr, lc + Math.sign(dc)] : [lr + Math.sign(dr), lc];
    const wasDone = g.done[i];
    let ok = extendPath(g, i, first[0], first[1]);
    if (!ok && dr !== 0 && dc !== 0) ok = extendPath(g, i, second[0], second[1]);
    if (!ok) break;
    if (g.done[i] && !wasDone) {
      sfx.match(2);
      if (g.won) setTimeout(endLevel, 400);
    }
    if (g.done[i]) break;
  }
  renderPaths();
}

els.wrap.addEventListener('pointerdown', (e) => {
  const g = state.game;
  if (!g || g.won) return;
  const cell = cellFromEvent(e);
  if (!cell) return;
  const i = startPath(g, cell[0], cell[1]);
  state.active = i;
  if (i >= 0) { sfx.select(); renderPaths(); }
});
els.wrap.addEventListener('pointermove', (e) => {
  if (state.active < 0 || !state.game || state.game.won) return;
  const cell = cellFromEvent(e);
  if (cell) dragTo(cell[0], cell[1]);
});
els.wrap.addEventListener('pointerup', () => { state.active = -1; });
els.wrap.addEventListener('pointercancel', () => { state.active = -1; });

/* ===== Nút ===== */

els.btnNew.addEventListener('click', () => { sfx.shuffle(); startLevel(); });
els.btnHelp.addEventListener('click', () => { sfx.select(); speak(state.instruction); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
sayInstruction(t('kimcuong.help', 'Kéo tay nối 2 viên kim cương cùng màu thành 1 đường — các đường không được cắt ngang nhau. Nối đủ hết các cặp là qua màn nhé!'));
startLevel();

// Hook cho e2e test
window.__kimcuong = { state, startLevel };

mountKidFeatures(); // thanh avatar bé + huy hiệu sao header + kiểm tra giới hạn phút/ngày (áp dụng cho mọi game, kể cả game giải trí thuần)
