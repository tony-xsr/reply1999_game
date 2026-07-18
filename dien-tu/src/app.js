// Điều phối Điện Tử Xưa: bắn vịt trời / đập gạch bóng nảy / đua xe 3 làn.

import {
  makeDuck, duckScore, stepDucks, DUCK_ROUND,
  createBreakout, stepBreakout, BK,
  createRacer, stepRacer, changeLane, RC,
} from './dientu.js';
import { LETTERS } from '../../to-mau/src/letters.js';
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
  subLine: $('subLine'), home: $('homeScreen'), play: $('playScreen'),
  btnBack: $('btnBack'), btnNew: $('btnNew'), btnHelp: $('btnHelp'), btnSound: $('btnSound'),
  cheer: $('cheer'), cheerEmoji: $('cheerEmoji'), cheerText: $('cheerText'),
  btnAgain: $('btnAgain'), btnHome2: $('btnHome2'),
};

const state = { game: null, startedAt: Date.now(), ctx: {}, raf: 0, timers: [], instruction: '' };
bindMute(() => sfx.muted);

function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

const HELP_TEXT = {
  ducks: 'Chạm vào con vịt bay qua màn hình để bắn hạ! Chọn chế độ "Chỉ số chẵn" nếu muốn chỉ bắn vịt mang số chẵn thôi.',
  bricks: 'Kéo thanh trượt để đỡ quả bóng nảy lên, phá hết các viên gạch phía trên nhé! Đừng để bóng rơi xuống dưới.',
  racer: 'Vuốt trái phải hoặc chạm vào làn đường để né các xe khác, đi được càng xa càng nhiều điểm!',
};

/* ===== Khung chung ===== */

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

function stopLoops() {
  cancelAnimationFrame(state.raf);
  for (const timer of state.timers) clearTimeout(timer);
  state.timers = [];
}

function finish(emoji, text, score, sayText, celebrate = true) {
  stopLoops();
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'dientu',
    result: 'win',
    score,
    level: 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  if (celebrate) { sfx.levelWin(); confetti(); } else sfx.gameOver();
  els.cheerEmoji.textContent = emoji;
  els.cheerText.textContent = text;
  els.cheer.classList.remove('hidden');
  speak(sayText);
}

function showHome() {
  stopLoops();
  state.game = null;
  els.home.classList.remove('hidden');
  els.play.classList.add('hidden');
  els.cheer.classList.add('hidden');
  els.btnBack.hidden = true;
  els.btnNew.hidden = true;
  els.btnHelp.hidden = true;
  els.subLine.textContent = '';
}

function startGame(game) {
  stopLoops();
  state.game = game;
  state.startedAt = Date.now();
  els.home.classList.add('hidden');
  els.play.classList.remove('hidden');
  els.cheer.classList.add('hidden');
  els.btnBack.hidden = false;
  els.btnNew.hidden = false;
  els.btnHelp.hidden = false;
  els.play.innerHTML = '';
  GAMES[game]();
  sayInstruction(t(`dientu.help.${game}`, HELP_TEXT[game]));
}

function makeCanvas() {
  const canvas = document.createElement('canvas');
  canvas.className = 'board-canvas';
  canvas.width = 640;
  canvas.height = 640;
  els.play.appendChild(canvas);
  return canvas;
}

/* ===== 1. Bắn vịt trời ===== */

