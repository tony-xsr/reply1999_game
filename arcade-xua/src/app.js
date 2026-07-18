// Điều phối Arcade Xưa: 5 trò "hồi xưa gây nghiện" phức tạp hơn — Ăn Chấm Né
// Ma (ghép chữ), Nhảy Né Không Ngừng, Bắn Cá Ăn Xu, Đập Gạch Bóng Nảy, Nối
// Kẹo Ba. Cùng khung shell/cheer/confetti với 3 bundle game anh em trước đó
// (tu-duy/, ren-tri-nao/, van-dong-vui/).

import {
  pickPacWord, makePacGame, movePacPlayer, tickPacGhosts,
  stepObstacles, spawnObstacle, speedForScore, jumpArc, isRunnerHit,
  spawnFish, stepFish, isFishOffscreen, isFishHit,
  makeBricks, stepBreakoutBall, bounceBreakoutWalls, hitBreakoutPaddle, hitBrick, countAliveBricks,
  makeCandyGrid, areAdjacent, swapCandies, findMatches, clearMatches, collapseCandyColumns, refillCandyGrid,
} from './arcadexua.js';
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

/** Kết thúc 1 ván — result 'win' ăn mừng pháo hoa, 'loss' chỉ động viên nhẹ. */
function finish(emoji, text, score, cheerSay, result = 'win') {
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: `arcadexua-${state.game}`,
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

/* ===== 1. Ăn Chấm Né Ma (ghép chữ) ===== */

function startPacman() {
  const cols = 9;
  const rows = 9;
  const ghostCount = 2;
  const wordObj = pickPacWord(Math.random);
  const game = makePacGame(cols, rows, wordObj.word, ghostCount, Math.random);
  let lives = 3;
  let tickTimer = null;

  const hud = document.createElement('div');
  hud.className = 'game-hud';
  hud.innerHTML = `<span>${t('arcadexua.lives', 'Mạng')}: <b id="pacLives">${'❤️'.repeat(lives)}</b></span>`;
  els.play.appendChild(hud);

  const progress = document.createElement('div');
  progress.className = 'pac-word-progress';
  els.play.appendChild(progress);

  const board = document.createElement('div');
  board.className = 'pac-board';
  board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  board.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  els.play.appendChild(board);

  const pad = document.createElement('div');
  pad.className = 'pac-pad';
  const layout = [null, 'up', null, 'left', 'center', 'right', null, 'down', null];
  layout.forEach((dir) => {
    const b = document.createElement('button');
    b.className = `pac-pad-btn${!dir || dir === 'center' ? ' center' : ''}`;
    if (dir === 'up') b.textContent = '⬆️';
    else if (dir === 'down') b.textContent = '⬇️';
    else if (dir === 'left') b.textContent = '⬅️';
    else if (dir === 'right') b.textContent = '➡️';
    if (dir && dir !== 'center') b.addEventListener('click', () => move(dir));
    pad.appendChild(b);
  });
  els.play.appendChild(pad);

  function render() {
    board.innerHTML = '';
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cell = document.createElement('div');
        cell.className = 'pac-cell';
        const letter = game.letters.find((l) => l.x === x && l.y === y);
        const isGhost = game.ghosts.some((g) => g.x === x && g.y === y);
        const isPlayer = game.player.x === x && game.player.y === y;
        if (isGhost) cell.textContent = '👻';
        else if (isPlayer) cell.textContent = '🟡';
        else if (letter) {
          cell.textContent = letter.eaten ? '' : letter.ch;
          if (letter.eaten) cell.classList.add('letter-done');
        } else cell.textContent = '·';
        board.appendChild(cell);
      }
    }
    progress.textContent = game.word.split('').map((ch, i) => (i < game.nextIndex ? ch : '_')).join(' ');
    const livesEl = $('pacLives');
    if (livesEl) livesEl.textContent = '❤️'.repeat(Math.max(0, lives));
  }

  const DIR_MAP = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  function move(dir) {
    if (game.over) return;
    const [dx, dy] = DIR_MAP[dir];
    movePacPlayer(game, dx, dy);
    sfx.select();
    render();
    if (game.over) onOver();
  }

  function startTick() {
    tickTimer = setInterval(() => {
      tickPacGhosts(game);
      render();
      if (game.over) onOver();
    }, 500);
  }

  function onOver() {
    clearInterval(tickTimer);
    if (game.won) {
      setTimeout(() => finish(
        '🏆',
        `${t('arcadexua.pacman.win', 'Ghép được từ')} ${game.word} — ${wordObj.vi}!`,
        game.word.length * 10,
        `Giỏi quá, ghép được từ ${game.word} nghĩa là ${wordObj.vi}!`,
        'win',
      ), 400);
      return;
    }
    lives--;
    if (lives > 0) {
      sfx.fail();
      setTimeout(() => {
        game.player = { x: Math.floor(cols / 2), y: Math.floor(rows / 2) };
        game.ghosts = [{ x: 0, y: 0 }, { x: cols - 1, y: 0 }, { x: 0, y: rows - 1 }, { x: cols - 1, y: rows - 1 }].slice(0, ghostCount);
        game.over = false;
        render();
        startTick();
      }, 700);
    } else {
      sfx.gameOver();
      const gotSome = game.nextIndex > 0;
      setTimeout(() => finish(
        gotSome ? '🏆' : '💪',
        `${t('arcadexua.pacman.over', 'Hết mạng rồi')} — ${t('arcadexua.pacman.progress', 'Ghép được')} ${game.nextIndex}/${game.word.length}`,
        game.nextIndex * 10,
        gotSome ? 'Giỏi quá, ghép được vài chữ rồi!' : 'Bị ma bắt rồi, chơi lại nhé!',
        gotSome ? 'win' : 'loss',
      ), 400);
    }
  }

  const KEY_MAP = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
  const onKey = (e) => { if (KEY_MAP[e.key]) { e.preventDefault(); move(KEY_MAP[e.key]); } };
  document.addEventListener('keydown', onKey);

  els.subLine.textContent = t('arcadexua.pacman.hint', 'Ăn đúng thứ tự các chữ để ghép thành 1 từ tiếng Anh, né ma nhé!');
  sayInstruction(t('arcadexua.pacman.help', 'Dùng nút mũi tên hoặc phím mũi tên để di chuyển, ăn các chữ cái ĐÚNG THỨ TỰ để ghép thành một từ tiếng Anh. Né các con ma, đụng phải sẽ mất 1 mạng. Ghép xong cả từ là bé thắng!'));
  render();
  startTick();
  state.ctx.cleanup = () => { clearInterval(tickTimer); document.removeEventListener('keydown', onKey); };
}

