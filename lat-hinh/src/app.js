// Điều phối Lật Hình Trí Nhớ: lật 2 thẻ tìm cặp, 3 chế độ (hình / chữ–hình / số–lượng).
// Dùng chung: sfx + hồ sơ/thống kê (pokemon), giọng đọc (to-mau).

import { makeDeck, starsForMoves } from './deck.js';
import { speak, bindMute } from '../../to-mau/src/speech.js';
import { sfx } from '../../pokemon/src/sfx.js';
import { currentProfile, recordSession } from '../../pokemon/src/stats.js';

const t = (key, fallback) => {
  const v = window.I18N?.t(key);
  return v && v !== key ? v : fallback;
};

const $ = (id) => document.getElementById(id);
const els = {
  grid: $('grid'), moves: $('moves'),
  tabs: { classic: $('tabClassic'), letter: $('tabLetter'), number: $('tabNumber') },
  btnNew: $('btnNew'), btnHelp: $('btnHelp'), btnSound: $('btnSound'),
  cheer: $('cheer'), cheerStars: $('cheerStars'), cheerText: $('cheerText'), btnAgain: $('btnAgain'),
};

const PAIRS = 8; // lưới 4×4

const state = {
  mode: 'classic',
  deck: [],
  open: [],        // tối đa 2 thẻ đang ngửa
  matched: 0,
  moves: 0,
  busy: false,
  startedAt: Date.now(),
  instruction: '',
};

bindMute(() => sfx.muted);

function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

function newGame() {
  state.deck = makeDeck(state.mode, PAIRS);
  state.open = [];
  state.matched = 0;
  state.moves = 0;
  state.busy = false;
  state.startedAt = Date.now();
  els.moves.textContent = '0';
  els.cheer.classList.add('hidden');
  els.grid.innerHTML = '';

  for (const card of state.deck) {
    const btn = document.createElement('button');
    btn.className = 'card';
    btn.dataset.id = card.id;
    btn.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-back">❓</div>
        <div class="card-face card-front${card.small ? ' small' : ''}"></div>
      </div>`;
    btn.querySelector('.card-front').textContent = card.face;
    btn.addEventListener('click', () => flip(card, btn));
    els.grid.appendChild(btn);
  }
}

function flip(card, btn) {
  if (state.busy || btn.classList.contains('open') || btn.classList.contains('matched')) return;
  btn.classList.add('open');
  sfx.select();
  state.open.push({ card, btn });
  if (state.open.length < 2) return;

  const [a, b] = state.open;
  state.open = [];
  state.moves++;
  els.moves.textContent = state.moves;

  if (a.card.pairKey === b.card.pairKey) {
    a.btn.classList.add('matched');
    b.btn.classList.add('matched');
    state.matched++;
    sfx.match(2);
    if (a.card.speech) speak(a.card.speech);
    if (state.matched === PAIRS) setTimeout(win, 600);
    return;
  }

  // Không khớp: cho bé nhìn 0.9s rồi úp lại
  state.busy = true;
  sfx.fail();
  setTimeout(() => {
    for (const x of [a, b]) {
      x.btn.classList.add('shake');
      x.btn.classList.remove('open');
      setTimeout(() => x.btn.classList.remove('shake'), 350);
    }
    state.busy = false;
  }, 900);
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
  const stars = starsForMoves(state.moves, PAIRS);
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'lathinh',
    result: 'win',
    score: stars * 10 + Math.max(0, PAIRS * 3 - state.moves),
    level: PAIRS,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  sfx.levelWin();
  confetti();
  els.cheerStars.textContent = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
  els.cheerText.textContent = `${t('lathinh.moves', 'Số lượt')}: ${state.moves}`;
  els.cheer.classList.remove('hidden');
  speak('Giỏi quá! Tìm được hết các cặp rồi!');
}

function selectMode(mode) {
  state.mode = mode;
  for (const [k, el] of Object.entries(els.tabs)) el.classList.toggle('active', k === mode);
  sfx.select();
  newGame();
}

els.tabs.classic.addEventListener('click', () => selectMode('classic'));
els.tabs.letter.addEventListener('click', () => selectMode('letter'));
els.tabs.number.addEventListener('click', () => selectMode('number'));
els.btnNew.addEventListener('click', () => { sfx.shuffle(); newGame(); });
els.btnAgain.addEventListener('click', () => { sfx.select(); newGame(); });
els.btnHelp.addEventListener('click', () => { sfx.select(); speak(state.instruction); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
sayInstruction(t('lathinh.help', 'Chạm 2 thẻ hình úp để lật lên. Giống nhau thì được điểm và 2 thẻ đó biến mất, khác nhau thì lại úp xuống. Cố nhớ vị trí để ghép được nhiều cặp giống nhau nhất nhé!'));
newGame();

// Hook cho e2e test
window.__lathinh = { state, newGame, selectMode };
