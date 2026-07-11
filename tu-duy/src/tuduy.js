// Logic 6 trò Luyện Tư Duy — thuần, nhận rng để test tất định.

function shuffle(arr, rng = Math.random) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const pickOne = (arr, rng) => arr[Math.floor(rng() * arr.length)];

/* ===== 1. Mê cung (đục tường kiểu DFS — luôn có đúng 1 đường) ===== */

export const WALL = { N: 1, E: 2, S: 4, W: 8 };
const DIRS = [
  { dx: 0, dy: -1, wall: WALL.N, opp: WALL.S },
  { dx: 1, dy: 0, wall: WALL.E, opp: WALL.W },
  { dx: 0, dy: 1, wall: WALL.S, opp: WALL.N },
  { dx: -1, dy: 0, wall: WALL.W, opp: WALL.E },
];

/** @returns {{cols, rows, walls:Uint8Array}} walls[y*cols+x] = bitmask 4 bức tường */
export function makeMaze(cols, rows, rng = Math.random) {
  const walls = new Uint8Array(cols * rows).fill(15);
  const seen = new Uint8Array(cols * rows);
  const stack = [[0, 0]];
  seen[0] = 1;
  while (stack.length) {
    const [x, y] = stack[stack.length - 1];
    const nexts = DIRS.filter(({ dx, dy }) => {
      const nx = x + dx;
      const ny = y + dy;
      return nx >= 0 && nx < cols && ny >= 0 && ny < rows && !seen[ny * cols + nx];
    });
    if (!nexts.length) {
      stack.pop();
      continue;
    }
    const d = pickOne(nexts, rng);
    const nx = x + d.dx;
    const ny = y + d.dy;
    walls[y * cols + x] &= ~d.wall;
    walls[ny * cols + nx] &= ~d.opp;
    seen[ny * cols + nx] = 1;
    stack.push([nx, ny]);
  }
  return { cols, rows, walls };
}

/** Đi được từ (x,y) theo hướng dir ('N'|'E'|'S'|'W')? */
export function canGo(maze, x, y, dir) {
  return (maze.walls[y * maze.cols + x] & WALL[dir]) === 0;
}

/** BFS kiểm tra tới đích được (dùng cho test). */
export function mazeSolvable(maze) {
  const { cols, rows } = maze;
  const seen = new Uint8Array(cols * rows);
  const queue = [[0, 0]];
  seen[0] = 1;
  while (queue.length) {
    const [x, y] = queue.shift();
    if (x === cols - 1 && y === rows - 1) return true;
    for (const d of DIRS) {
      const nx = x + d.dx;
      const ny = y + d.dy;
      if (nx < 0 || nx >= cols || ny < 0 || ny >= rows || seen[ny * cols + nx]) continue;
      if (maze.walls[y * cols + x] & d.wall) continue;
      seen[ny * cols + nx] = 1;
      queue.push([nx, ny]);
    }
  }
  return false;
}

/* ===== 2. Sudoku bé (4×4 hộp 2×2, 6×6 hộp 2×3) — nghiệm duy nhất ===== */

const BOX = { 4: { h: 2, w: 2 }, 6: { h: 2, w: 3 } };

function boxIndex(size, r, c) {
  const { h, w } = BOX[size];
  return Math.floor(r / h) * (size / w) + Math.floor(c / w);
}

function validAt(grid, size, r, c, v) {
  for (let i = 0; i < size; i++) {
    if (grid[r * size + i] === v || grid[i * size + c] === v) return false;
  }
  const { h, w } = BOX[size];
  const r0 = Math.floor(r / h) * h;
  const c0 = Math.floor(c / w) * w;
  for (let rr = r0; rr < r0 + h; rr++) {
    for (let cc = c0; cc < c0 + w; cc++) {
      if (grid[rr * size + cc] === v) return false;
    }
  }
  return true;
}

/** Đếm số nghiệm (dừng ở limit) — đảm bảo đề có nghiệm duy nhất. */
export function countSolutions(puzzle, size, limit = 2) {
  const grid = puzzle.slice();
  let count = 0;
  const solve = () => {
    if (count >= limit) return;
    const idx = grid.indexOf(0);
    if (idx < 0) { count++; return; }
    const r = Math.floor(idx / size);
    const c = idx % size;
    for (let v = 1; v <= size; v++) {
      if (validAt(grid, size, r, c, v)) {
        grid[idx] = v;
        solve();
        grid[idx] = 0;
      }
    }
  };
  solve();
  return count;
}

