// Vị Vua Vàng: đổi chỗ 2 hũ vàng liền kề để tạo hàng ≥3 hũ cùng màu — kiểu "nối màu"
// match-3 kinh điển (thể loại chung, không liên quan tới game thương mại nào cụ thể).
// Toàn bộ file này thuần logic, test được độc lập.

export const COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
export const ROWS = 8;
export const COLS = 8;

function pick(palette, rng) {
  return palette[Math.floor(rng() * palette.length)];
}

/** Dựng bàn mới, đảm bảo KHÔNG có hàng ≥3 hũ cùng màu sẵn có (tránh ăn điểm miễn phí). */
export function makeGrid(rows, cols, numColors, rng = Math.random) {
  const palette = COLORS.slice(0, numColors);
  const grid = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      let color;
      let guard = 0;
      do {
        color = pick(palette, rng);
        guard++;
      } while (
        guard < 50
        && ((c >= 2 && row[c - 1] === color && row[c - 2] === color)
          || (r >= 2 && grid[r - 1][c] === color && grid[r - 2][c] === color))
      );
      row.push(color);
    }
    grid.push(row);
  }
  return grid;
}

/** Tìm mọi ô nằm trong 1 hàng ngang hoặc dọc ≥3 hũ cùng màu liên tiếp. */
export function findMatches(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const matched = new Set();

  for (let r = 0; r < rows; r++) {
    let run = 1;
    for (let c = 1; c <= cols; c++) {
      const same = c < cols && grid[r][c] != null && grid[r][c] === grid[r][c - 1];
      if (same) { run++; continue; }
      if (run >= 3) for (let k = 0; k < run; k++) matched.add(`${r},${c - 1 - k}`);
      run = 1;
    }
  }
  for (let c = 0; c < cols; c++) {
    let run = 1;
    for (let r = 1; r <= rows; r++) {
      const same = r < rows && grid[r][c] != null && grid[r][c] === grid[r - 1][c];
      if (same) { run++; continue; }
      if (run >= 3) for (let k = 0; k < run; k++) matched.add(`${r - 1 - k},${c}`);
      run = 1;
    }
  }
  return [...matched].map((s) => s.split(',').map(Number));
}

export function isAdjacent(r1, c1, r2, c2) {
  return (Math.abs(r1 - r2) === 1 && c1 === c2) || (Math.abs(c1 - c2) === 1 && r1 === r2);
}

export function swapCells(grid, r1, c1, r2, c2) {
  const tmp = grid[r1][c1];
  grid[r1][c1] = grid[r2][c2];
  grid[r2][c2] = tmp;
}

function applyGravity(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  for (let c = 0; c < cols; c++) {
    let write = rows - 1;
    for (let r = rows - 1; r >= 0; r--) {
      if (grid[r][c] != null) {
        grid[write][c] = grid[r][c];
        if (write !== r) grid[r][c] = null;
        write--;
      }
    }
    for (let r = write; r >= 0; r--) grid[r][c] = null;
  }
}

function refill(grid, palette, rng) {
  const rows = grid.length;
  const cols = grid[0].length;
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      if (grid[r][c] == null) grid[r][c] = pick(palette, rng);
    }
  }
}

/** Điểm cho 1 đợt khớp: cụm càng lớn + combo dây chuyền càng cao thì điểm càng nhiều. */
export function matchScore(n, combo = 1) {
  return Math.round(10 * n * combo);
}

/** Xử lý tất cả các đợt khớp dây chuyền (rơi xuống có thể tạo khớp mới) cho tới khi bàn ổn định. */
export function resolveCascades(grid, palette, rng = Math.random) {
  let score = 0;
  let cleared = 0;
  let combo = 0;
  let matches = findMatches(grid);
  while (matches.length) {
    combo++;
    cleared += matches.length;
    score += matchScore(matches.length, combo);
    for (const [r, c] of matches) grid[r][c] = null;
    applyGravity(grid);
    refill(grid, palette, rng);
    matches = findMatches(grid);
  }
  return { score, cleared, combo };
}

/** Còn nước đi hợp lệ không (tồn tại 1 cặp liền kề mà đổi chỗ sẽ tạo khớp)? */
export function hasAnyMove(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (c + 1 < cols) {
        swapCells(grid, r, c, r, c + 1);
        const ok = findMatches(grid).length > 0;
        swapCells(grid, r, c, r, c + 1);
        if (ok) return true;
      }
      if (r + 1 < rows) {
        swapCells(grid, r, c, r + 1, c);
        const ok = findMatches(grid).length > 0;
        swapCells(grid, r, c, r + 1, c);
        if (ok) return true;
      }
    }
  }
  return false;
}

function reshuffleNoMatches(grid, palette, rng) {
  const rows = grid.length;
  const cols = grid[0].length;
  let tries = 0;
  do {
    const fresh = makeGrid(rows, cols, palette.length, rng);
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) grid[r][c] = fresh[r][c];
    tries++;
  } while (!hasAnyMove(grid) && tries < 20);
}

export function makeLevel(levelIndex, rng = Math.random) {
  const numColors = Math.min(COLORS.length, 4 + Math.floor(levelIndex / 3));
  const palette = COLORS.slice(0, numColors);
  const grid = makeGrid(ROWS, COLS, numColors, rng);
  if (!hasAnyMove(grid)) reshuffleNoMatches(grid, palette, rng);
  return {
    level: levelIndex,
    grid,
    palette,
    goal: 300 + levelIndex * 130,
    movesLeft: 18,
    score: 0,
    over: false,
    won: false,
  };
}

function checkEnd(game) {
  if (game.score >= game.goal) { game.over = true; game.won = true; return; }
  if (game.movesLeft <= 0) { game.over = true; game.won = false; }
}

/** Thử đổi chỗ 2 hũ liền kề. Trả:
 *  - null nếu 2 ô không liền kề hoặc game đã kết thúc (không tốn nước đi),
 *  - {valid:false} nếu đổi chỗ không tạo được hàng nào (đã tự hoàn tác),
 *  - {valid:true, score, cleared, combo} nếu hợp lệ (đã xử lý dây chuyền, trừ nước đi). */
export function attemptSwap(game, r1, c1, r2, c2, rng = Math.random) {
  if (game.over) return null;
  if (!isAdjacent(r1, c1, r2, c2)) return null;
  swapCells(game.grid, r1, c1, r2, c2);
  if (!findMatches(game.grid).length) {
    swapCells(game.grid, r1, c1, r2, c2); // không tạo hàng nào → hoàn tác
    return { valid: false };
  }
  const result = resolveCascades(game.grid, game.palette, rng);
  game.score += result.score;
  game.movesLeft--;
  if (!hasAnyMove(game.grid)) reshuffleNoMatches(game.grid, game.palette, rng);
  checkEnd(game);
  return { valid: true, ...result };
}
