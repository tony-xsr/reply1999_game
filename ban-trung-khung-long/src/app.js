// Điều phối Bắn Trứng Khủng Long Từ Vựng: khủng long mẹ thả trứng rơi xuống
// theo 4 cột, mỗi quả mang 1 từ vựng. Máy công bố từ mục tiêu — bé CHỈ bắn
// trúng quả trứng mang đúng từ đó trước khi nó rơi chạm đất trong 45 giây.

import {
  ROUND_SECONDS, LANES, pickTarget, makeGame, spawnEgg, shootEgg, landEgg, tick,
} from './bantrung.js';
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
  stage: document.querySelector('.stage'),
  dinos: $('dinos'), lanes: $('lanes'), gun: $('gun'), clock: $('clock'), score: $('score'), targetTag: $('targetTag'),
  overlay: $('overlay'), ovEmoji: $('ovEmoji'), ovText: $('ovText'), btnPlay: $('btnPlay'),
  btnHelp: $('btnHelp'), btnSound: $('btnSound'),
};

const state = {
  running: false,
  hits: 0,
  timers: { clock: null, spawn: null },
  startedAt: Date.now(),
  laneEls: [],
  eggEls: new Map(), // uid -> {el, laneIdx, hideTimer}
  instruction: '',
};

bindMute(() => sfx.muted);

function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

/* ===== Dựng cột & khủng long ===== */

for (let i = 0; i < LANES; i++) {
  const dino = document.createElement('span');
  dino.textContent = '🦕';
  els.dinos.appendChild(dino);

  const lane = document.createElement('div');
  lane.className = 'lane';
  els.lanes.appendChild(lane);
  state.laneEls.push(lane);
}

/* ===== Vòng chơi ===== */

function setTarget(next) {
  state.game.target = next;
  els.targetTag.textContent = `${next.emoji} ${next.en}`;
  speak(`Find the ${next.en}!`, { lang: 'en-US', rate: 0.85 });
}

function busyLaneIndexes() {
  return [...state.eggEls.values()].map((e) => e.laneIdx);
}

function popScore(laneEl, text, good) {
  const span = document.createElement('span');
  span.className = `pop-score ${good ? 'good' : 'bad'}`;
  span.style.top = '40%';
  span.textContent = text;
  laneEl.appendChild(span);
  setTimeout(() => span.remove(), 700);
}

function removeEgg(uid) {
  const entry = state.eggEls.get(uid);
  if (!entry) return;
  clearTimeout(entry.hideTimer);
  entry.el.remove();
  state.eggEls.delete(uid);
}

function trySpawn() {
  if (!state.running) return;
  const item = spawnEgg(state.game, Math.random, busyLaneIndexes());
  if (item) {
    const laneEl = state.laneEls[item.lane];
    const eggEl = document.createElement('div');
    eggEl.className = 'egg';
    eggEl.innerHTML = `<span class="tag">${item.word.emoji} ${item.word.en}</span><span>🥚</span>`;
    const fallMs = 3400 + Math.random() * 1400;
    eggEl.style.animationDuration = `${fallMs}ms`;
    eggEl.addEventListener('pointerdown', () => onShoot(item.uid));
    laneEl.appendChild(eggEl);
    const hideTimer = setTimeout(() => {
      landEgg(state.game, item.uid);
      removeEgg(item.uid);
    }, fallMs);
    state.eggEls.set(item.uid, {
      el: eggEl, laneIdx: item.lane, hideTimer, firing: false,
    });
  }
  state.timers.spawn = setTimeout(trySpawn, 900);
}

function shootBulletTo(targetEl, done) {
  const stageRect = els.stage.getBoundingClientRect();
  const gunRect = els.gun.getBoundingClientRect();
  const tgtRect = targetEl.getBoundingClientRect();
  const startX = gunRect.left + gunRect.width / 2 - stageRect.left;
  const startY = gunRect.top + gunRect.height / 2 - stageRect.top;
  const endX = tgtRect.left + tgtRect.width / 2 - stageRect.left;
  const endY = tgtRect.top + tgtRect.height / 2 - stageRect.top;
  const angleDeg = (Math.atan2(endY - startY, endX - startX) * 180) / Math.PI;

  els.gun.classList.add('shoot');
  const bullet = document.createElement('div');
  bullet.className = 'bullet';
  bullet.textContent = '•';
  bullet.style.left = `${startX}px`;
  bullet.style.top = `${startY}px`;
  bullet.style.transform = `translate(-50%, -50%) rotate(${angleDeg}deg)`;
  els.stage.appendChild(bullet);

  requestAnimationFrame(() => {
    bullet.style.transition = 'left .16s linear, top .16s linear';
    bullet.style.left = `${endX}px`;
    bullet.style.top = `${endY}px`;
  });
  setTimeout(() => {
    bullet.remove();
    els.gun.classList.remove('shoot');
    done();
  }, 170);
}

