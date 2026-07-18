// Điều phối Hồ Cá Từ Vựng: cá bơi ngang qua 4 làn nước liên tục, mỗi con
// mang 1 từ vựng. Máy công bố từ mục tiêu — bé CHỈ câu trúng con cá mang
// đúng từ đó trong 45 giây. Câu đúng 3 lần liên tiếp thì đổi từ mục tiêu khác.

import {
  ROUND_SECONDS, LANES, TARGET_HITS_TO_CHANGE, SWIM_MS_MIN, SWIM_MS_MAX,
  pickTarget, makeFishWord, catchScore, spawnDelay, pickFreeLane,
} from './hoca.js';
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
  pond: $('pond'), clock: $('clock'), score: $('score'), targetTag: $('targetTag'),
  overlay: $('overlay'), ovEmoji: $('ovEmoji'), ovText: $('ovText'), btnPlay: $('btnPlay'),
  btnHelp: $('btnHelp'), btnSound: $('btnSound'),
};

const state = {
  running: false,
  score: 0,
  hits: 0,
  timeLeft: ROUND_SECONDS,
  target: null,
  targetHits: 0,
  timers: { clock: null, spawn: null },
  startedAt: Date.now(),
  lanes: [], // {el, fishUid|null}
  instruction: '',
};
let nextUid = 1;

bindMute(() => sfx.muted);

function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

/* ===== Dựng hồ ===== */

for (let i = 0; i < LANES; i++) {
  const lane = document.createElement('div');
  lane.className = 'lane';
  els.pond.appendChild(lane);
  state.lanes.push({ el: lane, fishUid: null });
}

/* ===== Vòng chơi ===== */

function setTarget(next) {
  state.target = next;
  state.targetHits = 0;
  els.targetTag.textContent = `${next.emoji} ${next.en}`;
  speak(`Find the ${next.en}!`, { lang: 'en-US', rate: 0.85 });
}

function busyLaneIndexes() {
  return state.lanes.map((l, i) => (l.fishUid !== null ? i : -1)).filter((i) => i >= 0);
}

function popScore(el, text, good) {
  const span = document.createElement('span');
  span.className = `pop-score ${good ? 'good' : 'bad'}`;
  span.textContent = text;
  el.appendChild(span);
  setTimeout(() => span.remove(), 700);
}

function removeFish(laneIdx, fishEl) {
  const lane = state.lanes[laneIdx];
  if (lane.fishUid !== null) lane.fishUid = null;
  fishEl.remove();
}

function spawnFish() {
  if (!state.running) return;
  const laneIdx = pickFreeLane(busyLaneIndexes());
  if (laneIdx >= 0) {
    const uid = nextUid++;
    const word = makeFishWord(state.target);
    const lane = state.lanes[laneIdx];
    lane.fishUid = uid;
    const fishEl = document.createElement('div');
    fishEl.className = 'fish';
    fishEl.innerHTML = `<span class="tag">${word.emoji} ${word.en}</span><span>🐟</span>`;
    const swimMs = SWIM_MS_MIN + Math.random() * (SWIM_MS_MAX - SWIM_MS_MIN);
    fishEl.style.animationDuration = `${swimMs}ms`;
    fishEl.addEventListener('pointerdown', () => catchFish(laneIdx, uid, word, fishEl));
    lane.el.appendChild(fishEl);
    setTimeout(() => {
      if (lane.fishUid === uid) removeFish(laneIdx, fishEl);
    }, swimMs);
  }
  state.timers.spawn = setTimeout(spawnFish, spawnDelay(ROUND_SECONDS - state.timeLeft));
}

function catchFish(laneIdx, uid, word, fishEl) {
  const lane = state.lanes[laneIdx];
  if (!state.running || lane.fishUid !== uid) return;
  const { delta, good } = catchScore(word, state.target);
  state.score = Math.max(0, state.score + delta);
  els.score.textContent = state.score;
  popScore(fishEl, `${delta > 0 ? '+' : ''}${delta}`, good);

  if (good) {
    state.hits++;
    sfx.match(2);
    answeredOne();
    fishEl.classList.add('caught');
    speak(word.en, { lang: 'en-US', rate: 0.75 });
    setTimeout(() => removeFish(laneIdx, fishEl), 320);
    if (++state.targetHits >= TARGET_HITS_TO_CHANGE) {
      setTarget(pickTarget(state.target));
    }
  } else {
    sfx.fail();
    fishEl.classList.add('wrongHit');
    setTimeout(() => fishEl.classList.remove('wrongHit'), 350);
    speak(`Find the ${state.target.en}!`, { lang: 'en-US', rate: 0.85 });
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
  for (const lane of state.lanes) { lane.el.innerHTML = ''; lane.fishUid = null; }
  setTarget(pickTarget());
  state.timers.clock = setTimeout(tickClock, 1000);
  spawnFish();
}

function stopTimers() {
  clearTimeout(state.timers.clock);
  clearTimeout(state.timers.spawn);
}

function endRound() {
  stopTimers();
  state.running = false;
  for (const lane of state.lanes) { lane.el.innerHTML = ''; lane.fishUid = null; }
  sfx.levelWin();
  const colors = ['#29b6f6', '#f5c542', '#35d435', '#b06af5', '#ff5aa8'];
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
    mode: 'hoca',
    result: 'win',
    score: state.score,
    level: state.hits,
    seconds: ROUND_SECONDS,
  });
  els.ovEmoji.textContent = '🏆';
  els.ovText.textContent = `${t('hoca.caught', 'Câu trúng')}: ${state.hits} 🐟\n${t('pika.end.score', 'Điểm của bạn')}: ${state.score}`;
  els.btnPlay.textContent = t('ran.retry', 'CHƠI LẠI ▶');
  els.overlay.classList.remove('hidden');
  speak(`Great job! You caught ${state.hits} fish!`, { lang: 'en-US', rate: 0.85 });
}

/* ===== Nút ===== */

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
    els.btnPlay.textContent = t('ran.retry', 'CHƠI LẠI ▶');
    els.overlay.classList.remove('hidden');
  }
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
sayInstruction(t('hoca.help', 'Cá sẽ bơi ngang qua hồ theo từng làn nước, mỗi con mang 1 từ tiếng Anh. Máy sẽ đọc to từ mục tiêu — bé chỉ câu trúng con cá mang ĐÚNG từ đó! Câu đúng 3 lần liên tiếp thì đổi từ mục tiêu khác.'));

// Hook cho e2e test
window.__hoca = { state, start, catchFish };

mountKidFeatures(); // thanh avatar bé + huy hiệu sao header + kiểm tra giới hạn phút/ngày
