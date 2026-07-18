// Logic 5 trò "Arcade Xưa" (Đợt 4 — arcade cổ điển phức tạp hơn) — thuần,
// nhận rng/thời gian để test tất định. Cùng phong cách tách file với
// tu-duy/ren-tri-nao/van-dong-vui.

function shuffle(arr, rng = Math.random) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ===== 1. Ăn Chấm Né Ma (ghép chữ) — mê cung mở, ăn chữ ĐÚNG THỨ TỰ né ma === */

export const PAC_WORDS = [
  { word: 'CAT', vi: 'con mèo' },
  { word: 'DOG', vi: 'con chó' },
  { word: 'SUN', vi: 'mặt trời' },
  { word: 'STAR', vi: 'ngôi sao' },
  { word: 'BIRD', vi: 'con chim' },
  { word: 'FISH', vi: 'con cá' },
  { word: 'MOON', vi: 'mặt trăng' },
  { word: 'TREE', vi: 'cái cây' },
];

export function pickPacWord(rng = Math.random) {
  return PAC_WORDS[Math.floor(rng() * PAC_WORDS.length)];
}

/** Khởi tạo ván: người chơi giữa bản đồ, chữ của `word` rải ngẫu nhiên (không trùng ô), N ma ở góc. */
export function makePacGame(cols, rows, word, ghostCount = 2, rng = Math.random) {
  const used = new Set();
  const player = { x: Math.floor(cols / 2), y: Math.floor(rows / 2) };
  used.add(`${player.x},${player.y}`);

  const cells = shuffle(
    Array.from({ length: cols * rows }, (_, i) => ({ x: i % cols, y: Math.floor(i / cols) }))
      .filter((p) => !used.has(`${p.x},${p.y}`)),
    rng,
  );
  const letters = [];
  for (let i = 0; i < word.length; i++) {
    const cell = cells[i];
    used.add(`${cell.x},${cell.y}`);
    letters.push({ ch: word[i], x: cell.x, y: cell.y, eaten: false });
  }
  const ghosts = [];
  const corners = [{ x: 0, y: 0 }, { x: cols - 1, y: 0 }, { x: 0, y: rows - 1 }, { x: cols - 1, y: rows - 1 }];
  for (let i = 0; i < ghostCount; i++) ghosts.push({ ...corners[i % corners.length] });

  return {
    cols, rows, word, player, ghosts, letters, nextIndex: 0, over: false, won: false,
  };
}

/** Di chuyển người chơi 1 ô (kẹp biên), rồi kiểm tra ăn chữ + va ma. */
export function movePacPlayer(game, dx, dy) {
  if (game.over) return game;
  const nx = Math.max(0, Math.min(game.cols - 1, game.player.x + dx));
  const ny = Math.max(0, Math.min(game.rows - 1, game.player.y + dy));
  game.player = { x: nx, y: ny };
  const next = game.letters[game.nextIndex];
  if (next && !next.eaten && next.x === nx && next.y === ny) {
    next.eaten = true;
    game.nextIndex++;
    if (game.nextIndex === game.letters.length) { game.over = true; game.won = true; }
  }
  checkPacCaught(game);
  return game;
}

/** Ma bước 1 ô theo hướng đuổi tham lam (ưu tiên trục lệch nhiều hơn) về phía người chơi. */
export function stepGhost(ghost, target, cols, rows) {
  const dx = Math.sign(target.x - ghost.x);
  const dy = Math.sign(target.y - ghost.y);
  const moveX = Math.abs(target.x - ghost.x) >= Math.abs(target.y - ghost.y);
  let nx = ghost.x;
  let ny = ghost.y;
  if (moveX && dx) nx = ghost.x + dx;
  else if (dy) ny = ghost.y + dy;
  else if (dx) nx = ghost.x + dx;
  nx = Math.max(0, Math.min(cols - 1, nx));
  ny = Math.max(0, Math.min(rows - 1, ny));
  return { x: nx, y: ny };
}

export function checkPacCaught(game) {
  if (game.over) return game.over;
  if (game.ghosts.some((g) => g.x === game.player.x && g.y === game.player.y)) {
    game.over = true;
    game.won = false;
  }
  return game.over;
}

