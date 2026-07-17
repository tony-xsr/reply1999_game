// Điều phối game Tô Màu: chọn chữ/số → tô theo vùng → khen thưởng + đọc to.
// Dùng chung hồ sơ người chơi + thống kê + sfx với game Pikachu.

import { LETTERS, DIGITS, COUNT_WORDS, PALETTE, BY_NUMBER_COLORS } from './letters.js';
import { Painter } from './paint.js';
import { speak, bindMute } from './speech.js';
import { sfx } from '../../pokemon/src/sfx.js';
import { currentProfile, recordSession } from '../../pokemon/src/stats.js';

const t = (key, fallback) => {
  const v = window.I18N?.t(key);
  return v && v !== key ? v : fallback;
};

const $ = (id) => document.getElementById(id);
const els = {
  tabLetters: $('tabLetters'), tabDigits: $('tabDigits'),
  btnMode: $('btnMode'), btnSay: $('btnSay'), btnHelp: $('btnHelp'), btnSound: $('btnSound'),
  modeLabel: $('modeLabel'), picker: $('picker'),
  wrap: $('canvasWrap'), canvas: $('paintCanvas'), labels: $('labelCanvas'),
  cheer: $('cheer'), cheerEmoji: $('cheerEmoji'), cheerText: $('cheerText'),
  cheerAnimals: $('cheerAnimals'), btnNext: $('btnNext'),
  palette: $('palette'),
};

const state = {
  tab: 'letters',     // letters | digits
  mode: 'free',       // free | number
  index: 0,           // vị trí trong danh sách hiện tại
  colorIdx: 0,        // màu đang chọn trong khay
  done: false,        // chữ hiện tại đã tô xong (đang hiện khen thưởng)
  startedAt: Date.now(),
  instruction: '',
};

const painter = new Painter(els.canvas);
const labelCtx = els.labels.getContext('2d');
bindMute(() => sfx.muted);

function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

const items = () => (state.tab === 'letters' ? LETTERS : DIGITS);
const current = () => items()[state.index];
const numberHexes = () => PALETTE.slice(0, BY_NUMBER_COLORS).map((p) => p.hex);

/* ===== Tiến độ ⭐ theo hồ sơ người chơi (chung với game Pikachu) ===== */

const progressKey = () => `tomau.progress.${currentProfile(t('pika.user.guest', 'Khách')).id}`;

function getProgress() {
  try { return JSON.parse(localStorage.getItem(progressKey())) || {}; } catch { return {}; }
}

function markDone(ch) {
  const p = getProgress();
  p[ch] = true;
  try { localStorage.setItem(progressKey(), JSON.stringify(p)); } catch { /* private mode */ }
}

/* ===== Câu đọc ===== */

function introSpeech(item) {
  return state.tab === 'letters'
    ? `Chữ ${item.ch}. ${item.ch} — ${item.word}`
    : `Số ${COUNT_WORDS[Number(item.ch)]}`;
}

function cheerSpeech(item) {
  if (state.tab === 'letters') return `Giỏi quá! Chữ ${item.ch} — ${item.word}!`;
  const n = Number(item.ch);
  if (n === 0) return 'Giỏi quá! Số không — không có con vật nào!';
  const count = COUNT_WORDS.slice(1, n + 1).join(', ');
  return `Giỏi quá! Số ${COUNT_WORDS[n]}. ${count} — ${COUNT_WORDS[n]} ${item.word}!`;
}

/* ===== Vẽ UI ===== */

function renderPicker() {
  const progress = getProgress();
  els.picker.innerHTML = '';
  items().forEach((item, i) => {
    const btn = document.createElement('button');
    btn.className = `pick${i === state.index ? ' active' : ''}`;
    btn.textContent = item.ch;
    if (progress[item.ch]) {
      const star = document.createElement('span');
      star.className = 'star';
      star.textContent = '⭐';
      btn.appendChild(star);
    }
    btn.addEventListener('click', () => selectItem(i));
    els.picker.appendChild(btn);
  });
  els.picker.querySelector('.pick.active')?.scrollIntoView({ block: 'nearest', inline: 'center' });
}

function renderPalette() {
  els.palette.innerHTML = '';
  const list = state.mode === 'number' ? PALETTE.slice(0, BY_NUMBER_COLORS) : PALETTE;
  list.forEach((color, i) => {
    const sw = document.createElement('button');
    const isEraser = color.id === 'white';
    sw.className = `swatch${isEraser ? ' eraser' : ''}${i === state.colorIdx ? ' active' : ''}`;
    sw.style.background = isEraser ? '#fff' : color.hex;
    sw.title = color.name;
    if (state.mode === 'number') {
      const num = document.createElement('span');
      num.className = 'num';
      num.textContent = i + 1;
      sw.appendChild(num);
    }
    sw.addEventListener('click', () => {
      state.colorIdx = i;
      sfx.select();
      renderPalette();
    });
    els.palette.appendChild(sw);
  });
}

