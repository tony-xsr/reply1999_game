// Điều phối Vận Động Vui: 5 trò "hồi xưa gây nghiện" trong 1 — Ếch Qua Đường,
// Nhảy Dây Đếm Nhịp, Ném Rổ Đếm Giờ, Bóng Bàn Đối Kháng, Bowling Ảo.
// Cùng khung shell/cheer/confetti với tu-duy/ và ren-tri-nao/ (2 bundle
// game anh em trước đó).

import {
  FROG_ROWS, FROG_COLS, FROG_LANE_TYPES, makeFrogGame, tickFrogGame, moveFrog,
  isJumpOnTime, nextJumpInterval,
  oscillatePower, isBasketShot,
  stepPongBall, bouncePongWalls, hitPongPaddle, movePongAi,
  makePins, knockPins, countStanding,
} from './vandongvui.js';
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
  title: $('title'), subLine: $('subLine'),
  home: $('homeScreen'), play: $('playScreen'),
  btnBack: $('btnBack'), btnNew: $('btnNew'), btnHelp: $('btnHelp'), btnSound: $('btnSound'),
  cheer: $('cheer'), cheerEmoji: $('cheerEmoji'), cheerText: $('cheerText'),
  btnAgain: $('btnAgain'), btnHome2: $('btnHome2'),
};

const state = { game: null, startedAt: Date.now(), ctx: {}, instruction: '' };
bindMute(() => sfx.muted);

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

function shakeEl(el) {
  sfx.fail();
  el.classList.remove('shake');
  void el.offsetWidth;
  el.classList.add('shake');
}

/** Kết thúc 1 ván — result 'win' ăn mừng pháo hoa, 'loss' chỉ động viên nhẹ. */
function finish(emoji, text, score, cheerSay, result = 'win') {
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: `vandongvui-${state.game}`,
    result,
    score,
    level: 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  if (result === 'win') { sfx.levelWin(); confetti(); } else { sfx.gameOver(); }
  els.cheerEmoji.textContent = emoji;
  els.cheerText.textContent = text;
  els.cheer.classList.remove('hidden');
  speak(cheerSay);
}

function showHome() {
  if (state.ctx.cleanup) { state.ctx.cleanup(); state.ctx.cleanup = null; }
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
  if (state.ctx.cleanup) { state.ctx.cleanup(); state.ctx.cleanup = null; }
  state.game = game;
  state.startedAt = Date.now();
  els.home.classList.add('hidden');
  els.play.classList.remove('hidden');
  els.cheer.classList.add('hidden');
  els.btnBack.hidden = false;
  els.btnNew.hidden = false;
  els.btnHelp.hidden = false;
  els.play.innerHTML = '';
  els.subLine.textContent = '';
  GAMES[game]();
}

/* ===== 1. Ếch Qua Đường An Toàn ===== */

