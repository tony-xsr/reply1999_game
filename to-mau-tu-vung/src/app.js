// Điều phối Tô Màu Từ Vựng: chọn 1 từ (trái cây/đồ vật) ngẫu nhiên, đọc to
// tên tiếng Anh, bé tô màu hình emoji của từ đó — tô kín là xong, nghe lại
// từ + nghĩa tiếng Việt rồi chuyển từ khác. Tái dùng thẳng engine Painter
// và bảng màu có sẵn ở game Tô Màu Chữ & Số (to-mau/), không viết lại.

import { pickWord } from './tomautuvung.js';
import { Painter } from '../../to-mau/src/paint.js';
import { PALETTE } from '../../to-mau/src/letters.js';
import { speak, bindMute } from '../../to-mau/src/speech.js';
import { sfx } from '../../pokemon/src/sfx.js';
import { currentProfile, recordSession } from '../../pokemon/src/stats.js';
import { mountKidFeatures, answeredOne } from '../../shared/kid-bar.js';

const t = (key, fallback) => {
  const v = window.I18N?.t(key);
  return v && v !== key ? v : fallback;
};

const $ = (id) => document.getElementById(id);
const els = {
  wordLabel: $('wordLabel'), wrap: $('canvasWrap'), canvas: $('paintCanvas'),
  cheer: $('cheer'), cheerEmoji: $('cheerEmoji'), cheerText: $('cheerText'), btnNext: $('btnNext'),
  palette: $('palette'),
  btnSkip: $('btnSkip'), btnSay: $('btnSay'), btnHelp: $('btnHelp'), btnSound: $('btnSound'),
};

const state = {
  word: null,
  colorIdx: 0,
  done: false,
  startedAt: Date.now(),
  roundStartedAt: Date.now(),
  instruction: '',
};

const painter = new Painter(els.canvas);
bindMute(() => sfx.muted);

function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

function speakEn(text, rate = 0.68) {
  speak(text, { lang: 'en-US', rate });
}

function announceWord() {
  els.wordLabel.textContent = `🔊 ${state.word.en}`;
  speakEn(state.word.en);
}

/* ===== Khay màu ===== */

function renderPalette() {
  els.palette.innerHTML = '';
  PALETTE.forEach((color, i) => {
    const sw = document.createElement('button');
    const isEraser = color.id === 'white';
    sw.className = `swatch${isEraser ? ' eraser' : ''}${i === state.colorIdx ? ' active' : ''}`;
    sw.style.background = isEraser ? '#fff' : color.hex;
    sw.title = color.name;
    sw.addEventListener('click', () => {
      state.colorIdx = i;
      sfx.select();
      renderPalette();
    });
    els.palette.appendChild(sw);
  });
}

/* ===== Vòng chơi ===== */

function buildCurrent() {
  state.word = pickWord(state.word?.en ?? null, Math.random);
  state.done = false;
  state.roundStartedAt = Date.now();
  els.cheer.classList.add('hidden');
  els.wrap.classList.remove('dance');
  painter.build(state.word.emoji, 110);
  state.colorIdx = 0;
  renderPalette();
  announceWord();
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
  const word = state.word;
  sfx.levelWin();
  confetti();
  els.wrap.classList.add('dance');
  answeredOne();
  recordSession({
    mode: 'tomautuvung',
    result: 'win',
    score: painter.regions.length * 10,
    level: 1,
    seconds: (Date.now() - state.roundStartedAt) / 1000,
  });

  els.cheerEmoji.textContent = word.emoji;
  els.cheerText.textContent = `${word.en} — ${word.vi}`;
  setTimeout(() => {
    els.cheer.classList.remove('hidden');
    speak(`Giỏi quá! ${word.vi} — tiếng Anh là`);
    speakEn(word.en, 0.72);
  }, 700);
}

function onCanvasTap(e) {
  if (state.done) return;
  const rect = els.canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (els.canvas.width / rect.width);
  const y = (e.clientY - rect.top) * (els.canvas.height / rect.height);
  const id = painter.regionAt(x, y);
  if (id < 0) return;
  painter.paintRegion(id, PALETTE[state.colorIdx].hex);
  sfx.match(1);
  if (painter.isComplete()) celebrate();
}

/* ===== Nút ===== */

function refreshSoundIcon() {
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
}

els.canvas.addEventListener('pointerdown', onCanvasTap);
els.btnSkip.addEventListener('click', () => { sfx.select(); buildCurrent(); });
els.btnSay.addEventListener('click', () => announceWord());
els.btnHelp.addEventListener('click', () => { sfx.select(); speak(state.instruction); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  refreshSoundIcon();
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});
els.btnNext.addEventListener('click', () => { sfx.select(); buildCurrent(); });

// Ghi thời gian chơi khi rời trang giữa chừng (ván tô dở cũng vẫn ghi)
window.addEventListener('pagehide', () => {
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'tomautuvung',
    result: 'quit',
    score: 0,
    level: 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
});

refreshSoundIcon();
sayInstruction(t('tomautv.help', 'Máy đọc to 1 từ tiếng Anh — chạm vào 1 màu ở khay bên dưới, rồi chạm vào vùng trên hình để tô màu đó vào. Tô kín cả hình là xong, máy sẽ đọc lại từ đó cho bé nhớ! Bấm nút xáo trộn để đổi sang từ khác bất cứ lúc nào.'));
buildCurrent();

// Hook cho e2e test
window.__tomautuvung = {
  state, painter, buildCurrent, celebrate,
};

mountKidFeatures(); // thanh avatar bé + huy hiệu sao header + kiểm tra giới hạn phút/ngày
