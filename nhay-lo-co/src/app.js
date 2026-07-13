// Điều phối Nhảy Lò Cò: chạm ô theo đúng thứ tự dãy số, ếch 🐸 nhảy theo,
// máy đọc to từng số. Sai ô → rung + nhắc số cần tìm (không phạt).

import { MODES, makeCourse, COURT_ROWS, viNumber } from './loco.js';
import { speak, bindMute } from '../../to-mau/src/speech.js';
import { sfx } from '../../pokemon/src/sfx.js';
import { currentProfile, recordSession } from '../../pokemon/src/stats.js';

const t = (key, fallback) => {
  const v = window.I18N?.t(key);
  return v && v !== key ? v : fallback;
};

const $ = (id) => document.getElementById(id);
const els = {
  court: $('court'), frog: $('frog'), prompt: $('prompt'),
  tabs: { step1: $('tabStep1'), step2: $('tabStep2'), step5: $('tabStep5') },
  btnSay: $('btnSay'), btnSound: $('btnSound'),
  cheer: $('cheer'), cheerText: $('cheerText'), btnAgain: $('btnAgain'),
};

const state = {
  mode: 'step1',
  course: [],      // dãy số của 10 ô
  pos: 0,          // đã nhảy tới ô thứ mấy
  wrongs: 0,
  squares: [],     // element theo chỉ số ô
  startedAt: Date.now(),
};

bindMute(() => sfx.muted);

const target = () => state.course[state.pos];

function promptText() {
  return `${t('loco.jump', 'Nhảy vào ô số')} `;
}

function updatePrompt() {
  els.prompt.innerHTML = '';
  els.prompt.append(promptText());
  const b = document.createElement('b');
  b.textContent = target();
  els.prompt.appendChild(b);
}

function sayTarget() {
  speak(`${t('loco.jump', 'Nhảy vào ô số')} ${viNumber(target())}!`);
}

/* ===== Sân ===== */

function buildCourt() {
  els.court.innerHTML = '';
  state.squares = [];
  for (const row of COURT_ROWS) {
    const rowEl = document.createElement('div');
    rowEl.className = 'court-row';
    for (const idx of row) {
      const sq = document.createElement('button');
      sq.className = 'square';
      sq.textContent = state.course[idx];
      sq.addEventListener('click', () => onSquare(idx));
      rowEl.appendChild(sq);
      state.squares[idx] = sq;
    }
    els.court.appendChild(rowEl);
  }
}

function moveFrogTo(idx, instant = false) {
  const stageRect = els.court.parentElement.getBoundingClientRect();
  const rect = (idx < 0 ? els.court : state.squares[idx]).getBoundingClientRect();
  if (instant) els.frog.style.transition = 'none';
  els.frog.style.left = `${rect.left - stageRect.left + rect.width / 2 - 18}px`;
  els.frog.style.top = `${idx < 0 ? rect.bottom - stageRect.top - 44 : rect.top - stageRect.top + rect.height / 2 - 20}px`;
  if (instant) {
    void els.frog.offsetWidth;
    els.frog.style.transition = '';
  }
}

/* ===== Chơi ===== */

function onSquare(idx) {
  if (state.pos >= state.course.length) return;
  const sq = state.squares[idx];
  if (state.course[idx] === target()) {
    sq.classList.add('done');
    moveFrogTo(idx);
    sfx.match(2);
    speak(viNumber(target()));
    state.pos++;
    if (state.pos >= state.course.length) {
      setTimeout(finish, 700);
    } else {
      updatePrompt();
    }
  } else {
    state.wrongs++;
    sfx.fail();
    sq.classList.remove('shake');
    void sq.offsetWidth;
    sq.classList.add('shake');
    sayTarget();
    // Sai 2 lần liên tiếp: nháy ô đúng để gợi ý
    if (state.wrongs % 2 === 0) {
      const right = state.squares[state.course.indexOf(target())];
      right.classList.add('next-hint');
      setTimeout(() => right.classList.remove('next-hint'), 2400);
    }
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

function finish() {
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'nhayloco',
    result: 'win',
    score: Math.max(10, 100 - state.wrongs * 10),
    level: MODES[state.mode].step,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  sfx.levelWin();
  confetti();
  els.cheerText.textContent = `${MODES[state.mode].label}: ${state.course.join(', ')} 🎉`;
  els.cheer.classList.remove('hidden');
  const numbers = state.course.map(viNumber).join(', ');
  speak(`Giỏi quá! ${numbers}!`);
}

function newGame() {
  state.course = makeCourse(state.mode);
  state.pos = 0;
  state.wrongs = 0;
  state.startedAt = Date.now();
  els.cheer.classList.add('hidden');
  buildCourt();
  updatePrompt();
  setTimeout(() => moveFrogTo(-1, true), 50);
  sayTarget();
}

function selectMode(mode) {
  state.mode = mode;
  for (const [k, el] of Object.entries(els.tabs)) el.classList.toggle('active', k === mode);
  sfx.select();
  newGame();
}

els.tabs.step1.addEventListener('click', () => selectMode('step1'));
els.tabs.step2.addEventListener('click', () => selectMode('step2'));
els.tabs.step5.addEventListener('click', () => selectMode('step5'));
els.btnSay.addEventListener('click', sayTarget);
els.btnAgain.addEventListener('click', () => { sfx.select(); newGame(); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});
window.addEventListener('resize', () => moveFrogTo(state.pos > 0 ? state.course.indexOf(state.course[state.pos - 1]) : -1, true));

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
newGame();

// Hook cho e2e test
window.__loco = { state, newGame, selectMode, onSquare };