function startFrogger() {
  const hud = document.createElement('div');
  hud.className = 'game-hud';
  hud.innerHTML = `<span>${t('vandongvui.score', 'Điểm')}: <b id="frogScore">0</b></span>`;
  els.play.appendChild(hud);

  const board = document.createElement('div');
  board.className = 'frog-board';
  board.style.gridTemplateColumns = `repeat(${FROG_COLS}, 1fr)`;
  board.style.gridTemplateRows = `repeat(${FROG_ROWS}, 1fr)`;
  els.play.appendChild(board);

  const pad = document.createElement('div');
  pad.className = 'frog-pad';
  const layout = [null, 'up', null, 'left', 'center', 'right', null, 'down', null];
  layout.forEach((dir) => {
    const b = document.createElement('button');
    b.className = `frog-pad-btn${!dir || dir === 'center' ? ' center' : ''}`;
    if (dir === 'up') b.textContent = '⬆️';
    else if (dir === 'down') b.textContent = '⬇️';
    else if (dir === 'left') b.textContent = '⬅️';
    else if (dir === 'right') b.textContent = '➡️';
    if (dir && dir !== 'center') b.addEventListener('click', () => move(dir));
    pad.appendChild(b);
  });
  els.play.appendChild(pad);

  let game = makeFrogGame(Math.random);
  let wins = 0;
  let tickTimer = null;

  function render() {
    board.innerHTML = '';
    for (let r = 0; r < FROG_ROWS; r++) {
      const type = FROG_LANE_TYPES[r];
      const lane = game.lanes[r];
      for (let c = 0; c < FROG_COLS; c++) {
        const cell = document.createElement('div');
        cell.className = `frog-cell ${type}`;
        if (lane && lane.occupied[c]) cell.classList.add('car');
        if (r === game.frog.row && c === game.frog.col) cell.textContent = '🐸';
        board.appendChild(cell);
      }
    }
    $('frogScore').textContent = wins;
  }

  const DIR_MAP = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] };
  function move(dir) {
    if (game.over) return;
    const [dr, dc] = DIR_MAP[dir];
    moveFrog(game, dr, dc);
    sfx.select();
    render();
    if (game.over) onOver();
  }

  function startTick() {
    tickTimer = setInterval(() => {
      tickFrogGame(game);
      render();
      if (game.over) onOver();
    }, 650);
  }

  function onOver() {
    clearInterval(tickTimer);
    if (game.won) {
      wins++;
      sfx.match(1);
      render();
      if (wins >= 3) {
        setTimeout(() => finish('🏆', `${t('vandongvui.frogger.win', 'Ếch qua đường an toàn')} ${wins} ${t('vandongvui.frogger.times', 'lần!')}`, wins * 10, 'Giỏi quá, ếch qua đường an toàn rồi!', 'win'), 500);
      } else {
        setTimeout(() => { game = makeFrogGame(Math.random); startTick(); render(); }, 700);
      }
    } else {
      sfx.gameOver();
      const wonOverall = wins > 0;
      setTimeout(() => finish(
        wonOverall ? '🏆' : '💪',
        `${t('vandongvui.frogger.over', 'Ếch bị xe đụng rồi')} — ${t('vandongvui.score', 'Điểm')}: ${wins}`,
        wins * 10,
        wonOverall ? 'Giỏi quá, ếch qua đường được vài lần rồi!' : 'Ếch bị đụng xe rồi, chơi lại nhé!',
        wonOverall ? 'win' : 'loss',
      ), 400);
    }
  }

  const KEY_MAP = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
  const onKey = (e) => { if (KEY_MAP[e.key]) { e.preventDefault(); move(KEY_MAP[e.key]); } };
  document.addEventListener('keydown', onKey);

  els.subLine.textContent = t('vandongvui.frogger.hint', 'Dắt ếch qua đường né xe — tới bờ bên kia 3 lần là thắng!');
  sayInstruction(t('vandongvui.frogger.help', 'Bấm mũi tên hoặc phím mũi tên để dắt ếch di chuyển từng ô một, né các xe đang chạy qua. Tới được bờ bên kia 3 lần là bé thắng! Đụng xe là thua, nhớ nhìn kỹ trước khi qua đường nhé!'));
  render();
  startTick();
  state.ctx.cleanup = () => { clearInterval(tickTimer); document.removeEventListener('keydown', onKey); };
}

/* ===== 2. Nhảy Dây Đếm Nhịp ===== */

