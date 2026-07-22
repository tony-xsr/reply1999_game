// Điều phối Rèn Trí Não: 5 trò "hồi xưa gây nghiện" trong 1 — Simon Nhớ Màu,
// Ghép Số 2048, Lật Bài Nhớ Hình, Bi-a Lỗ Mini, Ghép Khối Rơi Theo Nhóm.
// Cùng khung shell/cheer/confetti với tu-duy/ (game tư duy anh em trước đó).

import {
  SIMON_COLORS, nextSimonStep, checkSimonInput,
  makeGrid2048, move2048, spawnTile2048, canMove2048, has2048,
  makeMemoryDeck, isMemoryMatch,
  stepBall, wallBounce, ballsOverlap, resolveCollision, isPocketed, allStopped,
  makeEmptyGrid, dropBlock, clearGroups, collapseColumns, isColumnFull, randomColor,
} from './rentrinao.js';
import { speak, speakSequence, bindMute } from '../../to-mau/src/speech.js';
import { sfx } from '../../pokemon/src/sfx.js';
import { currentProfile, recordSession } from '../../pokemon/src/stats.js';

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
    mode: `rentrinao-${state.game}`,
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

/* ===== 1. Simon Nhớ Màu/Số ===== */

function startSimon() {
  const scoreEl = document.createElement('div');
  scoreEl.className = 'simon-score';
  scoreEl.textContent = `${t('rentrinao.score', 'Điểm')}: 0`;
  els.play.appendChild(scoreEl);

  const pad = document.createElement('div');
  pad.className = 'simon-pad';
  const btns = SIMON_COLORS.map(() => {
    const b = document.createElement('button');
    b.className = 'simon-btn';
    pad.appendChild(b);
    return b;
  });
  els.play.appendChild(pad);

  let seq = [];
  let input = [];
  let round = 0;
  let accepting = false;

  function lightPad(i, ms = 450) {
    return new Promise((resolve) => {
      btns[i].classList.add('lit');
      sfx.select();
      setTimeout(() => {
        btns[i].classList.remove('lit');
        setTimeout(resolve, 150);
      }, ms);
    });
  }

  async function playSeq() {
    accepting = false;
    btns.forEach((b) => { b.disabled = true; });
    await new Promise((r) => setTimeout(r, 400));
    for (const i of seq) await lightPad(i);
    accepting = true;
    btns.forEach((b) => { b.disabled = false; });
    input = [];
  }

  function nextRound() {
    seq = nextSimonStep(seq, Math.random);
    round++;
    scoreEl.textContent = `${t('rentrinao.score', 'Điểm')}: ${round - 1}`;
    playSeq();
  }

  btns.forEach((b, i) => {
    b.addEventListener('click', () => {
      if (!accepting) return;
      input.push(i);
      b.classList.add('lit');
      sfx.select();
      setTimeout(() => b.classList.remove('lit'), 200);
      const res = checkSimonInput(seq, input);
      if (res === 'wrong') {
        accepting = false;
        shakeEl(b);
        const finalScore = round - 1;
        setTimeout(() => finish(
          finalScore >= 5 ? '🏆' : '💪',
          `${t('rentrinao.simon.result', 'Được')} ${finalScore} ${t('rentrinao.simon.point', 'điểm')}!`,
          finalScore,
          finalScore >= 5 ? 'Giỏi quá, nhớ được rất nhiều bước!' : 'Chưa đúng rồi, chơi lại nhé!',
          finalScore >= 5 ? 'win' : 'loss',
        ), 500);
      } else if (res === 'complete') {
        accepting = false;
        setTimeout(nextRound, 600);
      }
    });
  });

  els.subLine.textContent = t('rentrinao.simon.hint', 'Xem kỹ thứ tự sáng rồi bấm lại đúng y hệt nhé!');
  sayInstruction(t('rentrinao.simon.help', 'Nhìn thật kỹ các ô sáng theo thứ tự, rồi bấm lại đúng như vậy. Mỗi vòng chuỗi sẽ dài thêm 1 bước!'));
  nextRound();
}

/* ===== 2. Ghép Số 2048 ===== */

