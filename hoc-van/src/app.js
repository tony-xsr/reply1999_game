// Điều phối Học Vần: 3 trò (ghép vần / điền chữ / nghe–viết), 8 câu mỗi lượt.
// Ghép đúng là máy ĐÁNH VẦN to như cô giáo lớp 1: "bờ - o - bo - huyền - bò!"

import { WORDS, spellParts, makeGhepVan, makeDienChu, makeNgheViet } from './van.js';
import { speak, speakSequence, bindMute } from '../../to-mau/src/speech.js';
import { sfx } from '../../pokemon/src/sfx.js';
import { currentProfile, recordSession } from '../../pokemon/src/stats.js';
import { fixSmartHomeBack } from '../../shared/kid-bar.js';

fixSmartHomeBack();

const t = (key, fallback) => {
  const v = window.I18N?.t(key);
  return v && v !== key ? v : fallback;
};

const $ = (id) => document.getElementById(id);
const els = {
  tabs: { ghep: $('tabGhep'), dien: $('tabDien'), nghe: $('tabNghe') },
  dots: $('dots'), qEmoji: $('qEmoji'), wordLine: $('wordLine'), tray: $('tray'),
  btnSay: $('btnSay'), btnHelp: $('btnHelp'), btnSound: $('btnSound'),
  cheer: $('cheer'), cheerText: $('cheerText'), btnAgain: $('btnAgain'),
};

const QUESTIONS = 8;

const HELP_TEXT = {
  ghep: 'Chạm các thẻ âm và vần theo đúng thứ tự để ghép thành tiếng đúng với hình. Ghép đúng máy sẽ đánh vần to cho bé nghe!',
  dien: 'Từ đang thiếu 1 chữ cái, chạm vào chữ cái đúng trong 3 lựa chọn để điền vào chỗ trống.',
  nghe: 'Nghe máy đọc to 1 tiếng, rồi chạm đúng từng chữ cái theo thứ tự trên bàn phím để viết lại tiếng đó.',
};

const state = {
  mode: 'ghep',      // ghep | dien | nghe
  q: null,           // câu hỏi hiện tại
  qIndex: 0,
  firstTry: 0,
  wrongThisQ: false,
  typed: 0,          // nghe–viết: đã gõ tới chữ thứ mấy
  startedAt: Date.now(),
  instruction: '',
};

bindMute(() => sfx.muted);

const spellSpeech = (word) => spellParts(word).join(', ');

/* ===== Khung chung ===== */

