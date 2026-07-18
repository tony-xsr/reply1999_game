// Điều phối Học Tiếng Anh Qua Toán: 8 câu mỗi lượt, khó dần (4 câu đầu chỉ
// cộng phạm vi 10, 4 câu sau cộng/trừ phạm vi 20). Máy đọc TOÀN BỘ câu bằng
// tiếng Anh kèm đáp án ("1 plus 1 equals 2") — bé nghe rồi chọn đúng con số.

import {
  QUESTIONS, makeProblem, equationDisplay, equationSpeech,
} from './toananh.js';
import { speak, speakSequence, bindMute } from '../../to-mau/src/speech.js';
import { sfx } from '../../pokemon/src/sfx.js';
import { currentProfile, recordSession } from '../../pokemon/src/stats.js';
import { mountKidFeatures, answeredOne } from '../../shared/kid-bar.js';

const t = (key, fallback) => {
  const v = window.I18N?.t(key);
  return v && v !== key ? v : fallback;
};

const $ = (id) => document.getElementById(id);
const els = {
  dots: $('dots'), question: $('question'), field: $('field'), tray: $('tray'),
  btnSay: $('btnSay'), btnHelp: $('btnHelp'), btnSound: $('btnSound'),
  cheer: $('cheer'), cheerText: $('cheerText'), btnAgain: $('btnAgain'),
};

const state = {
  q: null,
  qIndex: 0,
  firstTry: 0,
  wrongThisQ: false,
  saySentence: '',
  startedAt: Date.now(),
  instruction: '',
};

bindMute(() => sfx.muted);

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

function wrong(el) {
  state.wrongThisQ = true;
  sfx.fail();
  el.classList.remove('shake');
  void el.offsetWidth;
  el.classList.add('shake');
}

function right(delayNext = 1100) {
  sfx.match(2);
  if (!state.wrongThisQ) state.firstTry++;
  state.wrongThisQ = false;
  state.qIndex++;
  renderDots();
  if (state.qIndex >= QUESTIONS) setTimeout(finishSet, delayNext);
  else setTimeout(nextQuestion, delayNext);
}

function finishSet() {
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'toananh',
    result: 'win',
    score: state.firstTry * 10,
    level: QUESTIONS,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  sfx.levelWin();
  confetti();
  els.cheerText.textContent = `${t('hocvui.right', 'Đúng ngay lần đầu')}: ${state.firstTry}/${QUESTIONS} ⭐`;
  els.cheer.classList.remove('hidden');
  speak(t('toananh.done', 'Giỏi quá! Bé học toán tiếng Anh rất giỏi!'));
}

function say(text, opts = { lang: 'en-US', rate: 0.85 }) {
  state.saySentence = text;
  speak(text, opts);
}

function nextQuestion() {
  els.cheer.classList.add('hidden');
  els.question.textContent = '';
  els.field.innerHTML = '';
  els.tray.innerHTML = '';

  const q = makeProblem(Math.random, state.qIndex >= QUESTIONS / 2);
  state.q = q;
  els.question.textContent = t('toananh.q', 'Nghe kỹ rồi chọn đúng số nhé!');

  const eq = document.createElement('div');
  eq.className = 'eq';
  const display = equationDisplay(q);
  const parts = display.split(' ');
  for (const part of parts) {
    const span = document.createElement('div');
    if (part === '?') {
      span.className = 'blank';
      span.textContent = '?';
    } else {
      span.textContent = part;
    }
    eq.appendChild(span);
  }
  els.field.appendChild(eq);
  const blankEl = eq.querySelector('.blank');

  for (const opt of q.options) {
    const btn = document.createElement('button');
    btn.className = 'tile-btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => {
      if (opt !== q.result) return wrong(btn);
      blankEl.textContent = q.result;
      blankEl.classList.add('filled');
      btn.disabled = true;
      answeredOne();
      say(equationSpeech(q));
      right(1400);
      return null;
    });
    els.tray.appendChild(btn);
  }

  say(equationSpeech(q));
}

function startSet() {
  state.qIndex = 0;
  state.firstTry = 0;
  state.wrongThisQ = false;
  state.startedAt = Date.now();
  els.cheer.classList.add('hidden');
  renderDots();
  state.instruction = t('toananh.help', 'Máy sẽ đọc to phép tính bằng tiếng Anh kèm đáp án — bé nghe kỹ rồi chọn đúng con số vừa nghe được trong 3 lựa chọn nhé!');
  speakSequence([{ text: state.instruction, lang: 'vi-VN', rate: 0.92 }], nextQuestion);
}

/* ===== Nút ===== */

els.btnSay.addEventListener('click', () => speak(state.saySentence, { lang: 'en-US', rate: 0.85 }));
els.btnHelp.addEventListener('click', () => { sfx.select(); speak(state.instruction); });
els.btnAgain.addEventListener('click', () => { sfx.select(); startSet(); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
startSet();

// Hook cho e2e test
window.__toananh = { state, startSet };

mountKidFeatures(); // thanh avatar bé + huy hiệu sao header + kiểm tra giới hạn phút/ngày
