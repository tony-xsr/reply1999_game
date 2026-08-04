// Điều phối Kỹ Năng Sống & Cảm Xúc: 3 trò (cảm xúc / tự lập / an toàn),
// 8 câu mỗi lượt (5 vòng với Tự Lập). Dùng chung sfx + giọng đọc + hồ sơ/stats.

import { makeEmotionSet, makeRoutineRound, makeSafetySet } from './kynang.js';
import { speak, bindMute } from '../../to-mau/src/speech.js';
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
  tabs: { 'cam-xuc': $('tabCamXuc'), 'tu-lap': $('tabTuLap'), 'an-toan': $('tabAnToan') },
  dots: $('dots'), question: $('question'), field: $('field'), tray: $('tray'),
  btnSay: $('btnSay'), btnSound: $('btnSound'),
  cheer: $('cheer'), cheerText: $('cheerText'), btnAgain: $('btnAgain'),
};

const QTOTAL = { 'cam-xuc': 8, 'an-toan': 8, 'tu-lap': 5 };

const state = {
  mode: 'cam-xuc',
  q: null,
  set: [],
  qIndex: 0,
  firstTry: 0,
  wrongThisQ: false,
  saySentence: '',
  startedAt: Date.now(),
};

bindMute(() => sfx.muted);

/* ===== Khung chung ===== */

function renderDots() {
  const total = QTOTAL[state.mode];
  els.dots.innerHTML = '';
  for (let i = 0; i < total; i++) {
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

function finishSet() {
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'kynang',
    result: 'win',
    score: state.firstTry * 10,
    level: QTOTAL[state.mode],
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  sfx.levelWin();
  confetti();
  els.cheerText.textContent = `${t('hocvui.right', 'Đúng ngay lần đầu')}: ${state.firstTry}/${QTOTAL[state.mode]} ⭐`;
  els.cheer.classList.remove('hidden');
  speak('Giỏi quá! Bé làm tốt lắm!');
}

function questionDone(delay = 1500) {
  if (!state.wrongThisQ) state.firstTry++;
  state.wrongThisQ = false;
  state.qIndex++;
  renderDots();
  if (state.qIndex >= QTOTAL[state.mode]) setTimeout(finishSet, delay);
  else setTimeout(nextQuestion, delay);
}

function startSet(mode) {
  state.mode = mode;
  state.qIndex = 0;
  state.firstTry = 0;
  state.wrongThisQ = false;
  state.startedAt = Date.now();
  els.cheer.classList.add('hidden');
  for (const [k, el] of Object.entries(els.tabs)) el.classList.toggle('active', k === mode);
  if (mode === 'cam-xuc') state.set = makeEmotionSet(QTOTAL[mode]);
  else if (mode === 'an-toan') state.set = makeSafetySet(QTOTAL[mode]);
  else state.set = [];
  renderDots();
  nextQuestion();
}

function nextQuestion() {
  RENDER[state.mode]();
}

const RENDER = {};

/* ===== 1. Bé Vui Bé Buồn ===== */

RENDER['cam-xuc'] = () => {
  const q = state.set[state.qIndex];
  state.q = q;
  els.field.innerHTML = '';
  els.tray.innerHTML = '';

  if (q.type === 's2e') {
    els.question.textContent = t('kynang.q.s2e', 'Bé cảm thấy thế nào?');
    const card = document.createElement('div');
    card.className = 'situ-card';
    card.innerHTML = `<div class="s-emoji">${q.situation.emoji}</div><div class="s-text">${q.situation.text}</div>`;
    els.field.appendChild(card);

    for (const opt of q.options) {
      const btn = document.createElement('button');
      btn.className = 'face-btn';
      btn.innerHTML = `<span class="f-emoji">${opt.face}</span><span class="f-name">${opt.name}</span>`;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        speak(opt.name);
        if (opt.id !== q.answer) return wrong(btn);
        sfx.match(2);
        setTimeout(() => speak(`${q.situation.text} — bé cảm thấy ${opt.name}!`), 550);
        questionDone();
        return null;
      });
      els.tray.appendChild(btn);
    }
    const names = q.options.map((o) => o.name).join(', ');
    state.saySentence = `${q.situation.text}. ${t('kynang.q.choices', 'Chọn')}: ${names}.`;
  } else {
    els.question.textContent = t('kynang.q.e2s', 'Cảm xúc này hợp với tình huống nào?');
    const card = document.createElement('div');
    card.className = 'situ-card';
    card.innerHTML = `<div class="s-emoji">${q.emotion.face}</div><div class="s-text">${q.emotion.name.toUpperCase()}</div>`;
    els.field.appendChild(card);

    for (const opt of q.options) {
      const btn = document.createElement('button');
      btn.className = 'situ-btn';
      btn.innerHTML = `<span class="b-emoji">${opt.emoji}</span><span class="b-text">${opt.text}</span>`;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        speak(opt.text);
        if (opt !== q.answer) return wrong(btn);
        sfx.match(2);
        setTimeout(() => speak(`${opt.text} — đúng là cảm xúc ${q.emotion.name}!`), 700);
        questionDone();
        return null;
      });
      els.tray.appendChild(btn);
    }
    const texts = q.options.map((o) => o.text).join(', ');
    state.saySentence = `Cảm xúc ${q.emotion.name}. ${t('kynang.q.choices', 'Chọn')}: ${texts}.`;
  }
  speak(state.saySentence);
};

