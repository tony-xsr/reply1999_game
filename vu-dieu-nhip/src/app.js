// Điều phối Vũ Điệu Theo Nhịp: 4 nút mũi tên + vòng nhịp co trên canvas, nhân vật nhảy
// đổi tư thế theo combo. Nhạc nền là vòng lặp giai điệu ngũ cung TỰ SINH bằng WebAudio
// (giai điệu tự sáng tác đơn giản — không nhúng bất kỳ bản nhạc nào bên ngoài).

import {
  DIRS, START_HEARTS, BEAT_MS, BEAT_PERFECT, BEAT_OVER,
  makeGame, currentArrows, tapArrow, tapBeat, tickTime,
} from './vudieu.js';
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
  wrap: $('boardWrap'), canvas: $('gameCanvas'), arrowRow: $('arrowRow'),
  btnNew: $('btnNew'), btnHelp: $('btnHelp'), btnSound: $('btnSound'),
  hudScore: $('hudScore'), hudCombo: $('hudCombo'), hudHearts: $('hudHearts'), hudLevel: $('hudLevel'),
  overlay: $('overlay'), ovEmoji: $('ovEmoji'), ovText: $('ovText'), btnPlay: $('btnPlay'),
};
const ctx = els.canvas.getContext('2d');
const W = els.canvas.width;
const H = els.canvas.height;

const ARROW_CHAR = { left: '◀', up: '▲', right: '▶', down: '▼' };

/* ===== Nhạc nền ngũ cung tự sinh (WebAudio) ===== */
const music = {
  ctx: null, timer: 0, step: 0, on: false,
  // vòng lặp 8 nốt ngũ cung Đô (C D E G A) — tự đặt, vui tai, không phải nhạc có sẵn
  notes: [261.6, 329.6, 392.0, 329.6, 440.0, 392.0, 329.6, 293.7],
};
function musicTick() {
  if (!music.on || sfx.muted) return;
  try {
    const t0 = music.ctx.currentTime;
    const o = music.ctx.createOscillator();
    const g = music.ctx.createGain();
    o.type = 'triangle';
    o.frequency.value = music.notes[music.step % music.notes.length];
    o.connect(g);
    g.connect(music.ctx.destination);
    g.gain.setValueAtTime(0.06, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.22);
    o.start(t0);
    o.stop(t0 + 0.24);
    music.step++;
  } catch { /* ignore */ }
}
function startMusic() {
  if (!music.ctx) {
    try {
      music.ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (window.__audioUnlocker) window.__audioUnlocker.register(music.ctx);
    } catch { return; }
  }
  if (music.ctx.state === 'suspended') music.ctx.resume();
  music.on = true;
  clearInterval(music.timer);
  music.timer = setInterval(musicTick, 280);
}
function stopMusic() {
  music.on = false;
  clearInterval(music.timer);
}

const state = {
  level: 0, game: null, raf: 0, last: 0, startedAt: Date.now(), instruction: '',
  pose: 0, poseT: 0, grade: null, gradeT: 0,
};
bindMute(() => sfx.muted);

/** Đọc hướng dẫn + lưu lại để bấm ❓ nghe lại được (bé chưa đọc chữ vẫn chơi được). */
function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

/* ===== Vẽ sàn nhảy + nhân vật ===== */

function drawStage(now) {
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#3b1f4e');
  bg.addColorStop(1, '#6a2f7a');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  // đèn sân khấu quét qua lại
  for (let i = 0; i < 3; i++) {
    const x = W / 2 + Math.sin(now / 900 + i * 2.1) * (W / 2 - 60);
    ctx.fillStyle = `hsla(${(now / 20 + i * 120) % 360}, 80%, 70%, 0.10)`;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x - 70, H);
    ctx.lineTo(x + 70, H);
    ctx.closePath();
    ctx.fill();
  }
  // sàn ca-rô sáng theo nhịp
  const lit = Math.floor(now / 280) % 2;
  for (let cx2 = 0; cx2 < 8; cx2++) {
    ctx.fillStyle = (cx2 + lit) % 2 ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.04)';
    ctx.fillRect(cx2 * (W / 8), H - 54, W / 8, 54);
  }
}

