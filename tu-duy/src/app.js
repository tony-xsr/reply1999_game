// Điều phối Luyện Tư Duy: 6 trò trong 1 — mê cung, sudoku bé, tìm điểm khác,
// nối số thành hình, khác nhóm, tháp Hà Nội. Dùng chung sfx + giọng đọc + stats.

import {
  makeMaze, canGo,
  makeSudoku, makeSpotDiff, DOT_SHAPES, makeOddOneOut,
  createHanoi, moveHanoi, isHanoiDone, hanoiOptimal,
} from './tuduy.js';
import { TOPICS, ALL_ITEMS } from '../../hoc-vui/src/words.js';
import { speak, bindMute } from '../../to-mau/src/speech.js';
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

function win(text, score, cheerSay) {
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'tuduy',
    result: 'win',
    score,
    level: 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  sfx.levelWin();
  confetti();
  els.cheerEmoji.textContent = '🏆';
  els.cheerText.textContent = text;
  els.cheer.classList.remove('hidden');
  speak(cheerSay || 'Giỏi quá!');
}

function showHome() {
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

/* ===== 1. Mê cung: rê tay dắt 🐭 tới 🧀 ===== */

const MAZE_SIZES = [{ label: 'Dễ', n: 8 }, { label: 'Vừa', n: 12 }, { label: 'Khó', n: 16 }];

function startMaze() {
  const ctx = state.ctx;
  ctx.mazeSize = ctx.mazeSize ?? 8;

  const row = document.createElement('div');
  row.className = 'pick-row';
  for (const sz of MAZE_SIZES) {
    const btn = document.createElement('button');
    btn.className = `pick-btn${sz.n === ctx.mazeSize ? ' active' : ''}`;
    btn.textContent = `${sz.label} ${sz.n}×${sz.n}`;
    btn.addEventListener('click', () => { ctx.mazeSize = sz.n; startGame('maze'); });
    row.appendChild(btn);
  }
  els.play.appendChild(row);

  const canvas = document.createElement('canvas');
  canvas.className = 'board-canvas';
  canvas.width = 640;
  canvas.height = 640;
  els.play.appendChild(canvas);

  const n = ctx.mazeSize;
  const maze = makeMaze(n, n);
  const cell = 640 / n;
  const mouse = { x: 0, y: 0 };
  const trail = [[0, 0]];
  let done = false;
  const c2d = canvas.getContext('2d');

  const draw = () => {
    c2d.clearRect(0, 0, 640, 640);
    // vệt đường đã đi
    c2d.strokeStyle = '#ffe0c2';
    c2d.lineWidth = cell * 0.4;
    c2d.lineCap = 'round';
    c2d.lineJoin = 'round';
    c2d.beginPath();
    c2d.moveTo((trail[0][0] + 0.5) * cell, (trail[0][1] + 0.5) * cell);
    for (const [x, y] of trail) c2d.lineTo((x + 0.5) * cell, (y + 0.5) * cell);
    c2d.stroke();
    // tường
    c2d.strokeStyle = '#5d5370';
    c2d.lineWidth = Math.max(3, cell * 0.09);
    c2d.lineCap = 'round';
    c2d.beginPath();
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        const px = x * cell;
        const py = y * cell;
        if (!canGo(maze, x, y, 'N')) { c2d.moveTo(px, py); c2d.lineTo(px + cell, py); }
        if (!canGo(maze, x, y, 'W')) { c2d.moveTo(px, py); c2d.lineTo(px, py + cell); }
      }
    }
    c2d.moveTo(0, 640); c2d.lineTo(640, 640);
    c2d.moveTo(640, 0); c2d.lineTo(640, 640);
    c2d.stroke();
    // phô mai + chuột
    c2d.font = `${cell * 0.62}px sans-serif`;
    c2d.textAlign = 'center';
    c2d.textBaseline = 'middle';
    c2d.fillText('🧀', (n - 0.5) * cell, (n - 0.45) * cell);
    c2d.fillText('🐭', (mouse.x + 0.5) * cell, (mouse.y + 0.45) * cell);
  };

  const tryStep = (tx, ty) => {
    // đi từng bước về phía ô con trỏ, tôn trọng tường
    for (let guard = 0; guard < 4; guard++) {
      if (done || (mouse.x === tx && mouse.y === ty)) return;
      const dx = Math.sign(tx - mouse.x);
      const dy = Math.sign(ty - mouse.y);
      let moved = false;
      const tryDir = (dir, nx, ny) => {
        if (!moved && canGo(maze, mouse.x, mouse.y, dir)) {
          mouse.x = nx; mouse.y = ny; moved = true;
        }
      };
      // ưu tiên trục lệch nhiều hơn
      const firstAxis = Math.abs(tx - mouse.x) >= Math.abs(ty - mouse.y) ? 'x' : 'y';
      const moves = [];
      if (dx) moves.push(['x', dx > 0 ? 'E' : 'W', mouse.x + dx, mouse.y]);
      if (dy) moves.push(['y', dy > 0 ? 'S' : 'N', mouse.x, mouse.y + dy]);
      moves.sort((a, b) => (a[0] === firstAxis ? -1 : 1) - (b[0] === firstAxis ? -1 : 1));
      for (const [, dir, nx, ny] of moves) tryDir(dir, nx, ny);
      if (!moved) return;
      const last = trail[trail.length - 2];
      if (last && last[0] === mouse.x && last[1] === mouse.y) trail.pop(); // quay lui: rút vệt
      else trail.push([mouse.x, mouse.y]);
      if (mouse.x === n - 1 && mouse.y === n - 1) {
        done = true;
        draw();
        sfx.match(3);
        setTimeout(() => win(
          `🐭 ${t('tuduy.maze.win', 'tìm được')} 🧀!`,
          10 + n,
          'Giỏi quá! Chuột tìm được phô mai rồi!',
        ), 400);
        return;
      }
    }
  };

  let dragging = false;
  // Đo rect() 1 lần lúc pointerdown + gom pointermove qua rAF, tránh layout
  // thrashing và vẽ lại nhiều hơn tốc độ khung hình thật sự cần.
  let mazeRect = null;
  let pendingCell = null;
  let rafMaze = false;
  const toCell = (e) => {
    return [
      Math.max(0, Math.min(n - 1, Math.floor(((e.clientX - mazeRect.left) / mazeRect.width) * n))),
      Math.max(0, Math.min(n - 1, Math.floor(((e.clientY - mazeRect.top) / mazeRect.height) * n))),
    ];
  };
  canvas.addEventListener('pointerdown', (e) => {
    dragging = true;
    mazeRect = canvas.getBoundingClientRect();
    tryStep(...toCell(e));
    draw();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    pendingCell = toCell(e);
    if (!rafMaze) {
      rafMaze = true;
      requestAnimationFrame(() => {
        rafMaze = false;
        if (pendingCell) { tryStep(...pendingCell); pendingCell = null; draw(); }
      });
    }
  });
  canvas.addEventListener('pointerup', () => { dragging = false; });

  els.subLine.textContent = t('tuduy.maze.hint', 'Rê tay dắt chuột 🐭 đến miếng phô mai 🧀');
  sayInstruction('Dắt chuột đến miếng phô mai nhé!');
  draw();
  state.ctx.maze = { maze, mouse, tryStep: (x, y) => { tryStep(x, y); draw(); } };
}