/** Vẽ nhãn số lên các vùng CHƯA tô đúng (chế độ theo số). */
function renderLabels() {
  labelCtx.clearRect(0, 0, els.labels.width, els.labels.height);
  if (state.mode !== 'number') return;
  const hexes = numberHexes();
  labelCtx.font = '900 22px Arial, sans-serif';
  labelCtx.textAlign = 'center';
  labelCtx.textBaseline = 'middle';
  labelCtx.fillStyle = '#3a3040';
  for (const r of painter.regions) {
    if (r.color === hexes[r.target - 1]) continue;
    labelCtx.fillText(r.target, r.anchor.x, r.anchor.y);
  }
}

function refreshModeLabel() {
  els.btnMode.textContent = state.mode === 'free' ? '🖌️' : '🔢';
  els.modeLabel.textContent = state.mode === 'free'
    ? `🖌️ ${t('tomau.mode.free', 'Tô tự do')}`
    : `🔢 ${t('tomau.mode.number', 'Tô theo số — chọn màu đúng số nhé!')}`;
}

/* ===== Luồng chơi ===== */

function buildCurrent() {
  state.done = false;
  state.startedAt = Date.now();
  els.cheer.classList.add('hidden');
  els.wrap.classList.remove('dance');
  painter.build(current().ch, state.tab === 'digits' ? 150 : 132);
  if (state.mode === 'number') painter.assignTargets(BY_NUMBER_COLORS);
  state.colorIdx = 0;
  renderLabels();
  renderPalette();
  renderPicker();
}

function selectItem(i) {
  state.index = i;
  buildCurrent();
  sfx.select();
  speak(introSpeech(current()));
}

function selectTab(tab) {
  state.tab = tab;
  state.index = 0;
  els.tabLetters.classList.toggle('active', tab === 'letters');
  els.tabDigits.classList.toggle('active', tab === 'digits');
  selectItem(0);
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

function celebrate() {
  state.done = true;
  const item = current();
  sfx.levelWin();
  confetti();
  els.wrap.classList.add('dance');
  markDone(item.ch);
  renderPicker();
  recordSession({
    mode: 'tomau',
    result: 'win',
    score: painter.regions.length * 10,
    level: state.index + 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });

  // Màn khen thưởng: chữ → từ + emoji; số → N con vật nhảy ra để đếm
  els.cheerEmoji.textContent = item.emoji;
  els.cheerAnimals.innerHTML = '';
  if (state.tab === 'letters') {
    els.cheerText.textContent = `${item.ch} — ${item.word}`;
  } else {
    const n = Number(item.ch);
    els.cheerText.textContent = n === 0
      ? `0 — ${item.word}`
      : `${n} ${item.word}`;
    for (let i = 0; i < n; i++) {
      const a = document.createElement('span');
      a.textContent = item.animal;
      a.style.animationDelay = `${0.35 + i * 0.3}s`;
      els.cheerAnimals.appendChild(a);
    }
  }
  setTimeout(() => {
    els.cheer.classList.remove('hidden');
    speak(cheerSpeech(item));
  }, 700);
}

function onCanvasTap(e) {
  if (state.done) return;
  const rect = els.canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (els.canvas.width / rect.width);
  const y = (e.clientY - rect.top) * (els.canvas.height / rect.height);
  const id = painter.regionAt(x, y);
  if (id < 0) return;

  if (state.mode === 'free') {
    painter.paintRegion(id, PALETTE[state.colorIdx].hex);
    sfx.match(1);
    if (painter.isComplete()) celebrate();
    return;
  }

  // Tô theo số: phải chọn đúng màu của vùng
  const region = painter.regions[id];
  if (state.colorIdx + 1 === region.target) {
    painter.paintRegion(id, numberHexes()[state.colorIdx]);
    sfx.match(2);
    renderLabels();
    if (painter.isCompleteByNumber(numberHexes())) celebrate();
  } else {
    sfx.fail();
    els.wrap.classList.remove('shake');
    void els.wrap.offsetWidth;
    els.wrap.classList.add('shake');
    speak(`Thử lại nhé! Vùng này là màu số ${COUNT_WORDS[region.target]}`);
  }
}

/* ===== Gắn nút ===== */

function refreshSoundIcon() {
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
}

els.tabLetters.addEventListener('click', () => selectTab('letters'));
els.tabDigits.addEventListener('click', () => selectTab('digits'));
els.btnMode.addEventListener('click', () => {
  state.mode = state.mode === 'free' ? 'number' : 'free';
  refreshModeLabel();
  buildCurrent();
  sfx.select();
});
els.btnSay.addEventListener('click', () => speak(introSpeech(current())));
els.btnHelp.addEventListener('click', () => { sfx.select(); speak(state.instruction); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  refreshSoundIcon();
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});
els.btnNext.addEventListener('click', () => selectItem((state.index + 1) % items().length));
els.canvas.addEventListener('pointerdown', onCanvasTap);

refreshModeLabel();
refreshSoundIcon();
sayInstruction(t('tomau.help', 'Chạm vào 1 màu ở khay bên dưới, rồi chạm vào vùng trên hình để tô màu đó vào. Tô kín cả chữ hoặc số là xong! Bấm nút cây cọ để đổi sang tô theo số, mỗi vùng có 1 con số ứng với 1 màu.'));
buildCurrent();

// Hook cho e2e test
window.__tomau = { state, painter, selectItem, selectTab, celebrate };
