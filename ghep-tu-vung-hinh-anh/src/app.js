// Điều phối Ghép Từ Vựng Và Hình Ảnh: bàn thẻ trí nhớ — mỗi từ có 1 lá hình
// (emoji) và 1 lá chữ (từ tiếng Anh). Bé lật 2 lá bất kỳ; đúng cặp thì giữ mở
// + máy đọc to từ đó, sai cặp thì rung nhẹ rồi úp lại. Ghép hết bàn là qua
// màn mới (nhiều cặp hơn), hết 6 màn là hoàn thành.

import {
  TOTAL_LEVELS, makeGame, flipCard, resolveFlip, isLevelComplete, nextLevel,
} from './ghepvung.js';
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
  board: $('board'),
  levelChip: $('levelChip'), scoreChip: $('scoreChip'),
  overlay: $('overlay'), ovEmoji: $('ovEmoji'), ovText: $('ovText'), btnPlay: $('btnPlay'),
  btnHelp: $('btnHelp'), btnSound: $('btnSound'),
};

const state = {
  game: null,
  startedAt: Date.now(),
  instruction: '',
  busy: false,
  cardEls: new Map(),
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
  els.board.innerHTML = '';
  state.cardEls.clear();
  for (const card of state.game.cards) {
    const btn = document.createElement('button');
    btn.className = 'card';
    btn.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-back">❔</div>
        <div class="card-face card-front"></div>
      </div>`;
    btn.querySelector('.card-front').textContent = card.kind === 'picture' ? card.word.emoji : card.word.en;
    btn.addEventListener('click', () => onFlip(card.uid, btn));
    els.board.appendChild(btn);
    state.cardEls.set(card.uid, btn);
  }
  updateHud();
}

/* ===== Lật thẻ ===== */

function onFlip(uid, btn) {
  if (state.busy || !state.game || state.game.over) return;
  const card = state.game.cards.find((c) => c.uid === uid);
  if (!card || card.matched || btn.classList.contains('open')) return;

  const res = flipCard(state.game, uid);
  if (!res) return;
  btn.classList.add('open');
  sfx.select();

  if (res.flipped) return;

  state.busy = true;
  updateHud();
  if (res.pairResult === 'match') {
    for (const c of res.cards) state.cardEls.get(c.uid).classList.add('matched');
    sfx.match(1);
    answeredOne();
    const shownWord = res.cards[0].word;
    speakEn(shownWord.en);
    resolveFlip(state.game);
    setTimeout(() => {
      state.busy = false;
      if (isLevelComplete(state.game)) levelComplete();
    }, 260);
  } else {
    sfx.fail();
    const cardBtns = res.cards.map((c) => state.cardEls.get(c.uid));
    for (const el of cardBtns) el.classList.add('mismatch');
    setTimeout(() => {
      for (const el of cardBtns) { el.classList.remove('open', 'mismatch'); }
      resolveFlip(state.game);
      state.busy = false;
    }, 900);
  }
}

function levelComplete() {
  sfx.levelWin();
  speak(t('ghepvung.levelup', 'Giỏi quá! Qua màn tiếp theo!'));
  setTimeout(() => {
    nextLevel(state.game);
    if (state.game.over) { endGame(); return; }
    renderLevel();
  }, 900);
}

/* ===== Vòng đời ===== */

function confetti() {
  const colors = ['#fb8c00', '#f5c542', '#ff7043', '#42c5f5', '#b06af5'];
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
    mode: 'ghepvung',
    result: 'win',
    score: g.score,
    level: TOTAL_LEVELS,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  sfx.levelWin();
  confetti();
  els.ovEmoji.textContent = '🏆';
  els.ovText.textContent = `${t('ghepvung.done', 'Bé đã ghép xong hết các cặp từ vựng!')}\n⭐ ${g.score}`;
  els.btnPlay.textContent = t('xepchu.next', 'CHƠI LẠI ▶');
  els.overlay.classList.remove('hidden');
}

function startGame() {
  els.overlay.classList.add('hidden');
  state.busy = false;
  state.game = makeGame(Math.random);
  state.startedAt = Date.now();
  renderLevel();
}

/* ===== Nút ===== */

els.btnPlay.addEventListener('click', () => { sfx.select(); startGame(); });
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
    mode: 'ghepvung',
    result: 'quit',
    score: state.game.score,
    level: state.game.level,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
sayInstruction(t('ghepvung.help', 'Lật 2 lá bài bất kỳ — nếu 1 lá hình và 1 lá chữ cùng là một từ, bé thắng cặp đó và máy sẽ đọc to từ tiếng Anh! Ghép hết cả bàn là qua màn mới, đi hết 6 màn là hoàn thành.'));

// Hook cho e2e test
window.__ghepvung = { state, startGame };

mountKidFeatures(); // thanh avatar bé + huy hiệu sao header + kiểm tra giới hạn phút/ngày