function startG2048() {
  const n = 4;
  let grid = makeGrid2048(n);
  spawnTile2048(grid, Math.random);
  spawnTile2048(grid, Math.random);
  let score = 0;
  let over = false;
  let won = false;

  const hud = document.createElement('div');
  hud.className = 'g2048-hud';
  hud.innerHTML = `<span>${t('rentrinao.score', 'Điểm')}: <b id="g2048Score">0</b></span>`;
  els.play.appendChild(hud);

  const board = document.createElement('div');
  board.className = 'g2048-board';
  board.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
  board.style.gridTemplateRows = `repeat(${n}, 1fr)`;
  els.play.appendChild(board);

  function render() {
    board.innerHTML = '';
    grid.forEach((v) => {
      const cell = document.createElement('div');
      cell.className = 'g2048-cell';
      if (v) { cell.dataset.v = v; cell.textContent = v; }
      board.appendChild(cell);
    });
    $('g2048Score').textContent = score;
  }

  function doMove(dir) {
    if (over) return;
    const res = move2048(grid, n, dir, Math.random);
    if (!res.moved) return;
    grid = res.grid;
    score += res.gained;
    if (res.gained > 0) sfx.match(1); else sfx.select();
    render();
    if (has2048(grid) && !won) {
      won = true;
      over = true;
      setTimeout(() => finish('🏆', `${t('rentrinao.g2048.result', 'Bé ghép được 2048 rồi!')} ${t('rentrinao.score', 'Điểm')}: ${score}`, score, 'Tuyệt vời, bé ghép được số 2048 rồi!', 'win'), 300);
      return;
    }
    if (!canMove2048(grid, n)) {
      over = true;
      setTimeout(() => finish('💪', `${t('rentrinao.g2048.over', 'Hết nước đi rồi')} — ${t('rentrinao.score', 'Điểm')}: ${score}`, score, 'Hết nước đi rồi, chơi lại nhé!', 'loss'), 300);
    }
  }

  const DIR_KEYS = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' };
  const onKey = (e) => {
    if (DIR_KEYS[e.key]) { e.preventDefault(); doMove(DIR_KEYS[e.key]); }
  };
  document.addEventListener('keydown', onKey);

  let sx = 0;
  let sy = 0;
  board.addEventListener('pointerdown', (e) => { sx = e.clientX; sy = e.clientY; });
  board.addEventListener('pointerup', (e) => {
    const dx = e.clientX - sx;
    const dy = e.clientY - sy;
    if (Math.hypot(dx, dy) < 24) return;
    if (Math.abs(dx) > Math.abs(dy)) doMove(dx > 0 ? 'right' : 'left');
    else doMove(dy > 0 ? 'down' : 'up');
  });

  els.subLine.textContent = t('rentrinao.g2048.hint', 'Vuốt hoặc bấm phím mũi tên để trượt và gộp số giống nhau!');
  sayInstruction(t('rentrinao.g2048.help', 'Vuốt màn hình hoặc bấm phím mũi tên để trượt các số. Hai số giống nhau chạm vào nhau sẽ gộp thành 1 số to gấp đôi. Ghép được số 2048 là bé thắng!'));
  render();
  state.ctx.cleanup = () => document.removeEventListener('keydown', onKey);
}

/* ===== 3. Lật Bài Nhớ Hình Nâng Cấp ===== */

const MEMORY_SIZES = [{ label: 'Dễ', pairs: 6 }, { label: 'Vừa', pairs: 8 }, { label: 'Khó', pairs: 10 }];

