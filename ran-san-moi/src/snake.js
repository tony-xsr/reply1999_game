// Logic Rắn săn mồi — thuần, không dính DOM, nhận rng để test tất định.
// 3 chế độ: classic (ăn 🍎), abc (ăn chữ A→Z theo thứ tự), num (ăn số 1→9).
// Luật cho bé: đi xuyên tường (wrap), ăn nhầm chữ/số chỉ bị rắn ngắn đi 1 đốt.

export const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
export const NUMS = '123456789'.split('');

export const MODE_SEQ = { abc: ABC, num: NUMS };
const DECOYS = 2; // số mồi "nhiễu" trong chế độ học

/** Tạo ván mới. */
export function createGame(mode = 'classic', cols = 17, rows = 15, rng = Math.random) {
  const cy = Math.floor(rows / 2);
  const game = {
    mode, cols, rows, rng,
    snake: [{ x: 5, y: cy }, { x: 4, y: cy }, { x: 3, y: cy }], // đầu ở phần tử 0
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    foods: [],          // [{x, y, label}]
    seqIdx: 0,          // vị trí trong dãy A→Z / 1→9
    score: 0,
    alive: true,
    won: false,
    ateWrong: 0,
  };
  spawnFoods(game);
  return game;
}

export function targetLabel(game) {
  const seq = MODE_SEQ[game.mode];
  return seq ? seq[game.seqIdx] : '🍎';
}

function freeCell(game) {
  const { rng } = game;
  for (let tries = 0; tries < 500; tries++) {
    const x = Math.floor(rng() * game.cols);
    const y = Math.floor(rng() * game.rows);
    if (game.snake.some((s) => s.x === x && s.y === y)) continue;
    if (game.foods.some((f) => f.x === x && f.y === y)) continue;
    return { x, y };
  }
  return null;
}

/** Đặt mồi: classic 1 quả táo; chế độ học = mục tiêu + 2 mồi nhiễu kế tiếp trong dãy. */
export function spawnFoods(game) {
  game.foods = [];
  const seq = MODE_SEQ[game.mode];
  if (!seq) {
    const c = freeCell(game);
    if (c) game.foods.push({ ...c, label: '🍎' });
    return;
  }
  const labels = [seq[game.seqIdx]];
  for (let i = 1; i <= DECOYS; i++) {
    labels.push(seq[(game.seqIdx + i) % seq.length]);
  }
  for (const label of labels) {
    const c = freeCell(game);
    if (c) game.foods.push({ ...c, label });
  }
}

/** Đổi hướng (chặn quay đầu 180°). */
export function turn(game, dir) {
  if (dir.x === -game.dir.x && dir.y === -game.dir.y) return;
  game.nextDir = dir;
}

/**
 * Một nhịp đi. @returns {'move'|'eat'|'wrong'|'dead'|'win'}
 */
export function step(game) {
  if (!game.alive || game.won) return 'dead';
  game.dir = game.nextDir;
  const head = game.snake[0];
  const nx = (head.x + game.dir.x + game.cols) % game.cols; // xuyên tường
  const ny = (head.y + game.dir.y + game.rows) % game.rows;

  // Tự cắn thân (trừ đuôi sắp rời đi) → thua
  if (game.snake.some((s, i) => i < game.snake.length - 1 && s.x === nx && s.y === ny)) {
    game.alive = false;
    return 'dead';
  }

  game.snake.unshift({ x: nx, y: ny });
  const foodIdx = game.foods.findIndex((f) => f.x === nx && f.y === ny);

  if (foodIdx < 0) {
    game.snake.pop();
    return 'move';
  }

  const food = game.foods[foodIdx];
  const seq = MODE_SEQ[game.mode];

  if (!seq) { // classic: ăn là lớn thêm + mồi mới
    game.score += 10;
    spawnFoods(game);
    return 'eat';
  }

  if (food.label === seq[game.seqIdx]) { // đúng thứ tự
    game.score += 10;
    game.seqIdx++;
    if (game.seqIdx >= seq.length) {
      game.won = true;
      return 'win';
    }
    spawnFoods(game);
    return 'eat';
  }

  // Ăn nhầm: không lớn thêm, ngắn bớt 1 đốt (tối thiểu 2), đảo lại mồi
  game.ateWrong++;
  game.snake.pop();
  if (game.snake.length > 2) game.snake.pop();
  spawnFoods(game);
  return 'wrong';
}