/* ===== 2. Sudoku bé ===== */

const SD_SYMBOLS = ['🐱', '🐶', '🐔', '🐟', '🐰', '🐸'];

function startSudoku() {
  const ctx = state.ctx;
  ctx.sdSize = ctx.sdSize ?? 4;

  const row = document.createElement('div');
  row.className = 'pick-row';
  for (const size of [4, 6]) {
    const btn = document.createElement('button');
    btn.className = `pick-btn${size === ctx.sdSize ? ' active' : ''}`;
    btn.textContent = `${size}×${size}`;
    btn.addEventListener('click', () => { ctx.sdSize = size; startGame('sudoku'); });
    row.appendChild(btn);
  }
  els.play.appendChild(row);

  const { size, solution, puzzle } = makeSudoku(ctx.sdSize);
  const boxH = 2;
  const boxW = size === 4 ? 2 : 3;
  let selected = 1;
  let remaining = puzzle.filter((v) => v === 0).length;

  const grid = document.createElement('div');
  grid.className = 'sudoku-grid';
  grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  grid.style.width = `min(100%, ${size === 4 ? 340 : 420}px)`;
  const cells = [];
  puzzle.forEach((v, i) => {
    const r = Math.floor(i / size);
    const c = i % size;
    const cellBtn = document.createElement('button');
    cellBtn.className = `sd-cell${v ? ' given' : ''}`
      + `${(r + 1) % boxH === 0 && r !== size - 1 ? ' box-b' : ''}`
      + `${(c + 1) % boxW === 0 && c !== size - 1 ? ' box-r' : ''}`;
    cellBtn.textContent = v ? SD_SYMBOLS[v - 1] : '';
    cellBtn.addEventListener('click', () => {
      if (puzzle[i] !== 0 || cellBtn.classList.contains('filled')) return;
      if (solution[i] === selected) {
        cellBtn.textContent = SD_SYMBOLS[selected - 1];
        cellBtn.classList.add('filled');
        sfx.match(1);
        remaining--;
        if (remaining === 0) {
          win(t('tuduy.sudoku.win', 'Giải xong sudoku!'), size * 10, 'Giỏi quá! Giải xong rồi!');
        }
      } else {
        shakeEl(cellBtn);
      }
    });
    grid.appendChild(cellBtn);
    cells.push(cellBtn);
  });
  els.play.appendChild(grid);

  const palette = document.createElement('div');
  palette.className = 'palette';
  for (let v = 1; v <= size; v++) {
    const btn = document.createElement('button');
    btn.className = `pal-btn${v === selected ? ' active' : ''}`;
    btn.textContent = SD_SYMBOLS[v - 1];
    btn.addEventListener('click', () => {
      selected = v;
      sfx.select();
      palette.querySelectorAll('.pal-btn').forEach((b, i) => b.classList.toggle('active', i === v - 1));
    });
    palette.appendChild(btn);
  }
  els.play.appendChild(palette);

  els.subLine.textContent = t('tuduy.sudoku.hint', 'Mỗi hàng, cột, ô vuông: mỗi con vật đúng 1 lần');
  sayInstruction('Chọn con vật rồi đặt vào ô trống nhé!');
  state.ctx.sudoku = { size, solution, puzzle, cells, setSelected: (v) => { selected = v; } };
}