/** 1 nhịp: mọi ma bước 1 ô đuổi theo người chơi, rồi kiểm tra va chạm. */
export function tickPacGhosts(game) {
  if (game.over) return game;
  game.ghosts = game.ghosts.map((g) => stepGhost(g, game.player, game.cols, game.rows));
  checkPacCaught(game);
  return game;
}

/* ===== 2. Nhảy Né Chướng Ngại Vật Không Ngừng (Endless Runner) ===== */

/** Chướng ngại vật trôi sang trái theo `speed`; loại bỏ khi ra khỏi màn hình bên trái. */
export function stepObstacles(obstacles, speed) {
  return obstacles.map((o) => ({ ...o, x: o.x - speed })).filter((o) => o.x > -60);
}

export function spawnObstacle(x, rng = Math.random) {
  return { x, width: 18 + Math.floor(rng() * 14) };
}

/** Tốc độ cuộn tăng dần theo điểm, không vượt `max`. */
export function speedForScore(score, base = 4, step = 0.0025, max = 12) {
  return Math.min(max, base + score * step);
}

/** Độ cao nhảy (âm = lên) tại thời điểm t trong tổng thời gian `duration` — parabol, 0 ở 2 đầu. */
export function jumpArc(t, duration = 500, height = 80) {
  if (t <= 0 || t >= duration) return 0;
  const ratio = t / duration;
  return -height * 4 * ratio * (1 - ratio);
}

/** Va chạm kiểu AABB giữa người chơi (đứng trên `groundY`, đã nhảy lệch `jumpOffset`) và 1 chướng ngại vật. */
export function isRunnerHit(playerX, playerW, groundY, playerH, jumpOffset, obstacle, groundTop) {
  const playerTop = groundY - playerH + jumpOffset;
  const obstacleTop = groundTop - 30; // chuong ngai vat cao 30
  const overlapX = playerX + playerW > obstacle.x && playerX < obstacle.x + obstacle.width;
  const overlapY = playerTop + playerH > obstacleTop;
  return overlapX && overlapY;
}

/* ===== 3. Bắn Cá Ăn Xu — cá bơi ngang màn hình, bắn trúng để đổi xu ===== */

export const FISH_VALUES = [1, 1, 2, 2, 3, 5];

export function spawnFish(rows, rowHeight, width, rng = Math.random) {
  const row = Math.floor(rng() * rows);
  const dir = rng() < 0.5 ? 1 : -1;
  const x = dir === 1 ? -40 : width + 40;
  return {
    x,
    y: row * rowHeight + rowHeight / 2,
    dir,
    speed: 1.5 + rng() * 2,
    value: FISH_VALUES[Math.floor(rng() * FISH_VALUES.length)],
  };
}

export function stepFish(fish) {
  return { ...fish, x: fish.x + fish.dir * fish.speed };
}

export const isFishOffscreen = (fish, width) => fish.x < -60 || fish.x > width + 60;

export function isFishHit(fish, x, y, radius = 24) {
  return Math.hypot(fish.x - x, fish.y - y) <= radius;
}

/* ===== 4. Đập Gạch Bóng Nảy (Breakout) ===== */

export function makeBricks(rows, cols) {
  return Array.from({ length: rows * cols }, (_, i) => ({
    alive: true, row: Math.floor(i / cols), col: i % cols,
  }));
}

export function stepBreakoutBall(ball) {
  ball.x += ball.vx;
  ball.y += ball.vy;
}

export function bounceBreakoutWalls(ball, w, r) {
  if (ball.x - r < 0) { ball.x = r; ball.vx = Math.abs(ball.vx); }
  if (ball.x + r > w) { ball.x = w - r; ball.vx = -Math.abs(ball.vx); }
  if (ball.y - r < 0) { ball.y = r; ball.vy = Math.abs(ball.vy); }
}

/** Va chạm vợt: nảy lên + lệch góc theo điểm chạm (giữa vợt = thẳng, mép = lệch mạnh). */
export function hitBreakoutPaddle(ball, paddleX, paddleY, paddleW, r) {
  const withinY = ball.vy > 0 && ball.y + r >= paddleY && ball.y - r <= paddleY + 10;
  const withinX = ball.x >= paddleX - paddleW / 2 && ball.x <= paddleX + paddleW / 2;
  if (!withinY || !withinX) return false;
  const offset = (ball.x - paddleX) / (paddleW / 2);
  ball.vy = -Math.abs(ball.vy);
  ball.vx = offset * 4;
  return true;
}

