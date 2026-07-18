// Điều phối Leo Thác Vượt Bẫy: máy đọc to 1 từ tiếng Anh, bé chạm đúng lối đi
// (trái/phải) mang hình vật đó để leo lên 1 bậc — chọn nhầm là sập bẫy, thua
// ngay lập tức (không có cơ hội chọn lại, khác các game "nghe & đoán" khác).

import {
  TOTAL_STEPS, START_HEARTS, makeGame, currentStep, choosePath,
} from './leothac.js';
import { speak, speakSequence, bindMute } from '../../to-mau/src/speech.js';
import { sfx } from '../../pokemon/src/sfx.js';
import { currentProfile, recordSession } from '../../pokemon/src/stats.js';
import { mountKidFeatures, answeredOne } from '../../shared/kid-bar.js';

const t = (key, fallback) => {
  const v = window.I18N?.t(key);
  return v && v !== key ? v : fallback;
};

const $ = (id) => document.getElementById(id);
const els = {
  ladder: $('ladder'), stepChip: $('stepChip'), scoreChip: $('scoreChip'), heartsChip: $('heartsChip'),
  pathLeft: $('pathLeft'), pathRight: $('pathRight'), climber: $('climber'),
  overlay: $('overlay'), ovEmoji: $('ovEmoji'), ovText: $('ovText'), btnPlay: $('btnPlay'),
  btnListen: $('btnListen'), btnHelp: $('btnHelp'), btnSound: $('btnSound'),
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

function speakEn(text, rate = 0.68) {
  speak(text, { lang: 'en-US', rate });
}

/* ===== Vẽ thang leo ===== */

function renderLadder() {
  els.ladder.innerHTML = '';
  for (let i = 0; i < TOTAL_STEPS; i++) {
    const rung = document.createElement('div');
    rung.className = `rung${i < state.game.stepIndex ? ' done' : ''}`;
    els.ladder.appendChild(rung);
  }
}

function updateHud() {
  els.stepChip.textContent = `${state.game.stepIndex}/${TOTAL_STEPS}`;
  els.scoreChip.textContent = state.game.score;
  els.heartsChip.textContent = '❤️'.repeat(state.game.hearts) + '🖤'.repeat(START_HEARTS - state.game.hearts);
}

function clearPathClasses() {
  for (const card of [els.pathLeft, els.pathRight]) {
    card.classList.remove('correct', 'wrong', 'dim');
    card.disabled = false;
  }
  els.climber.classList.remove('fall');
}

function renderStep() {
  clearPathClasses();
  const step = currentStep(state.game);
  els.pathLeft.querySelector('.path-emoji').textContent = step.left.emoji;
  els.pathRight.querySelector('.path-emoji').textContent = step.right.emoji;
  renderLadder();
  updateHud();
}

function speakStep() {
  const step = currentStep(state.game);
  speakEn(step.target.en);
}

/* ===== Chọn lối ===== */

function onPick(side) {
  if (state.busy || !state.game || state.game.over) return;
  state.busy = true;
  const step = currentStep(state.game);
  const chosenCard = side === 'left' ? els.pathLeft : els.pathRight;
  const otherCard = side === 'left' ? els.pathRight : els.pathLeft;
  const ev = choosePath(state.game, side);

  if (ev.fell) {
    chosenCard.classList.add('wrong');
    otherCard.classList.add('correct');
    sfx.fail();
    updateHud();
    answeredOne();

    if (ev.gameDone) {
      // Hết sạch tim — sập bẫy thật sự, ván kết thúc.
      els.climber.classList.add('fall');
      speakSequence([
        { text: 'Hết tim rồi, sập bẫy thật sự! Đáp án đúng là', lang: 'vi-VN', rate: 0.92 },
        { text: step.target.en, lang: 'en-US', rate: 0.7 },
        { text: `nghĩa là ${step.target.vi}.`, lang: 'vi-VN', rate: 0.88 },
      ], () => {
        state.busy = false;
        endRound(false);
      });
      return;
    }

    // Còn tim: cho thử lại ngay bậc này với 1 cặp từ mới, KHÔNG kết thúc ván.
    speakSequence([
      { text: 'Sập bẫy rồi, mất 1 trái tim! Đáp án đúng là', lang: 'vi-VN', rate: 0.92 },
      { text: step.target.en, lang: 'en-US', rate: 0.7 },
      { text: `nghĩa là ${step.target.vi}. Thử lại nhé!`, lang: 'vi-VN', rate: 0.88 },
    ], () => {
      state.busy = false;
      renderStep();
      setTimeout(() => speakStep(), 250);
    });
    return;
  }

  chosenCard.classList.add('correct');
  otherCard.classList.add('dim');
  sfx.match(1);
  updateHud();
  answeredOne();

  if (ev.gameDone) {
    speakSequence([
      { text: 'Tuyệt vời, bé đã leo lên tới đỉnh thác!', lang: 'vi-VN', rate: 0.92 },
      { text: step.target.en, lang: 'en-US', rate: 0.7 },
    ], () => {
      state.busy = false;
      endRound(true);
    });
    return;
  }

  speakSequence([
    { text: 'Đúng rồi!', lang: 'vi-VN', rate: 0.94 },
    { text: step.target.en, lang: 'en-US', rate: 0.7 },
  ], () => {
    state.busy = false;
    renderStep();
    setTimeout(() => speakStep(), 250);
  });
}

els.pathLeft.addEventListener('click', () => onPick('left'));
els.pathRight.addEventListener('click', () => onPick('right'));

/* ===== Vòng đời ván chơi ===== */

function confetti() {
  const colors = ['#17a2b8', '#f5c542', '#35d435', '#42c5f5', '#e53935'];
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

function endRound(won) {
  const g = state.game;
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'leothac',
    result: won ? 'win' : 'loss',
    score: g.score,
    level: 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  if (won) {
    sfx.levelWin();
    confetti();
    els.ovEmoji.textContent = '🏆';
    els.ovText.textContent = `${t('leothac.win', 'Bé đã leo lên tới đỉnh thác! Giỏi quá!')}\n⭐ ${g.score}`;
    els.btnPlay.textContent = t('xepchu.next', 'CHƠI LẠI ▶');
  } else {
    sfx.gameOver();
    els.ovEmoji.textContent = '🕳️';
    els.ovText.textContent = `${t('leothac.lose', 'Sập bẫy rồi! Nghe kỹ hơn rồi thử lại nhé!')}\n⭐ ${g.score}  ·  ${t('leothac.stepreached', 'Leo được')} ${g.stepIndex}/${TOTAL_STEPS}`;
    els.btnPlay.textContent = t('nghedoan.retry', 'CHƠI LẠI ▶');
  }
  els.overlay.classList.remove('hidden');
}

function startRound() {
  els.overlay.classList.add('hidden');
  state.busy = false;
  state.game = makeGame(TOTAL_STEPS, Math.random);
  state.startedAt = Date.now();
  renderStep();
  setTimeout(() => speakStep(), 300);
}

/* ===== Nút ===== */

els.btnPlay.addEventListener('click', () => { sfx.select(); startRound(); });
els.btnListen.addEventListener('click', () => { sfx.select(); speakStep(); });
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
    mode: 'leothac',
    result: 'quit',
    score: state.game.score,
    level: 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
sayInstruction(t('leothac.help', 'Máy sẽ đọc to 1 từ tiếng Anh — bé chạm đúng lối đi có hình vật đó để leo lên 1 bậc thác! Mỗi màn có 5 trái tim, chọn nhầm lối là sập bẫy mất 1 tim nhưng vẫn được thử lại — hết sạch tim mới thua. Leo hết 10 bậc là lên tới đỉnh!'));

// Hook cho e2e test
window.__leothac = { state, startRound };

mountKidFeatures(); // thanh avatar bé + huy hiệu sao header + kiểm tra giới hạn phút/ngày