/* ===== 2. Nhảy Né Không Ngừng (Endless Runner) ===== */

function startRunner() {
  const hud = document.createElement('div');
  hud.className = 'game-hud';
  hud.innerHTML = `<span>${t('arcadexua.score', 'Điểm')}: <b id="runScore">0</b></span>`;
  els.play.appendChild(hud);

  const stage = document.createElement('div');
  stage.className = 'runner-stage';
  const player = document.createElement('div');
  player.className = 'runner-player';
  player.textContent = '🦖';
  stage.appendChild(player);
  els.play.appendChild(stage);
  const worldW = stage.clientWidth || 380;

  const jumpBtn = document.createElement('button');
  jumpBtn.className = 'runner-jump-btn';
  jumpBtn.textContent = t('arcadexua.runner.jump', 'NHẢY! ⬆️');
  els.play.appendChild(jumpBtn);

  let obstacles = [];
  let score = 0;
  let over = false;
  let jumping = false;
  let jumpStart = -Infinity;
  let lastSpawnScore = 0;
  let animId = null;
  let lastTime = null;
  const obstacleEls = new Map();

  function jump() {
    if (jumping || over) return;
    jumping = true;
    jumpStart = performance.now();
    sfx.select();
  }

  function endGame() {
    over = true;
    sfx.gameOver();
    const finalScore = Math.floor(score);
    const won = finalScore >= 50;
    setTimeout(() => finish(
      won ? '🏆' : '💪',
      `${t('arcadexua.runner.over', 'Bị đụng rồi')} — ${t('arcadexua.score', 'Điểm')}: ${finalScore}`,
      finalScore,
      won ? 'Giỏi quá, chạy được rất xa!' : 'Bị đụng chướng ngại vật rồi, chơi lại nhé!',
      won ? 'win' : 'loss',
    ), 300);
  }

  function loop(now) {
    if (over) return;
    if (lastTime === null) lastTime = now;
    const dt = Math.min(48, now - lastTime);
    lastTime = now;
    score += dt * 0.01;
    $('runScore').textContent = Math.floor(score);

    const speed = speedForScore(score) * (dt / 16.67);
    obstacles = stepObstacles(obstacles, speed);

    if (score - lastSpawnScore > 55 + Math.random() * 45) {
      lastSpawnScore = score;
      obstacles.push(spawnObstacle(worldW + 20, Math.random));
    }

    let jumpOffset = 0;
    if (jumping) {
      jumpOffset = jumpArc(now - jumpStart, 480, 70);
      if (now - jumpStart >= 480) jumping = false;
    }
    player.style.transform = `translateY(${jumpOffset}px)`;

    for (const el of obstacleEls.values()) el.dataset.stale = '1';
    for (const o of obstacles) {
      let el = obstacleEls.get(o);
      if (!el) {
        el = document.createElement('div');
        el.className = 'runner-obstacle';
        el.textContent = '🌵';
        stage.appendChild(el);
        obstacleEls.set(o, el);
      }
      el.style.left = `${o.x}px`;
      delete el.dataset.stale;
    }
    for (const [o, el] of [...obstacleEls.entries()]) {
      if (el.dataset.stale) { el.remove(); obstacleEls.delete(o); }
    }

    for (const o of obstacles) {
      if (isRunnerHit(40, 30, 160, 34, jumpOffset, o, 160)) { endGame(); return; }
    }

    animId = requestAnimationFrame(loop);
  }

  jumpBtn.addEventListener('click', jump);
  const onKey = (e) => { if (e.key === ' ' || e.key === 'ArrowUp') { e.preventDefault(); jump(); } };
  document.addEventListener('keydown', onKey);

  els.subLine.textContent = t('arcadexua.runner.hint', 'Bấm NHẢY để né xương rồng — càng chạy xa điểm càng cao!');
  sayInstruction(t('arcadexua.runner.help', 'Khủng long tự động chạy về phía trước. Bấm nút NHẢY hoặc phím cách đúng lúc để nhảy qua xương rồng. Càng chạy được xa mà không đụng phải thì điểm càng cao!'));
  animId = requestAnimationFrame(loop);
  state.ctx.cleanup = () => { over = true; if (animId) cancelAnimationFrame(animId); document.removeEventListener('keydown', onKey); };
}