function startMemory() {
  const ctx = state.ctx;
  ctx.memoryPairs = ctx.memoryPairs ?? 6;

  const row = document.createElement('div');
  row.className = 'pick-row';
  for (const s of MEMORY_SIZES) {
    const btn = document.createElement('button');
    btn.className = `pick-btn${s.pairs === ctx.memoryPairs ? ' active' : ''}`;
    btn.textContent = s.label;
    btn.addEventListener('click', () => { ctx.memoryPairs = s.pairs; startGame('memory'); });
    row.appendChild(btn);
  }
  els.play.appendChild(row);

  const caption = document.createElement('div');
  caption.className = 'memory-caption';
  els.play.appendChild(caption);

  const pairCount = ctx.memoryPairs;
  const deck = makeMemoryDeck(pairCount, Math.random);
  const cols = pairCount <= 6 ? 4 : pairCount <= 8 ? 4 : 5;
  const grid = document.createElement('div');
  grid.className = 'memory-grid';
  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  els.play.appendChild(grid);

  let flipped = [];
  let matchedCount = 0;
  let busy = false;

  deck.forEach((card) => {
    const btn = document.createElement('button');
    btn.className = 'memory-card';
    btn.textContent = '❓';
    btn.addEventListener('click', () => onFlip(card, btn));
    grid.appendChild(btn);
  });

  function onFlip(card, btn) {
    if (busy || btn.classList.contains('flipped') || btn.classList.contains('matched')) return;
    btn.classList.add('flipped');
    btn.textContent = card.emoji;
    sfx.select();
    flipped.push({ card, btn });
    if (flipped.length < 2) return;
    busy = true;
    const [a, b] = flipped;
    if (isMemoryMatch(a.card, b.card)) {
      a.btn.classList.add('matched'); b.btn.classList.add('matched');
      matchedCount++;
      sfx.match(1);
      caption.textContent = `${a.card.en} — ${a.card.vi}`;
      speakSequence([
        { text: a.card.en, lang: 'en-US', rate: 1 },
        { text: `nghĩa là ${a.card.vi}`, lang: 'vi-VN', rate: 0.9 },
      ], () => {});
      flipped = [];
      busy = false;
      if (matchedCount === pairCount) {
        setTimeout(() => finish('🏆', `${t('rentrinao.memory.result', 'Lật hết')} ${pairCount} ${t('rentrinao.memory.pairs', 'cặp rồi!')}`, pairCount * 10, 'Giỏi quá, lật hết các cặp rồi!', 'win'), 500);
      }
    } else {
      shakeEl(a.btn); shakeEl(b.btn);
      setTimeout(() => {
        a.btn.classList.remove('flipped'); a.btn.textContent = '❓';
        b.btn.classList.remove('flipped'); b.btn.textContent = '❓';
        flipped = [];
        busy = false;
      }, 700);
    }
  }

  els.subLine.textContent = t('rentrinao.memory.hint', 'Lật 2 lá — trùng hình sẽ nghe từ tiếng Anh + nghĩa!');
  sayInstruction(t('rentrinao.memory.help', 'Chạm để lật 1 lá bài, rồi lật thêm 1 lá nữa. Nếu 2 lá trùng hình, máy sẽ đọc từ tiếng Anh và nghĩa cho bé nghe! Lật hết các cặp là thắng.'));
}

/* ===== 4. Bi-a Lỗ Mini ===== */