function startJumpRope() {
  const hud = document.createElement('div');
  hud.className = 'game-hud';
  hud.innerHTML = `<span>${t('vandongvui.score', 'Điểm')}: <b id="ropeScore">0</b></span>`;
  els.play.appendChild(hud);

  const stage = document.createElement('div');
  stage.className = 'rope-stage';
  const line = document.createElement('div');
  line.className = 'rope-line';
  const kid = document.createElement('div');
  kid.className = 'rope-kid';
  kid.textContent = '🧒';
  stage.appendChild(line);
  stage.appendChild(kid);
  els.play.appendChild(stage);

  const tapBtn = document.createElement('button');
  tapBtn.className = 'rope-tap-btn';
  tapBtn.textContent = t('vandongvui.jumprope.tap', 'NHẢY! 🦘');
  els.play.appendChild(tapBtn);

  let streak = 0;
  let passTime = 0;
  let lastTapTime = -Infinity;
  let lastTapConsumed = true;
  let over = false;
  let passTimer = null;

  function schedulePass() {
    const interval = nextJumpInterval(streak);
    passTime = Date.now() + interval;
    line.classList.remove('swinging');
    void line.offsetWidth;
    line.style.animationDuration = `${interval}ms`;
    line.classList.add('swinging');
    passTimer = setTimeout(onPass, interval);
  }

  function onPass() {
    if (over) return;
    const ok = !lastTapConsumed && isJumpOnTime(passTime, lastTapTime, 260);
    if (ok) {
      lastTapConsumed = true;
      streak++;
      sfx.match(1);
      $('ropeScore').textContent = streak;
      schedulePass();
    } else {
      over = true;
      sfx.gameOver();
      const won = streak >= 10;
      setTimeout(() => finish(
        won ? '🏆' : '💪',
        `${t('vandongvui.jumprope.over', 'Bị vấp dây rồi')} — ${t('vandongvui.score', 'Điểm')}: ${streak}`,
        streak,
        won ? 'Giỏi quá, nhảy được rất nhiều nhịp!' : 'Bị vấp dây rồi, chơi lại nhé!',
        won ? 'win' : 'loss',
      ), 400);
    }
  }

  tapBtn.addEventListener('click', () => {
    if (over) return;
    lastTapTime = Date.now();
    lastTapConsumed = false;
    kid.classList.add('jump');
    sfx.select();
    setTimeout(() => kid.classList.remove('jump'), 200);
  });

  els.subLine.textContent = t('vandongvui.jumprope.hint', 'Bấm NHẢY đúng lúc dây quét ngang chân nhé!');
  sayInstruction(t('vandongvui.jumprope.help', 'Nhìn sợi dây, khi nó sắp quét ngang qua chân thì bấm nút NHẢY thật đúng lúc. Nhảy đúng liên tiếp thì dây sẽ quay ngày càng nhanh, nhảy trật là bị vấp dây!'));
  schedulePass();
  state.ctx.cleanup = () => { if (passTimer) clearTimeout(passTimer); };
}

/* ===== 3. Ném Rổ Đếm Giờ ===== */