/* ===== 3. Bắn Cá Ăn Xu ===== */

function startFishing() {
  const hud = document.createElement('div');
  hud.className = 'game-hud';
  hud.innerHTML = `<span>${t('arcadexua.fishing.coins', 'Xu')}: <b id="fishCoins">0</b></span><span>${t('arcadexua.time', 'Thời gian')}: <b id="fishTime">30</b>s</span>`;
  els.play.appendChild(hud);

  const stage = document.createElement('div');
  stage.className = 'fishing-stage';
  const cannon = document.createElement('div');
  cannon.className = 'fishing-cannon';
  cannon.textContent = '🔫';
  stage.appendChild(cannon);
  els.play.appendChild(stage);

  const worldW = () => stage.clientWidth || 380;
  const worldH = () => stage.clientHeight || 260;

  let fishes = [];
  let coins = 0;
  let timeLeft = 30;
  let over = false;
  let animId = null;
  const fishEls = new Map();

  function spawnLoop() {
    if (over || fishes.length >= 5) return;
    fishes.push(spawnFish(5, worldH() / 5, worldW(), Math.random));
  }
  const spawnTimer = setInterval(spawnLoop, 1100);
  spawnLoop(); spawnLoop(); spawnLoop();

  const countdownId = setInterval(() => {
    if (over) return;
    timeLeft--;
    $('fishTime').textContent = Math.max(0, timeLeft);
    if (timeLeft <= 0) endRound();
  }, 1000);

  function endRound() {
    if (over) return;
    over = true;
    clearInterval(spawnTimer);
    clearInterval(countdownId);
    if (animId) cancelAnimationFrame(animId);
    const won = coins >= 15;
    setTimeout(() => finish(
      won ? '🏆' : '💪',
      `${t('arcadexua.fishing.over', 'Hết giờ')} — ${t('arcadexua.fishing.coins', 'Xu')}: ${coins}`,
      coins,
      won ? 'Giỏi quá, bắn được rất nhiều xu!' : 'Hết giờ rồi, chơi lại nhé!',
      won ? 'win' : 'loss',
    ), 200);
  }

  function render() {
    for (const el of fishEls.values()) el.dataset.stale = '1';
    for (const f of fishes) {
      let el = fishEls.get(f);
      if (!el) {
        el = document.createElement('div');
        el.className = 'fish-el';
        el.textContent = f.value >= 5 ? '🐡' : f.value >= 3 ? '🐠' : '🐟';
        stage.insertBefore(el, cannon);
        fishEls.set(f, el);
      }
      el.style.left = `${f.x}px`;
      el.style.top = `${f.y}px`;
      delete el.dataset.stale;
    }
    for (const [f, el] of [...fishEls.entries()]) {
      if (el.dataset.stale) { el.remove(); fishEls.delete(f); }
    }
  }

  function loop() {
    if (over) return;
    fishes = fishes.map(stepFish).filter((f) => !isFishOffscreen(f, worldW()));
    render();
    animId = requestAnimationFrame(loop);
  }

  stage.addEventListener('pointerdown', (e) => {
    if (over) return;
    const rect = stage.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const shot = document.createElement('div');
    shot.className = 'fishing-shot';
    const startX = worldW() / 2;
    const startY = worldH() - 16;
    shot.style.left = `${startX}px`;
    shot.style.top = `${startY}px`;
    stage.appendChild(shot);
    requestAnimationFrame(() => {
      shot.style.transition = 'left .2s ease-out, top .2s ease-out';
      shot.style.left = `${x}px`;
      shot.style.top = `${y}px`;
    });
    sfx.select();
    setTimeout(() => {
      shot.remove();
      const hitIdx = fishes.findIndex((f) => isFishHit(f, x, y, 26));
      if (hitIdx >= 0) {
        const f = fishes[hitIdx];
        coins += f.value;
        $('fishCoins').textContent = coins;
        sfx.match(1);
        const el = fishEls.get(f);
        if (el) { el.remove(); fishEls.delete(f); }
        fishes.splice(hitIdx, 1);
      } else {
        sfx.fail();
      }
    }, 210);
  });

  els.subLine.textContent = t('arcadexua.fishing.hint', 'Chạm vào cá để bắn — cá to hơn cho nhiều xu hơn!');
  sayInstruction(t('arcadexua.fishing.help', 'Chạm vào màn hình ngay chỗ có con cá để bắn trúng nó. Cá to hơn thường cho nhiều xu hơn. Bắn được càng nhiều xu trong 30 giây càng tốt!'));
  animId = requestAnimationFrame(loop);
  state.ctx.cleanup = () => { over = true; clearInterval(spawnTimer); clearInterval(countdownId); if (animId) cancelAnimationFrame(animId); };
}