function onShoot(uid) {
  if (!state.running) return;
  const entry = state.eggEls.get(uid);
  if (!entry || entry.firing) return;
  entry.firing = true;

  shootBulletTo(entry.el, () => {
    // Trứng có thể đã rơi chạm đất tự nhiên trong lúc đạn còn bay (rơi rất
    // nhanh) — kiểm tra lại cho chắc trước khi tính điểm.
    const stillEntry = state.eggEls.get(uid);
    if (!stillEntry) return;
    stillEntry.firing = false;

    const res = shootEgg(state.game, uid);
    if (!res) return;
    popScore(state.laneEls[stillEntry.laneIdx], `${res.delta > 0 ? '+' : ''}${res.delta}`, res.good);
    els.score.textContent = state.game.score;

    if (res.good) {
      state.hits++;
      sfx.match(2);
      answeredOne();
      stillEntry.el.classList.add('popped');
      speak(res.word.en, { lang: 'en-US', rate: 0.75 });
      if (res.targetChanged) {
        els.targetTag.textContent = `${state.game.target.emoji} ${state.game.target.en}`;
        speak(`Find the ${state.game.target.en}!`, { lang: 'en-US', rate: 0.85 });
      }
    } else {
      sfx.fail();
      stillEntry.el.classList.add('wrongHit');
    }
    clearTimeout(stillEntry.hideTimer);
    setTimeout(() => removeEgg(uid), 260);
  });
}

function tickClock() {
  tick(state.game, 1);
  els.clock.textContent = `${state.game.timeLeft}s`;
  if (state.game.over) return endRound();
  state.timers.clock = setTimeout(tickClock, 1000);
  return null;
}

function start() {
  stopTimers();
  state.running = true;
  state.hits = 0;
  state.startedAt = Date.now();
  state.game = makeGame();
  setTarget(pickTarget());
  els.score.textContent = '0';
  els.clock.textContent = `${ROUND_SECONDS}s`;
  els.overlay.classList.add('hidden');
  for (const uid of [...state.eggEls.keys()]) removeEgg(uid);
  state.timers.clock = setTimeout(tickClock, 1000);
  trySpawn();
}

function stopTimers() {
  clearTimeout(state.timers.clock);
  clearTimeout(state.timers.spawn);
  for (const entry of state.eggEls.values()) clearTimeout(entry.hideTimer);
}

function endRound() {
  stopTimers();
  state.running = false;
  for (const uid of [...state.eggEls.keys()]) removeEgg(uid);
  sfx.levelWin();
  const colors = ['#43a047', '#f5c542', '#42c5f5', '#b06af5', '#ff5aa8'];
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
    mode: 'bantrung',
    result: 'win',
    score: state.game.score,
    level: state.hits,
    seconds: ROUND_SECONDS,
  });
  els.ovEmoji.textContent = '🏆';
  els.ovText.textContent = `${t('bantrung.caught', 'Bắn trúng')}: ${state.hits} 🥚\n${t('pika.end.score', 'Điểm của bạn')}: ${state.game.score}`;
  els.btnPlay.textContent = t('ran.retry', 'CHƠI LẠI ▶');
  els.overlay.classList.remove('hidden');
  speak(`Great job! You hit ${state.hits} eggs!`, { lang: 'en-US', rate: 0.85 });
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
sayInstruction(t('bantrung.help', 'Khủng long mẹ thả trứng rơi xuống theo từng cột, mỗi quả mang 1 từ tiếng Anh. Máy sẽ đọc to từ mục tiêu — bé chỉ bắn trúng quả trứng mang ĐÚNG từ đó trước khi nó rơi chạm đất! Bắn đúng 3 lần liên tiếp thì đổi từ mục tiêu khác.'));

// Hook cho e2e test
window.__bantrung = { state, start, onShoot };

mountKidFeatures(); // thanh avatar bé + huy hiệu sao header + kiểm tra giới hạn phút/ngày
