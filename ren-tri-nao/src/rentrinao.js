// Logic 5 trò "Rèn Trí Não" (Đợt 2 — game trí nhớ/tư duy hồi xưa) — thuần,
// nhận rng để test tất định. Cùng phong cách tách file với tu-duy/src/tuduy.js.

function shuffle(arr, rng = Math.random) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ===== 1. Simon Nhớ Màu/Số — lặp lại đúng chuỗi ngày càng dài ===== */

export const SIMON_COLORS = ['red', 'blue', 'green', 'yellow'];

/** Thêm 1 bước ngẫu nhiên vào chuỗi Simon. */
export function nextSimonStep(seq, rng = Math.random) {
  return [...seq, Math.floor(rng() * SIMON_COLORS.length)];
}

/**
 * So khớp phần bé đã bấm (`input`) với chuỗi máy ra (`seq`).
 * @returns {'ok'|'wrong'|'complete'} ok = đúng tới giờ (chưa hết), wrong = sai,
 * complete = đúng hết toàn bộ chuỗi hiện tại.
 */
export function checkSimonInput(seq, input) {
  for (let i = 0; i < input.length; i++) {
    if (input[i] !== seq[i]) return 'wrong';
  }
  return input.length === seq.length ? 'complete' : 'ok';
}

/* ===== 2. Ghép Số 2048 — trượt/gộp kiểu cổ điển ===== */

export function makeGrid2048(n = 4) {
  return new Array(n * n).fill(0);
}

export function getRow2048(grid, n, r) {
  return Array.from({ length: n }, (_, c) => grid[r * n + c]);
}
export function getCol2048(grid, n, c) {
  return Array.from({ length: n }, (_, r) => grid[r * n + c]);
}
function setRow2048(grid, n, r, row) { row.forEach((v, c) => { grid[r * n + c] = v; }); }
function setCol2048(grid, n, c, col) { col.forEach((v, r) => { grid[r * n + c] = v; }); }

/** Trượt+gộp 1 hàng về bên TRÁI. @returns {{row, gained, moved}} */
export function slideMergeRow(row) {
  const nums = row.filter((v) => v !== 0);
  const merged = [];
  let gained = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i < nums.length - 1 && nums[i] === nums[i + 1]) {
      const v = nums[i] * 2;
      merged.push(v);
      gained += v;
      i++;
    } else {
      merged.push(nums[i]);
    }
  }
  while (merged.length < row.length) merged.push(0);
  const moved = merged.some((v, i) => v !== row[i]);
  return { row: merged, gained, moved };
}

/** Sinh thêm 1 ô mới (90% ra 2, 10% ra 4) vào 1 ô trống ngẫu nhiên. */
export function spawnTile2048(grid, rng = Math.random) {
  const empties = [];
  grid.forEach((v, i) => { if (v === 0) empties.push(i); });
  if (!empties.length) return grid;
  const idx = empties[Math.floor(rng() * empties.length)];
  grid[idx] = rng() < 0.9 ? 2 : 4;
  return grid;
}

/** Di chuyển toàn bàn theo 1 hướng, tự sinh ô mới nếu có di chuyển. */
export function move2048(grid, n, dir, rng = Math.random) {
  const newGrid = grid.slice();
  let moved = false;
  let gained = 0;
  const isHorizontal = dir === 'left' || dir === 'right';
  const reversed = dir === 'right' || dir === 'down';
  for (let i = 0; i < n; i++) {
    let line = isHorizontal ? getRow2048(newGrid, n, i) : getCol2048(newGrid, n, i);
    if (reversed) line = line.slice().reverse();
    const res = slideMergeRow(line);
    let finalLine = res.row;
    if (reversed) finalLine = finalLine.slice().reverse();
    if (isHorizontal) setRow2048(newGrid, n, i, finalLine);
    else setCol2048(newGrid, n, i, finalLine);
    if (res.moved) moved = true;
    gained += res.gained;
  }
  if (moved) spawnTile2048(newGrid, rng);
  return { grid: newGrid, moved, gained };
}

/** Còn nước đi không (còn ô trống HOẶC còn 2 ô kề bằng nhau)? */
export function canMove2048(grid, n) {
  if (grid.some((v) => v === 0)) return true;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const v = grid[r * n + c];
      if (c < n - 1 && grid[r * n + c + 1] === v) return true;
      if (r < n - 1 && grid[(r + 1) * n + c] === v) return true;
    }
  }
  return false;
}

export const has2048 = (grid) => grid.some((v) => v >= 2048);

/* ===== 3. Lật Bài Nhớ Hình Nâng Cấp — lật đúng cặp, hiện thêm từ+nghĩa ===== */

export const MEMORY_WORDS = [
  { emoji: '🍎', en: 'Apple', vi: 'quả táo' },
  { emoji: '🐶', en: 'Dog', vi: 'con chó' },
  { emoji: '🐱', en: 'Cat', vi: 'con mèo' },
  { emoji: '🚗', en: 'Car', vi: 'xe hơi' },
  { emoji: '🌸', en: 'Flower', vi: 'bông hoa' },
  { emoji: '⭐', en: 'Star', vi: 'ngôi sao' },
  { emoji: '🐟', en: 'Fish', vi: 'con cá' },
  { emoji: '🎈', en: 'Balloon', vi: 'bóng bay' },
  { emoji: '🍌', en: 'Banana', vi: 'quả chuối' },
  { emoji: '☀️', en: 'Sun', vi: 'mặt trời' },
  { emoji: '🐰', en: 'Rabbit', vi: 'con thỏ' },
  { emoji: '🍦', en: 'Ice cream', vi: 'kem' },
];

