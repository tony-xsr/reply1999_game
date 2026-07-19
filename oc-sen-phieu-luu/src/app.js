// Điều phối Ốc Sên Phiêu Lưu Ăn Từ Vựng: chú ốc sên bò dọc hàng thức ăn
// (trái cây/đồ vật) — bé chạm vào món nào, ốc sên bò tới ăn, máy đọc to tên
// tiếng Anh của món đó. Ăn hết cả hàng là qua màn mới (nhiều món hơn 1
// chút), đi hết 8 màn thì hoàn thành cuộc phiêu lưu. Không có đáp án sai.

import {
  TOTAL_LEVELS, makeGame, eatFood, isLevelComplete, nextLevel,
} from './ocsen.js';
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
  trail: $('trail'), snail: $('snail'), foods: $('foods'),
  levelChip: $('levelChip'), scoreChip: $('scoreChip'),
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

function speakEn(text, rate = 0.7) {
  speak(text, { lang: 'en-US', rate });
}

function updateHud() {
  els.levelChip.textContent = `${state.game.level}/${TOTAL_LEVELS}`;
  els.scoreChip.textContent = state.game.score;
}

function renderLevel() {
  els.foods.innerHTML = '';
  els.snail.style.transform = 'translateX(0) scaleX(-1)';
  for (const food of state.game.foods) {
    const btn = document.createElement('button');
    btn.className = `food-btn${food.eaten ? ' eaten' : ''}`;
    btn.textContent = food.word.emoji;
    btn.addEventListener('click', () => onEat(food.uid, btn));
    els.foods.appendChild(btn);
  }
  updateHud();
}

function moveSnailTo(btn) {
  const trailRect = els.trail.getBoundingClientRect();
  const btnRect = btn.getBoundingClientRect();
  const offset = btnRect.left - trailRect.left;
  // scaleX(-1) lật emoji 🐌 (vốn quay đầu về trái) để đầu luôn hướng đúng
  // chiều bò tới (sang phải), không bò lùi/đuôi đi trước.
  els.snail.style.transform = `translateX(${offset}px) scaleX(-1)`;
}

/* ===== Ăn thức ăn ===== */

function onEat(uid, btn) {
  if (state.busy || !state.game || state.game.over) return;
  const word = eatFood(state.game, uid);
  if (!word) return;
  state.busy = true;
  btn.classList.add('eaten');
  moveSnailTo(btn);
  sfx.match(1);
  updateHud();
  answeredOne();
  speakEn(word.en);

  setTimeout(() => {
    state.busy = false;
    if (isLevelComplete(state.game)) levelComplete();
  }, 260);
}

function levelComplete() {
  sfx.levelWin();
  speak(t('ocsen.levelup', 'Giỏi quá! Qua màn tiếp theo!'));
  setTimeout(() => {
    nextLevel(state.game);
    if (state.game.over) { endAdventure(); return; }
    renderLevel();
  }, 900);
}

/* ===== Vòng đời cuộc phiêu lưu ===== */

function confetti() {
  const colors = ['#4caf50', '#f5c542', '#35d435', '#42c5f5', '#b06af5'];
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

function endAdventure() {
  const g = state.game;
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'ocsen',
    result: 'win',
    score: g.score,
    level: TOTAL_LEVELS,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  sfx.levelWin();
  confetti();
  els.ovEmoji.textContent = '🏆';
  els.ovText.textContent = `${t('ocsen.done', 'Ốc sên đã hoàn thành cuộc phiêu lưu!')}\n⭐ ${g.score}`;
  els.btnPlay.textContent = t('xepchu.next', 'CHƠI LẠI ▶');
  els.overlay.classList.remove('hidden');
}

function startAdventure() {
  els.overlay.classList.add('hidden');
  state.busy = false;
  state.game = makeGame(Math.random);
  state.startedAt = Date.now();
  renderLevel();
}

/* ===== Nút ===== */

els.btnPlay.addEventListener('click', () => { sfx.select(); startAdventure(); });
els.btnHelp.addEventListener('click', () => { sfx.select(); speak(state.instruction); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});

// Ghi thời gian chơi khi rời trang giữa chừng (cuộc phiêu lưu chưa xong cũng vẫn ghi)
window.addEventListener('pagehide', () => {
  if (!state.game || state.game.over) return;
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'ocsen',
    result: 'quit',
    score: state.game.score,
    level: state.game.level,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
sayInstruction(t('ocsen.help', 'Chạm vào món ăn trên đường để chú ốc sên bò tới ăn — máy sẽ đọc to tên tiếng Anh của món đó! Ăn hết cả hàng là qua màn mới, đi hết 8 màn là hoàn thành cuộc phiêu lưu. Không có đáp án sai, ăn món nào cũng được nhé!'));

// Hook cho e2e test
window.__ocsen = { state, startAdventure };

mountKidFeatures(); // thanh avatar bé + huy hiệu sao header + kiểm tra giới hạn phút/ngày