function renderDots() {
  els.dots.innerHTML = '';
  for (let i = 0; i < QUESTIONS; i++) {
    const d = document.createElement('span');
    d.className = `dot${i < state.qIndex ? ' ok' : ''}${i === state.qIndex ? ' now' : ''}`;
    els.dots.appendChild(d);
  }
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

function questionDone() {
  if (!state.wrongThisQ) state.firstTry++;
  state.wrongThisQ = false;
  state.qIndex++;
  renderDots();
  if (state.qIndex >= QUESTIONS) {
    setTimeout(finishSet, 1600); // chờ đọc xong câu đánh vần
  } else {
    setTimeout(nextQuestion, 1700);
  }
}

function wrong(el) {
  state.wrongThisQ = true;
  sfx.fail();
  el.classList.remove('shake');
  void el.offsetWidth;
  el.classList.add('shake');
}

function finishSet() {
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'hocvan',
    result: 'win',
    score: state.firstTry * 10,
    level: QUESTIONS,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  sfx.levelWin();
  confetti();
  els.cheerText.textContent = `${t('hocvui.right', 'Đúng ngay lần đầu')}: ${state.firstTry}/${QUESTIONS} ⭐`;
  els.cheer.classList.remove('hidden');
  speak('Giỏi quá! Bé đánh vần giỏi lắm!');
}

function startSet(mode) {
  state.mode = mode;
  state.qIndex = 0;
  state.firstTry = 0;
  state.wrongThisQ = false;
  state.startedAt = Date.now();
  els.cheer.classList.add('hidden');
  for (const [k, el] of Object.entries(els.tabs)) el.classList.toggle('active', k === mode);
  renderDots();
  state.instruction = t(`hocvan.help.${mode}`, HELP_TEXT[mode]);
  speakSequence([{ text: state.instruction, lang: 'vi-VN', rate: 0.92 }], nextQuestion);
}

function nextQuestion() {
  if (state.mode === 'ghep') nextGhep();
  else if (state.mode === 'dien') nextDien();
  else nextNghe();
}

function introSpeech() {
  const { item } = state.q;
  if (state.mode === 'nghe') speak(`Viết chữ: ${item.word}`);
  else speak(item.word);
}

/* ===== Trò 1: Ghép vần ===== */

function nextGhep() {
  // 4 câu đầu giấu phụ âm đầu, 4 câu sau giấu vần (khó dần)
  state.q = makeGhepVan(WORDS, Math.random, state.qIndex < QUESTIONS / 2 ? 'initial' : 'rim');
  const { item, hide, shown, answer, options } = state.q;
  els.qEmoji.textContent = item.emoji;

  els.wordLine.innerHTML = '';
  const slot = document.createElement('div');
  slot.className = 'chunk slot';
  slot.textContent = '❓';
  const fixed = document.createElement('div');
  fixed.className = 'chunk';
  fixed.textContent = shown.toUpperCase();
  els.wordLine.append(...(hide === 'initial' ? [slot, fixed] : [fixed, slot]));

  els.tray.innerHTML = '';
  for (const opt of options) {
    const btn = document.createElement('button');
    btn.className = 'tile-btn';
    btn.textContent = opt.toUpperCase();
    btn.addEventListener('click', () => {
      if (opt !== answer) return wrong(btn);
      btn.classList.add('used');
      slot.textContent = opt.toUpperCase();
      slot.classList.remove('slot');
      slot.classList.add('filled');
      sfx.match(2);
      speak(spellSpeech(item.word)); // đánh vần cả tiếng như cô giáo
      questionDone();
      return null;
    });
    els.tray.appendChild(btn);
  }
  speak(item.word);
}

/* ===== Trò 2: Điền chữ còn thiếu ===== */

function nextDien() {
  state.q = makeDienChu(WORDS);
  const { item, display, answer, options } = state.q;
  els.qEmoji.textContent = item.emoji;

  els.wordLine.innerHTML = '';
  for (const chr of display) {
    const c = document.createElement('div');
    c.className = `chunk${chr === '_' ? ' slot' : ''}`;
    c.textContent = chr === '_' ? '❓' : chr;
    if (chr === '_') c.dataset.slot = '1';
    els.wordLine.appendChild(c);
  }

  els.tray.innerHTML = '';
  for (const opt of options) {
    const btn = document.createElement('button');
    btn.className = 'tile-btn';
    btn.textContent = opt.toUpperCase();
    btn.addEventListener('click', () => {
      if (opt !== answer) return wrong(btn);
      const slot = els.wordLine.querySelector('[data-slot]');
      slot.textContent = opt.toUpperCase();
      slot.classList.remove('slot');
      slot.classList.add('filled');
      sfx.match(2);
      speak(spellSpeech(item.word));
      questionDone();
      return null;
    });
    els.tray.appendChild(btn);
  }
  speak(item.word);
}

/* ===== Trò 3: Nghe – viết ===== */

function nextNghe() {
  state.q = makeNgheViet(WORDS);
  state.typed = 0;
  const { item, letters, keys } = state.q;
  els.qEmoji.textContent = '👂';

  els.wordLine.innerHTML = '';
  for (const _ of letters) {
    const c = document.createElement('div');
    c.className = 'chunk slot';
    c.textContent = '·';
    els.wordLine.appendChild(c);
  }

  els.tray.innerHTML = '';
  for (const key of keys) {
    const btn = document.createElement('button');
    btn.className = 'tile-btn';
    btn.textContent = key;
    btn.addEventListener('click', () => {
      if (key !== letters[state.typed]) return wrong(btn);
      const slot = els.wordLine.children[state.typed];
      slot.textContent = key;
      slot.classList.remove('slot');
      slot.classList.add('filled');
      state.typed++;
      sfx.select();
      if (state.typed >= letters.length) {
        els.qEmoji.textContent = item.emoji; // lộ hình khi viết xong
        sfx.match(3);
        speak(spellSpeech(item.word));
        questionDone();
      }
      return null;
    });
    els.tray.appendChild(btn);
  }
  speak(`Viết chữ: ${item.word}`);
}

/* ===== Nút ===== */

els.tabs.ghep.addEventListener('click', () => { sfx.select(); startSet('ghep'); });
els.tabs.dien.addEventListener('click', () => { sfx.select(); startSet('dien'); });
els.tabs.nghe.addEventListener('click', () => { sfx.select(); startSet('nghe'); });
els.btnSay.addEventListener('click', introSpeech);
els.btnHelp.addEventListener('click', () => { sfx.select(); speak(state.instruction); });
els.btnAgain.addEventListener('click', () => { sfx.select(); startSet(state.mode); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
startSet('ghep');

// Hook cho e2e test
window.__hocvan = { state, startSet };
