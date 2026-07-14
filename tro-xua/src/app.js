// Điều phối Trò Xưa: oẳn tù tì / bắn bi / ném lon.

import {
  RPS, rpsResult, rpsExplain, rpsAi,
  makeMarbleBoard, stepMarbles, RING_R,
  makeCans, throwBall, stepCans, TABLE_Y, TABLE_X,
  makeRope, ropeJump, stepRope,
} from './troxua.js';
import { viNumber } from '../../nhay-lo-co/src/loco.js';
import { speak, bindMute } from '../../to-mau/src/speech.js';
import { sfx } from '../../pokemon/src/sfx.js';
import { currentProfile, recordSession } from '../../pokemon/src/stats.js';

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

const state = { game: null, startedAt: Date.now(), ctx: {}, raf: 0, instruction: '' };
bindMute(() => sfx.muted);

/** Đọc hướng dẫn + lưu lại để bấm ❓ nghe lại được (bé chưa đọc chữ vẫn chơi được). */
function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

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

function finish(emoji, text, score, sayText) {
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'troxua',
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

function showHome() {
  cancelAnimationFrame(state.raf);
  state.game = null;
  els.home.classList.remove('hidden');
  els.play.classList.add('hidden');
  els.cheer.classList.add('hidden');
  els.btnBack.hidden = true;
  els.btnNew.hidden = true;
  els.subLine.textContent = '';
  state.instruction = t('troxua.help.home', 'Chọn một trò chơi: Oẳn tù tì, Bắn bi, Ném lon, hoặc Nhảy dây!');
}

function startGame(game) {
  cancelAnimationFrame(state.raf);
  state.game = game;
  state.startedAt = Date.now();
  els.home.classList.add('hidden');
  els.play.classList.remove('hidden');
  els.cheer.classList.add('hidden');
  els.btnBack.hidden = false;
  els.btnNew.hidden = false;
  els.play.innerHTML = '';
  GAMES[game]();
}

/* ===== 1. Oẳn tù tì (best-of-5: ai thắng 3 ván trước) ===== */

function startRps() {
  const ctx = { me: 0, ai: 0, busy: false };
  state.ctx.rps = ctx;

  els.play.innerHTML = `
    <div class="rps-score"><span class="me">😊 <b id="rpsMe">0</b></span><span class="ai">🤖 <b id="rpsAi">0</b></span></div>
    <div class="rps-arena">
      <div class="rps-hand" id="handMe">✊</div>
      <div class="rps-vs">VS</div>
      <div class="rps-hand" id="handAi">✊</div>
    </div>
    <div class="rps-note" id="rpsNote"></div>
    <div class="rps-pick" id="rpsPick"></div>`;
  const note = $('rpsNote');
  const handMe = $('handMe');
  const handAi = $('handAi');
  const pickRow = $('rpsPick');

  const buttons = RPS.map((option) => {
    const btn = document.createElement('button');
    btn.className = 'rps-btn';
    btn.textContent = option.icon;
    btn.addEventListener('click', () => play(option));
    pickRow.appendChild(btn);
    return btn;
  });

  async function play(mine) {
    if (ctx.busy) return;
    ctx.busy = true;
    buttons.forEach((b) => { b.disabled = true; });
    handMe.textContent = '✊';
    handAi.textContent = '✊';
    handMe.classList.add('bounce');
    handAi.classList.add('bounce');
    // "Oẳn... tù... tì!" kịch tính
    const chant = ['Oẳn...', 'tù...', 'tì!'];
    for (let i = 0; i < 3; i++) {
      note.textContent = chant.slice(0, i + 1).join(' ');
      speak(chant[i].replace('...', ''));
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 520));
    }
    handMe.classList.remove('bounce');
    handAi.classList.remove('bounce');
    const theirs = rpsAi();
    handMe.textContent = mine.icon;
    handAi.textContent = RPS.find((o) => o.id === theirs).icon;
    const result = rpsResult(mine.id, theirs);
    if (result === 0) {
      note.textContent = t('caro.draw', 'Hòa rồi!');
      sfx.shuffle();
      speak('Hòa! Chơi lại nào!');
    } else {
      const [winner, loser] = result > 0 ? [mine.id, theirs] : [theirs, mine.id];
      const explain = rpsExplain(winner, loser);
      note.innerHTML = `<b>${explain.toUpperCase()}</b> — ${result > 0 ? t('troxua.rps.win', 'bé thắng ván này!') : t('troxua.rps.lose', 'máy thắng ván này!')}`;
      if (result > 0) { ctx.me++; sfx.match(3); } else { ctx.ai++; sfx.fail(); }
      speak(`${explain}! ${result > 0 ? 'Bé thắng!' : 'Máy thắng!'}`);
      $('rpsMe').textContent = ctx.me;
      $('rpsAi').textContent = ctx.ai;
    }
    if (ctx.me >= 3 || ctx.ai >= 3) {
      setTimeout(() => finish(
        ctx.me > ctx.ai ? '🏆' : '🤖',
        `${ctx.me > ctx.ai ? t('troxua.rps.champion', 'Bé vô địch oẳn tù tì!') : t('caro.ai.win', 'Máy thắng — thử lại nhé!')}\n😊 ${ctx.me} — ${ctx.ai} 🤖`,
        ctx.me * 10,
        ctx.me > ctx.ai ? 'Hoan hô! Bé vô địch oẳn tù tì!' : 'Máy thắng rồi, chơi lại nhé!',
      ), 1200);
      return;
    }
    ctx.busy = false;
    buttons.forEach((b) => { b.disabled = false; });
  }

  els.subLine.textContent = t('troxua.rps.hint', 'Thắng 3 ván trước là vô địch! Bao bọc búa, búa đập kéo, kéo cắt bao');
  sayInstruction('Oẳn tù tì! Chọn búa, bao hoặc kéo nhé!');
  state.ctx.rpsPlay = play;
}