/* ===== 4. Đập Gạch Bóng Nảy (Breakout) ===== */

function startBreakout() {
  const hud = document.createElement('div');
  hud.className = 'game-hud';
  hud.innerHTML = `<span>${t('arcadexua.score', 'Điểm')}: <b id="brkScore">0</b></span><span>${t('arcadexua.lives', 'Mạng')}: <b id="brkLives">3</b></span>`;
  els.play.appendChild(hud);

  const canvas = document.createElement('canvas');
  canvas.className = 'breakout-canvas';
  canvas.width = 320;
  canvas.height = Math.round(320 / 0.72);
  els.play.appendChild(canvas);
  const c2d = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const PADDLE_W = 64;
  const BALL_R = 6;
  const ROWS = 4;
  const COLS = 7;
  const BRICK_W = W / COLS;
  const BRICK_H = 18;
  const BRICK_TOP = 30;
  const COLORS = ['#e5484d', '#f5c542', '#22c55e', '#3b82f6'];

  const bricks = makeBricks(ROWS, COLS);
  let paddleX = W / 2;
  let ball = { x: W / 2, y: H - 40, vx: 2.4, vy: -3.2 };
  let score = 0;
  let lives = 3;
  let over = false;
  let launched = false;
  let animId = null;

  function brickRect(b) { return { x: b.col * BRICK_W + 2, y: BRICK_TOP + b.row * BRICK_H + 2, w: BRICK_W - 4, h: BRICK_H - 4 }; }

  function draw() {
    c2d.clearRect(0, 0, W, H);
    for (const b of bricks) {
      if (!b.alive) continue;
      const r = brickRect(b);
      c2d.fillStyle = COLORS[b.row % COLORS.length];
      c2d.fillRect(r.x, r.y, r.w, r.h);
    }
    c2d.fillStyle = '#fff';
    c2d.fillRect(paddleX - PADDLE_W / 2, H - 24, PADDLE_W, 10);
    c2d.beginPath();
    c2d.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
    c2d.fillStyle = '#f5c542';
    c2d.fill();
  }

  function endGame(won) {
    over = true;
    if (won) sfx.levelWin(); else sfx.gameOver();
    setTimeout(() => finish(
      won ? '🏆' : '💪',
      `${won ? t('arcadexua.breakout.win', 'Đập vỡ hết gạch rồi!') : t('arcadexua.breakout.over', 'Hết mạng rồi')} — ${t('arcadexua.score', 'Điểm')}: ${score}`,
      score,
      won ? 'Giỏi quá, đập vỡ hết gạch rồi!' : 'Hết mạng rồi, chơi lại nhé!',
      won ? 'win' : 'loss',
    ), 300);
  }

  function loop() {
    if (over) return;
    if (launched) {
      stepBreakoutBall(ball);
      bounceBreakoutWalls(ball, W, BALL_R);
      hitBreakoutPaddle(ball, paddleX, H - 24, PADDLE_W, BALL_R);
      for (const b of bricks) {
        if (!b.alive) continue;
        const r = brickRect(b);
        if (hitBrick(ball, b, r.x, r.y, r.w, r.h, BALL_R)) {
          score += 10;
          sfx.match(1);
          $('brkScore').textContent = score;
          break;
        }
      }
      if (ball.y - BALL_R > H) {
        lives--;
        $('brkLives').textContent = Math.max(0, lives);
        if (lives <= 0) { endGame(false); return; }
        sfx.fail();
        launched = false;
        ball = { x: paddleX, y: H - 40, vx: 2.4 * (Math.random() < 0.5 ? 1 : -1), vy: -3.2 };
      }
      if (countAliveBricks(bricks) === 0) { endGame(true); return; }
    } else {
      ball.x = paddleX;
      ball.y = H - 40;
    }
    draw();
    animId = requestAnimationFrame(loop);
  }

  function toX(e) {
    const rect = canvas.getBoundingClientRect();
    return ((e.clientX - rect.left) / rect.width) * W;
  }
  canvas.addEventListener('pointermove', (e) => { paddleX = Math.max(PADDLE_W / 2, Math.min(W - PADDLE_W / 2, toX(e))); });
  canvas.addEventListener('pointerdown', (e) => {
    paddleX = Math.max(PADDLE_W / 2, Math.min(W - PADDLE_W / 2, toX(e)));
    if (!launched) { launched = true; sfx.select(); }
  });

  els.subLine.textContent = t('arcadexua.breakout.hint', 'Rê ngón tay để đỡ bóng, đập vỡ hết gạch — chạm màn hình để bắt đầu!');
  sayInstruction(t('arcadexua.breakout.help', 'Rê ngón tay trái phải để di chuyển thanh trượt, đỡ bóng nảy lên đập vỡ các viên gạch phía trên. Chạm vào màn hình để bắt đầu thả bóng. Để bóng rơi xuống dưới là mất 1 mạng, hết mạng là thua. Đập vỡ hết gạch là thắng!'));
  draw();
  animId = requestAnimationFrame(loop);
  state.ctx.cleanup = () => { if (animId) cancelAnimationFrame(animId); };
}