function startDucks() {
  const ctx = state.ctx;
  ctx.duckMode = ctx.duckMode ?? 'classic';

  const row = document.createElement('div');
  row.className = 'pick-row';
  for (const [mode, label] of [['classic', t('dientu.ducks.all', '🦆 Bắn hết')], ['even', t('dientu.ducks.even', '🔢 Chỉ số CHẴN')]]) {
    const btn = document.createElement('button');
    btn.className = `pick-btn${mode === ctx.duckMode ? ' active' : ''}`;
    btn.textContent = label;
    btn.addEventListener('click', () => { ctx.duckMode = mode; startGame('ducks'); });
    row.appendChild(btn);
  }
  els.play.appendChild(row);

  const canvas = makeCanvas();
  const c2d = canvas.getContext('2d');
  const g = { ducks: [], score: 0, hits: 0, time: DUCK_ROUND };
  ctx.ducks = g;

  const hud = () => {
    els.subLine.innerHTML = `⏱ <b>${g.time}s</b> · ${t('pika.end.score', 'Điểm của bạn')}: <b>${g.score}</b>`;
  };

  const spawn = () => {
    if (state.game !== 'ducks') return;
    g.ducks.push(makeDuck(ctx.duckMode));
    state.timers.push(setTimeout(spawn, 700 + Math.random() * 600));
  };

  const clock = () => {
    if (state.game !== 'ducks') return;
    g.time--;
    hud();
    if (g.time <= 0) {
      finish(g.hits >= 12 ? '🏆' : '🦆',
        `${t('dientu.ducks.hit', 'Bắn trúng')}: ${g.hits} 🦆 — ${g.score} ${t('pika.end.score', 'điểm')}`,
        g.score, `Hết giờ! Bắn trúng ${g.hits} con vịt!`);
      return;
    }
    state.timers.push(setTimeout(clock, 1000));
  };

  const draw = () => {
    c2d.clearRect(0, 0, 640, 640);
    // trời + cỏ kiểu Duck Hunt
    const sky = c2d.createLinearGradient(0, 0, 0, 640);
    sky.addColorStop(0, '#bfe3ff');
    sky.addColorStop(0.8, '#e8f6ff');
    c2d.fillStyle = sky;
    c2d.fillRect(0, 0, 640, 500);
    c2d.fillStyle = '#9fd48a';
    c2d.fillRect(0, 500, 640, 140);
    c2d.font = '40px sans-serif';
    c2d.fillText('🌳', 60, 520);
    c2d.fillText('🌾', 560, 545);
    for (const d of g.ducks) {
      if (d.gone) continue;
      c2d.save();
      c2d.translate(d.x, d.y);
      if (d.vx < 0 && !d.falling) c2d.scale(-1, 1);
      c2d.font = '44px sans-serif';
      c2d.textAlign = 'center';
      c2d.fillText(d.falling ? '💫' : '🦆', 0, 0);
      c2d.restore();
      if (d.label && !d.falling) {
        c2d.fillStyle = '#fff';
        c2d.strokeStyle = '#c2410c';
        c2d.lineWidth = 2;
        c2d.beginPath();
        c2d.arc(d.x, d.y - 40, 15, 0, Math.PI * 2);
        c2d.fill();
        c2d.stroke();
        c2d.fillStyle = '#241e2e';
        c2d.font = '900 16px Arial';
        c2d.textAlign = 'center';
        c2d.fillText(d.label, d.x, d.y - 34);
      }
    }
  };

  const loop = () => {
    stepDucks(g.ducks);
    g.ducks = g.ducks.filter((d) => !d.gone);
    draw();
    state.raf = requestAnimationFrame(loop);
  };

  canvas.addEventListener('pointerdown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 640;
    const y = ((e.clientY - rect.top) / rect.height) * 640;
    for (const d of g.ducks) {
      if (d.falling || d.gone) continue;
      if (Math.hypot(d.x - x, d.y - y) < 34) {
        const { delta, good } = duckScore(d);
        g.score = Math.max(0, g.score + delta);
        if (good) {
          g.hits++;
          d.falling = true;
          sfx.match(2);
        } else {
          sfx.fail();
          speak(`Số ${d.label} là số lẻ mà!`);
        }
        hud();
        return;
      }
    }
  });

  els.subLine.textContent = '';
  hud();
  speak(ctx.duckMode === 'even' ? 'Chỉ bắn con vịt mang số chẵn nhé!' : 'Chạm vào vịt để bắn nhé!');
  spawn();
  state.timers.push(setTimeout(clock, 1000));
  loop();
}

/* ===== 2. Đập gạch bóng nảy ===== */