/** Bộ bài `pairCount` cặp, đã xáo, mỗi lá có `id` riêng + `key` để so khớp. */
export function makeMemoryDeck(pairCount, rng = Math.random) {
  const picked = shuffle(MEMORY_WORDS, rng).slice(0, pairCount);
  const doubled = [...picked, ...picked];
  return shuffle(doubled, rng).map((w, id) => ({ id, key: w.emoji, ...w }));
}

export const isMemoryMatch = (a, b) => a.key === b.key;

/* ===== 4. Bi-a Lỗ Mini — vật lý va chạm/nảy tường đơn giản ===== */

export const BILLIARD_FRICTION = 0.985;
export const BILLIARD_MIN_SPEED = 0.05;

/** 1 bước mô phỏng: di chuyển theo vận tốc rồi giảm dần do ma sát. */
export function stepBall(ball) {
  ball.x += ball.vx;
  ball.y += ball.vy;
  ball.vx *= BILLIARD_FRICTION;
  ball.vy *= BILLIARD_FRICTION;
  if (Math.hypot(ball.vx, ball.vy) < BILLIARD_MIN_SPEED) { ball.vx = 0; ball.vy = 0; }
}

/** Nảy lại khi chạm 4 cạnh bàn (không tính lỗ — lỗ được cắt riêng ở góc/giữa). */
export function wallBounce(ball, w, h, r) {
  if (ball.x - r < 0) { ball.x = r; ball.vx = Math.abs(ball.vx); }
  if (ball.x + r > w) { ball.x = w - r; ball.vx = -Math.abs(ball.vx); }
  if (ball.y - r < 0) { ball.y = r; ball.vy = Math.abs(ball.vy); }
  if (ball.y + r > h) { ball.y = h - r; ball.vy = -Math.abs(ball.vy); }
}

export function ballsOverlap(a, b, r) {
  const dist = Math.hypot(b.x - a.x, b.y - a.y);
  return dist < r * 2 && dist > 0;
}

/** Va chạm đàn hồi 2 bi cùng khối lượng: tách nhau ra + hoán đổi vận tốc theo pháp tuyến. */
export function resolveCollision(a, b, r) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy) || 0.001;
  const nx = dx / dist;
  const ny = dy / dist;
  const overlap = r * 2 - dist;
  a.x -= (nx * overlap) / 2; a.y -= (ny * overlap) / 2;
  b.x += (nx * overlap) / 2; b.y += (ny * overlap) / 2;
  const avn = a.vx * nx + a.vy * ny;
  const bvn = b.vx * nx + b.vy * ny;
  a.vx += (bvn - avn) * nx; a.vy += (bvn - avn) * ny;
  b.vx += (avn - bvn) * nx; b.vy += (avn - bvn) * ny;
}

export function isPocketed(ball, pockets) {
  return pockets.some((p) => Math.hypot(ball.x - p.x, ball.y - p.y) < p.r);
}

export const allStopped = (balls) => balls.every((b) => b.vx === 0 && b.vy === 0);

/* ===== 5. Ghép Khối Rơi Theo Nhóm — thả khối màu, gom ≥3 khối liền màu ===== */

export const BLOCK_COLORS = 5;

export function makeEmptyGrid(cols, rows) {
  return new Array(cols * rows).fill(0);
}

/** Thả 1 khối màu vào cột `col`, rơi xuống ô trống thấp nhất. */
export function dropBlock(grid, cols, rows, col, color) {
  for (let r = rows - 1; r >= 0; r--) {
    const idx = r * cols + col;
    if (grid[idx] === 0) {
      grid[idx] = color;
      return { row: r, landed: true };
    }
  }
  return { row: -1, landed: false };
}

/** Tìm nhóm khối liền màu (4 hướng) chứa ô `idx` bằng flood-fill. */
export function findGroup(grid, cols, rows, idx) {
  const color = grid[idx];
  if (!color) return [];
  const seen = new Set();
  const stack = [idx];
  const group = [];
  while (stack.length) {
    const i = stack.pop();
    if (seen.has(i) || grid[i] !== color) continue;
    seen.add(i);
    group.push(i);
    const r = Math.floor(i / cols);
    const c = i % cols;
    if (r > 0) stack.push(i - cols);
    if (r < rows - 1) stack.push(i + cols);
    if (c > 0) stack.push(i - 1);
    if (c < cols - 1) stack.push(i + 1);
  }
  return group;
}

/** Xoá mọi nhóm ≥ minGroup khối liền màu. @returns số ô đã xoá. */
export function clearGroups(grid, cols, rows, minGroup = 3) {
  const cleared = new Set();
  const visited = new Set();
  for (let i = 0; i < grid.length; i++) {
    if (!grid[i] || visited.has(i)) continue;
    const group = findGroup(grid, cols, rows, i);
    group.forEach((g) => visited.add(g));
    if (group.length >= minGroup) group.forEach((g) => cleared.add(g));
  }
  cleared.forEach((i) => { grid[i] = 0; });
  return cleared.size;
}

/** Sau khi xoá, cho các khối phía trên rơi lấp chỗ trống trong từng cột. */
export function collapseColumns(grid, cols, rows) {
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

export const isColumnFull = (grid, cols, col) => grid[col] !== 0; // hàng 0 = trên cùng
export const randomColor = (rng = Math.random) => 1 + Math.floor(rng() * BLOCK_COLORS);