/** Nhân vật tròn dễ thương — tư thế tay/chân đổi theo pose 0–3, combo cao thì thêm hào quang. */
function drawDancer(now) {
  const g = state.game;
  const cx = W / 2;
  const cy = H - 140;
  const bounce = Math.abs(Math.sin(now / 280 * Math.PI)) * 10;
  const pose = state.pose % 4;
  ctx.save();
  ctx.translate(cx, cy - bounce);
  if (g && g.combo >= 3) {
    ctx.fillStyle = `hsla(${(now / 8) % 360}, 90%, 70%, 0.25)`;
    ctx.beginPath();
    ctx.arc(0, -10, 70 + g.combo * 2, 0, Math.PI * 2);
    ctx.fill();
  }
  // chân
  ctx.strokeStyle = '#4b3269';
  ctx.lineWidth = 9;
  ctx.lineCap = 'round';
  const legSpread = pose % 2 ? 22 : 12;
  ctx.beginPath();
  ctx.moveTo(-8, 26); ctx.lineTo(-legSpread, 58);
  ctx.moveTo(8, 26); ctx.lineTo(legSpread, 58);
  ctx.stroke();
  // thân
  ctx.fillStyle = '#ff8ac2';
  ctx.beginPath();
  ctx.ellipse(0, 6, 26, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  // tay theo tư thế
  const armPoses = [
    [[-26, 6, -46, -18], [26, 6, 46, -18]], // 2 tay chéo lên
    [[-26, 6, -50, 6], [26, 6, 50, -30]], // trái ngang, phải vẫy cao
    [[-26, 6, -46, 26], [26, 6, 46, 26]], // 2 tay xuống xòe
    [[-26, 6, -50, -30], [26, 6, 50, 6]], // trái vẫy cao, phải ngang
  ];
  ctx.strokeStyle = '#ff8ac2';
  for (const [x1, y1, x2, y2] of armPoses[pose]) {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  }
  // đầu + mặt
  ctx.fillStyle = '#ffd9b0';
  ctx.beginPath();
  ctx.arc(0, -34, 21, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#8e5a3a';
  ctx.beginPath();
  ctx.arc(0, -42, 21, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = '#241e2e';
  ctx.beginPath();
  ctx.arc(-7, -34, 2.4, 0, Math.PI * 2);
  ctx.arc(7, -34, 2.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#241e2e';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, -28, 7, 0.25, Math.PI - 0.25);
  ctx.stroke();
  ctx.restore();
}

function drawArrows() {
  const g = state.game;
  if (!g || g.phase !== 'arrows') return;
  const arrows = currentArrows(g);
  const size = 52;
  const gap = 12;
  const total = arrows.length * size + (arrows.length - 1) * gap;
  const x0 = W / 2 - total / 2;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let i = 0; i < arrows.length; i++) {
    const x = x0 + i * (size + gap);
    const done = i < g.arrowIndex;
    const active = i === g.arrowIndex;
    ctx.fillStyle = done ? 'rgba(81, 207, 102, 0.9)' : active ? '#ffd93d' : 'rgba(255,255,255,0.25)';
    ctx.beginPath();
    ctx.roundRect(x, 30, size, size, 12);
    ctx.fill();
    ctx.fillStyle = done ? '#fff' : active ? '#241e2e' : 'rgba(255,255,255,0.85)';
    ctx.font = '900 30px sans-serif';
    ctx.fillText(ARROW_CHAR[arrows[i]], x + size / 2, 30 + size / 2 + 2);
  }
  // thanh thời gian còn lại
  const pct = Math.max(0, g.arrowTimeLeft / g.arrowTimeMs);
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(W / 2 - 110, 96, 220, 8);
  ctx.fillStyle = pct > 0.35 ? '#51cf66' : '#ff6b6b';
  ctx.fillRect(W / 2 - 110, 96, 220 * pct, 8);
}

function drawBeat() {
  const g = state.game;
  if (!g || g.phase !== 'beat') return;
  const cx = W / 2;
  const cy = 78;
  // viền đích
  ctx.strokeStyle = '#ffd93d';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(cx, cy, 34, 0, Math.PI * 2);
  ctx.stroke();
  // vòng co lại theo beatT
  const p = Math.min(1, g.beatT / BEAT_MS);
  const r = 34 + (1 - p) * 90;
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.font = '900 17px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(t('vudieu.tapnow', 'BẤM VÒNG TRÒN!'), cx, cy + 68);
}

function drawGrade(now) {
  if (!state.grade || now - state.gradeT > 700) return;
  const a = 1 - (now - state.gradeT) / 700;
  ctx.globalAlpha = a;
  ctx.font = '900 34px sans-serif';
  ctx.textAlign = 'center';
  const map = {
    perfect: [t('vudieu.perfect', 'TUYỆT VỜI!'), '#ffd93d'],
    good: [t('vudieu.good', 'TỐT LẮM!'), '#51cf66'],
    miss: [t('vudieu.miss', 'TRƯỢT RỒI!'), '#ff6b6b'],
  };
  const [text, color] = map[state.grade];
  ctx.fillStyle = color;
  ctx.fillText(text, W / 2, H / 2 - 40);
  ctx.globalAlpha = 1;
}

function draw(now) {
  drawStage(now);
  drawDancer(now);
  drawArrows();
  drawBeat();
  drawGrade(now);
}

/* ===== HUD & vòng lặp ===== */

function updateHud() {
  const g = state.game;
  els.hudScore.textContent = g.score;
  els.hudCombo.textContent = g.combo;
  els.hudHearts.textContent = '❤️'.repeat(Math.max(0, g.hearts)) + '🖤'.repeat(START_HEARTS - Math.max(0, g.hearts));
  els.hudLevel.textContent = `${t('daovang.level', 'Màn')} ${g.level + 1}`;
}

function loop(now) {
  const dtMs = Math.min(60, now - state.last);
  state.last = now;
  const g = state.game;
  const ev = tickTime(g, dtMs);
  if (ev.arrowTimeout || ev.beatTimeout) {
    sfx.fail();
    state.grade = 'miss';
    state.gradeT = now;
  }
  updateHud();
  draw(now);
  if (g.over) return endLevel();
  state.raf = requestAnimationFrame(loop);
}

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

function endLevel() {
  cancelAnimationFrame(state.raf);
  stopMusic();
  const g = state.game;
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'vudieu',
    result: g.won ? 'win' : 'quit',
    score: g.score,
    level: g.level + 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  if (g.won) {
    sfx.levelWin();
    confetti();
    els.ovEmoji.textContent = '🏆';
    els.ovText.textContent = `${t('vudieu.win', 'Điệu nhảy hoàn hảo!')}\n⭐ ${g.score} · 🔥 ${g.maxCombo}`;
    els.btnPlay.textContent = t('vudieu.next', 'MÀN TIẾP ▶');
    speak(t('vudieu.win', 'Điệu nhảy hoàn hảo!'));
  } else {
    sfx.gameOver();
    els.ovEmoji.textContent = '💃';
    els.ovText.textContent = `${t('vudieu.lose', 'Hết tim mất rồi!')}\n⭐ ${g.score}`;
    els.btnPlay.textContent = t('ran.retry', 'CHƠI LẠI ▶');
    speak(t('vudieu.lose', 'Hết tim mất rồi, nhảy lại nhé!'));
  }
  els.overlay.classList.remove('hidden');
}

function startLevel() {
  els.overlay.classList.add('hidden');
  state.game = makeGame(state.level, Math.random);
  state.pose = 0;
  state.grade = null;
  state.startedAt = Date.now();
  state.last = performance.now();
  startMusic();
  updateHud();
  state.raf = requestAnimationFrame(loop);
}

/* ===== Điều khiển ===== */

function onArrow(dir) {
  const g = state.game;
  if (!g || g.over) return;
  const ev = tapArrow(g, dir);
  const btn = els.arrowRow.querySelector(`[data-dir="${dir}"]`);
  btn.classList.remove('flash-ok', 'flash-bad');
  void btn.offsetWidth;
  if (ev.ok) {
    sfx.match(1);
    state.pose = (state.pose + 1) % 4; // mỗi bước đúng đổi 1 tư thế nhảy
    btn.classList.add('flash-ok');
  } else if (g.phase === 'arrows') {
    sfx.fail();
    btn.classList.add('flash-bad');
  }
  updateHud();
}

function onBeatTap() {
  const g = state.game;
  if (!g || g.over || g.phase !== 'beat') return;
  const ev = tapBeat(g);
  state.grade = ev.grade;
  state.gradeT = performance.now();
  if (ev.grade === 'perfect') { sfx.match(3); state.pose = (state.pose + 2) % 4; }
  else if (ev.grade === 'good') sfx.match(2);
  else sfx.fail();
  updateHud();
}

for (const btn of els.arrowRow.querySelectorAll('.arrow-btn')) {
  btn.addEventListener('pointerdown', (e) => { e.preventDefault(); onArrow(btn.dataset.type || btn.dataset.dir); });
}
els.wrap.addEventListener('pointerdown', (e) => {
  if (e.target.closest('.arrow-btn') || e.target.closest('.overlay')) return;
  onBeatTap();
});
document.addEventListener('keydown', (e) => {
  const map = { ArrowLeft: 'left', ArrowUp: 'up', ArrowRight: 'right', ArrowDown: 'down' };
  if (map[e.key]) { e.preventDefault(); onArrow(map[e.key]); }
  else if (e.code === 'Space') { e.preventDefault(); onBeatTap(); }
});

/* ===== Nút ===== */

els.btnPlay.addEventListener('click', () => {
  sfx.select();
  if (state.game && state.game.won) state.level++;
  else if (state.game && state.game.over) state.level = 0;
  startLevel();
});
els.btnNew.addEventListener('click', () => { sfx.shuffle(); state.level = 0; startLevel(); });
els.btnHelp.addEventListener('click', () => { sfx.select(); speak(state.instruction); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
sayInstruction(t('vudieu.help', 'Nhìn dãy mũi tên trên sân khấu rồi bấm bốn nút bên dưới theo đúng thứ tự — xong dãy thì có vòng tròn co lại, chạm màn hình đúng lúc vòng chạm viền vàng để chốt nhịp! Càng đúng nhịp bạn nhảy càng đẹp!'));
state.game = makeGame(0, Math.random);
updateHud();
draw(performance.now());

// Hook cho e2e test
window.__vudieu = { state, startLevel, onArrow, onBeatTap };

mountKidFeatures(); // thanh avatar bé + huy hiệu sao header + kiểm tra giới hạn phút/ngày (áp dụng cho mọi game, kể cả game giải trí thuần)
