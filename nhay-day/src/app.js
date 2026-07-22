// Nhảy Dây — tách riêng từ tro-xua/ (trước đây "Sân Chơi Ngày Bé" gộp 4 trò
// trong 1 game, nay tách thành 4 game riêng, mỗi game 1 thẻ trong Trò Chơi
// Xưa). Dùng lại NGUYÊN logic makeRope/ropeJump/stepRope từ tro-xua/src/
// troxua.js (không sao chép logic), và viNumber từ nhay-lo-co/src/loco.js.

import { makeRope, ropeJump, stepRope } from '../../tro-xua/src/troxua.js';
import { viNumber } from '../../nhay-lo-co/src/loco.js';
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

const state = { startedAt: Date.now(), instruction: '', raf: 0, ropeKey: null };
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
    mode: 'nhaydayxua',
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

function startRope() {
  cancelAnimationFrame(state.raf);
  els.cheer.classList.add('hidden');
  state.startedAt = Date.now();
  els.play.innerHTML = '';

  const s = makeRope();
  const canvas = document.createElement('canvas');
  canvas.className = 'board-canvas';
  canvas.width = 640;
  canvas.height = 640;
  els.play.appendChild(canvas);
  const c2d = canvas.getContext('2d');
  let last = performance.now();

  const draw = () => {
    c2d.clearRect(0, 0, 640, 640);
    c2d.fillStyle = '#f3e7cf';
    c2d.fillRect(0, 470, 640, 170);
    c2d.font = '52px sans-serif';
    c2d.textAlign = 'center';
    c2d.fillText('🧍', 80, 470);
    c2d.fillText('🧍‍♀️', 560, 470);
    const angle = s.phase * Math.PI * 2;
    const dip = Math.cos(angle) * -1;
    const ropeY = 260 + dip * 195;
    const behind = Math.sin(angle) < 0;
    c2d.strokeStyle = behind ? 'rgba(180, 140, 80, 0.35)' : '#8a5a2a';
    c2d.lineWidth = 6;
    c2d.beginPath();
    c2d.moveTo(92, 420);
    c2d.quadraticCurveTo(320, ropeY, 548, 420);
    c2d.stroke();
    const jumpY = s.airborne > 0 ? -Math.sin(Math.min(1, (460 - s.airborne) / 460) * Math.PI) * 78 : 0;
    c2d.font = '64px sans-serif';
    c2d.fillText(s.alive ? '🧒' : '😵', 320, 462 + jumpY);
  };

  const hud = () => {
    els.subLine.innerHTML = `${t('troxua.rope.count', 'Nhảy được')}: <b>${s.count}</b> 🪢`;
  };

  const loop = (now) => {
    const dt = Math.min(50, now - last);
    last = now;
    const ev = stepRope(s, dt);
    if (ev === 'pass') {
      sfx.match(1);
      hud();
      if (s.count % 5 === 0) speak(viNumber(s.count));
    } else if (ev === 'hit') {
      draw();
      sfx.gameOver();
      setTimeout(() => finish(
        s.count >= 10 ? '🏆' : '🪢',
        `${t('troxua.rope.count', 'Nhảy được')}: ${s.count} ${t('troxua.rope.times', 'cái')}!`,
        s.count * 5,
        `Vướng dây rồi! Nhảy được ${viNumber(s.count)} cái!`,
      ), 500);
      return;
    }
    draw();
    state.raf = requestAnimationFrame(loop);
  };

  canvas.addEventListener('pointerdown', () => { ropeJump(s); sfx.select(); });
  if (state.ropeKey) document.removeEventListener('keydown', state.ropeKey);
  state.ropeKey = (e) => {
    if (e.code === 'Space') { e.preventDefault(); ropeJump(s); }
  };
  document.addEventListener('keydown', state.ropeKey);

  hud();
  state.instruction = 'Dây quét tới chân thì chạm màn hình để nhảy nhé!';
  speak(state.instruction);
  last = performance.now();
  state.raf = requestAnimationFrame(loop);
}

els.btnNew.addEventListener('click', () => { sfx.shuffle(); startRope(); });
els.btnAgain.addEventListener('click', () => { sfx.select(); startRope(); });
els.btnHelp.addEventListener('click', () => { sfx.select(); speak(state.instruction); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
startRope();

// Hook cho e2e test
window.__nhaydayxua = { state, startRope };

mountKidFeatures(); // thanh avatar bé + huy hiệu sao header + kiểm tra giới hạn phút/ngày