function startBricks() {
  const letterPool = LETTERS.map((l) => l.ch);
  const g = createBreakout(letterPool);
  state.ctx.bricks = g;
  const canvas = makeCanvas();
  const c2d = canvas.getContext('2d');

  const hud = () => {
    els.subLine.innerHTML = `${'❤️'.repeat(g.lives)}${'🖤'.repeat(3 - g.lives)} · ${t('dientu.bricks.caught', 'Nhặt chữ')}: <b>${g.caught.join(' ') || '—'}</b>`;
  };

  const draw = () => {
    c2d.clearRect(0, 0, 640, 640);
    for (const brick of g.bricks) {
      if (!brick.alive) continue;
      c2d.fillStyle = brick.color;
      c2d.beginPath();
      c2d.roundRect(brick.x, brick.y, brick.w, brick.h, 6);
      c2d.fill();
      if (brick.letter) {
        c2d.fillStyle = '#fff';
        c2d.font = '900 17px Arial';
        c2d.textAlign = 'center';
        c2d.textBaseline = 'middle';
        c2d.fillText(brick.letter, brick.x + brick.w / 2, brick.y + brick.h / 2 + 1);
      }
    }
    for (const p of g.pickups) {
      c2d.fillStyle = '#fff';
      c2d.strokeStyle = '#c2410c';
      c2d.lineWidth = 3;
      c2d.beginPath();
      c2d.arc(p.x, p.y, 16, 0, Math.PI * 2);
      c2d.fill();
      c2d.stroke();
      c2d.fillStyle = '#c2410c';
      c2d.font = '900 18px Arial';
      c2d.textAlign = 'center';
      c2d.textBaseline = 'middle';
      c2d.fillText(p.letter, p.x, p.y + 1);
    }
    // thanh trượt + bóng
    c2d.fillStyle = '#5b3fd4';
    c2d.beginPath();
    c2d.roundRect(g.paddleX - BK.PADDLE_W / 2, BK.PADDLE_Y, BK.PADDLE_W, 14, 7);
    c2d.fill();
    c2d.fillStyle = '#e05c4a';
    c2d.beginPath();
    c2d.arc(g.ball.x, g.ball.y, g.ball.r, 0, Math.PI * 2);
    c2d.fill();
  };

  const loop = () => {
    const ev = stepBreakout(g);
    if (ev.broke) sfx.select();
    if (ev.caught) { sfx.match(3); speak(ev.caught); hud(); }
    if (ev.lostLife) { sfx.fail(); hud(); }
    draw();
    if (g.won) {
      finish('🏆', `${t('dientu.bricks.win', 'Phá hết gạch!')} — ${t('dientu.bricks.caught', 'Nhặt chữ')}: ${g.caught.join(' ') || '0'}`,
        50 + g.caught.length * 10, 'Giỏi quá! Phá hết gạch rồi!');
      return;
    }
    if (g.over) {
      finish('🧱', `${t('xepgach.over', 'Hết lượt rồi!')} — ${t('dientu.bricks.caught', 'Nhặt chữ')}: ${g.caught.join(' ') || '0'}`,
        g.caught.length * 10, 'Hết lượt rồi, chơi lại nhé!', false);
      return;
    }
    state.raf = requestAnimationFrame(loop);
  };

  const movePaddle = (e) => {
    const rect = canvas.getBoundingClientRect();
    g.paddleX = Math.max(BK.PADDLE_W / 2, Math.min(640 - BK.PADDLE_W / 2, ((e.clientX - rect.left) / rect.width) * 640));
  };
  canvas.addEventListener('pointermove', movePaddle);
  canvas.addEventListener('pointerdown', movePaddle);

  els.subLine.textContent = '';
  hud();
  speak('Đỡ bóng phá gạch, nhặt các chữ cái rơi xuống nhé!');
  loop();
}

/* ===== 3. Đua xe né chướng ngại ===== */

const LANE_X = [160, 320, 480];

