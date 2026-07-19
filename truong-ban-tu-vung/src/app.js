// Điều phối Trường Bắn Từ Vựng: cả hàng mục tiêu đứng yên cùng lúc, máy
// xướng tên lần lượt từng từ — bé phải bắn TRÚNG mục tiêu đang được gọi tên
// giữa các lựa chọn nhìn thấy hết. Hạ hết cả hàng là qua màn mới nhiều mục
// tiêu hơn, đi hết 6 màn là hoàn thành.

import {
  TOTAL_LEVELS, makeGame, shoot, nextLevel,
} from './truongban.js';
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
  range: $('range'), gun: $('gun'),
  levelChip: $('levelChip'), scoreChip: $('scoreChip'), targetTag: $('targetTag'),
  overlay: $('overlay'), ovEmoji: $('ovEmoji'), ovText: $('ovText'), btnPlay: $('btnPlay'),
  btnHelp: $('btnHelp'), btnSound: $('btnSound'),
};

const state = {
  game: null,
  startedAt: Date.now(),
  instruction: '',
  busy: false,
  canEls: new Map(),
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

function announceCurrent() {
  const g = state.game;
  if (!g.current) return;
  els.targetTag.textContent = `${g.current.emoji} ${g.current.en}`;
  speak(`Find the ${g.current.en}!`, { lang: 'en-US', rate: 0.85 });
}

function renderRange() {
  els.range.innerHTML = '';
  state.canEls.clear();
  for (const tg of state.game.targets) {
    const btn = document.createElement('button');
    btn.className = 'can';
    btn.innerHTML = `<span class="em">${tg.word.emoji}</span><span class="word">${tg.word.en}</span>`;
    btn.addEventListener('click', () => onShoot(tg.uid, btn));
    els.range.appendChild(btn);
    state.canEls.set(tg.uid, btn);
  }
  updateHud();
  announceCurrent();
}

/* ===== Bắn: viên đạn bay từ khẩu súng tới mục tiêu vừa chạm ===== */

function impactRing(x, y) {
  const ring = document.createElement('div');
  ring.className = 'impact-ring';
  ring.style.left = `${x}px`;
  ring.style.top = `${y}px`;
  els.stage.appendChild(ring);
  setTimeout(() => ring.remove(), 420);
}

function shootBulletTo(targetBtn, done) {
  const stageRect = els.stage.getBoundingClientRect();
  const gunRect = els.gun.getBoundingClientRect();
  const tgtRect = targetBtn.getBoundingClientRect();
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
    bullet.style.transition = 'left .22s linear, top .22s linear';
    bullet.style.left = `${endX}px`;
    bullet.style.top = `${endY}px`;
  });
  setTimeout(() => {
    bullet.remove();
    impactRing(endX, endY);
    els.gun.classList.remove('shoot');
    done();
  }, 230);
}

function onShoot(uid, btn) {
  if (state.busy || !state.game || state.game.over) return;
  state.busy = true;
  sfx.select();

  shootBulletTo(btn, () => {
    const res = shoot(state.game, uid);
    if (!res) { state.busy = false; return; }

    if (res.correct) {
      sfx.match(1);
      answeredOne();
      btn.classList.add('down');
      speak(res.target.word.en, { lang: 'en-US', rate: 0.75 });
      updateHud();
      if (res.roundDone) {
        setTimeout(() => { state.busy = false; levelComplete(); }, 700);
      } else {
        announceCurrent();
        state.busy = false;
      }
    } else {
      sfx.fail();
      btn.classList.add('wrongHit');
      setTimeout(() => btn.classList.remove('wrongHit'), 350);
      state.busy = false;
    }
  });
}

function levelComplete() {
  sfx.levelWin();
  speak(t('truongban.levelup', 'Giỏi quá! Qua màn tiếp theo!'));
  setTimeout(() => {
    nextLevel(state.game);
    if (state.game.over) { endGame(); return; }
    renderRange();
  }, 900);
}

/* ===== Vòng đời ===== */

function confetti() {
  const colors = ['#ff8a50', '#f5c542', '#35d435', '#42c5f5', '#b06af5'];
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
    mode: 'truongban',
    result: 'win',
    score: g.score,
    level: TOTAL_LEVELS,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  sfx.levelWin();
  confetti();
  els.ovEmoji.textContent = '🏆';
  els.ovText.textContent = `${t('truongban.done', 'Bé đã bắn hạ hết mục tiêu!')}\n⭐ ${g.score}`;
  els.btnPlay.textContent = t('ran.retry', 'CHƠI LẠI ▶');
  els.overlay.classList.remove('hidden');
}

function startGame() {
  els.overlay.classList.add('hidden');
  state.busy = false;
  state.game = makeGame(Math.random);
  state.startedAt = Date.now();
  renderRange();
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
    mode: 'truongban',
    result: 'quit',
    score: state.game.score,
    level: state.game.level,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
sayInstruction(t('truongban.help', 'Cả hàng mục tiêu đứng yên, mỗi cái mang 1 từ tiếng Anh. Máy sẽ xướng tên từng từ — bé phải bắn TRÚNG mục tiêu đang được gọi tên, bắn nhầm không tính! Hạ hết cả hàng là qua màn mới nhiều mục tiêu hơn.'));

// Hook cho e2e test
window.__truongban = { state, startGame };

mountKidFeatures(); // thanh avatar bé + huy hiệu sao header + kiểm tra giới hạn phút/ngày