/* ===== 3. Tìm điểm khác nhau ===== */

function startSpot() {
  const pool = ALL_ITEMS.map((it) => it.emoji).slice(0, 24);
  const q = makeSpotDiff(pool, 4, 4);
  let found = 0;

  const wrap = document.createElement('div');
  wrap.className = 'spot-wrap';
  const grids = [q.left, q.right].map((sideCells) => {
    const g = document.createElement('div');
    g.className = 'spot-grid';
    g.style.gridTemplateColumns = 'repeat(4, 1fr)';
    sideCells.forEach((emoji, i) => {
      const cellBtn = document.createElement('button');
      cellBtn.className = 'spot-cell';
      cellBtn.textContent = emoji;
      cellBtn.addEventListener('click', () => {
        if (cellBtn.classList.contains('found')) return;
        if (q.diffs.has(i)) {
          for (const side of grids) side.children[i].classList.add('found');
          sfx.match(2);
          found++;
          els.subLine.innerHTML = `${t('tuduy.spot.hint', 'Tìm chỗ khác nhau')}: <b>${found}/4</b>`;
          if (found === 4) win(t('tuduy.spot.win', 'Tinh mắt quá!'), 40, 'Giỏi quá! Tinh mắt lắm!');
        } else {
          shakeEl(cellBtn);
        }
      });
      g.appendChild(cellBtn);
    });
    return g;
  });
  wrap.append(...grids);
  els.play.appendChild(wrap);
  els.subLine.innerHTML = `${t('tuduy.spot.hint', 'Tìm chỗ khác nhau')}: <b>0/4</b>`;
  sayInstruction('Hai bức tranh có 4 chỗ khác nhau. Tìm đi nào!');
  state.ctx.spot = { q, grids };
}

/* ===== 4. Nối số thành hình ===== */