function startBilliard() {
  const hud = document.createElement('div');
  hud.className = 'billiard-hud';
  hud.innerHTML = `<span>${t('rentrinao.score', 'Điểm')}: <b id="biScore">0</b></span><span>${t('rentrinao.billiard.left', 'Bi còn lại')}: <b id="biLeft">6</b></span>`;
  els.play.appendChild(hud);

  const canvas = document.createElement('canvas');
  canvas.className = 'billiard-canvas';
  canvas.width = 640;
  canvas.height = Math.round(640 / 1.7);
  els.play.appendChild(canvas);
  const c2d = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const R = 16;

  const pockets = [
    { x: 6, y: 6, r: 24 }, { x: W / 2, y: 4, r: 20 }, { x: W - 6, y: 6, r: 24 },
    { x: 6, y: H - 6, r: 24 }, { x: W / 2, y: H - 4, r: 20 }, { x: W - 6, y: H - 6, r: 24 },
  ];
  const colors = ['#f2b179', '#3b82f6', '#e5484d', '#22c55e', '#eab308', '#a855f7'];

  let balls = [];
  function layout() {
    balls = [{ x: W * 0.22, y: H / 2, vx: 0, vy: 0, color: '#fdfdfd', cue: true }];
    const cx = W * 0.68;
    const cy = H / 2;
    let i = 0;
    for (let row = 0; row < 3; row++) {
      for (let k = 0; k <= row; k++) {
        balls.push({
          x: cx + row * R * 1.8, y: cy - row * R + k * R * 2, vx: 0, vy: 0, color: colors[i % colors.length],
        });
        i++;
      }
    }
  }
  layout();

  let score = 0;
  let aiming = false;
  let aimDx = 0;
  let aimDy = 0;
  let animId = null;
  let ended = false;

  function draw() {
    c2d.clearRect(0, 0, W, H);
    c2d.fillStyle = '#0a3d1f';
    for (const p of pockets) {
      c2d.beginPath();
      c2d.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      c2d.fill();
    }
    for (const b of balls) {
      c2d.beginPath();
      c2d.arc(b.x, b.y, R, 0, Math.PI * 2);
      c2d.fillStyle = b.color;
      c2d.fill();
      c2d.strokeStyle = 'rgba(0,0,0,.25)';
      c2d.stroke();
    }
    if (aiming) {
      const cue = balls.find((b) => b.cue);
      if (cue) {
        c2d.strokeStyle = 'rgba(255,255,255,.75)';
        c2d.lineWidth = 3;
        c2d.setLineDash([6, 6]);
        c2d.beginPath();
        c2d.moveTo(cue.x, cue.y);
        c2d.lineTo(cue.x - aimDx, cue.y - aimDy);
        c2d.stroke();
        c2d.setLineDash([]);
      }
    }
  }

  function physicsStep() {
    let moving = false;
    for (const b of balls) {
      if (b.vx || b.vy) {
        stepBall(b);
        wallBounce(b, W, H, R);
        moving = true;
      }
    }
    for (let i = 0; i < balls.length; i++) {
      for (let j = i + 1; j < balls.length; j++) {
        if (ballsOverlap(balls[i], balls[j], R)) resolveCollision(balls[i], balls[j], R);
      }
    }
    for (let i = balls.length - 1; i >= 0; i--) {
      if (isPocketed(balls[i], pockets)) {
        if (balls[i].cue) {
          balls[i].x = W * 0.22; balls[i].y = H / 2; balls[i].vx = 0; balls[i].vy = 0;
        } else {
          balls.splice(i, 1);
          score += 10;
          sfx.match(1);
        }
      }
    }
    draw();
    $('biScore').textContent = score;
    $('biLeft').textContent = balls.filter((b) => !b.cue).length;
    if (moving && allStopped(balls) === false) {
      animId = requestAnimationFrame(physicsStep);
    } else {
      animId = null;
      if (!ended && balls.filter((b) => !b.cue).length === 0) {
        ended = true;
        setTimeout(() => finish('🏆', `${t('rentrinao.billiard.result', 'Dồn hết bi vào lỗ!')} ${t('rentrinao.score', 'Điểm')}: ${score}`, score, 'Tuyệt vời, dồn hết bi vào lỗ rồi!', 'win'), 300);
      }
    }
  }

  // Đo rect() 1 lần lúc pointerdown + gom pointermove qua rAF, tránh layout
  // thrashing và vẽ lại nhiều hơn tốc độ khung hình thật sự cần.
  let biRect = null;
  let rafAimBi = false;
  function toXY(e) {
    return {
      x: ((e.clientX - biRect.left) / biRect.width) * W,
      y: ((e.clientY - biRect.top) / biRect.height) * H,
    };
  }

  canvas.addEventListener('pointerdown', (e) => {
    if (animId) return;
    const cue = balls.find((b) => b.cue);
    if (!cue) return;
    biRect = canvas.getBoundingClientRect();
    const p = toXY(e);
    aiming = true;
    aimDx = p.x - cue.x;
    aimDy = p.y - cue.y;
    draw();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!aiming) return;
    const cue = balls.find((b) => b.cue);
    if (!cue) return;
    const p = toXY(e);
    aimDx = p.x - cue.x;
    aimDy = p.y - cue.y;
    if (!rafAimBi) { rafAimBi = true; requestAnimationFrame(() => { rafAimBi = false; draw(); }); }
  });
  canvas.addEventListener('pointerup', () => {
    if (!aiming) return;
    aiming = false;
    const cue = balls.find((b) => b.cue);
    const dist = Math.hypot(aimDx, aimDy);
    if (cue && dist > 8) {
      const power = Math.min(18, dist / 8);
      cue.vx = (-aimDx / dist) * power;
      cue.vy = (-aimDy / dist) * power;
      sfx.select();
      animId = requestAnimationFrame(physicsStep);
    }
    draw();
  });

  els.subLine.textContent = t('rentrinao.billiard.hint', 'Kéo từ bi trắng ra xa rồi thả để bắn — dồn hết bi màu vào lỗ!');
  sayInstruction(t('rentrinao.billiard.help', 'Chạm vào bàn rồi kéo ra xa bi trắng để nhắm, thả tay ra để bắn. Dồn hết các bi màu vào lỗ ở góc và giữa bàn nhé!'));
  draw();
  state.ctx.cleanup = () => { if (animId) cancelAnimationFrame(animId); };
}