/* ===== 5. Nối Kẹo Ba (Match-3) ===== */

const CANDY_EMOJI = ['', '🍬', '🍭', '🍫', '🍩', '🍪'];

function startCandy() {
  const cols = 6;
  const rows = 6;
  const grid = makeCandyGrid(cols, rows, Math.random);
  let score = 0;
  let moves = 15;
  let selected = null;
  let busy = false;
  let over = false;

  const hud = document.createElement('div');
  hud.className = 'game-hud';
  hud.innerHTML = `<span>${t('arcadexua.score', 'Điểm')}: <b id="candyScore">0</b></span><span>${t('arcadexua.candy.moves', 'Lượt')}: <b id="candyMoves">${moves}</b></span>`;
  els.play.appendChild(hud);

  const board = document.createElement('div');
  board.className = 'candy-board';
  board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  els.play.appendChild(board);

  const cellEls = [];
  for (let i = 0; i < cols * rows; i++) {
    const btn = document.createElement('button');
    btn.className = 'candy-cell';
    btn.addEventListener('click', () => onPick(i));
    board.appendChild(btn);
    cellEls.push(btn);
  }

  function render() {
    grid.forEach((v, i) => {
      cellEls[i].textContent = CANDY_EMOJI[v] || '';
      cellEls[i].classList.toggle('sel', selected === i);
    });
    $('candyScore').textContent = score;
    $('candyMoves').textContent = Math.max(0, moves);
  }

  function processMatches() {
    let totalCleared = 0;
    let found = findMatches(grid, cols, rows);
    while (found.size > 0) {
      totalCleared += clearMatches(grid, found);
      collapseCandyColumns(grid, cols, rows);
      refillCandyGrid(grid, Math.random);
      found = findMatches(grid, cols, rows);
    }
    return totalCleared;
  }

  function endGame() {
    over = true;
    const won = score >= 200;
    setTimeout(() => finish(
      won ? '🏆' : '💪',
      `${t('arcadexua.candy.over', 'Hết lượt rồi')} — ${t('arcadexua.score', 'Điểm')}: ${score}`,
      score,
      won ? 'Giỏi quá, nối được rất nhiều kẹo!' : 'Hết lượt rồi, chơi lại nhé!',
      won ? 'win' : 'loss',
    ), 300);
  }

  function onPick(i) {
    if (busy || over) return;
    if (selected === null) { selected = i; sfx.select(); render(); return; }
    if (selected === i) { selected = null; render(); return; }
    if (!areAdjacent(cols, selected, i)) { selected = i; render(); return; }

    busy = true;
    const a = selected;
    const b = i;
    selected = null;
    swapCandies(grid, a, b);
    render();
    const matched = findMatches(grid, cols, rows);
    if (matched.size === 0) {
      setTimeout(() => {
        swapCandies(grid, a, b);
        render();
        busy = false;
      }, 300);
    } else {
      setTimeout(() => {
        const cleared = processMatches();
        score += cleared * 10;
        sfx.match(1);
        moves--;
        render();
        busy = false;
        if (moves <= 0) endGame();
      }, 200);
    }
  }

  els.subLine.textContent = t('arcadexua.candy.hint', 'Chạm 2 viên kẹo liền kề để đổi chỗ — nối ≥3 viên cùng loại sẽ biến mất!');
  sayInstruction(t('arcadexua.candy.help', 'Chạm 1 viên kẹo rồi chạm tiếp viên kẹo liền kề để đổi chỗ 2 viên cho nhau. Nếu đổi chỗ tạo thành hàng hoặc cột từ 3 viên cùng loại trở lên, chúng sẽ biến mất và cộng điểm. Bé có 15 lượt đổi chỗ, cố ghi được điểm thật cao nhé!'));
  render();
}

/* ===== Bảng phân phối ===== */

const GAMES = {
  pacman: startPacman, runner: startRunner, fishing: startFishing,
  breakout: startBreakout, candy: startCandy,
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
window.__arcadexua = { state, startGame, showHome };

mountKidFeatures(); // thanh avatar bé + huy hiệu sao header + kiểm tra giới hạn phút/ngày (áp dụng cho mọi game, kể cả game giải trí thuần)