function startHoop() {
  const hud = document.createElement('div');
  hud.className = 'game-hud';
  hud.innerHTML = `<span>${t('vandongvui.score', 'Điểm')}: <b id="hoopScore">0</b></span><span>${t('vandongvui.time', 'Thời gian')}: <b id="hoopTime">30</b>s</span>`;
  els.play.appendChild(hud);

  const stage = document.createElement('div');
  stage.className = 'hoop-stage';
  const ring = document.createElement('div');
  ring.className = 'hoop-ring';
  ring.textContent = '🧺';
  const ball = document.createElement('div');
  ball.className = 'hoop-ball';
  ball.textContent = '🏀';
  stage.appendChild(ring);
  stage.appendChild(ball);
  els.play.appendChild(stage);

  const barWrap = document.createElement('div');
  barWrap.className = 'power-bar-wrap';
  const fill = document.createElement('div');
  fill.className = 'power-bar-fill';
  const target = document.createElement('div');
  target.className = 'power-bar-target';
  const needle = document.createElement('div');
  needle.className = 'power-bar-needle';
  barWrap.appendChild(fill);
  barWrap.appendChild(target);
  barWrap.appendChild(needle);
  els.play.appendChild(barWrap);

  const shootBtn = document.createElement('button');
  shootBtn.className = 'big-btn';
  shootBtn.textContent = t('vandongvui.hoop.shoot', 'SÚT ▶');
  els.play.appendChild(shootBtn);

  let score = 0;
  let over = false;
  let targetMin = 40;
  let targetMax = 60;
  const startTime = performance.now();
  let animId = null;
  let timeLeft = 30;

  function randomizeTarget() {
    const width = 16;
    const center = 18 + Math.random() * 64;
    targetMin = center - width / 2;
    targetMax = center + width / 2;
    target.style.left = `${targetMin}%`;
    target.style.width = `${width}%`;
  }
  randomizeTarget();

  function frame(now) {
    const power = oscillatePower(now - startTime, 1200);
    needle.style.left = `calc(${power}% - 2px)`;
    animId = requestAnimationFrame(frame);
  }
  animId = requestAnimationFrame(frame);

  const countdownId = setInterval(() => {
    if (over) return;
    timeLeft--;
    $('hoopTime').textContent = Math.max(0, timeLeft);
    if (timeLeft <= 0) endRound();
  }, 1000);

  function endRound() {
    if (over) return;
    over = true;
    if (animId) cancelAnimationFrame(animId);
    clearInterval(countdownId);
    const won = score >= 5;
    setTimeout(() => finish(
      won ? '🏆' : '💪',
      `${t('vandongvui.hoop.over', 'Hết giờ')} — ${t('vandongvui.score', 'Điểm')}: ${score}`,
      score,
      won ? 'Giỏi quá, ném trúng rất nhiều lần!' : 'Hết giờ rồi, chơi lại nhé!',
      won ? 'win' : 'loss',
    ), 200);
  }

  shootBtn.addEventListener('click', () => {
    if (over) return;
    const power = oscillatePower(performance.now() - startTime, 1200);
    if (isBasketShot(power, targetMin, targetMax)) {
      score++;
      sfx.match(1);
      $('hoopScore').textContent = score;
      ball.style.transition = 'transform 0.3s ease-out';
      ball.style.transform = 'translate(-50%, -140px) scale(0.6)';
      setTimeout(() => { ball.style.transition = ''; ball.style.transform = 'translateX(-50%)'; }, 350);
      randomizeTarget();
    } else {
      sfx.fail();
      shakeEl(ball);
    }
  });

  els.subLine.textContent = t('vandongvui.hoop.hint', 'Bấm SÚT khi vạch nằm trong vùng sáng để ném trúng rổ!');
  sayInstruction(t('vandongvui.hoop.help', 'Thanh lực chạy qua lại liên tục. Bấm nút SÚT đúng lúc vạch đen nằm trong vùng sáng để ném bóng trúng rổ. Ném càng nhiều càng được điểm cao trong 30 giây!'));
  state.ctx.cleanup = () => { if (animId) cancelAnimationFrame(animId); clearInterval(countdownId); };
}

/* ===== 4. Bóng Bàn Đối Kháng ===== */