/** Va chạm 1 viên gạch còn sống (AABB) — vỡ gạch + đảo chiều dọc bóng. */
export function hitBrick(ball, brick, brickX, brickY, brickW, brickH, r) {
  if (!brick.alive) return false;
  const withinX = ball.x + r >= brickX && ball.x - r <= brickX + brickW;
  const withinY = ball.y + r >= brickY && ball.y - r <= brickY + brickH;
  if (!withinX || !withinY) return false;
  brick.alive = false;
  ball.vy = -ball.vy;
  return true;
}

export const countAliveBricks = (bricks) => bricks.filter((b) => b.alive).length;

/* ===== 5. Nối Kẹo Ba (Match-3) ===== */

export const CANDY_TYPES = 5;

function causesInitialMatch(grid, cols, idx, v) {
  const r = Math.floor(idx / cols);
  const c = idx % cols;
  if (c >= 2 && grid[idx - 1] === v && grid[idx - 2] === v) return true;
  if (r >= 2 && grid[idx - cols] === v && grid[idx - cols * 2] === v) return true;
  return false;
}

/** Bàn cờ kẹo ban đầu, đảm bảo KHÔNG có sẵn 3 liên tiếp nào ngay từ đầu. */
export function makeCandyGrid(cols, rows, rng = Math.random) {
  const grid = new Array(cols * rows);
  for (let i = 0; i < grid.length; i++) {
    let v;
    do { v = 1 + Math.floor(rng() * CANDY_TYPES); } while (causesInitialMatch(grid, cols, i, v));
    grid[i] = v;
  }
  return grid;
}

export function areAdjacent(cols, a, b) {
  const ra = Math.floor(a / cols); const ca = a % cols;
  const rb = Math.floor(b / cols); const cb = b % cols;
  return (ra === rb && Math.abs(ca - cb) === 1) || (ca === cb && Math.abs(ra - rb) === 1);
}

export function swapCandies(grid, a, b) {
  const tmp = grid[a];
  grid[a] = grid[b];
  grid[b] = tmp;
}

/** Tìm mọi ô nằm trong 1 dãy ≥3 liên tiếp cùng loại (ngang HOẶC dọc). */
export function findMatches(grid, cols, rows) {
  const matched = new Set();
  for (let r = 0; r < rows; r++) {
    let runStart = 0;
    for (let c = 1; c <= cols; c++) {
      const same = c < cols && grid[r * cols + c] === grid[r * cols + runStart];
      if (!same) {
        if (c - runStart >= 3) for (let k = runStart; k < c; k++) matched.add(r * cols + k);
        runStart = c;
      }
    }
  }
  for (let c = 0; c < cols; c++) {
    let runStart = 0;
    for (let r = 1; r <= rows; r++) {
      const same = r < rows && grid[r * cols + c] === grid[runStart * cols + c];
      if (!same) {
        if (r - runStart >= 3) for (let k = runStart; k < r; k++) matched.add(k * cols + c);
        runStart = r;
      }
    }
  }
  return matched;
}

/** Xoá mọi ô trong `matched` (đặt về 0). @returns số ô đã xoá. */
export function clearMatches(grid, matched) {
  for (const i of matched) grid[i] = 0;
  return matched.size;
}

/** Kẹo phía trên rơi lấp chỗ trống trong từng cột (giống collapseColumns của Đợt 2). */
export function collapseCandyColumns(grid, cols, rows) {
  for (let c = 0; c < cols; c++) {
    const vals = [];
    for (let r = 0; r < rows; r++) {
      const v = grid[r * cols + c];
      if (v) vals.push(v);
    }
    let vi = vals.length - 1;
    for (let r = rows - 1; r >= 0; r--, vi--) {
      grid[r * cols + c] = vi >= 0 ? vals[vi] : 0;
    }
  }
}

/** Lấp mọi ô trống (0) bằng kẹo ngẫu nhiên mới. */
export function refillCandyGrid(grid, rng = Math.random) {
  for (let i = 0; i < grid.length; i++) {
    if (grid[i] === 0) grid[i] = 1 + Math.floor(rng() * CANDY_TYPES);
  }
}