function startRacer() {
  const ctx = state.ctx;
  ctx.racerMode = ctx.racerMode ?? 'classic';

  const row = document.createElement('div');
  row.className = 'pick-row';
  for (const [mode, label] of [['classic', t('dientu.racer.classic', '🚕 Né chướng ngại')], ['math', t('dientu.racer.math', '➕ Cổng đáp án')]]) {
    const btn = document.createElement('button');
    btn.className = `pick-btn${mode === ctx.racerMode ? ' active' : ''}`;
    btn.textContent = label;
    btn.addEventListener('click', () => { ctx.racerMode = mode; startGame('racer'); });
    row.appendChild(btn);
  }
  els.play.appendChild(row);

  const canvas = makeCanvas();
  const c2d = canvas.getContext('2d');
  const g = createRacer(ctx.racerMode);
  ctx.racer = g;

  const laneRow = document.createElement('div');
  laneRow.className = 'lane-row';
  for (const [label, dir] of [['⬅️', -1], ['➡️', 1]]) {
    const btn = document.createElement('button');
    btn.className = 'lane-btn';
    btn.textContent = label;
    btn.addEventListener('pointerdown', (e) => { e.preventDefault(); changeLane(g, dir); sfx.select(); });
    laneRow.appendChild(btn);
  }
  els.play.appendChild(laneRow);

  const hud = () => {
    els.subLine.innerHTML = `${'❤️'.repeat(Math.max(0, g.lives))}${'🖤'.repeat(3 - Math.max(0, g.lives))} · <b>${g.score}</b>${g.question ? ` · <b>${g.question.text}</b>` : ''}`;
  };

  let dashOffset = 0;
  const draw = () => {
    c2d.clearRect(0, 0, 640, 640);
    // đường
    c2d.fillStyle = '#5c5866';
    c2d.fillRect(70, 0, 500, 640);
    c2d.fillStyle = '#9fd48a';
    c2d.fillRect(0, 0, 70, 640);
    c2d.fillRect(570, 0, 70, 640);
    c2d.strokeStyle = '#fff';
    c2d.lineWidth = 5;
    c2d.setLineDash([28, 26]);
    dashOffset = (dashOffset + g.speed) % 54;
    c2d.lineDashOffset = -dashOffset;
    for (const x of [240, 400]) {
      c2d.beginPath();
      c2d.moveTo(x, 0);
      c2d.lineTo(x, 640);
      c2d.stroke();
    }
    c2d.setLineDash([]);
    // vật thể
    c2d.textAlign = 'center';
    for (const item of g.items) {
      if (item.kind === 'rock') {
        c2d.font = '46px sans-serif';
        c2d.fillText(item.icon, LANE_X[item.lane], item.y);
      } else {
        c2d.fillStyle = item.good ? '#dff4e2' : '#fdeaea';
        c2d.strokeStyle = '#8a6a3a';
        c2d.lineWidth = 3;
        c2d.beginPath();
        c2d.roundRect(LANE_X[item.lane] - 44, item.y - 30, 88, 52, 10);
        c2d.fill();
        c2d.stroke();
        c2d.fillStyle = '#241e2e';
        c2d.font = '900 28px Arial';
        c2d.fillText(item.value, LANE_X[item.lane], item.y + 8);
      }
    }
    // xe bé
    c2d.font = '52px sans-serif';
    c2d.fillText('🚕', LANE_X[g.lane], RC.CAR_Y + 16);
  };

  const loop = () => {
    const ev = stepRacer(g);
    if (ev.crash) { sfx.fail(); hud(); }
    if (ev.gate === 'ok') { sfx.match(3); speak('Đúng rồi!'); hud(); }
    if (ev.gate === 'bad') { sfx.fail(); speak('Sai đáp án rồi!'); hud(); }
    if (g.question && !ev.gate) hud();
    draw();
    if (g.over) {
      finish('🚕', `${t('pika.end.score', 'Điểm của bạn')}: ${g.score}`, Math.round(g.score / 10),
        `Hết lượt! Được ${g.score} điểm!`, g.score > 800);
      return;
    }
    state.raf = requestAnimationFrame(loop);
  };

  // vuốt trên canvas đổi làn
  let swipeX = null;
  canvas.addEventListener('pointerdown', (e) => { swipeX = e.clientX; });
  canvas.addEventListener('pointerup', (e) => {
    if (swipeX == null) return;
    const dx = e.clientX - swipeX;
    swipeX = null;
    if (Math.abs(dx) > 24) { changeLane(g, dx > 0 ? 1 : -1); sfx.select(); }
  });
  if (state.ctx.racerKey) document.removeEventListener('keydown', state.ctx.racerKey);
  state.ctx.racerKey = (e) => {
    if (state.game !== 'racer') return;
    if (e.key === 'ArrowLeft' || e.key === 'a') changeLane(g, -1);
    if (e.key === 'ArrowRight' || e.key === 'd') changeLane(g, 1);
  };
  document.addEventListener('keydown', state.ctx.racerKey);

  hud();
  speak(ctx.racerMode === 'math'
    ? 'Né chướng ngại, và lao vào tấm biển có đáp án đúng nhé!'
    : 'Vuốt trái phải để né chướng ngại nhé!');
  loop();
}

const GAMES = { ducks: startDucks, bricks: startBricks, racer: startRacer };

/* ===== Nút ===== */

for (const card of document.querySelectorAll('.mode-card')) {
  card.addEventListener('click', () => { sfx.select(); startGame(card.dataset.game); });
}
els.btnBack.addEventListener('click', showHome);
els.btnHome2.addEventListener('click', showHome);
els.btnNew.addEventListener('click', () => { sfx.shuffle(); startGame(state.game); });
els.btnHelp.addEventListener('click', () => { sfx.select(); speak(state.instruction); });
els.btnAgain.addEventListener('click', () => { sfx.select(); startGame(state.game); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden && state.game) showHome(); // game thời gian thực: ẩn tab thì về menu
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
showHome();

// Hook cho e2e test
window.__dientu = { state, startGame, showHome };

mountKidFeatures(); // thanh avatar bé + huy hiệu sao header + kiểm tra giới hạn phút/ngày (áp dụng cho mọi game, kể cả game giải trí thuần)