/* ===== 5. Ghép Khối Rơi Theo Nhóm ===== */

const BM_COLOR_CLASS = ['', 'c1', 'c2', 'c3', 'c4', 'c5'];

function startBlockMatch() {
  const cols = 6;
  const rows = 8;
  const grid = makeEmptyGrid(cols, rows);
  let score = 0;
  let next = randomColor(Math.random);
  let over = false;

  const hud = document.createElement('div');
  hud.className = 'blockmatch-hud';
  hud.innerHTML = `<span>${t('rentrinao.score', 'Điểm')}: <b id="bmScore">0</b></span><span>${t('rentrinao.blockmatch.next', 'Tiếp theo')}: <span class="bm-next-swatch" id="bmNextSwatch"></span></span>`;
  els.play.appendChild(hud);

  const dropRow = document.createElement('div');
  dropRow.className = 'bm-drop-row';
  const dropBtns = [];
  for (let c = 0; c < cols; c++) {
    const btn = document.createElement('button');
    btn.className = 'bm-drop-btn';
    btn.textContent = '⬇';
    btn.addEventListener('click', () => onDropCol(c));
    dropRow.appendChild(btn);
    dropBtns.push(btn);
  }
  els.play.appendChild(dropRow);

  const board = document.createElement('div');
  board.className = 'blockmatch-board';
  board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  els.play.appendChild(board);
  const cellEls = [];
  for (let i = 0; i < cols * rows; i++) {
    const cell = document.createElement('div');
    cell.className = 'bm-cell';
    board.appendChild(cell);
    cellEls.push(cell);
  }

  function render() {
    grid.forEach((v, i) => {
      cellEls[i].className = `bm-cell${v ? ` ${BM_COLOR_CLASS[v]}` : ''}`;
    });
    $('bmScore').textContent = score;
    $('bmNextSwatch').className = `bm-next-swatch ${BM_COLOR_CLASS[next]}`;
    dropBtns.forEach((btn, c) => { btn.disabled = over || isColumnFull(grid, cols, c); });
  }

  function onDropCol(col) {
    if (over) return;
    const res = dropBlock(grid, cols, rows, col, next);
    if (!res.landed) { sfx.fail(); return; }
    sfx.select();
    const clearedCount = clearGroups(grid, cols, rows, 3);
    if (clearedCount > 0) {
      score += clearedCount * 5;
      sfx.match(1);
      collapseColumns(grid, cols, rows);
    }
    next = randomColor(Math.random);
    render();
    const anyFull = Array.from({ length: cols }, (_, c) => c).some((c) => isColumnFull(grid, cols, c));
    if (anyFull) {
      over = true;
      const won = score >= 50;
      setTimeout(() => finish(
        won ? '🏆' : '💪',
        `${t('rentrinao.blockmatch.over', 'Bảng đầy rồi')} — ${t('rentrinao.score', 'Điểm')}: ${score}`,
        score,
        won ? 'Giỏi quá, được điểm rất cao!' : 'Bảng đầy rồi, chơi lại nhé!',
        won ? 'win' : 'loss',
      ), 400);
    }
  }

  els.subLine.textContent = t('rentrinao.blockmatch.hint', 'Bấm mũi tên để thả khối màu — ghép ≥3 khối liền màu để xoá!');
  sayInstruction(t('rentrinao.blockmatch.help', 'Bấm nút mũi tên phía trên 1 cột để thả khối màu xuống cột đó. Từ 3 khối cùng màu liền nhau trở lên sẽ tự biến mất và cộng điểm. Bảng đầy tới trên cùng là kết thúc ván.'));
  render();
}

/* ===== Bảng phân phối ===== */

const GAMES = {
  simon: startSimon, g2048: startG2048, memory: startMemory,
  billiard: startBilliard, blockmatch: startBlockMatch,
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
window.__rentrinao = { state, startGame, showHome };
