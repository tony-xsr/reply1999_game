// Điều phối Bắn Chim Từ Vựng: chim ngoi lên ngẫu nhiên trong 9 ổ mây, mỗi con
// mang 1 từ vựng. Máy công bố từ mục tiêu — bé CHỈ bắn trúng con chim mang
// đúng từ đó trong 45 giây. Bắn đúng 3 lần liên tiếp thì đổi từ mục tiêu khác.

import {
  ROUND_SECONDS, SKY_SLOTS, TARGET_HITS_TO_CHANGE, BIRD_UP_MS,
  pickTarget, makeBirdWord, hitScore, spawnDelay,
} from './banchim.js';
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
  sky: $('sky'), clock: $('clock'), score: $('score'),
  targetTag: $('targetTag'),
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
  clouds: [], // {el, tagEl, up, word, hideTimer}
  instruction: '',
};

bindMute(() => sfx.muted);

function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

/* ===== Dựng bầu trời ===== */

for (let i = 0; i < SKY_SLOTS; i++) {
  const cloud = document.createElement('button');
  cloud.className = 'cloud';
  cloud.innerHTML = '<div class="bird-wrap"><span class="tag"></span><span class="bird">🐦</span></div>';
  cloud.addEventListener('pointerdown', () => shoot(i));
  els.sky.appendChild(cloud);
  state.clouds.push({
    el: cloud,
    tagEl: cloud.querySelector('.tag'),
    up: false,
    word: null,
    hideTimer: null,
  });
}

/* ===== Vòng chơi ===== */

function setTarget(next) {
  state.target = next;
  state.targetHits = 0;
  els.targetTag.textContent = `${next.emoji} ${next.en}`;
  speak(`Find the ${next.en}!`, { lang: 'en-US', rate: 0.85 });
}

function popBird() {
  if (!state.running) return;
  const free = state.clouds.filter((c) => !c.up);
  if (free.length) {
    const cloud = free[Math.floor(Math.random() * free.length)];
    cloud.word = makeBirdWord(state.target);
    cloud.tagEl.textContent = `${cloud.word.emoji} ${cloud.word.en}`;
    cloud.up = true;
    cloud.el.classList.add('up');
    cloud.hideTimer = setTimeout(() => sink(cloud), BIRD_UP_MS);
  }
  state.timers.spawn = setTimeout(popBird, spawnDelay(ROUND_SECONDS - state.timeLeft));
}

function sink(cloud) {
  cloud.up = false;
  clearTimeout(cloud.hideTimer);
  cloud.el.classList.remove('up', 'bonk');
}

function popScore(cloud, text, good) {
  const el = document.createElement('span');
  el.className = `pop-score ${good ? 'good' : 'bad'}`;
  el.textContent = text;
  cloud.el.appendChild(el);
  setTimeout(() => el.remove(), 700);
}

function shoot(i) {
  const cloud = state.clouds[i];
  if (!state.running || !cloud.up) return;
  const { delta, good } = hitScore(cloud.word, state.target);
  state.score = Math.max(0, state.score + delta);
  els.score.textContent = state.score;
  popScore(cloud, `${delta > 0 ? '+' : ''}${delta}`, good);

  if (good) {
    state.hits++;
    sfx.match(2);
    answeredOne();
    cloud.el.classList.add('bonk');
    setTimeout(() => sink(cloud), 240);
    speak(cloud.word.en, { lang: 'en-US', rate: 0.75 });
    if (++state.targetHits >= TARGET_HITS_TO_CHANGE) {
      setTarget(pickTarget(state.target));
    }
  } else {
    sfx.fail();
    cloud.el.classList.add('wrongHit');
    setTimeout(() => cloud.el.classList.remove('wrongHit'), 350);
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
  for (const cloud of state.clouds) sink(cloud);
  setTarget(pickTarget());
  state.timers.clock = setTimeout(tickClock, 1000);
  popBird();
}

function stopTimers() {
  clearTimeout(state.timers.clock);
  clearTimeout(state.timers.spawn);
  for (const cloud of state.clouds) clearTimeout(cloud.hideTimer);
}

function endRound() {
  stopTimers();
  state.running = false;
  for (const cloud of state.clouds) sink(cloud);
  sfx.levelWin();
  const colors = ['#42a5f5', '#f5c542', '#35d435', '#b06af5', '#ff5aa8'];
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
    mode: 'banchim',
    result: 'win',
    score: state.score,
    level: state.hits,
    seconds: ROUND_SECONDS,
  });
  els.ovEmoji.textContent = '🏆';
  els.ovText.textContent = `${t('banchim.caught', 'Bắn trúng')}: ${state.hits} 🐦\n${t('pika.end.score', 'Điểm của bạn')}: ${state.score}`;
  els.btnPlay.textContent = t('ran.retry', 'CHƠI LẠI ▶');
  els.overlay.classList.remove('hidden');
  speak(`Great job! You hit ${state.hits} birds!`, { lang: 'en-US', rate: 0.85 });
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
sayInstruction(t('banchim.help', 'Từng chú chim sẽ bay lên ở các ổ mây, mỗi con mang 1 từ tiếng Anh. Máy sẽ đọc to từ mục tiêu — bé chỉ bắn trúng con chim mang ĐÚNG từ đó! Bắn đúng 3 lần liên tiếp thì đổi từ mục tiêu khác.'));

// Hook cho e2e test
window.__banchim = { state, start, shoot };

mountKidFeatures(); // thanh avatar bé + huy hiệu sao header + kiểm tra giới hạn phút/ngày
