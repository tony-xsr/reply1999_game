// Điều phối Bắt Vịt: vịt ngoi lên ngẫu nhiên trong 9 hố, đập trong 45 giây.
// Chế độ học: chỉ đập con mang chữ mục tiêu — đập nhầm trừ nhẹ + máy nhắc.

import { ROUND_SECONDS, HOLES, TARGET_HITS_TO_CHANGE, pickTarget, makeDuckLetter, hitScore, spawnDelay, duckUpTime } from './ducks.js';
import { speak, bindMute } from '../../to-mau/src/speech.js';
import { sfx } from '../../pokemon/src/sfx.js';
import { currentProfile, recordSession } from '../../pokemon/src/stats.js';

const t = (key, fallback) => {
  const v = window.I18N?.t(key);
  return v && v !== key ? v : fallback;
};

const $ = (id) => document.getElementById(id);
const els = {
  pond: $('pond'), clock: $('clock'), score: $('score'),
  tabClassic: $('tabClassic'), tabLetter: $('tabLetter'),
  targetLine: $('targetLine'), targetCh: $('targetCh'),
  overlay: $('overlay'), ovEmoji: $('ovEmoji'), ovText: $('ovText'), btnPlay: $('btnPlay'),
  btnHelp: $('btnHelp'), btnSound: $('btnSound'),
};

const state = {
  mode: 'classic',
  running: false,
  score: 0,
  hits: 0,
  timeLeft: ROUND_SECONDS,
  target: 'B',
  targetHits: 0,
  timers: { clock: null, spawn: null },
  startedAt: Date.now(),
  holes: [], // {el, duckEl, tagEl, up, letter, hideTimer}
  instruction: '',
};

bindMute(() => sfx.muted);

function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

/* ===== Dựng ao ===== */

for (let i = 0; i < HOLES; i++) {
  const hole = document.createElement('button');
  hole.className = 'hole';
  hole.innerHTML = '<div class="duck"><span class="tag"></span><span class="bird">🐤</span></div>';
  hole.addEventListener('pointerdown', () => whack(i));
  els.pond.appendChild(hole);
  state.holes.push({
    el: hole,
    tagEl: hole.querySelector('.tag'),
    up: false,
    letter: null,
    hideTimer: null,
  });
}

/* ===== Vòng chơi ===== */

function setTarget(next) {
  state.target = next;
  state.targetHits = 0;
  els.targetCh.textContent = next;
  if (state.mode === 'letter') speak(`Đập con vịt mang chữ ${next}!`);
}

function popDuck() {
  if (!state.running) return;
  const free = state.holes.filter((h) => !h.up);
  if (free.length) {
    const hole = free[Math.floor(Math.random() * free.length)];
    hole.letter = state.mode === 'letter' ? makeDuckLetter(state.target) : null;
    hole.tagEl.textContent = hole.letter || '';
    hole.tagEl.style.display = hole.letter ? '' : 'none';
    hole.up = true;
    hole.el.classList.add('up');
    hole.hideTimer = setTimeout(() => sink(hole), duckUpTime(state.mode));
  }
  state.timers.spawn = setTimeout(popDuck, spawnDelay(ROUND_SECONDS - state.timeLeft));
}

function sink(hole) {
  hole.up = false;
  clearTimeout(hole.hideTimer);
  hole.el.classList.remove('up', 'bonk');
}

function popScore(hole, text, good) {
  const el = document.createElement('span');
  el.className = `pop-score ${good ? 'good' : 'bad'}`;
  el.textContent = text;
  hole.el.appendChild(el);
  setTimeout(() => el.remove(), 700);
}

function whack(i) {
  const hole = state.holes[i];
  if (!state.running || !hole.up) return;
  const { delta, good } = hitScore(state.mode, hole.letter, state.target);
  state.score = Math.max(0, state.score + delta);
  els.score.textContent = state.score;
  popScore(hole, `${delta > 0 ? '+' : ''}${delta}`, good);

  if (good) {
    state.hits++;
    sfx.match(2);
    hole.el.classList.add('bonk');
    setTimeout(() => sink(hole), 240);
    if (state.mode === 'letter' && ++state.targetHits >= TARGET_HITS_TO_CHANGE) {
      setTarget(pickTarget(state.target));
    }
  } else {
    sfx.fail();
    hole.el.classList.add('wrongHit');
    setTimeout(() => hole.el.classList.remove('wrongHit'), 350);
    speak(`Chữ ${state.target} cơ mà!`);
  }
}

function tickClock() {
  state.timeLeft--;
  els.clock.textContent = `${state.timeLeft}s`;
  if (state.timeLeft <= 0) return endRound();
  state.timers.clock = setTimeout(tickClock, 1000);
  return null;
}

function start() {
  stopTimers();
  state.running = true;
  state.score = 0;
  state.hits = 0;
  state.timeLeft = ROUND_SECONDS;
  state.startedAt = Date.now();
  els.score.textContent = '0';
  els.clock.textContent = `${ROUND_SECONDS}s`;
  els.overlay.classList.add('hidden');
  for (const hole of state.holes) sink(hole);
  if (state.mode === 'letter') setTarget(pickTarget());
  state.timers.clock = setTimeout(tickClock, 1000);
  popDuck();
}

function stopTimers() {
  clearTimeout(state.timers.clock);
  clearTimeout(state.timers.spawn);
  for (const hole of state.holes) clearTimeout(hole.hideTimer);
}

function endRound() {
  stopTimers();
  state.running = false;
  for (const hole of state.holes) sink(hole);
  sfx.levelWin();
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
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'batvit',
    result: 'win',
    score: state.score,
    level: state.hits,
    seconds: ROUND_SECONDS,
  });
  els.ovEmoji.textContent = '🏆';
  els.ovText.textContent = `${t('batvit.caught', 'Bắt được')}: ${state.hits} 🐤\n${t('pika.end.score', 'Điểm của bạn')}: ${state.score}`;
  els.btnPlay.textContent = t('ran.retry', 'CHƠI LẠI ▶');
  els.overlay.classList.remove('hidden');
  speak(`Giỏi quá! Bắt được ${state.hits} con vịt!`);
}

/* ===== Nút ===== */

function selectMode(mode) {
  state.mode = mode;
  els.tabClassic.classList.toggle('active', mode === 'classic');
  els.tabLetter.classList.toggle('active', mode === 'letter');
  els.targetLine.classList.toggle('hidden', mode !== 'letter');
  sfx.select();
  if (state.running) start(); // đổi chế độ giữa chừng → chơi lại
}

els.tabClassic.addEventListener('click', () => selectMode('classic'));
els.tabLetter.addEventListener('click', () => selectMode('letter'));
els.btnPlay.addEventListener('click', start);
els.btnHelp.addEventListener('click', () => { sfx.select(); speak(state.instruction); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden && state.running) {
    stopTimers();
    state.running = false;
    els.ovEmoji.textContent = '⏸';
    els.ovText.textContent = t('ran.paused', 'Tạm dừng');
    els.btnPlay.textContent = t('ran.retry', 'CHƠI LẠI ▶'); // ván ngắn 45s: chơi lại từ đầu
    els.overlay.classList.remove('hidden');
  }
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
sayInstruction(t('batvit.help', 'Vịt sẽ ngoi lên ở các hố, chạm thật nhanh để bắt điểm! Chọn "Đập theo chữ" để chỉ đập đúng con vịt mang chữ cái được yêu cầu.'));

// Hook cho e2e test
window.__batvit = { state, start, selectMode, whack };
