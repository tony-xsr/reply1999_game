// Bắn Bi — tách riêng từ tro-xua/ (trước đây "Sân Chơi Ngày Bé" gộp 4 trò
// trong 1 game, nay tách thành 4 game riêng, mỗi game 1 thẻ trong Trò Chơi
// Xưa). Dùng lại NGUYÊN logic makeMarbleBoard/stepMarbles/RING_R từ
// tro-xua/src/troxua.js (không sao chép logic).

import { makeMarbleBoard, stepMarbles, RING_R } from '../../tro-xua/src/troxua.js';
import { speak, bindMute } from '../../to-mau/src/speech.js';
import { sfx } from '../../pokemon/src/sfx.js';
import { currentProfile, recordSession } from '../../pokemon/src/stats.js';
import { mountKidFeatures } from '../../shared/kid-bar.js';

const t = (key, fallback) => {
  const v = window.I18N?.t(key);
  return v && v !== key ? v : fallback;
};

const $ = (id) => document.getElementById(id);
const els = {
  subLine: $('subLine'), play: $('playScreen'),
  btnNew: $('btnNew'), btnHelp: $('btnHelp'), btnSound: $('btnSound'),
  cheer: $('cheer'), cheerEmoji: $('cheerEmoji'), cheerText: $('cheerText'), btnAgain: $('btnAgain'),
};

const state = { startedAt: Date.now(), instruction: '', raf: 0 };
bindMute(() => sfx.muted);

function confetti() {
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
}

function finish(emoji, text, score, sayText) {
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'banbi',
    result: 'win',
    score,
    level: 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  sfx.levelWin();
  confetti();
  els.cheerEmoji.textContent = emoji;
  els.cheerText.textContent = text;
  els.cheer.classList.remove('hidden');
  speak(sayText);
}

function startMarble() {
  cancelAnimationFrame(state.raf);
  els.cheer.classList.add('hidden');
  state.startedAt = Date.now();
  els.play.innerHTML = '';

  const board = makeMarbleBoard();
  const canvas = document.createElement('canvas');
  canvas.className = 'board-canvas';
  canvas.width = 640;
  canvas.height = 640;
  els.play.appendChild(canvas);
  const c2d = canvas.getContext('2d');
  let aim = null;
  let rolling = false;

  const me = board.balls[0];

  const draw = () => {
    c2d.clearRect(0, 0, 640, 640);
    c2d.strokeStyle = '#c9b28a';
    c2d.setLineDash([10, 8]);
    c2d.lineWidth = 4;
    c2d.beginPath();
    c2d.arc(320, 320, RING_R, 0, Math.PI * 2);
    c2d.stroke();
    c2d.setLineDash([]);
    if (aim && !rolling) {
      c2d.strokeStyle = '#c2410c';
      c2d.lineWidth = 4;
      c2d.beginPath();
      c2d.moveTo(me.x, me.y);
      c2d.lineTo(aim.x, aim.y);
      c2d.stroke();
    }
    for (const ball of board.balls) {
      if (ball.out) continue;
      const grad = c2d.createRadialGradient(ball.x - 5, ball.y - 6, 2, ball.x, ball.y, ball.r);
      if (ball.player) { grad.addColorStop(0, '#9fd0ff'); grad.addColorStop(1, '#1e63b5'); }
      else { grad.addColorStop(0, '#ffe3a8'); grad.addColorStop(1, '#c98a2e'); }
      c2d.fillStyle = grad;
      c2d.beginPath();
      c2d.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      c2d.fill();
    }
  };

  const hud = () => {
    els.subLine.innerHTML = `${t('troxua.marble.shots', 'Lượt bắn')}: <b>${board.shots}</b> · ${t('troxua.marble.won', 'Ăn được')}: <b>${board.won}/5</b> 🎱`;
  };

  const loop = () => {
    const wonBefore = board.won;
    const moving = stepMarbles(board);
    if (board.won > wonBefore) { sfx.match(2); hud(); }
    draw();
    if (moving) { state.raf = requestAnimationFrame(loop); return; }
    rolling = false;
    if (board.won >= 5 || board.shots <= 0) {
      setTimeout(() => finish(
        board.won >= 4 ? '🏆' : '🎱',
        `${t('troxua.marble.won', 'Ăn được')}: ${board.won}/5 🎱`,
        board.won * 10,
        board.won >= 4 ? 'Giỏi quá! Thần bi luôn!' : `Ăn được ${board.won} viên bi!`,
      ), 400);
    }
  };

  // LƯU Ý HIỆU NĂNG: đo rect() 1 LẦN lúc bắt đầu kéo (pointerdown) thay vì đo
  // lại mỗi lần pointermove — đo lại liên tục ép trình duyệt tính lại bố cục
  // (layout thrashing), nguyên nhân gây lag khi kéo ngắm đã sửa ở Phòng Xinh.
  // Đồng thời gom pointermove qua requestAnimationFrame để không vẽ lại nhiều
  // hơn tốc độ khung hình thật sự cần.
  let rect = null;
  let pendingAim = null;
  let rafAim = false;
  const pos = (e) => ({
    x: ((e.clientX - rect.left) / rect.width) * 640,
    y: ((e.clientY - rect.top) / rect.height) * 640,
  });
  const applyAim = () => {
    rafAim = false;
    if (pendingAim) { aim = pendingAim; pendingAim = null; draw(); }
  };
  canvas.addEventListener('pointerdown', (e) => {
    rect = canvas.getBoundingClientRect();
    if (!rolling && board.shots > 0) aim = pos(e);
    canvas.setPointerCapture(e.pointerId);
    draw();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!aim || rolling) return;
    pendingAim = pos(e);
    if (!rafAim) { rafAim = true; requestAnimationFrame(applyAim); }
  });
  canvas.addEventListener('pointerup', () => {
    if (!aim || rolling || board.shots <= 0) return;
    const dx = me.x - aim.x;
    const dy = me.y - aim.y;
    const power = Math.min(22, Math.hypot(dx, dy) / 9);
    if (power > 1.5) {
      me.vx = (dx / Math.hypot(dx, dy)) * power;
      me.vy = (dy / Math.hypot(dx, dy)) * power;
      board.shots--;
      rolling = true;
      sfx.select();
      hud();
      state.raf = requestAnimationFrame(loop);
    }
    aim = null;
    draw();
  });

  hud();
  state.instruction = 'Kéo bi xanh như ná cao su rồi thả để bắn bi vàng văng khỏi vòng nhé!';
  speak(state.instruction);
  draw();
}

els.btnNew.addEventListener('click', () => { sfx.shuffle(); startMarble(); });
els.btnAgain.addEventListener('click', () => { sfx.select(); startMarble(); });
els.btnHelp.addEventListener('click', () => { sfx.select(); speak(state.instruction); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
startMarble();

// Hook cho e2e test
window.__banbi = { state, startMarble };

mountKidFeatures(); // thanh avatar bé + huy hiệu sao header + kiểm tra giới hạn phút/ngày
