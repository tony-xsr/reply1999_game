// Logic Xếp Gạch — thuần, nhận rng để test tất định.
// Bàn 10×16 (thấp hơn chuẩn cho ván ngắn, hợp trẻ em).

export const COLS = 10;
export const ROWS = 16;

// 7 khối tetromino: danh sách ô [x,y] quanh tâm xoay
export const PIECES = {
  I: { cells: [[-1, 0], [0, 0], [1, 0], [2, 0]], color: '#42c5f5' },
  O: { cells: [[0, 0], [1, 0], [0, 1], [1, 1]], color: '#f5c542' },
  T: { cells: [[-1, 0], [0, 0], [1, 0], [0, 1]], color: '#b06af5' },
  S: { cells: [[0, 0], [1, 0], [-1, 1], [0, 1]], color: '#35d435' },
  Z: { cells: [[-1, 0], [0, 0], [0, 1], [1, 1]], color: '#ff5a5a' },
  J: { cells: [[-1, 0], [-1, 1], [0, 1], [1, 1]], color: '#5a7dff' },
  L: { cells: [[1, 0], [-1, 1], [0, 1], [1, 1]], color: '#ff9d3d' },
};

const NAMES = Object.keys(PIECES);

export function randomPiece(rng = Math.random) {
  const name = NAMES[Math.floor(rng() * NAMES.length)];
  return { name, cells: PIECES[name].cells.map((c) => [...c]), color: PIECES[name].color, x: 4, y: 0 };
}

export function createGame(rng = Math.random) {
  return {
    grid: Array.from({ length: ROWS }, () => Array(COLS).fill(null)),
    cur: randomPiece(rng),
    next: randomPiece(rng),
    score: 0,
    lines: 0,
    over: false,
    rng,
  };
}

export function collides(grid, cells, x, y) {
  return cells.some(([cx, cy]) => {
    const gx = x + cx;
    const gy = y + cy;
    return gx < 0 || gx >= COLS || gy >= ROWS || (gy >= 0 && grid[gy][gx]);
  });
}

export function move(game, dx) {
  if (game.over) return false;
  const { cur } = game;
  if (collides(game.grid, cur.cells, cur.x + dx, cur.y)) return false;
  cur.x += dx;
  return true;
}

/** Xoay 90° (khối O đứng yên); kẹt tường thì thử né sang 1 ô. */
export function rotate(game) {
  if (game.over) return false;
  const { cur } = game;
  if (cur.name === 'O') return true;
  const rotated = cur.cells.map(([x, y]) => [-y, x]);
  for (const kick of [0, -1, 1, -2, 2]) {
    if (!collides(game.grid, rotated, cur.x + kick, cur.y)) {
      cur.cells = rotated;
      cur.x += kick;
      return true;
    }
  }
  return false;
}

/** Rơi 1 nhịp. @returns 'move' | {locked:true, cleared:n} | 'over' */
export function tick(game) {
  if (game.over) return 'over';
  const { cur } = game;
  if (!collides(game.grid, cur.cells, cur.x, cur.y + 1)) {
    cur.y++;
    return 'move';
  }
  // Chạm đáy: khóa khối vào bàn
  for (const [cx, cy] of cur.cells) {
    const gy = cur.y + cy;
    if (gy < 0) { game.over = true; return 'over'; }
    game.grid[gy][cur.x + cx] = cur.color;
  }
  const cleared = clearLines(game);
  game.score += 10 + [0, 100, 250, 500, 800][cleared];
  game.lines += cleared;
  game.cur = game.next;
  game.next = randomPiece(game.rng);
  if (collides(game.grid, game.cur.cells, game.cur.x, game.cur.y)) {
    game.over = true;
    return 'over';
  }
  return { locked: true, cleared };
}

function clearLines(game) {
  const kept = game.grid.filter((row) => row.some((c) => !c));
  const cleared = ROWS - kept.length;
  while (kept.length < ROWS) kept.unshift(Array(COLS).fill(null));
  game.grid = kept;
  return cleared;
}

/** Thả nhanh xuống đáy. */
export function hardDrop(game) {
  let r = tick(game);
  while (r === 'move') r = tick(game);
  return r;
}
