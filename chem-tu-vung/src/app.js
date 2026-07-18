// Điều phối Chém Từ Vựng: icon trái cây/đồ vật bay lên từ dưới màn hình
// trong 45 giây — chạm/"chém" TRÚNG icon nào, máy đọc to tên tiếng Anh của
// icon đó và cộng điểm. Không có đáp án sai, cứ chém thoải mái để nghe
// thật nhiều từ mới.

import {
  ROUND_SECONDS, makeGame, spawnItem, sliceItem, expireItem, tick,
} from './chemtuvung.js';
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
  arena: $('arena'), clockChip: $('clockChip'), scoreChip: $('scoreChip'),
  overlay: $('overlay'), ovEmoji: $('ovEmoji'), ovText: $('ovText'), btnPlay: $('btnPlay'),
  btnHelp: $('btnHelp'), btnSound: $('btnSound'),
};

const SPAWN_MS = 1000;
const TICK_MS = 200;
const RISE_MS_MIN = 3000;
const RISE_MS_MAX = 4200;

const state = {
  game: null,
  startedAt: Date.now(),
  instruction: '',
  spawnTimer: null,
  tickTimer: null,
  els: new Map(), // uid -> DOM element đang bay
};
bindMute(() => sfx.muted);

function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

function speakEn(text, rate = 0.7) {
  speak(text, { lang: 'en-US', rate });
}

function updateHud() {
  els.clockChip.textContent = `${Math.ceil(state.game.timeLeft)}s`;
  els.scoreChip.textContent = state.game.score;
}

/* ===== Icon bay lên ===== */

function removeFlying(uid) {
  const el = state.els.get(uid);
  if (el) { el.remove(); state.els.delete(uid); }
}

function trySpawn() {
  const item = spawnItem(state.game, Math.random);
  if (!item) return;
  const riseMs = RISE_MS_MIN + Math.random() * (RISE_MS_MAX - RISE_MS_MIN);
  const el = document.createElement('div');
  el.className = 'flying';
  el.textContent = item.word.emoji;
  const leftPct = 8 + Math.random() * 78;
  el.style.left = `${leftPct}%`;
  el.style.animationDuration = `${riseMs}ms`;
  el.addEventListener('pointerdown', () => onSlice(item.uid));
  els.arena.appendChild(el);
  state.els.set(item.uid, el);

  setTimeout(() => {
    if (expireItem(state.game, item.uid)) removeFlying(item.uid);
  }, riseMs);
}

function slashMarkAt(el) {
  const mark = document.createElement('div');
  mark.className = 'slash-mark';
  mark.textContent = '💥';
  mark.style.left = el.style.left;
  mark.style.bottom = `${el.getBoundingClientRect().bottom - els.arena.getBoundingClientRect().top}px`;
  els.arena.appendChild(mark);
  setTimeout(() => mark.remove(), 500);
}

function onSlice(uid) {
  if (!state.game || state.game.over) return;
  const word = sliceItem(state.game, uid);
  if (!word) return;
  const el = state.els.get(uid);
  if (el) {
    slashMarkAt(el);
    el.classList.add('sliced');
    setTimeout(() => removeFlying(uid), 260);
  }
  sfx.match(1);
  updateHud();
  answeredOne();
  speakEn(word.en);
}

/* ===== Vòng đời ván chơi ===== */

function confetti() {
  const colors = ['#ff5a3d', '#f5c542', '#35d435', '#42c5f5', '#b06af5'];
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.setProperty('--x', `${Math.random() * 100}vw`);
    p.style.setProperty('--delay', `${Math.random() * 0.4}s`);
    p.style.setProperty('--rot', `${Math.random() * 720 - 360}deg`);
    p.style.background = colors[i % colors.length];
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 2200);
  }
}

function endRound() {
  clearInterval(state.spawnTimer);
  clearInterval(state.tickTimer);
  for (const uid of [...state.els.keys()]) removeFlying(uid);

  const g = state.game;
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'chemtuvung',
    result: 'win',
    score: g.score,
    level: 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  sfx.levelWin();
  confetti();
  els.ovEmoji.textContent = '🏆';
  els.ovText.textContent = `${t('chemtv.done', 'Hết giờ! Bé đã chém trúng')} ${g.slicedCount} ${t('chemtv.icons', 'icon')}!\n⭐ ${g.score}`;
  els.btnPlay.textContent = t('nghedoan.retry', 'CHƠI LẠI ▶');
  els.overlay.classList.remove('hidden');
}

function startRound() {
  els.overlay.classList.add('hidden');
  state.game = makeGame();
  state.startedAt = Date.now();
  state.els.clear();
  els.arena.innerHTML = '';
  updateHud();

  state.spawnTimer = setInterval(trySpawn, SPAWN_MS);
  state.tickTimer = setInterval(() => {
    tick(state.game, TICK_MS / 1000);
    updateHud();
    if (state.game.over) endRound();
  }, TICK_MS);
  trySpawn();
}

/* ===== Nút ===== */

els.btnPlay.addEventListener('click', () => { sfx.select(); startRound(); });
els.btnHelp.addEventListener('click', () => { sfx.select(); speak(state.instruction); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});

// Ghi thời gian chơi khi rời trang giữa chừng (ván chưa xong cũng vẫn ghi)
window.addEventListener('pagehide', () => {
  if (!state.game || state.game.over) return;
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'chemtuvung',
    result: 'quit',
    score: state.game.score,
    level: 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
sayInstruction(t('chemtv.help', 'Icon trái cây/đồ vật sẽ bay lên từ dưới màn hình — chạm thật nhanh vào icon nào bé thích, máy sẽ đọc to tên tiếng Anh của nó! Không có đáp án sai, cứ chém thoải mái để nghe thật nhiều từ mới trong 45 giây nhé.'));

// Hook cho e2e test
window.__chemtuvung = { state, startRound };

mountKidFeatures(); // thanh avatar bé + huy hiệu sao header + kiểm tra giới hạn phút/ngày
