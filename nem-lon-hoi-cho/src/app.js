// Ném Lon (hội chợ quê) — tách riêng từ tro-xua/ (trước đây "Sân Chơi Ngày
// Bé" gộp 4 trò trong 1 game, nay tách thành 4 game riêng, mỗi game 1 thẻ
// trong Trò Chơi Xưa). Dùng lại NGUYÊN logic makeCans/throwBall/stepCans/
// TABLE_Y/TABLE_X từ tro-xua/src/troxua.js (không sao chép logic).
// Lưu ý: khác hẳn nem-lon-tu-vung/ (game "Ôn Tập Vui" mượn khung ontap.js để
// ôn TỪ VỰNG tiếng Anh) — đây là bản gốc cổ điển thuần vật lý, không từ vựng.

import { makeCans, throwBall, stepCans, TABLE_Y, TABLE_X } from '../../tro-xua/src/troxua.js';
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
    mode: 'nemlonxua',
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

function startCans() {
  cancelAnimationFrame(state.raf);
  els.cheer.classList.add('hidden');
  state.startedAt = Date.now();
  els.play.innerHTML = '';

  const game = makeCans();
  const canvas = document.createElement('canvas');
  canvas.className = 'board-canvas';
  canvas.width = 640;
  canvas.height = 640;
  els.play.appendChild(canvas);
  const c2d = canvas.getContext('2d');
  let aim = null;
  let ball = null;
  let flying = false;

  const draw = () => {
    c2d.clearRect(0, 0, 640, 640);
    c2d.fillStyle = '#f3e7cf';
    c2d.fillRect(0, 600, 640, 40);
    c2d.fillStyle = '#c9a86a';
    c2d.fillRect(TABLE_X[0], TABLE_Y, TABLE_X[1] - TABLE_X[0], 16);
    c2d.fillRect(TABLE_X[0] + 20, TABLE_Y, 14, 640 - TABLE_Y - 40);
    c2d.fillRect(TABLE_X[1] - 34, TABLE_Y, 14, 640 - TABLE_Y - 40);
    for (const can of game.cans) {
      c2d.save();
      c2d.translate(can.x, can.y);
      if (can.down) c2d.rotate(1.35);
      c2d.fillStyle = can.down ? '#b9b2c4' : '#7ba7d4';
      c2d.fillRect(-can.w / 2, -can.h / 2, can.w, can.h);
      c2d.fillStyle = 'rgba(255,255,255,0.5)';
      c2d.fillRect(-can.w / 2 + 4, -can.h / 2 + 6, 7, can.h - 12);
      c2d.restore();
    }
    c2d.font = '44px sans-serif';
    c2d.textAlign = 'center';
    c2d.fillText('🧒', 46, TABLE_Y + 2);
    if (aim && !flying) {
      c2d.strokeStyle = '#c2410c';
      c2d.lineWidth = 4;
      c2d.setLineDash([7, 6]);
      c2d.beginPath();
      c2d.moveTo(60, TABLE_Y - 10);
      c2d.lineTo(aim.x, aim.y);
      c2d.stroke();
      c2d.setLineDash([]);
    }
    if (ball && ball.live) {
      c2d.fillStyle = '#e05c4a';
      c2d.beginPath();
      c2d.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      c2d.fill();
    }
  };

  const hud = () => {
    els.subLine.innerHTML = `${t('troxua.cans.throws', 'Lượt ném')}: <b>${game.throws}</b> · ${t('troxua.cans.knocked', 'Lon rơi')}: <b>${game.knocked}/6</b> 🥫`;
  };

  const loop = () => {
    const knockedBefore = game.knocked;
    const moving = stepCans(game, ball);
    if (game.knocked > knockedBefore) { sfx.match(2); hud(); }
    draw();
    if (moving) { state.raf = requestAnimationFrame(loop); return; }
    flying = false;
    ball = null;
    if (game.knocked >= 6 || game.throws <= 0) {
      setTimeout(() => finish(
        game.knocked >= 5 ? '🏆' : '🥫',
        `${t('troxua.cans.knocked', 'Lon rơi')}: ${game.knocked}/6 🥫`,
        game.knocked * 10,
        game.knocked >= 5 ? 'Giỏi quá! Trúng hết lon luôn!' : `Làm rơi ${game.knocked} cái lon!`,
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
    if (!flying && game.throws > 0) aim = pos(e);
    canvas.setPointerCapture(e.pointerId);
    draw();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!aim || flying) return;
    pendingAim = pos(e);
    if (!rafAim) { rafAim = true; requestAnimationFrame(applyAim); }
  });
  canvas.addEventListener('pointerup', () => {
    if (!aim || flying || game.throws <= 0) return;
    const dx = aim.x - 60;
    const dy = (TABLE_Y - 10) - aim.y;
    const power = Math.min(24, Math.hypot(dx, dy) / 16);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    if (power > 3 && dx > 0) {
      ball = throwBall(power, angle);
      game.throws--;
      flying = true;
      sfx.select();
      hud();
      state.raf = requestAnimationFrame(loop);
    }
    aim = null;
    draw();
  });

  hud();
  state.instruction = 'Kéo để chỉnh hướng và lực, thả tay để ném bóng đổ lon nhé!';
  speak(state.instruction);
  draw();
}

els.btnNew.addEventListener('click', () => { sfx.shuffle(); startCans(); });
els.btnAgain.addEventListener('click', () => { sfx.select(); startCans(); });
els.btnHelp.addEventListener('click', () => { sfx.select(); speak(state.instruction); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
startCans();

// Hook cho e2e test
window.__nemlonxua = { state, startCans };

mountKidFeatures(); // thanh avatar bé + huy hiệu sao header + kiểm tra giới hạn phút/ngày