function startDots() {
  const shape = DOT_SHAPES[Math.floor(Math.random() * DOT_SHAPES.length)];
  const canvas = document.createElement('canvas');
  canvas.className = 'board-canvas';
  canvas.width = 640;
  canvas.height = 640;
  els.play.appendChild(canvas);

  const pts = shape.points.map(([x, y]) => [64 + x * 5.12, 64 + y * 5.12]);
  let next = 0;
  const c2d = canvas.getContext('2d');

  const draw = () => {
    c2d.clearRect(0, 0, 640, 640);
    // đường đã nối
    c2d.strokeStyle = '#c2410c';
    c2d.lineWidth = 6;
    c2d.lineCap = 'round';
    c2d.lineJoin = 'round';
    if (next > 1) {
      c2d.beginPath();
      c2d.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < next; i++) c2d.lineTo(pts[i][0], pts[i][1]);
      if (next === pts.length) c2d.closePath();
      c2d.stroke();
    }
    if (next === pts.length) {
      c2d.fillStyle = 'rgba(255, 200, 130, 0.4)';
      c2d.fill();
      c2d.font = '90px sans-serif';
      c2d.textAlign = 'center';
      c2d.fillText(shape.emoji, 320, 340);
      return;
    }
    // các chấm số
    pts.forEach(([x, y], i) => {
      c2d.beginPath();
      c2d.arc(x, y, 19, 0, Math.PI * 2);
      c2d.fillStyle = i < next ? '#15803d' : i === next ? '#c2410c' : '#fff';
      c2d.fill();
      c2d.lineWidth = 3;
      c2d.strokeStyle = i < next ? '#15803d' : '#c2410c';
      c2d.stroke();
      c2d.fillStyle = i <= next ? '#fff' : '#241e2e';
      c2d.font = '900 17px Arial';
      c2d.textAlign = 'center';
      c2d.textBaseline = 'middle';
      c2d.fillText(i + 1, x, y + 1);
    });
  };

  canvas.addEventListener('pointerdown', (e) => {
    if (next >= pts.length) return;
    const rect = canvas.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 640;
    const py = ((e.clientY - rect.top) / rect.height) * 640;
    const [tx, ty] = pts[next];
    if (Math.hypot(px - tx, py - ty) < 34) {
      next++;
      sfx.select();
      speak(String(next));
      draw();
      if (next === pts.length) {
        sfx.match(3);
        setTimeout(() => win(
          `${shape.emoji} ${shape.name.toUpperCase()}!`,
          30,
          `Giỏi quá! Ra hình ${shape.name}!`,
        ), 600);
      }
    } else {
      // chạm nhầm chấm khác → rung nhẹ
      const hitOther = pts.some(([x, y], i) => i !== next && Math.hypot(px - x, py - y) < 26);
      if (hitOther) shakeEl(canvas);
    }
  });

  els.subLine.innerHTML = `${t('tuduy.dots.hint', 'Chạm các chấm theo thứ tự')} <b>1 → ${pts.length}</b>`;
  sayInstruction('Chạm các chấm theo thứ tự từ một nhé!');
  draw();
  state.ctx.dots = { shape, pts, getNext: () => next };
}

/* ===== 5. Cái nào khác nhóm? ===== */

const ODD_QUESTIONS = 8;

function startOdd() {
  const ctx = state.ctx;
  ctx.oddIndex = 0;
  ctx.oddFirstTry = 0;
  sayInstruction('Trong các hình, hãy tìm hình nào không cùng nhóm với các hình còn lại!');
  nextOdd();
}

function nextOdd() {
  const ctx = state.ctx;
  els.play.innerHTML = '';
  const q = makeOddOneOut(TOPICS);
  let wrongHere = false;

  els.subLine.innerHTML = `${t('tuduy.odd.hint', 'Cái nào KHÔNG cùng nhóm?')} — <b>${ctx.oddIndex + 1}/${ODD_QUESTIONS}</b>`;
  const grid = document.createElement('div');
  grid.className = 'odd-grid';
  q.items.forEach((item, i) => {
    const card = document.createElement('button');
    card.className = 'odd-card';
    card.textContent = item.emoji;
    card.addEventListener('click', () => {
      if (i !== q.oddIndex) {
        wrongHere = true;
        return shakeEl(card);
      }
      card.classList.add('right');
      sfx.match(2);
      speak(`${item.vi} là ${q.oddTopic.vi}, còn lại là ${q.groupTopic.vi}!`);
      if (!wrongHere) ctx.oddFirstTry++;
      ctx.oddIndex++;
      if (ctx.oddIndex >= ODD_QUESTIONS) {
        setTimeout(() => win(
          `${t('hocvui.right', 'Đúng ngay lần đầu')}: ${ctx.oddFirstTry}/${ODD_QUESTIONS} ⭐`,
          ctx.oddFirstTry * 10,
          'Giỏi quá! Bé phân loại giỏi lắm!',
        ), 1600);
      } else {
        setTimeout(nextOdd, 1700);
      }
      return null;
    });
    grid.appendChild(card);
  });
  els.play.appendChild(grid);
  state.ctx.oddQ = q;
}

