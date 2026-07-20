// Điều phối Đào Vàng Từ Vựng: bãi đất chia ô, mỗi ô chôn 1 từ vựng. Máy công
// bố từ mục tiêu — bé đào từng ô cho tới khi đào TRÚNG ô mang đúng từ đó. Ô
// đã đào lộ ra vĩnh viễn (không lấp lại) — đào trúng là qua màn mới nhiều ô
// hơn, khó nhớ hơn.

import {
  TOTAL_LEVELS, makeGame, digTile, nextLevel,
} from './daovangtuvung.js';
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
  field: $('field'),
  levelChip: $('levelChip'), scoreChip: $('scoreChip'), targetTag: $('targetTag'),
  overlay: $('overlay'), ovEmoji: $('ovEmoji'), ovText: $('ovText'), btnPlay: $('btnPlay'),
  btnHelp: $('btnHelp'), btnSound: $('btnSound'),
};

const state = {
  game: null,
  startedAt: Date.now(),
  instruction: '',
  busy: false,
};
bindMute(() => sfx.muted);

function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

function updateHud() {
  els.levelChip.textContent = `${state.game.level}/${TOTAL_LEVELS}`;
  els.scoreChip.textContent = state.game.score;
}

function announceTarget() {
  const g = state.game;
  els.targetTag.textContent = `${g.target.emoji} ${g.target.en}`;
  speak(`Find the ${g.target.en}!`, { lang: 'en-US', rate: 0.85 });
}

function renderField() {
  els.field.innerHTML = '';
  for (const tile of state.game.tiles) {
    const btn = document.createElement('button');
    btn.className = 'tile';
    btn.textContent = '⛏️';
    btn.addEventListener('click', () => onDig(tile.uid, btn));
    els.field.appendChild(btn);
  }
  updateHud();
  announceTarget();
}

/* ===== Đào ô ===== */

function onDig(uid, btn) {
  if (state.busy || !state.game || state.game.over) return;
  const res = digTile(state.game, uid);
  if (!res) return;
  state.busy = true;
  btn.classList.add('dug', res.correct ? 'correct' : 'wrong');
  btn.textContent = res.tile.word.emoji;
  updateHud();
  answeredOne();
  speak(res.tile.word.en, { lang: 'en-US', rate: 0.75 });

  if (res.correct) {
    sfx.match(1);
    setTimeout(() => {
      state.busy = false;
      levelComplete();
    }, 600);
  } else {
    sfx.fail();
    setTimeout(() => { state.busy = false; }, 300);
  }
}

function levelComplete() {
  sfx.levelWin();
  speak(t('daovangtv.levelup', 'Giỏi quá! Qua màn tiếp theo!'));
  setTimeout(() => {
    nextLevel(state.game);
    if (state.game.over) { endGame(); return; }
    renderField();
  }, 900);
}

/* ===== Vòng đời ===== */

function confetti() {
  const colors = ['#c8963f', '#f5c542', '#35d435', '#42c5f5', '#b06af5'];
  for (let i = 0; i < 34; i++) {
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

function endGame() {
  const g = state.game;
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'daovangtv',
    result: 'win',
    score: g.score,
    level: TOTAL_LEVELS,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  sfx.levelWin();
  confetti();
  els.ovEmoji.textContent = '🏆';
  els.ovText.textContent = `${t('daovangtv.done', 'Bé đã đào trúng hết các từ vựng!')}\n⭐ ${g.score}`;
  els.btnPlay.textContent = t('ran.retry', 'CHƠI LẠI ▶');
  els.overlay.classList.remove('hidden');
}

function startGame() {
  els.overlay.classList.add('hidden');
  state.busy = false;
  state.game = makeGame(Math.random);
  state.startedAt = Date.now();
  renderField();
}

/* ===== Nút ===== */

els.btnPlay.addEventListener('click', () => { sfx.select(); startGame(); });
els.btnHelp.addEventListener('click', () => { sfx.select(); speak(state.instruction); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});

window.addEventListener('pagehide', () => {
  if (!state.game || state.game.over) return;
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'daovangtv',
    result: 'quit',
    score: state.game.score,
    level: state.game.level,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
sayInstruction(t('daovangtv.help', 'Dưới lòng đất là các ô chôn từ vựng — máy đọc to từ mục tiêu, bé đào (chạm) từng ô cho tới khi đào TRÚNG ô mang đúng từ đó! Ô đã đào sẽ lộ ra mãi mãi, đào trúng là qua màn mới nhiều ô hơn.'));

// Hook cho e2e test
window.__daovangtv = { state, startGame };

mountKidFeatures(); // thanh avatar bé + huy hiệu sao header + kiểm tra giới hạn phút/ngày
