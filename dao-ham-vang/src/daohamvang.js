// Đào Hầm Vàng: vẽ đường cho viên bóng lăn qua các ô liền kề, thu vàng dọc đường,
// né chướng ngại vật, lăn tới đích trong giới hạn số bước cho phép.
// Toàn bộ file này thuần logic, test được độc lập.

export const ROWS = 7;
export const COLS = 7;

function bfsReachable(grid, start, goal) {
  const rows = grid.length;
  const cols = grid[0].length;
  const seen = new Set([`${start.r},${start.c}`]);
  const queue = [start];
  while (queue.length) {
    const { r, c } = queue.shift();
    if (r === goal.r && c === goal.c) return true;
    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      if (grid[nr][nc] === 'obstacle') continue;
      const key = `${nr},${nc}`;
      if (seen.has(key)) continue;
      seen.add(key);
      queue.push({ r: nr, c: nc });
    }
  }
  return false;
}

function isEndpoint(r, c, start, goal) {
  return (r === start.r && c === start.c) || (r === goal.r && c === goal.c);
}

function tryGenerate(rows, cols, levelIndex, rng) {
  const start = { r: 0, c: 0 };
  const goal = { r: rows - 1, c: cols - 1 };
  const grid = Array.from({ length: rows }, () => Array(cols).fill('empty'));

  const obstacleCount = Math.min(10, 4 + Math.floor(levelIndex / 2));
  let placed = 0;
  let guard = 0;
  while (placed < obstacleCount && guard < 200) {
    guard++;
    const r = Math.floor(rng() * rows);
    const c = Math.floor(rng() * cols);
    if (isEndpoint(r, c, start, goal) || grid[r][c] === 'obstacle') continue;
    grid[r][c] = 'obstacle';
    placed++;
  }

  const coins = new Set();
  const coinCount = Math.min(8, 4 + Math.floor(levelIndex / 3));
  let coinsPlaced = 0;
  guard = 0;
  while (coinsPlaced < coinCount && guard < 200) {
    guard++;
    const r = Math.floor(rng() * rows);
    const c = Math.floor(rng() * cols);
    if (isEndpoint(r, c, start, goal) || grid[r][c] === 'obstacle') continue;
    const key = `${r},${c}`;
    if (coins.has(key)) continue;
    coins.add(key);
    coinsPlaced++;
  }

  return { grid, start, goal, coins };
}

export function makeLevel(levelIndex, rng = Math.random) {
  let result;
  let attempts = 0;
  do {
    result = tryGenerate(ROWS, COLS, levelIndex, rng);
    attempts++;
  } while (!bfsReachable(result.grid, result.start, result.goal) && attempts < 25);
  if (!bfsReachable(result.grid, result.start, result.goal)) {
    // An toàn tuyệt đối: nếu vẫn không tạo được đường đi sau nhiều lần thử, bỏ hết chướng ngại vật.
    result.grid = result.grid.map((row) => row.map(() => 'empty'));
  }
  return {
    level: levelIndex,
    grid: result.grid,
    coins: result.coins,
    collected: new Set(),
    ball: { ...result.start },
    start: result.start,
    goal: result.goal,
    stepsLeft: 16 + Math.min(10, levelIndex),
    over: false,
    won: false,
    allCoins: false,
  };
}

/** Đường vẽ có hợp lệ không: bắt đầu đúng vị trí bóng, các ô liền kề nhau,
 * không đi xuyên chướng ngại vật, không tự cắt lại đường đã đi. */
export function isValidPath(game, path) {
  if (!path.length) return false;
  const [r0, c0] = path[0];
  if (r0 !== game.ball.r || c0 !== game.ball.c) return false;
  const rows = game.grid.length;
  const cols = game.grid[0].length;
  const seen = new Set([`${r0},${c0}`]);
  for (let i = 1; i < path.length; i++) {
    const [pr, pc] = path[i - 1];
    const [r, c] = path[i];
    if (Math.abs(pr - r) + Math.abs(pc - c) !== 1) return false;
    if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
    if (game.grid[r][c] === 'obstacle') return false;
    const key = `${r},${c}`;
    if (seen.has(key)) return false;
    seen.add(key);
  }
  return true;
}

function checkEnd(game) {
  if (game.ball.r === game.goal.r && game.ball.c === game.goal.c) {
    game.over = true;
    game.won = true;
    game.allCoins = game.collected.size === game.coins.size;
    return;
  }
  if (game.stepsLeft <= 0) {
    game.over = true;
    game.won = false;
  }
}

/** Cho bóng lăn theo đường đã vẽ (bị cắt bớt nếu vượt quá số bước còn lại).
 * Trả {moved, coins} nếu hợp lệ, hoặc null nếu đường không hợp lệ / game đã kết thúc. */
export function applyPath(game, path) {
  if (game.over) return null;
  if (!isValidPath(game, path)) return null;
  const totalSteps = path.length - 1;
  if (totalSteps <= 0) return { moved: 0, coins: 0 };
  let coinsGot = 0;
  let used = 0;
  for (let i = 1; i <= totalSteps && used < game.stepsLeft; i++) {
    const [r, c] = path[i];
    game.ball = { r, c };
    used++;
    const key = `${r},${c}`;
    if (game.coins.has(key) && !game.collected.has(key)) {
      game.collected.add(key);
      coinsGot++;
    }
    if (r === game.goal.r && c === game.goal.c) break;
  }
  game.stepsLeft -= used;
  checkEnd(game);
  return { moved: used, coins: coinsGot };
}