/* ===== 2. Bắn bi ===== */

function startMarble() {
  const board = makeMarbleBoard();
  state.ctx.marble = board;
  const canvas = document.createElement('canvas');
  canvas.className = 'board-canvas';
  canvas.width = 640;
  canvas.height = 640;
  els.play.appendChild(canvas);
  const c2d = canvas.getContext('2d');
  let aim = null; // {x, y} điểm kéo hiện tại
  let rolling = false;

  const me = board.balls[0];

  const draw = () => {
    c2d.clearRect(0, 0, 640, 640);
    // vòng tròn giữa sân (vẽ phấn)
    c2d.strokeStyle = '#c9b28a';
    c2d.setLineDash([10, 8]);
    c2d.lineWidth = 4;
    c2d.beginPath();
    c2d.arc(320, 320, RING_R, 0, Math.PI * 2);
    c2d.stroke();
    c2d.setLineDash([]);
    // dây nhắm
    if (aim && !rolling) {
      c2d.strokeStyle = '#c2410c';
      c2d.lineWidth = 4;
      c2d.beginPath();
      c2d.moveTo(me.x, me.y);
      c2d.lineTo(aim.x, aim.y);
      c2d.stroke();
    }
    // bi
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

  const pos = (e) => {
    const rect = canvas.getBoundingClientRect();
    // Không kẹp về 0-640: kéo tay ra ngoài mép canvas vẫn tính đúng khoảng cách/lực
    return { x: ((e.clientX - rect.left) / rect.width) * 640, y: ((e.clientY - rect.top) / rect.height) * 640 };
  };
  canvas.addEventListener('pointerdown', (e) => {
    if (!rolling && board.shots > 0) aim = pos(e);
    // Giữ pointer dù tay kéo ra khỏi canvas — bi ở gần mép dưới nên cần kéo ra ngoài mới đủ lực
    canvas.setPointerCapture(e.pointerId);
    draw();
  });
  canvas.addEventListener('pointermove', (e) => { if (aim && !rolling) { aim = pos(e); draw(); } });
  canvas.addEventListener('pointerup', () => {
    if (!aim || rolling || board.shots <= 0) return;
    // kéo về phía nào bắn về phía NGƯỢC lại (ná cao su)
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
  sayInstruction('Kéo bi xanh như ná cao su rồi thả để bắn bi vàng văng khỏi vòng nhé!');
  draw();
  state.ctx.marbleLoop = loop;
}

/* ===== 3. Ném lon ===== */

function startCans() {
  const game = makeCans();
  state.ctx.cans = game;
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
    // đất + bàn
    c2d.fillStyle = '#f3e7cf';
    c2d.fillRect(0, 600, 640, 40);
    c2d.fillStyle = '#c9a86a';
    c2d.fillRect(TABLE_X[0], TABLE_Y, TABLE_X[1] - TABLE_X[0], 16);
    c2d.fillRect(TABLE_X[0] + 20, TABLE_Y, 14, 640 - TABLE_Y - 40);
    c2d.fillRect(TABLE_X[1] - 34, TABLE_Y, 14, 640 - TABLE_Y - 40);
    // lon
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
    // dây nhắm + người ném
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

  const pos = (e) => {
    const rect = canvas.getBoundingClientRect();
    return { x: ((e.clientX - rect.left) / rect.width) * 640, y: ((e.clientY - rect.top) / rect.height) * 640 };
  };
  canvas.addEventListener('pointerdown', (e) => {
    if (!flying && game.throws > 0) aim = pos(e);
    canvas.setPointerCapture(e.pointerId);
    draw();
  });
  canvas.addEventListener('pointermove', (e) => { if (aim && !flying) { aim = pos(e); draw(); } });
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
  sayInstruction('Kéo để chỉnh hướng và lực, thả tay để ném bóng đổ lon nhé!');
  draw();
  state.ctx.cansLoop = loop;
  state.ctx.cansThrow = (power, angle) => { ball = throwBall(power, angle); game.throws--; flying = true; hud(); loop(); };
}

/* ===== 4. Nhảy dây: bấm đúng nhịp khi dây quét qua chân ===== */

function startRope() {
  const s = makeRope();
  state.ctx.rope = s;
  const canvas = document.createElement('canvas');
  canvas.className = 'board-canvas';
  canvas.width = 640;
  canvas.height = 640;
  els.play.appendChild(canvas);
  const c2d = canvas.getContext('2d');
  let last = performance.now();

  const draw = () => {
    c2d.clearRect(0, 0, 640, 640);
    // đất
    c2d.fillStyle = '#f3e7cf';
    c2d.fillRect(0, 470, 640, 170);
    // 2 bạn quay dây
    c2d.font = '52px sans-serif';
    c2d.textAlign = 'center';
    c2d.fillText('🧍', 80, 470);
    c2d.fillText('🧍‍♀️', 560, 470);
    // dây: cung tròn quanh trục ngang, phase 0.5 = chạm đất
    const angle = s.phase * Math.PI * 2;
    const dip = Math.cos(angle) * -1; // -1 = trên đỉnh, +1 = sát đất
    const ropeY = 260 + dip * 195;
    const behind = Math.sin(angle) < 0; // nửa vòng phía sau: vẽ mờ
    c2d.strokeStyle = behind ? 'rgba(180, 140, 80, 0.35)' : '#8a5a2a';
    c2d.lineWidth = 6;
    c2d.beginPath();
    c2d.moveTo(92, 420);
    c2d.quadraticCurveTo(320, ropeY, 548, 420);
    c2d.stroke();
    // bé nhảy
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
  if (state.ctx.ropeKey) document.removeEventListener('keydown', state.ctx.ropeKey);
  state.ctx.ropeKey = (e) => {
    if (e.code === 'Space' && state.game === 'rope') { e.preventDefault(); ropeJump(s); }
  };
  document.addEventListener('keydown', state.ctx.ropeKey);

  hud();
  sayInstruction('Dây quét tới chân thì chạm màn hình để nhảy nhé!');
  last = performance.now();
  state.raf = requestAnimationFrame(loop);
  state.ctx.ropeJump = () => ropeJump(s);
}

const GAMES = { rps: startRps, marble: startMarble, cans: startCans, rope: startRope };

/* ===== Nút ===== */

for (const card of document.querySelectorAll('.mode-card')) {
  card.addEventListener('click', () => { sfx.select(); startGame(card.dataset.game); });
}
els.btnBack.addEventListener('click', showHome);
els.btnHome2.addEventListener('click', showHome);
els.btnNew.addEventListener('click', () => { sfx.shuffle(); startGame(state.game); });
els.btnAgain.addEventListener('click', () => { sfx.select(); startGame(state.game); });
els.btnHelp.addEventListener('click', () => { sfx.select(); speak(state.instruction); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
showHome();
speak(state.instruction); // đọc gợi ý ngay khi mới vào trang, bé chưa biết bấm ❓ cũng nghe được

// Hook cho e2e test
window.__troxua = { state, startGame, showHome };