/** @returns {{size, solution:number[], puzzle:number[]}} 0 = ô trống */
export function makeSudoku(size, rng = Math.random) {
  const { h, w } = BOX[size];
  // Nghiệm gốc theo công thức, rồi xáo ký hiệu + hàng trong băng + cột trong cụm
  const base = (r, c) => ((r * w + Math.floor(r / h) + c) % size) + 1;
  const symbols = shuffle(Array.from({ length: size }, (_, i) => i + 1), rng);
  const rowOrder = shuffle(Array.from({ length: size / h }, (_, b) => b), rng)
    .flatMap((band) => shuffle(Array.from({ length: h }, (_, i) => band * h + i), rng));
  const colOrder = shuffle(Array.from({ length: size / w }, (_, b) => b), rng)
    .flatMap((stack) => shuffle(Array.from({ length: w }, (_, i) => stack * w + i), rng));
  const solution = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      solution.push(symbols[base(rowOrder[r], colOrder[c]) - 1]);
    }
  }
  // Đục lỗ dần, giữ nghiệm duy nhất
  const holes = size === 4 ? 8 : 16;
  const puzzle = solution.slice();
  let removed = 0;
  for (const idx of shuffle(Array.from({ length: size * size }, (_, i) => i), rng)) {
    if (removed >= holes) break;
    const keep = puzzle[idx];
    puzzle[idx] = 0;
    if (countSolutions(puzzle, size) === 1) removed++;
    else puzzle[idx] = keep;
  }
  return { size, solution, puzzle };
}

/* ===== 3. Tìm điểm khác nhau (2 tranh lưới emoji) ===== */

/**
 * @returns {{n, left:string[], right:string[], diffs:Set<number>}}
 */
export function makeSpotDiff(pool, n = 4, diffCount = 4, rng = Math.random) {
  const cells = n * n;
  const left = Array.from({ length: cells }, () => pickOne(pool, rng));
  const right = left.slice();
  const spots = shuffle(Array.from({ length: cells }, (_, i) => i), rng).slice(0, diffCount);
  for (const idx of spots) {
    let other;
    do { other = pickOne(pool, rng); } while (other === left[idx]);
    right[idx] = other;
  }
  return { n, left, right, diffs: new Set(spots) };
}

/* ===== 4. Nối số thành hình ===== */

function starPoints() {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const angle = (-90 + i * 36) * (Math.PI / 180);
    const radius = i % 2 === 0 ? 45 : 19;
    pts.push([Math.round(50 + Math.cos(angle) * radius), Math.round(52 + Math.sin(angle) * radius)]);
  }
  return pts;
}

export const DOT_SHAPES = [
  { name: 'ngôi nhà', emoji: '🏠', points: [[50, 8], [90, 40], [74, 40], [74, 86], [26, 86], [26, 40], [10, 40]] },
  { name: 'ngôi sao', emoji: '⭐', points: starPoints() },
  {
    name: 'con cá',
    emoji: '🐟',
    points: [[14, 50], [34, 30], [60, 26], [80, 42], [92, 30], [88, 50], [92, 70], [80, 58], [60, 74], [34, 70]],
  },
  {
    name: 'trái tim',
    emoji: '❤️',
    points: [[50, 32], [61, 18], [77, 21], [86, 38], [76, 58], [50, 86], [24, 58], [14, 38], [23, 21], [39, 18]],
  },
  {
    name: 'cây thông',
    emoji: '🎄',
    points: [[50, 6], [70, 32], [60, 32], [80, 58], [68, 58], [88, 84], [12, 84], [32, 58], [20, 58], [40, 32], [30, 32]],
  },
];

/* ===== 5. Cái nào khác nhóm? ===== */

/**
 * @param {{id,vi,en,items:[]}[]} topics - các chủ đề từ hoc-vui
 * @returns {{items:[{...item, topic}], oddIndex, groupTopic, oddTopic}}
 */
export function makeOddOneOut(topics, rng = Math.random) {
  const [groupTopic, oddTopic] = shuffle(topics, rng).slice(0, 2);
  const groupItems = shuffle(groupTopic.items, rng).slice(0, 3)
    .map((it) => ({ ...it, topic: groupTopic }));
  const oddItem = { ...pickOne(oddTopic.items, rng), topic: oddTopic };
  const items = shuffle([...groupItems, oddItem], rng);
  return { items, oddIndex: items.indexOf(oddItem), groupTopic, oddTopic };
}

/* ===== 6. Tháp Hà Nội ===== */

/** @returns {{pegs:number[][], n, moves}} pegs[i] = đáy→đỉnh, số = cỡ bánh */
export function createHanoi(n = 3) {
  return { pegs: [Array.from({ length: n }, (_, i) => n - i), [], []], n, moves: 0 };
}

/** @returns 'ok' | 'empty' | 'bigOnSmall' */
export function moveHanoi(state, from, to) {
  const src = state.pegs[from];
  const dst = state.pegs[to];
  if (!src.length) return 'empty';
  const disc = src[src.length - 1];
  if (dst.length && dst[dst.length - 1] < disc) return 'bigOnSmall';
  dst.push(src.pop());
  if (from !== to) state.moves++;
  return 'ok';
}

export function isHanoiDone(state) {
  return state.pegs[2].length === state.n;
}

export const hanoiOptimal = (n) => 2 ** n - 1;