function startPong() {
  const hud = document.createElement('div');
  hud.className = 'game-hud';
  hud.innerHTML = `<span>${t('vandongvui.pong.you', 'Bé')}: <b id="pongYou">0</b></span><span>${t('vandongvui.pong.ai', 'Máy')}: <b id="pongAi">0</b></span>`;
  els.play.appendChild(hud);

  const canvas = document.createElement('canvas');
  canvas.className = 'pong-canvas';
  canvas.width = 320;
  canvas.height = 440;
  els.play.appendChild(canvas);
  const c2d = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const PAD_W = 70;
  const PAD_H = 10;
  const BALL_R = 8;

  let youX = W / 2;
  let aiX = W / 2;
  let youScore = 0;
  let aiScore = 0;
  let ball = { x: W / 2, y: H / 2, vx: 3, vy: 4 };
  let over = false;
  let animId = null;

  function resetBall(dir) {
    ball = { x: W / 2, y: H / 2, vx: Math.random() * 4 - 2, vy: 4 * dir };
  }

  function draw() {
    c2d.clearRect(0, 0, W, H);
    c2d.fillStyle = '#0e2748';
    c2d.fillRect(0, H / 2 - 1, W, 2);
    c2d.fillStyle = '#fff';
    c2d.fillRect(aiX - PAD_W / 2, 14, PAD_W, PAD_H);
    c2d.fillRect(youX - PAD_W / 2, H - 14 - PAD_H, PAD_W, PAD_H);
    c2d.beginPath();
    c2d.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
    c2d.fillStyle = '#f5c542';
    c2d.fill();
  }

  function checkEnd() {
    if (over) return;
    if (youScore >= 5 || aiScore >= 5) {
      over = true;
      const won = youScore > aiScore;
      setTimeout(() => finish(
        won ? '🏆' : '💪',
        `${youScore} - ${aiScore}`,
        youScore * 10,
        won ? 'Bé thắng rồi, giỏi quá!' : 'Máy thắng rồi, chơi lại nhé!',
        won ? 'win' : 'loss',
      ), 300);
    }
  }

  function loop() {
    if (over) { draw(); return; }
    stepPongBall(ball);
    bouncePongWalls(ball, W, BALL_R);
    aiX = movePongAi(aiX, ball.x, 3.4, W);
    if (ball.vy < 0) hitPongPaddle(ball, aiX, 14 + PAD_H, PAD_W, BALL_R, false);
    else hitPongPaddle(ball, youX, H - 14 - PAD_H, PAD_W, BALL_R, true);
    if (ball.y < 0) {
      aiScore++; $('pongAi').textContent = aiScore; sfx.fail(); checkEnd(); resetBall(1);
    } else if (ball.y > H) {
      youScore++; $('pongYou').textContent = youScore; sfx.match(1); checkEnd(); resetBall(-1);
    }
    draw();
    if (!over) animId = requestAnimationFrame(loop);
  }

  // Đo rect() 1 lần lúc pointerdown, tránh đo lại mỗi pointermove (layout thrashing).
  let pongRect = canvas.getBoundingClientRect();
  function toX(e) {
    return ((e.clientX - pongRect.left) / pongRect.width) * W;
  }
  canvas.addEventListener('pointermove', (e) => { youX = Math.max(PAD_W / 2, Math.min(W - PAD_W / 2, toX(e))); });
  canvas.addEventListener('pointerdown', (e) => {
    pongRect = canvas.getBoundingClientRect();
    youX = Math.max(PAD_W / 2, Math.min(W - PAD_W / 2, toX(e)));
  });

  els.subLine.textContent = t('vandongvui.pong.hint', 'Rê ngón tay để đỡ bóng — ai thua 5 bàn trước sẽ chịu thua!');
  sayInstruction(t('vandongvui.pong.help', 'Rê ngón tay trái phải để di chuyển vợt của bé ở phía dưới, đỡ bóng đừng để rơi khỏi màn hình. Ai để lọt lưới 5 lần trước là thua!'));
  draw();
  animId = requestAnimationFrame(loop);
  state.ctx.cleanup = () => { if (animId) cancelAnimationFrame(animId); };
}

/* ===== 5. Bowling Ảo ===== */