/* ===== 6. Tháp Hà Nội: xếp bánh cho gấu ===== */

function startHanoi() {
  const ctx = state.ctx;
  ctx.hanoiN = ctx.hanoiN ?? 3;

  const row = document.createElement('div');
  row.className = 'pick-row';
  for (const n of [3, 4]) {
    const btn = document.createElement('button');
    btn.className = `pick-btn${n === ctx.hanoiN ? ' active' : ''}`;
    btn.textContent = `${n} ${t('tuduy.hanoi.discs', 'tầng bánh')}`;
    btn.addEventListener('click', () => { ctx.hanoiN = n; startGame('hanoi'); });
    row.appendChild(btn);
  }
  els.play.appendChild(row);

  const n = ctx.hanoiN;
  const h = createHanoi(n);
  let from = null;

  const labels = document.createElement('div');
  labels.style.cssText = 'display:flex;width:100%;justify-content:space-around;font-size:1.6rem';
  labels.innerHTML = '<span>🐻</span><span></span><span>🍽️</span>';
  els.play.appendChild(labels);

  const board = document.createElement('div');
  board.className = 'hanoi';
  const pegEls = [0, 1, 2].map(() => {
    const peg = document.createElement('button');
    peg.className = 'peg';
    board.appendChild(peg);
    return peg;
  });
  els.play.appendChild(board);

  const movesLine = document.createElement('div');
  movesLine.className = 'hanoi-moves';
  els.play.appendChild(movesLine);

  const render = () => {
    movesLine.innerHTML = `${t('lathinh.moves', 'Số lượt')}: <b>${h.moves}</b> · ${t('tuduy.hanoi.best', 'ít nhất')}: ${hanoiOptimal(n)}`;
    pegEls.forEach((peg, i) => {
      peg.classList.toggle('sel', from === i);
      peg.innerHTML = '';
      h.pegs[i].forEach((disc, di) => {
        const d = document.createElement('div');
        d.className = 'disc';
        d.style.width = `${30 + disc * 18}%`;
        d.textContent = '🥞';
        if (from === i && di === h.pegs[i].length - 1) d.classList.add('lifted');
        peg.appendChild(d);
      });
    });
  };

  pegEls.forEach((peg, i) => {
    peg.addEventListener('click', () => {
      if (from === null) {
        if (!h.pegs[i].length) return shakeEl(peg);
        from = i;
        sfx.select();
        return render();
      }
      const result = moveHanoi(h, from, i);
      from = null;
      if (result === 'bigOnSmall') {
        shakeEl(peg);
        speak('Bánh to không để lên bánh nhỏ được!');
      }
      render();
      if (isHanoiDone(h)) {
        const stars = h.moves === hanoiOptimal(n) ? 3 : h.moves <= hanoiOptimal(n) * 1.6 ? 2 : 1;
        setTimeout(() => win(
          `${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)} — ${t('lathinh.moves', 'Số lượt')}: ${h.moves}`,
          stars * 10,
          'Giỏi quá! Xếp xong bánh cho gấu rồi!',
        ), 500);
      }
      return null;
    });
  });

  els.subLine.textContent = t('tuduy.hanoi.hint', 'Chuyển cả chồng bánh sang đĩa 🍽️ — bánh to không đè bánh nhỏ');
  sayInstruction('Giúp gấu chuyển chồng bánh sang đĩa bên phải nhé! Bánh to không để lên bánh nhỏ đâu!');
  render();
  state.ctx.hanoi = { h, render, pick: (i) => pegEls[i].click() };
}

const GAMES = {
  maze: startMaze, sudoku: startSudoku, spot: startSpot,
  dots: startDots, odd: startOdd, hanoi: startHanoi,
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
window.__tuduy = { state, startGame, showHome };
