// Đập Vàng: đập vỡ cụm đá màu (≥2 viên liền kề cùng màu) để ăn điểm —
// cụm càng lớn càng nhiều điểm. Kiểu chơi cổ điển "nối màu", không liên quan
// tới bất kỳ game thương mại nào. Toàn bộ file này thuần logic, test được độc lập.

export const COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
export const ROWS = 8;
export const COLS = 7;

export function makeGrid(rows, cols, numColors, rng = Math.random) {
  const palette = COLORS.slice(0, numColors);
  const grid = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) row.push(palette[Math.floor(rng() * palette.length)]);
    grid.push(row);
  }
  return grid;
}

/** Tìm cụm đá cùng màu liền kề (4 hướng) chứa ô (r,c), kể cả khi cụm chỉ có 1 viên. */
export function findCluster(grid, r, c) {
  const rows = grid.length;
  const cols = grid[0].length;
  const color = grid[r]?.[c];
  if (!color) return [];
  const seen = new Set();
  const stack = [[r, c]];
  const out = [];
  while (stack.length) {
    const [cr, cc] = stack.pop();
    const key = `${cr},${cc}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (cr < 0 || cr >= rows || cc < 0 || cc >= cols) continue;
    if (grid[cr][cc] !== color) continue;
    out.push([cr, cc]);
    stack.push([cr - 1, cc], [cr + 1, cc], [cr, cc - 1], [cr, cc + 1]);
  }
  return out;
}

/** Cụm càng lớn, điểm/viên càng cao (thưởng cho việc dồn cụm to). */
export function clusterScore(n) {
  return n >= 2 ? 5 * n * n : 0;
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
      if (grid[r][c] == null) grid[r][c] = palette[Math.floor(rng() * palette.length)];
    }
  }
}

/** Đập cụm tại (r,c): xoá cụm, đá phía trên rơi xuống lấp chỗ trống, đá mới rơi vào từ trên.
 * Trả về {popped, score} nếu đập được (cụm ≥2), hoặc null nếu cụm quá nhỏ (không đập được). */
export function popAt(grid, palette, r, c, rng = Math.random) {
  const cluster = findCluster(grid, r, c);
  if (cluster.length < 2) return null;
  for (const [cr, cc] of cluster) grid[cr][cc] = null;
  applyGravity(grid);
  refill(grid, palette, rng);
  return { popped: cluster.length, score: clusterScore(cluster.length) };
}

/** Còn nước đi hợp lệ không (còn ≥1 cặp đá cùng màu liền kề)? */
export function hasValidMove(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const color = grid[r][c];
      if (color == null) continue;
      if (grid[r][c + 1] === color || grid[r + 1]?.[c] === color) return true;
    }
  }
  return false;
}

function reshuffle(grid, palette, rng) {
  const rows = grid.length;
  const cols = grid[0].length;
  let tries = 0;
  do {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) grid[r][c] = palette[Math.floor(rng() * palette.length)];
    }
    tries++;
  } while (!hasValidMove(grid) && tries < 30);
}

export function makeLevel(levelIndex, rng = Math.random) {
  const numColors = Math.min(COLORS.length, 4 + Math.floor(levelIndex / 3));
  const palette = COLORS.slice(0, numColors);
  const grid = makeGrid(ROWS, COLS, numColors, rng);
  if (!hasValidMove(grid)) reshuffle(grid, palette, rng);
  return {
    level: levelIndex,
    grid,
    palette,
    goal: 250 + levelIndex * 120,
    movesLeft: 20,
    score: 0,
    over: false,
    won: false,
  };
}

function checkEnd(game) {
  if (game.score >= game.goal) { game.over = true; game.won = true; return; }
  if (game.movesLeft <= 0) { game.over = true; game.won = false; }
}

/** Đập cụm tại (r,c) trong ván đang chơi. Trả {popped, score} hoặc null nếu không đập được. */
export function pop(game, r, c, rng = Math.random) {
  if (game.over) return null;
  const result = popAt(game.grid, game.palette, r, c, rng);
  if (!result) return null;
  game.score += result.score;
  game.movesLeft--;
  if (!hasValidMove(game.grid)) reshuffle(game.grid, game.palette, rng);
  checkEnd(game);
  return result;
}