function startBowling() {
  const hud = document.createElement('div');
  hud.className = 'game-hud';
  hud.innerHTML = `<span>${t('vandongvui.bowling.frame', 'Lượt')}: <b id="bwFrame">1</b>/5</span><span>${t('vandongvui.score', 'Điểm')}: <b id="bwScore">0</b></span>`;
  els.play.appendChild(hud);

  const canvas = document.createElement('canvas');
  canvas.className = 'bowling-canvas';
  canvas.width = 300;
  canvas.height = 460;
  els.play.appendChild(canvas);
  const c2d = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const BALL_R = 12;
  const PIN_R = 10;

  let frameNo = 1;
  let score = 0;
  let pins = [];
  let ball = null;
  let aiming = false;
  let aimDx = 0;
  let aimDy = 0;
  let rolling = false;
  let animId = null;
  let over = false;

  function newFrame() {
    pins = makePins(4, 26, 110).map((p) => ({ ...p, x: p.x + W / 2, y: p.y + 90 }));
    ball = { x: W / 2, y: H - 40, vx: 0, vy: 0 };
    rolling = false;
  }
  newFrame();

  function draw() {
    c2d.clearRect(0, 0, W, H);
    for (const p of pins) {
      if (p.down) continue;
      c2d.beginPath();
      c2d.arc(p.x, p.y, PIN_R, 0, Math.PI * 2);
      c2d.fillStyle = '#fdfdfd';
      c2d.fill();
      c2d.strokeStyle = '#c02a2a';
      c2d.lineWidth = 2;
      c2d.stroke();
    }
    c2d.beginPath();
    c2d.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
    c2d.fillStyle = '#241e2e';
    c2d.fill();
    if (aiming) {
      c2d.strokeStyle = 'rgba(0,0,0,.4)';
      c2d.lineWidth = 3;
      c2d.setLineDash([6, 6]);
      c2d.beginPath();
      c2d.moveTo(ball.x, ball.y);
      c2d.lineTo(ball.x - aimDx, ball.y - aimDy);
      c2d.stroke();
      c2d.setLineDash([]);
    }
  }

  function endRoll() {
    rolling = false;
    setTimeout(() => {
      if (frameNo >= 5) {
        over = true;
        const won = score >= 30;
        setTimeout(() => finish(
          won ? '🏆' : '💪',
          `${t('vandongvui.bowling.over', 'Xong 5 lượt')} — ${t('vandongvui.score', 'Điểm')}: ${score}/50`,
          score,
          won ? 'Giỏi quá, đổ được rất nhiều ki!' : 'Chơi lại để đổ nhiều ki hơn nhé!',
          won ? 'win' : 'loss',
        ), 300);
      } else {
        frameNo++;
        $('bwFrame').textContent = frameNo;
        newFrame();
        draw();
      }
    }, 500);
  }

  function loop() {
    if (!rolling) return;
    ball.x += ball.vx;
    ball.y += ball.vy;
    if (ball.x - BALL_R < 0) { ball.x = BALL_R; ball.vx *= -1; }
    if (ball.x + BALL_R > W) { ball.x = W - BALL_R; ball.vx *= -1; }
    const knocked = knockPins(pins, ball.x, ball.y, PIN_R + BALL_R * 0.6);
    if (knocked > 0) { score += knocked; sfx.match(1); $('bwScore').textContent = score; }
    draw();
    if (ball.y < 60 || countStanding(pins) === 0) { endRoll(); return; }
    animId = requestAnimationFrame(loop);
  }

  // Đo rect() 1 lần lúc pointerdown + gom pointermove qua rAF, tránh layout
  // thrashing và vẽ lại nhiều hơn tốc độ khung hình thật sự cần.
  let bwRect = null;
  let rafAim = false;
  function toXY(e) {
    return { x: ((e.clientX - bwRect.left) / bwRect.width) * W, y: ((e.clientY - bwRect.top) / bwRect.height) * H };
  }
  canvas.addEventListener('pointerdown', (e) => {
    if (rolling || over) return;
    bwRect = canvas.getBoundingClientRect();
    const p = toXY(e);
    aiming = true;
    aimDx = p.x - ball.x;
    aimDy = p.y - ball.y;
    draw();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!aiming) return;
    const p = toXY(e);
    aimDx = p.x - ball.x;
    aimDy = p.y - ball.y;
    if (!rafAim) { rafAim = true; requestAnimationFrame(() => { rafAim = false; draw(); }); }
  });
  canvas.addEventListener('pointerup', () => {
    if (!aiming) return;
    aiming = false;
    const dist = Math.hypot(aimDx, aimDy);
    if (dist > 8) {
      const power = Math.min(14, dist / 10);
      ball.vx = (-aimDx / dist) * power * 0.4;
      ball.vy = (-aimDy / dist) * power;
      if (ball.vy > -2) ball.vy = -6;
      rolling = true;
      sfx.select();
      animId = requestAnimationFrame(loop);
    }
    draw();
  });

  els.subLine.textContent = t('vandongvui.bowling.hint', 'Kéo bóng ra rồi thả để lăn — đổ càng nhiều ki càng được điểm cao!');
  sayInstruction(t('vandongvui.bowling.help', 'Chạm vào bóng, kéo ra xa để nhắm rồi thả tay để lăn bóng về phía các ki. Chơi 5 lượt, đổ càng nhiều ki càng được điểm cao!'));
  draw();
  state.ctx.cleanup = () => { if (animId) cancelAnimationFrame(animId); };
}

/* ===== Bảng phân phối ===== */

const GAMES = {
  frogger: startFrogger, jumprope: startJumpRope, hoop: startHoop,
  pong: startPong, bowling: startBowling,
};

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

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
showHome();

// Hook cho e2e test
window.__vandongvui = { state, startGame, showHome };

mountKidFeatures(); // thanh avatar bé + huy hiệu sao header + kiểm tra giới hạn phút/ngày (áp dụng cho mọi game, kể cả game giải trí thuần)