/* ===== 2. Bé Tự Làm Được ===== */

RENDER['tu-lap'] = () => {
  const { routine, shuffled } = makeRoutineRound();
  state.q = { routine, shuffled, next: 0 };
  els.question.innerHTML = `${routine.icon} <b>${routine.name}</b> — ${t('kynang.q.order', 'Sắp đúng thứ tự nhé!')}`;

  els.field.innerHTML = '';
  const line = document.createElement('div');
  line.className = 'word-line';
  const slots = [];
  for (let i = 0; i < routine.steps.length; i++) {
    const slot = document.createElement('div');
    slot.className = 'chunk slot';
    slot.textContent = i + 1;
    line.appendChild(slot);
    slots.push(slot);
  }
  els.field.appendChild(line);

  els.tray.innerHTML = '';
  for (const step of shuffled) {
    const btn = document.createElement('button');
    btn.className = 'step-btn';
    btn.innerHTML = `<span class="st-emoji">${step.icon}</span><span>${step.text}</span>`;
    btn.addEventListener('click', () => {
      if (step.correctIndex !== state.q.next) return wrong(btn);
      const slot = slots[state.q.next];
      slot.textContent = step.icon;
      slot.classList.remove('slot');
      slot.classList.add('filled');
      btn.classList.add('used');
      sfx.match(2);
      speak(step.text);
      state.q.next++;
      if (state.q.next >= routine.steps.length) {
        questionDone(1600);
      }
      return null;
    });
    els.tray.appendChild(btn);
  }
  state.saySentence = `${routine.name}. ${t('kynang.q.order', 'Sắp đúng thứ tự nhé!')}`;
  speak(state.saySentence);
};

/* ===== 3. An Toàn Cho Bé ===== */

RENDER['an-toan'] = () => {
  const item = state.set[state.qIndex];
  state.q = item;
  els.question.textContent = t('kynang.q.safety', 'Việc này AN TOÀN hay NGUY HIỂM?');

  els.field.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'situ-card';
  card.innerHTML = `<div class="s-emoji">${item.emoji}</div><div class="s-text">${item.text}</div>`;
  els.field.appendChild(card);
  const explainLine = document.createElement('div');
  explainLine.className = 'explain-line';
  els.field.appendChild(explainLine);

  els.tray.innerHTML = '';
  const row = document.createElement('div');
  row.className = 'safety-row';
  const answer = (safe, btn) => {
    if (safe === item.safe) {
      btn.classList.add('pop');
      sfx.match(2);
      explainLine.textContent = item.explain;
      speak(item.explain);
      questionDone(1900);
    } else {
      wrong(btn);
      explainLine.textContent = item.explain;
      speak(item.explain);
    }
  };
  const safeBtn = document.createElement('button');
  safeBtn.className = 'safety-btn safe';
  safeBtn.innerHTML = `👍<span class="sf-label">${t('kynang.safe', 'An toàn')}</span>`;
  safeBtn.addEventListener('click', () => answer(true, safeBtn));
  const dangerBtn = document.createElement('button');
  dangerBtn.className = 'safety-btn danger';
  dangerBtn.innerHTML = `👎<span class="sf-label">${t('kynang.danger', 'Nguy hiểm')}</span>`;
  dangerBtn.addEventListener('click', () => answer(false, dangerBtn));
  row.append(safeBtn, dangerBtn);
  els.tray.appendChild(row);

  state.saySentence = item.text;
  speak(item.text);
};

/* ===== Nút ===== */

els.tabs['cam-xuc'].addEventListener('click', () => { sfx.select(); startSet('cam-xuc'); });
els.tabs['tu-lap'].addEventListener('click', () => { sfx.select(); startSet('tu-lap'); });
els.tabs['an-toan'].addEventListener('click', () => { sfx.select(); startSet('an-toan'); });
els.btnSay.addEventListener('click', () => speak(state.saySentence));
els.btnAgain.addEventListener('click', () => { sfx.select(); startSet(state.mode); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
startSet('cam-xuc');

// Hook cho e2e test
window.__kynang = { state, startSet };
