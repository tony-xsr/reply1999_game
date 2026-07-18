// Điều phối Ghép Hình Trượt: chọn ảnh Pokémon, xáo, trượt ô về đúng chỗ.
// Ô trống nằm góc; bấm ô cùng hàng/cột là cả dãy trượt theo (như 15-puzzle).

import { createPuzzle, scramble, slide, canSlide, isSolved, blankIndex } from './puzzle.js';
import { ICON_SETS } from '../../pokemon/src/board.js';
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
  board: $('board'), moves: $('moves'), picker: $('picker'),
  tab3: $('tab3'), tab4: $('tab4'),
  btnPeek: $('btnPeek'), btnNew: $('btnNew'), btnHelp: $('btnHelp'), btnSound: $('btnSound'),
  peekImg: $('peekImg'),
  cheer: $('cheer'), cheerImg: $('cheerImg'), cheerText: $('cheerText'), btnAgain: $('btnAgain'),
};

// 10 ảnh Pokémon đầu của bộ sẵn có (đường dẫn tương đối từ thư mục pokemon/)
const IMAGES = ICON_SETS.pokemon.slice(0, 10).map((p) => `/pokemon/${p}`);

const state = {
  n: 3,
  img: IMAGES[0],
  puzzle: null,
  moves: 0,
  done: false,
  startedAt: Date.now(),
  instruction: '',
};

bindMute(() => sfx.muted);

function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

function newGame() {
  state.puzzle = scramble(createPuzzle(state.n), state.n === 3 ? 60 : 140);
  state.moves = 0;
  state.done = false;
  state.startedAt = Date.now();
  els.moves.textContent = '0';
  els.cheer.classList.add('hidden');
  els.peekImg.src = state.img;
  buildTiles();
}

/** Dựng ô 1 lần; mỗi lần đi chỉ đổi tọa độ (CSS transition tự trượt mượt). */
function buildTiles() {
  const { n } = state;
  els.board.innerHTML = '';
  state.tileEls = new Map(); // mảnh → element
  for (let piece = 0; piece < n * n - 1; piece++) {
    const tile = document.createElement('button');
    tile.className = 'tile';
    const px = piece % n;
    const py = Math.floor(piece / n);
    tile.style.width = `calc(${100 / n}% - 4px)`;
    tile.style.height = `calc(${100 / n}% - 4px)`;
    tile.style.backgroundImage = `url("${state.img}")`;
    tile.style.backgroundSize = `${n * 100}% ${n * 100}%`;
    tile.style.backgroundPosition = `${(px / (n - 1)) * 100}% ${(py / (n - 1)) * 100}%`;
    tile.addEventListener('click', () => onTile(piece));
    els.board.appendChild(tile);
    state.tileEls.set(piece, tile);
  }
  layout();
}

function layout() {
  const { n, puzzle } = state;
  puzzle.tiles.forEach((piece, pos) => {
    const tile = state.tileEls.get(piece);
    if (!tile) return; // ô trống
    tile.style.left = `${(pos % n) * (100 / n)}%`;
    tile.style.top = `${Math.floor(pos / n) * (100 / n)}%`;
  });
}

function onTile(piece) {
  if (state.done) return;
  const pos = state.puzzle.tiles.indexOf(piece);
  if (!canSlide(state.puzzle, pos)) { sfx.fail(); return; }
  slide(state.puzzle, pos);
  state.moves++;
  els.moves.textContent = state.moves;
  sfx.select();
  layout();
  if (isSolved(state.puzzle)) setTimeout(win, 200);
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

function win() {
  state.done = true;
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'ghephinh',
    result: 'win',
    score: Math.max(10, state.n * state.n * 20 - state.moves),
    level: state.n,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  sfx.levelWin();
  confetti();
  els.cheerImg.src = state.img;
  els.cheerText.textContent = `${t('lathinh.moves', 'Số lượt')}: ${state.moves}`;
  els.cheer.classList.remove('hidden');
  speak('Giỏi quá! Ghép xong hình rồi!');
}

function renderPicker() {
  els.picker.innerHTML = '';
  for (const img of IMAGES) {
    const btn = document.createElement('button');
    btn.className = `pick${img === state.img ? ' active' : ''}`;
    btn.innerHTML = `<img src="${img}" alt="" draggable="false">`;
    btn.addEventListener('click', () => {
      state.img = img;
      sfx.select();
      renderPicker();
      newGame();
    });
    els.picker.appendChild(btn);
  }
}

function selectSize(n) {
  state.n = n;
  els.tab3.classList.toggle('active', n === 3);
  els.tab4.classList.toggle('active', n === 4);
  sfx.select();
  newGame();
}

els.tab3.addEventListener('click', () => selectSize(3));
els.tab4.addEventListener('click', () => selectSize(4));
els.btnNew.addEventListener('click', () => { sfx.shuffle(); newGame(); });
els.btnAgain.addEventListener('click', () => { sfx.select(); newGame(); });
// Giữ 👁️ để xem hình mẫu, thả ra là ẩn
for (const [on, off] of [['pointerdown', 'pointerup'], ['pointerdown', 'pointercancel']]) {
  els.btnPeek.addEventListener(on, () => els.peekImg.classList.remove('hidden'));
  els.btnPeek.addEventListener(off, () => els.peekImg.classList.add('hidden'));
}
els.btnPeek.addEventListener('pointerleave', () => els.peekImg.classList.add('hidden'));
els.btnHelp.addEventListener('click', () => { sfx.select(); speak(state.instruction); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
sayInstruction(t('ghephinh.help', 'Bức ảnh bị xáo và có 1 ô trống. Chạm vào ô cùng hàng hoặc cùng cột với ô trống để cả dãy trượt theo. Xếp đúng thứ tự các mảnh là xong! Giữ nút con mắt để xem trước hình mẫu.'));
renderPicker();
newGame();

// Hook cho e2e test
window.__ghephinh = { state, newGame, selectSize, onTile, blankIndex };

mountKidFeatures(); // thanh avatar bé + huy hiệu sao header + kiểm tra giới hạn phút/ngày (áp dụng cho mọi game, kể cả game giải trí thuần)
